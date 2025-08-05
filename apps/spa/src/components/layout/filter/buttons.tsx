import { styled } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";

interface StyledIconButtonProps {
  active?: boolean;
}

export const StyledIconButton = styled(IconButton, {
  shouldForwardProp: prop => "active" !== prop,
})<StyledIconButtonProps>(({theme, active}) => ({
  ...(active && {
    color: theme.palette.text.primary,
    backgroundColor: theme.palette.divider,
  }),
}));
