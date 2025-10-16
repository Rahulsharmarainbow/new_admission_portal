import React, { useState, useEffect } from 'react';
import { Button, Tooltip, TextInput, Badge } from 'flowbite-react';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { BsPlusLg, BsSearch, BsDownload } from 'react-icons/bs';
import RankCardForm from './RankCardForm';

interface RankCard {
  id: number;
  academic_id: number;
  academic_name: string;
  create_at: string;
  degree_id: number;
  degree_name: string;
  total_student: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

const RankCardTable: React.FC = () => {
  const { user } = useAuth();
  const [rankCards, setRankCards] = useState<RankCard[]>([]);
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch rank cards data
  const fetchRankCards = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Rankcard/list`,
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
        setRankCards(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching rank cards:', error);
      toast.error('Failed to fetch rank cards');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankCards();
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

  // Handle export
  const handleExport = async (id: number, academicId: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Rankcard/Export`,
        {
          academic_id: academicId,
          s_id: user?.id,
          id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
          responseType: 'blob',
        },
      );

      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(blob);
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      
      // Set the filename for the download
      link.download = `rank-card-${id}.pdf`;
      
      // Append to body, click and remove
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      window.URL.revokeObjectURL(url);
      
      toast.success('Rank card exported successfully!');
    } catch (error: any) {
      console.error('Error exporting rank card:', error);
      toast.error('Failed to export rank card');
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    fetchRankCards();
  };

  return (
    <>
      <BreadcrumbHeader title="Rank Card" paths={[{ name: 'Rank Card', link: '#' }]} />
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
            Add Rank Card
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
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider text-center">
                      Total Students
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rankCards.length > 0 ? (
                    rankCards.map((rankCard, index) => (
                      <tr
                        key={rankCard.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td
                          className="py-4 px-4 whitespace-nowrap text-sm text-gray-900"
                          style={{ maxWidth: '200px' }}
                        >
                          <Tooltip content={rankCard.academic_name} placement="top" style="light">
                            <span className="block truncate">{rankCard.academic_name}</span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {rankCard.degree_name}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          <Badge color="info" className="text-xs">
                            {rankCard.total_student}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(rankCard.create_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            {/* Export Button */}
                            <Tooltip content="Export Rank Card" placement="top" style="light">
                              <button
                                onClick={() => handleExport(rankCard.id, rankCard.academic_id)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <BsDownload className="w-5 h-5" />
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
                            No rank cards found
                          </p>
                          <p className="text-sm text-gray-500">
                            {filters.search || filters.academic_id
                              ? 'Try adjusting your search criteria'
                              : 'No rank cards available'}
                          </p>
                          <Button
                            onClick={() => setShowAddModal(true)}
                            color="primary"
                            className="mt-4"
                          >
                            <BsPlusLg className="mr-2 w-4 h-4" />
                            Add Your First Rank Card
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
        {rankCards.length > 0 && (
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

        {/* Add Rank Card Form Modal */}
        <RankCardForm
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSuccess={handleFormSuccess}
        />
      </div>
    </>
  );
};

export default RankCardTable;