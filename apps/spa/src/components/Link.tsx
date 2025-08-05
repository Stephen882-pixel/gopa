import { Link } from "react-router";
import { styled } from "@mui/material/styles";

export default styled(Link)(({ theme }) => ({
  color: theme.palette.text.primary,
  textDecoration: "none",
}));
