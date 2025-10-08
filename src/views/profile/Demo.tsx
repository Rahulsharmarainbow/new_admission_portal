import React from 'react';

// Define TypeScript interfaces
interface Application {
  id: number;
  organizationName: string;
  primaryEmail: string;
  organizationType: string;
  accountType: 'demo' | 'live';
}

const Demo: React.FC = () => {
  // Sample data - you can replace this with your actual data
  const accountData = {
    totalAccounts: 15,
    totalDemoAccounts: 3,
    totalLiveAccounts: 12
  };

  const applications: Application[] = [
    {
      id: 1,
      organizationName: 'Jawaharlal Nehru Architecture and Fine Arts University',
      primaryEmail: 'gopalah022@gmail.com',
      organizationType: 'university',
      accountType: 'live'
    },
    {
      id: 2,
      organizationName: 'Vinayak Public Higher Secondary School Guran',
      primaryEmail: 'gopalah98598@gmail.com',
      organizationType: 'school',
      accountType: 'live'
    },
    {
      id: 3,
      organizationName: 'Dr Apj Abdul Kalam University College of Engineering Indore',
      primaryEmail: 'rainbowcroprise@gmail.com',
      organizationType: 'college',
      accountType: 'demo'
    },
    {
      id: 4,
      organizationName: 'Jawahar International School Jawahar International School',
      primaryEmail: 'gopalah022@gmail.com',
      organizationType: 'school',
      accountType: 'live'
    }
  ];

  // SVG icons for the cards
  const TotalAccountIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M17 6.5h1.5a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H17m0-13.5v13.5m0-13.5H7.5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2H17m-9.5-6h5m-5-4h5"></path>
      <rect x="4.5" y="4.5" width="6" height="4" rx="1" strokeLinecap="round"></rect>
    </svg>
  );

  const DemoAccountIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <path strokeLinecap="round" d="M9 14h3m-2-2V8.2c0-.186 0-.279.012-.356a1 1 0 0 1 .832-.832C10.92 7 11.014 7 11.2 7h2.3a2.5 2.5 0 0 1 0 5zm0 0v5m0-5H9"></path>
    </svg>
  );

  const LiveAccountIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2s7.071 0 8.535 1.464C22 4.93 22 7.286 22 12" opacity="0.5"></path>
      <path d="M2 14c0-2.8 0-4.2.545-5.27A5 5 0 0 1 4.73 6.545C5.8 6 7.2 6 10 6h4c2.8 0 4.2 0 5.27.545a5 5 0 0 1 2.185 2.185C22 9.8 22 11.2 22 14s0 4.2-.545 5.27a5 5 0 0 1-2.185 2.185C18.2 22 16.8 22 14 22h-4c-2.8 0-4.2 0-5.27-.545a5 5 0 0 1-2.185-2.185C2 18.2 2 16.8 2 14Z"></path>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 11v6m0 0l2.5-2.5M12 17l-2.5-2.5"></path>
    </svg>
  );

  // Background pattern component
  const BackgroundPattern = () => (
    <div className="absolute top-0 right-0 w-16 h-20 opacity-10">
      <div className="w-full h-full bg-white rounded-lg"></div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Account Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Account Card */}
        <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
          <BackgroundPattern />
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4 text-white">
                <TotalAccountIcon />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-1">
              {accountData.totalAccounts}
            </h4>
            <span className="text-sm text-white text-opacity-90 font-medium">Total Account</span>
          </div>
        </div>

        {/* Demo Account Card */}
        <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
          <BackgroundPattern />
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4 text-white">
                <DemoAccountIcon />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-1">
              {accountData.totalDemoAccounts}
            </h4>
            <span className="text-sm text-white text-opacity-90 font-medium">Total Demo Account</span>
          </div>
        </div>

        {/* Live Account Card */}
        <div className="bg-[#0085db] rounded-lg shadow-lg p-6 relative overflow-hidden border-0">
          <BackgroundPattern />
          <div className="relative z-10">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-lg bg-white bg-opacity-20 flex items-center justify-center mr-4 text-white">
                <LiveAccountIcon />
              </div>
            </div>
            <h4 className="text-2xl font-bold text-white mb-1">
              {accountData.totalLiveAccounts}
            </h4>
            <span className="text-sm text-white text-opacity-90 font-medium">Total Live Account</span>
          </div>
        </div>
      </div>

      {/* Recently Added Applications Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Recently Added Application</h2>
          <p className="text-sm text-gray-600">Application List across all Academic</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  S. NO
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Primary Email
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization Type
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Type
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applications.map((app, index) => (
                <tr key={app.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {app.organizationName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {app.primaryEmail}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 capitalize">
                      {app.organizationType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      app.accountType === 'live' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {app.accountType}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Validation message */}
      <div className="mt-4 text-center text-sm text-gray-500">
        {accountData.totalAccounts === accountData.totalDemoAccounts + accountData.totalLiveAccounts ? (
          <span className="text-green-600">✓ Account totals are correctly calculated</span>
        ) : (
          <span className="text-red-600">⚠ Account totals don't match: Demo + Live should equal Total</span>
        )}
      </div>
    </div>
  );
};

export default Demo;