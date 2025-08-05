import { t } from "ttag";

import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";

import PI18n from "@src/components/input/PI18n";
import PAutocomplete from "@src/components/input/PAutocomplete";
import PSelect from "@src/components/input/PSelect";

import { useAppSelector } from "@src/app/redux/store";
import SectorSelector from "@src/components/SectorSelector";
import type { FormComponentProps } from "@src/components/types";

export default function RestrictionForm({data, objects, errors}:FormComponentProps) {
  const constants = useAppSelector((state) => state.constants);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectorSelector
          fullWidth
          mode="input"
          name="sector"
          label={t`Sector`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.sector?.id}
          helperText={errors?.sector}
          error={!!errors?.sector}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth required
          name="country"
          label={t`Country`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.country?.iso}
          helperText={errors?.country}
          error={!!errors?.country}
        >
          {constants.countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth
          multiline rows={5}
          readOnly={!!objects?.readOnly}
          name="text_of_measure"
          label={t`Description Of Measure`}
          data={data}
          defaultValue={data?.text_of_measure_i18n}
          helperText={errors?.text_of_measure}
          error={!!errors?.text_of_measure}
        />
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth
          multiline rows={5}
          readOnly={!!objects?.readOnly}
          name="type_of_measure"
          label={t`Brief`}
          data={data}
          defaultValue={data?.type_of_measure_i18n}
          helperText={errors?.type_of_measure}
          error={!!errors?.type_of_measure}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          name="type_of_measure_code"
          label={t`Type Of Measure`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.type_of_measure_code}
          helperText={errors?.type_of_measure_code}
          error={!!errors?.type_of_measure_code}
        >
          {constants.typeOfMeasureList?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          name="restriction_type"
          label={t`Type Of Restriction`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.restriction_type}
          helperText={errors?.restriction_type}
          error={!!errors?.restriction_type}
        >
          {constants.restrictionTypes?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PAutocomplete
          fullWidth
          name="policy"
          label={t`Policy`}
          api="/restrictions/policies/"
          readOnly={!!objects?.readOnly}
          defaultValue={data?.policy?.id}
          helperText={errors?.policy}
          error={!!errors?.policy}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PAutocomplete
          fullWidth multiple
          name="restriction_access"
          label={t`Restriction On Market Access`}
          api="/restrictions/restriction-access/"
          readOnly={!!objects?.readOnly}
          defaultValue={data?.restriction_access}
          helperText={errors?.restriction_access}
          error={!!errors?.restriction_access}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          name="restriction_on_national_treatment"
          label={t`Restriction On National Treatment`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.restriction_on_national_treatment}
          helperText={errors?.restriction_on_national_treatment}
          error={!!errors?.restriction_on_national_treatment}
        >
          {constants.discriminativeList?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          name="non_compliance"
          label={t`Type Of Non-Compliance`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.non_compliance}
          helperText={errors?.non_compliance}
          error={!!errors?.non_compliance}
        >
          {constants.nonComplianceTypes?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth required multiple
          name="mode_of_supply_affected"
          label={t`Mode Of Supply Affected`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.mode_of_supply_affected?.split(",") || []}
          helperText={errors?.mode_of_supply_affected}
          error={!!errors?.mode_of_supply_affected}
        >
          {constants.modeOfSupply?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      {data?.id && (
        <Grid size={{ xs: 12, md: 6 }}>
          <PSelect
            fullWidth
            name="status"
            label={t`Status`}
            readOnly={!!objects?.readOnly}
            defaultValue={data?.status}
            helperText={errors?.status}
            error={!!errors?.status}
          >
            {constants.restrictionStatus?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
          </PSelect>
        </Grid>
      )}
      <Grid size={12}>
        <TextField
          fullWidth
          name="responsible_ministry"
          label={t`Ministry/Agency Responsible For The Removal of The Restriction`}
          defaultValue={data?.responsible_ministry}
          helperText={errors?.responsible_ministry}
          error={!!errors?.responsible_ministry}
          slotProps={{ input: { readOnly: !!objects?.readOnly } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth
          name="committed_to_liberalise"
          label={t`Committed To Liberalise`}
          readOnly={!!objects?.readOnly}
          defaultValue={data?.committed_to_liberalise}
          helperText={errors?.committed_to_liberalise}
          error={!!errors?.committed_to_liberalise}
        >
          {constants.yesNo?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="year_introduced"
          label={t`Year Measure Was Introduced`}
          defaultValue={data?.year_introduced}
          helperText={errors?.year_introduced}
          error={!!errors?.year_introduced}
          slotProps={{ input: { readOnly: !!objects?.readOnly } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="year_of_removal_proposal"
          label={t`Proposed Year Of Removal Of The Restriction By The Partner State`}
          defaultValue={data?.year_of_removal_proposal}
          helperText={errors?.year_of_removal_proposal}
          error={!!errors?.year_of_removal_proposal}
          slotProps={{ input: { readOnly: !!objects?.readOnly } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="year_of_removal"
          label={t`Year Measure Was Removed Or Amended`}
          defaultValue={data?.year_of_removal}
          helperText={errors?.year_of_removal}
          error={!!errors?.year_of_removal}
          slotProps={{ input: { readOnly: !!objects?.readOnly } }}
        />
      </Grid>
      {!data?.id && (
        <>
          <Grid size={12}>
            <PI18n
              fullWidth
              multiline
              rows={5}
              name="details"
              label={t`Update by Partner State / EAC`}
              helperText={errors?.details || t`The main resolution that resulted in creating this restriction`}
              error={!!errors?.details}
            />
          </Grid>
          <Grid size={12}>
            <PI18n
              fullWidth
              multiline rows={5}
              name="remarks"
              label={t`Remarks`}
              helperText={errors?.remarks || t`optional remarks over the restriction`}
              error={!!errors?.remarks}
            />
          </Grid>
        </>
      )}
    </Grid>
  );
}
