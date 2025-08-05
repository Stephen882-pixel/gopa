import * as React from "react";
import { t } from "ttag";

import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

import CloseSharp from "@mui/icons-material/CloseSharp";

interface DrawerContentProps {
  children: React.ReactNode;
}

export function DrawerContent({ children } : DrawerContentProps) {
  return (
    <Box
      sx={
        (theme) => ({
          display: "flex",
          flexGrow: 1,
          flexDirection: "column",
          width: "100dvw",
          padding: theme.spacing(2),
          [theme.breakpoints.up("sm")]: {
            width: "70dvw",
          },
          [theme.breakpoints.up("lg")]: {
            width: "50dvw",
          },
        })
      }
    >
      {children}
    </Box>
  );
}

export function DrawerTools({ children } : DrawerContentProps) {
  return (
    <Box
      sx={
        (theme) => ({
          display: "flex",
          gap: theme.spacing(2),
          padding: theme.spacing(2),
        })
      }
    >
      {children}
    </Box>
  );
}

interface DrawerBoxProps extends DrawerContentProps {
  open: boolean;
  onClose?: () => void;
}

export default function DrawerBox({ children, open, onClose } : DrawerBoxProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={() => onClose?.()}
      sx={
        (theme) => ({
          "&.MuiPaper-root": {
            backgroundColor: theme.palette.background.paper,
          },
        })
      }
    >
      <Typography
        component="span"
        sx={
          (theme) => ({
            padding: theme.spacing(1, 1, 1, 2),
          })
        }
      >
        <Tooltip title={t`Close`} placement="right">
          <IconButton aria-label={t`Close`} onClick={() => onClose?.()}>
            <CloseSharp />
          </IconButton>
        </Tooltip>
      </Typography>
      <Divider />
      {children}
    </Drawer>
  );
}
