import Fab from "@mui/material/Fab";
import HomeSharp from "@mui/icons-material/HomeSharp";
import { t } from "ttag";

import Link from "@src/components/Link";
import ErrorBox from "@src/components/container/box/ErrorBox";

export default function Page403() {
  return (
    <ErrorBox>
      <h2>{t`Access Denied!`}</h2>
      <p>{t`You do not have access to the specified resource.`}</p>
      <Fab
        component={Link}
        color="secondary"
        title={t`Home`}
        aria-label={t`Home`}
        to="/"
      >
        <HomeSharp />
      </Fab>
    </ErrorBox>
  );
}
