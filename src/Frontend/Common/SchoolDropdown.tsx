import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";

const apiUrl = import.meta.env.VITE_API_URL;

interface SchoolDropdownProps {
  value?: string | number;
  onChange?: (value: string) => void;
  name?: string;
  label?: string;
  isRequired?: boolean;
  placeholder?: string;
  className?: string;
  formData?: Record<string, any>;
  setFormData?: React.Dispatch<React.SetStateAction<any>>;
  includeAllOption?: boolean;
  disabled?: boolean;
}

const SchoolDropdown: React.FC<SchoolDropdownProps> = ({
  value,
  onChange,
  name = "school_id",
  label = "",
  isRequired = false,
  placeholder = "Search or select school...",
  className = "",
  formData,
  setFormData,
  includeAllOption = true,
  disabled = false,
}) => {
  const [schools, setSchools] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchSchools = async () => {
      setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/SuperAdmin/Dropdown/get-school`,
          {},
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data?.status && Array.isArray(response.data.academic)) {
          let list = response.data.academic.map((s: any) => ({
            value: s.id.toString(),
            label: s.academic_name,
          }));
          if (includeAllOption) {
            list.unshift({ value: "", label: "All Schools" });
          }
          setSchools(list);
        }
      } catch (error) {
        console.error("Error fetching schools:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, [includeAllOption, user?.token]);

  // ✅ Determine the current value
  const currentValue =
    value ??
    formData?.[name] ??
    formData?.academic_id ??
    formData?.school ??
    "";

  // ✅ Find the option that matches the value
  const selectedOption =
    schools.find((opt) => String(opt.value) === String(currentValue)) || null;

  // ✅ Re-sync once schools are loaded and formData already exists
  useEffect(() => {
    if (schools.length > 0 && currentValue && !selectedOption && setFormData) {
      const match = schools.find(
        (opt) => String(opt.value) === String(currentValue)
      );
      if (match) {
        setFormData((prev: any) => ({
          ...prev,
          [name]: match.value,
        }));
      }
    }
  }, [schools, currentValue]);

  const handleChange = (selected: any) => {
    const selectedValue = selected ? selected.value : "";
    if (onChange) onChange(selectedValue);
    if (setFormData) {
      setFormData((prev: any) => ({
        ...prev,
        [name]: selectedValue,
      }));
    }
  };

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block mb-2 text-sm font-medium text-gray-900">
          {label} {isRequired && <span className="text-red-500">*</span>}
        </label>
      )}
      <Select
        isLoading={loading}
        isDisabled={disabled || loading}
        options={schools}
        value={selectedOption}
        onChange={handleChange}
        isClearable
        placeholder={placeholder}
        classNamePrefix="react-select"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.5rem",
            padding: "2px",
            minHeight: "42px",
            boxShadow: "none",
            "&:hover": { borderColor: "#93c5fd" },
          }),
          menu: (base) => ({
            ...base,
            zIndex: 50,
          }),
        }}
      />
    </div>
  );
};

export default SchoolDropdown;



// router/index.tsx - Updated
// import { lazy } from 'react';
// import { Navigate, createBrowserRouter } from "react-router";
// import Apply from 'src/Frontend/Main/Apply';
// import Confirmation from 'src/Frontend/Main/Confirmation';
// import FormView from 'src/Frontend/Main/FormView';
// import Home from 'src/Frontend/Main/Home';
// import TypePage from 'src/Frontend/Main/Typepage';
// import Loadable from 'src/layouts/full/shared/loadable/Loadable';
// import { LoginPage } from '../views/auth/login/Login';
// import { VerifyOtp } from 'src/views/auth/two-step/VerifyOtp';
// import { ChangePassword } from 'src/views/auth/forgot-password/ChangePassword';
// import { ForgotPassword } from 'src/views/auth/forgot-password/ForgotPassword';
// import { TwoStepVerification } from 'src/views/auth/two-step/TwoStepVerification';
// import { useAuth } from 'src/hook/useAuth';
// import { ProtectedRoute } from 'src/utils/ProtectedRoute';
// import AccountTable from 'src/views/accounts/components/AccountTable';
// import DemoAccounts from 'src/views/accounts/demo/DemoAccounts';
// import LiveAccounts from 'src/views/accounts/live/LiveAccounts';
// import DetailsAccount from 'src/views/accounts/components/DetailsAccount';
// //import FormWizard from 'src/views/newForm/components/FormWizard';
// import MakeItLive from 'src/views/newForm/MakeItLive';
// import Add from 'src/views/accounts/components/AddAccount';
// import AddAccount from 'src/views/accounts/components/AddAccount';
// import UserTable from 'src/views/Admin/components/UserTable';
// import UserForm from 'src/views/Admin/components/UserForm';
// import AdminManagement from 'src/views/Admin/AdminManagement';
// import AccountProfile from 'src/views/profile/AccountProfile';
// import Demo from 'src/views/profile/Demo';
// import FormVertical from 'src/views/feesStructure/components/FormVertical';
// import YourComponent from 'src/views/dataManager/typeOfConnection/components/YourComponent';
// import DataManagerPage from 'src/views/dataManager/typeOfConnection/components/DataManagerPage';
// import StateTable from 'src/views/dataManager/state/components/State';
// import CasteTable from 'src/views/dataManager/district/components/District';
// import AddEditAccount from 'src/views/accounts/components/AddAccount';
// import OpenTickets from 'src/views/ticket/components/OpenTickets';
// import AcceptedTickets from 'src/views/ticket/components/AcceptedTickets';
// import ResolvedTickets from 'src/views/ticket/components/ResolvedTickets';
// import SalesDashboard from 'src/views/dashboards/SalesDashboard';
// import ClassTable from 'src/views/schoolServices/components/classes/components/ClassTable';
// import TransportationList from 'src/views/schoolServices/transportation/TransportationList';
// import TransportationSettingsList from 'src/views/schoolServices/transportationSettings/TransportationSettingsList';


// /* ***Layouts**** */
// const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
// const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));
// const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));

// // Common components
// const Typography = Loadable(lazy(() => import("../views/typography/Typography")));
// const Table = Loadable(lazy(() => import("../views/tables/Table")));
// const Form = Loadable(lazy(() => import("../views/forms/Form")));
// const Alert = Loadable(lazy(() => import("../views/alerts/Alerts")));
// const Buttons = Loadable(lazy(() => import("../views/buttons/Buttons")));
// const Solar = Loadable(lazy(() => import("../views/icons/Solar")));
// const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
// const Error = Loadable(lazy(() => import('../views/auth/error/Error')));
// const Register = Loadable(lazy(() => import('../views/auth/register/Register')));

// // Role Based Redirect Component
// const RoleBasedRedirect: React.FC = () => {
//   const { isAuthenticated, user } = useAuth();
  
//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace />;
//   }

//   return <Navigate to={`${user?.role}/dashboard`} replace />;
// };

// const Router = [
//   {
//     path: '/SuperAdmin',
//     element: (
//       <ProtectedRoute requiredRole="SUPERADMIN">
//         <FullLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: 'dashboard', element: <Dashboard /> },
//       { path: '/SuperAdmin/demo-accounts', element: <DemoAccounts /> },
//       { path: '/SuperAdmin/demo-accounts/add', element: <AddEditAccount /> },
//       { path: '/SuperAdmin/demo-accounts/edit/:id', element: <AddEditAccount /> },
//       { path: '/SuperAdmin/live-accounts', element: <LiveAccounts /> },
//       { path: '/SuperAdmin/live-accounts/edit/:id', element: <AddAccount /> },
//       { path: '/SuperAdmin/live-accounts/edit/:id', element: <AddAccount /> },
//       { path: '/SuperAdmin/Accounts/Edit/:id', element: <MakeItLive /> },
//       { path: '/SuperAdmin/live-accounts/add', element: <AddAccount /> },
//       { path: "/SuperAdmin/Academic/:id", element: <DetailsAccount />},
//       { path: "/SuperAdmin/:type", element: <AdminManagement /> },
//       { path: "/SuperAdmin/profile", element: <AccountProfile /> },
//       { path: "/SuperAdmin/Demo", element: <Demo/> },
//       { path: "/SuperAdmin/fees", element: <FormVertical/> },
//       { path: "/SuperAdmin/admin/add/:type", element: <UserForm /> },
//       { path: "/SuperAdmin/admin/edit/:id", element: <UserForm /> },
//       { path: '/SuperAdmin/data-manager/State', element: <StateTable/> },
//       { path: '/SuperAdmin/data-manager/District', element: <CasteTable/> },      // data manager ki District ka component
//       { path: '/SuperAdmin/data-manager/type-of-connection', element: <DataManagerPage/> },
//       { path: '/SuperAdmin/Ticket/open', element: <OpenTickets/> },
//        { path: '/SuperAdmin/Ticket/Accepted', element: <AcceptedTickets /> },
//       { path: '/SuperAdmin/Ticket/Resolved', element: <ResolvedTickets /> },
//       { path: '/SuperAdmin/classes', element: <ClassTable/> },
//       { path: '/SuperAdmin/transportation', element: <TransportationList/> },
//       { path: '/SuperAdmin/setting', element: <TransportationSettingsList/> },
//       { path: 'ui/table', element: <Table /> },
//       { path: 'ui/form', element: <Form /> },
//       { path: 'ui/alert', element: <Alert /> },
//       { path: 'ui/buttons', element: <Buttons /> },
//       { path: 'icons/solar', element: <Solar /> },
//       { path: 'sample-page', element: <SamplePage /> },
//       { path: '/SuperAdmin/demo-accounts/add', element: <Add /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
//   {
//     path: '/SupportAdmin',
//     element: (
//       <ProtectedRoute requiredRole="SUPPORTADMIN">
//         <FullLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: 'dashboard', element: <Dashboard /> },
//        { path: '/SupportAdmin/demo-accounts', element: <DemoAccounts /> },
//       { path: '/SupportAdmin/live-accounts', element: <LiveAccounts /> },
//       { path: '/SupportAdmin/live-accounts/add', element: <AddAccount /> },
//       { path: '/SupportAdmin/live-accounts/edit/:id', element: <AddAccount /> },
//       { path: "/SupportAdmin/Academic/:id", element: <DetailsAccount />},
//       { path: "/SupportAdmin/profile", element: <AccountProfile /> },
//       { path: 'ui/typography', element: <Typography /> },
//       { path: 'ui/table', element: <Table /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
//   {
//     path: '/CustomerAdmin',
//     element: (
//       <ProtectedRoute requiredRole="CUSTOMERADMIN">
//         <FullLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: 'dashboard', element: <Dashboard /> },
//       { path: "/CustomerAdmin/profile", element: <AccountProfile /> },
//       { path: 'ui/typography', element: <Typography /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
//   {
//     path: '/SalesAdmin',
//     element: (
//       <ProtectedRoute requiredRole="SALESADMIN">
//         <FullLayout />
//       </ProtectedRoute>
//     ),
//     children: [
//       { path: 'dashboard', element: <SalesDashboard /> },
//       { path: 'demo-accounts', element: <DemoAccounts /> },
//       { path: 'demo-accounts/add', element: <AddEditAccount /> },
//       { path: 'demo-accounts/edit/:id', element: <AddEditAccount /> },
//       { path: 'live-accounts', element: <LiveAccounts /> },
//       { path: 'live-accounts/edit/:id', element: <AddAccount /> },
//       { path: 'live-accounts/edit/:id', element: <AddAccount /> },
//       { path: 'Accounts/Edit/:id', element: <MakeItLive /> },
//       { path: 'live-accounts/add', element: <AddAccount /> },
//       { path: "/SalesAdmin/profile", element: <AccountProfile /> },
//       { path: 'ui/typography', element: <Typography /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
//   {
//     path: '/',
//     element: <BlankLayout />,
//     children: [
//       { path: '/login', element: <LoginPage /> },
//       { path: '/two-step-verification', element: <TwoStepVerification /> },
//       { path: '/verify-otp', element: <VerifyOtp /> },
//       { path: '/forgot-password', element: <ForgotPassword /> },
//       { path: '/auth/forget-password/:token', element: <ChangePassword /> },
//       { path: '/auth/register', element: <Register /> },
//       { path: '404', element: <Error /> },
//       { path: '/auth/404', element: <Error /> },
//       { path: '/Frontend/:institute_id', element: <Home /> },
//       { path: '/page/:pageType', element: <TypePage /> },
//       { path: '/apply', element: <Apply /> },
//       { path: '/Form-view', element: <FormView /> },
//       { path: '/Confirmation', element: <Confirmation /> },
//       { 
//         path: '/', 
//         element: <RoleBasedRedirect /> 
//       },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
// ];



// import  { lazy } from 'react';
// import { Navigate, createBrowserRouter } from "react-router";
// import Apply from 'src/Frontend/Main/Apply';
// import Confirmation from 'src/Frontend/Main/Confirmation';
// import FormView from 'src/Frontend/Main/FormView';
// import Home from 'src/Frontend/Main/Home';
// import TypePage from 'src/Frontend/Main/Typepage';
// import Loadable from 'src/layouts/full/shared/loadable/Loadable';
// import { LoginPage } from '../views/auth/login/Login';
// import { VerifyOtp } from 'src/views/auth/two-step/VerifyOtp';
// import { ChangePassword } from 'src/views/auth/forgot-password/ChangePassword';
// import { ForgotPassword } from 'src/views/auth/forgot-password/ForgotPassword';
// import { TwoStepVerification } from 'src/views/auth/two-step/TwoStepVerification';




// /* ***Layouts**** */
// const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
// const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

// // Dashboard
// const Dashboard = Loadable(lazy(() => import('../views/dashboards/Dashboard')));

// // utilities
// const Typography = Loadable(lazy(() => import("../views/typography/Typography")));
// const Table = Loadable(lazy(() => import("../views/tables/Table")));
// const Form = Loadable(lazy(() => import("../views/forms/Form")));
// const Alert = Loadable(lazy(() => import("../views/alerts/Alerts")));
// const Buttons = Loadable(lazy(() => import("../views/buttons/Buttons")));

// // icons
// const Solar = Loadable(lazy(() => import("../views/icons/Solar")));

// // authentication
// const Login = Loadable(lazy(() => import('../views/auth/login/Login')));
// const Register = Loadable(lazy(() => import('../views/auth/register/Register')));
// const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')));
// const Error = Loadable(lazy(() => import('../views/auth/error/Error')));

// const Router = [
//   {
//     path: '/',
//     element: <FullLayout />,
//     children: [
//       { path: '/', exact: true, element: <Dashboard/> },
//       { path: '/ui/typography', exact: true, element: <Typography/> },
//       { path: '/ui/table', exact: true, element: <Table/> },
//       { path: '/ui/form', exact: true, element: <Form/> },
//       { path: '/ui/alert', exact: true, element: <Alert/> },
//       { path: '/ui/buttons', exact: true, element: <Buttons/> },
//       { path: '/icons/solar', exact: true, element: <Solar /> },
//       { path: '/sample-page', exact: true, element: <SamplePage /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//     ],
//   },
//   {
//     path: '/',
//     element: <BlankLayout />,
//     children: [
//       { path: '/login', element: <LoginPage /> },
//       { path: '/two-step-verification', element: <TwoStepVerification /> },
//       { path: '/verify-otp', element: <VerifyOtp /> },
//       { path: '/forgot-password', element: <ForgotPassword /> },
//       { path: '/auth/forget-password/:token', element: <ChangePassword /> },
//       { path: '/auth/register', element: <Register /> },
//       { path: '404', element: <Error /> },
//       { path: '/auth/404', element: <Error /> },
//       { path: '*', element: <Navigate to="/auth/404" /> },
//       { path: '/Frontend/:institute_id', element: <Home /> },
//       { path: '/page/:pageType', element: <TypePage /> },
//       { path: '/apply', element: <Apply /> },
//       { path: '/Form-view', element: <FormView /> },
//       { path: '/Confirmation', element: <Confirmation /> },
      
//     ],
//   }
//   ,
// ];

// const router = createBrowserRouter(Router)

// export default router;
