import { t } from "ttag";

import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

import Link from "@src/components/Link";
import PCardPanel from "@src/components/container/PCardPanel";
import { ButtonBox } from "@src/pages/auth/Register/styles";
import { ToolTitle } from "@src/components/layout";

import PForm, { usePForm } from "@src/components/container/PForm";
import { useFetch, usePermissions } from "@src/app/hooks";

import ReviewForm from "../Forms/ReviewForm";
import ReviewSkeletonForm from "../Forms/ReviewSkeletonForm";
import type { ComplaintPanelProps } from "./ComplaintPanel";

export default function ReviewPanel({ complaint, onUpdate } : ComplaintPanelProps) {
  const [{ loading }, apiCall] = useFetch({
    url: `/restrictions/complaint-logs/`,
  });
  const { errors, setContent, onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({ method: "POST", data }).then((res) => onUpdate?.()),
  });

  const { hasPermissions } = usePermissions();
  const perms = {
    review: hasPermissions(["restrictions.can_review"]),
    regulator: hasPermissions(["restrictions.can_approve"]),
    regional: hasPermissions(["restrictions.can_approve_regional"]),
    council: hasPermissions(["restrictions.can_approve_council"]),
  };
  const flags = {
    review: "New" === complaint?.status,
    regulator: "Review" === complaint?.status,
    regional: "Regional Review" === complaint?.status,
    council: "Council Review" === complaint?.status,
  };

  const canReview = (flags.review && perms.review) || (flags.regulator && perms.regulator) || (flags.regional && perms.regional) || (flags.council && perms.council);

  const showError = () => {
    if ( complaint?.is_reviewed ) {
      return t`The complaint has already been reviewed.`;
    }
    if ( flags.review && !perms.review ) {
      return t`Please wait for the review process to end.`;
    }
    if ( flags.regulator && !perms.regulator ) {
      return t`Please wait for the regulator review process to end.`;
    }
    if ( flags.regional && !perms.regional ) {
      return t`Please wait for the regional review process to end.`;
    }
    if ( flags.council && !perms.council ) {
      return t`Please wait for the council review process to end.`;
    }
    return null;
  };

  const showForm = () => {
    if ( !complaint?.id ) {
      return <ReviewSkeletonForm />;
    }
    if ( !complaint?.is_reviewed && canReview ) {
      return <ReviewForm data={complaint} errors={errors} setContent={setContent} />;
    }
    const error = showError();
    return (
      <Alert severity={null !== error ? "info" : "error"}>
        {null !== error ? error : t`This task could not be processed at this time.`}
      </Alert>
    );
  };

  return (
    <PCardPanel title={<ToolTitle title={t`Progress Update`} />}>
      <PForm onSubmit={onSubmit}>
        {showForm()}
        <ButtonBox>
          <Link to="/auth/manage/complaints">
            <Button type="button" variant="outlined" aria-label={t`Back`}>
              {t`Back`}
            </Button>
          </Link>
          <span />
          {!complaint?.is_reviewed && (
            <Button
              type="button"
              loading={!complaint?.id}
              variant="contained"
              color="secondary"
              aria-label={t`Refresh`}
              onClick={() => onUpdate?.()}
            >
              {t`Refresh`}
            </Button>
          )}
          {!complaint?.is_reviewed && canReview && (
            <Button type="submit" loading={loading} variant="contained" aria-label={t`Update`}>
              {t`Update`}
            </Button>
          )}
        </ButtonBox>
      </PForm>
    </PCardPanel>
  );
}
