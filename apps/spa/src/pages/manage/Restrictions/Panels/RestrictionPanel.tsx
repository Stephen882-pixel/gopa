import { t } from "ttag";

// import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";

import Link from "@src/components/Link";
import ErrorBox from "@src/components/container/box/ErrorBox";
import PI18n from "@src/components/input/PI18n";
import PSelect from "@src/components/input/PSelect";
import PCardPanel from "@src/components/container/PCardPanel";
import { ButtonBox } from "@src/pages/auth/Register/styles";
import { ToolTitle } from "@src/components/layout";

import PForm, { usePForm } from "@src/components/container/PForm";
import { useFetch, usePermissions } from "@src/app/hooks";
import { useAppSelector } from "@src/app/redux/store";

import RestrictionForm from "../Forms/RestrictionForm";
import RestrictionSkeletonForm from "../Forms/RestrictionSkeletonForm";
import UpdateSkeletonForm from "../Forms/UpdateSkeletonForm";

interface RestrictionPanelProps {
  restriction: any;
  onUpdate?: () => void;
}

export default function RestrictionPanel({ restriction, onUpdate }:RestrictionPanelProps) {
  const [{ loading }, apiCall] = useFetch({
    url: `/restrictions/${restriction?.id}/`,
  });
  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({ method: "PUT", data }).then((res) => onUpdate?.()),
  });

  const { hasPermissions } = usePermissions();
  const canEdit = !restriction?.deleted && hasPermissions(["restrictions.change_restriction"]);

  const restrictionStatus = useAppSelector((state) => state.constants.restrictionStatus).filter((s) => "New" !== s?.slug);

  return (
    <PForm onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={{xs: 12, md: 6}}>
          <PCardPanel title={<ToolTitle title={t`Restriction`} />}>
            {restriction?.id ? <RestrictionForm data={restriction} errors={errors} /> : <RestrictionSkeletonForm />}
          </PCardPanel>
        </Grid>

        <Grid size={{xs: 12, md: 6}} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <PCardPanel title={<ToolTitle title={!restriction?.deleted ? t`Update Details` : t`Please Note`} />}>
            {!restriction?.id && <UpdateSkeletonForm />}
            {!!restriction?.deleted && (
              <ErrorBox mode="simple">
                {t`This restriction has been archived.`}
              </ErrorBox>
            )}
            {!restriction?.deleted && (
              <Grid container spacing={2}>
                <Grid size={12}>
                  <PI18n
                    fullWidth
                    multiline
                    rows={5}
                    name="details"
                    label={t`Update by Partner State / EAC`}
                    helperText={errors?.details || t`The main resolution that resulted in updating this restriction`}
                    error={!!errors?.details}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <PSelect
                    fullWidth
                    name="review_status"
                    label={t`Status`}
                    defaultValue="Intact"
                    helperText={errors?.status}
                    error={!!errors?.status}
                  >
                    {restrictionStatus?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
                  </PSelect>
                </Grid>
                <Grid size={12}>
                  <PI18n
                    fullWidth
                    multiline rows={5}
                    name="remarks"
                    label={t`Remarks`}
                    helperText={errors?.remarks || t`optional remarks over the update made`}
                    error={!!errors?.remarks}
                  />
                </Grid>
              </Grid>
            )}
          </PCardPanel>

          {/*<Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }} />*/}

          <Paper sx={(theme) => ({ padding: theme.spacing(2) })}>
            <ButtonBox sx={{ mt: 0 }}>
              <Link to="/auth/manage/restrictions">
                <Button type="button" variant="outlined" aria-label={t`Back`}>
                  {t`Back`}
                </Button>
              </Link>
              <span />
              {canEdit && (
                <Button type="submit" loading={loading} variant="contained" aria-label={t`Update`}>
                  {t`Update`}
                </Button>
              )}
            </ButtonBox>
          </Paper>
        </Grid>
      </Grid>
    </PForm>
  );
}
