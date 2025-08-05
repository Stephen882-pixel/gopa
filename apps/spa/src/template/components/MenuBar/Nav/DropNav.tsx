/**
 * This work was derived from the following sources
 * - https://www.robinwieruch.de/react-nested-dropdown-material-ui-mui/
 * - https://github.com/fireship-io/229-multi-level-dropdown
 */
import * as React from "react";

import { CSSTransition } from "react-transition-group";
import { styled } from "@mui/material/styles";
import ChevronLeftSharp from "@mui/icons-material/ChevronLeftSharp";
import ChevronRightSharp from "@mui/icons-material/ChevronRightSharp";

import Link from "@src/components/Link";
import { getHoverBg } from "@src/app/utils";
import { isActive } from "@src/components/layout/menu/MainMenu";

import { Span, DropNavProps, ItemProps } from "./types";

interface DivProps {
  mobile?: boolean;
  width?: number | string;
  height?: number | string;
}
const Div = styled("div", {
  shouldForwardProp: prop => !["width", "height", "mobile"].includes(String(prop)),
})<DivProps>(({ theme, width, height, mobile }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  flexDirection: "column",
  minWidth: "10dvw",
  maxWidth: width || (mobile ? "50dvw" : "40dvw"),
  height,

  [theme.breakpoints.down("md")]: {
    width: width || (mobile ? "50dvw" : "40dvw"),
  },

  "--speed": "500ms",
  transition: "height var(--speed) ease",
  position: "relative",
  overflow: "hidden",

  "a:hover": {
    backgroundColor: getHoverBg(theme),
  },

  ".menu-primary-enter": {
    // position: "absolute",
    transform: "translateX(-110%)",
  },
  ".menu-primary-enter-active": {
    transform: "translateX(0%)",
    transition: "all var(--speed) ease",
  },
  ".menu-primary-exit": {
    position: "absolute",
  },
  ".menu-primary-exit-active": {
    transform: "translateX(-110%)",
    transition: "all var(--speed) ease",
  },
  ".menu-secondary-enter": {
    transform: "translateX(110%)",
  },
  ".menu-secondary-enter-active": {
    transform: "translateX(0%)",
    transition: "all var(--speed) ease",
  },
  ".menu-secondary-exit": {
  },
  ".menu-secondary-exit-active": {
    transform: "translateX(110%)",
    transition: "all var(--speed) ease",
  },
}));

const Back = styled("span")(({theme}) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexGrow: 1,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: getHoverBg(theme),
  },
}));

const Click = styled("div")(({theme}) => ({
  display: "flex",
  cursor: "pointer",
  padding: theme.spacing(0, 1),
  flexWrap: "wrap",
  alignContent: "center",
  "&:hover": {
    backgroundColor: getHoverBg(theme),
  },
}));

const Block = styled("div")({
  width: "100%",
});


export default function DropNav({ currentLocation, tree, width, mobile, onNavigate } : DropNavProps) {
  const id = "m";
  const ref = React.useRef<null | HTMLDivElement>(null);
  const [activeMenu, setActiveMenu] = React.useState<string>(id);
  const getLinkClass = (children: any, to: any) => {
    const active = children ? isActive(currentLocation, to) : to === currentLocation;
    return active ? "active" : "";
  };

  function showBlock(items: ItemProps[], back: null | string, parent: string) {
    return (
      <>
        <CSSTransition
          in={activeMenu === parent}
          timeout={500}
          classNames="menu-primary"
          unmountOnExit
        >
          <Block>
            {back && (
              <Span>
                <Back onClick={() => setActiveMenu(back)}>
                  <ChevronLeftSharp />
                </Back>
              </Span>
            )}
            {items?.map(({ to, label, children }, index) => (
              <Span key={index}>
                <Link to={to} onClick={() => onNavigate?.(to)} className={getLinkClass(children, to)}>
                  {label}
                </Link>
                {children && (
                  <Click onClick={() => setActiveMenu(`${parent}-${index}`)}>
                    <ChevronRightSharp />
                  </Click>
                )}
              </Span>
            ))}
          </Block>
        </CSSTransition>
        {items?.map(({ children }, index) => (
          <React.Fragment key={index}>
            {children && renderTree(children, parent, `${parent}-${index}`)}
          </React.Fragment>
        ))}
      </>
    );
  }

  const renderTree = (items: ItemProps[], back: null | string, parent: string) => showBlock(items, back, parent);

  return (
    <Div width={width} ref={ref} mobile={mobile}>
      {renderTree(tree, null, id)}
    </Div>
  );
}
