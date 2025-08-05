import * as React from "react";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import EmailSharp from "@mui/icons-material/EmailSharp";
import LocalPhoneSharp from "@mui/icons-material/LocalPhoneSharp";

import PAutocomplete from "@src/components/input/PAutocomplete";
import PCardPanel from "@src/components/container/PCardPanel";
import PSelect from "@src/components/input/PSelect";
import PImageInput from "@src/components/input/Upload/PImageInput";
import PLoader from "@src/components/loader/PLoader";
import PForm, { usePForm } from "@src/components/container/PForm";
import { ToolTitle } from "@src/components/layout";

import { onApiSuccess } from "@src/app/utils";
import { useLocale, useAuthenticate } from "@src/app/hooks";

export default function Profile() {
  const { locales } = useLocale();
  const { profile, loading, updateProfile } = useAuthenticate();
  const [_profile, _setProfile] = React.useState<any>(profile);

  const onChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => _setProfile({
    ..._profile,
    ...{[key]: event.target.value as string},
  });

  React.useEffect(() => {
    _setProfile(profile);
  }, [profile]);

  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => {
      const refresh = data.get("locale") !== profile?.locale;
      return updateProfile(data).then(() => refresh);
    },
    onSubmitSuccess: (res: any) => {
      onApiSuccess().then(() => {
        if ( res ) {
          window.location.reload();
        }
      });
    }
  });

  return (
    <PForm onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <PCardPanel title={<ToolTitle title={t`Contact`} />}>
            <Stack spacing={2}>
              <TextField
                name="email"
                label={t`Email`}
                value={_profile?.email}
                helperText={errors?.email}
                error={!!errors?.email}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailSharp />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <TextField
                name="phone"
                label={t`Phone`}
                onChange={onChange("phone")}
                value={_profile?.phone}
                helperText={errors?.phone}
                error={!!errors?.phone}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocalPhoneSharp />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <PAutocomplete
                fullWidth
                required
                name="country"
                label={t`Country Of Residence`}
                api="/pages/countries/"
                serialise={(r: any) => ({ id: r?.iso, label: r?.name })}
                defaultValue={profile?.country?.iso}
                helperText={errors?.country}
                error={!!errors?.country}
              />
            </Stack>
          </PCardPanel>
          <Button type="submit" variant="contained" sx={{ mt: 2 }}>{t`Update`}</Button>
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <PCardPanel title={<ToolTitle title={t`Settings`} />}>
            <Stack spacing={2}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Stack spacing={2}>
                    <TextField
                      name="first_name"
                      label={t`First Name`}
                      onChange={onChange("first_name")}
                      value={_profile?.first_name}
                      helperText={errors?.first_name}
                      error={!!errors?.first_name}
                    />
                    <TextField
                      name="last_name"
                      label={t`Last Name`}
                      onChange={onChange("last_name")}
                      value={_profile?.last_name}
                      helperText={errors?.last_name}
                      error={!!errors?.last_name}
                    />
                    <PSelect
                      name="locale"
                      label={t`Locale`}
                      defaultValue={profile?.locale}
                      helperText={errors?.locale}
                      error={!!errors?.locale}
                    >
                      {locales.map((co, index) => <MenuItem key={index} value={co.iso}>{co.label}</MenuItem>)}
                    </PSelect>
                  </Stack>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <PImageInput
                    fluid
                    name="avatar"
                    label={t`Avatar`}
                    defaultValue={profile?.avatar}
                  />
                </Grid>
              </Grid>
            </Stack>
          </PCardPanel>
        </Grid>
      </Grid>
      <PLoader loading={loading} />
    </PForm>
  );
}
