// import React, { useState, useEffect, useRef } from 'react';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import { BsPlusLg, BsSearch, BsEye, BsEyeSlash } from 'react-icons/bs';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { Button, Tooltip, Checkbox, ToggleSwitch } from 'flowbite-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Loader from 'src/Frontend/Common/Loader';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { useAuth } from 'src/hook/useAuth';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import AcademicDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
// import BannerFormModal from './components/BannerFormModal';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// interface AcademicBanner {
//   id: number;
//   academic_id: number;
//   academic_name: string;
//   banner_image: string;
//   color_code: string;
//   redirect_url: string;
//   is_active: boolean;
//   created_at: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic_id: string;
// }

// const AcademicBannersTable: React.FC = () => {
//   const { user } = useAuth();
//   const [banners, setBanners] = useState<AcademicBanner[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     academic_id: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
//   const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
//   const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingBanner, setEditingBanner] = useState<AcademicBanner | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [multiDeleteLoading, setMultiDeleteLoading] = useState(false);
//   const [toggleLoading, setToggleLoading] = useState<number | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch banners data
//   const fetchBanners = async () => {
//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('academic_id', filters.academic_id || '');
//       formData.append('page', (filters.page + 1).toString());
//       formData.append('rowsPerPage', filters.rowsPerPage.toString());
//       formData.append('order', filters.order);
//       formData.append('orderBy', filters.orderBy);
//       formData.append('search', filters.search);
//       formData.append('s_id', user?.id?.toString() || '');

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/academic-banners/list`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'accept': 'application/json, text/plain, */*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data) {
//         setBanners(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching banners:', error);
//       toast.error('Failed to fetch banners');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       search: searchValue,
//       page: 0,
//     }));
//   };

//   // Handle academic filter change
//   const handleAcademicChange = (academicId: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       academic_id: academicId,
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

//   // Handle add new banner
//   const handleAddBanner = () => {
//     setEditingBanner(null);
//     setShowFormModal(true);
//   };

//   // Handle edit banner
//   const handleEditBanner = (banner: AcademicBanner) => {
//     setEditingBanner(banner);
//     setShowFormModal(true);
//   };

//   // Handle form submission success
//   const handleFormSuccess = () => {
//     setShowFormModal(false);
//     setEditingBanner(null);
//     fetchBanners();
//     toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner added successfully!');
//   };

//   // Handle single delete
//   const handleDeleteClick = (id: number) => {
//     setBannerToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (bannerToDelete !== null) {
//       setDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${bannerToDelete}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banner deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banner');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banner:', error);
//         toast.error('Failed to delete banner');
//       } finally {
//         setShowDeleteModal(false);
//         setBannerToDelete(null);
//         setDeleteLoading(false);
//       }
//     }
//   };

//   // Handle multi-select
//   const handleSelectBanner = (id: number) => {
//     setSelectedBanners(prev =>
//       prev.includes(id)
//         ? prev.filter(bannerId => bannerId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedBanners.length === banners.length) {
//       setSelectedBanners([]);
//     } else {
//       setSelectedBanners(banners.map(banner => banner.id));
//     }
//   };

//   // Handle multi delete
//   const handleMultiDeleteClick = () => {
//     if (selectedBanners.length > 0) {
//       setShowMultiDeleteModal(true);
//     } else {
//       toast.error('Please select at least one banner to delete');
//     }
//   };

//   const confirmMultiDelete = async () => {
//     if (selectedBanners.length > 0) {
//       setMultiDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${selectedBanners.join(',')}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banners deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banners');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banners:', error);
//         toast.error('Failed to delete banners');
//       } finally {
//         setShowMultiDeleteModal(false);
//         setMultiDeleteLoading(false);
//       }
//     }
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (id: number, currentStatus: boolean) => {
//     setToggleLoading(id);
//     try {
//       const formData = new FormData();
//       formData.append('id', id.toString());
//       formData.append('is_active', currentStatus ? '0' : '1');
//       formData.append('s_id', user?.id?.toString() || '');

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/academic-banners/update-status`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data.status === true) {
//         toast.success('Status updated successfully!');
//         fetchBanners();
//       } else {
//         toast.error('Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     } finally {
//       setToggleLoading(null);
//     }
//   };

//   // Get full image URL
//   const getImageUrl = (imagePath: string) => {
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${apiUrl.replace('/public/api', '')}${imagePath}`;
//   };

//   return (
//     <>
//       <div className="mb-6">
//         <BreadcrumbHeader
//           title="Academic Banners"
//           paths={[{ name: 'Academic Banners', link: '#' }]}
//         />
//       </div>

//       <div className="p-4 bg-white rounded-lg shadow-md">
//         {/* Search Bar with Academic Dropdown and Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <BsSearch className="w-4 h-4 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by academic name or redirect URL..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                          bg-white focus:ring-blue-500 focus:border-blue-500 
//                          placeholder-gray-400 transition-all duration-200"
//               />
//             </div>

//             {/* Academic Dropdown */}
//             {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//               <div className="w-full sm:w-64">
//                 {/* <AllAcademicsDropdown
//                 name="academic"
//                  value={filters.academic_id}
//                  onChange={handleAcademicChange}
//                  includeAllOption
//                  label=""
//                  className="min-w-[250px] text-sm"
//                /> */}
//                <AllAcademicsDropdown
//                name="academic"
//                  value={filters.academic_id}
//                  onChange={handleAcademicChange}
//                  includeAllOption
//                  label=""
//                  className="min-w-[250px] text-sm"
//                />
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-2">
//             {selectedBanners.length > 0 && (
//               <Button
//                 onClick={handleMultiDeleteClick}
//                 color="failure"
//                 className="whitespace-nowrap"
//               >
//                 <MdDeleteForever className="mr-2 w-4 h-4" />
//                 Delete Selected ({selectedBanners.length})
//               </Button>
//             )}
//             <Button
//               onClick={handleAddBanner}
//               className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               <BsPlusLg className="mr-2 w-4 h-4" />
//               Add Banner
//             </Button>
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="rounded-lg border border-gray-200 shadow-sm relative">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <Checkbox
//                         checked={selectedBanners.length === banners.length && banners.length > 0}
//                         onChange={handleSelectAll}
//                         disabled={banners.length === 0}
//                       />
//                     </th>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       S.NO
//                     </th>
//                     <th
//                       className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('academic_name')}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>Academic Name</span>
//                         {getSortIcon('academic_name')}
//                       </div>
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Banner Image
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Color Code
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Redirect URL
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {banners.length > 0 ? (
//                     banners.map((banner, index) => (
//                       <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <Checkbox
//                             checked={selectedBanners.includes(banner.id)}
//                             onChange={() => handleSelectBanner(banner.id)}
//                           />
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           <Tooltip
//                             content={banner.academic_name}
//                             placement="top"
//                             style="light"
//                             animation="duration-300"
//                           >
//                             <span className="truncate max-w-[200px] block">
//                               {banner.academic_name.length > 35
//                                 ? `${banner.academic_name.substring(0, 35)}...`
//                                 : banner.academic_name}
//                             </span>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           {banner.banner_image ? (
//                             <Tooltip content="View Banner" placement="top">
//                               <div className="relative group">
//                                 <img
//                                   src={getImageUrl(banner.banner_image)}
//                                   alt="Banner"
//                                   className="w-16 h-10 object-cover rounded border border-gray-200 cursor-pointer"
//                                   onClick={() => window.open(getImageUrl(banner.banner_image), '_blank')}
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
//                                   <BsEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                                 </div>
//                               </div>
//                             </Tooltip>
//                           ) : (
//                             <span className="text-gray-400 text-sm">No image</span>
//                           )}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className="w-6 h-6 rounded border border-gray-300"
//                               style={{ backgroundColor: banner.color_code }}
//                               title={banner.color_code}
//                             />
//                             <span className="text-sm text-gray-600 font-mono">{banner.color_code}</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate">
//                           <Tooltip content={banner.redirect_url} placement="top">
//                             <a
//                               href={banner.redirect_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:text-blue-800 hover:underline"
//                             >
//                               {banner.redirect_url.length > 30
//                                 ? `${banner.redirect_url.substring(0, 30)}...`
//                                 : banner.redirect_url}
//                             </a>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <ToggleSwitch
//                               checked={banner.is_active}
//                               onChange={() => handleStatusToggle(banner.id, banner.is_active)}
//                               disabled={toggleLoading === banner.id}
//                             />
//                             <span className={`text-sm font-medium ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                               {banner.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                             {toggleLoading === banner.id && (
//                               <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-center">
//                           <div className="flex items-center justify-center space-x-2">
//                             <Tooltip content="Edit" placement="top">
//                               <button
//                                 onClick={() => handleEditBanner(banner)}
//                                 className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                               >
//                                 <TbEdit className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                             <Tooltip content="Delete" placement="top">
//                               <button
//                                 onClick={() => handleDeleteClick(banner.id)}
//                                 className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                               >
//                                 <MdDeleteForever className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={8} className="py-12 px-6 text-center">
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
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <p className="text-lg font-medium text-gray-600 mb-2">No banners found</p>
//                           <p className="text-sm text-gray-500">
//                             {filters.search || filters.academic_id
//                               ? 'Try adjusting your search criteria'
//                               : 'No banners available'}
//                           </p>
//                           {!filters.search && !filters.academic_id && (
//                             <Button
//                               onClick={handleAddBanner}
//                               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
//                             >
//                               <BsPlusLg className="mr-2 w-4 h-4" />
//                               Add Your First Banner
//                             </Button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {banners.length > 0 && (
//           <div className="mt-6">
//             <Pagination
//               currentPage={filters.page + 1}
//               totalPages={Math.ceil(total / filters.rowsPerPage)}
//               totalItems={total}
//               rowsPerPage={filters.rowsPerPage}
//               onPageChange={handlePageChange}
//               onRowsPerPageChange={handleRowsPerPageChange}
//             />
//           </div>
//         )}

//         {/* Banner Form Modal */}
//         <BannerFormModal
//           isOpen={showFormModal}
//           onClose={() => {
//             setShowFormModal(false);
//             setEditingBanner(null);
//           }}
//           onSuccess={handleFormSuccess}
//           banner={editingBanner}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onConfirm={confirmDelete}
//           title="Delete Banner"
//           message="Are you sure you want to delete this banner? This action cannot be undone."
//           loading={deleteLoading}
//         />

//         {/* Multi Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showMultiDeleteModal}
//           onClose={() => setShowMultiDeleteModal(false)}
//           onConfirm={confirmMultiDelete}
//           title="Delete Selected Banners"
//           message={`Are you sure you want to delete ${selectedBanners.length} selected banner(s)? This action cannot be undone.`}
//           loading={multiDeleteLoading}
//         />
//       </div>
//     </>
//   );
// };

// export default AcademicBannersTable;





// import React, { useState, useEffect, useRef } from 'react';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import { BsPlusLg, BsSearch, BsEye } from 'react-icons/bs';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { Button, Tooltip, Checkbox, ToggleSwitch } from 'flowbite-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Loader from 'src/Frontend/Common/Loader';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { useAuth } from 'src/hook/useAuth';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import AcademicDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
// import BannerFormModal from './components/BannerFormModal';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// interface AcademicBanner {
//   id: number;
//   academic_id: number;
//   academic_name: string;
//   banner_image: string;
//   color_code: string;
//   redirect_url: string;
//   is_active: boolean;
//   created_at: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic_id: string;
// }

// const AcademicBannersTable: React.FC = () => {
//   const { user } = useAuth();
//   const [banners, setBanners] = useState<AcademicBanner[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     academic_id: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
//   const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
//   const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingBanner, setEditingBanner] = useState<AcademicBanner | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [multiDeleteLoading, setMultiDeleteLoading] = useState(false);
//   const [toggleLoading, setToggleLoading] = useState<number | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch banners data
//   const fetchBanners = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         academic_id: filters.academic_id || undefined,
//         page: filters.page + 1,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//         s_id: user?.id,
//       };

//       // Remove undefined parameters
//       Object.keys(params).forEach(key => {
//         if (params[key as keyof typeof params] === undefined) {
//           delete params[key as keyof typeof params];
//         }
//       });

//       const response = await axios.get(
//         `${apiUrl}/${user?.role}/academic-banners/list`,
//         {
//           params,
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             accept: 'application/json, text/plain, */*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//           },
//         },
//       );

//       if (response.data) {
//         setBanners(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching banners:', error);
//       toast.error('Failed to fetch banners');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       search: searchValue,
//       page: 0,
//     }));
//   };

//   // Handle academic filter change
//   const handleAcademicChange = (academicId: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       academic_id: academicId,
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

//   // Handle add new banner
//   const handleAddBanner = () => {
//     setEditingBanner(null);
//     setShowFormModal(true);
//   };

//   // Handle edit banner
//   const handleEditBanner = (banner: AcademicBanner) => {
//     setEditingBanner(banner);
//     setShowFormModal(true);
//   };

//   // Handle form submission success
//   const handleFormSuccess = () => {
//     setShowFormModal(false);
//     setEditingBanner(null);
//     fetchBanners();
//     toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner added successfully!');
//   };

//   // Handle single delete
//   const handleDeleteClick = (id: number) => {
//     setBannerToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (bannerToDelete !== null) {
//       setDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${bannerToDelete}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banner deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banner');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banner:', error);
//         toast.error('Failed to delete banner');
//       } finally {
//         setShowDeleteModal(false);
//         setBannerToDelete(null);
//         setDeleteLoading(false);
//       }
//     }
//   };

//   // Handle multi-select
//   const handleSelectBanner = (id: number) => {
//     setSelectedBanners(prev =>
//       prev.includes(id)
//         ? prev.filter(bannerId => bannerId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedBanners.length === banners.length) {
//       setSelectedBanners([]);
//     } else {
//       setSelectedBanners(banners.map(banner => banner.id));
//     }
//   };

//   // Handle multi delete
//   const handleMultiDeleteClick = () => {
//     if (selectedBanners.length > 0) {
//       setShowMultiDeleteModal(true);
//     } else {
//       toast.error('Please select at least one banner to delete');
//     }
//   };

//   const confirmMultiDelete = async () => {
//     if (selectedBanners.length > 0) {
//       setMultiDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${selectedBanners.join(',')}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banners deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banners');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banners:', error);
//         toast.error('Failed to delete banners');
//       } finally {
//         setShowMultiDeleteModal(false);
//         setMultiDeleteLoading(false);
//       }
//     }
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (id: number, currentStatus: boolean) => {
//     setToggleLoading(id);
//     try {
//       const formData = new FormData();
//       formData.append('id', id.toString());
//       formData.append('is_active', currentStatus ? '0' : '1');
//       formData.append('s_id', user?.id?.toString() || '');

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/academic-banners/update`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data.status === true) {
//         toast.success('Status updated successfully!');
//         fetchBanners();
//       } else {
//         toast.error('Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     } finally {
//       setToggleLoading(null);
//     }
//   };

//   // Get full image URL
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${apiUrl.replace('/public/api', '')}${imagePath}`;
//   };

//   return (
//     <>
//       <div className="mb-6">
//         <BreadcrumbHeader
//           title="Academic Banners"
//           paths={[{ name: 'Academic Banners', link: '#' }]}
//         />
//       </div>

//       <div className="p-4 bg-white rounded-lg shadow-md">
//         {/* Search Bar with Academic Dropdown and Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <BsSearch className="w-4 h-4 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by academic name or redirect URL..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                          bg-white focus:ring-blue-500 focus:border-blue-500 
//                          placeholder-gray-400 transition-all duration-200"
//               />
//             </div>

//             {/* Academic Dropdown */}
//             {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//               <div className="w-full sm:w-64">
//                 {/* <AllAcademicsDropdown
//                 name="academic"
//                 value={dashboardFilters.academic}
//                 onChange={handleAcademicChange}
//                 includeAllOption
//                 label=""
//                 className="min-w-[250px] text-sm"
//               /> */}
//               <AllAcademicsDropdown
//                name="academic"
//                 value={filters.academic_id}
//                 onChange={handleAcademicChange}
//                 includeAllOption
//                 label=""
//                 className="min-w-[250px] text-sm"
//               />
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-2">
//             {selectedBanners.length > 0 && (
//               <Button
//                 onClick={handleMultiDeleteClick}
//                 color="failure"
//                 className="whitespace-nowrap"
//               >
//                 <MdDeleteForever className="mr-2 w-4 h-4" />
//                 Delete Selected ({selectedBanners.length})
//               </Button>
//             )}
//             <Button
//               onClick={handleAddBanner}
//               className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               <BsPlusLg className="mr-2 w-4 h-4" />
//               Add Banner
//             </Button>
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="rounded-lg border border-gray-200 shadow-sm relative">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <Checkbox
//                         checked={selectedBanners.length === banners.length && banners.length > 0}
//                         onChange={handleSelectAll}
//                         disabled={banners.length === 0}
//                       />
//                     </th>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       S.NO
//                     </th>
//                     <th
//                       className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('academic_name')}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>Academic Name</span>
//                         {getSortIcon('academic_name')}
//                       </div>
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Banner Image
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Color Code
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Redirect URL
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {banners.length > 0 ? (
//                     banners.map((banner, index) => (
//                       <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <Checkbox
//                             checked={selectedBanners.includes(banner.id)}
//                             onChange={() => handleSelectBanner(banner.id)}
//                           />
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           <Tooltip
//                             content={banner.academic_name}
//                             placement="top"
//                             style="light"
//                             animation="duration-300"
//                           >
//                             <span className="truncate max-w-[200px] block">
//                               {banner.academic_name}
//                             </span>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           {banner.banner_image ? (
//                             <Tooltip content="View Banner" placement="top">
//                               <div className="relative group">
//                                 <img
//                                   src={getImageUrl(banner.banner_image)}
//                                   alt="Banner"
//                                   className="w-16 h-10 object-cover rounded border border-gray-200 cursor-pointer"
//                                   onClick={() => window.open(getImageUrl(banner.banner_image), '_blank')}
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
//                                   <BsEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                                 </div>
//                               </div>
//                             </Tooltip>
//                           ) : (
//                             <span className="text-gray-400 text-sm">No image</span>
//                           )}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className="w-6 h-6 rounded border border-gray-300"
//                               style={{ backgroundColor: banner.color_code }}
//                               title={banner.color_code}
//                             />
//                             <span className="text-sm text-gray-600 font-mono">{banner.color_code}</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate">
//                           <Tooltip content={banner.redirect_url} placement="top">
//                             <a
//                               href={banner.redirect_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:text-blue-800 hover:underline"
//                             >
//                               {banner.redirect_url}
//                             </a>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <ToggleSwitch
//                               checked={banner.is_active}
//                               onChange={() => handleStatusToggle(banner.id, banner.is_active)}
//                               disabled={toggleLoading === banner.id}
//                             />
//                             <span className={`text-sm font-medium ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                               {banner.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                             {toggleLoading === banner.id && (
//                               <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-center">
//                           <div className="flex items-center justify-center space-x-2">
//                             <Tooltip content="Edit" placement="top">
//                               <button
//                                 onClick={() => handleEditBanner(banner)}
//                                 className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                               >
//                                 <TbEdit className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                             <Tooltip content="Delete" placement="top">
//                               <button
//                                 onClick={() => handleDeleteClick(banner.id)}
//                                 className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                               >
//                                 <MdDeleteForever className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={8} className="py-12 px-6 text-center">
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
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <p className="text-lg font-medium text-gray-600 mb-2">No banners found</p>
//                           <p className="text-sm text-gray-500">
//                             {filters.search || filters.academic_id
//                               ? 'Try adjusting your search criteria'
//                               : 'No banners available'}
//                           </p>
//                           {!filters.search && !filters.academic_id && (
//                             <Button
//                               onClick={handleAddBanner}
//                               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
//                             >
//                               <BsPlusLg className="mr-2 w-4 h-4" />
//                               Add Your First Banner
//                             </Button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {banners.length > 0 && (
//           <div className="mt-6">
//             <Pagination
//               currentPage={filters.page + 1}
//               totalPages={Math.ceil(total / filters.rowsPerPage)}
//               totalItems={total}
//               rowsPerPage={filters.rowsPerPage}
//               onPageChange={handlePageChange}
//               onRowsPerPageChange={handleRowsPerPageChange}
//             />
//           </div>
//         )}

//         {/* Banner Form Modal */}
//         <BannerFormModal
//           isOpen={showFormModal}
//           onClose={() => {
//             setShowFormModal(false);
//             setEditingBanner(null);
//           }}
//           onSuccess={handleFormSuccess}
//           banner={editingBanner}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onConfirm={confirmDelete}
//           title="Delete Banner"
//           message="Are you sure you want to delete this banner? This action cannot be undone."
//           loading={deleteLoading}
//         />

//         {/* Multi Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showMultiDeleteModal}
//           onClose={() => setShowMultiDeleteModal(false)}
//           onConfirm={confirmMultiDelete}
//           title="Delete Selected Banners"
//           message={`Are you sure you want to delete ${selectedBanners.length} selected banner(s)? This action cannot be undone.`}
//           loading={multiDeleteLoading}
//         />
//       </div>
//     </>
//   );
// };

// export default AcademicBannersTable;











// import React, { useState, useEffect, useRef } from 'react';
// import { MdDeleteForever } from 'react-icons/md';
// import { TbEdit } from "react-icons/tb";
// import { BsPlusLg, BsSearch, BsEye } from 'react-icons/bs';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { Button, Tooltip, Checkbox, ToggleSwitch } from 'flowbite-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Loader from 'src/Frontend/Common/Loader';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import { useAuth } from 'src/hook/useAuth';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import AcademicDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
// import BannerFormModal from './components/BannerFormModal';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// interface AcademicBanner {
//   id: number;
//   academic_id: number;
//   academic_name: string;
//   banner_image: string;
//   color_code: string;
//   redirect_url: string;
//   is_active: boolean;
//   created_at: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic_id: string;
// }

// const AcademicBannersTable: React.FC = () => {
//   const { user } = useAuth();
//   const [banners, setBanners] = useState<AcademicBanner[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     academic_id: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
//   const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
//   const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingBanner, setEditingBanner] = useState<AcademicBanner | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [deleteLoading, setDeleteLoading] = useState(false);
//   const [multiDeleteLoading, setMultiDeleteLoading] = useState(false);
//   const [toggleLoading, setToggleLoading] = useState<number | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch banners data
//   const fetchBanners = async () => {
//     setLoading(true);
//     try {
//       const params = {
//         academic_id: filters.academic_id || undefined,
//         page: filters.page + 1,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//         s_id: user?.id,
//       };

//       // Remove undefined parameters
//       Object.keys(params).forEach(key => {
//         if (params[key as keyof typeof params] === undefined) {
//           delete params[key as keyof typeof params];
//         }
//       });

//       const response = await axios.get(
//         `${apiUrl}/${user?.role}/academic-banners/list`,
//         {
//           params,
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             accept: 'application/json, text/plain, */*',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//           },
//         },
//       );

//       if (response.data) {
//         setBanners(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching banners:', error);
//       toast.error('Failed to fetch banners');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       search: searchValue,
//       page: 0,
//     }));
//   };

//   // Handle academic filter change
//   const handleAcademicChange = (academicId: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       academic_id: academicId,
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

//   // Handle add new banner
//   const handleAddBanner = () => {
//     setEditingBanner(null);
//     setShowFormModal(true);
//   };

//   // Handle edit banner
//   const handleEditBanner = (banner: AcademicBanner) => {
//     setEditingBanner(banner);
//     setShowFormModal(true);
//   };

//   // Handle form submission success
//   const handleFormSuccess = () => {
//     setShowFormModal(false);
//     setEditingBanner(null);
//     fetchBanners();
//     toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner added successfully!');
//   };

//   // Handle single delete
//   const handleDeleteClick = (id: number) => {
//     setBannerToDelete(id);
//     setShowDeleteModal(true);
//   };

//   const confirmDelete = async () => {
//     if (bannerToDelete !== null) {
//       setDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${bannerToDelete}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banner deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banner');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banner:', error);
//         toast.error('Failed to delete banner');
//       } finally {
//         setShowDeleteModal(false);
//         setBannerToDelete(null);
//         setDeleteLoading(false);
//       }
//     }
//   };

//   // Handle multi-select
//   const handleSelectBanner = (id: number) => {
//     setSelectedBanners(prev =>
//       prev.includes(id)
//         ? prev.filter(bannerId => bannerId !== id)
//         : [...prev, id]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedBanners.length === banners.length) {
//       setSelectedBanners([]);
//     } else {
//       setSelectedBanners(banners.map(banner => banner.id));
//     }
//   };

//   // Handle multi delete
//   const handleMultiDeleteClick = () => {
//     if (selectedBanners.length > 0) {
//       setShowMultiDeleteModal(true);
//     } else {
//       toast.error('Please select at least one banner to delete');
//     }
//   };

//   const confirmMultiDelete = async () => {
//     if (selectedBanners.length > 0) {
//       setMultiDeleteLoading(true);
//       try {
//         const formData = new FormData();
//         formData.append('ids', `[${selectedBanners.join(',')}]`);
//         formData.append('s_id', user?.id?.toString() || '');

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
//           formData,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'multipart/form-data',
//             },
//           },
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Banners deleted successfully!');
//           fetchBanners();
//           setSelectedBanners([]);
//         } else {
//           console.error('Delete failed:', response.data.message);
//           toast.error(response.data.message || 'Failed to delete banners');
//         }
//       } catch (error: any) {
//         console.error('Error deleting banners:', error);
//         toast.error('Failed to delete banners');
//       } finally {
//         setShowMultiDeleteModal(false);
//         setMultiDeleteLoading(false);
//       }
//     }
//   };

//   // Handle status toggle
//   const handleStatusToggle = async (id: number, currentStatus: boolean) => {
//     setToggleLoading(id);
//     try {
//       const formData = new FormData();
//       formData.append('id', id.toString());
//       formData.append('is_active', currentStatus ? '0' : '1');
//       formData.append('s_id', user?.id?.toString() || '');

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/academic-banners/update`,
//         formData,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data.status === true) {
//         toast.success('Status updated successfully!');
//         fetchBanners();
//       } else {
//         toast.error('Failed to update status');
//       }
//     } catch (error) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     } finally {
//       setToggleLoading(null);
//     }
//   };

//   // Get full image URL
//   const getImageUrl = (imagePath: string) => {
//     if (!imagePath) return '';
//     if (imagePath.startsWith('http')) return imagePath;
//     return `${apiUrl.replace('/public/api', '')}${imagePath}`;
//   };

//   return (
//     <>
//       <div className="mb-6">
//         <BreadcrumbHeader
//           title="Academic Banners"
//           paths={[{ name: 'Academic Banners', link: '#' }]}
//         />
//       </div>

//       <div className="p-4 bg-white rounded-lg shadow-md">
//         {/* Search Bar with Academic Dropdown and Add Button */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80">
//               <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//                 <BsSearch className="w-4 h-4 text-gray-500" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search by academic name or redirect URL..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                          bg-white focus:ring-blue-500 focus:border-blue-500 
//                          placeholder-gray-400 transition-all duration-200"
//               />
//             </div>

//             {/* Academic Dropdown */}
//             {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//               <div className="w-full sm:w-64">
//                 {/* <AllAcademicsDropdown
//                 name="academic"
//                 value={dashboardFilters.academic}
//                 onChange={handleAcademicChange}
//                 includeAllOption
//                 label=""
//                 className="min-w-[250px] text-sm"
//               /> */}
//               <AllAcademicsDropdown
//                name="academic"
//                 value={filters.academic_id}
//                 onChange={handleAcademicChange}
//                 includeAllOption
//                 label=""
//                 className="min-w-[250px] text-sm"
//               />
//               </div>
//             )}
//           </div>

//           {/* Action Buttons */}
//           <div className="flex flex-col sm:flex-row gap-2">
//             {selectedBanners.length > 0 && (
//               <Button
//                 onClick={handleMultiDeleteClick}
//                 color="failure"
//                 className="whitespace-nowrap"
//               >
//                 <MdDeleteForever className="mr-2 w-4 h-4" />
//                 Delete Selected ({selectedBanners.length})
//               </Button>
//             )}
//             <Button
//               onClick={handleAddBanner}
//               className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
//             >
//               <BsPlusLg className="mr-2 w-4 h-4" />
//               Add Banner
//             </Button>
//           </div>
//         </div>

//         {/* Table */}
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="rounded-lg border border-gray-200 shadow-sm relative">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       <Checkbox
//                         checked={selectedBanners.length === banners.length && banners.length > 0}
//                         onChange={handleSelectAll}
//                         disabled={banners.length === 0}
//                       />
//                     </th>
//                     <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       S.NO
//                     </th>
//                     <th
//                       className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                       onClick={() => handleSort('academic_name')}
//                     >
//                       <div className="flex items-center space-x-1">
//                         <span>Academic Name</span>
//                         {getSortIcon('academic_name')}
//                       </div>
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Banner Image
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Color Code
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Redirect URL
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {banners.length > 0 ? (
//                     banners.map((banner, index) => (
//                       <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <Checkbox
//                             checked={selectedBanners.includes(banner.id)}
//                             onChange={() => handleSelectBanner(banner.id)}
//                           />
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           <Tooltip
//                             content={banner.academic_name}
//                             placement="top"
//                             style="light"
//                             animation="duration-300"
//                           >
//                             <span className="truncate max-w-[200px] block">
//                               {banner.academic_name}
//                             </span>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           {banner.banner_image ? (
//                             <Tooltip content="View Banner" placement="top">
//                               <div className="relative group">
//                                 <img
//                                   src={getImageUrl(banner.banner_image)}
//                                   alt="Banner"
//                                   className="w-16 h-10 object-cover rounded border border-gray-200 cursor-pointer"
//                                   onClick={() => window.open(getImageUrl(banner.banner_image), '_blank')}
//                                 />
//                                 <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded flex items-center justify-center">
//                                   <BsEye className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
//                                 </div>
//                               </div>
//                             </Tooltip>
//                           ) : (
//                             <span className="text-gray-400 text-sm">No image</span>
//                           )}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <div
//                               className="w-6 h-6 rounded border border-gray-300"
//                               style={{ backgroundColor: banner.color_code }}
//                               title={banner.color_code}
//                             />
//                             <span className="text-sm text-gray-600 font-mono">{banner.color_code}</span>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate">
//                           <Tooltip content={banner.redirect_url} placement="top">
//                             <a
//                               href={banner.redirect_url}
//                               target="_blank"
//                               rel="noopener noreferrer"
//                               className="text-blue-600 hover:text-blue-800 hover:underline"
//                             >
//                               {banner.redirect_url}
//                             </a>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <ToggleSwitch
//                               checked={banner.is_active}
//                               onChange={() => handleStatusToggle(banner.id, banner.is_active)}
//                               disabled={toggleLoading === banner.id}
//                             />
//                             <span className={`text-sm font-medium ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
//                               {banner.is_active ? 'Active' : 'Inactive'}
//                             </span>
//                             {toggleLoading === banner.id && (
//                               <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
//                             )}
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-center">
//                           <div className="flex items-center justify-center space-x-2">
//                             <Tooltip content="Edit" placement="top">
//                               <button
//                                 onClick={() => handleEditBanner(banner)}
//                                 className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
//                               >
//                                 <TbEdit className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                             <Tooltip content="Delete" placement="top">
//                               <button
//                                 onClick={() => handleDeleteClick(banner.id)}
//                                 className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
//                               >
//                                 <MdDeleteForever className="w-5 h-5" />
//                               </button>
//                             </Tooltip>
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={8} className="py-12 px-6 text-center">
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
//                               d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
//                             />
//                           </svg>
//                           <p className="text-lg font-medium text-gray-600 mb-2">No banners found</p>
//                           <p className="text-sm text-gray-500">
//                             {filters.search || filters.academic_id
//                               ? 'Try adjusting your search criteria'
//                               : 'No banners available'}
//                           </p>
//                           {!filters.search && !filters.academic_id && (
//                             <Button
//                               onClick={handleAddBanner}
//                               className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
//                             >
//                               <BsPlusLg className="mr-2 w-4 h-4" />
//                               Add Your First Banner
//                             </Button>
//                           )}
//                         </div>
//                       </td>
//                     </tr>
//                   )}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* Pagination */}
//         {banners.length > 0 && (
//           <div className="mt-6">
//             <Pagination
//               currentPage={filters.page + 1}
//               totalPages={Math.ceil(total / filters.rowsPerPage)}
//               totalItems={total}
//               rowsPerPage={filters.rowsPerPage}
//               onPageChange={handlePageChange}
//               onRowsPerPageChange={handleRowsPerPageChange}
//             />
//           </div>
//         )}

//         {/* Banner Form Modal */}
//         <BannerFormModal
//           isOpen={showFormModal}
//           onClose={() => {
//             setShowFormModal(false);
//             setEditingBanner(null);
//           }}
//           onSuccess={handleFormSuccess}
//           banner={editingBanner}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onConfirm={confirmDelete}
//           title="Delete Banner"
//           message="Are you sure you want to delete this banner? This action cannot be undone."
//           loading={deleteLoading}
//         />

//         {/* Multi Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showMultiDeleteModal}
//           onClose={() => setShowMultiDeleteModal(false)}
//           onConfirm={confirmMultiDelete}
//           title="Delete Selected Banners"
//           message={`Are you sure you want to delete ${selectedBanners.length} selected banner(s)? This action cannot be undone.`}
//           loading={multiDeleteLoading}
//         />
//       </div>
//     </>
//   );
// };

// export default AcademicBannersTable;    











import React, { useState, useEffect } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { BsPlusLg, BsSearch, BsEye } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, Checkbox, ToggleSwitch } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import BannerFormModal from './components/BannerFormModal';

interface AcademicBanner {
  id: number;
  academic_id: number;
  academic_name: string;
  banner_image: string;
  color_code: string;
  redirect_url: string;
  is_active: boolean;
  created_at: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

const AcademicBannersTable: React.FC = () => {
  const { user } = useAuth();
  const [banners, setBanners] = useState<AcademicBanner[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic_id: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<number | null>(null);
  const [showMultiDeleteModal, setShowMultiDeleteModal] = useState(false);
  const [selectedBanners, setSelectedBanners] = useState<number[]>([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<AcademicBanner | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [multiDeleteLoading, setMultiDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch banners data
  const fetchBanners = async () => {
    setLoading(true);
    try {
      const params = {
        academic_id: filters.academic_id || undefined,
        page: filters.page + 1,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
        s_id: user?.id,
      };

      // Remove undefined parameters
      Object.keys(params).forEach(key => {
        if (params[key as keyof typeof params] === undefined) {
          delete params[key as keyof typeof params];
        }
      });

      const response = await axios.get(
        `${apiUrl}/${user?.role}/academic-banners/list`,
        {
          params,
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: 'application/json, text/plain, */*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          },
        },
      );

      if (response.data) {
        setBanners(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching banners:', error);
      toast.error('Failed to fetch banners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle academic filter change
  const handleAcademicChange = (academicId: string) => {
    setFilters((prev) => ({
      ...prev,
      academic_id: academicId,
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

  // Handle add new banner
  const handleAddBanner = () => {
    setEditingBanner(null);
    setShowFormModal(true);
  };

  // Handle edit banner
  const handleEditBanner = (banner: AcademicBanner) => {
    setEditingBanner(banner);
    setShowFormModal(true);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingBanner(null);
    fetchBanners();
    toast.success(editingBanner ? 'Banner updated successfully!' : 'Banner added successfully!');
  };

  // Handle single delete
  const handleDeleteClick = (id: number) => {
    setBannerToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (bannerToDelete !== null) {
      setDeleteLoading(true);
      try {
        const formData = new FormData();
        formData.append('ids', `[${bannerToDelete}]`);
        formData.append('s_id', user?.id?.toString() || '');

        const response = await axios.post(
          `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Banner deleted successfully!');
          fetchBanners();
          setSelectedBanners([]);
        } else {
          console.error('Delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete banner');
        }
      } catch (error: any) {
        console.error('Error deleting banner:', error);
        toast.error('Failed to delete banner');
      } finally {
        setShowDeleteModal(false);
        setBannerToDelete(null);
        setDeleteLoading(false);
      }
    }
  };

  // Handle multi-select
  const handleSelectBanner = (id: number) => {
    setSelectedBanners(prev =>
      prev.includes(id)
        ? prev.filter(bannerId => bannerId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedBanners.length === banners.length) {
      setSelectedBanners([]);
    } else {
      setSelectedBanners(banners.map(banner => banner.id));
    }
  };

  // Handle multi delete
  const handleMultiDeleteClick = () => {
    if (selectedBanners.length > 0) {
      setShowMultiDeleteModal(true);
    } else {
      toast.error('Please select at least one banner to delete');
    }
  };

  const confirmMultiDelete = async () => {
    if (selectedBanners.length > 0) {
      setMultiDeleteLoading(true);
      try {
        const formData = new FormData();
        formData.append('ids', `[${selectedBanners.join(',')}]`);
        formData.append('s_id', user?.id?.toString() || '');

        const response = await axios.post(
          `${apiUrl}/${user?.role}/academic-banners/delete-multiple`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Banners deleted successfully!');
          fetchBanners();
          setSelectedBanners([]);
        } else {
          console.error('Delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete banners');
        }
      } catch (error: any) {
        console.error('Error deleting banners:', error);
        toast.error('Failed to delete banners');
      } finally {
        setShowMultiDeleteModal(false);
        setMultiDeleteLoading(false);
      }
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id: number, currentStatus: boolean,academic_id) => {
    setToggleLoading(id);
    try {
      // alert(academic_id);return false;
      const formData = new FormData();
      formData.append('id', id.toString());
      formData.append('academic_id', academic_id);
      formData.append('is_active', currentStatus ? '0' : '1');
      formData.append('s_id', user?.id?.toString() || '');

      const response = await axios.post(
        `${apiUrl}/${user?.role}/academic-banners/update`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.status === true) {
        toast.success('Status updated successfully!');
        fetchBanners();
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setToggleLoading(null);
    }
  };

  // Get full image URL - FIXED VERSION
  const getImageUrl = (imagePath: string) => {
    if (!imagePath) return '';
    
    // If imagePath is already a full URL, return it as is
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If imagePath is a relative path starting with '/'
    if (imagePath.startsWith('/')) {
      return `${apiAssetsUrl}${imagePath}`;
    }
    
    // If imagePath is a relative path without starting '/'
    // Assuming the image is stored in academic_banners directory
    return `${apiAssetsUrl}/${imagePath}`;
  };

  return (
    <>
      <div className="mb-6">
        <BreadcrumbHeader
          title="Academic Banners"
          paths={[{ name: 'Academic Banners', link: '#' }]}
        />
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar with Academic Dropdown and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by academic name or redirect URL..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                         bg-white focus:ring-blue-500 focus:border-blue-500 
                         placeholder-gray-400 transition-all duration-200"
              />
            </div>

            {/* Academic Dropdown */}
            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
              <div className="w-full sm:w-64">
                <AllAcademicsDropdown
                  name="academic"
                  value={filters.academic_id}
                  onChange={handleAcademicChange}
                  includeAllOption
                  label=""
                  className="min-w-[250px] text-sm"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2">
            {selectedBanners.length > 0 && (
              <Button
                onClick={handleMultiDeleteClick}
                color="failure"
                className="whitespace-nowrap"
              >
                <MdDeleteForever className="mr-2 w-4 h-4" />
                Delete Selected ({selectedBanners.length})
              </Button>
            )}
            <Button
              onClick={handleAddBanner}
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BsPlusLg className="mr-2 w-4 h-4" />
              Add Banner
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-lg border border-gray-200 shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      <Checkbox
                        checked={selectedBanners.length === banners.length && banners.length > 0}
                        onChange={handleSelectAll}
                        disabled={banners.length === 0}
                      />
                    </th>
                    <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S.NO
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('academic_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Academic Name</span>
                        {getSortIcon('academic_name')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Banner Image
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Color Code
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Redirect URL
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {banners.length > 0 ? (
                    banners.map((banner, index) => (
                      <tr key={banner.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Checkbox
                            checked={selectedBanners.includes(banner.id)}
                            onChange={() => handleSelectBanner(banner.id)}
                          />
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          <Tooltip
                            content={banner.academic_name}
                            placement="top"
                            style="light"
                            animation="duration-300"
                          >
                            <span className="truncate max-w-[200px] block">
                              {banner.academic_name}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {banner.banner_image ? (
                            <Tooltip content="View Banner" placement="top">
                              <div className="relative group">
                                <img
                                  src={getImageUrl(banner.banner_image)}
                                  alt="Banner"
                                  className="w-16 h-10 object-cover rounded border border-gray-200 cursor-pointer"
                                  onClick={() => window.open(getImageUrl(banner.banner_image), '_blank')}
                                />
                               
                              </div>
                            </Tooltip>
                          ) : (
                            <span className="text-gray-400 text-sm">No image</span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div
                              className="w-6 h-6 rounded border border-gray-300"
                              style={{ backgroundColor: banner.color_code }}
                              title={banner.color_code}
                            />
                            <span className="text-sm text-gray-600 font-mono">{banner.color_code}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate">
                          <Tooltip content={banner.redirect_url} placement="top">
                            <a
                              href={banner.redirect_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {banner.redirect_url}
                            </a>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <ToggleSwitch
                              checked={banner.is_active}
                              onChange={() => handleStatusToggle(banner.id, banner.is_active,banner.academic_id)}
                              disabled={toggleLoading === banner.id}
                            />
                            <span className={`text-sm font-medium ${banner.is_active ? 'text-green-600' : 'text-red-600'}`}>
                              {banner.is_active ? 'Active' : 'Inactive'}
                            </span>
                            {toggleLoading === banner.id && (
                              <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Tooltip content="Edit" placement="top">
                              <button
                                onClick={() => handleEditBanner(banner)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <TbEdit className="w-5 h-5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete" placement="top">
                              <button
                                onClick={() => handleDeleteClick(banner.id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <MdDeleteForever className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 px-6 text-center">
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
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-lg font-medium text-gray-600 mb-2">No banners found</p>
                          <p className="text-sm text-gray-500">
                            {filters.search || filters.academic_id
                              ? 'Try adjusting your search criteria'
                              : 'No banners available'}
                          </p>
                          {!filters.search && !filters.academic_id && (
                            <Button
                              onClick={handleAddBanner}
                              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <BsPlusLg className="mr-2 w-4 h-4" />
                              Add Your First Banner
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {banners.length > 0 && (
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

        {/* Banner Form Modal */}
        <BannerFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setEditingBanner(null);
          }}
          onSuccess={handleFormSuccess}
          banner={editingBanner}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Banner"
          message="Are you sure you want to delete this banner? This action cannot be undone."
          loading={deleteLoading}
        />

        {/* Multi Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showMultiDeleteModal}
          onClose={() => setShowMultiDeleteModal(false)}
          onConfirm={confirmMultiDelete}
          title="Delete Selected Banners"
          message={`Are you sure you want to delete ${selectedBanners.length} selected banner(s)? This action cannot be undone.`}
          loading={multiDeleteLoading}
        />
      </div>
    </>
  );
};

export default AcademicBannersTable;