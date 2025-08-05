import { t } from "ttag";
import { styled } from "@mui/material/styles";

import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";

import EmojiFlagsSharp from "@mui/icons-material/EmojiFlagsSharp";

import { useAppSelector } from "@src/app/redux/store";
import Menu, { useMenuHook } from "../menu/Menu";
import { StyledIconButton } from "./buttons";

interface WideImgProps {
  width?: number;
}

const WideImg = styled("img", {
  shouldForwardProp: prop => "width" !== prop,
})<WideImgProps>(({theme, width}) => ({
  width: `${width || 24}px`,
  height: "auto",
}));
const SquareImg = styled("img")({
  width: "18px",
  height: "auto",
  margin: "4px",
});

interface CountryImgProps extends WideImgProps {
  iso: string;
  title?: string;
}

export function CountryImg({ iso, title, width } : CountryImgProps) {
  return (
    <WideImg
      width={width}
      title={title}
      alt={iso.toUpperCase()}
      src={`/static/spa/flag/4x3/${iso.toLowerCase()}.svg`}
    />
  );
}

interface CountryFilterProps {
  iso?: string;
  onSelect?: (selected: string) => void;
}

export default function CountryFilter({ iso, onSelect } : CountryFilterProps) {
  const countries = useAppSelector((state) => state.constants.countries);
  const { anchorEl, handleOpen, handleClose } = useMenuHook();
  const _onSelect = (selected: string) => () => {
    onSelect?.(selected);
    handleClose();
  };
  const title = "all" !== iso && countries?.length
    ? countries?.filter((c) => iso === c.slug).pop()?.label
    : t`All Countries`;
  return (
    <>
      <Tooltip title={title} placement="bottom-end">
        <StyledIconButton active={!!iso && "all" !== iso} aria-label={title} onClick={handleOpen}>
          {!iso || "all" === iso && <EmojiFlagsSharp />}
          {iso && "all" !== iso && <SquareImg src={`/static/spa/flag/1x1/${iso.toLowerCase()}.svg`} />}
        </StyledIconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        onClose={handleClose}
      >
        <MenuItem onClick={_onSelect("all")} selected={"all" === iso}>
          <ListItemIcon>
            <EmojiFlagsSharp />
          </ListItemIcon>
          {t`All Countries`}
        </MenuItem>
        <Divider />
        {countries?.map((c, i) => (
          <MenuItem key={i} onClick={_onSelect(c.slug)} selected={iso === c.slug}>
            <ListItemIcon><CountryImg iso={c.slug} /></ListItemIcon>
            {c.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
