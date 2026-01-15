import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import { BsFillSearchHeartFill } from 'react-icons/bs';
import { HiChevronDown } from 'react-icons/hi';
import { FiFileText, FiUserCheck, FiUsers, FiClock, FiCheckCircle, FiUserX } from 'react-icons/fi';
import { MdOutlineContentPasteSearch } from 'react-icons/md';

// Images import
import img1 from '../../../public/Images/top-error-shape.png';
import img2 from '../../../public/Images/top-info-shape.png';
import img3 from '../../../public/Images/top-warning-shape.png';
import { CareerDashboardFilters, careerDashboardService } from './CareerDashboardService';

interface CareerCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  image: string;
  subtitle: string;
  onClick?: () => void;
  isClickable?: boolean;
}

// src/types/career.ts
export interface CareerApplication {
  reference_id: string;
  job_name: string;
  name: string;
  email: string;
  mobile: string;
  resume: string | null;
  created_at: string;
}

export interface CareerDashboardCounts {
  active_application: number;
  draft_application: number;
  close_application: number;
  applied_application: number;
  shortlisted_application: number;
  interview_application: number;
}

export interface CareerDashboardResponse {
  status: boolean;
  counts: CareerDashboardCounts;
  total_applications: number;
  recent_applications: CareerApplication[];
}

const CareerCard: React.FC<CareerCardProps> = ({
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
        <p className="text-xs text-white text-opacity-80 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const CareerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [filters, setFilters] = useState<CareerDashboardFilters>({
    page: 0,
    rowsPerPage: 10,
    year: new Date().getFullYear().toString(),
    academic_id: user?.academic_id || '',
    search: '',
  });

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch career dashboard data
  const fetchCareerDashboardData = async () => {
    if (!user?.id || !user?.token) return;

    setLoading(true);
    try {
      const data = await careerDashboardService.getCareerDashboardData(
        filters,
        user.id,
        user.token,
        user.role
      );
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error fetching career dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch career dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerDashboardData();
  }, [
    filters.page,
    filters.rowsPerPage,
    debouncedSearch,
    filters.year,
    filters.academic_id,
  ]);

  // 🔥 Dynamic Year Options Generator
  const getYearOptions = (yearsBack: number = 5): string[] => {
    const currentYear = new Date().getFullYear();
    const years: string[] = [];

    for (let y = currentYear; y >= currentYear - yearsBack; y--) {
      years.push(String(y));
    }

    return years;
  };

  const yearOptions = getYearOptions(5);

  // Handle Card Clicks
  const handleCardClick = (statusType: string) => {
    navigate(`/${user.role}/career-applications`, {
      state: {
        filters: {
          status: statusType,
          academic_id: filters.academic_id,
          year: filters.year
        }
      }
    });
  };

  // Update search filter
  const handleSearchChange = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value, page: 0 }));
  };

  // Update page
  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page: page - 1 }));
  };

  // Update rows per page
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Update year
  const handleYearChange = (year: string) => {
    setFilters((prev) => ({ ...prev, year, page: 0 }));
  };

  // Handle Resume Download
  const handleResumeDownload = (resumeUrl: string, applicantName: string) => {
    if (!resumeUrl) {
      toast.error('Resume not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${applicantName}_Resume.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle View Application
  const handleViewApplication = (application: any) => {
    navigate(`/${user.role}/career-applications`);
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Career Dashboard</h1>
          <p className="text-gray-600">Manage and track career applications</p>
        </div>
        
        {/* Year Filter */}
        <div className="relative w-full md:w-auto">
          <select
            value={filters.year}
            onChange={(e) => handleYearChange(e.target.value)}
            className="w-full md:w-auto min-w-[180px] px-3 py-2.5 border border-gray-300 rounded-md bg-white 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
          >
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
      </div>

      {/* Statistics Cards - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <CareerCard
          title="Total Applications"
          value={dashboardData?.total_applications || 0}
          icon={<FiUsers className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img2}
          subtitle="All career applications"
          onClick={() => handleCardClick('all')}
          isClickable={true}
        />

        <CareerCard
          title="Active Applications"
          value={dashboardData?.counts?.active_application || 0}
          icon={<FiUserCheck className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img1}
          subtitle="Currently active applications"
          onClick={() => handleCardClick('active')}
          isClickable={true}
        />

        <CareerCard
          title="Applied"
          value={dashboardData?.counts?.applied_application || 0}
          icon={<FiFileText className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img3}
          subtitle="Submitted applications"
          onClick={() => handleCardClick('applied')}
          isClickable={true}
        />
      </div>

      {/* Statistics Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <CareerCard
          title="Shortlisted"
          value={dashboardData?.counts?.shortlisted_application || 0}
          icon={<FiCheckCircle className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img1}
          subtitle="Shortlisted candidates"
          onClick={() => handleCardClick('shortlisted')}
          isClickable={true}
        />

        <CareerCard
          title="Interview Stage"
          value={dashboardData?.counts?.interview_application || 0}
          icon={<MdOutlineContentPasteSearch className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img2}
          subtitle="Candidates in interview process"
          onClick={() => handleCardClick('interview')}
          isClickable={true}
        />

        <CareerCard
          title="Closed"
          value={dashboardData?.counts?.close_application || 0}
          icon={<FiUserX className="w-6 h-6 text-white" />}
          bgColor="#0085db"
          image={img3}
          subtitle="Closed applications"
          onClick={() => handleCardClick('closed')}
          isClickable={true}
        />
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h5 className="text-lg font-semibold text-gray-900">Recent Career Applications</h5>
            <h6 className="text-sm text-gray-600">
              Latest submitted applications
            </h6>
          </div>
          <div className="relative w-full lg:w-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BsFillSearchHeartFill className="w-5 h-5 text-blue-400" />
            </div>
            <input
              type="text"
              placeholder="Search Applications..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      S.No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reference ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applicant Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Position
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applied Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Resume
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {dashboardData?.recent_applications?.map((app: any, index: number) => (
                    <tr
                      key={app.reference_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(filters.page || 0) * (filters.rowsPerPage || 10) + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="text-blue-600 font-medium hover:text-blue-800 hover:underline cursor-pointer"
                          onClick={() => handleViewApplication(app)}
                          title="Click to view all application"
                        >
                          {app.reference_id}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{app.job_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {app.mobile}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {app.created_at}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {app.resume ? (
                          <button
                            onClick={() => handleResumeDownload(app.resume, app.name)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FiFileText className="w-4 h-4 mr-1" />
                            Download
                          </button>
                        ) : (
                          <span className="text-sm text-gray-400">No Resume</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleViewApplication(app)}
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {dashboardData?.recent_applications?.length === 0 && (
              <div className="text-center py-12">
                <FiUsers className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                <p className="text-gray-500">There are no career applications yet.</p>
              </div>
            )}

            {dashboardData?.recent_applications?.length > 0 && (
              <Pagination
                currentPage={(filters.page || 0) + 1}
                totalPages={Math.ceil(
                  (dashboardData?.total_applications || 0) / (filters.rowsPerPage || 10),
                )}
                totalItems={dashboardData?.total_applications || 0}
                rowsPerPage={filters.rowsPerPage || 10}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CareerDashboard;