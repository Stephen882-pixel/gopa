import { useLocation } from "react-router-dom";

import { usePermissions } from "@src/app/hooks";
import NavItem from "./NavItem";
import NavBlock from "./NavBlock";
import { NavProps, nav } from "./nav";

export function isActive(currentLocation: string, to: string) {
  if ( "/" === currentLocation || "/" === to || currentLocation.length === to.length ) {
    return currentLocation === to;
  }
  return currentLocation.length > to.length
    ? to === currentLocation.substring(0, to.length)
    : currentLocation === to.substring(0, currentLocation.length);
}

// https://stackoverflow.com/a/63653735
export default function MainMenu() {
  const currentLocation = useLocation().pathname;
  const { hasPermissions } = usePermissions();

  function showNav(item: NavProps, index: number, sub?: boolean) {
    const { nodes, permissions, icon, ...rest } = item;
    if ( permissions && !hasPermissions(permissions, "OR") ) {
      return;
    }
    if ( nodes ) {
      return (
        <NavBlock
          {...rest}
          key={index}
          active={isActive(currentLocation, rest?.to || "")}
          icon={true === sub ? "sub" : icon}
        >
          {renderNav(nodes, true)}
        </NavBlock>
      );
    }
    else {
      return (
        <NavItem
          {...rest}
          key={index}
          icon={true === sub ? "sub" : icon}
          active={isActive(currentLocation, rest?.to || "")}
        />
      );
    }
  }

  const renderNav = (items: Array<NavProps>, sub?: boolean) => items.map((item, index) => showNav(item, index, sub));

  return <>{renderNav(nav())}</>;
}
