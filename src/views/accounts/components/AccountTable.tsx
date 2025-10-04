import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MdEdit, MdDelete } from 'react-icons/md';
import { BsArrowRightCircleFill } from 'react-icons/bs';
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';

interface Account {
  id: number;
  academic_name: string;
  academic_address: string;
  academic_email: string;
  academic_mobile: string;
  academic_landmark: string;
  account_type: number;
  logo?: string;
  website?: string;
  status?: number;
}

interface AccountTableProps {
  type: 'demo' | 'live';
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

const AccountTable: React.FC<AccountTableProps> = ({ type }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;
console.log(assetUrl, accounts);
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch accounts data
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Accounts/get-accounts?` +
        `page=${filters.page}&rowsPerPage=${filters.rowsPerPage}&` +
        `order=${filters.order}&orderBy=${filters.orderBy}&` +
        `search=${filters.search}&type=${type}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setAccounts(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching accounts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, type]);

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
  const toggleActiveStatus = async (accountId: number, currentStatus: number) => {
    try {
      await axios.post(
        `${apiUrl}/SuperAdmin/Accounts/Change-Academic-status`,
        {
          s_id: user?.id,
          academic_id: accountId,
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
      fetchAccounts();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setAccountToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (accountToDelete !== null) {
      try {
        await axios.delete(
          `${apiUrl}/SuperAdmin/Accounts/delete-accounts`,
          {
            data: {
              id: accountToDelete,
              s_id: user?.id
            },
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Refresh data after deletion
        fetchAccounts();
      } catch (error) {
        console.error('Error deleting account:', error);
      } finally {
        setShowDeleteModal(false);
        setAccountToDelete(null);
      }
    }
  };

  // Navigate to organization
  const handleOrganizationClick = (accountId: number) => {
    navigate(`/${user?.role}/Academic/${accountId}`);
  };

  // Navigate to website
  const handleWebsiteClick = (accountId: number) => {
    navigate(`/Frontend/Customer/${accountId}`);
  };

  // Navigate to make live
  const handleMakeLive = (accountId: number) => {
    navigate(`/${user?.role}/Accounts/Edit/${accountId}`);
  };

  // Navigate to edit
  const handleEdit = (accountId: number) => {
    navigate(`/${user?.role}/Accounts/EditAccount/${accountId}`);
  };

  // Get account type label
  const getAccountTypeLabel = (type: number): string => {
    switch (type) {
      case 1: return 'School';
      case 2: return 'College';
      case 3: return 'University';
      default: return 'Unknown';
    }
  };

  // Get account type color
  const getAccountTypeColor = (type: number): string => {
    switch (type) {
      case 1: return 'bg-blue-100 text-blue-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
      {/* Search Bar */}
      <div className="flex justify-end mb-4">
        <div className="relative w-full sm:w-1/3">
          <input
            type="text"
            placeholder="Search by organization name or email..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
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
                Logo
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('academic_name')}>
                <div className="flex items-center">
                  Organization Name {getSortIcon('academic_name')}
                </div>
              </th>
              <th scope="col" className="w-24 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('academic_email')}>
                <div className="flex items-center">
                  Primary Email {getSortIcon('academic_email')}
                </div>
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Website
              </th>
              <th scope="col" className="w-64 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {accounts.length > 0 ? (
              accounts.map((account, index) => (
                <tr key={account.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(filters.page * filters.rowsPerPage) + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {account.logo ? (
                      console.log(assetUrl + account.logo),
                      <img src={account.logo} alt="Logo" className="w-10 h-10 rounded-full" />
                    ) : (
                      <p>No Logo</p>
                    )
                    }
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleOrganizationClick(account.id)}
                      className="text-blue-600 hover:text-blue-800 truncate max-w-xs block text-left"
                    >
                      {account.academic_name}
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getAccountTypeColor(account.account_type)}`}>
                      {getAccountTypeLabel(account.account_type)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">
                    {account.academic_email}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => handleWebsiteClick(account.id)}
                      className="text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Click here <BsArrowRightCircleFill className="ml-1" />
                    </button>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2 flex-wrap gap-1">
                      <Button 
                        color={account.status === 1 ? 'success' : 'light'} 
                        className="text-xs px-3 py-1"
                        onClick={() => toggleActiveStatus(account.id, account.status || 0)}
                        size="xs"
                      >
                        {account.status === 1 ? 'Deactivate Now' : 'Activate Now'}
                      </Button>
                      
                      {type === 'demo' && (
                        <Button 
                          color="blue" 
                          className="text-xs px-3 py-1"
                          onClick={() => handleMakeLive(account.id)}
                          size="xs"
                        >
                          Make it Live
                        </Button>
                      )}
                      
                      <button 
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => handleEdit(account.id)}
                      >
                        <MdEdit size={18} />
                      </button>
                      
                      <button 
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDeleteClick(account.id)}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No accounts found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filters.search ? 'Try adjusting your search criteria' : `No ${type} accounts available`}
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {accounts.length > 0 && (
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
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
      />
    </div>
  );
};

export default AccountTable;