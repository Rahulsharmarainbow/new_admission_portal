// import React, { useState, useEffect } from 'react';
// import { Button, Label, Modal } from 'flowbite-react';
// import axios from 'axios';
// import Select from 'react-select';
// import { useAuth } from 'src/hook/useAuth';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
// import toast from 'react-hot-toast';
// import { BsDownload } from 'react-icons/bs';

// interface DegreeOption {
//   value: number;
//   label: string;
// }

// interface FormData {
//   academic_id: string;
//   degree_id: string;
//   file: File | null;
// }

// interface RankCardFormProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const RankCardForm: React.FC<RankCardFormProps> = ({ isOpen, onClose, onSuccess }) => {
//   const { user } = useAuth();

//   const [submitting, setSubmitting] = useState(false);
//   const [degrees, setDegrees] = useState<DegreeOption[]>([]);
//   const [degreeLoading, setDegreeLoading] = useState(false);

//   const [formData, setFormData] = useState<FormData>({
//     academic_id: '',
//     degree_id: '',
//     file: null,
//   });

//   const apiUrl = import.meta.env.VITE_API_URL;

//   // Fetch degrees when academic_id changes
//   useEffect(() => {
//     if (formData.academic_id) {
//       fetchDegrees(formData.academic_id);
//     } else {
//       setDegrees([]);
//       setFormData(prev => ({ ...prev, degree_id: '' }));
//     }
//   }, [formData.academic_id]);

//   // Reset form when modal closes
//   useEffect(() => {
//     if (!isOpen) {
//       setFormData({
//         academic_id: '',
//         degree_id: '',
//         file: null,
//       });
//       setDegrees([]);
//     }
//   }, [isOpen]);

//   const fetchDegrees = async (academicId: string) => {
//     setDegreeLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Dropdown/get-degree`,
//         {
//           academic_id: parseInt(academicId),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'application/json',
//           },
//         },
//       );

//       if (response.data.data) {
//         const degreeOptions = response.data.data.map((degree: any) => ({
//           value: degree.value,
//           label: degree.text,
//         }));
//         setDegrees(degreeOptions);
//       }
//     } catch (error) {
//       console.error('Error fetching degrees:', error);
//       toast.error('Failed to fetch degrees');
//     } finally {
//       setDegreeLoading(false);
//     }
//   };

//   const handleSelectChange = (name: keyof FormData) => (selected: any) => {
//     setFormData(prev => ({
//       ...prev,
//       [name]: selected ? selected.value : '',
//     }));
//   };

//   const handleAcademicChange = (academicId: string) => {
//     setFormData(prev => ({
//       ...prev,
//       academic_id: academicId,
//       degree_id: '', // Reset degree when academic changes
//     }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       // Check file type
//       const validTypes = ['.xls', '.xlsx'];
//       const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
//       if (!validTypes.includes(fileExtension)) {
//         toast.error('Please upload only Excel files (.xls or .xlsx)');
//         return;
//       }

//       // Check file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error('File size should be less than 5MB');
//         return;
//       }
//     }
//     setFormData(prev => ({ ...prev, file }));
//   };

//   const handleDownloadSample = () => {
//     const sampleUrl = `${apiUrl}/Excelfiles/rankcard.xlsx`;
//     window.open(sampleUrl, '_blank');
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.academic_id || !formData.degree_id || !formData.file) {
//       toast.error('Please fill all required fields');
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('academic_id', formData.academic_id);
//       formDataToSend.append('degree_id', formData.degree_id);
//       formDataToSend.append('s_id', user?.id?.toString() || '');
//       formDataToSend.append('file', formData.file);

//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/CollegeManagement/Rankcard/add`,
//         formDataToSend,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );

//       if (response.data.status === true) {
//         toast.success(response.data.message || 'Rank card added successfully!');
//         onSuccess();
//         onClose();
//       } else {
//         toast.error(response.data.message || 'Failed to add rank card');
//       }
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       toast.error('Failed to add rank card');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Modal show={isOpen} onClose={onClose} size="md">
//       {/* Header */}
//       <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
//         <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//           Add Rank Card
//         </h3>
//         <button
//           type="button"
//           className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
//           onClick={onClose}
//         >
//           <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//             <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
//           </svg>
//           <span className="sr-only">Close modal</span>
//         </button>
//       </div>

//       {/* Body */}
//       <form onSubmit={handleSubmit}>
//         <div className="p-4 space-y-4">
//           <div className="space-y-4">
//             {/* Academic Dropdown */}
//             <div>
//               <Label htmlFor="academic_id" value="Select Academic *" className="block mb-2" />
//               <AcademicDropdown
//                 value={formData.academic_id}
//                 onChange={handleAcademicChange}
//                 placeholder="Search and select academic..."
//                 label=""
//               />
//             </div>

//             {/* Degree Dropdown */}
//             <div>
//               <Label htmlFor="degree_id" value="Select Degree *" className="block mb-2" />
//               <Select
//                 id="degree_id"
//                 isLoading={degreeLoading}
//                 isDisabled={!formData.academic_id || degreeLoading}
//                 options={degrees}
//                 value={degrees.find(opt => opt.value.toString() === formData.degree_id)}
//                 onChange={handleSelectChange('degree_id')}
//                 placeholder={formData.academic_id ? "Select degree..." : "First select academic"}
//                 classNamePrefix="react-select"
//                 styles={{
//                   control: (base) => ({
//                     ...base,
//                     borderColor: "#d1d5db",
//                     borderRadius: "0.5rem",
//                     padding: "2px",
//                     minHeight: "42px",
//                     boxShadow: "none",
//                     "&:hover": { borderColor: "#93c5fd" },
//                   }),
//                 }}
//               />
//             </div>

//             {/* File Upload */}
//             <div>
//               <Label htmlFor="file" value="Upload Excel File *" className="block mb-2" />
//               <input
//                 type="file"
//                 id="file"
//                 accept=".xls,.xlsx"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//               />
//               <p className="mt-1 text-xs text-gray-500">.xls or .xlsx files only, max 5MB</p>
//             </div>

//             {/* Download Sample Button */}
//             <div>
//               <Button
//                 type="button"
//                 color="gray"
//                 onClick={handleDownloadSample}
//                 className="w-full"
//               >
//                 <BsDownload className="mr-2 w-4 h-4" />
//                 Download Sample File
//               </Button>
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <div className="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
//           <Button
//             type="button"
//             color="gray"
//             onClick={onClose}
//             disabled={submitting}
//             className="mr-2"
//           >
//             Cancel
//           </Button>
//           <Button
//             type="submit"
//             color="primary"
//             disabled={submitting || !formData.academic_id || !formData.degree_id || !formData.file}
//           >
//             {submitting ? 'Submitting...' : 'Submit'}
//           </Button>
//         </div>
//       </form>
//     </Modal>
//   );
// };

// export default RankCardForm;






















import React, { useState, useEffect } from 'react';
import { Button, Label, Modal } from 'flowbite-react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import toast from 'react-hot-toast';
import { BsDownload } from 'react-icons/bs';

interface DegreeOption {
  value: number;
  label: string;
}

interface FormData {
  academic_id: string;
  degree_id: string;
  file: File | null;
}

interface RankCardFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const RankCardForm: React.FC<RankCardFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [degreeLoading, setDegreeLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    academic_id: '',
    degree_id: '',
    file: null,
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const sampleFileUrl = 'https://rainbowsolutionandtechnology.com/NewAdmissionPortal/public/Excelfiles/rankcard.xlsx';

  // Fetch degrees when academic_id changes
  useEffect(() => {
    if (formData.academic_id) {
      fetchDegrees(formData.academic_id);
    } else {
      setDegrees([]);
      setFormData(prev => ({ ...prev, degree_id: '' }));
    }
  }, [formData.academic_id]);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        academic_id: '',
        degree_id: '',
        file: null,
      });
      setDegrees([]);
    }
  }, [isOpen]);

  const fetchDegrees = async (academicId: string) => {
    setDegreeLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-degree`,
        {
          academic_id: parseInt(academicId),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.data) {
        const degreeOptions = response.data.data.map((degree: any) => ({
          value: degree.value,
          label: degree.text,
        }));
        setDegrees(degreeOptions);
      }
    } catch (error) {
      console.error('Error fetching degrees:', error);
      toast.error('Failed to fetch degrees');
    } finally {
      setDegreeLoading(false);
    }
  };

  const handleSelectChange = (name: keyof FormData) => (selected: any) => {
    setFormData(prev => ({
      ...prev,
      [name]: selected ? selected.value : '',
    }));
  };

  const handleAcademicChange = (academicId: string) => {
    setFormData(prev => ({
      ...prev,
      academic_id: academicId,
      degree_id: '', // Reset degree when academic changes
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      // Check file type
      const validTypes = ['.xls', '.xlsx'];
      const fileExtension = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
      
      if (!validTypes.includes(fileExtension)) {
        toast.error('Please upload only Excel files (.xls or .xlsx)');
        return;
      }

      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size should be less than 5MB');
        return;
      }
    }
    setFormData(prev => ({ ...prev, file }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.academic_id || !formData.degree_id || !formData.file) {
      toast.error('Please fill all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('academic_id', formData.academic_id);
      formDataToSend.append('degree_id', formData.degree_id);
      formDataToSend.append('s_id', user?.id?.toString() || '');
      formDataToSend.append('file', formData.file);

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Rankcard/add`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.status === true) {
        toast.success(response.data.message || 'Rank card added successfully!');
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || 'Failed to add rank card');
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Failed to add rank card');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="md">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b rounded-t dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Add Rank Card
        </h3>
        <button
          type="button"
          className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
          onClick={onClose}
        >
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
          </svg>
          <span className="sr-only">Close modal</span>
        </button>
      </div>

      {/* Body */}
      <form onSubmit={handleSubmit}>
        <div className="p-4 space-y-4">
          <div className="space-y-4">
            {/* Academic Dropdown */}
            <div>
              <Label htmlFor="academic_id" value="Select Academic *" className="block mb-2" />
              <AcademicDropdown
                value={formData.academic_id}
                onChange={handleAcademicChange}
                placeholder="Search and select academic..."
                label=""
              />
            </div>

            {/* Degree Dropdown */}
            <div>
              <Label htmlFor="degree_id" value="Select Degree *" className="block mb-2" />
              <Select
                id="degree_id"
                isLoading={degreeLoading}
                isDisabled={!formData.academic_id || degreeLoading}
                options={degrees}
                value={degrees.find(opt => opt.value.toString() === formData.degree_id)}
                onChange={handleSelectChange('degree_id')}
                placeholder={formData.academic_id ? "Select degree..." : "First select academic"}
                classNamePrefix="react-select"
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: "#d1d5db",
                    borderRadius: "0.5rem",
                    padding: "2px",
                    minHeight: "42px",
                    boxShadow: "none",
                    "&:hover": { borderColor: "#93c5fd" },
                  }),
                }}
              />
            </div>

            {/* File Upload */}
            <div>
              <Label htmlFor="file" value="Upload Excel File *" className="block mb-2" />
              <input
                type="file"
                id="file"
                accept=".xls,.xlsx"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
              <p className="mt-1 text-xs text-gray-500">.xls or .xlsx files only, max 5MB</p>
            </div>

            {/* Download Sample Button */}
            <div>
              <a
                href={sampleFileUrl}
                download="rankcard_sample.xlsx"
                className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-300 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <BsDownload className="mr-2 w-4 h-4" />
                Download Sample File
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center p-4 border-t border-gray-200 rounded-b dark:border-gray-600">
          <Button
            type="button"
            color="gray"
            onClick={onClose}
            disabled={submitting}
            className="mr-2"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            color="primary"
            disabled={submitting || !formData.academic_id || !formData.degree_id || !formData.file}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default RankCardForm;