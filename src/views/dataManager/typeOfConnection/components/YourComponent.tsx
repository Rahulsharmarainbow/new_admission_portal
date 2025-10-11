

// import { useState } from 'react';
// import { useAcademics } from 'src/hook/useAcademics';
// import TypeOfConnection from './TypeOfConnection';

// interface Academic {
//   id: number;
//   academic_name: string;
// }

// const YourComponent = () => {
//   const { academics, loading: academicLoading } = useAcademics();
//   const [filters, setFilters] = useState({
//     academic: '',
//     type: '',
//     page: 0
//   });

//   const handleTypeChange = (type: string) => {
//     setFilters(prev => ({ ...prev, type, page: 0 }));
//   };

//   if (academicLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
//       {/* Academic Dropdown */}
//       <div className="relative w-full sm:w-auto">
//         <select 
//           value={filters.academic}
//           onChange={(e) => setFilters(prev => ({ ...prev, academic: e.target.value, type: '', page: 0 }))}
//           className="w-full sm:w-auto min-w-[80px] p-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
//         >
//           <option value="">All Academic</option>
//           {academics.map((a: Academic) => (
//             <option key={a.id} value={a.id}>{a.academic_name}</option>
//           ))}
//         </select>
//         <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
//             <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//           </svg>
//         </div>
//       </div>

//       {/* Type Dropdown */}
//       <TypeOfConnection 
//         selectedAcademic={filters.academic}
//         onTypeChange={handleTypeChange}
//       />
//     </div>
//   );
// };

// export default YourComponent;
















import { useState } from 'react';
import { useAcademics } from 'src/hook/useAcademics';
import TypeOfConnection from './TypeOfConnection';
import DataManagerList from './DataManagerList';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface Academic {
  id: number;
  academic_name: string;
}

const YourComponent = () => {
  const { academics, loading: academicLoading } = useAcademics();
  const [filters, setFilters] = useState({
    academic: '',
    type: '',
    page: 0
  });

  const handleTypeChange = (type: string) => {
    setFilters(prev => ({ ...prev, type, page: 0 }));
  };

  if (academicLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Filters</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Academic Dropdown */}
          <AcademicDropdown
  name="academic"
  formData={filters}
  setFormData={setFilters}
  label=""
  includeAllOption
  className="min-w-[80px] text-sm"
/>


          {/* Type Dropdown */}
          <TypeOfConnection 
            selectedAcademic={filters.academic}
            onTypeChange={handleTypeChange}
          />
        </div>
      </div>

      {/* Data Manager List */}
      <DataManagerList 
        selectedAcademic={filters.academic}
        selectedType={filters.type}
      />
    </div>
  );
};

export default YourComponent;