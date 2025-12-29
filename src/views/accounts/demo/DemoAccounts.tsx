import React from 'react';
import AccountTable from '../components/AccountTable';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';

const DemoAccount: React.FC = () => {
  const { user } = useAuth();
  return (
    <div >
       <BreadcrumbHeader
        title="Demo Accounts"
        paths={[{ name: "Demo Accounts", link: "/" + user?.role + "/demo-accounts" }]}
      />
      <AccountTable type="demo" />
    </div>
  );
};

export default DemoAccount;
