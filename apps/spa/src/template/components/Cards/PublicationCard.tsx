import * as React from "react";

import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import PCarousel from "@src/components/container/PCarousel";
import type { PCarouselProps } from "@src/components/types";
import AuthorCard, {AuthorProps} from "./AuthorCard";
import { SyledCard, SyledCardContent } from "./RestrictionCard";

const StyledTypography = styled(Typography)({
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

export type PublicationItemProps = {
  img: string;
  tag: string;
  title: string;
  description: string;
  authors: Array<AuthorProps>;
};

type PublicationProps = Pick<PCarouselProps, "display"> & {
  publications: Array<PublicationItemProps>;
  onClick?: (publication: PublicationItemProps) => void;
};

export default function PublicationCard({ display, publications, onClick }: PublicationProps) {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null,
  );

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  return (
    <PCarousel display={display}>
      {publications.map((publication, index) => (
        <li key={index}>
          <SyledCard
            variant="outlined"
            onClick={() => onClick?.(publication)}
            onFocus={() => handleFocus(index)}
            onBlur={handleBlur}
            tabIndex={index}
            className={focusedCardIndex === index ? "Mui-focused" : ""}
            sx={{ height: "100%" }}
          >
            <CardMedia
              component="img"
              alt="green iguana"
              image={publication.img}
              sx={{
                aspectRatio: { sm: "16 / 9", md: "" },
              }}
            />
            <SyledCardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Typography gutterBottom variant="caption" component="div">
                {publication.tag}
              </Typography>
              <Typography gutterBottom variant="h6" component="div">
                {publication.title}
              </Typography>
              <StyledTypography
                variant="body2"
                color="text.secondary"
                gutterBottom
              >
                {publication.description}
              </StyledTypography>
            </SyledCardContent>
            <AuthorCard authors={publication.authors} />
          </SyledCard>
        </li>
      ))}
    </PCarousel>
  );
}
