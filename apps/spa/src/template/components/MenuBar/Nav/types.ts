import { styled } from "@mui/material/styles";

export interface ItemProps {
  to: string;
  label: string;
  slug?: string;
  children?: ItemProps[];
}

export interface BasicNavProps {
  currentLocation: string;
  tree: ItemProps[];
}

export interface DropNavProps extends BasicNavProps {
  mobile?: boolean;
  width?: number | string;
  onNavigate?: (to: string) => void;
}

export interface MenuNavProps {
  currentLocation: string;
  item: ItemProps;
  grow?: boolean;
}


interface SpanProps {
  padding?: number;
  grow?: boolean;
}
export const Span = styled("span", {
  shouldForwardProp: prop => !["padding", "grow"].includes(String(prop)),
})<SpanProps>(({theme, padding, grow}) => ({
  display: "flex",
  flexDirection: "row",
  gap: 0,

  "--dd-offset": "1px",

  ...(grow && {
    flexGrow: 1,
  }),

  "& > a, & > span": {
    padding: theme.spacing(0 === padding ? 0 : (padding || 2)),
    display: "flex",
    whiteSpace: "nowrap",
    flexGrow: 1,
    marginBottom: "calc(-1 * var(--dd-offset))",
    borderBottom: "var(--dd-offset) solid transparent",

    ...(grow && {
      color: theme.palette.primary.contrastText,
      textTransform: "uppercase",
      flexWrap: "wrap",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
    }),
  },

  "& > span.active, & > a.active": {
    color: theme.palette.primary.main,
  },

  "&:hover > a, &:hover > span": {
    ...(grow && {
      color: theme.palette.primary.main,
    }),
  },
}));
