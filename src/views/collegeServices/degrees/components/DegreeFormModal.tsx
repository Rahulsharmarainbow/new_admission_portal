// import React, { useState, useEffect } from 'react';
// import { Button, TextInput, Label } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

// interface DegreeFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   degree: any | null;
// }

// interface FormData {
//   academic_id: string;
//   degreeName: string;
//   application_series: string;
//   total_marks: string;
//   passing_marks: string;
// }

// const DegreeFormModal: React.FC<DegreeFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   degree,
// }) => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     academic_id: '',
//     degreeName: '',
//     application_series: '',
//     total_marks: '',
//     passing_marks: '',
//   });

//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (isOpen) {
//       if (degree) {
//         setFormData({
//           academic_id: degree.academic_id.toString(),
//           degreeName: degree.name,
//           application_series: degree.degree_number,
//           total_marks: degree.total_marks,
//           passing_marks: degree.passing_marks,
//         });
//       } else {
//         setFormData({
//           academic_id: '',
//           degreeName: '',
//           application_series: '',
//           total_marks: '',
//           passing_marks: '',
//         });
//       }
//     }
//   }, [isOpen, degree]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const payload = {
//         academic_id: parseInt(formData.academic_id),
//         degreeName: formData.degreeName,
//         application_series: formData.application_series,
//         total_marks: parseInt(formData.total_marks),
//         passing_marks: parseInt(formData.passing_marks),
//         s_id: user?.id,
//       };

//       if (degree) {
//         await axios.post(
//           `${apiUrl}/${user?.role}/CollegeManagement/Degree/update`,
//           { ...payload, id: degree.id },
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } else {
//         await axios.post(
//           `${apiUrl}/${user?.role}/CollegeManagement/Degree/add`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       }

//       onSuccess();
//     } catch (error: any) {
//       console.error('Error saving degree:', error);
//       toast.error(error.response?.data?.message || 'Failed to save degree');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const handleAcademicChange = (academicId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       academic_id: academicId,
//     }));
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
//       <div className="relative bg-white rounded-lg shadow dark:bg-gray-700 max-w-md w-full mx-4">
//         {/* Modal header */}
//         <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//             {degree ? 'Edit Degree' : 'Add New Degree'}
//           </h3>
//           <button
//             type="button"
//             className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//             onClick={onClose}
//           >
//             <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//               <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
//             </svg>
//             <span className="sr-only">Close modal</span>
//           </button>
//         </div>

//         {/* Modal body */}
//       <form onSubmit={handleSubmit}>
//   {/* Wider container with padding and scroll if content overflows */}
//   <div className="p-10 space-y-8 max-h-[70vh] overflow-y-auto w-full max-w-5xl mx-auto">
    
//     {/* 2x2 grid layout */}
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
      
//       {/* Select Academic */}
//       <div className="w-full">
//         {/* <Label className="mb-2 block">Select Academics *</Label> */}
//         <AcademicDropdown
//           value={formData.academic_id}
//           onChange={handleAcademicChange}
//           isRequired={true}
//           placeholder="Select academic..."
//           includeAllOption={false}
//         />
//       </div> 
//       {/* Degree Name */}
//       <div className="w-full">
//         <Label className="mb-2 block">Degree Name *</Label>
//         <TextInput
//           id="degreeName"
//           name="degreeName"
//           value={formData.degreeName}
//           onChange={handleInputChange}
//           required
//           placeholder="Enter degree name"
//         />
//       </div>

//       {/* Application Series */}
//       <div className="w-full">
//         <Label className="mb-2 block">Application Number *</Label>
//         <TextInput
//           id="application_series"
//           name="application_series"
//           value={formData.application_series}
//           onChange={handleInputChange}
//           required
//           placeholder="Enter application number series"
//         />
//       </div>

//       {/* Total Marks */}
//       <div className="w-full">
//         <Label className="mb-2 block">Total Marks *</Label>
//         <TextInput
//           id="total_marks"
//           name="total_marks"
//           type="number"
//           value={formData.total_marks}
//           onChange={handleInputChange}
//           required
//           placeholder="Enter total marks"
//           min="1"
//         />
//       </div>

//       {/* Passing Marks */}
//       <div className="w-full">
//         <Label className="mb-2 block">Passing Marks *</Label>
//         <TextInput
//           id="passing_marks"
//           name="passing_marks"
//           type="number"
//           value={formData.passing_marks}
//           onChange={handleInputChange}
//           required
//           placeholder="Enter passing marks"
//           min="0"
//         />
//       </div>
//     </div>
//   </div>

//   {/* Footer buttons */}
//   <div className="flex justify-end items-center gap-4 p-6 border-t border-gray-200">
//     <Button
//       type="submit"
//       className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//       disabled={loading}
//     >
//       {loading ? 'Processing...' : (degree ? 'Update' : 'Add') + ' Degree'}
//     </Button>
//     <Button
//       type="button"
//       className="py-3 px-6 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
//       onClick={onClose}
//       disabled={loading}
//     >
//       Cancel
//     </Button>
//   </div>
// </form>

//       </div>
//     </div>
//   );
// };

// export default DegreeFormModal;





















import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';

interface DegreeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  degree: any | null;
}

interface FormData {
  academic_id: string;
  degreeName: string;
  application_series: string;
  total_marks: string;
  passing_marks: string;
}

const DegreeFormModal: React.FC<DegreeFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  degree,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: '',
    degreeName: '',
    application_series: '',
    total_marks: '',
    passing_marks: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen) {
      if (degree) {
        setFormData({
          academic_id: degree.academic_id.toString(),
          degreeName: degree.name,
          application_series: degree.degree_number,
          total_marks: degree.total_marks,
          passing_marks: degree.passing_marks,
        });
      } else {
        setFormData({
          academic_id: '',
          degreeName: '',
          application_series: '',
          total_marks: '',
          passing_marks: '',
        });
      }
    }
  }, [isOpen, degree]);

  console.log(formData);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.academic_id === ''){
      toast.error('Please select an academic');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        academic_id: parseInt(formData.academic_id),
        degreeName: formData.degreeName,
        application_series: formData.application_series,
        total_marks: parseInt(formData.total_marks),
        passing_marks: parseInt(formData.passing_marks),
        s_id: user?.id,
      };

      if (degree) {
        await axios.post(
          `${apiUrl}/${user?.role}/CollegeManagement/Degree/update`,
          { ...payload, id: degree.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        await axios.post(
          `${apiUrl}/${user?.role}/CollegeManagement/Degree/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving degree:', error);
      toast.error(error.response?.data?.message || 'Failed to save degree');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId,
    }));
  };

  const handleClose = () => {
    setFormData({
      academic_id: '',
      degreeName: '',
      application_series: '',
      total_marks: '',
      passing_marks: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
   <Modal 
  show={isOpen} 
  onClose={handleClose} 
  size="4xl" 
  // className="!overflow-visible"
>
  <ModalHeader>
    {/* <div className="flex justify-between items-center w-full">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white"> */}
        {degree ? 'Edit Degree' : 'Add New Degree'}
      {/* </h2>
    </div> */}
  </ModalHeader>

  <form onSubmit={handleSubmit}>
    <ModalBody className="overflow-visible">
      <div className="space-y-4 max-h-[80vh] pr-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-[1000]">
          <div className="relative z-[9999]">
            <Label className="block mb-2">
              Select Academic <span className="text-red-500">*</span>
            </Label>
            <AcademicDropdown
              value={formData.academic_id}
              onChange={handleAcademicChange}
              isRequired={true}
              placeholder="Select academic..."
              includeAllOption={false}
              className="!z-[9999]"
            />
          </div>

              {/* Degree Name */}
              <div>
              <Label className="block mb-2" >Degree Name <span className="text-red-500">*</span></Label>
                <TextInput
                  id="degreeName"
                  type="text"
                  value={formData.degreeName}
                  onChange={(e) => handleInputChange('degreeName', e.target.value)}
                  placeholder="Enter degree name"
                  required
                  disabled={loading}
                />
              </div>

              {/* Application Series */}
              <div>
               <Label className="block mb-2">Application Series <span className="text-red-500">*</span></Label>
                <TextInput
                  id="application_series"
                  type="text"
                  value={formData.application_series}
                  onChange={(e) => handleInputChange('application_series', e.target.value)}
                  placeholder="Enter application number series"
                  required
                  disabled={loading}
                />
              </div>

              {/* Total Marks */}
              <div>
                <Label className="block mb-2">Total Marks <span className="text-red-500">*</span></Label>
                <TextInput
                  id="total_marks"
                  type="number"
                  value={formData.total_marks}
                  onChange={(e) => handleInputChange('total_marks', e.target.value)}
                  placeholder="Enter total marks"
                  required
                  min="1"
                  disabled={loading}
                />
              </div>

              {/* Passing Marks */}
              <div>

                <Label className="block mb-2">Passing Marks <span className="text-red-500">*</span></Label>
                <TextInput
                  id="passing_marks"
                  type="number"
                  value={formData.passing_marks}
                  onChange={(e) => handleInputChange('passing_marks', e.target.value)}
                  placeholder="Enter passing marks"
                  required
                  min="0"
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="flex justify-end gap-3">
          <Button color="alternative" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" color="blue" disabled={loading}>
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-2">Processing...</span>
              </>
            ) : (
              degree ? 'Update Degree' : 'Add Degree'
            )}
          </Button>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default DegreeFormModal;
