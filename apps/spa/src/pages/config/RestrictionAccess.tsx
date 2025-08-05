import * as React from "react";
import { t } from "ttag";

import { ToolTitle } from "@src/components/layout";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import PGrid from "@src/components/container/PGrid";
import PI18n from "@src/components/input/PI18n";

import { slugify } from "@src/app/utils";
import { usePermissions } from "@src/app/hooks";
import type { FormComponentProps } from "@src/components/types";


function RestrictionAccessForm({data, objects, errors}:FormComponentProps) {
  const [slug, setSlug] = React.useState<string>("");
  React.useEffect(() => {
    setSlug(data?.slug);
  }, [data]);
  return (
    <Stack spacing={2}>
      <PI18n
        fullWidth
        required
        name="label"
        label={t`Label`}
        data={data}
        defaultValue={data?.label_i18n}
        helperText={errors?.label}
        error={!!errors?.label}
        onChange={(val: string, lang: string) => {
          if ( "en" === lang ) {
            setSlug(slugify(val));
          }
        }}
      />
      <TextField
        fullWidth
        required
        error={!!errors?.slug}
        name="slug"
        label={t`Slug`}
        value={slug}
        onChange={(e) => setSlug(slugify(e.target.value as string))}
        helperText={errors?.slug}
      />
      <PI18n
        fullWidth
        multiline rows={5}
        name="description"
        label={t`Description`}
        data={data}
        defaultValue={data?.description_i18n}
        helperText={errors?.description}
        error={!!errors?.description}
      />
    </Stack>
  );
}

export default function RestrictionAccess() {
  const { hasPermissions } = usePermissions();
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Restriction Access`}
          brief={t`a brief description`}
        />
      }
      apiUrl={"/restrictions/restriction-access/"}
      hasAdd={hasPermissions(["restrictions.add_restrictionaccess"])}
      hasEdit={hasPermissions(["restrictions.change_restrictionaccess"])}
      hasDelete={hasPermissions(["restrictions.delete_restrictionaccess"])}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={RestrictionAccessForm}
      columns={[
        {
          label: t`Label`,
          sortable: true,
          sortField: "label_i18n",
          selector: (row: any) => row?.label_i18n,
        },
        {
          label: t`Description`,
          sortable: true,
          sortField: "description_i18n",
          selector: (row: any) => row?.description_i18n,
        }
      ]}
    />
  );
}
