// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router';
// import { MdDeleteForever, MdDownload } from 'react-icons/md';
// import { BsThreeDotsVertical, BsPlusLg, BsSearch, BsCheckLg, BsXLg } from 'react-icons/bs';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import { Button, Tooltip, TextInput, Badge } from 'flowbite-react';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import toast from 'react-hot-toast';
// import { createPortal } from 'react-dom';
// import Select from 'react-select';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
// import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
// import NominalRollForm from './NominalRollForm'; // Make sure this path is correct

// interface NominalRoll {
//   id: number;
//   academic_id: number;
//   degree_name: string;
//   academic_name: string;
//   seriese_id: string;
//   status: number;
//   date: string;
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
//   academic_id: string;
// }

// const NominalRollTable: React.FC = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const [nominalRolls, setNominalRolls] = useState<NominalRoll[]>([]);
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
//   const [nominalToDelete, setNominalToDelete] = useState<number | null>(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
//   const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
//   const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
//   const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
//     top: 0,
//     left: 0,
//   });

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

//   // Fetch nominal rolls data
//   const fetchNominalRolls = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/CollegeManagement/Nominal/list`,
//         {
//           academic_id: filters.academic_id || undefined,
//           page: filters.page,
//           rowsPerPage: filters.rowsPerPage,
//           order: filters.order,
//           orderBy: filters.orderBy,
//           search: filters.search,
//         },
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
//         setNominalRolls(response.data.data || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching nominal rolls:', error);
//       toast.error('Failed to fetch nominal rolls');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNominalRolls();
//   }, [
//     filters.page,
//     filters.rowsPerPage,
//     filters.order,
//     filters.orderBy,
//     debouncedSearch,
//     filters.academic_id,
//   ]);

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

//   // Handle delete
//   const handleDeleteClick = (id: number) => {
//     setNominalToDelete(id);
//     setShowDeleteModal(true);
//     setActiveDropdown(null);
//   };

//   const confirmDelete = async () => {
//     if (nominalToDelete !== null) {
//       try {
//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/CollegeManagement/Nominal/delete`,
//           {
//             ids: [nominalToDelete],
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
//           toast.success(response.data.message || 'Nominal roll deleted successfully!');
//           fetchNominalRolls();
//         } else {
//           toast.error(response.data.message || 'Failed to delete nominal roll');
//         }
//       } catch (error: any) {
//         console.error('Error deleting nominal roll:', error);
//         toast.error('Failed to delete nominal roll');
//       } finally {
//         setShowDeleteModal(false);
//         setNominalToDelete(null);
//       }
//     }
//   };

//   // Handle status change
//   const handleStatusChange = async (id: number, newStatus: number) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/CollegeManagement/Nominal/changes-status`,
//         {
//           id: id,
//           status: newStatus,
//           s_id: user?.id,
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.data.success) {
//         toast.success(response.data.message || 'Status updated successfully!');
//         fetchNominalRolls();
//       } else {
//         toast.error(response.data.message || 'Failed to update status');
//       }
//     } catch (error: any) {
//       console.error('Error updating status:', error);
//       toast.error('Failed to update status');
//     }
//   };

//   // Handle download
//   const handleDownload = (id: number) => {
//     // Implement download functionality
//     toast.success(`Downloading nominal roll ${id}`);
//     setActiveDropdown(null);
//   };

//   // Handle form success
//   const handleFormSuccess = () => {
//     fetchNominalRolls();
//   };

//   // Toggle dropdown
//   const toggleDropdown = (nominalId: number, event: React.MouseEvent) => {
//     event.stopPropagation();

//     if (activeDropdown === nominalId) {
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
//       setActiveDropdown(nominalId);
//     }
//   };

//   // Set dropdown ref for each row
//   const setDropdownRef = (id: number, el: HTMLDivElement | null) => {
//     dropdownRefs.current[id] = el;
//   };

//   return (
//     <>
//       <BreadcrumbHeader title="Nominal Roll" paths={[{ name: 'Nominal Roll', link: '#' }]} />
//       <div className="p-4 bg-white rounded-lg shadow-md">
//         {/* Search Bar with Filters and Add Button */}
//         <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
//             {/* Search Input */}
//             <div className="relative w-full sm:w-80">
//               <TextInput
//                 type="text"
//                 placeholder="Search by academic or degree..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//               />
//             </div>

//             {/* Academic Dropdown */}
//             <div className="w-full sm:w-64">
//               <AcademicDropdown
//                 value={filters.academic_id}
//                 onChange={handleAcademicChange}
//                 placeholder="Select academic..."
//                 includeAllOption={true}
//                 label=""
//               />
//             </div>
//           </div>

//           {/* Add Button */}
//           <Button
//             onClick={() => setShowAddModal(true)}
//             gradientDuoTone="cyanToBlue"
//             className="whitespace-nowrap"
//           >
//             <BsPlusLg className="mr-2 w-4 h-4" />
//             Add Nominal Roll
//           </Button>
//         </div>

//         {/* Custom Table */}
//         {loading ? (
//           <Loader />
//         ) : (
//           <div className="rounded-lg border border-gray-200 shadow-sm">
//             <div className="w-full">
//               <table className="w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
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
//                       Degree Name
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Date
//                     </th>
//                     <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
//                       Actions
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {nominalRolls.length > 0 ? (
//                     nominalRolls.map((nominal, index) => (
//                       <tr
//                         key={nominal.id}
//                         className="hover:bg-gray-50 transition-colors duration-150"
//                       >
//                         <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {filters.page * filters.rowsPerPage + index + 1}
//                         </td>
//                         <td
//                           className="py-4 px-4 whitespace-nowrap text-sm text-gray-900"
//                           style={{ maxWidth: '200px' }}
//                         >
//                           <Tooltip content={nominal.academic_name} placement="top" style="light">
//                             <span className="block truncate">{nominal.academic_name}</span>
//                           </Tooltip>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           {nominal.degree_name}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           <div className="flex items-center space-x-2">
//                             <Tooltip
//                               content={nominal.status === 1 ? 'Approved' : 'Canceled'}
//                               placement="top"
//                             >
//                               <button
//                                 onClick={() =>
//                                   handleStatusChange(
//                                     nominal.id,
//                                     nominal.status === 1 ? 2 : 1,
//                                   )
//                                 }
//                                 className={`p-1 rounded-full ${
//                                   nominal.status === 1
//                                     ? 'text-green-600 hover:bg-green-50'
//                                     : 'text-red-600 hover:bg-red-50'
//                                 } transition-colors`}
//                               >
//                                 {nominal.status === 1 ? (
//                                   <BsCheckLg className="w-4 h-4" />
//                                 ) : (
//                                   <BsXLg className="w-4 h-4" />
//                                 )}
//                               </button>
//                             </Tooltip>
//                             <Badge
//                               color={nominal.status === 1 ? 'success' : 'failure'}
//                               className="text-xs"
//                             >
//                               {nominal.status === 1 ? 'Approved' : 'Canceled'}
//                             </Badge>
//                           </div>
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
//                           {new Date(nominal.date).toLocaleDateString()}
//                         </td>
//                         <td className="py-4 px-4 whitespace-nowrap text-center relative">
//                           <div
//                             ref={(el) => setDropdownRef(nominal.id, el)}
//                             className="relative flex justify-center"
//                           >
//                             <button
//                               onClick={(e) => toggleDropdown(nominal.id, e)}
//                               className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
//                             >
//                               <BsThreeDotsVertical className="w-4 h-4" />
//                             </button>
//                             {activeDropdown === nominal.id &&
//                               createPortal(
//                                 <div
//                                   className="z-[9999] w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
//                                   style={{
//                                     top: dropdownPosition.top,
//                                     left: dropdownPosition.left,
//                                     position: 'absolute',
//                                   }}
//                                   onMouseDown={(e) => e.stopPropagation()}
//                                 >
//                                   <button
//                                     onClick={() => handleDownload(nominal.id)}
//                                     className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
//                                   >
//                                     <MdDownload className="w-4 h-4 mr-3" />
//                                     Download
//                                   </button>

//                                   <div className="border-t border-gray-200 my-1"></div>

//                                   <button
//                                     onClick={() => handleDeleteClick(nominal.id)}
//                                     className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
//                                   >
//                                     <MdDeleteForever className="w-4 h-4 mr-3" />
//                                     Delete
//                                   </button>
//                                 </div>,
//                                 document.body,
//                               )}
//                           </div>
//                         </td>
//                       </tr>
//                     ))
//                   ) : (
//                     <tr>
//                       <td colSpan={6} className="py-12 px-6 text-center">
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
//                           <p className="text-lg font-medium text-gray-600 mb-2">
//                             No nominal rolls found
//                           </p>
//                           <p className="text-sm text-gray-500">
//                             {filters.search || filters.academic_id
//                               ? 'Try adjusting your search criteria'
//                               : 'No nominal rolls available'}
//                           </p>
//                           <Button
//                             onClick={() => setShowAddModal(true)}
//                             color="primary"
//                             className="mt-4"
//                           >
//                             <BsPlusLg className="mr-2 w-4 h-4" />
//                             Add Your First Nominal Roll
//                           </Button>
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
//         {nominalRolls.length > 0 && (
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

//         {/* Add Nominal Roll Form Modal */}
//         <NominalRollForm
//           isOpen={showAddModal}
//           onClose={() => setShowAddModal(false)}
//           onSuccess={handleFormSuccess}
//         />

//         {/* Delete Confirmation Modal */}
//         <DeleteConfirmationModal
//           isOpen={showDeleteModal}
//           onClose={() => setShowDeleteModal(false)}
//           onConfirm={confirmDelete}
//           title="Delete Nominal Roll"
//           message="Are you sure you want to delete this nominal roll? This action cannot be undone."
//         />
//       </div>
//     </>
//   );
// };

// export default NominalRollTable;



















import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { MdDeleteForever, MdDownload } from 'react-icons/md';
import { BsPlusLg, BsSearch, BsCheckLg, BsXLg } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, TextInput, Badge } from 'flowbite-react';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';
import Select from 'react-select';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import NominalRollForm from './NominalRollForm';

interface NominalRoll {
  id: number;
  academic_id: number;
  degree_name: string;
  academic_name: string;
  seriese_id: string;
  status: number;
  date: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

const NominalRollTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nominalRolls, setNominalRolls] = useState<NominalRoll[]>([]);
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
  const [nominalToDelete, setNominalToDelete] = useState<number | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch nominal rolls data
  const fetchNominalRolls = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Nominal/list`,
        {
          academic_id: filters.academic_id || undefined,
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
        },
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
        setNominalRolls(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching nominal rolls:', error);
      toast.error('Failed to fetch nominal rolls');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNominalRolls();
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
    filters.academic_id,
  ]);

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

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setNominalToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (nominalToDelete !== null) {
      setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/CollegeManagement/Nominal/delete`,
          {
            ids: [nominalToDelete],
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
          toast.success(response.data.message || 'Nominal roll deleted successfully!');
          fetchNominalRolls();
        } else {
          toast.error(response.data.message || 'Failed to delete nominal roll');
        }
      } catch (error: any) {
        console.error('Error deleting nominal roll:', error);
        toast.error('Failed to delete nominal roll');
      } finally {
        setShowDeleteModal(false);
        setNominalToDelete(null);
        setDeleteLoading(false);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (id: number, newStatus: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Nominal/changes-status`,
        {
          id: id,
          status: newStatus,
          s_id: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message || 'Status updated successfully!');
        fetchNominalRolls();
      } else {
        toast.error(response.data.message || 'Failed to update status');
      }
    } catch (error: any) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Handle download
  const handleDownload = async (id: number, academicId: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Nominal/nominal-download`,
        {
          academic_id: academicId,
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob', // Important for file download
        },
      );

      // Create a blob from the PDF stream
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename for the download
      link.download = `nominal-roll-${id}.pdf`;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      toast.success('Nominal roll downloaded successfully!');
    } catch (error: any) {
      console.error('Error downloading nominal roll:', error);
      toast.error('Failed to download nominal roll');
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchNominalRolls();
  };

  return (
    <>
      <BreadcrumbHeader title="Nominal Roll" paths={[{ name: 'Nominal Roll', link: '#' }]} />
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar with Filters and Add Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <TextInput
                type="text"
                placeholder="Search by academic or degree..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Academic Dropdown */}
            <div className="w-full sm:w-64">
              <AcademicDropdown
                value={filters.academic_id}
                onChange={handleAcademicChange}
                placeholder="Select academic..."
                includeAllOption={true}
                label=""
              />
            </div>
          </div>

          {/* Add Button */}
          <Button
            onClick={() => setShowAddModal(true)}
            gradientDuoTone="cyanToBlue"
            className="whitespace-nowrap"
          >
            <BsPlusLg className="mr-2 w-4 h-4" />
            Add Nominal Roll
          </Button>
        </div>

        {/* Custom Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-lg border border-gray-200 shadow-sm">
            <div className="w-full">
              <table className="w-full divide-y divide-gray-200">
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
                        <span>Academic Name</span>
                        {getSortIcon('academic_name')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Degree Name
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="w-24 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {nominalRolls.length > 0 ? (
                    nominalRolls.map((nominal, index) => (
                      <tr
                        key={nominal.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td
                          className="py-4 px-4 whitespace-nowrap text-sm text-gray-900"
                          style={{ maxWidth: '200px' }}
                        >
                          <Tooltip content={nominal.academic_name} placement="top" style="light">
                            <span className="block truncate">{nominal.academic_name}</span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {nominal.degree_name}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center">
                            <Tooltip
                              content={nominal.status === 1 ? 'Approved' : 'Canceled'}
                              placement="top"
                            >
                              <button
                                onClick={() =>
                                  handleStatusChange(
                                    nominal.id,
                                    nominal.status === 1 ? 2 : 1,
                                  )
                                }
                                className={`p-2 rounded-full ${
                                  nominal.status === 1
                                    ? 'text-green-600 hover:bg-green-50'
                                    : 'text-red-600 hover:bg-red-50'
                                } transition-colors`}
                              >
                                {nominal.status === 1 ? (
                                  <BsCheckLg className="w-5 h-5" />
                                ) : (
                                  <BsXLg className="w-5 h-5" />
                                )}
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(nominal.date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            {/* Download Button */}
                            <Tooltip content="Download Nominal Roll" placement="top">
                              <button
                                onClick={() => handleDownload(nominal.id, nominal.academic_id)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <MdDownload className="w-5 h-5" />
                              </button>
                            </Tooltip>

                            {/* Delete Button */}
                            <Tooltip content="Delete Nominal Roll" placement="top">
                              <button
                                onClick={() => handleDeleteClick(nominal.id)}
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
                      <td colSpan={6} className="py-12 px-6 text-center">
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
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            No nominal rolls found
                          </p>
                          <p className="text-sm text-gray-500">
                            {filters.search || filters.academic_id
                              ? 'Try adjusting your search criteria'
                              : 'No nominal rolls available'}
                          </p>
                          <Button
                            onClick={() => setShowAddModal(true)}
                            color="primary"
                            className="mt-4"
                          >
                            <BsPlusLg className="mr-2 w-4 h-4" />
                            Add Your First Nominal Roll
                          </Button>
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
        {nominalRolls.length > 0 && (
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

        {/* Add Nominal Roll Form Modal */}
        <NominalRollForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleFormSuccess}
        />

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Nominal Roll"
          message="Are you sure you want to delete this nominal roll? This action cannot be undone."
          loading={deleteLoading}
        />
      </div>
    </>
  );
};

export default NominalRollTable;