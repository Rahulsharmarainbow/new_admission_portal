// components/auth/ChangePassword.tsx
import React, { useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router';
import { Button, Label, TextInput } from 'flowbite-react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { authService } from 'src/services/authService';
import { AuthLayout } from 'src/layouts/AuthLayout';

export const ChangePassword: React.FC = () => {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  
  const { token } = useParams<{ token: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location?.state as { id?: number };
  const id = state?.id;

  const validatePassword = (password: string) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const errors: string[] = [];
    
    if (password.length < minLength) {
      errors.push(`Password must be at least ${minLength} characters long`);
    }
    if (!hasUpperCase) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!hasLowerCase) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!hasNumbers) {
      errors.push('Password must contain at least one number');
    }
    if (!hasSpecialChar) {
      errors.push('Password must contain at least one special character');
    }

    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords
    const passwordErrors = validatePassword(formData.newPassword);
    if (passwordErrors.length > 0) {
      setErrors({ newPassword: passwordErrors.join(', ') });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);

    try {
      const response = await authService.resetPassword({
        id,
        token: token!,
        newPassword: formData.newPassword,
      });

      if (response.status) {
        toast.success('Password changed successfully');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: 'newPassword' | 'confirmPassword') => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <AuthLayout>
        <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Change Password
      </h3>

      <div>
        <Label htmlFor="newPassword" value="New Password" />
        <div className="relative mt-1">
          <TextInput
            id="newPassword"
            type={showPassword.newPassword ? "text" : "password"}
            placeholder="Enter new password"
            required
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            className=""
            color={errors.newPassword ? 'failure' : undefined}
            helperText={errors.newPassword}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={() => togglePasswordVisibility('newPassword')}
          >
            {showPassword.newPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <div>
        <Label htmlFor="confirmPassword" value="Confirm Password" />
        <div className="relative mt-1">
          <TextInput
            id="confirmPassword"
            type={showPassword.confirmPassword ? "text" : "password"}
            placeholder="Confirm new password"
            required
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            className=""
            color={errors.confirmPassword ? 'failure' : undefined}
            helperText={errors.confirmPassword}
          />
          <button
            type="button"
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
            onClick={() => togglePasswordVisibility('confirmPassword')}
          >
            {showPassword.confirmPassword ? <HiEyeOff className="h-5 w-5" /> : <HiEye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button 
        type="submit" 
        color="primary" 
        className="w-full bg-primary text-white"
        disabled={isLoading}
      >
        {isLoading ? 'Changing Password...' : 'Change Password'}
      </Button>
    </form>
    </AuthLayout>
  );
};