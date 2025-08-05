import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableSortLabel from "@mui/material/TableSortLabel";

import type { PTableColumnProps } from "@src/components/types";

interface PTableHeaderCellProps {
  col: PTableColumnProps;
  order: string;
  onOrder: (order: string) => void;
}

export default function PTableHeaderCell({ col, order, onOrder } : PTableHeaderCellProps) {
  if ( false === col.sortable ) {
    return (
      <TableCell align={col.numeric ? "right" : "left"}>
        {col.label}
      </TableCell>
    );
  }
  const isSortCol = col.sortField ? col.sortField == order.substring("-" === order[0] ? 1 : 0) : false;
  const sortDirection = "-" === order[0] ? "desc" : "asc";
  return (
    <TableCell
      align={col.numeric ? "right" : "left"}
      sortDirection={isSortCol ? sortDirection : false}
    >
      <TableSortLabel
        active={isSortCol}
        direction={sortDirection}
        onClick={() => {
          onOrder(
            isSortCol
              ? ("-" !== order[0] ? `-${col.sortField}` : `${col.sortField}`)
              : `-${col.sortField}`
          )
        }}
      >
        {col.label}
        {isSortCol && (
          <Box component="span" sx={visuallyHidden}>
            {"desc" === sortDirection ? "sorted descending" : "sorted ascending"}
          </Box>
        )}
      </TableSortLabel>
    </TableCell>
  );
}
