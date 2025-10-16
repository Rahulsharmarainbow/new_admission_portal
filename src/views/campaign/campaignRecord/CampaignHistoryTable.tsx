import React, { useState, useEffect } from 'react';
import { MdDeleteForever, MdFileDownload } from 'react-icons/md';
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

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
}

const CampaignHistoryTable: React.FC = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState<CampaignHistory[]>([]);
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
  const [campaignToDelete, setCampaignToDelete] = useState<number | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch campaign history data
  const fetchCampaignHistory = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Campaign/get-template-history`,
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
        setCampaigns(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching campaign history:', error);
      toast.error('Failed to fetch campaign history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaignHistory();
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
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
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
          responseType: 'blob', // Important for file download
        },
      );

      // Create a blob from the response data
      const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      
      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Get filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = `campaign_${campaignId}.xlsx`;
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/);
        if (filenameMatch && filenameMatch.length === 2) {
          filename = filenameMatch[1];
        }
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      link.remove();
      window.URL.revokeObjectURL(url);
      
      toast.success('Campaign record exported successfully!');
    } catch (error: any) {
      console.error('Error exporting campaign record:', error);
      toast.error('Failed to export campaign record');
    }
  };

  // Get campaign type label
  const getCampaignTypeLabel = (type: number): string => {
    switch (type) {
      case 1:
        return 'SMS';
      case 2:
        return 'WhatsApp';
      case 3:
        return 'Email';
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
      <div className="mb-6">
        <BreadcrumbHeader
          title="Campaign History"
          paths={[{ name: 'Campaign History', link: '#' }]}
        />
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar with Academic Dropdown */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by campaign name or target..."
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
                          {filters.page * filters.rowsPerPage + index + 1}
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
                          <Tooltip content="Export" placement="top">
                            <button
                              onClick={() => handleExport(campaign.id)}
                              className="text-green-600 hover:text-green-800 p-2 rounded-lg hover:bg-green-50 transition-colors"
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
                            {filters.search || filters.academic_id
                              ? 'Try adjusting your search criteria'
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
    </>
  );
};

export default CampaignHistoryTable;