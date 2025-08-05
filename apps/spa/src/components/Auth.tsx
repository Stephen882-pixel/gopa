import { Navigate, Outlet, useLocation } from "react-router-dom";

import Page403 from "@src/pages/error/Page403";
import { usePermissions } from "@src/app/hooks";
import { LOGIN_STORE_CONST } from "@src/app/utils";

import type { AuthProps } from "@src/components/types";

export default function Auth({ permissions, condition } : AuthProps) {
  const currentLocation = useLocation().pathname;
  const { hasLoggedIn, hasPermissions } = usePermissions();

  // If there is no session
  if ( !hasLoggedIn ) {
    localStorage.setItem(LOGIN_STORE_CONST, currentLocation);
    return <Navigate to="/auth/login" />;
  }

  // When one does not have the specified permissions
  if ( !hasPermissions(permissions || [], condition) ) {
    return <Page403 />;
  }

  // When the user access to the resource, you can delete this cache
  if ( localStorage.hasOwnProperty(LOGIN_STORE_CONST) ) {
    localStorage.removeItem(LOGIN_STORE_CONST);
  }

  // Always scroll top
  window.scrollTo(0, 0);

  // Display the component
  return <Outlet />;
}
