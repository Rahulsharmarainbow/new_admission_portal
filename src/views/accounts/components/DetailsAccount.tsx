"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { Button, Card, Spinner, Alert } from "flowbite-react";
import { 
  MdPhone, 
  MdEmail, 
  MdLanguage, 
  MdCheckCircle,
  MdPerson,
  MdAttachMoney,
  MdContactSupport
} from "react-icons/md";
import { 
  FaFileAlt,
  FaMoneyBillWave,
  FaExchangeAlt
} from "react-icons/fa";
import axios from "axios";
import toast from "react-hot-toast";
import profilebg from "src/assets/images/backgrounds/profilebg-2.jpg"
import Loader from "src/Frontend/Common/Loader";
import { useAuth } from "src/hook/useAuth";
import BreadcrumbHeader from "src/Frontend/Common/BreadcrumbHeader";

// Types
interface Contact {
  name: string;
  email: string;
  phone: string;
}

interface DashboardData {
  institution_id: number;
  academic_name: string;
  unique_code: string;
  academic_address: string;
  academic_type: number;
  academic_subtype: null | string;
  academic_logo: string;
  academic_email: string;
  academic_mobile: string;
  state_id: null | number;
  district_id: null | string;
  academic_pincode: null | string;
  academic_landmark: string;
  academic_description: string;
  academic_website: string;
  technical_contact: Contact[];
  billing_contact: Contact[];
  additional_contact: Contact[];
  admin_name: string;
  admin_email: string;
  admin_phone: string;
  admin_address: string;
  status: number;
  total_transaction_amount: string;
  total_transactions: number;
  total_applications: number;
}

interface ApiResponse {
  status: string;
  data: DashboardData;
}

const CollegeDashboard = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'contact'>('profile');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;

  useEffect(() => {
    if (id && user) {
      fetchDashboardData();
    }
  }, [id, user]);

  const fetchDashboardData = async () => {
    if (!id || !user) {
      setError('Missing required parameters');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<ApiResponse>(
        `${apiUrl}/${user.role}/Accounts/Get-AcademicInformation`,
        {
          s_id: user.id.toString(), // Dynamic user ID
          year: new Date().getFullYear().toString(), // Current year
          academic_id: id // Dynamic academic ID from URL params
        },
        {
          headers: {
            'accept': '*/*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.token}` // Dynamic token
          }
        }
      );

      if (response.data.status === "success") {
        setDashboardData(response.data.data);
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      const errorMessage = err.response?.data?.message || 'Failed to load dashboard data. Please try again later.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get account type label
  const getAccountTypeLabel = (type: number): string => {
    switch (type) {
      case 1: return 'School';
      case 2: return 'College';
      case 3: return 'University';
      default: return 'Institution';
    }
  };

  // Get status label and color
  const getStatusInfo = (status: number) => {
    return {
      label: status === 1 ? 'Active' : 'Inactive',
      color: status === 1 ? 'green' : 'red',
      bgColor: status === 1 ? 'bg-green-100' : 'bg-red-100',
      textColor: status === 1 ? 'text-green-800' : 'text-red-800'
    };
  };

  // Loading state
  if (loading && !dashboardData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <Alert color="failure" className="mb-4 max-w-md">
          {error}
        </Alert>
        <Button onClick={fetchDashboardData} className="flex items-center gap-2">
          Retry
        </Button>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-gray-600">No data available</p>
        <Button onClick={fetchDashboardData} className="mt-4">
          Load Data
        </Button>
      </div>
    );
  }

  const techContact = dashboardData.technical_contact?.[0] || {};
  const billingContact = dashboardData.billing_contact?.[0] || {};
  const additionalContact = dashboardData.additional_contact?.[0] || {};
  const statusInfo = getStatusInfo(dashboardData.status);

  return (
    // <div className="min-h-screen bg-gray-50">

    //   {/* Breadcrumb Header */}
    //           <BreadcrumbHeader
    //             title={'Account Details'}
    //             paths={[
    //               { name: 'Accounts', link: `/${user?.role}/demo-accounts` },
    //               { name: 'Account Details', link: '#' },
    //             ]}
    //           />

    //   {/* Cover Photo Section */}
    //   <div 
    //     className="w-full h-64 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"
    //     style={{
    //       backgroundImage: `url(${profilebg})`,
    //     }}
    //   />

    //   {/* Main Content Container */}
    //   <div className="max-w-7xl mx-auto p-5 sm:px-6 -mt-16 relative z-10">
    //     <Card className="border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
          
    //       {/* Header Section - Logo + College Info */}
    //       <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-200">
    //         {/* Logo */}
    //         <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
    //           {dashboardData.academic_logo ? (
    //             <img 
    //               src={`${assetUrl}${dashboardData.academic_logo}`} 
    //               alt={`${dashboardData.academic_name} logo`}
    //               className="w-full h-full object-cover"
    //               onError={(e) => {
    //                 const target = e.target as HTMLImageElement;
    //                 target.style.display = 'none';
    //               }}
    //             />
    //           ) : (
    //             <span className="text-white font-bold text-xl">
    //               {dashboardData.academic_name.charAt(0).toUpperCase()}
    //             </span>
    //           )}
    //         </div>
            
    //         {/* College Info */}
    //         <div className="flex-1 text-center sm:text-left">
    //           <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
    //             {dashboardData.academic_name}
    //           </h1>
    //           <p className="text-lg text-gray-600 mb-2">
    //             {getAccountTypeLabel(dashboardData.academic_type)}
    //           </p>
    //           <div className={`inline-flex items-center ${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1 rounded-full`}>
    //             <MdCheckCircle className="w-4 h-4 mr-1" />
    //             <span className="text-sm font-medium">{statusInfo.label}</span>
    //           </div>
    //         </div>
    //       </div>

    //       {/* Horizontal Tabs */}
    //       <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
    //         <button
    //           onClick={() => setActiveTab('profile')}
    //           className={`px-4 sm:px-6 py-3 font-medium text-base sm:text-lg border-b-2 transition-colors whitespace-nowrap ${
    //             activeTab === 'profile' 
    //               ? 'border-purple-600 text-purple-600 bg-purple-50' 
    //               : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    //           }`}
    //         >
    //           My Profile
    //         </button>
    //         <button
    //           onClick={() => setActiveTab('contact')}
    //           className={`px-4 sm:px-6 py-3 font-medium text-base sm:text-lg border-b-2 transition-colors whitespace-nowrap ${
    //             activeTab === 'contact' 
    //               ? 'border-purple-600 text-purple-600 bg-purple-50' 
    //               : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    //           }`}
    //         >
    //           Contact Information
    //         </button>
    //       </div>

    //       {/* Main Content Area */}
    //       <div className="flex flex-col">
    //         {/* My Profile Tab Content */}
    //         {activeTab === 'profile' && (
    //           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
    //             {/* Left Column - About me */}
    //             <div>
    //               <h2 className="text-2xl font-bold text-gray-800 mb-6">
    //                 About me
    //               </h2>
                  
    //               {/* Contact Section */}
    //               <div className="mb-8">
    //                 <h3 className="text-xl font-semibold text-gray-700 mb-4">
    //                   Contact
    //                 </h3>
    //                 <div className="space-y-4">
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPhone className="w-5 h-5 text-blue-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Phone</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {dashboardData.academic_mobile || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdEmail className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Email</p>
    //                       <p className="text-lg font-semibold text-gray-800 break-all">
    //                         {dashboardData.academic_email || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdLanguage className="w-5 h-5 text-purple-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Website</p>
    //                       {dashboardData.academic_website ? (
    //                         <a
    //                           href={dashboardData.academic_website}
    //                           target="_blank"
    //                           rel="noopener noreferrer"
    //                           className="text-purple-600 hover:text-purple-800 font-semibold text-lg break-all"
    //                         >
    //                           {dashboardData.academic_website}
    //                         </a>
    //                       ) : (
    //                         <p className="text-lg font-semibold text-gray-800">N/A</p>
    //                       )}
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>

    //               {/* Address Section */}
    //               {dashboardData.academic_address && (
    //                 <div>
    //                   <h3 className="text-xl font-semibold text-gray-700 mb-4">
    //                     Address
    //                   </h3>
    //                   <p className="text-gray-700">
    //                     {dashboardData.academic_address}
    //                   </p>
    //                 </div>
    //               )}
    //             </div>

    //             {/* Right Column - Statistics */}
    //             <div>
    //               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    //                 {/* Total Application */}
    //                 <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <FaFileAlt className="w-5 h-5 text-blue-600" />
    //                     <h3 className="text-lg font-semibold text-gray-800">Total Applications</h3>
    //                   </div>
    //                   <p className="text-2xl font-bold text-gray-800">
    //                     {dashboardData.total_applications || '0'}
    //                   </p>
    //                 </div>

    //                 {/* Total Payment */}
    //                 <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <FaMoneyBillWave className="w-5 h-5 text-green-600" />
    //                     <h3 className="text-lg font-semibold text-gray-800">Total Payment</h3>
    //                   </div>
    //                   <p className="text-2xl font-bold text-gray-800">
    //                     {dashboardData.total_transaction_amount 
    //                       ? `₹${dashboardData.total_transaction_amount}` 
    //                       : '₹0'
    //                     }
    //                   </p>
    //                 </div>

    //                 {/* Total Transaction */}
    //                 <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
    //                   <div className="flex items-center gap-2 mb-2">
    //                     <FaExchangeAlt className="w-5 h-5 text-purple-600" />
    //                     <h3 className="text-lg font-semibold text-gray-800">Total Transactions</h3>
    //                   </div>
    //                   <p className="text-2xl font-bold text-gray-800">
    //                     {dashboardData.total_transactions || '0'}
    //                   </p>
    //                 </div>

                  
    //               </div>
    //             </div>
    //           </div>
    //         )}

    //         {/* Contact Information Tab Content */}
    //         {activeTab === 'contact' && (
    //           <div>
    //             <h2 className="text-2xl font-bold text-gray-800 mb-8">
    //               Contact Information
    //             </h2>
                
    //             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //               {/* Technical Contact */}
    //               <div className="p-6 rounded-2xl border border-gray-200 bg-white">
    //                 <div className="flex items-center justify-center gap-2 mb-6">
    //                   <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
    //                     <MdPerson className="w-6 h-6 text-blue-600" />
    //                   </div>
    //                   <h3 className="text-xl font-bold text-gray-800">Technical Contact</h3>
    //                 </div>
    //                 <div className="space-y-4">
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPerson className="w-5 h-5 text-blue-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Name</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {techContact.name || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdEmail className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Email</p>
    //                       <p className="text-lg font-semibold text-gray-800 break-all">
    //                         {techContact.email || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPhone className="w-5 h-5 text-blue-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Phone</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {techContact.phone || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
                  
    //               {/* Billing Contact */}
    //               <div className="p-6 rounded-2xl border border-gray-200 bg-white">
    //                 <div className="flex items-center justify-center gap-2 mb-6">
    //                   <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
    //                     <MdAttachMoney className="w-6 h-6 text-purple-600" />
    //                   </div>
    //                   <h3 className="text-xl font-bold text-gray-800">Billing Contact</h3>
    //                 </div>
    //                 <div className="space-y-4">
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPerson className="w-5 h-5 text-purple-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Name</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {billingContact.name || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdEmail className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Email</p>
    //                       <p className="text-lg font-semibold text-gray-800 break-all">
    //                         {billingContact.email || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPhone className="w-5 h-5 text-purple-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Phone</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {billingContact.phone || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
                  
    //               {/* Additional Contact */}
    //               <div className="p-6 rounded-2xl border border-gray-200 bg-white">
    //                 <div className="flex items-center justify-center gap-2 mb-6">
    //                   <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
    //                     <MdContactSupport className="w-6 h-6 text-green-600" />
    //                   </div>
    //                   <h3 className="text-xl font-bold text-gray-800">Additional Contact</h3>
    //                 </div>
    //                 <div className="space-y-4">
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPerson className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Name</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {additionalContact.name || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdEmail className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Email</p>
    //                       <p className="text-lg font-semibold text-gray-800 break-all">
    //                         {additionalContact.email || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                   <div className="flex items-center gap-4">
    //                     <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
    //                       <MdPhone className="w-5 h-5 text-green-600" />
    //                     </div>
    //                     <div>
    //                       <p className="text-sm text-gray-500">Phone</p>
    //                       <p className="text-lg font-semibold text-gray-800">
    //                         {additionalContact.phone || 'N/A'}
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </div>
    //               </div>
    //             </div>
    //           </div>
    //         )}
    //       </div>
    //     </Card>
    //   </div>
    // </div>
    <div className="min-h-screen bg-gray-50">

  {/* Breadcrumb Header */}
  <BreadcrumbHeader
    title={'Account Details'}
    paths={[
      { name: 'Accounts', link: `/${user?.role}/demo-accounts` },
      { name: 'Account Details', link: '#' },
    ]}
  />

  {/* Cover Photo Section */}
  <div 
    className="w-full h-64 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"
    style={{
      backgroundImage: `url(${profilebg})`,
    }}
  />

  {/* Main Content Container */}
  <div className="max-w-7xl mx-auto p-5 sm:px-6 -mt-16 relative z-10">
    <Card className="border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-xl">
      
      {/* Header Section - Logo + College Info */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-gray-200">
        {/* Logo */}
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
          {dashboardData.academic_logo ? (
            <img 
              src={`${assetUrl}${dashboardData.academic_logo}`} 
              alt={`${dashboardData.academic_name} logo`}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-white font-bold text-xl">
              {dashboardData.academic_name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        {/* College Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
            {dashboardData.academic_name}
          </h1>
          <p className="text-base text-gray-600 mb-2">
            {getAccountTypeLabel(dashboardData.academic_type)}
          </p>
          <div className={`inline-flex items-center ${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1 rounded-full`}>
            <MdCheckCircle className="w-4 h-4 mr-1" />
            <span className="text-sm font-medium">{statusInfo.label}</span>
          </div>
        </div>
      </div>

      {/* Horizontal Tabs */}
      <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'profile' 
              ? 'border-purple-600 text-purple-600 bg-purple-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          My Profile
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-4 sm:px-6 py-3 font-medium text-sm sm:text-base border-b-2 transition-colors whitespace-nowrap ${
            activeTab === 'contact' 
              ? 'border-purple-600 text-purple-600 bg-purple-50' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
          }`}
        >
          Contact Information
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col">
        {/* My Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Left Column - About me */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-6">
                About me
              </h2>
              
              {/* Contact Section */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Contact
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPhone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-800">
                        {dashboardData.academic_mobile || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdEmail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-800 break-all">
                        {dashboardData.academic_email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdLanguage className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Website</p>
                      {dashboardData.academic_website ? (
                        <a
                          href={dashboardData.academic_website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-purple-600 hover:text-purple-800 font-semibold text-base break-all"
                        >
                          {dashboardData.academic_website}
                        </a>
                      ) : (
                        <p className="text-base font-semibold text-gray-800">N/A</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              {dashboardData.academic_address && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-4">
                    Address
                  </h3>
                  <p className="text-gray-700 text-sm">
                    {dashboardData.academic_address}
                  </p>
                </div>
              )}
            </div>

            {/* Right Column - Statistics */}
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Application */}
                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FaFileAlt className="w-5 h-5 text-blue-600" />
                    <h3 className="text-base font-semibold text-gray-800">Total Applications</h3>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {dashboardData.total_applications || '0'}
                  </p>
                </div>

                {/* Total Payment */}
                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                    <h3 className="text-base font-semibold text-gray-800">Total Payment</h3>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {dashboardData.total_transaction_amount 
                      ? `₹${dashboardData.total_transaction_amount}` 
                      : '₹0'
                    }
                  </p>
                </div>

                {/* Total Transaction */}
                <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <FaExchangeAlt className="w-5 h-5 text-purple-600" />
                    <h3 className="text-base font-semibold text-gray-800">Total Transactions</h3>
                  </div>
                  <p className="text-xl font-bold text-gray-800">
                    {dashboardData.total_transactions || '0'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Information Tab Content */}
        {activeTab === 'contact' && (
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-8">
              Contact Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Technical Contact */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <MdPerson className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Technical Contact</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPerson className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-semibold text-gray-800">
                        {techContact.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdEmail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-800 break-all">
                        {techContact.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPhone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-800">
                        {techContact.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Billing Contact */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <MdAttachMoney className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Billing Contact</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPerson className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-semibold text-gray-800">
                        {billingContact.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdEmail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-800 break-all">
                        {billingContact.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPhone className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-800">
                        {billingContact.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Additional Contact */}
              <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <MdContactSupport className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800">Additional Contact</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPerson className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="text-base font-semibold text-gray-800">
                        {additionalContact.name || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdEmail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="text-base font-semibold text-gray-800 break-all">
                        {additionalContact.email || 'N/A'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <MdPhone className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone</p>
                      <p className="text-base font-semibold text-gray-800">
                        {additionalContact.phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  </div>
</div>
  );
};

export default CollegeDashboard;