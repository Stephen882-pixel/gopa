import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

import { WidePanel, ToolPanel } from "@src/components/layout";
import AuthorCard, {AuthorProps} from "./AuthorCard";

interface SectorProps {
  id: number;
  label: string;
}

interface CountryProps {
  iso: string;
  name: string;
  capital: string;
}

export interface RestrictionItemProps {
  sector: SectorProps;
  country: CountryProps;
  year_introduced: number;
  type_of_measure_i18n: string;
  text_of_measure_i18n: string;
  authors: Array<AuthorProps>;
}

interface RestrictionProps {
  restrictions: RestrictionItemProps[];
  onClick?: (restriction: RestrictionItemProps) => void;
}

export const SyledCard = styled(Card)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: 0,
  height: "100%",
  "&:hover": {
    boxShadow: theme.shadows[2],
    cursor: "pointer",
  },
  "&:focus-visible": {
    outline: "3px solid",
    outlineColor: "hsla(210, 98%, 48%, 0.5)",
    outlineOffset: "2px",
  },
}));

export const SyledCardContent = styled(CardContent)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  padding: 16,
  flexGrow: 1,
  "&:last-child": {
    paddingBottom: 16,
  },
});

export default function RestrictionCard({restrictions, onClick} : RestrictionProps) {
  const [focus, setFocus] = React.useState<number | null>(null);
  const style = (clamp?: number) => ({
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: clamp || 2,
    overflow: "hidden",
    textOverflow: "ellipsis",
  });

  return (
    <Grid container spacing={2}>
      {restrictions.map((restriction, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <SyledCard
            variant="outlined"
            onClick={() => onClick?.(restriction)}
            onFocus={() => setFocus(index)}
            onBlur={() => setFocus(null)}
            tabIndex={index}
            className={focus === index ? "Mui-focused" : ""}
            sx={{ height: "100%" }}
          >
            <SyledCardContent
              className="rc_0"
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Typography gutterBottom variant="caption" component="div" sx={{ display: "flex" }} className="rc_1">
                <WidePanel>{restriction.sector.label}</WidePanel>
                <ToolPanel>{restriction.country.name}</ToolPanel>
              </Typography>
              <Typography gutterBottom variant="h6" component="div" sx={style()} className="rc_2">
                {restriction.type_of_measure_i18n}
              </Typography>
              <Typography
                 className="rc_3"
                sx={style(3)}
                variant="body2"
                color="text.secondary"
                gutterBottom
              >
                {restriction.text_of_measure_i18n}
              </Typography>
            </SyledCardContent>
            <AuthorCard authors={restriction.authors || []} stamp={restriction.year_introduced} />
          </SyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
