import React, { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Card, TextInput } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import Header from 'src/Frontend/Common/Header';
import Footer from 'src/Frontend/Common/Footer';
import Loader from 'src/Frontend/Common/Loader';
import { useCandidateAuth } from 'src/hook/CandidateAuthContext';
import { BsPhone, BsShield, BsArrowLeft, BsArrowRight } from 'react-icons/bs';
import { FiHelpCircle, FiMail, FiSmartphone, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaMapPin, FaPhone, FaUniversity, FaGraduationCap, FaLaptopCode, FaUsers } from 'react-icons/fa';
import { uniq } from 'lodash';
const assetUrl = import.meta.env.VITE_ASSET_URL;


const apiUrl = import.meta.env.VITE_API_URL;

export const CandidateLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidateId, setCandidateId] = useState<number | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [carouselSlides,setCarouselSlides] = useState([]);
  const otpRefs = useRef<HTMLInputElement[]>([]);
  const carouselRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const {
      InstitudeId,
      candidateToken,
      login
    } = useCandidateAuth();
  let { institute_id } = useParams();
  let isTesting = false;
  const [institute, setInstitute] = useState<any>(null);
  if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; 
  } else {
    isTesting = true;
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
        
        login(data.candidate, data.auth_token,institute_id);
        toast.success('Login successful');
        const currentPath = window.location.pathname;
        const loginPath = currentPath.replace('/login', '/dashboard');
        navigate(loginPath);
        return; 
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
    if (candidateToken) {
      console.log(InstitudeId);
      if(InstitudeId==institute_id){
        const currentPath = window.location.pathname;
        const loginPath = currentPath.replace('/login', '/dashboard');
        navigate(loginPath);
        return; 
      }
    }
    fetch(`${apiUrl}/Public/Get-header-footer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ unique_code: institute_id,need_banner:true }),
    })
      .then((res) => res.json())
      .then((data) => {
        setInstitute(data);
        setCarouselSlides(data.academic_banners);
      })
      
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if(carouselSlides.length>0){
        setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!institute) return <Loader />;
  if (!carouselSlides) return <Loader />;

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

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
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
         

          <div className="bg-white flex flex-col lg:flex-row items-center justify-center max-w-7xl mx-auto gap-8">
            {/* Left Panel - Carousel */}
            <div className="w-full lg:w-1/2">
              <div className="relative rounded-2xl shadow-xl overflow-hidden h-full"
              style={{
                backgroundColor: carouselSlides[currentSlide]?.color_code || '#3b82f6' // Fallback color
              }} 
              >
                {/* Carousel Container */}
                <div 
                  ref={carouselRef}
                  className="relative h-full"
                >
                  {/* Carousel Slides */}
                  <div className="relative h-[500px] overflow-hidden rounded-2xl">
                    {carouselSlides.map((slide, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                          index === currentSlide
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 translate-x-full'
                        }`}
                        onClick={() => {
                          if (slide.redirect_url) {
                            window.open(slide.redirect_url, '_blank');
                          }
                        }}
                      >
                        {/* Background Image with Gradient Overlay */}
                        <div 
                          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                          style={{ backgroundImage: `url(${assetUrl}/${slide.banner_image})` }}
                        >
                          <div className={`absolute inset-0  ${slide.bgColor} opacity-90`}></div>
                        </div>
                       
                      </div>
                    ))}
                  </div>

                  {/* Carousel Controls */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex items-center gap-4">
                    <button
                      onClick={prevSlide}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <FiChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    
                    {/* Indicators */}
                    <div className="flex gap-2">
                      {carouselSlides.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentSlide(index)}
                          className={`w-3 h-3 rounded-full transition-all ${
                            index === currentSlide 
                              ? 'bg-white w-8' 
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                    
                    <button
                      onClick={nextSlide}
                      className="p-2 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
                    >
                      <FiChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>

                 
                </div>

              
              </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="lg:w-1/2">
              <div className=" rounded-2xl shadow-xl p-8 h-full">
                <div className="space-y-6">
                  {!isOtpSent ? (
                    <>
                      {/* Form Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl mb-4">
                          <BsShield className="w-8 h-8 text-blue-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Secure Login Access</h2>
                       
                      </div>

                      {/* Email Input */}
                      <div>
                       
                        <div>
                         
                          <div className="relative group">
                            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none z-10">
                              <div className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg group-focus-within:from-blue-100 group-focus-within:to-indigo-100 transition-all duration-300">
                                <FiMail className="h-5 w-5 text-gray-600 group-focus-within:text-blue-600 transition-colors duration-300" />
                              </div>
                            </div>
                            <input
                              type="email"
                              placeholder="Enter your registered email"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full pl-16 pr-4 py-4 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 shadow-sm hover:shadow-md focus:shadow-lg outline-none transition-all duration-300 text-gray-900 placeholder-gray-500"
                            />
                          </div>
                          
                        </div>
                        <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                          <BsShield className="w-3 h-3" />
                          We'll send a secure one-time password to this email
                        </p>
                      </div>

                      {/* Action Button */}
                      <div className="pt-4">
                        <Button
                          className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                          onClick={sendOtp}
                          disabled={loading || !email}
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

                      {/* Help Text */}
                      <div className="text-center pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                          Ensure you use the email registered with {institute.header?.name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      {/* OTP Verification Header */}
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl mb-4">
                          <FiMail className="w-8 h-8 text-green-600 animate-pulse" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900">Verify Your Email</h3>
                        <p className="text-gray-600 mt-2">
                          We've sent a 4-digit OTP to{' '}
                          <span className="font-semibold text-gray-900">{email}</span>
                        </p>
                      </div>

                      {/* OTP Input */}
                      <div className="mb-8">
                        <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                          Enter OTP Code
                        </label>
                        <div className="flex justify-center gap-3 mb-6">
                          {otp.map((digit, i) => (
                            <input
                              key={i}
                              ref={(el) => (otpRefs.current[i] = el!)}
                              value={digit}
                              maxLength={1}
                              onChange={(e) => handleOtpChange(i, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(i, e)}
                              onPaste={handleOtpPaste}
                              className="w-16 h-16 text-2xl font-bold text-center border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all hover:border-blue-400 shadow-sm"
                              autoFocus={i === 0}
                            />
                          ))}
                        </div>
                        <p className="text-center text-sm text-gray-500">
                          Didn't receive OTP?{' '}
                          <button
                            onClick={sendOtp}
                            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                          >
                            Resend OTP
                          </button>
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="space-y-4">
                        <Button
                          className="w-full py-3 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 transition-all transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                          onClick={verifyOtp}
                          disabled={loading || otp.join('').length !== 4}
                        >
                          {loading ? (
                            <span className="flex items-center justify-center gap-2">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Verifying...
                            </span>
                          ) : (
                            'Verify & Login'
                          )}
                        </Button>

                        <Button
                          color="light"
                          className="w-full py-3 border-gray-300 hover:border-gray-400 transition-all"
                          onClick={() => {
                            setIsOtpSent(false);
                            setOtp(['', '', '', '']);
                          }}
                        >
                          <span className="flex items-center justify-center gap-2">
                            <FiMail className="w-4 h-4" />
                            Use Different Email
                          </span>
                        </Button>
                      </div>

                      {/* Security Note */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                          <BsShield className="w-4 h-4" />
                          OTP expires in 10 minutes. Do not share it with anyone.
                        </div>
                      </div>
                    </>
                  )}
                </div>

               
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer footerData={institute.footer} baseUrl={institute.baseUrl} />
    </div>
  );
};