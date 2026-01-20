// components/candidate/CandidateLogin.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, TextInput, Card } from 'flowbite-react';
import { toast } from 'react-hot-toast'
import { AuthLayout } from 'src/layouts/AuthLayout';

export const CandidateLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(['', '', '', '']);
  const [otpInput, setOtpInput] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isOtpLoading, setIsOtpLoading] = useState(false);
  
  const navigate = useNavigate();

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const handleSendOtp = async () => {
    if (!email.trim()) {
      toast.error('Please enter email address');
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call for sending OTP
      // In real implementation, call: candidateService.sendLoginOtp(email)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('OTP sent successfully to your email');
      setIsOtpSent(true);
    } catch (error) {
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || otpInput.length !== 4) {
      toast.error('Please enter a valid 4-digit OTP');
      return;
    }

    setIsOtpLoading(true);
    
    try {
      // Mock API call for verifying OTP
      // In real implementation, call: candidateService.verifyLoginOtp(email, otpInput)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Login successful!');
      navigate('/CandidatePanel/Dashboard');
    } catch (error) {
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setIsOtpLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpInput(newOtp.join(''));
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      setOtpInput(newOtp.join(''));
    }
  };

  const handleResendOtp = async () => {
    setIsLoading(true);
    try {
      // Mock resend OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('New OTP sent successfully');
      setOtp(['', '', '', '']);
      setOtpInput('');
    } catch (error) {
      toast.error('Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
        {/* <div className="min-h-screen flex flex-col"> */}
      {/* Header - Same as home page */}
      {/* <Header /> */}
      
      <>
        <Card className="w-full max-w-md shadow-lg">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Candidate Login</h2>
            <p className="text-gray-600 mt-2">
              {isOtpSent 
                ? 'Enter OTP sent to your email' 
                : 'Enter your email to receive OTP'}
            </p>
          </div>

          <form className="space-y-6">
            {!isOtpSent ? (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <Button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={isLoading || !email.trim()}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </Button>
              </>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter 4-digit OTP
                  </label>
                  <div className="flex justify-center gap-3">
                    {[0, 1, 2, 3].map((index) => (
                      <input
                        key={index}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={otp[index]}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        className="w-14 h-14 text-center text-xl font-semibold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      />
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isOtpLoading || otpInput.length !== 4}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isOtpLoading ? 'Verifying...' : 'Verify OTP & Login'}
                  </Button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {isLoading ? 'Resending...' : 'Resend OTP'}
                    </button>
                    <span className="mx-2 text-gray-400">•</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsOtpSent(false);
                        setEmail('');
                        setOtp(['', '', '', '']);
                        setOtpInput('');
                      }}
                      className="text-gray-600 hover:text-gray-800 text-sm font-medium"
                    >
                      Change Email
                    </button>
                  </div>
                </div>
              </>
            )}
          </form>
        </Card>
      </>
      
      {/* Footer - Same as home page */}
      {/* <Footer /> */}
    {/* </div> */}
    </AuthLayout>
  );
};