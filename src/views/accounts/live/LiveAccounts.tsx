import React from 'react';
import AccountTable from '../components/AccountTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';

const LiveAccount: React.FC = () => {
  const { user } = useAuth();

  return (
    <div >
      <BreadcrumbHeader
              title="Live Accounts"
              paths={[{ name: "Live Accounts", link: "/" + user?.role + "/live-accounts" }]}
            />
      {/* <h1 className="text-2xl font-bold text-gray-900 mb-4">Live Accounts</h1> */}
      <AccountTable type="live" />
    </div>
  );
};

export default LiveAccount;
