import { useNavigate } from "react-router-dom";
import { t } from "ttag";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

import { TitleText, SmallText } from "@src/components/layout";
import PublicationCard, { PublicationItemProps } from "@src/template/components/Cards/PublicationCard";

import { slugify } from "@src/app/utils";

export default function Publications({items}:{items: Array<PublicationItemProps>}) {
  const navigate = useNavigate();
  return (
    <>
      <Box
        sx={{
          pt: 8,
          pb: 8,
        }}
      >
        <Container
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pb: 2,
          }}
        >
          <Box
            sx={{
              width: "100%",
              textAlign: "center",
            }}
          >
            <TitleText>
              {t`Publications`}
            </TitleText>
            <SmallText>
              {t`A sample list of publications that have been made available on this portal`}
            </SmallText>
          </Box>
        </Container>
        <PublicationCard
          display={{md: 3, lg: 5}}
          publications={items}
          onClick={(publication: any) => navigate(`/public/publication/${slugify(publication.title)}`)}
        />
      </Box>
    </>
  );
}
