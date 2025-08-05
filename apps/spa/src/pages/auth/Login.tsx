import { useState } from "react";
import { t } from "ttag";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import HomeSharp from "@mui/icons-material/HomeSharp";
import VisibilitySharp from "@mui/icons-material/VisibilitySharp";
import VisibilityOffSharp from "@mui/icons-material/VisibilityOffSharp";

import Link from "@src/components/Link";
import PForm from "@src/components/container/PForm";
import ErrorBox from "@src/components/container/box/ErrorBox";
import { onApiError, LOGIN_STORE_CONST } from "@src/app/utils";
import { useAuthenticate } from "@src/app/hooks";

import { StyledCard, StyledBox, ButtonBox } from "./Register/styles";

export default function Login() {
  const [input, setInput] = useState<string>("password");
  const [email, setEmail] = useState<string>("");
  const { loading, hasLoggedIn, profile, login } = useAuthenticate();
  const navigate = useNavigate();
  const onSubmit = (form: HTMLFormElement) => {
    login(new FormData(form))
      .then((res: any) => {
        const home = !!res?.user?.is_staff ? "/auth/dashboard" : "/";
        const path = localStorage.getItem(LOGIN_STORE_CONST);
        navigate(path ? path : home);
      })
      .catch(onApiError)
  };

  return (
    <ErrorBox>
      <StyledCard variant="outlined" className="card-style-3">
        <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
        <h2>{!hasLoggedIn ? t`Sign In` : t`Welcome`}</h2>
        {!hasLoggedIn && (
          <PForm onSubmit={onSubmit}>
            <StyledBox>
              <TextField
                label={t`Email`}
                name="username"
                type="email"
                fullWidth
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail((e.target.value as string).toLowerCase())}
              />
              <TextField
                label={t`Password`}
                placeholder="*******"
                name="password"
                type={input}
                fullWidth
                required
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          sx={{ mr: -1.5 }}
                          aria-label={t`Password Visibility`}
                          onClick={() => setInput("password" === input ? "text" : "password")}
                        >
                          {"password" === input ? <VisibilityOffSharp /> : <VisibilitySharp />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </StyledBox>
            <ButtonBox>
              <Button
                loading={loading}
                type="submit"
                variant="contained"
                aria-label={t`Sign In`}
              >
                {t`Sign In`}
              </Button>
              <span />
              <p><Link to="/auth/register/reset">{t`Forgot your password?`}</Link></p>
            </ButtonBox>
            <p>{t`Don't have an account?`} <Link to="/auth/register/client">{t`Sign Up`}</Link></p>
          </PForm>
        )}
        {hasLoggedIn && (
          <>
            <StyledBox>
              <TextField
                label={t`Email`}
                defaultValue={profile?.username}
                fullWidth
                disabled
              />
            </StyledBox>
            <ButtonBox>
              <Fab
                color="secondary"
                title={t`Home`}
                aria-label={t`Home`}
                onClick={() => navigate("/")}
              >
                <HomeSharp />
              </Fab>
            </ButtonBox>
          </>
        )}
      </StyledCard>
      <ButtonBox>
        <Link to="/">{t`Back to EAC homepage`}</Link>
      </ButtonBox>
    </ErrorBox>
  );
}
