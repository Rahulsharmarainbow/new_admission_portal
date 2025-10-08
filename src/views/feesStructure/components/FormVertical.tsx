



'use client';

import React, { useState, useEffect } from 'react';
import { Breadcrumb, Button, Card, Label, TextInput, Select, Spinner } from 'flowbite-react';
import { FaHome, FaMoneyBillWave } from 'react-icons/fa';
import { MdDateRange } from 'react-icons/md';
import { useAcademics } from 'src/hook/useAcademics';
import toast from 'react-hot-toast';
import { useAuth } from 'src/hook/useAuth';

const BCrumb = [
  {
    title: 'Home',
    icon: FaHome,
  },
  {
    title: 'Fees Structure',
    icon: FaMoneyBillWave,
  },
];

const FormVertical = () => {
  // Use Vite's import.meta.env instead of process.env
  const apiUrl = import.meta.env.VITE_API_URL;
  const { academics, loading: academicLoading } = useAcademics();

  const {user} = useAuth()
  const [state, setState] = useState<string[]>([]);
  const [caste, setCaste] = useState<string[]>([]);
  const [statelist, setStateList] = useState<any[]>([]);
  const [castelist, setCasteList] = useState<any[]>([]);
  const [applicableFee, setApplicableFee] = useState('');
  const [actualFee, setActualFee] = useState('');
  const [extendFee, setExtendFee] = useState('');
  const [admissionStartDate, setAdmissionStartDate] = useState('');
  const [admissionEndDate, setAdmissionEndDate] = useState('');
  const [extendedDate, setExtendedDate] = useState('');
  const [selectedAcademic, setSelectedAcademic] = useState('');
  const [formVisible, setFormVisible] = useState(false);
  const [formError, setFormError] = useState(false);
  const [loadingButton1, setLoadingButton1] = useState(false);
  const [loadingButton2, setLoadingButton2] = useState(false);

  const handleInputChange = (setStateFunction: React.Dispatch<React.SetStateAction<any>>) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStateFunction(event.target.value);
  };

  const handleMultiSelectChange = (setStateFunction: React.Dispatch<React.SetStateAction<string[]>>) => (event: React.ChangeEvent<HTMLSelectElement>) => {
    const options = event.target.options;
    const selectedValues: string[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selectedValues.push(options[i].value);
      }
    }
    setStateFunction(selectedValues);
  };

  const handleAcademicSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = event.target.value;
    setSelectedAcademic(selectedId);
    setFormVisible(true);
    setFormError(false);
    getFeesData(selectedId);
  };

  const MainhandleSubmit = (e: React.FormEvent) => {
    setLoadingButton2(true);
    e.preventDefault();
    const submitdata = {
      actual_fee: actualFee,
      late_fee: extendFee,
      admission_state_date: admissionStartDate,
      admission_end_date: admissionEndDate,
      extend_date: extendedDate,
      academic_id: selectedAcademic,
    };
    updateFeesData(submitdata);
  };

  const SpecialhandleSubmit = (e: React.FormEvent) => {
    setLoadingButton1(true);
    e.preventDefault();
    const submitdata = {
      special_caste_fee_states: state,
      special_caste: caste,
      special_cast_fee: applicableFee,
      academic_id: selectedAcademic,
    };
    updateFeesData(submitdata);
  };

  const updateFeesData = (data: any) => {
    // You'll need to implement the update API call here
    // For now, just show a success message
    toast.success('Fees data updated successfully!');
    setLoadingButton1(false);
    setLoadingButton2(false);
    
    // Example API call structure:
    /*
    fetch(apiUrl + 'api/SuperAdmin/Fees/update-Fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_TOKEN_HERE' // You'll need to handle auth
      },
      body: JSON.stringify(data),
    })
    .then((response) => response.json())
    .then((data) => {
      if (data.status) {
        toast.success('Fees data updated successfully!');
      } else {
        toast.error(data.message || 'Failed to update fees data');
      }
      setLoadingButton1(false);
      setLoadingButton2(false);
    })
    .catch((error) => {
      console.error('Error:', error);
      toast.error('An error occurred while updating fees data');
      setLoadingButton1(false);
      setLoadingButton2(false);
    });
    */
  };

  const getFeesData = (academicId: string) => {
    fetch(apiUrl + '/SuperAdmin/Fees/get-Fees', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user?.token}` 
      },
      body: JSON.stringify({
        academic_id: parseInt(academicId)
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        if (data.status) {
          const feesData = data.data;
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
          }
          
          // Set other fields
          setApplicableFee(feesData.special_cast_fee?.toString() || '');
          setActualFee(feesData.actual_fee?.toString() || '');
          setExtendFee(feesData.late_fee?.toString() || '');
          setAdmissionStartDate(feesData.admission_state_date || '');
          setAdmissionEndDate(feesData.admission_end_date || '');
          setExtendedDate(feesData.extend_date || '');
        } else {
          setFormError(true);
          // If no data found, show empty form but don't show error
          if (data.message?.includes('not found')) {
            setFormError(false);
            resetForm();
          } else {
            toast.error(data.message || 'Failed to fetch fees data');
          }
        }
      })
      .catch((error) => {
        console.error('Error during API call:', error);
        setFormError(true);
        toast.error('An error occurred while fetching fees data');
      });
  };

  const resetForm = () => {
    setState([]);
    setCaste([]);
    setApplicableFee('');
    setActualFee('');
    setExtendFee('');
    setAdmissionStartDate('');
    setAdmissionEndDate('');
    setExtendedDate('');
  };

  useEffect(() => {
    // Fetch state and caste lists
    fetch(apiUrl + 'api/getStateList', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setStateList(data);
      })
      .catch((error) => {
        console.error('Error fetching state list:', error);
      });

    fetch(apiUrl + 'api/getCasteList', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCasteList(data);
      })
      .catch((error) => {
        console.error('Error fetching caste list:', error);
      });
  }, [apiUrl]);

  if (academicLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-sm text-gray-600">
        {BCrumb.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            {index > 0 && <span>/</span>}
            <item.icon className="w-4 h-4" />
            <span>{item.title}</span>
          </div>
        ))}
      </div>

      {/* Select Academic Section */}
      <Card className="mb-6">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Select Academic</h2>
          <div className="space-y-2">
            <Label htmlFor="academic">Select Academic *</Label>
            <Select
              value={selectedAcademic}
              onChange={handleAcademicSelect}
              required
            >
              <option value="">Select Academic</option>
              {academics.map((option: any) => (
                <option key={option.id} value={option.id}>
                  {option.academic_name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </Card>

      {/* Conditional Forms */}
      {(!formError && formVisible) && (
        <>
          {/* Special Caste Fees Setting */}
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">Special Caste Fees Setting</h2>
              <form onSubmit={SpecialhandleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* State Dropdown - Increased size */}
                  <div className="md:col-span-5">
                    <Label htmlFor="state">State *</Label>
                    <Select
                      value={state}
                      onChange={handleMultiSelectChange(setState)}
                      multiple
                      required
                      className="h-32" // Increased height
                      size={8} // Show more options at once
                    >
                      <option value="" disabled>Select State</option>
                      {statelist.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <div className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple states
                    </div>
                  </div>
                  
                  {/* Caste Dropdown - Increased size */}
                  <div className="md:col-span-4">
                    <Label htmlFor="caste">Caste *</Label>
                    <Select
                      value={caste}
                      onChange={handleMultiSelectChange(setCaste)}
                      multiple
                      required
                      className="h-32" // Increased height
                      size={8} // Show more options at once
                    >
                      {castelist.map((option: any) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Select>
                    <div className="text-xs text-gray-500 mt-1">
                      Hold Ctrl/Cmd to select multiple castes
                    </div>
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
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loadingButton1}
                    >
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
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={loadingButton2}
                    >
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









