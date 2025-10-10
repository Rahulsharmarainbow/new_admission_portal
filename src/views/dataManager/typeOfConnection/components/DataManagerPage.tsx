import React, { useState } from 'react';
import DataManagerTable from '../components/DataManagerTable';
import { useAcademics } from 'src/hook/useAcademics';
import TypeOfConnection from '../components/TypeOfConnection';
import { Button } from 'flowbite-react';
import AddDataModal from '../components/AddDataModal';
import Loader from 'src/Frontend/Common/Loader';

const DataManagerPage: React.FC = () => {
  const { academics, loading: academicLoading } = useAcademics();
  const [selectedAcademic, setSelectedAcademic] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState(false);

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
        <h1 className="text-2xl font-bold text-gray-800">Data Manager</h1>
        {/* <p className="text-gray-600">Manage academic data and types</p> */}
      </div>

      {/* Filters Section - Table se bahar */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
          {/* Academic Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Academic
            </label>
            <div className="relative">
              <select 
                value={selectedAcademic}
                onChange={(e) => handleAcademicChange(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">Select Academic</option>
                {academics.map((a) => (
                  <option key={a.id} value={a.id}>{a.academic_name}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          {/* Type Dropdown */}
          <div className="flex-1 min-w-[200px]">
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Select Type
            </label>
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





// import React, { useState } from 'react';
// import DataManagerTable from '../components/DataManagerTable';
// import { useAcademics } from 'src/hook/useAcademics';
// import TypeOfConnection from '../components/TypeOfConnection';
// import { Button } from 'flowbite-react';
// import AddDataModal from '../components/AddDataModal';
// import Loader from 'src/Frontend/Common/Loader';

// const DataManagerPage: React.FC = () => {
//   const { academics, loading: academicLoading } = useAcademics();
//   const [selectedAcademic, setSelectedAcademic] = useState<string>('');
//   const [selectedType, setSelectedType] = useState<string>('');
//   const [showAddModal, setShowAddModal] = useState(false);

//   // Handle academic change
//   const handleAcademicChange = (academic: string) => {
//     setSelectedAcademic(academic);
//     setSelectedType(''); // Reset type when academic changes
//   };

//   // Handle type change
//   const handleTypeChange = (type: string) => {
//     setSelectedType(type);
//   };

//   // Handle add success
//   const handleAddSuccess = () => {
//     setShowAddModal(false);
//   };

//   if (academicLoading) {
//     return <Loader />;
//   }

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Data Manager</h1>
//         <p className="text-gray-600">Manage academic data and types</p>
//       </div>

//       {/* Filters Section - Table se bahar */}
//       <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
//         <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end">
//           {/* Academic Dropdown */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Select Academic
//             </label>
//             <div className="relative">
//               <select 
//                 value={selectedAcademic}
//                 onChange={(e) => handleAcademicChange(e.target.value)}
//                 className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
//               >
//                 <option value="">Select Academic</option>
//                 {academics.map((a) => (
//                   <option key={a.id} value={a.id}>{a.academic_name}</option>
//                 ))}
//               </select>
//               <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//                 <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                 </svg>
//               </div>
//             </div>
//           </div>

//           {/* Type Dropdown */}
//           <div className="flex-1 min-w-[200px]">
//             <label className="block mb-2 text-sm font-medium text-gray-700">
//               Select Type
//             </label>
//             <TypeOfConnection 
//               selectedAcademic={selectedAcademic}
//               onTypeChange={handleTypeChange}
//             />
//           </div>

//           {/* Add Button */}
//           <div className="lg:flex-none">
//             <Button
//               onClick={() => setShowAddModal(true)}
//               color="blue"
//               className="whitespace-nowrap px-6 py-3"
//               disabled={!selectedAcademic || !selectedType}
//             >
//               <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//               </svg>
//               Add Data
//             </Button>
//           </div>
//         </div>
//       </div>

//       {/* Table - Only show when type is selected */}
//       {selectedType && (
//         <DataManagerTable 
//           selectedAcademic={selectedAcademic}
//           selectedType={selectedType}
//         />
//       )}

//       {/* Add Data Modal */}
//       <AddDataModal
//         isOpen={showAddModal}
//         onClose={() => setShowAddModal(false)}
//         onSuccess={handleAddSuccess}
//         selectedAcademic={selectedAcademic}
//         selectedType={selectedType}
//       />
//     </div>
//   );
// };

// export default DataManagerPage;



















// import React from 'react';
// import DataManagerTable from '../components/DataManagerTable';

// const DataManagerPage: React.FC = () => {
//   return (
//     <div className="p-6">
//       <div className="mb-6">
//         <h1 className="text-2xl font-bold text-gray-800">Data Manager</h1>
//         <p className="text-gray-600">Manage academic data and types</p>
//       </div>
//       <DataManagerTable />
//     </div>
//   );
// };

// export default DataManagerPage;