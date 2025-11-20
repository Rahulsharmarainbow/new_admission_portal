import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useAuth } from 'src/hook/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string | string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
}) => {
  const { isAuthenticated, hasRole, user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // wait until cookies/user syncs into state
    const timer = setTimeout(() => setLoading(false), 100);
    return () => clearTimeout(timer);
  }, [user]);

  if (loading) {
    return <></>; // can show loader if needed
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/auth/404" replace />;
  }

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