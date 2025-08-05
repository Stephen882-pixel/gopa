import * as React from "react";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Container from "@mui/material/Container";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import MenuSharp from "@mui/icons-material/MenuSharp";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import { styled, alpha } from "@mui/material/styles";
import { t } from "ttag";

import Link from "@src/components/Link";
import { SpacerWrapper } from "../Panels/SpacerPanel";
import UserMenuItem from "./UserMenuItem";
import Nav from "./Nav";

const Background = styled(SpacerWrapper)(({ theme }) => ({
  backdropFilter: "blur(24px)",
  borderBottom: "1px solid",
  borderBottomColor: theme.palette.divider,
  backgroundColor: alpha(theme.palette.background.default, 0.4),
}));

const Logo = styled(Box)(({ theme }) => ({
  display: "flex",
  flex: "1 1 100%",
  alignItems: "center",
  px: 0,

  "img": {
    height: 65,
    width: "auto"
  },
  "img.eu": {
    display: "none",
    height: 55,
    marginLeft: 5,
  },

  [theme.breakpoints.up("sm")]: {
    "img": {
      height: 75,
    },
    "img.eu": {
      display: "inherit",
    },
  },
}));

const LogoImage = styled("div")(() => ({
  position: "absolute",
  top: -5,
  left: 0,

  "a": {
    display: "flex",
    alignItems: "center",
    gap: 5
  },
}));

const Div = styled("div")(({ theme }) => ({
  alignItems: "center",
  paddingLeft: 5,
}));

interface ItemProps {
  active?: boolean;
}

const Item = styled("div", {
  shouldForwardProp: prop => "active" !== prop,
})<ItemProps>(({ theme, active }) => ({
  whiteSpace: "nowrap",
  display: "flex",
  verticalAlign: "middle",
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  textDecoration: "none",

  ...(active && {
    "a": {
      cursor: "default",
      color: theme.palette.primary.main,
    },
  }),
}));

const PLink = styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
}));

export default function MenuPanel() {
  const [open, setOpen] = React.useState<boolean>(false);
  const currentLocation = useLocation().pathname;
  const items = [
    {to: "/", label: t`Home`},
    {
      to: "/public/about", label: t`About`,
      children: [
        {to: "/public/about", label: t`About`},
        {to: "/public/about/sectors", label: t`List Sectors`},
        {to: "/public/about/sms-how-to", label: t`SMS Service`},
      ],
    },
    {to: "/public/browse", label: t`Restrictions`},
    {
      to: "/public/complaints", label: t`Complaints`,
      children: [
        {to: "/public/complaints", label: t`Register Complaint`},
        {to: "/public/complaints/list", label: t`Overview Of Complaints`},
      ],
    },
    {to: "/public/notifications", label: t`Notifications`},
  ];

  return (
    <AppBar
      className="navbar-style-2A"
      position="fixed"
      sx={{
        boxShadow: 0,
        bgcolor: "transparent",
        backgroundImage: "none",
      }}
    >
      <Background className="navbar-style-2B">
        <Container maxWidth="lg" className="navbar-style-2C">
          <Toolbar
            className="navbar-style-2D"
            sx={{
              pl: { sm: 2 },
              pr: { xs: 1, sm: 1 },
            }}
          >
            <Logo>
              <LogoImage>
                <PLink to="/">
                  <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
                  <img src="/static/spa/logo/03.png" className="eu-eac" alt={t`EU-EAC core logo`} />
                  <img src="/static/spa/logo/04.png" className="eu" alt={t`EU funded by logo`} />
                </PLink>
              </LogoImage>
            </Logo>
            <Div sx={{ display: { xs: "none", md: "flex" } }}>
              <Stack direction="row" spacing={2}>
                <Item>
                  <Link to="/public/about/sms-how-to">
                    <Button variant="contained" className="complaints-button complaints-button-1">
                      {t`SMS Report`}
                    </Button>
                  </Link>
                </Item>
                <Item>
                  <Link to="/public/complaints">
                    <Button variant="contained" className="complaints-button complaints-button-2">
                      {t`Register Complaint`}
                    </Button>
                  </Link>
                </Item>
                <Item>
                  <UserMenuItem />
                </Item>
              </Stack>
            </Div>
            <Div sx={{ display: { xs: "flex", md: "none" } }} className="navbar-nav-A3">
              <UserMenuItem />
              <IconButton
                className="navbar-nav-A4"
                title={t`Menu`}
                aria-label={t`Menu`}
                onClick={() => setOpen(true)}
              >
                <MenuSharp className="navbar-nav-A5" />
              </IconButton>
            </Div>
          </Toolbar>
        </Container>
      </Background>
      <Toolbar className="navbar-nav-A6">
        <Container className="navbar-nav-A7">
          <Nav
            currentLocation={currentLocation}
            tree={items}
            mode="menu"
            grow
          />
        </Container>
      </Toolbar>
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
      >
        <Background>
          <Toolbar className="navbar-nav-A8">
            <Logo sx={{ justifyContent: "center" }}>
              <img src="/static/spa/logo/02.png" alt={t`EAC logo`} />
            </Logo>
          </Toolbar>
        </Background>
        <Stack
          spacing={1}
          sx={
            (theme) => ({
              padding: theme.spacing(1, 1, 2, 1),
              "a,button": { display: "flex", flexGrow: 1 },
            })
          }
        >
          <Link to="/public/about/sms-how-to">
            <Button variant="contained" className="complaints-button">
              {t`SMS Report`}
            </Button>
          </Link>
          <Link to="/public/complaints">
            <Button variant="contained" className="complaints-button">
              {t`Register Complaint`}
            </Button>
          </Link>
        </Stack>
        <Nav currentLocation={currentLocation} tree={items} mode="mobile" />
      </Drawer>
    </AppBar>
  );
}
