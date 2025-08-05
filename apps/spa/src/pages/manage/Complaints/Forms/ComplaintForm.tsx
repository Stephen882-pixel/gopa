import { t } from "ttag";
import { differenceInDays } from "date-fns";

import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PAutocomplete from "@src/components/input/PAutocomplete";
import PSelect from "@src/components/input/PSelect";
import PUpload from "@src/components/input/Upload/PUpload";
import SectorSelector from "@src/components/SectorSelector";

import { useAppSelector } from "@src/app/redux/store";
import { asDate } from "@src/app/hooks/locale";

import type { PObjectProps, FormComponentProps } from "@src/components/types";

export function getDuration(data: undefined | null | PObjectProps) {
  return differenceInDays(
    asDate(data?.date_resolved || new Date()) as Date,
    asDate(data?.date_of_occurrence) as Date
  );
}

export default function ComplaintForm({data, objects, errors, setContent}:FormComponentProps) {
  const constants = useAppSelector((state) => state.constants);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          readOnly
          label={t`Date Resolved`}
          defaultValue={asDate(data?.date_resolved)}
          slotProps={{
            textField: {
              fullWidth: true,
              error: !!errors?.date_resolved,
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          readOnly
          fullWidth
          label={t`Status`}
          defaultValue={data?.status}
        >
          {constants.complaintStatus?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label={t`Duration`}
          value={getDuration(data)}
          slotProps={{ input: { readOnly: true } }}
        />
      </Grid>
      {!!objects?.readOnly && (
        <Grid size={6} display={{ xs: "none", md: "flex" }} />
      )}
      {!objects?.readOnly && data?.user?.display_name && (
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label={t`Applicant`}
            defaultValue={data?.user?.display_name}
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
      )}
      {data?.restriction?.id && (
        <Grid size={12}>
          <TextField
            fullWidth multiline
            label={t`Restriction`}
            value={data?.restriction?.type_of_measure}
            slotProps={{ input: { readOnly: true } }}
          />
        </Grid>
      )}
      <Grid size={{ xs: 12, md: 6 }}>
        <DatePicker
          readOnly
          name="date_of_occurrence"
          label={t`Date Of Occurrence`}
          defaultValue={asDate(data?.date_of_occurrence)}
          slotProps={{
            textField: {
              fullWidth: true,
              helperText: errors?.date_of_occurrence,
              error: !!errors?.date_of_occurrence,
            }
          }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectorSelector
          fullWidth readOnly
          mode="input"
          name="sector"
          label={t`Sector`}
          defaultValue={data?.sector?.id}
          helperText={errors?.sector}
          error={!!errors?.sector}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth readOnly
          name="origin_country"
          label={t`Country Of Origin`}
          defaultValue={data?.origin_country?.iso}
          helperText={errors?.origin_country}
          error={!!errors?.origin_country}
        >
          {constants.countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth readOnly
          name="target_country"
          label={t`Country Of Occurrence`}
          defaultValue={data?.target_country?.iso}
          helperText={errors?.target_country}
          error={!!errors?.target_country}
        >
          {constants.countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth readOnly
          name="restriction_type"
          label={t`Type Of Restriction`}
          defaultValue={data?.restriction_type}
          helperText={errors?.restriction_type}
          error={!!errors?.restriction_type}
        >
          {constants.complaintTypes?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PAutocomplete
          fullWidth readOnly
          name="policy"
          label={t`Policy`}
          api="/pages/policies/"
          defaultValue={data?.policy?.id}
          helperText={errors?.policy}
          error={!!errors?.policy}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth multiple readOnly
          name="mode_of_supply_affected"
          label={t`Mode Of Restriction`}
          defaultValue={data?.mode_of_supply_affected}
          helperText={errors?.mode_of_supply_affected}
          error={!!errors?.mode_of_supply_affected}
        >
          {constants.modeOfSupply?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="agency"
          label={t`Agency`}
          defaultValue={data?.agency}
          helperText={errors?.agency}
          error={!!errors?.agency}
          slotProps={{ input: { readOnly: true } }}
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth multiline rows={5}
          name="description"
          label={t`Description`}
          defaultValue={data?.description}
          helperText={errors?.description}
          error={!!errors?.description}
          slotProps={{ input: { readOnly: true } }}
        />
      </Grid>
      <Grid size={12}>
        <PUpload
          multiple
          readOnly={!!objects?.readOnly}
          name="documents"
          label={t`Documents`}
          defaultValue={data?.documents}
          helperText={errors?.documents}
          error={!!errors?.documents}
          onChange={(files: File[]) => setContent?.("documents", files)}
        />
      </Grid>
    </Grid>
  );
}
