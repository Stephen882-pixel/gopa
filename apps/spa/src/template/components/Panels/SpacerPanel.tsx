import { styled } from "@mui/material/styles";

const Spacer = styled("div")(({ theme }) => ({
  minHeight: "64px",
  [theme.breakpoints.up("md")]: {
    minHeight: "128px",
  },
}));

export const SpacerWrapper = styled("div")(({ theme }) => ({
  padding: "8px",
  [theme.breakpoints.up("sm")]: {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

export default function SpacerPanel() {
  return (<SpacerWrapper><Spacer /></SpacerWrapper>);
}
