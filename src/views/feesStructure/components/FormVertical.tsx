import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Card, Label, TextInput, Select, Spinner } from 'flowbite-react';
import { FaHome, FaMoneyBillWave } from 'react-icons/fa';
import { useAcademics } from 'src/hook/useAcademics';
import { useCaste } from 'src/hook/useCaste';
import { useStates } from 'src/hook/useStates';
import { toast } from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';
import axios from 'axios';
import ReactSelect from 'react-select';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import Loader from 'src/Frontend/Common/Loader';
import RouteDropdown from '../../../Frontend/Common/RouteDropdown'; // यह import करें

interface FeesData {
  id?: number;
  academic_id: number;
  form_id: number; // नया field add किया
  special_caste_fee_states?: string;
  special_caste?: string;
  special_cast_fee?: number;
  actual_fee?: number;
  late_fee?: number;
  platform_fee?: number; // नया field add किया
  admission_state_date?: string;
  admission_end_date?: string;
  extend_date?: string;
  status?: number;
  last_updated_at?: string;
}

// Custom styles for react-select to match Flowbite design
const customStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: '#f9fafb',
    borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
    borderRadius: '0.5rem',
    padding: '0.25rem',
    boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
    '&:hover': {
      borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
    },
    minHeight: '42px',
  }),
  menu: (base: any) => ({
    ...base,
    borderRadius: '0.5rem',
    zIndex: 50,
  }),
  multiValue: (base: any) => ({
    ...base,
    backgroundColor: '#3b82f6',
    borderRadius: '0.375rem',
  }),
  multiValueLabel: (base: any) => ({
    ...base,
    color: 'white',
    fontWeight: '500',
  }),
  multiValueRemove: (base: any) => ({
    ...base,
    color: 'white',
    ':hover': {
      backgroundColor: '#ef4444',
      color: 'white',
    },
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
    color: state.isSelected ? 'white' : '#374151',
    ':active': {
      backgroundColor: state.isSelected ? '#3b82f6' : '#bfdbfe',
    },
  }),
};

const FormVertical = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { academics, loading: academicLoading } = useAcademics();
  const { caste: castelist, loading: casteLoading } = useCaste();
  const { states: statelist, loading: statesLoading } = useStates();
  const { user } = useAuth();

  const [state, setState] = useState<string[]>([]);
  const [caste, setCaste] = useState<string[]>([]);
  const [applicableFee, setApplicableFee] = useState('');
  const [actualFee, setActualFee] = useState('');
  const [extendFee, setExtendFee] = useState('');
  const [platformFee, setPlatformFee] = useState(''); // नया state
  const [admissionStartDate, setAdmissionStartDate] = useState('');
  const [admissionEndDate, setAdmissionEndDate] = useState('');
  const [extendedDate, setExtendedDate] = useState('');
  const [selectedAcademic, setSelectedAcademic] = useState('');
  const [selectedFormId, setSelectedFormId] = useState(''); // नया state
  const [formVisible, setFormVisible] = useState(false);
  const [formError, setFormError] = useState(false);
  const [loadingButton1, setLoadingButton1] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);

  // Convert states and castes to react-select format
  const stateOptions = statelist.map((state) => ({
    value: state.state_id.toString(),
    label: state.state_title,
  }));

  const casteOptions = castelist.map((caste) => ({
    value: caste.id.toString(),
    label: caste.name,
  }));

  const handleInputChange =
    (setStateFunction: React.Dispatch<React.SetStateAction<any>>) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setStateFunction(event.target.value);
    };

  const handleStateChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setState(selectedValues);
  };

  const handleCasteChange = (selectedOptions: any) => {
    const selectedValues = selectedOptions
      ? selectedOptions.map((option: any) => option.value)
      : [];
    setCaste(selectedValues);
  };

  const handleAcademicSelect = (selectedId: string) => {
    setSelectedAcademic(selectedId);
    setSelectedFormId(''); // Academic change होने पर form_id reset करें
    setFormVisible(false); // Form hide करें जब तक form_id select नहीं होता
    setFormError(false);
    resetForm();
  };

  const handleFormSelect = (formId: string) => {
    setSelectedFormId(formId);
    if (formId && selectedAcademic) {
      setFormVisible(true);
      setFormError(false);
      getFeesData(selectedAcademic, formId);
    } else {
      setFormVisible(false);
      resetForm();
    }
  };

  const SpecialhandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingButton1(true);

    try {
      // Validate required fields
      if (!selectedFormId || !applicableFee) {
        toast.error('Please fill all required fields in Special Caste Fees Setting');
        return;
      }

      const submitdata = {
        academic_id: parseInt(selectedAcademic),
        form_id: parseInt(selectedFormId), // form_id add किया
        state: state.map((id) => parseInt(id)),
        caste: caste.map((id) => parseInt(id)),
        applicableFee: parseFloat(applicableFee),
        actualFee: parseFloat(actualFee) || 0,
        extendFee: parseFloat(extendFee) || 0,
        platform_fee: parseFloat(platformFee) || 0, // platform_fee add किया
        admission_state_date: admissionStartDate || null,
        admission_end_date: admissionEndDate || null,
        extend_date: extendedDate || null,
        s_id: user?.id || '',
      };

      await updateFeesData(submitdata);
    } catch (error) {
      console.error('Error in SpecialhandleSubmit:', error);
    } finally {
      setLoadingButton1(false);
    }
  };

  const MainhandleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingButton2(true);

    try {
      // Validate required fields
      if (!selectedFormId || !actualFee || !extendFee || !platformFee) {
        toast.error('Please fill all required fields in Other Settings');
        return;
      }

      const submitdata = {
        academic_id: parseInt(selectedAcademic),
        form_id: parseInt(selectedFormId), // form_id add किया
        actualFee: parseFloat(actualFee),
        extendFee: parseFloat(extendFee),
        platform_fee: parseFloat(platformFee), // platform_fee add किया
        admission_state_date: admissionStartDate || null,
        admission_end_date: admissionEndDate || null,
        extend_date: extendedDate || null,
        s_id: user?.id || '',
      };

      await updateFeesData(submitdata);
    } catch (error) {
      console.error('Error in MainhandleSubmit:', error);
    } finally {
      setLoadingButton2(false);
    }
  };

  const updateFeesData = async (data: any) => {
    try {
      const response = await axios.post(`${apiUrl}/${user?.role}/Fees/Update-Fees`, data, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.data.status) {
        toast.success('Fees data updated successfully!');
        // Refresh the data after update
        getFeesData(selectedAcademic, selectedFormId);
      } else {
        toast.error(response.data.message || 'Failed to update fees data');
      }
    } catch (error: any) {
      console.error('Error updating fees data:', error);
      toast.error(error.response?.data?.message || 'An error occurred while updating fees data');
    }
  };

  const getFeesData = async (academicId: string, formId: string) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Fees/get-Fees`,
        {
          academic_id: parseInt(academicId),
          form_id: parseInt(formId), // form_id add किया
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.status) {
        const feesData: FeesData = response.data.data;
        setFormError(false);

        // Parse and set states
        if (feesData.special_caste_fee_states) {
          try {
            const statesArray = JSON.parse(feesData.special_caste_fee_states);
            setState(statesArray.map((id: number) => id.toString()));
          } catch (e) {
            console.error('Error parsing states:', e);
            setState([]);
          }
        } else {
          setState([]);
        }

        // Parse and set castes
        if (feesData.special_caste) {
          try {
            const castesArray = JSON.parse(feesData.special_caste);
            setCaste(castesArray.map((id: number) => id.toString()));
          } catch (e) {
            console.error('Error parsing castes:', e);
            setCaste([]);
          }
        } else {
          setCaste([]);
        }

        // Set other fields
        setApplicableFee(feesData.special_cast_fee?.toString() || '');
        setActualFee(feesData.actual_fee?.toString() || '');
        setExtendFee(feesData.late_fee?.toString() || '');
        setPlatformFee(feesData.platform_fee?.toString() || ''); // platform_fee set किया
        setAdmissionStartDate(feesData.admission_state_date || '');
        setAdmissionEndDate(feesData.admission_end_date || '');
        setExtendedDate(feesData.extend_date || '');
      } else {
        setFormError(true);
        // If no data found, show empty form but don't show error
        if (response.data.message?.includes('not found')) {
          setFormError(false);
          resetForm();
        } else {
          toast.error(response.data.message || 'Failed to fetch fees data');
        }
      }
    } catch (error: any) {
      console.error('Error fetching fees data:', error);
      setFormError(true);
      // If it's a 404 or similar, treat as new form
      if (error.response?.status === 404) {
        setFormError(false);
        resetForm();
      } else {
        toast.error(error.response?.data?.message || 'An error occurred while fetching fees data');
      }
    }
  };

  const resetForm = () => {
    setState([]);
    setCaste([]);
    setApplicableFee('');
    setActualFee('');
    setExtendFee('');
    setPlatformFee('');
    setAdmissionStartDate('');
    setAdmissionEndDate('');
    setExtendedDate('');
  };

  const loading = academicLoading || casteLoading || statesLoading;

  if (loading) {
    return <Loader />;
  }

  return (
    <div>
      {/* Select Academic Section */}
      <Card className="mb-6">
        <div className="flex flex-row gap-4">
          <div className="flex-1">
            <AcademicDropdown
              value={selectedAcademic}
              onChange={handleAcademicSelect}
              label="First Select Academic"
              isRequired
            />
          </div>
          <div className="flex-1">
            <RouteDropdown
              academicId={selectedAcademic}
              value={selectedFormId}
              onChange={handleFormSelect}
              label="Select Page"
              isRequired
              placeholder={selectedAcademic ? "Select form page..." : "Select academic first"}
              disabled={!selectedAcademic}
            />
          </div>
        </div>
      </Card>

      {/* Conditional Forms */}
      {!formError && formVisible && selectedFormId && (
        <>
          {/* Special Caste Fees Setting */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Special Caste Fees Setting</h2>
              <form onSubmit={SpecialhandleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* State Dropdown - React Select Multi */}
                  <div className="md:col-span-5">
                    <Label htmlFor="state" className="block mb-2">
                      State 
                    </Label>
                    <ReactSelect
                      id="state"
                      isMulti
                      options={stateOptions}
                      value={stateOptions.filter((option) => state.includes(option.value))}
                      onChange={handleStateChange}
                      styles={customStyles}
                      placeholder="Select states..."
                      isSearchable
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      noOptionsMessage={({ inputValue }) =>
                        inputValue ? `No states found for "${inputValue}"` : 'No states available'
                      }
                    />
                    {state.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-blue-600 font-medium">
                          Selected: {state.length} state(s)
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Caste Dropdown - React Select Multi */}
                  <div className="md:col-span-4">
                    <Label htmlFor="caste" className="block mb-2">
                      Caste 
                    </Label>
                    <ReactSelect
                      id="caste"
                      isMulti
                      options={casteOptions}
                      value={casteOptions.filter((option) => caste.includes(option.value))}
                      onChange={handleCasteChange}
                      styles={customStyles}
                      placeholder="Select castes..."
                      isSearchable
                      isClearable
                      className="react-select-container"
                      classNamePrefix="react-select"
                      noOptionsMessage={({ inputValue }) =>
                        inputValue ? `No castes found for "${inputValue}"` : 'No castes available'
                      }
                    />
                    {caste.length > 0 && (
                      <div className="mt-2">
                        <span className="text-sm text-blue-600 font-medium">
                          Selected: {caste.length} caste(s)
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="applicableFee">Applicable Fee *</Label>
                    <TextInput
                      type="number"
                      min="0"
                      step="1"
                      value={applicableFee}
                      onChange={handleInputChange(setApplicableFee)}
                      required
                    />
                  </div>
                  <div className="md:col-span-1 flex items-end">
                    <Button type="submit" className="w-full" disabled={loadingButton1}>
                      {loadingButton1 ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Card>

          {/* Other Settings */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
              <form onSubmit={MainhandleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-4">
                    <Label htmlFor="platformFee">Platform Fee *</Label>
                    <TextInput
                      type="number"
                      min="0"
                      step="1"
                      value={platformFee}
                      onChange={handleInputChange(setPlatformFee)}
                      required
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Label htmlFor="actualFee">Fee for Non-Special Castes *</Label>
                    <TextInput
                      type="number"
                      min="0"
                      step="1"
                      value={actualFee}
                      onChange={handleInputChange(setActualFee)}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <Label htmlFor="extendFee">Late Fee *</Label>
                    <TextInput
                      type="number"
                      min="0"
                      step="1"
                      value={extendFee}
                      onChange={handleInputChange(setExtendFee)}
                      required
                    />
                  </div>

                  <div className="md:col-span-4">
                    <Label htmlFor="admissionStartDate">Admission Start Date</Label>
                    <TextInput
                      type="date"
                      value={admissionStartDate}
                      onChange={handleInputChange(setAdmissionStartDate)}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <Label htmlFor="admissionEndDate">Admission End Date</Label>
                    <TextInput
                      type="date"
                      value={admissionEndDate}
                      onChange={handleInputChange(setAdmissionEndDate)}
                    />
                  </div>
                  
                  <div className="md:col-span-4">
                    <Label htmlFor="extendedDate">Extended Admission Date</Label>
                    <TextInput
                      type="date"
                      value={extendedDate}
                      onChange={handleInputChange(setExtendedDate)}
                    />
                  </div>
                  
                  <div className="md:col-span-2 flex items-end">
                    <Button type="submit" className="w-full" disabled={loadingButton2}>
                      {loadingButton2 ? (
                        <>
                          <Spinner size="sm" className="mr-2" />
                          Saving...
                        </>
                      ) : (
                        'Save'
                      )}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default FormVertical;












// import React, { useState, useEffect } from 'react';
// import { Breadcrumb, Button, Card, Label, TextInput, Select, Spinner } from 'flowbite-react';
// import { FaHome, FaMoneyBillWave } from 'react-icons/fa';
// import { useAcademics } from 'src/hook/useAcademics';
// import { useCaste } from 'src/hook/useCaste';
// import { useStates } from 'src/hook/useStates';
// import { toast } from 'react-hot-toast';
// import { useAuth } from 'src/hook/useAuth';
// import axios from 'axios';
// import ReactSelect from 'react-select';
// import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
// import Loader from 'src/Frontend/Common/Loader';

// interface FeesData {
//   id?: number;
//   academic_id: number;
//   special_caste_fee_states?: string;
//   special_caste?: string;
//   special_cast_fee?: number;
//   actual_fee?: number;
//   late_fee?: number;
//   admission_state_date?: string;
//   admission_end_date?: string;
//   extend_date?: string;
//   status?: number;
//   last_updated_at?: string;
// }

// // Custom styles for react-select to match Flowbite design
// const customStyles = {
//   control: (base: any, state: any) => ({
//     ...base,
//     backgroundColor: '#f9fafb',
//     borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
//     borderRadius: '0.5rem',
//     padding: '0.25rem',
//     boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.2)' : 'none',
//     '&:hover': {
//       borderColor: state.isFocused ? '#3b82f6' : '#9ca3af',
//     },
//     minHeight: '42px',
//   }),
//   menu: (base: any) => ({
//     ...base,
//     borderRadius: '0.5rem',
//     zIndex: 50,
//   }),
//   multiValue: (base: any) => ({
//     ...base,
//     backgroundColor: '#3b82f6',
//     borderRadius: '0.375rem',
//   }),
//   multiValueLabel: (base: any) => ({
//     ...base,
//     color: 'white',
//     fontWeight: '500',
//   }),
//   multiValueRemove: (base: any) => ({
//     ...base,
//     color: 'white',
//     ':hover': {
//       backgroundColor: '#ef4444',
//       color: 'white',
//     },
//   }),
//   option: (base: any, state: any) => ({
//     ...base,
//     backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#dbeafe' : 'white',
//     color: state.isSelected ? 'white' : '#374151',
//     ':active': {
//       backgroundColor: state.isSelected ? '#3b82f6' : '#bfdbfe',
//     },
//   }),
// };

// const FormVertical = () => {
//   const apiUrl = import.meta.env.VITE_API_URL;
//   const { academics, loading: academicLoading } = useAcademics();
//   const { caste: castelist, loading: casteLoading } = useCaste();
//   const { states: statelist, loading: statesLoading } = useStates();
//   const { user } = useAuth();

//   const [state, setState] = useState<string[]>([]);
//   const [caste, setCaste] = useState<string[]>([]);
//   const [applicableFee, setApplicableFee] = useState('');
//   const [actualFee, setActualFee] = useState('');
//   const [extendFee, setExtendFee] = useState('');
//   const [admissionStartDate, setAdmissionStartDate] = useState('');
//   const [admissionEndDate, setAdmissionEndDate] = useState('');
//   const [extendedDate, setExtendedDate] = useState('');
//   const [selectedAcademic, setSelectedAcademic] = useState('');
//   const [formVisible, setFormVisible] = useState(false);
//   const [formError, setFormError] = useState(false);
//   const [loadingButton1, setLoadingButton1] = useState(false);
//   const [loadingButton2, setLoadingButton2] = useState(false);

//   // Convert states and castes to react-select format
//   const stateOptions = statelist.map((state) => ({
//     value: state.state_id.toString(),
//     label: state.state_title,
//   }));

//   const casteOptions = castelist.map((caste) => ({
//     value: caste.id.toString(),
//     label: caste.name,
//   }));

//   const handleInputChange =
//     (setStateFunction: React.Dispatch<React.SetStateAction<any>>) =>
//     (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//       setStateFunction(event.target.value);
//     };

//   const handleStateChange = (selectedOptions: any) => {
//     const selectedValues = selectedOptions
//       ? selectedOptions.map((option: any) => option.value)
//       : [];
//     setState(selectedValues);
//   };

//   const handleCasteChange = (selectedOptions: any) => {
//     const selectedValues = selectedOptions
//       ? selectedOptions.map((option: any) => option.value)
//       : [];
//     setCaste(selectedValues);
//   };
//  const fetchRoutes = async (academicId) => {
//        try {
//          const res = await axios.post(
//            `${apiUrl}/SuperAdmin/Dropdown/get-form-route`,
//            { academic_id: academicId },
//            {
//              headers: {
//                Authorization: `Bearer ${user?.token}`,
//                "Content-Type": "application/json",
//              },
//            }
//          );
 
//          if (res.data?.data && Array.isArray(res.data.data)) {
//            const list = res.data.data.map((item: any) => ({
//              value: item.id,
//              label: item.page_name,
//            }));
//            setOptions(list);
//          } else {
//            setOptions([]);
//          }
//        } catch (error) {
//          console.error("Failed to fetch routes", error);
//          setOptions([]);
//        } finally {
//          setLoading(false);
//        }
//      };

//   const handleAcademicSelect = (selectedId: string) => {
//     // const selectedId = event.target.value;
//     setSelectedAcademic(selectedId);
//     setFormVisible(true);
//     setFormError(false);
//     getFeesData(selectedId);
//   };

//   const SpecialhandleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingButton1(true);

//     try {
//       // Validate required fields
//       if ( !applicableFee) {
//         toast.error('Please fill all required fields in Special Caste Fees Setting');
//         return;
//       }

//       const submitdata = {
//         academic_id: parseInt(selectedAcademic),
//         state: state.map((id) => parseInt(id)),
//         caste: caste.map((id) => parseInt(id)),
//         applicableFee: parseFloat(applicableFee),
//         actualFee: parseFloat(actualFee) || 0,
//         extendFee: parseFloat(extendFee) || 0,
//         admission_state_date: admissionStartDate || null,
//         admission_end_date: admissionEndDate || null,
//         extend_date: extendedDate || null,
//         s_id: user?.id || '',
//       };

//       await updateFeesData(submitdata);
//     } catch (error) {
//       console.error('Error in SpecialhandleSubmit:', error);
//     } finally {
//       setLoadingButton1(false);
//     }
//   };

//   const MainhandleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoadingButton2(true);

//     try {
//       // Validate required fields
//       if (!actualFee || !extendFee) {
//         toast.error('Please fill all required fields in Other Settings');
//         return;
//       }

//       const submitdata = {
//         academic_id: parseInt(selectedAcademic),
//         actualFee: parseFloat(actualFee),
//         extendFee: parseFloat(extendFee),
//         admission_state_date: admissionStartDate || null,
//         admission_end_date: admissionEndDate || null,
//         extend_date: extendedDate || null,
//         s_id: user?.id || '',
//       };

//       await updateFeesData(submitdata);
//     } catch (error) {
//       console.error('Error in MainhandleSubmit:', error);
//     } finally {
//       setLoadingButton2(false);
//     }
//   };

//   const updateFeesData = async (data: any) => {
//     try {
//       const response = await axios.post(`${apiUrl}/${user?.role}/Fees/Update-Fees`, data, {
//         headers: {
//           Authorization: `Bearer ${user?.token}`,
//           'Content-Type': 'application/json',
//         },
//       });

//       if (response.data.status) {
//         toast.success('Fees data updated successfully!');
//         // Refresh the data after update
//         getFeesData(selectedAcademic);
//       } else {
//         toast.error(response.data.message || 'Failed to update fees data');
//       }
//     } catch (error: any) {
//       console.error('Error updating fees data:', error);
//       toast.error(error.response?.data?.message || 'An error occurred while updating fees data');
//     }
//   };

//   const getFeesData = async (academicId: string) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Fees/get-Fees`,
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

//       if (response.data.status) {
//         const feesData: FeesData = response.data.data;
//         setFormError(false);

//         // Parse and set states
//         if (feesData.special_caste_fee_states) {
//           try {
//             const statesArray = JSON.parse(feesData.special_caste_fee_states);
//             setState(statesArray.map((id: number) => id.toString()));
//           } catch (e) {
//             console.error('Error parsing states:', e);
//             setState([]);
//           }
//         } else {
//           setState([]);
//         }

//         // Parse and set castes
//         if (feesData.special_caste) {
//           try {
//             const castesArray = JSON.parse(feesData.special_caste);
//             setCaste(castesArray.map((id: number) => id.toString()));
//           } catch (e) {
//             console.error('Error parsing castes:', e);
//             setCaste([]);
//           }
//         } else {
//           setCaste([]);
//         }

//         // Set other fields
//         setApplicableFee(feesData.special_cast_fee?.toString() || '');
//         setActualFee(feesData.actual_fee?.toString() || '');
//         setExtendFee(feesData.late_fee?.toString() || '');
//         setAdmissionStartDate(feesData.admission_state_date || '');
//         setAdmissionEndDate(feesData.admission_end_date || '');
//         setExtendedDate(feesData.extend_date || '');
//       } else {
//         setFormError(true);
//         // If no data found, show empty form but don't show error
//         if (response.data.message?.includes('not found')) {
//           setFormError(false);
//           resetForm();
//         } else {
//           toast.error(response.data.message || 'Failed to fetch fees data');
//         }
//       }
//     } catch (error: any) {
//       console.error('Error fetching fees data:', error);
//       setFormError(true);
//       // If it's a 404 or similar, treat as new form
//       if (error.response?.status === 404) {
//         setFormError(false);
//         resetForm();
//       } else {
//         toast.error(error.response?.data?.message || 'An error occurred while fetching fees data');
//       }
//     }
//   };

//   const resetForm = () => {
//     setState([]);
//     setCaste([]);
//     setApplicableFee('');
//     setActualFee('');
//     setExtendFee('');
//     setAdmissionStartDate('');
//     setAdmissionEndDate('');
//     setExtendedDate('');
//   };

//   const loading = academicLoading || casteLoading || statesLoading;

//   if (loading) {
//     return (
//       <Loader />
//     );
//   }

//   return (
//     <div>
//       {/* Select Academic Section */}
//       <Card className="mb-6">
//   <div className="flex flex-row gap-4">
//     <div className="flex-1">
//       <AcademicDropdown
//         value={selectedAcademic}
//         onChange={handleAcademicSelect}
//         label="First Select Academic"
//         isRequired
//       />
//     </div>
//     <div className="flex-1">
//       <AcademicDropdown
//         value={selectedAcademic}
//         onChange={handleAcademicSelect}
//         label="Select Page"
//         isRequired
//       />
//     </div>
//   </div>
// </Card>

//       {/* Conditional Forms */}
//       {!formError && formVisible && (
//         <>
//           {/* Special Caste Fees Setting */}
//           <Card className="mb-6">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold mb-4">Special Caste Fees Setting</h2>
//               <form onSubmit={SpecialhandleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//                   {/* State Dropdown - React Select Multi */}
//                   <div className="md:col-span-5">
//                     <Label htmlFor="state" className="block mb-2">
//                       State 
//                     </Label>
//                     <ReactSelect
//                       id="state"
//                       isMulti
//                       options={stateOptions}
//                       value={stateOptions.filter((option) => state.includes(option.value))}
//                       onChange={handleStateChange}
//                       styles={customStyles}
//                       placeholder="Select states..."
//                       isSearchable
//                       isClearable
                      
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       noOptionsMessage={({ inputValue }) =>
//                         inputValue ? `No states found for "${inputValue}"` : 'No states available'
//                       }
//                     />
//                     {state.length > 0 && (
//                       <div className="mt-2">
//                         <span className="text-sm text-blue-600 font-medium">
//                           Selected: {state.length} state(s)
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   {/* Caste Dropdown - React Select Multi */}
//                   <div className="md:col-span-4">
//                     <Label htmlFor="caste" className="block mb-2">
//                       Caste 
//                     </Label>
//                     <ReactSelect
//                       id="caste"
//                       isMulti
//                       options={casteOptions}
//                       value={casteOptions.filter((option) => caste.includes(option.value))}
//                       onChange={handleCasteChange}
//                       styles={customStyles}
//                       placeholder="Select castes..."
//                       isSearchable
//                       isClearable
                      
//                       className="react-select-container"
//                       classNamePrefix="react-select"
//                       noOptionsMessage={({ inputValue }) =>
//                         inputValue ? `No castes found for "${inputValue}"` : 'No castes available'
//                       }
//                     />
//                     {caste.length > 0 && (
//                       <div className="mt-2">
//                         <span className="text-sm text-blue-600 font-medium">
//                           Selected: {caste.length} caste(s)
//                         </span>
//                       </div>
//                     )}
//                   </div>

//                   <div className="md:col-span-2">
//                     <Label htmlFor="applicableFee">Applicable Fee *</Label>
//                     <TextInput
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={applicableFee}
//                       onChange={handleInputChange(setApplicableFee)}
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-1 flex items-end">
//                     <Button type="submit" className="w-full" disabled={loadingButton1}>
//                       {loadingButton1 ? (
//                         <>
//                           <Spinner size="sm" className="mr-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         'Save'
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </Card>

//           {/* Other Settings */}
//           <Card className="mb-6">
//             <div className="p-6">
//               <h2 className="text-xl font-semibold mb-4">Other Settings</h2>
//               <form onSubmit={MainhandleSubmit}>
//                 <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

//                    <div className="md:col-span-4">
//                     <Label htmlFor="extendFee">Platform Fee *</Label>
//                     <TextInput
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={extendFee}
//                       onChange={handleInputChange(setExtendFee)}
//                       required
//                     />
//                   </div>

//                   <div className="md:col-span-4">
//                     <Label htmlFor="actualFee">Fee for Non-Special Castes *</Label>
//                     <TextInput
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={actualFee}
//                       onChange={handleInputChange(setActualFee)}
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-4">
//                     <Label htmlFor="extendFee">Late Fee *</Label>
//                     <TextInput
//                       type="number"
//                       min="0"
//                       step="1"
//                       value={extendFee}
//                       onChange={handleInputChange(setExtendFee)}
//                       required
//                     />
//                   </div>
//                   <div className="md:col-span-4">
//                     <Label htmlFor="admissionStartDate">Admission Start Date</Label>
//                     <TextInput
//                       type="date"
//                       value={admissionStartDate}
//                       onChange={handleInputChange(setAdmissionStartDate)}
//                     />
//                   </div>
//                   <div className="md:col-span-4">
//                     <Label htmlFor="admissionEndDate">Admission End Date</Label>
//                     <TextInput
//                       type="date"
//                       value={admissionEndDate}
//                       onChange={handleInputChange(setAdmissionEndDate)}
//                     />
//                   </div>
//                   <div className="md:col-span-4">
//                     <Label htmlFor="extendedDate">Extended Admission Date</Label>
//                     <TextInput
//                       type="date"
//                       value={extendedDate}
//                       onChange={handleInputChange(setExtendedDate)}
//                     />
//                   </div>
//                   <div className="md:col-span-2 flex items-end">
//                     <Button type="submit" className="w-full" disabled={loadingButton2}>
//                       {loadingButton2 ? (
//                         <>
//                           <Spinner size="sm" className="mr-2" />
//                           Saving...
//                         </>
//                       ) : (
//                         'Save'
//                       )}
//                     </Button>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </Card>
//         </>
//       )}
//     </div>
//   );
// };

// export default FormVertical;
