import { styled } from "@mui/material/styles";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";

interface StyledCardProps {
  width?: string | number;
}

export const StyledCard = styled(Card, {
  shouldForwardProp: prop => "width" !== prop,
})<StyledCardProps>(({ theme, width }) => ({
  width: "100%",
  padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
    width: width || 500,
  },

  "& img": {
    maxHeight: 150,
    width: "auto",
  },
  "a": {
    color: theme.palette.primary.main,
  },
}));

export const StyledBox = styled(Box)(({theme}) => ({
  ".MuiFormControl-root": {
    marginTop: theme.spacing(2),
  },
}))

export const ButtonBox = styled(Box)(({theme}) => ({
  marginTop: theme.spacing(2),
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "center",

  "button": {
    flexGrow: 0,
  },
  "span": {
    flexGrow: 1,
  },
  "a": {
    color: theme.palette.primary.main,
  },
}));
