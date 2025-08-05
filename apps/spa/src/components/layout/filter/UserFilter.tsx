
import Tooltip from "@mui/material/Tooltip";
import PersonSharp from "@mui/icons-material/PersonSharp";
import PersonOffSharp from "@mui/icons-material/PersonOffSharp";

import { StyledIconButton } from "./buttons";

interface UserFilterProps {
  title?: string;
  flag?: string;
  onSelect?: (selected: boolean) => void;
}

export default function UserFilter({ title, flag, onSelect }:UserFilterProps) {
  const active = Boolean(!!flag);
  return (
    <Tooltip title={title} placement="bottom-end">
      <StyledIconButton
        active={active}
        aria-label={title}
        onClick={() => onSelect?.(!active)}
      >
        {active ? <PersonSharp /> : <PersonOffSharp />}
      </StyledIconButton>
    </Tooltip>
  )
}
