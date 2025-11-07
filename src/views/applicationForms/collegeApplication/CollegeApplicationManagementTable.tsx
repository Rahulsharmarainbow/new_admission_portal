import React, { useState, useEffect } from 'react';
import { MdOutlineRemoveRedEye, MdFilterList, MdSort } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { BsDownload, BsSearch, BsX } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, TextInput } from 'flowbite-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import ApplicationDetailModal from '../schoolApplications/components/ApplicationDetailModal';
import CollegeFilterSidebar from './components/CollegeFilterSidebar';
import { useNavigate } from 'react-router';

interface Application {
  id: number;
  applicant_name: string;
  candidate_pic: string;
  candidate_signature: string;
  roll_no: string;
  academic_name: string;
  degree_name: string;
  payment_status: string;
  year: number;
  email: string;
  mobile_no: string;
  gender: string;
  created_at: string;
  academic_id?: number;
  candidate_details?: any;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  year: string;
  degree: string;
  paymentStatus: string;
  applicationNumber: string;
  transactions_id: string;
  amounts: string;
  gender: string;
  special: string;
  annual: string;
  state: string;
  district: string;
  localarea: string;
  caste: string;
  contact: string;
  fromDate: string;
  toDate: string;
  email: string;
}

interface ClassOption {
  value: string;
  label: string;
}

interface CdFilters {
  [key: string]: string[]; // Dynamic filter structure for API
}

const CollegeApplicationManagementTable: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic_id: '',
    year: '',
    degree: '',
    paymentStatus: '',
    applicationNumber: '',
    transactions_id: '',
    amounts: '',
    gender: '',
    special: '',
    annual: '',
    state: '',
    district: '',
    localarea: '',
    caste: '',
    contact: '',
    fromDate: '',
    toDate: '',
    email: '',
  });
  const [cdFilters, setCdFilters] = useState<CdFilters>({});
  const [total, setTotal] = useState(0);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [classOptions, setClassOptions] = useState<ClassOption[]>([]);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [showFilterSidebar, setShowFilterSidebar] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const apiUrl = import.meta.env.VITE_API_URL;
  const apiAssetsUrl = import.meta.env.VITE_ASSET_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Year options for dropdown
  const yearOptions = [
    { value: '2025', label: '2025' },
    { value: '2024', label: '2024' },
    { value: '2023', label: '2023' },
    { value: 'archive', label: 'Archive Data' },
  ];

  // Calculate active filters count
  useEffect(() => {
    let count = 0;
    if (filters.academic_id && user?.role != "CustomerAdmin") count++;
    if (filters.year) count++;
    if (filters.degree) count++;
    if (filters.gender) count++;
    if (filters.paymentStatus) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    if (filters.contact) count++;
    if (filters.email) count++;
    if (filters.applicationNumber) count++;
    if (filters.state) count++;
    if (filters.district) count++;
    if (filters.caste) count++;
    if (filters.annual) count++;
    if (filters.special) count++;
    if (filters.localarea) count++;
    
    // Count dynamic cdFilters
    Object.keys(cdFilters).forEach(key => {
      if (cdFilters[key] && cdFilters[key].length > 0) {
        count++;
      }
    });
    
    setActiveFiltersCount(count);
  }, [filters, cdFilters]);

  // Fetch applications data
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const requestBody: any = {
        academic_id: filters.academic_id || undefined,
        year: filters.year || undefined,
        degree: filters.degree || undefined,
        paymentStatus: filters.paymentStatus || undefined,
        applicationNumber: filters.applicationNumber || undefined,
        transactions_id: filters.transactions_id || undefined,
        amounts: filters.amounts || undefined,
        gender: filters.gender || undefined,
        special: filters.special || undefined,
        annual: filters.annual || undefined,
        state: filters.state || undefined,
        district: filters.district || undefined,
        localarea: filters.localarea || undefined,
        caste: filters.caste || undefined,
        contact: filters.contact || undefined,
        email: filters.email || undefined,
        fromDate: filters.fromDate || undefined,
        toDate: filters.toDate || undefined,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
        search: filters.search,
      };

      // Add cdFilters if they exist
      if (Object.keys(cdFilters).length > 0) {
        requestBody.cdFilters = cdFilters;
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/get-college-applications`,
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
        setApplications(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [
    filters.page, 
    filters.rowsPerPage, 
    filters.order, 
    filters.orderBy, 
    debouncedSearch, 
    filters.academic_id,
    filters.year,
    filters.degree,
    filters.gender,
    filters.paymentStatus,
    filters.fromDate,
    filters.toDate,
    filters.contact,
    filters.email,
    filters.applicationNumber,
    filters.state,
    filters.district,
    filters.caste,
    filters.annual,
    filters.special,
    filters.localarea,
    cdFilters
  ]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle year change
  const handleYearChange = (selectedOption: any) => {
    setFilters((prev) => ({
      ...prev,
      year: selectedOption?.value || '',
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
  const handleViewDetails = (application: Application) => {
    navigate(`/${user?.role}/application-details/${application.id}`);
  };

  // Handle edit
  const handleEdit = (application: Application) => {
    navigate(`/${user?.role}/college-applications/edit/${application.id}`);
  };

  // Handle download Excel
  const handleDownloadExcel = async () => {
    try {
      setLoading(true);
      toast.loading('Preparing Excel file...', { id: 'download-excel' });

      const requestBody: any = {
        academic_id: filters.academic_id || "",
        s_id: user?.id || "",
        degree: filters.degree || "",
        startDate: filters.fromDate || "",
        endDate: filters.toDate || "",
        caste: filters.caste || "",
        annual: filters.annual || "",
        gender: filters.gender || "",
        special: filters.special || "",
        state: filters.state || "",
        district: filters.district || "",
        localarea: filters.localarea || "",
        contact: filters.contact || "",
        applicationNumber: filters.applicationNumber || "",
        paymentStatus: filters.paymentStatus || "",
        email: filters.search.includes('@') ? filters.search : "",
      };

      // Add cdFilters if they exist
      if (Object.keys(cdFilters).length > 0) {
        requestBody.cdFilters = cdFilters;
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Applications/Export-college-Applications`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success && response.data.data) {
        const { filename, excel_base64 } = response.data.data;
        
        const binaryString = atob(excel_base64);
        const bytes = new Uint8Array(binaryString.length);
        
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        
        const blob = new Blob([bytes], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', filename || 'college-applications.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);

        toast.success('Excel file downloaded successfully!', { id: 'download-excel' });
      } else {
        throw new Error(response.data.message || 'Failed to generate Excel file');
      }
      
    } catch (error: any) {
      console.error('Error downloading Excel:', error);
      
      if (error.response?.status === 404) {
        toast.error('No data found to export', { id: 'download-excel' });
      } else if (error.response?.status === 500) {
        toast.error('Server error while generating Excel file', { id: 'download-excel' });
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message, { id: 'download-excel' });
      } else {
        toast.error('Failed to download Excel file', { id: 'download-excel' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle filter change from sidebar
  const handleFilterChange = (newFilters: Partial<Filters>, newCdFilters?: CdFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 0
    }));
    
    if (newCdFilters) {
      setCdFilters(newCdFilters);
    }
  };

  // Clear all filters
  const handleClearFilters = () => {
    setFilters({
      page: 0,
      rowsPerPage: 10,
      order: 'desc',
      orderBy: 'id',
      search: '',
      academic_id: '',
      year: '',
      degree: '',
      paymentStatus: '',
      applicationNumber: '',
      transactions_id: '',
      amounts: '',
      gender: '',
      special: '',
      annual: '',
      state: '',
      district: '',
      localarea: '',
      caste: '',
      contact: '',
      fromDate: '',
      toDate: '',
      email: '',
    });
    setCdFilters({});
    setSort({ key: 'id', direction: 'desc' });
  };

  // Get payment status text and color
  const getPaymentStatus = (status: string) => {
    switch (status) {
      case '1':
        return { text: 'captured', color: 'text-green-600 bg-green-50' };
      case '0':
        return { text: 'intilized', color: 'text-red-600 bg-red-50' };
      default:
        return { text: 'intilized ', color: 'text-gray-600 bg-gray-50' };
    }
  };

  return (
    <>
      <div className="mb-6">
        <BreadcrumbHeader
          title="College Applications"
          paths={[{ name: 'College Applications', link: '#' }]}
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
                  placeholder="Search by name or mobile..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                             bg-white focus:ring-blue-500 focus:border-blue-500 
                             placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Year Dropdown */}
              <div className="w-full sm:w-48">
                <Select
                  options={yearOptions}
                  value={yearOptions.find(option => option.value === filters.year)}
                  onChange={handleYearChange}
                  placeholder="Select Year"
                  isClearable
                  className="react-select-container"
                  classNamePrefix="react-select"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Filter Button with Badge - Only Icon */}
              <Button
                onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 relative p-3 hover:text-blue-600"
              >
                <MdFilterList className="w-5 h-5" />
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </Button>

              {/* Download Button */}
              <Button
                onClick={handleDownloadExcel}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white"
              >
                <BsDownload className="w-4 h-4" />
                Export
              </Button>
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
                      <th className="w-16 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        S.NO
                      </th>
                      <th 
                        className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px] cursor-pointer select-none"
                        onClick={() => handleSort('applicant_name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Applicant Name</span>
                          {getSortIcon('applicant_name')}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                        Candidate Pic
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[140px]">
                        Signature
                      </th>
                      <th
                        className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none min-w-[100px]"
                        onClick={() => handleSort('roll_no')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Roll No</span>
                          {getSortIcon('roll_no')}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[150px]">
                        Academic Name
                      </th>
                      <th 
                        className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px] cursor-pointer select-none"
                        onClick={() => handleSort('degree_name')}
                      >
                        <div className="flex items-center space-x-1">
                          <span>Degree</span>
                          {getSortIcon('degree_name')}
                        </div>
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider min-w-[120px]">
                        Payment Status
                      </th>
                      <th className="w-28 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {applications.length > 0 ? (
                      applications.map((application, index) => {
                        const paymentStatus = getPaymentStatus(application.payment_status);
                        return (
                          <tr key={application.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="py-4 px-4 text-sm font-medium text-gray-900">
                              {filters.page * filters.rowsPerPage + index + 1}
                            </td>
                            <td className="py-4 px-4 text-sm font-medium text-gray-900 min-w-[150px]">
                              <div className="truncate max-w-[140px]" title={application.applicant_name}>
                                {application.applicant_name}
                              </div>
                            </td>
                            <td className="py-4 px-4 min-w-[120px]">
                              {application.candidate_pic ? (
                                <img
                                  src={`${apiAssetsUrl}/${application.candidate_pic}`}
                                  alt="Candidate"
                                  className="w-12 h-12 rounded-full object-cover border mx-auto"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center border mx-auto ${application.candidate_pic ? 'hidden' : 'flex'}`}>
                                <span className="text-xs text-gray-500">No Image</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 min-w-[140px]">
                              {application.candidate_signature ? (
                                <img
                                  src={`${apiAssetsUrl}/${application.candidate_signature}`}
                                  alt="Signature"
                                  className="w-20 h-10 object-contain border mx-auto"
                                  onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                  }}
                                />
                              ) : null}
                              <div className={`w-20 h-10 bg-gray-200 flex items-center justify-center border rounded mx-auto ${application.candidate_signature ? 'hidden' : 'flex'}`}>
                                <span className="text-xs text-gray-500">No Signature</span>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 min-w-[100px]">
                              <div className="truncate max-w-[90px]" title={application.roll_no}>
                                {application.roll_no || 'N/A'}
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 min-w-[150px]">
                              <Tooltip content={application.academic_name} placement="top" style="light">
                                <div className="truncate max-w-[140px]">
                                  {application.academic_name || 'N/A'}
                                </div>
                              </Tooltip>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 min-w-[120px]">
                              <div className="truncate max-w-[110px]" title={application.degree_name}>
                                {application.degree_name || 'N/A'}
                              </div>
                            </td>
                            <td className="py-4 px-4 min-w-[120px]">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${paymentStatus.color}`}>
                                {paymentStatus.text}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-center w-28">
                              <div className="flex items-center justify-center space-x-2">
                                <Tooltip content="View Details" placement="top" style='light'>
                                  <button
                                    onClick={() => handleViewDetails(application)}
                                    className="text-orange-600 hover:text-orange-800 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                                  >
                                    <MdOutlineRemoveRedEye className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                                <Tooltip content="Edit" placement="top" style='light'>
                                  <button
                                    onClick={() => handleEdit(application)}
                                    className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                                  >
                                    <TbEdit className="w-5 h-5" />
                                  </button>
                                </Tooltip>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={9} className="py-8 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-500">
                            <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="text-lg font-medium text-gray-600 mb-2">No applications found</p>
                            <p className="text-sm text-gray-500 mb-4">
                              {filters.search || activeFiltersCount > 0 ? 'Try adjusting your search criteria' : 'No applications available'}
                            </p>
                            {activeFiltersCount > 0 && (
                              <Button onClick={handleClearFilters} className="bg-blue-600 hover:bg-blue-700 text-white">
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

        {/* Filter Sidebar */}
        <CollegeFilterSidebar
          isOpen={showFilterSidebar}
          onClose={() => setShowFilterSidebar(false)}
          filters={filters}
          cdFilters={cdFilters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />
      </div>
     
      {/* Application Detail Modal */}
      <ApplicationDetailModal
        isOpen={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplication(null);
        }}
        application={selectedApplication}
      />

      <style jsx>{`
        .react-select-container :global(.react-select__control) {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          min-height: 42px;
          transition: all 0.2s;
        }
        
        .react-select-container :global(.react-select__control--is-focused) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </>
  );
};

export default CollegeApplicationManagementTable;