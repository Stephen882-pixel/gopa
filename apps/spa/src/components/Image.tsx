import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/material/styles";
import { t } from "ttag";

type StyledImageProps = {
  width?: number | "fill";
  flag?: string;
};

const StyledImage = styled("img", {
  shouldForwardProp: prop => "width" !== prop && "flag" !== prop,
})<StyledImageProps>(({ theme, flag, width }) => ({
  display: "ok" === flag ? "block" : "none",
  ...(width && {
    width: "fill" === width ? "100%" : `${width}px`,
    height: "auto",
  }),
}));

const StyledError = styled("div", {
  shouldForwardProp: prop => "width" !== prop,
})<StyledImageProps>(({ theme, width }) => {
  const borderColor = theme.palette.divider;
  return {
    width: "fill" === width ? "120px" : `${width || 120}px`,
    height: "fill" === width ? "120px" : `${width || 120}px`,
    color: borderColor,
    border: "1px solid",
    borderColor,
    ...("fill" === width && {
      margin: "0px auto",
    }),
    // https://stackoverflow.com/a/6490283
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  };
});

const Err = styled("div")(() => ({
  padding: "5px",
  display: "inline-block",
}));

type ImageProps = Pick<StyledImageProps, "width"> & {
  src?: string;
  alt?: string;
};

export default function Image({src, alt, width}: ImageProps) {
  const [flag, setFlag] = React.useState<string>("loading");

  React.useEffect(() => {
    setFlag(!!src ? "loading" : "error");
  }, [src]);

  return (
    <>
      {(!src || "error" === flag) && (
        <StyledError width={width}>
          <Err>{alt || t`Empty`}</Err>
        </StyledError>
      )}
      {!!src && "loading" === flag && (
        <StyledError width={width}>
          <CircularProgress className="circleProgress" />
        </StyledError>
      )}
      {!!src && (
        <StyledImage
          src={src}
          alt={alt}
          flag={flag}
          width={width}
          onLoad={() => setFlag("ok")}
          onError={() => setFlag("error")}
        />
      )}
    </>
  );
}
