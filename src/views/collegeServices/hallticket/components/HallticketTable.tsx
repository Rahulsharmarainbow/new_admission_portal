import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { BsThreeDotsVertical, BsPlusLg, BsSearch, BsDownload } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, TextInput, Badge } from 'flowbite-react';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';
import { createPortal } from 'react-dom';
import Select from 'react-select';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface Hallticket {
  id: number;
  academic_name: string;
  applicant_count: number;
  degree_name: string;
  exam_center_name: string;
  exam_date: string;
  exam_time: string;
  exam_end_time: string;
  hallticket_series: string;
  application_start_series: string;
  application_end_series: string;
  center_address: string;
  academic_id: number;
  degree_id: number;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  year: string;
}

const HallticketTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [halltickets, setHalltickets] = useState<Hallticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic_id: '',
    year: new Date().getFullYear().toString(),
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hallticketToDelete, setHallticketToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; left: number }>({
    top: 0,
    left: 0,
  });

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

  // Fetch halltickets data
  const fetchHalltickets = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Hallticket/list`,
        {
          academic_id: filters.academic_id || undefined,
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
          year: filters.year,
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
        setHalltickets(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching halltickets:', error);
      toast.error('Failed to fetch halltickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHalltickets();
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
    filters.academic_id,
    filters.year,
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

  // Handle year change
  const handleYearChange = (year: string) => {
    setFilters((prev) => ({
      ...prev,
      year,
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
    setHallticketToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (hallticketToDelete !== null) {
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/CollegeManagement/Hallticket/delete`,
          {
            ids: [hallticketToDelete],
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
          toast.success(response.data.message || 'Hallticket deleted successfully!');
          fetchHalltickets();
        } else {
          toast.error(response.data.message || 'Failed to delete hallticket');
        }
      } catch (error: any) {
        console.error('Error deleting hallticket:', error);
        toast.error('Failed to delete hallticket');
      } finally {
        setShowDeleteModal(false);
        setHallticketToDelete(null);
      }
    }
  };

  // Handle export
  const handleExport = (id: number) => {
    // Implement export functionality
    toast.success(`Exporting hallticket ${id}`);
    setActiveDropdown(null);
  };

  // Navigate to edit
  const handleEdit = (id: number) => {
    navigate(`/${user?.role}/halltickets/edit/${id}`);
    setActiveDropdown(null);
  };

  // Navigate to add hallticket
  const handleAddHallticket = () => {
    navigate(`/${user?.role}/halltickets/add`);
  };

  // Toggle dropdown
  // const toggleDropdown = (id: number, event: React.MouseEvent) => {
  //   event.stopPropagation();

  //   if (activeDropdown === id) {
  //     setActiveDropdown(null);
  //   } else {
  //     const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
  //     const dropdownWidth = 192;
  //     const padding = 8;
  //     let left = rect.left + window.scrollX;

  //     if (left + dropdownWidth + padding > window.innerWidth) {
  //       left = rect.right - dropdownWidth + window.scrollX;
  //     }

  //     setDropdownPosition({ top: rect.bottom + window.scrollY, left });
  //     setActiveDropdown(id);
  //   }
  // };


  // --- Inside component ---
// Dropdown toggle
const toggleDropdown = (hallticketId: number, event: React.MouseEvent) => {
  event.stopPropagation();

  if (activeDropdown === hallticketId) {
    setActiveDropdown(null);
  } else {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const dropdownWidth = 192; // w-48 = 12rem = 192px
    const padding = 8; // safe space from viewport edge
    let left = rect.left + window.scrollX;

    // If dropdown crosses viewport width, open to the left
    if (left + dropdownWidth + padding > window.innerWidth) {
      left = rect.right - dropdownWidth + window.scrollX;
    }

    setDropdownPosition({ top: rect.bottom + window.scrollY, left });
    setActiveDropdown(hallticketId);
  }
};


  // Set dropdown ref for each row
  const setDropdownRef = (id: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[id] = el;
  };

  // Generate year options (current year and 5 previous years)
  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const year = new Date().getFullYear() - i;
    return { value: year.toString(), label: year.toString() };
  });

  return (
    <>
      <BreadcrumbHeader title="Hallticket" paths={[{ name: 'Hallticket', link: '#' }]} />
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar with Filters and Add Button */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input with integrated search icon */}
            <div className="relative w-full sm:w-80">
              <TextInput
                type="text"
                placeholder="Search by exam center or degree..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Year Dropdown */}
            <div className="w-full sm:w-48">
              <Select
                options={yearOptions}
                value={yearOptions.find((opt) => opt.value === filters.year)}
                onChange={(selected) =>
                  handleYearChange(selected?.value || new Date().getFullYear().toString())
                }
                placeholder="Select Year"
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: '#d1d5db',
                    borderRadius: '0.5rem',
                    padding: '2px',
                    minHeight: '42px',
                    boxShadow: 'none',
                    '&:hover': { borderColor: '#93c5fd' },
                  }),
                }}
              />
            </div>

            {/* Academic Dropdown - without heading */}
            <div className="w-full sm:w-64">
              <AcademicDropdown
                value={filters.academic_id}
                onChange={handleAcademicChange}
                placeholder="Select academic..."
                includeAllOption={true}
                label="" // Empty label to remove heading
              />
            </div>
          </div>

          {/* Add Button */}
          <Button
            onClick={handleAddHallticket}
            gradientDuoTone="cyanToBlue"
            className="whitespace-nowrap"
          >
            <BsPlusLg className="mr-2 w-4 h-4" />
            Add Hallticket
          </Button>
        </div>

        {/* Custom Table - Fixed width to prevent scrollbar */}
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
                      No. of Applicant
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Degree Name
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('exam_center_name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Exam Center Name</span>
                        {getSortIcon('exam_center_name')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Exam Date
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Exam Start Time
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Exam End Time
                    </th>
                    <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {halltickets.length > 0 ? (
                    halltickets.map((hallticket, index) => (
                      <tr
                        key={hallticket.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        {/* <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900 max-w-[200px] truncate">
                        <Tooltip content={hallticket.academic_name} placement="top" style="light">
                          <span>{hallticket.academic_name}</span>
                        </Tooltip>
                       </td> */}
                        <td
                          className="py-4 px-4 whitespace-nowrap text-sm text-gray-900"
                          style={{ maxWidth: '200px' }}
                        >
                          <Tooltip content={hallticket.academic_name} placement="top" style="light">
                            <span className="block truncate">{hallticket.academic_name}</span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 text-center">
                          <Badge color="blue" className="text-xs">
                            {' '}
                            {hallticket.applicant_count}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {hallticket.degree_name}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {hallticket.exam_center_name}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(hallticket.exam_date).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {hallticket.exam_time}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {hallticket.exam_end_time}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center relative">
                          <div
                            ref={(el) => setDropdownRef(hallticket.id, el)}
                            className="relative flex justify-center"
                          >
                            <button
                              onClick={(e) => toggleDropdown(hallticket.id, e)}
                              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <BsThreeDotsVertical className="w-4 h-4" />
                            </button>
                            {/* {activeDropdown === hallticket.id &&
                              createPortal(
                                <div
                                  className="z-[9999] w-32 bg-white rounded-lg shadow-xl border border-gray-200 py-1"
                                  style={{
                                    top: dropdownPosition.top,
                                    left: dropdownPosition.left,
                                    position: 'absolute',
                                  }}
                                  onMouseDown={(e) => e.stopPropagation()}
                                >
                                  <Tooltip content="Edit hallticket" placement="left" style="light">
                                    <button
                                      onClick={() => handleEdit(hallticket.id)}
                                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                      <TbEdit className="w-4 h-4" />
                                    </button>
                                  </Tooltip>

                                  <Tooltip
                                    content="Export hallticket"
                                    placement="left"
                                    style="light"
                                  >
                                    <button
                                      onClick={() => handleExport(hallticket.id)}
                                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                      <BsDownload className="w-4 h-4" />
                                    </button>
                                  </Tooltip>

                                  <div className="border-t border-gray-200 my-1"></div>

                                  <Tooltip
                                    content="Delete hallticket"
                                    placement="left"
                                    style="light"
                                    animation="duration-300"
                                  >
                                    <button
                                      onClick={() => handleDeleteClick(hallticket.id)}
                                      className="flex items-center justify-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                      <MdDeleteForever className="w-4 h-4" />
                                    </button>
                                  </Tooltip>
                                </div>,
                                document.body,
                              )} */}
                              {activeDropdown === hallticket.id &&
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
        onClick={() => handleEdit(hallticket.id)}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <MdEdit className="w-4 h-4 mr-3" />
        Edit
      </button>

      <button
        onClick={() => handleExport(hallticket.id)}
        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
      >
        <BsDownload className="w-4 h-4 mr-3" />
        Export
      </button>

      <div className="border-t border-gray-200 my-1"></div>

      <button
        onClick={() => handleDeleteClick(hallticket.id)}
        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
      >
        <MdDeleteForever className="w-4 h-4 mr-3" />
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
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            No halltickets found
                          </p>
                          <p className="text-sm text-gray-500">
                            {filters.search || filters.academic_id
                              ? 'Try adjusting your search criteria'
                              : 'No halltickets available'}
                          </p>
                          <Button onClick={handleAddHallticket} color="primary" className="mt-4">
                            <BsPlusLg className="mr-2 w-4 h-4" />
                            Add Your First Hallticket
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
        {halltickets.length > 0 && (
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
          title="Delete Hallticket"
          message="Are you sure you want to delete this hallticket? This action cannot be undone."
        />
      </div>
    </>
  );
};

export default HallticketTable;
