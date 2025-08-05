import Grid from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";

import type { PSkeletonProps } from "@src/components/types";

export default function UpdateSkeletonForm({animation = "pulse"}:PSkeletonProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={12}>
        <Skeleton variant="rectangular" animation={animation} width={"100%"} height={130} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <Skeleton variant="rectangular" animation={animation} width={"100%"} height={53} />
      </Grid>
      <Grid size={12}>
        <Skeleton variant="rectangular" animation={animation} width={"100%"} height={130} />
      </Grid>
    </Grid>
  )
}
