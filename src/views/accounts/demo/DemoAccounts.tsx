import React from 'react';
import AccountTable from '../components/AccountTable';

const DemoAccount: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Demo Accounts</h1>
      <AccountTable type="demo" />
    </div>
  );
};

export default DemoAccount;
