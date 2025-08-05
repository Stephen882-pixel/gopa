export interface UserProps {
  id: number;
  is_staff: boolean;
  is_superuser: boolean;
  permissions: Array<string>;
}

interface CountryProps {
  iso: string;
  iso3: string;
  name: string;
  capital: string;
  currency_code: string;
  currency_symbol: string;
  currency_name: string;
}

interface AbstractProfileProps {
  email?: string;
  username?: string;
  display_name?: string;
  first_name?: string;
  last_name?: string;
  locale?: any;
  phone?: string;
  country?: CountryProps;
  avatar?: string;
}

export interface ProfileProps extends AbstractProfileProps {
  dark_mode?: boolean;
}

interface AuthProfileProps extends AbstractProfileProps {
  darkMode?: boolean;
}

export interface AuthProps {
  csrf: string | null;
  token: string | null;
  user: UserProps | null;
  profile: AuthProfileProps | null;
}

interface SelectItemProps {
  slug: string;
  label: string;
}

export interface ConstantsProps {
  countries: SelectItemProps[];
  restrictionTypes: SelectItemProps[];
  nonComplianceTypes: SelectItemProps[];
  modeOfSupply: SelectItemProps[];
  discriminativeList: SelectItemProps[];
  typeOfMeasureList: SelectItemProps[];
  yesNo: SelectItemProps[];
  notificationStatus: SelectItemProps[];
  complaintTypes: SelectItemProps[];
  complaintStatus: SelectItemProps[];
  restrictionStatus: SelectItemProps[];
  reportDisplayTypes: SelectItemProps[];
}

export interface CacheProps {
  restriction?: any;
  sectorList?: any[];
  permissionMap?: any;
}


// Use this method to make API calls for all the thunk methods
export function apiCall(path: string, auth?: AuthProps) {
  const opts: any = {
    credentials: "same-origin",
    headers: { "X-Requested-With": "XMLHttpRequest" }
  };
  if ( auth?.csrf ) {
    opts.headers["X-CSRFToken"] = auth.csrf;
  }
  if ( auth?.token ) {
    opts.headers.Authorization = "Bearer " + auth.token;
  }
  return fetch("/api/" + path.substring(path.startsWith("/") ? 1 : 0), opts).then(res => {
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    return (isJson ? res.json() : res.text()).then((data) => isJson && res.ok ? data : null);
  });
};
