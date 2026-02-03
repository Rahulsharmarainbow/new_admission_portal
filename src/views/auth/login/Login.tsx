// components/auth/LoginPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Checkbox, Label, TextInput } from 'flowbite-react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import { authService } from 'src/services/authService';
import { AuthLayout } from 'src/layouts/AuthLayout';

export const LoginPage: React.FC = () => {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.login(loginData);
      
      if (response.status) {
        const userData = {
          id: response.admin_id,
          name: response.name,
          email: loginData.email,
          role: response.role,
          login_type: response.login_type,
          profile: response.profile,
          whatsapp_status: response.whatsapp_status,
          email_status: response.email_status,
          sms_status: response.sms_status,
          academic_type: response.academic_type || null,
          academic_id : response.academic_id || null, 
          token : response.two_step_auth == 0 ? response.auth_token : null,
          compaign_access : response.compaign_access || 0, 
        };

        if(response.two_step_auth === 0) {
          login(userData);
          redirectToDashboard(response.login_type);
          return
        }

        // Check if two-step verification is needed
        const availableMethods = [];
        if (response.whatsapp_status) availableMethods.push('whatsapp');
        if (response.email_status) availableMethods.push('email');
        if (response.sms_status) availableMethods.push('sms');

        if (availableMethods.length > 1) {
          // Multiple methods available, go to two-step selection
          navigate('/two-step-verification', { 
            state: { 
              userData,
              availableMethods 
            } 
          });
        } else if (availableMethods.length === 1) {
          // Only one method available, directly send OTP
          const method = availableMethods[0];
          await authService.sendTwoStepOtp({
            contact: loginData.email,
            method,
            id: response.admin_id,
          });
          
          navigate('/verify-otp', { 
            state: { 
              userData,
              method,
              mode: 'login'
            } 
          });
        } else {
          // No two-step verification needed, login directly
          login(userData);
          redirectToDashboard(response.login_type);
        }
      }else{
        toast.error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const redirectToDashboard = (loginType: number) => {
    switch (loginType) {
      case 1:
        navigate('/superadmin/dashboard');
        break;
      case 2:
        navigate('/supportadmin/dashboard');
        break;
      case 3:
        navigate('/customeradmin/dashboard');
        break;
      case 4:
        navigate('/salesadmin/dashboard');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Login
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Enter your email and password to login
          </p>
      <div className="mb-4">
        <div className="mb-2 block">
          <Label htmlFor="email" value="Email" />
        </div>
        <TextInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
          value={loginData.email}
          onChange={(e) => setLoginData({...loginData, email: e.target.value})}
        />
      </div>

      <div>
  <Label htmlFor="password" value="Password" />
  <div className="relative">
    <TextInput
      id="password"
      type={showPassword ? "text" : "password"}
      placeholder="Enter your password"
      required
      value={loginData.password}
      onChange={(e) =>
        setLoginData({ ...loginData, password: e.target.value })
      }
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? (
        <HiEyeOff className="h-5 w-5" />
      ) : (
        <HiEye className="h-5 w-5" />
      )}
    </button>
  </div>
</div>


      <div className="flex justify-between items-center my-5">
        <div className="flex items-center gap-2">
          <Checkbox 
            id="remember" 
            checked={rememberDevice}
            onChange={(e) => setRememberDevice(e.target.checked)}
          />
          <Label htmlFor="remember" className="opacity-90 font-normal cursor-pointer">
            Remember this Device
          </Label>
        </div>
        <button 
          type="button" 
          className="text-primary text-sm font-medium"
          onClick={handleForgotPassword}
        >
          Forgot Password?
        </button>
      </div>

      <Button 
        type="submit" 
        color="primary" 
        className="w-full bg-primary text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Signing In...' : 'Sign In'}
      </Button>
    </form>
    </AuthLayout>
  );
};