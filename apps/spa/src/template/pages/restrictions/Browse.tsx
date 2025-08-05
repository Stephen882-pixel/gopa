import * as React from "react";
import debounce from "lodash/debounce";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { t } from "ttag";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Grid from "@mui/material/Grid2";
import TablePagination from "@mui/material/TablePagination";
import Typography from "@mui/material/Typography";

import ErrorBox from "@src/components/container/box/ErrorBox";
import PLoader from "@src/components/loader/PLoader";
import SectorSelector from "@src/components/SectorSelector";
import { usePTableFilterHook } from "@src/components/container/PTable";

import HeroPanel from "@src/template/components/Panels/HeroPanel";
import RestrictionCard from "@src/template/components/Cards/RestrictionCard";

import { useFetch } from "@src/app/hooks";
import { onApiError, toTitleCase } from "@src/app/utils";

import { setRestriction } from "@src/app/redux/slice/cache";
import { useAppDispatch } from "@src/app/redux/store";

import type { PObjectProps } from "@src/components/types";
import BrowseSearch from "./BrowseSearch";

export default function Browse() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { category } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("xl"));

  const { query, getArgs } = usePTableFilterHook({
    apiUrl: "/pages/restrictions/",
    defaultFilter: {
      search: searchParams.get("search"),
      iso: searchParams.get("iso"),
      sector: category || "",
    },
    defaultLimit: 9,
  });
  const [{ data }, apiCall] = useFetch();
  const [{}, sApiCall] = useFetch({
    url: "/pages/sectors/",
  });

  const onList = (opts: PObjectProps) => {
    setLoading(true);
    return apiCall(getArgs(opts))
      .catch(onApiError)
      .finally(() => setLoading(false));
  };
  const onDebounce = debounce(
    (props: PObjectProps) => onList(props),
    300,
  );

  const [selected, setSelected] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const [item, setItem] = React.useState<any>({});

  React.useEffect(() => {
    document.title = t`Browse Restrictions`;
    window.scrollTo(0, 0);
  }, []);

  React.useEffect(() => {
    setLoading(true);
    Promise.all([
      apiCall(getArgs({})),

      category
        ? sApiCall({ params: { slug: category } }).then((res: any) => res?.results?.pop())
        : Promise.resolve(),

    ])
    .then(([_data, _item]) => {
      setItem(_item?.id ? _item : {});
    })
    .catch(onApiError)
    .finally(() => setLoading(false));

  }, [category]);

  return (
    <>
      <div className="heading-2-wrapper">
        <HeroPanel
          className="heading-2-wrapper-in"
          small
          transparent
          title={t`Restrictions`}
          brief={item?.label && <>{t`Specified Sector`} <em>{toTitleCase(item?.label)}</em></>}
        />
      </div>

      <Grid
        className="wrapper-2"
        container
        spacing={2}
        sx={{
            width: "100%",
            padding: theme.spacing(2, 2, 4, 2),
            "@media (min-width: 1600px)": {
              width: "1600px",
              margin: "0 auto"
            }
          }}
      >
        {matches && (
          <Grid size={3} className="filter-wrapper-2">
            <Typography className="filter-title-1">{t`Refine Your Selection`}</Typography>
            <SectorSelector
              parentId={item?.id}
              multiSelect={true}
              defaultValue={selected}
              checkboxSelection={true}
              onSelect={(nodes: any[]) => {
                const sector = nodes.map((n: any) => n.slug).join(",");
                setSelected(nodes.map((n: any) => n.id).join(","));
                setLoading(true);
                onDebounce({ sector, page: 1 });
              }}
            />
          </Grid>
        )}
        <Grid
          className="browse-grid-1"
          size={{ xs: 12, xl: 9 }}
          sx={
            (theme) => ({
              gap: theme.spacing(2),
              display: "flex",
              flexDirection: "column",
            })
          }
        >
          <BrowseSearch
            parentId={item?.id}
            selected={selected}
            iso={searchParams.get("iso") || "all"}
            onSearch={({ sector, search, iso }) => {
              // https://saadriazkhan.medium.com/update-query-parameters-with-react-router-dom-v6-6c9a0d04a1ff
              const newSearchParams : URLSearchParams = new URLSearchParams();
              if ( true === search ) {
                newSearchParams.set("search", searchParams.get("search") || "");
                onList({ iso, page: 1 });
              }
              else {
                newSearchParams.set("search", search || "");
                (search !== query.search ? onDebounce : onList)({
                  search, iso, page: 1,
                  sector: "" === sector || sector ? sector : query.sector
                });
              }
              newSearchParams.set("iso", iso || "");
              setSearchParams(newSearchParams);
            }}
          />

          {0 < data?.results?.length && (
            <RestrictionCard
              restrictions={data?.results || []}
              onClick={(restriction: any) => {
                dispatch(setRestriction(restriction));
                navigate(`/public/restriction/${restriction.slug}`);
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
        </Grid>
      </Grid>
      <PLoader fullScreen loading={loading} />
    </>
  );
}
