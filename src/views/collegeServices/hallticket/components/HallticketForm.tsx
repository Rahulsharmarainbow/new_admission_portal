import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';
import axios from 'axios';
import Select from 'react-select';
import { useAuth } from 'src/hook/useAuth';
import AcademicDropdown from 'src/Frontend/Common/AcademicDropdown';
import Loader from 'src/Frontend/Common/Loader';
import toast from 'react-hot-toast';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface DegreeOption {
  value: number;
  label: string;
}

interface FormData {
  academic_id: string;
  degree_id: string;
  hall_ticket_series: string;
  start_series: string;
  end_series: string;
  exam_center_name: string;
  center_address: string;
  exam_date: string;
  exam_time: string;
  exam_end_time: string;
}

const HallticketForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [degreeLoading, setDegreeLoading] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    academic_id: user?.role === 'CustomerAdmin' ? user?.academic_id?.toString() || '' : '',
    degree_id: '',
    hall_ticket_series: '',
    start_series: '',
    end_series: '',
    exam_center_name: '',
    center_address: '',
    exam_date: '',
    exam_time: '',
    exam_end_time: '',
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  // Fetch degrees when academic_id changes
  useEffect(() => {
    if (formData.academic_id) {
      fetchDegrees(formData.academic_id);
    } else {
      setDegrees([]);
      setFormData(prev => ({ ...prev, degree_id: '' }));
    }
  }, [formData.academic_id]);

  // Fetch hallticket data for edit
  useEffect(() => {
    if (isEdit && id) {
      fetchHallticketData();
    }
  }, [isEdit, id]);

  const fetchDegrees = async (academicId: string) => {
    setDegreeLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Dropdown/get-degree`,
        {
          academic_id: parseInt(academicId),
          s_id: user?.id,
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

  const fetchHallticketData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CollegeManagement/Hallticket/details`,
        {
          id: parseInt(id!),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Edit API Response:', response.data);

      if (response.data.status === true && response.data.data) {
        const data = response.data.data;
        
        // Map the API response to form fields
        setFormData({
          academic_id: data.academic_id?.toString() || '',
          degree_id: data.degree_id?.toString() || '',
          hall_ticket_series: data.hall_ticket_series || '',
          start_series: data.start_series || '',
          end_series: data.end_series || '',
          exam_center_name: data.exam_center_name || '',
          center_address: data.center_address || '',
          exam_date: data.exam_date || '',
          exam_time: data.exam_time || '',
          exam_end_time: data.exam_end_time || '',
        });

        // Fetch degrees for the academic
        if (data.academic_id) {
          fetchDegrees(data.academic_id.toString());
        }
      } else {
        toast.error(response.data.message || 'Hallticket not found');
        navigate(`/${user?.role}/halltickets`);
      }
    } catch (error: any) {
      console.error('Error fetching hallticket:', error);
      toast.error('Failed to fetch hallticket data');
      navigate(`/${user?.role}/halltickets`);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if(formData.academic_id === '' && user?.role != "CustomerAdmin"){
          toast.error('Please select an academic');
          return;
        }
    setSubmitting(true);
    

    try {
      // Prepare payload according to your API structure
      const payload: any = {
        academic_id: parseInt(formData.academic_id),
        degree_id: parseInt(formData.degree_id),
        hall_ticket_series: formData.hall_ticket_series,
        start_series: formData.start_series,
        end_series: formData.end_series,
        exam_center_name: formData.exam_center_name,
        center_address: formData.center_address,
        exam_date: formData.exam_date,
        exam_time: formData.exam_time,
        exam_end_time: formData.exam_end_time,
        s_id: user?.id,
      };

      // Add id for edit operation
      if (isEdit && id) {
        payload.id = parseInt(id);
      }

      console.log('Submitting payload:', payload);

      const url = isEdit 
        ? `${apiUrl}/${user?.role}/CollegeManagement/Hallticket/update`
        : `${apiUrl}/${user?.role}/CollegeManagement/Hallticket/add`;

      const response = await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('API Response:', response.data);

      if (response.data.status === true) {
        toast.success(response.data.message || `Hallticket ${isEdit ? 'updated' : 'created'} successfully!`);
        navigate(`/${user?.role}/halltickets`);
      } else {
        toast.error(response.data.message || `Failed to ${isEdit ? 'update' : 'create'} hallticket`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast.error(`Failed to ${isEdit ? 'update' : 'create'} hallticket`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <BreadcrumbHeader
        title={isEdit ? 'Edit Hallticket' : 'Add Hallticket'}
        paths={[
          { name: 'Hallticket', link: `/${user?.role}/halltickets` },
          { name: isEdit ? 'Edit' : 'Add', link: '#' }
        ]}
      />
      <div className="p-6 bg-white rounded-lg shadow-md">
        {/* <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit Hallticket' : 'Add New Hallticket'}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEdit ? 'Update the hallticket information below.' : 'Fill in the details to create a new hallticket.'}
          </p>
        </div> */}

     <form onSubmit={handleSubmit} className="space-y-4">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Academic Dropdown */}
     {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div>
      <Label htmlFor="academic_id" className="text-sm font-medium">
        Academic <span className="text-red-500">*</span>
      </Label>
      <AcademicDropdown
        value={formData.academic_id}
        onChange={handleAcademicChange}
        name="academic_id"
        isRequired={true}
        placeholder="Search academic..."
        label=""
        className="mt-1"
      />
    </div> )}

    {/* Degree Dropdown */}
    <div>
      <Label htmlFor="degree_id" className="text-sm font-medium">
        Degree <span className="text-red-500">*</span>
      </Label>
      <Select
        id="degree_id"
        isLoading={degreeLoading}
        isDisabled={!formData.academic_id || degreeLoading}
        options={degrees}
        value={degrees.find(opt => opt.value.toString() === formData.degree_id)}
        onChange={handleSelectChange('degree_id')}
        placeholder={formData.academic_id ? "Select degree..." : "First select academic"}
        classNamePrefix="react-select"
        className="mt-1"
        styles={{
          control: (base) => ({
            ...base,
            borderColor: "#d1d5db",
            borderRadius: "0.375rem",
            padding: "1px",
            minHeight: "38px",
            fontSize: "0.875rem",
            boxShadow: "none",
            "&:hover": { borderColor: "#93c5fd" },
          }),
        }}
      />
    </div>

    {/* Hallticket Series */}
    <div>
      <Label htmlFor="hall_ticket_series" className="text-sm font-medium">
        Hallticket Series <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="hall_ticket_series"
        name="hall_ticket_series"
        value={formData.hall_ticket_series}
        onChange={handleInputChange}
        placeholder="Enter series"
        required
        className="mt-1"
      />
    </div>

    {/* Start Series */}
    <div>
      <Label htmlFor="start_series" className="text-sm font-medium">
        Start Series <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="start_series"
        name="start_series"
        value={formData.start_series}
        onChange={handleInputChange}
        placeholder="Enter start series"
        required
        className="mt-1"
      />
    </div>

    {/* End Series */}
    <div>
      <Label htmlFor="end_series" className="text-sm font-medium">
        End Series <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="end_series"
        name="end_series"
        value={formData.end_series}
        onChange={handleInputChange}
        placeholder="Enter end series"
        required
        className="mt-1"
      />
    </div>

    {/* Exam Center Name */}
    <div>
      <Label htmlFor="exam_center_name" className="text-sm font-medium">
        Exam Center <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="exam_center_name"
        name="exam_center_name"
        value={formData.exam_center_name}
        onChange={handleInputChange}
        placeholder="Enter center name"
        required
        className="mt-1"
      />
    </div>
  </div>

  {/* Exam Date and Times in one line */}
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div>
      <Label htmlFor="exam_date" className="text-sm font-medium">
        Exam Date <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="exam_date"
        name="exam_date"
        type="date"
        value={formData.exam_date}
        onChange={handleInputChange}
        required
        className="mt-1"
      />
    </div>

    <div>
      <Label htmlFor="exam_time" className="text-sm font-medium">
        Start Time <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="exam_time"
        name="exam_time"
        type="time"
        value={formData.exam_time}
        onChange={handleInputChange}
        required
        className="mt-1"
      />
    </div>

    <div>
      <Label htmlFor="exam_end_time" className="text-sm font-medium">
        End Time <span className="text-red-500">*</span>
      </Label>
      <TextInput
        id="exam_end_time"
        name="exam_end_time"
        type="time"
        value={formData.exam_end_time}
        onChange={handleInputChange}
        required
        className="mt-1"
      />
    </div>
  </div>

  {/* Center Address */}
  <div>
    <Label htmlFor="center_address" className="text-sm font-medium">
      Center Address <span className="text-red-500">*</span>
    </Label>
    <Textarea
      id="center_address"
      name="center_address"
      value={formData.center_address}
      onChange={handleInputChange}
      placeholder="Enter complete address"
      rows={3}
      required
      className="mt-1"
    />
  </div>

  {/* Form Actions */}
  <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
    <Button
      type="button"
      color="alternative"
      onClick={() => navigate(`/${user?.role}/halltickets`)}
      disabled={submitting}
      size="sm"
    >
      Cancel
    </Button>
    <Button
      type="submit"
      color='primary'
      disabled={submitting}
      isProcessing={submitting}
      size="sm"
    >
      {isEdit ? 'Update' : 'Create'}
    </Button>
  </div>
</form>
      </div>
    </>
  );
};

export default HallticketForm;