import { t } from "ttag";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

import Button from "@mui/material/Button";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";

import PForm, { usePForm } from "@src/components/container/PForm";
import ErrorBox from "@src/components/container/box/ErrorBox";

import { useFetch } from "@src/app/hooks";
import { useAppDispatch } from "@src/app/redux/store";
import { initAuth } from "@src/app/redux/slice/auth";
import { onApiSuccess } from "@src/app/utils";
import { StyledCard, StyledBox, ButtonBox } from "./styles";

export default function Confirm() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useParams();
  const jwt = jwtDecode(token as string) as any;

  const [{loading}, apiCall] = useFetch({
    url: "/auth/register/confirm/",
    method: "POST"
  });

  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => {
      (data as FormData).append("token", String(token || "").trim());
      return apiCall({data}).then((res: any) => {
        dispatch(initAuth(res));
        return res;
      });
    },
    onSubmitSuccess: (res: any) => {
      onApiSuccess().then(() => navigate(res?.user?.is_staff ? "/auth/dashboard" : "/"));
    },
  });

  return (
    <ErrorBox>
      <StyledCard variant="outlined" className="card-style-3">
        <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
        {"token" === jwt.type && (
          <>
            <h2>{t`Complete Registration`}</h2>
            <p>{t`In order to complete the registration process, please key in your new password`}</p>
          </>
        )}
        {"token" !== jwt.type && <h2>{t`Password Reset`}</h2>}
        <PForm onSubmit={onSubmit}>
          <StyledBox>
            {!!errors?.detail && <FormHelperText error={!!errors?.detail}>{errors?.detail}</FormHelperText>}
            <TextField
              fullWidth
              label={t`Email`}
              value={jwt.user}
              slotProps={{ input: { readOnly: true } }}
            />
            <TextField
              fullWidth
              required
              label={t`New Password`}
              placeholder="*******"
              name="pass_a"
              type="password"
            />
            <TextField
              fullWidth
              required
              label={t`Confirm Password`}
              placeholder="*******"
              name="pass_b"
              type="password"
            />
          </StyledBox>
          <ButtonBox>
            <Button
              loading={loading}
              type={"submit"}
              variant="contained"
              aria-label={t`Register`}
            >
              {"token" === jwt.type ? t`Register` : t`Reset Password`}
            </Button>
            <Button aria-label={t`Home`} onClick={() => navigate("/")}>
              {t`Home`}
            </Button>
          </ButtonBox>
        </PForm>
      </StyledCard>
    </ErrorBox>
  );
}
