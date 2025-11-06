import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import Loader from 'src/Frontend/Common/Loader';

interface ApplicationData {
  id: number;
  academic_id: number;
  roll_no: string;
  applicant_name: string;
  candidate_pic: string;
  candidate_signature: string;
  gender: string;
  adhar_no: string;
  candidate_details: string;
  payment_status: string;
  activation_status: number;
  created_at: string;
  email: string;
  mobile_no: string;
  father_name: string;
  mother_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  aadhar_no: string;
}

interface CandidateDetails {
  name: string;
  gender: string;
  Sgender: string;
  fatherName: string;
  motherName: string;
  dob: string;
  idMark1: string;
  idMark2: string;
  adharCard: string;
  candidate_pic: string;
  candidate_signature: string;
  doorNo: string;
  streetArea: string;
  address_state: string;
  Saddress_state: string;
  address_district: string;
  Saddress_district: string;
  cityTown: string;
  pincode: string;
  mobile: string;
  email: string;
  category: string;
  Scategory: string;
}

interface ApiResponse {
  data: any[];
  file_fields: any[];
  application_data: ApplicationData;
  candidate_details: CandidateDetails;
}

const apiUrl = import.meta.env.VITE_API_URL;

const ApplicationDetailsPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // State for image loading errors
  const [imageErrors, setImageErrors] = useState({
    candidatePic: false,
    signature: false
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
        `${apiUrl}/SuperAdmin/Applications/get-applications-details`,
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

      if (response.data.application_data) {
        setApplicationData(response.data.application_data);
        
        // Reset image errors when new data is loaded
        setImageErrors({
          candidatePic: false,
          signature: false
        });
        
        // Parse candidate_details from JSON string if needed
        if (typeof response.data.application_data.candidate_details === 'string') {
          try {
            const parsedDetails = JSON.parse(response.data.application_data.candidate_details);
            setCandidateDetails(parsedDetails);
          } catch (e) {
            console.error('Error parsing candidate details:', e);
            setCandidateDetails(response.data.candidate_details || {});
          }
        } else {
          setCandidateDetails(response.data.candidate_details || {});
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

  // Handle candidate image error
  const handleCandidateImageError = () => {
    setImageErrors(prev => ({
      ...prev,
      candidatePic: true
    }));
  };

  // Handle signature image error
  const handleSignatureImageError = () => {
    setImageErrors(prev => ({
      ...prev,
      signature: true
    }));
  };

  // Get image URL with error handling
  const getCandidateImageUrl = () => {
    if (imageErrors.candidatePic || !applicationData?.candidate_pic) {
      return 'https://via.placeholder.com/128x128?text=No+Image';
    }
    return `${apiUrl}/${applicationData.candidate_pic}`;
  };

  // Get signature URL with error handling
  const getSignatureImageUrl = () => {
    if (imageErrors.signature || !applicationData?.candidate_signature) {
      return 'https://via.placeholder.com/192x96?text=No+Signature';
    }
    return `${apiUrl}/${applicationData.candidate_signature}`;
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleEdit = () => {
    navigate(`/SuperAdmin/edit-application/${applicationId}`);
  };

  const handleApprove = async () => {
    if (!applicationId || !user?.token) return;

    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Applications/approve-application`,
        {
          application_id: parseInt(applicationId)
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'content-type': 'application/json',
          }
        }
      );

      if (response.data.status === 'success') {
        alert('Application approved successfully!');
        fetchApplicationDetails();
      }
    } catch (error) {
      console.error('Error approving application:', error);
      alert('Failed to approve application');
    }
  };

  const handleReject = async () => {
    if (!applicationId || !user?.token) return;

    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Applications/reject-application`,
        {
          application_id: parseInt(applicationId)
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'content-type': 'application/json',
          }
        }
      );

      if (response.data.status === 'success') {
        alert('Application rejected successfully!');
        fetchApplicationDetails();
      }
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('Failed to reject application');
    }
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

  // Get display values
  const getDisplayValue = (value: any, fallback: string = 'N/A') => {
    return value && value !== '' ? value : fallback;
  };

  const getGenderDisplay = (gender: string) => {
    if (candidateDetails?.Sgender) return candidateDetails.Sgender;
    return gender === '1' ? 'Male' : gender === '2' ? 'Female' : 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Application Details
                </h1>
                <p className="text-gray-600 mt-1">
                  Roll No: {applicationData.roll_no} • Applied on: {new Date(applicationData.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3">
                <Button color="gray" onClick={handleBack}>
                  Back
                </Button>
                <Button color="blue" onClick={handlePrint}>
                  Print
                </Button>
                <Button color="success" onClick={handleEdit}>
                  Edit
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Personal Information
              </h2>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Candidate Photo */}
                <div className="flex-shrink-0">
                  <img
                    src={getCandidateImageUrl()}
                    alt="Candidate"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-200"
                    onError={handleCandidateImageError}
                  />
                </div>

                {/* Personal Details */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Full Name</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {getDisplayValue(applicationData.applicant_name)}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-600">Roll Number</label>
                    <p className="mt-1 text-lg font-semibold text-gray-900">
                      {getDisplayValue(applicationData.roll_no)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Gender</label>
                    <p className="mt-1 text-gray-900">
                      {getGenderDisplay(applicationData.gender)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Email</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.email || applicationData.email)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Mobile</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.mobile || applicationData.mobile_no)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.dob)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Father's Name</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.fatherName || applicationData.father_name)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Mother's Name</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.motherName || applicationData.mother_name)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Aadhaar Number</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.adharCard || applicationData.adhar_no)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-600">Category</label>
                    <p className="mt-1 text-gray-900">
                      {getDisplayValue(candidateDetails?.Scategory)}
                    </p>
                  </div>

                  {candidateDetails?.idMark1 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Identification Mark 1</label>
                      <p className="mt-1 text-gray-900">{candidateDetails.idMark1}</p>
                    </div>
                  )}

                  {candidateDetails?.idMark2 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600">Identification Mark 2</label>
                      <p className="mt-1 text-gray-900">{candidateDetails.idMark2}</p>
                    </div>
                  )}

                  {/* Address Information */}
                  <div className="md:col-span-2 border-t pt-4 mt-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Address Information</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Door No</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.doorNo)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Street/Area</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.streetArea)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">City/Town</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.cityTown || applicationData.city)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">State</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.Saddress_state || applicationData.state)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">District</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.Saddress_district)}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600">Pincode</label>
                        <p className="mt-1 text-gray-900">
                          {getDisplayValue(candidateDetails?.pincode || applicationData.pincode)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Information Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Application Status & Payment Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-600">Application ID</label>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {applicationData.id}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Academic ID</label>
                  <p className="mt-1 text-gray-900">{applicationData.academic_id}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Payment Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    applicationData.payment_status === '1' 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-red-800 bg-red-100'
                  }`}>
                    {applicationData.payment_status === '1' ? 'Paid' : 'Unpaid'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Activation Status</label>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-1 ${
                    applicationData.activation_status === 1 
                      ? 'text-green-800 bg-green-100' 
                      : 'text-yellow-800 bg-yellow-100'
                  }`}>
                    {applicationData.activation_status === 1 ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Applied Date</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(applicationData.created_at).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600">Last Updated</label>
                  <p className="mt-1 text-gray-900">
                    {new Date(applicationData.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Additional Information */}
          <div className="space-y-6">
            {/* Signature Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Candidate Signature
              </h2>
              
              <div className="flex justify-center">
                <img
                  src={getSignatureImageUrl()}
                  alt="Signature"
                  className="w-48 h-24 object-contain border-2 border-gray-300 rounded"
                  onError={handleSignatureImageError}
                />
              </div>
            </div>

            {/* Quick Actions Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Quick Actions
              </h2>
              
              <div className="space-y-3">
                <Button color="blue" className="w-full justify-center">
                  Download Documents
                </Button>
                <Button 
                  color="success" 
                  className="w-full justify-center"
                  onClick={handleApprove}
                >
                  Approve Application
                </Button>
                <Button 
                  color="failure" 
                  className="w-full justify-center"
                  onClick={handleReject}
                >
                  Reject Application
                </Button>
                <Button color="warning" className="w-full justify-center">
                  Send Message
                </Button>
              </div>
            </div>

            {/* Application Timeline Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
                Application Timeline
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Application Submitted</p>
                    <p className="text-sm text-gray-500">
                      {new Date(applicationData.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Under Review</p>
                    <p className="text-sm text-gray-500">In progress</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Final Decision</p>
                    <p className="text-sm text-gray-500">Pending</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetailsPage;