
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Label, Radio, Spinner } from 'flowbite-react';
import { 
  FiSmartphone, 
  FiMessageCircle, 
  FiMail,
  FiArrowLeft,
  FiShield,
  FiSend
} from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { authService } from 'src/services/authService';
import { AuthLayout } from 'src/layouts/AuthLayout';

interface LocationState {
  userData: any;
  availableMethods: string[];
  mode?: 'login' | 'forgotPassword';
}

export const TwoStepVerification: React.FC = () => {
  const [otpMethod, setOtpMethod] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<string>('');

  const location = useLocation();
  const navigate = useNavigate();
  
  const { userData, availableMethods, mode = 'login' } = location.state as LocationState;

  useEffect(() => {
    if (availableMethods.length === 1) {
      setOtpMethod(availableMethods[0]);
      setSelectedMethod(availableMethods[0]);
    }
  }, [availableMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpMethod) {
      toast.error('Please select a verification method');
      return;
    }

    setLoading(true);

    try {
      const response = await authService.sendTwoStepOtp({
        contact: userData.email,
        method: otpMethod as 'sms' | 'whatsapp' | 'email',
        id: userData.id,
      });

      if (response.status) {
        toast.success(`Verification code sent to your ${getMethodLabel(otpMethod).toLowerCase()}!`);
        navigate('/verify-otp', {
          state: {
            userData,
            method: otpMethod,
            mode
          }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (mode === 'forgotPassword') {
      navigate('/forgot-password');
    } else {
      navigate('/login');
    }
  };

  const handleMethodSelect = (method: string) => {
    setOtpMethod(method);
    setSelectedMethod(method);
  };

  const getMethodIcon = (method: string) => {
    const baseClasses = "h-6 w-6";
    switch (method) {
      case 'sms':
        return <FiSmartphone className={`${baseClasses} text-blue-600`} />;
      case 'whatsapp':
        return <FiMessageCircle className={`${baseClasses} text-blue-500`} />;
      case 'email':
        return <FiMail className={`${baseClasses} text-blue-600`} />;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'sms':
        return 'Text Message';
      case 'whatsapp':
        return 'WhatsApp';
      case 'email':
        return 'Email';
      default:
        return method;
    }
  };

  const getMethodDescription = (method: string) => {
    const contactInfo = method === 'email' ? userData.email : userData.phone;
    switch (method) {
      case 'sms':
        return `We'll send a 4-digit code to your mobile number`;
      case 'whatsapp':
        return `Get instant verification code via WhatsApp`;
      case 'email':
        return `We'll email the verification code to your registered email`;
      default:
        return '';
    }
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'sms':
        return {  color: 'bg-blue-100 text-blue-800' };
      case 'whatsapp':
        return {  color: 'bg-blue-100 text-blue-800' };
      case 'email':
        return {  color: 'bg-blue-100 text-blue-800' };
      default:
        return { text: '', color: '' };
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            {/* <div className="p-3 bg-blue-50 rounded-full">
              <FiShield className="h-8 w-8 text-blue-600" />
            </div> */}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mode === "login" ? "Two-Step Verification" : "Password Reset"}
          </h1>
          <p className="text-gray-600">
            {mode === "forgotPassword" 
              ? "Choose how you'd like to receive your verification code" 
              : ""}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Verification Methods */}
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Select method for OTP verification
              </label>
              <span className="text-xs text-gray-500">
                {availableMethods.length} options available
              </span>
            </div>

            {availableMethods.map((method) => {
              const badge = getMethodBadge(method);
              const isSelected = selectedMethod === method;
              
              return (
                <div 
                  key={method} 
                  className={`relative p-4 border-2 rounded-xl transition-all duration-200 cursor-pointer group ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50 shadow-sm' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                  } ${isSelected ? 'ring-2 ring-blue-100' : ''}`}
                  onClick={() => handleMethodSelect(method)}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon Container */}
                    <div className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
                      isSelected ? 'bg-blue-100' : 'bg-gray-100 group-hover:bg-blue-50'
                    }`}>
                      {getMethodIcon(method)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Label htmlFor={method} className="cursor-pointer font-semibold text-gray-900 text-base">
                          {getMethodLabel(method)}
                        </Label>
                        {badge.text && (
                          <span className={`text-xs px-2 py-1 rounded-full ${badge.color}`}>
                            {badge.text}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {getMethodDescription(method)}
                      </p>
                    </div>
                    
                    {/* Radio Button */}
                    <div className="flex-shrink-0">
                      <Radio 
                        id={method} 
                        name="otpMethod" 
                        value={method}
                        checked={isSelected}
                        onChange={(e) => handleMethodSelect(e.target.value)}
                        className="text-blue-600 focus:ring-blue-500 h-5 w-5"
                      />
                    </div>
                  </div>

                  {/* Selected Indicator */}
                  {/* {isSelected && (
                    <div className="absolute top-3 right-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  )} */}
                </div>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              type="button" 
              color="light" 
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={handleBack}
              disabled={loading}
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <Button 
              type="submit" 
              color="primary" 
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 flex justify-center items-center gap-2 font-medium"
              disabled={!otpMethod || loading}
              size="lg"
            >
              {loading ? (
                <>
                  <Spinner size="sm" light />
                  <span className="ml-2">Sending Code...</span>
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4" />
                  Send Code
                </>
              )}
            </Button>
          </div>

          {/* Security Note */}
          {/* <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              <FiShield className="inline h-3 w-3 mr-1" />
              Your security is our priority. Codes expire in 10 minutes.
            </p>
          </div> */}
        </form>
      </div>
    </AuthLayout>
  );
};