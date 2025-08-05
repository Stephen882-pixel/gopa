import * as React from "react";
import { keyframes, styled, alpha } from "@mui/material/styles";

import CircularProgress from "@mui/material/CircularProgress";

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

interface PLoaderProps {
  loading: boolean;
  fullScreen?: boolean;
}

const OverlayPanel = styled("div", {
  shouldForwardProp: prop => "loading" !== prop && "fullScreen" !== prop,
})<PLoaderProps>(({ theme, loading, fullScreen }) => ({
  top: 0,
  left: 0,
  width: "100%",
  height: true === fullScreen ? "100vh" : "100%",
  position: true === fullScreen ? "fixed" : "absolute",
  display: "flex",
  flexDirection: "row",
  zIndex: theme.zIndex.tooltip + 1,
  backgroundColor: alpha(theme.palette.background.paper, 0.5),
  animation: loading
    ? `${fadeIn} 0.5s cubic-bezier(0.390, 0.575, 0.565, 1.000) both`
    : `${fadeOut} 0.5s ease-out both`,
}));

const CenterDiv = styled("div")({
  width: "100%",
  height: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

export default function PLoader({loading, fullScreen}: PLoaderProps) {
  const [show, setShow] = React.useState(loading);

  React.useEffect(() => {
    if ( loading ) {
      setShow(true);
    }
    else {
      setTimeout(() => setShow(false), 700);
    }
  }, [loading]);

  if ( !show ) {
    return <></>;
  }

  return (
    <OverlayPanel fullScreen={fullScreen} loading={loading}>
      <CenterDiv>
        <CircularProgress color="inherit" />
      </CenterDiv>
    </OverlayPanel>
  );
}
