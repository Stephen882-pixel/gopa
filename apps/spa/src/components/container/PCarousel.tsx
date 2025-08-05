/**
 * This component has been derived from:
 * https://examples.motion.dev/react/scroll-container
 */
import * as React from "react";
import { t } from "ttag";
import debounce from "lodash/debounce";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeftSharp";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRightSharp";
import { styled } from "@mui/material/styles";
import { motion } from "motion/react";

import type { PCarouselProps } from "@src/components/types";

type WrapperProps = Pick<PCarouselProps, "display" | "pad">;

const Wrapper = styled("div", {
  shouldForwardProp: prop => "display" !== prop && "pad" !== prop,
})<WrapperProps>(({ theme, display, pad }) => ({
  width: "100%",
  position: "relative",
  margin: "0 auto",
  overflow: "hidden",

  "& ul": {
    display: "flex",
    listStyle: "none",
    minHeight: "300px",
    padding: `${pad}px ${pad}px ${pad}px 0`,
    margin: "0",
  },

  "& ul > li": {
    flex: `0 0 calc(${100 / (display?.xs || 2)}% - ${pad}px)`,
    marginLeft: `${pad}px`,
    background: "var(--accent)",
    ...(display?.sm && {
      [theme.breakpoints.up("sm")]: {
        flex: `0 0 calc(${100 / display?.sm}% - ${pad}px)`
      }
    }),
    ...(display?.md && {
      [theme.breakpoints.up("md")]: {
        flex: `0 0 calc(${100 / display?.md}% - ${pad}px)`
      }
    }),
    ...(display?.lg && {
      [theme.breakpoints.up("lg")]: {
        flex: `0 0 calc(${100 / display?.lg}% - ${pad}px)`
      }
    }),
  },
}));

export default function PCarousel({ display, pad, children } : PCarouselProps) {
  const [ul, setUL] = React.useState<HTMLUListElement | null>(null);
  const [dragProps, setDragProps] = React.useState({});
  const [start, setStart] = React.useState<boolean>(false);
  const [end, setEnd] = React.useState<boolean>(false);
  const [x, setX] = React.useState<number>(0);

  function calc(step: number, ref: HTMLUListElement | null) {
    if ( null === ref || 0 === (ref?.children.length || 0) ) {
      return {steps: 0, move: 0, limit: 0, shift: 0};
    }

    const li = (ref?.firstChild as HTMLLIElement).getBoundingClientRect() as DOMRect;
    const ul = ref?.getBoundingClientRect() as DOMRect;
    const c = (pad || 20) + li.width;

    const display = Math.floor((ul?.width - (pad || 20)) / c);
    const steps = (ref?.children.length || 0) - display;
    const move = step * c;
    const limit = -1 * steps * c;

    let shift = 0;
    if ( 0 > steps ) {
      shift = Math.floor((-1 * steps * c) / 2);
    }

    return {steps, move, limit, shift};
  }

  function paginate(step: number) {
    const { steps, move, limit } = calc(step, ul);

    // When there is no need to move
    if ( 0 >= steps ) {
      return;
    }

    // Right move limit
    if ( 0 <= (x + move) ) {
      setStart(true);
      setEnd(false);
      setX(0);
    }
    // Left move limit
    else if ( limit >= (x + move) ) {
      setStart(false);
      setEnd(true);
      setX(limit);
    }
    // Normal case
    else {
      if ( start ) { setStart(false); }
      if ( end ) { setEnd(false); }
      setX(x + move);
    }
  }

  function onResize(ref: HTMLUListElement | null) {
    const { steps, limit, shift } = calc(1, ref);
    setStart(true);
    if ( 0 < steps ) {
      setEnd(false);
      setDragProps({
        drag: "x",
        dragConstraints: {left: limit, right: 0},
        // https://motion.dev/docs/react-animate-presence#changing-key
        // onDragEnd: (event: any, info: any) => {
        //   const swipeConfidenceThreshold = 10000;
        //   const swipe = Math.abs(info?.offset?.x) * info?.velocity?.x;
        //   if (swipe < -swipeConfidenceThreshold) {
        //     paginate(1);
        //   }
        //   else if (swipe > swipeConfidenceThreshold) {
        //     paginate(-1);
        //   }
        // },
      });
    }
    else {
      setDragProps({});
      setEnd(true);
      setX(shift);
    }
  }

  // https://stackoverflow.com/a/19014495
  React.useLayoutEffect(() => {
    const resize = debounce(() => onResize(ul), 300);
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [ul]);

  return (
    <>
      <Wrapper display={display} pad={pad || 20}>
        <motion.ul
          {...dragProps}
          animate={{ x }}
          ref={(ref) => { onResize(ref); setUL(ref) }}
        >
          {children}
        </motion.ul>
        <Container
          sx={{
            display: "flex",
            justifyContent: "right",
            gap: 2
          }}
        >
          <IconButton aria-label={t`Previous`} disabled={start} onClick={() => paginate(1)}>
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton aria-label={t`Next`} disabled={end} onClick={() => paginate(-1)}>
            <KeyboardArrowRight />
          </IconButton>
        </Container>
      </Wrapper>
    </>
  );
}
