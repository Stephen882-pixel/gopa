import * as React from "react";
import { alpha } from "@mui/material/styles";

import ListItem from "@mui/material/ListItem";
import ListItemText, { listItemTextClasses } from "@mui/material/ListItemText";
import ListItemIcon, { listItemIconClasses } from "@mui/material/ListItemIcon";
import PanoramaFishEyeSharp from "@mui/icons-material/PanoramaFishEyeSharp";
import AdjustSharp from "@mui/icons-material/AdjustSharp";

import Link from "@src/components/Link";
import { NavProps } from "./nav";

export type NavItemProps = Pick<NavProps, "label" | "to" | "icon"> & {
  children?: React.ReactNode;
  active: boolean;
  onClick?: () => void;
}

export default function NavItem({ children, label, to, icon, active, onClick } : NavItemProps) {
  const width = 30;
  return (
    <ListItem
      {...(!!to && {to, component: Link})}
      {...(!to && {component: "div"})}
      onClick={() => onClick?.()}
      sx={(theme) => ({
        [`& .${listItemTextClasses.inset}`]: {
          paddingLeft: `${width}px`,
        },
        [`& .${listItemIconClasses.root}`]: {
          minWidth: `${width}px`,
        },

        ...("sub" !== icon && !!active && {
          bgcolor: alpha(theme.palette.grey["500"], 0.2),
        }),

        "&::before": {
          right: 0, top: 0,
          content: '""',
          position: "absolute",
          display: "inline-block",
          width: "4px",
          height: "100%",
        },

        "&:hover": {
          ...("sub" !== icon && {
            bgcolor: alpha(theme.palette.primary.main, 0.2),
          }),

          ...("sub" === icon && {
            [`& .${listItemIconClasses.root}`]: {
              color: theme.palette.primary.main,
            },
          }),

          cursor: "pointer",
          "&::before": {
            bgcolor: theme.palette.primary.main,
          },
        },
      })}
    >
      {icon && <ListItemIcon> {"sub" === icon ? (!!active ? <AdjustSharp /> : <PanoramaFishEyeSharp />) : icon} </ListItemIcon>}
      <ListItemText inset={!icon}>{label}</ListItemText>
      {children}
    </ListItem>
  );
}
