import * as React from "react";

import Box from "@mui/material/Box";
import Container from "@mui/material/Container";

interface WrapperBoxProps {
  children: React.ReactNode;
  wide?: boolean;
}

export default function WrapperBox({children, wide}: WrapperBoxProps) {
  const style = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 3,
  };
  return true === wide
    ? <Box sx={style}>{children}</Box>
    : <Container sx={style}>{children}</Container>;
}
