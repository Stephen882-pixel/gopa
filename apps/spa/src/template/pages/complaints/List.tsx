import * as React from "react";
import { t } from "ttag";
import { useSearchParams } from "react-router-dom";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import NotesSharp from "@mui/icons-material/NotesSharp";

import DrawerBox, { DrawerContent, DrawerTools } from "@src/components/container/box/DrawerBox";
import PView from "@src/components/container/PView";
import CountryFilter from "@src/components/layout/filter/CountryFilter";
import TableFilter from "@src/components/layout/filter/TableFilter";
import UserFilter from "@src/components/layout/filter/UserFilter";
import ComplaintForm, { getDuration } from "@src/pages/manage/Complaints/Forms/ComplaintForm";
import { TitleText, SmallText } from "@src/components/layout";

import { toTitleCase } from "@src/app/utils";
import { usePermissions } from "@src/app/hooks";
import { useAppSelector } from "@src/app/redux/store";
import type { PObjectProps } from "@src/components/types";


export default function List() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hasLoggedIn } = usePermissions();

  const sectors = (useAppSelector((state) => state.cache.sectorList) as any[])
    .filter((c) => null === c.parent)
    .map((c) => ({
      slug: c.slug,
      label: toTitleCase(c.label),
    }));

  const [data, setData] = React.useState<PObjectProps | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    document.title = t`Overview Of Complaints`;
    window.scrollTo(0, 0);
  }, []);

  const setSearch = (key: string, value: string) => {
    const newSearchParams : URLSearchParams = new URLSearchParams();
    const place = (k: string, v: string | null) => {
      if ( v ) {
        newSearchParams.set(k, v);
      }
    };
    place(key, value);
    ["sector", "iso", "user"].forEach((k) => {
      if ( key !== k ) {
        place(k, searchParams.get(k) || null);
      }
    });
    setSearchParams(newSearchParams);
  };

  return (
    <>
      <Container sx={{ mb: 2, mt: 2 }} className="page-wrapper-A1">
        <PView
          title={
            <>
              <TitleText>
                {t`Overview Of Complaints`}
              </TitleText>
              <SmallText>
                {t`the list of complaints made within the portal`}
              </SmallText>
            </>
          }
          apiUrl="/pages/complaints/"
          orderBy={{
            column: 1,
            direction: "desc",
          }}
          defaultFilter={{
            sector: searchParams.get("sector"),
            user: searchParams.get("user"),
            iso: searchParams.get("iso"),
          }}
          renderExtraAction={(row: any) => (
            <Tooltip title={t`Preview`} placement="bottom-end">
              <IconButton onClick={() => { setData(row); setOpen(true); }} aria-label={t`Preview`}>
                <NotesSharp />
              </IconButton>
            </Tooltip>
          )}
          extraToolbar={({filter, onFilter}) => (
            <>
              <CountryFilter
                iso={filter?.iso || searchParams.get("iso") || "all"}
                onSelect={(iso: string) => {
                  setSearch("iso", iso);
                  onFilter?.({iso});
                }}
              />
              <TableFilter
                title={t`Sectors`}
                flag={filter?.sector || searchParams.get("sector") || ""}
                items={sectors}
                onSelect={(sector: string) => {
                  setSearch("sector", sector);
                  onFilter?.({sector});
                }}
              />
              {hasLoggedIn && (
                <UserFilter
                  title={t`My Complaints`}
                  flag={filter?.user || searchParams.get("user")}
                  onSelect={(selected: boolean) => {
                    const user = selected ? "current" : "";
                    setSearch("user", user);
                    onFilter?.({user});
                  }}
                />
              )}
            </>
          )}
          columns={[
            {
              label: t`Country Of Origin`,
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
              label: t`Status`,
              sortable: true,
              sortField: "status",
              selector: (row: any) => row?.status,
            },
          ]}
        />
      </Container>
      <DrawerBox
        open={open}
        onClose={() => setOpen(false)}
      >
        <DrawerContent>
          <ComplaintForm objects={{ readOnly: true }} data={data} />
        </DrawerContent>
        <Divider />
        <DrawerTools>
          <Button variant="text" onClick={() => setOpen(false)}>
            {t`Close`}
          </Button>
        </DrawerTools>
      </DrawerBox>
    </>
  );
}
