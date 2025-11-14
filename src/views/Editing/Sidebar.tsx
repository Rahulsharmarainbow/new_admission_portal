import React, { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
import axios from 'axios';
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
}

const Sidebar: React.FC<SidebarProps> = ({
  availableFields,
  selectedField,
  setSelectedField,
  userToken,
  updateField
}) => {
    console.log(selectedField);
  const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

  const handleChange = (key: keyof FieldType, value: any) => {
    setEditingField((prev) => (prev ? { ...prev, [key]: value } : prev));
  };


  const handleSave = () => {
  if (!editingField) return;
  updateField(editingField); // ✅ update in parent
  toast.success("Field updated successfully");
  setSelectedField(null); // Go back to list view
};
  React.useEffect(() => {
  setEditingField(selectedField);
}, [selectedField]);


//   const handleSave = async () => {
//     if (!editingField) return;
//     try {
//       const response = await axios.post(
//         `${apiUrl}/form/update-field`,
//         { field: editingField },
//         {
//           headers: {
//             Authorization: `Bearer ${userToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       toast.success(response.data.message || 'Field updated successfully');
//     } catch (error) {
//       toast.error('Failed to update field');
//       console.error(error);
//     }
//   };

  const renderFieldEditor = (field: FieldType) => {
    switch (field.type) {
      case 'text':
        return (
          <>
            <TextInput
              type="text"
              value={field.label || 'data'}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Label"
            />
            <TextInput
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              placeholder="Placeholder"
            />
            <TextInput
              type="number"
              value={field.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="Width (%)"
            />
            <Select
              value={field.required?.toString() || '0'}
              onChange={(e) => handleChange('required', Number(e.target.value))}
            >
              <option value="0">Required: No</option>
              <option value="1">Required: Yes</option>
            </Select>
            <TextInput
              type="text"
              value={field.validation_message || ''}
              onChange={(e) => handleChange('validation_message', e.target.value)}
              placeholder="Validation Message"
            />
          </>
        );

      case 'select':
        return (
          <>
            <TextInput
              type="text"
              value={field.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Name"
            />
            <TextInput
              type="text"
              value={field.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Label"
            />
            <TextInput
              type="number"
              value={field.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="Width (%)"
            />
            <Select
              value={field.required?.toString() || '0'}
              onChange={(e) => handleChange('required', Number(e.target.value))}
            >
              <option value="0">Required: No</option>
              <option value="1">Required: Yes</option>
            </Select>
            <Select
              value={field.table || ''}
              onChange={(e) => handleChange('table', e.target.value)}
            >
              <option value="">Select Table</option>
              <option value="gender_table">Gender Table</option>
            </Select>
          </>
        );

      case 'date':
        return (
          <>
            <TextInput
              type="text"
              value={field.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Name"
            />
            <TextInput
              type="text"
              value={field.label || ''}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="Label"
            />
            <TextInput
              type="text"
              value={field.placeholder || ''}
              onChange={(e) => handleChange('placeholder', e.target.value)}
              placeholder="Placeholder"
            />
            <TextInput
              type="text"
              value={field.validation_message || ''}
              onChange={(e) => handleChange('validation_message', e.target.value)}
              placeholder="Validation Message"
            />
            <Select
              value={field.required?.toString() || '0'}
              onChange={(e) => handleChange('required', Number(e.target.value))}
            >
              <option value="0">Required: No</option>
              <option value="1">Required: Yes</option>
            </Select>
            <TextInput
              type="number"
              value={field.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="Width (%)"
            />
            <TextInput
              type="text"
              value={field.max_date || ''}
              onChange={(e) => handleChange('max_date', e.target.value)}
              placeholder="Max Date"
            />
          </>
        );

      case 'heading':
      case 'heading2':
        return (
          <>
            <Textarea
              value={field.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Content"
            />
            <TextInput
              type="number"
              value={field.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="Width (%)"
            />
          </>
        );

      case 'file_button':
        return (
          <>
            <TextInput
              type="text"
              value={field.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Name"
            />
            <TextInput
              type="text"
              value={field.resolution || ''}
              onChange={(e) => handleChange('resolution', e.target.value)}
              placeholder="Resolution (e.g. 180x180)"
            />
            <TextInput
              type="number"
              value={field.width || ''}
              onChange={(e) => handleChange('width', Number(e.target.value))}
              placeholder="Width (%)"
            />
            <Textarea
              value={field.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Content"
            />
            <Select
              value={field.required?.toString() || '0'}
              onChange={(e) => handleChange('required', Number(e.target.value))}
            >
              <option value="0">Required: No</option>
              <option value="1">Required: Yes</option>
            </Select>
            <TextInput
              type="text"
              value={field.validation_message || ''}
              onChange={(e) => handleChange('validation_message', e.target.value)}
              placeholder="Validation Message"
            />
          </>
        );

      case 'checkbox':
        return (
          <>
            <Textarea
              value={field.content || ''}
              onChange={(e) => handleChange('content', e.target.value)}
              placeholder="Content"
            />
            <Select
              value={field.required?.toString() || '0'}
              onChange={(e) => handleChange('required', Number(e.target.value))}
            >
              <option value="0">Required: No</option>
              <option value="1">Required: Yes</option>
            </Select>
            <TextInput
              type="text"
              value={field.validation_message || ''}
              onChange={(e) => handleChange('validation_message', e.target.value)}
              placeholder="Validation Message"
            />
          </>
        );

      default:
        return <p className="text-gray-400">Select a field to view settings</p>;
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
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {availableFields.map((field, index) => (
                  <Draggable
                    key={`sidebar-${field.id}`}
                    draggableId={`sidebar-${field.id}`}
                    index={index}
                  >
                    {(providedDrag) => (
                      <div
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                        className="mb-2 p-2 bg-gray-100 rounded-md border border-gray-300 cursor-pointer hover:bg-gray-200"
                      >
                        <p className="text-sm font-medium">{field.label}</p>
                        <p className="text-xs text-gray-500">Type: {field.type}</p>
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
          <div className="flex justify-between items-center mb-4">
            <Button size="xs" color="gray" onClick={() => setSelectedField(null)}>
              ← Back
            </Button>
            <h3 className="font-semibold text-lg">Field Settings</h3>
          </div>
          <div className="space-y-3">{editingField && renderFieldEditor(editingField)}</div>
          <Button className="w-full mt-4" color="blue" onClick={handleSave}>
            Save Changes
          </Button>
        </>
      )}
    </div>
  );
};

export default Sidebar;
