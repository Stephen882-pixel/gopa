import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";

import Link from "@src/components/Link";
import { getHoverBg } from "@src/app/utils";
import { isActive } from "@src/components/layout/menu/MainMenu";

import DropNav from "./DropNav";
import { ItemProps, MenuNavProps, Span } from "./types";

const Block = styled("span")(({theme}) => ({
  cursor: "pointer",
  color: theme.palette.text.primary,
}));

const RelativeSpan = styled(Span)(({theme}) => ({
  position: "relative",

  "&:hover": {
    ".MuiPaper-root": {
      display: "block",
    },
  },
}));

const PaperMenu = styled(Paper)(({theme}) => ({
  position: "absolute",
  top: "calc(100% + var(--dd-offset))",
  right: theme.spacing(-2),
  display: "none",
}));

const Triangle = styled("div")(({theme}) => ({
  position: "absolute",
  top: -7,
  right: 24,
  // https://css-tricks.com/snippets/css/css-triangle/
  width: 0,
  height: 0,
  borderLeft: "5px solid transparent",
  borderRight: "5px solid transparent",
  borderBottom: `7px solid ${getHoverBg(theme)}`,
}))

export default function MenuNav({ currentLocation, item, grow } : MenuNavProps) {
  const active = isActive(currentLocation, item.to);
  const hasChildren = item.children && 0 < item.children.length;
  return (
    <RelativeSpan className="nav-menu-1" grow={grow}>
      {!hasChildren && <Link className={active ? "active" : ""} to={item.to}>{item.label}</Link>}
      {hasChildren && (
        <>
          <Block className={active ? "active" : ""}>{item.label}</Block>
          <PaperMenu className="karatasi">
            <Triangle />
            <DropNav
              currentLocation={currentLocation}
              tree={item.children as ItemProps[]}
              width="20dvw"
            />
          </PaperMenu>
        </>
      )}
    </RelativeSpan>
  );
}
