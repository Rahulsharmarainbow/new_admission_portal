import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'flowbite-react';
import { Application } from '../ApplicationManagementTable';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import Loader from 'src/Frontend/Common/Loader';

interface ApplicationDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application | null;
}

interface ApplicationDetails {
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
  application_data: ApplicationDetails;
  candidate_details: CandidateDetails;
}

const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  isOpen,
  onClose,
  application,
}) => {
  const [applicationDetails, setApplicationDetails] = useState<ApplicationDetails | null>(null);
  const [candidateDetails, setCandidateDetails] = useState<CandidateDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dataLoaded, setDataLoaded] = useState(false);
  const { user } = useAuth();
  
  // State for image loading errors
  const [imageErrors, setImageErrors] = useState({
    candidatePic: false,
    signature: false
  });

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && application && !dataLoaded) {
      fetchApplicationDetails();
    }
  }, [isOpen, application, dataLoaded]);

  useEffect(() => {
    if (!isOpen) {
      setApplicationDetails(null);
      setCandidateDetails(null);
      setDataLoaded(false);
      setError('');
      // Reset image errors when modal closes
      setImageErrors({
        candidatePic: false,
        signature: false
      });
    }
  }, [isOpen]);

  const fetchApplicationDetails = async () => {
    if (!application || !user?.token || dataLoaded) return;

    setLoading(true);
    try {
      const response = await axios.post<ApiResponse>(
        `${apiUrl}/${user.role}/Applications/get-applications-details`,
        {
          application_id: application.application_id || application.id
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

      if (response.data.application_data) {
        setApplicationDetails(response.data.application_data);
        
        if (typeof response.data.application_data.candidate_details === 'string') {
          try {
            const parsedDetails = JSON.parse(response.data.application_data.candidate_details);
            setCandidateDetails(parsedDetails);
          } catch (e) {
            setCandidateDetails(response.data.candidate_details || {});
          }
        } else {
          setCandidateDetails(response.data.candidate_details || {});
        }
        
        setDataLoaded(true);
        // Reset image errors when new data is loaded
        setImageErrors({
          candidatePic: false,
          signature: false
        });
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

  const getDisplayData = () => {
    if (dataLoaded && applicationDetails) {
      return {
        data: applicationDetails,
        candidate: candidateDetails,
        source: 'api'
      };
    }
    return {
      data: application,
      candidate: null,
      source: 'props'
    };
  };

  const { data: displayData, candidate: displayCandidate, source: dataSource } = getDisplayData();

  // Get photo URL with error handling
  const getPhotoUrl = () => {
    const photo = displayData?.candidate_pic;
    if (photo && !imageErrors.candidatePic) {
      return `${apiUrl}/${photo}`;
    }
    return 'https://via.placeholder.com/96x96?text=No+Image';
  };

  // Get signature URL with error handling
  const getSignatureUrl = () => {
    const signature = displayData?.candidate_signature;
    if (signature && !imageErrors.signature) {
      return `${apiUrl}/${signature}`;
    }
    return 'https://via.placeholder.com/160x80?text=No+Signature';
  };

  const photoUrl = getPhotoUrl();
  const signatureUrl = getSignatureUrl();

  const handleEdit = () => {
    if (displayData) {
      const appId = displayData.id;
      window.open(`/${user?.role}/school-applications/edit/${application.id}`);
    }
  };

  const handleApprove = async () => {
    if (!displayData || !user?.token) return;

    try {
      const response = await axios.post(
        `${apiUrl}/${user.role}/Applications/approve-application`,
        {
          application_id: displayData.id
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
    if (!displayData || !user?.token) return;

    try {
      const response = await axios.post(
        `${apiUrl}/${user.role}/Applications/reject-application`,
        {
          application_id: displayData.id
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

  const getDisplayValue = (value: any, fallback: string = 'N/A') => {
    return value && value !== '' ? value : fallback;
  };

  const getGenderDisplay = (gender: string) => {
    if (displayCandidate?.Sgender) return displayCandidate.Sgender;
    return gender === '1' ? 'Male' : gender === '2' ? 'Female' : 'N/A';
  };

  if (!displayData) return null;

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <div className="flex items-center justify-between p-6 border-b rounded-t dark:border-gray-600">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Application Details - {displayData.applicant_name}
          {loading && <span className="ml-2 text-sm text-blue-500">(Loading...)</span>}
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

      <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
        {loading && (
          <div className="flex justify-center items-center py-4">
            <Loader />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-2 bg-red-50 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <img
                  src={photoUrl}
                  alt="Candidate"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-200"
                  onError={handleCandidateImageError}
                />
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-900">
                  {displayData.applicant_name}
                </h4>
                <p className="text-gray-600">Roll No: {displayData.roll_no}</p>
                <p className="text-gray-600">
                  {displayCandidate?.dob ? `DOB: ${displayCandidate.dob}` : 'DOB: N/A'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Gender</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getGenderDisplay(displayData.gender)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.email || displayData.email)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.mobile || displayData.mobile_no)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.dob)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Father's Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.fatherName || displayData.father_name)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Mother's Name</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.motherName || displayData.mother_name)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Aadhaar Number</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.adharCard || displayData.adhar_no)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <p className="mt-1 text-sm text-gray-900">
                  {getDisplayValue(displayCandidate?.Scategory)}
                </p>
              </div>
            </div>

            {displayCandidate && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-md font-semibold text-gray-900 mb-3">Address Information</h4>
                <div className="grid grid-cols-1 gap-2 text-sm">
                  <div>
                    <span className="font-medium">Address: </span>
                    {getDisplayValue(displayCandidate.doorNo)} {getDisplayValue(displayCandidate.streetArea)}
                  </div>
                  <div>
                    <span className="font-medium">City: </span>
                    {getDisplayValue(displayCandidate.cityTown)}
                  </div>
                  <div>
                    <span className="font-medium">District: </span>
                    {getDisplayValue(displayCandidate.Saddress_district)}
                  </div>
                  <div>
                    <span className="font-medium">State: </span>
                    {getDisplayValue(displayCandidate.Saddress_state)}
                  </div>
                  <div>
                    <span className="font-medium">Pincode: </span>
                    {getDisplayValue(displayCandidate.pincode)}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Academic & Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
              Academic Information
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700">Academic Name</label>
                <p className="mt-1 text-sm text-gray-900">{application?.academic_name || 'N/A'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">Class</label>
                <p className="mt-1 text-sm text-gray-900">{application?.class_name || 'N/A'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Application ID</label>
                <p className="mt-1 text-sm text-gray-900">{displayData.id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Academic ID</label>
                <p className="mt-1 text-sm text-gray-900">{displayData.academic_id}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  displayData.payment_status === '1' 
                    ? 'text-green-800 bg-green-100' 
                    : 'text-red-800 bg-red-100'
                }`}>
                  {displayData.payment_status === '1' ? 'Paid' : 'Unpaid'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Activation Status</label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  displayData.activation_status === 1 
                    ? 'text-green-800 bg-green-100' 
                    : 'text-yellow-800 bg-yellow-100'
                }`}>
                  {displayData.activation_status === 1 ? 'Active' : 'Inactive'}
                </span>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Applied Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date(displayData.created_at).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Candidate Signature
              </label>
              <img
                src={signatureUrl}
                alt="Signature"
                className="w-40 h-20 object-contain border rounded"
                onError={handleSignatureImageError}
              />
            </div>

            {displayCandidate && (displayCandidate.idMark1 || displayCandidate.idMark2) && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="text-md font-semibold text-gray-900 mb-2">Identification Marks</h4>
                <div className="space-y-1 text-sm">
                  {displayCandidate.idMark1 && (
                    <div>
                      <span className="font-medium">Mark 1: </span>
                      {displayCandidate.idMark1}
                    </div>
                  )}
                  {displayCandidate.idMark2 && (
                    <div>
                      <span className="font-medium">Mark 2: </span>
                      {displayCandidate.idMark2}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {dataSource === 'api' && displayCandidate && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
              <span>Enhanced Details</span>
              <span className="ml-2 text-xs bg-green-500 text-white px-2 py-1 rounded-full">Live API Data</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {displayCandidate.idMark1 && (
                <div>
                  <span className="font-medium">Identification Mark 1: </span>
                  {displayCandidate.idMark1}
                </div>
              )}
              {displayCandidate.idMark2 && (
                <div>
                  <span className="font-medium">Identification Mark 2: </span>
                  {displayCandidate.idMark2}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-6 border-t border-gray-200 rounded-b dark:border-gray-600">
        <div className="flex gap-2">
          <Button 
            color="success" 
            size="sm"
            onClick={handleApprove}
            disabled={loading}
          >
            Approve
          </Button>
          <Button 
            color="failure" 
            size="sm"
            onClick={handleReject}
            disabled={loading}
          >
            Reject
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={onClose} color="alternative">
            Close
          </Button>
          <Button color="blue" onClick={handleEdit}>
            Edit Application
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ApplicationDetailModal;