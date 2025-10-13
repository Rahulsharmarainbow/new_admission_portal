import React from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import TransportationSettingsTable from './components/TransportationSettingsTable';
import { useAuth } from 'src/hook/useAuth';

const TransportationSettingsList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title="Transportation Settings"
        paths={[{ name: "Transportation Settings", link: "/" + user?.role + "/transportation-settings" }]}
      />
      <TransportationSettingsTable />
    </div>
  );
};

export default TransportationSettingsList;