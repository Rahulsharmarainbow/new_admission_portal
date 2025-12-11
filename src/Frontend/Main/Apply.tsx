// pages/Apply.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import axios from 'axios';
import SchoolApplyForm from './schoolApply/SchoolApplyForm';
import ApplyForm from './collageApply/ApplyForm';
import NotFound from './NotFound';
import {
  Card,
  Label,
  TextInput,
  Button,
  Spinner,
  Textarea,
  ToggleSwitch,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
} from 'flowbite-react';
import NonPaymentApplyForm from './collageApply/NonPaymentApplyForm';

interface ApplyData {
  data: any;
  academic_type: number;
  required_child: any[];
  home_other_lines: any;
  header: any;
  content_managment?: any;
  cdata: any;
  class?: any[];
  transportation_fee?: any[];
  transportation_setting?: any;
  apply_modal?: any;
  OtherData?: any;
  academic_id?: any; // Added property to fix error
}

const Apply = () => {
  let { institute_id } = useParams();
  const navigate = useNavigate();
  const [applyData, setApplyData] = useState<ApplyData | null>(null);
  const [modalData, setModalData] = useState<Any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const assetUrl = import.meta.env.VITE_ASSET_URL;
  if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; // use domain as fallback
  }

  useEffect(() => {
    const fetchApplyData = async () => {
      try {
        const response = await axios.post(
          `${apiUrl}/Public/Get-apply-form`,
          {
            unique_code: institute_id,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          },
        );
        console.log(response.data);
        if (response.status === 200) {
          setApplyData(response.data);
          setModalData(response.data.apply_modals);
          if(response.data?.apply_modals?.visible == 1){
            setPreviewOpen(true);
          }
        } else {
          setError('Failed to load application form');
        }
      } catch (err) {
        setError('Error loading application form');
        console.error('Error fetching apply data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (institute_id) {
      fetchApplyData();
    }
  }, [institute_id]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      console.log('Razorpay script loaded!');
    };
    document.body.appendChild(script);

    if (modalData) {
      console.log(modalData);
    }
  }, []);

  const setFavicon = (faviconUrl) => {
    // Remove existing favicon links
    const existingLinks = document.querySelectorAll('link[rel*="icon"]');
    existingLinks.forEach(link => link.remove());

    // Create new favicon link
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/x-icon';
    link.href = faviconUrl;
    
    // Add to head
    document.head.appendChild(link);

    console.log('Favicon set to:', faviconUrl);
  };

  // Function to get favicon URL
  const getFaviconUrl = () => {
    if (applyData?.header?.academic_favicon) {
      return `${assetUrl}/${applyData.header.academic_favicon}`;
    }
    if (applyData?.header?.logo) {
      return `${assetUrl}/${applyData.header.logo}`;
    }
    return '/favicon.ico';
  };

  useEffect(() => {
    if (applyData) {
      // Set page title
      document.title = applyData?.header?.name || '';
      
      // Set favicon
      const faviconUrl = getFaviconUrl();
      setFavicon(faviconUrl);
    }
  }, [applyData]);


  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <NotFound />;
  }

  if (!applyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-500 text-xl mb-4">No data found</div>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header
        baseUrl={applyData.baseUrl}
        institute_id={applyData.unique_code}
        instituteName={applyData.header?.name}
        logo={applyData.header?.logo}
        otherLogo={applyData.header?.academic_new_logo}
        address={applyData.header?.address}
      />

      <div className="py-2 px-1 md:px-10">
        {applyData.academic_type === 1 ? (
          <div style={{ fontFamily: "'Montserrat', sans-serif" }}>
          <SchoolApplyForm
            academic_id={applyData.academic_id}
            dynamicBoxes={applyData.data}
            required_child={applyData.required_child}
            home_other_lines={applyData.home_other_lines}
            apply_page_header={applyData.apply_page_header}
            header={applyData.header}
            content_managment={applyData.content_managment}
            cdata={applyData.cdata}
            class={applyData.class}
            transportation_fee={applyData.transportation_fee}
            transportation_setting={applyData.transportation_setting}
            apply_modal={applyData.apply_modal}
            OtherData={applyData.OtherData}
            type="school"
          />
          </div>
        ) : (

          applyData?.cdata?.payment_status === 1 ? (
      <ApplyForm
            academic_id={applyData.academic_id}
            dynamicBoxes={applyData.data}
            required_child={applyData.required_child}
            home_other_lines={applyData.home_other_lines}
            apply_page_header={applyData?.apply_page_header}
            header={applyData.header}
            cdata={applyData.cdata}
            apply_modal={applyData.apply_modal}
            type="collage"
          />
    ) : (
      <NonPaymentApplyForm
            academic_id={applyData.academic_id}
            dynamicBoxes={applyData.data}
            required_child={applyData.required_child}
            home_other_lines={applyData.home_other_lines}
            apply_page_header={applyData?.apply_page_header}
            header={applyData.header}
            cdata={applyData.cdata}
            apply_modal={applyData.apply_modal}
            type="collage"
          />
    )
         
        )}
      </div>

      {/* <Footer /> */}
      <Modal
        show={previewOpen}
        onClose={() => setPreviewOpen(false)}
        size="xl"
        className="overflow-hidden"
      >
        <ModalHeader>
          <div className="flex justify-between items-center w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {modalData?.title}
            </h2>
          </div>
        </ModalHeader>

        <ModalBody className="relative overflow-visible z-[100]">
          <div className="space-y-6 overflow-visible pr-2">

            {modalData?.image && (
              <div className="flex justify-center">
                <div className="w-40 max-w-sm h-40  rounded-lg overflow-hidden">
                  <img
                    src={`${assetUrl}/${modalData?.image}`}
                    alt="Popup"
                    className="w-full h-full object-center"
                  />
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-line">{modalData?.description}</p>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Apply;















// import React, { useState } from 'react';
// import { Link, useParams } from 'react-router';
// import Header from '../Common/Header';
// import Footer from '../Common/Footer';

// // Sample data for different institutes
// const instituteData = {
//     '1': {
//         name: 'Avantika University',
//         examInfo: {
//             title: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
//         }
//     },
//     'default': {
//         name: 'Default Institute',
//         examInfo: {
//             title: "ENTRANCE EXAMINATION - 2024",
//         }
//     }
// };

// const Apply = () => {
//     const { institute_id } = useParams();
//     const institute = instituteData[institute_id] || instituteData['default'];

//     // Form state
//     const [formData, setFormData] = useState({
//         name: '',
//         gender: '',
//         fatherName: '',
//         motherName: '',
//         dob: '',
//         state: '',
//         district: '',
//         idMark1: '',
//         idMark2: '',
//         aadhaar: Array(12).fill(''),
//         profilePhoto: null,
//         signature: null
//     });

//     const [qualifyingData, setQualifyingData] = useState({
//         board1: '',
//         year1: '',
//         hallTicket1: '',
//         board: '',
//         year: '',
//         hallTicket: ''
//     });

//     const years = [
//         { value: '2024', label: '2024' },
//         { value: '2023', label: '2023' },
//         { value: '2022', label: '2022' },
//         { value: '2021', label: '2021' },
//         { value: '2020', label: '2020' }
//     ];

//     const boards = [
//         { value: 'cbse', label: 'CBSE' },
//         { value: 'icse', label: 'ICSE' },
//         { value: 'state_board', label: 'State Board' },
//         { value: 'other', label: 'Other' }
//     ];

//     // Touched fields state
//     const [touched, setTouched] = useState({
//         name: false,
//         gender: false,
//         fatherName: false,
//         motherName: false,
//         dob: false,
//         state: false,
//         district: false,
//         idMark1: false,
//         idMark2: false,
//         aadhaar: false,
//         profilePhoto: false,
//         signature: false,
//         doorNo: false,
//         streetArea: false,
//         cityTown: false,
//         pincode: false,
//         mobile: false,
//         email: false
//     });

//     const [addressData, setAddressData] = useState({
//         doorNo: '',
//         streetArea: '',
//         state: '',
//         district: '',
//         cityTown: '',
//         pincode: '',
//         mobile: '',
//         email: ''
//     });

//     // Error messages
//     const [errors, setErrors] = useState({
//         name: 'Name is required',
//         gender: 'Gender is required',
//         fatherName: 'Father name is required',
//         motherName: 'Mother name is required',
//         dob: 'Date of birth is required',
//         state: 'State is required',
//         district: 'District is required',
//         idMark1: 'Identification mark is required',
//         idMark2: 'Identification mark is required',
//         aadhaar: 'All Aadhaar card digits are required',
//         profilePhoto: 'Photo is required',
//         signature: 'Signature is required',
//         doorNo: 'Door No / Flat is required',
//         streetArea: 'Street / Area is required',
//         cityTown: 'City / Town is required',
//         pincode: 'Pincode is required',
//         mobile: 'Mobile Number is required',
//         email: 'Email ID is required'
//     });

//     const [studyData, setStudyData] = useState({
//         class6_state: '',
//         class6_district: '',
//         class7_state: '',
//         class7_district: '',
//         class8_state: '',
//         class8_district: '',
//         class9_state: '',
//         class9_district: '',
//         class10_state: '',
//         class10_district: '',
//         inter1st_state: '',
//         inter1st_district: '',
//         inter2nd_state: '',
//         inter2nd_district: ''
//     });

//     const states = [
//         { value: 'maharashtra', label: 'Maharashtra' },
//         { value: 'delhi', label: 'Delhi' },
//         { value: 'karnataka', label: 'Karnataka' },
//         { value: 'tamil_nadu', label: 'Tamil Nadu' },
//         { value: 'kerala', label: 'Kerala' }
//     ];

//     const districts = [
//         { value: 'mumbai', label: 'Mumbai' },
//         { value: 'pune', label: 'Pune' },
//         { value: 'nagpur', label: 'Nagpur' },
//         { value: 'thane', label: 'Thane' }
//     ];

//     const [casteData, setCasteData] = useState({
//         category: '',
//         localArea: '',
//         specialCategory: '',
//         annualIncome: ''
//     });

//     // Agreement state
//     const [agreement, setAgreement] = useState(false);

//     const categories = [
//         { value: 'general', label: 'General' },
//         { value: 'obc', label: 'OBC' },
//         { value: 'sc', label: 'SC' },
//         { value: 'st', label: 'ST' },
//         { value: 'other', label: 'Other' }
//     ];

//     const localAreas = [
//         { value: 'urban', label: 'Urban' },
//         { value: 'rural', label: 'Rural' },
//         { value: 'semi_urban', label: 'Semi-Urban' }
//     ];

//     const specialCategories = [
//         { value: 'none', label: 'None' },
//         { value: 'sports', label: 'Sports' },
//         { value: 'ncc', label: 'NCC' },
//         { value: 'cultural', label: 'Cultural' },
//         { value: 'other', label: 'Other' }
//     ];

//     const incomeRanges = [
//         { value: 'below_1lakh', label: 'Below ₹1 Lakh' },
//         { value: '1_2lakh', label: '₹1-2 Lakh' },
//         { value: '2_5lakh', label: '₹2-5 Lakh' },
//         { value: '5_10lakh', label: '₹5-10 Lakh' },
//         { value: 'above_10lakh', label: 'Above ₹10 Lakh' }
//     ];

//     const streams = [
//         { value: '34$BSC CS', label: 'BSC CS' },
//         { value: '35$BSC IT', label: 'BSC IT' },
//         { value: '36$BSC Physics', label: 'BSC Physics' },
//         { value: '37$BSC Chemistry', label: 'BSC Chemistry' }
//     ];

//     // Handle input change
//     const handleInputChange = (field, value) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: value
//         }));

//         // Clear error when user starts typing
//         if (value && value.toString().trim() !== '') {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         } else {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
//             }));
//         }
//     };

//     // Handle Aadhaar input change
//     const handleAadhaarChange = (index, value) => {
//         const newAadhaar = [...formData.aadhaar];
//         newAadhaar[index] = value;

//         setFormData(prev => ({
//             ...prev,
//             aadhaar: newAadhaar
//         }));

//         // Check if all digits are filled
//         const allFilled = newAadhaar.every(digit => digit !== '');
//         if (allFilled) {
//             setErrors(prev => ({
//                 ...prev,
//                 aadhaar: ''
//             }));
//         } else {
//             setErrors(prev => ({
//                 ...prev,
//                 aadhaar: 'All Aadhaar card digits are required'
//             }));
//         }
//     };

//     // Handle blur event (when user leaves a field)
//     const handleBlur = (field) => {
//         setTouched(prev => ({
//             ...prev,
//             [field]: true
//         }));
//     };

//     // Check if field should show error
//     const shouldShowError = (field) => {
//         return touched[field] && errors[field];
//     };

//     // Handle file upload
//     const handleFileUpload = (field, file) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: file
//         }));

//         if (file) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }));
//         } else {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: `${field === 'profilePhoto' ? 'Photo' : 'Signature'} is required`
//             }));
//         }
//     };

//     // New Badge Component
//     const NewBadge = ({ className = "", size = "default" }) => {
//         const textSize = size === "small" ? "text-[8px]" : "text-[10px]";
//         const padding = size === "small" ? "px-1 py-0.5" : "px-1.5 py-0.5";
//         const dotSize = size === "small" ? "h-[4px] w-[4px]" : "h-[6px] w-[6px]";

//         return (
//             <sup className={`ml-1 ${className}`}>
//                 <span className={`animate-pulse inline-flex items-center bg-gradient-to-r from-[#dc2626] to-[#ea580c] text-white ${textSize} leading-none font-bold ${padding} rounded-full shadow-sm`}>
//                     <span className="mr-[2px]">NEW</span>
//                     <span className={`relative flex ${dotSize}`}>
//                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//                         <span className={`relative inline-flex rounded-full ${dotSize} bg-white`}></span>
//                     </span>
//                 </span>
//             </sup>
//         );
//     };

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//             <Header instituteName={institute.name} />

//             {/* Main Content Section */}
//             <div className="container mx-auto py-8 ">

//                 {/* Unified Form Box */}
//                 <div className="group relative mb-8">
//                     <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
//                     <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
//                         <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

//                         {/* Form Header */}
//                         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
//                             <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
//                                 <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                     <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//                                 </svg>
//                                 Application Form
//                                 <NewBadge className="ml-2" />
//                             </h4>
//                         </div>

//                         <div className="p-6">

//                             {/* Stream Details Section */}
//                             <div className="mb-">
//                                 <div className="text-center mb-6">
//                                     <h4 className="caption-heading_apply text-lg font-bold text-[#dc2626] inline-flex items-center">
//                                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M9.664 1.319a1 1 0 01.672 0l8 3.2A1 1 0 0119 5.4v.6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5.4L10 3.2 5 5.4V6a1 1 0 01-1 1H1a1 1 0 01-1-1v-.6a1 1 0 01.664-.881l8-3.2zM1 8a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V8zm1 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1zm7-4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V8zm1 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1z" />
//                                         </svg>
//                                         Stream Details
//                                     </h4>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                                     {/* Stream applying for */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Stream applying for: <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                 value={formData.degree}
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
//                                             >
//                                                 <option value="">Select Stream</option>
//                                                 {streams.map(stream => (
//                                                     <option key={stream.value} value={stream.value}>
//                                                         {stream.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                     </div>

//                                     {/* Favourite Subject */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Favourite Subject
//                                         </label>
//                                         <div className="relative">
//                                             <input
//                                                 id="new_input_556226"
//                                                 placeholder="Favourite Subject"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                 type="text"
//                                                 value={formData.favouriteSubject}
//                                                 onChange={(e) => setFormData(prev => ({ ...prev, favouriteSubject: e.target.value }))}
//                                             />
//                                         </div>
//                                     </div>

//                                 </div>
//                             </div>

//                             {/* Other sections would continue here... */}

//                         </div>

//                         <div className="p-6">
//                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//                                 {/* Left Column - Candidates Details (10 columns) */}
//                                 <div className="lg:col-span-10">
//                                     <h5 className="text-lg font-bold text-[#dc2626] mb-6 pb-2 border-b border-gray-200 inline-flex items-center">
//                                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                                         </svg>
//                                         Candidates Details
//                                     </h5>

//                                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

//                                         {/* Name Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Name <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="name"
//                                                     placeholder="Enter your full name"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={formData.name}
//                                                     onChange={(e) => handleInputChange('name', e.target.value)}
//                                                     onBlur={() => handleBlur('name')}
//                                                 />
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('name') && (
//                                                 <p className="text-red-500 text-xs">{errors.name}</p>
//                                             )}
//                                         </div>

//                                         {/* Gender Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Gender <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={formData.gender}
//                                                     onChange={(e) => handleInputChange('gender', e.target.value)}
//                                                     onBlur={() => handleBlur('gender')}
//                                                 >
//                                                     <option value="">Select gender</option>
//                                                     <option value="male">Male</option>
//                                                     <option value="female">Female</option>
//                                                     <option value="other">Other</option>
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('gender') && (
//                                                 <p className="text-red-500 text-xs">{errors.gender}</p>
//                                             )}
//                                         </div>

//                                         {/* Father Name Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Father Name <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 id="fatherName"
//                                                 placeholder="Enter father's name"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                 type="text"
//                                                 value={formData.fatherName}
//                                                 onChange={(e) => handleInputChange('fatherName', e.target.value)}
//                                                 onBlur={() => handleBlur('fatherName')}
//                                             />
//                                             {shouldShowError('fatherName') && (
//                                                 <p className="text-red-500 text-xs">{errors.fatherName}</p>
//                                             )}
//                                         </div>

//                                         {/* Mother Name Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Mother Name <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 id="motherName"
//                                                 placeholder="Enter mother's name"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                 type="text"
//                                                 value={formData.motherName}
//                                                 onChange={(e) => handleInputChange('motherName', e.target.value)}
//                                                 onBlur={() => handleBlur('motherName')}
//                                             />
//                                             {shouldShowError('motherName') && (
//                                                 <p className="text-red-500 text-xs">{errors.motherName}</p>
//                                             )}
//                                         </div>

//                                         {/* Date of Birth Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Date Of Birth <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     placeholder="MM/DD/YYYY"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="date"
//                                                     value={formData.dob}
//                                                     onChange={(e) => handleInputChange('dob', e.target.value)}
//                                                     onBlur={() => handleBlur('dob')}
//                                                 />
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('dob') && (
//                                                 <p className="text-red-500 text-xs">{errors.dob}</p>
//                                             )}
//                                         </div>

//                                         {/* State Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 State <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={formData.state}
//                                                     onChange={(e) => handleInputChange('state', e.target.value)}
//                                                     onBlur={() => handleBlur('state')}
//                                                 >
//                                                     <option value="">Select state</option>
//                                                     <option value="maharashtra">Maharashtra</option>
//                                                     <option value="delhi">Delhi</option>
//                                                     <option value="karnataka">Karnataka</option>
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('state') && (
//                                                 <p className="text-red-500 text-xs">{errors.state}</p>
//                                             )}
//                                         </div>

//                                         {/* District Field */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 District <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={formData.district}
//                                                     onChange={(e) => handleInputChange('district', e.target.value)}
//                                                     onBlur={() => handleBlur('district')}
//                                                 >
//                                                     <option value="">Select district</option>
//                                                     <option value="mumbai">Mumbai</option>
//                                                     <option value="pune">Pune</option>
//                                                     <option value="nagpur">Nagpur</option>
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('district') && (
//                                                 <p className="text-red-500 text-xs">{errors.district}</p>
//                                             )}
//                                         </div>

//                                         {/* Identification Mark 1 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Identification Mark 1 <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 id="idMark1"
//                                                 placeholder="Enter identification mark"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                 type="text"
//                                                 value={formData.idMark1}
//                                                 onChange={(e) => handleInputChange('idMark1', e.target.value)}
//                                                 onBlur={() => handleBlur('idMark1')}
//                                             />
//                                             {shouldShowError('idMark1') && (
//                                                 <p className="text-red-500 text-xs">{errors.idMark1}</p>
//                                             )}
//                                         </div>

//                                         {/* Identification Mark 2 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Identification Mark 2 <span className="text-red-500">*</span>
//                                             </label>
//                                             <input
//                                                 id="idMark2"
//                                                 placeholder="Enter identification mark"
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                 type="text"
//                                                 value={formData.idMark2}
//                                                 onChange={(e) => handleInputChange('idMark2', e.target.value)}
//                                                 onBlur={() => handleBlur('idMark2')}
//                                             />
//                                             {shouldShowError('idMark2') && (
//                                                 <p className="text-red-500 text-xs">{errors.idMark2}</p>
//                                             )}
//                                         </div>

//                                         {/* Aadhaar Number Field - Full width */}
//                                         <div className="md:col-span-3 space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Aadhaar Number <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="flex items-center space-x-2">
//                                                 {formData.aadhaar.map((digit, index) => (
//                                                     <div key={index} className="flex-1">
//                                                         <input
//                                                             placeholder="X"
//                                                             maxLength="1"
//                                                             className="w-full px-2 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent text-center text-base font-semibold transition-all duration-200 bg-white"
//                                                             type="text"
//                                                             value={digit}
//                                                             onChange={(e) => handleAadhaarChange(index, e.target.value.replace(/\D/g, ''))}
//                                                             onBlur={() => handleBlur('aadhaar')}
//                                                         />
//                                                     </div>
//                                                 ))}
//                                                 <button className="p-2 text-gray-400 hover:text-[#1e40af] transition-colors duration-200">
//                                                     <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                                                         <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </button>
//                                             </div>
//                                             {shouldShowError('aadhaar') && (
//                                                 <p className="text-red-500 text-xs">{errors.aadhaar}</p>
//                                             )}
//                                         </div>

//                                     </div>
//                                 </div>

//                                 {/* Right Column - Image Upload (2 columns) */}
//                                 <div className="lg:col-span-2">
//                                     <h5 className="text-lg font-bold text-[#dc2626] mb-6 pb-2 border-b border-gray-200 inline-flex items-center">
//                                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 11-2 0 1 1 0 012 0z" />
//                                         </svg>
//                                         Upload
//                                     </h5>

//                                     <div className="space-y-6">

//                                         {/* Profile Photo Upload */}
//                                         <div className="text-center space-y-3">
//                                             <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300">
//                                                 <div className="mx-auto w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
//                                                     {formData.profilePhoto ? (
//                                                         <img
//                                                             src={URL.createObjectURL(formData.profilePhoto)}
//                                                             alt="Profile"
//                                                             className="w-full h-full object-cover rounded-lg"
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src="https://dummyimage.com/180x180/d4cdd4/0d0c0d.png"
//                                                             alt="Profile placeholder"
//                                                             className="w-full h-full object-cover rounded-lg"
//                                                         />
//                                                     )}
//                                                 </div>
//                                                 <p className="text-xs text-gray-600 mb-2">Profile Photo</p>
//                                                 <input
//                                                     type="file"
//                                                     id="profilePhoto"
//                                                     className="hidden"
//                                                     onChange={(e) => handleFileUpload('profilePhoto', e.target.files[0])}
//                                                     accept="image/*"
//                                                 />
//                                                 <label
//                                                     htmlFor="profilePhoto"
//                                                     className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-2 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full cursor-pointer block"
//                                                 >
//                                                     Upload Image
//                                                 </label>
//                                             </div>
//                                             {shouldShowError('profilePhoto') && (
//                                                 <p className="text-red-500 text-xs">{errors.profilePhoto}</p>
//                                             )}
//                                         </div>

//                                         {/* Signature Upload */}
//                                         <div className="text-center space-y-3">
//                                             <div className="bg-gray-50 p-3 rounded-xl border-2 border-dashed border-gray-300">
//                                                 <div className="mx-auto w-28 h-14 bg-gray-100 rounded-lg flex items-center justify-center mb-2">
//                                                     {formData.signature ? (
//                                                         <img
//                                                             src={URL.createObjectURL(formData.signature)}
//                                                             alt="Signature"
//                                                             className="w-full h-full object-contain"
//                                                         />
//                                                     ) : (
//                                                         <img
//                                                             src="https://dummyimage.com/150x40/d4cdd4/0d0c0d.png"
//                                                             alt="Signature placeholder"
//                                                             className="w-full h-full object-contain"
//                                                         />
//                                                     )}
//                                                 </div>
//                                                 <p className="text-xs text-gray-600 mb-2">Signature</p>
//                                                 <input
//                                                     type="file"
//                                                     id="signature"
//                                                     className="hidden"
//                                                     onChange={(e) => handleFileUpload('signature', e.target.files[0])}
//                                                     accept="image/*"
//                                                 />
//                                                 <label
//                                                     htmlFor="signature"
//                                                     className="bg-gradient-to-r from-[#dc2626] to-[#ea580c] text-white px-2 py-1 rounded-lg text-xs font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200 w-full cursor-pointer block"
//                                                 >
//                                                     Upload Signature
//                                                 </label>
//                                             </div>
//                                             {shouldShowError('signature') && (
//                                                 <p className="text-red-500 text-xs">{errors.signature}</p>
//                                             )}
//                                         </div>

//                                     </div>
//                                 </div>

//                             </div>
//                         </div>
//                         <div className="p-4">
//                             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

//                                 {/* Address Details Section - Full Width */}
//                                 <div className="lg:col-span-6">
//                                     <div className="text-center mb-6">
//                                         <h4 className="caption-heading_apply text-lg font-bold text-[#dc2626] inline-flex items-center">
//                                             <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
//                                             </svg>
//                                             Address Details
//                                         </h4>
//                                     </div>

//                                     {/* Address Fields - 2 columns per row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                                         {/* Row 1 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Door No / Flat <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="doorNo"
//                                                     placeholder="Door No / Flat"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={addressData.doorNo}
//                                                     onChange={(e) => handleAddressChange('doorNo', e.target.value)}
//                                                     onBlur={() => handleBlur('doorNo')}
//                                                 />
//                                             </div>
//                                             {shouldShowError('doorNo') && (
//                                                 <p className="text-red-500 text-xs">{errors.doorNo}</p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Street / Area <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="streetArea"
//                                                     placeholder="Street / Area"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={addressData.streetArea}
//                                                     onChange={(e) => handleAddressChange('streetArea', e.target.value)}
//                                                     onBlur={() => handleBlur('streetArea')}
//                                                 />
//                                             </div>
//                                             {shouldShowError('streetArea') && (
//                                                 <p className="text-red-500 text-xs">{errors.streetArea}</p>
//                                             )}
//                                         </div>

//                                         {/* Row 2 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 State <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={addressData.state}
//                                                     onChange={(e) => handleAddressChange('state', e.target.value)}
//                                                     onBlur={() => handleBlur('state')}
//                                                 >
//                                                     <option value="">Select state</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('state') && (
//                                                 <p className="text-red-500 text-xs">{errors.state}</p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 District <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={addressData.district}
//                                                     onChange={(e) => handleAddressChange('district', e.target.value)}
//                                                     onBlur={() => handleBlur('district')}
//                                                 >
//                                                     <option value="">Select district</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('district') && (
//                                                 <p className="text-red-500 text-xs">{errors.district}</p>
//                                             )}
//                                         </div>

//                                         {/* Row 3 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 City / Town <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="cityTown"
//                                                     placeholder="City / Town"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={addressData.cityTown}
//                                                     onChange={(e) => handleAddressChange('cityTown', e.target.value)}
//                                                     onBlur={() => handleBlur('cityTown')}
//                                                 />
//                                             </div>
//                                             {shouldShowError('cityTown') && (
//                                                 <p className="text-red-500 text-xs">{errors.cityTown}</p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Pincode <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="pincode"
//                                                     placeholder="Pincode"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={addressData.pincode}
//                                                     onChange={(e) => handleAddressChange('pincode', e.target.value.replace(/\D/g, ''))}
//                                                     onBlur={() => handleBlur('pincode')}
//                                                     maxLength="6"
//                                                 />
//                                             </div>
//                                             {shouldShowError('pincode') && (
//                                                 <p className="text-red-500 text-xs">{errors.pincode}</p>
//                                             )}
//                                         </div>

//                                         {/* Row 4 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Mobile Number <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="mobile"
//                                                     placeholder="Mobile Number"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={addressData.mobile}
//                                                     onChange={(e) => handleAddressChange('mobile', e.target.value.replace(/\D/g, ''))}
//                                                     onBlur={() => handleBlur('mobile')}
//                                                     maxLength="10"
//                                                 />
//                                             </div>
//                                             {shouldShowError('mobile') && (
//                                                 <p className="text-red-500 text-xs">{errors.mobile}</p>
//                                             )}
//                                         </div>

//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Email ID <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="email"
//                                                     placeholder="Email ID"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="email"
//                                                     value={addressData.email}
//                                                     onChange={(e) => handleAddressChange('email', e.target.value)}
//                                                     onBlur={() => handleBlur('email')}
//                                                 />
//                                             </div>
//                                             {shouldShowError('email') && (
//                                                 <p className="text-red-500 text-xs">{errors.email}</p>
//                                             )}
//                                         </div>

//                                     </div>
//                                 </div>

//                                 {/* Study Details Section - Full Width */}
//                                 <div className="lg:col-span-6">
//                                     <div className="text-center mb-6">
//                                         <h4 className="caption-heading_apply text-lg font-bold text-[#dc2626] inline-flex items-center">
//                                             <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                                 <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
//                                             </svg>
//                                             Study Details
//                                         </h4>
//                                     </div>

//                                     {/* Study Details Fields - 2 columns per row */}
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                                         {/* Class 6 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Class 6
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class6_state}
//                                                     onChange={(e) => handleStudyChange('class6_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class6_district}
//                                                     onChange={(e) => handleStudyChange('class6_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Class 7 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Class 7
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class7_state}
//                                                     onChange={(e) => handleStudyChange('class7_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class7_district}
//                                                     onChange={(e) => handleStudyChange('class7_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Class 8 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Class 8
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class8_state}
//                                                     onChange={(e) => handleStudyChange('class8_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class8_district}
//                                                     onChange={(e) => handleStudyChange('class8_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Class 9 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Class 9
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class9_state}
//                                                     onChange={(e) => handleStudyChange('class9_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class9_district}
//                                                     onChange={(e) => handleStudyChange('class9_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Class 10 */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Class 10
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class10_state}
//                                                     onChange={(e) => handleStudyChange('class10_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.class10_district}
//                                                     onChange={(e) => handleStudyChange('class10_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Intermediate 1st Year */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Intermediate 1st Year
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.inter1st_state}
//                                                     onChange={(e) => handleStudyChange('inter1st_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.inter1st_district}
//                                                     onChange={(e) => handleStudyChange('inter1st_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                         {/* Intermediate 2nd Year */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Intermediate 2nd Year
//                                             </label>
//                                             <div className="grid grid-cols-2 gap-2">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.inter2nd_state}
//                                                     onChange={(e) => handleStudyChange('inter2nd_state', e.target.value)}
//                                                 >
//                                                     <option value="">State</option>
//                                                     {states.map(state => (
//                                                         <option key={state.value} value={state.value}>
//                                                             {state.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={studyData.inter2nd_district}
//                                                     onChange={(e) => handleStudyChange('inter2nd_district', e.target.value)}
//                                                 >
//                                                     <option value="">District</option>
//                                                     {districts.map(district => (
//                                                         <option key={district.value} value={district.value}>
//                                                             {district.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                             </div>
//                                         </div>

//                                     </div>
//                                 </div>

//                             </div>
//                         </div>

//                         <div className="p-6">

//                             {/* Qualifying Examination Section */}
//                             <div className="mb-8">
//                                 <div className="text-center mb-6">
//                                     <h4 className="caption-heading_apply text-lg font-bold text-[#dc2626] inline-flex items-center">
//                                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
//                                         </svg>
//                                         Qualifying Examination
//                                     </h4>
//                                 </div>

//                                 {/* Intermediate / 10+2 / 3 year Diploma Education */}
//                                 <div className="mb-6">
//                                     <p className="text-sm font-bold text-gray-800 mb-4">
//                                         <b>Intermediate / 10+2 / 3 year Diploma Education</b>
//                                     </p>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                                         {/* Name of the Board */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Name of the Board <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={qualifyingData.board1}
//                                                     onChange={(e) => handleQualifyingChange('board1', e.target.value)}
//                                                     onBlur={() => handleBlur('board1')}
//                                                 >
//                                                     <option value="">Select Board</option>
//                                                     {boards.map(board => (
//                                                         <option key={board.value} value={board.value}>
//                                                             {board.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('board1') && (
//                                                 <p className="text-red-500 text-xs">{errors.board1}</p>
//                                             )}
//                                         </div>

//                                         {/* Year Of Passing / Appearing */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Year Of Passing / Appearing <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={qualifyingData.year1}
//                                                     onChange={(e) => handleQualifyingChange('year1', e.target.value)}
//                                                     onBlur={() => handleBlur('year1')}
//                                                 >
//                                                     <option value="">Select Year</option>
//                                                     {years.map(year => (
//                                                         <option key={year.value} value={year.value}>
//                                                             {year.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('year1') && (
//                                                 <p className="text-red-500 text-xs">{errors.year1}</p>
//                                             )}
//                                         </div>

//                                         {/* Hall Ticket Number */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Hall Ticket Number <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="hall-ticket1"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={qualifyingData.hallTicket1}
//                                                     onChange={(e) => handleQualifyingChange('hallTicket1', e.target.value)}
//                                                     onBlur={() => handleBlur('hallTicket1')}
//                                                     placeholder="Enter Hall Ticket Number"
//                                                 />
//                                             </div>
//                                             {shouldShowError('hallTicket1') && (
//                                                 <p className="text-red-500 text-xs">{errors.hallTicket1}</p>
//                                             )}
//                                         </div>

//                                     </div>
//                                 </div>

//                                 {/* 10th Class */}
//                                 <div className="mb-6">
//                                     <p className="text-sm font-bold text-gray-800 mb-4">
//                                         <b>10th Class</b>
//                                     </p>

//                                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//                                         {/* Name of the Board */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Name of the Board <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={qualifyingData.board}
//                                                     onChange={(e) => handleQualifyingChange('board', e.target.value)}
//                                                     onBlur={() => handleBlur('board')}
//                                                 >
//                                                     <option value="">Select Board</option>
//                                                     {boards.map(board => (
//                                                         <option key={board.value} value={board.value}>
//                                                             {board.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('board') && (
//                                                 <p className="text-red-500 text-xs">{errors.board}</p>
//                                             )}
//                                         </div>

//                                         {/* Year Of Passing / Appearing */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Year Of Passing / Appearing <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <select
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                     value={qualifyingData.year}
//                                                     onChange={(e) => handleQualifyingChange('year', e.target.value)}
//                                                     onBlur={() => handleBlur('year')}
//                                                 >
//                                                     <option value="">Select Year</option>
//                                                     {years.map(year => (
//                                                         <option key={year.value} value={year.value}>
//                                                             {year.label}
//                                                         </option>
//                                                     ))}
//                                                 </select>
//                                                 <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                     <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                         <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                     </svg>
//                                                 </div>
//                                             </div>
//                                             {shouldShowError('year') && (
//                                                 <p className="text-red-500 text-xs">{errors.year}</p>
//                                             )}
//                                         </div>

//                                         {/* Hall Ticket Number */}
//                                         <div className="space-y-2">
//                                             <label className="block text-sm font-semibold text-gray-700">
//                                                 Hall Ticket Number <span className="text-red-500">*</span>
//                                             </label>
//                                             <div className="relative">
//                                                 <input
//                                                     id="hall-ticket"
//                                                     className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all duration-200 bg-white"
//                                                     type="text"
//                                                     value={qualifyingData.hallTicket}
//                                                     onChange={(e) => handleQualifyingChange('hallTicket', e.target.value)}
//                                                     onBlur={() => handleBlur('hallTicket')}
//                                                     placeholder="Enter Hall Ticket Number"
//                                                 />
//                                             </div>
//                                             {shouldShowError('hallTicket') && (
//                                                 <p className="text-red-500 text-xs">{errors.hallTicket}</p>
//                                             )}
//                                         </div>

//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Caste Details Section */}
//                             <div className="mb-8">
//                                 <div className="text-center mb-6">
//                                     <h4 className="caption-heading_apply text-lg font-bold text-[#dc2626] inline-flex items-center">
//                                         <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                             <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//                                         </svg>
//                                         Caste Details
//                                     </h4>
//                                 </div>

//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

//                                     {/* Category (Caste) */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Category (Caste) <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                 value={casteData.category}
//                                                 onChange={(e) => handleCasteChange('category', e.target.value)}
//                                                 onBlur={() => handleBlur('category')}
//                                             >
//                                                 <option value="">Select Category</option>
//                                                 {categories.map(category => (
//                                                     <option key={category.value} value={category.value}>
//                                                         {category.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {shouldShowError('category') && (
//                                             <p className="text-red-500 text-xs">{errors.category}</p>
//                                         )}
//                                     </div>

//                                     {/* Local Area */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Local Area <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                 value={casteData.localArea}
//                                                 onChange={(e) => handleCasteChange('localArea', e.target.value)}
//                                                 onBlur={() => handleBlur('localArea')}
//                                             >
//                                                 <option value="">Select Local Area</option>
//                                                 {localAreas.map(area => (
//                                                     <option key={area.value} value={area.value}>
//                                                         {area.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {shouldShowError('localArea') && (
//                                             <p className="text-red-500 text-xs">{errors.localArea}</p>
//                                         )}
//                                     </div>

//                                     {/* Special Category */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Special Category <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                 value={casteData.specialCategory}
//                                                 onChange={(e) => handleCasteChange('specialCategory', e.target.value)}
//                                                 onBlur={() => handleBlur('specialCategory')}
//                                             >
//                                                 <option value="">Select Special Category</option>
//                                                 {specialCategories.map(category => (
//                                                     <option key={category.value} value={category.value}>
//                                                         {category.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {shouldShowError('specialCategory') && (
//                                             <p className="text-red-500 text-xs">{errors.specialCategory}</p>
//                                         )}
//                                     </div>

//                                     {/* Annual Income of Parents */}
//                                     <div className="space-y-2">
//                                         <label className="block text-sm font-semibold text-gray-700">
//                                             Annual Income of Parents <span className="text-red-500">*</span>
//                                         </label>
//                                         <div className="relative">
//                                             <select
//                                                 className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent appearance-none bg-white transition-all duration-200"
//                                                 value={casteData.annualIncome}
//                                                 onChange={(e) => handleCasteChange('annualIncome', e.target.value)}
//                                                 onBlur={() => handleBlur('annualIncome')}
//                                             >
//                                                 <option value="">Select Income Range</option>
//                                                 {incomeRanges.map(income => (
//                                                     <option key={income.value} value={income.value}>
//                                                         {income.label}
//                                                     </option>
//                                                 ))}
//                                             </select>
//                                             <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                                                 <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                                     <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                                                 </svg>
//                                             </div>
//                                         </div>
//                                         {shouldShowError('annualIncome') && (
//                                             <p className="text-red-500 text-xs">{errors.annualIncome}</p>
//                                         )}
//                                     </div>

//                                 </div>
//                             </div>

//                             {/* Agreement Section */}
//                             <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
//                                 <label className="flex items-start space-x-3 cursor-pointer">
//                                     <div className="flex items-center h-5">
//                                         <input
//                                             type="checkbox"
//                                             className="w-4 h-4 text-[#1e40af] border-gray-300 rounded focus:ring-[#1e40af]"
//                                             checked={agreement}
//                                             onChange={(e) => setAgreement(e.target.checked)}
//                                         />
//                                     </div>
//                                     <div className="text-sm text-gray-700">
//                                         <span className="font-medium">By checking this box, you agree that the information provided is accurate and truthful.</span>
//                                         <span> You accept our policies and guidelines and acknowledge that failure to comply may result in the suspension of your account.</span>
//                                         <span> You also agree that your data may be used for administrative purposes.</span>
//                                     </div>
//                                 </label>
//                             </div>

//                         </div>

//                         {/* Submit Button */}
//                         <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
//                             <div className="text-end">
//                                 <Link to='/Form-view'
//                                     className="bg-gradient-to-r from-[#059669] to-[#d97706] text-white px-8 py-2 rounded-full font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200"
//                                     onClick={() => {
//                                         // Mark all fields as touched when submitting
//                                         const allTouched = {};
//                                         Object.keys(touched).forEach(key => {
//                                             allTouched[key] = true;
//                                         });
//                                         setTouched(allTouched);
//                                     }}
//                                 >
//                                    Next
//                                 </Link>
//                             </div>
//                         </div>

//                     </div>
//                 </div>

//             </div>

//             <Footer />
//         </div>
//     );
// };

// export default Apply;

// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { useParams } from 'react-router';
// import Header from '../Common/Header';
// import Footer from '../Common/Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import toast from 'react-hot-toast';
// import { Alert, Button, Card } from 'flowbite-react';
// import { HiCheckCircle, HiArrowLeft, HiArrowRight } from 'react-icons/hi';

// const baseUrl = import.meta.env.VITE_API_URL;

// // Image blur detection function
// const isImageBlurred = (src, width, height) => {
//   return new Promise((resolve) => {
//     const img = new Image();
//     img.crossOrigin = 'Anonymous';
//     img.src = src;

//     img.onload = () => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = width || 100;
//       canvas.height = height || 100;

//       ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
//       const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
//       const data = imageData.data;

//       let contrast = 0;
//       for (let i = 0; i < data.length; i += 4) {
//         const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
//         contrast += Math.abs(brightness - 128);
//       }

//       const avgContrast = contrast / (data.length / 4);
//       resolve(avgContrast < 25); // Threshold for blur detection
//     };

//     img.onerror = () => resolve(false);
//   });
// };

// // Custom Stepper Component
// const CustomStepper = ({ steps, activeStep }) => {
//   return (
//     <div className="flex items-center w-full mb-8 overflow-x-auto">
//       {steps.map((step, index) => (
//         <React.Fragment key={step}>
//           <div className="flex flex-col items-center min-w-max">
//             <div
//               className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
//                 index <= activeStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
//               }`}
//             >
//               {index + 1}
//             </div>
//             <span
//               className={`text-xs mt-1 text-center max-w-20 break-words ${
//                 index <= activeStep ? 'text-blue-600 font-medium' : 'text-gray-500'
//               }`}
//             >
//               {step}
//             </span>
//           </div>

//           {index < steps.length - 1 && (
//             <div
//               className={`flex-1 h-1 mx-2 min-w-8 ${
//                 index < activeStep ? 'bg-blue-600' : 'bg-gray-200'
//               }`}
//             />
//           )}
//         </React.Fragment>
//       ))}
//     </div>
//   );
// };

// const DynamicApply = () => {
//     const { institute_id } = useParams();
//     const [formConfig, setFormConfig] = useState(null);
//     const [formData, setFormData] = useState({});
//     const [touched, setTouched] = useState({});
//     const [errors, setErrors] = useState({});
//     const [loading, setLoading] = useState(true);
//     const [districtsData, setDistrictsData] = useState({});
//     const [activeStep, setActiveStep] = useState(0);
//     const [submitMessage, setSubmitMessage] = useState('');
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     const createdObjectUrls = useRef([]);

//     // Steps configuration
//     const steps = ['FILL APPLICATION', 'CONFIRM & PAY', 'INVOICE'];

//     // --- Data Fetching and Initialization ---
//     useEffect(() => {
//         const fetchFormConfig = async () => {
//             try {
//                 const response = await fetch(baseUrl + 'api/Public/Get-apply-form', {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ unique_code: "EeOEBgpF7O3oC4O" })
//                 });

//                 const data = await response.json();
//                 console.log('Form config loaded:', data);
//                 setFormConfig(data);

//                 // Initialize form data
//                 const initialFormData = {};
//                 data.data.forEach(section => {
//                     section.children.forEach(field => {
//                         if (field.name) {
//                             if (field.type === 'adhar') {
//                                 initialFormData[field.name] = Array(12).fill('');
//                             } else if (field.type === 'checkbox') {
//                                 initialFormData[field.name] = false;
//                             } else {
//                                 initialFormData[field.name] = field.value || '';
//                             }
//                         }
//                     });
//                 });
//                 setFormData(initialFormData);

//                 // Initialize errors from required_child
//                 const initialErrors = {};
//                 data.required_child.forEach(field => {
//                     initialErrors[field.name] = field.validation_message;
//                 });
//                 setErrors(initialErrors);

//                 setLoading(false);
//             } catch (error) {
//                 console.error('Error fetching form config:', error);
//                 toast.error('Failed to load form configuration. Please refresh the page.');
//                 setLoading(false);
//             }
//         };

//         fetchFormConfig();

//         // Cleanup on unmount
//         return () => {
//             createdObjectUrls.current.forEach(url => URL.revokeObjectURL(url));
//             createdObjectUrls.current = [];
//         };
//     }, []);

//     // --- District fetching ---
//     const fetchDistricts = useCallback(async (stateId, stateFieldName) => {
//         if (!stateId) {
//             console.log('No state ID provided for district fetch');
//             return;
//         }

//         console.log('Fetching districts for state:', stateId, 'field:', stateFieldName);

//         const loadingToast = toast.loading('Loading districts...');

//         try {
//             const res = await fetch(baseUrl + 'api/frontend/get_district_by_state_id', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ state_id: stateId })
//             });

//             const data = await res.json();
//             console.log('District API response:', data);

//             let districtOptions = [];

//             // Handle different response formats
//             if (data.status && Array.isArray(data.districts)) {
//                 districtOptions = data.districts.map(district => ({
//                     value: district.id,
//                     text: district.district_title || district.district_name || district.name || 'District'
//                 }));
//             } else if (Array.isArray(data)) {
//                 districtOptions = data.map(district => ({
//                     value: district.id,
//                     text: district.district_name || district.name || 'District'
//                 }));
//             } else {
//                 console.warn('Unexpected district API response format:', data);
//                 districtOptions = [{ value: "", text: "No districts available" }];
//             }

//             // Store districts in state with stateFieldName as key
//             setDistrictsData(prev => ({
//                 ...prev,
//                 [stateFieldName]: districtOptions
//             }));

//             toast.success('Districts loaded successfully!', { id: loadingToast });
//             console.log('Processed district options:', districtOptions);

//         } catch (err) {
//             console.error('Error fetching districts:', err);
//             toast.error('Failed to load districts. Please try again.', { id: loadingToast });
//             setDistrictsData(prev => ({
//                 ...prev,
//                 [stateFieldName]: [{ value: "", text: "Error loading districts" }]
//             }));
//         }
//     }, []);

//     // --- Validation and State Handlers ---

//     const isFieldRequired = (fieldName) => {
//         return formConfig?.required_child?.some(field => field.name === fieldName);
//     };

//     const handleInputChange = (fieldName, value) => {
//         console.log('Field changed:', fieldName, 'Value:', value);

//         setFormData(prev => ({
//             ...prev,
//             [fieldName]: value
//         }));

//         // Clear error when field has value
//         if (value && value.toString().trim() !== '') {
//             setErrors(prev => ({
//                 ...prev,
//                 [fieldName]: ''
//             }));
//         }
//     };

//     // Handle state selection and trigger district fetch
//     const handleStateChange = async (fieldName, value) => {
//         console.log('State changed:', fieldName, 'Value:', value);

//         // Update state field
//         handleInputChange(fieldName, value);

//         // Determine corresponding district field name
//         let districtFieldName = '';
//         if (fieldName === 'selectBelong') {
//             districtFieldName = 'selectDistrict';
//         } else if (fieldName.includes('_state')) {
//             districtFieldName = fieldName.replace('_state', '_district');
//         } else if (fieldName === 'address_state') {
//             districtFieldName = 'address_district';
//         }

//         if (districtFieldName) {
//             // Reset district field
//             setFormData(prev => ({
//                 ...prev,
//                 [districtFieldName]: ''
//             }));

//             // Clear district error
//             setErrors(prev => ({
//                 ...prev,
//                 [districtFieldName]: ''
//             }));

//             // Fetch districts if state is selected
//             if (value) {
//                 await fetchDistricts(value, fieldName);
//             } else {
//                 // Clear districts if no state selected
//                 setDistrictsData(prev => ({
//                     ...prev,
//                     [fieldName]: []
//                 }));
//             }
//         }
//     };

//     const handleAadhaarChange = (fieldName, index, value) => {
//         const currentAadhaar = formData[fieldName] || Array(12).fill('');
//         const newAadhaar = [...currentAadhaar];
//         const sanitizedValue = value.replace(/\D/g, '');

//         if (sanitizedValue.length > 1) return;

//         newAadhaar[index] = sanitizedValue;

//         setFormData(prev => ({
//             ...prev,
//             [fieldName]: newAadhaar
//         }));

//         if (sanitizedValue && index < 11) {
//             const nextInput = document.getElementById(`${fieldName}-${index + 1}`);
//             if (nextInput) {
//                 nextInput.focus();
//             }
//         }

//         const fullAadhaar = newAadhaar.filter(Boolean).join('');
//         if (fullAadhaar.length === 12 || !isFieldRequired(fieldName)) {
//             setErrors(prev => ({
//                 ...prev,
//                 [fieldName]: ''
//             }));
//         }
//     };

//     const handleFileUpload = async (fieldName, file) => {
//         if (!file) return;

//         // File size validation
//         const isPic = fieldName === 'candidate_pic';
//         const isSignature = fieldName === 'candidate_signature';

//         if (isPic && file.size > 50 * 1024) {
//             toast.error('Profile photo must be less than 50KB.');
//             return;
//         }

//         if (isSignature && file.size > 20 * 1024) {
//             toast.error('Signature must be less than 20KB.');
//             return;
//         }

//         // Create preview URL
//         const url = URL.createObjectURL(file);
//         createdObjectUrls.current.push(url);

//         // Check for image blur for specific image fields
//         const isImageField = fieldName === 'candidate_pic' || fieldName === 'candidate_signature';

//         if (isImageField && file.type.startsWith('image/')) {
//             const blurCheckToast = toast.loading('Checking image quality...');

//             try {
//                 const blurry = await isImageBlurred(url, 200, 200);
//                 toast.dismiss(blurCheckToast);

//                 if (blurry) {
//                     toast.error("The uploaded image is too blurry. Please upload a clearer image.");
//                     URL.revokeObjectURL(url);
//                     return; // Don't proceed with blurry image
//                 } else {
//                     toast.success('Image quality is good!');
//                 }
//             } catch (error) {
//                 toast.dismiss(blurCheckToast);
//                 console.error('Error checking image blur:', error);
//                 toast.error('Error checking image quality. Please try again.');
//             }
//         }

//         setFormData(prev => {
//             const nextData = { ...prev, [fieldName]: file };
//             // Set preview fields
//             if (fieldName === 'candidate_pic') {
//                 nextData['customer_pic_preview'] = url;
//             } else if (fieldName === 'candidate_signature') {
//                 nextData['signature_pic_preview'] = url;
//             } else if (fieldName === 'caste_certificate') {
//                 nextData['caste_certificate_preview'] = url;
//             }
//             return nextData;
//         });

//         setErrors(prev => ({
//             ...prev,
//             [fieldName]: ''
//         }));

//         toast.success('File uploaded successfully!');
//     };

//     const handleBlur = (fieldName) => {
//         setTouched(prev => ({
//             ...prev,
//             [fieldName]: true
//         }));

//         if (isFieldRequired(fieldName)) {
//             const value = formData[fieldName];
//             let isValid = true;

//             if (fieldName === 'adhar' || fieldName === 'adharCard') {
//                 const fullAadhaar = (value || []).filter(Boolean).join('');
//                 isValid = fullAadhaar.length === 12;
//             } else if (fieldName.includes('candidate_pic') || fieldName.includes('signature') || fieldName.includes('file')) {
//                 isValid = !!value;
//             } else {
//                 isValid = !!value && value.toString().trim() !== '';
//             }

//             if (!isValid) {
//                 const validationMessage = formConfig.required_child.find(f => f.name === fieldName)?.validation_message || 'This field is required.';
//                 setErrors(prev => ({
//                     ...prev,
//                     [fieldName]: validationMessage
//                 }));
//             }
//         }
//     };

//     const shouldShowError = (fieldName) => {
//         return touched[fieldName] && errors[fieldName];
//     };

//     // Stepper navigation handlers
//     const handleNext = () => {
//         // Validate current step before proceeding
//         if (activeStep === 0) {
//             // Validate FILL APPLICATION step
//             const allTouched = {};
//             Object.keys(formData).forEach(key => {
//                 allTouched[key] = true;
//             });
//             setTouched(allTouched);

//             const hasErrors = Object.values(errors).some(error => error !== '');
//             const requiredFields = formConfig?.required_child?.map(field => field.name) || [];
//             const missingFields = requiredFields.filter(field => !formData[field] ||
//                 (Array.isArray(formData[field]) ? formData[field].join('').length !== 12 : formData[field].toString().trim() === '')
//             );

//             if (hasErrors || missingFields.length > 0) {
//                 toast.error('Please fill all required fields correctly before proceeding.');
//                 return;
//             }
//         }

//         setActiveStep((prev) => Math.min(prev + 1, steps.length - 1));
//     };

//     const handleBack = () => {
//         setActiveStep((prev) => Math.max(prev - 1, 0));
//     };

//     // Form submission handler
//     const handleSubmit = async () => {
//         setIsSubmitting(true);
//         setSubmitMessage('');

//         try {
//             // Simulate form submission
//             console.log('Form Data:', formData);

//             // TODO: Implement actual form submission API call
//             await new Promise(resolve => setTimeout(resolve, 2000));

//             setSubmitMessage('Application submitted successfully!');
//             toast.success('Application submitted successfully!');
//             setActiveStep(2); // Move to INVOICE step
//         } catch (error) {
//             console.error('Error submitting form:', error);
//             setSubmitMessage('Error submitting application. Please try again.');
//             toast.error('Error submitting application. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     const handlePayment = async () => {
//         setIsSubmitting(true);
//         try {
//             // Simulate payment processing
//             await new Promise(resolve => setTimeout(resolve, 2000));
//             toast.success('Payment processed successfully!');
//             setActiveStep(2); // Move to INVOICE step
//         } catch (error) {
//             toast.error('Payment failed. Please try again.');
//         } finally {
//             setIsSubmitting(false);
//         }
//     };

//     // --- Layout Helper Functions ---
//     const getGridColumns = (section) => {
//         let baseCols = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

//         if (section.children.length <= 4 && section.children.every(f => f.type !== 'file_button' && f.type !== 'para')) {
//             baseCols = 'grid-cols-1 md:grid-cols-2';
//         }

//         if (section.children.length === 1 && (section.children[0].type === 'heading' || section.children[0].type === 'para')) {
//             return '';
//         }

//         return baseCols;
//     };

//     const getFieldWidth = (field) => {
//         if (field.type === 'heading' || field.type === 'para' || field.type === 'checkbox') {
//             return 'col-span-full';
//         }
//         if (field.type === 'adhar') return 'lg:col-span-2 md:col-span-full';
//         if (field.type === 'file_button') return 'lg:col-span-1 md:col-span-1';
//         return '';
//     };

//     // Get district options for a specific state field
//     const getDistrictOptions = (stateFieldName) => {
//         const districtData = districtsData[stateFieldName];
//         console.log('Getting districts for:', stateFieldName, 'Data:', districtData);

//         if (districtData && districtData.length > 0) {
//             return districtData;
//         }
//         return [{ value: "", text: "Select State First" }];
//     };

//     // Check if state is selected for a district field
//     const isStateSelected = (districtFieldName) => {
//         let stateFieldName = '';
//         if (districtFieldName === 'selectDistrict') {
//             stateFieldName = 'selectBelong';
//         } else if (districtFieldName.includes('_district')) {
//             stateFieldName = districtFieldName.replace('_district', '_state');
//         } else if (districtFieldName === 'address_district') {
//             stateFieldName = 'address_state';
//         }

//         return !!formData[stateFieldName];
//     };

//     // --- Renderer Functions ---
//     const renderField = (field) => {
//         const fieldName = field.name;
//         const commonBase = "w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0369a1] focus:border-[#0369a1] transition-all duration-200 bg-white text-gray-800 shadow-sm text-base";
//         let commonClass = commonBase;
//         const fieldValue = formData[fieldName] ?? '';

//         if (shouldShowError(fieldName)) {
//             commonClass = commonClass.replace('border-gray-300', 'border-red-500')
//                                      .replace('focus:ring-[#0369a1]', 'focus:ring-red-500')
//                                      .replace('focus:border-[#0369a1]', 'focus:border-red-500');
//         }

//         switch (field.type) {
//             case 'text':
//             case 'number':
//             case 'email':
//                 return (
//                     <input
//                         key={field.id}
//                         className={commonClass}
//                         type={field.type === 'text' ? 'text' : (field.type === 'number' ? 'number' : 'email')}
//                         placeholder={field.label}
//                         value={fieldValue}
//                         onChange={(e) => handleInputChange(fieldName, e.target.value)}
//                         onBlur={() => handleBlur(fieldName)}
//                     />
//                 );

//             case 'select': {
//                 const isStateField = fieldName === 'selectBelong' || fieldName === 'address_state' || fieldName.includes('_state');
//                 const isDistrictField = fieldName === 'selectDistrict' || fieldName === 'address_district' || fieldName.includes('_district');

//                 let options = field.options || [];
//                 const selectProps = {
//                     className: commonClass,
//                     value: fieldValue,
//                     onChange: (e) => {
//                         const value = e.target.value;
//                         if (isStateField) {
//                             handleStateChange(fieldName, value);
//                         } else {
//                             handleInputChange(fieldName, value);
//                         }
//                     },
//                     onBlur: () => handleBlur(fieldName)
//                 };

//                 // Handle district fields
//                 if (isDistrictField) {
//                     let stateFieldNameForDistricts = '';
//                     if (fieldName === 'selectDistrict') {
//                         stateFieldNameForDistricts = 'selectBelong';
//                     } else if (fieldName.includes('_district')) {
//                         stateFieldNameForDistricts = fieldName.replace('_district', '_state');
//                     }

//                     options = getDistrictOptions(stateFieldNameForDistricts);

//                     // Disable district if state not selected
//                     if (!isStateSelected(fieldName)) {
//                         selectProps.disabled = true;
//                         selectProps.className += ' bg-gray-100 cursor-not-allowed';
//                         // Ensure we show "Select State First" when disabled
//                         if (options.length === 0 || (options.length === 1 && options[0].value === "")) {
//                             options = [{ value: "", text: "Select State First" }];
//                         }
//                     }
//                 }

//                 return (
//                     <div className="relative" key={field.id}>
//                         <select {...selectProps}>
//                             <option value="">
//                                 {isDistrictField ? 'Select District' : `Select ${field.label || 'Option'}`}
//                             </option>
//                             {options.map(opt => (
//                                 <option key={opt.value} value={opt.value}>
//                                     {(opt.text)}
//                                 </option>
//                             ))}
//                         </select>
//                         <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
//                             <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
//                             </svg>
//                         </div>
//                     </div>
//                 );
//             }

//             case 'date':
//                 return (
//                     <input
//                         key={field.id}
//                         className={commonClass}
//                         type="date"
//                         value={fieldValue}
//                         onChange={(e) => handleInputChange(fieldName, e.target.value)}
//                         onBlur={() => handleBlur(fieldName)}
//                     />
//                 );

//             case 'adhar':
//                 return (
//                     <div className="flex space-x-1 lg:space-x-1 bg-white rounded-lg p-2 border border-gray-300 shadow-sm">
//                         {Array(12).fill('').map((_, index) => (
//                             <input
//                                 key={index}
//                                 id={`${fieldName}-${index}`}
//                                 placeholder="0"
//                                 maxLength="1"
//                                 className={`w-8 h-8 px-1 py-1 border rounded-md text-center text-base font-mono focus:ring-1 focus:ring-blue-500 transition-all ${shouldShowError(fieldName) ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
//                                 type="text"
//                                 inputMode="numeric"
//                                 value={formData[fieldName]?.[index] || ''}
//                                 onChange={(e) => handleAadhaarChange(fieldName, index, e.target.value)}
//                                 onBlur={() => handleBlur(fieldName)}
//                             />
//                         ))}
//                     </div>
//                 );

//             case 'file_button': {
//                 const file = formData[fieldName];
//                 const isPic = fieldName === 'candidate_pic';
//                 const isSignature = fieldName === 'candidate_signature';

//                 let previewUrl = '';
//                 if (file instanceof File) {
//                     previewUrl = URL.createObjectURL(file);
//                 } else if (isPic && formData['customer_pic_preview']) {
//                     previewUrl = formData['customer_pic_preview'];
//                 } else if (isSignature && formData['signature_pic_preview']) {
//                     previewUrl = formData['signature_pic_preview'];
//                 } else if (fieldName === 'caste_certificate' && formData['caste_certificate_preview']) {
//                     previewUrl = formData['caste_certificate_preview'];
//                 }

//                 return (
//                     <div key={field.id} className="text-center space-y-3 p-4 bg-white rounded-xl border-2 border-dashed border-[#a3e635] hover:border-[#1e40af] transition-all duration-300">
//                         <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-2 overflow-hidden shadow-md">
//                             {previewUrl ? (
//                                 <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
//                             ) : (
//                                 <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
//                                 </svg>
//                             )}
//                         </div>
//                         <p className="text-sm text-gray-700 font-semibold mb-2">
//                             {isPic ? 'Profile Photo (max 50kb)' :
//                              isSignature ? 'Candidate Signature (max 20kb)' :
//                              'Upload Certificate'}
//                         </p>
//                         <input
//                             type="file"
//                             id={fieldName}
//                             className="hidden"
//                             onChange={(e) => handleFileUpload(fieldName, e.target.files[0])}
//                             accept="image/*"
//                             onBlur={() => handleBlur(fieldName)}
//                         />
//                         <label
//                             htmlFor={fieldName}
//                             className={`bg-gradient-to-r ${isPic ? 'from-[#3b82f6] to-[#2563eb]' :
//                                       isSignature ? 'from-[#ef4444] to-[#dc2626]' :
//                                       'from-[#10b981] to-[#059669]'} text-white px-4 py-2 rounded-full text-sm font-bold hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300 w-full cursor-pointer block`}
//                         >
//                             {file ? 'Change File' : `Select ${isPic ? 'Image' : isSignature ? 'Signature' : 'File'}`}
//                         </label>
//                     </div>
//                 );
//             }

//             case 'image': {
//                 const previewSrc = formData[fieldName] || '';
//                 return (
//                     <div key={field.id} className="flex items-center justify-center">
//                         {previewSrc ? (
//                             <img src={previewSrc} alt="preview" width={180} height={180} className="rounded-md object-cover border shadow-sm" />
//                         ) : (
//                             <div className="w-[180px] h-[180px] rounded-md bg-gray-100 flex items-center justify-center border border-dashed text-gray-400">
//                                 <span className="text-xs">180 x 180</span>
//                             </div>
//                         )}
//                     </div>
//                 );
//             }

//             case 'checkbox':
//                 return (
//                     <label key={field.id} className="flex items-start space-x-3 cursor-pointer p-3 bg-gray-100 rounded-lg hover:bg-gray-200 transition-all">
//                         <div className="flex items-center h-5">
//                             <input
//                                 type="checkbox"
//                                 className="w-5 h-5 text-[#1e40af] border-gray-400 rounded focus:ring-[#1e40af]"
//                                 checked={!!formData[fieldName]}
//                                 onChange={(e) => handleInputChange(fieldName, e.target.checked)}
//                                 onBlur={() => handleBlur(fieldName)}
//                             />
//                         </div>
//                         <div className="text-sm text-gray-700">
//                             <span className="font-medium">{field.label || 'I agree to the terms and conditions.'}</span>
//                         </div>
//                     </label>
//                 );

//             case 'heading':
//                 return (
//                     <h4 key={field.id} className="text-xl font-extrabold text-[#1e40af] border-b-2 border-[#1e40af]/30 pb-2 mb-4">
//                         {field.label || 'Section Title'}
//                     </h4>
//                 );

//             case 'para':
//                 return (
//                     <p key={field.id} className="text-base text-gray-600 italic border-l-4 border-gray-300 pl-3">
//                         {field.label}
//                     </p>
//                 );

//             default:
//                 return <div key={field.id} className="text-red-500">Unsupported field type: <strong>{field.type}</strong></div>;
//         }
//     };

//     const renderSection = (section, index) => {
//         const sectionClasses = index % 2 === 0
//             ? 'bg-white p-6 rounded-xl shadow-inner border border-gray-100'
//             : 'bg-gray-50 p-6 rounded-xl border border-gray-200';

//         const gridTemplate = getGridColumns(section);
//         const hasGrid = gridTemplate !== '';

//         const customWidth = section.width
//             ? { width: typeof section.width === 'number' ? `${section.width}%` : section.width }
//             : { width: '100%' };

//         return (
//             <div key={index} className={`mb-8 ${sectionClasses}`} style={customWidth}>
//                 {section.label && (
//                     <h3 className="text-xl font-bold mb-4 text-[#dc2626] border-b pb-2">
//                         {section.label}
//                     </h3>
//                 )}

//                 <div className={`${hasGrid ? 'grid gap-6' : 'space-y-6'} ${gridTemplate}`}>
//                     {section.children.map(field => (
//                         <div key={field.id} className={`${getFieldWidth(field)} space-y-1`}>
//                             {field.label && field.type !== 'heading' && field.type !== 'para' && field.type !== 'checkbox' && (
//                                 <label className="block text-sm font-medium text-gray-700 transition-colors duration-200">
//                                     {field.label}
//                                     {isFieldRequired(field.name) && <span className="text-red-500 ml-1">*</span>}
//                                 </label>
//                             )}

//                             {renderField(field)}

//                             {shouldShowError(field.name) && (
//                                 <p className="text-red-600 text-xs mt-1 font-medium flex items-center">
//                                     <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
//                                         <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                                     </svg>
//                                     {errors[field.name]}
//                                 </p>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         );
//     };

//     // Step content renderer
//     const renderStepContent = (step) => {
//         switch (step) {
//             case 0: // FILL APPLICATION
//                 return (
//                     <div className="space-y-6">
//                         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/10 to-[#dc2626]/10 rounded-t-xl">
//                             <h2 className="text-center text-2xl font-extrabold text-[#1e40af] flex items-center justify-center">
//                                 <svg className="w-6 h-6 mr-3 text-[#dc2626]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
//                                 </svg>
//                                 Application Form
//                             </h2>
//                             <p className="text-center text-sm text-gray-600 mt-1">Please fill in all the required details carefully.</p>
//                         </div>

//                         <form className="flex flex-wrap">
//                             {formConfig?.data?.map((section, index) => renderSection(section, index))}
//                         </form>
//                     </div>
//                 );

//             case 1: // CONFIRM & PAY
//                 return (
//                     <div className="space-y-6">
//                         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#059669]/10 to-[#d97706]/10 rounded-t-xl">
//                             <h2 className="text-center text-2xl font-extrabold text-[#059669] flex items-center justify-center">
//                                 <HiCheckCircle className="w-6 h-6 mr-3 text-[#d97706]" />
//                                 Confirm & Pay
//                             </h2>
//                             <p className="text-center text-sm text-gray-600 mt-1">Review your application and proceed with payment.</p>
//                         </div>

//                         <Card>
//                             <div className="space-y-4">
//                                 <h3 className="text-lg font-semibold text-gray-800">Application Summary</h3>
//                                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h4 className="font-medium text-gray-700">Personal Details</h4>
//                                         <p className="text-sm text-gray-600 mt-2">Please review all your personal information</p>
//                                     </div>
//                                     <div className="bg-gray-50 p-4 rounded-lg">
//                                         <h4 className="font-medium text-gray-700">Payment Amount</h4>
//                                         <p className="text-2xl font-bold text-[#059669] mt-2">₹500.00</p>
//                                     </div>
//                                 </div>

//                                 <div className="border-t pt-4">
//                                     <h4 className="font-medium text-gray-700 mb-3">Payment Methods</h4>
//                                     <div className="space-y-3">
//                                         <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                             <input type="radio" name="payment" className="text-blue-600" defaultChecked />
//                                             <span>Credit/Debit Card</span>
//                                         </label>
//                                         <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                             <input type="radio" name="payment" className="text-blue-600" />
//                                             <span>Net Banking</span>
//                                         </label>
//                                         <label className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
//                                             <input type="radio" name="payment" className="text-blue-600" />
//                                             <span>UPI</span>
//                                         </label>
//                                     </div>
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>
//                 );

//             case 2: // INVOICE
//                 return (
//                     <div className="space-y-6">
//                         <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#3b82f6]/10 to-[#8b5cf6]/10 rounded-t-xl">
//                             <h2 className="text-center text-2xl font-extrabold text-[#3b82f6] flex items-center justify-center">
//                                 <HiCheckCircle className="w-6 h-6 mr-3 text-[#8b5cf6]" />
//                                 Invoice
//                             </h2>
//                             <p className="text-center text-sm text-gray-600 mt-1">Your application has been submitted successfully.</p>
//                         </div>

//                         <Card>
//                             <div className="space-y-4">
//                                 <div className="text-center">
//                                     <HiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
//                                     <h3 className="text-xl font-bold text-gray-800">Application Submitted Successfully!</h3>
//                                     <p className="text-gray-600 mt-2">Your application ID: <strong>APP{Date.now().toString().slice(-6)}</strong></p>
//                                 </div>

//                                 <div className="border rounded-lg p-4 bg-gray-50">
//                                     <h4 className="font-semibold text-gray-700 mb-3">Invoice Details</h4>
//                                     <div className="space-y-2 text-sm">
//                                         <div className="flex justify-between">
//                                             <span>Application Fee:</span>
//                                             <span>₹500.00</span>
//                                         </div>
//                                         <div className="flex justify-between">
//                                             <span>Service Tax:</span>
//                                             <span>₹90.00</span>
//                                         </div>
//                                         <div className="flex justify-between border-t pt-2 font-semibold">
//                                             <span>Total Amount:</span>
//                                             <span>₹590.00</span>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 <div className="text-center pt-4">
//                                     <Button color="blue" className="mr-3">
//                                         Download Invoice
//                                     </Button>
//                                     <Button color="light">
//                                         Print Receipt
//                                     </Button>
//                                 </div>
//                             </div>
//                         </Card>
//                     </div>
//                 );

//             default:
//                 return null;
//         }
//     };

//     // --- Loading/Error States ---
//     if (loading) {
//         return <Loader />;
//     }

//     if (!formConfig || !formConfig.data) {
//         return <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-100">❌ Error loading form configuration.</div>;
//     }

//     // --- Main Component Render ---
//     return (
//         <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
//             <Header instituteName={formConfig.header?.name || 'Application Portal'} />

//             <div className="mx-full py-8 px-4 sm:px-6 lg:px-8">
//                 <div className="group relative">
//                     <div className="absolute -inset-0.5 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-xl blur-sm opacity-20 group-hover:opacity-100 transition duration-500"></div>

//                     <div className="relative bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden">
//                         <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

//                         <div className="p-6">
//                             <CustomStepper steps={steps} activeStep={activeStep} />

//                             {submitMessage && (
//                                 <Alert
//                                     color={submitMessage.includes('successfully') ? 'success' : 'failure'}
//                                     className="mb-4 break-words"
//                                 >
//                                     {submitMessage}
//                                 </Alert>
//                             )}

//                             {activeStep === steps.length ? (
//                                 <Alert color="success" className="mb-4">
//                                     All steps completed - you're finished
//                                 </Alert>
//                             ) : (
//                                 <>
//                                     <div className="mb-8">{renderStepContent(activeStep)}</div>

//                                     <div className="flex justify-between items-center flex-wrap gap-4">
//                                         <Button
//                                             color="light"
//                                             onClick={handleBack}
//                                             disabled={activeStep === 0}
//                                             className="flex items-center gap-2"
//                                         >
//                                             <HiArrowLeft className="w-4 h-4" />
//                                             Back
//                                         </Button>

//                                         {activeStep === steps.length - 1 ? (
//                                             <div className="text-center">
//                                                 <p className="text-sm text-gray-600 mb-2">Application completed successfully!</p>
//                                             </div>
//                                         ) : activeStep === steps.length - 2 ? (
//                                             <Button
//                                                 onClick={handlePayment}
//                                                 color="green"
//                                                 className="flex items-center gap-2"
//                                                 disabled={isSubmitting}
//                                             >
//                                                 {isSubmitting ? 'Processing...' : 'Proceed to Pay'}
//                                                 <HiCheckCircle className="w-4 h-4" />
//                                             </Button>
//                                         ) : (
//                                             <Button
//                                                 onClick={handleNext}
//                                                 color="blue"
//                                                 className="flex items-center gap-2"
//                                             >
//                                                 Next
//                                                 <HiArrowRight className="w-4 h-4" />
//                                             </Button>
//                                         )}
//                                     </div>
//                                 </>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>

//             <Footer />
//         </div>
//     );
// };

// export default DynamicApply;
