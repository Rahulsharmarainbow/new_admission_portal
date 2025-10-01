// services/dashboardService.ts
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface DashboardData {
  paymentStatusCounts: {
    total_applications: number;
    incomplete_applications: number;
    failed_applications: number;
    paid_applications: number;
  };
  degreeWisePaidApplications: Array<{
    name: string;
    paid_applications_count: number;
  }>;
  classWisePaidApplications: Array<{
    class_name: string;
    paid_applications_count: number;
  }>;
  latestApplications: Array<{
    id: number;
    academic_name: string;
    degree_name: string | null;
    class_name: string | null;
    roll_no: string;
    applicant_name: string;
    payment_status: number;
    created_at: string;
  }>;
  totalLatestApplications: number;
}

export interface DashboardFilters {
  page?: number;
  rowsPerPage?: number;
  order?: 'asc' | 'desc';
  orderBy?: string;
  search?: string;
  year?: string;
  academic?: string;
}

export const dashboardService = {
  getDashboardData: async (filters: DashboardFilters, userId: number, token: string): Promise<DashboardData> => {
    const params = new URLSearchParams();
    
    // Add filters to params
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    params.append('s_id', userId.toString());

    const response = await axios.post(
      `${apiUrl}/SuperAdmin/dashboard-data?${params.toString()}`,
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