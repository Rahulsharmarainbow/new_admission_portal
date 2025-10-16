// src/Frontend/UserManagement/UserManagement.tsx
import React from 'react';
import { useParams } from 'react-router';
import UserTable from './components/UserTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

const AdminManagement: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const getAdminType = () => {
    switch (type) {
      case 'support-admin':
        return 2;
      case 'customer-admin':
        return 3;
      case 'sales-admin':
        return 4;
      default:
        return 2;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'support-admin':
        return 'Support Admin';
      case 'customer-admin':
        return 'Customer Admin';
      case 'sales-admin':
        return 'Sales Admin';
      default:
        return 'User Management';
    }
  };

  return (
    <div className="p-3">
      <BreadcrumbHeader
        title={`${getTitle()} Management`}
        paths={[
          {
            name: getTitle(),
            link: `#`,
          },
        ]}
      />
      <UserTable type={getAdminType()} />
    </div>
  );
};

export default AdminManagement;
