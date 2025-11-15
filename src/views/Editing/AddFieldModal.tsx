// import React, { useState } from 'react';
// import { Modal, Label, TextInput, Select, Button } from 'flowbite-react';

// interface AddFieldModalProps {
//   showModal: boolean;
//   setShowModal: (show: boolean) => void;
//   onSave: (newField: { label: string; type: string; width: number }) => void;
// }

// const AddFieldModal: React.FC<AddFieldModalProps> = ({
//   showModal,
//   setShowModal,
//   onSave,
// }) => {
//   const [newField, setNewField] = useState({
//     label: '',
//     type: '',
//     width: 50,
//   });

//   const fieldTypes = ['text', 'select', 'button', 'date', 'email', 'file'];

//   const handleSave = () => {
    
//     onSave({ ...newField, id: Date.now() });
//     setShowModal(false);
//     setNewField({ label: '', type: '', width: 50 });
//   };

//   return (
//     <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
//       <div className="p-6 bg-white rounded-lg">
//         <h3 className="text-lg font-semibold mb-4">Add New Field</h3>

//         <div className="space-y-4">
//           <div>
//             <Label htmlFor="label" value="Label Name" />
//             <TextInput
//               id="label"
//               placeholder="Enter field label"
//               value={newField.label}
//               onChange={(e) => setNewField({ ...newField, label: e.target.value })}
//             />
//           </div>

//           <div>
//             <Label htmlFor="type" value="Select Field Type" />
//             <Select
//               id="type"
//               value={newField.type}
//               onChange={(e) => setNewField({ ...newField, type: e.target.value })}
//             >
//               <option value="">Select Type</option>
//               {fieldTypes.map((type) => (
//                 <option key={type} value={type}>
//                   {type}
//                 </option>
//               ))}
//             </Select>
//           </div>

//           <div>
//             <Label htmlFor="width" value="Width (%)" />
//             <TextInput
//               id="width"
//               type="number"
//               placeholder="Enter width (e.g. 50)"
//               value={newField.width}
//               onChange={(e) =>
//                 setNewField({ ...newField, width: parseInt(e.target.value) || 0 })
//               }
//             />
//           </div>
//         </div>

//         <div className="flex justify-end gap-3 mt-6">
//           <Button color="gray" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button color="blue" onClick={handleSave}>
//             Save
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// };

// export default AddFieldModal;





















import React, { useState } from 'react';
import { Modal, Label, TextInput, Select, Button } from 'flowbite-react';

interface AddFieldModalProps {
  showModal: boolean;
  setShowModal: (show: boolean) => void;
  onSave: (newField: { label: string; type: string; width: number }) => void;
}

const AddFieldModal: React.FC<AddFieldModalProps> = ({
  showModal,
  setShowModal,
  onSave,
}) => {
  const [newField, setNewField] = useState({
    label: '',
    type: '',
    width: 50,
  });

  const fieldTypes = ['text', 'select', 'button', 'date', 'email', 'file'];

  const handleSave = () => {
    onSave({ ...newField, id: Date.now() });
    setShowModal(false);
    setNewField({ label: '', type: '', width: 50 });
  };

  return (
    <Modal show={showModal} onClose={() => setShowModal(false)} size="md" popup>
      <div className="p-6 bg-white rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Add New Field</h3>

        <div className="space-y-4">
          <div>
            <Label htmlFor="label" value="Label Name" />
            <TextInput
              id="label"
              placeholder="Enter field label"
              value={newField.label}
              onChange={(e) => setNewField({ ...newField, label: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="type" value="Select Field Type" />
            <Select
              id="type"
              value={newField.type}
              onChange={(e) => setNewField({ ...newField, type: e.target.value })}
            >
              <option value="">Select Type</option>
              {fieldTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <Label htmlFor="width" value="Width (%)" />
            <TextInput
              id="width"
              type="number"
              placeholder="Enter width (e.g. 50)"
              value={newField.width}
              onChange={(e) =>
                setNewField({ ...newField, width: parseInt(e.target.value) || 0 })
              }
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button color="gray" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button color="blue" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddFieldModal;
