import * as React from "react";
import { t } from "ttag";

import { ToolTitle } from "@src/components/layout";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";

import PI18n from "@src/components/input/PI18n";
import { usePermissions } from "@src/app/hooks";
import PGrid from "@src/components/container/PGrid";

import { slugify } from "@src/app/utils";
import type { FormComponentProps } from "@src/components/types";

function PolicyForm({data, objects, errors}:FormComponentProps) {
  const [slug, setSlug] = React.useState<string>("");
  React.useEffect(() => {
    setSlug(data?.slug);
  }, [data]);
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6 }}>
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
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          name="slug"
          label={t`Slug`}
          value={slug}
          helperText={errors?.slug}
          error={!!errors?.slug}
          onChange={(e) => setSlug(slugify(e.target.value as string))}
        />
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <TextField
          fullWidth
          required
          type="number"
          name="sequence"
          label={t`Sequence`}
          defaultValue={data?.sequence}
          helperText={errors?.sequence}
          error={!!errors?.sequence}
        />
      </Grid>
      <Grid size={12}>
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
      </Grid>
    </Grid>
  );
}

export default function Policy() {
  const { hasPermissions } = usePermissions();
  return (
    <PGrid
      title={
        <ToolTitle
          title={t`Policy`}
          brief={t`a brief description`}
        />
      }
      apiUrl={"/restrictions/policies/"}
      hasAdd={hasPermissions(["restrictions.add_policy"])}
      hasEdit={hasPermissions(["restrictions.change_policy"])}
      hasDelete={hasPermissions(["restrictions.delete_policy"])}
      orderBy={{
        column: 1,
        direction: "desc",
      }}
      FormComponent={PolicyForm}
      columns={[
        {
          label: t`Sequence`,
          sortable: true,
          sortField: "sequence",
          selector: (row: any) => row?.sequence,
        },
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
