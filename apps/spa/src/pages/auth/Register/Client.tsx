import { useState } from "react";
import { t } from "ttag";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

import Link from "@src/components/Link";
import PAutocomplete from "@src/components/input/PAutocomplete";
import PForm, { usePForm } from "@src/components/container/PForm";
import ErrorBox from "@src/components/container/box/ErrorBox";

import { useFetch } from "@src/app/hooks";
import { cSwal } from "@src/app/utils";
import { StyledCard, StyledBox, ButtonBox } from "./styles";


export default function Client() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const [{loading}, apiCall] = useFetch({
    url: "/auth/register/client/",
    method: "POST"
  });

  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({data}),
    onSubmitSuccess: (res: any) => {
      const opts = {
        icon: "success", title: t`Success`,
        text: t`The user account was successfully created. Head to your email account to finalise the registration process.`
      };
      cSwal(opts).then(() => navigate("/"));
    },
  });

  return (
    <ErrorBox>
      <StyledCard variant="outlined" className="card-style-3">
        <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
        <h2>{t`Client Registration`}</h2>
        <p>{t`Fill in the details below to register as a client on this portal`}</p>
        <PForm onSubmit={onSubmit}>
          <StyledBox>
            <TextField
              fullWidth
              required
              autoFocus
              label={t`Email`}
              name="username"
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target.value as string).toLowerCase())}
              helperText={errors?.username}
              error={!!errors?.username}
            />
            <PAutocomplete
              fullWidth
              required
              name="country"
              label={t`Country Of Residence`}
              api="/pages/countries/"
              serialise={(r: any) => ({ id: r?.iso, label: r?.name })}
              helperText={errors?.country}
              error={!!errors?.country}
            />
            <TextField
              fullWidth
              label={t`First Name`}
              name="first_name"
              helperText={errors?.first_name}
              error={!!errors?.first_name}
            />
            <TextField
              fullWidth
              label={t`Last Name`}
              name="last_name"
              helperText={errors?.last_name}
              error={!!errors?.last_name}
            />
          </StyledBox>
          <ButtonBox>
            <Button
              loading={loading}
              type={"submit"}
              variant="contained"
              aria-label={t`Register`}
            >
              {t`Register`}
            </Button>
            <span />
            <p>
              {t`Have an account?`}&nbsp;
              <Link to="/auth/login">{t`Sign In`}</Link>
            </p>
          </ButtonBox>
        </PForm>
      </StyledCard>
      <ButtonBox>
        <Link to="/">{t`Back to EAC homepage`}</Link>
      </ButtonBox>
    </ErrorBox>
  );
}
