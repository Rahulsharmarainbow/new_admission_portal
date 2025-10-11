import React, { useState } from 'react';
import DataManagerTable from '../components/DataManagerTable';
import { useAcademics } from 'src/hook/useAcademics';
import TypeOfConnection from '../components/TypeOfConnection';
import { Button } from 'flowbite-react';
import AddDataModal from '../components/AddDataModal';
import Loader from 'src/Frontend/Common/Loader';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';

const DataManagerPage: React.FC = () => {
  const { academics, loading: academicLoading } = useAcademics();
  const [selectedAcademic, setSelectedAcademic] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);
  const { user } = useAuth();

  // Handle academic change
  const handleAcademicChange = (academic: string) => {
    setSelectedAcademic(academic);
    setSelectedType(''); // Reset type when academic changes
  };

  // Handle type change
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };

  // Handle add success
  const handleAddSuccess = () => {
    setShowAddModal(false);
  };

  if (academicLoading) {
    return <Loader />;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <BreadcrumbHeader
        title="Data Manager"
        paths={[{ name: "Data Manager", link: "/" + user?.role + "/data-manager/type-of-connection" }]}
      />
      </div>

      {/* Filters Section - Table se bahar */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Academic Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <AcademicDropdown
                value={selectedAcademic}
                onChange={handleAcademicChange}
                label="Select Academic"
              />
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 text-sm font-medium text-gray-700">Select Type</label>
            <TypeOfConnection selectedAcademic={selectedAcademic} onTypeChange={handleTypeChange} />
          </div>
        </div>
      </div>

      {/* Table - Only show when type is selected */}
      {selectedType && (
        <DataManagerTable
          selectedAcademic={selectedAcademic}
          selectedType={selectedType}
          onAddClick={() => setShowAddModal(true)}
        />
      )}

      {/* Add Data Modal */}
      <AddDataModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddSuccess}
        selectedAcademic={selectedAcademic}
        selectedType={selectedType}
      />
    </div>
  );
};

export default DataManagerPage;
