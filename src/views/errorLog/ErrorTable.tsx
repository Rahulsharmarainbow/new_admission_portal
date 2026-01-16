import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { MdDeleteForever, MdEdit, MdVisibility } from 'react-icons/md';
import { BsThreeDotsVertical, BsSearch, BsDownload } from 'react-icons/bs';
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
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface Activity {
  id: number;
  user_id: number;
  action: string;
  message: string;
  s_action: string;
  s_message: string;
  created_at: string;
  updated_at: string;
  name: string;
  login_type: number;
  role: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

const ErrorTable: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [activityToDelete, setActivityToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
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

  // Fetch activities data
  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Activities/get-error-activities`,
        {
          s_id: user?.id,
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

      if (response.data && response.data.success) {
        setActivities(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching activities:', error);
      toast.error('Failed to fetch activities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
  ]);

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
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle delete
  const handleDeleteClick = (id: number) => {
    setActivityToDelete(id);
    setShowDeleteModal(true);
    setActiveDropdown(null);
  };

  const confirmDelete = async () => {
    if (activityToDelete !== null) {
       setDeleteLoading(true);
      try {
        // Add your delete API call here
        // const response = await axios.post(
        //   `${apiUrl}/${user?.role}/Activities/delete-activity`,
        //   {
        //     id: activityToDelete,
        //     s_id: user?.id,
        //   },
        //   {
        //     headers: {
        //       Authorization: `Bearer ${user?.token}`,
        //       'Content-Type': 'application/json',
        //     },
        //   },
        // );

        // if (response.data.status === true) {
        //   toast.success(response.data.message || 'Activity deleted successfully!');
        //   fetchActivities();
        // } else {
        //   toast.error(response.data.message || 'Failed to delete activity');
        // }

        // For now, just show success message
        toast.success('Activity deleted successfully!');
        fetchActivities();
      } catch (error: any) {
        console.error('Error deleting activity:', error);
        toast.error('Failed to delete activity');
      } finally {
        setShowDeleteModal(false);
        setActivityToDelete(null);
         setDeleteLoading(false);
      }
    }
  };

  // Handle view details
  const handleViewDetails = (activity: Activity) => {
    // Implement view details functionality
    console.log('View details:', activity);
    setActiveDropdown(null);
  };

  // Handle export
  const handleExport = (id: number) => {
    // Implement export functionality
    toast.success(`Exporting activity ${id}`);
    setActiveDropdown(null);
  };

  // Get role badge color
  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'super admin':
        return 'red';
      case 'admin':
        return 'purple';
      case 'user':
        return 'blue';
      case 'customer admin':
        return 'green';
      default:
        return 'gray';
    }
  };

  // Format message for display (remove HTML tags and truncate)
  const formatMessage = (message: string, maxLength: number = 100) => {
    // Remove HTML tags
    const plainText = message.replace(/<[^>]*>/g, '');
    
    // Truncate if too long
    if (plainText.length > maxLength) {
      return plainText.substring(0, maxLength) + '...';
    }
    
    return plainText;
  };

  // Toggle dropdown
  const toggleDropdown = (activityId: number, event: React.MouseEvent) => {
    event.stopPropagation();

    if (activeDropdown === activityId) {
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
      setActiveDropdown(activityId);
    }
  };

  // Set dropdown ref for each row
  const setDropdownRef = (id: number, el: HTMLDivElement | null) => {
    dropdownRefs.current[id] = el;
  };

  return (
    <>
      <BreadcrumbHeader title="Error Logs" paths={[{ name: 'Activities', link: '#' }]} />
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <TextInput
                type="text"
                placeholder="Search by action, user name, or role..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
          </div>
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
                      onClick={() => handleSort('role')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Academic Name</span>
                        {getSortIcon('role')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('action')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Action</span>
                        {getSortIcon('action')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Message
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Date & Time</span>
                        {getSortIcon('created_at')}
                      </div>
                    </th>
                    {/* <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.length > 0 ? (
                    activities.map((activity, index) => (
                      <tr
                        key={activity.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                       
                        <td className="py-4 px-4 whitespace-nowrap">
                          <Badge 
                            color={getRoleBadgeColor(activity.academic_name)} 
                            className="text-xs capitalize"
                          >
                            {activity.academic_name}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {activity.type}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-md">
                          <Tooltip 
                            content={formatMessage(activity.message, 500)} 
                            placement="top" 
                            style="light"
                          >
                            <span className="line-clamp-2">
                              {formatMessage(activity.message)}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {activity.created_at}
                        </td>
                        {/* <td className="py-4 px-4 whitespace-nowrap text-center relative">
                          <div
                            ref={(el) => setDropdownRef(activity.id, el)}
                            className="relative flex justify-center"
                          >
                            <button
                              onClick={(e) => toggleDropdown(activity.id, e)}
                              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              <BsThreeDotsVertical className="w-4 h-4" />
                            </button>
                            
                            {activeDropdown === activity.id &&
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
                                    onClick={() => handleViewDetails(activity)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    <MdVisibility className="w-4 h-4 mr-3" />
                                    View Details
                                  </button>

                                  <button
                                    onClick={() => handleExport(activity.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                  >
                                    <BsDownload className="w-4 h-4 mr-3" />
                                    Export
                                  </button>

                                  <div className="border-t border-gray-200 my-1"></div>

                                  <button
                                    onClick={() => handleDeleteClick(activity.id)}
                                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                  >
                                    <MdDeleteForever className="w-4 h-4 mr-3" />
                                    Delete
                                  </button>
                                </div>,
                                document.body,
                              )}
                          </div>
                        </td> */}
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
                          <p className="text-lg font-medium text-gray-600 mb-2">
                            No activities found
                          </p>
                          <p className="text-sm text-gray-500">
                            {filters.search
                              ? 'Try adjusting your search criteria'
                              : 'No activities available'}
                          </p>
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
        {activities.length > 0 && (
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
          title="Delete Activity"
          message="Are you sure you want to delete this activity? This action cannot be undone."
           loading={deleteLoading}
        />
      </div>
    </>
  );
};

export default ErrorTable;