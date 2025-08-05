import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

import Link from "@src/components/Link";
import HomePanel from "@src/template/components/Panels/HomePanel";

const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  gap: 20,
  flexGrow: 1,
  height: "100%",
  "&:last-child": {
    paddingBottom: 16,
  },
});

const StyledBrief = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 3,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

const StyledCard = styled(Card)({
  height: "100%",
});

export default function AboutUs() {
  return (
    <HomePanel pt={0} pb={0}>
      <Grid container spacing={2} sx={{ width: "100%" }}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StyledCard className="card-style-1">
            <SyledCardContent>
              <Typography gutterBottom variant="h6" component="div" className="card-header-1">
                Understanding Trade in Services
              </Typography>
              <StyledBrief variant="body1">
                Article I of the General Agreement on Trade in Services (GATS), which is the basis of the EAC Common Market Protocol, provides three key elements constituting the agreement's “definition of services and sectoral coverage.”
              </StyledBrief>
              <Link className="link-style-1" to="/public/about#section-a">
                {t`Read More`}
              </Link>
            </SyledCardContent>
          </StyledCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StyledCard className="card-style-1">
            <SyledCardContent>
              <Typography gutterBottom variant="h6" component="div" className="card-header-1">
                What Are Restrictions on Trade in Services
              </Typography>
              <StyledBrief variant="body1">
                Restrictions on trade in services are more complex than restrictions on trade in goods. Restrictions on goods trade usually take the form of tariffs.
              </StyledBrief>
              <Link className="link-style-1" to="/public/about#section-b">
                {t`Read More`}
              </Link>
            </SyledCardContent>
          </StyledCard>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StyledCard className="card-style-1">
            <SyledCardContent>
              <Typography gutterBottom variant="h6" component="div" className="card-header-1">
                Mechanisms for Removing Trade in Services Restrictions
              </Typography>
              <StyledBrief variant="body1">
                The new EAC website provides businesses, policymakers, and professionals with the tools to identify and address these barriers effectively.
              </StyledBrief>
              <Link className="link-style-1" to="/public/about#section-c">
                {t`Read More`}
              </Link>
            </SyledCardContent>
          </StyledCard>
        </Grid>
      </Grid>
    </HomePanel>
  );
}
