import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";

import ErrorBox from "@src/components/container/box/ErrorBox";
import PLoader from "@src/components/loader/PLoader";

import { useFetch } from "@src/app/hooks";
import { useMatXConfig } from "@src/components/theme";
import type { PReportProps } from "@src/components/types";

const Frame = styled("iframe")({
  width: "100%",
});

export default function PReport({ index, minutes = 30, height = 550 } : PReportProps) {
  const [hasError, setHasError] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [iframeUrl, setIframeUrl] = React.useState<string>("");
  const { darkMode } = useMatXConfig();

  const getMinutes = () => {
    const clean = parseInt(String(minutes));
    return isNaN(clean) || 30 > clean ? 30 : clean;
  };

  const [{}, apiCall] = useFetch({
    url: "/report/token/",
    method: "POST",
    data: { index, minutes: getMinutes() }
  });

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function loadReport() {
      const sleep = (60 * (getMinutes() - 1)) * 1000;
      setLoading(true);
      apiCall()
        .then((res: any) => {
          setHasError(false);
          setIframeUrl(res?.url);
          timer = setTimeout(() => loadReport(), sleep);
        })
        .catch(() => {
          if ( index ) {
            setHasError(true);
          }
        });
    }

    loadReport();
    return () => {
      clearTimeout(timer);
    };
  }, [index]);

  if ( !loading && index && hasError ) {
    return (
      <Paper>
        <ErrorBox mode="simple">
          {t`The report could not be loaded at this time.`}
        </ErrorBox>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: "relative" }}>
      <Frame
        onLoad={() => { if ( index ) { setLoading(false); } }}
        src={iframeUrl + (darkMode ? "&theme=night" : "")}
        frameBorder={0}
        height={height}
      />
      <PLoader loading={!index || loading || "" === iframeUrl} />
    </Box>
  );
}
