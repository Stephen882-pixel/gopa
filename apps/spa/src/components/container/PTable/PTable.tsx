import * as React from "react";
import debounce from "lodash/debounce";
import isEqual from "lodash/isEqual";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";

import ErrorBox from "@src/components/container/box/ErrorBox";
import { useFetch } from "@src/app/hooks";
import { onApi, onApiError } from "@src/app/utils"
import PLoader from "@src/components/loader/PLoader";
import type { PObjectProps, PTableFilterProps, PTableEvents, PTableProps, PTableColumnProps } from "@src/components/types";

import PTableHeaderCell from "./PTableHeaderCell";
import PTableAction from "./PTableAction";
import { usePTableFilterHook } from "./hooks";

const Tools = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "end",
  margin: theme.spacing(-2, 0),
}));

const Span = styled("span")(({theme}) => ({
  paddingRight: theme.spacing(1),
}));

export default React.forwardRef<PTableEvents, PTableProps>(
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
    },
    ref,
  ) => {

    const [initialised, isInitialised] = React.useState<boolean>(false);
    const { query, getArgs, getFilterArgs } = usePTableFilterHook({apiUrl, columns, defaultFilter, orderBy, defaultLimit});

    const [{ data, loading }, apiCall] = useFetch();
    const [{}, deleteApiCall] = useFetch({
      params: getFilterArgs(),
      method: "DELETE",
    });

    const onList = (opts: PObjectProps) => {
      return apiCall(getArgs(opts))
        .then(() => {
          if (!initialised) {
            isInitialised(true);
          }
        })
        .catch(onApiError);
    };

    const onDebounce = debounce(
      (props: PTableFilterProps) => onList(props),
      300,
    );

    const onDelete = (row: any) => {
      const question = "archive" === deleteMode
        ? t`Are you sure you would like to archive the specified record?`
        : t`Are you sure you would like to delete the specified record?`;
      const success = "archive" === deleteMode
        ? t`Your record was successfully archived.`
        : t`Your record was successfully purged from the system.`;
      return onApi(() => deleteApiCall({url: `${apiUrl}${row?.id}/`}), question, success)
        .then(() => onList({}))
        .catch((err: any) => {
          if ( 405 === err?.response?.status ) {
            onList({});
          }
        })
    };

    React.useEffect(() => {
      onList({ page: 1 });
    }, []);

    React.useImperativeHandle(ref, () => ({
      getFilterArgs: () => getFilterArgs(),
      onRefresh: () => onList({}),
      onFilter: ({ search, ...filter }: PObjectProps) => {
        if (0 !== search && search !== query.search) {
          return onDebounce({ search, filter, page: 1 });
        }
        else if (0 === search || !isEqual(filter, query.filter)) {
          return onList({ search, filter, page: 1 });
        }
        return Promise.resolve();
      },
    }));

    return (
      <>
        <Table sx={{ mt: 0 === padding ? 0 : (padding || 1.5) }}>
          <TableHead>
            <TableRow>
              {columns.filter((c: PTableColumnProps) => true !== c.omit).map(
                (col: PTableColumnProps, index: number) => (
                  <PTableHeaderCell
                    key={index}
                    col={col}
                    order={query.ordering || ""}
                    onOrder={(ordering: string) => onList({ ordering })}
                  />
                )
              )}
              {!hideActions && <TableCell align="right"><Span>{t`Actions`}</Span></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.results?.map(
              (row: any, i: number) => (
                <TableRow hover key={i}>
                  {columns.filter((c: PTableColumnProps) => true !== c.omit).map(
                    (col: PTableColumnProps, index: number) => (
                      <TableCell key={index} align={col.numeric ? "right" : "left"}>
                        {col.selector(row)}
                      </TableCell>
                    )
                  )}
                  {!hideActions && (
                    <TableCell align="right">
                      <Tools>
                        {renderExtraAction && <>&nbsp;{renderExtraAction(row)}</>}
                        <PTableAction
                          hasPreview={hasPreview}
                          hasEdit={hasEdit}
                          hasDelete={hasDelete}
                          deleteMode={deleteMode}
                          onClick={(action: string) => {
                            if ( "preview" == action ) {
                              onPreview?.(row);
                            }
                            else if ( "edit" == action ) {
                              onEdit?.(row);
                            }
                            else if ( "delete" == action ) {
                              onDelete(row);
                            }
                          }}
                        />
                      </Tools>
                    </TableCell>
                  )}
                </TableRow>
              )
            )}
            {data?.results && 0 === data?.results?.length && (
              <TableRow>
                <TableCell align="center" colSpan={columns.length + (!hideActions ? 1 : 0)} >
                  <ErrorBox mode="simple">
                    {t`No Data Available`}
                  </ErrorBox>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          sx={{ mb: 0 === padding ? 0 : (padding || 1.5) }}
          rowsPerPageOptions={rowsPerPageOptions}
          component="div"
          count={data?.count || 0}
          rowsPerPage={query.limit || defaultLimit}
          page={(query.page || 1) - 1}
          onPageChange={(e, page) => onList({page: page + 1})}
          onRowsPerPageChange={e =>{
            onList({
              limit: parseInt(e.target.value, 10),
              page: 1
            });
          }}
        />
        <PLoader loading={loading} />
      </>
    );
  },
);
