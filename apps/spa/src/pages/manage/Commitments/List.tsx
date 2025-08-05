import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditSharp from "@mui/icons-material/EditSharp";
import NotesSharp from "@mui/icons-material/NotesSharp";

import Link from "@src/components/Link";
import PGrid from "@src/components/container/PGrid";
import { ToolTitle } from "@src/components/layout";
import { useLocale, usePermissions } from "@src/app/hooks";

import CommitmentForm from "./CommitmentForm";

export default function List() {
  const { hasPermissions } = usePermissions();
  const { formatDate } = useLocale();
  const perms = {
    add: hasPermissions(["restrictions.add_commitment"]),
    edit: hasPermissions(["restrictions.change_commitment"]),
    delete: hasPermissions(["restrictions.delete_commitment"]),
  };
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Commitments`}
          brief={t`the list of commitments made by the EAC community`}
        />
      }
      apiUrl={"/restrictions/commitments/"}
      hasAdd={perms.add}
      hasEdit={false}
      hasPreview={false}
      hasDelete={perms.delete}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={CommitmentForm}
      renderExtraAction={(row: any) => (
        <Tooltip title={perms.edit ? t`Edit` : t`Preview`} placement="bottom-end">
          <Link to={`/auth/manage/commitments/${row?.id}`}>
            <IconButton aria-label={perms.edit ? t`Edit` : t`Preview`}>
              {perms.edit ? <EditSharp /> : <NotesSharp />}
            </IconButton>
          </Link>
        </Tooltip>
      )}
      columns={[
        {
          label: t`Label`,
          sortable: true,
          sortField: "label",
          selector: (row: any) => row?.label,
        },
        {
          label: t`Description`,
          sortable: true,
          sortField: "description",
          selector: (row: any) => row?.description,
        },
        {
          label: t`Created On`,
          sortable: true,
          sortField: "created_on",
          selector: (row: any) => formatDate(row?.created_on),
        },
      ]}
    />
  );
}
