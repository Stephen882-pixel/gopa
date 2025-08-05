import { t } from "ttag";

import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import type { FormComponentProps } from "@src/components/types";

export default function CommitmentForm({data, objects, errors}:FormComponentProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <TextField
          fullWidth required
          name="label"
          label={t`Label`}
          defaultValue={data?.label}
          helperText={errors?.label}
          error={!!errors?.label}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          multiline rows={5}
          name="description"
          label={t`Description`}
          defaultValue={data?.description}
          helperText={errors?.description}
          error={!!errors?.description}
        />
      </Grid>
    </Grid>
  );
}
