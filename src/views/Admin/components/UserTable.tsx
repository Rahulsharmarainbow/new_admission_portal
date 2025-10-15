// src/Frontend/UserManagement/components/UserTable.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
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

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic: '',
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
          academic_id: filters.academic || undefined,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '*/*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        },
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
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
    filters.academic,
    type,
  ]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters((prev) => ({
      ...prev,
      order: direction,
      orderBy: key,
      page: 0,
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
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Toggle active status
  const toggleActiveStatus = async (userId: number, currentStatus: number) => {
    try {
      await axios.post(
        `${apiUrl}/SuperAdmin/Usermanagment/Change-User-status`,
        {
          s_id: user?.id,
          user_id: userId,
          status: currentStatus === 1 ? 0 : 1,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
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
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
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
    navigate(`/${user?.role}/admin/add/${type}`);
  };

  // Navigate to edit user
  const handleEdit = (userId: number) => {
    navigate(`/${user?.role}/admin/edit/${type}/${userId}`);
  };

  // Get admin type label
  const getAdminTypeLabel = (): string => {
    switch (type) {
      case 2:
        return 'Support Admin';
      case 3:
        return 'Customer Admin';
      case 4:
        return 'Sales Admin';
      default:
        return 'Admin';
    }
  };

  // Get status badge
  const getStatusBadge = (status: number) => {
    return status === 1 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 relative">
  {/* Search Bar with Filters and Add Button */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
    <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
      {/* Search Input */}
      <div className="relative w-full sm:w-72">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                   bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                   placeholder-gray-500 transition-all duration-200 shadow-sm"
        />
      </div>

      {/* Academic Dropdown - Only for Customer Admin */}
      {type === 3 && (
        <div className="w-full sm:w-64">
          <AcademicDropdown
            name="academic"
            formData={filters}
            setFormData={setFilters}
            label=""
            includeAllOption
          />
        </div>
      )}
    </div>

    {/* Add Button */}
    <Button 
      onClick={handleAddUser} 
      color="primary"
      // className="whitespace-nowrap w-full sm:w-auto px-5 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105 hover:shadow-md"
    >
      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Add {getAdminTypeLabel()}
    </Button>
  </div>

  {/* Table Container */}
  <div className="rounded-xl border border-gray-200 shadow-sm bg-white relative overflow-hidden">
    {/* Table Loader Overlay */}
    {loading && (
      <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center z-10 rounded-xl">
        <div className="text-center">
          <Loader />
          <p className="text-gray-600 text-sm mt-3 font-medium">Loading users...</p>
        </div>
      </div>
    )}
    
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="w-16 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              S.NO
            </th>
            <th className="w-20 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              Profile
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 cursor-pointer select-none hover:bg-gray-50 transition-colors"
              onClick={() => handleSort('name')}
            >
              <div className="flex items-center space-x-1">
                <span>Name</span>
                {getSortIcon('name')}
              </div>
            </th>
            <th
              className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200 cursor-pointer select-none hover:bg-gray-50 transition-colors"
              onClick={() => handleSort('email')}
            >
              <div className="flex items-center space-x-1">
                <span>Email</span>
                {getSortIcon('email')}
              </div>
            </th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              Phone
            </th>
            {type === 3 && (
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
                Academic
              </th>
            )}
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              Status
            </th>
            <th className="w-56 px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr 
                key={user.id} 
                className="hover:bg-gray-50 transition-all duration-200 group border-b border-gray-100 last:border-b-0"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                  {filters.page * filters.rowsPerPage + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {user.profile ? (
                      <img
                        src={`${assetUrl}/${user.profile}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm group-hover:border-blue-100 transition-colors"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-sm flex items-center justify-center group-hover:border-blue-100 transition-colors">
                        <span className="text-gray-400 text-xs font-medium">No</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600 font-medium">{user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{user.number || 'N/A'}</div>
                </td>
                {type === 3 && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-600 max-w-[150px] truncate" title={user.academic_name}>
                      {user.academic_name || 'N/A'}
                    </div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.status === 1 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}
                  >
                    {user.status === 1 ? (
                      <>
                        <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></div>
                        Active
                      </>
                    ) : (
                      <>
                        <div className="w-1.5 h-1.5 bg-red-500 rounded-full mr-1.5"></div>
                        Inactive
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    <Button
                      gradientDuoTone={user.status === 1 ? "pinkToOrange" : "greenToBlue"}
                      size="xs"
                      className="text-xs px-3 py-1.5 font-medium rounded-lg transition-all duration-200 hover:shadow-sm"
                      onClick={() => toggleActiveStatus(user.id, user.status)}
                    >
                      {user.status === 1 ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Deactivate
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          Activate
                        </>
                      )}
                    </Button>

                    <button
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-all duration-200 group/edit"
                      onClick={() => handleEdit(user.id)}
                      title="Edit User"
                    >
                      <TbEdit size={16} className="group-hover/edit:scale-110 transition-transform" />
                    </button>

                    <button
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-all duration-200 group/delete"
                      onClick={() => handleDeleteClick(user.id)}
                      title="Delete User"
                    >
                      <MdDeleteForever size={16} className="group-hover/delete:scale-110 transition-transform" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={type === 3 ? 8 : 7} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center justify-center text-gray-500">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-xl font-semibold text-gray-600 mb-2">No users found</p>
                  <p className="text-gray-500 mb-6 max-w-md text-center">
                    {filters.search
                      ? 'No users match your search criteria. Try adjusting your search terms.'
                      : `No ${getAdminTypeLabel().toLowerCase()} users have been added yet.`}
                  </p>
                  <Button 
                    onClick={handleAddUser} 
                    gradientDuoTone="cyanToBlue"
                    className="px-6 py-2.5 rounded-lg font-medium transition-all duration-200 hover:scale-105 hover:shadow-md"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Your First {getAdminTypeLabel()}
                  </Button>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>

  {/* Pagination */}
  {users.length > 0 && (
    <div className="mt-6 px-2">
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
