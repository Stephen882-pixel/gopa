import * as React from "react";
import { useParams } from "react-router-dom";

import Box from "@mui/material/Box";

import { onApiError } from "@src/app/utils";
import { useFetch } from "@src/app/hooks";

import RestrictionPanel from "./Panels/RestrictionPanel";
import UpdatePanel from "./Panels/UpdatePanel";

import type { PViewEvents } from "@src/components/types";

export default function Edit() {
  const [data, setData] = React.useState<any>(null);
  const ref = React.useRef<null | PViewEvents>(null);
  const { index } = useParams();

  const [{}, apiCall] = useFetch({
    url: `/restrictions/${index}/`,
  });

  const refresh = () => apiCall().then((res: any) => setData(res)).catch(onApiError);

  React.useEffect(() => { refresh(); }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <RestrictionPanel
        restriction={data}
        onUpdate={() => {
          ref?.current?.onRefresh();
          setData(null);
          refresh();
        }}
      />
      <UpdatePanel ref={ref} index={index} restriction={data} />
    </Box>
  );
}
