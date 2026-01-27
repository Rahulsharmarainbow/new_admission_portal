// router/index.tsx - Updated
import { lazy } from 'react';
import { Navigate, createBrowserRouter } from "react-router";
import Apply from 'src/Frontend/Main/Apply';
import Confirmation from 'src/Frontend/Main/Confirmation';
import FormView from 'src/Frontend/Main/FormView';
import Home from 'src/Frontend/Main/Home';
import TypePage from 'src/Frontend/Main/Typepage';
import Loadable from 'src/layouts/full/shared/loadable/Loadable';
import { LoginPage } from '../views/auth/login/Login';
import { VerifyOtp } from 'src/views/auth/two-step/VerifyOtp';
import { ChangePassword } from 'src/views/auth/forgot-password/ChangePassword';
import { ForgotPassword } from 'src/views/auth/forgot-password/ForgotPassword';
import { TwoStepVerification } from 'src/views/auth/two-step/TwoStepVerification';
import { useAuth } from 'src/hook/useAuth';
import { ProtectedRoute } from 'src/utils/ProtectedRoute';
import AccountTable from 'src/views/accounts/components/AccountTable';
import DemoAccounts from 'src/views/accounts/demo/DemoAccounts';
import LiveAccounts from 'src/views/accounts/live/LiveAccounts';
import DetailsAccount from 'src/views/accounts/components/DetailsAccount';
//import FormWizard from 'src/views/newForm/components/FormWizard';
import MakeItLive from 'src/views/newForm/MakeItLive';
import Add from 'src/views/accounts/components/AddAccount';
import AddAccount from 'src/views/accounts/components/AddAccount';
//import UserTable from 'src/views/Admin/components/UserTable';
import UserForm from 'src/views/Admin/components/UserForm';
import AdminManagement from 'src/views/Admin/AdminManagement';
import AccountProfile from 'src/views/profile/AccountProfile';
import Demo from 'src/views/profile/Demo';
//import YourComponent from 'src/views/dataManager/typeOfConnection/components/YourComponent';
import DataManagerPage from 'src/views/dataManager/typeOfConnection/components/DataManagerPage';
import StateTable from 'src/views/dataManager/state/components/State';
import CasteTable from 'src/views/dataManager/district/components/District';
import AddEditAccount from 'src/views/accounts/components/AddAccount';
import OpenTickets from 'src/views/ticket/components/OpenTickets';
import AcceptedTickets from 'src/views/ticket/components/AcceptedTickets';
import ResolvedTickets from 'src/views/ticket/components/ResolvedTickets';
import SalesDashboard from 'src/views/dashboards/SalesDashboard';
import ClassTable from 'src/views/schoolServices/components/classes/components/ClassTable';
import TransportationList from 'src/views/schoolServices/transportation/TransportationList';
import TransportationSettingsList from 'src/views/schoolServices/transportationSettings/TransportationSettingsList';
import ContentList from 'src/views/schoolServices/components/contentManagement/ContentList';
import ClassList from 'src/views/schoolServices/class/ClassList';
import Fees from 'src/views/feesStructure/Fees';
import TypeTable from 'src/views/dataManager/typeConfiguration/TypeTable';
import DegreeManagementTable from 'src/views/collegeServices/degrees/components/DegreeManagementTable';
import HallticketTable from 'src/views/collegeServices/hallticket/components/HallticketTable';
import HallticketForm from 'src/views/collegeServices/hallticket/components/HallticketForm';
import NominalRollTable from 'src/views/collegeServices/nominalRoll/components/NominalRollTable';
import CollegeContentList from 'src/views/collegeServices/contentManagement/ContentList';
import TemplatesManagementTable from 'src/views/campaign/templates/TemplatesManagementTable';
import RankCardTable from 'src/views/collegeServices/rankcard/components/RankCardTable';
import CampaignForm from 'src/views/campaign/sendCampaign/CampaignForm';
import CampaignHistoryTable from 'src/views/campaign/campaignRecord/CampaignHistoryTable';
import TransactionManagementTable from 'src/views/transaction/components/TransactionManagementTable';
import ApplicationManagementTable from 'src/views/applicationForms/schoolApplications/ApplicationManagementTable';
import SchoolDataExport from 'src/views/exportData/schoolData/components/SchoolDataExport';
import CollegeDataExport from 'src/views/exportData/collegeData/components/CollegeDataExport';
import ActivitiesTable from 'src/views/activity/components/ActivitiesTable';
import CollegeApplicationManagementTable from 'src/views/applicationForms/collegeApplication/CollegeApplicationManagementTable';
import FooterEditing from 'src/views/frontedEditing/footer/Footer';
import PopupEditing from 'src/views/frontedEditing/popup/PopupEditing';
import AddLiveAccount from 'src/views/accounts/live/components/AddLiveAccount';
import NotificationsPage from 'src/layouts/full/header/components/NotificationsPage';
import ApplicationEditPage from 'src/views/applicationForms/ApplicationEditPage';
import ApplicationDetailsPage from 'src/views/applicationForms/schoolApplications/components/ApplicationDetailsPage';
import HomeEditing from 'src/views/frontedEditing/home/Home';
import Rankcard from 'src/Frontend/rankcard/Rankcard';
import HallTicket from 'src/Frontend/hallticket/Hallticket';
import EditingLayout from 'src/layouts/full/EditingLayout';
import ApplyEditing from 'src/views/Editing/ApplyEditing';
import CollegeSettingList from 'src/views/schoolServices/transportationSettings/CollegeSettingList';
import CountryTable from 'src/views/dataManager/country/components/CountryTable';
import ExportConfig from 'src/views/dataManager/exportConfiguration/ExportConfig';
import CareerForm from 'src/views/frontedEditing/career/CareerForm';
import ApplyJobPage from 'src/views/website/components/ApplyJobPage';
import CareerManagementTable from 'src/views/applicationForms/careerApplication/CareerManagementTable';
import { userInfo } from 'os';
import CareerDashboard from 'src/views/dashboards/CareerDashboard';
import ErrorTable from 'src/views/errorLog/ErrorTable';
import { CandidateLogin } from 'src/views/candidate-panel/auth/CandidateLogin';
import { CandidateDashboard } from 'src/views/candidate-panel/CandidateDashboard';
import CandidateApplicationEditPage from 'src/views/candidate-panel/applicationEdit/CandidateApplicationEditPage';
import AcademicBannersTable from 'src/views/frontendBannerPage/AcademicBannersTable';


/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));

// Common components
const Typography = Loadable(lazy(() => import("../views/typography/Typography")));
const Table = Loadable(lazy(() => import("../views/tables/Table")));
const Form = Loadable(lazy(() => import("../views/forms/Form")));
const Alert = Loadable(lazy(() => import("../views/alerts/Alerts")));
const Buttons = Loadable(lazy(() => import("../views/buttons/Buttons")));
const Solar = Loadable(lazy(() => import("../views/icons/Solar")));
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
const Error = Loadable(lazy(() => import('../views/auth/error/Error')));
const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
let academic_type;
// Role Based Redirect Component
const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
   academic_type = user.academic_type
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${user?.role}/dashboard`} replace />;
};


const MainRoutes = [
  {
    path: '/ApplyEditing',
    element: (
      <ProtectedRoute >
        <EditingLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: '/ApplyEditing/get', element: <ApplyEditing /> },
    ]
  },
  {
    path: '/SuperAdmin',
    element: (
      <ProtectedRoute requiredRole="SUPERADMIN">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: '/SuperAdmin/demo-accounts', element: <DemoAccounts /> },
      { path: '/SuperAdmin/demo-accounts/add', element: <AddEditAccount /> },
      { path: '/SuperAdmin/demo-accounts/edit/:id', element: <AddEditAccount /> },
      { path: '/SuperAdmin/live-accounts', element: <LiveAccounts /> },
      { path: '/SuperAdmin/live-accounts/edit/:id', element: <AddAccount /> },
      { path: '/SuperAdmin/Accounts/Edit/:id', element: <MakeItLive /> },
      { path: '/SuperAdmin/live-accounts/add', element: <AddLiveAccount /> },
      { path: "/SuperAdmin/Academic/:id", element: <DetailsAccount />},
      { path: "/SuperAdmin/:type", element: <AdminManagement /> },
      { path: "/SuperAdmin/profile", element: <AccountProfile /> },
      { path: "/SuperAdmin/Demo", element: <Demo/> },
      { path: "/SuperAdmin/fees", element: <Fees/> },
      { path: "/SuperAdmin/admin/add/:type", element: <UserForm /> },
      { path: "/SuperAdmin/admin/edit/:type/:id", element: <UserForm /> },
      { path: '/SuperAdmin/data-manager/country', element: <CountryTable/> },
      { path: '/SuperAdmin/data-manager/State', element: <StateTable/> },
      { path: '/SuperAdmin/data-manager/District', element: <CasteTable/> },      // data manager ki District ka component
      { path: '/SuperAdmin/data-manager/type-of-connection', element: <DataManagerPage/> },
      { path: 'data-manager/type-configuration', element: <TypeTable/> },
      { path: '/SuperAdmin/Ticket/open', element: <OpenTickets/> },
       { path: '/SuperAdmin/Ticket/Accepted', element: <AcceptedTickets /> },
      { path: '/SuperAdmin/Ticket/Resolved', element: <ResolvedTickets /> },
      { path: '/SuperAdmin/classes', element: <ClassList/> },
      { path: '/SuperAdmin/school-content-Management', element: <ContentList/> },
      { path: '/SuperAdmin/college-content-Management', element: <CollegeContentList/> },
      { path: '/SuperAdmin/transportation', element: <TransportationList/> },
      { path: '/SuperAdmin/setting', element: <TransportationSettingsList/> },
      { path: '/SuperAdmin/collegesetting', element: <CollegeSettingList/> },
      { path: '/SuperAdmin/degrees', element: <DegreeManagementTable/> },
      { path: '/SuperAdmin/halltickets', element: <HallticketTable/> },
      { path: '/SuperAdmin//halltickets/add', element: <HallticketForm/> },
      { path: '/SuperAdmin//halltickets/edit/:id', element: <HallticketForm/> },
      { path: '/SuperAdmin/nominal-roll', element: <NominalRollTable/> },
      { path: '/SuperAdmin/campaign/template', element: <TemplatesManagementTable/> },
      { path: '/SuperAdmin/campaign/send', element: <CampaignForm/> },
      { path: '/SuperAdmin/campaign/history', element: <CampaignHistoryTable/> },
      { path: '/SuperAdmin/rankcard', element: <RankCardTable/> },
      { path: '/SuperAdmin/transaction', element: <TransactionManagementTable/> },
      { path: '/SuperAdmin/school-applications', element: <ApplicationManagementTable/> },
      { path: '/SuperAdmin/college-applications', element: <CollegeApplicationManagementTable/> },
      { path: '/SuperAdmin/career-applications', element: <CareerManagementTable /> },
      { path: '/SuperAdmin/school-data', element: <SchoolDataExport/> },
      { path: '/SuperAdmin/college-data', element: <CollegeDataExport/> },
      { path: '/SuperAdmin/demo-accounts/add', element: <Add /> },
      { path: '/SuperAdmin/activity', element: <ActivitiesTable/>},
      { path: '/SuperAdmin/log', element: <ErrorTable/>},
      { path: '/SuperAdmin/frontend-editing/home', element: <HomeEditing/>},
      { path: '/SuperAdmin/frontend-editing/career', element: <CareerForm/>},
      { path: '/SuperAdmin/frontend-editing/Apply', element: <ApplyEditing/>},
      { path: '/SuperAdmin/frontend-editing/footer', element: <FooterEditing/>},
      { path: '/SuperAdmin/frontend-editing/popups', element: <PopupEditing />},
      { path: 'notifications', element: <NotificationsPage/> },
      { path: '/SuperAdmin/school-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: '/SuperAdmin/college-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: '/SuperAdmin/career-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: '/SuperAdmin/application-details/:applicationId', element: <ApplicationDetailsPage/> },
      { path: '/SuperAdmin/data-manager/export-configuration', element: <ExportConfig/> },
      { path: '/SuperAdmin/frontend-editing/banner', element: <AcademicBannersTable/> },
      { path: '*', element: <Navigate to="/auth/404" /> },
      
    ],
  },
  {
    path: '/SupportAdmin',
    element: (
      <ProtectedRoute requiredRole="SUPPORTADMIN">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'demo-accounts', element: <DemoAccounts /> },
      { path: 'demo-accounts/add', element: <AddEditAccount /> },
      { path: 'demo-accounts/edit/:id', element: <AddEditAccount /> },
      { path: 'live-accounts', element: <LiveAccounts /> },
      { path: 'live-accounts/edit/:id', element: <AddAccount /> },
      { path: 'Accounts/Edit/:id', element: <MakeItLive /> },
      { path: 'live-accounts/add', element: <AddLiveAccount /> },
      { path: "Academic/:id", element: <DetailsAccount />},
      { path: ":type", element: <AdminManagement /> },
      { path: "profile", element: <AccountProfile /> },
      { path: "Demo", element: <Demo/> },
      { path: "fees", element: <Fees/> },
      { path: "admin/add/:type", element: <UserForm /> },
      { path: "admin/edit/:type/:id", element: <UserForm /> },
      { path: 'data-manager/country', element: <CountryTable/> },
      { path: 'data-manager/State', element: <StateTable/> },
      { path: 'data-manager/District', element: <CasteTable/> },      // data manager ki District ka component
      { path: 'data-manager/type-of-connection', element: <DataManagerPage/> },
      { path: 'data-manager/type-configuration', element: <TypeTable/> },
      { path: 'Ticket/open', element: <OpenTickets/> },
      { path: 'Ticket/Accepted', element: <AcceptedTickets /> },
      { path: 'Ticket/Resolved', element: <ResolvedTickets /> },
      { path: 'classes', element: <ClassList/> },
      { path: 'school-content-Management', element: <ContentList/> },
      { path: 'college-content-Management', element: <CollegeContentList/> },
      { path: 'transportation', element: <TransportationList/> },
      { path: 'setting', element: <TransportationSettingsList/> },
      { path: 'collegesetting', element: <CollegeSettingList/> },
      { path: 'degrees', element: <DegreeManagementTable/> },
      { path: 'halltickets', element: <HallticketTable/> },
      { path: 'halltickets/add', element: <HallticketForm/> },
      { path: 'halltickets/edit/:id', element: <HallticketForm/> },
      { path: 'nominal-roll', element: <NominalRollTable/> },
      { path: 'campaign/template', element: <TemplatesManagementTable/> },
      { path: 'campaign/send', element: <CampaignForm/> },
      { path: 'campaign/history', element: <CampaignHistoryTable/> },
      { path: 'rankcard', element: <RankCardTable/> },
      { path: 'transaction', element: <TransactionManagementTable/> },
      { path: 'school-applications', element: <ApplicationManagementTable/> },
      { path: 'college-applications', element: <CollegeApplicationManagementTable/> },
      { path: 'career-applications', element: <CareerManagementTable /> },
      { path: 'school-data', element: <SchoolDataExport/> },
      { path: 'college-data', element: <CollegeDataExport/> },
      { path: 'demo-accounts/add', element: <Add /> },
      { path: 'activity', element: <ActivitiesTable/>},
      { path: 'frontend-editing/home', element: <HomeEditing/>},
      { path: 'frontend-editing/career', element: <CareerForm/>},
      { path: 'frontend-editing/footer', element: <FooterEditing/>},
      { path: 'frontend-editing/popups', element: <PopupEditing />},
      { path: 'school-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'college-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'career-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'application-details/:applicationId', element: <ApplicationDetailsPage/> },
       { path: 'notifications', element: <NotificationsPage/> },
       { path: 'data-manager/export-configuration', element: <ExportConfig/> },
       { path: '/frontend-editing/banner', element: <AcademicBannersTable/> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/CustomerAdmin',
    element: (
      <ProtectedRoute requiredRole="CUSTOMERADMIN">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element:  <Dashboard /> },
      { path: 'demo-accounts', element: <DemoAccounts /> },
      { path: 'demo-accounts/add', element: <AddEditAccount /> },
      { path: 'demo-accounts/edit/:id', element: <AddEditAccount /> },
      { path: 'live-accounts', element: <LiveAccounts /> },
      { path: 'live-accounts/edit/:id', element: <AddAccount /> },
      { path: 'Accounts/Edit/:id', element: <MakeItLive /> },
      { path: 'live-accounts/add', element: <AddLiveAccount /> },
      { path: "Academic/:id", element: <DetailsAccount />},
      { path: ":type", element: <AdminManagement /> },
      { path: "profile", element: <AccountProfile /> },
      { path: "Demo", element: <Demo/> },
      { path: "fees", element: <Fees/> },
      { path: "admin/add/:type", element: <UserForm /> },
      { path: "admin/edit/:type/:id", element: <UserForm /> },
       { path: 'data-manager/country', element: <CountryTable/> },
      { path: 'data-manager/State', element: <StateTable/> },
      { path: 'data-manager/District', element: <CasteTable/> },      // data manager ki District ka component
      { path: 'data-manager/type-of-connection', element: <DataManagerPage/> },
      { path: 'data-manager/type-configuration', element: <TypeTable/> },
      { path: 'Ticket/open', element: <OpenTickets/> },
      { path: 'Ticket/Accepted', element: <AcceptedTickets /> },
      { path: 'Ticket/Resolved', element: <ResolvedTickets /> },
      { path: 'classes', element: <ClassList/> },
      { path: 'school-content-Management', element: <ContentList/> },
      { path: 'college-content-Management', element: <CollegeContentList/> },
      { path: 'transportation', element: <TransportationList/> },
      { path: 'setting', element: <TransportationSettingsList/> },
      { path: 'collegesetting', element: <CollegeSettingList/> },
      { path: 'degrees', element: <DegreeManagementTable/> },
      { path: 'halltickets', element: <HallticketTable/> },
      { path: 'halltickets/add', element: <HallticketForm/> },
      { path: 'halltickets/edit/:id', element: <HallticketForm/> },
      { path: 'nominal-roll', element: <NominalRollTable/> },
      { path: 'campaign/template', element: <TemplatesManagementTable/> },
      { path: 'campaign/send', element: <CampaignForm/> },
      { path: 'campaign/history', element: <CampaignHistoryTable/> },
      { path: 'rankcard', element: <RankCardTable/> },
      { path: 'transaction', element: <TransactionManagementTable/> },
      { path: 'school-applications', element: <ApplicationManagementTable/> },
      { path: 'college-applications', element: <CollegeApplicationManagementTable/> },
      { path: 'career-applications', element: <CareerManagementTable /> },
      { path: 'school-data', element: <SchoolDataExport/> },
      { path: 'college-data', element: <CollegeDataExport/> },
      { path: 'demo-accounts/add', element: <Add /> },
      { path: 'activity', element: <ActivitiesTable/>},
      { path: 'frontend-editing/home', element: <HomeEditing/>},
      { path: 'frontend-editing/career', element: <CareerForm/>},
      { path: 'frontend-editing/footer', element: <FooterEditing/>},
      { path: 'frontend-editing/popups', element: <PopupEditing />},
      { path: 'school-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'college-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'career-applications/edit/:applicationId', element: <ApplicationEditPage/> },
      { path: 'application-details/:applicationId', element: <ApplicationDetailsPage/> },
       { path: 'notifications', element: <NotificationsPage/> },
       { path: '/frontend-editing/banner', element: <AcademicBannersTable/> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/SalesAdmin',
    element: (
      <ProtectedRoute requiredRole="SALESADMIN">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <SalesDashboard /> },
      { path: 'demo-accounts', element: <DemoAccounts /> },
      { path: 'demo-accounts/add', element: <AddEditAccount /> },
      { path: 'demo-accounts/edit/:id', element: <AddEditAccount /> },
      { path: 'live-accounts', element: <LiveAccounts /> },
      { path: 'live-accounts/edit/:id', element: <AddAccount /> },
      { path: 'Accounts/Edit/:id', element: <MakeItLive /> },
      { path: 'live-accounts/add', element: <AddLiveAccount /> },
      { path: "Academic/:id", element: <DetailsAccount />},
      { path: ":type", element: <AdminManagement /> },
      { path: "profile", element: <AccountProfile /> },
      { path: "Demo", element: <Demo/> },
      { path: "fees", element: <Fees/> },
      { path: "admin/add/:type", element: <UserForm /> },
      { path: "admin/edit/:type/:id", element: <UserForm /> },
      { path: 'data-manager/country', element: <CountryTable/> },
      { path: 'data-manager/State', element: <StateTable/> },
      { path: 'data-manager/District', element: <CasteTable/> },      // data manager ki District ka component
      { path: 'data-manager/type-of-connection', element: <DataManagerPage/> },
      { path: 'data-manager/type-configuration', element: <TypeTable/> },
      { path: 'Ticket/open', element: <OpenTickets/> },
      { path: 'Ticket/Accepted', element: <AcceptedTickets /> },
      { path: 'Ticket/Resolved', element: <ResolvedTickets /> },
      { path: 'classes', element: <ClassList/> },
      { path: 'school-content-Management', element: <ContentList/> },
      { path: 'college-content-Management', element: <CollegeContentList/> },
      { path: 'transportation', element: <TransportationList/> },
      { path: 'setting', element: <TransportationSettingsList/> },
      { path: 'degrees', element: <DegreeManagementTable/> },
      { path: 'halltickets', element: <HallticketTable/> },
      { path: 'halltickets/add', element: <HallticketForm/> },
      { path: 'halltickets/edit/:id', element: <HallticketForm/> },
      { path: 'nominal-roll', element: <NominalRollTable/> },
      { path: 'campaign/template', element: <TemplatesManagementTable/> },
      { path: 'campaign/send', element: <CampaignForm/> },
      { path: 'campaign/history', element: <CampaignHistoryTable/> },
      { path: 'rankcard', element: <RankCardTable/> },
      { path: 'transaction', element: <TransactionManagementTable/> },
      { path: 'school-applications', element: <ApplicationManagementTable/> },
      { path: 'college-applications', element: <CollegeApplicationManagementTable/> },
      { path: 'career-applications', element: <CareerManagementTable /> },
      { path: 'school-data', element: <SchoolDataExport/> },
      { path: 'college-data', element: <CollegeDataExport/> },
      { path: 'demo-accounts/add', element: <Add /> },
      { path: 'activity', element: <ActivitiesTable/>},
      { path: 'frontend-editing/home', element: <HomeEditing/>},
      { path: 'frontend-editing/career', element: <CareerForm/>},
      { path: 'frontend-editing/footer', element: <FooterEditing/>},
      { path: 'frontend-editing/popups', element: <PopupEditing />},
      { path: 'notifications', element: <NotificationsPage/> }, 
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
{
  path: '/',
  element: <BlankLayout />,
  children: [
    // 🔓 Auth Pages → Public
    { path: '/login', element: <LoginPage /> },
    { path: '/two-step-verification', element: <TwoStepVerification /> },
    { path: '/verify-otp', element: <VerifyOtp /> },
    { path: '/forgot-password', element: <ForgotPassword /> },
    { path: '/auth/forget-password/:token', element: <ChangePassword /> },
    { path: '/auth/register', element: <Register /> },
    { path: '404', element: <Error /> },
    { path: '/auth/404', element: <Error /> },
    { path: '/Frontend/:institute_id/CandidatePanel/login', element: <CandidateLogin /> },
    { path: '/Frontend/:institute_id/CandidatePanel/dashboard', element: <CandidateDashboard /> },
    { path: '/Frontend/:institute_id/CandidatePanel/edit-application/:id', element: <CandidateApplicationEditPage /> },

    // 🔒 All Below → Protected
    {
      path: '/Frontend/:institute_id',
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      )
    },
    // {
    //   path: '/Frontend/:institute_id/:form_route',
    //   element: (
    //     <ProtectedRoute>
    //       <Apply />
    //     </ProtectedRoute>
    //   )
    // },

    
    {
      path: '/Frontend/:institute_id/:page_route',
      element: (
        // <ProtectedRoute>
          <TypePage />
        // </ProtectedRoute>
      )
    },
    {
      path: '/Frontend/:institute_id/rankcard',
      element: (
        <ProtectedRoute>
          <Rankcard />
        </ProtectedRoute>
      )
    },
    {
      path: '/Frontend/:institute_id/Hall-ticket',
      element: (
        <ProtectedRoute>
          <HallTicket />
        </ProtectedRoute>
      )
    },
    {
      path: '/Form-view',
      element: (
        <ProtectedRoute>
          <FormView />
        </ProtectedRoute>
      )
    },
    {
      path: '/Confirmation',
      element: (
        <ProtectedRoute>
          <Confirmation />
        </ProtectedRoute>
      )
    },

    // 🔒 Home Redirect Also Protected
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <RoleBasedRedirect />
        </ProtectedRoute>
      ),
    },

    { path: '*', element: <Navigate to="/auth/404" /> },
    { path: '/Frontend/:instituteId/job_details/:jobId', element: <ApplyJobPage/> },
     { path: '/job_details/:jobId', element: <ApplyJobPage/> }
  ],
}

];

export const CustomDomainRoutes = [  {
    path: "/",
    element: (
      // <ProtectedRoute>
        <BlankLayout />
      // </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Home /> },
      
      { path: "/:page_route", element: <TypePage /> },
      { path: "/rankcard", element: <Rankcard /> },
      { path: "/Hall-ticket", element: <HallTicket /> },
      { path: "/Form-view", element: <FormView /> },
      { path: "/Confirmation", element: <Confirmation /> },
      { path: '/CandidatePanel/login', element: <CandidateLogin /> },
      { path: '/CandidatePanel/dashboard', element: <CandidateDashboard /> },
      { path: '/CandidatePanel/edit-application/:id', element: <CandidateApplicationEditPage /> },
      { path: '/job_details/:jobId', element: <ApplyJobPage/> }, 
      { path: "*", element: <Navigate to="/" /> },
    ],
  },
];


const MAIN_DOMAINS = ["localhost","admissionportalrevamp.testingscrew.com","starenroll.co.in"];

// Get current hostname
const currentDomain = window.location.hostname;

// Check whether current domain belongs to MAIN_DOMAINS
const isMainDomain = MAIN_DOMAINS.some((domain) => currentDomain.includes(domain));

// Select routes based on the domain
const routes = isMainDomain ? MainRoutes : CustomDomainRoutes;

const router = createBrowserRouter(routes)

export default router;
