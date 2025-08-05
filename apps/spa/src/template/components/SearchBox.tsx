import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import InputAdornment from "@mui/material/InputAdornment";
import SearchSharp from "@mui/icons-material/SearchSharp";

import { getHoverBg } from "@src/app/utils";
import { useMatXConfig } from "@src/components/theme";

interface StyledSearchBoxProps {
  isDark?: boolean;
}

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: prop => "isDark" !== prop,
})<StyledSearchBoxProps>(({ theme, isDark }) => ({
  backgroundColor: getHoverBg(theme, isDark),
  padding: theme.spacing(1, 0, 1, 2),
  width: "100%",
}));

interface SearchBoxProps {
  onChange?: (val: string) => void;
}

export default function SearchBox({ onChange } : SearchBoxProps) {
  const { darkMode } = useMatXConfig();
  return (
    <StyledInputBase
      isDark={darkMode}
      placeholder={t`Search`}
      inputProps={{ "aria-label": t`search` }}
      endAdornment={
        <InputAdornment position="start">
          <SearchSharp />
        </InputAdornment>
      }
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => onChange?.(event.target.value as string)}
    />
  );
}
