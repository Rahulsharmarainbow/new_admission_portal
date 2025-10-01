// services/authService.ts
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface LoginData {
  email: string;
  password: string;
}

export interface TwoStepOtpData {
  contact: string;
  method: 'sms' | 'whatsapp' | 'email';
  id: number;
}

export interface VerifyOtpData {
  otp: string;
  method: string;
  id: number;
}

export interface ResetPasswordData {
  id: number;
  token: string;
  newPassword: string;
}

export const authService = {
  login: async (data: LoginData) => {
    const response = await api.post('auth/login', data);
    return response.data;
  },

  sendTwoStepOtp: async (data: TwoStepOtpData) => {
    const response = await api.post('auth/two_step_otp', data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpData) => {
    const response = await api.post('auth/verify-otp', data);
    return response.data;
  },

  sendResetLink: async (email: string) => {
    const response = await api.post('auth/send-reset-link', { email });
    return response.data;
  },

  sendSmsOtp: async (number: string, smsCode: string) => {
    const response = await api.post('auth/send-sms-otp', {
      number,
      sms_code: smsCode,
    });
    return response.data;
  },

  sendWhatsappOtp: async (number: string, whatsappCode: string) => {
    const response = await api.post('auth/send-whatsapp-otp', {
      number,
      whatsapp_code: whatsappCode,
    });
    return response.data;
  },

  verifyOtpForForget: async (otp: string, method: string, id: number) => {
    const response = await api.post('auth/verify-otp-for-forget', {
      otp,
      method,
      id,
    });
    return response.data;
  },

  resetPassword: async (data: ResetPasswordData) => {
    const response = await api.post('auth/reset-password', data);
    return response.data;
  },
};