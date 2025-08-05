import * as React from "react";
import { t } from "ttag";

import Hero from "./Hero";
import Restrictions from "./Restrictions";
import DataInsight from "./DataInsight";
// import Publications from "./Publications";

import PLoader from "@src/components/loader/PLoader";
import { useFetch } from "@src/app/hooks";
// import { publications } from "@src/template/data";

export default function Home() {
  const [sectors, setSectors] = React.useState<Array<any>>([]);
  const [{loading}, apiCall] = useFetch({url: "/pages/home/"});

  React.useEffect(() => {
    document.title = t`EAC Home`;
    window.scrollTo(0, 0);
    apiCall().then((data: any) => {
      setSectors(data?.sectors);
    });
  }, []);

  return (
    <>
      <Hero />
      <Restrictions items={sectors} />
      <div className="report-container-1">
        <DataInsight />
      </div>
      {/*<Publications items={publications} />*/}
      <PLoader fullScreen loading={loading} />
    </>
  );
}
