import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdEdit, MdDelete } from 'react-icons/md';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import AddStateModal from './AddStateModal';
import EditStateModal from './EditStateModal';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

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
    search: ''
  });
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StateItem | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'origin': 'http://localhost:3010',
        'priority': 'u=1, i',
        'referer': 'http://localhost:3010/',
        'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
        'Authorization': `Bearer ${user?.token}`,
        'Content-Type': 'application/json'
      };

      const requestBody = {
        type: 1, // State ke liye type 1
        s_id: user?.id,
        academic_id: 65, // Static academic_id
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search
      };

      const response = await axios.post(
        `${apiUrl}/SuperAdmin/StateDistrict/get-list`,
        requestBody,
        { headers }
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
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      page: 0
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters(prev => ({
      ...prev,
      order: direction,
      orderBy: key,
      page: 0
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
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle edit click
  const handleEditClick = (item: StateItem) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  // Handle edit success
  const handleEditSuccess = () => {
    setShowEditModal(false);
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

  try {
    const headers = {
      'accept': '*/*',
      'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
      'origin': 'http://localhost:3010',
      'priority': 'u=1, i',
      'referer': 'http://localhost:3010/',
      'sec-ch-ua': '"Chromium";v="140", "Not=A?Brand";v="24", "Google Chrome";v="140"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
      'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36',
      'Authorization': `Bearer ${user?.token}`,
      'Content-Type': 'application/json'
    };

    const requestBody = {
      type: 1, // For StateTable, use 2 for CasteTable
      ids: [selectedItem.id],
      s_id: user?.id,
    };

    const response = await axios.post(
      `${apiUrl}/SuperAdmin/StateDistrict/Delete-StateDistrict`,
      requestBody,
      { headers }
    );

    if (response.data?.status) {
      alert('Item deleted successfully!');
      fetchData();
    } else {
      alert(response.data?.message || 'Failed to delete item');
    }
  } catch (error: any) {
    console.error('Error deleting item:', error);
    alert(error.response?.data?.message || 'Failed to delete item. Please try again.');
  } finally {
    setShowDeleteModal(false);
    setSelectedItem(null);
  }
};

  // Handle add success
  const handleAddSuccess = () => {
    setShowAddModal(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8">
        <Loader />
      </div>
    );
  }

  return (
    <>  
      <BreadcrumbHeader
              title="States"
              paths={[{ name: "States", link: "/" + user?.role + "/data-manager/State" }]}
            />
    <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
      {/* Table Header with Search and Add Button */}
      <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Search Bar */}
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by state name..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        {/* Add Button */}
        <Button
          onClick={() => setShowAddModal(true)}
          color="blue"
          className="whitespace-nowrap px-4 py-2.5"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add State
        </Button>
      </div>

      {/* Table - Fixed Gap Issue */}
      <div className="shadow-md rounded-lg min-w-full">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="w-60 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                S.NO
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('state_title')}>
                <div className="flex items-center">
                  State Name {getSortIcon('state_title')}
                </div>
              </th>
              <th scope="col" className="w-24 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

             <tbody className="bg-white divide-y divide-gray-200">
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {(filters.page * filters.rowsPerPage) + index + 1}
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
                        <MdEdit size={18} />
                      </button>
                      
                      <button 
                        className="text-red-500 hover:text-red-700 p-1 transition-colors"
                        onClick={() => handleDeleteClick(item)}
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
                <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-600">No states found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      {filters.search 
                        ? 'Try adjusting your search criteria' 
                        : 'No states available'
                      }
                    </p>
                    <Button
                      onClick={() => setShowAddModal(true)}
                      color="blue"
                      className="mt-4"
                    >
                      <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

      {/* Add State Modal */}
      <AddStateModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
      />

      {/* Edit State Modal */}
      <EditStateModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedItem(null);
        }}
        onSuccess={handleEditSuccess}
        selectedItem={selectedItem}
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
      />
    </div>
    </>
  );
};

export default StateTable;