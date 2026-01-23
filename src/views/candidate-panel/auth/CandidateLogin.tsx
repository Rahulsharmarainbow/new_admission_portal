import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Card, TextInput } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import Header from 'src/Frontend/Common/Header';
import Footer from 'src/Frontend/Common/Footer';
import Loader from 'src/Frontend/Common/Loader';
import { useCandidateAuth } from 'src/hook/CandidateAuthContext';
import { BsPhone, BsShield } from 'react-icons/bs';
import { FiHelpCircle, FiMail, FiSmartphone } from 'react-icons/fi';
import { FaMapPin, FaPhone } from 'react-icons/fa';
import { uniq } from 'lodash';

const apiUrl = import.meta.env.VITE_API_URL;

export const CandidateLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();
  const { login } = useCandidateAuth();
  let { institute_id } = useParams();
  const [institute, setInstitute] = useState<any>(null);
  if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; 
  }
  const sendOtp = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/check-candidates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, unique_code: institute_id }),
      });
      const data = await res.json();

      if (data.status) {
        toast.success(data.message);
        setCandidateId(data.candidate.id);
        setIsOtpSent(true);
      } else {
        toast.error(data.message);
      }
    } catch {
      toast.error('Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const otpValue = otp.join('');
    if (otpValue.length !== 4) return;

    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/auth/Candidate-verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: candidateId, otp: otpValue, unique_code: institute_id }),
      });

      const data = await res.json();

      if (data.status) {
        login(data.candidate, data.auth_token);
        toast.success('Login successful');
        navigate(`/Frontend/${institute_id}/CandidatePanel/dashboard`);
      } else {
        toast.error('Invalid OTP');
      }
    } catch {
      toast.error('OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${apiUrl}/Public/Get-header-footer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unique_code: institute_id }),
    })
      .then((res) => res.json())
      .then((data) => setInstitute(data));
  }, []);

  if (!institute) return <Loader />;

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedOtp = e.clipboardData.getData('text');
    if (pastedOtp.length === 4) {
      setOtp(pastedOtp.split(''));
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (/^\d$/.test(value) || value === '') {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value !== '' && index < 3) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-blue-50">
      <Header
        baseUrl={institute?.baseUrl}
        institute_id={institute_id}
        instituteName={institute.header?.name}
        logo={institute.header?.logo}
        address={institute.header?.address}
        otherLogo={institute.header?.academic_new_logo}
      />

      {/* Main Content Area */}
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Candidate Portal</h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Secure login portal for candidates. Access your dashboard, and
              application status.
            </p>
          </div>

          <div className="flex items-center justify-center max-w-7xl mx-auto">
            {/* Left Panel - Login Form */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="space-y-6">
                  {!isOtpSent ? (
                    <>
                      {/* <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-blue-100 rounded-xl">
                          <BsShield className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900">Secure Login</h2>
                          <p className="text-gray-500">
                            Enter your credentials to access your account
                          </p>
                        </div>
                      </div> */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FiMail className="h-5 w-5 text-gray-400" />
                          </div>
                          <TextInput
                            type="email"
                            placeholder="Enter your registered email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="pl-10 w-full"
                            sizing="lg"
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">
                          We'll send a one-time password to this email
                        </p>
                      </div>

                      <div className="flex item-end justify-end">
                        <Button
                          className="py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
                          onClick={sendOtp}
                          disabled={loading}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Sending OTP...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <FiSmartphone className="w-5 h-5" />
                              Send OTP to Email
                            </span>
                          )}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="p-3 bg-green-100 rounded-xl">
                            <FiMail className="w-8 h-8 text-green-600" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">Check Your Email</h3>
                            <p className="text-gray-600">
                              We've sent a 4-digit OTP to{' '}
                              <span className="font-semibold">{email}</span>
                            </p>
                          </div>
                        </div>

                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                            Enter OTP Code
                          </label>
                          <div className="flex justify-center gap-4 mb-6">
                            {otp.map((digit, i) => (
                              <input
                                key={i}
                                ref={(el) => (otpRefs.current[i] = el!)}
                                value={digit}
                                maxLength={1}
                                onChange={(e) => handleOtpChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(i, e)}
                                onPaste={handleOtpPaste}
                                className="w-16 h-16 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all"
                                autoFocus={i === 0}
                              />
                            ))}
                          </div>
                          <p className="text-center text-sm text-gray-500">
                            Didn't receive OTP?{' '}
                            <button
                              onClick={sendOtp}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              Resend OTP
                            </button>
                          </p>
                        </div>

                        <div className="flex flex-col items-center justify-center gap-4">
                          <Button
                            className="w-[70%] py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                            onClick={verifyOtp}
                            disabled={loading}
                          >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                          </Button>

                          <Button
                            color="light"
                            className="w-[70%] py-3"
                            onClick={() => setIsOtpSent(false)}
                          >
                            Use Different Email
                          </Button>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Additional Info */}
                {/* <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-start gap-3">
                    <FiHelpCircle className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Having trouble logging in? Contact our technical support team at{' '}
                        <a href="mailto:itsupport@cnlu.ac.in" className="text-blue-600 hover:underline">
                          itsupport@cnlu.ac.in
                        </a>
                      </p>
                    </div>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer footerData={institute.footer} baseUrl={institute.baseUrl} />
    </div>
  );
};
