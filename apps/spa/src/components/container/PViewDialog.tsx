import * as React from "react";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import NotesSharp from "@mui/icons-material/NotesSharp";
import RefreshSharp from "@mui/icons-material/RefreshSharp";

import PCardPanel from "@src/components/container/PCardPanel";
import PTable, { PTableToolBar } from "@src/components/container/PTable";

import { makeId } from "@src/app/utils";
import type { PObjectProps, PViewDialogProps, PTableEvents, PViewEvents } from "@src/components/types";

export default React.forwardRef<PViewEvents, PViewDialogProps>(
  ({ apiUrl, columns, renderExtraAction, isLight, index, title, objects, FormComponent }, ref) => {

    const [data, setData] = React.useState<any>(null);
    const handleClose = () => setData(null);
    const idx = makeId(12);

    const tRef = React.useRef<null | PTableEvents>(null);
    React.useImperativeHandle(ref, () => ({
      onRefresh: () => tRef?.current?.onRefresh(),
    }));

    return (
      <PCardPanel
        padding={0}
        isLight={isLight}
        title={title}
        tools={
          <PTableToolBar
            isLight={isLight}
            onFilter={(opts: PObjectProps) => tRef?.current?.onFilter(opts)}
            extraToolbar={
              ({ filter, onFilter }) => (
                <>
                  <Tooltip title={t`Refresh`} placement="bottom-end">
                    <IconButton aria-label={t`Refresh`} onClick={() => tRef?.current?.onRefresh()}>
                      <RefreshSharp />
                    </IconButton>
                  </Tooltip>
                </>
              )
            }
          />
        }
      >
        <PTable
          ref={tRef}
          apiUrl={apiUrl}
          orderBy={{
            column: 1,
            direction: "desc",
          }}
          defaultFilter={{ index }}
          hideActions={!renderExtraAction && !FormComponent}
          renderExtraAction={(row: any) => (
            <>
              {renderExtraAction?.(row)}
              {FormComponent && (
                <Tooltip title={t`Preview`} placement="bottom-end">
                  <IconButton onClick={() => setData(row)} aria-label={t`Preview`}>
                    <NotesSharp />
                  </IconButton>
                </Tooltip>
              )}
            </>
          )}
          columns={columns}
        />
        {FormComponent && (
          <Dialog
            open={null !== data}
            onClose={handleClose}
            aria-labelledby={`${idx}-title`}
          >
            <DialogTitle id={`${idx}-title`}>
              {t`View Item`}
            </DialogTitle>
            <DialogContent>
              <FormComponent data={data} objects={objects} />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} autoFocus>
                {t`Close`}
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </PCardPanel>
    );
  },
);
