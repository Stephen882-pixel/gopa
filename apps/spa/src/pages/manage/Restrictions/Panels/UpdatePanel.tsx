import * as React from "react";
import { t } from "ttag";
import { styled } from "@mui/material/styles";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import CloseSharp from "@mui/icons-material/CloseSharp";
import HistorySharp from "@mui/icons-material/HistorySharp";
import HistoryToggleOffSharp from "@mui/icons-material/HistoryToggleOffSharp";
import { TransitionProps } from "@mui/material/transitions";

import PViewDialog from "@src/components/container/PViewDialog";
import { ToolTitle } from "@src/components/layout";
import { useLocale, usePermissions } from "@src/app/hooks";
import { useAppSelector } from "@src/app/redux/store";

import RestrictionForm from "../Forms/RestrictionForm";
import RestrictionSkeletonForm from "../Forms/RestrictionSkeletonForm";

import type { PViewEvents } from "@src/components/types";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledGrid = styled(Grid)(({theme}) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
}));

interface UpdatePanelProps {
  restriction: any;
  index: string | undefined;
}
export default React.forwardRef<PViewEvents, UpdatePanelProps>(
  ({ restriction, index }, ref) => {

    const tRef = React.useRef<null | PViewEvents>(null);
    React.useImperativeHandle(ref, () => ({
      onRefresh: () => tRef?.current?.onRefresh(),
    }));

    const restrictionStatus = useAppSelector((state) => state.constants.restrictionStatus)

    const [data, setData] = React.useState<any>(null);
    const [open, setOpen] = React.useState<boolean>(false);

    const { formatDate } = useLocale();
    const { isStaff } = usePermissions();

    const speed = 300;
    const onOpen = (res: any) => {
      if ( !res?.previous_state ) {
        return;
      }
      setData(null);
      setOpen(true);
      setTimeout(() => setData(res), speed);
    };
    const onClose = () => {
      setOpen(false);
      setTimeout(() => setData(null), speed);
    };
    const historyTitle = (res: any) => res?.previous_state ? t`History` : t`History Off`;

    return (
      <Box>
        <PViewDialog
          ref={tRef}
          index={index}
          title={<ToolTitle title={t`View Updates`}/>}
          apiUrl="/restrictions/updates/"
          renderExtraAction={(row: any) => (
            <Tooltip title={historyTitle(row)} placement="bottom-end">
              <IconButton aria-label={historyTitle(row)} onClick={() => onOpen(row)}>
                {row?.previous_state ? <HistorySharp /> : <HistoryToggleOffSharp />}
              </IconButton>
            </Tooltip>
          )}
          columns={[
            {
              label: t`ID`,
              sortable: true,
              omit: true,
              sortField: "id",
              selector: (row: any) => row?.id,
            },
            {
              label: t`Reviewer`,
              sortable: false,
              omit: !isStaff,
              selector: (row: any) => row?.user?.display_name,
            },
            {
              label: t`Status`,
              sortable: false,
              selector: (row: any) => restrictionStatus?.filter((s) => s?.slug === row?.status).pop()?.label,
            },
            {
              label: t`Time Stamp`,
              sortable: false,
              selector: (row: any) => formatDate(row?.created_on),
            },
            {
              label: t`Update`,
              sortable: false,
              selector: (row: any) => row?.details_i18n,
            },
            {
              label: t`Remarks`,
              sortable: false,
              selector: (row: any) => row?.remarks_i18n,
            },
          ]}
        />
        <Dialog
          fullScreen
          open={open}
          onClose={onClose}
          slots={{
            transition: Transition,
          }}
        >
          <AppBar>
            <Toolbar>
              <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                {t`View Historical Data`}
              </Typography>
              <IconButton
                edge="start"
                color="inherit"
                onClick={onClose}
                aria-label="close"
              >
                <CloseSharp />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Box sx={{ mb: 8 }} />
          <Grid container spacing={2} sx={{ p: 2 }}>
            <StyledGrid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" component="div">
                {t`Current Record`}
              </Typography>
              <RestrictionForm data={restriction} objects={{ readOnly: true }} />
            </StyledGrid>
            <StyledGrid size={{ xs: 12, md: 6 }}>
              <Typography variant="h5" component="div">
                {data?.id ? formatDate(data?.created_on) : t`Loading ...`}
              </Typography>
              {data?.id ? <RestrictionForm data={data?.previous_state} objects={{ readOnly: true }} /> : <RestrictionSkeletonForm />}
            </StyledGrid>
          </Grid>
        </Dialog>
      </Box>
    );
  },
);
