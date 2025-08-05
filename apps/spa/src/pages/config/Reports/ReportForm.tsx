import { useState, useEffect } from "react";
import { t } from "ttag";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import PAutocomplete from "@src/components/input/PAutocomplete";
import PI18n from "@src/components/input/PI18n";
import PSelect from "@src/components/input/PSelect";

import { useAppSelector } from "@src/app/redux/store";
import type { FormComponentProps } from "@src/components/types";

export default function ReportForm({data, objects, errors}:FormComponentProps) {
  const reportDisplayTypes = useAppSelector((state) => state.constants.reportDisplayTypes);
  const [isDash, setIsDash] = useState<boolean>(false);
  useEffect(() => {
    setIsDash("Dashboard" === data?.display_type);
  }, [data]);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <PI18n
          required
          fullWidth
          name="label"
          label={t`Label`}
          data={data}
          defaultValue={data?.label_i18n}
          helperText={errors?.label}
          error={!!errors?.label}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PAutocomplete
          fullWidth multiple
          name="tags"
          label={t`Tags`}
          api="/report/report-tags/"
          defaultValue={data?.tags}
          helperText={errors?.tags}
          error={!!errors?.tags}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          required
          name="display_type"
          label={t`Report Display Type`}
          defaultValue={data?.display_type}
          helperText={errors?.display_type}
          error={!!errors?.display_type}
          onChange={(selected) => setIsDash("Dashboard" === selected)}
        >
          {reportDisplayTypes?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required
          type="number"
          name="display_index"
          label={t`Index`}
          defaultValue={data?.display_index}
          helperText={errors?.display_index}
          error={!!errors?.display_index}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          required={isDash}
          name="display_height"
          label={t`Display Height`}
          defaultValue={data?.display_height}
          helperText={errors?.display_height}
          error={!!errors?.display_index}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          multiline rows={5}
          name="params"
          label={t`Params`}
          defaultValue={JSON.stringify(data?.params || {}, undefined, 4)}
          helperText={errors?.params}
          error={!!errors?.params}
        />
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth
          multiline rows={5}
          name="brief"
          label={t`Brief`}
          data={data}
          defaultValue={data?.brief_i18n}
          helperText={errors?.brief}
          error={!!errors?.brief}
        />
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth
          multiline rows={5}
          name="description"
          label={t`Description`}
          data={data}
          defaultValue={data?.description_i18n}
          helperText={errors?.description}
          error={!!errors?.description}
        />
      </Grid>
    </Grid>
  );
}
