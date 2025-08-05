import * as React from "react";
import { t } from "ttag";

import PGrid from "@src/components/container/PGrid";
import { ToolTitle } from "@src/components/layout";

import { useFetch } from "@src/app/hooks";
import { setPermissionMap } from "@src/app/redux/slice/cache";
import { useAppSelector, useAppDispatch } from "@src/app/redux/store";
import GroupForm from "./GroupForm";

export default function Groups() {
  const cache = useAppSelector((state) => state.cache.permissionMap) as any[];
  const dispatch = useAppDispatch();
  const [{}, apiCall] = useFetch({ url: "/auth/permissions/available/" });

  React.useEffect(() => {
    if ( null === cache ) {
      apiCall().then((res: any[]) => dispatch(setPermissionMap(res)));
    }
  }, []);

  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Groups`}
          brief={t`the list of permission groups within the portal`}
        />
      }
      apiUrl={"/auth/groups/"}
      hasAdd={true}
      hasEdit={true}
      hasDelete={true}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={GroupForm}
      contentType="json"
      columns={[
        {
          label: t`Name`,
          sortable: true,
          sortField: "name",
          selector: (row: any) => row?.name,
        },
      ]}
    />
  );
}
