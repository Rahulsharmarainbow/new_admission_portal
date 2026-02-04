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
import Select from 'react-select';

interface StateItem {
  id: number;
  state_name: string;
  country_id: number;
  country_name: string;
}

interface StateResponse {
  status: boolean;
  rows: StateItem[];
  total: number;
}

interface CountryItem {
  id: number;
  name: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  country_id?: number;
}

interface SelectOption {
  value: number;
  label: string;
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

  // New states for country dropdown
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<SelectOption | null>(null);
  const [loadingCountries, setLoadingCountries] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch countries on component mount
  useEffect(() => {
    fetchCountries();
  }, []);

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, selectedCountry]);

  // Fetch countries
  const fetchCountries = async () => {
    setLoadingCountries(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
      };

      const requestBody = {
        state_id: ""
      };

      const response = await axios.post(
        `${apiUrl}/Public/Counties`,
        requestBody,
        { headers },
      );
      
      if (response.data?.status) {
        setCountries(response.data.states || []);
      } else {
        setCountries([]);
      }
    } catch (error) {
      console.error('Error fetching countries:', error);
      setCountries([]);
    } finally {
      setLoadingCountries(false);
    }
  };

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = {
        accept: '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
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
        country_id: selectedCountry?.value, // Add country_id to request
      };

      console.log('Fetching states with filters:', requestBody);

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

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle country change
  const handleCountryChange = (option: SelectOption | null) => {
    setSelectedCountry(option);
    setFilters(prev => ({
      ...prev,
      country_id: option?.value,
      page: 0
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

  // Convert countries to select options
  const countryOptions = countries.map(country => ({
    value: country.id,
    label: country.name
  }));

  // Custom styles for react-select
  const customStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: '42px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      backgroundColor: state.isDisabled ? '#f9fafb' : '#fff',
      '&:hover': {
        borderColor: '#9ca3af'
      },
      borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
      transition: 'all 0.2s ease'
    }),
    menuPortal: (base: any) => ({
      ...base,
      zIndex: 9999
    }),
    menu: (base: any) => ({
      ...base,
      borderRadius: '8px',
      border: '1px solid #e5e7eb',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      zIndex: 9999
    }),
    menuList: (base: any) => ({
      ...base,
      padding: '4px',
      maxHeight: '200px'
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#374151',
      borderRadius: '6px',
      margin: '2px 0',
      padding: '8px 12px',
      fontSize: '14px',
      '&:active': {
        backgroundColor: '#3b82f6',
        color: 'white'
      }
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#9ca3af',
      fontSize: '14px'
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#374151',
      fontSize: '14px'
    }),
    dropdownIndicator: (base: any, state: any) => ({
      ...base,
      color: '#6b7280',
      padding: '8px',
      transition: 'transform 0.2s ease',
      transform: state.selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      '&:hover': {
        color: '#374151'
      }
    }),
  };

  return (
    <>
      <BreadcrumbHeader
        title="States"
        paths={[{ name: 'States', link: '/' + user?.role + '/data-manager/State' }]}
      />
      
      {/* Main Content with Blur Effect when Modal is Open */}
      <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Table Header - Title replaced with Search Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
            {/* Left side: Search and Country Dropdown */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
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

              {/* Country Dropdown - Searchable */}
              <div className="w-full sm:w-64">
                <Select
                  value={selectedCountry}
                  onChange={handleCountryChange}
                  options={countryOptions}
                  placeholder="Filter by country..."
                  isSearchable
                  isClearable
                  isLoading={loadingCountries}
                  styles={customStyles}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={({ inputValue }) =>
                    inputValue ? "No countries found" : "No countries available"
                  }
                  loadingMessage={() => "Loading countries..."}
                />
              </div>
            </div>

            {/* Add Button - On the right side */}
            <Button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 whitespace-nowrap w-full sm:w-auto mt-4 sm:mt-0"
            >
              <HiPlus className="mr-2 h-5 w-5" />
              Add State
            </Button>
          </div>

          {/* Table Container with Loader */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                <Loader />
              </div>
            )}
            
            <div className="shadow-md rounded-lg min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="w-20 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center">
                        S.NO {getSortIcon('id')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('state_name')}
                    >
                      <div className="flex items-center justify-center">
                        State Name {getSortIcon('state_name')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('country_name')}
                    >
                      <div className="flex items-center justify-center">
                        Country Name {getSortIcon('country_name')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-32 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {item.state_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          {item.country_name}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            {/* Edit Button */}
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                              onClick={() => handleEditClick(item)}
                              title="Edit State"
                            >
                              <TbEdit size={18} />
                            </button>

                            {/* Delete Button */}
                            <button
                              className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
                              onClick={() => handleDeleteClick(item)}
                              title="Delete State"
                            >
                              <MdDeleteForever size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
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
                          <p className="text-lg font-medium text-gray-600 mb-2">No states found</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {filters.search || selectedCountry
                              ? 'Try adjusting your search criteria'
                              : 'Get started by adding your first state'}
                          </p>
                          {selectedCountry && (
                            <p className="text-sm text-blue-600 mb-4">
                              Showing states for: {selectedCountry.label}
                            </p>
                          )}
                          <Button onClick={handleAddClick} color="blue" className="flex items-center gap-2">
                            <HiPlus className="w-4 h-4" />
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
        </div>
      </div>

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
        message={`Are you sure you want to delete "${selectedItem?.state_name}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </>
  );
};

export default StateTable;