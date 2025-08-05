import Fab from "@mui/material/Fab";
import Stack from "@mui/material/Stack";
import HistorySharp from "@mui/icons-material/HistorySharp";
import HomeSharp from "@mui/icons-material/HomeSharp";
import { useNavigate } from "react-router-dom";
import { t } from "ttag";

import ErrorBox from "@src/components/container/box/ErrorBox";

export default function Page404() {
  const navigate = useNavigate();
  return (
    <ErrorBox>
      <h2>{t`You're lost.`}</h2>
      <p>{t`The page you are looking for could not be found`}</p>
      <Stack direction="row" spacing={2}>
        <Fab
          color="primary"
          title={t`Go Back`}
          aria-label={t`Go Back`}
          onClick={() => navigate(-1)}
        >
          <HistorySharp />
        </Fab>
        <Fab
          color="secondary"
          title={t`Home`}
          aria-label={t`Home`}
          onClick={() => navigate("/")}
        >
          <HomeSharp />
        </Fab>
      </Stack>
    </ErrorBox>
  );
}
