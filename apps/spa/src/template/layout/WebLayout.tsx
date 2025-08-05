import { Outlet } from "react-router-dom";

import SpacerPanel from "@src/template/components/Panels/SpacerPanel";
import MenuBar from "@src/template/components/MenuBar";
import Footer from "@src/template/components/Footer";
import Wrapper, { ContentPanel } from "@src/components/layout";

export default function WebLayout() {
  return (
    <Wrapper type="body">
      <MenuBar />
      <ContentPanel>
        <SpacerPanel />
        <Outlet />
      </ContentPanel>
      <Footer/>
    </Wrapper>
  );
}
