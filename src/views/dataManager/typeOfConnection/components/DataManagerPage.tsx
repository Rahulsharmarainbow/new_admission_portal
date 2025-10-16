import React, { useState } from 'react';
import DataManagerTable from '../components/DataManagerTable';
import { useAcademics } from 'src/hook/useAcademics';
import TypeOfConnection from '../components/TypeOfConnection';
import Loader from 'src/Frontend/Common/Loader';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import DataModal from './AddDataModal';

const DataManagerPage: React.FC = () => {
  const { academics, loading: academicLoading } = useAcademics();
  const [selectedAcademic, setSelectedAcademic] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showModal, setShowModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const { user } = useAuth();

  // Handle academic change
  const handleAcademicChange = (academic: string) => {
    setSelectedAcademic(academic);
    setSelectedType(''); // Reset type when academic changes
  };

  // Handle type change - now using type ID as string
  const handleTypeChange = (typeId: number | null) => {
    setSelectedType(typeId ? typeId.toString() : '');
  };

  // Handle add success
  const handleSuccess = () => {
    setShowModal(false);
    setRefresh(!refresh);
  };

  // Handle add click
  const handleAddClick = () => {
    setModalType('add');
    setShowModal(true);
  };

  if (academicLoading) {
    return <Loader />;
  }

  return (
    <div className="p-2">
      {/* Header */}
      <div className="mb-6">
        <BreadcrumbHeader
          title="Data Manager"
          paths={[{ name: "Data Manager", link: "/" + user?.role + "/data-manager/type-of-connection" }]}
        />
      </div>

      {/* Filters Section */}
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
            <TypeOfConnection 
              selectedAcademic={selectedAcademic} 
              onTypeChange={handleTypeChange} 
            />
          </div>
        </div>
      </div>

      {/* Table - Only show when type is selected */}
      {selectedType && (
        <DataManagerTable
          selectedAcademic={selectedAcademic}
          selectedType={selectedType}
          onAddClick={handleAddClick}
          refresh={refresh}
          setRefresh={setRefresh}
        />
      )}

      {/* Unified Data Modal */}
      <DataModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={handleSuccess}
        selectedAcademic={selectedAcademic}
        selectedType={selectedType}
        type={modalType}
      />
    </div>
  );
};

export default DataManagerPage;