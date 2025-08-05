import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";

import { useLocale } from "@src/app/hooks";
import { useAppSelector } from "@src/app/redux/store";
import { getTheme } from "./init";

export function useMatXConfig() {
  const profile = useAppSelector((state) => state.auth.profile);
  return {
    darkMode: profile?.darkMode || false,
  } as const;
}

export default function MatX({ children }:{ children: React.ReactNode }) {
  const { darkMode } = useMatXConfig();
  const { locale } = useLocale();
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={locale}
    >
      <ThemeProvider theme={getTheme(darkMode)}>
        {children}
      </ThemeProvider>
    </LocalizationProvider>
  );
}
