import React, { useEffect, useState } from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from "src/hook/useAuth";
import { MdEmail, MdPerson, MdSettings } from "react-icons/md";
import { HiUserCircle } from 'react-icons/hi';
import AccountTab from './AccountTab';
import SettingsTab from './SettingsTab';

const TabButton = ({ 
  isActive, 
  onClick, 
  children, 
  icon 
}: { 
  isActive: boolean; 
  onClick: () => void; 
  children: React.ReactNode; 
  icon: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 py-3 px-6 text-base font-semibold rounded-full transition-all duration-300 border-2 ${
      isActive
        ? 'bg-[#0ea5e9] text-white border-[#0ea5e9] shadow-lg shadow-blue-200'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800 border-transparent hover:border-gray-200'
    }`}
  >
    {icon}
    <span>{children}</span>
  </button>
);

const AccountProfile = () => {
  const [activeTab, setActiveTab] = useState('account');
  const { user, login } = useAuth();

  useEffect(() => {
    if(user?.role === 'CustomerAdmin' || user?.role === 'SalesAdmin')
    setActiveTab('account');
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <BreadcrumbHeader title="My Profile" paths={[{ name: "Profile", link: "#" }]} />

      <div className="max-w-7xl mx-auto p-4">
        {/* Profile Header */}
        {/* <div className="bg-white rounded-2xl shadow-sm p-6 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1 border-4 border-white">
                <div className="w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {user?.name || "User Name"}
              </h1>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MdEmail className="w-5 h-5 text-gray-500" />
                  <span>{user?.email || "user@example.com"}</span>
                </div>

                <div className="flex items-center gap-2">
                  <MdPerson className="w-5 h-5 text-gray-500" />
                  <span className="capitalize">{user?.role?.toLowerCase() || "user"}</span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Tab Navigation */}
       {(user?.role === "SuperAdmin" || user?.role === "SupportAdmin") && ( <div className="bg-white p-3 rounded-2xl shadow-sm mb-6 border border-gray-100">
          <nav className="flex space-x-2 overflow-x-auto">
            <TabButton
              isActive={activeTab === "account"}
              onClick={() => setActiveTab("account")}
              icon={<HiUserCircle className="w-5 h-5" />}
              
            >
              Account Settings
            </TabButton>

            
              <TabButton
                isActive={activeTab === "settings"}
                onClick={() => setActiveTab("settings")}
                icon={<MdSettings className="w-5 h-5" />}
              >
                Application Settings
              </TabButton>
          </nav>
        </div>
            )}

        {/* Tab Content */}
        <div>
           {activeTab === "account" && <AccountTab />}
         {activeTab === "settings" && <SettingsTab />}
        </div>
      </div>
    </div>
  );
};

export default AccountProfile;