import Stack from "@mui/material/Stack";

import DropNav from "./DropNav";
import MenuNav from "./MenuNav";
import type { BasicNavProps } from "./types";

interface NavProps extends BasicNavProps {
  mode?: "mobile" | "menu";
  sx?: any;
  grow?: boolean;
}

export default function Nav({ grow, mode, sx, currentLocation, tree } : NavProps) {
  if ( "mobile" === mode ) {
    return <DropNav mobile currentLocation={currentLocation} tree={tree} />
  }
  if ( "menu" !== mode ) {
    return <></>;
  }
  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        ...(!!grow && {minHeight: 64}),
        ...(sx || {}),
      }}
    >
      {tree.map((item, index) => (
        <MenuNav key={index} currentLocation={currentLocation} item={item} grow={grow} />
      ))}
    </Stack>
  )
}
