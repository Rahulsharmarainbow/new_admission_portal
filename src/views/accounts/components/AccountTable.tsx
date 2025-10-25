// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router';
// import { MdEdit, MdDelete, MdVisibility, MdLink } from 'react-icons/md';
// import { BsArrowRightCircleFill, BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { Button, Tooltip, Badge } from 'flowbite-react';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import toast from 'react-hot-toast';
// import { createPortal } from 'react-dom';

// interface Account {
//   id: number;
//   academic_name: string;
//   academic_address: string;
//   academic_email: string;
//   academic_mobile: string;
//   academic_landmark: string;
//   academic_type: number;
//   logo?: string;
//   website?: string;
//   status?: number;
// }

// interface AccountTableProps {
//   type: 'demo' | 'live';
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// const AccountTable: React.FC<AccountTableProps> = ({ type }) => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [accounts, setAccounts] = useState<Account[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
//   const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const assetUrl = import.meta.env.VITE_ASSET_URL;

//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       let clickedOutside = true;

//       Object.values(dropdownRefs.current).forEach((ref) => {
//         if (ref && ref.contains(event.target as Node)) {
//           clickedOutside = false;
//         }
//       });

//       if (clickedOutside) {
//         setActiveDropdown(null);
//       }
//     };

//     document.addEventListener('mousedown', handleClickOutside);
//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//     };
//   }, []);

//   // Fetch accounts data
//   const fetchAccounts = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Accounts/get-accounts?` +
//           `page=${filters.page}&rowsPerPage=${filters.rowsPerPage}&` +
//           `order=${filters.order}&orderBy=${filters.orderBy}&` +
//           `search=${filters.search}&type=${type}`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             accept: '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.data) {
//         setAccounts(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching accounts:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchAccounts();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, type]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       search: searchValue,
//       page: 0,
//     }));
//   };

//   // Handle sort
//   const handleSort = (key: string) => {
//     const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
//     setSort({ key, direction });
//     setFilters((prev) => ({
//       ...prev,
//       order: direction,
//       orderBy: key,
//       page: 0,
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
//     setFilters((prev) => ({ ...prev, page: page - 1 }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Toggle active status
//   const toggleActiveStatus = async (accountId: number, currentStatus: number) => {
//     try {
//       await axios.post(
//         `${apiUrl}/${user?.role}/Accounts/Change-Academic-status`,
//         {
//           s_id: user?.id,
//           academic_id: accountId,
//           status: currentStatus === 1 ? 0 : 1,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       // Refresh data after status change
//       fetchAccounts();
//       setActiveDropdown(null);
//       toast.success(`Account ${currentStatus === 1 ? 'deactivated' : 'activated'} successfully!`);
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update account status');
//     }
//   };

//   // Handle delete
//   const handleDeleteClick = (id: number) => {
//     setAccountToDelete(id);
//     setShowDeleteModal(true);
//     setActiveDropdown(null);
//   };

//   const confirmDelete = async () => {
//     if (accountToDelete !== null) {
//       try {
//         console.log('Deleting account:', {
//           id: [accountToDelete],
//           s_id: user?.id,
//         });

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/Accounts/Delete-accounts`,
//           {
//             id: [accountToDelete],
//             s_id: user?.id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Account deleted successfully!');
//           fetchAccounts();
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete account');
//         }
//       } catch (error: any) {
//         console.error('Error deleting account:', error);
//         toast.error('Failed to delete account');
//       } finally {
//         setShowDeleteModal(false);
//         setAccountToDelete(null);
//       }
//     }
//   };

//   // Navigate to organization
//   const handleOrganizationClick = (accountId: number) => {
//     console.log('Navigating to organization:', accountId);
//     navigate(`/${user?.role}/Academic/${accountId}`);
//     setActiveDropdown(null);
//   };

//   // Navigate to website
//   const handleWebsiteClick = (accountId: number) => {
//     navigate(`/Frontend/Customer/${accountId}`);
//     setActiveDropdown(null);
//   };

//   // Navigate to make live
//   const handleMakeLive = (accountId: number) => {
//     navigate(`/${user?.role}/Accounts/Edit/${accountId}`);
//     setActiveDropdown(null);
//   };

//   // Navigate to edit
//   const handleEdit = (accountId: number) => {
//     if (type === 'demo') {
//       navigate(`/${user?.role}/demo-accounts/edit/${accountId}`);
//     } else {
//       navigate(`/${user?.role}/Accounts/Edit/${accountId}`);
//     }
//     setActiveDropdown(null);
//   };

//   // Navigate to add account
//   const handleAddAccount = () => {
//     navigate(`/${user?.role}/demo-accounts/add`);
//   };

//   // Toggle dropdown
//   const toggleDropdown = (accountId: number, event: React.MouseEvent) => {
//     event.stopPropagation();

//     if (activeDropdown === accountId) {
//       setActiveDropdown(null);
//     } else {
//       const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
//       const dropdownWidth = 192; // ~48 * 4px = 192px (same as w-48)
//       const padding = 8; // some space from the edge
//       let left = rect.left + window.scrollX;

//       // If dropdown goes beyond viewport width, open to the left
//       if (left + dropdownWidth + padding > window.innerWidth) {
//         left = rect.right - dropdownWidth + window.scrollX;
//       }

//       setDropdownPosition({ top: rect.bottom + window.scrollY, left });
//       setActiveDropdown(accountId);
//     }
//   };

//   // Set dropdown ref for each row
//   const setDropdownRef = (accountId: number, el: HTMLDivElement | null) => {
//     dropdownRefs.current[accountId] = el;
//   };

//   // Get account type label
//   const getAccountTypeLabel = (type: number): string => {
//     switch (type) {
//       case 1:
//         return 'School';
//       case 2:
//         return 'College';
//       case 3:
//         return 'University';
//       default:
//         return 'Unknown';
//     }
//   };

//   // Get account type color
//   const getAccountTypeColor = (type: number): string => {
//     switch (type) {
//       case 1:
//         return 'blue';
//       case 2:
//         return 'green';
//       case 3:
//         return 'purple';
//       default:
//         return 'gray';
//     }
//   };

//   // Get status color
//   const getStatusColor = (status: number | undefined) => {
//     return status === 1 ? 'success' : 'failure';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       {/* Search Bar with Add Button */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//         <div className="relative w-full sm:w-80">
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <BsSearch className="w-4 h-4 text-gray-500" />
//           </div>
//           <input
//             type="text"
//             placeholder="Search by name or email..."
//             value={filters.search}
//             onChange={(e) => handleSearch(e.target.value)}
//             className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                    bg-white focus:ring-blue-500 focus:border-blue-500 
//                    placeholder-gray-400 transition-all duration-200"
//           />
//         </div>

//         {/* Add Button - Only show for demo accounts */}
//         {(type === 'demo' && user?.role === 'SalesAdmin') && (
//           <Button
//             onClick={handleAddAccount}
//             gradientDuoTone="cyanToBlue"
//             className="whitespace-nowrap"
//             color={'primary'}
//           >
//             <BsPlusLg className="mr-2 w-4 h-4" />
//             Add Account
//           </Button>
//         )}
//       </div>

//       {/* Custom Table with Flowbite Styling */}
//       <div className="rounded-lg border border-gray-200 shadow-sm relative">
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   S.NO
//                 </th>
//                 <th className="w-16 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Logo
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('academic_name')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>Organization Name</span>
//                     {getSortIcon('academic_name')}
//                   </div>
//                 </th>
//                 <th className="w-24 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Type
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('academic_email')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>Primary Email</span>
//                     {getSortIcon('academic_email')}
//                   </div>
//                 </th>
//                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Website
//                 </th>
//                 <th className="w-32 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {accounts.length > 0 ? (
//                 accounts.map((account, index) => (
//                   <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {filters.page * filters.rowsPerPage + index + 1}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap">
//                       {account.logo ? (
//                         <img
//                           src={assetUrl + '/' + account.logo}
//                           alt="Logo"
//                           className="w-10 h-10 rounded-full object-cover border border-gray-200"
//                         />
//                       ) : (
//                         <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
//                           <span className="text-xs text-gray-400">No Logo</span>
//                         </div>
//                       )}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
//                       <Tooltip
//                         content={account.academic_name}
//                         placement="top"
//                         style="light"
//                         animation="duration-300"
//                       >
//                         <button
//                           onClick={() => handleOrganizationClick(account.id)}
//                           className="text-blue-600 hover:text-blue-800 truncate max-w-[200px] text-left font-semibold hover:underline transition-colors"
//                         >
//                           {account.academic_name.length > 35
//                             ? `${account.academic_name.substring(0, 35)}...`
//                             : account.academic_name}
//                         </button>
//                       </Tooltip>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap">
//                       <Badge
//                         color={getAccountTypeColor(account.academic_type)}
//                         className="text-xs font-medium"
//                       >
//                         {getAccountTypeLabel(account.academic_type)}
//                       </Badge>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-[180px]">
//                       {account.academic_email}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm">
//                       <button
//                         onClick={() => handleWebsiteClick(account.id)}
//                         className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-medium transition-colors"
//                       >
//                         <span>Visit Site</span>
//                         <BsArrowRightCircleFill className="w-4 h-4" />
//                       </button>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap">
//                       <Badge color={getStatusColor(account.status)} className="text-xs font-medium">
//                         {account.status === 1 ? 'Active' : 'Inactive'}
//                       </Badge>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-center relative">
//                       <div
//                         ref={(el) => setDropdownRef(account.id, el)}
//                         className="relative flex justify-center"
//                       >
//                         <button
//                           onClick={(e) => toggleDropdown(account.id, e)}
//                           className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                           <BsThreeDotsVertical className="w-4 h-4" />
//                         </button>
//                         {activeDropdown === account.id &&
//                           createPortal(
//                             <div
//                               className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
//                               style={{
//                                 top: dropdownPosition.top,
//                                 left: dropdownPosition.left,
//                                 position: 'absolute',
//                               }}
//                               onMouseDown={(e) => e.stopPropagation()} // <<< add this
//                             >
//                               <button
//                                 onClick={() => handleOrganizationClick(account.id)}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                               >
//                                 <MdVisibility className="w-4 h-4 mr-3" />
//                                 View Organization
//                               </button>

//                               <button
//                                 onClick={() => handleEdit(account.id)}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                               >
//                                 <MdEdit className="w-4 h-4 mr-3" />
//                                 Edit
//                               </button>

//                               {type === 'demo' && (
//                                 <button
//                                   onClick={() => handleMakeLive(account.id)}
//                                   className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                                 >
//                                   <MdLink className="w-4 h-4 mr-3" />
//                                   Make it Live
//                                 </button>
//                               )}

//                               <div className="border-t border-gray-200 my-1"></div>

//                               <button
//                                 onClick={() => toggleActiveStatus(account.id, account.status || 0)}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                               >
//                                 <span>{account.status === 1 ? 'Deactivate' : 'Activate'}</span>
//                               </button>

//                               <button
//                                 onClick={() => handleDeleteClick(account.id)}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                               >
//                                 <MdDelete className="w-4 h-4 mr-3" />
//                                 Delete
//                               </button>
//                             </div>,
//                             document.body,
//                           )}
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               ) : (
//                 <tr>
//                   <td colSpan={8} className="py-12 px-6 text-center">
//                     <div className="flex flex-col items-center justify-center text-gray-500">
//                       <svg
//                         className="w-16 h-16 text-gray-300 mb-4"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={1}
//                           d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       <p className="text-lg font-medium text-gray-600 mb-2">No accounts found</p>
//                       <p className="text-sm text-gray-500">
//                         {filters.search
//                           ? 'Try adjusting your search criteria'
//                           : `No ${type} accounts available`}
//                       </p>
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {accounts.length > 0 && (
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
//         title="Delete Account"
//         message="Are you sure you want to delete this account? This action cannot be undone."
//       />
//     </div>
//   );
// };

// export default AccountTable;























import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MdEdit, MdDelete, MdVisibility, MdLink, MdDeleteForever } from 'react-icons/md';
import { BsArrowRightCircleFill, BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, Badge, Checkbox } from 'flowbite-react';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';

interface Account {
  id: number;
  academic_name: string;
  academic_address: string;
  academic_email: string;
  academic_mobile: string;
  academic_landmark: string;
  academic_type: number;
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
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<number | null>(null);
  const [selectedAccounts, setSelectedAccounts] = useState<number[]>([]);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      let clickedOutside = true;

      Object.values(dropdownRefs.current).forEach((ref) => {
        if (ref && ref.contains(event.target as Node)) {
          clickedOutside = false;
        }
      });

      if (clickedOutside) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Reset selection when data changes
  useEffect(() => {
    setSelectedAccounts([]);
  }, [accounts, filters.page, filters.search]);

  // Fetch accounts data
  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Accounts/get-accounts?` +
          `page=${filters.page}&rowsPerPage=${filters.rowsPerPage}&` +
          `order=${filters.order}&orderBy=${filters.orderBy}&` +
          `search=${filters.search}&type=${type}&` + `s_id=${user?.id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        },
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
  const toggleActiveStatus = async (accountId: number, currentStatus: number) => {
    try {
      await axios.post(
        `${apiUrl}/${user?.role}/Accounts/Change-Academic-status`,
        {
          s_id: user?.id,
          academic_id: accountId,
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
      fetchAccounts();
      setActiveDropdown(null);
      toast.success(`Account ${currentStatus === 1 ? 'deactivated' : 'activated'} successfully!`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update account status');
    }
  };

  // Handle select all accounts
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedAccounts(accounts.map(account => account.id));
    } else {
      setSelectedAccounts([]);
    }
  };

  // Handle individual account selection
  const handleSelectAccount = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedAccounts(prev => [...prev, id]);
    } else {
      setSelectedAccounts(prev => prev.filter(accountId => accountId !== id));
    }
  };

  // Check if all accounts are selected
  const isAllSelected = accounts.length > 0 && selectedAccounts.length === accounts.length;

  // Check if some accounts are selected
  const isIndeterminate = selectedAccounts.length > 0 && selectedAccounts.length < accounts.length;

  // Handle single delete
  const handleDeleteClick = (id: number) => {
    setAccountToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  // Handle bulk delete
  const handleBulkDeleteClick = () => {
    if (selectedAccounts.length === 0) {
      toast.error('Please select at least one account to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  // Single delete confirmation
  const confirmDelete = async () => {
    if (accountToDelete !== null) {
      try {
        console.log('Deleting account:', {
          id: [accountToDelete],
          s_id: user?.id,
        });

        const response = await axios.post(
          `${apiUrl}/${user?.role}/Accounts/Delete-accounts`,
          {
            id: [accountToDelete],
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Account deleted successfully!');
          fetchAccounts();
        } else {
          console.error('Delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete account');
        }
      } catch (error: any) {
        console.error('Error deleting account:', error);
        toast.error('Failed to delete account');
      } finally {
        setShowDeleteModal(false);
        setAccountToDelete(null);
      }
    }
  };

  // Bulk delete confirmation
  const confirmBulkDelete = async () => {
    if (selectedAccounts.length > 0) {
      try {
        console.log('Deleting accounts:', {
          id: selectedAccounts,
          s_id: user?.id,
        });

        const response = await axios.post(
          `${apiUrl}/${user?.role}/Accounts/Delete-accounts`,
          {
            id: selectedAccounts,
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.status === true) {
          const message = selectedAccounts.length > 1 
            ? `${selectedAccounts.length} accounts deleted successfully!`
            : 'Account deleted successfully!';
          
          toast.success(response.data.message || message);
          fetchAccounts();
          setSelectedAccounts([]);
        } else {
          console.error('Bulk delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete accounts');
        }
      } catch (error: any) {
        console.error('Error deleting accounts:', error);
        toast.error('Failed to delete accounts');
      } finally {
        setShowBulkDeleteModal(false);
      }
    }
  };

  // Navigate to organization
  const handleOrganizationClick = (accountId: number) => {
    console.log('Navigating to organization:', accountId);
    navigate(`/${user?.role}/Academic/${accountId}`);
    setActiveDropdown(null);
  };

  // Navigate to website
  const handleWebsiteClick = (accountId: number) => {
    navigate(`/Frontend/Customer/${accountId}`);
    setActiveDropdown(null);
  };

  // Navigate to make live
  const handleMakeLive = (accountId: number) => {
    navigate(`/${user?.role}/Accounts/Edit/${accountId}`);
    setActiveDropdown(null);
  };

  // Navigate to edit
  const handleEdit = (accountId: number) => {
    if (type === 'demo') {
      navigate(`/${user?.role}/demo-accounts/edit/${accountId}`);
    } else {
      navigate(`/${user?.role}/Accounts/Edit/${accountId}`);
    }
    setActiveDropdown(null);
  };

  // Navigate to add account
  const handleAddAccount = () => {
    navigate(`/${user?.role}/demo-accounts/add`);
  };

  const handleAddLiveAccount = () => {
    navigate(`/${user?.role}/live-accounts/add`);
  };

  // Toggle dropdown
  const toggleDropdown = (accountId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === accountId) {
      setActiveDropdown(null);
    } else {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const dropdownWidth = 192; // ~48 * 4px = 192px (same as w-48)
      const padding = 8; // some space from the edge
      let left = rect.left + window.scrollX;

      // If dropdown goes beyond viewport width, open to the left
      if (left + dropdownWidth + padding > window.innerWidth) {
        left = rect.right - dropdownWidth + window.scrollX;
      }

      setDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setActiveDropdown(accountId);
    }
  };

  // Set dropdown ref for each row
  const setDropdownRef = (accountId: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[accountId] = el;
  };

  // Get account type label
  const getAccountTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return 'School';
      case 2:
        return 'College';
      case 3:
        return 'University';
      default:
        return 'Unknown';
    }
  };

  // Get account type color
  const getAccountTypeColor = (type: number): string => {
    switch (type) {
      case 1:
        return 'blue';
      case 2:
        return 'green';
      case 3:
        return 'purple';
      default:
        return 'gray';
    }
  };

  // Get status color
  const getStatusColor = (status: number | undefined) => {
    return status === 1 ? 'success' : 'failure';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      {/* Search Bar with Add Button and Delete Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-80">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                     bg-white focus:ring-blue-500 focus:border-blue-500 
                     placeholder-gray-400 transition-all duration-200"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {selectedAccounts.length > 0 && (
            <Button
              onClick={handleBulkDeleteClick}
              className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
            >
              <MdDeleteForever className="mr-2 w-4 h-4" />
              Delete Selected ({selectedAccounts.length})
            </Button>
          )}
          
          {/* Add Button - Only show for demo accounts */}
          {(type === 'demo' && user?.role === 'SalesAdmin') && (
            <Button
              onClick={handleAddAccount}
              className="whitespace-nowrap"
              color={'primary'}
            >
              <BsPlusLg className="mr-2 w-4 h-4" />
              Add Account
            </Button>
          )}

          {(type === 'live' && user?.role === 'SalesAdmin') && (
            <Button
              onClick={handleAddLiveAccount}
              className="whitespace-nowrap"
              color={'primary'}
            >
              <BsPlusLg className="mr-2 w-4 h-4" />
              Add Account
            </Button>
          )}
        </div>
      </div>

      {/* Custom Table with Flowbite Styling */}
      <div className="rounded-lg border border-gray-200 shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 py-3 px-4 text-center">
                  <Checkbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  S.NO
                </th>
                <th className="w-16 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Logo
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('academic_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Organization Name</span>
                    {getSortIcon('academic_name')}
                  </div>
                </th>
                <th className="w-24 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Type
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('academic_email')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Primary Email</span>
                    {getSortIcon('academic_email')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Website
                </th>
                <th className="w-32 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accounts.length > 0 ? (
                accounts.map((account, index) => (
                  <tr key={account.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4 text-center">
                      <Checkbox
                        checked={selectedAccounts.includes(account.id)}
                        onChange={(e) => handleSelectAccount(account.id, e.target.checked)}
                      />
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {filters.page * filters.rowsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      {account.logo ? (
                        <img
                          src={assetUrl + '/' + account.logo}
                          alt="Logo"
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-400">No Logo</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium">
                      <Tooltip
                        content={account.academic_name}
                        placement="top"
                        style="light"
                        animation="duration-300"
                      >
                        <button
                          onClick={() => handleOrganizationClick(account.id)}
                          className="text-blue-600 hover:text-blue-800 truncate max-w-[200px] text-left font-semibold hover:underline transition-colors"
                        >
                          {account.academic_name.length > 35
                            ? `${account.academic_name.substring(0, 35)}...`
                            : account.academic_name}
                        </button>
                      </Tooltip>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge
                        color={getAccountTypeColor(account.academic_type)}
                        className="text-xs font-medium"
                      >
                        {getAccountTypeLabel(account.academic_type)}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 truncate max-w-[180px]">
                      {account.academic_email}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleWebsiteClick(account.id)}
                        className="text-blue-600 hover:text-blue-800 flex items-center space-x-1 font-medium transition-colors"
                      >
                        <span>Visit Site</span>
                        <BsArrowRightCircleFill className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <Badge color={getStatusColor(account.status)} className="text-xs font-medium">
                        {account.status === 1 ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center relative">
                      <div
                        ref={(el) => setDropdownRef(account.id, el)}
                        className="relative flex justify-center"
                      >
                        <button
                          onClick={(e) => toggleDropdown(account.id, e)}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <BsThreeDotsVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === account.id &&
                          createPortal(
                            <div
                              className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                              style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                position: 'absolute',
                              }}
                              onMouseDown={(e) => e.stopPropagation()} // <<< add this
                            >
                              <button
                                onClick={() => handleOrganizationClick(account.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <MdVisibility className="w-4 h-4 mr-3" />
                                View Organization
                              </button>

                              <button
                                onClick={() => handleEdit(account.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <MdEdit className="w-4 h-4 mr-3" />
                                Edit
                              </button>

                              {type === 'demo' && (
                                <button
                                  onClick={() => handleMakeLive(account.id)}
                                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                  <MdLink className="w-4 h-4 mr-3" />
                                  Make it Live
                                </button>
                              )}

                              <div className="border-t border-gray-200 my-1"></div>

                              <button
                                onClick={() => toggleActiveStatus(account.id, account.status || 0)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <span>{account.status === 1 ? 'Deactivate' : 'Activate'}</span>
                              </button>

                              <button
                                onClick={() => handleDeleteClick(account.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                              >
                                <MdDelete className="w-4 h-4 mr-3" />
                                Delete
                              </button>
                            </div>,
                            document.body,
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="py-12 px-6 text-center">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <svg
                        className="w-16 h-16 text-gray-300 mb-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <p className="text-lg font-medium text-gray-600 mb-2">No accounts found</p>
                      <p className="text-sm text-gray-500">
                        {filters.search
                          ? 'Try adjusting your search criteria'
                          : `No ${type} accounts available`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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

      {/* Single Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Account"
        message="Are you sure you want to delete this account? This action cannot be undone."
      />

      {/* Bulk Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Accounts"
        message={`Are you sure you want to delete ${selectedAccounts.length} selected account(s)? This action cannot be undone.`}
      />
    </div>
  );
};

export default AccountTable;