import * as React from "react";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

import type { PCheckboxProps } from "@src/components/types";

export default function PCheckbox({
  name,
  label,
  error,
  disabled,
  required,
  readOnly,
  helperText,
  selected,
  onSelect,
} : PCheckboxProps) {
  const [checked, setChecked] = React.useState<boolean>(!!selected);
  const handleChange = (event: React.SyntheticEvent) => {
    if ( readOnly || disabled ) {
      return;
    }
    const input = (event.target as HTMLInputElement).checked;
    onSelect?.(input);
    setChecked(input);
  };

  React.useEffect(() => setChecked(!!selected), [selected]);

  return (
    <>
      <FormControlLabel
        label={label}
        disabled={readOnly || disabled}
        onChange={handleChange}
        control={
          <Checkbox
            disabled={!!disabled}
            required={!!required}
            readOnly={!!readOnly}
            name={name}
            checked={checked}
            onChange={handleChange}
          />
        }
      />
      {!!helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
    </>
  );
}
