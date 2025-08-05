import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import DeleteSharp from "@mui/icons-material/DeleteSharp";

import PNotch, { PNotchHiddenInput } from "@src/components/container/PNotch";
import { cSwal } from "@src/app/utils";
import Placeholder from "./Placeholder";
import PUploadError from "./PUploadError";
import { acceptPropAsAcceptAttr, acceptedFiles } from "./utils";

import type { PImageInputProps } from "@src/components/types";

interface WrapperProps {
  fluid?: boolean;
}

const Wrapper = styled("div", {
  shouldForwardProp: prop => "fluid" !== prop,
})<WrapperProps>(({theme, fluid}) => ({
  position: "relative",
  margin: "0 auto",
  width: fluid ? "100%" : "10rem",
  height: fluid ? "auto" : "10rem",
}));

interface PImageWrapperProps {
  trash?: boolean;
}

export const PImageWrapper = styled("div", {
  shouldForwardProp: prop => "trash" !== prop,
})<PImageWrapperProps>(({ theme, trash }) => ({
  opacity: trash ? 0.75 : 1,
  padding: theme.spacing(1),
  display: "flex",
  aspectRatio: "16 / 9",
  justifyContent: "center",
  overflow: "hidden",
}));

const Label = styled("label")({
  cursor: "pointer",
});

export default function PImageInput({
  name,
  label,
  error,
  disabled,
  required,
  readOnly,
  helperText,
  fluid,
  defaultValue,
  mbMax = 2,
} : PImageInputProps) {

  const [imageUrl, setImageUrl] = React.useState<null | string>(null);
  const ref = React.useRef<null | HTMLInputElement>(null);
  const accept = { "image/*": [] };

  return (
    <>
      <Wrapper fluid={fluid}>
        <PNotch label={label} error={error}>
          <Label>
            <PImageWrapper>
              {(imageUrl || defaultValue) && <img src={imageUrl || defaultValue} />}
              {!imageUrl && !defaultValue && <Placeholder />}
            </PImageWrapper>
            <PNotchHiddenInput
              disabled={disabled || readOnly}
              required={required}
              name={name}
              ref={ref}
              type="file"
              accept={acceptPropAsAcceptAttr(accept)}
              onChange={(event) => {
                const { valid, invalid } = acceptedFiles(accept, mbMax, event.target.files);
                if ( 0 < invalid.length ) {
                  setImageUrl(null);
                  cSwal({
                    title: t`Invalid File`,
                    content: <PUploadError invalid={invalid} />,
                  });
                }
                else {
                  const reader = new FileReader();
                  reader.onload = () => setImageUrl(reader.result as string);
                  reader.readAsDataURL(valid[0]);
                }
              }}
            />
          </Label>
        </PNotch>
        {imageUrl && (
          <IconButton
            color="primary"
            aria-label={t`Clear`}
            sx={{
              position: "absolute",
              right: 0, top: 0,
            }}
            onClick={(event) => {
              event.stopPropagation();
              if ( ref.current ) {
                ref.current.value = "";
              }
              setImageUrl(null);
            }}
          >
            <DeleteSharp />
          </IconButton>
        )}
      </Wrapper>
      {!!helperText && <FormHelperText error={!!error}>{helperText}</FormHelperText>}
    </>
  );
}
