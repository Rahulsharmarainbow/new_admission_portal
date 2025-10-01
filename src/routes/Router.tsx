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

// Role Based Redirect Component
const RoleBasedRedirect: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`${user?.role}/dashboard`} replace />;
};

const Router = [
  {
    path: '/SuperAdmin',
    element: (
      <ProtectedRoute requiredRole="SUPERADMIN">
        <FullLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'ui/typography', element: <Typography /> },
      { path: 'ui/table', element: <Table /> },
      { path: 'ui/form', element: <Form /> },
      { path: 'ui/alert', element: <Alert /> },
      { path: 'ui/buttons', element: <Buttons /> },
      { path: 'icons/solar', element: <Solar /> },
      { path: 'sample-page', element: <SamplePage /> },
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
      { path: 'ui/typography', element: <Typography /> },
      { path: 'ui/table', element: <Table /> },
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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'ui/typography', element: <Typography /> },
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
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'ui/typography', element: <Typography /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/two-step-verification', element: <TwoStepVerification /> },
      { path: '/verify-otp', element: <VerifyOtp /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/auth/forget-password/:token', element: <ChangePassword /> },
      { path: '/auth/register', element: <Register /> },
      { path: '404', element: <Error /> },
      { path: '/auth/404', element: <Error /> },
      { path: '/Frontend/:institute_id', element: <Home /> },
      { path: '/page/:pageType', element: <TypePage /> },
      { path: '/apply', element: <Apply /> },
      { path: '/Form-view', element: <FormView /> },
      { path: '/Confirmation', element: <Confirmation /> },
      // Redirect root to appropriate dashboard based on role
      { 
        path: '/', 
        element: <RoleBasedRedirect /> 
      },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
];

const router = createBrowserRouter(Router);
export default router;




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
