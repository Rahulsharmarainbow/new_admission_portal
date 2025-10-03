// components/auth/VerifyOtp.tsx
import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, TextInput } from 'flowbite-react';
import { useAuth } from 'src/hook/useAuth';
import { authService } from 'src/services/authService';
import { toast } from 'react-hot-toast';
import { AuthLayout } from 'src/layouts/AuthLayout';

interface LocationState {
  userData: any;
  method: string;
  mode?: 'login' | 'forgotPassword';
  adminId?: number;
}

export const VerifyOtp: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const { userData, method, mode = 'login', adminId } = location.state as LocationState;

  useEffect(() => {
    otpInputRefs.current[0]?.focus();
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.some((digit) => digit === '')) {
      toast.error('Please enter complete OTP');
      return;
    }

    setIsLoading(true);
    const otpCode = otp.join('');

    try {
      if (mode === 'login') {
        const response = await authService.verifyOtp({
          otp: otpCode,
          method,
          id: userData.id,
        });

        if (response.status) {
          // Set token in cookies and login user
          const userWithToken = {
            ...userData,
            token: response.auth_token,
          };
          login(userWithToken);
          redirectToDashboard(userData.login_type);
        }else{
          toast.error(response.message);
        }
      } else {
        // Forgot password flow
        const response = await authService.verifyOtpForForget(otpCode, method, adminId!);

        if (response.status) {
          const token = response.changepasswordurl.split('/').pop() || '';
          const id = response.Data.id;
          navigate(`/auth/forget-password/${token}`, { state: { id } });
        }else{
          toast.error(response.message);
        }
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'OTP verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = (loginType: number) => {
    switch (loginType) {
      case 1:
        navigate('/SuperAdmin/dashboard');
        break;
      case 2:
        navigate('/SupportAdmin/dashboard');
        break;
      case 3:
        navigate('/CustomerAdmin/dashboard');
        break;
      case 4:
        navigate('/SalesAdmin/dashboard');
        break;
      default:
        navigate('/auth/404');
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await authService.sendTwoStepOtp({
        contact: userData.email,
        method: method as 'sms' | 'whatsapp' | 'email',
        id: userData.id,
      });

      if (response.status) {
        toast.success(response.message || 'OTP resent successfully');
        setOtp(['', '', '', '']);
        otpInputRefs.current[0]?.focus();
      }else{
        toast.error(response.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const getMethodDisplay = () => {
    switch (method) {
      case 'sms':
        return 'SMS';
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'email';
      default:
        return method;
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (!/^\d+$/.test(pastedData)) return; // only digits

    const otpDigits = pastedData.split('').slice(0, 4);
    const newOtp = [...otp];

    otpDigits.forEach((digit, i) => {
      if (i < 4) {
        newOtp[i] = digit;
      }
    });

    setOtp(newOtp);

    // Focus last filled input
    const lastIndex = otpDigits.length - 1;
    if (lastIndex >= 0) {
      otpInputRefs.current[lastIndex]?.focus();
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {mode === 'login' ? 'Enter OTP' : 'Reset Password - Enter OTP'}
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            We've sent a 4-digit OTP to your {getMethodDisplay()}
          </p>

          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[index]}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleOtpKeyDown(index, e)}
                onPaste={handleOtpPaste}
                ref={(el) => (otpInputRefs.current[index] = el)}
                className="w-14 h-14 text-center text-xl font-semibold border rounded-full focus:ring-2 focus:ring-primary"
              />
            ))}
          </div>

          <div className="text-center">
            <button
              type="button"
              className="text-primary text-sm font-medium"
              onClick={handleResendOtp}
            >
              Resend OTP
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button type="button" color="gray" className="flex-1" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button
            type="submit"
            color="primary"
            className="flex-1 bg-primary text-white"
            disabled={otp.some((digit) => digit === '') || isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};
