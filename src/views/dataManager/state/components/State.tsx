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
import StateModal from './AddStateModal';

interface StateItem {
  id: number;
  state_title: string;
}

interface StateResponse {
  status: boolean;
  rows: StateItem[];
  total: number;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

const StateTable: React.FC = () => {
  const { user } = useAuth();

  const [data, setData] = useState<StateItem[]>([]);
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
  const [selectedItem, setSelectedItem] = useState<StateItem | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        origin: 'http://localhost:3010',
        priority: 'u=1, i',
        referer: 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        type: 1,
        s_id: user?.id,
        academic_id: 65,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/get-list`,
        requestBody,
        { headers },
      );

      if (response.data?.status) {
        setData(response.data.rows || []);
        setTotal(response.data.total || 0);
      } else {
        setData([]);
        setTotal(0);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      toast.error('Failed to fetch states');
      setData([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

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
    setFilters((prev) => ({ ...prev, page: page - 1 }));
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
  const handleEditClick = (item: StateItem) => {
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
  const handleDeleteClick = (item: StateItem) => {
    setSelectedItem(item);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedItem) return;
      setDeleteLoading(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        origin: 'http://localhost:3010',
        priority: 'u=1, i',
        referer: 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        Authorization: `Bearer ${user?.token}`,
        'Content-Type': 'application/json',
      };

      const requestBody = {
        type: 1,
        ids: [selectedItem.id],
        s_id: user?.id,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/StateDistrict/Delete-StateDistrict`,
        requestBody,
        { headers },
      );

      if (response.data?.status) {
        toast.success('State deleted successfully!');
        fetchData();
      } else {
        toast.error(response.data?.message || 'Failed to delete state');
      }
    } catch (error: any) {
      console.error('Error deleting state:', error);
      toast.error(error.response?.data?.message || 'Failed to delete state. Please try again.');
    } finally {
      setShowDeleteModal(false);
      setSelectedItem(null);
        setDeleteLoading(false);
    }
  };

  return (
    <>
      <BreadcrumbHeader
        title="States"
        paths={[{ name: 'States', link: '/' + user?.role + '/data-manager/State' }]}
      />
      <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
        {/* Table Header with Search and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">States</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <TextInput
                type="text"
                placeholder="Search states..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                icon={HiSearch}
                className="w-full"
              />
            </div>

            {/* Add Button */}
            <Button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300"
            >
              <HiPlus className="mr-2 h-5 w-5" />
              Add State
            </Button>
          </div>
        </div>

        {/* Table Container with Loader */}
        <div className="relative">
          {loading && (
            <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
              <Loader />
            </div>
          )}
          
          <div className="shadow-md rounded-lg min-w-full">
            <table className="min-w-full divide-y divide-gray-200 p-2">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="w-60 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    S.NO
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                    onClick={() => handleSort('state_title')}
                  >
                    <div className="flex items-center">State Name {getSortIcon('state_title')}</div>
                  </th>
                  <th
                    scope="col"
                    className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {data.length > 0 ? (
                  data.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 ml-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {filters.page * filters.rowsPerPage + index + 1}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        {item.state_title}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1 transition-colors"
                            onClick={() => handleEditClick(item)}
                            title="Edit"
                          >
                            <TbEdit  size={18} />
                          </button>

                          <button
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            onClick={() => handleDeleteClick(item)}
                            title="Delete"
                          >
                            <MdDeleteForever size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
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
                        <p className="text-lg font-medium text-gray-600">No states found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {filters.search
                            ? 'Try adjusting your search criteria'
                            : 'No states available'}
                        </p>
                        <Button onClick={handleAddClick} color="blue" className="mt-4">
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
                          Add State
                        </Button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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

        {/* Combined State Modal */}
        <StateModal
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
          title="Delete State"
          message={`Are you sure you want to delete "${selectedItem?.state_title}"? This action cannot be undone.`}
          loading={deleteLoading}
        />
      </div>
    </>
  );
};

export default StateTable;