import Fab from "@mui/material/Fab";
import HomeSharp from "@mui/icons-material/HomeSharp";
import { t } from "ttag";

import Link from "@src/components/Link";
import ErrorBox from "@src/components/container/box/ErrorBox";

export default function PageConstruction() {
  return (
    <ErrorBox mode="fill">
      <h2>{t`Under Construction`}</h2>
      <p>{t`This section is still under development, please try again later.`}</p>
      <Fab
        component={Link}
        color="secondary"
        title={t`Dashboard`}
        aria-label={t`Dashboard`}
        to="/auth/dashboard"
      >
        <HomeSharp />
      </Fab>
    </ErrorBox>
  );
}
