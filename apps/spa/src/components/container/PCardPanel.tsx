import Card from "@mui/material/Card";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";

import { WidePanel, ToolPanel } from "@src/components/layout";
import type { PCardPanelProps } from "@src/components/types";

interface StyledToolbarProps {
  isLight?: boolean;
}

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: prop => "isLight" !== prop,
})<StyledToolbarProps>(({ theme, isLight }) => {
  const bgFromColor = alpha(theme.palette.primary.main, 0.96);
  const borderColor = theme.palette.divider;
  return {
    ...(isLight && {
      borderTop: `3px solid ${bgFromColor}`,
      borderBottom: `1px solid ${borderColor}`,
      "hr": { borderColor },
    }),
    ...(!isLight && {
      backgroundImage: `linear-gradient(to bottom, ${bgFromColor}, ${alpha(theme.palette.primary.main, 0.75)})`,
      "hr": {
        borderColor: theme.palette.primary.contrastText
      }
    })
  };
});

interface PaddingProps {
  padding?: number;
}

const Padding = styled("div", {
  shouldForwardProp: prop => "padding" !== prop,
})<PaddingProps>(({ theme, padding }) => ({
  padding: theme.spacing(0 === padding ? 0 : (padding || 1.5))
}));

const CardPanel = styled(Card)(() => ({
  position: "relative",
  width: "100%",
}));

export default function PCardPanel({isLight, padding, title, tools, children}: PCardPanelProps) {
  return (
    <CardPanel>
      <StyledToolbar
        isLight={!!isLight}
        sx={{ pl: 1, pr: 1 }}
      >
        {title && (
          <WidePanel>
            <Typography variant="h6" component="div">
              {title}
            </Typography>
          </WidePanel>
        )}
        {tools && (<ToolPanel>{tools}</ToolPanel>)}
      </StyledToolbar>
      <Padding padding={padding}>{children}</Padding>
    </CardPanel>
  );
}
