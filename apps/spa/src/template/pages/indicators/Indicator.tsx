import * as React from "react";
import { useParams } from "react-router-dom";
import { t } from "ttag";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";

import Link from "@src/components/Link";
import ErrorBox from "@src/components/container/box/ErrorBox";
import PReport from "@src/components/container/PReport";

import { useFetch } from "@src/app/hooks";

export default function Indicator() {
  const [item, setItem] = React.useState<any>(null);
  const [{}, apiCall] = useFetch();
  const { slug } = useParams();

  React.useEffect(() => {
    document.title = t`Indicator`;
    window.scrollTo(0, 0);
    apiCall({ url: `/pages/reports/${slug}/` })
      .then((res: any) => setItem(res))
      .catch(() => setItem(false));
  }, []);

  return (
    <>
      <Container sx={{ display: "flex", flexDirection: "column", flexGrow: 1, mt: 2, mb: 2, gap: 2 }}>
        {false === item && (
          <ErrorBox mode="simple">
            {t`The report could not be loaded at this time.`}
          </ErrorBox>
        )}
        {"Dashboard" === item?.display_type && (
          <>
            <PReport index={item?.id} height={item?.display_height} />
            <Box sx={{ display: "flex", flexDirection: "row" }}>
              <Link to="/public/indicators">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  aria-label={t`Back`}
                  sx={{ textTransform: "inherit" }}
                >
                  {t`Back`}
                </Button>
              </Link>
            </Box>
          </>
        )}
        {"Dashboard" !== item?.display_type && (
          <Grid container spacing={2} sx={{ mt: 2, mb: 2 }}>
            <Grid size={{ sm: 12, md: 8, lg: 9 }}>
              <PReport index={item?.id} />
            </Grid>
            <Grid size={{ sm: 12, md: 4, lg: 3 }}>
              <h2>{t`Brief`}</h2>
              <p>{item?.brief}</p>
              {item?.description && (
                <>
                  <h2>{t`Description`}</h2>
                  <p>{item?.description}</p>
                </>
              )}
              <br />
              <Link to="/public/indicators">
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  aria-label={t`Back`}
                  sx={{ textTransform: "inherit" }}
                >
                  {t`Back`}
                </Button>
              </Link>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
}
