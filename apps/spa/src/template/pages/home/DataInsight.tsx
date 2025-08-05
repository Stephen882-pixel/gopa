import * as React from "react";
import { styled } from "@mui/material/styles";
import { t } from "ttag";

import Typography from "@mui/material/Typography";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";

import Link from "@src/components/Link";
import PLoader from "@src/components/loader/PLoader";
import ErrorBox from "@src/components/container/box/ErrorBox";
import PReport from "@src/components/container/PReport";
import HomePanel from "@src/template/components/Panels/HomePanel";
import { useFetch } from "@src/app/hooks";

const CenteredGrid = styled(Grid)(({theme}) => ({
  display: "flex",
  justifyContent: "center",
  width: "100%",
  padding: theme.spacing(0, 2),
}));

export default function DataInsight() {
  const [items, setItems] = React.useState<null | Array<any>>(null);
  const [{loading}, apiCall] = useFetch({ url: "/pages/reports/feature/" });

  React.useEffect(() => {
    apiCall()
      .then((res: any) => setItems(res))
      .catch(() => setItems([]));
  }, []);

  return (
    <>
      <div className="reports-wrapper-A">
        <HomePanel
          wide
        >

          <Typography className="heading-2 padding-bottom-A">
            {t`Monitoring of Commitments & Restrictions`}
          </Typography>

            {(null === items || loading) && (
              <Box className="analytics-section-1E" sx={{ position: "relative", width: "100%" }}>
                <ErrorBox mode="simple">
                  <PLoader loading />
                </ErrorBox>
              </Box>
            )}
            {0 === items?.length && (
              <ErrorBox mode="simple">
                <div className="analytics-section-1F">
                  {t`The report could not be loaded at this time.`}
                </div>
              </ErrorBox>
            )}
            <Box className="analytics-section-1A" sx={{ display: "flex", flexDirection: "column", width: "100%", gap: 2 }}>
              <CenteredGrid className="analytics-section-1B" container spacing={2}>
                {items?.map((item, index) => (
                  <Grid className="analytics-section-1C" size={{ xs: 12, md: 6 }} key={index}>
                    <PReport index={item?.id} height={"Dashboard" === item?.display_type ? item?.display_height : 500} />
                  </Grid>
                ))}
              </CenteredGrid>
              <Box className="analytics-section-1D" sx={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                <Link className="analytics-section-1E" to={`/public/indicators`}>
                  <Button className="button-style-2" variant="contained" aria-label={t`Explore all insights`}>{t`Explore all insights`}</Button>
                </Link>
              </Box>
            </Box>
        </HomePanel>
      </div>
    </>
  );
}
