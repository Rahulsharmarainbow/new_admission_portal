import React, { useState, useEffect } from 'react';
import { MdOutlineRemoveRedEye, MdFilterList, MdDownload } from 'react-icons/md';
import { TbEdit, TbLoader2 } from 'react-icons/tb';
import { BsSearch, BsFileEarmarkText } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, Checkbox, ModalHeader, ModalBody, ModalFooter, Modal } from 'flowbite-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import { useNavigate } from 'react-router';
import CareerDropdown from 'src/Frontend/Common/CareerDropdown';
import DetailsModal from './components/DetailsModal';
import EditModal from './components/EditModal';

interface CareerApplication {
  refference_id: string;
  id?: number;
  status: number;
  name: string;
  email: string;
  mobile: string;
  resume: string | null;
  job_title?: string;
  candidate_details?: {
    name: string;
    email: string;
    mobile: string;
    document: string;
    // Add other fields from your API response
    [key: string]: any;
  };
  created_at?: string;
  applied_for?: string;
  experience?: string;
  qualification?: string;
  // Additional documents from API
  documents?: Array<{
    id: number;
    file_path: string;
    file_name: string;
    file_type: string;
  }>;
}

interface StatusOption {
  id: number;
  name: string;
  value: number;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  status: string;
}

const CareerManagementTable: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<CareerApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>([]);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'refference_id',
    search: '',
    academic_id: '',
    status: '',
  });
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: 'refference_id', direction: 'desc' as 'asc' | 'desc' });
  const [downloadingResumeId, setDownloadingResumeId] = useState<string | null>(null);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [bulkStatus, setBulkStatus] = useState<string>('');
  const [isBulkUpdating, setIsBulkUpdating] = useState(false);
  
  // Modals state
  const [detailsModal, setDetailsModal] = useState<{
    isOpen: boolean;
    data: CareerApplication | null;
  }>({
    isOpen: false,
    data: null,
  });
  
  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    data: CareerApplication | null;
  }>({
    isOpen: false,
    data: null,
  });
  
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean;
    name: string;
    url: string;
    filename: string;
    type: string;
    documents?: Array<{
      id: number;
      file_path: string;
      file_name: string;
      file_type: string;
    }>;
    isMaximized?: boolean;
    isLoading?: boolean;
  }>({
    isOpen: false,
    name: '',
    url: '',
    filename: '',
    type: '',
    documents: [],
    isMaximized: false, 
    isLoading: true,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch status options based on academic_id
  const fetchStatusOptions = async (academicId?: string) => {
    if (!academicId) return;
    try {
      const requestBody: any = { type: 0 };
      if (academicId) {
        requestBody.academic_id = academicId;
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-career-status`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status && response.data.data) {
        const statusOptionsData = response.data.data.map((option) => ({
          value: option.value.toString(),
          label: option.name,
        }));
        setStatusOptions(statusOptionsData);
      }
    } catch (error) {
      console.error('Error fetching status options:', error);
      toast.error('Failed to fetch status options');
    }
  };

  // Fetch career applications
  const fetchApplications = async () => {
    if (!filters?.academic_id) {
      setApplications([]);
      return;
    }
    setLoading(true);
    try {
      const requestBody: any = {
        academic_id: filters.academic_id || '',
        status: filters.status || '',
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/get-career-application`,
        requestBody,
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
        const applicationsData = response.data.rows || [];
        setApplications(applicationsData);
        setTotal(response.data.total || 0);

        // Reset selected applications when data changes
        setSelectedApplications([]);
      }
    } catch (error) {
      console.error('Error fetching career applications:', error);
      toast.error('Failed to fetch career applications');
    } finally {
      setLoading(false);
    }
  };

  // Fetch initial data and set default academic_id
  useEffect(() => {
    const fetchInitialData = async () => {
      // First fetch status options
      await fetchStatusOptions();

      // Then fetch applications
      await fetchApplications();
    };

    if (filters.academic_id !== '') fetchInitialData();
  }, [filters]);

  // Bulk update status
  const handleBulkStatusUpdate = async () => {
    if (!bulkStatus || selectedApplications.length === 0) {
      toast.error('Please select applications and status');
      return;
    }

    setIsBulkUpdating(true);
    try {
//       const selectedIds = applications
//         .filter((app) => selectedApplications.includes(app.id))
//         .map((app) => app.id || parseInt(app.id))
//         .filter((id) => !isNaN(id));
// console.log('selectedIds',selectedApplications)
      const requestBody = {
        ids: selectedApplications,
        status: parseInt(bulkStatus),
        s_id: user?.id || '',
      };

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/career-status-application-change`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
            accept: 'application/json',
          },
        },
      );

      if (response.data) {
        toast.success(
          response.data.message || 'Status updated successfully for selected applications',
        );
        // Clear selection
        setSelectedApplications([]);
        setBulkStatus('');
        fetchApplications();
      }
    } catch (error) {
      console.error('Error updating bulk status:', error);
      toast.error('Failed to update status');
    } finally {
      setIsBulkUpdating(false);
    }
  };

  // Download resume
  const handleDownloadResume = async (application: CareerApplication) => {
    const resumeUrl = application.candidate_details?.document || application.resume;
    if (!resumeUrl) {
      toast.error('No resume available for download');
      return;
    }

    try {
      setDownloadingResumeId(application.id?.toString() || '');

      const fullUrl = `${resumeUrl}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = resumeUrl.split('/').pop() || 'resume.pdf';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    } finally {
      setDownloadingResumeId(null);
    }
  };

  // Preview resume/documents
 // Preview resume/documents
const handlePreviewResume = (application: CareerApplication) => {
  // Check for resume in different possible locations
  const resumeUrl =  application.resume ||  '';
  
  if (!resumeUrl) {
    toast.error('No resume available for preview');
    return;
  }

  // Clean URL - remove extra slashes if needed
  const cleanUrl = resumeUrl.replace(/\\/g, '/');
  
  // Determine file type
  const filename = cleanUrl.split('/').pop() || 'resume';
  let fileType = 'other';
  
  if (filename.toLowerCase().endsWith('.pdf')) fileType = 'pdf';
  else if (filename.toLowerCase().endsWith('.doc') || filename.toLowerCase().endsWith('.docx')) 
    fileType = 'doc';
  else if (filename.toLowerCase().endsWith('.jpg') || 
           filename.toLowerCase().endsWith('.jpeg') || 
           filename.toLowerCase().endsWith('.png')) 
    fileType = 'image';
  
  // Fetch additional documents if available
  const documents = application.documents || [];

  setPreviewModal({
    name: application.name,
    isOpen: true,
    url: cleanUrl, // Use the direct URL
    filename: filename,
    type: fileType,
    documents: documents,
    isMaximized: false,
    isLoading: true 
  });
};

console.log('applications',previewModal)
  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle academic change
  const handleAcademicChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      academic_id: value,
      page: 0,
    }));

    // Fetch status options for the selected academic
    fetchStatusOptions(value);
  };

  // Handle status change
  const handleStatusChange = (selectedOption: any) => {
    setFilters((prev) => ({
      ...prev,
      status: selectedOption?.value || '',
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

  // Handle view details
  const handleViewDetails = (application: CareerApplication) => {
    setDetailsModal({
      isOpen: true,
      data: application
    });
  };

  // Handle edit
  const handleEdit = (application: CareerApplication) => {
    setEditModal({
      isOpen: true,
      data: application
    });
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      page: 0,
      rowsPerPage: 10,
      order: 'desc',
      orderBy: 'refference_id',
      search: '',
      academic_id: '',
      status: '',
    });
    setSort({ key: 'refference_id', direction: 'desc' });
    setSelectedApplications([]);
    setBulkStatus('');
  };

  // Handle checkbox selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedApplications(applications.map((app) => app.id?.toString() || ''));
    } else {
      setSelectedApplications([]);
    }
  };

  const handleSelectApplication = (applicationId: string, checked: boolean) => {
    if (checked) {
      setSelectedApplications((prev) => [...prev, applicationId]);
    } else {
      setSelectedApplications((prev) => prev.filter((id) => id !== applicationId));
    }
  };

  // Get status text and color
  const getStatusInfo = (statusValue: string) => {
    const status = statusOptions.find((opt) => opt.value === statusValue);
    if (!status) return { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };

    switch (status.value) {
      case '4': // Applied
        return { text: status.label, color: 'bg-blue-100 text-blue-800' };
      case '5': // Shortlisted
        return { text: status.label, color: 'bg-purple-100 text-purple-800' };
      case '6': // Interview
        return { text: status.label, color: 'bg-yellow-100 text-yellow-800' };
      case '7': // Offer
        return { text: status.label, color: 'bg-orange-100 text-orange-800' };
      case '8': // Hired
        return { text: status.label, color: 'bg-green-100 text-green-800' };
      case '9': // Rejected
        return { text: status.label, color: 'bg-red-100 text-red-800' };
      default:
        return { text: status.label, color: 'bg-gray-100 text-gray-800' };
    }
  };

  // Fetch applications when filters change
  useEffect(() => {
    fetchApplications();
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
    filters.academic_id,
    filters.status,
  ]);

  return (
    <>
      <div className="mb-6">
        <BreadcrumbHeader
          title="Career Applications"
          paths={[{ name: 'Career Applications', link: '#' }]}
        />
      </div>

      {/* Main Content Container */}
      <div className="relative">
        {/* Main Content */}
        <div className="p-6 bg-white rounded-lg shadow-md">
          {/* Header with Search and Filter Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by name, email or mobile..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                             bg-white focus:ring-blue-500 focus:border-blue-500 
                             placeholder-gray-400 transition-all duration-200"
                />
              </div>

              <div className="w-full sm:w-48">
                <CareerDropdown
                  value={filters.academic_id}
                  onChange={handleAcademicChange}
                  placeholder="Select career..."
                  includeAllOption={true}
                  label=""
                />
              </div>

              {/* Status Dropdown */}
              {
                selectedApplications.length === 0 && (
                  <div className="w-full sm:w-48">
                <Select
                  options={statusOptions}
                  value={statusOptions.find((option) => option.value === filters.status)}
                  onChange={handleStatusChange}
                  placeholder="Select Status"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
                )
              }

              {/* Bulk Status Update Section */}
              {selectedApplications.length > 0 && (
                <div className="flex items-center gap-2">
                  <div className="w-48">
                    <Select
                      options={statusOptions}
                      value={statusOptions.find((option) => option.value.toString() === bulkStatus)}
                      onChange={(selectedOption) => setBulkStatus(selectedOption?.value || '')}
                      placeholder="Update Status"
                      className="react-select-container"
                      classNamePrefix="react-select"
                    />
                  </div>
                  <Button
                    onClick={handleBulkStatusUpdate}
                    disabled={!bulkStatus || isBulkUpdating}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isBulkUpdating ? (
                      <>
                        <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update'
                    )}
                  </Button>
                  <Button
                    onClick={() => setSelectedApplications([])}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                  >
                    Clear ({selectedApplications.length})
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <Loader />
          ) : (
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-12 py-3 px-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        <Checkbox
                          checked={
                            selectedApplications.length === applications.length &&
                            applications.length > 0
                          }
                          onChange={(e) => handleSelectAll(e.target.checked)}
                          disabled={applications.length === 0}
                        />
                      </th>
                      <th className="w-12 py-3 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        S.NO
                      </th>
                      <th className="w-48 py-3 px-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                      <th
                        className="py-3 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[100px] cursor-pointer select-none"
                        onClick={() => handleSort('refference_id')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Reference ID</span>
                          {getSortIcon('refference_id')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] cursor-pointer select-none"
                        onClick={() => handleSort('name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Name</span>
                          {getSortIcon('name')}
                        </div>
                      </th>
                      <th
                        className="py-3 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[180px] cursor-pointer select-none"
                        onClick={() => handleSort('email')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Contect</span>
                          {getSortIcon('email')}
                        </div>
                      </th>
                      <th className="py-3 px-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                      applications.map((application, index) => {
                        const statusInfo = getStatusInfo(application.status.toString());
                        const isSelected = selectedApplications.includes(application.id?.toString() || '');

                        return (
                          <tr
                            key={application.id}
                            className={`hover:bg-gray-50 transition-colors duration-150 ${
                              isSelected ? 'bg-blue-50' : ''
                            }`}
                          >
                            <td className="py-3 px-3 text-center">
                              <Checkbox
                                checked={isSelected}
                                onChange={(e) =>
                                  handleSelectApplication(
                                    application.id?.toString() || '',
                                    e.target.checked,
                                  )
                                }
                              />
                            </td>
                            <td className="py-3 px-3 text-sm font-medium text-gray-900">
                              {filters.page * filters.rowsPerPage + index + 1}
                            </td>
                            <td className="py-5 px-4 border-gray-100">
                              <div className="flex items-center justify-start space-x-2">
                                <Tooltip content="View Details" placement="top" style="light">
                                  <button
                                    onClick={() => handleViewDetails(application)}
                                    className="p-2 rounded-lg bg-orange-50 text-orange-600 hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 shadow-sm hover:shadow"
                                  >
                                    <MdOutlineRemoveRedEye className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Edit" placement="top" style="light">
                                  <button
                                    onClick={() => handleEdit(application)}
                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 shadow-sm hover:shadow"
                                  >
                                    <TbEdit className="w-4 h-4" />
                                  </button>
                                </Tooltip>
                                {(application.resume || application.candidate_details?.document) && (
                                  <>
                                    <Tooltip content="Preview Resume" placement="top" style="light">
                                      <button
                                        onClick={() => handlePreviewResume(application)}
                                        className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700 transition-all duration-200 shadow-sm hover:shadow"
                                      >
                                        <BsFileEarmarkText className="w-4 h-4" />
                                      </button>
                                    </Tooltip>
                                    <Tooltip
                                      content="Download Resume"
                                      placement="top"
                                      style="light"
                                    >
                                      <button
                                        onClick={() => handleDownloadResume(application)}
                                        disabled={downloadingResumeId === application.id?.toString()}
                                        className={`p-2 rounded-lg transition-all duration-200 shadow-sm hover:shadow
                                          ${
                                            downloadingResumeId === application.id?.toString()
                                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                              : 'bg-purple-50 text-purple-600 hover:bg-purple-100 hover:text-purple-700'
                                          }`}
                                      >
                                        {downloadingResumeId === application.id?.toString() ? (
                                          <TbLoader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                          <MdDownload className="w-4 h-4" />
                                        )}
                                      </button>
                                    </Tooltip>
                                  </>
                                )}
                              </div>
                            </td>
                            <td className="py-3 px-3 text-sm text-gray-600">
                              {application.refference_id}
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <button
                                  onClick={() => handleViewDetails(application)}
                                  className="text-sm text-gray-800 font-medium hover:text-blue-700 transition-colors text-left mb-1"
                                >
                                  {application.name || 'N/A'}
                                </button>
                                <span className="text-xs text-gray-500">
                                  {application.job_title || 'No job title'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-col">
                                <span className="text-sm text-gray-600 mb-1">
                                  {application.email || 'N/A'}
                                </span>
                                <span className="text-sm text-gray-600">
                                  {application.mobile || 'N/A'}
                                </span>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusInfo.color}`}
                              >
                                {statusInfo.text}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="py-8 text-center">
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
                              No career applications found
                            </p>
                            <p className="text-sm text-gray-500 mb-4">
                              {filters.search || filters.status || filters.academic_id
                                ? 'Try adjusting your search criteria'
                                : 'No applications available'}
                            </p>
                            {(filters.search || filters.status || filters.academic_id) && (
                              <Button
                                onClick={handleClearFilters}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Clear All Filters
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
          {applications.length > 0 && (
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
        </div>
      </div>

      {/* Details Modal */}
      <DetailsModal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, data: null })}
        application={detailsModal.data}
      />

      {/* Edit Modal */}
      <EditModal
        isOpen={editModal.isOpen}
        onClose={() => setEditModal({ isOpen: false, data: null })}
        application={editModal.data}
        onUpdate={fetchApplications}
      />

      {/* Preview Modal */}
{previewModal.isOpen && (
  <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
    
    {/* MODAL CONTAINER */}
    <div
      className={`
        bg-white flex flex-col transition-all duration-300
        ${previewModal.isMaximized
          ? 'w-screen h-screen rounded-none'
          : 'w-[90vw] max-w-6xl h-[85vh] rounded-xl'
        }
      `}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <h3 className="font-semibold text-lg truncate max-w-md">
            Documents Preview – {previewModal.name}
          </h3>

          {previewModal.filename && (
            <span className="text-xs bg-gray-100 px-2 py-1 rounded">
              {previewModal.filename.split('.').pop()?.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex gap-2">
          {/* MAX / MIN */}
          <button
            onClick={() =>
              setPreviewModal(p => ({
                ...p,
                isMaximized: !p.isMaximized,
              }))
            }
            className="p-2 rounded hover:bg-gray-100"
            title={previewModal.isMaximized ? 'Minimize' : 'Maximize'}
          >
            {previewModal.isMaximized ? '🗗' : '🗖'}
          </button>

          {/* CLOSE */}
          <button
            onClick={() =>
              setPreviewModal({
                isOpen: false,
                isMaximized: false,
                isLoading: false,
                name: '',
                url: '',
                filename: '',
                type: '',
                documents: [],
              })
            }
            className="p-2 rounded-full hover:bg-red-100 text-red-600"
          >
            ✕
          </button>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 relative overflow-hidden bg-gray-50">
        {previewModal.isLoading && (
          <div className="absolute inset-0 bg-white/80 z-10 flex items-center justify-center">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        <div className="h-full w-full overflow-auto p-4">
          {/* Loading Overlay */}
      {previewModal.isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 z-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      )}
      
      <div className="flex-1 overflow-auto p-4">
        {previewModal.url ? (() => {
          const getFileExtension = (url: string) => {
            return url.split('.').pop()?.toLowerCase() || '';
          };

          const ext = getFileExtension(previewModal.url);

          {/* 1️⃣ IMAGE PREVIEW */}
          if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(ext)) {
            return (
              <div className="flex flex-col items-center justify-center h-full">
                <div className="relative group h-full w-full flex items-center justify-center">
                  {previewModal.isLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      <img
                        src={previewModal.url}
                        alt={previewModal.filename}
                        className="max-h-full max-w-full object-contain rounded-lg shadow-lg border border-gray-200"
                        onLoad={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                        onError={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                      />
                      {/* Image Zoom Controls */}
                      <div className="absolute bottom-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => window.open(previewModal.url, '_blank')}
                          className="bg-white text-gray-700 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          title="Open image in new tab"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </button>
                        <button
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = previewModal.url;
                            link.download = previewModal.filename;
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                          }}
                          className="bg-white text-gray-700 p-2 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                          title="Download image"
                        >
                          <MdDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {!previewModal.isLoading && (
                  <p className="mt-4 text-sm text-gray-500 text-center">
                    {previewModal.filename} • {ext.toUpperCase()}
                  </p>
                )}
              </div>
            );
          }

          {/* 2️⃣ PDF PREVIEW */}
          if (ext === 'pdf') {
            return (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    PDF Document • {previewModal.filename}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(previewModal.url, '_blank')}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open in new tab
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewModal.url;
                        link.download = previewModal.filename;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                    >
                      <MdDownload className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex-1 border rounded-lg shadow-inner overflow-hidden bg-white relative">
                  {previewModal.isLoading && (
                    <div className="absolute inset-0 bg-white flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-sm text-gray-600">Loading PDF...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(
                      previewModal.url
                    )}&embedded=true`}
                    className="w-full h-[75vh]"
                    title="PDF Preview"
                    onLoad={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                    onError={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                  />
                </div>
              </div>
            );
          }

          {/* 3️⃣ OFFICE FILE PREVIEW */}
          if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(ext)) {
            return (
              <div className="flex flex-col h-full w-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    Office Document • {previewModal.filename}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(previewModal.url, '_blank')}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Open in new tab
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewModal.url;
                        link.download = previewModal.filename;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                    >
                      <MdDownload className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex-1 border rounded-lg shadow-inner overflow-hidden bg-white relative">
                  {previewModal.isLoading && (
                    <div className="absolute inset-0 bg-white flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-sm text-gray-600">Loading document...</p>
                      </div>
                    </div>
                  )}
                  <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                      previewModal.url
                    )}`}
                    className="w-full h-full"
                    title="Office Document Preview"
                    onLoad={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                    onError={() => setPreviewModal(prev => ({ ...prev, isLoading: false }))}
                  />
                </div>
              </div>
            );
          }

          {/* 4️⃣ TEXT FILE PREVIEW */}
          if (['txt', 'csv', 'json', 'xml', 'html', 'css', 'js'].includes(ext)) {
            return (
              <div className="flex flex-col h-full">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">
                    Text File • {previewModal.filename}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => window.open(previewModal.url, '_blank')}
                      className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                    >
                      Open in new tab
                    </button>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = previewModal.url;
                        link.download = previewModal.filename;
                        document.body.appendChild(link);
                        link.click();
                        link.remove();
                      }}
                      className="text-sm text-green-600 hover:text-green-800 flex items-center"
                    >
                      <MdDownload className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="flex-1 border rounded-lg p-4 overflow-auto bg-gray-50 font-mono text-sm relative">
                  {previewModal.isLoading ? (
                    <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center">
                      <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                        <p className="text-sm text-gray-600">Loading text content...</p>
                      </div>
                    </div>
                  ) : (
                    <pre className="whitespace-pre-wrap">
                      Loading text content...
                    </pre>
                  )}
                </div>
              </div>
            );
          }

          {/* 5️⃣ UNSUPPORTED FILE */}
          return (
            <div className="flex flex-col items-center justify-center py-12 h-full">
              <BsFileEarmarkText className="w-20 h-20 text-gray-300 mb-4" />
              <p className="text-gray-600 mb-2 font-medium">
                File type not supported for preview
              </p>
              <p className="text-sm text-gray-500 mb-6">
                {previewModal.filename} • {ext.toUpperCase() || 'UNKNOWN'}
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => window.open(previewModal.url, '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open File
                </button>
                <button
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = previewModal.url;
                    link.download = previewModal.filename;
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                  }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center transition-colors"
                >
                  <MdDownload className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          );
        })() : (
          <div className="flex flex-col items-center justify-center py-10 h-full">
            <BsFileEarmarkText className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-600 mb-2">No document available</p>
            <p className="text-sm text-gray-500">The document URL is empty or invalid</p>
          </div>
        )}
      </div>
        </div>
      </div>
    </div>
  </div>
)}

    </>
  );
};

export default CareerManagementTable;