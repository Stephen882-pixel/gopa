import { t } from "ttag";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";

import PForm, { usePForm } from "@src/components/container/PForm";
import PCardPanel from "@src/components/container/PCardPanel";
import { ButtonBox } from "@src/pages/auth/Register/styles";
import { ToolTitle } from "@src/components/layout";

import { onApi } from "@src/app/utils"
import { useFetch, usePermissions } from "@src/app/hooks";

import ComplaintForm from "../Forms/ComplaintForm";
import ComplaintSkeletonForm from "../Forms/ComplaintSkeletonForm";

export interface ComplaintPanelProps {
  complaint: any;
  onUpdate?: () => void;
}

export default function ComplaintPanel({ complaint }:ComplaintPanelProps) {
  const navigate = useNavigate();
  const goBack = () => navigate("/auth/manage/complaints");

  const [{ loading }, apiCall] = useFetch({
    url: `/restrictions/complaints/${complaint?.id}/`,
  });
  const { errors, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({ method: "PUT", data }),
  });

  const { isStaff, hasPermissions } = usePermissions();
  const perms = {
    edit: hasPermissions(["restrictions.change_complaint"]),
    delete: hasPermissions(["restrictions.delete_complaint"]),
  };
  const canDelete = () => {
    if ( isStaff && perms.delete && "Rejected" === complaint?.status ) {
      return true;
    }
    if ( !isStaff && complaint?.user?.current && "New" === complaint?.status ) {
      return true;
    }
    return false;
  }
  const canEdit = () => {
    if ( isStaff && perms.edit && !complaint?.is_reviewed ) {
      return true;
    }
    return false;
  };

  return (
    <PCardPanel title={<ToolTitle title={t`Captured Details`} />}>
      <PForm onSubmit={onSubmit}>
        {complaint?.id ? <ComplaintForm data={complaint} errors={errors} objects={{isStaff}} /> : <ComplaintSkeletonForm />}
        <ButtonBox>
          <Button type="button" variant="outlined" aria-label={t`Back`} onClick={goBack}>
            {t`Back`}
          </Button>
          <span />
          {canEdit() && (
            <Button type="submit" loading={loading} variant="contained" aria-label={t`Update`}>
              {t`Update`}
            </Button>
          )}
          {canDelete() && (
            <Button
              type="button"
              color="error"
              variant="contained"
              aria-label={t`Delete`}
              onClick={() => {
                const question = t`Would you like to archive this complaint? Please note that this action can not be reversed.`;
                const success = t`The complaint was successfully archived.`;
                onApi(() => apiCall({ method: "DELETE" }), question, success)
                  .then(goBack)
                  .catch((err: any) => console.warn(err));
              }}
            >
              {t`Delete`}
            </Button>
          )}
        </ButtonBox>
      </PForm>
    </PCardPanel>
  );
}
