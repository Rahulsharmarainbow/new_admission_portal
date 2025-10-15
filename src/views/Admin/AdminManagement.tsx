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
    <div className="p-3">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{getTitle()} Management</h1>
        <p className="text-gray-600">Manage {getTitle().toLowerCase()} users</p>
      </div>
      
      <UserTable type={getAdminType()} />
    </div>
  );
};

export default AdminManagement;



























// import React, { useState } from 'react';
// import { Routes, Route, useLocation, useNavigate } from 'react-router';
// import { Button } from 'flowbite-react';

// // Import your components
// import UserTable from '.component/UserTable';
// import UserForm from '.component/UserForm';

// const AdminManagement: React.FC = () => {
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   // Define admin types with their labels
//   const adminTypes = [
//     { type: 2, label: 'Support Admin', path: 'support' },
//     { type: 3, label: 'Customer Admin', path: 'customer' },
//     { type: 4, label: 'Sales Admin', path: 'sales' }
//   ];

//   // Get current admin type from URL or default to first one
//   const getCurrentAdminType = () => {
//     const path = location.pathname.split('/').pop();
//     const currentType = adminTypes.find(admin => admin.path === path);
//     return currentType || adminTypes[0];
//   };

//   const currentAdmin = getCurrentAdminType();

//   const handleAdminTypeChange = (adminType: typeof adminTypes[0]) => {
//     navigate(`/SuperAdmin/user-management/${adminType.path}`);
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header with Tabs */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6">
//             <div className="mb-4 sm:mb-0">
//               <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
//               <p className="text-gray-600 mt-1">Manage different types of admin users</p>
//             </div>
//           </div>

//           {/* Admin Type Tabs */}
//           <div className="border-b border-gray-200">
//             <nav className="-mb-px flex space-x-8">
//               {adminTypes.map((admin) => (
//                 <button
//                   key={admin.type}
//                   onClick={() => handleAdminTypeChange(admin)}
//                   className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${
//                     currentAdmin.type === admin.type
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {admin.label}
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
//         <div className="px-4 py-6 sm:px-0">
//           <Routes>
//             {/* Table routes for each admin type */}
//             <Route 
//               path="support" 
//               element={
//                 <UserTable 
//                   type={2} 
//                   adminTypeLabel="Support Admin" 
//                 />
//               } 
//             />
//             <Route 
//               path="customer" 
//               element={
//                 <UserTable 
//                   type={3} 
//                   adminTypeLabel="Customer Admin" 
//                 />
//               } 
//             />
//             <Route 
//               path="sales" 
//               element={
//                 <UserTable 
//                   type={4} 
//                   adminTypeLabel="Sales Admin" 
//                 />
//               } 
//             />
            
//             {/* Form routes */}
//             <Route path="add" element={<UserForm />} />
//             <Route path="edit/:id" element={<UserForm />} />
            
//             {/* Default route - redirect to support admin */}
//             <Route path="/" element={
//               <UserTable 
//                 type={2} 
//                 adminTypeLabel="Support Admin" 
//               />
//             } />
//           </Routes>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AdminManagement;
