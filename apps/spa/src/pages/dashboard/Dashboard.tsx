import { t } from "ttag";

import ErrorBox from "@src/components/container/box/ErrorBox";

export default function Dashboard() {
  return (
    <ErrorBox mode="fill">
      <h2>{t`Welcome`}</h2>
      <p>{t`This page will be updated with the latest custom reports as the system is used.`}</p>
    </ErrorBox>
  );
}
