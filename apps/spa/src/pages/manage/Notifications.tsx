import { t } from "ttag";

import Grid from "@mui/material/Grid2";
import MenuItem from "@mui/material/MenuItem";
import EmojiFlagsSharp from "@mui/icons-material/EmojiFlagsSharp";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import PGrid from "@src/components/container/PGrid";
import PSelect from "@src/components/input/PSelect";
import PUpload from "@src/components/input/Upload/PUpload";
import PI18n from "@src/components/input/PI18n";
import SectorSelector from "@src/components/SectorSelector";
import CountryFilter, { CountryImg } from "@src/components/layout/filter/CountryFilter";
import TableFilter from "@src/components/layout/filter/TableFilter";

import { ToolTitle } from "@src/components/layout";
import { useAppSelector } from "@src/app/redux/store";
import { useLocale, usePermissions } from "@src/app/hooks";

import type { FormComponentProps } from "@src/components/types";

function NotificationForm({data, objects, errors, setContent}:FormComponentProps) {
  const constants = useAppSelector((state) => state.constants);
  const { asDate } = useLocale();
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <SectorSelector
          fullWidth
          required
          mode="input"
          name="sector"
          label={t`Sector`}
          defaultValue={data?.sector?.id}
          helperText={errors?.sector}
          error={!!errors?.sector}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth required
          name="country"
          label={t`Country`}
          defaultValue={data?.country?.iso}
          helperText={errors?.country}
          error={!!errors?.country}
        >
          {constants.countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <PSelect
          fullWidth required
          name="status"
          label={t`Status`}
          defaultValue={data?.status}
          helperText={errors?.status}
          error={!!errors?.status}
        >
          {constants.notificationStatus?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
        </PSelect>
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DatePicker
          name="notification_date"
          label={t`Notification Date`}
          defaultValue={asDate(data?.notification_date)}
          slotProps={{
            textField: {
              fullWidth: true,
              required: true,
              helperText: errors?.notification_date,
              error: !!errors?.notification_date,
            }
          }}
        />
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth required
          name="applicability"
          label={t`Applicability`}
          data={data}
          defaultValue={data?.applicability_i18n}
          helperText={errors?.applicability}
          error={!!errors?.applicability}
        />
      </Grid>
      <Grid size={12}>
        <PI18n
          fullWidth
          multiline rows={5}
          name="requirement"
          label={t`Requirement`}
          data={data}
          defaultValue={data?.requirement_i18n}
          helperText={errors?.requirement}
          error={!!errors?.requirement}
        />
      </Grid>
      <Grid size={12}>
        <PUpload
          name="_document"
          label={t`Documents`}
          defaultValue={data?.document}
          helperText={errors?._document}
          error={!!errors?._document}
          onChange={(files: File[]) => setContent?.("_document", files)}
        />
      </Grid>
    </Grid>
  );
}

export default function Notifications() {
  const notificationStatus = useAppSelector((state) => state.constants.notificationStatus);
  const { hasPermissions } = usePermissions();
  const { formatDate } = useLocale();
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Notifications`}
          brief={t`a brief description`}
        />
      }
      apiUrl="/restrictions/notifications/"
      hasAdd={hasPermissions(["restrictions.add_notification"])}
      hasEdit={hasPermissions(["restrictions.change_notification"])}
      hasDelete={hasPermissions(["restrictions.delete_notification"])}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={NotificationForm}
      extraToolbar={({filter, onFilter}) => (
        <>
          <CountryFilter
            iso={filter?.iso || "all"}
            onSelect={(iso: string) => onFilter?.({iso})}
          />
          <TableFilter
            title={t`Status`}
            flag={filter?.status || ""}
            items={notificationStatus}
            onSelect={(status: string) => onFilter?.({status})}
          />
        </>
      )}
      columns={[
        {
          label: t`Sector`,
          sortable: true,
          sortField: "sector__label_i18n",
          selector: (row: any) => row?.sector?.label,
        },
        {
          label: t`Applicability`,
          sortable: true,
          sortField: "applicability_i18n",
          selector: (row: any) => row?.applicability_i18n,
        },
        {
          label: t`Requirement`,
          sortable: true,
          sortField: "requirement_i18n",
          selector: (row: any) => row?.requirement_i18n,
        },
        {
          label: <EmojiFlagsSharp />,
          sortable: true,
          sortField: "country__name",
          selector: (row: any) => <CountryImg iso={row?.country?.iso} title={row?.country?.name} />,
        },
        {
          label: t`Status`,
          sortable: true,
          sortField: "status",
          selector: (row: any) => row?.status,
        },
        {
          label: t`Notification Date`,
          sortable: true,
          sortField: "notification_date",
          selector: (row: any) => formatDate(row?.notification_date, "date"),
        },
      ]}
    />
  );
}
