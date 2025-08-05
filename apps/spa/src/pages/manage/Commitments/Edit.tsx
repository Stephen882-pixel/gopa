import * as React from "react";
import { useParams } from "react-router-dom";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid2";
import Skeleton from "@mui/material/Skeleton";

import Link from "@src/components/Link";
import PGrid from "@src/components/container/PGrid";
import PForm, { usePForm } from "@src/components/container/PForm";
import PCardPanel from "@src/components/container/PCardPanel";
import CountryFilter from "@src/components/layout/filter/CountryFilter";
import { ButtonBox } from "@src/pages/auth/Register/styles";
import { ToolTitle } from "@src/components/layout";

import { onApiError } from "@src/app/utils";
import { useFetch, usePermissions } from "@src/app/hooks";

import CommitmentLineForm from "./CommitmentLineForm";
import CommitmentForm from "./CommitmentForm";

export default function Edit() {
  const [data, setData] = React.useState<any>(null);
  const { hasPermissions } = usePermissions();
  const { index } = useParams();
  const perms = {
    add: hasPermissions(["restrictions.add_commitment"]),
    edit: hasPermissions(["restrictions.change_commitment"]),
    delete: hasPermissions(["restrictions.delete_commitment"]),
  };

  const [{ loading }, apiCall] = useFetch({
    url: `/restrictions/commitments/${index}/`,
  });

  const { onSubmit } = usePForm({
    onSubmit: (data: any) => apiCall({ method: "PUT", data }).then((res: any) => {
      setData(res);
      return res;
    }),
  });

  React.useEffect(() => {
    apiCall()
      .then((res: any) => setData(res))
      .catch(onApiError);
  }, []);

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 5, lg: 4, xl: 3 }}>
        <PCardPanel title={<ToolTitle title={t`Brief`} />}>
          <PForm onSubmit={onSubmit}>
            {data?.id ? <CommitmentForm data={data} /> : (
              <Grid container spacing={2}>
                <Skeleton variant="rectangular" width={"100%"} height={53} />
                <Skeleton variant="rectangular" width={"100%"} height={130} />
              </Grid>
            )}
            <ButtonBox>
              <Link to="/auth/manage/commitments">
                <Button type="button" variant="outlined" aria-label={t`Back`}>
                  {t`Back`}
                </Button>
              </Link>
              <span />
              {perms.edit && data?.id && (
                <Button type="submit" loading={loading} variant="contained" aria-label={t`Update`}>
                  {t`Update`}
                </Button>
              )}
            </ButtonBox>
          </PForm>
        </PCardPanel>
      </Grid>
      <Grid size={{ xs: 12, sm: 7, lg: 8, xl: 9 }}>
        <PGrid
          title={<ToolTitle title={t`Commitments Made`}/>}
          apiUrl={"/restrictions/commitment-lines/"}
          hasAdd={perms.add}
          hasEdit={perms.edit}
          hasDelete={perms.delete}
          orderBy={{
            column: 1,
            direction: "desc",
          }}
          defaultFilter={{ index }}
          objects={{ index }}
          extraToolbar={({filter, onFilter}) => (
            <CountryFilter
              iso={filter?.iso || "all"}
              onSelect={(iso: string) => onFilter?.({iso})}
            />
          )}
          FormComponent={CommitmentLineForm}
          columns={[
            {
              label: t`Country`,
              sortable: true,
              sortField: "country__name",
              selector: (row: any) => row?.country?.name,
            },
            {
              label: t`Sector`,
              sortable: true,
              sortField: "sector__label_i18n",
              selector: (row: any) => row?.sector?.label,
            },
            {
              label: t`Number Of Commitments`,
              sortable: true,
              sortField: "value",
              selector: (row: any) => row?.value,
            },
          ]}
        />
      </Grid>
    </Grid>
  );
}
