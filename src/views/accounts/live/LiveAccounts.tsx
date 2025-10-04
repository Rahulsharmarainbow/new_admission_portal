import React from 'react';
import AccountTable from '../components/AccountTable';

const LiveAccount: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Accounts</h1>
      <AccountTable type="live" />
    </div>
  );
};

export default LiveAccount;
