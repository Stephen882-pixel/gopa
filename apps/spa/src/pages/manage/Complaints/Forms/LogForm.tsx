import { t } from "ttag";

import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";

import PUpload from "@src/components/input/Upload/PUpload";
import { useLocale } from "@src/app/hooks";
import type { FormComponentProps } from "@src/components/types";

export default function LogForm({ data }:FormComponentProps) {
  const { formatDate } = useLocale();
  return (
    <Grid container spacing={2} sx={{ pt: 1 }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label={t`Stage`}
          value={data?.from_status}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label={t`Action`}
          value={data?.to_status}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label={t`Time Stamp`}
          value={formatDate(data?.created_on)}
        />
      </Grid>
      <Grid size={6}>
        {data?.user?.display_name && (
          <TextField
            fullWidth
            label={t`Reviewer`}
            value={data?.user?.display_name}
          />
        )}
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          multiline rows={5}
          label={t`Comments`}
          value={data?.comments}
        />
      </Grid>
      {0 < data?.documents?.length && (
        <Grid size={12}>
          <PUpload
            multiple
            label={t`Attachments`}
            defaultValue={data?.documents}
          />
        </Grid>
      )}
    </Grid>
  );
}
