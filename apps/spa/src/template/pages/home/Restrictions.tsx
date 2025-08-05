// import { useNavigate } from "react-router-dom";
// import { styled } from "@mui/material/styles";
import { t } from "ttag";

// import Button from "@mui/material/Button";
// import Card from "@mui/material/Card";
// import Grid from "@mui/material/Grid";

// import Grid from "@mui/material/Grid2";

// import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import Link from "@src/components/Link";
import HomePanel from "@src/template/components/Panels/HomePanel";

// const StyledTypography = styled(Typography)({
//   display: "-webkit-box",
//   WebkitBoxOrient: "vertical",
//   WebkitLineClamp: 2,
//   overflow: "hidden",
//   textOverflow: "ellipsis",
// });

// const CenteredGrid = styled(Grid)({
//   display: "flex",
//   justifyContent: "center",
//   width: "100%",
// });

export default function Restrictions({items}: {items: Array<any>}) {
  // const navigate = useNavigate();
  return (
    <HomePanel>

      <Typography className="heading-2">
        {t`Restrictions`}
      </Typography>

      <Typography className="sub-heading-1">
        {t`Explore restrictions by sector in the EAC`}
      </Typography>

      <div className="sector-group">
        <div className="sector-item">
        <Link className="card-style-2" to="/public/browse">
          {t`Explore All Sectors`}
        </Link>
        </div>
        {items.map((item, index) => (
          <div key={index} className="sector-item">
          <Link className="card-style-2" to={`/public/browse/${item.slug}`} key={index}>
            {item.label}
          </Link>
          </div>
        ))}
      </div>


    </HomePanel>
  );
}
