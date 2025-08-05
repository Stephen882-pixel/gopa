import { blue } from "@mui/material/colors";
import { createTheme } from "@mui/material";
import { textLight, textDark, bgPalette } from "./colors";
import { components } from "./components";
import { typography } from "./primitives";

export function getTheme(prefersDarkMode: boolean) {
  const mode = prefersDarkMode ? "dark" : "light";

  // https://github.com/mui/material-ui/blob/f5efa42ccd5af18f0a974c8dab034d5546f4690e/packages/mui-material/src/OutlinedInput/OutlinedInput.js
  const divider = "dark" === mode
    ? "rgba(255, 255, 255, 0.25)"
    : "rgba(0, 0, 0, 0.15)";

  return createTheme({
    components: components(divider),
    typography,
    palette: {
      mode, divider,
      primary: blue,
      text: "light" === mode ? textLight : textDark,
      background: bgPalette[mode],
    },
  });
}
