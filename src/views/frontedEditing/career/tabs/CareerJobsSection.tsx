import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Button, 
  TextInput, 
  Checkbox,
  Spinner,
  Select
} from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { HiPlus, HiSearch } from 'react-icons/hi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { Pagination } from 'src/Frontend/Common/Pagination';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import AddEditJobModal from './AddEditJobModal ';
import { useDebounce } from 'src/hook/useDebounce';

interface CareerJobData {
  id: number;
  academic_id: number;
  job_title: string;
  company_name: string;
  job_location: string;
  job_type: string;
  experience: string;
  description: string;
  requirements: string;
  salary: string;
  job_meta?: Record<string, number>;
  academic_name?: string;
  created_at: string;
  updated_at: string;
  status?: number; // Added status field
}

interface JobTypeConfig {
  type_name: string;
  data: Array<{
    id: number;
    name: string;
  }>;
}

interface CareerStatus {
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
  status: string; // Added status filter
}

interface CareerJobsSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const CareerJobsSection: React.FC<CareerJobsSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<CareerJobData[]>([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerJobData | null>(null);
  const [selectedJobsForDelete, setSelectedJobsForDelete] = useState<number[]>([]);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loadingJobDetails, setLoadingJobDetails] = useState(false);
  const [jobTypeConfig, setJobTypeConfig] = useState<JobTypeConfig[]>([]);
  const [careerStatuses, setCareerStatuses] = useState<CareerStatus[]>([]);

  // Filters
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    status: '', // All statuses by default
  });
  
  const debouncedSearch = useDebounce(filters.search, 500);
  
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  useEffect(() => {
    if (selectedAcademic) {
      getCareerJobs();
      getJobTypeConfig();
      getCareerStatuses();
    } else {
      setJobs([]);
    }
  }, [selectedAcademic]);

  useEffect(() => {
    if (selectedAcademic) {
      getCareerJobs();
    }
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, filters.status]);

  const getCareerJobs = async () => {
    if (!selectedAcademic) return;
    setLoading(true);
    try {
      const requestData: any = {
        academic_id: parseInt(selectedAcademic),
        search: filters.search,
        page: filters.page,
        rowsPerPage: filters.rowsPerPage,
        order: filters.order,
        orderBy: filters.orderBy,
      };

      // Add status filter if selected
      if (filters.status) {
        requestData.status = parseInt(filters.status);
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Jobs/list-job`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data && Array.isArray(response.data.data)) {
        setJobs(response.data.data || []);
        setTotal(response.data.total || 0);
      } else {
        toast.error('Invalid response format');
        setJobs([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('Error fetching career jobs:', error);
      toast.error(error.response?.data?.message || 'Error fetching jobs');
      setJobs([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const getJobTypeConfig = async () => {
    if (!selectedAcademic) return;
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Jobs/get-type-config`,
        {
          academic_id: parseInt(selectedAcademic),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status && Array.isArray(response.data.data)) {
        setJobTypeConfig(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching job type config:', error);
    }
  };

  const getCareerStatuses = async () => {
    if (!selectedAcademic) return;
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Dropdown/get-career-status`,
        {
          academic_id: parseInt(selectedAcademic),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status && Array.isArray(response.data.data)) {
        setCareerStatuses(response.data.data);
      }
    } catch (error: any) {
      console.error('Error fetching career statuses:', error);
    }
  };

  const handleSubmitJob = async (requestData: any) => {
    try {
      let url;
      if (modalType === 'add') {
        url = `${apiUrl}/${user?.role}/Jobs/add-job`;
      } else {
        url = `${apiUrl}/${user?.role}/Jobs/update-job`;
      }

      // Add s_id to request data
      requestData.s_id = user?.id;

      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status === true) {
        toast.success(`Job ${modalType === 'add' ? 'created' : 'updated'} successfully!`);
        getCareerJobs();
        return true;
      } else {
        toast.error(response.data?.message || `Failed to ${modalType} job`);
        return false;
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || `Error ${modalType === 'add' ? 'adding' : 'updating'} job`);
      return false;
    }
  };

  const editJob = async (job: CareerJobData) => {
    setSelectedJob(job);
    setModalType('edit');
    
    if (!job.job_meta) {
      setLoadingJobDetails(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/Jobs/get-job-details`,
          {
            job_id: job.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data?.status && response.data.data) {
          setSelectedJob(prev => prev ? {
            ...prev,
            ...response.data.data
          } : null);
        }
      } catch (error) {
        console.error('Error loading job details:', error);
      } finally {
        setLoadingJobDetails(false);
      }
    }
    
    setShowModal(true);
  };

  const deleteJob = async () => {
    if (selectedJobsForDelete.length === 0) {
      toast.error('Please select at least one job to delete');
      return;
    }
    
    setDeleteLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Jobs/delete-job`,
        {
          ids: selectedJobsForDelete,
          s_id: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status === true) {
        toast.success(`${selectedJobsForDelete.length} job(s) deleted successfully!`);
        setShowDeleteModal(false);
        setSelectedJobsForDelete([]);
        getCareerJobs();
      } else {
        toast.error(response.data?.message || 'Failed to delete job(s)');
      }
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Error deleting job');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleAddClick = () => {
    setSelectedJob(null);
    setModalType('add');
    setShowModal(true);
  };

  const handleDeleteClick = () => {
    if (selectedJobsForDelete.length === 0) {
      toast.error('Please select at least one job to delete');
      return;
    }
    setShowDeleteModal(true);
  };

  const handleSelectJob = (jobId: number) => {
    setSelectedJobsForDelete(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      } else {
        return [...prev, jobId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedJobsForDelete.length === jobs.length) {
      setSelectedJobsForDelete([]);
    } else {
      setSelectedJobsForDelete(jobs.map(job => job.id));
    }
  };

  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters(prev => ({
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

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 }));
  };

  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
  };

  const handleSearch = (searchValue: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  const handleStatusFilter = (statusValue: string) => {
    setFilters(prev => ({
      ...prev,
      status: statusValue,
      page: 0,
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadgeColor = (statusValue?: number) => {
    if (!statusValue) return 'gray';
    switch (statusValue) {
      case 1: return 'green'; // Active
      case 2: return 'yellow'; // Draft
      case 3: return 'red'; // Closed
      default: return 'gray';
    }
  };

  const getStatusName = (statusValue?: number) => {
    if (!statusValue) return 'Unknown';
    const status = careerStatuses.find(s => s.value === statusValue);
    return status ? status.name : 'Unknown';
  };

  // Get dropdown value name by ID
  const getDropdownValueName = (typeName: string, id: number) => {
    const config = jobTypeConfig.find(item => item.type_name === typeName);
    if (!config) return '';
    const option = config.data.find(opt => opt.id === id);
    return option ? option.name : '';
  };

  if (!selectedAcademic) {
    return (
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <svg
          className="w-16 h-16 text-gray-300 mx-auto mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <p className="text-gray-500 italic text-lg">
          Please select an academic from above to manage career jobs.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
        {/* Table Header with Filters and Add Button */}
        <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
            {/* Left side: Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <div className="relative w-full sm:w-64">
                <TextInput
                  type="text"
                  placeholder="Search jobs..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  icon={HiSearch}
                  className="w-full"
                />
              </div>
              
              {/* Status Filter Dropdown */}
              <div className="w-full sm:w-48">
                <Select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="w-full"
                >
                  <option value="">All Statuses</option>
                  {careerStatuses.map((status) => (
                    <option key={status.id} value={status.value}>
                      {status.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              {/* Delete Selected Button (if any selected) */}
              {selectedJobsForDelete.length > 0 && (
                <Button
                  color="failure"
                  onClick={handleDeleteClick}
                  className="whitespace-nowrap"
                >
                  <MdDeleteForever className="mr-2 h-5 w-5" />
                  Delete Selected ({selectedJobsForDelete.length})
                </Button>
              )}
            </div>

            {/* Right side: Add Button */}
            <Button
              onClick={handleAddClick}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 whitespace-nowrap w-full sm:w-auto mt-4 sm:mt-0"
            >
              <HiPlus className="mr-2 h-5 w-5" />
              Add Job
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
                      className="w-12 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      <Checkbox
                        checked={jobs.length > 0 && selectedJobsForDelete.length === jobs.length}
                        onChange={handleSelectAll}
                      />
                    </th>
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
                      onClick={() => handleSort('job_title')}
                    >
                      <div className="flex items-center justify-center">
                        Job Title {getSortIcon('job_title')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('company_name')}
                    >
                      <div className="flex items-center justify-center">
                        Company {getSortIcon('company_name')}
                      </div>
                    </th>
                    {/* <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th> */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center justify-center">
                        Posted Date {getSortIcon('created_at')}
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
                  {jobs.length > 0 ? (
                    jobs.map((job, index) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-4 text-center">
                          <Checkbox
                            checked={selectedJobsForDelete.includes(job.id)}
                            onChange={() => handleSelectJob(job.id)}
                          />
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          <div className="font-medium">{job.job_title}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {job.company_name}
                        </td>
                        {/* <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${getStatusBadgeColor(job.status)}-100 text-${getStatusBadgeColor(job.status)}-800`}>
                            {getStatusName(job.status)}
                          </span>
                        </td> */}
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center">
                          {formatDate(job.created_at)}
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            {/* Edit Button */}
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                              onClick={() => editJob(job)}
                              title="Edit Job"
                            >
                              <TbEdit size={18} />
                            </button>

                            {/* Delete Button */}
                            <button
                              className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
                              onClick={() => {
                                setSelectedJobsForDelete([job.id]);
                                setShowDeleteModal(true);
                              }}
                              title="Delete Job"
                            >
                              <MdDeleteForever size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center">
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
                              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-lg font-medium text-gray-600 mb-2">No jobs found</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {filters.search || filters.status
                              ? 'Try adjusting your search or filter criteria'
                              : 'Get started by adding your first job'}
                          </p>
                          <Button onClick={handleAddClick} color="blue" className="flex items-center gap-2">
                            <HiPlus className="w-4 h-4" />
                            Add Job
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
          {jobs.length > 0 && (
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

      {/* Add/Edit Job Modal */}
      <AddEditJobModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmitJob}
        modalType={modalType}
        selectedJob={selectedJob}
        jobTypeConfig={jobTypeConfig}
        loadingJobDetails={loadingJobDetails}
        academicId={selectedAcademic}
        careerStatuses={careerStatuses} // Pass career statuses to modal
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedJobsForDelete([]);
        }}
        onConfirm={deleteJob}
        title={`Delete ${selectedJobsForDelete.length > 1 ? 'Jobs' : 'Job'}`}
        message={`Are you sure you want to delete ${selectedJobsForDelete.length} selected job(s)? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </>
  );
};

export default CareerJobsSection;