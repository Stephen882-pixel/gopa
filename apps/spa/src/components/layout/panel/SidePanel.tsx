import { t } from "ttag";
import { styled } from "@mui/material/styles";
import MuiDrawer, { drawerClasses } from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";

import PLoader from "@src/components/loader/PLoader";
import { scrollSX } from "@src/components/layout";
import { onApiError } from "@src/app/utils";
import { useAuthenticate } from "@src/app/hooks";

import MainMenu from "../menu/MainMenu";
import OptionsMenu from "../menu/OptionsMenu";
import AppBarPanel from "./AppBarPanel";

type SidePanelProps = {
  width?: number;
};

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => "width" !== prop,
})<SidePanelProps>(({ theme, width }) => ({
  width: "15dvw",
  minWidth: width,
  flexShrink: 0,
  boxSizing: "border-box",
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: "15dvw",
    minWidth: width,
    boxSizing: "border-box",
    backgroundColor: "background.paper",
  },
}));

const Logo = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  marginTop: "calc(var(--template-frame-height, 0px) + 4px)",
  padding: theme.spacing(1.5),

  "img": {
    height: 70,
    width: "auto",
  }
}));

export default function SidePanel({ width } : SidePanelProps) {
  const { loading, profile, logout } = useAuthenticate();
  const w = width || 240;
  return (
    <>
      <Drawer
        width={w}
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Logo>
          <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
        </Logo>
        <Divider />
        <Box
          sx={
            (theme) => ({
              overflow: "auto",
              height: "100%",
              display: "flex",
              flexDirection: "column",

              ...scrollSX(theme),
            })
          }
        >
          <MainMenu />
        </Box>
        <OptionsMenu
          width={w}
          profile={profile}
          onLogout={() => logout().catch(onApiError)}
        />
      </Drawer>
      <AppBarPanel
        profile={profile}
        onLogout={() => logout().catch(onApiError)}
      >
        <MainMenu />
      </AppBarPanel>
      <PLoader fullScreen loading={loading} />
    </>
  );
}
