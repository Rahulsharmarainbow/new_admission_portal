

// import React, { useState, ChangeEvent } from 'react';

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

// const AccountTab = () => {
//   const [location, setLocation] = useState('india');
//   const [currency, setCurrency] = useState('india');
//   const [name, setName] = useState('Mathew Anderson');
//   const [storeName, setStoreName] = useState('Maxima Studio');
//   const [email, setEmail] = useState('info@spike.com');
//   const [phone, setPhone] = useState('+91 12345 65478');
//   const [address, setAddress] = useState('814 Howard Street, 120065, India');
//   const [currentPassword, setCurrentPassword] = useState('MathewAnderson');
//   const [newPassword, setNewPassword] = useState('MathewAnderson');
//   const [confirmPassword, setConfirmPassword] = useState('MathewAnderson');

//   const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setLocation(event.target.value);
//   };

//   const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
//     setCurrency(event.target.value);
//   };

//   return (
//     <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Change Profile */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Change Profile
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             Change your profile picture from here
//           </p>
//           <div className="flex flex-col items-center">
//             <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4">
//               <img src="https://placehold.co/128x128/E0E0E0/333333?text=User" alt="user avatar" className="object-cover w-full h-full" />
//             </div>
//             <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
//               <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//                 <label className="cursor-pointer">
//                   Upload
//                   <input type="file" className="hidden" accept="image/*" multiple />
//                 </label>
//               </button>
//               <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//                 Reset
//               </button>
//             </div>
//             <p className="text-sm text-gray-500 mt-4 text-center">
//               Allowed JPG, GIF or PNG. Max size of 800K
//             </p>
//           </div>
//         </Card>
//         {/* Change Password */}
//         <Card>
//           <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//             Change Password
//           </h5>
//           <p className="font-normal text-gray-500 mb-3">
//             To change your password please confirm here
//           </p>
//           <form className="flex flex-col gap-4">
//             <div>
//               <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
//               <input
//                 id="current-password"
//                 type="password"
//                 value={currentPassword}
//                 onChange={(e) => setCurrentPassword(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
//               <input
//                 id="new-password"
//                 type="password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
//               <input
//                 id="confirm-password"
//                 type="password"
//                 value={confirmPassword}
//                 onChange={(e) => setConfirmPassword(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </form>
//         </Card>
//       </div>

//       {/* Edit Details */}
//       <Card>
//         <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//           Personal Details
//         </h5>
//         <p className="font-normal text-gray-500 mb-3">
//           To change your personal detail, edit and save from here
//         </p>
//         <form>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div>
//               <label htmlFor="your-name" className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
//               <input
//                 id="your-name"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="store-name" className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
//               <input
//                 id="store-name"
//                 value={storeName}
//                 onChange={(e) => setStoreName(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
//               <select id="location" value={location} onChange={handleLocationChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                 {locations.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
//               <select id="currency" value={currency} onChange={handleCurrencyChange} className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500" required>
//                 {currencies.map((option) => (
//                   <option key={option.value} value={option.value}>
//                     {option.label}
//                   </option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 id="email"
//                 type="email"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
//               <input
//                 id="phone"
//                 type="tel"
//                 value={phone}
//                 onChange={(e) => setPhone(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div className="md:col-span-2">
//               <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//               <input
//                 id="address"
//                 value={address}
//                 onChange={(e) => setAddress(e.target.value)}
//                 className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
//                 required
//               />
//             </div>
//           </div>
//         </form>
//       </Card>

//       <div className="flex flex-row justify-end gap-2 mt-4">
//         <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//           Save
//         </button>
//         <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// const SecurityTab = () => {
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

//   return (
//     <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//       {/* Two-Factor Authentication */}
//       <Card>
//         <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//           Two-Factor Authentication
//         </h5>
//         <p className="font-normal text-gray-500 mb-3">
//           Secure your account with an extra layer of protection.
//         </p>
//         <div className="flex items-center justify-between">
//           <span className="text-gray-800">Status: {is2faEnabled ? 'Enabled' : 'Disabled'}</span>
//           <button
//             onClick={() => setIs2faEnabled(!is2faEnabled)}
//             className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 ${
//               is2faEnabled
//                 ? 'bg-red-600 hover:bg-red-700 text-white'
//                 : 'bg-green-600 hover:bg-green-700 text-white'
//             }`}
//           >
//             {is2faEnabled ? 'Disable' : 'Enable'}
//           </button>
//         </div>
//       </Card>

//       {/* Recent Devices */}
//       <Card>
//         <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
//           Recent Devices
//         </h5>
//         <p className="font-normal text-gray-500 mb-3">
//           A list of devices that have recently accessed your account.
//         </p>
//         <div className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Device
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Location
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Date
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   IP Address
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {recentDevices.map((device, index) => (
//                 <tr key={index}>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     {device.device}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {device.location}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {device.date}
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                     {device.ip}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </Card>
//     </div>
//   );
// };

// const SettingsTab = () => {
//   const [whatsappApiKey, setWhatsappApiKey] = useState('**********');
//   const [whatsappPassword, setWhatsappPassword] = useState('**********');
//   const [zohoApiKey, setZohoApiKey] = useState('**********');
//   const [bounceAddress, setBounceAddress] = useState('');
//   const [zohoFromEmail, setZohoFromEmail] = useState('noreply@testingscrew.com');
//   const [smsApiKey, setSmsApiKey] = useState('**********');
//   const [smsSecretKey, setSmsSecretKey] = useState('**********');
//   const [razorpayApiKey, setRazorpayApiKey] = useState('**********');
//   const [razorpaySecretKey, setRazorpaySecretKey] = useState('**********');
//   const [collegePlatformFee, setCollegePlatformFee] = useState('60');
//   const [schoolPlatformFee, setSchoolPlatformFee] = useState('60');

//   const inputStyle = "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500";
//   const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

//   return (
//     <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
//       <Card>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* WhatsAPP API Key */}
//           <div>
//             <label htmlFor="whatsapp-api-key" className={labelStyle}>WhatsAPP API Key*</label>
//             <input
//               id="whatsapp-api-key"
//               type="password"
//               value={whatsappApiKey}
//               onChange={(e) => setWhatsappApiKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* WhatsAPP Password */}
//           <div>
//             <label htmlFor="whatsapp-password" className={labelStyle}>WhatsAPP Password*</label>
//             <input
//               id="whatsapp-password"
//               type="password"
//               value={whatsappPassword}
//               onChange={(e) => setWhatsappPassword(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* Zoho API Key */}
//           <div>
//             <label htmlFor="zoho-api-key" className={labelStyle}>Zoho API Key*</label>
//             <input
//               id="zoho-api-key"
//               type="password"
//               value={zohoApiKey}
//               onChange={(e) => setZohoApiKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* Bounce Address */}
//           <div>
//             <label htmlFor="bounce-address" className={labelStyle}>Bounce Address*</label>
//             <input
//               id="bounce-address"
//               type="text"
//               value={bounceAddress}
//               onChange={(e) => setBounceAddress(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* Zoho From Email */}
//           <div>
//             <label htmlFor="zoho-from-email" className={labelStyle}>Zoho From Email*</label>
//             <input
//               id="zoho-from-email"
//               type="email"
//               value={zohoFromEmail}
//               onChange={(e) => setZohoFromEmail(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* SMS API Key */}
//           <div>
//             <label htmlFor="sms-api-key" className={labelStyle}>SMS API Key*</label>
//             <input
//               id="sms-api-key"
//               type="password"
//               value={smsApiKey}
//               onChange={(e) => setSmsApiKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* SMS Secret Key */}
//           <div>
//             <label htmlFor="sms-secret-key" className={labelStyle}>SMS Secret Key*</label>
//             <input
//               id="sms-secret-key"
//               type="password"
//               value={smsSecretKey}
//               onChange={(e) => setSmsSecretKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* Razorpay API Key */}
//           <div>
//             <label htmlFor="razorpay-api-key" className={labelStyle}>Razorpay API Key*</label>
//             <input
//               id="razorpay-api-key"
//               type="password"
//               value={razorpayApiKey}
//               onChange={(e) => setRazorpayApiKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* Razorpay Secret Key */}
//           <div>
//             <label htmlFor="razorpay-secret-key" className={labelStyle}>Razorpay Secret Key*</label>
//             <input
//               id="razorpay-secret-key"
//               type="password"
//               value={razorpaySecretKey}
//               onChange={(e) => setRazorpaySecretKey(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* College Platform Fee */}
//           <div>
//             <label htmlFor="college-fee" className={labelStyle}>College Platform Fee*</label>
//             <input
//               id="college-fee"
//               type="number"
//               value={collegePlatformFee}
//               onChange={(e) => setCollegePlatformFee(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//           {/* School Platform Fee */}
//           <div>
//             <label htmlFor="school-fee" className={labelStyle}>School Platform Fee*</label>
//             <input
//               id="school-fee"
//               type="number"
//               value={schoolPlatformFee}
//               onChange={(e) => setSchoolPlatformFee(e.target.value)}
//               className={inputStyle}
//               required
//             />
//           </div>
//         </div>
//       </Card>
//       <div className="flex flex-row justify-end gap-2 mt-4">
//         <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
//           Save Settings
//         </button>
//       </div>
//     </div>
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

// Types
interface ProfileData {
  id: number;
  name: string;
  email: string;
  number: string;
  d_password: string;
  academic_id: string | null;
  two_step_auth: number;
  profile: string;
}

interface UserRole {
  value: string;
  label: string;
  apiPath: string;
}

// User roles configuration
const userRoles: UserRole[] = [
  { value: 'superadmin', label: 'Super Admin', apiPath: 'superadmin' },
  { value: 'supportadmin', label: 'Support Admin', apiPath: 'supportadmin' },
  { value: 'customeradmin', label: 'Customer Admin', apiPath: 'customeradmin' },
  { value: 'salesadmin', label: 'Sales Admin', apiPath: 'salesadmin' },
];

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

// API Configuration
const API_CONFIG = {
  BASE_URL: 'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api',
  getProfileUrl: (role: string) => {
    const roleConfig = userRoles.find(r => r.value === role);
    const path = roleConfig?.apiPath || 'superadmin';
    return `${API_CONFIG.BASE_URL}/${path.charAt(0).toUpperCase() + path.slice(1)}/Profile/get-profile`;
  },
  updateProfileUrl: (role: string) => {
    const roleConfig = userRoles.find(r => r.value === role);
    const path = roleConfig?.apiPath || 'superadmin';
    return `${API_CONFIG.BASE_URL}/${path.charAt(0).toUpperCase() + path.slice(1)}/Profile/update-profile`;
  }
};

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

// API Service functions
const apiService = {
  async getProfile(userRole: string, userId: number, token: string): Promise<ProfileData> {
    const response = await fetch(API_CONFIG.getProfileUrl(userRole), {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ s_id: userId })
    });

    if (!response.ok) {
      throw new Error('Failed to fetch profile');
    }

    const data = await response.json();
    
    if (!data.status) {
      throw new Error('Failed to fetch profile data');
    }

    return data.profile;
  },

  async updateProfile(userRole: string, profileData: any, token: string): Promise<any> {
    const response = await fetch(API_CONFIG.updateProfileUrl(userRole), {
      method: 'POST',
      headers: {
        'accept': '*/*',
        'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
        'content-type': 'application/json',
        'authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(profileData)
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    const data = await response.json();
    return data;
  }
};

// Demo API integration function (replace with actual implementation)
const useProfileAPI = (userRole: string, userId: number) => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This token should come from your auth context or localStorage
  const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ';

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, using mock data. Replace with actual API call:
      // const profileData = await apiService.getProfile(userRole, userId, token);
      
      // Mock data - replace this with actual API call
      const mockProfile: ProfileData = {
        id: userId,
        name: "Mayank Superadmin",
        email: "gopalsh022@gmail.com",
        number: "7440498598",
        d_password: "Gopal@123",
        academic_id: null,
        two_step_auth: 1,
        profile: "admin/profile/superadmin_1756471922.jpeg"
      };
      
      setProfile(mockProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: any): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      // For demo purposes, using mock update. Replace with actual API call:
      // const result = await apiService.updateProfile(userRole, profileData, token);
      
      // Mock update - replace this with actual API call
      console.log('Updating profile:', profileData);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      if (profile) {
        setProfile({ ...profile, ...profileData });
      }
      
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [userRole, userId]);

  return { profile, loading, error, fetchProfile, updateProfile };
};

interface AccountTabProps {
  userRole: string;
  userId: number;
}

const AccountTab = ({ userRole, userId }: AccountTabProps) => {
  const { profile, loading, error, updateProfile } = useProfileAPI(userRole, userId);
  
  const [location, setLocation] = useState('india');
  const [currency, setCurrency] = useState('india');
  const [name, setName] = useState('');
  const [storeName, setStoreName] = useState('Maxima Studio');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('814 Howard Street, 120065, India');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.number);
      setCurrentPassword(profile.d_password);
    }
  }, [profile]);

  const handleLocationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setLocation(event.target.value);
  };

  const handleCurrencyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCurrency(event.target.value);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updateData = {
        s_id: userId,
        name: name,
        email: email,
        number: phone,
        // Add other fields as needed by your API
      };

      const success = await updateProfile(updateData);
      if (success) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      alert('Error updating profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhone(profile.number);
    }
  };

  if (loading && !profile) {
    return <div className="text-center py-8">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
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
                src={profile?.profile ? `https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/${profile.profile}` : "https://placehold.co/128x128/E0E0E0/333333?text=User"} 
                alt="user avatar" 
                className="object-cover w-full h-full" 
              />
            </div>
            <div className="flex flex-col md:flex-row justify-center gap-2 mt-4">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200">
                <label className="cursor-pointer">
                  Upload
                  <input type="file" className="hidden" accept="image/*" multiple />
                </label>
              </button>
              <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200">
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
                required
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
                required
              />
            </div>
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
          onClick={handleSave}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button 
          onClick={handleCancel}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-lg transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const SecurityTab = ({ userRole, userId }: AccountTabProps) => {
  const { profile, loading, error, updateProfile } = useProfileAPI(userRole, userId);
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Initialize 2FA status from profile
  useEffect(() => {
    if (profile) {
      setIs2faEnabled(profile.two_step_auth === 1);
    }
  }, [profile]);

  const handle2faToggle = async () => {
    setIsUpdating(true);
    try {
      const new2faStatus = !is2faEnabled;
      const updateData = {
        s_id: userId,
        two_step_auth: new2faStatus ? 1 : 0
      };

      const success = await updateProfile(updateData);
      if (success) {
        setIs2faEnabled(new2faStatus);
        alert(`Two-factor authentication ${new2faStatus ? 'enabled' : 'disabled'} successfully!`);
      } else {
        alert('Failed to update two-factor authentication');
      }
    } catch (error) {
      alert('Error updating two-factor authentication');
    } finally {
      setIsUpdating(false);
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

  if (loading && !profile) {
    return <div className="text-center py-8">Loading security settings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
      {/* Two-Factor Authentication */}
      <Card>
        <h5 className="text-xl font-bold tracking-tight text-gray-900 mb-1">
          Two-Factor Authentication
        </h5>
        <p className="font-normal text-gray-500 mb-3">
          Secure your account with an extra layer of protection.
        </p>
        <div className="flex items-center justify-between">
          <span className="text-gray-800">Status: {is2faEnabled ? 'Enabled' : 'Disabled'}</span>
          <button
            onClick={handle2faToggle}
            disabled={isUpdating}
            className={`font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 ${
              is2faEnabled
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            {isUpdating ? 'Updating...' : (is2faEnabled ? 'Disable' : 'Enable')}
          </button>
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
  );
};

const SettingsTab = ({ userRole, userId }: AccountTabProps) => {
  const { profile, loading, error } = useProfileAPI(userRole, userId);
  
  const [whatsappApiKey, setWhatsappApiKey] = useState('**********');
  const [whatsappPassword, setWhatsappPassword] = useState('**********');
  const [zohoApiKey, setZohoApiKey] = useState('**********');
  const [bounceAddress, setBounceAddress] = useState('');
  const [zohoFromEmail, setZohoFromEmail] = useState('noreply@testingscrew.com');
  const [smsApiKey, setSmsApiKey] = useState('**********');
  const [smsSecretKey, setSmsSecretKey] = useState('**********');
  const [razorpayApiKey, setRazorpayApiKey] = useState('**********');
  const [razorpaySecretKey, setRazorpaySecretKey] = useState('**********');
  const [collegePlatformFee, setCollegePlatformFee] = useState('60');
  const [schoolPlatformFee, setSchoolPlatformFee] = useState('60');
  const [isSaving, setIsSaving] = useState(false);

  const inputStyle = "block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500";
  const labelStyle = "block text-sm font-medium text-gray-700 mb-1";

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call for settings
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading && !profile) {
    return <div className="text-center py-8">Loading settings...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-6 p-4 md:p-6 lg:p-8 font-sans">
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* WhatsAPP API Key */}
          <div>
            <label htmlFor="whatsapp-api-key" className={labelStyle}>WhatsAPP API Key*</label>
            <input
              id="whatsapp-api-key"
              type="password"
              value={whatsappApiKey}
              onChange={(e) => setWhatsappApiKey(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
          {/* WhatsAPP Password */}
          <div>
            <label htmlFor="whatsapp-password" className={labelStyle}>WhatsAPP Password*</label>
            <input
              id="whatsapp-password"
              type="password"
              value={whatsappPassword}
              onChange={(e) => setWhatsappPassword(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
          {/* Zoho API Key */}
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
          {/* Bounce Address */}
          <div>
            <label htmlFor="bounce-address" className={labelStyle}>Bounce Address*</label>
            <input
              id="bounce-address"
              type="text"
              value={bounceAddress}
              onChange={(e) => setBounceAddress(e.target.value)}
              className={inputStyle}
              required
            />
          </div>
          {/* Zoho From Email */}
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
          {/* SMS API Key */}
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
          {/* SMS Secret Key */}
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
          {/* Razorpay API Key */}
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
          {/* Razorpay Secret Key */}
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
          {/* College Platform Fee */}
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
          {/* School Platform Fee */}
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
        </div>
      </Card>
      <div className="flex flex-row justify-end gap-2 mt-4">
        <button 
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

const AccountProfile = () => {
  const [activeTab, setActiveTab] = useState('account');
  
  // These values should come from your authentication context
  const [currentUserRole, setCurrentUserRole] = useState('superadmin'); // Change this based on logged-in user
  const [currentUserId, setCurrentUserId] = useState(6); // Change this based on logged-in user

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
          {activeTab === 'account' && <AccountTab userRole={currentUserRole} userId={currentUserId} />}
          {activeTab === 'security' && <SecurityTab userRole={currentUserRole} userId={currentUserId} />}
          {activeTab === 'settings' && <SettingsTab userRole={currentUserRole} userId={currentUserId} />}
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;