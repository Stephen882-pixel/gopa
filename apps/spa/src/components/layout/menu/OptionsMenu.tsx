import * as React from "react";
import { t } from "ttag";

import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import LogoutSharp from "@mui/icons-material/LogoutSharp";
import MoreVertSharp from "@mui/icons-material/MoreVertSharp";

import Link from "@src/components/Link";
import type { ProfileProps } from "@src/app/redux/types";
import MenuButton from "./MenuButton";

type OptionsMenuProps = {
  width: number;
  profile?: ProfileProps | null;
  onLogout?: () => void;
}

export default function OptionsMenu({ width, profile, onLogout } : OptionsMenuProps) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 1,
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        sizes="small"
        alt={profile?.display_name}
        src={profile?.avatar}
        sx={{ width: 36, height: 36 }}
      />
      <Box sx={{ mr: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
          {profile?.display_name} &nbsp;
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {profile?.email}
        </Typography>
      </Box>
      <MenuButton
        aria-label={t`Open Menu`}
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
      >
        <MoreVertSharp />
      </MenuButton>
      <Menu
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleClose}
        onClick={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{
          style: {
            width: width - 50,
          },
       }}
      >
        <MenuItem component={Link} to="/auth/profile">
          <ListItemText inset>{t`Profile`}</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to="/" >
          <ListItemText inset>{t`Portal`}</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem
          onClick={() => {
            handleClose();
            onLogout?.();
          }}
        >
          <ListItemIcon>
            <LogoutSharp fontSize="small" />
          </ListItemIcon>
          <ListItemText>{t`Logout`}</ListItemText>
        </MenuItem>
      </Menu>
    </Stack>
  );
}
