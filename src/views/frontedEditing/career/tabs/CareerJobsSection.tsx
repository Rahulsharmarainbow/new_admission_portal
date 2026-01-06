import React, { useEffect, useState } from 'react';
import { 
  Card, 
  Label, 
  TextInput, 
  Button, 
  Spinner, 
  Textarea, 
  Select,
  Modal,
  Badge,
  ModalBody,
  ModalHeader,
  ModalFooter
} from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { HiPlus, HiSearch, HiExclamation } from 'react-icons/hi';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from 'react-icons/tb';
import { Pagination } from 'src/Frontend/Common/Pagination';
import Header from 'src/Frontend/Common/Header';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';

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
  academic_name?: string;
  created_at: string;
  updated_at: string;
}

interface CareerJobsSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}


const CareerJobsSection: React.FC<CareerJobsSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [jobs, setJobs] = useState<CareerJobData[]>([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<CareerJobData | null>(null);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form fields
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobLocation, setJobLocation] = useState('');
  const [jobType, setJobType] = useState('Full-time');
  const [experience, setExperience] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [salary, setSalary] = useState('');

  // Filters
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
  });
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });

  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'];

  useEffect(() => {
    if (selectedAcademic) {
      getCareerJobs();
    } else {
      setJobs([]);
    }
  }, [selectedAcademic, filters.page, filters.rowsPerPage, filters.order, filters.orderBy, filters.search]);

  const getCareerJobs = async () => {
    if (!selectedAcademic) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Jobs/list-job`,
        {
          academic_id: parseInt(selectedAcademic),
          search: filters.search,
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
        },
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    if (!jobTitle || !companyName || !jobLocation || !description) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const requestData = {
        academic_id: parseInt(selectedAcademic),
        s_id: user?.id,
        job_title: jobTitle,
        company_name: companyName,
        job_location: jobLocation,
        job_type: jobType,
        experience: experience,
        description: description,
        requirements: requirements,
        salary: salary,
      };

      let url;

      if (modalType === 'add') {
        url = `${apiUrl}/${user?.role}/Jobs/add-job`;
      } else {
        if (!selectedJob?.id) {
          toast.error('No job selected for editing');
          return;
        }
        url = `${apiUrl}/${user?.role}/Jobs/update-job`;
        requestData['job_id'] = selectedJob.id;
      }

      const response = await axios.post(url, requestData, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data?.status === true) {
        toast.success(`Job ${modalType === 'add' ? 'created' : 'updated'} successfully!`);
        resetForm();
        setShowModal(false);
        getCareerJobs();
      } else {
        toast.error(response.data?.message || `Failed to ${modalType} job`);
      }
    } catch (error: any) {
      console.error('Error saving job:', error);
      toast.error(error.response?.data?.message || 'Error saving job');
    } finally {
      setSaving(false);
    }
  };

  const editJob = (job: CareerJobData) => {
    setSelectedJob(job);
    setModalType('edit');
    setJobTitle(job.job_title || '');
    setCompanyName(job.company_name || '');
    setJobLocation(job.job_location || '');
    setJobType(job.job_type || 'Full-time');
    setExperience(job.experience || '');
    setDescription(job.description || '');
    setRequirements(job.requirements || '');
    setSalary(job.salary || '');
    setShowModal(true);
  };

  const deleteJob = async () => {
    if (!selectedJob?.id) return;
    
    setDeleteLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Jobs/delete-job`,
        {
          ids: [selectedJob.id],
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
        toast.success('Job deleted successfully!');
        setShowDeleteModal(false);
        setSelectedJob(null);
        getCareerJobs();
      } else {
        toast.error(response.data?.message || 'Failed to delete job');
      }
    } catch (error: any) {
      console.error('Error deleting job:', error);
      toast.error(error.response?.data?.message || 'Error deleting job');
    } finally {
      setDeleteLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedJob(null);
    setJobTitle('');
    setCompanyName('');
    setJobLocation('');
    setJobType('Full-time');
    setExperience('');
    setDescription('');
    setRequirements('');
    setSalary('');
  };

  const handleAddClick = () => {
    resetForm();
    setModalType('add');
    setShowModal(true);
  };

  const handleDeleteClick = (job: CareerJobData) => {
    setSelectedJob(job);
    setShowDeleteModal(true);
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      {/* Main Content with Blur Effect when Modal is Open */}
      <div className={`transition-all duration-300 ${showModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Table Header with Search and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
            {/* Search Input - Left side */}
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

            {/* Add Button - Right side */}
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
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('job_location')}
                    >
                      <div className="flex items-center justify-center">
                        Location {getSortIcon('job_location')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('job_type')}
                    >
                      <div className="flex items-center justify-center">
                        Type {getSortIcon('job_type')}
                      </div>
                    </th>
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
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          <div className="font-medium">{job.job_title}</div>
                          <div className="text-xs text-gray-500 mt-1">
                            {job.experience || 'Not specified'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {job.company_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                          {job.job_location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Badge 
                            color={
                              job.job_type === 'Full-time' ? 'success' : 
                              job.job_type === 'Part-time' ? 'warning' :
                              job.job_type === 'Remote' ? 'purple' : 'info'
                            } 
                            className="text-xs"
                          >
                            {job.job_type}
                          </Badge>
                        </td>
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
                              onClick={() => handleDeleteClick(job)}
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
                            {filters.search
                              ? 'Try adjusting your search criteria'
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

          {/* Custom Pagination */}
          {jobs.length > 0 && (
            <Pagination
              currentPage={filters.page + 1}
              totalPages={Math.ceil(total / filters.rowsPerPage)}
              totalItems={total}
              rowsPerPage={filters.rowsPerPage}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          )}
        </div>
      </div>

      {/* Add/Edit Job Modal */}
      <Modal show={showModal} onClose={() => setShowModal(false)} size="2xl" className='overscroll-x-auto'>
        <ModalHeader>
          {modalType === 'add' ? 'Add New Job' : 'Edit Job'}
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="jobTitle" className="block mb-2">
                  Job Title *
                </Label>
                <TextInput
                  id="jobTitle"
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  placeholder="e.g., Software Engineer"
                  required
                />
              </div>

              <div>
                <Label htmlFor="companyName" className="block mb-2">
                  Company Name *
                </Label>
                <TextInput
                  id="companyName"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g., Tech Solutions Inc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobLocation" className="block mb-2">
                  Job Location *
                </Label>
                <TextInput
                  id="jobLocation"
                  type="text"
                  value={jobLocation}
                  onChange={(e) => setJobLocation(e.target.value)}
                  placeholder="e.g., New Delhi, India"
                  required
                />
              </div>

              <div>
                <Label htmlFor="jobType" className="block mb-2">
                  Job Type
                </Label>
                <Select
                  id="jobType"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                >
                  {jobTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </Select>
              </div>

              <div>
                <Label htmlFor="experience" className="block mb-2">
                  Experience Required
                </Label>
                <TextInput
                  id="experience"
                  type="text"
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="e.g., 2-4 years"
                />
              </div>

              <div>
                <Label htmlFor="salary" className="block mb-2">
                  Salary Range
                </Label>
                <TextInput
                  id="salary"
                  type="text"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  placeholder="e.g., ₹6-8 LPA"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="requirements" className="block mb-2">
                  Requirements
                </Label>
                <Textarea
                  id="requirements"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  placeholder="Enter job requirements..."
                  rows={3}
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="description" className="block mb-2">
                  Job Description *
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter detailed job description..."
                  rows={5}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              type="button"
              color="light"
              onClick={() => setShowModal(false)}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={saving}>
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {modalType === 'add' ? 'Adding...' : 'Updating...'}
                </>
              ) : (
                modalType === 'add' ? 'Add Job' : 'Update Job'
              )}
            </Button>
          </ModalFooter>
        </form>
      </Modal>

      {/* Custom Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedJob(null);
        }}
        onConfirm={deleteJob}
        title="Delete Job"
        message={`Are you sure you want to delete "${selectedJob?.job_title}"? This action cannot be undone.`}
        loading={deleteLoading}
      />
    </>
  );
};

export default CareerJobsSection;