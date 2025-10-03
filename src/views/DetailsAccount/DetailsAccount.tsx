"use client";
import React, { useState, useEffect } from "react";
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
  const [activeTab, setActiveTab] = useState<'profile' | 'contact'>('profile');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Vite me environment variables import.meta.env se access karte hain
  const apiUrl = import.meta.env.VITE_API_URL || "https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/api";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post<ApiResponse>(
        `${apiUrl}/SuperAdmin/Accounts/Get-AcademicInformation`,
        {
          s_id: "6",
          year: "2025",
          academic_id: "61"
        },
        {
          headers: {
            'accept': '*/*',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JhaW5ib3dzb2x1dGlvbmFuZHRlY2hub2xvZ3kuY29tL05ld0FkbWlzc2lvblBvcnRhbC9wdWJsaWMvYXBpL2F1dGgvdmVyaWZ5LW90cCIsImlhdCI6MTc1OTMwNjA1NywiZXhwIjoxNzYxODk4MDU3LCJuYmYiOjE3NTkzMDYwNTcsImp0aSI6IlRyUmhvcHdvYkJFNHBleHUiLCJzdWIiOiI0MzQiLCJlbWFpbCI6InNoYWFubXNrNEBnbWFpbC5jb20iLCJsb2dpbl90eXBlIjoxLCJyb2xlIjoiU1VQRVJBRE1JTiJ9.uU1-gvBhIrbSrnJ-2rvsBmRuGzpyE4DiazagpC61sZQ'
          }
        }
      );

      if (response.data.status === "success") {
        setDashboardData(response.data.data);
        toast.success('Data loaded successfully');
      } else {
        throw new Error('API returned unsuccessful status');
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
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
        <Alert color="failure" className="mb-4">
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
        <p className="text-xl">No data available</p>
      </div>
    );
  }

  const techContact = dashboardData.technical_contact?.[0] || {};
  const billingContact = dashboardData.billing_contact?.[0] || {};
  const additionalContact = dashboardData.additional_contact?.[0] || {};

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Photo Section */}
      <div 
        className="w-full h-64 bg-cover bg-center bg-no-repeat rounded-lg shadow-lg"
        style={{
          backgroundImage: `url(${profilebg})`,
        }}
      >
        {/* Dark overlay for better text readability */}
        {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}
        
        {/* College Name on Cover
        <div className="absolute bottom-6 left-6 text-white z-10">
          <h1 className="text-4xl font-bold mb-2">Demo College Hyderabad</h1>
          <p className="text-xl opacity-90">Empowering Education, Building Futures</p>
        </div>*/}
      </div> 

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-6 -mt-16 relative z-10">
        <Card className="border border-gray-200 rounded-2xl p-8 shadow-xl">
          
          {/* Header Section - Logo + College Info */}
          <div className="flex items-center gap-6 mb-6 pb-6 border-b border-gray-200">
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
              <span className="text-white font-bold text-xl">DCH</span>
            </div>
            
            {/* College Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Demo College Hyderabad
              </h1>
              <p className="text-lg text-gray-600 mb-2">College</p>
              <div className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full">
                <MdCheckCircle className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Horizontal Tabs - Logo ke niche */}
          <div className="flex mb-8 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
                activeTab === 'profile' 
                  ? 'border-purple-600 text-purple-600 bg-purple-50' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              My Profile
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors ${
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
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    About me
                  </h2>
                  
                  {/* Contact Section */}
                  <div className="mb-8">
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      Contact
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPhone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Call</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {dashboardData.academic_mobile || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdEmail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {dashboardData.academic_email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {/* Website - Now in same style as Call and Email */}
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <MdLanguage className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Website</p>
                          {dashboardData.academic_website ? (
                            <a
                              href={dashboardData.academic_website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-purple-600 hover:text-purple-800 font-semibold text-lg"
                            >
                              Click here
                            </a>
                          ) : (
                            <p className="text-lg font-semibold text-gray-800">N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column - Statistics */}
                <div>
                  {/* <h2 className="text-2xl font-bold text-gray-800 mb-6">
                    Statistics
                  </h2> */}
                  
                  {/* 2x2 Grid with smaller cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Total Application */}
                    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <FaFileAlt className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Total Application</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {dashboardData.total_applications || '0'}
                      </p>
                    </div>

                    {/* Total Payment */}
                    <div className="p-4 rounded-xl bg-white border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-2 mb-2">
                        <FaMoneyBillWave className="w-5 h-5 text-green-600" />
                        <h3 className="text-lg font-semibold text-gray-800">Total Payment</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
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
                        <h3 className="text-lg font-semibold text-gray-800">Total Transaction</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-800">
                        {dashboardData.total_transactions || '0'}
                      </p>
                    </div>

                    {/* Empty slot for 2x2 grid */}
                    {/* <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 border-dashed">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-5 h-5 bg-gray-300 rounded-full"></div>
                        <h3 className="text-lg font-semibold text-gray-500">Additional Info</h3>
                      </div>
                      <p className="text-2xl font-bold text-gray-400">
                        -
                      </p>
                    </div> */}
                  </div>
                </div>
              </div>
            )}

            {/* Contact Information Tab Content */}
            {activeTab === 'contact' && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  Contact Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Technical Contact */}
                  <div className="p-6 rounded-2xl border border-gray-200 bg-white">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <MdPerson className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-800">Technical Contact</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPerson className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {techContact.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdEmail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {techContact.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <MdPhone className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-lg font-semibold text-gray-800">
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
                      <h3 className="text-xl font-bold text-gray-800">Billing Contact</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <MdPerson className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {billingContact.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdEmail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {billingContact.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <MdPhone className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-lg font-semibold text-gray-800">
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
                      <h3 className="text-xl font-bold text-gray-800">Additional Contact</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdPerson className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Name</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {additionalContact.name || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdEmail className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="text-lg font-semibold text-gray-800">
                            {additionalContact.email || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <MdPhone className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p className="text-lg font-semibold text-gray-800">
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




































