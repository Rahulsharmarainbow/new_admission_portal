















import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button } from 'flowbite-react';
import { useAuth } from 'src/hook/useAuth';
import { useAcademics } from 'src/hook/useAcademics';
import axios from 'axios';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import toast from 'react-hot-toast';
import { TextInput } from 'flowbite-react';
import { HiEye, HiEyeOff } from 'react-icons/hi';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import AllAcademicsMultiDropdown from 'src/Frontend/Common/AllAcademicsMultiDropdown';

interface FormData {
  name: string;
  email: string;
  password: string;
  number: string;
  academic_id: string;
  profile: File | null;
  profilePreview: string;
  notify: number;
  assign_academic_id: string[];   
  compaign_access: number;  
}

interface ApiResponse {
  status: boolean;
  message: string;
}

interface PasswordStrength {
  score: number;
  feedback: string;
  color: string;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { type, id } = useParams<{ type: string; id?: string }>();
  const { academics, loading: academicLoading } = useAcademics();

  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    number: '',
    academic_id: '',
    profile: null,
    profilePreview: '',
    notify: 1,
    assign_academic_id: [],
    compaign_access: 0,   
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [fetchLoading, setFetchLoading] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: '',
    color: 'gray',
  });
  const [phoneError, setPhoneError] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  // Fetch user details for edit
  useEffect(() => {
    if (id) {
      fetchUserDetails();
      setIsEdit(true);
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        number: '',
        academic_id: '',
        profile: null,
        profilePreview: '',
        notify: 1,
        assign_academic_id: [],
        compaign_access: 0,
      });
    }
  }, [id]);

  // Check password strength when password changes
  useEffect(() => {
    if (formData.password) {
      checkPasswordStrength(formData.password);
    } else {
      setPasswordStrength({
        score: 0,
        feedback: '',
        color: 'gray',
      });
    }
  }, [formData.password]);

  // Phone number validation
  const validatePhoneNumber = (number: string): boolean => {
    if (!number) {
      setPhoneError('Please enter a phone number.');
      return false;
    } else if (!/^[0-9]+$/.test(number)) {
      setPhoneError('Phone number should contain only digits.');
      return false;
    } else if (number.length !== 10) {
      setPhoneError('Phone number should be 10 digits long.');
      return false;
    } else {
      setPhoneError('');
      return true;
    }
  };

  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    
    // Only allow digits and limit to 10 characters
    const onlyDigits = value.replace(/[^0-9]/g, '');
    const truncatedValue = onlyDigits.slice(0, 10);
    
    setFormData((prev) => ({
      ...prev,
      number: truncatedValue,
    }));
    
    // Real-time validation
    validatePhoneNumber(truncatedValue);
    
    if (apiResponse) {
      setApiResponse(null);
    }
  };

  const checkPasswordStrength = (password: string): void => {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push('At least 8 characters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One lowercase letter');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One uppercase letter');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One number');
    }

    // Special character check
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      score += 1;
    } else {
      feedback.push('One special character');
    }

    // Common weak pattern checks
    const commonPatterns = [
      /^[A-Z][a-z]+@\d+$/, // Jese@123 type pattern
      /^[A-Z][a-z]+\d+$/, // Jese123 type pattern
      /^[a-z]+[A-Z]+\d+$/, // jeseJESE123 type pattern
      /^[a-zA-Z]+\d+$/, // Simple word with numbers
      /^\d+[a-zA-Z]+$/, // Numbers with simple word
      /^[A-Z][a-z]+@\d{3}$/, // Name@123 exact pattern
      /^[A-Z][a-z]+@\d{4}$/, // Name@1234 pattern
    ];

    const isCommonPattern = commonPatterns.some((pattern) => pattern.test(password));
    const hasSequentialChars =
      /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|123|234|345|456|567|678|789|890)/i.test(
        password,
      );

    // Penalize common patterns heavily
    if (isCommonPattern) {
      score = Math.max(0, score - 3);
      feedback.push('Avoid common name@123 patterns');
    }

    if (hasSequentialChars) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid sequential characters');
    }

    // Dictionary words check (basic)
    const commonWords = [
      'password',
      'admin',
      'user',
      'test',
      'demo',
      'hello',
      'welcome',
      'qwerty',
      'letmein',
      'monkey',
      'dragon',
      'master',
      'login',
      'welcome123',
    ];
    const containsCommonWord = commonWords.some((word) => password.toLowerCase().includes(word));

    if (containsCommonWord) {
      score = Math.max(0, score - 2);
      feedback.push('Avoid common dictionary words');
    }

    // Repeated characters check
    const hasRepeatedChars = /(.)\1{2,}/.test(password);
    if (hasRepeatedChars) {
      score = Math.max(0, score - 1);
      feedback.push('Avoid repeated characters');
    }

    // Only letters and numbers (no special chars) - penalize
    const onlyLettersNumbers = /^[a-zA-Z0-9]+$/.test(password);
    if (onlyLettersNumbers && password.length > 0) {
      score = Math.max(0, score - 1);
      feedback.push('Add special characters');
    }

    let color = 'red';
    let strengthFeedback = '';

    if (score === 0) {
      strengthFeedback = 'Enter a password';
    } else if (score <= 2) {
      strengthFeedback = 'Weak password - Too predictable';
      color = 'red';
    } else if (score <= 3) {
      strengthFeedback = 'Medium password - Could be stronger';
      color = 'orange';
    } else if (score === 4) {
      strengthFeedback = 'Strong password';
      color = 'blue';
    } else {
      strengthFeedback = 'Very strong password';
      color = 'green';
    }

    if (feedback.length > 0 && score < 5) {
      strengthFeedback += ` | Needs: ${feedback.join(', ')}`;
    }

    setPasswordStrength({
      score,
      feedback: strengthFeedback,
      color,
    });
  };

  const fetchUserDetails = async () => {
    setFetchLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Usermanagment/details-User`,
        { id: parseInt(id!) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data) {
        const userData = response.data.data;
        setFormData((prev) => ({
          ...prev,
          name: userData.name || '',
          email: userData.email || '',
          number: userData.number || '',
          password: userData.d_password || '',
          academic_id: userData.academic_id?.toString() || '',
          profilePreview: userData.profile ? `${assetUrl}/${userData.profile}` : '',
          notify: userData.notify ?? 1, 
          // assign_academic_id: userData.assign_academic_id?.map((id: number) => id.toString()) || [],
          assign_academic_id: userData.assign_academic_id || [],
          compaign_access: userData.compaign_access ?? 0
        }));
        // Validate existing phone number
        if (userData.number) {
          validatePhoneNumber(userData.number);
        }
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setApiResponse({
        status: false,
        message: 'Failed to fetch user details',
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to prevent non-digit input
    if (name === 'number') {
      const onlyDigits = value.replace(/[^0-9]/g, '');
      const truncatedValue = onlyDigits.slice(0, 10);
      
      setFormData((prev) => ({
        ...prev,
        [name]: truncatedValue,
      }));
      
      // Real-time validation
      validatePhoneNumber(truncatedValue);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    if (apiResponse) {
      setApiResponse(null);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profile: file,
          profilePreview: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateImage = () => {
    fileInputRef.current?.click();
  };

  const handleFocus = (fieldName: string) => {
    setFocusedField(fieldName);
  };

  const handleBlur = () => {
    setFocusedField(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Phone number validation
    if (!validatePhoneNumber(formData.number)) {
      return;
    }

    // Stricter password validation - require at least medium strength
    if (!isEdit && formData.password && passwordStrength.score < 3) {
      toast.error(
        'Password is too weak. Please use a stronger password with mixed characters, numbers, special characters and avoid common patterns like name@123.',
      );
      return;
    }

    // Password strength validation for editing users (if password is provided)
    if (isEdit && formData.password && formData.password.length > 0 && passwordStrength.score < 3) {
      toast.error(
        'Password is too weak. Please use a stronger password with mixed characters, numbers, special characters and avoid common patterns like name@123.',
      );
      return;
    }

    setLoading(true);
    setApiResponse(null);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('s_id', user?.id?.toString() || '');
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('number', formData.number);
      formDataToSend.append('type', type || '');
      if(type === '3')formDataToSend.append('notify', formData.notify.toString());

      if (type === '2' && formData.assign_academic_id.length > 0) {
  formDataToSend.append(
    'assign_academic_id',
    JSON.stringify(formData.assign_academic_id)
  );
}

if (type === '3') {
  formDataToSend.append(
    'compaign_access',
    formData.compaign_access.toString()
  );
}

      // Only append password for new users or if password is provided in edit
      if ((!isEdit && formData.password) || (isEdit && formData.password)) {
        formDataToSend.append('password', formData.password);
      }

      // Append academic_id only for customer admin
      if (type === '3' && formData.academic_id) {
        formDataToSend.append('academic_id', formData.academic_id);
      }

      // Append profile image if selected
      if (formData.profile) {
        formDataToSend.append('profile', formData.profile);
      }

      // Append id for edit
      if (isEdit && id) {
        formDataToSend.append('id', id);
      }

      const endpoint = isEdit
        ? `${apiUrl}/${user?.role}/Usermanagment/Update-User`
        : `${apiUrl}/${user?.role}/Usermanagment/Add-User`;

      const response = await axios.post(endpoint, formDataToSend, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          accept: '*/*',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
          'Content-Type': 'multipart/form-data',
        },
      });

      const result: ApiResponse = response.data;

      setApiResponse(result);

      if (result.status) {
        toast.success(result.message);
        setTimeout(() => {
          navigate(`/${user?.role}/${getAdminTypeRoute()}`);
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error: any) {
      console.error('Network error:', error);
      setApiResponse({
        status: false,
        message: error.response?.data?.message || 'Network error occurred. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const getAdminTypeLabel = (): string => {
    switch (type) {
      case '2':
        return 'Support Admin';
      case '3':
        return 'Customer Admin';
      case '4':
        return 'Sales Admin';
      default:
        return 'Admin';
    }
  };

  const getAdminTypeRoute = (): string => {
    switch (type) {
      case '2':
        return 'support-admin';
      case '3':
        return 'customer-admin';
      case '4':
        return 'sales-admin';
      default:
        return 'support-admin';
    }
  };

  const handleCancel = () => {
    navigate(`/${user?.role}/${getAdminTypeRoute()}`);
  };

  // Get color classes for Tailwind
  const getStrengthColorClass = () => {
    switch (passwordStrength.color) {
      case 'red':
        return 'text-red-600';
      case 'orange':
        return 'text-orange-600';
      case 'blue':
        return 'text-blue-600';
      case 'green':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getProgressBarColorClass = () => {
    switch (passwordStrength.color) {
      case 'red':
        return 'bg-red-500';
      case 'orange':
        return 'bg-orange-500';
      case 'blue':
        return 'bg-blue-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  // Show loader while fetching edit data
  if (isEdit && fetchLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="bg-gray-100 py-5 px-2">
      <div className="">
        <BreadcrumbHeader
          title={isEdit ? `Edit ${getAdminTypeLabel()}` : `Add ${getAdminTypeLabel()}`}
          paths={[
            {
              name: getAdminTypeLabel(),
              link: `/${user?.role}/${getAdminTypeRoute()}`,
            },
            {
              name: `${isEdit ? 'Edit' : 'Add'} ${getAdminTypeLabel()}`,
              link: '#',
            },
          ]}
        />

        {/* Form Container */}
        <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-4">
          <form onSubmit={handleSubmit} className="p-6">
            {/* First Row - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 ">Full Name *</label>
                <TextInput
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('name')}
                  onBlur={handleBlur}
                  className="w-full py-2.5 text-sm border-none outline-none bg-transparent"
                  required
                  disabled={loading}
                  placeholder="Enter full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Email Address *
                </label>
                <TextInput
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('email')}
                  onBlur={handleBlur}
                  className="w-full py-2.5 text-sm border-none outline-none bg-transparent"
                  required
                  disabled={loading}
                  placeholder="Enter email address"
                />
              </div>
            </div>

            {/* Second Row - Two columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 ">
                  Phone Number *
                </label>
                <TextInput
                  type="tel"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus('number')}
                  onBlur={handleBlur}
                  className={`w-full py-2.5 text-sm ${
                    phoneError 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500' 
                      : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                  }`}
                  required
                  disabled={loading}
                  placeholder="Enter 10-digit phone number"
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]*"
                />
                {/* Phone number error message */}
                {phoneError && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {phoneError}
                  </p>
                )}
                {/* Success message when valid */}
                {!phoneError && formData.number.length === 10 && (
                  <p className="text-green-600 text-xs mt-1 flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Valid phone number
                  </p>
                )}
              </div>

              {/* Password - Show for both add and edit, but make optional for edit */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 ">
                  Password {!isEdit ? '*' : ''}
                </label>

                {/* Input Wrapper for consistent layout */}
                <div className="relative">
                  <TextInput
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    className="w-full py-2.5 pr-10 pl-3 text-sm rounded-md bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 border-none outline-none"
                    required={!isEdit}
                    disabled={loading}
                    placeholder={
                      isEdit ? 'Leave blank to keep current password' : 'Enter strong password'
                    }
                  />

                  {/* Eye Toggle Icon */}
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <HiEyeOff className="w-5 h-5" />
                    ) : (
                      <HiEye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-xs font-medium ${getStrengthColorClass()}`}>
                        {passwordStrength.feedback}
                      </span>
                      <span className="text-xs text-gray-500">
                        Strength: {passwordStrength.score}/5
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${getProgressBarColorClass()} transition-all duration-300`}
                        style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                      ></div>
                    </div>
                    {passwordStrength.score < 3 && formData.password.length > 0 && (
                      <p className="text-xs text-red-600 mt-1">
                        ⚠️ Password too weak. Use random mixed characters, numbers, and special
                        symbols.
                      </p>
                    )}
                  </div>
                )}

                {isEdit && (
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                )}
              </div>
            </div>

            {type === '2' && (
  <div className="mb-6">
    <AllAcademicsMultiDropdown
      name="assign_academic_id"
      label="Assign Academics *"
      formData={formData}
      setFormData={setFormData}
      disabled={loading}
    />
  </div>
)}


            {/* Academic Dropdown - Only for Customer Admin */}
            {type === '3' && (
              <div className="mb-6">
                <AllAcademicsDropdown
                  name="academic_id"
                  label="Academic Institution "
                  formData={formData}
                  setFormData={setFormData}
                  isRequired={type === '3'}
                  disabled={loading || academicLoading}
                />
              </div>
            )}

            {/* Profile Image Upload */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Picture {!isEdit && '*'}
              </label>
              <div
                className={`border rounded-md p-6 transition-colors ${
                  focusedField === 'profile'
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-400'
                }`}
              >
                <div className="flex flex-col items-center justify-center space-y-4">
                  <TextInput
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    onFocus={() => handleFocus('profile')}
                    onBlur={handleBlur}
                    accept="image/*"
                    className="hidden"
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={handleUpdateImage}
                    onFocus={() => handleFocus('profile')}
                    onBlur={handleBlur}
                    disabled={loading}
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
                  >
                    Update Image
                  </button>
                  <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 overflow-hidden">
                    {formData.profilePreview ? (
                      <img
                        src={formData.profilePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : (
                      <div className="text-center">
                        <svg
                          className="w-8 h-8 text-gray-400 mx-auto mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        <span className="text-gray-400 text-xs">No Image Selected</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Recommended: Square image, 500x500 pixels, max 2MB
                  </p>
                </div>
              </div>
            </div>


            {/* Notify Field - Only for Customer Admin */}
{type === '3' && (
  <div className="flex gap-5">
     <div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Campaign Access *
    </label>

    <div className="flex items-center gap-6">
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="compaign_access"
          value="1"
          checked={formData.compaign_access === 1}
          onChange={() =>
            setFormData((prev) => ({ ...prev, compaign_access: 1 }))
          }
          disabled={loading}
          className="w-4 h-4 accent-blue-600"
        />
        <span className="text-sm text-gray-700">Yes</span>
      </label>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="compaign_access"
          value="0"
          checked={formData.compaign_access === 0}
          onChange={() =>
            setFormData((prev) => ({ ...prev, compaign_access: 0 }))
          }
          disabled={loading}
          className="w-4 h-4 accent-blue-600"
        />
        <span className="text-sm text-gray-700">No</span>
      </label>
    </div>
  </div>
<div className="mb-6">
    <label className="block text-sm font-medium text-gray-700 mb-2">
      Notify Customer *
    </label>

    <div className="flex items-center gap-6">
      {/* YES */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="notify"
          value="1"
          checked={formData.notify === 1}
          onChange={() =>
            setFormData((prev) => ({ ...prev, notify: 1 }))
          }
          disabled={loading}
          className="w-4 h-4 accent-blue-600"
        />
        <span className="text-sm text-gray-700">Yes</span>
      </label>

      {/* NO */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="radio"
          name="notify"
          value="0"
          checked={formData.notify === 0}
          onChange={() =>
            setFormData((prev) => ({ ...prev, notify: 0 }))
          }
          disabled={loading}
          className="w-4 h-4 accent-blue-600"
        />
        <span className="text-sm text-gray-700">No</span>
      </label>
    </div>
  </div>
  </div>
)}


            {/* Action Buttons */}
            <div className="pt-6 border-t border-gray-200 flex justify-end space-x-4">
              <Button
                type="button"
                color="gray"
                onClick={handleCancel}
                disabled={loading}
                className="px-6 py-2.5"
              >
                Cancel
              </Button>
              <Button type="submit" color="blue" disabled={loading} className="px-6 py-2.5">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    {isEdit ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  `${isEdit ? 'Update' : 'Create'} ${getAdminTypeLabel()}`
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserForm;