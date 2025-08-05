import { t } from "ttag";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import PSelect from "@src/components/input/PSelect";
import { useAppSelector } from "@src/app/redux/store";

import type { FormComponentProps } from "@src/components/types";

export default function CommitmentForm({data, objects, errors}:FormComponentProps) {
  const countries = useAppSelector((state) => state.constants.countries);
  const sectors = (useAppSelector((state) => state.cache.sectorList) as any[])
    .filter((c) => c.parent === null)
    .map((c) => ({
      slug: c.id,
      label: c.label,
    }));
  return (
    <Grid container spacing={2}>
      <input type="hidden" name="commitment" value={objects?.index} />
      {errors?.non_field_errors && (
        <Grid size={{ xs: 12, sm: 8 }} offset={{ sm: 2 }}>
          <Alert severity={errors?.is_staff ? "error" : "info"}>
            <AlertTitle>{t`Please Note!`}</AlertTitle>
            {t`Make sure that the country and sector fields make a unique set or edit the existing record.`}
          </Alert>
        </Grid>
      )}
      <Grid size={{ xs: 12, sm: 6 }}>
        <PSelect
          fullWidth required
          name="country"
          label={t`Country`}
          defaultValue={data?.country?.iso}
          helperText={errors?.country}
          error={!!errors?.country}
        >
          {countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <PSelect
          fullWidth required
          name="sector"
          label={t`Sector`}
          defaultValue={data?.sector?.id}
          helperText={errors?.sector}
          error={!!errors?.sector}
        >
          {sectors?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth required
          type="number"
          name="value"
          label={t`Number Of Commitments`}
          defaultValue={data?.value}
          helperText={errors?.value}
          error={!!errors?.value}
        />
      </Grid>
    </Grid>
  );
}
