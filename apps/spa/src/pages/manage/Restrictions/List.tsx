import * as React from "react";
import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditSharp from "@mui/icons-material/EditSharp";
import NotesSharp from "@mui/icons-material/NotesSharp";

import Link from "@src/components/Link";
import PGrid from "@src/components/container/PGrid";
import CountryFilter from "@src/components/layout/filter/CountryFilter";
import TableFilter from "@src/components/layout/filter/TableFilter";
import { ToolTitle } from "@src/components/layout";

import { useLocale, usePermissions } from "@src/app/hooks";

import RestrictionForm from "./Forms/RestrictionForm";

export default function Restrictions() {
  const [flag, setFlag] = React.useState<string>("active");

  const { formatDate } = useLocale();
  const { hasPermissions } = usePermissions();

  const perms = {
    add: hasPermissions(["restrictions.add_restriction"]),
    edit: hasPermissions(["restrictions.change_restriction"]),
    delete: hasPermissions(["restrictions.delete_restriction"]),
  };
  const canEdit = () => "active" === flag && perms.edit;

  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Restrictions`}
          brief={t`a brief description`}
        />
      }
      apiUrl="/restrictions/"
      hasPreview={false}
      hasAdd={"active" === flag && perms.add}
      hasEdit={false}
      hasDelete={"active" === flag && perms.delete}
      deleteMode="archive"
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      defaultFilter={{
        flag: "active",
      }}
      extraToolbar={({filter, onFilter}) => (
        <>
          <CountryFilter
            iso={filter?.iso || "all"}
            onSelect={(iso: string) => onFilter?.({iso})}
          />
          <TableFilter
            hideClear
            items={[
              { slug: "active", label: t`Active` },
              { slug: "archived", label: t`Archived` },
            ]}
            flag={filter?.flag || "active"}
            onSelect={(selected: string) => {
              onFilter?.({flag: selected});
              setFlag(selected);
            }}
          />
        </>
      )}
      renderExtraAction={(row: any) => (
        <Tooltip title={canEdit() ? t`Edit` : t`Preview`} placement="bottom-end">
          <Link to={`/auth/manage/restrictions/${row?.id}`}>
            <IconButton aria-label={canEdit() ? t`Edit` : t`Preview`}>
              {canEdit() ? <EditSharp /> : <NotesSharp />}
            </IconButton>
          </Link>
        </Tooltip>
      )}
      FormComponent={RestrictionForm}
      columns={[
        {
          label: t`Brief`,
          sortable: true,
          sortField: "type_of_measure_i18n",
          selector: (row: any) => row?.type_of_measure_i18n,
        },
        {
          label: t`Sector`,
          sortable: true,
          sortField: "sector__label_i18n",
          selector: (row: any) => row?.sector?.label,
        },
        {
          label: t`Country`,
          sortable: true,
          sortField: "country__name",
          selector: (row: any) => row?.country?.name,
        },
        {
          label: t`Deleted On`,
          omit: "active" === flag,
          sortable: true,
          sortField: "deleted_on",
          selector: (row: any) => formatDate(row?.deleted_on),
        },
        {
          label: t`Restriction Type`,
          sortable: true,
          sortField: "restriction_type",
          selector: (row: any) => row?.restriction_type,
        },
      ]}
    />
  );
}
