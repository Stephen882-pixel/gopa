import { Outlet } from "react-router-dom";
import { alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";

import Wrapper, { ContentPanel, WidePanel, ToolPanel } from "@src/components/layout";
import CopyrightPanel from "./panel/CopyrightPanel";
import SidePanel from "./panel/SidePanel";
import UtilsMenu from "./menu/UtilsMenu";

export default function AdminLayout() {
  // Some constants
  const menuWidth = 240;
  const appBarHeight = 61;

  // Display the component
  return (
    <Box sx={{ display: "flex" }}>
      <SidePanel width={menuWidth}/>
      <Box
        component="main"
        sx={
          (theme) => ({
            flexGrow: 1,
            overflow: "auto",
            paddingTop: `${appBarHeight}px`,
            [theme.breakpoints.up("md")]: {
              paddingTop: 0,
            }
          })
        }
      >
        <Wrapper type="body">
          <Box sx={{ height: "60px", mb: 2, }} />
          <ContentPanel
            sx={
              (theme) => ({
                padding: theme.spacing(2),
                [theme.breakpoints.up("md")]: {
                  padding: theme.spacing(0, 2, 2, 2),
                }
              })
            }
          >
            <Outlet />
          </ContentPanel>
          <CopyrightPanel/>
          <Wrapper
            sx={
              (theme) => ({
                position: "fixed",
                width: `calc(100% - ${menuWidth}px)`,
                display: { xs: "none", md: "flex" },
                padding: theme.spacing(1.5, 2),
                boxShadow: theme.shadows[4],
                backdropFilter: "blur(24px)",
                zIndex: theme.zIndex.appBar,
                backgroundColor: alpha(theme.palette.background.default, 0.4),

                [theme.breakpoints.up("xl")]: {
                  width: `calc(100% - 15dvw)`,
                },
              })
            }
          >
            <WidePanel />
            <ToolPanel>
              <UtilsMenu />
            </ToolPanel>
          </Wrapper>
        </Wrapper>
      </Box>
    </Box>
  );
}
