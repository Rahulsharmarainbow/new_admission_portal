import React, { useState } from 'react';
import { Tabs, Card } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineTemplate,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
} from 'react-icons/hi';
import { useAuth } from 'src/hook/useAuth';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import CareerFooterSection from './tabs/CareerFooterSection';
import CareerCardSection from './tabs/CareerCardSection';
import CareerJobsSection from './tabs/CareerJobsSection';
import CareerTextSection from './tabs/CareerTextSection';
import CareerStatusManagement from './tabs/CareerStatusManagement';
import CareerDropdown from 'src/Frontend/Common/CareerDropdown';
import TransportationSettingsList from 'src/views/schoolServices/transportationSettings/TransportationSettingsList';

const CareerForm = () => {
  const { user } = useAuth();
  const [selectedAcademic, setSelectedAcademic] = useState(
    user?.role === 'CustomerAdmin' ? user?.academic_id || '' : '',
  );
  const apiUrl = import.meta.env.VITE_API_URL;

  const handleAcademicSelect = (selectedId: string) => {
    setSelectedAcademic(selectedId);
  };

  return (
    <Card>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Career Website Content Management</h2>

          {/* Academic Dropdown (Global for all tabs) */}
          <div className="w-64">
            {user && user?.role !== 'CustomerAdmin' && (
              <CareerDropdown 
                value={selectedAcademic}
                onChange={handleAcademicSelect}
                label="First Select Academic"
                isRequired
              />
            )}
          </div>
        </div>
        
        <Tabs aria-label="Career Content Tabs" variant="underline">
          <Tabs.Item active icon={HiOutlineDocumentText} title="Header & Footer">
            <CareerFooterSection
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineTemplate} title="Card Contain">
            <CareerCardSection 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineBriefcase} title="Jobs">
            <CareerJobsSection 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineNewspaper} title="Status">
            <CareerStatusManagement 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>
          <Tabs.Item icon={HiOutlineNewspaper} title="Settings">
            <TransportationSettingsList 
            />
          </Tabs.Item>
        </Tabs> 
      </div>
    </Card>
  );
};

export default CareerForm;