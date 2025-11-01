// import React, { useState } from 'react';
// import { useNavigate } from 'react-router';
// import { Button, Label, TextInput, Radio } from 'flowbite-react';
// import { HiDeviceMobile, HiChat, HiMail } from 'react-icons/hi';
// import { authService } from 'src/services/authService';
// import { toast } from 'react-hot-toast';
// import { AuthLayout } from 'src/layouts/AuthLayout';

// export const ForgotPassword: React.FC = () => {
//   const [step, setStep] = useState(1);
//   const [email, setEmail] = useState('');
//   const [method, setMethod] = useState('');
//   const [phone, setPhone] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
  
//   const navigate = useNavigate();

//   const handleEmailSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);

//     try {
//       const response = await authService.sendResetLink(email);
      
//       if (response.status) {
//         toast.success( response.message || 'Reset link sent to your email');
//         navigate('/login');
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to send reset link');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handlePhoneSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!method) {
//       toast.error('Please select a method');
//       return;
//     }

//     setIsLoading(true);

//     try {
//       let response;
//       if (method === 'sms') {
//         response = await authService.sendSmsOtp(phone, 'your_sms_code');
//       } else {
//         response = await authService.sendWhatsappOtp(phone, 'your_whatsapp_code');
//       }

//       if (response.status) {
//         toast.success(response.message || 'OTP sent successfully');
//         console.log(response);
//         navigate('/verify-otp', {
//           state: {
//             method,
//             mode: 'forgotPassword',
//             adminId: response.Data?.id 
//           }
//         });
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to send OTP');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <AuthLayout>
//         <div>
//       {step === 1 ? (
//         <div className="space-y-4">
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Forgot Password
//           </h3>
//           <p className="text-sm text-gray-600 mb-6">
//             Select how you want to reset your password
//           </p>

//           <div className="space-y-3">
//             <div 
//               className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
//               onClick={() => setStep(2)}
//             >
//               <HiMail className="h-6 w-6 text-primary" />
//               <div>
//                 <Label className="font-medium cursor-pointer">Reset via Email</Label>
//                 <p className="text-sm text-gray-500">Get reset link on your email</p>
//               </div>
//             </div>

//             <div 
//               className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-primary transition-colors"
//               onClick={() => setStep(3)}
//             >
//               <HiDeviceMobile className="h-6 w-6 text-primary" />
//               <div>
//                 <Label className="font-medium cursor-pointer">Reset via Phone</Label>
//                 <p className="text-sm text-gray-500">Get OTP on SMS or WhatsApp</p>
//               </div>
//             </div>
//           </div>

//           <Button 
//             type="button" 
//             color="gray" 
//             className="w-full mt-6"
//             onClick={() => navigate('/login')}
//           >
//             Back to Login
//           </Button>
//         </div>
//       ) : step === 2 ? (
//         <form onSubmit={handleEmailSubmit}>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Reset via Email
//           </h3>
          
//           <div className="mb-4">
//             <Label htmlFor="email" value="Email Address" />
//             <TextInput
//               id="email"
//               type="email"
//               placeholder="Enter your email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="mt-1"
//             />
//           </div>

//           <div className="flex gap-3">
//             <Button 
//               type="button" 
//               color="gray" 
//               className="flex-1"
//               onClick={() => setStep(1)}
//             >
//               Back
//             </Button>
//             <Button 
//               type="submit" 
//               color="primary" 
//               className="flex-1 bg-primary text-white"
//               disabled={isLoading}
//             >
//               {isLoading ? 'Sending...' : 'Send Reset Link'}
//             </Button>
//           </div>
//         </form>
//       ) : (
//         <form onSubmit={handlePhoneSubmit}>
//           <h3 className="text-lg font-semibold text-gray-900 mb-4">
//             Reset via Phone
//           </h3>
          
//           <div className="mb-4">
//             <Label htmlFor="phone" value="Phone Number" />
//             <TextInput
//               id="phone"
//               type="tel"
//               placeholder="Enter your phone number"
//               required
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               className="mt-1"
//             />
//           </div>

//           <div className="mb-4">
//             <Label value="Select Method" />
//             <div className="space-y-2 mt-2">
//               <div className="flex items-center gap-3 p-3 border rounded-lg">
//                 <Radio 
//                   id="sms" 
//                   name="method" 
//                   value="sms"
//                   checked={method === 'sms'}
//                   onChange={(e) => setMethod(e.target.value)}
//                 />
//                 <Label htmlFor="sms" className="cursor-pointer flex items-center gap-2">
//                   <HiDeviceMobile className="h-5 w-5" />
//                   Send OTP via SMS
//                 </Label>
//               </div>
//               <div className="flex items-center gap-3 p-3 border rounded-lg">
//                 <Radio 
//                   id="whatsapp" 
//                   name="method" 
//                   value="whatsapp"
//                   checked={method === 'whatsapp'}
//                   onChange={(e) => setMethod(e.target.value)}
//                 />
//                 <Label htmlFor="whatsapp" className="cursor-pointer flex items-center gap-2">
//                   <HiChat className="h-5 w-5" />
//                   Send OTP via WhatsApp
//                 </Label>
//               </div>
//             </div>
//           </div>

//           <div className="flex gap-3">
//             <Button 
//               type="button" 
//               color="gray" 
//               className="flex-1"
//               onClick={() => setStep(1)}
//             >
//               Back
//             </Button>
//             <Button 
//               type="submit" 
//               color="primary" 
//               className="flex-1 bg-primary text-white"
//               disabled={!method || !phone || isLoading}
//             >
//               {isLoading ? 'Sending...' : 'Send OTP'}
//             </Button>
//           </div>
//         </form>
//       )}
//     </div>
//     </AuthLayout>
//   );
// };


















import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Label, TextInput, Radio, Spinner } from 'flowbite-react';
import { 
  FiMail, 
  FiSmartphone, 
  FiMessageCircle,
  FiArrowLeft,
  FiLock,
  FiSend,
  FiArrowRight
} from 'react-icons/fi';
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
        toast.success(response.message || 'Password reset link has been sent to your email');
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
      toast.error('Please select a verification method');
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
        toast.success(response.message || 'Verification code sent successfully');
        navigate('/verify-otp', {
          state: {
            method,
            mode: 'forgotPassword',
            adminId: response.Data?.id 
          }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send verification code');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-md mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-50 rounded-full">
              <FiLock className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Forgot Password?
          </h1>
          <p className="text-gray-600">
            {step === 1 
              ? "Choose how you'd like to reset your password" 
              : step === 2 
                ? "Enter your email to receive reset instructions"
                : "Enter your phone number to receive verification code"
            }
          </p>
        </div>

        {/* Step Indicator */}
        {/* <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <React.Fragment key={stepNumber}>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                  step === stepNumber 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : step > stepNumber
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 text-gray-500'
                }`}>
                  {step > stepNumber ? (
                    <FiArrowRight className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                {stepNumber < 3 && (
                  <div className={`w-8 h-0.5 ${
                    step > stepNumber ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div> */}

        {/* Step 1: Method Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div 
                className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 group"
                onClick={() => setStep(2)}
              >
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiMail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Reset via Email
                  </h3>
                  <p className="text-sm text-gray-600">
                    We'll send a password reset link to your registered email address
                  </p>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <div 
                className="flex items-start gap-4 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-400 hover:bg-green-50 transition-all duration-200 group"
                onClick={() => setStep(3)}
              >
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <FiSmartphone className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    Reset via Phone
                  </h3>
                  <p className="text-sm text-gray-600">
                    Receive a verification code via SMS or WhatsApp to reset your password
                  </p>
                </div>
                <FiArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>
            </div>

            <Button 
              type="button" 
              color="light" 
              className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => navigate('/login')}
            >
              <FiArrowLeft className="mr-2 h-4 w-4" />
              Back to Login
            </Button>
          </div>
        )}

        {/* Step 2: Email Reset */}
        {step === 2 && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <FiMail className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-1">Email Verification</h4>
                  <p className="text-sm text-blue-700">
                    Enter your registered email address to receive password reset instructions
                  </p>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="email" value="Email Address" className="block text-sm font-medium text-gray-700 mb-2" />
              <TextInput
                id="email"
                type="email"
                placeholder="Enter your email address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                icon={FiMail}
              />
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                color="light" 
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                type="submit" 
                color="primary" 
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!email || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" light className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 h-4 w-4" />
                    Send Reset Link
                  </>
                )}
              </Button>
            </div>
          </form>
        )}

        {/* Step 3: Phone Reset */}
        {step === 3 && (
          <form onSubmit={handlePhoneSubmit} className="space-y-6">
            {/* <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start gap-3">
                <FiSmartphone className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900 mb-1">Phone Verification</h4>
                  <p className="text-sm text-green-700">
                    Enter your phone number and choose how you'd like to receive the verification code
                  </p>
                </div>
              </div>
            </div> */}

            <div>
              <Label htmlFor="phone" value="Phone Number" className="block text-sm font-medium text-gray-700 mb-2" />
              <TextInput
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full"
                icon={FiSmartphone}
              />
            </div>

            <div className="space-y-3">
              <Label value="Verification Method" className="block text-sm font-medium text-gray-700 mb-2" />
              
              <div 
                className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  method === 'sms' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => setMethod('sms')}
              >
                <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                  <FiMessageCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="sms" className="cursor-pointer font-semibold text-gray-900">
                      Text Message (SMS)
                    </Label>
                   
                  </div>
                  <p className="text-sm text-gray-600">
                    Receive verification code via SMS
                  </p>
                </div>
                <Radio 
                  id="sms" 
                  name="method" 
                  value="sms"
                  checked={method === 'sms'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </div>

              <div 
                className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  method === 'whatsapp' 
                    ? 'border-blue-500 bg-green-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                }`}
                onClick={() => setMethod('whatsapp')}
              >
                <div className="flex-shrink-0 p-2 bg-green-100 rounded-lg">
                  <FiMessageCircle className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Label htmlFor="whatsapp" className="cursor-pointer font-semibold text-gray-900">
                      WhatsApp
                    </Label>
                   
                  </div>
                  <p className="text-sm text-gray-600">
                    Get instant verification code via WhatsApp
                  </p>
                </div>
                <Radio 
                  id="whatsapp" 
                  name="method" 
                  value="whatsapp"
                  checked={method === 'whatsapp'}
                  onChange={(e) => setMethod(e.target.value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                type="button" 
                color="light" 
                className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                onClick={() => setStep(1)}
                disabled={isLoading}
              >
                <FiArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button 
                type="submit" 
                color="primary" 
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={!method || !phone || isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" light className="mr-2" />
                    Sending...
                  </>
                ) : (
                  <>
                    <FiSend className="mr-2 h-4 w-4" />
                    Send Code
                  </>
                )}
              </Button>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};