// import React, { useEffect, useState, memo } from 'react';
// import { Card, Spinner } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
// import Sidebar from './Sidebar'; // ✅ Import Sidebar

// const apiUrl = import.meta.env.VITE_API_URL;

// interface FieldType {
//   id: number;
//   label: string;
//   type?: string;
//   width?: number;
// }

// interface CardType {
//   id: number;
//   title: string;
//   description?: string;
//   width?: number;
//   children: FieldType[];
// }

// const ApplyEditing: React.FC = () => {
//   const { user } = useAuth();
//   const [applyCards, setApplyCards] = useState<CardType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCardId,setSelectedCardId] = useState(0);
//   const [selectedField, setSelectedField] = useState<FieldType | null>(null);

//   const [availableFields] = useState<FieldType[]>([
//     { id: 1, label: 'Text Field', type: 'text', width: 33 },
//     { id: 2, label: 'Email Field', type: 'email', width: 33 },
//     { id: 3, label: 'Select Dropdown', type: 'select', width: 50 },
//     { id: 4, label: 'Date Picker', type: 'date', width: 50 },
//     { id: 5, label: 'File Upload', type: 'file_button', width: 100 },
//     { id: 6, label: 'Heading', type: 'heading', width: 100 },
//     { id: 7, label: 'Small Heading', type: 'heading2', width: 100 },
//     { id: 8, label: 'Checkbox', type: 'checkbox', width: 100 },
//   ]);

//    const updateFieldInCard = (updatedField: FieldType) => {
//     setApplyCards((prevCards) =>
//       prevCards.map((card) =>
//         card.id === selectedCardId
//           ? {
//               ...card,
//               children: card.children.map((child) =>
//                 child.id === updatedField.id ? updatedField : child
//               ),
//             }
//           : card
//       )
//     );
//   };

//   useEffect(() => {
//     const fetchApplyPage = async () => {
//       setLoading(true);
//       try {
//         const response = await axios.post(
//           `${apiUrl}/${user?.role}/Editing/get-apply-page`,
//           { academic_id: 6 },
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data?.data) {
//           setApplyCards(response.data.data);
//         } else {
//           toast.error(response.data?.message || 'Failed to load apply page');
//         }
//       } catch (error) {
//         console.error('Error fetching apply page:', error);
//         toast.error('Error fetching apply page');
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (user?.token) fetchApplyPage();
//   }, [user]);

//   const handleDragEnd = (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;

//     if (source.droppableId === 'sidebar') {
//       const draggedField = availableFields.find(
//         (f) => `sidebar-${f.id}` === draggableId
//       );
//       if (!draggedField) return;

//       setApplyCards((prev) =>
//         prev.map((card) => {
//           if (destination.droppableId === `card-${card.id}`) {
//             const newField = { ...draggedField, id: Date.now() };
//             const newChildren = Array.from(card.children);
//             newChildren.splice(destination.index, 0, newField);
//             return { ...card, children: newChildren };
//           }
//           return card;
//         })
//       );
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center py-10">
//         <Spinner size="xl" />
//       </div>
//     );

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="flex w-full min-h-screen bg-gray-50">
//         <Sidebar
//           availableFields={availableFields}
//           selectedField={selectedField}
//           setSelectedField={setSelectedField}
//           updateField={updateFieldInCard}
//         />
//         <div className="flex-1 p-6 ml-[320px]">
//           <h2 className="text-2xl font-semibold mb-6">Dynamic Apply Page</h2>
//           <div className="grid gap-6 lg:grid-cols-12">
//             {applyCards.map((card) => (
//               <div key={card.id} className="lg:col-span-12">
//                 <Card className="shadow-md hover:shadow-lg cursor-pointer">
//                   <h3 className="text-lg font-bold mb-2">{card.title}</h3>
//                   <Droppable droppableId={`card-${card.id}`}>
//                     {(provided) => (
//                       <div
//                         {...provided.droppableProps}
//                         ref={provided.innerRef}
//                         className="grid grid-cols-3 gap-3 mt-3 min-h-[50px] p-2 border border-dashed border-gray-300 rounded-md"
//                       >
//                         {card.children.map((child, index) => (
//                           <Draggable
//                             key={child.id.toString()}
//                             draggableId={child.id.toString()}
//                             index={index}
//                           >
//                             {(providedDrag) => (
//                               <div
//                                 ref={providedDrag.innerRef}
//                                 {...providedDrag.draggableProps}
//                                 {...providedDrag.dragHandleProps}
//                                 className="bg-gray-100 p-3 rounded-md border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer"
//                                 onClick={() => {
//                                   setSelectedField(child);
//                                   setSelectedCardId(card.id);
//                                 }}
//                               >
//                                 <div>
//                                   <p className="text-sm font-medium">
//                                     {child.label}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Type: {child.type}
//                                   </p>
//                                 </div>
//                                 <span className="text-gray-400 cursor-move">
//                                   ☰
//                                 </span>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default ApplyEditing;



















// import React, { useEffect, useState, memo } from 'react';
// import { Card, Spinner, Button } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';
// import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
// import Sidebar from './Sidebar';
// import AllAcademicsDropdown from '../../Frontend/Common/AllAcademicsDropdown'; // Make sure this path is correct

// const apiUrl = import.meta.env.VITE_API_URL;

// interface FieldType {
//   id: number;
//   label: string;
//   type?: string;
//   width?: number;
// }

// interface CardType {
//   id: number;
//   title: string;
//   description?: string;
//   width?: number;
//   children: FieldType[];
// }

// const ApplyEditing: React.FC = () => {
//   const { user } = useAuth();
//   const [applyCards, setApplyCards] = useState<CardType[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCardId, setSelectedCardId] = useState(0);
//   const [selectedField, setSelectedField] = useState<FieldType | null>(null);
//   const [selectedAcademicId, setSelectedAcademicId] = useState<string>('6');
//   const [filters, setFilters] = useState({
//     academic: '6' // Default academic ID
//   });

//   const [availableFields] = useState<FieldType[]>([
//     { id: 1, label: 'Text Field', type: 'text', width: 33 },
//     { id: 2, label: 'Email Field', type: 'email', width: 33 },
//     { id: 3, label: 'Select Dropdown', type: 'select', width: 50 },
//     { id: 4, label: 'Date Picker', type: 'date', width: 50 },
//     { id: 5, label: 'File Upload', type: 'file_button', width: 100 },
//     { id: 6, label: 'Heading', type: 'heading', width: 100 },
//     { id: 7, label: 'Small Heading', type: 'heading2', width: 100 },
//     { id: 8, label: 'Checkbox', type: 'checkbox', width: 100 },
//   ]);

//   const updateFieldInCard = (updatedField: FieldType) => {
//     setApplyCards((prevCards) =>
//       prevCards.map((card) =>
//         card.id === selectedCardId
//           ? {
//               ...card,
//               children: card.children.map((child) =>
//                 child.id === updatedField.id ? updatedField : child
//               ),
//             }
//           : card
//       )
//     );
//   };

//   // Fetch apply page data based on academic ID
//   const fetchApplyPage = async (academicId: string) => {
//     setLoading(true);
//     try {
//       // For customeradmin, use their default academic ID
//       const academic_id = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
//         ? academicId 
//         : user?.academic_id || '6';

//       console.log('Fetching data for academic_id:', academic_id);

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Editing/get-apply-page`,
//         { academic_id: parseInt(academic_id) },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data?.data) {
//         setApplyCards(response.data.data);
//         toast.success('Data loaded successfully');
//       } else {
//         toast.error(response.data?.message || 'Failed to load apply page');
//       }
//     } catch (error) {
//       console.error('Error fetching apply page:', error);
//       toast.error('Error fetching apply page');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle academic dropdown change
//   const handleAcademicChange = (academicId: string) => {
//     console.log('Academic changed to:', academicId);
//     setSelectedAcademicId(academicId);
//     fetchApplyPage(academicId);
//   };

//   // Handle publish button click
//   const handlePublish = async () => {
//     try {
//       const academic_id = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
//         ? selectedAcademicId 
//         : user?.academic_id || '6';

//       console.log('Publishing with academic_id:', academic_id);
      
//       // Dummy API call for publishing
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Editing/publish-apply-page`,
//         { 
//           academic_id: parseInt(academic_id),
//           cards: applyCards 
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (response.data?.success) {
//         toast.success('Apply page published successfully!');
//       } else {
//         toast.error(response.data?.message || 'Failed to publish apply page');
//       }
//     } catch (error) {
//       console.error('Error publishing apply page:', error);
//       toast.error('Error publishing apply page');
//     }
//   };

//   // Update selectedAcademicId when filters change
//   useEffect(() => {
//     if (filters.academic && filters.academic !== selectedAcademicId) {
//       setSelectedAcademicId(filters.academic);
//       fetchApplyPage(filters.academic);
//     }
//   }, [filters.academic]);

//   useEffect(() => {
//     // Initial fetch with default academic ID
//     if (user?.token) {
//       const defaultAcademicId = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
//         ? '6'
//         : user?.academic_id || '6';
      
//       setSelectedAcademicId(defaultAcademicId);
//       setFilters(prev => ({ ...prev, academic: defaultAcademicId }));
//       fetchApplyPage(defaultAcademicId);
//     }
//   }, [user]);

//   const handleDragEnd = (result: DropResult) => {
//     const { destination, source, draggableId } = result;
//     if (!destination) return;

//     if (source.droppableId === 'sidebar') {
//       const draggedField = availableFields.find(
//         (f) => `sidebar-${f.id}` === draggableId
//       );
//       if (!draggedField) return;

//       setApplyCards((prev) =>
//         prev.map((card) => {
//           if (destination.droppableId === `card-${card.id}`) {
//             const newField = { ...draggedField, id: Date.now() };
//             const newChildren = Array.from(card.children);
//             newChildren.splice(destination.index, 0, newField);
//             return { ...card, children: newChildren };
//           }
//           return card;
//         })
//       );
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center py-10">
//         <Spinner size="xl" />
//       </div>
//     );

//   return (
//     <DragDropContext onDragEnd={handleDragEnd}>
//       <div className="flex w-full min-h-screen bg-gray-50">
//         <Sidebar
//           availableFields={availableFields}
//           selectedField={selectedField}
//           setSelectedField={setSelectedField}
//           updateField={updateFieldInCard}
//         />
//         <div className="flex-1 p-6 ml-[320px]">
//           {/* Header Section */}
//           <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300 shadow-md hover:shadow-lg cursor-pointer">
//             <div className="flex items-center gap-4 flex-1">
//               {/* Show dropdown only for SuperAdmin and SupportAdmin */}
//               {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//                 <div className="relative w-full sm:w-auto">
//                   <AllAcademicsDropdown
//                     name="academic"
//                     formData={filters}
//                     setFormData={setFilters}
//                     includeAllOption
//                     label=""
//                     className="min-w-[250px] text-sm"
//                   />
//                 </div>
//               )}
              
//               {/* For customeradmin, show their academic name if available */}
//               {!(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
//                 <div className="text-lg font-semibold text-gray-700">
//                   {user?.academic_name ? `Academic: ${user.academic_name}` : 'Apply Page Editor'}
//                 </div>
//               )}
//             </div>
            
//             {/* Publish Button */}
//             <Button
//               onClick={handlePublish}
//               className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 px-6"
//             >
//               Publish
//             </Button>
//           </div>

//           <h2 className="text-2xl font-semibold mb-6">Dynamic Apply Page</h2>

//           <div className="grid gap-6 lg:grid-cols-12">
//             {applyCards.map((card) => (
//               <div key={card.id} className="lg:col-span-12">
//                 <Card className="shadow-md hover:shadow-lg cursor-pointer">
//                   <h3 className="text-lg font-bold mb-2">{card.title}</h3>
//                   <Droppable droppableId={`card-${card.id}`}>
//                     {(provided) => (
//                       <div
//                         {...provided.droppableProps}
//                         ref={provided.innerRef}
//                         className="grid grid-cols-3 gap-3 mt-3 min-h-[50px] p-2 border border-dashed border-gray-300 rounded-md"
//                       >
//                         {card.children.map((child, index) => (
//                           <Draggable
//                             key={child.id.toString()}
//                             draggableId={child.id.toString()}
//                             index={index}
//                           >
//                             {(providedDrag) => (
//                               <div
//                                 ref={providedDrag.innerRef}
//                                 {...providedDrag.draggableProps}
//                                 {...providedDrag.dragHandleProps}
//                                 className="bg-gray-100 p-3 rounded-md border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer"
//                                 onClick={() => {
//                                   setSelectedField(child);
//                                   setSelectedCardId(card.id);
//                                 }}
//                               >
//                                 <div>
//                                   <p className="text-sm font-medium">
//                                     {child.label}
//                                   </p>
//                                   <p className="text-xs text-gray-500">
//                                     Type: {child.type}
//                                   </p>
//                                 </div>
//                                 <span className="text-gray-400 cursor-move">
//                                   ☰
//                                 </span>
//                               </div>
//                             )}
//                           </Draggable>
//                         ))}
//                         {provided.placeholder}
//                       </div>
//                     )}
//                   </Droppable>
//                 </Card>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </DragDropContext>
//   );
// };

// export default ApplyEditing;

















import React, { useEffect, useState, memo } from 'react';
import { Card, Spinner, Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Sidebar from './Sidebar';
import AllAcademicsDropdown from '../../Frontend/Common/AllAcademicsDropdown';

const apiUrl = import.meta.env.VITE_API_URL;

interface FieldType {
  id: number;
  label: string;
  type?: string;
  width?: number;
}

interface CardType {
  id: number;
  title: string;
  description?: string;
  width?: number;
  children: FieldType[];
}

const ApplyEditing: React.FC = () => {
  const { user } = useAuth();
  const [applyCards, setApplyCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [selectedAcademicId, setSelectedAcademicId] = useState<string>('6');
  const [filters, setFilters] = useState({
    academic: '6'
  });

  const [availableFields] = useState<FieldType[]>([
    { id: 1, label: 'Text Field', type: 'text', width: 33 },
    { id: 2, label: 'Email Field', type: 'email', width: 33 },
    { id: 3, label: 'Select Dropdown', type: 'select', width: 50 },
    { id: 4, label: 'Date Picker', type: 'date', width: 50 },
    { id: 5, label: 'File Upload', type: 'file_button', width: 100 },
    { id: 6, label: 'Heading', type: 'heading', width: 100 },
    { id: 7, label: 'Small Heading', type: 'heading2', width: 100 },
    { id: 8, label: 'Checkbox', type: 'checkbox', width: 100 },
  ]);

  const updateFieldInCard = (updatedField: FieldType) => {
    setApplyCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedCardId
          ? {
              ...card,
              children: card.children.map((child) =>
                child.id === updatedField.id ? updatedField : child
              ),
            }
          : card
      )
    );
  };

  // Fetch apply page data based on academic ID
  const fetchApplyPage = async (academicId: string) => {
    setLoading(true);
    try {
      const academic_id = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
        ? academicId 
        : user?.academic_id || '6';

      console.log('Fetching data for academic_id:', academic_id);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Editing/get-apply-page`,
        { academic_id: parseInt(academic_id) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.data) {
        setApplyCards(response.data.data);
        toast.success('Data loaded successfully');
      } else {
        toast.error(response.data?.message || 'Failed to load apply page');
      }
    } catch (error) {
      console.error('Error fetching apply page:', error);
      toast.error('Error fetching apply page');
    } finally {
      setLoading(false);
    }
  };

  // Handle academic dropdown change
  const handleAcademicChange = (academicId: string) => {
    console.log('Academic changed to:', academicId);
    setSelectedAcademicId(academicId);
    fetchApplyPage(academicId);
  };

  // Handle publish button click
  const handlePublish = async () => {
    try {
      const academic_id = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
        ? selectedAcademicId 
        : user?.academic_id || '6';

      console.log('Publishing with academic_id:', academic_id);
      
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Editing/publish-apply-page`,
        { 
          academic_id: parseInt(academic_id),
          cards: applyCards 
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.success) {
        toast.success('Apply page published successfully!');
      } else {
        toast.error(response.data?.message || 'Failed to publish apply page');
      }
    } catch (error) {
      console.error('Error publishing apply page:', error);
      toast.error('Error publishing apply page');
    }
  };

  // Update selectedAcademicId when filters change
  useEffect(() => {
    if (filters.academic && filters.academic !== selectedAcademicId) {
      setSelectedAcademicId(filters.academic);
      fetchApplyPage(filters.academic);
    }
  }, [filters.academic]);

  useEffect(() => {
    // Initial fetch with default academic ID
    if (user?.token) {
      const defaultAcademicId = user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
        ? '6'
        : user?.academic_id || '6';
      
      setSelectedAcademicId(defaultAcademicId);
      setFilters(prev => ({ ...prev, academic: defaultAcademicId }));
      fetchApplyPage(defaultAcademicId);
    }
  }, [user]);

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (source.droppableId === 'sidebar') {
      const draggedField = availableFields.find(
        (f) => `sidebar-${f.id}` === draggableId
      );
      if (!draggedField) return;

      setApplyCards((prev) =>
        prev.map((card) => {
          if (destination.droppableId === `card-${card.id}`) {
            // Create a new field with proper type information for backend
            const newField = { 
              ...draggedField, 
              id: Date.now(),
              type: draggedField.type, // Ensure type is preserved
              label: draggedField.label,
              width: draggedField.width
            };
            const newChildren = Array.from(card.children);
            newChildren.splice(destination.index, 0, newField);
            return { ...card, children: newChildren };
          }
          return card;
        })
      );
    }
  };

  if (loading)
    return (
      <div className="flex justify-center py-10">
        <Spinner size="xl" />
      </div>
    );

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar
          availableFields={availableFields}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          updateField={updateFieldInCard}
        />
        <div className="flex-1 p-6 ml-[320px]">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300 shadow-md hover:shadow-lg cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
              {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
                <div className="relative w-full sm:w-auto">
                  <AllAcademicsDropdown
                    name="academic"
                    formData={filters}
                    setFormData={setFilters}
                    includeAllOption
                    label=""
                    className="min-w-[250px] text-sm"
                  />
                </div>
              )}
              
              {!(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') && (
                <div className="text-lg font-semibold text-gray-700">
                  {user?.academic_name ? `Academic: ${user.academic_name}` : 'Apply Page Editor'}
                </div>
              )}
            </div>
            
            <Button
              onClick={handlePublish}
              className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 px-6"
            >
              Publish
            </Button>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Dynamic Apply Page</h2>

          <div className="grid gap-6 lg:grid-cols-12">
            {applyCards.map((card) => (
              <div key={card.id} className="lg:col-span-12">
                <Card className="shadow-md hover:shadow-lg cursor-pointer">
                  <h3 className="text-lg font-bold mb-2">{card.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Card Width: {card.width || 100}
                  </p>
                  <Droppable droppableId={`card-${card.id}`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="grid grid-cols-3 gap-3 mt-3 min-h-[50px] p-2 border border-dashed border-gray-300 rounded-md"
                      >
                        {card.children.map((child, index) => (
                          <Draggable
                            key={child.id.toString()}
                            draggableId={child.id.toString()}
                            index={index}
                          >
                            {(providedDrag) => (
                              <div
                                ref={providedDrag.innerRef}
                                {...providedDrag.draggableProps}
                                {...providedDrag.dragHandleProps}
                                className="bg-gray-100 p-3 rounded-md border border-gray-200 shadow-sm flex items-center justify-between cursor-pointer"
                                style={{ width: `${child.width || 100}%` }}
                                onClick={() => {
                                  setSelectedField(child);
                                  setSelectedCardId(card.id);
                                }}
                              >
                                <div>
                                  <p className="text-sm font-medium">
                                    {child.label}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Type: {child.type} | Width: {child.width || 100}
                                  </p>
                                </div>
                                <span className="text-gray-400 cursor-move">
                                  ☰
                                </span>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
};

export default ApplyEditing;