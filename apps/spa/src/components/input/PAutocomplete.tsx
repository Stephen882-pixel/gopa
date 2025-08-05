import * as React from "react";

import debounce from "lodash/debounce";
import Autocomplete from "@mui/material/Autocomplete";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import parse from "autosuggest-highlight/parse";
import match from "autosuggest-highlight/match";

import { onApiError } from "@src/app/utils";
import { useFetch } from "@src/app/hooks";
import type { PAutocompleteProps } from "@src/components/types";

interface HighlightProps {
  label: string;
  search: string;
}

export function Highlight({label, search} : HighlightProps) {
  const matches = match(label, search, { insideWords: true });

  return parse(label, matches).map(
    (part, index) => {
      const words = part.text.split(" ");
      return (
        <span
          key={index}
          style={{
            fontWeight: part.highlight ? 700 : 400,
            textDecoration: part.highlight ? "underline" : "none",
          }}
        >
          {words.map((s, k) => (
            <React.Fragment key={k}>
              {s}
              {k < words.length - 1 && <>&nbsp;</>}
            </React.Fragment>
          ))}
        </span>
      );
    }
  );
}

interface Val {
  id: string | number;
  label: string;
}

export default function PAutocomplete({
  name,
  label,
  error,
  disabled,
  readOnly,
  helperText,
  fullWidth,
  defaultValue,
  onChange,
  api,
  serialise,
  multiple,
} : PAutocompleteProps) {

  const [_value, setValue] = React.useState<Val[]>([]);
  const [options, setOptions] = React.useState<Array<any>>([]);

  const [{}, apiCall] = useFetch({
    ...("object" === typeof api && api),
    ...("string" === typeof api && {url: api})
  });

  const onSearch = (search: string) => new Promise((resolve, reject) => {
    apiCall({ params: { search } })
      .then((res: any) => {
        if ( serialise ) {
          resolve(res?.results?.map(serialise));
        }
        else {
          resolve(res?.results?.map((r: any) => ({id: r?.id, label: r?.label_i18n || r?.label})));
        }
      })
    .catch(onApiError)
  });

  const onDebounce = debounce(
    (search: string) => onSearch(search).then((res: any) => setOptions(res)),
    500
  );

  React.useEffect(() => {
    if ( !defaultValue ) {
      onSearch("").then((res: any) => setOptions(res));
    }
  }, []);

  React.useEffect(() => {
    if ( Array.isArray(defaultValue) ) {
      onSearch("").then((res: any) => {
        const added = defaultValue.filter((v: any) => {
          return 0 === res.filter((w: any) => w?.id === v?.id).length;
        });
        setOptions([...added, ...res]);
        setValue(defaultValue);
      });
    }
    else {
      const opts = {
        ...("object" === typeof api && api),
        ...("string" === typeof api && {url: api})
      };
      if ( !String(defaultValue || "").trim() ) {
        return;
      }
      apiCall({ url: `${opts.url}${defaultValue}/` }).then((res: any) => {
        const val = serialise ? serialise(res) : {id: res?.id, label: res?.label};
        setOptions([val]);
        setValue([val]);
      });
    }
  }, [defaultValue]);

  return (
    <>
      {_value.map((v: Val, i) => <input key={i} type="hidden" name={name} value={v?.id} />)}
      <Autocomplete
        multiple={!!multiple}
        disabled={!!disabled}
        readOnly={!!readOnly}
        fullWidth={!!fullWidth}
        value={!!multiple ? _value : (_value[0] || "")}
        options={options}
        autoComplete
        includeInputInList
        filterSelectedOptions
        onInputChange={(event: React.SyntheticEvent, value: string) => {
          const selected = options.filter((r: any) => value === r.label);
          if ( 0 === selected.length ) {
            onDebounce(value);
          }
        }}
        onChange={(event: React.SyntheticEvent, value: any) => {
          setValue(!!multiple ? value : [value]);
          onChange?.(!!multiple ? value : value[0])
        }}
        renderInput={(params: any) => <TextField {...params} label={label} error={!!error} />}
        getOptionLabel={(option: any) => option?.label || ""}
        renderOption={(props, option, { inputValue }) => {
          const { key, ...optionProps } = props;
          if ( "" === key ) {
            console.log(`Use the serialise option to properly setup the ${name} component`);
            console.log(option);
            return (<></>);
          }
          return (
            <li key={key} {...optionProps}>
              <Highlight label={option?.label} search={inputValue} />
            </li>
          );
        }}
      />
      {!!helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
    </>
  );
}
