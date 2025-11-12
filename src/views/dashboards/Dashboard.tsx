// // views/dashboards/Dashboard.tsx
// import { useState, useEffect } from 'react';
// import { toast } from 'react-hot-toast';
// import { dashboardService, DashboardFilters } from 'src/services/dashboardService';
// import img1 from '../../../public/Images/top-error-shape.png';
// import img2 from '../../../public/Images/top-info-shape.png';
// import img3 from '../../../public/Images/top-warning-shape.png';
// import { useAuth } from 'src/hook/useAuth';
// import { useDebounce } from 'src/hook/useDebounce';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import BarChart from './BarChart';
// import { BsFillSearchHeartFill, BsSearch } from 'react-icons/bs';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
// import { HiChevronDown } from 'react-icons/hi';

// const Dashboard = () => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [dashboardData, setDashboardData] = useState<any>(null);
//   const [filters, setFilters] = useState<DashboardFilters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'id',
//     search: '',
//     year: '2025',
//     academic: '',
//   });

//   // Debounced search
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch dashboard data
//   const fetchDashboardData = async () => {
//     if (!user?.id || !user?.token) return;

//     setLoading(true);
//     try {
//       const data = await dashboardService.getDashboardData(filters, user.id, user.token, user.role);
//       setDashboardData(data);
//     } catch (error: any) {
//       console.error('Error fetching dashboard data:', error);
//       toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchDashboardData();
//   }, [
//     filters.page,
//     filters.rowsPerPage,
//     filters.order,
//     filters.orderBy,
//     debouncedSearch,
//     filters.year,
//     filters.academic,
//   ]);

//   // Update search filter
//   const handleSearchChange = (value: string) => {
//     setFilters((prev) => ({ ...prev, search: value, page: 0 }));
//   };

//   // Update page
//   const handlePageChange = (page: number) => {
//     setFilters((prev) => ({ ...prev, page: page - 1 }));
//   };

//   // Update rows per page
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Loading state
//   if (loading && !dashboardData) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Filter Section */}
//       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
//         <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
//           {/* Year Dropdown */}
//            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && 
//            (<div className="relative w-full sm:w-auto">
//             <select
//               value={filters.year}
//               onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value, page: 0 }))}
//              className="w-full sm:w-auto min-w-[250px] px-3 py-2.5 border border-gray-300 rounded-md bg-white 
// focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"

//             >
//               <option value="2025">2025</option>
//               <option value="2024">2024</option>
//               <option value="2023">2023</option>
//               <option value="2022">2022</option>
//             </select>
//             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//               <HiChevronDown className="w-4 h-4" />
//             </div>
//           </div>
//         )}

//           {/* Academic Dropdown */}
//            {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  (
//              <div className="relative w-full sm:w-auto ">
//             <AcademicDropdown
//               name="academic"
//               formData={filters}
//               setFormData={setFilters}
//               includeAllOption
//               label=""
//               className="min-w-[250px] text-sm"
//             />
//           </div>
//             )}
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-12 gap-6 mb-6">
//         <div className="lg:col-span-3 col-span-12">
//           <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
//             <img
//               alt="img"
//               loading="lazy"
//               width="59"
//               height="81"
//               decoding="async"
//               className="absolute top-0 right-0"
//               src={img2}
//             />
//             <div className="relative z-10">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="white"
//                     strokeWidth="1.5"
//                   >
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <path
//                       strokeLinecap="round"
//                       d="M9 14h3m-2-2V8.2c0-.186 0-.279.012-.356a1 1 0 0 1 .832-.832C10.92 7 11.014 7 11.2 7h2.3a2.5 2.5 0 0 1 0 5zm0 0v5m0-5H9"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//               <h4 className="text-2xl font-bold text-white mb-1">
//                 {dashboardData?.paymentStatusCounts?.total_applications || 0}
//               </h4>
//               <span className="text-sm text-white text-opacity-90 font-medium">
//                 Total Applications
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-3 col-span-12">
//           <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
//             <img
//               alt="img"
//               loading="lazy"
//               width="59"
//               height="81"
//               decoding="async"
//               className="absolute top-0 right-0"
//               src={img1}
//             />
//             <div className="relative z-10">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="white"
//                     strokeWidth="1.5"
//                   >
//                     <path
//                       d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12"
//                       opacity="0.5"
//                     ></path>
//                     <path d="M2 14c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 6.545C5.8 6 7.2 6 10 6h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 9.8 22 11.2 22 14s0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 22 16.8 22 14 22h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 18.2 2 16.8 2 14Z"></path>
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       d="M12 11v6m0 0l2.5-2.5M12 17l-2.5-2.5"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//               <h4 className="text-2xl font-bold text-white mb-1">
//                 {dashboardData?.paymentStatusCounts?.paid_applications || 0}
//               </h4>
//               <span className="text-sm text-white text-opacity-90 font-medium">
//                 Paid Applications
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-3 col-span-12">
//           <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
//             <img
//               alt="img"
//               loading="lazy"
//               width="59"
//               height="81"
//               decoding="async"
//               className="absolute top-0 right-0"
//               src={img2}
//             />
//             <div className="relative z-10">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="white"
//                     strokeWidth="1.5"
//                   >
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <path
//                       strokeLinecap="round"
//                       d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//               <h4 className="text-2xl font-bold text-white mb-1">
//                 {dashboardData?.paymentStatusCounts?.failed_applications || 0}
//               </h4>
//               <span className="text-sm text-white text-opacity-90 font-medium">
//                 Failed Applications
//               </span>
//             </div>
//           </div>
//         </div>

//         <div className="lg:col-span-3 col-span-12">
//           <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
//             <img
//               alt="img"
//               loading="lazy"
//               width="59"
//               height="81"
//               decoding="async"
//               className="absolute top-0 right-0"
//               src={img3}
//             />
//             <div className="relative z-10">
//               <div className="flex items-center mb-4">
//                 <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     width="24"
//                     height="24"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="white"
//                     strokeWidth="1.5"
//                   >
//                     <circle cx="12" cy="12" r="10"></circle>
//                     <path
//                       strokeLinecap="round"
//                       d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"
//                     ></path>
//                   </svg>
//                 </div>
//               </div>
//               <h4 className="text-2xl font-bold text-white mb-1">
//                 {dashboardData?.paymentStatusCounts?.incomplete_applications || 0}
//               </h4>
//               <span className="text-sm text-white text-opacity-90 font-medium">
//                 Incomplete Applications
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts Section */}
//       <div className="grid grid-cols-12 gap-6 mb-6">
//         {/* ✅ SuperAdmin and SupportAdmin — dono charts show */}
//         {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//           <>
//             <div className="lg:col-span-6 col-span-12">
//               <BarChart
//                 labels={
//                   dashboardData?.degreeWisePaidApplications?.map((item: any) => item.name) || []
//                 }
//                 values={
//                   dashboardData?.degreeWisePaidApplications?.map(
//                     (item: any) => item.paid_applications_count,
//                   ) || []
//                 }
//                 title="Degree Wise Paid Application"
//                 subtitle="Distribution of paid applications by degree"
//               />
//             </div>

//             <div className="lg:col-span-6 col-span-12">
//               <BarChart
//                 labels={
//                   dashboardData?.classWisePaidApplications?.map((item: any) => item.class_name) ||
//                   []
//                 }
//                 values={
//                   dashboardData?.classWisePaidApplications?.map(
//                     (item: any) => item.paid_applications_count,
//                   ) || []
//                 }
//                 title="Class Wise Paid Application"
//                 subtitle="Distribution of paid applications by class"
//               />
//             </div>
//           </>
//         )}
//       </div>

//       {user?.role === 'CustomerAdmin' && (<div className="mb-6">
//         {/* ✅ CustomerAdmin — academic_type ke basis par */}
        
//           <>
//             {user?.academic_type === 1 && (
//               <div className="lg:col-span-6 col-span-12">
//                 <BarChart
//                   labels={
//                     dashboardData?.classWisePaidApplications?.map((item: any) => item.class_name) ||
//                     []
//                   }
//                   values={
//                     dashboardData?.classWisePaidApplications?.map(
//                       (item: any) => item.paid_applications_count,
//                     ) || []
//                   }
//                   title="Class Wise Paid Application"
//                   subtitle="Distribution of paid applications by class"
//                 />
//               </div>
//             )}

//             {user?.academic_type === 2 && (
//               <div className="lg:col-span-6 col-span-12">
//                 <BarChart
//                   labels={
//                     dashboardData?.degreeWisePaidApplications?.map((item: any) => item.name) || []
//                   }
//                   values={
//                     dashboardData?.degreeWisePaidApplications?.map(
//                       (item: any) => item.paid_applications_count,
//                     ) || []
//                   }
//                   title="Degree Wise Paid Application"
//                   subtitle="Distribution of paid applications by degree"
//                 />
//               </div>
//             )}
//           </>
//       </div>
//         )}

//       {/* Applications Table */}
//       <div className="col-span-12">
//         <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
//           <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
//             <div>
//               <h5 className="text-lg font-semibold text-gray-900">Recently Added Application</h5>
//               <h6 className="text-sm text-gray-600">Application List across all Academic</h6>
//             </div>
//             <div className="relative w-full lg:w-auto">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <BsFillSearchHeartFill className="w-5 h-5 text-blue-400" />
//               </div>
//               <input
//                 type="text"
//                 placeholder="Search Applications..."
//                 value={filters.search}
//                 onChange={(e) => handleSearchChange(e.target.value)}
//                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full lg:w-64"
//               />
//             </div>
//           </div>

//           {loading ? (
//             <div className="flex items-center justify-center h-32">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//             </div>
//           ) : (
//             <>
//               <div className="overflow-x-auto rounded-lg border border-gray-200">
//                 <table className="min-w-full divide-y divide-gray-200">
//                   <thead className="bg-gray-50">
//                     <tr>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         S.No
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Applicant Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Academic Name
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Roll No
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Degree/Class
//                       </th>
//                       <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Status
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="bg-white divide-y divide-gray-200">
//                     {dashboardData?.latestApplications?.map((app: any, index: number) => (
//                       <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {(filters.page || 0) * (filters.rowsPerPage || 10) + index + 1}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
//                           {app.applicant_name}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
//                           {app.academic_name}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
//                           <span className="cursor-default">{app.roll_no}</span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {app.degree_name || app.class_name || 'N/A'}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                               app.payment_status === 1
//                                 ? 'bg-green-100 text-green-800'
//                                 : 'bg-yellow-100 text-yellow-800'
//                             }`}
//                           >
//                             {app.payment_status === 1 ? 'Paid' : 'Pending'}
//                           </span>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>

//               <Pagination
//                 currentPage={(filters.page || 0) + 1}
//                 totalPages={Math.ceil(
//                   (dashboardData?.totalLatestApplications || 0) / (filters.rowsPerPage || 10),
//                 )}
//                 totalItems={dashboardData?.totalLatestApplications || 0}
//                 rowsPerPage={filters.rowsPerPage || 10}
//                 onPageChange={(page) => handlePageChange(page - 1)}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//               />
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default Dashboard;


















// views/dashboards/Dashboard.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; // ✅ Add this import
import { toast } from 'react-hot-toast';
import { dashboardService, DashboardFilters } from 'src/services/dashboardService';
import img1 from '../../../public/Images/top-error-shape.png';
import img2 from '../../../public/Images/top-info-shape.png';
import img3 from '../../../public/Images/top-warning-shape.png';
import { useAuth } from 'src/hook/useAuth';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import BarChart from './BarChart';
import { BsFillSearchHeartFill, BsSearch } from 'react-icons/bs';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import { HiChevronDown } from 'react-icons/hi';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); // ✅ Add navigate hook
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [filters, setFilters] = useState<DashboardFilters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
    year: '2025',
    academic: '',
  });

  // ✅ Handle Roll No Click Function
  const handleRollNoClick = (application: any) => {
    const applicationId = application.application_id || application.id;
    if (applicationId) {
      navigate(`/SuperAdmin/application-details/${applicationId}`);
    } else {
      toast.error('Application ID not found');
    }
  };

  // ✅ Handle Row Click (Optional - if you want whole row clickable)
  const handleRowClick = (application: any) => {
    const applicationId = application.application_id || application.id;
    if (applicationId) {
      navigate(`/SuperAdmin/application-details/${applicationId}`);
    }
  };

  // Debounced search
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    if (!user?.id || !user?.token) return;

    setLoading(true);
    try {
      const data = await dashboardService.getDashboardData(filters, user.id, user.token, user.role);
      console.log(data);
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
      {/* Filter Section */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Year Dropdown */}
          {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && 
           (<div className="relative w-full sm:w-auto">
            <select
              value={filters.year}
              onChange={(e) => setFilters((prev) => ({ ...prev, year: e.target.value, page: 0 }))}
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
        )}

          {/* Academic Dropdown */}
          {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  (
            <div className="relative w-full sm:w-auto ">
            <AllAcademicsDropdown
              name="academic"
              formData={filters}
              setFormData={setFilters}
              includeAllOption
              label=""
              className="min-w-[250px] text-sm"
            />
          </div>
            )}
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-12 gap-6 mb-6">
        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img2}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path
                      strokeLinecap="round"
                      d="M9 14h3m-2-2V8.2c0-.186 0-.279.012-.356a1 1 0 0 1 .832-.832C10.92 7 11.014 7 11.2 7h2.3a2.5 2.5 0 0 1 0 5zm0 0v5m0-5H9"
                    ></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">
                {dashboardData?.paymentStatusCounts?.total_applications || 0}
              </h4>
              <span className="text-sm text-white text-opacity-90 font-medium">
                Total Applications
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img1}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <path
                      d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12"
                      opacity="0.5"
                    ></path>
                    <path d="M2 14c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 6.545C5.8 6 7.2 6 10 6h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 9.8 22 11.2 22 14s0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 22 16.8 22 14 22h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 18.2 2 16.8 2 14Z"></path>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 11v6m0 0l2.5-2.5M12 17l-2.5-2.5"
                    ></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">
                {dashboardData?.paymentStatusCounts?.paid_applications || 0}
              </h4>
              <span className="text-sm text-white text-opacity-90 font-medium">
                Paid Applications
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img2}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path
                      strokeLinecap="round"
                      d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"
                    ></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">
                {dashboardData?.paymentStatusCounts?.failed_applications || 0}
              </h4>
              <span className="text-sm text-white text-opacity-90 font-medium">
                Failed Applications
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-3 col-span-12">
          <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
            <img
              alt="img"
              loading="lazy"
              width="59"
              height="81"
              decoding="async"
              className="absolute top-0 right-0"
              src={img3}
            />
            <div className="relative z-10">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-lg bg-opacity-20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path
                      strokeLinecap="round"
                      d="M12 6v12m3-8.5C15 8.12 13.657 7 12 7S9 8.12 9 9.5s1.343 2.5 3 2.5s3 1.12 3 2.5s-1.343 2.5-3 2.5s-3-1.12-3-2.5"
                    ></path>
                  </svg>
                </div>
              </div>
              <h4 className="text-2xl font-bold text-white mb-1">
                {dashboardData?.paymentStatusCounts?.incomplete_applications || 0}
              </h4>
              <span className="text-sm text-white text-opacity-90 font-medium">
                Incomplete Applications
              </span>
            </div>
          </div>
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

      {user?.role === 'CustomerAdmin' && (<div className="mb-6">
        {/* ✅ CustomerAdmin — academic_type ke basis par */}
        
          <>
            {user?.academic_type === 1 && (
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

            {user?.academic_type === 2 && (
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
              <h6 className="text-sm text-gray-600">Application List across all Academic</h6>
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
                        // ✅ Optional: Uncomment if you want whole row clickable
                        // onClick={() => handleRowClick(app)}
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
                          {/* ✅ Updated Roll No with click handler */}
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
                            {app.payment_status === 1 ? 'Captured' : 'Intilized'}
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