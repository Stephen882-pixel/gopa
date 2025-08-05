import { styled } from "@mui/material/styles";

import type { PNotchProps } from "@src/components/types";

interface PNotchHiddenInputProps {
  position?: "absolute" | "relative";
}

export const PNotchHiddenInput = styled("input", {
  shouldForwardProp: prop => "position" !== prop,
})<PNotchHiddenInputProps>(({theme, position}) => ({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: position || "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
}));

interface RootProps {
  error?: boolean;
}

const Root = styled("div", {
  shouldForwardProp: prop => "error" !== prop,
})<RootProps>(({theme, error}) => ({
  padding: theme.spacing(1),
  borderRadius: theme.spacing(0.5),
  position: "relative",

  "fieldset": {
    border: `1px solid ${error ? theme.palette.error.main : theme.palette.divider}`,
  },
  "legend": {
    color: error ? theme.palette.error.main : theme.palette.text.secondary,
  },

  "&:hover": {
    "fieldset": {
      borderColor: error ? theme.palette.error.main : theme.palette.text.primary,
    },
    "legend": {
      color: error ? theme.palette.error.main : theme.palette.text.primary,
    },
  },
}));

const NotchedOutlineRoot = styled("fieldset")({
  textAlign: "left",
  position: "absolute",
  bottom: 0,
  right: 0,
  top: -10,
  left: 0,
  margin: 0,
  padding: "0 8px",
  pointerEvents: "none",
  borderRadius: "inherit",
  borderStyle: "solid",
  borderWidth: 1,
  overflow: "hidden",
  minWidth: "0%",
});

const NotchedOutlineLegend = styled("legend")({
  float: "unset",
  width: "auto",
  overflow: "hidden",
  display: "block",

  "span": {
    padding: "0 5px",
    fontSize: "0.75em",
    height: "18px",
    display: "block",
  }
});


export default function PNotch({children, label, error}:PNotchProps) {
  return (
    <Root error={!!error}>
      {children}
      <NotchedOutlineRoot>
        <NotchedOutlineLegend>
          <span>{label}</span>
        </NotchedOutlineLegend>
      </NotchedOutlineRoot>
    </Root>
  );
}
