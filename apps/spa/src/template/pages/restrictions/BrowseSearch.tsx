import * as React from "react";
import { t } from "ttag";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import FilterListSharp from "@mui/icons-material/FilterListSharp";

import SectorSelector from "@src/components/SectorSelector";
import DrawerBox, { DrawerContent } from "@src/components/container/box/DrawerBox";
import { useAppSelector } from "@src/app/redux/store";

type OptProps = {
  iso: string;
  sector?: string;
  search: boolean | string;
};

type SearchCardProps = {
  parentId?: string;
  selected?: string;
  iso?: string;
  onSearch?: (opts: OptProps) => void;
};

export default function BrowseSearch({ parentId, selected, iso, onSearch } : SearchCardProps) {
  const countries = useAppSelector((state) => state.constants.countries);
  const navigate = useNavigate();

  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("xl"));

  const [open, setOpen] = React.useState<boolean>(false);
  const [opts, _setOpts] = React.useState<OptProps>({
    iso: iso || "", search: ""
  });
  const setOpts = (o: any) => {
    const updated = {...opts, ...o};
    onSearch?.(updated);
    _setOpts(updated);
  };

  return (
    <>
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: "center", width: { xs: "100%", xl: "70%" } }}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={1}
            useFlexGap
            sx={{ pt: 2, width: "100%" }}
          >
            <Select
              value={opts?.iso}
              onChange={(event: SelectChangeEvent) => setOpts({ search: true, iso: event.target.value as string })}
            >
              <MenuItem value="all">{t`All Countries`}</MenuItem>
              {countries?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
            </Select>
            <TextField
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => setOpts({ search: event.target.value as string })}
              variant="outlined"
              aria-label={t`Search`}
              placeholder={t`Search`}
              fullWidth
              slotProps={{
                htmlInput: {
                  autoComplete: "off",
                  "aria-label": t`Search for a restriction`,
                },
              }}
            />
            {matches && (
              <Tooltip title={t`Refine Your Selection`} placement="bottom-end">
                <Button
                  variant="outlined"
                  aria-label={t`Refine Your Selection`}
                  onClick={() => setOpen(true)}
                  sx={{
                    textTransform: "inherit",
                    minWidth: "fit-content",
                  }}
                >
                  <FilterListSharp />
                </Button>
              </Tooltip>
            )}
            {parentId && (
              <Button
                variant="contained"
                aria-label={t`View All Sectors`}
                color="primary"
                sx={{ textTransform: "inherit", minWidth: "fit-content" }}
                onClick={() => navigate("/public/browse")}
              >
                {t`View All Sectors`}
              </Button>
            )}
          </Stack>
        </Stack>
      </Container>
      {matches && (
        <DrawerBox
          open={open}
          onClose={() => setOpen(false)}
        >
          <DrawerContent>
            <Typography sx={{ fontSize: "1.8rem" }}>{t`Refine Your Selection`}</Typography>
            <SectorSelector
              parentId={parentId}
              multiSelect={true}
              defaultValue={selected}
              checkboxSelection={true}
              onSelect={(nodes: any[]) => {
                setOpts({ sector: nodes.map((n: any) => n.slug).join(",") });
              }}
            />
          </DrawerContent>
        </DrawerBox>
      )}
    </>
  )
}
