import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import DashboardSharp from "@mui/icons-material/DashboardSharp";
import LogoutSharp from "@mui/icons-material/LogoutSharp";
import SettingsSharp from "@mui/icons-material/SettingsSharp";

import Menu, { useMenuHook } from "@src/components/layout/menu/Menu";
import UtilsMenu from "@src/components/layout/menu/UtilsMenu";
import Link from "@src/components/Link";
import PLoader from "@src/components/loader/PLoader";
import { onApiError } from "@src/app/utils";
import { useAuthenticate } from "@src/app/hooks";


const StyledBox = styled(Box)({
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
});

export default function UserMenuItem() {
  const { loading, hasLoggedIn, profile, logout } = useAuthenticate();
  const { anchorEl, handleOpen, handleClose } = useMenuHook();

  if ( !hasLoggedIn ) {
    return (
      <StyledBox sx={{ gap: 1 }} className="nav_items_B">
        <Link to="/auth/login">{t`Login`}</Link>
        <UtilsMenu />
      </StyledBox>
    );
  }

  return (
    <>
      <StyledBox className="nav_items_B">
        <UtilsMenu />
        <IconButton onClick={handleOpen} aria-label={t`Profile user name`}>
          <Avatar
            sx={{ width: 24, height: 24 }}
            src={profile?.avatar}
            alt={profile?.username}
          />
        </IconButton>
      </StyledBox>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem component={Link} to="/auth/profile">
          <ListItemIcon>
            <SettingsSharp fontSize="small" />
          </ListItemIcon>
          {t`Profile`}
        </MenuItem>
        <Divider />
        <MenuItem component={Link} to="/auth/dashboard">
          <ListItemIcon>
            <DashboardSharp fontSize="small" />
          </ListItemIcon>
          {t`Dashboard`}
        </MenuItem>
        <MenuItem
          component="div"
          onClick={() => {
            handleClose();
            logout().catch(onApiError);
          }}
        >
          <ListItemIcon>
            <LogoutSharp fontSize="small" />
          </ListItemIcon>
          {t`Logout`}
        </MenuItem>
      </Menu>
      <PLoader fullScreen loading={loading} />
    </>
  );
}
