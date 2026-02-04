// import React, { useState, useEffect } from 'react';
// import { Button, TextInput } from 'flowbite-react';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { HiPlus, HiSearch } from 'react-icons/hi';
// import toast from 'react-hot-toast';
// import CasteModal from './AddCastleModel';

// interface CasteItem {
//   id: number;
//   district_title: string;
// }

// interface CasteResponse {
//   status: boolean;
//   rows: CasteItem[];
//   total: number;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// const CasteTable: React.FC = () => {
//   const { user } = useAuth();

//   const [data, setData] = useState<CasteItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<CasteItem | null>(null);
//   const [modalType, setModalType] = useState<'add' | 'edit'>('add');
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         origin: 'http://localhost:3010',
//         priority: 'u=1, i',
//         referer: 'http://localhost:3010/',
//         'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'cross-site',
//         'user-agent':
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2, // Caste ke liye type 2
//         s_id: user?.id,
//         academic_id: 65,
//         page: filters.page,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/get-list`,
//         requestBody,
//         { headers },
//       );
      
//       if (response.data?.status) {
//         setData(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       } else {
//         setData([]);
//         setTotal(0);
//       }
//     } catch (error) {
//       console.error('Error fetching castes:', error);
//       toast.error('Failed to fetch districts');
//       setData([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

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
//     setFilters((prev) => ({ ...prev, page: page - 1 })); // Convert to 0-based indexing
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Handle add click
//   const handleAddClick = () => {
//     setModalType('add');
//     setSelectedItem(null);
//     setShowModal(true);
//   };

//   // Handle edit click
//   const handleEditClick = (item: CasteItem) => {
//     setModalType('edit');
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   // Handle modal success
//   const handleModalSuccess = () => {
//     setShowModal(false);
//     setSelectedItem(null);
//     fetchData();
//   };

//   // Handle delete click
//   const handleDeleteClick = (item: CasteItem) => {
//     setSelectedItem(item);
//     setShowDeleteModal(true);
//   };

//   // Handle delete confirm
//   const handleDeleteConfirm = async () => {
//     if (!selectedItem) return;
//     setDeleteLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         origin: 'http://localhost:3010',
//         priority: 'u=1, i',
//         referer: 'http://localhost:3010/',
//         'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
//         'sec-ch-ua-mobile': '?0',
//         'sec-ch-ua-platform': '"Windows"',
//         'sec-fetch-dest': 'empty',
//         'sec-fetch-mode': 'cors',
//         'sec-fetch-site': 'cross-site',
//         'user-agent':
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2,
//         ids: [selectedItem.id],
//         s_id: user?.id,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/Delete-StateDistrict`,
//         requestBody,
//         { headers },
//       );

//       if (response.data?.status) {
//         toast.success(response.data?.message || 'District deleted successfully!');
//         fetchData();
//       } else {
//         toast.error(response.data?.message || 'Failed to delete district');
//       }
//     } catch (error: any) {
//       console.error('Error deleting district:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete district. Please try again.');
//     } finally {
//       setShowDeleteModal(false);
//       setSelectedItem(null);
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <>
//       <BreadcrumbHeader title="Data Manager" paths={[{ name: 'Data Manager', link: '#' }]} />
//       <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
//         {/* Table Header with Search and Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
//           <div>
//             <h2 className="text-2xl font-bold text-gray-900 dark:text-white">District</h2>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-64">
//               <TextInput
//                 type="text"
//                 placeholder="Search districts..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 icon={HiSearch}
//                 className="w-full"
//               />
//             </div>

//             {/* Add Button */}
//             <Button
//               onClick={handleAddClick}
//               className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
//             >
//               <HiPlus className="mr-2 h-5 w-5" />
//               Add District
//             </Button>
//           </div>
//         </div>

//         {/* Table Container with Loader */}
//         <div className="relative">
//           {loading && (
//             <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
//               <Loader />
//             </div>
//           )}
          
//           {/* Table */}
//           <div className="shadow-md rounded-lg min-w-full">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th
//                     scope="col"
//                     className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     S.NO
//                   </th>
//                   <th
//                     scope="col"
//                     className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                     onClick={() => handleSort('district_title')}
//                   >
//                     <div className="flex items-center">
//                       District Name {getSortIcon('district_title')}
//                     </div>
//                   </th>
//                   <th
//                     scope="col"
//                     className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                   >
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {data.length > 0 ? (
//                   data.map((item, index) => (
//                     <tr key={item.id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {filters.page * filters.rowsPerPage + index + 1}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {item.district_title}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                         <div className="flex items-center space-x-2">
//                           <button
//                             className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
//                             onClick={() => handleEditClick(item)}
//                             title="Edit"
//                           >
//                             <TbEdit size={18} />
//                           </button>

//                           <button
//                             className="text-red-500 hover:text-red-700 p-1 transition-colors"
//                             onClick={() => handleDeleteClick(item)}
//                             title="Delete"
//                           >
//                             <MdDeleteForever size={18} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg
//                           className="w-16 h-16 text-gray-300 mb-4"
//                           fill="none"
//                           viewBox="0 0 24 24"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={1}
//                             d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                           />
//                         </svg>
//                         <p className="text-lg font-medium text-gray-600">No districts found</p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {filters.search
//                             ? 'Try adjusting your search criteria'
//                             : 'No districts available'}
//                         </p>
//                         <Button onClick={handleAddClick} color="blue" className="mt-4">
//                           <svg
//                             className="w-4 h-4 mr-2"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M12 4v16m8-8H4"
//                             />
//                           </svg>
//                           Add District
//                         </Button>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>

//         {/* Pagination */}
//         {data.length > 0 && (
//           <div className="mt-6 p-4 border-t border-gray-200">
//             <Pagination
//               currentPage={filters.page + 1} // Convert to 1-based for display
//               totalPages={Math.ceil(total / filters.rowsPerPage)}
//               totalItems={total}
//               rowsPerPage={filters.rowsPerPage}
//               onPageChange={handlePageChange}
//               onRowsPerPageChange={handleRowsPerPageChange}
//             />
//           </div>
//         )}

//         {/* Combined Caste Modal */}
//         <CasteModal
//           isOpen={showModal}
//           onClose={() => {
//             setShowModal(false);
//             setSelectedItem(null);
//           }}
//           onSuccess={handleModalSuccess}
//           selectedItem={selectedItem}
//           type={modalType}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => {
//             setShowDeleteModal(false);
//             setSelectedItem(null);
//           }}
//           onConfirm={handleDeleteConfirm}
//           title="Delete District"
//           message={`Are you sure you want to delete "${selectedItem?.district_title}"? This action cannot be undone.`}
//           loading={deleteLoading}
//         />
//       </div>
//     </>
//   );
// };

// export default CasteTable;

















// import React, { useState, useEffect } from 'react';
// import { Button, TextInput } from 'flowbite-react';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { HiPlus, HiSearch } from 'react-icons/hi';
// import toast from 'react-hot-toast';
// import CasteModal from './AddCastleModel';

// interface CasteItem {
//   id: number;
//   district_title: string;
// }

// interface CasteResponse {
//   status: boolean;
//   rows: CasteItem[];
//   total: number;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// const CasteTable: React.FC = () => {
//   const { user } = useAuth();

//   const [data, setData] = useState<CasteItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<CasteItem | null>(null);
//   const [modalType, setModalType] = useState<'add' | 'edit'>('add');
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2, // Caste ke liye type 2
//         s_id: user?.id,
//         academic_id: 65,
//         page: filters.page,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/get-list`,
//         requestBody,
//         { headers },
//       );
      
//       if (response.data?.status) {
//         setData(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       } else {
//         setData([]);
//         setTotal(0);
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//       toast.error('Failed to fetch districts');
//       setData([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

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
//     setFilters((prev) => ({ ...prev, page: page - 1 }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Handle add click
//   const handleAddClick = () => {
//     setModalType('add');
//     setSelectedItem(null);
//     setShowModal(true);
//   };

//   // Handle edit click
//   const handleEditClick = (item: CasteItem) => {
//     setModalType('edit');
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   // Handle modal success
//   const handleModalSuccess = () => {
//     setShowModal(false);
//     setSelectedItem(null);
//     fetchData();
//   };

//   // Handle delete click
//   const handleDeleteClick = (item: CasteItem) => {
//     setSelectedItem(item);
//     setShowDeleteModal(true);
//   };

//   // Handle delete confirm
//   const handleDeleteConfirm = async () => {
//     if (!selectedItem) return;
//     setDeleteLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2,
//         ids: [selectedItem.id],
//         s_id: user?.id,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/Delete-StateDistrict`,
//         requestBody,
//         { headers },
//       );

//       if (response.data?.status) {
//         toast.success(response.data?.message || 'District deleted successfully!');
//         fetchData();
//       } else {
//         toast.error(response.data?.message || 'Failed to delete district');
//       }
//     } catch (error: any) {
//       console.error('Error deleting district:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete district. Please try again.');
//     } finally {
//       setShowDeleteModal(false);
//       setSelectedItem(null);
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <>
//       <BreadcrumbHeader 
//         title="Districts" 
//         paths={[{ name: 'Districts', link: '/' + user?.role + '/data-manager/District' }]} 
//       />
      
//       {/* Main Content with Blur Effect when Modal is Open */}
//       <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
//         <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
//           {/* Table Header with Search and Add Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
//             <div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Districts</h2>
//               <p className="text-sm text-gray-600 mt-1">Manage all districts in the system</p>
//             </div>

//             <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
//               {/* Search Input */}
//               <div className="relative w-full sm:w-64">
//                 <TextInput
//                   type="text"
//                   placeholder="Search districts..."
//                   value={filters.search}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   icon={HiSearch}
//                   className="w-full"
//                 />
//               </div>

//               {/* Add Button */}
//               <Button
//                 onClick={handleAddClick}
//                 className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 whitespace-nowrap"
//               >
//                 <HiPlus className="mr-2 h-5 w-5" />
//                 Add District
//               </Button>
//             </div>
//           </div>

//           {/* Table Container with Loader */}
//           <div className="relative">
//             {loading && (
//               <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
//                 <Loader />
//               </div>
//             )}
            
//             <div className="shadow-md rounded-lg min-w-full">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="w-20 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('id')}
//                     >
//                       <div className="flex items-center">
//                         S.NO {getSortIcon('id')}
//                       </div>
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('district_title')}
//                     >
//                       <div className="flex items-center">
//                         District Name {getSortIcon('district_title')}
//                       </div>
//                     </th>
//                     <th
//                       scope="col"
//                       className="w-32 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {item.district_title}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-3">
//                             {/* Edit Button */}
//                             <button
//                               className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
//                               onClick={() => handleEditClick(item)}
//                               title="Edit District"
//                             >
//                               <TbEdit size={18} />
//                             </button>

//                             {/* Delete Button */}
//                             <button
//                               className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
//                               onClick={() => handleDeleteClick(item)}
//                               title="Delete District"
//                             >
//                               <MdDeleteForever size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="px-6 py-12 text-center">
//                         <div className="flex flex-col items-center justify-center text-gray-500">
//                           <svg
//                             className="w-16 h-16 text-gray-300 mb-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1}
//                               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                           <p className="text-lg font-medium text-gray-600 mb-2">No districts found</p>
//                           <p className="text-sm text-gray-500 mb-4">
//                             {filters.search
//                               ? 'Try adjusting your search criteria'
//                               : 'Get started by adding your first district'}
//                           </p>
//                           <Button onClick={handleAddClick} color="blue" className="flex items-center gap-2">
//                             <HiPlus className="w-4 h-4" />
//                             Add District
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {data.length > 0 && (
//             <div className="mt-6 p-4 border-t border-gray-200">
//               <Pagination
//                 currentPage={filters.page + 1}
//                 totalPages={Math.ceil(total / filters.rowsPerPage)}
//                 totalItems={total}
//                 rowsPerPage={filters.rowsPerPage}
//                 onPageChange={handlePageChange}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Combined Caste Modal */}
//       <CasteModal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setSelectedItem(null);
//         }}
//         onSuccess={handleModalSuccess}
//         selectedItem={selectedItem}
//         type={modalType}
//       />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setSelectedItem(null);
//         }}
//         onConfirm={handleDeleteConfirm}
//         title="Delete District"
//         message={`Are you sure you want to delete "${selectedItem?.district_title}"? This action cannot be undone.`}
//         loading={deleteLoading}
//       />
//     </>
//   );
// };

// export default CasteTable;

















// import React, { useState, useEffect } from 'react';
// import { Button, TextInput } from 'flowbite-react';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { HiPlus, HiSearch } from 'react-icons/hi';
// import toast from 'react-hot-toast';
// import CasteModal from './AddCastleModel';

// interface CasteItem {
//   id: number;
//   district_title: string;
// }

// interface CasteResponse {
//   status: boolean;
//   rows: CasteItem[];
//   total: number;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// const CasteTable: React.FC = () => {
//   const { user } = useAuth();

//   const [data, setData] = useState<CasteItem[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [showModal, setShowModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [selectedItem, setSelectedItem] = useState<CasteItem | null>(null);
//   const [modalType, setModalType] = useState<'add' | 'edit'>('add');
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch data
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2, // Caste ke liye type 2
//         s_id: user?.id,
//         academic_id: 65,
//         page: filters.page,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/get-list`,
//         requestBody,
//         { headers },
//       );
      
//       if (response.data?.status) {
//         setData(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       } else {
//         setData([]);
//         setTotal(0);
//       }
//     } catch (error) {
//       console.error('Error fetching districts:', error);
//       toast.error('Failed to fetch districts');
//       setData([]);
//       setTotal(0);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

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
//     setFilters((prev) => ({ ...prev, page: page - 1 }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Handle add click
//   const handleAddClick = () => {
//     setModalType('add');
//     setSelectedItem(null);
//     setShowModal(true);
//   };

//   // Handle edit click
//   const handleEditClick = (item: CasteItem) => {
//     setModalType('edit');
//     setSelectedItem(item);
//     setShowModal(true);
//   };

//   // Handle modal success
//   const handleModalSuccess = () => {
//     setShowModal(false);
//     setSelectedItem(null);
//     fetchData();
//   };

//   // Handle delete click
//   const handleDeleteClick = (item: CasteItem) => {
//     setSelectedItem(item);
//     setShowDeleteModal(true);
//   };

//   // Handle delete confirm
//   const handleDeleteConfirm = async () => {
//     if (!selectedItem) return;
//     setDeleteLoading(true);
//     try {
//       const headers = {
//         accept: '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         Authorization: `Bearer ${user?.token}`,
//         'Content-Type': 'application/json',
//       };

//       const requestBody = {
//         type: 2,
//         ids: [selectedItem.id],
//         s_id: user?.id,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/StateDistrict/Delete-StateDistrict`,
//         requestBody,
//         { headers },
//       );

//       if (response.data?.status) {
//         toast.success(response.data?.message || 'District deleted successfully!');
//         fetchData();
//       } else {
//         toast.error(response.data?.message || 'Failed to delete district');
//       }
//     } catch (error: any) {
//       console.error('Error deleting district:', error);
//       toast.error(error.response?.data?.message || 'Failed to delete district. Please try again.');
//     } finally {
//       setShowDeleteModal(false);
//       setSelectedItem(null);
//       setDeleteLoading(false);
//     }
//   };

//   return (
//     <>
//       <BreadcrumbHeader 
//         title="Districts" 
//         paths={[{ name: 'Districts', link: '/' + user?.role + '/data-manager/District' }]} 
//       />
      
//       {/* Main Content with Blur Effect when Modal is Open */}
//       <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
//         <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
//           {/* Table Header - Title replaced with Search Bar */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
//             {/* Search Input - Now on the left side */}
//             <div className="relative w-full sm:w-64">
//               <TextInput
//                 type="text"
//                 placeholder="Search districts..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 icon={HiSearch}
//                 className="w-full"
//               />
//             </div>

//             {/* Add Button - On the right side */}
//             <Button
//               onClick={handleAddClick}
//               className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 whitespace-nowrap"
//             >
//               <HiPlus className="mr-2 h-5 w-5" />
//               Add District
//             </Button>
//           </div>

//           {/* Table Container with Loader */}
//           <div className="relative">
//             {loading && (
//               <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
//                 <Loader />
//               </div>
//             )}
            
//             <div className="shadow-md rounded-lg min-w-full">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th
//                       scope="col"
//                       className="w-20 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('id')}
//                     >
//                       <div className="flex items-center">
//                         S.NO {getSortIcon('id')}
//                       </div>
//                     </th>
//                     <th
//                       scope="col"
//                       className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('district_title')}
//                     >
//                       <div className="flex items-center justify-center">
//                         District Name {getSortIcon('district_title')}
//                       </div>
//                     </th>
//                     <th
//                       scope="col"
//                       className="w-32 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                     >
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>

//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {data.length > 0 ? (
//                     data.map((item, index) => (
//                       <tr key={item.id} className="hover:bg-gray-50 transition-colors">
//                         <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
//                           {item.district_title}
//                         </td>
//                         <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-3">
//                             {/* Edit Button */}
//                             <button
//                               className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
//                               onClick={() => handleEditClick(item)}
//                               title="Edit District"
//                             >
//                               <TbEdit size={18} />
//                             </button>

//                             {/* Delete Button */}
//                             <button
//                               className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
//                               onClick={() => handleDeleteClick(item)}
//                               title="Delete District"
//                             >
//                               <MdDeleteForever size={18} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={3} className="px-6 py-12 text-center">
//                         <div className="flex flex-col items-center justify-center text-gray-500">
//                           <svg
//                             className="w-16 h-16 text-gray-300 mb-4"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={1}
//                               d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                             />
//                           </svg>
//                           <p className="text-lg font-medium text-gray-600 mb-2">No districts found</p>
//                           <p className="text-sm text-gray-500 mb-4">
//                             {filters.search
//                               ? 'Try adjusting your search criteria'
//                               : 'Get started by adding your first district'}
//                           </p>
//                           <Button onClick={handleAddClick} color="blue" className="flex items-center gap-2">
//                             <HiPlus className="w-4 h-4" />
//                             Add District
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>

//           {/* Pagination */}
//           {data.length > 0 && (
//             <div className="mt-6 p-4 border-t border-gray-200">
//               <Pagination
//                 currentPage={filters.page + 1}
//                 totalPages={Math.ceil(total / filters.rowsPerPage)}
//                 totalItems={total}
//                 rowsPerPage={filters.rowsPerPage}
//                 onPageChange={handlePageChange}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Combined Caste Modal */}
//       <CasteModal
//         isOpen={showModal}
//         onClose={() => {
//           setShowModal(false);
//           setSelectedItem(null);
//         }}
//         onSuccess={handleModalSuccess}
//         selectedItem={selectedItem}
//         type={modalType}
//       />

//       {/* Delete Confirmation Modal */}
//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setSelectedItem(null);
//         }}
//         onConfirm={handleDeleteConfirm}
//         title="Delete District"
//         message={`Are you sure you want to delete "${selectedItem?.district_title}"? This action cannot be undone.`}
//         loading={deleteLoading}
//       />
//     </>
//   );
// };

// export default CasteTable;











import React, { useState, useEffect } from 'react';
import { Button, TextInput } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { HiPlus, HiSearch } from 'react-icons/hi';
import toast from 'react-hot-toast';
import CasteModal from './AddCastleModel';
import Select from 'react-select';

// Updated interface for City Item
interface CityItem {
  id: number;
  city_name: string;
  country_id: number;
  country_name: string;
  state_id: number;
  state_name: string;
}

interface CityResponse {
  status: boolean;
  rows: CityItem[];
  total: number;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  country_id?: number;
  state_id?: number;
}

interface CountryItem {
  id: number;
  name: string;
}

interface StateItem {
  state_id: number;
  state_title: string;
  country_id: number;
}

interface SelectOption {
  value: number;
  label: string;
}

const CasteTable: React.FC = () => {
  const { user } = useAuth();

  // Updated state for cities
  const [data, setData] = useState<CityItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<CityItem | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // New states for dropdowns
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(null);
  const [selectedState, setSelectedState] = useState<SelectOption | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [showCityLoader, setShowCityLoader] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch states when country is selected
  useEffect(() => {
    if (selectedCountry?.value) {
      fetchStates(selectedCountry.value);
      setSelectedState(null); // Reset state when country changes
      setData([]); // Clear city data when country changes
      setTotal(0);
    } else {
      setStates([]);
      setSelectedState(null);
      setData([]);
      setTotal(0);
    }
  }, [selectedCountry]);

  // Fetch cities when state is selected
  useEffect(() => {
    if (selectedState?.value) {
      // Add a small delay to show loader
      setShowCityLoader(true);
      const timer = setTimeout(() => {
        fetchData();
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setData([]);
      setTotal(0);
    }
  }, [selectedState, filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

  // Fetch countries
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
      };

      const requestBody = {
        state_id: "" ,
        s_id: user?.id || "",
      };

      const response = await axios.post(
        `${apiUrl}/Public/Counties`,
        requestBody,
        { headers },
      );
      
      if (response.data?.status) {
        setCountries(response.data.states || []);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch states by country
  const fetchStates = async (countryId: number) => {
    setLoadingStates(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        country_id: countryId.toString(),
        s_id: user?.id || "",
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-states`,
        requestBody,
        { headers },
      );
      
      if (response.data?.status) {
        setStates(response.data.states || []);
      } else {
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLoadingStates(false);
    }
  };

  // Fetch cities data
  const fetchData = async () => {
    if (!selectedState?.value) {
      setData([]);
      setTotal(0);
      setShowCityLoader(false);
      return;
    }

    setLoading(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        type: 3, // Cities ke liye type 3
        s_id: user?.id,
        academic_id: 65,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
        state_id: selectedState.value, // Pass selected state_id
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/get-list`,
        requestBody,
        { headers },
      );
      
      console.log('API Response:', response.data); // Debug log
      
      if (response.data?.status) {
        setData(response.data.rows || []);
        setTotal(response.data.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      toast.error('Failed to fetch cities');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
      setShowCityLoader(false);
    }
  };

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

  // Handle country change
  const handleCountryChange = (option: SelectOption | null) => {
    setSelectedCountry(option);
    setSelectedState(null);
    setFilters(prev => ({
      ...prev,
      country_id: option?.value,
      state_id: undefined,
      page: 0
    }));
  };

  // Handle state change
  const handleStateChange = (option: SelectOption | null) => {
    setSelectedState(option);
    setFilters(prev => ({
      ...prev,
      state_id: option?.value,
      page: 0
    }));
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle add click
  const handleAddClick = () => {
    setModalType('add');
    setSelectedItem(null);
    setShowModal(true);
  };

  // Handle edit click
  const handleEditClick = (item: CityItem) => {
    setModalType('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  // Handle modal success
  const handleModalSuccess = () => {
    setShowModal(false);
    setSelectedItem(null);
    fetchData();
  };

  // Handle delete click
  const handleDeleteClick = (item: CityItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
    setDeleteLoading(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        type: 3, // City type
        ids: [selectedItem.id],
        s_id: user?.id,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/Delete-StateDistrict`,
        requestBody,
        { headers },
      );

      if (response.data?.status) {
        toast.success(response.data?.message || 'City deleted successfully!');
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to delete city');
      }
    } catch (error: any) {
      console.error('Error deleting city:', error);
      toast.error(error.response?.data?.message || 'Failed to delete city. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setSelectedItem(null);
      setDeleteLoading(false);
    }
  };

  // Convert countries to select options
  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name
  }));

  // Convert states to select options
  const stateOptions = states.map(state => ({
    value: state.state_id,
    label: state.state_title
  }));

  // Custom styles for react-select (removed horizontal scrollbar)
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: state.isDisabled ? '#f9fafb' : '#fff',
      '&:hover': {
        borderColor: '#9ca3af'
      },
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      transition: 'all 0.2s ease'
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      padding: '4px',
      maxHeight: '200px',
      overflowY: 'auto', // Only vertical scroll
      overflowX: 'hidden' // Hide horizontal scrollbar
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      borderRadius: '6px',
      margin: '2px 0',
      padding: '8px 12px',
      fontSize: '14px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '14px',
      maxWidth: 'calc(100% - 40px)',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      transition: 'transform 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: '#374151'
      }
    }),
    input: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '14px',
      margin: 0,
      padding: 0
    }),
  };

  return (
    <>
      <BreadcrumbHeader 
        title="Cities" 
        paths={[{ name: 'Cities', link: '/' + user?.role + '/data-manager/Cities' }]} 
      />
      
      {/* Main Content with Blur Effect when Modal is Open */}
      <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Table Header - Filters */}
          <div className="p-6 pb-4">
            {/* Top Row: Search, Dropdowns and Add Button in single row */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              {/* Left side: Search and Dropdowns */}
              <div className="flex-1 flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                {/* Search Input */}
                <div className="w-full sm:w-64">
                  <TextInput
                    type="text"
                    placeholder="Search Cities..."
                    value={filters.search}
                    onChange={(e) => handleSearch(e.target.value)}
                    icon={HiSearch}
                    className="w-full"
                  />
                </div>

                {/* Country Dropdown */}
                <div className="w-full sm:w-64">
                  <Select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    options={countryOptions}
                    placeholder="Select Country..."
                    isSearchable
                    isClearable
                    isLoading={loadingCountries}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={({ inputValue }) =>
                      inputValue ? "No countries found" : "No countries available"
                    }
                    loadingMessage={() => "Loading countries..."}
                  />
                </div>

                {/* State Dropdown */}
                <div className="w-full sm:w-64">
                  <Select
                    value={selectedState}
                    onChange={handleStateChange}
                    options={stateOptions}
                    placeholder={selectedCountry ? "Select State..." : "Select country first"}
                    isSearchable
                    isClearable
                    isLoading={loadingStates}
                    isDisabled={!selectedCountry || loadingStates}
                    styles={customStyles}
                    menuPortalTarget={document.body}
                    menuPosition="fixed"
                    className="react-select-container"
                    classNamePrefix="react-select"
                    noOptionsMessage={({ inputValue }) =>
                      inputValue ? "No states found" : !selectedCountry ? "Select a country first" : "No states available"
                    }
                    loadingMessage={() => "Loading states..."}
                  />
                </div>
              </div>

              {/* Right side: Add Button */}
              <div className="w-full sm:w-auto">
                <Button
                  onClick={handleAddClick}
                  className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 whitespace-nowrap w-full sm:w-auto"
                >
                  <HiPlus className="mr-2 h-5 w-5" />
                  Add City
                </Button>
              </div>
            </div>
          </div>

          {/* Show instructions based on selection state */}
          {!selectedCountry && (
            <div className="px-6 pb-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">Step 1:</span> Please select a country to view states
                </p>
              </div>
            </div>
          )}

          {selectedCountry && !selectedState && (
            <div className="px-6 pb-4">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-700 text-sm">
                  <span className="font-medium">Step 2:</span> Please select a state to view cities
                </p>
              </div>
            </div>
          )}

          {/* Table Container */}
          <div className="relative min-h-[400px]">
            {/* Show loader only when cities are loading */}
            {showCityLoader && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                <div className="text-center">
                  <Loader />
                  <p className="mt-4 text-gray-600">Loading cities...</p>
                </div>
              </div>
            )}

            {/* Table content */}
            {selectedState && !showCityLoader && (
              <>
                {loading && (
                  <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                    <Loader />
                  </div>
                )}
                
                <div className="shadow-md rounded-lg min-w-full">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="w-20 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                          onClick={() => handleSort('id')}
                        >
                          <div className="flex items-center">
                            S.NO {getSortIcon('id')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                          onClick={() => handleSort('city_name')}
                        >
                          <div className="flex items-center">
                            City Name {getSortIcon('city_name')}
                          </div>
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Country
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          State
                        </th>
                        <th
                          scope="col"
                          className="w-32 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                      {data.length > 0 ? (
                        data.map((item, index) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {filters.page * filters.rowsPerPage + index + 1}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {item.city_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.country_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {item.state_name}
                            </td>
                            <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-3">
                                {/* Edit Button */}
                                <button
                                  className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                                  onClick={() => handleEditClick(item)}
                                  title="Edit City"
                                >
                                  <TbEdit size={18} />
                                </button>

                                {/* Delete Button */}
                                <button
                                  className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
                                  onClick={() => handleDeleteClick(item)}
                                  title="Delete City"
                                >
                                  <MdDeleteForever size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center">
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
                              <p className="text-lg font-medium text-gray-600 mb-2">No cities found</p>
                              <p className="text-sm text-gray-500 mb-4">
                                {filters.search
                                  ? 'Try adjusting your search criteria'
                                  : 'No cities available for the selected state'}
                              </p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {data.length > 0 && (
                  <div className="mt-6 p-4 border-t border-gray-200">
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
              </>
            )}
          </div>
        </div>
      </div>

      {/* Combined Caste Modal - Need to update this for cities with type 3 */}
      <CasteModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedItem(null);
        }}
        onSuccess={handleModalSuccess}
        selectedItem={selectedItem}
        type={modalType}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedItem(null);
        }}
        onConfirm={handleDeleteConfirm}
        title="Delete City"
        message={`Are you sure you want to delete "${selectedItem?.city_name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </>
  );
};

export default CasteTable;