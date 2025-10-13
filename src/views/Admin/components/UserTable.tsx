// src/Frontend/UserManagement/components/UserTable.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import { useAcademics } from 'src/hook/useAcademics';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface User {
  id: number;
  name: string;
  email: string;
  number: string;
  status: number;
  two_step_auth: number;
  profile: string;
  created_at: string;
  academic_id: number | null;
  academic_name?: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic: string;
}

interface UserTableProps {
  type: number; // 2: Support Admin, 3: Customer Admin, 4: Sales Admin
}

const UserTable: React.FC<UserTableProps> = ({ type }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { academics, loading: academicLoading } = useAcademics();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic: ''
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch users data
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Usermanagment/list-User`,
        {
          type: type,
          s_id: user?.id,
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
          academic_id: filters.academic || undefined
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '*/*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setUsers(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic, type]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      page: 0
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters(prev => ({
      ...prev,
      order: direction,
      orderBy: key,
      page: 0
    }));
  };

  const getSortIcon = (key: string) => {
    if (sort.key !== key) {
      return <FaSort className="text-gray-400" />;
    }
    if (sort.direction === 'asc') {
      return <FaSortUp className="text-gray-600" />;
    }
    return <FaSortDown className="text-gray-600" />;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Toggle active status
  const toggleActiveStatus = async (userId: number, currentStatus: number) => {
    try {
      await axios.post(
        `${apiUrl}/SuperAdmin/Usermanagment/Change-User-status`,
        {
          s_id: user?.id,
          user_id: userId,
          status: currentStatus === 1 ? 0 : 1
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh data after status change
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setUserToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (userToDelete !== null) {
      try {
        const response = await axios.post(
          `${apiUrl}/SuperAdmin/Usermanagment/Delete-User`,
          {
            id: [userToDelete],
            s_id: user?.id
          },
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data.status === false) {
          console.error('Delete failed:', response.data.message);
          alert(`Delete failed: ${response.data.message}`);
          return;
        }
        
        alert('User deleted successfully!');
        fetchUsers();
        
      } catch (error: any) {
        console.error('Error deleting user:', error);
        if (error.response?.data?.message) {
          alert(`Delete failed: ${error.response.data.message}`);
        } else {
          alert('Delete failed. Please try again.');
        }
      } finally {
        setShowDeleteModal(false);
        setUserToDelete(null);
      }
    }
  };

  // Navigate to add user
  const handleAddUser = () => {
   // navigate(`/${user?.role}/user-management/add/${type}`);
   navigate(`/${user?.role}/admin/add/${type}`);
  };

  // Navigate to edit user
  const handleEdit = (userId: number) => {
   // navigate(`/${user?.role}/user-management/edit/${type}/${userId}`);
    navigate(`/${user?.role}/admin/edit/${type}/${userId}`);
  };

  // Get admin type label
  const getAdminTypeLabel = (): string => {
    switch (type) {
      case 2: return 'Support Admin';
      case 3: return 'Customer Admin';
      case 4: return 'Sales Admin';
      default: return 'Admin';
    }
  };

  // Get status badge
  const getStatusBadge = (status: number) => {
    return status === 1 
      ? 'bg-green-100 text-green-800'
      : 'bg-red-100 text-red-800';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
      {/* Search Bar with Filters and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Academic Dropdown - Only for Customer Admin */}
          {type === 3 && (
  <AcademicDropdown
    name="academic"
    formData={filters}
    setFormData={setFilters}
    label=""
    includeAllOption
    className="sm:w-64"
  />
)}

        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddUser}
          color="blue"
          className="whitespace-nowrap px-4 py-2.5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add {getAdminTypeLabel()}
        </Button>
      </div>

      {/* Table */}
      <div className="shadow-md rounded-lg min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.NO
              </th>
              <th scope="col" className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Profile
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('name')}>
                <div className="flex items-center">
                  Name {getSortIcon('name')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('email')}>
                <div className="flex items-center">
                  Email {getSortIcon('email')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              {type === 3 && (
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Academic
                </th>
              )}
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.length > 0 ? (
              users.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(filters.page * filters.rowsPerPage) + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {user.profile ? (
                      <img 
                        src={`${assetUrl}/${user.profile}`} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover" 
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-sm">No</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.number}
                  </td>
                  {type === 3 && (
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.academic_name || 'N/A'}
                    </td>
                  )}
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(user.status)}`}>
                      {user.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <Button 
                        color={user.status === 1 ? 'warning' : 'success'} 
                        className="text-xs px-3 py-1"
                        onClick={() => toggleActiveStatus(user.id, user.status)}
                        size="xs"
                      >
                        {user.status === 1 ? 'Deactivate' : 'Activate'}
                      </Button>
                      
                      <button 
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => handleEdit(user.id)}
                      >
                        <MdEdit size={18} />
                      </button>
                      
                      <button 
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDeleteClick(user.id)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={type === 3 ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No users found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filters.search ? 'Try adjusting your search criteria' : `No ${getAdminTypeLabel().toLowerCase()} users available`}
                    </p>
                    <Button
                      onClick={handleAddUser}
                      color="blue"
                      className="mt-4"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add {getAdminTypeLabel()}
                    </Button>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {users.length > 0 && (
        <div className="mt-6">
          <Pagination
            currentPage={filters.page + 1}
            totalPages={Math.ceil(total / filters.rowsPerPage)}
            totalItems={total}
            rowsPerPage={filters.rowsPerPage}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default UserTable;




















// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router';
// import { MdEdit, MdDelete } from 'react-icons/md';
// import { Button } from 'flowbite-react';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import { useAcademics } from 'src/hook/useAcademics';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   number: string;
//   status: number;
//   two_step_auth: number;
//   profile?: string;
//   created_at: string;
//   academic_id: number | null;
//   academic_name?: string;
// }

// interface UserTableProps {
//   type: 2 | 3 | 4; // 2: Support Admin, 3: Customer Admin, 4: Sales Admin
//   adminTypeLabel: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic: string;
// }

// const UserTable: React.FC<UserTableProps> = ({ type, adminTypeLabel }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const { academics, loading: academicLoading } = useAcademics();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     academic: ''
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [userToDelete, setUserToDelete] = useState<number | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const assetUrl = import.meta.env.VITE_ASSET_URL;

//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch users data
//   const fetchUsers = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Usermanagment/list-User`,
//         {
//           type: type,
//           s_id: user?.id,
//           page: filters.page,
//           rowsPerPage: filters.rowsPerPage,
//           order: filters.order,
//           orderBy: filters.orderBy,
//           search: filters.search,
//           academic: filters.academic || undefined
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '*/*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data) {
//         setUsers(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching users:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic, type]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters(prev => ({
//       ...prev,
//       search: searchValue,
//       page: 0
//     }));
//   };

//   // Handle sort
//   const handleSort = (key: string) => {
//     const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
//     setSort({ key, direction });
//     setFilters(prev => ({
//       ...prev,
//       order: direction,
//       orderBy: key,
//       page: 0
//     }));
//   };

//   const getSortIcon = (key: string) => {
//     if (sort.key !== key) {
//       return <FaSort className="text-gray-400" />;
//     }
//     if (sort.direction === 'asc') {
//       return <FaSortUp className="text-gray-600" />;
//     }
//     return <FaSortDown className="text-gray-600" />;
//   };

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     setFilters(prev => ({ ...prev, page }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Toggle active status
//   const toggleActiveStatus = async (userId: number, currentStatus: number) => {
//     try {
//       await axios.post(
//         `${apiUrl}/SuperAdmin/Usermanagment/Change-User-status`,
//         {
//           s_id: user?.id,
//           user_id: userId,
//           status: currentStatus === 1 ? 0 : 1
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       // Refresh data after status change
//       fetchUsers();
//     } catch (error) {
//       console.error('Error updating status:', error);
//     }
//   };

//   // Handle delete
//   const handleDeleteClick = (id: number) => {
//     setUserToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (userToDelete !== null) {
//       try {
//         const response = await axios.post(
//           `${apiUrl}/SuperAdmin/Usermanagment/delete-User`,
//           {
//             id: [userToDelete],
//             s_id: user?.id,
//             type: type
//           },
//           {
//             headers: {
//               'Authorization': `Bearer ${user?.token}`,
//               'Content-Type': 'application/json'
//             }
//           }
//         );

//         if (response.data.status === false) {
//           console.error('Delete failed:', response.data.message);
//           alert(`Delete failed: ${response.data.message}`);
//           return;
//         }
        
//         alert('User deleted successfully!');
//         fetchUsers();
        
//       } catch (error: any) {
//         console.error('Error deleting user:', error);
//         if (error.response?.data?.message) {
//           alert(`Delete failed: ${error.response.data.message}`);
//         } else {
//           alert('Delete failed. Please try again.');
//         }
//       } finally {
//         setShowDeleteModal(false);
//         setUserToDelete(null);
//       }
//     }
//   };

//   // Navigate to edit
//   const handleEdit = (userId: number) => {
//     navigate(`/${user?.role}/user-management/edit/${userId}`, { 
//       state: { adminType: type, adminTypeLabel } 
//     });
//   };

//   // Navigate to add user
//   const handleAddUser = () => {
//     navigate(`/${user?.role}/user-management/add`, { 
//       state: { adminType: type, adminTypeLabel } 
//     });
//   };

//   // Get status label and color
//   const getStatusInfo = (status: number) => {
//     return status === 1 
//       ? { label: 'Active', color: 'bg-green-100 text-green-800' }
//       : { label: 'Inactive', color: 'bg-red-100 text-red-800' };
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
//       {/* Header with Title and Add Button */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-800">{adminTypeLabel} Management</h1>
//           <p className="text-gray-600 mt-1">Manage {adminTypeLabel.toLowerCase()} users and their permissions</p>
//         </div>
        
//         <Button
//           onClick={handleAddUser}
//           color="blue"
//           className="whitespace-nowrap px-4 py-2.5"
//         >
//           <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Add {adminTypeLabel}
//         </Button>
//       </div>

//       {/* Search and Filter Bar */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//         {/* Search Input */}
//         <div className="relative w-full sm:w-64">
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={filters.search}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//           />
//           <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//           </svg>
//         </div>

//         {/* Academic Dropdown - Only for Customer Admin */}
//         {type === 3 && (
//           <div className="relative w-full sm:w-64">
//             <select 
//               value={filters.academic}
//               onChange={(e) => setFilters(prev => ({ ...prev, academic: e.target.value, page: 0 }))}
//               className="w-full p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm pl-3 pr-8"
//             >
//               <option value="">All Academic</option>
//               {academics.map((a) => (
//                 <option key={a.id} value={a.id}>{a.academic_name}</option>
//               ))}
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//               </svg>
//             </div>
//           </div>
//         )}
//       </div>

//       {/* Table */}
//       <div className="shadow-md rounded-lg min-w-full">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 S.NO
//               </th>
//               <th scope="col" className="w-16 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Profile
//               </th>
//               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('name')}>
//                 <div className="flex items-center">
//                   Name {getSortIcon('name')}
//                 </div>
//               </th>
//               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('email')}>
//                 <div className="flex items-center">
//                   Email {getSortIcon('email')}
//                 </div>
//               </th>
//               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Phone
//               </th>
//               {type === 3 && (
//                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Academic
//                 </th>
//               )}
//               <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th scope="col" className="w-48 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Actions
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {users.length > 0 ? (
//               users.map((user, index) => (
//                 <tr key={user.id} className="hover:bg-gray-50">
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {(filters.page * filters.rowsPerPage) + index + 1}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap">
//                     {user.profile ? (
//                       <img 
//                         src={`${assetUrl}/${user.profile}`} 
//                         alt="Profile" 
//                         className="w-10 h-10 rounded-full object-cover" 
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
//                         <span className="text-gray-500 text-xs">No Image</span>
//                       </div>
//                     )}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {user.name}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.email}
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {user.number}
//                   </td>
//                   {type === 3 && (
//                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {user.academic_name || 'N/A'}
//                     </td>
//                   )}
//                   <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                     <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusInfo(user.status).color}`}>
//                       {getStatusInfo(user.status).label}
//                     </span>
//                   </td>
//                   <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                     <div className="flex items-center space-x-2">
//                       <Button 
//                         color={user.status === 1 ? 'warning' : 'success'} 
//                         className="text-xs px-3 py-1"
//                         onClick={() => toggleActiveStatus(user.id, user.status)}
//                         size="xs"
//                       >
//                         {user.status === 1 ? 'Deactivate' : 'Activate'}
//                       </Button>
                      
//                       <button 
//                         className="text-blue-500 hover:text-blue-700 p-1"
//                         onClick={() => handleEdit(user.id)}
//                       >
//                         <MdEdit size={18} />
//                       </button>
                      
//                       <button 
//                         className="text-red-500 hover:text-red-700 p-1"
//                         onClick={() => handleDeleteClick(user.id)}
//                       >
//                         <MdDelete size={18} />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={type === 3 ? 8 : 7} className="px-6 py-8 text-center text-gray-500">
//                   <div className="flex flex-col items-center justify-center">
//                     <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                     <p className="text-lg font-medium text-gray-600">No users found</p>
//                     <p className="text-sm text-gray-500 mt-1">
//                       {filters.search ? 'Try adjusting your search criteria' : `No ${adminTypeLabel.toLowerCase()} users available`}
//                     </p>
//                     <Button
//                       onClick={handleAddUser}
//                       color="blue"
//                       className="mt-4"
//                     >
//                       <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                       </svg>
//                       Add {adminTypeLabel}
//                     </Button>
//                   </div>
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* Pagination */}
//       {users.length > 0 && (
//         <div className="mt-6">
//           <Pagination
//             currentPage={filters.page + 1}
//             totalPages={Math.ceil(total / filters.rowsPerPage)}
//             totalItems={total}
//             rowsPerPage={filters.rowsPerPage}
//             onPageChange={handlePageChange}
//             onRowsPerPageChange={handleRowsPerPageChange}
//           />
//         </div>
//       )}

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         onConfirm={confirmDelete}
//         title="Delete User"
//         message="Are you sure you want to delete this user? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default UserTable;

