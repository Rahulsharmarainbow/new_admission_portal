// components/auth/TwoStepVerification.tsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Button, Label, Radio, Spinner } from 'flowbite-react';
import { HiDeviceMobile, HiChat, HiMail } from 'react-icons/hi';
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
  const [loading, setLoading] = useState(false); // <-- added loader state

  const location = useLocation();
  const navigate = useNavigate();
  
  const { userData, availableMethods, mode = 'login' } = location.state as LocationState;

  useEffect(() => {
    if (availableMethods.length === 1) {
      setOtpMethod(availableMethods[0]);
    }
  }, [availableMethods]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otpMethod) {
      toast.error('Please select a method');
      return;
    }

    setLoading(true); // start loader

    try {
      const response = await authService.sendTwoStepOtp({
        contact: userData.email,
        method: otpMethod as 'sms' | 'whatsapp' | 'email',
        id: userData.id,
      });

      if (response.status) {
        toast.success(response.message);
        navigate('/verify-otp', {
          state: {
            userData,
            method: otpMethod,
            mode
          }
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send OTP');
    } finally {
      setLoading(false); // stop loader
    }
  };

  const handleBack = () => {
    if (mode === 'forgotPassword') {
      navigate('/forgot-password');
    } else {
      navigate('/login');
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'sms':
        return <HiDeviceMobile className="h-5 w-5 text-gray-500" />;
      case 'whatsapp':
        return <HiChat className="h-5 w-5" />;
      case 'email':
        return <HiMail className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getMethodLabel = (method: string) => {
    switch (method) {
      case 'sms':
        return 'Send OTP on SMS';
      case 'whatsapp':
        return 'Send OTP on WhatsApp';
      case 'email':
        return 'Send OTP on Email';
      default:
        return method;
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {mode === "login" ? "Send OTP" : "Reset Password - Send OTP"}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {mode === "forgotPassword" 
              ? "Select a method to receive OTP for password reset" 
              : "Select a method to receive OTP for verification"}
          </p>
          <div className="space-y-3">
            {availableMethods.map((method) => (
              <div key={method} className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary transition-colors">
                <Radio 
                  id={method} 
                  name="otpMethod" 
                  value={method}
                  checked={otpMethod === method}
                  onChange={(e) => setOtpMethod(e.target.value)}
                />
                <Label htmlFor={method} className="cursor-pointer flex items-center gap-2">
                  {getMethodIcon(method)}
                  {getMethodLabel(method)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button 
            type="button" 
            color="gray" 
            className="flex-1"
            onClick={handleBack}
            disabled={loading}
          >
            Back
          </Button>

          <Button 
            type="submit" 
            color="primary" 
            className="flex-1 bg-primary text-white flex justify-center items-center gap-2"
            disabled={!otpMethod || loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" light />
                Sending...
              </>
            ) : (
              "Send OTP"
            )}
          </Button>
        </div>
      </form>
    </AuthLayout>
  );
};















// // components/auth/TwoStepVerification.tsx
// import React, { useState, useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router';
// import { Button, Label, Radio } from 'flowbite-react';
// import { HiDeviceMobile, HiChat, HiMail } from 'react-icons/hi';
// import { toast } from 'react-hot-toast';
// import { authService } from 'src/services/authService';
// import { AuthLayout } from 'src/layouts/AuthLayout';

// interface LocationState {
//   userData: any;
//   availableMethods: string[];
//   mode?: 'login' | 'forgotPassword';
// }

// export const TwoStepVerification: React.FC = () => {
//   const [otpMethod, setOtpMethod] = useState<string>('');
//   const location = useLocation();
//   const navigate = useNavigate();
  
//   const { userData, availableMethods, mode = 'login' } = location.state as LocationState;

//   useEffect(() => {
//     if (availableMethods.length === 1) {
//       setOtpMethod(availableMethods[0]);
//     }
//   }, [availableMethods]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!otpMethod) {
//       toast.error('Please select a method');
//       return;
//     }

//     try {
//       const response = await authService.sendTwoStepOtp({
//         contact: userData.email,
//         method: otpMethod as 'sms' | 'whatsapp' | 'email',
//         id: userData.id,
//       });

//       if (response.status) {
//         toast.success(response.message);
//         navigate('/verify-otp', {
//           state: {
//             userData,
//             method: otpMethod,
//             mode
//           }
//         });
//       }
//     } catch (error: any) {
//       toast.error(error.response?.data?.message || 'Failed to send OTP');
//     }
//   };

//   const handleBack = () => {
//     if (mode === 'forgotPassword') {
//       navigate('/forgot-password');
//     } else {
//       navigate('/login');
//     }
//   };

//   const getMethodIcon = (method: string) => {
//     switch (method) {
//       case 'sms':
//         return <HiDeviceMobile className="h-5 w-5 text-gray-500" />;
//       case 'whatsapp':
//         return <HiChat className="h-5 w-5" />;
//       case 'email':
//         return <HiMail className="h-5 w-5 text-gray-500" />;
//       default:
//         return null;
//     }
//   };

//   const getMethodLabel = (method: string) => {
//     switch (method) {
//       case 'sms':
//         return 'Send OTP on SMS';
//       case 'whatsapp':
//         return 'Send OTP on WhatsApp';
//       case 'email':
//         return 'Send OTP on Email';
//       default:
//         return method;
//     }
//   };

//   return (
//     <AuthLayout>
//     <form onSubmit={handleSubmit}>
//       <div className="mb-6">
//         <h3 className="text-lg font-semibold text-gray-900 mb-4">
//           {mode === "login" ? "Send OTP" : "Reset Password - Send OTP"}
//         </h3>
//         <p className="text-sm text-gray-600 mb-4">
//           {mode === "forgotPassword" 
//             ? "Select a method to receive OTP for password reset" 
//             : "Select a method to receive OTP for verification"}
//         </p>
//         <div className="space-y-3">
//           {availableMethods.map((method) => (
//             <div key={method} className="flex items-center gap-3 p-3 border rounded-lg hover:border-primary transition-colors">
//               <Radio 
//                 id={method} 
//                 name="otpMethod" 
//                 value={method}
//                 checked={otpMethod === method}
//                 onChange={(e) => setOtpMethod(e.target.value)}
//               />
//               <Label htmlFor={method} className="cursor-pointer flex items-center gap-2">
//                 {getMethodIcon(method)}
//                 {getMethodLabel(method)}
//               </Label>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex gap-3">
//         <Button 
//           type="button" 
//           color="gray" 
//           className="flex-1"
//           onClick={handleBack}
//         >
//           Back
//         </Button>
//         <Button 
//           type="submit" 
//           color="primary" 
//           className="flex-1 bg-primary text-white"
//           disabled={!otpMethod}
//         >
//           Send OTP
//         </Button>
//       </div>
//     </form>
//     </AuthLayout>
//   );
// };









