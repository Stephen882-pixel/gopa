import * as React from "react";

import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ExpandLessSharp from "@mui/icons-material/ExpandLessSharp";
import ExpandMoreSharp from "@mui/icons-material/ExpandMoreSharp";

import NavItem, { NavItemProps } from "./NavItem";

export default function NavBlock({ children, label, to, icon, active } : NavItemProps) {
  const [open, setOpen] = React.useState<boolean>(!!active);
  React.useEffect(() => { setOpen(!!active); }, [active]);
  return (
    <Box>
      <NavItem label={label} icon={icon} active={active} onClick={() => setOpen(!open)}>
        {open ? <ExpandLessSharp /> : <ExpandMoreSharp />}
      </NavItem>
      <Collapse
        in={open}
        timeout="auto"
        sx={(theme) => ({
          paddingLeft: theme.spacing(1.5)
        })}
      >
        {children}
      </Collapse>
    </Box>
  );
}
