import Typography, { TypographyProps } from "@mui/material/Typography";
import { styled, alpha } from "@mui/material/styles";

interface PanelProps {
  align?: "start" | "center" | "end";
}

export const WidePanel = styled("div", {
  shouldForwardProp: prop => "align" !== prop && "sx" !== prop,
})<PanelProps>(({ theme, align }) => ({
  alignItems: `${align || "center"}`,
  flex: "1 1 100%",
}));

export const TitleText = styled(Typography)<TypographyProps>({
  alignItems: "center",
  fontSize: "2.5rem",
  fontWeight: 700,
});
export const PaperTitleText = styled(Typography)<TypographyProps>({
  alignItems: "center",
  fontSize: "1.8rem",
});

export const SmallText = styled(Typography)<TypographyProps>({
  color: "text.secondary"
});

export const scrollSX = (theme: any, scope?: string) => ({
  [`${"children" === scope ? "*" : "&"}::-webkit-scrollbar`]: {
    backgroundColor: "transparent",
    width: 5,
  },
  [`${"children" === scope ? "*" : "&"}::-webkit-scrollbar-thumb`]: {
    backgroundColor: alpha(theme.palette.text.primary, 0.75),
    borderRadius: 5,
  },
});

interface ToolTitleProps {
  title: string;
  brief?: string;
}

export function ToolTitle({ title, brief } : ToolTitleProps) {
  return (
    <>
      <Typography component="span" sx={{ fontSize: "1.5rem" }}>
        {title}
      </Typography>
      {brief && (
        <>
          &nbsp;
          <Typography component="span" sx={{ color: "text.secondary" }}>
            {brief}
          </Typography>
        </>
      )}
    </>
  )
}

interface ToolPanelProps extends PanelProps {
  gap?: number;
}

export const ToolPanel = styled("div", {
  shouldForwardProp: prop => "align" !== prop && "gap" !== prop && "sx" !== prop,
})<ToolPanelProps>(({ theme, align, gap }) => ({
  alignItems: `${align || "center"}`,
  paddingLeft: 5,
  whiteSpace: "nowrap",
  display: "flex",
  gap: gap || 5,
}));

export const ContentPanel = styled("div")(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
}));

type WrapperProps = {
  type?: "body" | "toolbar";
};

export default styled("div", {
  shouldForwardProp: prop => "type" !== prop && "sx" !== prop,
})<WrapperProps>(({ theme, type }) => ({
  display: "flex",
  ...("body" === type && {
    flexDirection: "column",
    minHeight: "100vh",
  }),
}));
