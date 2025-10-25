import React, { useState, useEffect, useRef } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { BsPlusLg, BsSearch } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import DegreeFormModal from './DegreeFormModal';

interface Degree {
  id: number;
  name: string;
  degree_number: string;
  academic_id: number;
  academic_name: string;
  total_marks: string;
  passing_marks: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

const DegreeManagementTable: React.FC = () => {
  const { user } = useAuth();
  const [degrees, setDegrees] = useState<Degree[]>([]);
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
  const [degreeToDelete, setDegreeToDelete] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingDegree, setEditingDegree] = useState<Degree | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch degrees data
  const fetchDegrees = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Degree/list`,
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
        setDegrees(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching degrees:', error);
      toast.error('Failed to fetch degrees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDegrees();
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
    setFilters((prev) => ({ ...prev, page: page-1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle add new degree
  const handleAddDegree = () => {
    setEditingDegree(null);
    setShowFormModal(true);
  };

  // Handle edit degree
  const handleEditDegree = (degree: Degree) => {
    setEditingDegree(degree);
    setShowFormModal(true);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingDegree(null);
    fetchDegrees();
    toast.success(editingDegree ? 'Degree updated successfully!' : 'Degree added successfully!');
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setDegreeToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (degreeToDelete !== null) {
        setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/CollegeManagement/Degree/delete`,
          {
            ids: [degreeToDelete],
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
          toast.success(response.data.message || 'Degree deleted successfully!');
          fetchDegrees();
        } else {
          console.error('Delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete degree');
        }
      } catch (error: any) {
        console.error('Error deleting degree:', error);
        toast.error('Failed to delete degree');
      } finally {
        setShowDeleteModal(false);
        setDegreeToDelete(null);
        setDeleteLoading(false);
      }
    }
  };



  return (
    <>
     <div className="mb-6">
        <BreadcrumbHeader
        title="Degrees"
        paths={[{ name: 'Degrees', link: '#' }]}
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
              placeholder="Search by degree name or application number..."
              value={filters.search}
              onChange={(e) => handleSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                     bg-white focus:ring-blue-500 focus:border-blue-500 
                     placeholder-gray-400 transition-all duration-200"
            />
          </div>

          {/* Academic Dropdown */}
          <div className="w-full sm:w-64">
            <AcademicDropdown
              value={filters.academic_id}
              onChange={handleAcademicChange}
              placeholder="Select academics..."
              includeAllOption={true}
              label=""
            />
          </div>
        </div>

        {/* Add Button */}
        <Button
          onClick={handleAddDegree}
          className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
        >
          <BsPlusLg className="mr-2 w-4 h-4" />
          Add Degree
        </Button>
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
                  S.NO
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('degree_number')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Application Number</span>
                    {getSortIcon('degree_number')}
                  </div>
                </th>
                <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Academic Name
                </th>
                <th
                  className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Degree Name</span>
                    {getSortIcon('name')}
                  </div>
                </th>
                <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {degrees.length > 0 ? (
                degrees.map((degree, index) => (
                  <tr key={degree.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {filters.page * filters.rowsPerPage + index + 1}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                      {degree.degree_number}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                      <Tooltip
                        content={degree.academic_name}
                        placement="top"
                        style="light"
                        animation="duration-300"
                      >
                        <span className="truncate max-w-[200px] block">
                          {degree.academic_name.length > 35
                            ? `${degree.academic_name.substring(0, 35)}...`
                            : degree.academic_name}
                        </span>
                      </Tooltip>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {degree.name}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <Tooltip content="Edit" placement="top">
                          <button
                            onClick={() => handleEditDegree(degree)}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <TbEdit className="w-5 h-5" />
                          </button>
                        </Tooltip>
                        <Tooltip content="Delete" placement="top">
                          <button
                            onClick={() => handleDeleteClick(degree.id)}
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
                  <td colSpan={5} className="py-12 px-6 text-center">
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
                      <p className="text-lg font-medium text-gray-600 mb-2">No degrees found</p>
                      <p className="text-sm text-gray-500">
                        {filters.search || filters.academic_id
                          ? 'Try adjusting your search criteria'
                          : 'No degrees available'}
                      </p>
                      {!filters.search && !filters.academic_id && (
                        <Button
                          onClick={handleAddDegree}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <BsPlusLg className="mr-2 w-4 h-4" />
                          Add Your First Degree
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
      {degrees.length > 0 && (
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

      {/* Degree Form Modal */}
      <DegreeFormModal
        isOpen={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingDegree(null);
        }}
        onSuccess={handleFormSuccess}
        degree={editingDegree}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Degree"
        message="Are you sure you want to delete this degree? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
    </>
  );
};

export default DegreeManagementTable;