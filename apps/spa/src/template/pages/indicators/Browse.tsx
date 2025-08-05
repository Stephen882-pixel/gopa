import * as React from "react";
// import debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { t } from "ttag";

import Container from "@mui/material/Container";
import TablePagination from "@mui/material/TablePagination";

import ErrorBox from "@src/components/container/box/ErrorBox";
import PLoader from "@src/components/loader/PLoader";
import { usePTableFilterHook } from "@src/components/container/PTable";

import HeroPanel from "@src/template/components/Panels/HeroPanel";
import IndicatorCard from "@src/template/components/Cards/IndicatorCard";

import { useFetch } from "@src/app/hooks";
import { onApiError } from "@src/app/utils";
import type { PObjectProps } from "@src/components/types";

export default function Browse() {
  const navigate = useNavigate();

  const { query, getArgs } = usePTableFilterHook({
    apiUrl: "/pages/reports/",
    // defaultFilter: {
    //   search: searchParams.get("search"),
    // },
    defaultLimit: 9,
  });
  const [{ loading, data }, apiCall] = useFetch();

  const onList = (opts: PObjectProps) => apiCall(getArgs(opts)).catch(onApiError);
  // const onDebounce = debounce(
  //   (props: PObjectProps) => onList(props),
  //   300,
  // );

  React.useEffect(() => {
    document.title = t`Indicators`;
    window.scrollTo(0, 0);
    onList({});
  }, []);

  return (
    <>
      <HeroPanel
        small
        transparent
        title={t`Indicators`}
      />
      <Container sx={{ mt: 2 }}>
        {0 < data?.results?.length && (
          <IndicatorCard
            indicators={data?.results || []}
            onClick={(item: any) => {
              // dispatch(setRestriction(restriction));
              navigate(`/public/indicator/${item.id}`);
            }}
          />
        )}
        {0 === data?.results?.length && (
          <ErrorBox mode="simple">
            {t`No Data Available`}
          </ErrorBox>
        )}
        <TablePagination
          sx={{ mb: 1.5 }}
          rowsPerPageOptions={[9,18,30]}
          component="div"
          count={data?.count || 0}
          rowsPerPage={query.limit || 9}
          page={(query.page || 1) - 1}
          onPageChange={(e, page) => onList({page: page + 1})}
          onRowsPerPageChange={e =>{
            onList({
              limit: parseInt(e.target.value, 10),
              page: 1
            });
          }}
        />
      </Container>
      <PLoader loading={loading} />
    </>
  );
}
