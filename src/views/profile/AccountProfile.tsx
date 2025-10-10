

// import React, { useState, ChangeEvent, useEffect } from 'react';
// import Loader from 'src/Frontend/Common/Loader';

// // API service functions
// const apiService = {
//   baseURL: 'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Profile',
  
//   async getProfile(s_id: number) {
//     const response = await fetch(`${this.baseURL}/get-profile`, {
//       method: 'POST',
//       headers: {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${this.getToken()}`,
//       },
//       body: JSON.stringify({ s_id })
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to fetch profile');
//     }
    
//     return response.json();
//   },
  
//   async updateProfile(profileData: FormData) {
//     const response = await fetch(`${this.baseURL}/Update-profile`, {
//       method: 'POST',
//       headers: {
//         'accept': '*/*',
//         'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//         'Authorization': `Bearer ${this.getToken()}`,
//       },
//       body: profileData
//     });
    
//     if (!response.ok) {
//       throw new Error('Failed to update profile');
//     }
    
//     return response.json();
//   },
  
//   getToken() {
//     // Replace this with your actual token retrieval logic
//     return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ';
//   }
// };

// // Loader Component
// // const Loader = () => (
// //   <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
// //     <div className="relative top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
// //       <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
// //       <p className="text-white text-center mt-4">Loading...</p>
// //     </div>
// //   </div>
// // );

// // locations
// const locations = [
//   { value: 'us', label: 'United States' },
//   { value: 'uk', label: 'United Kingdom' },
//   { value: 'india', label: 'India' },
//   { value: 'russia', label: 'Russia' },
// ];

// // currency
// const currencies = [
//   { value: 'us', label: 'US Dollar ($)' },
//   { value: 'uk', label: 'United Kingdom (Pound)' },
//   { value: 'india', label: 'India (INR)' },
//   { value: 'russia', label: 'Russia (Ruble)' },
// ];

// const Card = ({ children }: { children: React.ReactNode }) => (
//   <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
//     {children}
//   </div>
// );

// const TabButton = ({ isActive, onClick, children, icon }: { isActive: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) => (
//   <button
//     onClick={onClick}
//     className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
//       isActive
//         ? 'bg-blue-600 text-white'
//         : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
//     }`}
//   >
//     {icon}
//     <span>{children}</span>
//   </button>
// );

// // Profile interface based on API response
// interface ProfileData {
//   id: number;
//   name: string;
//   email: string;
//   number: string;
//   d_password: string;
//   academic_id: string | null;
//   two_step_auth: number;
//   profile: string;
//   address?: string;
// }

// const AccountTab = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [location, setLocation] = useState('india');
//   const [currency, setCurrency] = useState('india');
//   const [name, setName] = useState('');
//   const [storeName, setStoreName] = useState('Maxima Studio');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [profileImageUrl, setProfileImageUrl] = useState('');

//   // Fetch profile data on component mount
//   useEffect(() => {
//     fetchProfile();
//   }, []);

//   const fetchProfile = async () => {
//     setIsLoading(true);
//     try {
//       const response = await apiService.getProfile(6); // Using s_id = 6 as per your API
//       if (response.status && response.profile) {
//         const profileData = response.profile;
//         setProfile(profileData);
//         setName(profileData.name);
//         setEmail(profileData.email);
//         setPhone(profileData.number);
//         setCurrentPassword(profileData.d_password);
//         setAddress(profileData.address || '');
        
//         // Set profile image URL
//         if (profileData.profile) {
//           setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profileData.profile}`);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       alert('Failed to load profile data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setLocation(event.target.value);
//   };

//   const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setCurrency(event.target.value);
//   };

//   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       setProfileImageUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleResetImage = () => {
//     setProfileImage(null);
//     if (profile?.profile) {
//       setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profile.profile}`);
//     } else {
//       setProfileImageUrl('');
//     }
//   };

//   const handleSave = async () => {
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('s_id', '6'); // Using s_id = 6 as per your API
//       formData.append('name', name);
//       formData.append('email', email);
//       formData.append('password', newPassword || currentPassword);
//       formData.append('number', phone);
//       formData.append('address', address);
      
//       if (profileImage) {
//         formData.append('profile', profileImage);
//       }

//       const response = await apiService.updateProfile(formData);
      
//       if (response.status) {
//         alert('Profile updated successfully!');
//         fetchProfile(); // Refresh profile data
//       } else {
//         alert('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     // Reset form to original profile data
//     if (profile) {
//       setName(profile.name);
//       setEmail(profile.email);
//       setPhone(profile.number);
//       setCurrentPassword(profile.d_password);
//       setAddress(profile.address || '');
//       handleResetImage();
//     }
//   };

//   return (
//     <>
//       {isLoading ? <Loader/> :
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Change Profile */}
//           <Card>
//             <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//               Change Profile
//             </h5>
//             <p className="font-normal text-gray-500 mb-3">
//               Change your profile picture from here
//             </p>
//             <div className="flex flex-col items-center">
//               <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
//                 <img 
//                   src={profileImageUrl || "https://placehold.co/128x128/E0E0E0/333333?text=User"} 
//                   alt="user avatar" 
//                   className="object-cover w-full h-full" 
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//                   <label className="cursor-pointer">
//                     Upload
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       accept="image/*" 
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </button>
//                 <button 
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//                   onClick={handleResetImage}
//                 >
//                   Reset
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mt-4 text-center">
//                 Allowed JPG, GIF or PNG. Max size of 800K
//               </p>
//             </div>
//           </Card>
//           {/* Change Password */}
//           <Card>
//             <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//               Change Password
//             </h5>
//             <p className="font-normal text-gray-500 mb-3">
//               To change your password please confirm here
//             </p>
//             <form className="flex flex-col gap-4">
//               <div>
//                 <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//                 <input
//                   id="current-password"
//                   type="password"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//                 <input
//                   id="new-password"
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                 <input
//                   id="confirm-password"
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </form>
//           </Card>
//         </div>

//         {/* Edit Details */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Personal Details
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             To change your personal detail, edit and save from here
//           </p>
//           <form>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
//                 <input
//                   id="your-name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
//                 <input
//                   id="store-name"
//                   value={storeName}
//                   onChange={(e) => setStoreName(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <select id="location" value={location} onChange={handleLocationChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                   {locations.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//                 <select id="currency" value={currency} onChange={handleCurrencyChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                   {currencies.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <input
//                   id="address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </form>
//         </Card>

//         <div className="flex flex-row justify-end gap-2 mt-4">
//           <button 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleSave}
//           >
//             Save
//           </button>
//           <button 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>}
//     </>
//   );
// };

// const SecurityTab = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [is2faEnabled, setIs2faEnabled] = useState(false);

//   const recentDevices = [
//     {
//       device: 'Macbook Air',
//       location: 'New York, USA',
//       date: 'Sept 26, 2025 at 10:30 AM',
//       ip: '192.168.1.1',
//     },
//     {
//       device: 'iPhone 15 Pro',
//       location: 'Mumbai, India',
//       date: 'Sept 25, 2025 at 05:00 PM',
//       ip: '10.0.0.1',
//     },
//   ];

//   const handle2faToggle = async () => {
//     setIsLoading(true);
//     try {
//       // Here you would call your API to update 2FA status
//       // await apiService.update2FA(!is2faEnabled);
//       setIs2faEnabled(!is2faEnabled);
//     } catch (error) {
//       console.error('Error updating 2FA:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         {/* Two-Factor Authentication */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Two-Factor Authentication
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             Secure your account with an extra layer of protection.
//           </p>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-800">Status: {is2faEnabled ? 'Enabled' : 'Disabled'}</span>
//             <button
//               onClick={handle2faToggle}
//               className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
//                 is2faEnabled
//                   ? 'bg-red-600 hover:bg-red-700 text-white'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               {is2faEnabled ? 'Disable' : 'Enable'}
//             </button>
//           </div>
//         </Card>

//         {/* Recent Devices */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Recent Devices
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             A list of devices that have recently accessed your account.
//           </p>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Device
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Location
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     IP Address
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentDevices.map((device, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {device.device}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.location}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.ip}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// };

// const SettingsTab = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [whatsappApiKey, setWhatsappApiKey] = useState('****');
//   const [whatsappPassword, setWhatsappPassword] = useState('****');
//   const [zohoApiKey, setZohoApiKey] = useState('****');
//   const [bounceAddress, setBounceAddress] = useState('');
//   const [zohoFromEmail, setZohoFromEmail] = useState('noreply@testingscrew.com');
//   const [smsApiKey, setSmsApiKey] = useState('****');
//   const [smsSecretKey, setSmsSecretKey] = useState('****');
//   const [razorpayApiKey, setRazorpayApiKey] = useState('****');
//   const [razorpaySecretKey, setRazorpaySecretKey] = useState('****');
//   const [collegePlatformFee, setCollegePlatformFee] = useState('60');
//   const [schoolPlatformFee, setSchoolPlatformFee] = useState('60');

//   const handleSaveSettings = async () => {
//     setIsLoading(true);
//     try {
//       // Here you would call your API to save settings
//       // await apiService.saveSettings({ ... });
//       alert('Settings saved successfully!');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       alert('Failed to save settings');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const inputStyle = "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500";
//   const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         <Card>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* WhatsAPP API Key */}
//             <div>
//               <label htmlFor="whatsapp-api-key" className={labelStyle}>WhatsAPP API Key*</label>
//               <input
//                 id="whatsapp-api-key"
//                 type="password"
//                 value={whatsappApiKey}
//                 onChange={(e) => setWhatsappApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* WhatsAPP Password */}
//             <div>
//               <label htmlFor="whatsapp-password" className={labelStyle}>WhatsAPP Password*</label>
//               <input
//                 id="whatsapp-password"
//                 type="password"
//                 value={whatsappPassword}
//                 onChange={(e) => setWhatsappPassword(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Zoho API Key */}
//             <div>
//               <label htmlFor="zoho-api-key" className={labelStyle}>Zoho API Key*</label>
//               <input
//                 id="zoho-api-key"
//                 type="password"
//                 value={zohoApiKey}
//                 onChange={(e) => setZohoApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Bounce Address */}
//             <div>
//               <label htmlFor="bounce-address" className={labelStyle}>Bounce Address*</label>
//               <input
//                 id="bounce-address"
//                 type="text"
//                 value={bounceAddress}
//                 onChange={(e) => setBounceAddress(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Zoho From Email */}
//             <div>
//               <label htmlFor="zoho-from-email" className={labelStyle}>Zoho From Email*</label>
//               <input
//                 id="zoho-from-email"
//                 type="email"
//                 value={zohoFromEmail}
//                 onChange={(e) => setZohoFromEmail(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* SMS API Key */}
//             <div>
//               <label htmlFor="sms-api-key" className={labelStyle}>SMS API Key*</label>
//               <input
//                 id="sms-api-key"
//                 type="password"
//                 value={smsApiKey}
//                 onChange={(e) => setSmsApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* SMS Secret Key */}
//             <div>
//               <label htmlFor="sms-secret-key" className={labelStyle}>SMS Secret Key*</label>
//               <input
//                 id="sms-secret-key"
//                 type="password"
//                 value={smsSecretKey}
//                 onChange={(e) => setSmsSecretKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Razorpay API Key */}
//             <div>
//               <label htmlFor="razorpay-api-key" className={labelStyle}>Razorpay API Key*</label>
//               <input
//                 id="razorpay-api-key"
//                 type="password"
//                 value={razorpayApiKey}
//                 onChange={(e) => setRazorpayApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Razorpay Secret Key */}
//             <div>
//               <label htmlFor="razorpay-secret-key" className={labelStyle}>Razorpay Secret Key*</label>
//               <input
//                 id="razorpay-secret-key"
//                 type="password"
//                 value={razorpaySecretKey}
//                 onChange={(e) => setRazorpaySecretKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* College Platform Fee */}
//             <div>
//               <label htmlFor="college-fee" className={labelStyle}>College Platform Fee*</label>
//               <input
//                 id="college-fee"
//                 type="number"
//                 value={collegePlatformFee}
//                 onChange={(e) => setCollegePlatformFee(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* School Platform Fee */}
//             <div>
//               <label htmlFor="school-fee" className={labelStyle}>School Platform Fee*</label>
//               <input
//                 id="school-fee"
//                 type="number"
//                 value={schoolPlatformFee}
//                 onChange={(e) => setSchoolPlatformFee(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//           </div>
//         </Card>
//         <div className="flex flex-row justify-end gap-2 mt-4">
//           <button 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleSaveSettings}
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };

// const AccountProfile = () => {
//   const [activeTab, setActiveTab] = useState('account');

//   return (
//     <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
//       <header className="flex justify-between items-center mb-6">
//         <div className="flex items-center space-x-2 text-gray-500 text-sm">
//           <span>Home</span>
//           <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
//           </svg>
//           <span>My Profile</span>
//         </div>
//         <h1 className="text-3xl font-bold text-gray-900">
//           My Profile
//         </h1>
//       </header>
//       <div className="w-full">
//         <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm mb-6">
//           <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto whitespace-nowrap">
//             <TabButton isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
//             }>
//               Account
//             </TabButton>
//             <TabButton isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path><path d="M11 15a1 1 0 10-2 0v4a1 1 0 102 0v-4zM8 11v4a1 1 0 102 0v-4h2a1 1 0 100-2h-2v-4a1 1 0 10-2 0v4h-2a1 1 0 100 2h2z" clipRule="evenodd"></path></svg>
//             }>
//               Security
//             </TabButton>
//             <TabButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-.76-1.54-.76-1.92 0l-1.5 3a1 1 0 00-.95.69l-3 1.5a1 1 0 00-.69.95l1.5 3a1 1 0 00.69.95l3 1.5c.38.19.76-.19 1.14-.19l1.5 3c.38.76 1.54.76 1.92 0l1.5-3a1 1 0 00.95-.69l3-1.5c.38-.19.76-.57.38-.76l-1.5-3a1 1 0 00-.69-.95l-3-1.5a1 1 0 00-.95-.69z" clipRule="evenodd"></path></svg>
//             }>
//               Settings
//             </TabButton>
//           </nav>
//         </div>
//         <div>
//           {activeTab === 'account' && <AccountTab />}
//           {activeTab === 'security' && <SecurityTab />}
//           {activeTab === 'settings' && <SettingsTab />}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AccountProfile;



















import React, { useState, ChangeEvent, useEffect } from 'react';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from "src/hook/useAuth";

// API service functions
const apiService = {
  baseURL: 'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Profile',
  
  async getProfile(s_id: number) {
    const response = await fetch(`${this.baseURL}/get-profile`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ s_id })
    });


    
    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }
    
    return response.json();
  },
  
  async updateProfile(profileData: FormData) {
    const response = await fetch(`${this.baseURL}/Update-profile`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: profileData
    });
    
    if (!response.ok) {
      throw new Error('Failed to update profile');
    }
    
    return response.json();
  },
  
  getToken() {
    // Replace this with your actual token retrieval logic
    return 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ';
  },

    async changePassword(s_id: number, new_password: string) {
    const response = await fetch(`${this.baseURL}/change-password`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ s_id, new_password })
    });
    
    if (!response.ok) {
      throw new Error('Failed to change password');
    }
    
    return response.json();
  },

  async getSettings(s_id: number) {
    const response = await fetch(`${this.baseURL}/get-settings`, {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify({ s_id })
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch settings');
    }
    
    return response.json();
  },
  
  async updateSettings(settingsData: any) {
 const response = await fetch(`${this.baseURL}/update-settings`, { // API endpoint confirm karo
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getToken()}`,
      },
      body: JSON.stringify(settingsData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to update settings');
    }
    
    return response.json();
  },

};

// locations
const locations = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'india', label: 'India' },
  { value: 'russia', label: 'Russia' },
];

// currency
const currencies = [
  { value: 'us', label: 'US Dollar ($)' },
  { value: 'uk', label: 'United Kingdom (Pound)' },
  { value: 'india', label: 'India (INR)' },
  { value: 'russia', label: 'Russia (Ruble)' },
];

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm">
    {children}
  </div>
);

const TabButton = ({ isActive, onClick, children, icon }: { isActive: boolean, onClick: () => void, children: React.ReactNode, icon: React.ReactNode }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 py-2 px-4 text-sm font-medium rounded-lg transition-colors duration-200 ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-200 hover:text-gray-800'
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

// Profile interface based on API response
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

// const AccountTab = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [profile, setProfile] = useState<ProfileData | null>(null);
//   const [location, setLocation] = useState('india');
//   const [currency, setCurrency] = useState('india');
//   const [name, setName] = useState('');
//   const [storeName, setStoreName] = useState('Maxima Studio');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [address, setAddress] = useState('');
//   const [currentPassword, setCurrentPassword] = useState('');
//   const [newPassword, setNewPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const [profileImageUrl, setProfileImageUrl] = useState('');

//   // Fetch profile data on component mount
//   useEffect(() => {
//     if (user?.id) {
//       fetchProfile();
//     }
//   }, [user?.id]);

//   const fetchProfile = async () => {
//     if (!user?.id) return;
    
//     setIsLoading(true);
//     try {
//       const response = await apiService.getProfile(user.id);
//       if (response.status && response.profile) {
//         const profileData = response.profile;
//         setProfile(profileData);
//         setName(profileData.name);
//         setEmail(profileData.email);
//         setPhone(profileData.number);
//         setCurrentPassword(profileData.d_password);
//         setAddress(profileData.address || '');
        
//         // Set profile image URL
//         if (profileData.profile) {
//           setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profileData.profile}`);
//         }
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       alert('Failed to load profile data');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setLocation(event.target.value);
//   };

//   const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setCurrency(event.target.value);
//   };

//   const handleImageUpload = (event: ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0];
//     if (file) {
//       setProfileImage(file);
//       setProfileImageUrl(URL.createObjectURL(file));
//     }
//   };

//   const handleResetImage = () => {
//     setProfileImage(null);
//     if (profile?.profile) {
//       setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profile.profile}`);
//     } else {
//       setProfileImageUrl('');
//     }
//   };

//   const handleSave = async () => {
//     if (!user?.id) {
//       alert('User not found');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('s_id', user.id.toString());
//       formData.append('name', name);
//       formData.append('email', email);
//       formData.append('password', newPassword || currentPassword);
//       formData.append('number', phone);
//       formData.append('address', address);
      
//       if (profileImage) {
//         formData.append('profile', profileImage);
//       }

//       const response = await apiService.updateProfile(formData);
      
//       if (response.status) {
//         alert('Profile updated successfully!');
//         fetchProfile(); // Refresh profile data
//       } else {
//         alert('Failed to update profile');
//       }
//     } catch (error) {
//       console.error('Error updating profile:', error);
//       alert('Failed to update profile');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     // Reset form to original profile data
//     if (profile) {
//       setName(profile.name);
//       setEmail(profile.email);
//       setPhone(profile.number);
//       setCurrentPassword(profile.d_password);
//       setAddress(profile.address || '');
//       handleResetImage();
//     }
//   };

//   return (
//     <>
//       {isLoading ? <Loader/> :
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {/* Change Profile */}
//           <Card>
//             <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//               Change Profile
//             </h5>
//             <p className="font-normal text-gray-500 mb-3">
//               Change your profile picture from here
//             </p>
//             <div className="flex flex-col items-center">
//               <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
//                 <img 
//                   src={profileImageUrl || "https://placehold.co/128x128/E0E0E0/333333?text=User"} 
//                   alt="user avatar" 
//                   className="object-cover w-full h-full" 
//                 />
//               </div>
//               <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
//                 <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//                   <label className="cursor-pointer">
//                     Upload
//                     <input 
//                       type="file" 
//                       className="hidden" 
//                       accept="image/*" 
//                       onChange={handleImageUpload}
//                     />
//                   </label>
//                 </button>
//                 <button 
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//                   onClick={handleResetImage}
//                 >
//                   Reset
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 mt-4 text-center">
//                 Allowed JPG, GIF or PNG. Max size of 800K
//               </p>
//             </div>
//           </Card>
//           {/* Change Password */}
//           <Card>
//             <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//               Change Password
//             </h5>
//             <p className="font-normal text-gray-500 mb-3">
//               To change your password please confirm here
//             </p>
//             <form className="flex flex-col gap-4">
//               <div>
//                 <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//                 <input
//                   id="current-password"
//                   type="password"
//                   value={currentPassword}
//                   onChange={(e) => setCurrentPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//                 <input
//                   id="new-password"
//                   type="password"
//                   value={newPassword}
//                   onChange={(e) => setNewPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//                 <input
//                   id="confirm-password"
//                   type="password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </form>
//           </Card>
//         </div>

//         {/* Edit Details */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Personal Details
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             To change your personal detail, edit and save from here
//           </p>
//           <form>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
//                 <input
//                   id="your-name"
//                   value={name}
//                   onChange={(e) => setName(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
//                 <input
//                   id="store-name"
//                   value={storeName}
//                   onChange={(e) => setStoreName(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//                 <select id="location" value={location} onChange={handleLocationChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                   {locations.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//                 <select id="currency" value={currency} onChange={handleCurrencyChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                   {currencies.map((option) => (
//                     <option key={option.value} value={option.value}>
//                       {option.label}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div>
//                 <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//                 <input
//                   id="phone"
//                   type="tel"
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//               <div className="md:col-span-2">
//                 <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                 <input
//                   id="address"
//                   value={address}
//                   onChange={(e) => setAddress(e.target.value)}
//                   className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                   required
//                 />
//               </div>
//             </div>
//           </form>
//         </Card>

//         <div className="flex flex-row justify-end gap-2 mt-4">
//           <button 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleSave}
//           >
//             Save
//           </button>
//           <button 
//             className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleCancel}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>}
//     </>
//   );
// };

// const SecurityTab = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [is2faEnabled, setIs2faEnabled] = useState(false);

//   const recentDevices = [
//     {
//       device: 'Macbook Air',
//       location: 'New York, USA',
//       date: 'Sept 26, 2025 at 10:30 AM',
//       ip: '192.168.1.1',
//     },
//     {
//       device: 'iPhone 15 Pro',
//       location: 'Mumbai, India',
//       date: 'Sept 25, 2025 at 05:00 PM',
//       ip: '10.0.0.1',
//     },
//   ];

//   const handle2faToggle = async () => {
//     if (!user?.id) {
//       alert('User not found');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       // Here you would call your API to update 2FA status
//       // await apiService.update2FA(user.id, !is2faEnabled);
//       setIs2faEnabled(!is2faEnabled);
//     } catch (error) {
//       console.error('Error updating 2FA:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         {/* Two-Factor Authentication */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Two-Factor Authentication
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             Secure your account with an extra layer of protection.
//           </p>
//           <div className="flex items-center justify-between">
//             <span className="text-gray-800">Status: {is2faEnabled ? 'Enabled' : 'Disabled'}</span>
//             <button
//               onClick={handle2faToggle}
//               className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
//                 is2faEnabled
//                   ? 'bg-red-600 hover:bg-red-700 text-white'
//                   : 'bg-green-600 hover:bg-green-700 text-white'
//               }`}
//             >
//               {is2faEnabled ? 'Disable' : 'Enable'}
//             </button>
//           </div>
//         </Card>

//         {/* Recent Devices */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Recent Devices
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             A list of devices that have recently accessed your account.
//           </p>
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Device
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Location
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Date
//                   </th>
//                   <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     IP Address
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {recentDevices.map((device, index) => (
//                   <tr key={index}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {device.device}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.location}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.date}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {device.ip}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </Card>
//       </div>
//     </>
//   );
// };


const AccountTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [location, setLocation] = useState('india');
  const [currency, setCurrency] = useState('india');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('Maxima Studio');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

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
      const response = await apiService.getProfile(user.id);
      if (response.status && response.profile) {
        const profileData = response.profile;
        setProfile(profileData);
        setName(profileData.name);
        setEmail(profileData.email);
        setPhone(profileData.number);
        setCurrentPassword(''); // Don't display actual password
        setAddress(profileData.address || '');
        
        // Set profile image URL
        if (profileData.profile) {
          setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profileData.profile}`);
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      alert('Failed to load profile data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
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
      setProfileImageUrl(`https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profile.profile}`);
    } else {
      setProfileImageUrl('');
    }
  };

  const handleChangePassword = async () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }

    // Validation
    if (!newPassword) {
      alert('Please enter a new password');
      return;
    }

    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match');
      return;
    }

    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }

    setIsChangingPassword(true);
    try {
      const response = await apiService.changePassword(user.id, newPassword);
      
      if (response.status) {
        alert('Password changed successfully!');
        // Clear password fields
        setNewPassword('');
        setConfirmPassword('');
        setCurrentPassword('');
      } else {
        alert(response.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password');
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleSave = async () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('s_id', user.id.toString());
      formData.append('name', name);
      formData.append('email', email);
      formData.append('number', phone);
      formData.append('address', address);
      
      if (profileImage) {
        formData.append('profile', profileImage);
      }

      const response = await apiService.updateProfile(formData);
      
      if (response.status) {
        alert('Profile updated successfully!');
        fetchProfile(); // Refresh profile data
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original profile data
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.number);
      setCurrentPassword('');
      setAddress(profile.address || '');
      handleResetImage();
    }
    // Clear password fields
    setNewPassword('');
    setConfirmPassword('');
  };

  return (
    <>
      {isLoading ? <Loader/> :
      <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Change Profile */}
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
              Change Profile
            </h5>
            <p className="font-normal text-gray-500 mb-3">
              Change your profile picture from here
            </p>
            <div className="flex flex-col items-center">
              <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
                <img 
                  src={profileImageUrl || "https://placehold.co/128x128/E0E0E0/333333?text=User"} 
                  alt="user avatar" 
                  className="object-cover w-full h-full" 
                />
              </div>
              <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                  <label className="cursor-pointer">
                    Upload
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </button>
                <button 
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                  onClick={handleResetImage}
                >
                  Reset
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-4 text-center">
                Allowed JPG, GIF or PNG. Max size of 800K
              </p>
            </div>
          </Card>
          {/* Change Password */}
          <Card>
            <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
              Change Password
            </h5>
            <p className="font-normal text-gray-500 mb-3">
              To change your password please confirm here
            </p>
            <form className="flex flex-col gap-4">
              <div>
                <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Enter new password"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <button 
                type="button"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 mt-2"
                onClick={handleChangePassword}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? 'Changing Password...' : 'Change Password'}
              </button>
            </form>
          </Card>
        </div>

        {/* Edit Details */}
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
            Personal Details
          </h5>
          <p className="font-normal text-gray-500 mb-3">
            To change your personal detail, edit and save from here
          </p>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                <input
                  id="your-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                <input
                  id="store-name"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select id="location" value={location} onChange={handleLocationChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
                  {locations.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select id="currency" value={currency} onChange={handleCurrencyChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
                  {currencies.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </form>
        </Card>

        <div className="flex flex-row justify-end gap-2 mt-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={handleSave}
          >
            Save
          </button>
          <button 
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>}
    </>
  );
};



const SecurityTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [is2faEnabled, setIs2faEnabled] = useState(false);

  // Fetch 2FA status when component mounts
  useEffect(() => {
    if (user?.id) {
      fetch2FAStatus();
    }
  }, [user?.id]);

  const fetch2FAStatus = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getProfile(user.id);
      if (response.status && response.profile) {
        // Set 2FA status based on two_step_auth value (1 = enabled, 2 = disabled)
        setIs2faEnabled(response.profile.two_step_auth === 1);
      }
    } catch (error) {
      console.error('Error fetching 2FA status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handle2faToggle = async () => {
    if (!user?.id) {
      alert('User not found');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api/SuperAdmin/Profile/Update-two-step', {
        method: 'POST',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiService.getToken()}`,
        },
        body: JSON.stringify({
          two_step_auth: is2faEnabled ? 0 : 1, // Toggle: if currently enabled, set to disabled (0), and vice versa
          s_id: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update two-factor authentication');
      }

      const result = await response.json();
      
      if (result.status) {
        // Update local state only if API call was successful
        setIs2faEnabled(!is2faEnabled);
        alert('Two-factor authentication updated successfully!');
      } else {
        alert(result.message || 'Failed to update two-factor authentication');
      }
    } catch (error) {
      console.error('Error updating 2FA:', error);
      alert('Failed to update two-factor authentication');
    } finally {
      setIsLoading(false);
    }
  };

  const recentDevices = [
    {
      device: 'Macbook Air',
      location: 'New York, USA',
      date: 'Sept 26, 2025 at 10:30 AM',
      ip: '192.168.1.1',
    },
    {
      device: 'iPhone 15 Pro',
      location: 'Mumbai, India',
      date: 'Sept 25, 2025 at 05:00 PM',
      ip: '10.0.0.1',
    },
  ];

  return (
    <>
      {isLoading && <Loader />}
      <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
        {/* Two-Factor Authentication */}
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
            Two-Factor Authentication
          </h5>
          <p className="font-normal text-gray-500 mb-3">
            Secure your account with an extra layer of protection.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-gray-800 font-medium">
                  Status: {is2faEnabled ? 'Enabled' : 'Disabled'}
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  {is2faEnabled 
                    ? "Two-factor authentication is currently enabled. Disable it if you no longer want to use this security feature."
                    : "Two-factor authentication is currently disabled. Enable it to add an extra layer of security to your account."
                  }
                </p>
              </div>
              <button
                onClick={handle2faToggle}
                className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
                  is2faEnabled
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
                disabled={isLoading}
              >
                {is2faEnabled ? 'Disable' : 'Enable'}
              </button>
            </div>
          </div>
        </Card>

        {/* Recent Devices */}
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
            Recent Devices
          </h5>
          <p className="font-normal text-gray-500 mb-3">
            A list of devices that have recently accessed your account.
          </p>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Device
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    IP Address
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentDevices.map((device, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {device.device}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {device.ip}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </>
  );
};





// const SettingsTab = () => {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);
//   const [whatsappApiKey, setWhatsappApiKey] = useState('****');
//   const [whatsappPassword, setWhatsappPassword] = useState('****');
//   const [zohoApiKey, setZohoApiKey] = useState('****');
//   const [bounceAddress, setBounceAddress] = useState('');
//   const [zohoFromEmail, setZohoFromEmail] = useState('noreply@testingscrew.com');
//   const [smsApiKey, setSmsApiKey] = useState('****');
//   const [smsSecretKey, setSmsSecretKey] = useState('****');
//   const [razorpayApiKey, setRazorpayApiKey] = useState('****');
//   const [razorpaySecretKey, setRazorpaySecretKey] = useState('****');
//   const [collegePlatformFee, setCollegePlatformFee] = useState('60');
//   const [schoolPlatformFee, setSchoolPlatformFee] = useState('60');

//   const handleSaveSettings = async () => {
//     if (!user?.id) {
//       alert('User not found');
//       return;
//     }
    
//     setIsLoading(true);
//     try {
//       // Here you would call your API to save settings with user.id
//       // await apiService.saveSettings(user.id, { ... });
//       alert('Settings saved successfully!');
//     } catch (error) {
//       console.error('Error saving settings:', error);
//       alert('Failed to save settings');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const inputStyle = "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500";
//   const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <>
//       {isLoading && <Loader />}
//       <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//         <Card>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* WhatsAPP API Key */}
//             <div>
//               <label htmlFor="whatsapp-api-key" className={labelStyle}>WhatsAPP API Key*</label>
//               <input
//                 id="whatsapp-api-key"
//                 type="password"
//                 value={whatsappApiKey}
//                 onChange={(e) => setWhatsappApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* WhatsAPP Password */}
//             <div>
//               <label htmlFor="whatsapp-password" className={labelStyle}>WhatsAPP Password*</label>
//               <input
//                 id="whatsapp-password"
//                 type="password"
//                 value={whatsappPassword}
//                 onChange={(e) => setWhatsappPassword(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Zoho API Key */}
//             <div>
//               <label htmlFor="zoho-api-key" className={labelStyle}>Zoho API Key*</label>
//               <input
//                 id="zoho-api-key"
//                 type="password"
//                 value={zohoApiKey}
//                 onChange={(e) => setZohoApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Bounce Address */}
//             <div>
//               <label htmlFor="bounce-address" className={labelStyle}>Bounce Address*</label>
//               <input
//                 id="bounce-address"
//                 type="text"
//                 value={bounceAddress}
//                 onChange={(e) => setBounceAddress(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Zoho From Email */}
//             <div>
//               <label htmlFor="zoho-from-email" className={labelStyle}>Zoho From Email*</label>
//               <input
//                 id="zoho-from-email"
//                 type="email"
//                 value={zohoFromEmail}
//                 onChange={(e) => setZohoFromEmail(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* SMS API Key */}
//             <div>
//               <label htmlFor="sms-api-key" className={labelStyle}>SMS API Key*</label>
//               <input
//                 id="sms-api-key"
//                 type="password"
//                 value={smsApiKey}
//                 onChange={(e) => setSmsApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* SMS Secret Key */}
//             <div>
//               <label htmlFor="sms-secret-key" className={labelStyle}>SMS Secret Key*</label>
//               <input
//                 id="sms-secret-key"
//                 type="password"
//                 value={smsSecretKey}
//                 onChange={(e) => setSmsSecretKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Razorpay API Key */}
//             <div>
//               <label htmlFor="razorpay-api-key" className={labelStyle}>Razorpay API Key*</label>
//               <input
//                 id="razorpay-api-key"
//                 type="password"
//                 value={razorpayApiKey}
//                 onChange={(e) => setRazorpayApiKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* Razorpay Secret Key */}
//             <div>
//               <label htmlFor="razorpay-secret-key" className={labelStyle}>Razorpay Secret Key*</label>
//               <input
//                 id="razorpay-secret-key"
//                 type="password"
//                 value={razorpaySecretKey}
//                 onChange={(e) => setRazorpaySecretKey(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* College Platform Fee */}
//             <div>
//               <label htmlFor="college-fee" className={labelStyle}>College Platform Fee*</label>
//               <input
//                 id="college-fee"
//                 type="number"
//                 value={collegePlatformFee}
//                 onChange={(e) => setCollegePlatformFee(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//             {/* School Platform Fee */}
//             <div>
//               <label htmlFor="school-fee" className={labelStyle}>School Platform Fee*</label>
//               <input
//                 id="school-fee"
//                 type="number"
//                 value={schoolPlatformFee}
//                 onChange={(e) => setSchoolPlatformFee(e.target.value)}
//                 className={inputStyle}
//                 required
//               />
//             </div>
//           </div>
//         </Card>
//         <div className="flex flex-row justify-end gap-2 mt-4">
//           <button 
//             className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
//             onClick={handleSaveSettings}
//           >
//             Save Settings
//           </button>
//         </div>
//       </div>
//     </>
//   );
// };



const SettingsTab = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);
  
  // Settings state
  const [whatsappApiKey, setWhatsappApiKey] = useState('');
  const [whatsappPassword, setWhatsappPassword] = useState('');
  const [zohoApiKey, setZohoApiKey] = useState('');
  const [bounceAddress, setBounceAddress] = useState('');
  const [zohoFromEmail, setZohoFromEmail] = useState('');
  const [smsApiKey, setSmsApiKey] = useState('');
  const [smsSecretKey, setSmsSecretKey] = useState('');
  const [razorpayApiKey, setRazorpayApiKey] = useState('');
  const [razorpaySecretKey, setRazorpaySecretKey] = useState('');
  const [collegePlatformFee, setCollegePlatformFee] = useState('');
  const [schoolPlatformFee, setSchoolPlatformFee] = useState('');
  const [wasabiApiKey, setWasabiApiKey] = useState('');
  const [wasabiSecretKey, setWasabiSecretKey] = useState('');
  const [wasabiRegion, setWasabiRegion] = useState('');
  const [wasabiEndpoint, setWasabiEndpoint] = useState('');
  const [wasabiBucket, setWasabiBucket] = useState('');

  // Fetch settings on component mount
  useEffect(() => {
    if (user?.id) {
      fetchSettings();
    }
  }, [user?.id]);

  const fetchSettings = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const response = await apiService.getSettings(user.id);
      if (response.status && response.Data) {
        const settingsData = response.Data;
        setSettings(settingsData);
        
        // Set all fields from API response
        setWhatsappApiKey(settingsData.wtsp_api_key || '');
        setWhatsappPassword(settingsData.wtsp_pass || '');
        setZohoApiKey(settingsData.zoho_api_key || '');
        setBounceAddress(settingsData.bounce_address || '');
        setZohoFromEmail(settingsData.zoho_from_email || '');
        setSmsApiKey(settingsData.sms_api_key || '');
        setSmsSecretKey(settingsData.sms_secret_key || '');
        setRazorpayApiKey(settingsData.razorpay_api_key || '');
        setRazorpaySecretKey(settingsData.razorpay_secret_key || '');
        setCollegePlatformFee(settingsData.college_platform_fee || '');
        setSchoolPlatformFee(settingsData.school_platform_fee || '');
        setWasabiApiKey(settingsData.wasabi_api_key || '');
        setWasabiSecretKey(settingsData.wasabi_secret_key || '');
        setWasabiRegion(settingsData.wasabi_region || '');
        setWasabiEndpoint(settingsData.wasabi_endpoint || '');
        setWasabiBucket(settingsData.wasabi_bucket || '');
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      alert('Failed to load settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    if (!user?.id || !settings) {
      alert('User or settings not found');
      return;
    }
    
    setIsLoading(true);
    try {
      const settingsData = {
        s_id: user.id,
        wtsp_api_key: whatsappApiKey,
        wtsp_pass: whatsappPassword,
        zoho_api_key: zohoApiKey,
        bounce_address: bounceAddress,
        zoho_from_email: zohoFromEmail,
        sms_api_key: smsApiKey,
        sms_secret_key: smsSecretKey,
        razorpay_api_key: razorpayApiKey,
        razorpay_secret_key: razorpaySecretKey,
        college_platform_fee: collegePlatformFee,
        school_platform_fee: schoolPlatformFee,
        wasabi_api_key: wasabiApiKey,
        wasabi_secret_key: wasabiSecretKey,
        wasabi_region: wasabiRegion,
        wasabi_endpoint: wasabiEndpoint,
        wasabi_bucket: wasabiBucket,
        // Include existing fields that we're not editing but need to preserve
        id: settings.id,
        ticket_prefix: settings.ticket_prefix,
        whatsapp_status: settings.whatsapp_status,
        email_status: settings.email_status,
        sms_status: settings.sms_status,
        mail_type: settings.mail_type,
        email_smtp_host: settings.email_smtp_host,
        email_smtp_port: settings.email_smtp_port,
        email_smtp_username: settings.email_smtp_username,
        email_smtp_password: settings.email_smtp_password,
        from_email: settings.from_email,
        logo: settings.logo,
        favicon: settings.favicon,
        dark_logo: settings.dark_logo,
        notification_tune: settings.notification_tune,
        notification_status: settings.notification_status,
      };

      const response = await apiService.updateSettings(settingsData);
      
      if (response.status) {
        alert('Settings saved successfully!');
        fetchSettings(); // Refresh settings
      } else {
        alert(response.message || 'Failed to save settings');
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <>
      {isLoading && <Loader />}
      <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
        <Card>
          <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-4">
            Application Settings
          </h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WhatsApp Settings */}
            <div className="md:col-span-2">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">WhatsApp Settings</h6>
            </div>
            <div>
              <label htmlFor="whatsapp-api-key" className={labelStyle}>WhatsApp API Key*</label>
              <input
                id="whatsapp-api-key"
                type="text"
                value={whatsappApiKey}
                onChange={(e) => setWhatsappApiKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="whatsapp-password" className={labelStyle}>WhatsApp Password*</label>
              <input
                id="whatsapp-password"
                type="password"
                value={whatsappPassword}
                onChange={(e) => setWhatsappPassword(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            {/* Email Settings */}
            <div className="md:col-span-2 mt-4">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Email Settings</h6>
            </div>
            <div>
              <label htmlFor="zoho-api-key" className={labelStyle}>Zoho API Key*</label>
              <input
                id="zoho-api-key"
                type="password"
                value={zohoApiKey}
                onChange={(e) => setZohoApiKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="bounce-address" className={labelStyle}>Bounce Address</label>
              <input
                id="bounce-address"
                type="text"
                value={bounceAddress}
                onChange={(e) => setBounceAddress(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="zoho-from-email" className={labelStyle}>Zoho From Email*</label>
              <input
                id="zoho-from-email"
                type="email"
                value={zohoFromEmail}
                onChange={(e) => setZohoFromEmail(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            {/* SMS Settings */}
            <div className="md:col-span-2 mt-4">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">SMS Settings</h6>
            </div>
            <div>
              <label htmlFor="sms-api-key" className={labelStyle}>SMS API Key*</label>
              <input
                id="sms-api-key"
                type="password"
                value={smsApiKey}
                onChange={(e) => setSmsApiKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="sms-secret-key" className={labelStyle}>SMS Secret Key*</label>
              <input
                id="sms-secret-key"
                type="password"
                value={smsSecretKey}
                onChange={(e) => setSmsSecretKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            {/* Payment Settings */}
            <div className="md:col-span-2 mt-4">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Payment Settings</h6>
            </div>
            <div>
              <label htmlFor="razorpay-api-key" className={labelStyle}>Razorpay API Key*</label>
              <input
                id="razorpay-api-key"
                type="password"
                value={razorpayApiKey}
                onChange={(e) => setRazorpayApiKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="razorpay-secret-key" className={labelStyle}>Razorpay Secret Key*</label>
              <input
                id="razorpay-secret-key"
                type="password"
                value={razorpaySecretKey}
                onChange={(e) => setRazorpaySecretKey(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            {/* Platform Fees */}
            <div className="md:col-span-2 mt-4">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Platform Fees</h6>
            </div>
            <div>
              <label htmlFor="college-fee" className={labelStyle}>College Platform Fee*</label>
              <input
                id="college-fee"
                type="number"
                value={collegePlatformFee}
                onChange={(e) => setCollegePlatformFee(e.target.value)}
                className={inputStyle}
                required
              />
            </div>
            <div>
              <label htmlFor="school-fee" className={labelStyle}>School Platform Fee*</label>
              <input
                id="school-fee"
                type="number"
                value={schoolPlatformFee}
                onChange={(e) => setSchoolPlatformFee(e.target.value)}
                className={inputStyle}
                required
              />
            </div>

            {/* Wasabi Storage Settings */}
            <div className="md:col-span-2 mt-4">
              <h6 className="text-lg font-semibold text-gray-800 mb-3 border-b pb-2">Wasabi Storage</h6>
            </div>
            <div>
              <label htmlFor="wasabi-api-key" className={labelStyle}>Wasabi API Key</label>
              <input
                id="wasabi-api-key"
                type="password"
                value={wasabiApiKey}
                onChange={(e) => setWasabiApiKey(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="wasabi-secret-key" className={labelStyle}>Wasabi Secret Key</label>
              <input
                id="wasabi-secret-key"
                type="password"
                value={wasabiSecretKey}
                onChange={(e) => setWasabiSecretKey(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="wasabi-region" className={labelStyle}>Wasabi Region</label>
              <input
                id="wasabi-region"
                type="text"
                value={wasabiRegion}
                onChange={(e) => setWasabiRegion(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="wasabi-endpoint" className={labelStyle}>Wasabi Endpoint</label>
              <input
                id="wasabi-endpoint"
                type="text"
                value={wasabiEndpoint}
                onChange={(e) => setWasabiEndpoint(e.target.value)}
                className={inputStyle}
              />
            </div>
            <div>
              <label htmlFor="wasabi-bucket" className={labelStyle}>Wasabi Bucket</label>
              <input
                id="wasabi-bucket"
                type="text"
                value={wasabiBucket}
                onChange={(e) => setWasabiBucket(e.target.value)}
                className={inputStyle}
              />
            </div>
          </div>
        </Card>
        <div className="flex flex-row justify-end gap-2 mt-4">
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            onClick={handleSaveSettings}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </>
  );
};



const AccountProfile = () => {
  const [activeTab, setActiveTab] = useState('account');

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-8">
      <header className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2 text-gray-500 text-sm">
          <span>Home</span>
          <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
          <span>My Profile</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          My Profile
        </h1>
      </header>
      <div className="w-full">
        <div className="bg-white p-2 sm:p-4 rounded-xl shadow-sm mb-6">
          <nav className="flex space-x-2 sm:space-x-4 overflow-x-auto whitespace-nowrap">
            <TabButton isActive={activeTab === 'account'} onClick={() => setActiveTab('account')} icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"></path></svg>
            }>
              Account
            </TabButton>
            <TabButton isActive={activeTab === 'security'} onClick={() => setActiveTab('security')} icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M8 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path><path d="M11 15a1 1 0 10-2 0v4a1 1 0 102 0v-4zM8 11v4a1 1 0 102 0v-4h2a1 1 0 100-2h-2v-4a1 1 0 10-2 0v4h-2a1 1 0 100 2h2z" clipRule="evenodd"></path></svg>
            }>
              Security
            </TabButton>
            <TabButton isActive={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M11.49 3.17c-.38-.76-1.54-.76-1.92 0l-1.5 3a1 1 0 00-.95.69l-3 1.5a1 1 0 00-.69.95l1.5 3a1 1 0 00.69.95l3 1.5c.38.19.76-.19 1.14-.19l1.5 3c.38.76 1.54.76 1.92 0l1.5-3a1 1 0 00.95-.69l3-1.5c.38-.19.76-.57.38-.76l-1.5-3a1 1 0 00-.69-.95l-3-1.5a1 1 0 00-.95-.69z" clipRule="evenodd"></path></svg>
            }>
              Settings
            </TabButton>
          </nav>
        </div>
        <div>
          {activeTab === 'account' && <AccountTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'settings' && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;