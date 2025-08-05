import * as React from "react";
import { t } from "ttag";
import { useParams } from "react-router-dom";

import Grid from "@mui/material/Grid2";

import PViewDialog from "@src/components/container/PViewDialog";
import { ToolTitle } from "@src/components/layout";
import { onApiError } from "@src/app/utils";
import { useFetch, useLocale, usePermissions } from "@src/app/hooks";

import ComplaintPanel from "./Panels/ComplaintPanel";
import ReviewPanel from "./Panels/ReviewPanel";
import LogForm from "./Forms/LogForm";

import type { PViewEvents } from "@src/components/types";

export default function Edit() {
  const [data, setData] = React.useState<any>(null);
  const ref = React.useRef<null | PViewEvents>(null);
  const { index } = useParams();

  const { isStaff, hasPermissions } = usePermissions();
  const { formatDate } = useLocale();
  const [{}, apiCall] = useFetch({
    url: `/restrictions/complaints/${index}/`,
  });

  const refresh = () => apiCall().then((res: any) => setData(res)).catch(onApiError);
  const canEdit = hasPermissions(["restrictions.can_review", "restrictions.can_approve"], "OR");

  React.useEffect(() => { refresh(); }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{xs: 12, lg: 6}} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {canEdit && (
          <ReviewPanel
            complaint={data}
            onUpdate={() => {
              ref?.current?.onRefresh();
              setData(null);
              refresh();
            }}
          />
        )}
        <PViewDialog
          ref={ref}
          index={index}
          title={<ToolTitle title={t`Review Logs`}/>}
          apiUrl="/restrictions/complaint-logs/"
          FormComponent={LogForm}
          columns={[
            {
              label: t`ID`,
              sortable: true,
              omit: true,
              sortField: "id",
              selector: (row: any) => row?.id,
            },
            {
              label: t`Reviewer`,
              sortable: false,
              omit: !isStaff,
              selector: (row: any) => row?.user?.display_name,
            },
            {
              label: t`Stage`,
              sortable: false,
              selector: (row: any) => row?.from_status,
            },
            {
              label: t`Action`,
              sortable: false,
              selector: (row: any) => row?.to_status,
            },
            {
              label: t`Time Stamp`,
              sortable: false,
              selector: (row: any) => formatDate(row?.created_on),
            },
          ]}
        />
      </Grid>
      <Grid size={{xs: 12, lg: 6}}>
        <ComplaintPanel complaint={data} />
      </Grid>
    </Grid>
  );
}
