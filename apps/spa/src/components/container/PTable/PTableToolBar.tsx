import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import InputBase from "@mui/material/InputBase";
import SearchSharp from "@mui/icons-material/SearchSharp";

import { getHoverBg } from "@src/app/utils";
import { usePTableToolbarFilterHook } from "./hooks";

import type { PTableToolBarProps } from "@src/components/types";

interface StyledInputBaseProps {
  isLight?: boolean;
}

const StyledInputBase = styled(InputBase, {
  shouldForwardProp: prop => "isLight" !== prop,
})<StyledInputBaseProps>(({ theme, isLight }) => ({
  backgroundColor: getHoverBg(theme, !isLight),
  padding: theme.spacing(1),
  borderRadius: "5px",
  // https://mui.com/material-ui/react-app-bar/#app-bar-with-search-field
  "& .MuiInputBase-input": {
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: "20ch",
      "&:focus": {
        width: "30ch",
      },
    },
  },
}));

export default function PTableToolBar({ isLight, searchLength = 2, onFilter, extraToolbar }:PTableToolBarProps) {
  const { filter, updateFilter } = usePTableToolbarFilterHook(onFilter);
  return (
    <>
      <StyledInputBase
        isLight={isLight}
        placeholder={t`Search`}
        startAdornment={
          <InputAdornment position="start">
            <SearchSharp />
          </InputAdornment>
        }
        onChange={(event) => {
          const search = String(event.currentTarget.value || "").trim();
          updateFilter({
            search: searchLength <= search.length ? search : "",
            rawText: event.currentTarget.value,
          });
        }}
      />
      <Divider sx={{ height: 30, m: 0.5 }} orientation="vertical" />
      {extraToolbar && extraToolbar({filter, onFilter: updateFilter})}
    </>
  );
}
