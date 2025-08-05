import * as React from "react";
import { t } from "ttag";
import DashboardSharp from "@mui/icons-material/DashboardSharp";
import ManageSearchSharp from "@mui/icons-material/ManageSearchSharp";
import GrassSharp from "@mui/icons-material/GrassSharp";
import AdminPanelSettingsSharp from "@mui/icons-material/AdminPanelSettingsSharp";

export interface NavProps {
  label: string;
  to?: string;
  permissions?: string[];
  icon?: React.ReactNode | "sub" | null;
  nodes?: Array<NavProps>;
}

export const nav = (): Array<NavProps> => [
  {label: t`Dashboard`, to: "/auth/dashboard", icon: <DashboardSharp />},
  {
    label: t`Manage`,
    icon: <ManageSearchSharp />,
    to: "/auth/manage",
    nodes: [
      {label: t`Complaints`, to: "/auth/manage/complaints"},
      {label: t`Notifications`, to: "/auth/manage/notifications"},
      {label: t`Restrictions`, to: "/auth/manage/restrictions", permissions: ["restrictions.view_restriction"]},
      {label: t`Commitments`, to: "/auth/manage/commitments", permissions: ["restrictions.view_commitment"]},
    ]
  },
  {
    label: t`Configure`,
    icon: <GrassSharp />,
    to: "/auth/config",
    permissions: ["restrictions.view_sector", "restrictions.view_restrictionaccess", "restrictions.view_policy", "core.view_reporttag", "core.view_report"],
    nodes: [
      {label: t`Sectors`, to: "/auth/config/sectors", permissions: ["restrictions.view_sector"]},
      {label: t`Restriction Access`, to: "/auth/config/restriction-access", permissions: ["restrictions.view_restrictionaccess"]},
      {label: t`Policies`, to: "/auth/config/policies", permissions: ["restrictions.view_policy"]},
      {label: t`Reports`, to: "/auth/config/reports", permissions: ["core.view_report"]},
      {label: t`Report Tags`, to: "/auth/config/report-tags", permissions: ["core.view_reporttag"]},
    ]
  },
  {
    label: t`Admin`,
    icon: <AdminPanelSettingsSharp />,
    to: "/auth/admin",
    permissions: ["auth.view_user"],
    nodes: [
      {label: t`Users`, to: "/auth/admin/users", permissions: ["auth.view_user"]},
      {label: t`Groups`, to: "/auth/admin/groups", permissions: ["is_superuser"]},
    ]
  },
];
