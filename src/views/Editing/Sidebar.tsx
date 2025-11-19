import React, { useState, useEffect } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
import { FiFileText, FiCalendar, FiUpload, FiCheckSquare, FiChevronDown, FiType, FiTrash2, FiCreditCard } from 'react-icons/fi';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;

interface FieldType {
  id: number;
  label: string;
  type?: string;
  width?: number;
  type_new?: number;
  placeholder?: string;
  required: number; 
  validation_message?: string;
  name?: string;
  max_date?: string;
  content?: string;
  resolution?: string;
  tbl?: string;
  sequence?: number;
  validation?: string; 
}

interface TableOption {
  id: number;
  type: string;
  academic_id: number;
}

interface SidebarProps {
  availableFields: FieldType[];
  selectedField: FieldType | null;
  setSelectedField: (field: FieldType | null) => void;
  userToken?: string;
  updateField: (field: FieldType) => void;
  deleteField: (fieldId: number) => void;
  tableOptions: TableOption[];
  applyCards: CardType[]; // Add this prop to check duplicate names
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
  type_new?: number;
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
    case 'adhar':
      return <FiCreditCard className="h-6 w-6 text-red-700" />;
    default:
      return <FiFileText className="h-6 w-6 text-gray-400" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({
  availableFields,
  selectedField,
  setSelectedField,
  updateField,
  deleteField,
  tableOptions,
  applyCards, // Add this prop
}) => {
  const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

  useEffect(() => {
    if (selectedField) {
      setEditingField(selectedField);
    }
  }, [selectedField]);

  // Function to format field name (convert to snake_case)
  const formatFieldName = (input: string): string => {
    if (!input) return '';
    
    // Convert to lowercase and replace spaces with underscores
    let formatted = input
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '_') // Replace spaces with underscores
      .replace(/[^a-z0-9_]/g, '') // Remove special characters except underscores
      .replace(/_+/g, '_') // Replace multiple underscores with single
      .replace(/^_+|_+$/g, ''); // Remove leading and trailing underscores
    
    return formatted;
  };

  const handleChange = (key: keyof FieldType, value: any) => {
    setEditingField((prev) => {
      if (!prev) return prev;
      
      // If changing name field, automatically format it
      if (key === 'name' && value) {
        const formattedName = formatFieldName(value);
        return { ...prev, [key]: formattedName };
      }
      
      return { ...prev, [key]: value };
    });
  };

  // Function to check if field name is unique
  const isFieldNameUnique = (fieldName: string, currentFieldId: number): boolean => {
    if (!fieldName || fieldName.trim() === '') return true;
    
    const formattedName = formatFieldName(fieldName);
    
    // Check all fields in all cards for duplicate name
    for (const card of applyCards) {
      for (const field of card.children) {
        if (field.id !== currentFieldId && field.name === formattedName) {
          return false;
        }
      }
    }
    return true;
  };

 const handleSave = () => {
  if (!editingField) return;
  
  // Format the name before validation
  const formattedName = editingField.name ? formatFieldName(editingField.name) : '';
  
  // Check if name is provided
  if (!formattedName || formattedName.trim() === '') {
    toast.error('Field name is required');
    return;
  }
  
  // Check if name is unique
  if (!isFieldNameUnique(formattedName, editingField.id)) {
    toast.error(`Field name "${formattedName}" already exists. Please choose a different name.`);
    return;
  }
  
  // Validation for required field with empty validation message
  if (editingField.required === 1 && (!editingField.validation_message || editingField.validation_message.trim() === '')) {
    toast.error('Validation Message is required when field is marked as required');
    return;
  }
  
  // Ensure all required fields have proper values
  const updatedField: FieldType = {
    ...editingField,
    name: formattedName,
    required: editingField.required || 0, // Ensure required is set (default to 0)
    validation: editingField.validation || (editingField.type === 'text' ? 'text' : undefined), // Ensure validation is set for text fields
    validation_message: editingField.validation_message || '', // Ensure validation_message is set
    placeholder: editingField.placeholder || '', // Ensure placeholder is set
  };
  
  updateField(updatedField);
  setSelectedField(null);
};

  const handleDelete = () => {
    if (!editingField) return;
      deleteField(editingField.id);
  };

  // 🔥 Width Dropdown Options
  const widthOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

  // 🔥 Width Dropdown Component
  const renderWidthDropdown = (field: FieldType) => {
    // Normalize width value → convert "100%" | 100 → 100
    const widthValue = typeof field.width === 'string' 
      ? parseInt(field.width.replace('%', '')) 
      : field.width || 100;

    return (
      <div>
        <Label htmlFor="width">Width (%) *</Label>
        <Select
          id="width"
          value={widthValue}
          onChange={(e) => {
            const val = Number(e.target.value);
            handleChange('width', val); // Save as number
          }}
        >
          {widthOptions.map((w) => (
            <option key={w} value={w}>
              {w}%
            </option>
          ))}
        </Select>
      </div>
    );
  };

  // 🔥 Validation Type Dropdown for text fields
  const renderValidationTypeDropdown = (field: FieldType) => {
    return (
      <div>
        <Label htmlFor="validation">Validation Type *</Label>
        <Select
          id="validation"
          value={field.validation || ''}
          onChange={(e) => handleChange('validation', e.target.value)}
        >
          <option value="">Text</option>
          <option value="email">Email</option>
          <option value="mobile">Mobile</option>
        </Select>
      </div>
    );
  };

  // 🔥 Field Name Input Component with real-time formatting
  const renderFieldNameInput = (field: FieldType) => {
    const formattedName = field.name ? formatFieldName(field.name) : '';
    const displayName = field.name || '';
    
    return (
      <div>
        <Label htmlFor="name">
          Field Name *
        </Label>
        <TextInput
          id="name"
          type="text"
          value={displayName}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Enter field name (e.g., children adhar)"
          required
        />
        {displayName && displayName !== formattedName && (
          <p className="text-xs text-green-600 mt-1">
            Will be saved as: <strong>{formattedName}</strong>
          </p>
        )}
        {formattedName && (
          <p className="text-xs text-gray-500 mt-1">
            Format: lowercase with underscores (snake_case)
          </p>
        )}
      </div>
    );
  };

 const renderFieldEditor = (field: FieldType) => {
    switch (field.type) {
      case 'text':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">
                Placeholder
              </Label>
              <TextInput
                id="placeholder"
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>

            {renderWidthDropdown(field)}

            {renderValidationTypeDropdown(field)}

            <div>
              <Label htmlFor="required">
                Required?
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  type="text"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}
          </>
        );

      case 'select':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label htmlFor="required">
                Required?
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  type="text"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="tbl">
                Data Source Table
              </Label>
              <Select
                id="tbl"
                value={field.tbl || ''}
                onChange={(e) => handleChange('tbl', e.target.value)}
              >
                <option value="">Select Table</option>
                {tableOptions.map((option) => (
                  <option key={option.id} value={option.type}>
                    {option.type}
                  </option>
                ))}
              </Select>
            </div>
          </>
        );

      case 'date':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">
                Placeholder
              </Label>
              <TextInput
                id="placeholder"
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label htmlFor="required">
                Required
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="max_date">
                Max Date
              </Label>
              <TextInput
                id="max_date"
                value={field.max_date || ''}
                onChange={(e) => handleChange('max_date', e.target.value)}
                placeholder="YYYY-MM-DD"
              />
            </div>
          </>
        );

      case 'heading':
      case 'heading2':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="content">
                Heading Content *
              </Label>
              <Textarea
                id="content"
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter heading content"
                rows={3}
              />
            </div>

            {renderWidthDropdown(field)}
          </>
        );

      case 'file_button':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label htmlFor="resolution">
                Resolution
              </Label>
              <TextInput
                id="resolution"
                value={field.resolution || ''}
                onChange={(e) => handleChange('resolution', e.target.value)}
                placeholder="e.g., 1920x1080"
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label htmlFor="content">
                Button Text
              </Label>
              <TextInput
                id="content"
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter button text"
              />
            </div>

            <div>
              <Label htmlFor="required">
                Required
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}
          </>
        );

      case 'checkbox':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label htmlFor="content">
                Checkbox Text *
              </Label>
              <Textarea
                id="content"
                value={field.content || ''}
                onChange={(e) => handleChange('content', e.target.value)}
                placeholder="Enter checkbox text"
                rows={3}
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label htmlFor="required">
                Required
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}
          </>
        );

      case 'adhar':
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                type="text"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
              />
            </div>

            <div>
              <Label htmlFor="placeholder">
                Placeholder
              </Label>
              <TextInput
                id="placeholder"
                type="text"
                value={field.placeholder || ''}
                onChange={(e) => handleChange('placeholder', e.target.value)}
                placeholder="Enter placeholder text"
              />
            </div>

            {renderWidthDropdown(field)}

            <div>
              <Label htmlFor="required">
                Required?
              </Label>
              <Select
                id="required"
                value={field.required?.toString() || '0'}
                onChange={(e) => handleChange('required', Number(e.target.value))}
              >
                <option value="0">No</option>
                <option value="1">Yes</option>
              </Select>
            </div>

            {field.required === 1 && (
              <div>
                <Label htmlFor="validation_message">
                  Validation Message *
                </Label>
                <TextInput
                  id="validation_message"
                  type="text"
                  value={field.validation_message || ''}
                  onChange={(e) => handleChange('validation_message', e.target.value)}
                  placeholder="Enter validation message"
                  required
                />
              </div>
            )}
          </>
        );

      default:
        return (
          <>
            {renderFieldNameInput(field)}

            <div>
              <Label htmlFor="label">
                Field Label *
              </Label>
              <TextInput
                id="label"
                value={field.label || ''}
                onChange={(e) => handleChange('label', e.target.value)}
                placeholder="Enter field label"
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
         <Droppable droppableId="sidebar" type="FIELD">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-3">
                {availableFields.map((field, index) => (
                  <Draggable 
                    key={`sidebar-${field.id}`} 
                    draggableId={`sidebar-${field.id}`} 
                    index={index}
                  >
                    {(providedDrag, snapshot) => (
                      <div
                        ref={providedDrag.innerRef}
                        {...providedDrag.draggableProps}
                        {...providedDrag.dragHandleProps}
                        className={`flex flex-col items-center justify-center mb-2 p-2 rounded-md border cursor-pointer transition-colors ${
                          snapshot.isDragging 
                            ? 'bg-blue-100 border-blue-400 shadow-lg transform scale-105' 
                            : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        <div className="mb-2">{getFieldIcon(field)}</div>
                        <p className="text-sm font-medium text-center">{field.label}</p>
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
          <div className="flex justify-between items-center mb-4">
            <Button size="xs" color="alternative" onClick={() => setSelectedField(null)}>
              ← Back
            </Button>
            <h3 className="font-semibold text-lg">Field Settings</h3>
            <Button
              size="xs"
              color="failure"
              onClick={handleDelete}
              className="flex items-center gap-1"
            >
              <FiTrash2 className="h-3 w-3" />
              Delete
            </Button>
          </div>

          <div className="mb-6 p-3 bg-blue-50 rounded-md border">
            <p className="text-sm text-blue-700">Field Type</p>
            <p className="text-lg font-semibold capitalize">{editingField?.type}</p>
            {editingField?.type_new === 1 && (
              <span className="text-xs text-green-600 font-semibold">New Field</span>
            )}
          </div>

          <div className="space-y-4">{editingField && renderFieldEditor(editingField)}</div>

          <div className="flex gap-2 mt-6">
            <Button className="flex-1" color="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;









// import React, { useState, useEffect } from 'react';
// import { Droppable, Draggable } from '@hello-pangea/dnd';
// import { Label, TextInput, Select, Textarea, Button } from 'flowbite-react';
// import { FiFileText, FiCalendar, FiUpload, FiCheckSquare, FiChevronDown, FiType, FiTrash2, FiCreditCard } from 'react-icons/fi';
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
//   tbl?: string;
//   type_new?: number;
//   validation?: string;
// }

// interface TableOption {
//   id: number;
//   type: string;
//   academic_id: number;
// }

// interface SidebarProps {
//   availableFields: FieldType[];
//   selectedField: FieldType | null;
//   setSelectedField: (field: FieldType | null) => void;
//   userToken?: string;
//   updateField: (field: FieldType) => void;
//   deleteField: (fieldId: number) => void;
//   tableOptions: TableOption[];
//   applyCards: CardType[];
// }

// interface CardType {
//   id: number;
//   title: string;
//   description?: string;
//   width?: number;
//   gap?: number;
//   justify?: string;
//   sequence?: number;
//   children: FieldType[];
//   type_new?: number;
// }

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
//     case 'adhar':
//       return <FiCreditCard className="h-6 w-6 text-red-700" />;
//     default:
//       return <FiFileText className="h-6 w-6 text-gray-400" />;
//   }
// };

// const Sidebar: React.FC<SidebarProps> = ({
//   availableFields,
//   selectedField,
//   setSelectedField,
//   updateField,
//   deleteField,
//   tableOptions,
//   applyCards, // Add this prop
// }) => {
//   const [editingField, setEditingField] = useState<FieldType | null>(selectedField);

//   useEffect(() => {
//     if (selectedField) {
//       setEditingField(selectedField);
//     }
//   }, [selectedField]);

//   const handleChange = (key: keyof FieldType, value: any) => {
//     setEditingField((prev) => {
//       if (!prev) return prev;
//       return { ...prev, [key]: value };
//     });
//   };

//   // Function to check if field name is unique
//   const isFieldNameUnique = (fieldName: string, currentFieldId: number): boolean => {
//     if (!fieldName || fieldName.trim() === '') return true;
    
//     // Check all fields in all cards for duplicate name
//     for (const card of applyCards) {
//       for (const field of card.children) {
//         if (field.id !== currentFieldId && field.name === fieldName) {
//           return false;
//         }
//       }
//     }
//     return true;
//   };

//   const handleSave = () => {
//     if (!editingField) return;
    
//     // Check if name is unique
//     if (editingField.name && !isFieldNameUnique(editingField.name, editingField.id)) {
//       toast.error('Field name must be unique. Please choose a different name.');
//       return;
//     }
    
//     // Validation for required field with empty validation message
//     if (editingField.required === 1 && (!editingField.validation_message || editingField.validation_message.trim() === '')) {
//       toast.error('Validation Message is required when field is marked as required');
//       return;
//     }
    
//     updateField(editingField);
//     setSelectedField(null);
//   };

//   const handleDelete = () => {
//     if (!editingField) return;
//       deleteField(editingField.id);
//   };

//   // 🔥 Width Dropdown Options
//   const widthOptions = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100];

//   // 🔥 Width Dropdown Component
//   const renderWidthDropdown = (field: FieldType) => {
//     // Normalize width value → convert "100%" | 100 → 100
//     const widthValue = typeof field.width === 'string' 
//       ? parseInt(field.width.replace('%', '')) 
//       : field.width || 100;

//     return (
//       <div>
//         <Label htmlFor="width">Width (%) *</Label>
//         <Select
//           id="width"
//           value={widthValue}
//           onChange={(e) => {
//             const val = Number(e.target.value);
//             handleChange('width', val); // Save as number
//           }}
//         >
//           {widthOptions.map((w) => (
//             <option key={w} value={w}>
//               {w}%
//             </option>
//           ))}
//         </Select>
//       </div>
//     );
//   };

//   // 🔥 Validation Type Dropdown for text fields
//   const renderValidationTypeDropdown = (field: FieldType) => {
//     return (
//       <div>
//         <Label htmlFor="validation">Validation Type *</Label>
//         <Select
//           id="validation"
//           value={field.validation || 'text'}
//           onChange={(e) => handleChange('validation', e.target.value)}
//         >
//           <option value="text">Text</option>
//           <option value="email">Email</option>
//           <option value="mobile">Mobile</option>
//         </Select>
//       </div>
//     );
//   };

//  const renderFieldEditor = (field: FieldType) => {
//     switch (field.type) {
//       case 'text':
//         return (
//           <>
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., first_name)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             <div>
//               <Label htmlFor="placeholder">
//                 Placeholder
//               </Label>
//               <TextInput
//                 id="placeholder"
//                 type="text"
//                 value={field.placeholder || ''}
//                 onChange={(e) => handleChange('placeholder', e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             {renderValidationTypeDropdown(field)}

//             <div>
//               <Label htmlFor="required">
//                 Required?
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
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
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., blood_group)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             <div>
//               <Label htmlFor="required">
//                 Required?
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
//                   type="text"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <Label htmlFor="tbl">
//                 Data Source Table
//               </Label>
//               <Select
//                 id="tbl"
//                 value={field.tbl || ''}
//                 onChange={(e) => handleChange('tbl', e.target.value)}
//               >
//                 <option value="">Select Table</option>
//                 {tableOptions.map((option) => (
//                   <option key={option.id} value={option.type}>
//                     {option.type}
//                   </option>
//                 ))}
//               </Select>
//             </div>
//           </>
//         );

//       case 'date':
//         return (
//           <>
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., birth_date)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             <div>
//               <Label htmlFor="placeholder">
//                 Placeholder
//               </Label>
//               <TextInput
//                 id="placeholder"
//                 type="text"
//                 value={field.placeholder || ''}
//                 onChange={(e) => handleChange('placeholder', e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             <div>
//               <Label htmlFor="required">
//                 Required
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}

//             <div>
//               <Label htmlFor="max_date">
//                 Max Date
//               </Label>
//               <TextInput
//                 id="max_date"
//                 value={field.max_date || ''}
//                 onChange={(e) => handleChange('max_date', e.target.value)}
//                 placeholder="YYYY-MM-DD"
//               />
//             </div>
//           </>
//         );

//       case 'heading':
//       case 'heading2':
//         return (
//           <>
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="content">
//                 Heading Content *
//               </Label>
//               <Textarea
//                 id="content"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter heading content"
//                 rows={3}
//               />
//             </div>

//             {renderWidthDropdown(field)}
//           </>
//         );

//       case 'file_button':
//         return (
//           <>
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., document_upload)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             <div>
//               <Label htmlFor="resolution">
//                 Resolution
//               </Label>
//               <TextInput
//                 id="resolution"
//                 value={field.resolution || ''}
//                 onChange={(e) => handleChange('resolution', e.target.value)}
//                 placeholder="e.g., 1920x1080"
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             <div>
//               <Label htmlFor="content">
//                 Button Text
//               </Label>
//               <TextInput
//                 id="content"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter button text"
//               />
//             </div>

//             <div>
//               <Label htmlFor="required">
//                 Required
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
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
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., terms_agreement)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             <div>
//               <Label htmlFor="content">
//                 Checkbox Text *
//               </Label>
//               <Textarea
//                 id="content"
//                 value={field.content || ''}
//                 onChange={(e) => handleChange('content', e.target.value)}
//                 placeholder="Enter checkbox text"
//                 rows={3}
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             <div>
//               <Label htmlFor="required">
//                 Required
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
//                   value={field.validation_message || ''}
//                   onChange={(e) => handleChange('validation_message', e.target.value)}
//                   placeholder="Enter validation message"
//                   required
//                 />
//               </div>
//             )}
//           </>
//         );

//       case 'adhar':
//         return (
//           <>
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 type="text"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name (e.g., aadhaar_number)"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 type="text"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             <div>
//               <Label htmlFor="placeholder">
//                 Placeholder
//               </Label>
//               <TextInput
//                 id="placeholder"
//                 type="text"
//                 value={field.placeholder || ''}
//                 onChange={(e) => handleChange('placeholder', e.target.value)}
//                 placeholder="Enter placeholder text"
//               />
//             </div>

//             {renderWidthDropdown(field)}

//             <div>
//               <Label htmlFor="required">
//                 Required?
//               </Label>
//               <Select
//                 id="required"
//                 value={field.required?.toString() || '0'}
//                 onChange={(e) => handleChange('required', Number(e.target.value))}
//               >
//                 <option value="0">No</option>
//                 <option value="1">Yes</option>
//               </Select>
//             </div>

//             {field.required === 1 && (
//               <div>
//                 <Label htmlFor="validation_message">
//                   Validation Message *
//                 </Label>
//                 <TextInput
//                   id="validation_message"
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
//             <div>
//               <Label htmlFor="name">
//                 Field Name *
//               </Label>
//               <TextInput
//                 id="name"
//                 value={field.name || ''}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 placeholder="Enter unique field name"
//                 required
//               />
//             </div>

//             <div>
//               <Label htmlFor="label">
//                 Field Label *
//               </Label>
//               <TextInput
//                 id="label"
//                 value={field.label || ''}
//                 onChange={(e) => handleChange('label', e.target.value)}
//                 placeholder="Enter field label"
//               />
//             </div>

//             {renderWidthDropdown(field)}
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
//          <Droppable droppableId="sidebar" type="FIELD">
//             {(provided) => (
//               <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-2 gap-3">
//                 {availableFields.map((field, index) => (
//                   <Draggable 
//                     key={`sidebar-${field.id}`} 
//                     draggableId={`sidebar-${field.id}`} 
//                     index={index}
//                   >
//                     {(providedDrag, snapshot) => (
//                       <div
//                         ref={providedDrag.innerRef}
//                         {...providedDrag.draggableProps}
//                         {...providedDrag.dragHandleProps}
//                         className={`flex flex-col items-center justify-center mb-2 p-2 rounded-md border cursor-pointer transition-colors ${
//                           snapshot.isDragging 
//                             ? 'bg-blue-100 border-blue-400 shadow-lg transform scale-105' 
//                             : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
//                         }`}
//                       >
//                         <div className="mb-2">{getFieldIcon(field)}</div>
//                         <p className="text-sm font-medium text-center">{field.label}</p>
//                         <p className="text-xs text-gray-500">Type: {field.type}</p>
//                         <p className="text-xs text-gray-500">Width: {field.width}%</p>
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
//             <Button size="xs" color="alternative" onClick={() => setSelectedField(null)}>
//               ← Back
//             </Button>
//             <h3 className="font-semibold text-lg">Field Settings</h3>
//             <Button
//               size="xs"
//               color="failure"
//               onClick={handleDelete}
//               className="flex items-center gap-1"
//             >
//               <FiTrash2 className="h-3 w-3" />
//               Delete
//             </Button>
//           </div>

//           <div className="mb-6 p-3 bg-blue-50 rounded-md border">
//             <p className="text-sm text-blue-700">Field Type</p>
//             <p className="text-lg font-semibold capitalize">{editingField?.type}</p>
//             {editingField?.type_new === 1 && (
//               <span className="text-xs text-green-600 font-semibold">New Field</span>
//             )}
//           </div>

//           <div className="space-y-4">{editingField && renderFieldEditor(editingField)}</div>

//           <div className="flex gap-2 mt-6">
//             <Button className="flex-1" color="blue" onClick={handleSave}>
//               Save Changes
//             </Button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default Sidebar;