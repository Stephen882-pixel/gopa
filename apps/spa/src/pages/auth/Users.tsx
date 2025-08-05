import { useState, useEffect } from "react";
import { t } from "ttag";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";

import TableFilter from "@src/components/layout/filter/TableFilter";
import PAutocomplete from "@src/components/input/PAutocomplete";
import PGrid from "@src/components/container/PGrid";

import CheckBoxSharp from "@mui/icons-material/CheckBoxSharp";
import CheckBoxOutlineBlankSharp from "@mui/icons-material/CheckBoxOutlineBlankSharp";

import { ToolTitle } from "@src/components/layout";
import { useLocale, usePermissions } from "@src/app/hooks";

import type { FormComponentProps } from "@src/components/types";


function UserForm({data, objects, errors}:FormComponentProps) {
  const [email, setEmail] = useState<string>("");
  const readOnly = data?.id && !data?.is_staff;
  useEffect(() => {
    setEmail(data?.username);
  }, [data]);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <TextField
          fullWidth
          required
          name="username"
          type="email"
          label={t`Email`}
          value={email}
          onChange={(e) => setEmail((e.target.value as string).toLowerCase())}
          helperText={errors?.username}
          error={!!errors?.username}
          slotProps={{ input: { readOnly } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <PAutocomplete
          fullWidth multiple
          readOnly={readOnly}
          name="groups"
          label={t`Groups`}
          api={"/auth/user-groups/"}
          serialise={(g: any) => ({ id: g?.id, label: g?.name })}
          defaultValue={data?.groups?.map((g: any) => ({ id: g?.id, label: g?.name }))}
          helperText={errors?.groups}
          error={!!errors?.groups}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="first_name"
          label={t`First Name`}
          defaultValue={data?.first_name}
          helperText={errors?.first_name}
          error={!!errors?.first_name}
          slotProps={{ input: { readOnly } }}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          name="last_name"
          label={t`Last Name`}
          defaultValue={data?.last_name}
          helperText={errors?.last_name}
          error={!!errors?.last_name}
          slotProps={{ input: { readOnly } }}
        />
      </Grid>
      {data?.id && (
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControlLabel
            label={t`Is Active`}
            control={
              <Checkbox
                name="is_active"
                defaultChecked={data?.is_active}
              />
            }
          />
        </Grid>
      )}
    </Grid>
  );
}

export default function Users() {
  const { hasPermissions } = usePermissions();
  const { formatDate } = useLocale();
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Users`}
          brief={t`a list of users within the portal`}
        />
      }
      apiUrl={"/auth/users/"}
      hasAdd={hasPermissions(["auth.add_user"])}
      hasEdit={hasPermissions(["auth.change_user"])}
      hasDelete={hasPermissions(["auth.delete_user"])}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      extraToolbar={({filter, onFilter}) => (
        <TableFilter
          hideClear
          items={[
            { slug: "staff", label: t`Staff Account` },
            { slug: "client", label: t`Client Account` },
          ]}
          flag={filter?.flag || "staff"}
          onSelect={(selected: string) => onFilter?.({flag: selected})}
        />
      )}
      FormComponent={UserForm}
      columns={[
        {
          label: t`Email`,
          sortable: true,
          sortField: "username",
          selector: (row: any) => row?.username,
        },
        {
          label: t`Last Login`,
          sortable: true,
          sortField: "last_login",
          selector: (row: any) => formatDate(row?.last_login),
        },
        {
          label: t`Is Active`,
          sortable: true,
          sortField: "is_active",
          selector: (row: any) => row?.is_active ? <CheckBoxSharp color="primary" /> : <CheckBoxOutlineBlankSharp color="primary" />,
        },
        {
          label: t`Display Name`,
          sortable: false,
          selector: (row: any) => [row?.first_name, row?.last_name].filter(s => String(s || "").trim()).join(" "),
        },
        {
          label: t`Groups`,
          sortable: false,
          selector: (row: any) => row?.groups?.map((g: any) => g?.name).join(", "),
        },
      ]}
    />
  );
}
