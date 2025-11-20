// components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'src/hook/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();
console.log(user?.login_type, "isAuthenticated");
  // if (!isAuthenticated) {
  //   return <Navigate to={redirectTo} state={{ from: location }} replace />;
  // }

//   if (requiredRole && !hasRole(requiredRole)) {
//     // Redirect to unauthorized or dashboard based on role
//     const userDashboard = getUserDashboard(user!.login_type);
//     console.log(userDashboard);
//     return <Navigate to={userDashboard} replace />;
//   }

  return <>{children}</>;
};

// Helper function to get dashboard based on login_type
export const getUserDashboard = (loginType: number): string => {
  switch (loginType) {
    case 1:
      return '/SuperAdmin/dashboard';
    case 2:
      return '/SupportAdmin/dashboard';
    case 3:
      return '/CustomerAdmin/dashboard';
    case 4:
      return '/SalesAdmin/dashboard';
    default:
      return '/auth/404';
  }
};

// Helper function to get required roles for each route
export const getRequiredRole = (path: string): string[] => {
  if (path.startsWith('/SuperAdmin')) return ['SUPERADMIN'];
  if (path.startsWith('/SupportAdmin')) return ['SUPPORTADMIN'];
  if (path.startsWith('/CustomerAdmin')) return ['CUSTOMERADMIN'];
  if (path.startsWith('/SalesAdmin')) return ['SALESADMIN'];
  return []; 
};