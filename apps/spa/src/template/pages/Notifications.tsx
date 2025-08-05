import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import SaveAltSharp from "@mui/icons-material/SaveAltSharp";
import EmojiFlagsSharp from "@mui/icons-material/EmojiFlagsSharp";

import PView from "@src/components/container/PView";
import CountryFilter, { CountryImg } from "@src/components/layout/filter/CountryFilter";
import TableFilter from "@src/components/layout/filter/TableFilter";

import { TitleText, SmallText } from "@src/components/layout";
import { useAppSelector } from "@src/app/redux/store";
import { useLocale } from "@src/app/hooks";

const Disabled = styled("span")(({theme}) => ({
  color: theme.palette.divider,
}));

export default function Notifications() {
  const notificationStatus = useAppSelector((state) => state.constants.notificationStatus);
  const { formatDate } = useLocale();

  React.useEffect(() => {
    document.title = t`Notifications`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Container sx={{ mb: 2, mt: 2 }} className="page-wrapper-A1">
        <PView
          title={
            <>
              <TitleText>
                {t`Notifications`}
              </TitleText>
              <SmallText>
                {t`Notifications of requirements under the Services Directive`}
              </SmallText>
            </>
          }
          apiUrl="/pages/notifications/"
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
            {
              label: t`Reference`,
              sortable: true,
              sortField: "requirement",
              selector: (row: any) => (
                <>
                  {!row?.document?.file && <Disabled><SaveAltSharp /></Disabled>}
                  {row?.document?.file && (
                    <Link target="_blank" href={row?.document?.file}>
                      <SaveAltSharp />
                    </Link>
                  )}
                </>
              ),
            },
          ]}
        />
      </Container>
    </>
  );
}
