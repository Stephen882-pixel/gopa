import * as React from "react";
import { t } from "ttag";

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import ExpandMoreSharp from "@mui/icons-material/ExpandMoreSharp";

import HeroPanel from "@src/template/components/Panels/HeroPanel";
import { buildTree } from "@src/components/container/PTree";

import { useAppSelector } from "@src/app/redux/store";
import type { PFlatTreeItem, PTreeItem } from "@src/components/types";

export default function SectorDisplay() {
  const cache = useAppSelector((state) => state.cache.sectorList) as PFlatTreeItem[];

  // function showItem(item: any) {
  //   if ( item.children ) {
  //     return (
  //       <li>
  //         <b>{item.label}</b>
  //         {item.description && <><br />{item.description}</>}
  //         {renderTree(item.children)}
  //       </li>
  //     );
  //   }
  //   else {
  //     return (
  //       <li>
  //         <b>{item.label}</b>
  //         {item.description && <><br />{item.description}</>}
  //       </li>
  //     );
  //   }
  // }

  // const renderTree = (items: PTreeItem[]) => items.map((item, index) => (
  //   <ul key={index}>{showItem(item)}</ul>
  // ));

  function showA(item: any) {
    if ( item.children ) {
      return (
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreSharp />}
          >
            <Typography component="span">{item.label}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {item.description && <>{item.description}<br /></>}
            {renderA(item.children)}
          </AccordionDetails>
        </Accordion>
      );
    }
    else {
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreSharp />}>
            <Typography component="span">{item.label}</Typography>
          </AccordionSummary>
          {item.description && (
            <AccordionDetails>{item.description}</AccordionDetails>
          )}
        </Accordion>
      );
    }
  }

  const renderA = (items: PTreeItem[]) => items.map((item, index) => (
    <React.Fragment key={index}>{showA(item)}</React.Fragment>
  ));

  React.useEffect(() => {
    document.title = t`List Sectors`;
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* <HeroPanel
        small
        transparent
        bg={{
          url: "/static/spa/bg/02-<scheme>.jpg",
        }}
        title={t`List Sectors`}
      /> */}

      <div className="header-style-2">
        <HeroPanel
          small
          transparent
          bg={{
            url: "/static/spa/bg/04-light-original2.jpg",
          }}
          title={t`List Sectors`}
        />
      </div>

      <Container className="main-style-1" sx={{ pt: 2, pb: 2 }}>{renderA(buildTree(cache || []))}</Container>
      {/*<Container>{renderTree(buildTree(cache || []))}</Container>*/}
    </>
  );
}
