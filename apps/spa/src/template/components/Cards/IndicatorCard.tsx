import * as React from "react";

import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { SyledCard, SyledCardContent } from "./RestrictionCard";

interface IndicatorCardProps {
  indicators: any[],
  onClick?: (item: any) => void;
}

export default function IndicatorCard({ indicators, onClick } : IndicatorCardProps) {
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
      {indicators.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
          <SyledCard
            variant="outlined"
            onClick={() => onClick?.(item)}
            onFocus={() => setFocus(index)}
            onBlur={() => setFocus(null)}
            tabIndex={index}
            className={focus === index ? "Mui-focused" : ""}
            sx={{ height: "100%" }}
          >
            <SyledCardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Typography gutterBottom variant="caption" component="div" sx={{ display: "flex" }}>
                {item.display_type}
              </Typography>
              <Typography gutterBottom variant="h6" component="div" sx={style()}>
                {item.brief}
              </Typography>
              <Typography
                sx={style(3)}
                variant="body2"
                color="text.secondary"
                gutterBottom
              >
                {item.description}
              </Typography>
            </SyledCardContent>
          </SyledCard>
        </Grid>
      ))}
    </Grid>
  );
}
