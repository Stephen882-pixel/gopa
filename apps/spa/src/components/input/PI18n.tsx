import * as React from "react";
import { t } from "ttag";

import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import OutlinedInput from "@mui/material/OutlinedInput";
import TranslateSharp from "@mui/icons-material/TranslateSharp";

import { ToolMenuItem } from "@src/components/layout/filter/TableFilter";
import Menu, { useMenuHook } from "@src/components/layout/menu/Menu";
import { makeId } from "@src/app/utils";
import { useLocale, usePermissions } from "@src/app/hooks";

import type { PObjectProps, PI18nProps } from "@src/components/types";

export default function PI18n({
  name = "",
  label,
  error,
  disabled,
  required,
  readOnly,
  helperText,
  fullWidth,
  data,
  defaultValue,
  defaultLocale = "en",
  rows,
  multiline,
  onChange,
} : PI18nProps) {

  const { anchorEl, handleOpen, handleClose } = useMenuHook();
  const { profile } = usePermissions();
  const { locales } = useLocale();
  const oId = makeId(12);

  const [lang, setLang] = React.useState<string>(profile?.locale || defaultLocale);
  const [vals, setVals] = React.useState<PObjectProps>({});

  const initVals = (_data?: null | PObjectProps, _defaultValue?: string) => {
    const _vals : PObjectProps = {};

    for ( const locale of locales ) {
      const k = `${name}_${locale.iso}`;
      _vals[k] = _data?.[k] || "";
    }
    vals[`${name}_${defaultLocale}`] = _defaultValue || "";

    setVals(_vals);
  };

  React.useEffect(() => {
    initVals(data, defaultValue);
  }, [data, defaultValue]);

  const ref = React.useRef<null | HTMLInputElement>(null);
  React.useEffect(() => {
    // https://blog.logrocket.com/using-custom-events-react/
    // https://stackoverflow.com/a/35659572
    ref?.current?.addEventListener("onReset", () => setLang(profile?.locale || defaultLocale));
  }, []);

  return (
    <FormControl fullWidth={!!fullWidth} error={!!error} variant="outlined">
      <input
        type="hidden"
        name={name}
        value={vals[`${name}_${defaultLocale}`]}
        ref={ref}
      />
      {locales.map((locale, index) => {
        const k = `${name}_${locale.iso}`;
        return <input key={index} type="hidden" name={k} value={vals[k]} />
      })}

      <InputLabel htmlFor={oId} id={makeId(12)}>{label} {required ? "*" : ""}</InputLabel>
      <OutlinedInput
        label={label}
        error={error}
        disabled={disabled}
        required={required}
        readOnly={readOnly}
        fullWidth={fullWidth}
        value={vals[`${name}_${lang}`] || ""}
        rows={rows}
        multiline={multiline}
        sx={{
          ...(multiline && {
            alignItems: "start",
          }),
        }}
        onChange={(e) => {
          const value = e.target.value as string;
          setVals({...vals, [`${name}_${lang}`]: value});
          onChange?.(value, lang);
        }}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label={t`Choose a locale`}
              onClick={handleOpen}
              edge="end"
              sx={{
                position: "relative",
                "span": {
                  position: "absolute",
                  left: 0, bottom: 0,
                  fontSize: "0.75rem",
                }
              }}
            >
              <TranslateSharp />
              <span>{lang.toUpperCase()}</span>
            </IconButton>
          </InputAdornment>
        }
      />
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {locales.map(
          (locale, index) => (
            <ToolMenuItem
              key={index}
              check={lang === locale.iso}
              label={locale.label}
              onClick={() => {
                setLang(locale.iso);
                handleClose();
              }}
            />
          )
        )}
      </Menu>
    </FormControl>
  );
}
