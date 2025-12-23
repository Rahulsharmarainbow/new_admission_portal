import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  MdAddCircle,
  MdDelete,
  MdSave,
  MdDragIndicator,
} from 'react-icons/md';
import { useAuth } from 'src/hook/useAuth';
import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
import Loader from 'src/Frontend/Common/Loader';
import toast from 'react-hot-toast';

interface ConfigRow {
  id: string;
  headerName: string;
  valueField: string;
  type: 2 | 1; // 1 = Input Field, 2 = Select Dropdown
}

interface ApiConfigItem {
  id: number;
  academic_id: number;
  label: string;
  variables: string;
  type: 2 | 1; // 1 = Input Field, 2 = Select Dropdown
  created_at: string;
  updated_at: string;
}

const FIELD_TYPES = {
  INPUT: 2,
  SELECT: 1,
} as const;

const ExportConfig: React.FC = () => {
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL;

  // 🔽 Academic selection
  const [academicId, setAcademicId] = useState<string>('');

  // 📋 Rows
  const [rows, setRows] = useState<ConfigRow[]>([
    {
      id: crypto.randomUUID(),
      headerName: '',
      valueField: '',
      type: FIELD_TYPES.INPUT,
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [fetchingConfig, setFetchingConfig] = useState(false);

  // ➕ Add Row
  const addRow = () => {
    setRows(prev => [
      ...prev,
      {
        id: crypto.randomUUID(),
        headerName: '',
        valueField: '',
        type: FIELD_TYPES.INPUT,
      },
    ]);
    toast.success('New row added');
  };

  // ❌ Delete Row
  const deleteRow = (id: string) => {
    if (rows.length > 1) {
      setRows(prev => prev.filter(row => row.id !== id));
      toast.success('Row deleted successfully');
    } else {
      toast.error('Cannot delete the last row');
    }
  };

  // ✏️ Input Change
  const handleInputChange = (
    id: string,
    field: keyof Omit<ConfigRow, 'id'>,
    value: any
  ) => {
    setRows(prev =>
      prev.map(row =>
        row.id === id ? { ...row, [field]: value } : row
      )
    );
  };

  // 🔄 Fetch existing configuration when academic is selected
  useEffect(() => {
    const fetchExistingConfig = async () => {
      if (!academicId) {
        // Reset rows when no academic selected
        setRows([
          {
            id: crypto.randomUUID(),
            headerName: '',
            valueField: '',
            type: FIELD_TYPES.INPUT,
          },
        ]);
        return;
      }

      try {
        setFetchingConfig(true);

        const payload = {
          academic_id: Number(academicId),
          page: 0,
          rowsPerPage: 100,
          order: "desc",
          orderBy: "id",
          search: ""
        };

        const response = await axios.post(
          `${apiUrl}/${user?.role}/AcademicColum/get-academic-colum`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.data?.status && response.data?.data) {
          const apiData: ApiConfigItem[] = response.data.data;
          
          if (apiData.length > 0) {
            const transformedRows: ConfigRow[] = apiData.map(item => ({
              id: crypto.randomUUID(),
              headerName: item.label,
              valueField: item.variables,
              type: item.type,
            }));
            
            setRows(transformedRows);
            //toast.success(`Loaded ${apiData.length} configuration rows`);
          } else {
            setRows([
              {
                id: crypto.randomUUID(),
                headerName: '',
                valueField: '',
                type: FIELD_TYPES.INPUT,
              },
            ]);
            toast.info('No existing configuration found. Starting fresh.');
          }
        } else {
          setRows([
            {
              id: crypto.randomUUID(),
              headerName: '',
              valueField: '',
              type: FIELD_TYPES.INPUT,
            },
          ]);
          toast.info('No configuration data available');
        }
      } catch (error) {
        console.error('Error fetching existing config:', error);
       // toast.error('Failed to load existing configuration');
        setRows([
          {
            id: crypto.randomUUID(),
            headerName: '',
            valueField: '',
            type: FIELD_TYPES.INPUT,
          },
        ]);
      } finally {
        setFetchingConfig(false);
      }
    };

    fetchExistingConfig();
  }, [academicId, apiUrl, user?.role, user?.token]);

  // 💾 Save Configuration - SIMPLIFIED VERSION WITHOUT toast.promise
  const saveExportConfiguration = async () => {
    if (!academicId) {
      toast.error('Please select Academic');
      return;
    }

    // Validate rows
    const hasEmptyFields = rows.some(row => 
      !row.headerName.trim() || !row.valueField.trim() || !row.type
    );
    
    if (hasEmptyFields) {
      toast.error('Please fill all fields in all rows');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        academic_id: Number(academicId),
        export_config: rows.map((row, index) => ({
          order_no: index + 1,
          header_name: row.headerName,
          value_field: row.valueField,
          type: row.type, // 1 = Input, 2 = Select
        })),
      };

      console.log('Save Payload:', payload);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/AcademicColum/save-academic-config`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status) {
        toast.success('Configuration Saved Successfully');
      } else {
        toast.error('Failed to save configuration');
      }
    } catch (error) {
      console.error('Save Error:', error);
      toast.error('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* 🔽 Academic Dropdown (Always Visible) */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-72">
            <AllAcademicsDropdown
              label="Select Academic"
              isRequired
              value={academicId}
              onChange={(val) => setAcademicId(val)}
              placeholder="Select academic year"
            />
          </div>
        </div>

        {/* 🚫 Hide config until academic selected */}
        {!academicId ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8 text-center">
            <div className="text-slate-400">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-medium text-slate-600 mb-2">
                Select an Academic Year
              </h3>
              <p className="text-slate-500">
                Please select an academic year above to view or edit the export configuration
              </p>
            </div>
          </div>
        ) : fetchingConfig ? (
          // Show Loader when fetching configuration
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                Export Configuration
              </h2>
              <p className="text-sm text-slate-500">
                Loading configuration for Academic {academicId}...
              </p>
            </div>
            <Loader />
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

            {/* Header */}
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Export Configuration
                </h2>
                <p className="text-sm text-slate-500">
                  Map your Excel columns to database fields for Academic {academicId}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={saveExportConfiguration}
                  disabled={loading}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60"
                >
                  <MdSave size={20} />
                  {loading ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
                    <th className="px-6 py-4 w-20 text-center">S.No</th>
                    <th className="px-6 py-4">Excel Header Name</th>
                    <th className="px-6 py-4 w-48">Type</th>
                    <th className="px-6 py-4">Field Value / Variables</th>
                    <th className="px-6 py-4 w-40 text-center">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {rows.map((row, index) => (
                    <tr
                      key={row.id}
                      className="group hover:bg-blue-50/30 transition"
                    >
                      {/* S.No */}
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-slate-500">
                            {index + 1}
                          </span>
                          <MdDragIndicator
                            size={18}
                            className="text-slate-300 cursor-grab hover:text-slate-400"
                          />
                        </div>
                      </td>

                      {/* Header Name */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder="e.g. Student Name, Address"
                          value={row.headerName}
                          onChange={e =>
                            handleInputChange(
                              row.id,
                              'headerName',
                              e.target.value
                            )
                          }
                          className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </td>

                      {/* Type */}
                      <td className="px-6 py-4">
                        <select
                          value={row.type}
                          onChange={(e) =>
                            handleInputChange(
                              row.id,
                              'type',
                              Number(e.target.value) as 1 | 2
                            )
                          }
                          className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value={FIELD_TYPES.INPUT}>Input Field</option>
                          <option value={FIELD_TYPES.SELECT}>Select Dropdown</option>
                        </select>
                      </td>

                      {/* Value Field */}
                      <td className="px-6 py-4">
                        <input
                          type="text"
                          placeholder={
                            row.type === FIELD_TYPES.SELECT
                              ? 'e.g. {#field_name#},{#another_field#}'
                              : 'e.g. {#single_field_name#}'
                          }
                          value={row.valueField}
                          onChange={e =>
                            handleInputChange(
                              row.id,
                              'valueField',
                              e.target.value
                            )
                          }
                          className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm font-mono text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        {/* {row.type === FIELD_TYPES.SELECT && (
                          <div className="text-xs text-slate-500 mt-1">
                            Multiple fields: Separate with commas
                          </div>
                        )} */}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3">
                          <button
                            onClick={() => deleteRow(row.id)}
                            disabled={rows.length <= 1}
                            className={`p-2 rounded-md ${
                              rows.length > 1
                                ? 'text-rose-500 hover:bg-rose-50'
                                : 'text-slate-300 cursor-not-allowed'
                            }`}
                            title={rows.length > 1 ? "Delete row" : "Cannot delete last row"}
                          >
                            <MdDelete size={22} />
                          </button>

                          <button
                            onClick={addRow}
                            className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
                            title="Add new row below"
                          >
                            <MdAddCircle size={22} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExportConfig;





// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   MdAddCircle,
//   MdDelete,
//   MdSave,
//   MdDragIndicator,
// } from 'react-icons/md';
// import { useAuth } from 'src/hook/useAuth';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';
// import Loader from 'src/Frontend/Common/Loader'; // Import your Loader component

// interface ConfigRow {
//   id: string;
//   headerName: string;
//   valueField: string;
//   type: 1 | 2; // 1 = Input, 2 = Select
// }

// interface ApiConfigItem {
//   id: number;
//   academic_id: number;
//   label: string;
//   variables: string;
//   type: 1 | 2;
//   created_at: string;
//   updated_at: string;
// }

// const ExportConfig: React.FC = () => {
//   const { user } = useAuth();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // 🔽 Academic selection
//   const [academicId, setAcademicId] = useState<string>('');

//   // 📋 Rows
//   const [rows, setRows] = useState<ConfigRow[]>([
//     {
//       id: crypto.randomUUID(),
//       headerName: '',
//       valueField: '',
//       type: 1,
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [fetchingConfig, setFetchingConfig] = useState(false);

//   // ➕ Add Row
//   const addRow = () => {
//     setRows(prev => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         headerName: '',
//         valueField: '',
//         type: 1,
//       },
//     ]);
//   };

//   // ❌ Delete Row
//   const deleteRow = (id: string) => {
//     if (rows.length > 1) {
//       setRows(prev => prev.filter(row => row.id !== id));
//     }
//   };

//   // ✏️ Input Change
//   const handleInputChange = (
//     id: string,
//     field: keyof Omit<ConfigRow, 'id'>,
//     value: any
//   ) => {
//     setRows(prev =>
//       prev.map(row =>
//         row.id === id ? { ...row, [field]: value } : row
//       )
//     );
//   };

//   // 🔄 Fetch existing configuration when academic is selected
//   useEffect(() => {
//     const fetchExistingConfig = async () => {
//       if (!academicId) {
//         // Reset rows when no academic selected
//         setRows([
//           {
//             id: crypto.randomUUID(),
//             headerName: '',
//             valueField: '',
//             type: 1,
//           },
//         ]);
//         return;
//       }

//       try {
//         setFetchingConfig(true);

//         const payload = {
//           academic_id: Number(academicId),
//           page: 0,
//           rowsPerPage: 100, // Fetch all configs
//           order: "desc",
//           orderBy: "id",
//           search: ""
//         };

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/AcademicColum/get-academic-colum`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data?.status && response.data?.data) {
//           const apiData: ApiConfigItem[] = response.data.data;
          
//           if (apiData.length > 0) {
//             // Transform API data to match our ConfigRow structure
//             const transformedRows: ConfigRow[] = apiData.map(item => ({
//               id: crypto.randomUUID(), // Generate new ID for UI
//               headerName: item.label,
//               valueField: item.variables,
//               type: item.type,
//             }));
            
//             setRows(transformedRows);
//           } else {
//             // No existing config, start with empty row
//             setRows([
//               {
//                 id: crypto.randomUUID(),
//                 headerName: '',
//                 valueField: '',
//                 type: 1,
//               },
//             ]);
//           }
//         } else {
//           // No data or failed, start fresh
//           setRows([
//             {
//               id: crypto.randomUUID(),
//               headerName: '',
//               valueField: '',
//               type: 1,
//             },
//           ]);
//         }
//       } catch (error) {
//         console.error('Error fetching existing config:', error);
//         alert('Failed to load existing configuration');
//         // Start with empty row on error
//         setRows([
//           {
//             id: crypto.randomUUID(),
//             headerName: '',
//             valueField: '',
//             type: 1,
//           },
//         ]);
//       } finally {
//         setFetchingConfig(false);
//       }
//     };

//     fetchExistingConfig();
//   }, [academicId, apiUrl, user?.role, user?.token]);

//   // 💾 Save Configuration
//   const saveExportConfiguration = async () => {
//     if (!academicId) {
//       alert('Please select Academic');
//       return;
//     }

//     // Validate rows
//     const hasEmptyFields = rows.some(row => 
//       !row.headerName.trim() || !row.valueField.trim() || !row.type
//     );
    
//     if (hasEmptyFields) {
//       alert('Please fill all fields in all rows');
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         academic_id: Number(academicId),
//         export_config: rows.map((row, index) => ({
//           order_no: index + 1,
//           header_name: row.headerName,
//           value_field: row.valueField,
//           type: row.type, // 1 or 2
//         })),
//       };

//       console.log('Payload:', payload);

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/AcademicColum/save-academic-config`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data?.status) {
//         alert('Configuration Saved Successfully ✅');
//       } else {
//         throw new Error('Save failed');
//       }
//     } catch (error) {
//       console.error('Save Error:', error);
//       alert('Failed to save configuration ❌');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-slate-50 min-h-screen font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* 🔽 Academic Dropdown (Always Visible) */}
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <div className="w-72">
//             <AllAcademicsDropdown
//               label="Select Academic"
//               isRequired
//               value={academicId}
//               onChange={(val) => setAcademicId(val)}
//               placeholder="Select academic year"
//             />
//           </div>
//         </div>

//         {/* 🚫 Hide config until academic selected */}
//         {!academicId ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8 text-center">
//             <div className="text-slate-400">
//               <div className="text-5xl mb-4">📋</div>
//               <h3 className="text-xl font-medium text-slate-600 mb-2">
//                 Select an Academic Year
//               </h3>
//               <p className="text-slate-500">
//                 Please select an academic year above to view or edit the export configuration
//               </p>
//             </div>
//           </div>
//         ) : fetchingConfig ? (
//           // Show Loader when fetching configuration
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
//             <div className="px-6 py-5 border-b border-slate-100">
//               <h2 className="text-xl font-bold text-slate-800">
//                 Export Configuration
//               </h2>
//               <p className="text-sm text-slate-500">
//                 Loading configuration for Academic {academicId}...
//               </p>
//             </div>
//             <Loader />
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

//             {/* Header */}
//             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800">
//                   Export Configuration
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Map your Excel columns to database fields for Academic {academicId}
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 <button
//                   onClick={addRow}
//                   className="flex items-center gap-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition"
//                 >
//                   <MdAddCircle size={18} />
//                   Add Row
//                 </button>
                
//                 <button
//                   onClick={saveExportConfiguration}
//                   disabled={loading}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60"
//                 >
//                   <MdSave size={20} />
//                   {loading ? 'Saving...' : 'Save Configuration'}
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
//                     <th className="px-6 py-4 w-20 text-center">S.No</th>
//                     <th className="px-6 py-4">Excel Header Name</th>
//                     <th className="px-6 py-4 w-48">Type</th>
//                     <th className="px-6 py-4">Field Value / Variables</th>
//                     <th className="px-6 py-4 w-40 text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {rows.map((row, index) => (
//                     <tr
//                       key={row.id}
//                       className="group hover:bg-blue-50/30 transition"
//                     >
//                       {/* S.No */}
//                       <td className="px-6 py-4 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <span className="text-slate-500">
//                             {index + 1}
//                           </span>
//                           <MdDragIndicator
//                             size={18}
//                             className="text-slate-300 cursor-grab hover:text-slate-400"
//                           />
//                         </div>
//                       </td>

//                       {/* Header Name */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder="e.g. Student Name, Address"
//                           value={row.headerName}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'headerName',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                       </td>

//                       {/* Type */}
//                       <td className="px-6 py-4">
//                         <select
//                           value={row.type}
//                           onChange={(e) =>
//                             handleInputChange(
//                               row.id,
//                               'type',
//                               Number(e.target.value) as 1 | 2
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                         >
//                           <option value={1}>Input Field</option>
//                           <option value={2}>Select Dropdown</option>
//                         </select>
//                       </td>

//                       {/* Value Field */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder={
//                             row.type === 2
//                               ? 'e.g. {#field_name#},{#another_field#}'
//                               : 'e.g. {#single_field_name#}'
//                           }
//                           value={row.valueField}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'valueField',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm font-mono text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                         {row.type === 2 && (
//                           <div className="text-xs text-slate-500 mt-1">
//                             Multiple fields: Separate with commas
//                           </div>
//                         )}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-3">
//                           <button
//                             onClick={() => deleteRow(row.id)}
//                             disabled={rows.length <= 1}
//                             className={`p-2 rounded-md ${
//                               rows.length > 1
//                                 ? 'text-rose-500 hover:bg-rose-50'
//                                 : 'text-slate-300 cursor-not-allowed'
//                             }`}
//                             title={rows.length > 1 ? "Delete row" : "Cannot delete last row"}
//                           >
//                             <MdDelete size={22} />
//                           </button>

//                           <button
//                             onClick={addRow}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
//                             title="Add new row below"
//                           >
//                             <MdAddCircle size={22} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

            
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExportConfig;













// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import {
//   MdAddCircle,
//   MdDelete,
//   MdSave,
//   MdDragIndicator,
//   MdEdit,
// } from 'react-icons/md';
// import { useAuth } from 'src/hook/useAuth';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// interface ConfigRow {
//   id: string;
//   headerName: string;
//   valueField: string;
//   type: 1 | 2; // 1 = Input, 2 = Select
// }

// interface ApiConfigItem {
//   id: number;
//   academic_id: number;
//   label: string;
//   variables: string;
//   type: 1 | 2;
//   created_at: string;
//   updated_at: string;
// }

// const ExportConfig: React.FC = () => {
//   const { user } = useAuth();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // 🔽 Academic selection
//   const [academicId, setAcademicId] = useState<string>('');

//   // 📋 Rows
//   const [rows, setRows] = useState<ConfigRow[]>([
//     {
//       id: crypto.randomUUID(),
//       headerName: '',
//       valueField: '',
//       type: 1,
//     },
//   ]);

//   const [loading, setLoading] = useState(false);
//   const [fetchingConfig, setFetchingConfig] = useState(false);

//   // ➕ Add Row
//   const addRow = () => {
//     setRows(prev => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         headerName: '',
//         valueField: '',
//         type: 1,
//       },
//     ]);
//   };

//   // ❌ Delete Row
//   const deleteRow = (id: string) => {
//     if (rows.length > 1) {
//       setRows(prev => prev.filter(row => row.id !== id));
//     }
//   };

//   // ✏️ Input Change
//   const handleInputChange = (
//     id: string,
//     field: keyof Omit<ConfigRow, 'id'>,
//     value: any
//   ) => {
//     setRows(prev =>
//       prev.map(row =>
//         row.id === id ? { ...row, [field]: value } : row
//       )
//     );
//   };

//   // 🔄 Fetch existing configuration when academic is selected
//   useEffect(() => {
//     const fetchExistingConfig = async () => {
//       if (!academicId) {
//         // Reset rows when no academic selected
//         setRows([
//           {
//             id: crypto.randomUUID(),
//             headerName: '',
//             valueField: '',
//             type: 1,
//           },
//         ]);
//         return;
//       }

//       try {
//         setFetchingConfig(true);

//         const payload = {
//           academic_id: Number(academicId),
//           page: 0,
//           rowsPerPage: 100, // Fetch all configs
//           order: "desc",
//           orderBy: "id",
//           search: ""
//         };

//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/AcademicColum/get-academic-colum`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data?.status && response.data?.data) {
//           const apiData: ApiConfigItem[] = response.data.data;
          
//           if (apiData.length > 0) {
//             // Transform API data to match our ConfigRow structure
//             const transformedRows: ConfigRow[] = apiData.map(item => ({
//               id: crypto.randomUUID(), // Generate new ID for UI
//               headerName: item.label,
//               valueField: item.variables,
//               type: item.type,
//             }));
            
//             setRows(transformedRows);
//           } else {
//             // No existing config, start with empty row
//             setRows([
//               {
//                 id: crypto.randomUUID(),
//                 headerName: '',
//                 valueField: '',
//                 type: 1,
//               },
//             ]);
//           }
//         } else {
//           // No data or failed, start fresh
//           setRows([
//             {
//               id: crypto.randomUUID(),
//               headerName: '',
//               valueField: '',
//               type: 1,
//             },
//           ]);
//         }
//       } catch (error) {
//         console.error('Error fetching existing config:', error);
//         alert('Failed to load existing configuration');
//         // Start with empty row on error
//         setRows([
//           {
//             id: crypto.randomUUID(),
//             headerName: '',
//             valueField: '',
//             type: 1,
//           },
//         ]);
//       } finally {
//         setFetchingConfig(false);
//       }
//     };

//     fetchExistingConfig();
//   }, [academicId, apiUrl, user?.role, user?.token]);

//   // 💾 Save Configuration
//   const saveExportConfiguration = async () => {
//     if (!academicId) {
//       alert('Please select Academic');
//       return;
//     }

//     // Validate rows
//     const hasEmptyFields = rows.some(row => 
//       !row.headerName.trim() || !row.valueField.trim() || !row.type
//     );
    
//     if (hasEmptyFields) {
//       alert('Please fill all fields in all rows');
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         academic_id: Number(academicId),
//         export_config: rows.map((row, index) => ({
//           order_no: index + 1,
//           header_name: row.headerName,
//           value_field: row.valueField,
//           type: row.type, // 1 or 2
//         })),
//       };

//       console.log('Payload:', payload);

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/AcademicColum/save-academic-config`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data?.status) {
//         alert('Configuration Saved Successfully ✅');
//       } else {
//         throw new Error('Save failed');
//       }
//     } catch (error) {
//       console.error('Save Error:', error);
//       alert('Failed to save configuration ❌');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-slate-50 min-h-screen font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* 🔽 Academic Dropdown (Always Visible) */}
//         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
//           <div className="w-72">
//             <AllAcademicsDropdown
//               label="Select Academic"
//               isRequired
//               value={academicId}
//               onChange={(val) => setAcademicId(val)}
//               placeholder="Select academic year"
//             />
//           </div>
          
//           {fetchingConfig && (
//             <div className="mt-3 text-sm text-blue-600">
//               Loading existing configuration...
//             </div>
//           )}
          
//           {/* {academicId && !fetchingConfig && (
//             <div className="mt-3 text-sm text-green-600">
//               ✓ Configuration loaded for selected academic
//             </div>
//           )} */}
//         </div>

//         {/* 🚫 Hide config until academic selected */}
//         {!academicId ? (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-8 text-center">
//             <div className="text-slate-400">
//               <div className="text-5xl mb-4">📋</div>
//               <h3 className="text-xl font-medium text-slate-600 mb-2">
//                 Select an Academic Year
//               </h3>
//               <p className="text-slate-500">
//                 Please select an academic year above to view or edit the export configuration
//               </p>
//             </div>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

//             {/* Header */}
//             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800">
//                   Export Configuration
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Map your Excel columns to database fields for Academic {academicId}
//                 </p>
//               </div>

//               <div className="flex items-center gap-3">
//                 {/* <button
//                   onClick={addRow}
//                   className="flex items-center gap-2 border border-emerald-500 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition"
//                 >
//                   <MdAddCircle size={18} />
//                   Add Row
//                 </button> */}
                
//                 <button
//                   onClick={saveExportConfiguration}
//                   disabled={loading || fetchingConfig}
//                   className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60"
//                 >
//                   <MdSave size={20} />
//                   {loading ? 'Saving...' : 'Save Configuration'}
//                 </button>
//               </div>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
//                     <th className="px-6 py-4 w-20 text-center">S.No</th>
//                     <th className="px-6 py-4">Excel Header Name</th>
//                     <th className="px-6 py-4 w-48">Type</th>
//                     <th className="px-6 py-4">Field Value / Variables</th>
//                     <th className="px-6 py-4 w-40 text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {rows.map((row, index) => (
//                     <tr
//                       key={row.id}
//                       className="group hover:bg-blue-50/30 transition"
//                     >
//                       {/* S.No */}
//                       <td className="px-6 py-4 text-center">
//                         <div className="flex items-center justify-center gap-2">
//                           <span className="text-slate-500">
//                             {index + 1}
//                           </span>
//                           <MdDragIndicator
//                             size={18}
//                             className="text-slate-300 cursor-grab hover:text-slate-400"
//                           />
//                         </div>
//                       </td>

//                       {/* Header Name */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder="e.g. Student Name, Address"
//                           value={row.headerName}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'headerName',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                       </td>

//                       {/* Type */}
//                       <td className="px-6 py-4">
//                         <select
//                           value={row.type}
//                           onChange={(e) =>
//                             handleInputChange(
//                               row.id,
//                               'type',
//                               Number(e.target.value) as 1 | 2
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                         >
//                           <option value={1}>Input Field</option>
//                           <option value={2}>Select Dropdown</option>
//                         </select>
//                       </td>

//                       {/* Value Field */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder={
//                             row.type === 2
//                               ? 'e.g. {#field_name#},{#another_field#}'
//                               : 'e.g. {#single_field_name#}'
//                           }
//                           value={row.valueField}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'valueField',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm font-mono text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                         {/* {row.type === 2 && (
//                         //   <div className="text-xs text-slate-500 mt-1">
//                         //     Multiple fields: Separate with commas
//                         //   </div>
//                         )} */}
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-3">
//                           <button
//                             onClick={() => deleteRow(row.id)}
//                             disabled={rows.length <= 1}
//                             className={`p-2 rounded-md ${
//                               rows.length > 1
//                                 ? 'text-rose-500 hover:bg-rose-50'
//                                 : 'text-slate-300 cursor-not-allowed'
//                             }`}
//                             title={rows.length > 1 ? "Delete row" : "Cannot delete last row"}
//                           >
//                             <MdDelete size={22} />
//                           </button>

//                           <button
//                             onClick={addRow}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
//                             title="Add new row below"
//                           >
//                             <MdAddCircle size={22} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Footer */}
//             {/* <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 text-sm text-slate-600">
//               <div className="flex justify-between items-center">
//                 <div>
//                   Total Rows: <span className="font-semibold">{rows.length}</span>
//                 </div>
//                 <div className="flex items-center gap-4">
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded bg-blue-500"></div>
//                     <span>Type 1 = Input Field</span>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <div className="w-3 h-3 rounded bg-emerald-500"></div>
//                     <span>Type 2 = Select Dropdown</span>
//                   </div>
//                 </div>
//               </div>
//             </div> */}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExportConfig;





// import React, { useState } from 'react';
// import axios from 'axios';
// import {
//   MdAddCircle,
//   MdDelete,
//   MdSave,
//   MdDragIndicator,
// } from 'react-icons/md';
// import { useAuth } from 'src/hook/useAuth';
// import AllAcademicsDropdown from 'src/Frontend/Common/AllAcademicsDropdown';

// interface ConfigRow {
//   id: string;
//   headerName: string;
//   valueField: string;
//   type: 1 | 2; // 1 = Input, 2 = Select
// }

// const ExportConfig: React.FC = () => {
//   const { user } = useAuth();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // 🔽 Academic selection
//   const [academicId, setAcademicId] = useState<string>('');

//   // 📋 Rows
//   const [rows, setRows] = useState<ConfigRow[]>([
//     {
//       id: crypto.randomUUID(),
//       headerName: '',
//       valueField: '',
//       type: 1,
//     },
//   ]);

//   const [loading, setLoading] = useState(false);

//   // ➕ Add Row
//   const addRow = () => {
//     setRows(prev => [
//       ...prev,
//       {
//         id: crypto.randomUUID(),
//         headerName: '',
//         valueField: '',
//         type: 1,
//       },
//     ]);
//   };

//   // ❌ Delete Row
//   const deleteRow = (id: string) => {
//     if (rows.length > 1) {
//       setRows(prev => prev.filter(row => row.id !== id));
//     }
//   };

//   // ✏️ Input Change
//   const handleInputChange = (
//     id: string,
//     field: keyof Omit<ConfigRow, 'id'>,
//     value: any
//   ) => {
//     setRows(prev =>
//       prev.map(row =>
//         row.id === id ? { ...row, [field]: value } : row
//       )
//     );
//   };

//   // 💾 Save Configuration
//   const saveExportConfiguration = async () => {
//     if (!academicId) {
//       alert('Please select Academic');
//       return;
//     }

//     try {
//       setLoading(true);

//       const payload = {
//         academic_id: Number(academicId),
//         export_config: rows.map((row, index) => ({
//           order_no: index + 1,
//           header_name: row.headerName,
//           value_field: row.valueField,
//           type: row.type, // 1 or 2
//         })),
//       };

//       console.log('Payload:', payload);

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/AcademicColum/save-academic-config`,
//         payload,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data?.status) {
//         alert('Configuration Saved Successfully ✅');
//       } else {
//         throw new Error('Save failed');
//       }
//     } catch (error) {
//       console.error('Save Error:', error);
//       alert('Failed to save configuration ❌');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6 bg-slate-50 min-h-screen font-sans">
//       <div className="max-w-6xl mx-auto space-y-6">

//         {/* 🔽 Academic Dropdown (Always Visible) */}
//         <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm ">
//             <div className="w-72">
//           <AllAcademicsDropdown
//             label="Select Academic"
//             isRequired
//             value={academicId}
//             onChange={(val) => setAcademicId(val)}
//             placeholder="Select academic year"
//           />
//           </div>    
//         </div>

//         {/* 🚫 Hide config until academic selected */}
//         {!academicId ? null : (
//           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">

//             {/* Header */}
//             <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
//               <div>
//                 <h2 className="text-xl font-bold text-slate-800">
//                   Export Configuration
//                 </h2>
//                 <p className="text-sm text-slate-500">
//                   Map your Excel columns to database fields
//                 </p>
//               </div>

//               <button
//                 onClick={saveExportConfiguration}
//                 disabled={loading}
//                 className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium transition disabled:opacity-60"
//               >
//                 <MdSave size={20} />
//                 {loading ? 'Saving...' : 'Save Configuration'}
//               </button>
//             </div>

//             {/* Table */}
//             <div className="overflow-x-auto">
//               <table className="w-full text-left">
//                 <thead>
//                   <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase">
//                     <th className="px-6 py-4 w-20 text-center">S.No</th>
//                     <th className="px-6 py-4">Excel Header Name</th>
//                     <th className="px-6 py-4 w-48">Type</th>
//                     <th className="px-6 py-4">Field Value</th>
//                     <th className="px-6 py-4 w-32 text-center">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody className="divide-y divide-slate-100">
//                   {rows.map((row, index) => (
//                     <tr
//                       key={row.id}
//                       className="group hover:bg-blue-50/30 transition"
//                     >
//                       {/* S.No */}
//                       <td className="px-6 py-4 text-center">
//                         <span className="text-slate-500 group-hover:hidden">
//                           {index + 1}
//                         </span>
//                         <MdDragIndicator
//                           size={20}
//                           className="hidden group-hover:block mx-auto text-slate-300"
//                         />
//                       </td>

//                       {/* Header Name */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder="e.g. Customer Name"
//                           value={row.headerName}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'headerName',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                       </td>

//                       {/* Type */}
//                       <td className="px-6 py-4">
//   <select
//     value={row.type === null ? '' : row.type}
//     onChange={(e) =>
//       handleInputChange(
//         row.id,
//         'type',
//         Number(e.target.value) as 1 | 2
//       )
//     }
//     className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
//   >
//     <option value="" disabled>
//       Select Type
//     </option>

//     <option value={1}>Input Field</option>
//     <option value={2}>Select Dropdown</option>
//   </select>
// </td>


//                       {/* Value Field */}
//                       <td className="px-6 py-4">
//                         <input
//                           type="text"
//                           placeholder={
//                             row.type === 2
//                               ? 'Select options source'
//                               : '{#field_name#}'
//                           }
//                           value={row.valueField}
//                           onChange={e =>
//                             handleInputChange(
//                               row.id,
//                               'valueField',
//                               e.target.value
//                             )
//                           }
//                           className="w-full border border-slate-200 rounded-md px-4 py-2 text-sm font-mono text-blue-700 focus:ring-2 focus:ring-blue-500 outline-none"
//                         />
//                       </td>

//                       {/* Actions */}
//                       <td className="px-6 py-4">
//                         <div className="flex justify-center gap-3">
//                           <button
//                             onClick={() => deleteRow(row.id)}
//                             disabled={rows.length <= 1}
//                             className={`p-2 rounded-md ${
//                               rows.length > 1
//                                 ? 'text-rose-500 hover:bg-rose-50'
//                                 : 'text-slate-300 cursor-not-allowed'
//                             }`}
//                           >
//                             <MdDelete size={22} />
//                           </button>

//                           <button
//                             onClick={addRow}
//                             className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-md"
//                           >
//                             <MdAddCircle size={22} />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ExportConfig;















