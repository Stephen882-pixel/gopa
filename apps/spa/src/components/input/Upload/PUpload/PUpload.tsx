import * as React from "react";
import { t, ngettext, msgid } from "ttag";
import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";

import CloudUploadSharp from "@mui/icons-material/CloudUploadSharp";
import CloudQueueSharp from "@mui/icons-material/CloudQueueSharp";
import CloudOffSharp from "@mui/icons-material/CloudOffSharp";
import DeleteSharp from "@mui/icons-material/DeleteSharp";

import PNotch, { PNotchHiddenInput } from "@src/components/container/PNotch";
import { WidePanel, ToolPanel } from "@src/components/layout";
import { cSwal } from "@src/app/utils";
import type { PUploadProps } from "@src/components/types";

import PUploadFileList, { PUploadFileListProps } from "./PUploadFileList";
import { PImageWrapper } from "../PImageInput";
import PUploadError from "../PUploadError";
import { acceptPropAsAcceptAttr, acceptedFiles, accepted } from "../utils";

interface WrapperProps {
  trash?: boolean;
}

const Wrapper = styled(Paper, {
  shouldForwardProp: prop => "trash" !== prop,
})<WrapperProps>(({theme, trash}) => ({
  opacity: trash ? 0.75 : 1,
  padding: theme.spacing(1),
  display: "flex",
  alignItems: "center",
  width: "100%",
}));

const Span = styled(WidePanel)(({theme}) => ({
  WebkitLineClamp: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  padding: theme.spacing(0, 1),
  whiteSpace: "nowrap",

  "a": {
    textDecoration: "none",
    color: theme.palette.text.primary,
  },
}));


export default function PUpload({
  name,
  label,
  error,
  disabled,
  required,
  readOnly,
  helperText,
  defaultValue,
  onChange,
  accept = { "image/*": [], "application/pdf": [".pdf"] },
  mbMax = 2,
  multiple = false,
} : PUploadProps) {

  const ref = React.useRef<PUploadFileList>(new PUploadFileList());
  const [files, setFiles] = React.useState<Array<any>>([]);

  const _onChange = () => {
    setFiles(ref.current.files);
    onChange?.(
      ref.current.files
        .filter((conf) => null === conf.id)
        .map((conf) => conf.file)
    );
  }

  React.useEffect(() => {
    if ( defaultValue ) {
      ref.current.setDefaultValue(multiple ? defaultValue : [defaultValue]);
      setFiles(ref.current.files);
    }
  }, [defaultValue]);

  return (
    <>
      <PNotch label={label} error={!!error}>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadSharp />}
          disabled={disabled || readOnly}
        >
          {multiple ? t`Upload Files` : t`Upload File`}
          <PNotchHiddenInput
            disabled={disabled || readOnly}
            multiple={multiple}
            required={required}
            name={multiple ? undefined : name}
            type="file"
            accept={acceptPropAsAcceptAttr(accept)}
            onChange={(event) => {
              const { valid, invalid } = acceptedFiles(accept, mbMax, event.target.files);
              if ( 0 < invalid.length ) {
                cSwal({
                  title: ngettext(msgid`Invalid File`, `Invalid Files`, invalid.length),
                  content: <PUploadError invalid={invalid} />,
                });
              }
              const updates = valid.map((fp) => ({
                id: null,
                name: fp.name,
                type: fp.type,
                trash: false,
                file: fp,
              }));
              ref.current.updateFiles(updates, multiple);
              event.target.value = "";
              _onChange();
            }}
          />
        </Button>
      </PNotch>
      {!!helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}
      <input
        type="hidden"
        name={`${name || "named"}_trash`}
        value={JSON.stringify(
          files
            .filter((conf) => null !== conf.id)
            .map((conf) => ({ id: conf.id, trash: conf.trash })),
        )}
      />
      <Grid container spacing={2} sx={{ width: "100%", marginTop: "5px" }}>
        {files.map((fp: PUploadFileListProps, index: number) => (
          <Grid key={index} size={{ xs: 12, sm: 6 }}>
            <Wrapper trash={fp.trash}>
              <Span title={fp.name}>
                {null !== fp.id && <a target="_blank" href={fp.file as string}>{fp.name}</a>}
                {null === fp.id && fp.name}
              </Span>
              <ToolPanel>
                <Divider
                  orientation="vertical"
                  sx={{ height: "2.5rem", ml: 0.5, mr: 0.5 }}
                />
                <IconButton
                  title={t`Trash`}
                  aria-label={t`Trash`}
                  onClick={() => {
                    if ( disabled || readOnly ) {
                      return;
                    }
                    ref.current.setFiles(
                      ref.current.files.filter((c, i) => {
                        if ( i !== index ) {
                          if ( !multiple ) {
                            c.trash = !c.trash;
                          }
                          return true;
                        }
                        const isUploaded = null !== c.id;
                        if ( isUploaded ) {
                          c.trash = !c.trash;
                        }
                        return i === index && null !== fp.id;
                      })
                    );
                    _onChange();
                  }}
                >
                  {null === fp.id && <DeleteSharp />}
                  {null !== fp.id && !fp.trash && <CloudQueueSharp />}
                  {null !== fp.id && fp.trash && <CloudOffSharp />}
                </IconButton>
              </ToolPanel>
            </Wrapper>
            {accepted(fp.name, fp.type, ["image/*"]) && (
              <Paper sx={{ p: 1, marginTop: "5px", }}>
                <PImageWrapper trash={fp.trash}>
                  <img
                    alt={fp.name}
                    ref={(input) => {
                      if ( null === input ) {
                        return;
                      }
                      if ( null !== fp.id ) {
                        input.src = fp.file as string;
                      }
                      else {
                        const reader = new FileReader();
                        reader.onload = () => { input.src = String(reader.result); };
                        reader.readAsDataURL(fp.file as File);
                      }
                    }}
                  />
                </PImageWrapper>
              </Paper>
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
}
