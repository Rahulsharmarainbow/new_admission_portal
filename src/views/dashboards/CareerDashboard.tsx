import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import { BsFillSearchHeartFill } from 'react-icons/bs';
import { HiChevronDown } from 'react-icons/hi';
import { FiFileText, FiUserCheck, FiUsers, FiClock, FiCheckCircle, FiUserX, FiActivity } from 'react-icons/fi';
import { MdOutlineContentPasteSearch } from 'react-icons/md';

// Images import
import img1 from '../../../public/Images/top-error-shape.png';
import img2 from '../../../public/Images/top-info-shape.png';
import img3 from '../../../public/Images/top-warning-shape.png';
import { CareerDashboardFilters, careerDashboardService } from './CareerDashboardService';
import { useDashboardFilters } from 'src/hook/DashboardFilterContext';

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

export interface CountItem {
  id: number;
  name: string;
  value: number;
  count: number;
}

export interface CareerDashboardResponse {
  status: boolean;
  counts: CountItem[];
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
        {/* <p className="text-xs text-white text-opacity-80 mt-1">{subtitle}</p> */}
      </div>
    </div>
  );
};

// Function to get icon based on status name
const getStatusIcon = (statusName: string) => {
  switch (statusName.toLowerCase()) {
    case 'total':
      return <FiActivity className="w-6 h-6 text-white" />;
    case 'applied':
      return <FiFileText className="w-6 h-6 text-white" />;
    case 'shortlisted':
      return <FiCheckCircle className="w-6 h-6 text-white" />;
    case 'interview':
      return <MdOutlineContentPasteSearch className="w-6 h-6 text-white" />;
    case 'offer':
      return <FiUserCheck className="w-6 h-6 text-white" />;
    case 'hired':
      return <FiUsers className="w-6 h-6 text-white" />;
    case 'rejected':
      return <FiUserX className="w-6 h-6 text-white" />;
    case 'active':
      return <FiUserCheck className="w-6 h-6 text-white" />;
    case 'close':
      return <FiUserX className="w-6 h-6 text-white" />;
    case 'draft':
      return <FiClock className="w-6 h-6 text-white" />;
    default:
      return <FiUsers className="w-6 h-6 text-white" />;
  }
};

// Function to get image based on index
const getStatusImage = (index: number) => {
  const images = [img1, img2, img3];
  return images[index % images.length];
};

// Function to get subtitle based on status
const getStatusSubtitle = (statusName: string) => {
  switch (statusName.toLowerCase()) {
    case 'total':
      return 'All career applications';
    case 'applied':
      return 'Submitted applications';
    case 'shortlisted':
      return 'Shortlisted candidates';
    case 'interview':
      return 'Candidates in interview process';
    case 'offer':
      return 'Job offers made';
    case 'hired':
      return 'Successfully hired candidates';
    case 'rejected':
      return 'Rejected applications';
    case 'active':
      return 'Currently active applications';
    case 'close':
      return 'Closed applications';
    case 'draft':
      return 'Draft applications';
    default:
      return 'Career applications';
  }
};

// Color palette for cards
const colorPalette = ['#0085db'];

interface CareerDashboardProps {
  academicId?: string;
  year?: string;
}

// ... existing interfaces ...

const CareerDashboard: React.FC<CareerDashboardProps> = ({ academicId, year }) => {
  const { filters: dashboardFilters, updateFilter } = useDashboardFilters();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<CareerDashboardResponse | null>(null);
  
  // ✅ useRef to track previous values
  const prevAcademicIdRef = useRef<string>('');
  const prevYearRef = useRef<string>('');
  
  // ✅ Initialize filters
  const [filters, setFilters] = useState<CareerDashboardFilters>({
    page: 0,
    rowsPerPage: 10,
    year: new Date().getFullYear().toString(),
    academic_id: user.role === 'CustomerAdmin' ? user?.academic_id : '',
    search: '',
  });
console.log(filters)
  // ✅ Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // ✅ Fetch career dashboard data
  const fetchCareerDashboardData = async (currentFilters: CareerDashboardFilters) => {
    console.log('Fetching career dashboard data...');
    if (!user?.id || !user?.token) return;

    // Don't fetch if academic_id is not available
    if (!currentFilters.academic_id) {
      console.log('Waiting for academic_id...');
      return;
    }

    setLoading(true);
    try {
      const data = await careerDashboardService.getCareerDashboardData(
        currentFilters,
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

  // ✅ Effect to initialize filters from props
  useEffect(() => {
    if (academicId || year) {
      const newYear = year || new Date().getFullYear().toString();
      const newAcademicId = academicId || '';
      
      // Only update if values have changed
      if (newAcademicId !== prevAcademicIdRef.current || newYear !== prevYearRef.current) {
        console.log('Initializing filters:', { newAcademicId, newYear });
        
        setFilters(prev => ({
          ...prev,
          year: newYear,
          academic_id: newAcademicId,
          page: 0 // Reset to first page
        }));
        
        // Update refs
        prevAcademicIdRef.current = newAcademicId;
        prevYearRef.current = newYear;
      }
    }
  }, [academicId, year]);

  // ✅ Effect to sync with dashboardFilters context
  useEffect(() => {
    if (user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') {
      const contextYear = dashboardFilters.year || new Date().getFullYear().toString();
      const contextAcademicId = dashboardFilters.academic || '';
      
      // Only update if values have changed
      if (contextAcademicId !== prevAcademicIdRef.current || contextYear !== prevYearRef.current) {
        console.log('Syncing with context:', { contextAcademicId, contextYear });
        
        setFilters(prev => ({
          ...prev,
          year: contextYear,
          academic_id: contextAcademicId,
          page: 0 // Reset to first page
        }));
        
        // Update refs
        prevAcademicIdRef.current = contextAcademicId;
        prevYearRef.current = contextYear;
      }
    }
  }, [dashboardFilters.year, dashboardFilters.academic, user?.role]);

  // ✅ Main effect for API calls
  useEffect(() => {
    // Skip if filters are not ready
    if (!filters.academic_id) {
      console.log('Filters not ready:', filters);
      return;
    }

    // Check if we have valid data to fetch
    const shouldFetch = filters.academic_id && filters.year;
    
    if (shouldFetch) {
      console.log('Fetching data with filters:', filters);
      
      // Use a timeout to ensure state is updated
      const timeoutId = setTimeout(() => {
        fetchCareerDashboardData(filters);
      }, 100); // Small delay to ensure state is settled
      
      return () => clearTimeout(timeoutId);
    }
  }, [
    filters.academic_id,
    filters.year,
    filters.page,
    filters.rowsPerPage,
    debouncedSearch,
  ]);

  // ✅ Search and pagination effects remain the same
  useEffect(() => {
    if (filters.academic_id && filters.year) {
      const timeoutId = setTimeout(() => {
        fetchCareerDashboardData(filters);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    }
  }, [filters.page, filters.rowsPerPage, debouncedSearch]);

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
  const handleCardClick = (card: any) => {
    navigate(`/${user.role}/career-applications`, {
      state: {
        filters: {
          status: card?.value?.toString(),
          id: card.id,
          academic_id: filters.academic_id,
          year: filters.year
        }
      }
    });
  };

  const handleCardClick2 = (card: any) => {
    navigate(`/${user.role}/frontend-editing/career`, {
      state: {
        filters: {
          status: card.value,
          id: card.id,
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

  // Update year in local state
  const handleYearChange = (selectedYear: string) => {
    console.log('Year changed to:', selectedYear);
    setFilters((prev) => ({ 
      ...prev, 
      year: selectedYear, 
      page: 0 
    }));
    
    // Also update in context for SuperAdmin/SupportAdmin
    if (user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') {
      updateFilter('year', selectedYear);
    }
  };

  // Handle Resume Download
  const handleResumeDownload = (resumeUrl: string, applicantName: string) => {
    if (!resumeUrl) {
      toast.error('Resume not available');
      return;
    }
    
    const link = document.createElement('a');
    link.href = resumeUrl;
    link.download = `${applicantName.replace(/\s+/g, '_')}_Resume.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle View Application
  const handleViewApplication = (application: any) => {
    navigate(`/${user.role}/career-applications`, {
      state: {
        applicationId: application.reference_id,
        academic_id: filters.academic_id,
        year: filters.year
      }
    });
  };

  // Show initial loading if academic_id is not available
  if (!filters.academic_id) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600">Loading career dashboard...</p>
        <p className="text-sm text-gray-500">Academic ID: {academicId || 'Not available'}</p>
      </div>
    );
  }

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
      {/* Header Section with Year Dropdown */}
      {
        user.role === "CustomerAdmin" && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <select
              value={filters.year || new Date().getFullYear().toString()}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full sm:w-auto min-w-[250px] px-3 py-2.5 border border-gray-300 rounded-md bg-white 
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
            >
              {yearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <HiChevronDown className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
        )
      }

      {/* Statistics Cards */}
      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Career Application Statistics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <CareerCard
            key="total"
            title="Total Applications"
            value={dashboardData?.total_applications || 0}
            icon={getStatusIcon('total')}
            bgColor={colorPalette[0]}
            image={img2}
            subtitle={getStatusSubtitle('total')}
            onClick={() => handleCardClick('total')}
            isClickable={true}
          />
          
          {dashboardData?.career_status?.map((countItem, index) => (
            <CareerCard
              key={countItem.id}
              title={countItem.name}
              value={countItem.count}
              icon={getStatusIcon(countItem.name)}
              bgColor={colorPalette[(index + 1) % colorPalette.length]}
              image={getStatusImage(index + 1)}
              subtitle={getStatusSubtitle(countItem.name)}
              onClick={() => handleCardClick(countItem)}
              isClickable={true}
            />
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Job Status</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {dashboardData?.job_status?.map((countItem, index) => (
            <CareerCard
              key={countItem.id}
              title={countItem.name}
              value={countItem.count}
              icon={getStatusIcon(countItem.name)}
              bgColor={colorPalette[(index + 1) % colorPalette.length]}
              image={getStatusImage(index + 1)}
              subtitle={getStatusSubtitle(countItem.name)}
              onClick={() => handleCardClick2(countItem)}
              isClickable={true}
            />
          ))}
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
          <div>
            <h5 className="text-lg font-semibold text-gray-900">Recent Career Applications</h5>
            <h6 className="text-sm text-gray-600">
              Year: {filters.year} | Total: {dashboardData?.total_applications || 0} applications
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
                  {dashboardData?.recent_applications?.map((app, index) => (
                    <tr
                      key={app.reference_id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className="text-blue-600 font-medium hover:text-blue-800 hover:underline cursor-pointer"
                          onClick={() => handleViewApplication(app)}
                          title="Click to view application"
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
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded hover:bg-blue-50 transition-colors"
                        >
                          View Details
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
                <p className="text-gray-500">There are no career applications for the selected filters.</p>
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