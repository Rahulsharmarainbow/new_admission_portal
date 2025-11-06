import React, { useState, useEffect, useRef } from 'react';
import { MdEdit, MdDelete, MdVisibility } from 'react-icons/md';
import { BsPlusLg, BsSearch, BsThreeDotsVertical } from 'react-icons/bs';
import { Button, Tooltip, Badge, TextInput } from 'flowbite-react';
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
import TransportationForm from './TransportationForm';

interface Transportation {
  id: number;
  distance: string;
  fee1: string;
  fee2: string;
  fee3: string;
  academic_name: string;
  creation_date: string;
  academic_id: number;
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

const TransportationTable: React.FC = () => {
  const { user } = useAuth();
  const [transportations, setTransportations] = useState<Transportation[]>([]);
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
  const [transportationToDelete, setTransportationToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTransportation, setEditingTransportation] = useState<Transportation | null>(null);
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

  // Fetch transportations data
  const fetchTransportations = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_id: filters.academic_id ? parseInt(filters.academic_id) : undefined,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/SchoolManagement/Transportation/list`,
        payload,
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
        setTransportations(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching transportations:', error);
      toast.error('Failed to load transportations');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportations();
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

  // Handle add new transportation
  const handleAddTransportation = () => {
    setEditingTransportation(null);
    setShowFormModal(true);
  };

  // Handle edit transportation
  const handleEdit = (transportation: Transportation) => {
    setEditingTransportation(transportation);
    setShowFormModal(true);
    setActiveDropdown(null);
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setTransportationToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (transportationToDelete !== null) {
      setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Transportation/delete`,
          {
            ids: [transportationToDelete],
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
          toast.success(response.data.message || 'Transportation deleted successfully!');
          fetchTransportations();
        } else {
          toast.error(response.data.message || 'Failed to delete transportation');
        }
      } catch (error: any) {
        console.error('Error deleting transportation:', error);
        toast.error('Failed to delete transportation');
      } finally {
        setShowDeleteModal(false);
        setTransportationToDelete(null);
        setDeleteLoading(false);
      }
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingTransportation(null);
    fetchTransportations();
  };

  // Toggle dropdown
  const toggleDropdown = (transportationId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === transportationId) {
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
      setActiveDropdown(transportationId);
    }
  };

  // Set dropdown ref for each row
  const setDropdownRef = (transportationId: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[transportationId] = el;
  };


 return (
  <div className="p-4 bg-white rounded-lg shadow-md">
    {/* Search Bar with Filters and Add Button */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-80 order-1 sm:order-none">
          {/* <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <BsSearch className="w-4 h-4 text-gray-500" />
          </div> */}
          <TextInput
            type="text"
            placeholder="Search by distance..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
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
        onClick={handleAddTransportation}
        color="primary"
        className="whitespace-nowrap w-full lg:w-auto"
      >
        <BsPlusLg className="mr-2 w-4 h-4" />
        Add Transportation
      </Button>
    </div>

    {/* Custom Table with Flowbite Styling */}
    <div className="rounded-lg border border-gray-200 shadow-sm relative">
      {/* Table Loader Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10 rounded-lg">
          <Loader />
        </div>
      )}
      
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
                onClick={() => handleSort('distance')}
              >
                <div className="flex items-center space-x-1">
                  <span>Distance</span>
                  {getSortIcon('distance')}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fee 1
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fee 2
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Fee 3
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('creation_date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Created Date</span>
                  {getSortIcon('creation_date')}
                </div>
              </th>
              <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transportations.length > 0 ? (
              transportations.map((transportation, index) => (
                <tr
                  key={transportation.id}
                  className="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {filters.page * filters.rowsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    <Tooltip
                      content={transportation.academic_name}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[180px] block">
                        {transportation.academic_name.length > 25
                          ? `${transportation.academic_name.substring(0, 25)}...`
                          : transportation.academic_name}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    <Tooltip
                      content={transportation.distance}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[200px] block">
                        {transportation.distance.length > 35
                          ? `${transportation.distance.substring(0, 35)}...`
                          : transportation.distance}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 font-medium">
  {isNaN(Number(transportation.fee1))
    ? transportation.fee1
    : `₹${transportation.fee1}`}
</td>

<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 font-medium">
  {isNaN(Number(transportation.fee2))
    ? transportation.fee2
    : `₹${transportation.fee2}`}
</td>

<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 font-medium">
  {isNaN(Number(transportation.fee3))
    ? transportation.fee3
    : `₹${transportation.fee3}`}
</td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(transportation.creation_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center relative">
                    <div
                      ref={(el) => setDropdownRef(transportation.id, el)}
                      className="relative flex justify-center"
                    >
                      <button
                        onClick={(e) => toggleDropdown(transportation.id, e)}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <BsThreeDotsVertical className="w-4 h-4" />
                      </button>
                      {activeDropdown === transportation.id &&
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
                              onClick={() => handleEdit(transportation)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <MdEdit className="w-4 h-4 mr-3" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteClick(transportation.id)}
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
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-600 mb-2">
                      No transportations found
                    </p>
                    <p className="text-sm text-gray-500">
                      {filters.search || filters.academic_id
                        ? 'Try adjusting your search criteria'
                        : 'No transportation records available'}
                    </p>
                    {!filters.search && !filters.academic_id && (
                      <Button
                        onClick={handleAddTransportation}
                        color="primary"
                        className="mt-4"
                      >
                        <BsPlusLg className="mr-2 w-4 h-4" />
                        Add Your First Transportation
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
    {transportations.length > 0 && (
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
      title="Delete Transportation"
      message="Are you sure you want to delete this transportation record? This action cannot be undone."
      loading={deleteLoading}
    />

    {/* Transportation Form Modal */}
    <TransportationForm
      isOpen={showFormModal}
      onClose={() => {
        setShowFormModal(false);
        setEditingTransportation(null);
      }}
      onSuccess={handleFormSuccess}
      editingTransportation={editingTransportation}
    />
  </div>
);
};

export default TransportationTable;
