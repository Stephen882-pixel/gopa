import { t } from "ttag";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditSharp from "@mui/icons-material/EditSharp";
import NotesSharp from "@mui/icons-material/NotesSharp";

import CountryFilter from "@src/components/layout/filter/CountryFilter";
import TableFilter from "@src/components/layout/filter/TableFilter";
import UserFilter from "@src/components/layout/filter/UserFilter";
import PGrid from "@src/components/container/PGrid";
import Link from "@src/components/Link";

import { toTitleCase } from "@src/app/utils";
import { ToolTitle } from "@src/components/layout";
import { useAppSelector } from "@src/app/redux/store";
import { usePermissions } from "@src/app/hooks";
import { getDuration} from "./Forms/ComplaintForm";


export default function List() {
  const { isStaff, hasPermissions } = usePermissions();
  const canEdit = hasPermissions(["restrictions.change_complaint", "restrictions.can_review", "restrictions.can_approve"], "OR");
  const sectors = (useAppSelector((state) => state.cache.sectorList) as any[])
    .filter((c) => null === c.parent)
    .map((c) => ({
      slug: c.slug,
      label: toTitleCase(c.label),
    }));
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Complaints`}
          brief={t`a brief description`}
        />
      }
      apiUrl="/restrictions/complaints/"
      hasAdd={false}
      hasEdit={false}
      hasPreview={false}
      hasDelete={false}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      extraToolbar={({filter, onFilter}) => (
        <>
          <CountryFilter
            iso={filter?.iso || "all"}
            onSelect={(iso: string) => onFilter?.({iso})}
          />
          <TableFilter
            title={t`Sectors`}
            flag={filter?.sector || ""}
            items={sectors}
            onSelect={(sector: string) => onFilter?.({sector})}
          />
          <UserFilter
            title={t`My Complaints`}
            flag={filter?.user}
            onSelect={(selected: boolean) => onFilter?.({user: selected ? "current" : ""})}
          />
        </>
      )}
      renderExtraAction={(row: any) => (
        <Tooltip title={canEdit ? t`Edit` : t`Preview`} placement="bottom-end">
          <Link to={`/auth/manage/complaints/${row?.id}`}>
            <IconButton aria-label={canEdit ? t`Edit` : t`Preview`}>
              {canEdit ? <EditSharp /> : <NotesSharp />}
            </IconButton>
          </Link>
        </Tooltip>
      )}
      columns={[
        {
          label: t`Origin Country`,
          sortable: true,
          sortField: "origin_country__name",
          selector: (row: any) => row?.origin_country?.name,
        },
        {
          label: t`Destination Country`,
          sortable: true,
          sortField: "target_country__name",
          selector: (row: any) => row?.target_country?.name,
        },
        {
          label: t`Sector`,
          sortable: true,
          sortField: "sector__label_i18n",
          selector: (row: any) => row?.sector?.label,
        },
        {
          label: t`Policy`,
          sortable: true,
          sortField: "policy__label_i18n",
          selector: (row: any) => row?.policy?.label,
        },
        {
          label: t`Duration`,
          sortable: false,
          selector: (row: any) => getDuration(row),
        },
        {
          label: t`Applicant`,
          omit: !isStaff,
          sortable: false,
          selector: (row: any) => row?.user?.display_name,
        },
        {
          label: t`Status`,
          sortable: true,
          sortField: "status",
          selector: (row: any) => row?.status,
        },
      ]}
    />
  );
}
