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

function ReportTagForm({data, objects, errors}:FormComponentProps) {
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
        name="slug"
        label={t`Slug`}
        value={slug}
        onChange={(e) => setSlug(slugify(e.target.value as string))}
        helperText={errors?.slug}
        error={!!errors?.slug}
      />
    </Stack>
  );
}

export default function ReportTags() {
  const { hasPermissions } = usePermissions();
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Report Tags`}
          brief={t`A list of tags that will be used to identify the various reports`}
        />
      }
      apiUrl={"/report/report-tags/"}
      hasAdd={hasPermissions(["core.add_reporttag"])}
      hasEdit={hasPermissions(["core.change_reporttag"])}
      hasDelete={hasPermissions(["core.delete_reporttag"])}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={ReportTagForm}
      columns={[
        {
          label: t`slug`,
          sortable: true,
          sortField: "Slug",
          selector: (row: any) => row?.slug,
        },
        {
          label: t`Label`,
          sortable: true,
          sortField: "label_i18n",
          selector: (row: any) => row?.label_i18n,
        },
      ]}
    />
  );
}
