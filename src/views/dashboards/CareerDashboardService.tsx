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
      `${apiUrl}/${role}/career-dashboard?${params.toString()}`,
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
