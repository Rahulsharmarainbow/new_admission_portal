// import React, { useState } from 'react';
// import { Droppable, Draggable } from '@hello-pangea/dnd';
// import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
// import axios from 'axios';
// import toast from 'react-hot-toast';

// const apiUrl = import.meta.env.VITE_API_URL;

// interface FieldType {
//   id: number;
//   label: string;
//   type?: string;
//   width?: number;
//   placeholder?: string;
//   required?: number;
//   validation_message?: string;
//   name?: string;
//   max_date?: string;
//   content?: string;
//   resolution?: string;
//   table?: string;
// }

// interface SidebarProps {
//   availableFields: FieldType[];
//   selectedField: FieldType | null;
//   setSelectedField: (field: FieldType | null) => void;
//   userToken?: string;
// }

// const Sidebar: React.FC<SidebarProps> = ({
//   availableFields,
//   selectedField,
//   setSelectedField,
//   userToken,
//   updateField
// }) => {
//     console.log(selectedField);
//   const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

//   const handleChange = (key: keyof FieldType, value: any) => {
//     setEditingField((prev) => (prev ? { ...prev, [key]: value } : prev));
//   };


//   const handleSave = () => {
//   if (!editingField) return;
//   updateField(editingField); // ✅ update in parent
//   toast.success("Field updated successfully");
//   setSelectedField(null); // Go back to list view
// };
//   React.useEffect(() => {
//   setEditingField(selectedField);
// }, [selectedField]);


// //   const handleSave = async () => {
// //     if (!editingField) return;
// //     try {
// //       const response = await axios.post(
// //         `${apiUrl}/form/update-field`,
// //         { field: editingField },
// //         {
// //           headers: {
// //             Authorization: `Bearer ${userToken}`,
// //             'Content-Type': 'application/json',
// //           },
// //         }
// //       );
// //       toast.success(response.data.message || 'Field updated successfully');
// //     } catch (error) {
// //       toast.error('Failed to update field');
// //       console.error(error);
// //     }
// //   };

//   const renderFieldEditor = (field: FieldType) => {
//     switch (field.type) {
//       case 'text':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.label || 'data'}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="text"
//               value={field.placeholder || ''}
//               onChange={(e) => handleChange('placeholder', e.target.value)}
//               placeholder="Placeholder"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       case 'select':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.label || ''}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <Select
//               value={field.table || ''}
//               onChange={(e) => handleChange('table', e.target.value)}
//             >
//               <option value="">Select Table</option>
//               <option value="gender_table">Gender Table</option>
//             </Select>
//           </>
//         );

//       case 'date':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.label || ''}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="text"
//               value={field.placeholder || ''}
//               onChange={(e) => handleChange('placeholder', e.target.value)}
//               placeholder="Placeholder"
//             />
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <TextInput
//               type="text"
//               value={field.max_date || ''}
//               onChange={(e) => handleChange('max_date', e.target.value)}
//               placeholder="Max Date"
//             />
//           </>
//         );

//       case 'heading':
//       case 'heading2':
//         return (
//           <>
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//           </>
//         );

//       case 'file_button':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.resolution || ''}
//               onChange={(e) => handleChange('resolution', e.target.value)}
//               placeholder="Resolution (e.g. 180x180)"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       case 'checkbox':
//         return (
//           <>
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       default:
//         return <p className="text-gray-400">Select a field to view settings</p>;
//     }
//   };

//   return (
//     <div
//       className="bg-white shadow-md p-4 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto"
//       style={{ width: 320, zIndex: 999 }}
//     >
//       {!selectedField ? (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Field Types</h2>
//           <Droppable droppableId="sidebar" isDropDisabled>
//             {(provided) => (
//               <div ref={provided.innerRef} {...provided.droppableProps}>
//                 {availableFields.map((field, index) => (
//                   <Draggable
//                     key={`sidebar-${field.id}`}
//                     draggableId={`sidebar-${field.id}`}
//                     index={index}
//                   >
//                     {(providedDrag) => (
//                       <div
//                         ref={providedDrag.innerRef}
//                         {...providedDrag.draggableProps}
//                         {...providedDrag.dragHandleProps}
//                         className="mb-2 p-2 bg-gray-100 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200"
//                       >
//                         <p className="text-sm font-medium">{field.label}</p>
//                         <p className="text-xs text-gray-500">Type: {field.type}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </>
//       ) : (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             <Button size="xs" color="gray" onClick={() => setSelectedField(null)}>
//               ← Back
//             </Button>
//             <h3 className="font-semibold text-lg">Field Settings</h3>
//           </div>
//           <div className="space-y-3">{editingField && renderFieldEditor(editingField)}</div>
//           <Button className="w-full mt-4" color="blue" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Sidebar;
















// import React, { useState, useEffect } from 'react';
// import { Droppable, Draggable } from '@hello-pangea/dnd';
// import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
// import { FiFileText, FiCalendar, FiUpload, FiCheckSquare, FiChevronDown, FiType } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const apiUrl = import.meta.env.VITE_API_URL;

// interface FieldType {
//   id: number;
//   label: string;
//   type?: string;
//   width?: number;
//   placeholder?: string;
//   required?: number;
//   validation_message?: string;
//   name?: string;
//   max_date?: string;
//   content?: string;
//   resolution?: string;
//   table?: string;
// }

// interface SidebarProps {
//   availableFields: FieldType[];
//   selectedField: FieldType | null;
//   setSelectedField: (field: FieldType | null) => void;
//   userToken?: string;
//   updateField: (field: FieldType) => void;
// }

// /**
//  * React-icons based icon selector for field types.
//  */
// const getFieldIcon = (field: FieldType) => {
//   switch (field.type) {
//     case 'text':
//       return <FiFileText className="h-6 w-6 text-blue-700" />;
//     case 'date':
//       return <FiCalendar className="h-6 w-6 text-purple-700" />;
//     case 'file_button':
//       return <FiUpload className="h-6 w-6 text-green-700" />;
//     case 'checkbox':
//       return <FiCheckSquare className="h-6 w-6 text-yellow-700" />;
//     case 'select':
//       return <FiChevronDown className="h-6 w-6 text-orange-700" />;
//     case 'heading':
//     case 'heading2':
//       return <FiType className="h-6 w-6 text-teal-700" />;
//     default:
//       return <FiFileText className="h-6 w-6 text-gray-400" />;
//   }
// };

// const Sidebar: React.FC<SidebarProps> = ({
//   availableFields,
//   selectedField,
//   setSelectedField,
//   userToken,
//   updateField,
// }) => {
//   const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

//   useEffect(() => {
//     setEditingField(selectedField);
//   }, [selectedField]);

//   const handleChange = (key: keyof FieldType, value: any) => {
//     setEditingField((prev) => (prev ? { ...prev, [key]: value } : prev));
//   };

//   const handleSave = () => {
//     if (!editingField) return;
//     updateField(editingField);
//     toast.success('Field updated successfully');
//     setSelectedField(null);
//   };

//   const renderFieldEditor = (field: FieldType) => {
//     switch (field.type) {
//       case 'text':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.label || 'data'}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="text"
//               value={field.placeholder || ''}
//               onChange={(e) => handleChange('placeholder', e.target.value)}
//               placeholder="Placeholder"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       case 'select':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.label || ''}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <Select
//               value={field.table || ''}
//               onChange={(e) => handleChange('table', e.target.value)}
//             >
//               <option value="">Select Table</option>
//               <option value="gender_table">Gender Table</option>
//             </Select>
//           </>
//         );

//       case 'date':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.label || ''}
//               onChange={(e) => handleChange('label', e.target.value)}
//               placeholder="Label"
//             />
//             <TextInput
//               type="text"
//               value={field.placeholder || ''}
//               onChange={(e) => handleChange('placeholder', e.target.value)}
//               placeholder="Placeholder"
//             />
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <TextInput
//               type="text"
//               value={field.max_date || ''}
//               onChange={(e) => handleChange('max_date', e.target.value)}
//               placeholder="Max Date"
//             />
//           </>
//         );

//       case 'heading':
//       case 'heading2':
//         return (
//           <>
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//           </>
//         );

//       case 'file_button':
//         return (
//           <>
//             <TextInput
//               type="text"
//               value={field.name || ''}
//               onChange={(e) => handleChange('name', e.target.value)}
//               placeholder="Name"
//             />
//             <TextInput
//               type="text"
//               value={field.resolution || ''}
//               onChange={(e) => handleChange('resolution', e.target.value)}
//               placeholder="Resolution (e.g. 180x180)"
//             />
//             <TextInput
//               type="number"
//               value={field.width || ''}
//               onChange={(e) => handleChange('width', Number(e.target.value))}
//               placeholder="Width (%)"
//             />
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       case 'checkbox':
//         return (
//           <>
//             <Textarea
//               value={field.content || ''}
//               onChange={(e) => handleChange('content', e.target.value)}
//               placeholder="Content"
//             />
//             <Select
//               value={field.required?.toString() || '0'}
//               onChange={(e) => handleChange('required', Number(e.target.value))}
//             >
//               <option value="0">Required: No</option>
//               <option value="1">Required: Yes</option>
//             </Select>
//             <TextInput
//               type="text"
//               value={field.validation_message || ''}
//               onChange={(e) => handleChange('validation_message', e.target.value)}
//               placeholder="Validation Message"
//             />
//           </>
//         );

//       default:
//         return <p className="text-gray-400">Select a field to view settings</p>;
//     }
//   };

//   return (
//     <div
//       className="bg-white shadow-md p-4 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto"
//       style={{ width: 320, zIndex: 999 }}
//     >
//       {!selectedField ? (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Field Types</h2>
//           <Droppable droppableId="sidebar" isDropDisabled>
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="grid grid-cols-2 gap-3"
//               >
//                 {availableFields.map((field, index) => (
//                   <Draggable
//                     key={`sidebar-${field.id}`}
//                     draggableId={`sidebar-${field.id}`}
//                     index={index}
//                   >
//                     {(providedDrag) => (
//                       <div
//                         ref={providedDrag.innerRef}
//                         {...providedDrag.draggableProps}
//                         {...providedDrag.dragHandleProps}
//                         className="flex flex-col items-center justify-center mb-2 p-2 bg-gray-100 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200"
//                         onClick={() => setSelectedField(field)}
//                       >
//                         <div className="mb-2">{getFieldIcon(field)}</div>
//                         <p className="text-sm font-medium text-center">{field.label}</p>
//                         <p className="text-xs text-gray-500 text-center">Type: {field.type}</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </>
//       ) : (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             <Button size="xs" color="gray" onClick={() => setSelectedField(null)}>
//               ← Back
//             </Button>
//             <h3 className="font-semibold text-lg">Field Settings</h3>
//           </div>
//           <div className="space-y-3">{editingField && renderFieldEditor(editingField)}</div>
//           <Button className="w-full mt-4" color="blue" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Sidebar;











// import React, { useState, useEffect } from 'react';
// import { Droppable, Draggable } from '@hello-pangea/dnd';
// import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
// import { FiFileText, FiCalendar, FiUpload, FiCheckSquare, FiChevronDown, FiType } from 'react-icons/fi';
// import toast from 'react-hot-toast';

// const apiUrl = import.meta.env.VITE_API_URL;

// interface FieldType {
//   id: number;
//   label: string;
//   type?: string;
//   width?: number;
//   placeholder?: string;
//   required?: number;
//   validation_message?: string;
//   name?: string;
//   max_date?: string;
//   content?: string;
//   resolution?: string;
//   table?: string;
// }

// interface SidebarProps {
//   availableFields: FieldType[];
//   selectedField: FieldType | null;
//   setSelectedField: (field: FieldType | null) => void;
//   userToken?: string;
//   updateField: (field: FieldType) => void;
// }

// /**
//  * React-icons based icon selector for field types.
//  */
// const getFieldIcon = (field: FieldType) => {
//   switch (field.type) {
//     case 'text':
//       return <FiFileText className="h-6 w-6 text-blue-700" />;
//     case 'date':
//       return <FiCalendar className="h-6 w-6 text-purple-700" />;
//     case 'file_button':
//       return <FiUpload className="h-6 w-6 text-green-700" />;
//     case 'checkbox':
//       return <FiCheckSquare className="h-6 w-6 text-yellow-700" />;
//     case 'select':
//       return <FiChevronDown className="h-6 w-6 text-orange-700" />;
//     case 'heading':
//     case 'heading2':
//       return <FiType className="h-6 w-6 text-teal-700" />;
//     default:
//       return <FiFileText className="h-6 w-6 text-gray-400" />;
//   }
// };

// const Sidebar: React.FC<SidebarProps> = ({
//   availableFields,
//   selectedField,
//   setSelectedField,
//   userToken,
//   updateField,
// }) => {
//   const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

//   useEffect(() => {
//     if (selectedField) {
//       console.log('🔄 Sidebar - Selected Field:', selectedField);
//       console.log('📏 Field Width:', selectedField.width);
//       setEditingField(selectedField);
//     }
//   }, [selectedField]);

//   const handleChange = (key: keyof FieldType, value: any) => {
//     console.log(`📝 Changing ${key} to:`, value);
//     setEditingField((prev) => {
//       if (!prev) return prev;
//       const updated = { ...prev, [key]: value };
//       console.log('🔄 Updated Field:', updated);
//       return updated;
//     });
//   };

//   const handleSave = () => {
//     if (!editingField) return;
//     console.log('💾 Saving Field:', editingField);
//     updateField(editingField);
//     toast.success('Field updated successfully');
//     setSelectedField(null);
//   };

//   const renderFieldEditor = (field: FieldType) => {
//     console.log('🎨 Rendering Editor for Field:', field);
    
//     // Common width input for all field types
//     const renderWidthInput = () => (
//       <div>
//         <Label htmlFor={`${field.type}-width`} value="Field Width (%) *"> Width </Label>
//         <TextInput
//           id={`${field.type}-width`}
//           type="number"
//           value={field.width !== undefined ? field.width : 100}
//           onChange={(e) => handleChange('width', Number(e.target.value))}
//           placeholder="Enter width percentage"
//           min="1"
//           max="100"
//           required
//         />
//         <p className="text-xs text-gray-500 mt-1">
//           Current Width: <span className="font-bold text-green-600">{field.width !== undefined ? field.width : 100}</span>
//         </p>
//       </div>
//     );

//     switch (field.type) {
//       case 'text':
//         return (
//           <>
//             {/* Label Input */}
//             <div>
//               <Label htmlFor="text-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="text-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Placeholder Input */}
//             <div>
//               <Label htmlFor="text-placeholder" value="Placeholder Text"> Placeholder </Label>
//               <TextInput
//                 id="text-placeholder"
//                 type="text"
//                 value={field.placeholder || ''}
//                 onChange={(e) => handleChange('placeholder', e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}

//             {/* Required Field */}
//             <div>
//               <Label htmlFor="text-required" value="Is this field required?"> Required </Label>
//               <Select
//                 id="text-required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {/* Conditional Validation Message */}
//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="text-validation" value="Validation Message *"> Validation Message </Label>
//                 <TextInput
//                   id="text-validation"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}
//           </>
//         );

//       case 'select':
//         return (
//           <>
//             {/* Name Input */}
//             <div>
//               <Label htmlFor="select-name" value="Field Name *"> Field Name </Label>
//               <TextInput
//                 id="select-name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter field name"
//                 required
//               />
//             </div>

//             {/* Label Input */}
//             <div>
//               <Label htmlFor="select-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="select-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}

//             {/* Required Field */}
//             <div>
//               <Label htmlFor="select-required" value="Is this field required?"> Required </Label>
//               <Select
//                 id="select-required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {/* Conditional Validation Message */}
//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="select-validation" value="Validation Message *"> Validation Message </Label>
//                 <TextInput
//                   id="select-validation"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}

//             {/* Table Selection */}
//             <div>
//               <Label htmlFor="select-table" value="Data Source Table"> Data Source Table </Label>
//               <Select
//                 id="select-table"
//                 value={field.table || ''}
//                 onChange={(e) => handleChange('table', e.target.value)}
//               >
//                 <option value="">Select Table</option>
//                 <option value="gender_table">Gender Table</option>
//                 <option value="country_table">Country Table</option>
//                 <option value="state_table">State Table</option>
//               </Select>
//             </div>
//           </>
//         );

//       case 'date':
//         return (
//           <>
//             {/* Name Input */}
//             <div>
//               <Label htmlFor="date-name" value="Field Name *"> Field Name </Label>
//               <TextInput
//                 id="date-name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter field name"
//                 required
//               />
//             </div>

//             {/* Label Input */}
//             <div>
//               <Label htmlFor="date-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="date-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Placeholder Input */}
//             <div>
//               <Label htmlFor="date-placeholder" value="Placeholder Text"> Placeholder </Label>
//               <TextInput
//                 id="date-placeholder"
//                 type="text"
//                 value={field.placeholder || ''}
//                 onChange={(e) => handleChange('placeholder', e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}

//             {/* Required Field */}
//             <div>
//               <Label htmlFor="date-required" value="Is this field required?"> Required </Label>
//               <Select
//                 id="date-required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {/* Conditional Validation Message */}
//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="date-validation" value="Validation Message *"> Validation Message </Label>
//                 <TextInput
//                   id="date-validation"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}

//             {/* Max Date Input */}
//             <div>
//               <Label htmlFor="date-max" value="Maximum Date"> Maximum Date </Label>
//               <TextInput
//                 id="date-max"
//                 type="text"
//                 value={field.max_date || ''}
//                 onChange={(e) => handleChange('max_date', e.target.value)}
//                 placeholder="YYYY-MM-DD or +1y, +1m, etc."
//               />
//             </div>
//           </>
//         );

//       case 'heading':
//       case 'heading2':
//         return (
//           <>
//             {/* Content Input */}
//             <div>
//               <Label htmlFor="heading-content" value="Heading Content *"> Heading Content </Label>
//               <Textarea
//                 id="heading-content"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter heading content"
//                 rows={4}
//                 required
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}
//           </>
//         );

//       case 'file_button':
//         return (
//           <>
//             {/* Name Input */}
//             <div>
//               <Label htmlFor="file-name" value="Field Name *"> Field Name </Label>
//               <TextInput
//                 id="file-name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter field name"
//                 required
//               />
//             </div>

//             {/* Label Input */}
//             <div>
//               <Label htmlFor="file-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="file-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Resolution Input */}
//             <div>
//               <Label htmlFor="file-resolution" value="Image Resolution"> Image Resolution </Label>
//               <TextInput
//                 id="file-resolution"
//                 type="text"
//                 value={field.resolution || ''}
//                 onChange={(e) => handleChange('resolution', e.target.value)}
//                 placeholder="e.g., 180x180, 300x300"
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}

//             {/* Button Text Input */}
//             <div>
//               <Label htmlFor="file-content" value="Button Text *"> Button Text </Label>
//               <TextInput
//                 id="file-content"
//                 type="text"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter button text"
//                 required
//               />
//             </div>

//             {/* Required Field */}
//             <div>
//               <Label htmlFor="file-required" value="Is this field required?"> Required </Label>
//               <Select
//                 id="file-required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {/* Conditional Validation Message */}
//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="file-validation" value="Validation Message *"> Validation Message </Label>
//                 <TextInput
//                   id="file-validation"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}
//           </>
//         );

//       case 'checkbox':
//         return (
//           <>
//             {/* Label Input */}
//             <div>
//               <Label htmlFor="checkbox-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="checkbox-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Content Input */}
//             <div>
//               <Label htmlFor="checkbox-content" value="Checkbox Text *"> Checkbox Text </Label>
//               <Textarea
//                 id="checkbox-content"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter checkbox text content"
//                 rows={3}
//                 required
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}

//             {/* Required Field */}
//             <div>
//               <Label htmlFor="checkbox-required" value="Is this field required?"> Required </Label>
//               <Select
//                 id="checkbox-required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {/* Conditional Validation Message */}
//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="checkbox-validation" value="Validation Message *"> Validation Message </Label>
//                 <TextInput
//                   id="checkbox-validation"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}
//           </>
//         );

//       default:
//         return (
//           <>
//             {/* Label Input */}
//             <div>
//               <Label htmlFor="default-label" value="Field Label *"> Text </Label>
//               <TextInput
//                 id="default-label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//                 required
//               />
//             </div>

//             {/* Width Input - AUTOFILLED */}
//             {renderWidthInput()}
//           </>
//         );
//     }
//   };

//   return (
//     <div
//       className="bg-white shadow-md p-4 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto"
//       style={{ width: 320, zIndex: 999 }}
//     >
//       {!selectedField ? (
//         <>
//           <h2 className="text-lg font-semibold mb-4">Field Types</h2>
//           <Droppable droppableId="sidebar" isDropDisabled>
//             {(provided) => (
//               <div
//                 ref={provided.innerRef}
//                 {...provided.droppableProps}
//                 className="grid grid-cols-2 gap-3"
//               >
//                 {availableFields.map((field, index) => (
//                   <Draggable
//                     key={`sidebar-${field.id}`}
//                     draggableId={`sidebar-${field.id}`}
//                     index={index}
//                   >
//                     {(providedDrag) => (
//                       <div
//                         ref={providedDrag.innerRef}
//                         {...providedDrag.draggableProps}
//                         {...providedDrag.dragHandleProps}
//                         className="flex flex-col items-center justify-center mb-2 p-2 bg-gray-100 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200"
//                         onClick={() => setSelectedField(field)}
//                       >
//                         <div className="mb-2">{getFieldIcon(field)}</div>
//                         <p className="text-sm font-medium text-center">{field.label}</p>
//                         <p className="text-xs text-gray-500 text-center">Type: {field.type}</p>
//                         <p className="text-xs text-gray-500 text-center">Width: {field.width}%</p>
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         </>
//       ) : (
//         <>
//           <div className="flex justify-between items-center mb-4">
//             <Button size="xs" color="gray" onClick={() => setSelectedField(null)}>
//               ← Back
//             </Button>
//             <h3 className="font-semibold text-lg">Field Settings</h3>
//           </div>
          
//           {/* Field Info Header */}
//           <div className="mb-6 p-3 bg-blue-50 rounded-md border border-blue-200">
//             <div className="flex justify-between items-center">
//               <div>
//                 <p className="text-sm font-medium text-blue-700">Field Type</p>
//                 <p className="text-lg font-semibold text-blue-800 capitalize">{editingField?.type}</p>
//               </div>
//               {/* <div className="text-right">
//                 <p className="text-sm font-medium text-blue-700">Current Width</p>
//                 <p className="text-lg font-bold text-green-600">
//                   {editingField?.width !== undefined ? editingField.width : 100}
//                 </p>
//               </div> */}
//             </div>
//           </div>

//           {/* Field Settings Form */}
//           <div className="space-y-4">
//             {editingField && renderFieldEditor(editingField)}
//           </div>
          
//           <Button className="w-full mt-6" color="blue" onClick={handleSave}>
//             Save Changes
//           </Button>
//         </>
//       )}
//     </div>
//   );
// };

// export default Sidebar;





















import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
import { FiFileText, FiCalendar, FiUpload, FiCheckSquare, FiChevronDown, FiType } from 'react-icons/fi';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

interface FieldType {
  id: number;
  label: string;
  type?: string;
  width?: number;
  placeholder?: string;
  required?: number;
  validation_message?: string;
  name?: string;
  max_date?: string;
  content?: string;
  resolution?: string;
  table?: string;
}

interface SidebarProps {
  availableFields: FieldType[];
  selectedField: FieldType | null;
  setSelectedField: (field: FieldType | null) => void;
  userToken?: string;
  updateField: (field: FieldType) => void;
}

const getFieldIcon = (field: FieldType) => {
  switch (field.type) {
    case 'text':
      return <FiFileText className="h-6 w-6 text-blue-700" />;
    case 'date':
      return <FiCalendar className="h-6 w-6 text-purple-700" />;
    case 'file_button':
      return <FiUpload className="h-6 w-6 text-green-700" />;
    case 'checkbox':
      return <FiCheckSquare className="h-6 w-6 text-yellow-700" />;
    case 'select':
      return <FiChevronDown className="h-6 w-6 text-orange-700" />;
    case 'heading':
    case 'heading2':
      return <FiType className="h-6 w-6 text-teal-700" />;
    default:
      return <FiFileText className="h-6 w-6 text-gray-400" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  availableFields,
  selectedField,
  setSelectedField,
  updateField,
}) => {
  const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

  useEffect(() => {
    if (selectedField) {
      setEditingField(selectedField);
    }
  }, [selectedField]);

  const handleChange = (key: keyof FieldType, value: any) => {
    setEditingField((prev) => {
      if (!prev) return prev;
      return { ...prev, [key]: value };
    });
  };

  const handleSave = () => {
    if (!editingField) return;
    updateField(editingField);
    toast.success('Field updated successfully');
    setSelectedField(null);
  };

  // 🔥 Width Dropdown Options
  const widthOptions = [5, 10, 15, 20, 25, 30,35, 40,45, 50,55,60,65,70, 75,80,85,90,95, 100];

  // 🔥 Width Dropdown Component (NEW)
  const renderWidthDropdown = (field: FieldType) => (
    <div>
      <Label htmlFor="width" value="Width (%) *">Width</Label>
      <Select
        id="width"
        value={field.width ?? 100}
        onChange={(e) => handleChange('width', Number(e.target.value))}
      >
        {widthOptions.map((w) => (
          <option key={w} value={w}>
            {w}%
          </option>
        ))}
      </Select>
    </div>
  );

  const renderFieldEditor = (field: FieldType) => {
    switch (field.type) {
      case 'text':
        return (
          <>
            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label value="Placeholder">Placeholder</Label>
              <TextInput
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label value="Required?">Required</Label>
              <Select
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label value="Validation Message *">Validation Message</Label>
                <TextInput
                  type="text"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                />
              </div>
            )}
          </>
        );

      case 'select':
        return (
          <>
            <div>
              <Label value="Field Name *">Field Name</Label>
              <TextInput
                type="text"
                value={field.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label value="Required?">Required</Label>
              <Select
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label value="Validation Message *">Validation Message</Label>
                <TextInput
                  type="text"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label value="Data Source Table">Table</Label>
              <Select
                value={field.table || ''}
                onChange={(e) => handleChange('table', e.target.value)}
              >
                <option value="">Select Table</option>
                <option value="gender_table">Gender Table</option>
                <option value="country_table">Country Table</option>
                <option value="state_table">State Table</option>
              </Select>
            </div>
          </>
        );

      case 'date':
        return (
          <>
            <div>
              <Label value="Field Name *">Field Name</Label>
              <TextInput
                type="text"
                value={field.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label value="Placeholder">Placeholder</Label>
              <TextInput
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label value="Required">Required</Label>
              <Select
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label value="Validation Message *">Validation Message</Label>
                <TextInput
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                />
              </div>
            )}

            <div>
              <Label value="Max Date">Max Date</Label>
              <TextInput
                value={field.max_date || ''}
                onChange={(e) => handleChange('max_date', e.target.value)}
              />
            </div>
          </>
        );

      case 'heading':
      case 'heading2':
        return (
          <>
            <div>
              <Label value="Heading Content *">Content</Label>
              <Textarea
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}
          </>
        );

      case 'file_button':
        return (
          <>
            <div>
              <Label value="Field Name *">Field Name</Label>
              <TextInput
                value={field.name || ''}
                onChange={(e) => handleChange('name', e.target.value)}
              />
            </div>

            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label value="Resolution">Resolution</Label>
              <TextInput
                value={field.resolution || ''}
                onChange={(e) => handleChange('resolution', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label value="Button Text">Button Text</Label>
              <TextInput
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>

            <div>
              <Label value="Required">Required</Label>
              <Select
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label value="Validation Message *">Validation Message</Label>
                <TextInput
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                />
              </div>
            )}
          </>
        );

      case 'checkbox':
        return (
          <>
            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            <div>
              <Label value="Checkbox Text *">Checkbox Text</Label>
              <Textarea
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label value="Required">Required</Label>
              <Select
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label value="Validation Message *">Validation Message</Label>
                <TextInput
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                />
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            <div>
              <Label value="Field Label *">Text</Label>
              <TextInput
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
              />
            </div>

            {renderWidthDropdown(field)}
          </>
        );
    }
  };

  return (
    <div
      className="bg-white shadow-md p-4 border-r border-gray-200 fixed top-0 left-0 h-screen overflow-y-auto"
      style={{ width: 320, zIndex: 999 }}
    >
      {!selectedField ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Field Types</h2>
          <Droppable droppableId="sidebar" isDropDisabled>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-3">
                {availableFields.map((field, index) => (
                  <Draggable key={`sidebar-${field.id}`} draggableId={`sidebar-${field.id}`} index={index}>
                    {(providedDrag) => (
                      <div
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                        className="flex flex-col items-center justify-center mb-2 p-2 bg-gray-100 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200"
                        onClick={() => setSelectedField(field)}
                      >
                        <div className="mb-2">{getFieldIcon(field)}</div>
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="text-xs text-gray-500">Type: {field.type}</p>
                        <p className="text-xs text-gray-500">Width: {field.width}%</p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </>
      ) : (
        <>
          <div className="flex justify-between mb-4">
            <Button size="xs" color="gray" onClick={() => setSelectedField(null)}>
              ← Back
            </Button>
            <h3 className="font-semibold text-lg">Field Settings</h3>
          </div>

          <div className="mb-6 p-3 bg-blue-50 rounded-md border">
            <p className="text-sm text-blue-700">Field Type</p>
            <p className="text-lg font-semibold capitalize">{editingField?.type}</p>
          </div>

          <div className="space-y-4">{editingField && renderFieldEditor(editingField)}</div>

          <Button className="w-full mt-6" color="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
