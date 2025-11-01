import React, { useState, ChangeEvent, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from "src/hook/useAuth";
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
const apiAssetUrl = import.meta.env.VITE_ASSET_URL;

interface ProfileData {
  id: number;
  name: string;
  email: string;
  number: string;
  d_password: string;
  academic_id: string | null;
  two_step_auth: number;
  profile: string;
  address?: string;
}

const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white p-6 border border-gray-200 rounded-2xl shadow-sm ${className}`}>
    {children}
  </div>
);

// TextInput Component with eye icon for password fields
// interface TextInputProps {
//   id: string;
//   label: string;
//   type: string;
//   value: string;
//   onChange: (value: string) => void;
//   placeholder?: string;
//   required?: boolean;
//   className?: string;
// }

// const TextInput = ({ 
//   id, 
//   label, 
//   type, 
//   value, 
//   onChange, 
//   placeholder = '', 
//   required = false,
//   className = '' 
// }: TextInputProps) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const isPasswordField = type === 'password';
//   const inputType = isPasswordField && showPassword ? 'text' : type;

//   return (
//     <div className={className}>
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
//         {label}
//         {required && <span className="text-red-500 ml-1">*</span>}
//       </label>
//       <div className="relative">
//         <input
//           id={id}
//           type={inputType}
//           value={value}
//           onChange={(e) => onChange(e.target.value)}
//           className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-3.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none"
//           placeholder={placeholder}
//           required={required}
//         />
//         {isPasswordField && (
//           <button
//             type="button"
//             className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L9 9m13 11l-4-4m0 0l-4 4m4-4V5" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//               </svg>
//             )}
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// TextInput Component with proper eye icons for password fields
interface TextInputProps {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const TextInput = ({ 
  id, 
  label, 
  type, 
  value, 
  onChange, 
  placeholder = '', 
  required = false,
  className = '' 
}: TextInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="block w-full rounded-xl border border-gray-300 bg-gray-50 p-3.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-20 transition-all duration-200 outline-none pr-10"
          placeholder={placeholder}
          required={required}
        />
        {isPasswordField && (
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700 transition-colors duration-200"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              // Eye slash icon (when password is visible)
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.826c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z"/>
                <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z"/>
                <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.826l-2.477-2.477A5.25 5.25 0 016.75 12z"/>
              </svg>
            ) : (
              // Eye icon (when password is hidden)
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 15a3 3 0 100-6 3 3 0 000 6z"/>
                <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 4.75 12.001 4.75c4.97 0 9.185 2.223 10.675 6.68.12.362.12.752 0 1.113-1.487 4.471-5.705 6.697-10.677 6.697-4.97 0-9.186-2.223-10.675-6.68a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

const AccountTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  
  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  // Fetch profile data on component mount
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const fetchProfile = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Profile/get-profile`,
        { s_id: user.id },
        {
          headers: {
            'accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );

      if (response.data.status && response.data.profile) {
        const profileData = response.data.profile;
        setProfile(profileData);
        setName(profileData.name);
        setEmail(profileData.email);
        setPhone(profileData.number);
        setCurrentPassword(profileData.d_password || '');
        setAddress(profileData.address || '');
        setIs2faEnabled(profileData.two_step_auth === 1);
        
        // Set profile image URL
        if (profileData.profile) {
          setProfileImageUrl(`${apiAssetUrl}/${profileData.profile}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setProfileImageUrl(URL.createObjectURL(file));
    }
  };

  const handleResetImage = () => {
    setProfileImage(null);
    if (profile?.profile) {
      setProfileImageUrl(`${apiAssetUrl}/${profile.profile}`);
    } else {
      setProfileImageUrl('');
    }
  };

  const handle2faToggle = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }
    
    setIsUpdating(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Profile/Update-two-step`,
        {
          two_step_auth: is2faEnabled ? 0 : 1,
          s_id: user.id
        },
        {
          headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );

      if (response.data.status) {
        setIs2faEnabled(!is2faEnabled);
        toast.success('Two-factor authentication updated successfully!');
      } else {
        toast.error(response.data.message || 'Failed to update two-factor authentication');
      }
    } catch (error) {
      console.error('Error updating 2FA:', error);
      toast.error('Failed to update two-factor authentication');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      toast.error('User not found');
      return;
    }

    // Password validation
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setIsUpdating(true);
    try {
      const formData = new FormData();
      formData.append('s_id', user.id.toString());
      formData.append('name', name);
      formData.append('email', email);
      formData.append('number', phone);
      formData.append('address', address);
      
      // Only update password if new password is provided
      if (newPassword) {
        formData.append('d_password', newPassword);
      }
      
      if (profileImage) {
        formData.append('profile', profileImage);
      }

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Profile/Update-profile`,
        formData,
        {
          headers: {
            'accept': '*/*',
            'Authorization': `Bearer ${user?.token}`,
          }
        }
      );
      
      if (response.data.status) {
        toast.success('Profile updated successfully!');
        fetchProfile(); // Refresh profile data
        // Clear password fields
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.number);
      setCurrentPassword(profile.d_password || '');
      setAddress(profile.address || '');
      handleResetImage();
    }
    // Clear password fields
    setNewPassword('');
    setConfirmPassword('');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture Section */}
        <Card className="lg:col-span-1">
          <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
            Profile Picture
          </h5>
          <p className="font-base text-gray-500 mb-6">
            Update your profile photo from here
          </p>
          <div className="flex flex-col items-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-6 border-4 border-gray-100 shadow-inner">
              <img 
                src={profileImageUrl || "https://placehold.co/128x128/E0E0E0/333333?text=User"} 
                alt="user avatar" 
                className="object-cover w-full h-full" 
              />
            </div>
            <div className="flex flex-col w-full gap-3">
              <button className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/90 text-white font-semibold py-3 px-4 rounded-full transition-all duration-200 hover:shadow-lg">
                <label className="cursor-pointer flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  Upload New Photo
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                  />
                </label>
              </button>
              <button 
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-full transition-all duration-200"
                onClick={handleResetImage}
              >
                Reset
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center">
              Allowed JPG, GIF or PNG. Max size of 800K
            </p>
          </div>
        </Card>

        {/* Personal Details and Security Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Details */}
          <Card>
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Personal Details
            </h5>
            <p className="font-base text-gray-500 mb-6">
              Update your personal information
            </p>
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  id="your-name"
                  label="Full Name"
                  type="text"
                  value={name}
                  onChange={setName}
                  required={true}
                />
                <TextInput
                  id="email"
                  label="Email Address"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  required={true}
                />
                <TextInput
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={phone}
                  onChange={setPhone}
                  required={true}
                />
                <TextInput
                  id="current-password"
                  label="Current Password"
                  type="password"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                  placeholder="••••••••"
                />
                <TextInput
                  id="new-password"
                  label="New Password"
                  type="password"
                  value={newPassword}
                  onChange={setNewPassword}
                  placeholder="Enter new password"
                />
                <TextInput
                  id="confirm-password"
                  label="Confirm Password"
                  type="password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  placeholder="Confirm new password"
                />
                <div className="md:col-span-2">
                  <TextInput
                    id="address"
                    label="Address"
                    type="text"
                    value={address}
                    onChange={setAddress}
                    className="w-full"
                  />
                </div>
              </div>
            </form>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <h5 className="text-lg font-bold tracking-tight text-gray-900 mb-4">
              Security Settings
            </h5>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div>
                  <h6 className="font-semibold text-gray-900">Two-Factor Authentication</h6>
                  <p className="text-sm text-gray-600">
                    {is2faEnabled ? 'Enabled' : 'Disabled'} - Extra layer of security for your account
                  </p>
                </div>
              </div>
              <button
                onClick={handle2faToggle}
                className={`font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 ${
                  is2faEnabled
                    ? 'bg-red-100 hover:bg-red-200 text-red-700 border border-red-300'
                    : 'bg-green-100 hover:bg-green-200 text-green-700 border border-green-300'
                }`}
                disabled={isUpdating}
              >
                {isUpdating ? 'Updating...' : is2faEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-gray-200">
        <button 
          className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg order-2 sm:order-1"
          onClick={handleCancel}
          disabled={isUpdating}
        >
          Cancel
        </button>
        <button 
          className="bg-[#0ea5e9] hover:bg-[#0ea5e9]/80 text-white font-semibold py-3 px-8 rounded-full transition-all duration-200 hover:shadow-lg order-1 sm:order-2"
          onClick={handleSave}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </div>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

export default AccountTab;