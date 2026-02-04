// // import React, { useState, useEffect, useRef } from 'react';
// // import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
// // import { BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
// // import { Button, Tooltip, Badge } from 'flowbite-react';
// // import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// // import axios from 'axios';
// // import Loader from 'src/Frontend/Common/Loader';
// // import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// // import { useDebounce } from 'src/hook/useDebounce';
// // import { useAuth } from 'src/hook/useAuth';
// // import { Pagination } from 'src/Frontend/Common/Pagination';
// // import toast from 'react-hot-toast';
// // import { createPortal } from 'react-dom';
// // import SchoolDropdown from 'src/Frontend/Common/SchoolDropdown';
// // import ContentForm from './ContentForm';


// // interface Content {
// //   id: number;
// //   academic_id: string;
// //   page_name: string;
// //   page_route: string;
// //   html_content: string;
// //   created_at: string;
// //   academic_name: string;
// // }

// // interface Filters {
// //   page: number;
// //   rowsPerPage: number;
// //   order: 'asc' | 'desc';
// //   orderBy: string;
// //   search: string;
// //   academic_id: string;
// // }

// // interface FormData {
// //   academic_id: string;
// // }

// // const ContentTable: React.FC = () => {
// //   const { user } = useAuth();
// //   const [contents, setContents] = useState<Content[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [filters, setFilters] = useState<Filters>({
// //     page: 0,
// //     rowsPerPage: 10,
// //     order: 'desc',
// //     orderBy: 'id',
// //     search: '',
// //     academic_id: '',
// //   });
// //   const [formData, setFormData] = useState<FormData>({
// //     academic_id: '',
// //   });
// //   const [total, setTotal] = useState(0);
// //   const [showDeleteModal, setShowDeleteModal] = useState(false);
// //   const [contentToDelete, setContentToDelete] = useState<number | null>(null);
// //   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
// //   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
// //   const [showFormModal, setShowFormModal] = useState(false);
// //   const [editingContent, setEditingContent] = useState<Content | null>(null);
// //   const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
// //   const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
// //     top: 0,
// //     left: 0,
// //   });
// //   const [deleteLoading, setDeleteLoading] = useState(false);

// //   const apiUrl = import.meta.env.VITE_API_URL;

// //   const debouncedSearch = useDebounce(filters.search, 500);

// //   // Close dropdown when clicking outside
// //   useEffect(() => {
// //     const handleClickOutside = (event: MouseEvent) => {
// //       let clickedOutside = true;

// //       Object.values(dropdownRefs.current).forEach((ref) => {
// //         if (ref && ref.contains(event.target as Node)) {
// //           clickedOutside = false;
// //         }
// //       });

// //       if (clickedOutside) {
// //         setActiveDropdown(null);
// //       }
// //     };

// //     document.addEventListener('mousedown', handleClickOutside);
// //     return () => {
// //       document.removeEventListener('mousedown', handleClickOutside);
// //     };
// //   }, []);

// //   // Fetch contents data
// //   const fetchContents = async () => {
// //     setLoading(true);
// //     try {
// //       const payload = {
// //         academic_id: filters.academic_id ? parseInt(filters.academic_id) : undefined,
// //         page: filters.page,
// //         rowsPerPage: filters.rowsPerPage,
// //         order: filters.order,
// //         orderBy: filters.orderBy,
// //         search: filters.search,
// //         type: 1,
// //       };

// //       const response = await axios.post(
// //         `${apiUrl}/${user?.role}/SchoolManagement/Content/list-Content`,
// //         payload,
// //         {
// //           headers: {
// //             Authorization: `Bearer ${user?.token}`,
// //             accept: '/',
// //             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );

// //       if (response.data) {
// //         setContents(response.data.data || []);
// //         setTotal(response.data.total || 0);
// //       }
// //     } catch (error) {
// //       console.error('Error fetching contents:', error);
// //       toast.error('Failed to load contents');
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchContents();
// //   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

// //   // Handle search
// //   const handleSearch = (searchValue: string) => {
// //     setFilters((prev) => ({
// //       ...prev,
// //       search: searchValue,
// //       page: 0,
// //     }));
// //   };

// //   // Handle academic change
// //   const handleAcademicChange = (academicId: string) => {
// //     setFilters((prev) => ({
// //       ...prev,
// //       academic_id: academicId,
// //       page: 0,
// //     }));
// //     setFormData((prev) => ({
// //       ...prev,
// //       academic_id: academicId,
// //     }));
// //   };

// //   // Handle sort
// //   const handleSort = (key: string) => {
// //     const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
// //     setSort({ key, direction });
// //     setFilters((prev) => ({
// //       ...prev,
// //       order: direction,
// //       orderBy: key,
// //       page: 0,
// //     }));
// //   };

// //   const getSortIcon = (key: string) => {
// //     if (sort.key !== key) {
// //       return <FaSort className="text-gray-400" />;
// //     }
// //     if (sort.direction === 'asc') {
// //       return <FaSortUp className="text-gray-600" />;
// //     }
// //     return <FaSortDown className="text-gray-600" />;
// //   };

// //   // Handle page change
// //   const handlePageChange = (page: number) => {
// //     setFilters((prev) => ({ ...prev, page: page - 1 }));
// //   };

// //   // Handle rows per page change
// //   const handleRowsPerPageChange = (rowsPerPage: number) => {
// //     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
// //   };

// //   // Handle add new content
// //   const handleAddContent = () => {
// //     setEditingContent(null);
// //     setShowFormModal(true);
// //   };

// //   // Handle edit content
// //   const handleEdit = (content: Content) => {
// //     setEditingContent(content);
// //     setShowFormModal(true);
// //     setActiveDropdown(null);
// //   };

// //   // Handle view content
// //   const handleView = (content: Content) => {
// //     // You can implement a view modal here if needed
// //     console.log('View content:', content);
// //     setActiveDropdown(null);
// //   };

// //   // Handle delete
// //   const handleDeleteClick = (id: number) => {
// //     setContentToDelete(id);
// //     setShowDeleteModal(true);
// //     setActiveDropdown(null);
// //   };

// //   const confirmDelete = async () => {
// //     if (contentToDelete !== null) {
// //       setDeleteLoading(true);
// //       try {
// //         const response = await axios.post(
// //           `${apiUrl}/${user?.role}/SchoolManagement/Content/delete-Content`,
// //           {
// //             ids: [contentToDelete],
// //             s_id: user?.id,
// //           },
// //           {
// //             headers: {
// //               Authorization: `Bearer ${user?.token}`,
// //               'Content-Type': 'application/json',
// //             },
// //           }
// //         );

// //         if (response.data.status === true) {
// //           toast.success(response.data.message || 'Content deleted successfully!');
// //           fetchContents();
// //         } else {
// //           toast.error(response.data.message || 'Failed to delete content');
// //         }
// //       } catch (error: any) {
// //         console.error('Error deleting content:', error);
// //         toast.error('Failed to delete content');
// //       } finally {
// //         setShowDeleteModal(false);
// //         setContentToDelete(null);
// //         setDeleteLoading(false);
// //       }
// //     }
// //   };

// //   // Handle form success
// //   const handleFormSuccess = () => {
// //     setShowFormModal(false);
// //     setEditingContent(null);
// //     fetchContents();
// //   };

// //   // Toggle dropdown
// //   const toggleDropdown = (contentId: number, event: React.MouseEvent) => {
// //     event.stopPropagation();

// //     if (activeDropdown === contentId) {
// //       setActiveDropdown(null);
// //     } else {
// //       const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
// //       const dropdownWidth = 192;
// //       const padding = 8;
// //       let left = rect.left + window.scrollX;

// //       if (left + dropdownWidth + padding > window.innerWidth) {
// //         left = rect.right - dropdownWidth + window.scrollX;
// //       }

// //       setDropdownPosition({ top: rect.bottom + window.scrollY, left });
// //       setActiveDropdown(contentId);
// //     }
// //   };

// //   // Set dropdown ref for each row
// //   const setDropdownRef = (contentId: number, el: HTMLDivElement | null) => {
// //     dropdownRefs.current[contentId] = el;
// //   };

// //   // Strip HTML tags for preview
// //   const stripHtml = (html: string) => {
// //     const tmp = document.createElement('DIV');
// //     tmp.innerHTML = html;
// //     return tmp.textContent || tmp.innerText || '';
// //   };

// //   if (loading) {
// //     return <Loader />;
// //   }

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-md">
// //       {/* Search Bar with Filters and Add Button */}
// //       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
// //         <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
// //           {/* Search Input */}
// //           <div className="relative w-full sm:w-80 order-1 sm:order-none">
// //             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
// //               <BsSearch className="w-4 h-4 text-gray-500" />
// //             </div>
// //             <input
// //               type="text"
// //               placeholder="Search by page name..."
// //               value={filters.search}
// //               onChange={(e) => handleSearch(e.target.value)}
// //               className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
// //                          bg-white focus:ring-blue-500 focus:border-blue-500 
// //                          placeholder-gray-400 transition-all duration-200"
// //             />
// //           </div>

// //           {/* School Dropdown */}
// //           <div className="w-full sm:w-64">
// //             <SchoolDropdown
// //               formData={formData}
// //               setFormData={setFormData}
// //               onChange={handleAcademicChange}
// //               includeAllOption
// //             />
// //           </div>
// //         </div>

// //         {/* Add Button */}
// //         <Button
// //           onClick={handleAddContent}
// //           color="primary"
// //           className="whitespace-nowrap w-full lg:w-auto"
// //         >
// //           <BsPlusLg className="mr-2 w-4 h-4" />
// //           Add Content
// //         </Button>
// //       </div>

// //       {/* Custom Table with Flowbite Styling */}
// //       <div className="rounded-lg border border-gray-200 shadow-sm relative">
// //         <div className="overflow-x-auto">
// //           <table className="min-w-full divide-y divide-gray-200">
// //             <thead className="bg-gray-50">
// //               <tr>
// //                 <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                   S.NO
// //                 </th>
// //                 <th
// //                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
// //                   onClick={() => handleSort('academic_name')}
// //                 >
// //                   <div className="flex items-center space-x-1">
// //                     <span>School Name</span>
// //                     {getSortIcon('academic_name')}
// //                   </div>
// //                 </th>
// //                 <th
// //                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
// //                   onClick={() => handleSort('page_name')}
// //                 >
// //                   <div className="flex items-center space-x-1">
// //                     <span>Page Name</span>
// //                     {getSortIcon('page_name')}
// //                   </div>
// //                 </th>
// //                 <th
// //                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
// //                   onClick={() => handleSort('page_route')}
// //                 >
// //                   <div className="flex items-center space-x-1">
// //                     <span>Page Route</span>
// //                     {getSortIcon('page_route')}
// //                   </div>
// //                 </th>
// //                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                   Content Preview
// //                 </th>
// //                 <th
// //                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
// //                   onClick={() => handleSort('created_at')}
// //                 >
// //                   <div className="flex items-center space-x-1">
// //                     <span>Created Date</span>
// //                     {getSortIcon('created_at')}
// //                   </div>
// //                 </th>
// //                 <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
// //                   Actions
// //                 </th>
// //               </tr>
// //             </thead>
// //             <tbody className="bg-white divide-y divide-gray-200">
// //               {contents.length > 0 ? (
// //                 contents.map((content, index) => (
// //                   <tr key={content.id} className="hover:bg-gray-50 transition-colors duration-150">
// //                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                       {filters.page * filters.rowsPerPage + index + 1}
// //                     </td>
// //                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
// //                       <Tooltip
// //                         content={content.academic_name}
// //                         placement="top"
// //                         style="light"
// //                         animation="duration-300"
// //                       >
// //                         <span className="truncate max-w-[180px] block">
// //                           {content.academic_name.length > 25
// //                             ? `${content.academic_name.substring(0, 25)}...`
// //                             : content.academic_name}
// //                         </span>
// //                       </Tooltip>
// //                     </td>
// //                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-700">
// //                       {content.page_name}
// //                     </td>
// //                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
// //                       <Badge color="gray" className="font-mono text-xs">
// //                         {content.page_route}
// //                       </Badge>
// //                     </td>
// //                     <td className="py-4 px-4 text-sm text-gray-600 max-w-[300px]">
// //                       <Tooltip
// //                         content={stripHtml(content.html_content)}
// //                         placement="top"
// //                         style="light"
// //                         animation="duration-300"
// //                       >
// //                         <span className="truncate block">
// //                           {stripHtml(content.html_content).length > 50
// //                             ? `${stripHtml(content.html_content).substring(0, 50)}...`
// //                             : stripHtml(content.html_content)}
// //                         </span>
// //                       </Tooltip>
// //                     </td>
// //                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
// //                       {new Date(content.created_at).toLocaleDateString()}
// //                     </td>
// //                     <td className="py-4 px-4 whitespace-nowrap text-center relative">
// //                       <div
// //                         ref={(el) => setDropdownRef(content.id, el)}
// //                         className="relative flex justify-center"
// //                       >
// //                         <button
// //                           onClick={(e) => toggleDropdown(content.id, e)}
// //                           className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
// //                         >
// //                           <BsThreeDotsVertical className="w-4 h-4" />
// //                         </button>
// //                         {activeDropdown === content.id &&
// //                           createPortal(
// //                             <div
// //                               className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
// //                               style={{
// //                                 top: dropdownPosition.top,
// //                                 left: dropdownPosition.left,
// //                                 position: 'absolute',
// //                               }}
// //                               onMouseDown={(e) => e.stopPropagation()}
// //                             >
// //                               {/* <button
// //                                 onClick={() => handleView(content)}
// //                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
// //                               >
// //                                 <MdVisibility className="w-4 h-4 mr-3" />
// //                                 View
// //                               </button> */}
// //                               <button
// //                                 onClick={() => handleEdit(content)}
// //                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
// //                               >
// //                                 <MdEdit className="w-4 h-4 mr-3" />
// //                                 Edit
// //                               </button>
// //                               <button
// //                                 onClick={() => handleDeleteClick(content.id)}
// //                                 className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
// //                               >
// //                                 <MdDelete className="w-4 h-4 mr-3" />
// //                                 Delete
// //                               </button>
// //                             </div>,
// //                             document.body,
// //                           )}
// //                       </div>
// //                     </td>
// //                   </tr>
// //                 ))
// //               ) : (
// //                 <tr>
// //                   <td colSpan={7} className="py-12 px-6 text-center">
// //                     <div className="flex flex-col items-center justify-center text-gray-500">
// //                       <svg
// //                         className="w-16 h-16 text-gray-300 mb-4"
// //                         fill="none"
// //                         viewBox="0 0 24 24"
// //                         stroke="currentColor"
// //                       >
// //                         <path
// //                           strokeLinecap="round"
// //                           strokeLinejoin="round"
// //                           strokeWidth={1}
// //                           d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
// //                         />
// //                       </svg>
// //                       <p className="text-lg font-medium text-gray-600 mb-2">No contents found</p>
// //                       <p className="text-sm text-gray-500">
// //                         {filters.search || filters.academic_id
// //                           ? 'Try adjusting your search criteria'
// //                           : 'No content records available'}
// //                       </p>
// //                       {!filters.search && !filters.academic_id && (
// //                         <Button
// //                           onClick={handleAddContent}
// //                           gradientDuoTone="cyanToBlue"
// //                           className="mt-4"
// //                         >
// //                           <BsPlusLg className="mr-2 w-4 h-4" />
// //                           Add Your First Content
// //                         </Button>
// //                       )}
// //                     </div>
// //                   </td>
// //                 </tr>
// //               )}
// //             </tbody>
// //           </table>
// //         </div>
// //       </div>

// //       {/* Pagination */}
// //       {contents.length > 0 && (
// //         <div className="mt-6">
// //           <Pagination
// //             currentPage={filters.page + 1}
// //             totalPages={Math.ceil(total / filters.rowsPerPage)}
// //             totalItems={total}
// //             rowsPerPage={filters.rowsPerPage}
// //             onPageChange={handlePageChange}
// //             onRowsPerPageChange={handleRowsPerPageChange}
// //           />
// //         </div>
// //       )}

// //       {/* Delete Confirmation Modal */}
// //       <DeleteConfirmationModal
// //         isOpen={showDeleteModal}
// //         onClose={() => setShowDeleteModal(false)}
// //         onConfirm={confirmDelete}
// //         title="Delete Content"
// //         message="Are you sure you want to delete this content? This action cannot be undone."
// //         loading={deleteLoading}
// //       />

// //       {/* Content Form Modal */}
// //       <ContentForm
// //         isOpen={showFormModal}
// //         onClose={() => {
// //           setShowFormModal(false);
// //           setEditingContent(null);
// //         }}
// //         onSuccess={handleFormSuccess}
// //         editingContent={editingContent}
// //       />
// //     </div>
// //   );
// // };

// // export default ContentTable;




















// import React, { useState, useEffect, useRef } from 'react';
// import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
// import { BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
// import { Button, Tooltip, Badge } from 'flowbite-react';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import toast from 'react-hot-toast';
// import { createPortal } from 'react-dom';
// import SchoolDropdown from 'src/Frontend/Common/SchoolDropdown';
// import ContentForm from './ContentForm';

// interface Content {
//   id: number;
//   academic_id: string;
//   page_name: string;
//   page_route: string;
//   html_content: string;
//   created_at: string;
//   academic_name: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic_id: string;
// }

// interface FormData {
//   academic_id: string;
// }

// const ContentTable: React.FC = () => {
//   const { user } = useAuth();
//   const [contents, setContents] = useState<Content[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     academic_id: '',
//   });
//   const [formData, setFormData] = useState<FormData>({
//     academic_id: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [contentToDelete, setContentToDelete] = useState<number | null>(null);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const [showFormModal, setShowFormModal] = useState(false);
//   const [editingContent, setEditingContent] = useState<Content | null>(null);
//   const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
//   const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   const apiUrl = import.meta.env.VITE_API_URL;

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

//   // Fetch contents data
//   const fetchContents = async () => {
//     setLoading(true);
//     try {
//       const payload = {
//         academic_id: filters.academic_id ? parseInt(filters.academic_id) : undefined,
//         page: filters.page,
//         rowsPerPage: filters.rowsPerPage,
//         order: filters.order,
//         orderBy: filters.orderBy,
//         search: filters.search,
//         type: 1,
//       };

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/SchoolManagement/Content/list-Content`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             accept: '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data) {
//         setContents(response.data.data || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching contents:', error);
//       toast.error('Failed to load contents');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchContents();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       search: searchValue,
//       page: 0,
//     }));
//   };

//   // Handle academic change
//   const handleAcademicChange = (academicId: string) => {
//     setFilters((prev) => ({
//       ...prev,
//       academic_id: academicId,
//       page: 0,
//     }));
//     setFormData((prev) => ({
//       ...prev,
//       academic_id: academicId,
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

//   // Handle add new content
//   const handleAddContent = () => {
//     setEditingContent(null);
//     setShowFormModal(true);
//   };

//   // Handle edit content
//   const handleEdit = (content: Content) => {
//     setEditingContent(content);
//     setShowFormModal(true);
//     setActiveDropdown(null);
//   };

//   // Handle view content
//   const handleView = (content: Content) => {
//     // You can implement a view modal here if needed
//     console.log('View content:', content);
//     setActiveDropdown(null);
//   };

//   // Handle delete
//   const handleDeleteClick = (id: number) => {
//     setContentToDelete(id);
//     setShowDeleteModal(true);
//     setActiveDropdown(null);
//   };

//   const confirmDelete = async () => {
//     if (contentToDelete !== null) {
//       setDeleteLoading(true);
//       try {
//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/SchoolManagement/Content/delete-Content`,
//           {
//             ids: [contentToDelete],
//             s_id: user?.id,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data.status === true) {
//           toast.success(response.data.message || 'Content deleted successfully!');
//           fetchContents();
//         } else {
//           toast.error(response.data.message || 'Failed to delete content');
//         }
//       } catch (error: any) {
//         console.error('Error deleting content:', error);
//         toast.error('Failed to delete content');
//       } finally {
//         setShowDeleteModal(false);
//         setContentToDelete(null);
//         setDeleteLoading(false);
//       }
//     }
//   };

//   // Handle form success
//   const handleFormSuccess = () => {
//     setShowFormModal(false);
//     setEditingContent(null);
//     fetchContents();
//   };

//   // Toggle dropdown
//   const toggleDropdown = (contentId: number, event: React.MouseEvent) => {
//     event.stopPropagation();

//     if (activeDropdown === contentId) {
//       setActiveDropdown(null);
//     } else {
//       const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
//       const dropdownWidth = 192;
//       const padding = 8;
//       let left = rect.left + window.scrollX;

//       if (left + dropdownWidth + padding > window.innerWidth) {
//         left = rect.right - dropdownWidth + window.scrollX;
//       }

//       setDropdownPosition({ top: rect.bottom + window.scrollY, left });
//       setActiveDropdown(contentId);
//     }
//   };

//   // Set dropdown ref for each row
//   const setDropdownRef = (contentId: number, el: HTMLDivElement | null) => {
//     dropdownRefs.current[contentId] = el;
//   };

//   // Strip HTML tags for preview
//   const stripHtml = (html: string) => {
//     const tmp = document.createElement('DIV');
//     tmp.innerHTML = html;
//     return tmp.textContent || tmp.innerText || '';
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-md">
//       {/* Search Bar with Filters and Add Button */}
//       <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//         <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
//           {/* Search Input */}
//           <div className="relative w-full sm:w-80 order-1 sm:order-none">
//             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//               <BsSearch className="w-4 h-4 text-gray-500" />
//             </div>
//             <input
//               type="text"
//               placeholder="Search by page name..."
//               value={filters.search}
//               onChange={(e) => handleSearch(e.target.value)}
//               className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
//                          bg-white focus:ring-blue-500 focus:border-blue-500 
//                          placeholder-gray-400 transition-all duration-200"
//             />
//           </div>

//           {/* School Dropdown */}
//           <div className="w-full sm:w-64">
//             <SchoolDropdown
//               formData={formData}
//               setFormData={setFormData}
//               onChange={handleAcademicChange}
//               includeAllOption
//             />
//           </div>
//         </div>

//         {/* Add Button */}
//         <Button
//           onClick={handleAddContent}
//           color="primary"
//           className="whitespace-nowrap w-full lg:w-auto"
//         >
//           <BsPlusLg className="mr-2 w-4 h-4" />
//           Add Content
//         </Button>
//       </div>

//       {/* Custom Table with Flowbite Styling */}
//       <div className="rounded-lg border border-gray-200 shadow-sm relative">
//         <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   S.NO
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('academic_name')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>School Name</span>
//                     {getSortIcon('academic_name')}
//                   </div>
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('page_name')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>Page Name</span>
//                     {getSortIcon('page_name')}
//                   </div>
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('page_route')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>Page Route</span>
//                     {getSortIcon('page_route')}
//                   </div>
//                 </th>
//                 <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Content Preview
//                 </th>
//                 <th
//                   className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
//                   onClick={() => handleSort('created_at')}
//                 >
//                   <div className="flex items-center space-x-1">
//                     <span>Created Date</span>
//                     {getSortIcon('created_at')}
//                   </div>
//                 </th>
//                 <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {contents.length > 0 ? (
//                 contents.map((content, index) => (
//                   <tr key={content.id} className="hover:bg-gray-50 transition-colors duration-150">
//                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {filters.page * filters.rowsPerPage + index + 1}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
//                       <Tooltip
//                         content={content.academic_name}
//                         placement="top"
//                         style="light"
//                         animation="duration-300"
//                       >
//                         <span className="truncate max-w-[180px] block">
//                           {content.academic_name.length > 25
//                             ? `${content.academic_name.substring(0, 25)}...`
//                             : content.academic_name}
//                         </span>
//                       </Tooltip>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-700">
//                       {content.page_name}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                       <Badge color="gray" className="font-mono text-xs">
//                         {content.page_route}
//                       </Badge>
//                     </td>
//                     <td className="py-4 px-4 text-sm text-gray-600 max-w-[300px]">
//                       <Tooltip
//                         content={stripHtml(content.html_content)}
//                         placement="top"
//                         style="light"
//                         animation="duration-300"
//                       >
//                         <span className="truncate block">
//                           {stripHtml(content.html_content).length > 50
//                             ? `${stripHtml(content.html_content).substring(0, 50)}...`
//                             : stripHtml(content.html_content)}
//                         </span>
//                       </Tooltip>
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                       {new Date(content.created_at).toLocaleDateString()}
//                     </td>
//                     <td className="py-4 px-4 whitespace-nowrap text-center relative">
//                       <div
//                         ref={(el) => setDropdownRef(content.id, el)}
//                         className="relative flex justify-center"
//                       >
//                         <button
//                           onClick={(e) => toggleDropdown(content.id, e)}
//                           className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                         >
//                           <BsThreeDotsVertical className="w-4 h-4" />
//                         </button>
//                         {activeDropdown === content.id &&
//                           createPortal(
//                             <div
//                               className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
//                               style={{
//                                 top: dropdownPosition.top,
//                                 left: dropdownPosition.left,
//                                 position: 'absolute',
//                               }}
//                               onMouseDown={(e) => e.stopPropagation()}
//                             >
//                               <button
//                                 onClick={() => handleEdit(content)}
//                                 className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                               >
//                                 <MdEdit className="w-4 h-4 mr-3" />
//                                 Edit
//                               </button>
//                               <button
//                                 onClick={() => handleDeleteClick(content.id)}
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
//                   <td colSpan={7} className="py-12 px-6 text-center">
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
//                       <p className="text-lg font-medium text-gray-600 mb-2">No contents found</p>
//                       <p className="text-sm text-gray-500">
//                         {filters.search || filters.academic_id
//                           ? 'Try adjusting your search criteria'
//                           : 'No content records available'}
//                       </p>
//                       {!filters.search && !filters.academic_id && (
//                         <Button
//                           onClick={handleAddContent}
//                           gradientDuoTone="cyanToBlue"
//                           className="mt-4"
//                         >
//                           <BsPlusLg className="mr-2 w-4 h-4" />
//                           Add Your First Content
//                         </Button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       {/* Pagination */}
//       {contents.length > 0 && (
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
//         title="Delete Content"
//         message="Are you sure you want to delete this content? This action cannot be undone."
//         loading={deleteLoading}
//       />

//       {/* Content Form Modal */}
//       <ContentForm
//         isOpen={showFormModal}
//         onClose={() => {
//           setShowFormModal(false);
//           setEditingContent(null);
//         }}
//         onSuccess={handleFormSuccess}
//         editingContent={editingContent}
//       />
//     </div>
//   );
// };

// export default ContentTable;























import React, { useState, useEffect, useRef } from 'react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Tooltip, Badge } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import SchoolDropdown from 'src/Frontend/Common/SchoolDropdown';
import ContentForm from './ContentForm';

interface Content {
  id: number;
  academic_id: string;
  page_name: string;
  page_route: string;
  html_content: string;
  created_at: string;
  academic_name: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

interface FormData {
  academic_id: string;
}

const ContentTable: React.FC = () => {
  const { user } = useAuth();
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic_id: '',
  });
  const [formData, setFormData] = useState<FormData>({
    academic_id: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

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

  // Fetch contents data
  const fetchContents = async () => {
    setLoading(true);
    try {
      const payload = {
        s_id: user?.id,
        academic_id: filters.academic_id ? parseInt(filters.academic_id) : undefined,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
        type: 1,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/SchoolManagement/Content/list-Content`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        setContents(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching contents:', error);
      toast.error('Failed to load contents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContents();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle academic change
  const handleAcademicChange = (academicId: string) => {
    setFilters((prev) => ({
      ...prev,
      academic_id: academicId,
      page: 0,
    }));
    setFormData((prev) => ({
      ...prev,
      academic_id: academicId,
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

  // Handle add new content
  const handleAddContent = () => {
    setEditingContent(null);
    setShowFormModal(true);
  };

  // Handle edit content
  const handleEdit = (content: Content) => {
    setEditingContent(content);
    setShowFormModal(true);
    setActiveDropdown(null);
  };

  // Handle view content
  const handleView = (content: Content) => {
    // You can implement a view modal here if needed
    console.log('View content:', content);
    setActiveDropdown(null);
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setContentToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (contentToDelete !== null) {
      setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Content/delete-Content`,
          {
            ids: [contentToDelete],
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Content deleted successfully!');
          fetchContents();
        } else {
          toast.error(response.data.message || 'Failed to delete content');
        }
      } catch (error: any) {
        console.error('Error deleting content:', error);
        toast.error('Failed to delete content');
      } finally {
        setShowDeleteModal(false);
        setContentToDelete(null);
        setDeleteLoading(false);
      }
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingContent(null);
    fetchContents();
  };

  // Toggle dropdown
  const toggleDropdown = (contentId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === contentId) {
      setActiveDropdown(null);
    } else {
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
      const dropdownWidth = 192;
      const padding = 8;
      let left = rect.left + window.scrollX;

      if (left + dropdownWidth + padding > window.innerWidth) {
        left = rect.right - dropdownWidth + window.scrollX;
      }

      setDropdownPosition({ top: rect.bottom + window.scrollY, left });
      setActiveDropdown(contentId);
    }
  };

  // Set dropdown ref for each row
  const setDropdownRef = (contentId: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[contentId] = el;
  };

  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md h-full overflow-y-hidden">
      {/* Search Bar with Filters and Add Button */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
          {/* Search Input */}
          <div className="relative w-full sm:w-80 order-1 sm:order-none">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <BsSearch className="w-4 h-4 text-gray-500" />
            </div>
            <input
              type="text"
              placeholder="Search by page name..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                         bg-white focus:ring-blue-500 focus:border-blue-500 
                         placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* School Dropdown */}
          {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div className="w-full sm:w-64">
            <SchoolDropdown
              formData={formData}
              setFormData={setFormData}
              onChange={handleAcademicChange}
              includeAllOption
            />
          </div> )}
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddContent}
          color="primary"
          className="whitespace-nowrap w-full lg:w-auto"
        >
          <BsPlusLg className="mr-2 w-4 h-4" />
          Add Content
        </Button>
      </div>

      {/* Custom Table with Flowbite Styling */}
      <div className="rounded-lg border border-gray-200 shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  S.NO
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('academic_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>School Name</span>
                    {getSortIcon('academic_name')}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('page_name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Page Name</span>
                    {getSortIcon('page_name')}
                  </div>
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('page_route')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Page Route</span>
                    {getSortIcon('page_route')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Content Preview
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('created_at')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Created Date</span>
                    {getSortIcon('created_at')}
                  </div>
                </th>
                <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contents.length > 0 ? (
                contents.map((content, index) => (
                  <tr key={content.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {filters.page * filters.rowsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                      <Tooltip
                        content={content.academic_name}
                        placement="top"
                        style="light"
                        animation="duration-300"
                      >
                        <span className="truncate max-w-[180px] block">
                          {content.academic_name.length > 25
                            ? `${content.academic_name.substring(0, 25)}...`
                            : content.academic_name}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {content.page_name}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                      <Badge color="gray" className="font-mono text-xs">
                        {content.page_route}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600 max-w-[300px]">
                      <Tooltip
                        content={stripHtml(content.html_content)}
                        placement="top"
                        style="light"
                        animation="duration-300"
                      >
                        <span className="truncate block">
                          {stripHtml(content.html_content).length > 50
                            ? `${stripHtml(content.html_content).substring(0, 50)}...`
                            : stripHtml(content.html_content)}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                      {new Date(content.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center relative">
                      <div
                        ref={(el) => setDropdownRef(content.id, el)}
                        className="relative flex justify-center"
                      >
                        <button
                          onClick={(e) => toggleDropdown(content.id, e)}
                          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <BsThreeDotsVertical className="w-4 h-4" />
                        </button>
                        {activeDropdown === content.id &&
                          createPortal(
                            <div
                              className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                              style={{
                                top: dropdownPosition.top,
                                left: dropdownPosition.left,
                                position: 'absolute',
                              }}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <button
                                onClick={() => handleEdit(content)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                              >
                                <MdEdit className="w-4 h-4 mr-3" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteClick(content.id)}
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
                  <td colSpan={7} className="py-12 px-6 text-center">
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
                      <p className="text-lg font-medium text-gray-600 mb-2">No contents found</p>
                      <p className="text-sm text-gray-500">
                        {filters.search || filters.academic_id
                          ? 'Try adjusting your search criteria'
                          : 'No content records available'}
                      </p>
                      {!filters.search && !filters.academic_id && (
                        <Button
                          onClick={handleAddContent}
                          gradientDuoTone="cyanToBlue"
                          className="mt-4"
                        >
                          <BsPlusLg className="mr-2 w-4 h-4" />
                          Add Your First Content
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

      {/* Pagination */}
      {contents.length > 0 && (
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
        title="Delete Content"
        message="Are you sure you want to delete this content? This action cannot be undone."
        loading={deleteLoading}
      />

      {/* Content Form Modal */}
      <ContentForm
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingContent(null);
        }}
        onSuccess={handleFormSuccess}
        editingContent={editingContent}
      />
    </div>
  );
};

export default ContentTable;