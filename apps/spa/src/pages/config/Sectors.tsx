import * as React from "react";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";

import PCardPanel from "@src/components/container/PCardPanel";
import PForm, { usePForm } from "@src/components/container/PForm";
import PLoader from "@src/components/loader/PLoader";
import PI18n from "@src/components/input/PI18n";
import SectorSelector from "@src/components/SectorSelector";
import { ToolTitle } from "@src/components/layout";

import { useFetch, usePermissions } from "@src/app/hooks";
import { cSwal, onApiSuccess } from "@src/app/utils";
import type { PObjectProps, SectorSelectorEvents } from "@src/components/types";

export default function Sectors() {
  const [data, setData] = React.useState<PObjectProps | null>(null);
  const sRef = React.useRef<null | SectorSelectorEvents>(null);

  const { hasPermissions } = usePermissions();
  const canEdit = hasPermissions(["restrictions.change_sector"]);

  const [{loading}, apiCall] = useFetch();
  const { errors, onSubmit } = usePForm({
    onSubmit: (_data: any) => {
      const _o: PObjectProps = {};
      for (const [key, value] of _data.entries()) {
        _o[key] = value;
      }
      setData({...data, ..._o});
      return apiCall({
        url: `/restrictions/sectors/${data?.id}/`,
        method: "PUT",
        data: _data,
      });
    },
    onSubmitSuccess: (res: any) => {
      onApiSuccess();
      sRef?.current?.onRefresh();
    },
  });

  return (
    <Grid container spacing={2} sx={{ width: "100%" }}>
      <Grid size={{ xs: 12, sm: 6 }}>
        <PCardPanel title={<ToolTitle title={t`Edit Sector`} />}>
          <PForm
            onSubmit={onSubmit}
            onValidate={() => {
              if ( data?.id ) {
                return true;
              }
              cSwal({
                icon: "info",
                title: t`Please Note`,
                text: t`Select a sector from the list of sectors availed.`,
              });
              return false;
            }}
          >
            <Stack spacing={2}>
              <PI18n
                fullWidth
                required
                name="label"
                label={t`Label`}
                data={data}
                defaultValue={data?.label}
                helperText={errors?.label}
                error={!!errors?.label}
              />
              <PI18n
                fullWidth multiline rows={5}
                name="description"
                label={t`Description`}
                data={data}
                defaultValue={data?.description}
                helperText={errors?.description}
                error={!!errors?.description}
              />
            </Stack>
            <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
              {canEdit && (
                <Button variant="contained" type="submit">
                  {t`Update`}
                </Button>
              )}
            </Stack>
          </PForm>
        </PCardPanel>
      </Grid>
      <Grid size={{ xs: 12, sm: 6 }}>
        <PCardPanel title={<ToolTitle title={t`Sectors`} />}>
          <SectorSelector
            ref={sRef}
            onSelect={(nodes: any[]) => {
              setData(nodes[0]);
            }}
          />
        </PCardPanel>
      </Grid>
      <PLoader loading={loading} />
    </Grid>
  );
}
