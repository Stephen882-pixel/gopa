import { useAppSelector, useAppDispatch } from "@src/app/redux/store";
import { initAuth, refreshProfile } from "@src/app/redux/slice/auth";
import useFetch from "./fetch";
import type { ProfileProps } from "@src/app/redux/types";

export function usePermissions() {
  const user = useAppSelector((state) => state.auth.user);
  const profile = useAppSelector((state) => state.auth.profile);
  const isStaff = true === user?.is_staff;
  const hasLoggedIn = null !== user;

  function hasPermissions(permissions: string[], condition?: string){
    if ( null === user || (permissions.includes("is_superuser") && !user.is_superuser) ) {
      return false;
    }
    if ( user.is_superuser ) {
      return true;
    }
    const isOR = "OR" === String(condition || "AND").toUpperCase().trim();
    const available = [...new Set(user.permissions)];
    const perms = permissions
      .map((p: string) => String(p || "").trim())
      .filter((p: string) => p);
    if ( 0 === perms.length ) {
      return true;
    }
    for ( const perm of perms ) {
      if ( isOR && available.includes(perm) ) {
        return true;
      }
      else if ( !isOR && !available.includes(perm) ) {
        return false;
      }
    }
    return !isOR;
  }

  return { isStaff, hasLoggedIn, profile, hasPermissions } as const;
}

export function useAuthenticate() {
  const { hasLoggedIn, profile, hasPermissions } = usePermissions();
  const [{loading}, apiCall] = useFetch();
  const dispatch = useAppDispatch();

  function login(data: FormData) {
    const options = {
      url: "/auth/login/",
      method: "POST",
      data
    };
    return apiCall(options).then((res: any) => {
      dispatch(initAuth(res));
      return res;
    });
  }

  function logout() {
    const options = {
      url: "/auth/logout/",
      method: "POST",
    };
    return apiCall(options).then((res: any) => {
      dispatch(initAuth(res));
      return res;
    });
  }

  function updateProfile(data: FormData | ProfileProps) {
    if ( !(data instanceof FormData) ) {
      dispatch(refreshProfile(data));
      return Promise.resolve();
    }
    const options = {
      url: "/profile/update/",
      method: "POST",
      data
    };
    return apiCall(options).then((res: any) => {
      dispatch(refreshProfile(res?.profile));
      return res;
    });
  }

  return { loading, hasLoggedIn, profile, hasPermissions, login, logout, updateProfile } as const;
}
