import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export interface CareerDashboardFilters {
  page: number;
  rowsPerPage: number;
  year?: string;
  academic_id?: string;
  search?: string;
}

export interface CareerDashboardData {
  status: boolean;
  counts: {
    active_application: number;
    draft_application: number;
    close_application: number;
    applied_application: number;
    shortlisted_application: number;
    interview_application: number;
  };
  total_applications: number;
  recent_applications: Array<{
    reference_id: string;
    job_name: string;
    name: string;
    email: string;
    mobile: string;
    resume: string | null;
    created_at: string;
  }>;
}

export const careerDashboardService = {
  getCareerDashboardData: async (filters: CareerDashboardFilters, userId: number, token: string, role: string): Promise<CareerDashboardData> => {
    const params = new URLSearchParams();

    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    params.append('s_id', userId.toString());

    const response = await axios.post(
      `${apiUrl}/CustomerAdmin/career-dashboard?${params.toString()}`,
      {},
      {
        headers: {
          'accept': '/',
          'content-type': 'application/json',
          'superadmin_auth_token': token,
          'Authorization': `Bearer ${token}`
        }
      }
    );

    return response.data;
  },
};

//   getCareerDashboardData: async (
//     filters: CareerDashboardFilters,
//     userId: string,
//     token: string,
//     role: string
//   ): Promise<CareerDashboardData> => {
//     try {
//       console.log("Making API call with filters:", filters);
//       console.log("API URL:", `${apiUrl}/CustomerAdmin/career-dashboard`);
//       console.log("Token:", token ? "Token present" : "No token");

//       const response = await axios.post(
//         `${apiUrl}/CustomerAdmin/career-dashboard`,
//         {
//           params: {
//             page: filters.page,
//             rowsPerPage: filters.rowsPerPage,
//             year: filters.year,
//             academic_id: filters.academic_id || userId,
//             search: filters.search || undefined
//           },
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Accept': '/',
//             'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Referer': window.location.origin,
//             'sec-ch-ua': '"Chromium";v="142", "Microsoft Edge";v="142", "Not_A Brand";v="99"',
//             'sec-ch-ua-mobile': '?0',
//             'sec-ch-ua-platform': '"Windows"',
//             'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
//             'priority': 'u=1, i',
//             'superadmin_auth_token': token,
//             'Content-Type': 'application/json'
//           },
//         }
//       );

//       console.log("API Response:", response.data);
//       return response.data;
//     } catch (error: any) {
//       console.error('Career Dashboard API Error Details:', {
//         message: error.message,
//         response: error.response?.data,
//         status: error.response?.status,
//         headers: error.response?.headers
//       });
      
//       if (error.response) {
//         throw new Error(error.response.data?.message || `API Error: ${error.response.status}`);
//       } else if (error.request) {
//         throw new Error('No response received from server');
//       } else {
//         throw new Error('Error setting up request: ' + error.message);
//       }
//     }
//   },
// };