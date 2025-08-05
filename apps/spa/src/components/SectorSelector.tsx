import * as React from "react";
import { t } from "ttag";

import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import ListSharp from "@mui/icons-material/ListSharp";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";

import PLoader from "@src/components/loader/PLoader";
import PSelect from "@src/components/input/PSelect";
import PTree, { buildTree } from "@src/components/container/PTree";
import Menu, { useMenuHook } from "@src/components/layout/menu/Menu";

import { makeId } from "@src/app/utils";
import { loadSectors } from "@src/app/redux/slice/cache";
import { useAppSelector, useAppDispatch } from "@src/app/redux/store";
import type { PFlatTreeItem, PTreeItem, SectorSelectorProps, SectorSelectorEvents } from "@src/components/types";


export default React.forwardRef<SectorSelectorEvents, SectorSelectorProps>(
  (
    {
      name,
      label,
      error,
      disabled,
      required,
      readOnly,
      helperText,
      fullWidth,
      defaultValue,

      multiSelect,
      checkboxSelection,
      onSelect,

      parentId,
      mode = "display",
    },
    ref,
  ) => {

    const dispatch = useAppDispatch();
    const cache = useAppSelector((state) => state.cache.sectorList) as PFlatTreeItem[];
    const [loading, setLoading] = React.useState<boolean>(false);

    const oId = makeId(12);
    const tId = makeId(12);
    const [value, setValue] = React.useState<string>("");
    const [btn, setBtn] = React.useState<null | HTMLElement>(null);
    const { anchorEl, handleOpen, handleClose } = useMenuHook();

    const getLabel = () => {
      if ( null === cache ) {
        return "";
      }
      const list = value.split(",");
      return cache
        .filter((c: PFlatTreeItem) => list.includes(String(c.id)))
        .map((c: PFlatTreeItem) => c.label)
        .join(", ");
    };

    React.useEffect(() => {
      setValue(String(defaultValue || ""));
    }, [defaultValue]);

    React.useImperativeHandle(ref, () => ({
      onRefresh: () => {
        setLoading(true);
        return dispatch(loadSectors("dummy")).then(() => setLoading(false));
      },
    }));

    if ( "display" === mode ) {
      return (
        <Box
          className="select_style_B"
          sx={{
            position: "relative",
          }}
        >
          <PTree
            tree={buildTree(cache || [], parentId)}
            multiSelect={multiSelect}
            checkboxSelection={checkboxSelection}
            defaultSelectedItems={String(defaultValue || "").split(",")}
            onSelect={(nodes: any[]) => {
              onSelect?.(nodes);
            }}
          />
          <PLoader loading={loading} />
        </Box>
      );
    }

    if ( "simple" === mode ) {
      const [subs, setSubs] = React.useState<PTreeItem[]>([]);
      const [dubs, setDubs] = React.useState<PTreeItem[]>([]);
      const tree = buildTree(cache || []);
      return (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <PSelect
              fullWidth
              required={required}
              error={error}
              label={t`Sector`}
              onChange={(val: string) => {
                const item = tree.filter((t: PTreeItem) => val === t.id).pop();
                setSubs(item?.children as PTreeItem[]);
                setDubs([]);
              }}
            >
              {tree.map((item, index) => <MenuItem key={index} value={item.id}>{item.label}</MenuItem>)}
            </PSelect>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <PSelect
              fullWidth
              required={required}
              error={error}
              name={0 === dubs.length ? name : undefined}
              disabled={0 === subs.length}
              label={t`Sub Sector`}
              helperText={0 === dubs.length ? helperText : undefined}
              onChange={(val: string) => {
                const item = subs.filter((t: PTreeItem) => val === t.id).pop();
                if ( item?.children ) {
                  setDubs(item?.children as PTreeItem[]);
                }
              }}
            >
              {subs.map((item, index) => <MenuItem key={index} value={item.id}>{item.label}</MenuItem>)}
            </PSelect>
          </Grid>
          {0 < dubs.length && (
            <Grid size={{ xs: 12, md: 6 }}>
              <PSelect
                fullWidth
                required={required}
                error={error}
                name={name}
                label={t`Specific Service`}
                helperText={helperText}
              >
                {dubs.map((item, index) => <MenuItem key={index} value={item.id}>{item.label}</MenuItem>)}
              </PSelect>
            </Grid>
          )}
        </Grid>
      );
    }

    return (
      <FormControl fullWidth={!!fullWidth} error={!!error} variant="outlined">
        <InputLabel htmlFor={oId} id={makeId(12)}>{label} {required ? "*" : ""}</InputLabel>
        <input type="hidden" name={name} value={value} />
        <OutlinedInput
          readOnly
          id={oId}
          required={required}
          label={label}
          error={error}
          fullWidth={fullWidth}
          value={getLabel()}
          onClick={() => btn?.click()}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                ref={(input) => setBtn(input)}
                aria-label={t`Choose a sector`}
                disabled={disabled || readOnly}
                onClick={handleOpen}
                edge="end"
              >
                <ListSharp />
              </IconButton>
            </InputAdornment>
          }
        />
        {!!helperText && <FormHelperText>{helperText}</FormHelperText>}
        <Menu
          anchorEl={anchorEl}
          onClose={handleClose}
        >
          <Box
            sx={
              (theme) => ({
                p: 1,
                height: "30vh",
                maxWidth: "80dvw",
                overflow: "auto",
                [theme.breakpoints.up("sm")]: {
                  maxWidth: "60dvw",
                },
                [theme.breakpoints.up("md")]: {
                  maxWidth: "40dvw",
                },
                [theme.breakpoints.up("lg")]: {
                  maxWidth: "25dvw",
                },
              })
            }
          >
            <PTree
              id={tId}
              tree={buildTree(cache || [], parentId)}
              multiSelect={multiSelect}
              checkboxSelection={checkboxSelection}
              defaultSelectedItems={value.split(",")}
              onSelect={(nodes: any[]) => {
                setValue(nodes.map((c: PTreeItem) => c.id).join(","))
                onSelect?.(nodes);
              }}
            />
          </Box>
        </Menu>
      </FormControl>
    );
  },
);
