import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";

import type { ErrorBoxProps } from "@src/components/types";

const FlexBox = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
}));

const JustifyBox = styled(FlexBox)(() => ({
  maxWidth: 320,
  flexDirection: "column",
  justifyContent: "center",
  textAlign: "center",
  "& h2": {
    fontSize: "1.5rem",
    marginBottom: 0,
  },
  "& p": {
    marginBottom: "1rem"
  }
}));

interface NotFoundBoxProps {
  mode?: string;
}

const NotFoundBox = styled(FlexBox, {
  shouldForwardProp: prop => "mode" !== prop,
})<NotFoundBoxProps>(({ theme, mode }) => ({
  width: "100%",
  justifyContent: "center",
  ...(("default" === mode) && {
    height: "100vh !important",
  }),
  ...("fill" === mode && {
    flexGrow: 1,
    flexDirection: "column",
  }),
  ...("simple" === mode && {
    minHeight: "20vh"
  }),
}));

export default function ErrorBox({children, mode}: ErrorBoxProps) {
  return (
    <NotFoundBox mode={mode || "default"}>
      <JustifyBox>
        {children}
      </JustifyBox>
    </NotFoundBox>
  );
}
