// src/Frontend/UserManagement/UserManagement.tsx
import React from 'react';
import { useParams } from 'react-router';
import UserTable from './components/UserTable';

const AdminManagement: React.FC = () => {
  const { type } = useParams<{ type: string }>();

  const getAdminType = () => {
    switch (type) {
      case 'support-admin': return 2;
      case 'customer-admin': return 3;
      case 'sales-admin': return 4;
      default: return 2;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'support-admin': return 'Support Admin';
      case 'customer-admin': return 'Customer Admin';
      case 'sales-admin': return 'Sales Admin';
      default: return 'User Management';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()} Management</h1>
        <p className="text-gray-600">Manage {getTitle().toLowerCase()} users</p>
      </div>
      
      <UserTable type={getAdminType()} />
    </div>
  );
};

export default AdminManagement;





