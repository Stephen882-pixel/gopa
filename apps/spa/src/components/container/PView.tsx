import * as React from "react";
import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import TableContainer from "@mui/material/TableContainer";
import Tooltip from "@mui/material/Tooltip";

import RefreshSharp from "@mui/icons-material/RefreshSharp";

import PTable, { PTableToolBar } from "./PTable";
import { useMatXConfig } from "@src/components/theme";
import Wrapper, { WidePanel, ToolPanel } from "@src/components/layout";
import type { PObjectProps, PViewProps, PViewEvents, PTableEvents } from "@src/components/types";

export default React.forwardRef<PViewEvents, PViewProps>(
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
      renderExtraAction,
      // PViewProps
      title,
      extraToolbar,
    },
    ref,
  ) => {

    const tRef = React.useRef<null | PTableEvents>(null);
    const { darkMode } = useMatXConfig();

    React.useImperativeHandle(ref, () => ({
      onRefresh: () => tRef?.current?.onRefresh(),
    }));

    return (
      <TableContainer component={Paper} sx={{ position: "relative" }}>
        <Wrapper sx={{ p: 2 }}>
          <WidePanel>{title}</WidePanel>
          <ToolPanel>
            <PTableToolBar
              isLight={!darkMode}
              onFilter={(opts: PObjectProps) => tRef?.current?.onFilter(opts)}
              extraToolbar={
                ({ filter, onFilter }) => (
                  <>
                    <Tooltip title={t`Refresh`} placement="bottom-end">
                      <IconButton aria-label={t`Refresh`} onClick={() => tRef?.current?.onRefresh()}>
                        <RefreshSharp />
                      </IconButton>
                    </Tooltip>
                    {extraToolbar && extraToolbar({filter, onFilter})}
                  </>
                )
              }
            />
          </ToolPanel>
        </Wrapper>
        <PTable
          ref={tRef}
          apiUrl={apiUrl}
          defaultFilter={defaultFilter}
          orderBy={orderBy}
          defaultLimit={defaultLimit}
          columns={columns}
          padding={padding}
          rowsPerPageOptions={rowsPerPageOptions}
          renderExtraAction={renderExtraAction}
          hideActions={!renderExtraAction}
        />
      </TableContainer>
    );
  },
);
