import * as React from "react";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import RefreshSharp from "@mui/icons-material/RefreshSharp";
import AddSharp from "@mui/icons-material/AddSharp";

import DrawerBox, { DrawerContent, DrawerTools } from "@src/components/container/box/DrawerBox";
import PLoader from "@src/components/loader/PLoader";
import PCardPanel from "./PCardPanel";
import PForm, { usePForm } from "./PForm";
import PTable, { PTableToolBar } from "./PTable";
import { useFetch } from "@src/app/hooks";
import { onApiSuccess } from "@src/app/utils";
import type { PObjectProps, PGridProps, PGridEvents, PTableEvents } from "@src/components/types";

export default React.forwardRef<PGridEvents, PGridProps>(
  (
    {
      // TableFilterHookProps
      apiUrl,
      defaultFilter = {},
      orderBy,
      defaultLimit = 10,
      // PTableProps
      columns,
      padding,
      rowsPerPageOptions = [5, 10, 25, 50],
      hideActions,
      hasPreview,
      hasEdit,
      hasDelete,
      deleteMode,
      onPreview,
      onEdit,
      renderExtraAction,
      // PGridProps
      FormComponent,
      contentType,
      objects,
      title,
      isLight,
      hasAdd,
      onAdd,
      extraToolbar,
    },
    ref,
  ) => {

    const [data, setData] = React.useState<PObjectProps | null>(null);
    const [open, setOpen] = React.useState<boolean>(false);
    const tRef = React.useRef<PTableEvents | null>(null);

    const [{loading}, apiCall] = useFetch();
    const { errors, setContent, onReset, onSubmit } = usePForm({
      contentType,
      onSubmit: (_data: any) => apiCall({
        url: apiUrl + (data?.id ? `${data?.id}/` : ""),
        method: data?.id ? "PUT" : "POST",
        params: tRef?.current?.getFilterArgs(),
        data: _data,
      }),
      onSubmitSuccess: (res: any) => onApiSuccess().then(() => {
        tRef?.current?.onRefresh();
        setOpen(false);
      }),
    });

    const showDrawer = (fn?: (row: any) => void) => (row?: any) => {
      setOpen(true);
      setData(row);
      onReset();
      fn?.(row);
    };

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
                  {!!hasAdd && FormComponent && (
                    <Tooltip title={t`New Record`} placement="bottom-end">
                      <IconButton aria-label={t`New Record`} onClick={() => showDrawer(onAdd)(null)}>
                        <AddSharp />
                      </IconButton>
                    </Tooltip>
                  )}
                  {extraToolbar && extraToolbar({filter, onFilter})}
                </>
              )
            }
          />
        }
      >
        <PTable
          ref={tRef}
          apiUrl={apiUrl}
          columns={columns}
          defaultFilter={defaultFilter}
          orderBy={orderBy}
          defaultLimit={defaultLimit}
          padding={padding}
          rowsPerPageOptions={rowsPerPageOptions}
          hideActions={hideActions}
          hasPreview={!hasAdd && !hasEdit ? (false === hasPreview ? false : (!!hasPreview || true)) : !!hasPreview}
          hasEdit={!!hasEdit && !!FormComponent}
          hasDelete={hasDelete}
          deleteMode={deleteMode}
          onPreview={showDrawer(onPreview)}
          onEdit={showDrawer(onEdit)}
          renderExtraAction={renderExtraAction}
        />

        {FormComponent && (
          <DrawerBox
            open={open}
            onClose={() => setOpen(false)}
          >
            <PForm flexDirection="column" onSubmit={onSubmit}>
              <DrawerContent>
                <FormComponent objects={objects} data={data} errors={errors} setContent={setContent} />
              </DrawerContent>
              <Divider />
              <DrawerTools>
                {(hasAdd || hasEdit) && (
                  <Button loading={loading} type="submit" variant="contained">
                    {t`Save`}
                  </Button>
                )}
                <Button variant="text" onClick={() => setOpen(false)}>
                  {t`Close`}
                </Button>
              </DrawerTools>
            </PForm>
            <PLoader loading={loading} />
          </DrawerBox>
        )}
      </PCardPanel>
    );
  },
);
