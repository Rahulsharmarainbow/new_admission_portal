import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface FormField {
  id: number;
  academic_id: number;
  name: string;
  vname: string | null;
  box_id: number;
  after_editable: number;
  max_date: string | null;
  type: string;
  apiurl: string;
  tbl: string | null;
  label: string;
  width: string;
  validation: string | null;
  validation_message: string;
  placeholder: string | null;
  value: any;
  resolution: string;
  options: any;
  content: string | null;
  src: string | null;
  target: string | null;
  h_target: string | null;
  v_target: string | null;
  required: number;
  sequence: number | null;
  style: string | null;
}

interface ApplicationData {
  id: number;
  academic_id: number;
  degree_id: number | null;
  class_id: number | null;
  series_id: string;
  class_series_id: number | null;
  roll_no: string;
  temp_roll_no: string;
  applicant_name: string;
  dob: string;
  candidate_pic: string;
  candidate_signature: string;
  gender: string;
  adhar_no: string | null;
  candidate_details: string | any;
  payment_id: number | null;
  payment_status: string;
  activation_status: number;
  archive: number;
  pass_fail: number | null;
  created_at: string;
  session_token: string | null;
  rankcard_session_token: string | null;
  email: string;
  mobile_no: string;
  father_name: string;
  mother_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aadhar_no: string;
  remarks: string;
}

interface CandidateDetails {
  [key: string]: string;
}

interface ApiResponse {
  data: FormField[];
  file_fields: FormField[];
  application_data: ApplicationData;
  candidate_details: CandidateDetails;
}

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

const ApplicationDetailsPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [fileFields, setFileFields] = useState<FormField[]>([]);
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for image loading errors
  const [imageErrors, setImageErrors] = useState({
    candidatePic: false,
    signature: false,
    casteCertificate: false
  });

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    if (!applicationId || !user?.token) {
      setError('Missing application ID or user token');
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/${user.role}/Applications/get-applications-details`,
        {
          application_id: parseInt(applicationId)
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'accept': 'application/json',
            'accept-language': 'en-US,en;q=0.9',
            'content-type': 'application/json',
          }
        }
      );

      console.log('API Response:', response.data);

      if (response.data) {
        // Remove duplicates from file_fields that already exist in data
        const dataFieldNames = new Set(response.data.data.map(field => field.name));
        const uniqueFileFields = response.data.file_fields.filter(field => 
          !dataFieldNames.has(field.name)
        );

        setFormFields(response.data.data || []);
        setFileFields(uniqueFileFields || []);
        setApplicationData(response.data.application_data);
        
        // Reset image errors when new data is loaded
        setImageErrors({
          candidatePic: false,
          signature: false,
          casteCertificate: false
        });
        
        // Parse candidate_details
        if (response.data.candidate_details) {
          setCandidateDetails(response.data.candidate_details);
        } else if (typeof response.data.application_data.candidate_details === 'string') {
          try {
            const parsedDetails = JSON.parse(response.data.application_data.candidate_details);
            setCandidateDetails(parsedDetails);
          } catch (e) {
            console.error('Error parsing candidate details:', e);
            setCandidateDetails({});
          }
        } else {
          setCandidateDetails(response.data.application_data.candidate_details || {});
        }
      } else {
        setError('Application data not found in response');
      }
    } catch (error: any) {
      console.error('Error fetching application details:', error);
      setError(error.response?.data?.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  // Handle image errors
  const handleImageError = (imageType: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageType]: true
    }));
  };

  // Get image URL with error handling
  const getImageUrl = (imagePath: string | null | undefined, imageType: string, placeholderText: string) => {
    if (imageErrors[imageType as keyof typeof imageErrors] || !imagePath) {
      return `https://via.placeholder.com/300x200?text=${placeholderText}`;
    }
    return `${assetUrl}/${imagePath}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  // Get display value from candidate details
  const getDisplayValue = (fieldName: string, fallback: string = '') => {
    if (!candidateDetails) return fallback;
    
    // Try to get the value with "S" prefix first (display value)
    const displayValue = candidateDetails[`S${fieldName}`] || candidateDetails[fieldName];
    return displayValue && displayValue !== '' ? displayValue : fallback;
  };

  // Group fields by box_id for better organization
  const groupFieldsByBox = (fields: FormField[]) => {
    const grouped: { [key: number]: FormField[] } = {};
    fields.forEach(field => {
      if (!grouped[field.box_id]) {
        grouped[field.box_id] = [];
      }
      grouped[field.box_id].push(field);
    });
    return grouped;
  };

  // Get box title based on box_id
  const getBoxTitle = (boxId: number): string => {
    const boxTitles: { [key: number]: string } = {
      1: 'Stream Information',
      2: 'Personal Information',
      3: 'Candidate Photos',
      4: 'Contact Information',
      5: 'Educational Background',
      6: 'Academic Details',
      7: 'Category & Additional Information',
      10: 'Basic Information',
      11: 'Personal Details',
      13: 'Father/Guardian Information',
      14: 'Mother Information',
      15: 'Educational Background',
      16: 'Documents',
      17: 'Address Information'
    };
    return boxTitles[boxId] || `Section ${boxId}`;
  };

  // Render field value based on field type
  // Add this helper function near the top of your component
const isMultiDataObject = (value: any): boolean => {
  if (!value || typeof value !== 'object') return false;
  try {
    const parsed = typeof value === 'string' ? JSON.parse(value) : value;
    return Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'object';
  } catch {
    return false;
  }
};

const renderMultiDataField = (value: any, field: FormField) => {
  try {
    const multiData = typeof value === 'string' ? JSON.parse(value) : value;
    
    if (!Array.isArray(multiData) || multiData.length === 0) {
      return (
        <div className="text-gray-400 italic text-sm">No entries provided</div>
      );
    }

    // Try to get column names from the first object
    const firstItem = multiData[0];
    const columns = Object.keys(firstItem).map(key => ({
      name: key,
      label: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    }));

    return (
      <div className="mt-2 w-full">
        
        
        {/* Full width table - always visible */}
        <div className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider w-12"
                  >
                    #
                  </th>
                  {columns.map(col => (
                    <th 
                      key={col.name} 
                      scope="col" 
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {multiData.map((item: any, index: number) => (
                  <tr 
                    key={index} 
                    className={`hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}
                  >
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
                        <span className="text-xs font-semibold text-blue-600">{index + 1}</span>
                      </div>
                    </td>
                    {columns.map(col => (
                      <td 
                        key={col.name} 
                        className="py-3 px-4 text-sm text-gray-900"
                      >
                        <div className="max-w-xs break-words">
                          {item[col.name] || (
                            <span className="text-gray-400 italic">—</span>
                          )}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error rendering multi-data field:', error);
    return (
      <div className="text-red-500 text-sm">Error displaying data</div>
    );
  }
};

// Update the renderFieldValue function to handle multi-data
const renderFieldValue = (field: FormField) => {
  const value = getDisplayValue(field.name);
  
  if (field.type === 'file_button') {
    const filePath = candidateDetails?.[field.name];
    if (!filePath) return 'No file uploaded';
    
    return (
      <div className="mt-2">
        <img
          src={getImageUrl(filePath, field.name, 'No+Image')}
          alt={field.label || 'Uploaded file'}
          className="w-full h-48 object-contain border rounded-lg bg-gray-50"
          onError={() => handleImageError(field.name)}
        />
      </div>
    );
  }
  
  // Handle multi-data fields
  if (isMultiDataObject(value)) {
    return renderMultiDataField(value, field);
  }
  
  return (
    <div className="min-h-[24px] py-1 px-3 bg-gray-50 rounded-lg border border-gray-200">
      {value || 'NA'}
    </div>
  );
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader />
      </div>
    );
  }

  if (error || !applicationData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-red-500 text-xl mb-4">
            {error || 'Application not found'}
          </div>
          <Button onClick={handleBack} color="blue">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  // Combine form fields and file fields, removing any potential duplicates
  const allFields = [...formFields, ...fileFields];
  const groupedFields = groupFieldsByBox(allFields);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <BreadcrumbHeader
        title="Applications Details"
        paths={[{ name: 'Applications', link: '#' }]}
      />
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        {/* <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap gap-4 mt-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Roll No:</span> {applicationData.roll_no}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Applied on:</span> {new Date(applicationData.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Application ID:</span> {applicationData.id}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Academic ID:</span> {applicationData.academic_id}
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex gap-2">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    applicationData.payment_status === '1' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-red-800 bg-red-100'
                  }`}>
                    {applicationData.payment_status === '1' ? 'Paid' : 'Unpaid'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    applicationData.activation_status === 1 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-yellow-800 bg-yellow-100'
                  }`}>
                    {applicationData.activation_status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Application Sections */}
          <div className="lg:col-span-3 space-y-6">
            {/* Render each box section */}
            {Object.entries(groupedFields)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([boxId, fields]) => (
              <div key={boxId} className="bg-white rounded-lg shadow-md p-6">
                {/* <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-3">
                  {getBoxTitle(parseInt(boxId))}
                </h2> */}
                
                {/* Regular form fields */}
                <div className={`
                  grid gap-6 
                  ${fields.some(field => field.type === 'multi_data') 
                    ? 'grid-cols-1'  // If any field is multi_data, use single column
                    : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}  // Otherwise use multi-column
                `}>
                  {fields
                    .filter(field => field.type !== 'file_button')
                    .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                    .map(field => {
                      // If field type is 'heading', render as header with full width
                      if (field.type === 'heading') {
                        return (
                          <div 
                            key={`${field.id}-${field.name}`} 
                            className="col-span-full"
                          >
                            <h3 className="text-lg font-semibold text-gray-900 mb-2 pb-2 ">
                              {field.content || field.label}
                            </h3>
                           
                          </div>
                        );
                      }
                      
                      // Regular fields
                      const isMultiDataField = field.type === 'multi_data';
                      
                      return (
                        <div 
                          key={`${field.id}-${field.name}`} 
                          className={`space-y-2 ${
                            isMultiDataField ? 'col-span-full' : ''
                          }`}
                        >
                          
                            {!isMultiDataField && (
                              <label className="block text-sm font-medium text-gray-700">
                                {field.label}
                                {field.required === 1 && <span className="text-red-500 ml-1">*</span>}
                              </label>
                            )}
                                              
                          <div className="text-gray-900">
                            {renderFieldValue(field)}
                          </div>
                        </div>
                      );
                    })}
                </div>

                {/* File upload fields for this box */}
                {fields.filter(field => field.type === 'file_button' && field.name !== 'candidate_pic').length > 0 && (
                  <div className="mt-8 pt-6 Uploaded Documents">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Documents</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {fields
                        .filter(field => field.type === 'file_button' && field.name !== 'candidate_pic')
                        .sort((a, b) => (a.sequence || 0) - (b.sequence || 0))
                        .map(field => (
                          <div key={`${field.id}-${field.name}`} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <label className="block text-sm font-medium text-gray-700 mb-3">
                              {field.content || field.label}
                              {field.required === 1 && <span className="text-red-500 ml-1">*</span>}
                            </label>
                            {renderFieldValue(field)}
                          </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>

          {/* Right Column - Quick Info & Images */}
          <div className="space-y-6">
            {/* Candidate Photos */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
                Candidate Photos
              </h2>
              
              <div className="space-y-6">
                {/* Candidate Picture */}
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Candidate Photo
                  </label>
                  <div className="flex justify-center">
                    <img
                      src={getImageUrl(applicationData.candidate_pic, 'candidatePic', 'No+Photo')}
                      alt="Candidate"
                      className="w-40 h-40 rounded-full object-cover border-4 border-blue-200 shadow-sm"
                      onError={() => handleImageError('candidatePic')}
                    />
                  </div>
                </div>

                {/* Signature */}
                {candidateDetails?.candidate_signature && (
                <div className="text-center">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Signature
                  </label>
                  <div className="flex justify-center">
                    <img
                      src={getImageUrl(applicationData.candidate_signature, 'signature', 'No+Signature')}
                      alt="Signature"
                      className="w-48 h-20 object-contain border-2 border-gray-300 rounded bg-white shadow-sm"
                      onError={() => handleImageError('signature')}
                    />
                  </div>
                </div>
                 )}

                {/* Caste Certificate */}
                {candidateDetails?.caste_certificate && (
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Caste Certificate
                    </label>
                    <div className="flex justify-center">
                      <img
                        src={getImageUrl(candidateDetails.caste_certificate, 'casteCertificate', 'No+Certificate')}
                        alt="Caste Certificate"
                        className="w-full max-w-48 h-auto max-h-48 object-contain border-2 border-gray-300 rounded bg-white shadow-sm"
                        onError={() => handleImageError('casteCertificate')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-3">
                Application Summary
              </h2>
              
              <div className="space-y-4">
                
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Roll Number</span>
                  <span className="text-gray-900 font-medium">{applicationData.roll_no}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Applicant Name</span>
                  <span className="text-gray-900 font-medium text-right">{getDisplayValue('first_name')} {getDisplayValue('middle_name')} {getDisplayValue('last_name')}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Class</span>
                  <span className="text-gray-900 font-medium">{getDisplayValue('class')}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Applied Date</span>
                  <span className="text-gray-900 text-sm">{new Date(applicationData.created_at).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Payment Status</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                    applicationData.payment_status === '1' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-red-800 bg-red-100'
                  }`}>
                    {applicationData.payment_status === '1' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-600">Payment Mode</span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white-800 bg-orange-100`}>
                    {applicationData.payment_mode === 2 ? 'Offline': 'Online'}
                  </span>
                </div>
                {
                  applicationData.remark !== '' && (
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm font-medium text-gray-600">Remark</span>
                      <span className="text-gray-900 font-medium text-right">{applicationData.remark}</span>
                    </div>
                  )
                }
               {(applicationData?.payment_type_manual === 1) && (
                  <div className="text-center">
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Screen Shot
                    </label>
                    <div className="flex justify-center">
                      <img
                        src={assetUrl +"/" + applicationData.screenshot}
                        alt="Caste Certificate"
                        className="w-full max-w-48 h-auto max-h-48 object-contain border-2 border-gray-300 rounded bg-white shadow-sm"
                        onError={() => handleImageError('casteCertificate')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;