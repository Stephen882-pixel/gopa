import * as React from "react";
import Container from "@mui/material/Container";

import { TitleText, SmallText } from "@src/components/layout";
import BannerBox, { BgImageProps } from "../Box/BannerBox";

interface HeroPanelProps {
  title: string | React.ReactNode;
  brief?: string | React.ReactNode;
  small?: boolean;
  bg?: BgImageProps;
  transparent?: boolean;
  className?: string;
}

export default function HeroPanel({title, brief, small, bg, transparent} : HeroPanelProps) {

  return (
    <BannerBox transparent={transparent} bg={bg}>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "left",
          pt: !!small ? { xs: 5 } : { xs: 8, sm: 12 },
          pb: !!small ? { xs: brief ? 3 : 1 } : { xs: 8, sm: 12 },
        }}
      >
        <TitleText>
          {title}
        </TitleText>
        {brief && (
          <SmallText>
            {brief}
          </SmallText>
        )}
      </Container>
    </BannerBox>
  );
}
