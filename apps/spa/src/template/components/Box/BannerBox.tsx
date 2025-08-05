import * as React from "react";
import { alpha } from "@mui/material/styles";

import Box from "@mui/material/Box";

import { useMatXConfig } from "@src/components/theme";

export interface BgImageProps {
  url: string | string[];
  interval?: number;
  attachment?: "fixed" | "scroll";
}

interface BannerBoxProps {
  children: React.ReactNode;
  transparent?: boolean;
  bg?: BgImageProps;
}

export default function BannerBox({children, transparent, bg}:BannerBoxProps) {
  const [index, setIndex] = React.useState<number>(0);
  const { darkMode } = useMatXConfig();

  const trim = (s: any) => String(s || "").trim().replace("<scheme>", (true === darkMode ? "dark" : "light"));
  const urls = (Array.isArray(bg?.url) ? bg?.url.map((u) => trim(u)) : [trim(bg?.url)]).filter((s) => s);
  const ref = React.useRef<number>(0);

  React.useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    function loadSlide() {
      if ( 1 >= urls.length ) {
        return;
      }

      const sleep = (bg?.interval || 10) * 1000;
      timer = setTimeout(() => {
        ref.current = ref.current === (urls.length - 1) ? 0 : ref.current + 1;
        setIndex(ref.current);
        loadSlide();
      }, sleep);
    }

    loadSlide();
    return () => {
      clearTimeout(timer);
    };
  }, [darkMode]);

  return (
    <Box
      sx={
        (theme) => ({
          width: "100%",
          ...(!transparent && {
            backgroundColor: alpha(theme.palette.primary.main, 0.3),
          }),
          ...(!!transparent && {
            borderBottom: `1px solid ${theme.palette.divider}`,
          }),
          ...(urls[index] && {
            backgroundSize: "cover",
            backgroundImage: `url(${urls[index]})`,
            backgroundAttachment: bg?.attachment || "fixed",
            ...(1 < urls.length && {
              webkitTransition: "background-image 1s ease-in-out",
              transition: "background-image 1s ease-in-out",
            }),
          }),
        })
      }
    >
      {/* https://stackoverflow.com/a/61577004/3003786 */}
      {/* https://stackoverflow.com/a/54096241/3003786 */}
      {1 < urls.length && urls.map((u, i) => <link key={i} rel="preload" as="image" href={u} />)}
      {children}
    </Box>
  );
}
