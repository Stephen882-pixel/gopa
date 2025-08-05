import * as React from "react";
import { ThemeProvider } from "@mui/material";
import Box from "@mui/material/Box";

import { TitleText, SmallText } from "@src/components/layout";
import { getTheme } from "@src/components/theme/init";

import WrapperBox from "../Box/WrapperBox";

interface HomeThemeProviderProps {
  children: React.ReactNode;
  useTheme?: boolean;
}

function HomeThemeProvider({children, useTheme}: HomeThemeProviderProps) {
  return !!useTheme
    ? <ThemeProvider theme={getTheme(!!useTheme)}>{children}</ThemeProvider>
    : <>{children}</>;
}

interface HomePanelProps extends HomeThemeProviderProps {
  title?: string | React.ReactNode;
  brief?: string | React.ReactNode;
  wide?: boolean;
  pt?: number;
  pb?: number;
};

export default function HomePanel({children, useTheme, title, brief, wide, pt, pb}: HomePanelProps) {
  return (
    <HomeThemeProvider useTheme={useTheme}>
      <Box
        sx={(theme) => ({
          position: "relative",
          pt: 0 === pt ? 0 : pt || 4,
          pb: 0 === pb ? 0 : pb || 8,
          ...(!!useTheme && {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.text.primary,
          }),
        })}
      >
        <WrapperBox wide={wide}>
          {title && (
            <Box
              sx={{
                width: "100%",
                textAlign: "center",
              }}
            >
              <TitleText>
                {title}
              </TitleText>
              {brief && (
                <SmallText variant="body1">
                  {brief}
                </SmallText>
              )}
            </Box>
          )}
          {children}
        </WrapperBox>
      </Box>
    </HomeThemeProvider>
  );
}
