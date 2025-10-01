import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Label, TextInput, Radio } from 'flowbite-react';
import { HiDeviceMobile, HiChat, HiMail } from 'react-icons/hi';
import { authService } from 'src/services/authService';
import { toast } from 'react-hot-toast';
import { AuthLayout } from 'src/layouts/AuthLayout';

export const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.sendResetLink(email);
      
      if (response.status) {
        toast.success( response.message || 'Reset link sent to your email');
        navigate('/login');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!method) {
      toast.error('Please select a method');
      return;
    }

    setIsLoading(true);

    try {
      let response;
      if (method === 'sms') {
        response = await authService.sendSmsOtp(phone, 'your_sms_code');
      } else {
        response = await authService.sendWhatsappOtp(phone, 'your_whatsapp_code');
      }

      if (response.status) {
        toast.success(response.message || 'OTP sent successfully');
        console.log(response);
        navigate('/verify-otp', {
          state: {
            method,
            mode: 'forgotPassword',
            adminId: response.Data?.id 
          }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
        <div>
      {step === 1 ? (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Forgot Password
          </h3>
          <p className="text-sm text-gray-600 mb-6">
            Select how you want to reset your password
          </p>

          <div className="space-y-3">
            <div 
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
              onClick={() => setStep(2)}
            >
              <HiMail className="h-6 w-6 text-primary" />
              <div>
                <Label className="font-medium cursor-pointer">Reset via Email</Label>
                <p className="text-sm text-gray-500">Get reset link on your email</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
              onClick={() => setStep(3)}
            >
              <HiDeviceMobile className="h-6 w-6 text-primary" />
              <div>
                <Label className="font-medium cursor-pointer">Reset via Phone</Label>
                <p className="text-sm text-gray-500">Get OTP on SMS or WhatsApp</p>
              </div>
            </div>
          </div>

          <Button 
            type="button" 
            color="gray" 
            className="w-full mt-6"
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </div>
      ) : step === 2 ? (
        <form onSubmit={handleEmailSubmit}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reset via Email
          </h3>
          
          <div className="mb-4">
            <Label htmlFor="email" value="Email Address" />
            <TextInput
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              color="gray" 
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              className="flex-1 bg-primary text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </Button>
          </div>
        </form>
      ) : (
        <form onSubmit={handlePhoneSubmit}>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reset via Phone
          </h3>
          
          <div className="mb-4">
            <Label htmlFor="phone" value="Phone Number" />
            <TextInput
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="mt-1"
            />
          </div>

          <div className="mb-4">
            <Label value="Select Method" />
            <div className="space-y-2 mt-2">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Radio 
                  id="sms" 
                  name="method" 
                  value="sms"
                  checked={method === 'sms'}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <Label htmlFor="sms" className="cursor-pointer flex items-center gap-2">
                  <HiDeviceMobile className="h-5 w-5" />
                  Send OTP via SMS
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Radio 
                  id="whatsapp" 
                  name="method" 
                  value="whatsapp"
                  checked={method === 'whatsapp'}
                  onChange={(e) => setMethod(e.target.value)}
                />
                <Label htmlFor="whatsapp" className="cursor-pointer flex items-center gap-2">
                  <HiChat className="h-5 w-5" />
                  Send OTP via WhatsApp
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              color="gray" 
              className="flex-1"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            <Button 
              type="submit" 
              color="primary" 
              className="flex-1 bg-primary text-white"
              disabled={!method || !phone || isLoading}
            >
              {isLoading ? 'Sending...' : 'Send OTP'}
            </Button>
          </div>
        </form>
      )}
    </div>
    </AuthLayout>
  );
};