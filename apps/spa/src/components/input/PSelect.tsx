import * as React from "react";
import InputLabel from "@mui/material/InputLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { makeId } from "@src/app/utils";
import type { PSelectProps } from "@src/components/types";

export default function PSelect({
  name,
  label,
  error,
  disabled,
  required,
  readOnly,
  helperText,
  fullWidth,
  defaultValue,
  onChange,
  children,
  multiple,
} : PSelectProps) {

  const getValue = (val: any) => "string" === typeof val ? val.split(",") : val;
  const [value, setValue] = React.useState<string[]>([]);
  const id = makeId(12);

  React.useEffect(() => {
    setValue(getValue(defaultValue || ""));
  }, [defaultValue]);

  return (
    <FormControl fullWidth={!!fullWidth} error={!!error}>
      {label && <InputLabel id={id}>{label} {required ? "*" : ""}</InputLabel>}
      {!!multiple && (
        <Select
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          multiple
          labelId={id}
          label={label}
          name={name}
          value={value}
          onChange={(event: SelectChangeEvent<typeof value>) => {
            const val = getValue(event.target.value);
            setValue(val);
            onChange?.(val);
          }}
        >
          {children}
        </Select>
      )}
      {!multiple && (
        <Select
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          defaultValue={defaultValue || ""}
          labelId={id}
          label={label}
          name={name}
          onChange={(event: SelectChangeEvent) => onChange?.(event.target.value as string)}
        >
          {children}
        </Select>
      )}
      {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
}
