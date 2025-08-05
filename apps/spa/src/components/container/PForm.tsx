import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";
import { onApiSuccess, onApiError } from "@src/app/utils";
import type { PFormContentType, PFormProps, PObjectProps } from "@src/components/types";

interface PFormHook {
  onSubmit: (data: PObjectProps | FormData) => Promise<any>;
  onSubmitSuccess?: (row: any) => void;
  onSubmitError?: (row: any) => void;
  contentType?: PFormContentType;
}

export function usePForm({onSubmit, onSubmitSuccess, onSubmitError, contentType} : PFormHook) {
  const [errors, setErrors] = React.useState<PObjectProps>({});
  const [_content, _setContent] = React.useState<PObjectProps>({});

  const getJsonPost = (form: HTMLFormElement): PObjectProps => {
    const object: PObjectProps = {};
    // https://stackoverflow.com/a/46774073/3003786
    (new FormData(form)).forEach((value, key) => {
      // Reflect.has in favor of: object.hasOwnProperty(key)
      if ( !Reflect.has(object, key) ) {
        object[key] = value;
        return;
      }
      if ( !Array.isArray(object[key]) ) {
        object[key] = [object[key]];
      }
      object[key].push(value);
    });
    return {...object, ..._content};
  };

  const getFormPost = (form: HTMLFormElement): FormData => {
    const body = new FormData(form);
    for (let [key, value] of Object.entries(_content)) {
      if (Array.isArray(value)) {
        value.forEach((f: any, i: number) => body.append(key, f));
      } else {
        body.append(key, value);
      }
    }
    return body;
  };

  const getData = (form: HTMLFormElement): PObjectProps | FormData =>
    "json" === contentType ? getJsonPost(form) : getFormPost(form);

  const onReset = (form?: HTMLFormElement) => {
    _setContent({});
    setErrors({});
    form?.reset();

    // https://blog.logrocket.com/using-custom-events-react/
    // https://stackoverflow.com/a/35659572
    const onReset = new CustomEvent("onReset", { bubbles: false });
    form?.querySelectorAll("input").forEach((element) => element.dispatchEvent(onReset));
  };

  const onSuccess = (res: any, form: HTMLFormElement) => {
    onReset(form);
    if (onSubmitSuccess) {
      onSubmitSuccess(res);
    }
    else {
      onApiSuccess();
    }
  };

  const onError = (res: any) => {
    const hasErrors =
      "application/json" === res.response.headers.get("content-type") &&
      400 === res.response.status;

    if (!hasErrors) {
      onApiError(res).then(() => onSubmitError?.(res));
    }
    else {
      let out: PObjectProps = {};
      for (let [key, value] of Object.entries(res.response.data)) {
        if (Array.isArray(value)) {
          out[key] = value.join(" ");
        } else if (typeof value === "object") {
          out[key] = value;
        } else {
          out[key] = String(value || "").trim();
        }
      }
      setErrors(out);
      onApiError(res, t`Please attend to the errors highlighted on the form.`).then(() => onSubmitError?.(res));
    }
  };

  return {
    errors,
    setContent: (name: string, content: Array<any> | any) => {
      if ( undefined === content ) {
        let out: PObjectProps = {};
        for (let [key, value] of Object.entries(content)) {
          if (name === key) {
            continue;
          }
          out[key] = value;
        }
        _setContent({...out});
      }
      else {
        _setContent({ ...content, [name]: content });
      }
    },
    onReset: () => onReset(),
    onSubmit: (form: HTMLFormElement) => onSubmit(getData(form)).then((res: any) => onSuccess(res, form)).catch(onError),
  } as const;
}

interface DivProps {
  flexDirection?: "column-reverse" | "column";
}
const Div = styled("form", {
  shouldForwardProp: prop => "flexDirection" !== prop,
})<DivProps>(({ theme, flexDirection }) => ({
  ...(flexDirection && {
    display: "flex",
    flexDirection,
    flexGrow: 1,
  }),
}));

export default function PForm({ children, flexDirection, onValidate, onSubmit } : PFormProps) {
  return (
    <Div
      flexDirection={flexDirection}
      onSubmit={(event) => {
        event.stopPropagation();
        event.preventDefault();
        const form = event.target as HTMLFormElement;

        if ( !form.checkValidity() || !(onValidate ? onValidate() : true)) {
          return false;
        }

        onSubmit?.(form);
        return false;
      }}
    >
      {children}
    </Div>
  );
}
