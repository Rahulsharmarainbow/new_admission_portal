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
import TransportationSettingsForm from './TransportationSettingsForm';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import RouteDropdown from 'src/Frontend/Common/RouteDropdown';

interface TransportationSetting {
  id: number;
  academic_id: number;
  param_name: string;
  param_key: string;
  param_value: string;
  academic_name: string;
  creation_date: string;
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

interface TransportationSettingsTableProps {
  type?: string; // Optional prop
}

const TransportationSettingsTable: React.FC<TransportationSettingsTableProps> = ({ type }) => {

  const currentType = type || "1"; // Default to "1" if not provided

  const { user } = useAuth();
  const [settings, setSettings] = useState<TransportationSetting[]>([]);
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
  const [settingToDelete, setSettingToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingSetting, setEditingSetting] = useState<TransportationSetting | null>(null);
  const dropdownRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const [selectedFormId, setSelectedFormId] = useState(''); // नया state
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

  const handleFormSelect = (formId: string) => {
     setFilters((prev) => ({
      ...prev,
      form_id: formId,
      page: 0,
    }));
    setFormData((prev) => ({
      ...prev,
      form_id: formId,
    }));
    
  };

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const payload = {
        s_id: user?.id,
        academic_id: filters.academic_id ? parseInt(filters.academic_id) : undefined,
        form_id: filters.form_id ? parseInt(filters.form_id) : undefined,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
        type: currentType,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/SchoolManagement/Setting/list`,
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
        setSettings(response.data.data || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching transportation settings:', error);
      toast.error('Failed to load transportation settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if(user?.role === 'CustomerAdmin'){
    handleAcademicChange(user?.academic_id?.toString());
  }
    fetchSettings();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.form_id]);

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
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle add new setting
  const handleAddSetting = () => {
    setEditingSetting(null);
    setShowFormModal(true);
  };

  // Handle edit setting
  const handleEdit = (setting: TransportationSetting) => {
    setEditingSetting(setting);
    setShowFormModal(true);
    setActiveDropdown(null);
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setSettingToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (settingToDelete !== null) {
       setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/SchoolManagement/Setting/delete`,
          {
            ids: [settingToDelete],
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
          toast.success(response.data.message || 'Transportation setting deleted successfully!');
          fetchSettings();
        } else {
          toast.error(response.data.message || 'Failed to delete transportation setting');
        }
      } catch (error: any) {
        console.error('Error deleting transportation setting:', error);
        toast.error('Failed to delete transportation setting');
      } finally {
        setShowDeleteModal(false);
        setSettingToDelete(null);
         setDeleteLoading(false);
      }
    }
  };

  // Handle form success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingSetting(null);
    fetchSettings();
  };

  // Toggle dropdown
  const toggleDropdown = (settingId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === settingId) {
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
      setActiveDropdown(settingId);
    }
  };

  // Set dropdown ref for each row
  const setDropdownRef = (settingId: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[settingId] = el;
  };


return (
  <div className="p-4 bg-white rounded-lg shadow-md">
    {/* Search Bar with Filters and Add Button */}
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row gap-4 w-full items-start sm:items-center">
        {/* Search Input */}
        <div className="relative w-full sm:w-80 order-1 sm:order-none">
          <TextInput
            type="text"
            placeholder="Search by parameter name or key..."
            value={filters.search}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

      
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
    {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
    <div>
      {currentType === "2" ? (
        <AcademicDropdown
          formData={formData}
          setFormData={setFormData}
          onChange={handleAcademicChange}
          includeAllOption
        />
      ) : (
        <SchoolDropdown
          formData={formData}
          setFormData={setFormData}
          onChange={handleAcademicChange}
          includeAllOption
        />
      )}
    </div>
    )}
    {/* Route Dropdown */}
    <div>
      <RouteDropdown
        academicId={formData.academic_id}
        value={formData.form_id}
        onChange={handleFormSelect}
        
        isRequired
        placeholder={formData.academic_id ? "Select form page..." : "Select academic first"}
        disabled={!formData.academic_id}
      />
    </div>
  </div>

      </div>

      {/* Add Button */}
      <Button
        onClick={handleAddSetting}
        color='primary'
        className="whitespace-nowrap w-full lg:w-auto"
      >
        <BsPlusLg className="mr-2 w-4 h-4" />
        Add Setting
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
                  <span>Academic Name</span>
                  {getSortIcon('academic_name')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('param_name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Parameter Name</span>
                  {getSortIcon('param_name')}
                </div>
              </th>
              <th
                className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                onClick={() => handleSort('param_key')}
              >
                <div className="flex items-center space-x-1">
                  <span>Parameter Key</span>
                  {getSortIcon('param_key')}
                </div>
              </th>
              <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Parameter Value
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
            {settings.length > 0 ? (
              settings.map((setting, index) => (
                <tr key={setting.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {filters.page * filters.rowsPerPage + index + 1}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-900">
                    <Tooltip
                      content={setting.academic_name}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[180px] block">
                        {setting.academic_name.length > 25
                          ? `${setting.academic_name.substring(0, 25)}...`
                          : setting.academic_name}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-700">
                    <Tooltip
                      content={setting.param_name}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[150px] block">
                        {setting.param_name.length > 20
                          ? `${setting.param_name.substring(0, 20)}...`
                          : setting.param_name}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                    <Tooltip
                      content={setting.param_key}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[120px] block bg-gray-100 px-2 py-1 rounded text-xs">
                        {setting.param_key}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                    <Tooltip
                      content={setting.param_value}
                      placement="top"
                      style="light"
                      animation="duration-300"
                    >
                      <span className="truncate max-w-[100px] block">
                        {setting.param_value.length > 15
                          ? `${setting.param_value.substring(0, 15)}...`
                          : setting.param_value}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(setting.creation_date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap text-center relative">
                    <div
                      ref={(el) => setDropdownRef(setting.id, el)}
                      className="relative flex justify-center"
                    >
                      <button
                        onClick={(e) => toggleDropdown(setting.id, e)}
                        className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <BsThreeDotsVertical className="w-4 h-4" />
                      </button>
                      {activeDropdown === setting.id &&
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
                              onClick={() => handleEdit(setting)}
                              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                            >
                              <MdEdit className="w-4 h-4 mr-3" />
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteClick(setting.id)}
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
                    <p className="text-lg font-medium text-gray-600 mb-2">No settings found</p>
                    <p className="text-sm text-gray-500">
                      {filters.search || filters.academic_id
                        ? 'Try adjusting your search criteria'
                        : 'No transportation settings available'}
                    </p>
                    {!filters.search && !filters.academic_id && (
                      <Button
                        onClick={handleAddSetting}
                        color="primary"
                        className="mt-4"
                      >
                        <BsPlusLg className="mr-2 w-4 h-4" />
                        Add Your First Setting
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
    {settings.length > 0 && (
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
      title="Delete Transportation Setting"
      message="Are you sure you want to delete this transportation setting? This action cannot be undone."
      loading={deleteLoading}
    />

    {/* Transportation Settings Form Modal */}
    <TransportationSettingsForm
      isOpen={showFormModal}
      onClose={() => {
        setShowFormModal(false);
        setEditingSetting(null);
      }}
      onSuccess={handleFormSuccess}
      editingSetting={editingSetting}
      type={currentType}
    />
  </div>
);
};

export default TransportationSettingsTable;