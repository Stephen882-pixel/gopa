import * as React from "react";
import { t } from "ttag";
import { styled, alpha } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LogoutSharp from "@mui/icons-material/LogoutSharp";
import MenuSharp from "@mui/icons-material/MenuSharp";

import type { ProfileProps } from "@src/app/redux/types";
import Link from "@src/components/Link";
import MenuButton from "../menu/MenuButton";

const Background = styled("div")(({ theme }) => ({
  backdropFilter: "blur(24px)",
  boxShadow: theme.shadows[4],
  backgroundColor: alpha(theme.palette.background.default, 0.4),
}));

const Wrapper = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  paddingTop: theme.spacing(0.5),
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
}));

const Logo = styled("div")(({ theme }) => ({
  flex: "1 1 100%",
  alignItems: "center",
  px: 0,

  "img": {
    height: 50,
    width: "auto"
  },
}));

const Menu = styled("div")(({ theme }) => ({
  alignItems: "center",
  paddingLeft: 5,
}));

type AppBarPanelProps = {
  children: React.ReactNode;
  profile?: ProfileProps | null;
  onLogout?: () => void;
};

export default function AppBarPanel({ children, profile, onLogout } : AppBarPanelProps) {
  const [open, setOpen] = React.useState<boolean>(false);
  return (
    <AppBar
      position="fixed"
      sx={{
        display: { xs: "auto", md: "none" },
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
        top: "var(--template-frame-height, 0px)",
      }}
    >
      <Background>
        <Wrapper>
          <Logo>
            <Link to="/auth/dashboard">
              <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
            </Link>
          </Logo>
          <Menu>
            <MenuButton aria-label={t`Open Menu`} onClick={() => setOpen(true)}>
              <MenuSharp />
            </MenuButton>
          </Menu>
        </Wrapper>
      </Background>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => setOpen(false)}
      >
        <Stack
          direction="row"
          sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
        >
          <Avatar
            sizes="small"
            alt={profile?.display_name}
            src={profile?.avatar}
            sx={{ width: 45, height: 45 }}
          />
          <Typography component="p" variant="h6">
            {profile?.display_name} &nbsp;
          </Typography>
        </Stack>
        <Divider />
        <Box
          sx={{
            overflow: "auto",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            maxWidth: "70dvw",
            minWidth: "40dvw",
          }}
        >
          {children}
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            aria-label={t`Logout`}
            startIcon={<LogoutSharp />}
            onClick={() => onLogout?.()}
          >
            {t`Logout`}
          </Button>
        </Box>
      </Drawer>
    </AppBar>
  );
}
