import * as React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Core Layout Components
import PLoader from "@src/components/loader/PLoader";

// Manually show the loader as the component loads
function lazzy(loader: () => Promise<any>) {
  return function () {
    const [Component, setComponent] = React.useState(null);
    React.useEffect(() => {
      loader().then((mod: any) => {
        setComponent(() => mod.default);
      });
    }, []);
    // @ts-ignore
    return null === Component ? <PLoader loading /> : <Component />;
  }
}

// Core Layout Components
const Auth = React.lazy(() => import("@src/components/Auth"));
const WebLayout = React.lazy(() => import("@src/template/layout/WebLayout"));
const AdminLayout = React.lazy(() => import("@src/components/layout/AdminLayout"));

// Error Pages
const Page404 = lazzy(() => import("@src/pages/error/Page404"));

// Portal
const Home = lazzy(() => import("@src/template/pages/home"));

const AboutUs = lazzy(() => import("@src/template/pages/about/AboutUs"));
const SMSHowTo = lazzy(() => import("@src/template/pages/about/SMSHowTo"));
const SectorDisplay = lazzy(() => import("@src/template/pages/about/SectorDisplay"));

const Notifications = lazzy(() => import("@src/template/pages/Notifications"));
const BrowseIndicators = lazzy(() => import("@src/template/pages/indicators/Browse"));
const Indicator = lazzy(() => import("@src/template/pages/indicators/Indicator"));

const BrowseRestrictions = lazzy(() => import("@src/template/pages/restrictions/Browse"));
const Restriction = lazzy(() => import("@src/template/pages/restrictions/Restriction"));
const Publication = lazzy(() => import("@src/template/pages/Publication"));

const ComplaintsPublicList = lazzy(() => import("@src/template/pages/complaints/List"));
const ComplaintsPublicForm = lazzy(() => import("@src/template/pages/complaints/Complaints"));

// Auth
const Login = lazzy(() => import("@src/pages/auth/Login"));
const RegisterClient = lazzy(() => import("@src/pages/auth/Register/Client"));
const RegisterReset = lazzy(() => import("@src/pages/auth/Register/Reset"));
const RegisterConfirm = lazzy(() => import("@src/pages/auth/Register/Confirm"));
const Dashboard = lazzy(() => import("@src/pages/dashboard"));
const Profile = lazzy(() => import("@src/pages/auth/Profile"));

// Manage Data
const ComplaintsAdminList = lazzy(() => import("@src/pages/manage/Complaints/List"));
const ComplaintsAdminEdit = lazzy(() => import("@src/pages/manage/Complaints/Edit"));
const NotificationsEdit = lazzy(() => import("@src/pages/manage/Notifications"));
const RestrictionsList = lazzy(() => import("@src/pages/manage/Restrictions/List"));
const RestrictionsEdit = lazzy(() => import("@src/pages/manage/Restrictions/Edit"));
const CommitmentList = lazzy(() => import("@src/pages/manage/Commitments/List"));
const CommitmentEdit = lazzy(() => import("@src/pages/manage/Commitments/Edit"));

// Configure Data
const Sectors = lazzy(() => import("@src/pages/config/Sectors"));
const RestrictionAccess = lazzy(() => import("@src/pages/config/RestrictionAccess"));
const Policy = lazzy(() => import("@src/pages/config/Policy"));
const ReportTags = lazzy(() => import("@src/pages/config/ReportTags"));
const Reports = lazzy(() => import("@src/pages/config/Reports"));

// Admin
const Users = lazzy(() => import("@src/pages/auth/Users"));
const Groups = lazzy(() => import("@src/pages/auth/Groups"));

// The route configuration
export default function AppRouter() {
  return (
    <BrowserRouter>
      <React.Suspense fallback={<PLoader loading />}>
        <Routes>
          <Route path="" element={<WebLayout />}>
            <Route path="" element={<Home />} />
            <Route path="public">
              <Route path="about">
                <Route path="" element={<AboutUs />} />
                <Route path="sms-how-to" element={<SMSHowTo />} />
                <Route path="sectors" element={<SectorDisplay />} />
              </Route>
              <Route path="notifications" element={<Notifications />} />
              <Route path="indicators" element={<BrowseIndicators />} />
              <Route path="indicator/:slug" element={<Indicator />} />
              <Route path="browse/:category?" element={<BrowseRestrictions />} />
              <Route path="restriction/:slug" element={<Restriction />} />
              <Route path="publication/:slug" element={<Publication />} />
              <Route path="complaints">
                <Route path="list" element={<ComplaintsPublicList />} />
                <Route path=":slug?" element={<ComplaintsPublicForm />} />
              </Route>
            </Route>
          </Route>
          <Route path="auth">
            <Route path="login" element={<Login />} />
            <Route path="register">
              <Route path="client" element={<RegisterClient />} />
              <Route path="reset" element={<RegisterReset />} />
              <Route path="confirm/:token" element={<RegisterConfirm />} />
            </Route>
          </Route>
          <Route path="auth">
            <Route path="" element={<AdminLayout />}>
              <Route path="dashboard" element={<Auth />}>
                <Route path="" element={<Dashboard />} />
              </Route>
              <Route path="profile" element={<Auth />}>
                <Route path="" element={<Profile />} />
              </Route>

              <Route path="manage">
                <Route path="complaints" element={<Auth />}>
                  <Route path="" element={<ComplaintsAdminList />} />
                  <Route path=":index" element={<ComplaintsAdminEdit />} />
                </Route>
                <Route path="notifications" element={<Auth />}>
                  <Route path="" element={<NotificationsEdit />} />
                </Route>
                <Route path="restrictions" element={<Auth permissions={["restrictions.view_restriction"]} />}>
                  <Route path="" element={<RestrictionsList />} />
                  <Route path=":index" element={<RestrictionsEdit />} />
                </Route>
                <Route path="commitments" element={<Auth permissions={["restrictions.view_commitment"]} />}>
                  <Route path="" element={<CommitmentList />} />
                  <Route path=":index" element={<CommitmentEdit />} />
                </Route>
              </Route>

              <Route path="config">
                <Route path="sectors" element={<Auth permissions={["restrictions.view_sector"]} />}>
                  <Route path="" element={<Sectors />} />
                </Route>
                <Route path="policies" element={<Auth permissions={["restrictions.view_policy"]} />}>
                  <Route path="" element={<Policy />} />
                </Route>
                <Route path="restriction-access" element={<Auth permissions={["restrictions.view_restrictionaccess"]} />}>
                  <Route path="" element={<RestrictionAccess />} />
                </Route>
                <Route path="reports" element={<Auth permissions={["core.view_report"]} />}>
                  <Route path="" element={<Reports />} />
                </Route>
                <Route path="report-tags" element={<Auth permissions={["core.view_reporttag"]} />}>
                  <Route path="" element={<ReportTags />} />
                </Route>
              </Route>

              <Route path="admin">
                <Route path="users" element={<Auth permissions={["auth.view_user"]} />}>
                  <Route path="" element={<Users />} />
                </Route>
                <Route path="groups" element={<Auth permissions={["is_superuser"]} />}>
                  <Route path="" element={<Groups />} />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<Page404 />} />
        </Routes>
      </React.Suspense>
    </BrowserRouter>
  );
}
