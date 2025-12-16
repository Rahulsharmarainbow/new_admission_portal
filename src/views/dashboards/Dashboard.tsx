import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { dashboardService, DashboardFilters } from 'src/services/dashboardService';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import BarChart from './BarChart';
import { BsFillSearchHeartFill } from 'react-icons/bs';
import { HiChevronDown } from 'react-icons/hi';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// Images import
import img1 from '../../../public/Images/top-error-shape.png';
import img2 from '../../../public/Images/top-info-shape.png';
import img3 from '../../../public/Images/top-warning-shape.png';
import { useNavigate } from 'react-router';
import { useDashboardFilters } from 'src/hook/DashboardFilterContext';
import { useAllAcademics } from 'src/hook/useAllAcademics';

interface ApplicationCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  bgColor: string;
  image: string;
  subtitle: string;
  onClick?: () => void;
  isClickable?: boolean;
}

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
        <p className="text-xs text-white text-opacity-80 mt-1">{subtitle}</p>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { filters: dashboardFilters, updateFilter } = useDashboardFilters();
  const { academics, loading: academicLoading } = useAllAcademics();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    year: dashboardFilters.year,
    academic: user.role === 'CustomerAdmin' ? user.academic_id : dashboardFilters.academic,
  });

  // ✅ CustomerAdmin के लिए user data से academic details
  const customerAdminAcademic = {
    id: user?.academic_id,
    academic_name: user?.academic_name,
    academic_type: user?.academic_type
  };

  // ✅ Get selected academic type and name based on role
  const getSelectedAcademic = () => {
    if (user?.role === 'CustomerAdmin') {
      return customerAdminAcademic;
    }
    
    // For SuperAdmin/SupportAdmin, get from dashboardFilters
    return {
      id: dashboardFilters.academic,
      academic_name: dashboardFilters.academicName,
      academic_type: dashboardFilters.academicType
    };
  };

  const selectedAcademic = getSelectedAcademic();
  const selectedAcademicType = selectedAcademic?.academic_type;
  const selectedAcademicName = selectedAcademic?.academic_name;
  const hasSelectedAcademic = user?.role === 'CustomerAdmin' 
    ? !!user?.academic_id 
    : !!dashboardFilters.academic;

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id || !user?.token) return;

    setLoading(true);
    try {
      const data = await dashboardService.getDashboardData(filters, user.id, user.token, user.role);
      setDashboardData(data);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [
    filters.page,
    filters.rowsPerPage,
    filters.order,
    filters.orderBy,
    debouncedSearch,
    filters.year,
    filters.academic,
  ]);

  // ✅ Initialize filters for CustomerAdmin on component mount
  useEffect(() => {
    if (user?.role === 'CustomerAdmin') {
      // Set CustomerAdmin's academic info in dashboard context
      updateFilter('academic', user.academic_id);
      updateFilter('academicType', user.academic_type);
      updateFilter('academicName', user.academic_name);
      
      // Also update local filters
      setFilters(prev => ({
        ...prev,
        academic: user.academic_id,
        year: dashboardFilters.year || new Date().getFullYear().toString()
      }));
    }
  }, [user]);

  // Sync local filters with context for SuperAdmin/SupportAdmin
  useEffect(() => {
    if (user?.role !== 'CustomerAdmin') {
      setFilters(prev => ({
        ...prev,
        year: dashboardFilters.year,
        academic: dashboardFilters.academic,
      }));
    }
  }, [dashboardFilters.year, dashboardFilters.academic, user?.role]);

  // ✅ Handle Card Clicks
  const handleCardClick = (cardType: string) => {
    // Check if academic is selected for cards that require it
    const requiresAcademic = ['total', 'paid', 'incomplete'];
    
    if (requiresAcademic.includes(cardType) && !hasSelectedAcademic) {
      if (user?.role === 'CustomerAdmin') {
        toast.error('Academic information not available');
      } else {
        toast.error('Please select an academic first');
      }
      return;
    }

    // For CustomerAdmin, always use their own academic
    const academicId = user?.role === 'CustomerAdmin' 
      ? user.academic_id 
      : dashboardFilters.academic;

    switch (cardType) {
      case 'total':
        updateFilter('ApplicationStatus', null);
        console.log("total", selectedAcademicType)
        if (selectedAcademicType === 1) {
          navigate(`/${user.role}/school-applications`,{
            state: {
              filters: {
                academic: academicId,
                year: filters.year
              }
            }
          });
        } else if ([2, 3].includes(selectedAcademicType)) {
          navigate(`/${user.role}/college-applications`,{
            state: {
              filters: {
                academic: academicId,
                year: filters.year
              }
            }
          });
        }
        break;

      case 'paid':
        updateFilter('ApplicationStatus', 'captured');
        if (selectedAcademicType === 1) {
          navigate(`/${user.role}/school-applications`, {
            state: { 
              filters: {
                ApplicationStatus: 'captured',
                academic: academicId,
                academicName: selectedAcademicName,
                year: filters.year
              }
            }
          });
        } else if ([2, 3].includes(selectedAcademicType)) {
          navigate(`/${user.role}/college-applications`, {
            state: { 
              filters: {
                ApplicationStatus: 'captured',
                academic: academicId,
                academicName: selectedAcademicName,
                year: filters.year
              }
            }
          });
        }
        break;

      case 'incomplete':
        updateFilter('ApplicationStatus', 'initialized');
        if (selectedAcademicType === 1) {
          navigate(`/${user.role}/school-applications`, {
            state: { 
              filters: {
                ApplicationStatus: 'initialized',
                academic: academicId,
                academicName: selectedAcademicName,
                year: filters.year
              }
            }
          });
        } else if ([2, 3].includes(selectedAcademicType)) {
          navigate(`/${user.role}/college-applications`, {
            state: { 
              filters: {
                ApplicationStatus: 'initialized',
                academic: academicId,
                academicName: selectedAcademicName,
                year: filters.year
              }
            }
          });
        }
        break;

      case 'total-transactions':
        updateFilter('CountStatus', null);
        navigate(`/${user.role}/transaction`,{
            state: {
              filters: {
                academic: academicId,
              }
            }
          });
        break;

      case 'captured-count':
        updateFilter('CountStatus', 'captured');
        navigate(`/${user.role}/transaction`, {
          state: { 
            filters: {
              CountStatus: 'captured',
              academic: academicId,
            }
          }
        });
        break;

      case 'initialized-count':
        updateFilter('CountStatus', 'initialized');
        navigate(`/${user.role}/transaction`, {
          state: { 
            filters: {
              CountStatus: 'initialized',
              academic: academicId,
            }
          }
        });
        break;

      default:
        break;
    }
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

  // Update year in context (only for SuperAdmin/SupportAdmin)
  const handleYearChange = (year: string) => {
    updateFilter('year', year);
  };

  // Update academic in context (only for SuperAdmin/SupportAdmin)
  const handleAcademicChange = (academic: string) => {
    console.log("handleAcademicChange", academic);
    const selected = academics?.find((a: any) => String(a.id) === academic);
    console.log("selected", selected);
    updateFilter('academic', academic);
    updateFilter('academicType', selected?.academic_type);
    updateFilter('academicName', selected?.academic_name);
  };

  // ✅ Handle Roll No Click
  const handleRollNoClick = (application: any) => {
    const applicationId = application.application_id || application.id;
    if (applicationId) {
      navigate(`/${user.role}/application-details/${applicationId}`);
    } else {
      toast.error('Application ID not found');
    }
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
    <>
      {/* Filter Section - Only show for SuperAdmin/SupportAdmin */}
      {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            {/* Year Dropdown */}
            <div className="relative w-full sm:w-auto">
              <select
                value={dashboardFilters.year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="w-full sm:w-auto min-w-[250px] px-3 py-2.5 border border-gray-300 rounded-md bg-white 
  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
              >
                <option value="2025">2025</option>
                <option value="2024">2024</option>
                <option value="2023">2023</option>
                <option value="2022">2022</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <HiChevronDown className="w-4 h-4" />
              </div>
            </div>

            {/* Academic Dropdown */}
            <div className="relative w-full sm:w-auto">
              <AllAcademicsDropdown
                name="academic"
                value={dashboardFilters.academic}
                onChange={handleAcademicChange}
                includeAllOption
                label=""
                className="min-w-[250px] text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Customer Admin Info Banner */}
      {/* {user?.role === 'CustomerAdmin' && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                {selectedAcademicName || 'Your Academic'}
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  Academic Type: {selectedAcademicType === 1 ? 'School' : 'College'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )} */}

      {/* Statistics Cards - Row 1 */}
      <div className="grid grid-cols-9 gap-6 mb-6">
        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Total Applications"
            value={dashboardData?.paymentStatusCounts?.total_applications || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 8h6M9 12h6M9 16h6" />
              </svg>
            }
            bgColor="#0085db"
            image={img2}
            subtitle="All submitted applications"
            onClick={() => handleCardClick('total')}
            isClickable={hasSelectedAcademic}
          />
        </div>

        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Paid Applications"
            value={dashboardData?.paymentStatusCounts?.paid_applications || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 7h6" />
                <path d="M9 10h6" />
                <path d="M9 7h4a3 3 0 0 1 0 6H9l5 5" />
              </svg>
            }
            bgColor="#0085db"
            image={img1}
            subtitle="Applications with successful payment"
            onClick={() => handleCardClick('paid')}
            isClickable={hasSelectedAcademic}
          />
        </div>

        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Incomplete Applications"
            value={dashboardData?.paymentStatusCounts?.incomplete_applications || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 7v5l3 3" />
              </svg>
            }
            bgColor="#0085db"
            image={img3}
            subtitle="Applications with pending payment"
            onClick={() => handleCardClick('incomplete')}
            isClickable={hasSelectedAcademic}
          />
        </div>
      </div>

      {/* Statistics Cards - Row 2 */}
      <div className="grid grid-cols-9 gap-6 mb-6">
        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Total Transactions"
            value={dashboardData?.transactionStats?.total_paid_transaction_amount || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 7h6" />
                <path d="M9 10h6" />
                <path d="M9 7h4a3 3 0 0 1 0 6H9l5 5" />
              </svg>
            }
            bgColor="#0085db"
            image={img1}
            subtitle="Total transaction amount"
            onClick={() => handleCardClick('total-transactions')}
            isClickable={true}
          />
        </div>

        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Count of Captured"
            value={dashboardData?.transactionStats?.total_paid_transaction_count || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 7h6" />
                <path d="M9 10h6" />
                <path d="M9 7h4a3 3 0 0 1 0 6H9l5 5" />
              </svg>
            }
            bgColor="#0085db"
            image={img2}
            subtitle="Successful transaction count"
            onClick={() => handleCardClick('captured-count')}
            isClickable={true}
          />
        </div>

        <div className="lg:col-span-3 col-span-12">
          <ApplicationCard
            title="Count of Initialized"
            value={dashboardData?.transactionStats?.total_unpaid_transaction_count || 0}
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
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9 7h6" />
                <path d="M9 10h6" />
                <path d="M9 7h4a3 3 0 0 1 0 6H9l5 5" />
              </svg>
            }
            bgColor="#0085db"
            image={img3}
            subtitle="Pending transaction count"
            onClick={() => handleCardClick('initialized-count')}
            isClickable={true}
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        {/* ✅ SuperAdmin and SupportAdmin — dono charts show */}
        {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
          <>
            <div className="lg:col-span-6 col-span-12">
              <BarChart
                labels={
                  dashboardData?.degreeWisePaidApplications?.map((item: any) => item.name) || []
                }
                values={
                  dashboardData?.degreeWisePaidApplications?.map(
                    (item: any) => item.paid_applications_count,
                  ) || []
                }
                title="Degree Wise Paid Application"
                subtitle="Distribution of paid applications by degree"
              />
            </div>

            <div className="lg:col-span-6 col-span-12">
              <BarChart
                labels={
                  dashboardData?.classWisePaidApplications?.map((item: any) => item.class_name) ||
                  []
                }
                values={
                  dashboardData?.classWisePaidApplications?.map(
                    (item: any) => item.paid_applications_count,
                  ) || []
                }
                title="Class Wise Paid Application"
                subtitle="Distribution of paid applications by class"
              />
            </div>
          </>
        )}
      </div>

      {user?.role === 'CustomerAdmin' && dashboardData && (
        <div className="mb-6">
          {/* ✅ CustomerAdmin — academic_type ke basis par */}
          <>
            {user?.academic_type === 1 && dashboardData?.classWisePaidApplications && (
              <div className="lg:col-span-6 col-span-12">
                <BarChart
                  labels={
                    dashboardData?.classWisePaidApplications?.map((item: any) => item.class_name) ||
                    []
                  }
                  values={
                    dashboardData?.classWisePaidApplications?.map(
                      (item: any) => item.paid_applications_count,
                    ) || []
                  }
                  title="Class Wise Paid Application"
                  subtitle="Distribution of paid applications by class"
                />
              </div>
            )}

            {user?.academic_type === 2 && dashboardData?.degreeWisePaidApplications && (
              <div className="lg:col-span-6 col-span-12">
                <BarChart
                  labels={
                    dashboardData?.degreeWisePaidApplications?.map((item: any) => item.name) || []
                  }
                  values={
                    dashboardData?.degreeWisePaidApplications?.map(
                      (item: any) => item.paid_applications_count,
                    ) || []
                  }
                  title="Degree Wise Paid Application"
                  subtitle="Distribution of paid applications by degree"
                />
              </div>
            )}
          </>
        </div>
      )}

      {/* Applications Table */}
      <div className="col-span-12">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
            <div>
              <h5 className="text-lg font-semibold text-gray-900">Recently Added Application</h5>
              <h6 className="text-sm text-gray-600">
                {user?.role === 'CustomerAdmin' 
                  ? `Application List for ${selectedAcademicName || 'Your Academic'}`
                  : 'Application List across all Academic'
                }
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
                        Applicant Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Academic Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Roll No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Degree/Class
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData?.latestApplications?.map((app: any, index: number) => (
                      <tr
                        key={app.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {(filters.page || 0) * (filters.rowsPerPage || 10) + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                          {app.applicant_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                          {app.academic_name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className="text-blue-600 font-medium hover:text-blue-800 hover:underline cursor-pointer transition-colors duration-200"
                            onClick={() => handleRollNoClick(app)}
                            title="Click to view application details"
                          >
                            {app.roll_no}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {app.degree_name || app.class_name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              app.payment_status === 1
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {app.payment_status === 1 ? 'Captured' : 'Initialized'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Pagination
                currentPage={(filters.page || 0) + 1}
                totalPages={Math.ceil(
                  (dashboardData?.totalLatestApplications || 0) / (filters.rowsPerPage || 10),
                )}
                totalItems={dashboardData?.totalLatestApplications || 0}
                rowsPerPage={filters.rowsPerPage || 10}
                onPageChange={(page) => handlePageChange(page - 1)}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;