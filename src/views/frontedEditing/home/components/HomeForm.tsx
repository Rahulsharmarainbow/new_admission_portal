import React, { useState } from 'react';
import { Tabs, Card } from 'flowbite-react';
import {
  HiOutlineDocumentText,
  HiOutlineCursorClick,
  HiOutlineSpeakerphone,
  HiOutlineCog,
} from 'react-icons/hi';
import FooterFormSection from './Tabs/FooterFormSection';
import { useAuth } from 'src/hook/useAuth';
import ApplicationTabs from './Tabs/ApplicationTabs';
import HomeLinesEditor from './Tabs/HomeLinesEditor';
import PopupEditor from './Tabs/PopupEditor';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import { MdMoney } from 'react-icons/md';
import FeesManagement from './Tabs/FeesManagement';
import FeesManagements from './Tabs/FeesManagements';

const HomeForm = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
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
          <h2 className="text-2xl font-semibold">Website Content Management</h2>

          {/* Academic Dropdown (Global for all tabs) */}
          <div className="w-64">
            {user && user?.role !== 'CustomerAdmin' && (
              <AllAcademicsDropdown
                value={selectedAcademic}
                onChange={handleAcademicSelect}
                label="First Select Academic"
                isRequired
              />
            )}
          </div>
        </div>
        <Tabs aria-label="Content Tabs" variant="underline">
          <Tabs.Item active icon={HiOutlineDocumentText} title="Header & Footer">
            <FooterFormSection selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineCursorClick} title="Application Tabs">
            <ApplicationTabs selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineSpeakerphone} title="Frontend Headings">
            <HomeLinesEditor selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item>

          <Tabs.Item icon={HiOutlineCog} title="Popup">
            <PopupEditor selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item>
          {/* <Tabs.Item icon={MdMoney} title="Fees">
            <PopupEditor selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item> */}
          
          <Tabs.Item icon={MdMoney} title="Fees Management">
            <FeesManagements selectedAcademic={selectedAcademic} user={user} apiUrl={apiUrl} />
          </Tabs.Item>
        </Tabs>
      </div>
    </Card>
  );
};

export default HomeForm;
