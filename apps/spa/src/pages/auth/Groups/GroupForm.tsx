import * as React from "react";
import { t } from "ttag";

import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";

import { useAppSelector } from "@src/app/redux/store";
import type { FormComponentProps } from "@src/components/types";


interface ItemProps {
  id: number;
  name: string;
}

interface PermissionProps {
  name: string;
  label: string;
  values: any[];
  items: ItemProps[];
}

function Permission({name, label, values, items}:PermissionProps) {
  const [checked, setChecked] = React.useState<boolean[]>(
    items.map((item) => 0 <= values.indexOf(item.id))
  );
  const selectedCount = () => checked.reduce(
    (acc, current) => acc + (true === current ? 1 : 0),
    0,
  );
  const isIndeterminate = () => {
    const c = selectedCount();
    return 0 < c && c < checked.length;
  };

  return (
    <>
      <FormControlLabel
        label={label}
        control={
          <Checkbox
            checked={checked.length === selectedCount()}
            indeterminate={isIndeterminate()}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setChecked(items.map(() => event.target.checked));
            }}
          />
        }
      />
      <Box sx={{ display: "flex", flexDirection: "column", ml: 3 }}>
        {items.map((item, index) => (
          <FormControlLabel
            key={index}
            label={item.name}
            control={
              <Checkbox
                name={name}
                value={item.id}
                checked={checked[index]}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setChecked(checked.map((c, i) => i === index ? event.target.checked : c));
                }}
              />
            }
          />
        ))}
      </Box>
    </>
  );
}

export default function GroupForm({data, objects, errors}:FormComponentProps) {
  const cache = useAppSelector((state) => state.cache.permissionMap);
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth
          name="name"
          label={t`Label`}
          defaultValue={data?.name}
          helperText={errors?.name}
          error={!!errors?.name}
        />
      </Grid>
      {Object.keys(cache).map((key, i) => (
        <Grid key={i} size={6}>
          <Permission
            name="permissions"
            values={data?.permissions || []}
            label={key}
            items={cache[key]}
          />
        </Grid>
      ))}
    </Grid>
  );
}
