import { t } from "ttag";

import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import CheckSharp from "@mui/icons-material/CheckSharp";
import FilterListSharp from "@mui/icons-material/FilterListSharp";
import FilterListOffSharp from "@mui/icons-material/FilterListOffSharp";

import Menu, { useMenuHook } from "../menu/Menu";
import { StyledIconButton } from "./buttons";

interface ToolMenuItemProps {
  check: boolean;
  label: string;
  onClick: () => void;
}

export function ToolMenuItem({ check, label, onClick }:ToolMenuItemProps) {
  return (
    <MenuItem onClick={onClick}>
      {check && (
        <>
          <ListItemIcon>
            <CheckSharp />
          </ListItemIcon>
          {label}
        </>
      )}
      {!check && <ListItemText inset>{label}</ListItemText>}
    </MenuItem>
  );
}

interface ItemProps {
  slug: string;
  label: string;
}

interface TableFilterProps {
  items: ItemProps[];
  hideClear?: boolean;
  title?: string;
  titleIcon?: (isFilterEnabled: boolean) => React.ReactNode;
  flag?: string;
  onSelect?: (selected: string) => void;
}

export default function TableFilter({
  items,
  hideClear = false,
  title,
  titleIcon,
  flag,
  onSelect
} : TableFilterProps) {

  const { anchorEl, handleOpen, handleClose } = useMenuHook();
  const _onSelect = (selected: string) => () => {
    onSelect?.(selected);
    handleClose();
  };
  const isFilterEnabled = hideClear ? true : Boolean(!!flag);
  return (
    <>
      <Tooltip title={title} placement="bottom-end">
        <StyledIconButton active={Boolean(!!flag)} aria-label={title} onClick={handleOpen}>
          {titleIcon ? titleIcon(isFilterEnabled) : (isFilterEnabled ? <FilterListSharp /> : <FilterListOffSharp />)}
        </StyledIconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        {!hideClear && (
          <>
            <ToolMenuItem
              check={"" === flag}
              label={t`Clear Filter`}
              onClick={_onSelect("")}
            />
            <Divider />
          </>
        )}
        {items.map((item, index) => (
          <ToolMenuItem
            key={index}
            check={item.slug === flag}
            label={item.label}
            onClick={_onSelect(item.slug)}
          />
        ))}
      </Menu>
    </>
  );
}
