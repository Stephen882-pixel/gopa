import * as React from "react";
import type { PObjectProps, PTableColumnProps, PTableFilterProps, PTableFilterHookProps } from "@src/components/types";


interface PTableToolbarFilterProps {
  [key: string]: any;
  rawText?: string;
  search?: string | number;
}

export function usePTableToolbarFilterHook(onFilter?: (filter: PObjectProps) => void) {
  const [filter, setFilter] = React.useState<PObjectProps>({
    rawText: "",
    search: "",
  });

  const updateFilter = (props: PObjectProps) => {
    const { rawText, search, ...rest } : PTableToolbarFilterProps = { ...filter, ...props };
    setFilter(0 === search ? {rawText: "", search: ""} : {rawText, search, ...rest});
    if (onFilter) {
      onFilter(0 === search ? {search} : {search, ...rest});
    }
  };

  const isFilterSet = () => {
    for (let [_, value] of Object.entries(filter)) {
      if (value) {
        return true;
      }
    }
    return false;
  };

  return { filter, updateFilter, isFilterSet } as const;
}


interface LocalFilterProps extends PTableFilterProps {
  [key: string]: any;
}

export function usePTableFilterHook({apiUrl, columns, orderBy, defaultFilter={}, defaultLimit=10} : PTableFilterHookProps) {
  const getOrder = () => {
    if (undefined === orderBy || undefined === columns) {
      return "";
    }
    const isString = "string" === typeof orderBy.column;
    const column = columns
      .filter((c: PTableColumnProps, i: number) =>
        isString ? c.id === orderBy.column : i + 1 === orderBy.column,
      )
      .pop();
    return column && column.sortField
      ? `${"desc" === orderBy.direction ? "-" : ""}${column.sortField}`
      : "";
  };

  const [query, setQuery] = React.useState<PObjectProps>({
    ordering: getOrder(),
    search: "",
  });

  const getFilterArgs = (opts?: PObjectProps) => {
    const { filter = {} } : PObjectProps = { ...query, ...(opts || {}) };
    let params: PObjectProps = {};
    for (let [key, value] of Object.entries(defaultFilter)) {
      if (value) {
        params[key] = value;
      }
    }
    for (let [key, value] of Object.entries(filter)) {
      params[key] = value;
    }
    return params;
  };

  const getArgs = (opts: PObjectProps) => {
    const { page = 1, limit = defaultLimit, filter = {}, search, ...rest } : LocalFilterProps = { ...query, ...opts };
    setQuery({
      filter, limit, page,
      search: 0 === search ? "" : search,
      ...rest
    });

    let params: PObjectProps = getFilterArgs(opts);
    for (let [key, value] of Object.entries(rest)) {
      if (value) {
        params[key] = value;
      }
    }
    params.page = page;
    params.limit = limit;
    if (search) {
      params.search = search;
    }

    return {
      url: apiUrl,
      params,
    };
  };

  return { query, getArgs, getFilterArgs } as const;
}
