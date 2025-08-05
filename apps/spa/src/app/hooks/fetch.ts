import * as React from "react";
import { jwtDecode } from "jwt-decode";
import { t } from "ttag";

import { useAppSelector, useAppDispatch } from "@src/app/redux/store";
import { initAuth } from "@src/app/redux/slice/auth";
import { urlEncode } from "@src/app/utils";
import type { PObjectProps, APIProps } from "@src/components/types";

interface FetchDefaultProps extends APIProps {
  data?: FormData | PObjectProps;
}

export default function useFetch(initial?: FetchDefaultProps) {
  const [data, setData] = React.useState<PObjectProps | any>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const auth = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  function refreshToken(headers: any) {
    const opts: PObjectProps = {
      method: "GET",
      credentials: "same-origin",
      headers,
    }
    return fetch("/api/cache/token/", opts).then(response => {
      return response.json().then(content => {
        dispatch(initAuth(content));
        return content;
      })
    });
  }

  function checkToken(headers: any) {
    return Promise.resolve().then(() => {
      if ( !String(auth.token || "").trim() ) {
        return null;
      }
      const exp = jwtDecode(auth.token || "")?.exp || 0;
      const now = Math.floor(Date.now() / 1000);
      if ( 10 < exp - now ) {
        return auth.token;
      }
      return refreshToken(headers).then(
        (content: any) => null === content?.user ? "expired" : content?.token
      );
    });
  }

  function getReject(response: any, content: any) {
    Object.assign(response, { data: content });
    return Promise.reject({
      icon: "error",
      title: t`API Error`,
      text: t`An error occurred while fetching your request. Please try again later.`,
      response,
    });
  }

  function apiCall(args?: FetchDefaultProps){
    const body = args?.data || initial?.data;
    let options: PObjectProps = {
      method: (args?.method || initial?.method || "get").toUpperCase(),
      credentials: "same-origin",
      headers: { "X-Requested-With": "XMLHttpRequest" }
    };

    if ( auth.csrf ) {
      options.headers["X-CSRFToken"] = auth.csrf;
    }

    if ( "GET" === options.method && body instanceof FormData ) {
      console.warn("Did you want to post the form data supplied?");
      console.warn({...options, body});
    }

    function getApiUrl() {
      const path = (args?.url || initial?.url || "").replaceAll("//", "/").split("?")[0];
      return "/api/" + path.substring(path.startsWith("/") ? 1 : 0) + urlEncode({
        ...(initial?.params || {}),
        ...(args?.params || {})
      });
    }

    setLoading(true);
    if ( "GET" !== options.method && body ) {
      if ( body instanceof FormData ) {
        options.body = body;
      }
      else {
        options.body = JSON.stringify(body);
        options.headers["Content-Type"] = "application/json";
      }
    }

    return checkToken(options.headers).then((token: any) => {
      if ( "expired" === token ) {
        return Promise.resolve();
      }
      if ( token ) {
        options.headers.Authorization = "Bearer " + token;
      }
      return fetch(getApiUrl(), options).then(response => {
        let disposition = response.headers.get("content-disposition") || false,
            isJson = (response.headers.get("content-type") || "").includes("application/json"),
            deferred = disposition ? response.blob() : (isJson ? response.json() : response.text());
        return deferred.then(content => {
          setLoading(false);
          if ( !disposition ) {
            setData(content);
          }
          if ( response.ok ) {
            return content;
          }

          if ( 403 !== response.status ) {
            return getReject(response, content);
          }
          return refreshToken(options.headers).then((res: any) => {
            const detail = !Array.isArray(res?.user?.permissions)
              ? t`Your session has expired. Please log into the portal.`
              : t`You do not have access to the specified resource.`;
            return getReject(response, { detail })
          });
        });
      });
    });
  }

  return [{data, loading}, apiCall] as const;
}
