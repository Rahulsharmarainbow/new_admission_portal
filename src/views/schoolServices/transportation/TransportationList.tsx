import React from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import TransportationTable from './components/TransportationTable';
import { useAuth } from 'src/hook/useAuth';

const TransportationList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Transportation Management"
        paths={[{ name: "Transportation", link: "/" + user?.role + "/transportation" }]}
      />
      <TransportationTable />
    </div>
  );
};

export default TransportationList;