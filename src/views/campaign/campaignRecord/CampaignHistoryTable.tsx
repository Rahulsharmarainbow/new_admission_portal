import React, { useState, useEffect } from 'react';
import { MdDeleteForever, MdFileDownload } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { BsPlusLg, BsSearch } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, TextInput, Tooltip } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import RouteDropdown from 'src/Frontend/Common/RouteDropdown';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import { HiChevronDown } from 'react-icons/hi';
import { useDashboardFilters } from 'src/hook/DashboardFilterContext';
import img1 from '../../../../public/Images/top-error-shape.png';
import img2 from '../../../../public/Images/top-info-shape.png';
import img3 from '../../../../public/Images/top-warning-shape.png';
import img4 from '../../../../public/Images/top-warning-shape.png';
import img5 from '../../../../public/Images/top-warning-shape.png';
import img6 from '../../../../public/Images/top-warning-shape.png';
import img7 from '../../../../public/Images/top-warning-shape.png';

interface CampaignHistory {
  id: number;
  name: string;
  compaign_type: number;
  academic_id: number;
  degree_id: number;
  send_by: number;
  sent: number;
  failed: number;
  time: string;
  academic_name: string;
  degree_name: string;
  admin_name: string | null;
  target: string;
}

// Remove the local Filters interface and use dashboard filters

const CampaignHistoryTable: React.FC = () => {
  const { user } = useAuth();
  const { filters: dashboardFilters, updateFilter } = useDashboardFilters();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [localFilters, setLocalFilters] = useState({
    page: 0,
    rowsPerPage: 10,
    order: 'desc' as 'asc' | 'desc',
    orderBy: 'id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(localFilters.search, 500);

  const getYearOptions = (yearsBack: number = 5): string[] => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];

    for (let y = currentYear; y >= currentYear - yearsBack; y--) {
      years.push(String(y));
    }

    return years;
  };

  const handleYearChange = (year: string) => {
    updateFilter('year', year);
    setLocalFilters(prev => ({
      ...prev,
      page: 0 // Reset to first page when changing year
    }));
  };

  const handleAcademicChange = (academicId: string) => {
    updateFilter('academic', academicId);
    setLocalFilters(prev => ({
      ...prev,
      page: 0 // Reset to first page when changing academic
    }));
  };

  const handleFormSelect = (formId: string) => {
    updateFilter('form_id', formId);
    setLocalFilters(prev => ({
      ...prev,
      page: 0 // Reset to first page when changing form
    }));
  };

  const yearOptions = getYearOptions(5);

  const fetchCampaignHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Campaign/get-template-history`,
        {
          s_id: user?.id,
          academic_id: dashboardFilters.academic || undefined,
          year: dashboardFilters.year || undefined,
          form_id: dashboardFilters.form_id || undefined,
          page: localFilters.page,
          rowsPerPage: localFilters.rowsPerPage,
          order: localFilters.order,
          orderBy: localFilters.orderBy,
          search: localFilters.search,
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
        setCampaigns(response.data.rows || []);
        setTotal(response.data.total || 0);
        if(localFilters.page==0){
          setDashboardData(response.data.counting);
        }
      }
    } catch (error) {
      console.error('Error fetching campaign history:', error);
      toast.error('Failed to fetch campaign history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Reset to page 0 when dashboard filters change
  setLocalFilters(prev => ({
    ...prev,
    page: 0
  }));
}, [dashboardFilters.academic, dashboardFilters.year, dashboardFilters.form_id]);

  useEffect(() => {
    fetchCampaignHistory();
  }, [
    localFilters.page, 
    localFilters.rowsPerPage, 
    localFilters.order, 
    localFilters.orderBy, 
    debouncedSearch,
    dashboardFilters.academic,
    dashboardFilters.year,
    dashboardFilters.form_id
  ]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setLocalFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setLocalFilters((prev) => ({
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
    setLocalFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setLocalFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle export campaign record
  const handleExport = async (campaignId: number) => {
  try {
    const response = await axios.post(
      `${apiUrl}/${user?.role}/Campaign/Export-Campaign-record`,
      {
        s_id: user?.id,
        compaign_record_id: campaignId,
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
        // Remove responseType: 'blob' since we're getting JSON
      },
    );

    if (response.data.success) {
      // Create download link from base64
      const link = document.createElement('a');
      link.href = `data:${response.data.filetype};base64,${response.data.file}`;
      link.download = response.data.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(response.data.message || 'Campaign record exported successfully!');
    } else {
      toast.error(response.data.error || 'Failed to export campaign record');
    }
  } catch (error: any) {
    console.error('Error exporting campaign record:', error);
    
    if (error.response?.data?.error) {
      toast.error(error.response.data.error);
    } else {
      toast.error('Failed to export campaign record');
    }
  }
};

  const ApplicationCard: React.FC<ApplicationCardProps> = ({
  title,
  value,
  icon,
  bgColor,
  image,
  subtitle,
  onClick,
  isClickable = false
}) => {
  return (
    <div
      className={`rounded-lg shadow-lg p-6 relative overflow-hidden border-0 transition-all duration-300 ${
        isClickable ? 'cursor-pointer hover:shadow-xl transform hover:-translate-y-1' : 'cursor-default'
      }`}
      style={{ backgroundColor: bgColor }}
      onClick={isClickable ? onClick : undefined}
    >
      <img
        alt="decoration"
        loading="lazy"
        width="59"
        height="81"
        decoding="async"
        className="absolute top-0 right-0"
        src={image}
      />
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
            {icon}
          </div>
        </div>
        <h4 className="text-2xl font-bold text-white mb-1">{value}</h4>
        <span className="text-sm text-white text-opacity-90 font-medium">
          {title}
        </span>
      </div>
    </div>
  );
};

  // Get campaign type label
  const getCampaignTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return 'WhatsApp';
      case 2:
        return 'Email';
      case 3:
        return 'SMS';
      default:
        return 'Unknown';
    }
  };

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <>
      
       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Dynamic Year Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={dashboardFilters.year || ''}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full sm:w-auto min-w-[250px] px-3 py-2.5 border border-gray-300 rounded-md bg-white 
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
              >
                <option value="">Select Year</option>
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <HiChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Academic Dropdown */}
            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
              <div className="relative w-full sm:w-auto">
              <AllAcademicsDropdown
                name="academic"
                value={dashboardFilters.academic || ''}
                onChange={handleAcademicChange}
                includeAllOption
                label=""
                className="min-w-[250px] text-sm"
              />
            </div>
            )}

            {/* Route Dropdown */}
            <RouteDropdown
              academicId={dashboardFilters.academic}
              value={dashboardFilters.form_id || ''}
              onChange={handleFormSelect}
              className="min-w-[250px] text-sm"
              isRequired
              placeholder={dashboardFilters.academic ? "Select form page..." : "Select academic first"}
              disabled={!dashboardFilters.academic}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Total Campaigns Summary */}
            <div className="lg:col-span-1 col-span-1">
              <ApplicationCard
                title="Total Campaigns"
                value={
                  (dashboardData?.whatsapp_success || 0) +
                  (dashboardData?.sms_success || 0) +
                  (dashboardData?.email_success || 0) +
                  (dashboardData?.whatsapp_failed || 0) +
                  (dashboardData?.sms_failed || 0) +
                  (dashboardData?.email_failed || 0)
                }
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  </svg>
                }
                bgColor="#5856D6"
                image={img7}
                subtitle="All campaign messages sent"
              />
            </div>

            {/* WhatsApp Campaigns */}
            <div className="lg:col-span-1 col-span-1">
              <ApplicationCard
                title="WhatsApp Success"
                value={dashboardData?.whatsapp_success || 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                  </svg>
                }
                bgColor="#007AFF"
                image={img2}
                subtitle="Successful WhatsApp messages"
                percentage={dashboardData?.whatsapp_success_percentage || 0}
              />
            </div>

            <div className="lg:col-span-1 col-span-1">
              <ApplicationCard
                title="WhatsApp Failed"
                value={dashboardData?.whatsapp_failed || 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                    <line x1="9" y1="9" x2="15" y2="15"></line>
                    <line x1="15" y1="9" x2="9" y2="15"></line>
                  </svg>
                }
                bgColor="#007AFF"
                image={img1}
                subtitle="Failed WhatsApp messages"
                percentage={dashboardData?.whatsapp_failed_percentage || 0}
              />
            </div>

            {/* SMS Campaigns */}
            <div className="lg:col-span-1 col-span-1">
              <ApplicationCard
                title="SMS Success"
                value={dashboardData?.sms_success || 0}
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                    <line x1="7" y1="2" x2="7" y2="22"></line>
                    <line x1="17" y1="2" x2="17" y2="22"></line>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                  </svg>
                }
                bgColor="#5856D6"
                image={img3}
                subtitle="Successful SMS messages"
                percentage={dashboardData?.sms_success_percentage || 0}
              />
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 col-span-1">
            <ApplicationCard
              title="SMS Failed"
              value={dashboardData?.sms_failed || 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect>
                  <line x1="7" y1="2" x2="7" y2="22"></line>
                  <line x1="17" y1="2" x2="17" y2="22"></line>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              }
              bgColor="#5856D6"
              image={img4}
              subtitle="Failed SMS messages"
              percentage={dashboardData?.sms_failed_percentage || 0}
            />
          </div>

          {/* Email Campaigns */}
          <div className="lg:col-span-1 col-span-1">
            <ApplicationCard
              title="Email Success"
              value={dashboardData?.email_success || 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              }
              bgColor="#AF52DE"
              image={img5}
              subtitle="Successful emails sent"
              percentage={dashboardData?.email_success_percentage || 0}
            />
          </div>

          <div className="lg:col-span-1 col-span-1">
            <ApplicationCard
              title="Email Failed"
              value={dashboardData?.email_failed || 0}
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                  <line x1="9" y1="9" x2="15" y2="15"></line>
                  <line x1="15" y1="9" x2="9" y2="15"></line>
                </svg>
              }
              bgColor="#AF52DE"
              image={img6}
              subtitle="Failed emails"
              percentage={dashboardData?.email_failed_percentage || 0}
            />
          </div>
        </div>
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Dashboard Filters Section */}
       
              
        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <TextInput
                type="text"
                placeholder="Search by campaign name or target..."
                value={localFilters.search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Note about dashboard filters */}
            <div className="flex items-center text-sm text-gray-500">
              <span className="bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                Filters: {dashboardFilters.year ? `Year: ${dashboardFilters.year}` : ''} 
                {dashboardFilters.academic ? ` | Academic: ${dashboardFilters.academic}` : ''}
                {dashboardFilters.form_id ? ` | Form: ${dashboardFilters.form_id}` : ''}
              </span>
            </div>
          </div>
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
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Academic Name
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('compaign_type')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Campaign Type</span>
                        {getSortIcon('compaign_type')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Done By
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('sent')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Success</span>
                        {getSortIcon('sent')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('failed')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Failed</span>
                        {getSortIcon('failed')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('time')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created At</span>
                        {getSortIcon('time')}
                      </div>
                    </th>
                    <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Export
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {campaigns.length > 0 ? (
                    campaigns.map((campaign, index) => (
                      <tr key={campaign.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {localFilters.page * localFilters.rowsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          <Tooltip
                            content={campaign.academic_name}
                            placement="top"
                            style="light"
                            animation="duration-300"
                          >
                            <span className="truncate max-w-[200px] block">
                              {campaign.academic_name.length > 35
                                ? `${campaign.academic_name.substring(0, 35)}...`
                                : campaign.academic_name}
                            </span>
                          </Tooltip>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            campaign.compaign_type === 1 
                              ? 'bg-blue-100 text-blue-800' 
                              : campaign.compaign_type === 2
                              ? 'bg-green-100 text-green-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {getCampaignTypeLabel(campaign.compaign_type)}
                          </span>
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {campaign.admin_name || 'System'}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-green-600">
                          {campaign.sent}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-red-600">
                          {campaign.failed}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(campaign.time)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <Tooltip content="Export" placement="top" style='light'>
                            <button
                              onClick={() => handleExport(campaign.id)}
                              className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                            >
                              <MdFileDownload className="w-5 h-5" />
                            </button>
                          </Tooltip>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 px-6 text-center">
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
                          <p className="text-lg font-medium text-gray-600 mb-2">No campaign history found</p>
                          <p className="text-sm text-gray-500">
                            {localFilters.search || dashboardFilters.academic || dashboardFilters.year || dashboardFilters.form_id
                              ? 'Try adjusting your search criteria or dashboard filters'
                              : 'No campaign history available'}
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
        {campaigns.length > 0 && (
          <div className="mt-6">
            <Pagination
              currentPage={localFilters.page + 1}
              totalPages={Math.ceil(total / localFilters.rowsPerPage)}
              totalItems={total}
              rowsPerPage={localFilters.rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CampaignHistoryTable;