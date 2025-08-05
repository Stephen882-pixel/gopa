import * as React from "react";
import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import CameraSharp from "@mui/icons-material/CameraSharp";

import PGrid from "@src/components/container/PGrid";

import { usePermissions } from "@src/app/hooks";
import { ToolTitle } from "@src/components/layout";
import type { PGridEvents } from "@src/components/types";

import FeatureDialog from "./FeatureDialog";
import ReportForm from "./ReportForm";

export default function Reports() {
  const { hasPermissions } = usePermissions();

  const [open, setOpen] = React.useState<boolean>(false);
  const gRef = React.useRef<PGridEvents | null>(null);
  const apiUrl = "/report/reports/";

  return (
    <>
      <PGrid
        ref={gRef}
        title={
          <ToolTitle
            title={t`Reports`}
            brief={t`A list of reports that displayed on the portal`}
          />
        }
        apiUrl={apiUrl}
        hasAdd={hasPermissions(["core.add_report"])}
        hasEdit={hasPermissions(["core.change_report"])}
        hasDelete={hasPermissions(["core.delete_report"])}
        orderBy={{
          column: 1,
          direction: "desc",
        }}
        extraToolbar={
          ({filter, onFilter}) => (
            <Tooltip title={t`Set Feature`} placement="bottom-end">
              <IconButton aria-label={t`Set Feature`} onClick={() => setOpen(true)}>
                <CameraSharp />
              </IconButton>
            </Tooltip>
          )
        }
        renderExtraAction={(row: any) => null !== row?.sequence && (
          <Tooltip title={t`Featured Insight`} placement="bottom-end">
            <IconButton aria-label={t`Featured Insight`}>
              <CameraSharp />
            </IconButton>
          </Tooltip>
        )}
        FormComponent={ReportForm}
        columns={[
          {
            label: t`Label`,
            sortable: true,
            sortField: "label_i18n",
            selector: (row: any) => row?.label_i18n,
          },
          {
            label: t`Type`,
            sortable: true,
            sortField: "display_type",
            selector: (row: any) => row?.display_type,
          },
          {
            label: t`Index`,
            sortable: false,
            selector: (row: any) => row?.display_index,
          },
          {
            label: t`Brief`,
            sortable: true,
            sortField: "brief_i18n",
            selector: (row: any) => row?.brief_i18n,
          },
          {
            label: t`Tags`,
            sortable: false,
            selector: (row: any) => row?.tags?.map((t: any) => t.label).join(", "),
          },
        ]}
      />
      <FeatureDialog
        apiUrl={apiUrl}
        open={open}
        onClose={(refresh?: boolean) => {
          if ( true === refresh ) {
            gRef?.current?.onRefresh();
          }
          setOpen(false);
        }}
      />
    </>
  );
}
