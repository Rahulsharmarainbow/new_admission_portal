import React, { useEffect, useState, memo } from 'react';
import { Card, Spinner, Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import Sidebar from './Sidebar';
import AllAcademicsDropdown from '../../Frontend/Common/AllAcademicsDropdown';
import Loader from 'src/Frontend/Common/Loader';
import PreviewForm from './PreviewForm';

const apiUrl = import.meta.env.VITE_API_URL;

interface FieldType {
  id: number;
  label: string;
  type?: string;
  width?: number;
  type_new?: number;
  placeholder?: string;
  required?: number;
  validation_message?: string;
  name?: string;
  max_date?: string;
  content?: string;
  resolution?: string;
  tbl?: string;
  sequence?: number;
  validation?: string;
}

interface CardType {
  id: number;
  title: string;
  description?: string;
  width?: number;
  gap?: number;
  justify?: string;
  sequence?: number;
  children: FieldType[];
  type_new?: number; // New field for section tracking
}

interface TableOption {
  id: number;
  type: string;
  academic_id: number;
}

const ApplyEditing: React.FC = () => {
  const { user } = useAuth();
  const [applyCards, setApplyCards] = useState<CardType[]>([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(false); // New state for publish loader
  const [selectedCardId, setSelectedCardId] = useState(0);
  const [selectedField, setSelectedField] = useState<FieldType | null>(null);
  const [selectedAcademicId, setSelectedAcademicId] = useState<string>('');
  const [filters, setFilters] = useState({
    academic: '',
  });
  const [tableOptions, setTableOptions] = useState<TableOption[]>([]);
  const [deletedFieldIds, setDeletedFieldIds] = useState<number[]>([]);
  const [deletedCardIds, setDeletedCardIds] = useState<number[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  // Width options for dropdown
  const widthOptions = [
    5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100,
  ];

  const [availableFields] = useState<FieldType[]>([
    { id: 1, label: 'Text Field', type: 'text', width: 25 },
    // { id: 2, label: 'Email Field', type: 'email', width: 25 },
    { id: 3, label: 'Select Dropdown', type: 'select', width: 50 },
    { id: 4, label: 'Date Picker', type: 'date', width: 50 },
    { id: 5, label: 'File Upload', type: 'file_button', width: 100 },
    { id: 6, label: 'Heading', type: 'heading', width: 100 },
    { id: 7, label: 'Small Heading', type: 'heading2', width: 100 },
    { id: 8, label: 'Checkbox', type: 'checkbox', width: 100 },
    { id: 9, label: 'Aadhaar Card', type: 'adhar', width: 80 },
    { id: 10, label: 'Textarea', type: 'textarea', width: 100 }, 
  ]);

  // Fetch table options for select dropdown
  const fetchTableOptions = async (academicId: string) => {
    if(!academicId) return
    try {
      const academic_id =
        user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
          ? academicId
          : user?.academic_id || '';

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Type/dropdown-type`,
        {
          academic_id: parseInt(academic_id),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.data) {
        setTableOptions(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching table options:', error);
    }
  };

  const updateFieldInCard = (updatedField: FieldType) => {
    setApplyCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedCardId
          ? {
              ...card,
              children: card.children.map((child) =>
                child.id === updatedField.id
                  ? { ...updatedField, type_new: child.type_new === 1 ? 1 : 2 }
                  : child,
              ),
            }
          : card,
      ),
    );
  };

  // Delete field from card
  const deleteFieldFromCard = (fieldId: number) => {
    setApplyCards((prevCards) =>
      prevCards.map((card) =>
        card.id === selectedCardId
          ? {
              ...card,
              children: card.children.filter((child) => {
                if (child.id === fieldId) {
                  if (fieldId) {
                    setDeletedFieldIds((prev) => [...prev, fieldId]);
                  }
                  return false;
                }
                return true;
              }),
            }
          : card,
      ),
    );
    setSelectedField(null);
    toast.success('Field deleted successfully');
  };

  // Add new section (card)
  const addNewSection = () => {
    const newSection: CardType = {
      id: Date.now(), // High ID for new cards
      title: `New Section ${applyCards.length + 1}`,
      width: 100,
      gap: 1,
      justify: 'start',
      sequence: applyCards.length + 1,
      children: [],
      type_new: 1, // Mark as new section
    };
    setApplyCards((prev) => [...prev, newSection]);
    toast.success('New section added successfully');
  };

  // Update section settings
  const updateSectionSettings = (sectionId: number, updates: Partial<CardType>) => {
    setApplyCards((prevCards) =>
      prevCards.map((card) => 
        card.id === sectionId ? { 
          ...card, 
          ...updates,
          type_new: card.type_new === 1 ? 1 : 2 // Mark as updated if not new
        } : card
      ),
    );
  };

  // Delete section - Alert removed
  const deleteSection = (sectionId: number) => {
    // Add to deleted card IDs if it's an existing card (not new)
    if (sectionId < 1000) {
      setDeletedCardIds((prev) => [...prev, sectionId]);
    }

    // Also add all fields in this section to deleted field IDs
    const cardToDelete = applyCards.find((card) => card.id === sectionId);
    if (cardToDelete) {
      const existingFieldIds = cardToDelete.children
        .filter((field) => field.id < 1000)
        .map((field) => field.id);
      setDeletedFieldIds((prev) => [...prev, ...existingFieldIds]);
    }

    setApplyCards((prev) => prev.filter((card) => card.id !== sectionId));
    toast.success('Section deleted successfully');
  };

  // Fetch apply page data based on academic ID
  const fetchApplyPage = async (academicId: string) => {
    if(!academicId) return
    setLoading(true);
    try {
      const academic_id =
        user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
          ? academicId
          : user?.academic_id || '';

      console.log('Fetching data for academic_id:', academic_id);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Editing/get-apply-page`,
        { academic_id: parseInt(academic_id) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.data) {
        // Add sequence to cards if not present and set type_new to 0 for existing cards
        const cardsWithSequence = response.data.data.map((card: CardType, index: number) => ({
          ...card,
          sequence: card.sequence || index + 1,
          type_new: 0, // Mark existing cards as unchanged
        }));
        setApplyCards(cardsWithSequence);
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
    setFilters((prev) => ({ ...prev, academic: academicId }));
    fetchApplyPage(academicId);
    fetchTableOptions(academicId);
  };

  // Handle publish button click
  const handlePublish = async () => {
    setPublishing(true); 
    try {
      const academic_id =
        user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
          ? selectedAcademicId
          : user?.academic_id || '';

      console.log('Publishing with academic_id:', academic_id);

      const payload = {
        academic_id: parseInt(academic_id),
        cards: applyCards.map((card) => ({
          ...card,
          children: card.children.map((child) => ({
            ...child,
            type_new: child.type_new || 0,
          })),
          type_new: card.type_new || 0, // Send section type_new
        })),
        delete_ids: deletedFieldIds,
        delete_card_ids: deletedCardIds, // Send deleted card IDs
      };

      console.log('Publishing payload:', payload);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/Editing/publish-apply-page`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data?.status) {
        // Reset deleted IDs after successful publish
        setDeletedFieldIds([]);
        setDeletedCardIds([]);
        toast.success('Apply page published successfully!');
        fetchApplyPage(selectedAcademicId);
      } else {
        toast.error(response.data?.message || 'Failed to publish apply page');
      }
    } catch (error) {
      console.error('Error publishing apply page:', error);
      toast.error('Error publishing apply page');
    } finally {
      setPublishing(false); // Stop loader
    }
  };

  // Update selectedAcademicId when filters change
  useEffect(() => {
    if (filters.academic && filters.academic !== selectedAcademicId) {
      setSelectedAcademicId(filters.academic);
      fetchApplyPage(filters.academic);
      fetchTableOptions(filters.academic);
    }
  }, [filters.academic]);

  useEffect(() => {
    // Initial fetch with default academic ID
    if (user?.token) {
      const defaultAcademicId =
        user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin'
          ? filters.academic || ''
          : user?.academic_id || '';

      setSelectedAcademicId(defaultAcademicId);
      setFilters((prev) => ({ ...prev, academic: defaultAcademicId }));
      fetchApplyPage(defaultAcademicId);
      fetchTableOptions(defaultAcademicId);
    }
  }, [user]);

const handleDragEnd = (result: DropResult) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  console.log('Drag result:', { source, destination, draggableId });

  // If dragging from sidebar to card
  if (source.droppableId === 'sidebar') {
    // Extract the field ID from the draggableId (format: "sidebar-1")
    const fieldId = parseInt(draggableId.replace('sidebar-', ''));
    const draggedField = availableFields.find((f) => f.id === fieldId);

    console.log('Dragging from sidebar:', { fieldId, draggedField });

    if (!draggedField) {
      console.error('Field not found:', fieldId);
      return;
    }

    setApplyCards((prev) =>
      prev.map((card) => {
        if (destination.droppableId === `card-${card.id}`) {
          console.log('Adding field to card:', card.id);
          
          // Generate a unique field name based on type and timestamp
          const generateFieldName = (type: string) => {
            const baseName = type.toLowerCase();
            const timestamp = Date.now();
            return `${baseName}_${timestamp}`;
          };

          // Create a new field with proper type information for backend
          const newField: FieldType = {
            ...draggedField,
            id: Date.now(), // High ID for new fields
            type: draggedField.type,
            label: draggedField.label,
            width: draggedField.width, // Auto-fill width from availableFields
            type_new: 1, // Mark as new field
            sequence: destination.index + 1, // Set sequence based on position
            name: generateFieldName(draggedField.type || 'field'), // Generate unique name
            required: 0, // Default to not required
            validation: draggedField.type === 'text' ? '' : undefined, 
            validation_message: '', // Empty validation message by default
            placeholder: '', // Empty placeholder by default
          };

          const newChildren = Array.from(card.children);
          newChildren.splice(destination.index, 0, newField);
          
          // Update sequences for all fields in this card
          const updatedChildren = newChildren.map((child, index) => ({
            ...child,
            sequence: index + 1,
          }));

          return { 
            ...card, 
            children: updatedChildren,
            type_new: card.type_new === 1 ? 1 : 2 // Mark section as updated
          };
        }
        return card;
      }),
    );
  }

  // If reordering fields within the same card
  if (source.droppableId === destination.droppableId && source.droppableId.startsWith('card-')) {
    const cardId = parseInt(source.droppableId.replace('card-', ''));

    setApplyCards((prev) =>
      prev.map((card) => {
        if (card.id === cardId) {
          const newChildren = Array.from(card.children);
          const [movedField] = newChildren.splice(source.index, 1);
          newChildren.splice(destination.index, 0, {
            ...movedField,
            type_new: movedField.type_new === 1 ? 1 : 2, // Keep as new or mark as updated
          });

          // Update sequences for all fields in this card
          const updatedChildren = newChildren.map((child, index) => ({
            ...child,
            sequence: index + 1,
          }));

          return { 
            ...card, 
            children: updatedChildren,
            type_new: card.type_new === 1 ? 1 : 2 // Mark section as updated
          };
        }
        return card;
      }),
    );
  }

  // If moving field between different cards
  if (
    source.droppableId !== destination.droppableId &&
    source.droppableId.startsWith('card-') &&
    destination.droppableId.startsWith('card-')
  ) {
    const sourceCardId = parseInt(source.droppableId.replace('card-', ''));
    const destCardId = parseInt(destination.droppableId.replace('card-', ''));

    setApplyCards((prev) => {
      const newCards = [...prev];
      const sourceCard = newCards.find((card) => card.id === sourceCardId);
      const destCard = newCards.find((card) => card.id === destCardId);

      if (sourceCard && destCard) {
        const [movedField] = sourceCard.children.splice(source.index, 1);
        destCard.children.splice(destination.index, 0, {
          ...movedField,
          type_new: movedField.type_new === 1 ? 1 : 2,
        });
        
        // Update sequences for both source and destination cards
        sourceCard.children = sourceCard.children.map((child, index) => ({
          ...child,
          sequence: index + 1,
        }));

        destCard.children = destCard.children.map((child, index) => ({
          ...child,
          sequence: index + 1,
        }));
        
        // Mark both source and destination cards as updated
        sourceCard.type_new = sourceCard.type_new === 1 ? 1 : 2;
        destCard.type_new = destCard.type_new === 1 ? 1 : 2;
      }

      return newCards;
    });
  }

  // If reordering sections
  if (source.droppableId === 'sections' && destination.droppableId === 'sections') {
    // Create a new array to avoid mutating state directly
    const reorderedCards = Array.from(applyCards);

    // Remove the card from its original position
    const [movedCard] = reorderedCards.splice(source.index, 1);

    // Insert it at the new position
    reorderedCards.splice(destination.index, 0, movedCard);

    // Update sequence numbers based on new order and mark as updated
    const updatedCards = reorderedCards.map((card, index) => ({
      ...card,
      sequence: index + 1,
      type_new: card.type_new === 1 ? 1 : 2, // Mark as updated
    }));

    // Update state with the reordered cards
    setApplyCards(updatedCards);
  }
};

  // Show loader in center when loading
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen min-w-screen">
        <Loader />
      </div>
    );
  }

  // Show message when no academic is selected
  if (!selectedAcademicId && (user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin')) {
    return (
      <div className="flex w-full min-h-screen bg-gray-50">
        <div className="flex-1 p-6">
          <div className="flex justify-between items-center mb-6 bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-300 shadow-md hover:shadow-lg cursor-pointer">
            <div className="flex items-center gap-4 flex-1">
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
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-600 mb-4">
                Please Select an Academic First
              </h2>
              <p className="text-gray-500">
                Choose an academic from the dropdown above to start editing the apply page.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex w-full min-h-screen bg-gray-50">
        <Sidebar
          availableFields={availableFields}
          selectedField={selectedField}
          setSelectedField={setSelectedField}
          updateField={updateFieldInCard}
          deleteField={deleteFieldFromCard}
          tableOptions={tableOptions}
          applyCards={applyCards} 
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

            <div className="flex gap-2">
              <div className="flex gap-3 mb-6">
                <Button
                  onClick={() => window.history.back()}
                  color={'alternative'}
                >
                  Back
                </Button>

                <Button
                  onClick={() => setShowPreview(true)}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                >
                  Preview
                </Button>
              </div>
              <Button
                onClick={handlePublish}
                disabled={publishing} // Disable button when publishing
                className="bg-blue-600 hover:bg-blue-700 focus:ring-blue-300 px-6 flex items-center gap-2"
              >
                {publishing ? (
                  <>
                    <Spinner size="sm" />
                    Publishing...
                  </>
                ) : (
                  'Publish'
                )}
              </Button>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6">Dynamic Apply Page</h2>

          {/* Sections with Drag & Drop */}
          <Droppable droppableId="sections" type="SECTION">
            {(provided, snapshot) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className={`space-y-6 ${
                  snapshot.isDraggingOver ? 'bg-blue-50 rounded-lg p-4' : ''
                }`}
              >
                {applyCards
                  .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                  .map((card, index) => {
                    const cardWidth = card.width || 100;
                    const cardWidthValue =
                      typeof cardWidth === 'string'
                        ? parseInt(cardWidth.replace('%', ''))
                        : cardWidth;

                    const getGridCols = () => {
                      if (cardWidthValue >= 70 && cardWidthValue <= 80) return 'lg:col-span-9';
                      if (cardWidthValue >= 20 && cardWidthValue <= 30) return 'lg:col-span-3';
                      if (cardWidthValue >= 45 && cardWidthValue <= 55) return 'lg:col-span-6';
                      return 'lg:col-span-12';
                    };

                    return (
                      <Draggable key={card.id} draggableId={`section-${card.id}`} index={index}>
                        {(providedDrag, snapshotDrag) => (
                          <div
                            ref={providedDrag.innerRef}
                            {...providedDrag.draggableProps}
                            className={`col-span-12 ${getGridCols()} ${
                              snapshotDrag.isDragging ? 'opacity-50' : ''
                            }`}
                          >
                            <Card
                              className={`shadow-md hover:shadow-lg cursor-pointer border border-gray-200 relative ${
                                snapshotDrag.isDragging ? 'ring-2 ring-blue-500' : ''
                              }`}
                            >
                              {/* Section Header with Drag Handle */}
                              <div
                                {...providedDrag.dragHandleProps}
                                className="flex justify-between items-center mb-4 p-3 bg-gray-50 rounded-lg cursor-move"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-gray-400">☰</span>
                                  <h3 className="text-lg font-bold">{card.title}</h3>
                                  <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                    Sequence: {card.sequence || index + 1}
                                  </span>
                                  {card.type_new === 1 && (
                                    <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full">
                                      New Section
                                    </span>
                                  )}
                                  {card.type_new === 2 && (
                                    <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full">
                                      Updated
                                    </span>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="xs"
                                    color="failure"
                                    onClick={() => deleteSection(card.id)}
                                  >
                                    Delete Section
                                  </Button>
                                </div>
                              </div>

                              {/* Section Settings */}
                              <div className="flex gap-4 mb-4 p-3 bg-blue-50 rounded-lg">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Width (%)
                                  </label>
                                  <select
                                    value={cardWidthValue}
                                    onChange={(e) => {
                                      const val = parseInt(e.target.value);
                                      updateSectionSettings(card.id, { width: val });
                                    }}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm bg-white"
                                  >
                                    {widthOptions.map((width) => (
                                      <option key={width} value={width}>
                                        {width}%
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gap
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    max="10"
                                    value={card.gap || 1}
                                    onChange={(e) =>
                                      updateSectionSettings(card.id, {
                                        gap: parseInt(e.target.value),
                                      })
                                    }
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Justify
                                  </label>
                                  <select
                                    value={card.justify || 'start'}
                                    onChange={(e) =>
                                      updateSectionSettings(card.id, { justify: e.target.value })
                                    }
                                    className="w-32 px-2 py-1 border border-gray-300 rounded text-sm"
                                  >
                                    <option value="start">Start</option>
                                    <option value="center">Center</option>
                                    <option value="end">End</option>
                                    <option value="between">Between</option>
                                  </select>
                                </div>
                              </div>

                              <Droppable droppableId={`card-${card.id}`} type="FIELD">
                                {(providedDroppable, snapshotDroppable) => (
                                  <div
                                    {...providedDroppable.droppableProps}
                                    ref={providedDroppable.innerRef}
                                    className={`w-full min-h-[100px] p-3 border-2 border-dashed rounded-lg transition-all ${
                                      snapshotDroppable.isDraggingOver
                                        ? 'border-blue-400 bg-blue-50'
                                        : 'border-gray-300 bg-gray-50'
                                    }`}
                                  >
                                    {/* Fields Grid */}
                                    <div
                                      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 w-full"
                                      style={{
                                        gap: `${card.gap || 1}rem`,
                                        justifyContent: card.justify || 'start',
                                      }}
                                    >
                                      {card.children.map((child, childIndex) => {
                                        const childWidth = child.width || 100;
                                        const childWidthValue =
                                          typeof childWidth === 'string'
                                            ? parseInt(childWidth.replace('%', ''))
                                            : childWidth;

                                        // Calculate column span based on width percentage
                                        const getColumnSpan = () => {
                                          // Width-based spans
                                          if (childWidthValue >= 80) return 'full';
                                          if (childWidthValue >= 60) return 'span-2';
                                          if (childWidthValue >= 40) return 'span-2';
                                          if (childWidthValue >= 30) return 'span-1';
                                          if (childWidthValue >= 20) return 'span-1';
                                          return 'span-1';
                                        };

                                        const spanClass = {
                                          full: 'col-span-full',
                                          'span-2': 'sm:col-span-2 lg:col-span-2',
                                          'span-1': 'sm:col-span-1 lg:col-span-1',
                                        }[getColumnSpan()];

                                        return (
                                          <Draggable
                                            key={child.id.toString()}
                                            draggableId={child.id.toString()}
                                            index={childIndex}
                                          >
                                            {(providedDragField, snapshotDrag) => (
                                              <div
                                                ref={providedDragField.innerRef}
                                                {...providedDragField.draggableProps}
                                                {...providedDragField.dragHandleProps}
                                                className={`${spanClass} transition-all duration-200 min-w-[150px]`}
                                                style={{
                                                  ...providedDragField.draggableProps.style,
                                                }}
                                              >
                                                <div
                                                  className={`p-3 rounded-md border shadow-sm flex items-center justify-between cursor-pointer transition-all ${
                                                    snapshotDrag.isDragging
                                                      ? 'bg-blue-100 border-blue-400 shadow-lg transform scale-105'
                                                      : 'bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
                                                  } ${
                                                    selectedField?.id === child.id
                                                      ? 'ring-2 ring-blue-500'
                                                      : ''
                                                  }`}
                                                  onClick={() => {
                                                    setSelectedField(child);
                                                    setSelectedCardId(card.id);
                                                  }}
                                                >
                                                  <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-800">
                                                      {child.label || child.type}
                                                    </p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                      Type: {child.type} | Width: {childWidthValue}%
                                                    </p>
                                                    {child.type_new === 1 && (
                                                      <span className="text-xs text-green-600 font-semibold bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                                                        New
                                                      </span>
                                                    )}
                                                    {child.type_new === 2 && (
                                                      <span className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded-full mt-1 inline-block">
                                                        Updated
                                                      </span>
                                                    )}
                                                  </div>
                                                  <span
                                                    className="text-gray-400 cursor-move ml-2 hover:text-gray-600 transition-colors"
                                                    title="Drag to reorder"
                                                  >
                                                    ☰
                                                  </span>
                                                </div>
                                              </div>
                                            )}
                                          </Draggable>
                                        );
                                      })}
                                      {providedDroppable.placeholder}
                                    </div>

                                    {/* Empty state message */}
                                    {card.children.length === 0 && (
                                      <div className="text-center py-8 text-gray-500">
                                        <p>No fields added yet.</p>
                                        <p className="text-sm mt-1">
                                          Drag fields from the sidebar to get started.
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </Droppable>
                            </Card>
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>

          {/* Add Section Button at Bottom */}
          <div className="mt-6 text-center">
            <Button
              onClick={addNewSection}
              className="bg-green-600 hover:bg-green-700 focus:ring-green-300"
            >
              + Add New Section
            </Button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-trasparent bg-opacity-40 flex items-start justify-center p-6 z-[9999] overflow-auto">
          <div className="bg-white w-full max-w-lvw max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl">
            <div className="flex justify-between mb-4 sticky top-[-25px] bg-white py-3 z-10 border-b">
              <h2 className="text-2xl font-semibold">Preview</h2>
              <Button onClick={() => setShowPreview(false)} className="bg-red-600 hover:bg-red-700">
                Close
              </Button>
            </div>

            <PreviewForm cards={applyCards} />
          </div>
        </div>
      )}
    </DragDropContext>
  );
};

export default ApplyEditing;