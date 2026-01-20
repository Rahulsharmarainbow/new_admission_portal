import React, { useState, useEffect } from 'react';
import { Tabs, Card } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineTemplate,
  HiOutlineBriefcase,
  HiOutlineNewspaper,
} from 'react-icons/hi';
import { useAuth } from 'src/hook/useAuth';
import CareerFooterSection from './tabs/CareerFooterSection';
import CareerCardSection from './tabs/CareerCardSection';
import CareerJobsSection from './tabs/CareerJobsSection';
import CareerStatusManagement from './tabs/CareerStatusManagement';
import CareerDropdown from 'src/Frontend/Common/CareerDropdown';
import TransportationSettingsTab from './tabs/TransportationSettingsTable';
import { useLocation } from 'react-router';
import ContentTab from './tabs/ContentTab';

const CareerForm = () => {
  const { user } = useAuth();
  const location = useLocation();
  const dashboardFilters = location.state?.filters || {};
  
  // Check if dashboardFilters has values
  const hasDashboardFilters = Object.keys(dashboardFilters).length > 0;
  
  // State for active tab - default to Jobs if filters exist
  const [activeTab, setActiveTab] = useState<number>(hasDashboardFilters ? 2 : 0);

  const [selectedAcademic, setSelectedAcademic] = useState(
    user?.role === 'CustomerAdmin' ? user?.academic_id || '' : '',
  );
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    // If dashboard filters are present, switch to Jobs tab (index 2)
    if (hasDashboardFilters && activeTab !== 2) {
      setActiveTab(2);
    }
  }, [hasDashboardFilters, activeTab]);

  const handleAcademicSelect = (selectedId: string) => {
    setSelectedAcademic(selectedId);
  };

  const handleTabChange = (tabIndex: number) => {
    setActiveTab(tabIndex);
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
        
        <Tabs 
          aria-label="Career Content Tabs" 
          variant="underline"
          onActiveTabChange={handleTabChange}
        >
          <Tabs.Item 
            active={activeTab === 0}
            icon={HiOutlineDocumentText} 
            title="Header & Footer"
          >
            <CareerFooterSection
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>

          <Tabs.Item 
            active={activeTab === 1}
            icon={HiOutlineTemplate} 
            title="Card Contain"
          >
            <CareerCardSection 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>

          <Tabs.Item 
            active={activeTab === 2}
            icon={HiOutlineBriefcase} 
            title="Jobs"
          >
            <CareerJobsSection 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
              dashboardFilters={dashboardFilters}
            />
          </Tabs.Item>

          <Tabs.Item 
            active={activeTab === 3}
            icon={HiOutlineNewspaper} 
            title="Status"
          >
            <CareerStatusManagement 
              selectedAcademic={selectedAcademic} 
              user={user} 
              apiUrl={apiUrl} 
            />
          </Tabs.Item>
          
          <Tabs.Item 
            active={activeTab === 4}
            icon={HiOutlineNewspaper} 
            title="Settings"
          >
            <TransportationSettingsTab
              selectedAcademic={selectedAcademic} 
            />
          </Tabs.Item>
          <Tabs.Item 
            active={activeTab === 5}
            icon={HiOutlineNewspaper} 
            title="Content Management"
          >
            <ContentTab
              selectedAcademic={selectedAcademic} 
            />
          </Tabs.Item>
        </Tabs> 
      </div>
    </Card>
  );
};

export default CareerForm;