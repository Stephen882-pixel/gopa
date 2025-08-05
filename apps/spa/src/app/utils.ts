import ReactDOM from "react-dom/client";
import swal from "sweetalert";
import { alpha } from "@mui/material/styles";
import { t } from "ttag";

export const LOGIN_STORE_CONST = "__login_redirect";

export function onApiError(err: any, errorMessage?: string) {
  if ("ERR_CANCELED" === err?.code && "CanceledError" === err?.name) {
    return Promise.resolve();
  }
  errorMessage = errorMessage || t`An error occurred while processing your request. Please try again later.`;
  return cSwal({
    icon: "error",
    title: t`Error`,
    text: err?.response?.data?.detail || err?.response?.data?.error || err?.response?.detail || errorMessage,
  });
}

export function onApiSuccess() {
  return cSwal({
    icon: "success",
    title: t`Success`,
    text: t`Your details were successfully saved`,
  });
}

// Use these to make api requests using the cSwal utility
export function onApi(apiCall: () => Promise<any>, question: string, success?: string, icon?: string) {
  return new Promise((resovle, reject) => {
    cSwal
      .getDialog(question, icon)
      .then(value => {
        if ( null === value ) {
          throw value;
        }
        return apiCall();
      })
      .then(() => {
        return cSwal({
          icon: "success",
          text: success || t`Your request was successfully processed.`
        });
      })
      .then(() => resovle(null))
      .catch(err => {
        if ( err ) {
          onApiError(err).then(() => reject(err));
        }
        else {
          cSwal.close();
        }
      })
  });
}

// Use this to get the hover background color for a button
export function getHoverBg(theme: any, isDark?: boolean) {
  isDark = isDark || "dark" === theme.palette.mode;
  return alpha(theme.palette.common[isDark ? "white" : "black"], isDark ? 0.15 : 0.07);
}

// https://stackoverflow.com/a/1349426/3003786
export function makeId(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let result = "";
  let counter = 0;

  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }

  return result;
}

// https://stackoverflow.com/a/196991
export function toTitleCase(str: string) {
  return String(str || "").trim().replace(
    /\w\S*/g,
    text => text.charAt(0).toUpperCase() + text.substring(1).toLowerCase()
  );
}

// Use this to slugify a given string
// https://github.com/Code-Parth/Typescript-Slugify/blob/master/index.ts
export function slugify(txt: string) {
  return txt
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Use this to encode the specified object that it may be passed on to a url
export function urlEncode(data: any) {
  // The urlencoded data parser (https://stackoverflow.com/a/37562814)
  const _clean = (k: string, v: any) => {
    if ( null === v || undefined === v ) {
      v = "";
    }
    return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
  };

  let body = new Array();
  Object.keys(data)
    .filter(key => String(data[key] || "").trim())
    .forEach(key => body.push(_clean(key, data[key])));
  return 0 === body.length ? "" : `?${body.join("&")}`;
}

// Use this to render the specified component. For optimal results, use this to
// render components that are essentially static in nature, that do not change
// depending on the user interraction or ajax updates
export function getDOM(component: any) {
  return new Promise((resolve) => {
    const wrapper = document.createElement("div") as HTMLElement;
    const observer = new MutationObserver(() => resolve(wrapper));
    observer.observe(wrapper, { childList: true });
    ReactDOM.createRoot(wrapper).render(component);
  });
}

// Called when one would like to render a swal popup using a React Component
export function cSwal({ content, buttons, ...props } : { [key: string]: any }) {
  const rest = {
    ...props,
    buttons: buttons || { ok: { text: t`Ok`, value: "confirm" } },
  };
  if ( "object" !== typeof content ) {
    return swal(rest);
  }
  return getDOM(content).then(
    (wrapper: any) => swal({
      ...rest,
      content: { element: wrapper as HTMLElement }
    })
  );
}

cSwal.close = () => { swal.stopLoading?.(); swal.close?.(); };
cSwal.getDialog = (text: string, icon?: string) => swal({
  text, icon: icon || "info",
  buttons: {
    noel: { text: t`Cancel`, value: null, className: "swal-button--cancel" },
    ok: { text: t`Ok`, value: "confirm", closeModal: false },
  },
});
