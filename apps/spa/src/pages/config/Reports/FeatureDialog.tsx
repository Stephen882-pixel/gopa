import { t } from "ttag";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import PAutocomplete from "@src/components/input/PAutocomplete";
import PForm, { usePForm } from "@src/components/container/PForm";

import { makeId, onApiSuccess } from "@src/app/utils";
import { useFetch } from "@src/app/hooks";

interface FeatureDialogProps {
  apiUrl: string;
  open: boolean;
  onClose: (refresh?: boolean) => void;
}

export default function FeatureDialog({ apiUrl, open, onClose } : FeatureDialogProps) {
  const ref = makeId(12);
  const [{loading}, apiCall] = useFetch({
    url: `${apiUrl}feature/`,
    method: "POST",
  });

  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({ data }),
    onSubmitSuccess: (res: any) => onApiSuccess().then(() => onClose(true)),
  });

  return (
    <Dialog
      open={open}
      onClose={() => onClose()}
      aria-labelledby={`${ref}-title`}
      aria-describedby={`${ref}-description`}
    >
      <PForm onSubmit={onSubmit}>
        <DialogTitle id={`${ref}-title`}>
          {t`Featured Insight`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id={`${ref}-description`}>
            {t`Specify the insights that will appear on the home page`}
          </DialogContentText>
          <br />
          <PAutocomplete
            fullWidth required multiple
            name="feature"
            label={t`Featured Insights`}
            api={apiUrl}
            helperText={errors?.feature}
            error={!!errors?.feature}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose()}>{t`Cancel`}</Button>
          <Button loading={loading} type="submit" variant="contained">{t`Update`}</Button>
        </DialogActions>
      </PForm>
    </Dialog>
  )
}
