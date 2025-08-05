import { t } from "ttag";
import type { PUploadAcceptProps } from "@src/components/types";

interface InvalidProps {
  file: File;
  errors: string[];
}

interface AcceptedFilesResponseProps {
  valid: File[];
  invalid: InvalidProps[]
}

// Get the list of accepted files
export function acceptedFiles(accept: PUploadAcceptProps, mbMax: number, files: null | FileList): AcceptedFilesResponseProps {
  if ( null === files ) {
    return {} as AcceptedFilesResponseProps;
  }

  const cleanAttrs = cleanAcceptAttrs(accept);

  const isValid = (fp: File): string | string[] => {
    const errors = [];
    if ( !accepted(fp.name, fp.type, cleanAttrs) ) {
      errors.push(t`You can not upload this file as the file format is not allowed at this time`);
    }
    if ( (mbMax * 1024 * 1024) < fp.size ) {
      errors.push(t`One can not upload files larger than ${mbMax}MB`);
    }
    return 0 === errors.length ? "none" : errors;
  };

  const valid = [];
  const invalid: InvalidProps[] = [];
  for ( const fp of files ) {
    const errors = isValid(fp);
    if ( "none" === errors ) {
      valid.push(fp);
    }
    else {
      invalid.push({file: fp, errors: errors as string[]});
    }
  }
  return { valid, invalid };
}

export function acceptPropAsAcceptAttr(accept: PUploadAcceptProps): string {
  return cleanAcceptAttrs(accept).join(",");
}

/**
 * The following method was derived from the dropzone plugin. This method
 * assists in converting the `{accept}` dropzone prop to an array of MIME
 * types/extensions.
 *
 * https://github.com/react-dropzone/react-dropzone/blob/master/src/utils/index.js
 * (2025)
 */
function cleanAcceptAttrs(accept: PUploadAcceptProps): string[] {
  // Check if v is a MIME type string.
  // See accepted format: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#unique_file_type_specifiers.
  const isMIMEType = (v: string): boolean =>
    v === "audio/*" ||
    v === "video/*" ||
    v === "image/*" ||
    v === "text/*" ||
    v === "application/*" ||
    /\w+\/[-+.\w]+/g.test(v);

  // Check if v is a file extension.
  const isExt = (v: string): boolean => /^.*\.[\w]+$/.test(v);

  return Object.entries(accept)
    .reduce((a, [mimeType, ext]) => [...a, mimeType, ...ext], new Array<string>())
    .filter((v: string) => {
      const check = isMIMEType(v) || isExt(v);
      if ( !check ) {
        console.warn(
          `Skipped "${v}" because it is not a valid MIME type. Check https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types for a list of valid MIME types.`
        );
      }
      return check;
    });
}

/**
 *
 * https://github.com/react-dropzone/attr-accept/blob/main/src/index.js
 * (2025)
 */
export function accepted(fileName: string, mimeType: string, cleanAttrs: string[]) {
  mimeType = mimeType.toLowerCase();
  const baseMimeType = mimeType.replace(/\/.*$/, "");
  return cleanAttrs.some((type: string) => {
    const validType = type.trim().toLowerCase()
    if ( "." === validType.charAt(0) ) {
      return fileName.toLowerCase().endsWith(validType);
    }
    else if ( validType.endsWith("/*") ) {
      // This is something like a image/* mime type
      return baseMimeType === validType.replace(/\/.*$/, "");
    }
    return mimeType === validType
  });
}
