import React from 'react';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import TransportationSettingsTable from './components/TransportationSettingsTable';
import { useAuth } from 'src/hook/useAuth';

const CollegeSettingList: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="p-6">
      <BreadcrumbHeader
        title=" Settings"
        paths={[{ name: " Settings", link: "/" + user?.role + "/transportation-settings" }]}
      />
      <TransportationSettingsTable type="2" />
    </div>
  );
};

export default CollegeSettingList;