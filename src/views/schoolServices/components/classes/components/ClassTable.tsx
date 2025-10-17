import React, { useState, useMemo, useEffect } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import ClassForm from './ClassForm';

interface Class {
  id: number;
  class_name: string;
  class_number: string | null;
  start_cut_off: string | null;
  end_cut_off: string | null;
  available_seat: string;
  tution_fee_1: string;
  tution_fee_2: string;
  tution_fee_3: string;
  registration_fee: string;
  academic_id: number;
}

interface Academic {
  id: number;
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

const ClassTable: React.FC = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [academics, setAcademics] = useState<Academic[]>([]);
  const [loading, setLoading] = useState(false);
  const [academicsLoading, setAcademicsLoading] = useState(false);
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
  const [classToDelete, setClassToDelete] = useState<number | null>(null);
  const [showClassForm, setShowClassForm] = useState(false);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  // State for searchable dropdown
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAcademics, setFilteredAcademics] = useState<Academic[]>([]);

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch academics for dropdown
  const fetchAcademics = async () => {
    setAcademicsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-school`,
        {
          academic_id: filters.academic_id || undefined,
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

      if (response.data.status) {
        setAcademics(response.data.academic || []);
        setFilteredAcademics(response.data.academic || []);
      }
    } catch (error: any) {
      console.error('Error fetching academics:', error);
      toast.error('Failed to load schools');
    } finally {
      setAcademicsLoading(false);
    }
  };

  // Fetch classes data
  const fetchClasses = async () => {
    setLoading(true);
    try {
      const payload = {
        academic_id: filters.academic_id ? parseInt(filters.academic_id) : null,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/SchoolManagement/class-list`,
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

      if (response.data.status) {
        setClasses(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error: any) {
      console.error('Error fetching classes:', error);
      toast.error('Failed to load classes');
    } finally {
      setLoading(false);
    }
  };

  // Filter academics based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredAcademics(academics);
    } else {
      const filtered = academics.filter((academic) =>
        academic.academic_name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredAcademics(filtered);
    }
  }, [searchTerm, academics]);

  useEffect(() => {
    fetchAcademics();
  }, []);

  useEffect(() => {
    fetchClasses();
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

  // Handle academic filter change
  const handleAcademicChange = (academicId: string) => {
    setFilters((prev) => ({
      ...prev,
      academic_id: academicId,
      page: 0,
    }));
    setIsDropdownOpen(false);
    setSearchTerm('');
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
    setClassToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (classToDelete !== null) {
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/class-Delete`,
          {
            ids: [classToDelete],
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
          toast.error(`Delete failed: ${response.data.message}`);
          return;
        }

        toast.success('Class deleted successfully!');
        fetchClasses();
      } catch (error: any) {
        console.error('Error deleting class:', error);
        if (error.response?.data?.message) {
          toast.error(`Delete failed: ${error.response.data.message}`);
        } else {
          toast.error('Delete failed. Please try again.');
        }
      } finally {
        setShowDeleteModal(false);
        setClassToDelete(null);
      }
    }
  };

  // Handle add class
  const handleAddClass = () => {
    setEditingClass(null);
    setShowClassForm(true);
  };

  // Handle edit class
  const handleEdit = (classItem: Class) => {
    console.log('Editing class item:', classItem);
    setEditingClass(classItem);
    setShowClassForm(true);
  };

  // Handle form close
  const handleFormClose = () => {
    setShowClassForm(false);
    setEditingClass(null);
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchClasses();
    handleFormClose();
  };

  // Get selected academic name
  const getSelectedAcademicName = () => {
    if (!filters.academic_id) return 'All Schools';
    const selected = academics.find((academic) => academic.id.toString() === filters.academic_id);
    return selected ? selected.academic_name : 'All Schools';
  };

  // Format currency
  const formatCurrency = (amount: string) => {
    const numAmount = parseFloat(amount) || 0;
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
      {/* Breadcrumb */}
      <div className="mb-6">
        <BreadcrumbHeader
          title="Classes"
          paths={[{ name: 'Classes', link: '/' + user?.role + '/classes' }]}
        />
      </div>

      {/* Search Bar with Filters and Add Button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by class name..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Searchable Academic Dropdown */}
          <div className="relative w-full sm:w-64">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-left flex justify-between items-center"
              disabled={academicsLoading}
            >
              <span className="truncate">{getSelectedAcademicName()}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-hidden">
                {/* Search input inside dropdown */}
                <div className="p-2 border-b border-gray-200">
                  <input
                    type="text"
                    placeholder="Search schools..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Dropdown options */}
                <div className="max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => handleAcademicChange('')}
                    className={`w-full px-3 py-2 text-left hover:bg-gray-100 ${
                      filters.academic_id === '' ? 'bg-blue-50 text-blue-600' : ''
                    }`}
                  >
                    All Schools
                  </button>

                  {filteredAcademics.length > 0 ? (
                    filteredAcademics.map((academic) => (
                      <button
                        key={academic.id}
                        type="button"
                        onClick={() => handleAcademicChange(academic.id.toString())}
                        className={`w-full px-3 py-2 text-left hover:bg-gray-100 truncate ${
                          filters.academic_id === academic.id.toString()
                            ? 'bg-blue-50 text-blue-600'
                            : ''
                        }`}
                      >
                        {academic.academic_name}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-500 text-center">No schools found</div>
                  )}
                </div>
              </div>
            )}

            {academicsLoading && (
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
        </div>

        {/* Add Button */}
        <Button onClick={handleAddClass} color="blue" className="whitespace-nowrap px-4 py-2.5">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add
        </Button>
      </div>

      {/* Close dropdown when clicking outside */}
      {isDropdownOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setIsDropdownOpen(false)} />
      )}

      {/* Table */}
      <div className="shadow-md rounded-lg min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                S.NO
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('class_name')}
              >
                <div className="flex items-center">Class Name {getSortIcon('class_name')}</div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('tution_fee_1')}
              >
                <div className="flex items-center">Tution Fee 1 {getSortIcon('tution_fee_1')}</div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('tution_fee_2')}
              >
                <div className="flex items-center">Tution Fee 2 {getSortIcon('tution_fee_2')}</div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('tution_fee_3')}
              >
                <div className="flex items-center">Tution Fee 3 {getSortIcon('tution_fee_3')}</div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('available_seat')}
              >
                <div className="flex items-center">
                  Available Seats {getSortIcon('available_seat')}
                </div>
              </th>
              <th
                scope="col"
                className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes.length > 0 ? (
              classes.map((classItem, index) => (
                <tr key={classItem.id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {filters.page * filters.rowsPerPage + index + 1}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {classItem.class_name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(classItem.tution_fee_1)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(classItem.tution_fee_2)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(classItem.tution_fee_3)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        parseInt(classItem.available_seat) > 10
                          ? 'bg-green-100 text-green-800'
                          : parseInt(classItem.available_seat) > 0
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {classItem.available_seat}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-blue-500 hover:text-blue-700 p-1"
                        onClick={() => handleEdit(classItem)}
                        title="Edit"
                      >
                        <MdEdit size={18} />
                      </button>

                      <button
                        className="text-red-500 hover:text-red-700 p-1"
                        onClick={() => handleDeleteClick(classItem.id)}
                        title="Delete"
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
                    <p className="text-lg font-medium text-gray-600">No classes found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filters.search || filters.academic_id
                        ? 'Try adjusting your search criteria'
                        : 'No classes available'}
                    </p>
                    {/* Show Add button in empty state */}
                    {!filters.search && !filters.academic_id && (
                      <Button onClick={handleAddClass} color="blue" className="mt-4">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add Class
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {classes.length > 0 && (
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

      {/* Class Form Modal */}
      {showClassForm && (
        <ClassForm
          isOpen={showClassForm}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
          classData={editingClass}
          academics={academics}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Class"
        message="Are you sure you want to delete this class? This action cannot be undone."
      />
    </div>
  );
};

export default ClassTable;
