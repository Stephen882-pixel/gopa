import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotesSharp from "@mui/icons-material/NotesSharp";
import EditSharp from "@mui/icons-material/EditSharp";
import DeleteSharp from "@mui/icons-material/DeleteSharp";
import type { PTableDeleteModes } from "@src/components/types";

interface PTableActionProps {
  hasPreview?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  deleteMode?: PTableDeleteModes;
  onClick?: (action: string) => void;
}

export default function PTableAction({ hasPreview, hasEdit, hasDelete, deleteMode, onClick }:PTableActionProps) {
  const title = "archive" === deleteMode ? t`Archive` : t`Delete`;
  return (
    <>
      {!!hasPreview && (
        <Tooltip title={t`Preview`} placement="bottom-end">
          <IconButton onClick={() => onClick?.("preview")} aria-label={t`Preview`}>
            <NotesSharp />
          </IconButton>
        </Tooltip>
      )}
      {!!hasEdit && (
        <Tooltip title={t`Edit`} placement="bottom-end">
          <IconButton onClick={() => onClick?.("edit")} aria-label={t`Edit`}>
            <EditSharp />
          </IconButton>
        </Tooltip>
      )}
      {!!hasDelete && (
        <Tooltip title={title} placement="bottom-end">
          <IconButton onClick={() => onClick?.("delete")} aria-label={title}>
            <DeleteSharp />
          </IconButton>
        </Tooltip>
      )}
    </>
  );
}
