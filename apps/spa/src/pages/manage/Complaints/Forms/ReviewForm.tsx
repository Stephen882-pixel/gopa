import * as React from "react";
import { t } from "ttag";

import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PSelect from "@src/components/input/PSelect";
import PUpload from "@src/components/input/Upload/PUpload";

import { useLocale } from "@src/app/hooks";
import { useAppSelector } from "@src/app/redux/store";
import type { FormComponentProps } from "@src/components/types";

export default function ReviewForm({data, errors, setContent}:FormComponentProps) {
  const [review, setReview] = React.useState<boolean>(false);
  const { asDate } = useLocale();
  const complaintStatus = useAppSelector((state) => state.constants.complaintStatus)
    .filter((co: any) => data?.expected?.includes(co.slug));

  return (
    <Grid container spacing={2}>
      <input type="hidden" name="complaint" value={data?.id} />
      <input type="hidden" name="from_status" value={data?.status} />
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth required
          name="to_status"
          label={t`Set Status`}
          helperText={errors?.to_status}
          error={!!errors?.to_status}
          onChange={(selected: string) => setReview(["Resolved", "Rejected"].includes(selected))}
        >
          {complaintStatus.map((co, index) => <MenuItem key={index} value={co.slug}>{co.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {review && (
          <DatePicker
            minDate={asDate(data?.date_of_occurrence) as Date}
            name="date_resolved"
            label={t`Date Resolved`}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                helperText: errors?.date_resolved,
                error: !!errors?.date_resolved,
              }
            }}
          />
        )}
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth required multiline rows={5}
          name="comments"
          label={t`Comments`}
          helperText={errors?.comments}
          error={!!errors?.comments}
        />
      </Grid>
      <Grid size={12}>
        <PUpload
          multiple
          name="documents"
          label={t`Attachments`}
          defaultValue={data?.documents}
          helperText={errors?.documents}
          error={!!errors?.documents}
          onChange={(files: File[]) => setContent?.("documents", files)}
        />
      </Grid>
    </Grid>
  );
}
