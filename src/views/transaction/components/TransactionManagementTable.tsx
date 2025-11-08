import React, { useState, useEffect } from 'react';
import { BsSearch, BsDownload } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip } from 'flowbite-react';
import Select from 'react-select';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface Transaction {
  id: number;
  student_roll_no: string;
  application_roll_no: string;
  academic_name: string;
  academic_type: string;
  degree_name: string;
  payment_status: number;
  amount: string;
  transaction_id: string;
  created_at: string;
}


interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
  academic_id: string;
  status: string;
  startDate: string;
  endDate: string;
}

const statusOptions = [
  { value: '', label: 'All' },
  { value: '0', label: 'Initialized' },
  { value: '1', label: 'Captured' }
];

const TransactionManagementTable: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    academic_id: '',
    status: '',
    startDate: '',
    endDate: '',
  });
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch transactions data
  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Transactions/get-transactions`,
        {
          academic_id: filters.academic_id || undefined,
          startDate: filters.startDate || undefined,
          endDate: filters.endDate || undefined,
          status: filters.status ? parseInt(filters.status) : undefined,
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
        setTransactions(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.academic_id, filters.status, filters.startDate, filters.endDate]);

  // Fetch transaction details
  const fetchTransactionDetails = async (transactionId: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Transactions/get-details`,
        {
          id: transactionId,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching transaction details:', error);
      return null;
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

  // Handle academic filter change
  const handleAcademicChange = (academicId: string) => {
    setFilters((prev) => ({
      ...prev,
      academic_id: academicId,
      page: 0,
    }));
  };

  // Handle status filter change
  const handleStatusChange = (selectedOption: any) => {
    setFilters((prev) => ({
      ...prev,
      status: selectedOption?.value || '',
      page: 0,
    }));
  };

  // Handle date change
  const handleDateChange = (type: 'startDate' | 'endDate', value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
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

  // Handle download excel
  // const handleDownloadExcel = async () => {
  //   try {
  //     toast.loading('Preparing download...');
  //     // Add your Excel download logic here
  //     // This would typically call a different API endpoint for Excel export
  //     toast.success('Excel file downloaded successfully!');
  //   } catch (error) {
  //     console.error('Error downloading Excel:', error);
  //     toast.error('Failed to download Excel file');
  //   }
  // };

  // Update the handleDownloadExcel function
const handleDownloadExcel = async () => {
  try {
    const loadingToast = toast.loading('Preparing download...');
    
    const response = await axios.post(
      `${apiUrl}/${user?.role}/Transactions/export-transaction`,
      {
        s_id: "1", // You might want to make this dynamic based on your requirements
        academic_id: filters.academic_id || "",
        startDate: filters.startDate || "",
        endDate: filters.endDate || "",
        status: filters.status || "",
      },
      {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          accept: '/',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          'Content-Type': 'application/json',
        },
        responseType: 'json',
      }
    );

    toast.dismiss(loadingToast);

    if (response.data.success) {
      // Extract the base64 data and filename from the response
      const { excel_base64, filename } = response.data.data;
      
      // Convert base64 to blob
      const byteCharacters = atob(excel_base64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Excel file downloaded successfully!');
    } else {
      toast.error('Failed to prepare Excel file');
    }
  } catch (Downloading) {
    console.error('Error downloading Excel:', Downloading);
    toast.dismiss();
    toast.error('Failed to download Excel file');
  }
};

  // Get status badge
  const getStatusBadge = (status: number) => {
    const statusConfig = {
      0: { label: 'Initialized', color: 'bg-yellow-100 text-yellow-800' },
      1: { label: 'Captured', color: 'bg-green-100 text-green-800' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  return (
    <>
      <div className="mb-6">
        <BreadcrumbHeader
          title="Transactions"
          paths={[{ name: 'Transactions', link: '#' }]}
        />
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar with Academic Dropdown and Filters */}
        <div className="flex flex-col gap-4 mb-6">
          {/* Top Row: Search, Academic Dropdown, and Download Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* Search Input */}
              <div className="relative w-full sm:w-80">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <BsSearch className="w-4 h-4 text-gray-500" />
                </div>
                <input
                  type="text"
                  placeholder="Search by transaction ID or registration ID..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                         bg-white focus:ring-blue-500 focus:border-blue-500 
                         placeholder-gray-400 transition-all duration-200"
                />
              </div>

              {/* Academic Dropdown */}
               {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  (<div className="w-full sm:w-64">
                <AcademicDropdown
                  value={filters.academic_id}
                  onChange={handleAcademicChange}
                  placeholder="Select school..."
                  includeAllOption={true}
                  label=""
                />
              </div>)}
            </div>

            {/* Download Button */}
            <Button
              onClick={handleDownloadExcel}
              className="whitespace-nowrap bg-green-600 hover:bg-green-700 text-white"
            >
              <BsDownload className="mr-2 w-4 h-4" />
              Excel
            </Button>
          </div>

          {/* Bottom Row: Date Selectors and Status Dropdown */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Date Selectors */}
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                  From Date:
                </label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleDateChange('startDate', e.target.value)}
                  className="block w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg 
                         bg-white focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

            {/* To Date Field */}
<div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
    To Date:
  </label>
  <input
    type="date"
    value={filters.endDate}
    onChange={(e) => handleDateChange('endDate', e.target.value)}
    className="block w-full sm:w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg 
           bg-white focus:ring-blue-500 focus:border-blue-500"
  />
</div>

{/* Payment Status Field (same line style) */}
<div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center w-full sm:w-64">
  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
    Payment Status:
  </label>
  <div className="w-full sm:w-48">
    <Select
      options={statusOptions}
      value={statusOptions.find(option => option.value === filters.status)}
      onChange={handleStatusChange}
      placeholder="Select status..."
      isSearchable={true}
      className="react-select-container"
      classNamePrefix="react-select"
    />
  </div>
</div>

            </div>

            {/* Status Dropdown */}
           
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
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('transaction_id')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Transaction ID</span>
                        {getSortIcon('transaction_id')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('application_roll_no')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Registration ID</span>
                        {getSortIcon('application_roll_no')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('amount')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Amount (₹)</span>
                        {getSortIcon('amount')}
                      </div>
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Payment Date</span>
                        {getSortIcon('created_at')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {transactions.length > 0 ? (
                    transactions.map((transaction, index) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.transaction_id || (
                            <span className="text-gray-400">Not available</span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {transaction.application_roll_no || (
                            <span className="text-gray-400">Not assigned</span>
                          )}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ₹{transaction.amount}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(transaction.created_at)}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          {getStatusBadge(transaction.payment_status)}
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
                          <p className="text-lg font-medium text-gray-600 mb-2">No transactions found</p>
                          <p className="text-sm text-gray-500">
                            {filters.search || filters.academic_id || filters.status
                              ? 'Try adjusting your search criteria'
                              : 'No transactions available'}
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
        {transactions.length > 0 && (
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

      {/* Add custom styles for react-select */}
      <style jsx>{`
        .react-select-container :global(.react-select__control) {
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          min-height: 42px;
          font-size: 0.875rem;
        }
        .react-select-container :global(.react-select__control:hover) {
          border-color: #d1d5db;
        }
        .react-select-container :global(.react-select__control--is-focused) {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
      `}</style>
    </>
  );
};

export default TransactionManagementTable;