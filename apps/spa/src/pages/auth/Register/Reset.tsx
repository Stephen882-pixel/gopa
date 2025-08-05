import { useState } from "react";
import { t } from "ttag";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import Link from "@src/components/Link";
import PForm, { usePForm } from "@src/components/container/PForm";
import ErrorBox from "@src/components/container/box/ErrorBox";

import { useFetch } from "@src/app/hooks";
import { cSwal } from "@src/app/utils";
import { StyledCard, StyledBox, ButtonBox } from "./styles";


export default function Reset() {
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();

  const [{loading}, apiCall] = useFetch({
    url: "/auth/register/reset/",
    method: "POST"
  });

  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({data}),
    onSubmitSuccess: (res: any) => {
      const opts = {
        icon: "success", title: t`Success`,
        text: t`Head to your email account to get the password reset link.`
      };
      cSwal(opts).then(() => navigate("/"));
    },
  });

  return (
    <ErrorBox>
      <StyledCard variant="outlined" className="card-style-3">
        <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
        <h2>{t`Password Reset`}</h2>
        <p>{t`Please key in your registered email address to receive the reset password link.`}</p>
        <PForm onSubmit={onSubmit}>
          <StyledBox>
            {!!errors?.detail && <FormHelperText error={!!errors?.detail}>{errors?.detail}</FormHelperText>}
            <TextField
              fullWidth
              required
              autoFocus
              label={t`Email`}
              name="username"
              type="email"
              value={email}
              onChange={(e) => setEmail((e.target.value as string).toLowerCase())}
            />
          </StyledBox>
          <ButtonBox>
            <Button
              loading={loading}
              type={"submit"}
              variant="contained"
              aria-label={t`Reset`}
            >
              {t`Reset`}
            </Button>
          </ButtonBox>
          <p>
            {t`Don't have an account?`} <Link to="/auth/register/client">{t`Sign Up Now`}</Link>
            &nbsp;{t`or`} <Link to="/auth/login">{t`Sign In`}</Link> {t`to access your account`}
          </p>
        </PForm>
      </StyledCard>
      <ButtonBox>
        <Link to="/">{t`Back to EAC homepage`}</Link>
      </ButtonBox>
    </ErrorBox>
  );
}
