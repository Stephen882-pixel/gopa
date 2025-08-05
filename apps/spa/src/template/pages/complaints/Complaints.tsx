import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { t } from "ttag";

import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PForm, { usePForm } from "@src/components/container/PForm";
import PLoader from "@src/components/loader/PLoader";
import PAutocomplete from "@src/components/input/PAutocomplete";
import PSelect from "@src/components/input/PSelect";
import PUpload from "@src/components/input/Upload/PUpload";
// import HeroPanel from "@src/template/components/Panels/HeroPanel";
import SectorSelector from "@src/components/SectorSelector";

import { useAppSelector } from "@src/app/redux/store";
import { useFetch, usePermissions } from "@src/app/hooks";
import { onApiSuccess, onApiError, LOGIN_STORE_CONST } from "@src/app/utils";

const Title = styled(Typography)({
  fontSize: "1.5rem"
});

export default function Complaints() {
  const [item, setItem] = useState<any | null>(null);

  const constants = useAppSelector((state) => state.constants);
  const { hasLoggedIn, isStaff } = usePermissions();

  const [{loading}, apiCall] = useFetch();
  const { errors, setContent, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({
      url: "/restrictions/complaints/",
      method: "POST",
      data,
    }),
    onSubmitSuccess: (res: any) => onApiSuccess().then(() => navigate("/")),
  });

  const currentLocation = useLocation().pathname;
  const navigate = useNavigate();
  const { slug } = useParams();
  const onLogin = () => {
    localStorage.setItem(LOGIN_STORE_CONST, currentLocation);
    navigate("/auth/login");
  };

  useEffect(() => {
    document.title = t`Complaints`;
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if ( !slug ) {
      setItem(null);
      return;
    }
    const opts = {
      url: "/pages/restrictions/",
      params: { slug },
    };
    apiCall(opts)
      .then((res: any) => {
        if ( 0 < res?.results?.length ) {
          setItem(res.results.pop());
        }
      })
      .catch(onApiError);
  }, [slug]);

  return (
    <>
      {/* <HeroPanel
        small
        transparent
        title={t`Register Complaint`}
      /> */}

      <div className="container">
        <Typography className="heading-2">
          {t`Register Complaint`}
        </Typography>
      </div>


      <Container
        sx={{
          pt: {xs: 4, sm: 8},
          pb: {xs: 4, sm: 8},
        }}
      >
        <PForm onSubmit={onSubmit}>
          <Grid container spacing={2} sx={{ pb: errors?.is_staff || isStaff || !hasLoggedIn ? 2: 0}}>
            <Grid size={6} offset={3}>
              {(errors?.is_staff || isStaff) && (
                <Alert severity={errors?.is_staff ? "error" : "info"}>
                  <AlertTitle>{t`Please Note`}</AlertTitle>
                  {t`Staff accounts are not allowed to register new complaints.`}
                </Alert>
              )}
              {!hasLoggedIn && (
                <Alert severity="info">
                  <AlertTitle>{t`Please Note`}</AlertTitle>
                  {t`To register a complaint, you must log in as a registered user. If you do not have an account yet, please register an account first.`}
                  <Box sx={{ display: "flex", gap: 1, mb: 1, mt: 1 }}>
                    <Button
                      variant="contained"
                      aria-label={t`Log In`}
                      onClick={onLogin}
                    >
                      {t`Log In`}
                    </Button>
                    <Button
                      variant="contained"
                      aria-label={t`Register`}
                      onClick={() => navigate("/auth/register/client")}
                    >
                      {t`Register`}
                    </Button>
                  </Box>
                </Alert>
              )}
            </Grid>
          </Grid>

          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
              <Title>{t`Details Of Occurrence`}</Title>
            </Grid>
            <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <PSelect
                    fullWidth
                    name="origin_country"
                    label={t`Country Of Origin`}
                    helperText={errors?.origin_country}
                    error={!!errors?.origin_country}
                  >
                    {constants.countries?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                  </PSelect>
                </Grid>
                <Grid size={{ xs: 12, lg: 6 }}>
                  <PSelect
                    fullWidth
                    name="target_country"
                    label={t`Destination Country`}
                    helperText={errors?.target_country}
                    error={!!errors?.target_country}
                  >
                    {constants.countries?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                  </PSelect>
                </Grid>
                <Grid offset={{lg: 6}} size={{ xs: 12, lg: 6 }}>
                  <DatePicker
                    maxDate={new Date()}
                    name="date_of_occurrence"
                    label={t`Date Of Occurrence`}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                        helperText: errors?.date_of_occurrence,
                        error: !!errors?.date_of_occurrence,
                      }
                    }}
                  />
                </Grid>
                {!item?.id && (
                  <>
                    <Grid size={12}>
                      <SectorSelector
                        fullWidth
                        required
                        mode="simple"
                        name="sector"
                        label={t`Sector`}
                        helperText={errors?.sector}
                        error={!!errors?.sector}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <PSelect
                        fullWidth
                        name="restriction_type"
                        label={t`Type Of Restriction`}
                        helperText={errors?.restriction_type}
                        error={!!errors?.restriction_type}
                      >
                        {constants.complaintTypes?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                      </PSelect>
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <PAutocomplete
                        fullWidth
                        name="policy"
                        label={t`Policy`}
                        api="/pages/policies/"
                        helperText={errors?.policy}
                        error={!!errors?.policy}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <PSelect
                        fullWidth multiple required
                        name="mode_of_supply_affected"
                        label={t`Mode Of Restriction`}
                        defaultValue={[]}
                        helperText={errors?.mode_of_supply_affected}
                        error={!!errors?.mode_of_supply_affected}
                      >
                        {constants.modeOfSupply?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                      </PSelect>
                    </Grid>
                  </>
                )}
                {!!item?.id && (
                  <>
                    <Grid size={{ xs: 12 }}>
                      <input type="hidden" name="restriction" value={item?.id} />
                      {item?.sector?.id && <input type="hidden" name="sector" value={item?.sector?.id} />}
                      {item?.policy?.id && <input type="hidden" name="policy" value={item?.policy?.id} />}
                      {item?.mode_of_supply_affected && <input type="hidden" name="mode_of_supply_affected" value={item?.mode_of_supply_affected} />}
                      <TextField
                        fullWidth multiline
                        label={t`Restriction`}
                        value={item?.type_of_measure}
                      />
                    </Grid>
                    <Grid size={{ xs: 12, lg: 6 }}>
                      <PSelect
                        fullWidth
                        name="restriction_type"
                        label={t`Type Of Restriction`}
                        helperText={errors?.restriction_type}
                        error={!!errors?.restriction_type}
                      >
                        {constants.complaintTypes?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                      </PSelect>
                    </Grid>
                    {!item?.policy?.id && (
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <PAutocomplete
                          fullWidth
                          name="policy"
                          label={t`Policy`}
                          api="/pages/policies/"
                          helperText={errors?.policy}
                          error={!!errors?.policy}
                        />
                      </Grid>
                    )}
                    {!item?.mode_of_supply_affected && (
                      <Grid size={{ xs: 12, lg: 6 }}>
                        <PSelect
                          fullWidth multiple required
                          name="mode_of_supply_affected"
                          label={t`Mode Of Restriction`}
                          defaultValue={[]}
                          helperText={errors?.mode_of_supply_affected}
                          error={!!errors?.mode_of_supply_affected}
                        >
                          {constants.modeOfSupply?.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
                        </PSelect>
                      </Grid>
                    )}
                  </>
                )}
                <Grid size={{ xs: 12, lg: 6 }}>
                  <TextField
                    fullWidth
                    name="agency"
                    label={t`Agency`}
                    helperText={errors?.agency}
                    error={!!errors?.agency}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
              <Title>{t`Brief Description`}</Title>
            </Grid>
            <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
              <TextField
                fullWidth
                multiline rows={5}
                name="description"
                label={t`Trade Barrier/Incident`}
                helperText={errors?.description || t`A brief description of the trade barrier or incident`}
                error={!!errors?.description}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 4, lg: 3 }}>
              <Title>{t`Supporting Documentation`}</Title>
            </Grid>
            <Grid size={{ xs: 12, sm: 8, lg: 9 }}>
              <PUpload
                multiple
                name="documents"
                label={t`Documents`}
                helperText={errors?.documents || t`The necessary documentation that will facilitate in looking into this complaint`}
                error={!!errors?.documents}
                onChange={(files: File[]) => setContent("documents", files)}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 8, lg: 9 }} offset={{ xs: 0, sm: 4, lg: 3 }}>
              {hasLoggedIn && !isStaff && (
                <Button loading={loading} variant="contained" type="submit" aria-label={t`Submit`}>
                  {t`Submit`}
                </Button>
              )}
              {!hasLoggedIn && (
                <>
                  <Button
                    variant="contained"
                    aria-label={t`Log In`}
                    onClick={onLogin}
                  >
                    {t`Log In`}
                  </Button>
                  <FormHelperText>{t`You must log in to submit this form`}</FormHelperText>
                </>
              )}
            </Grid>

          </Grid>
        </PForm>
      </Container>
      <PLoader loading={loading} fullScreen />
    </>
  );
}
