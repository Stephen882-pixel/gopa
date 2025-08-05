import * as React from "react";
import Grid from "@mui/material/Grid2";

import { buildTree } from "@src/components/container/PTree";

import { useAppSelector } from "@src/app/redux/store";
import type { PFlatTreeItem, PTreeItem } from "@src/components/types";

export default function SectorListCard() {
  const cache = useAppSelector((state) => state.cache.sectorList) as PFlatTreeItem[];
  const [tree, setTree] = React.useState<PTreeItem[]>([]);

  React.useEffect(() => {
    setTree(buildTree(cache));
  }, [cache]);

  return (
    <Grid container spacing={2} sx={{ position: "relative" }}>
      <Grid size={6}>
        {tree.map((item, index) => 0 === (index % 2) && (
          <ul key={index}>
            <li>
              <b>{item.label}</b>
              {item.children && 0 < item.children.length && (
                <ul>
                  {item.children.map((it, i) => (
                    <li key={i}>{it.label}</li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        ))}
      </Grid>
      <Grid size={6}>
        {tree.map((item, index) => 0 !== (index % 2) && (
          <ul key={index}>
            <li>
              <b>{item.label}</b>
              {item.children && 0 < item.children.length && (
                <ul>
                  {item.children.map((it, i) => (
                    <li key={i}>{it.label}</li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        ))}
      </Grid>
    </Grid>
  );
}
