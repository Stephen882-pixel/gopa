import * as React from "react";
import { t } from "ttag";
import { alpha, styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import MenuItem from "@mui/material/MenuItem";

import { useLocale, useAuthenticate } from "@src/app/hooks";
import { cSwal } from "@src/app/utils";

import Menu, { useMenuHook } from "./Menu";

const LoadWrap = styled("span")({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

interface LangMenuProps {
  locale: string;
  alt: string;
}

function LangMenu({locale, alt}:LangMenuProps) {
  const [loading, setLoading] = React.useState<boolean>(false);
  const { profile, updateProfile } = useAuthenticate();
  return (
    <MenuItem
      component="a"
      onClick={() => {
        setLoading(true);
        const data = new FormData();
        data.set("dark_mode", profile?.darkMode ? "Yes" : "No");
        data.set("locale", locale);
        return updateProfile(data)
          .then(() => window.location.reload())
          .catch((res: any) => {
            const invalid = {
              icon: "error", title: t`Support`,
              text: t`The locale provided is not supported at this time`
            };
            cSwal(res?.response?.data?.locale ? invalid : res);
            setLoading(false);
          });
      }}
    >
      {loading && <LoadWrap><CircularProgress size={20} /></LoadWrap>}
      {!loading && alt}
    </MenuItem>
  );
}

export default function UtilsMenu() {
  const { locales } = useLocale();
  const { profile } = useAuthenticate();
  const { anchorEl, handleOpen, handleClose } = useMenuHook();

  return (
    <>
      <Box
        onClick={handleOpen}
        sx={
          (theme) => ({
            display: "flex",
            cursor: "pointer",
            flexGrow: 1,
            padding: theme.spacing(1),
            borderRadius: theme.spacing(1),
            color: theme.palette.text.primary,

            "&:hover": {
              backgroundColor: alpha(theme.palette.action.active, theme.palette.action.hoverOpacity),
            },
          })
        }
      >
        {profile?.locale?.toUpperCase()}
      </Box>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {locales.map((locale, k) => <LangMenu key={k} locale={locale.iso} alt={locale.label} />)}
      </Menu>
    </>
  );
}
