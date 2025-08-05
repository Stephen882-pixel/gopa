import * as React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { t } from "ttag";

import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
// import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

import PLoader from "@src/components/loader/PLoader";
import { WidePanel, ToolPanel } from "@src/components/layout";

import { onApiError } from "@src/app/utils";
import { useFetch } from "@src/app/hooks";

import { useAppSelector } from "@src/app/redux/store";

export default function Restriction() {
  const constants = useAppSelector((state) => state.constants);
  const cache = useAppSelector((state) => state.cache.restriction);
  const navigate = useNavigate();
  const { slug } = useParams();
  const [{ loading }, apiCall] = useFetch({
    url: "/pages/restrictions/",
    params: { slug }
  });

  const [item, setItem] = React.useState<any>({});
  const hideBorder = {
    borderBottom: "none",
  };

  const getVal = (constant: null | Array<any>, key?: string) => {
    if ( undefined === key ) {
      return t`Not Defined`;
    }
    return constant?.filter(c => key === c?.slug).map(c => c?.label).join(", ") || t`Not Defined`;
  };

  React.useEffect(() => {
    document.title = t`View Restriction`;
    window.scrollTo(0, 0);

    if ( null !== cache ) {
      setItem(cache);
    }
    else {
      apiCall()
        .then((res: any) => setItem(res?.results?.pop()))
        .catch(onApiError);
    }
  }, []);

  return (
    <>
      {/* <Container sx={{ display: "flex", p: 1 }}> */}
        {/* <WidePanel>{item?.sector?.label}</WidePanel> */}
        {/* <ToolPanel>{item?.country?.name}</ToolPanel> */}
      {/* </Container> */}

      <div className="single_restrction_header">
      <Container sx={{ display: "flex" }}>
        <Typography
          className="heading-type-C"
          variant="h3"
          sx={{ p: 1 }}
        >
          {item?.type_of_measure_i18n}
        </Typography>
      </Container>
      <Container sx={{ display: "flex", pb: 3 }}>
        {/* <WidePanel /> */}
        {/* <ToolPanel>
          {t`Introduced In`} {item?.year_introduced}
          {item?.sector?.label}
          {item?.country?.name}
        </ToolPanel> */}

        <ul className="single_restrction_meta">
          <li>{t`Introduced In`} {item?.year_introduced}</li>
          <li className="single_restriction_meta_bullet">&bull;</li>
          <li>{item?.sector?.label}</li>
          <li className="single_restriction_meta_bullet">&bull;</li>
          <li>{item?.country?.name}</li>
        </ul>
      </Container>
      </div>


      {/* <Divider /> */}
      <Container
        className="restrictions-A3"
        sx={{
          display: "flex",
          pt: 3,
          pb: 3,
        }}
      >
        <WidePanel>
          <Button
            variant="outlined"
            // aria-label={t`Back`}
            color="primary"
            onClick={() => navigate(-1)}
          >
            {t`Back`}
          </Button>
        </WidePanel>
        <ToolPanel className="restrictions-A4">
          <Button
            variant="outlined"
            aria-label={t`Register Complaint`}
            onClick={() => navigate(`/public/complaints/${slug}`)}
          >
            {t`Register Complaint`}
          </Button>
        </ToolPanel>
      </Container>
      {/* <Divider /> */}
      <Container
        sx={{
          pt: 3,
          pb: 3,
        }}
      >
        <Table className="restriction_table">
          <TableBody className="restriction_table_tbody">
            <TableRow className="restriction_table_row">
              <TableCell>
                <Typography variant="h5">
                  {t`Text Of Measure`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.text_of_measure_i18n}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Description Of Measure`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.type_of_measure_i18n}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell rowSpan={5}>
                <Typography variant="h5">
                  {t`Brief`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Sector`}
                </Typography>
                <Typography variant="body1">
                  {item?.sector?.label}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Country`}
                </Typography>
                <Typography variant="body1">
                  {item?.country?.name}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h6">
                  {t`Type Of Restriction`}
                </Typography>
                <Typography variant="body1">
                  {getVal(constants.restrictionTypes, item?.restriction_type)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Restriction On Market Access`}
                </Typography>
                <Typography variant="body1">
                  {item?.restriction_access?.map((r: any) => r?.label).join(", ") || t`Not Defined`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h6">
                  {t`Restriction On National Treatment`}
                </Typography>
                <Typography variant="body1">
                  {getVal(constants.discriminativeList, item?.restriction_on_national_treatment)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Type Of Non-Compliance`}
                </Typography>
                <Typography variant="body1">
                  {getVal(constants.nonComplianceTypes, item?.non_compliance)}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h6">
                  {t`Mode Of Supply Affected`}
                </Typography>
                <Typography variant="body1">
                  {getVal(constants.modeOfSupply, item?.mode_of_supply_affected)}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Restrictiveness Numerical Indicator`}
                </Typography>
                <Typography variant="body1">
                  {item?.numerical_indicator || t`Not Defined`}
                </Typography>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>
                <Typography variant="h6">
                  {t`Type Of Measure`}
                </Typography>
                <Typography variant="body1">
                  {getVal(constants.typeOfMeasureList, item?.type_of_measure_code)}
                </Typography>
              </TableCell>
              <TableCell />
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Responsible Ministry/Agency`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.responsible_ministry}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Commitments Made`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.commitments_made}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Other Dates`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Proposed Year Of Removal Of The Restriction By The Partner State`}
                </Typography>
                <Typography variant="body1">
                  {item?.year_of_removal_proposal || t`Not Defined`}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="h6">
                  {t`Year Measure Was Removed Or Amended`}
                </Typography>
                <Typography variant="body1">
                  {item?.year_of_removal || t`Not Defined`}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Complaints`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.complaints || t`None`}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                <Typography variant="h5">
                  {t`Update by Partner State`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2}>
                <Typography variant="body1">
                  {item?.latest?.update}
                </Typography>
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell sx={hideBorder}>
                <Typography variant="h5">
                  {t`Remarks`}
                </Typography>
              </TableCell>
              <TableCell colSpan={2} sx={hideBorder}>
                <Typography variant="body1">
                  {item?.latest?.remarks}
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Container>
      <PLoader loading={loading} />
    </>
  );
}
