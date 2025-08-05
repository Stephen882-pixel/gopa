import { t } from "ttag";

import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export interface AuthorProps {
  name: string;
  avatar: string;
}

interface AuthorCardProps {
  authors: AuthorProps[];
  stamp?: number | string;
}

export default function AuthorCard({ stamp, authors }: AuthorCardProps) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 2,
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px",
      }}
      className="restriction_card_box_outer"
    >
      <Box
        sx={{ display: "flex", flexDirection: "row", gap: 1, alignItems: "center" }}
        className="restriction_card_box"
      >
        <AvatarGroup max={3} className="restriction_card">
          {authors.map((author, index) => (
            <Avatar
              key={index}
              alt={author.name}
              src={author.avatar}
              sx={{ width: 24, height: 24 }}
               className="restriction_card_avatar"
            />
          ))}
        </AvatarGroup>
        <Typography variant="caption" className="restriction_card_authors">
          {authors.map((author) => author.name).join(", ")}
        </Typography>
      </Box>
      <Typography variant="caption" className="restriction_card_date">{t`Introduced In`} {stamp || "July 14, 2021"}</Typography>
    </Box>
  );
}
