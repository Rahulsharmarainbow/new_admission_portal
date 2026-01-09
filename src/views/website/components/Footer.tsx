
// import React from "react";

// const Footer: React.FC = () => {
//   return (
//      <footer className="bg-white border-t border-slate-200 mt-auto">
//      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
//          {/* Company info */}
//          <div className="flex items-start gap-4 flex-1">
//            <div className="relative">
//              <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
//               <span className="text-white font-bold text-lg">FS</span>
//              </div>
//           </div>
//           <div className="space-y-1">
//              <h3 className="text-lg font-bold text-slate-900">
//               Flying Stars Careers
//             </h3>
//              <p className="text-sm text-slate-600">
//                123, Sample Street, Jabalpur
//                <br />
//              Madhya Pradesh, India
//              </p>
//              <p className="text-sm text-slate-600">9006514584</p>
//              <p className="text-sm">
//                <a
//                  href="mailto:careers@flyingstars.com"
//                 className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-slate-300 hover:decoration-indigo-300"
//               >
//                  careers@flyingstars.com
//                </a>
//              </p>
//            </div>
//         </div>

//        {/* Social links */}
//          <div className="flex flex-col items-end gap-3">
//            <p className="text-sm text-slate-600 font-medium">Connect with us</p>
//            <div className="flex items-center gap-2">
//             <a
//               href="https://linkedin.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//               aria-label="LinkedIn"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
//               </svg>
//             </a>
//             <a
//               href="https://instagram.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 bg-slate-100 hover:bg-pink-500 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//               aria-label="Instagram"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C23.999 5.367 17.638 0 12.017 0zm0 18.285c-4.487 0-8.129-3.642-8.129-8.129 0-4.487 3.642-8.13 8.129-8.13s8.13 3.643 8.13 8.13c0 4.487-3.643 8.129-8.13 8.129zm0-15.428c-3.324 0-6.029 2.704-6.029 6.029s2.705 6.03 6.029 6.03 6.03-2.705 6.03-6.03-2.705-6.029-6.03-6.029zm6.546 8.59c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876zm-5.67 0c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876z" />
//               </svg>
//             </a>
//             <a
//               href="https://facebook.com"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="w-10 h-10 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//               aria-label="Facebook"
//             >
//               <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                 <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//               </svg>
//             </a>
//           </div>
//           <p className="text-xs text-slate-500 text-right">
//             © {new Date().getFullYear()} Flying Stars. All rights reserved.
//           </p>
//         </div>
//       </div>
//     </div>
//   </footer>
//   );
// };

// export default Footer;
















// // src/pages/Footer.tsx
// import React from 'react';
// import { Link } from 'react-router';
// import { IconMail, IconPhone } from '@tabler/icons-react';
// import { TbWorldLatitude } from 'react-icons/tb';

// interface FooterProps {
//   footerData?: any;
//   baseUrl?: string;
//   instituteName?: string;
//   institute?: any;
// }

// const Footer: React.FC<FooterProps> = ({
//   footerData,
//   baseUrl = '',
//   instituteName = 'Career Portal',
//   institute,
// }) => {
//   // Extract data from API response structure
//   const academicName = institute?.footer?.academic_name || institute?.header?.academic_name || instituteName;
//   const academicEmail = institute?.footer?.academic_email || '';
//   const academicAddress = institute?.footer?.academic_address || '';
//   const academicWebsite = institute?.website || '';

//   const contactInfo = {
//     title: 'Contact Information',
//     sections: {
//       instituteInfo: {
//         title: academicName,
//         content: academicAddress,
//         email: academicEmail,
//         website: academicWebsite,
//       },
//       careerSupport: {
//         title: 'Career Support',
//         email: 'career@example.com',
//         phone: '+91 9876543210',
//       },
//       generalEnquiries: {
//         title: 'General Enquiries',
//         email: 'info@example.com',
//         phone: '+91 1234567890',
//       },
//     },
//   };

//   return (
//     <footer className="bg-white border-t border-slate-200 mt-auto">
//       <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 py-10">
        
       

        
//         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
//           {/* Company info */}
//           <div className="flex items-start gap-4 flex-1">
//             <div className="relative">
//               <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
//                 <span className="text-white font-bold text-lg">
//                   {academicName.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//             </div>
//             <div className="space-y-1">
//               <h3 className="text-lg font-bold text-slate-900">
//                 {academicName} Careers
//               </h3>
//               {academicAddress && (
//                 <p className="text-sm text-slate-600">
//                   {academicAddress}
//                 </p>
//               )}
//               {academicEmail && (
//                 <p className="text-sm">
//                   <a
//                     href={`mailto:${academicEmail}`}
//                     className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-slate-300 hover:decoration-indigo-300"
//                   >
//                     {academicEmail}
//                   </a>
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* Social links */}
//           <div className="flex flex-col items-end gap-3">
//             <p className="text-sm text-slate-600 font-medium">Connect with us</p>
//             <div className="flex items-center gap-2">
//               <a
//                 href="https://linkedin.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//                 aria-label="LinkedIn"
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
//                 </svg>
//               </a>
//               <a
//                 href="https://instagram.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 bg-slate-100 hover:bg-pink-500 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//                 aria-label="Instagram"
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C23.999 5.367 17.638 0 12.017 0zm0 18.285c-4.487 0-8.129-3.642-8.129-8.129c0-4.487 3.642-8.13 8.129-8.13s8.13 3.643 8.13 8.13c0 4.487-3.643 8.129-8.13 8.129zm0-15.428c-3.324 0-6.029 2.704-6.029 6.029s2.705 6.03 6.029 6.03 6.03-2.705 6.03-6.03-2.705-6.029-6.03-6.029zm6.546 8.59c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876zm-5.67 0c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876z" />
//                 </svg>
//               </a>
//               <a
//                 href="https://facebook.com"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="w-10 h-10 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
//                 aria-label="Facebook"
//               >
//                 <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
//                   <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
//                 </svg>
//               </a>
//             </div>
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="border-t border-gray-300 pt-6 mt-8">
//           <div className="flex flex-col sm:flex-row justify-between items-center">
//             <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-0 font-medium text-center sm:text-left">
//               © {new Date().getFullYear()} {academicName}. All Rights Reserved.
//             </p>

//             <div className="flex items-center gap-4 text-xs sm:text-sm">
//               <Link
//                 to={`${baseUrl}/privacy`}
//                 className="text-gray-600 hover:text-gray-900 transition duration-200"
//               >
//                 Privacy Policy
//               </Link>
//               <span className="text-gray-400">|</span>
//               <Link
//                 to={`${baseUrl}/terms`}
//                 className="text-gray-600 hover:text-gray-900 transition duration-200"
//               >
//                 Terms of Service
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// };

// export default Footer;










// Footer.tsx
import React from 'react';
import { Link } from 'react-router';

const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

interface FooterProps {
  baseUrl?: string;
  instituteName?: string;
  institute?: any;
  footerData?: any;
}

const Footer: React.FC<FooterProps> = ({
  baseUrl = '',
  instituteName = '',
  institute,
  footerData,
}) => {
  // Get logo from institute data (same as Header)
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };

  // Get institute data safely
  const getInstituteLogo = () => {
    if (!institute || !institute.header) return '';
    return institute.header.academic_logo || '';
  };

  const getInstituteAddress = () => {
    if (!footerData) return '';
    return footerData.academic_address || '';
  };

  const getInstituteEmail = () => {
    if (!footerData) return '';
    return footerData.academic_email || '';
  };

  const logoUrl = getLogoUrl(getInstituteLogo());
  const academicAddress = getInstituteAddress();
  const academicEmail = getInstituteEmail();
  const academicName = instituteName || institute?.header?.academic_name || 'Career Portal';

  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-28 py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-12">
          {/* Company info */}
          <div className="flex items-start gap-4 flex-1">
            <div className="relative">
              {logoUrl ? (
                <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 border-orange-500 overflow-hidden">
                  <img
                    src={logoUrl}
                    alt={`${academicName} Logo`}
                    className="h-10 w-10 object-contain"
                    onError={(e) => {
                      e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png/220px-National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png';
                    }}
                  />
                </div>
              ) : (
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">
                    {academicName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900">
                {academicName} Careers
              </h3>
              {academicAddress && (
                <p className="text-sm text-slate-600">
                  {academicAddress}
                </p>
              )}
              {academicEmail && (
                <p className="text-sm">
                  <a
                    href={`mailto:${academicEmail}`}
                    className="text-indigo-600 hover:text-indigo-700 font-medium underline decoration-slate-300 hover:decoration-indigo-300"
                  >
                    {academicEmail}
                  </a>
                </p>
              )}
            </div>
          </div>

          {/* Social links */}
          <div className="flex flex-col items-end gap-3">
            <p className="text-sm text-slate-600 font-medium">Connect with us</p>
            <div className="flex items-center gap-2">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-indigo-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-pink-500 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.621 5.367 11.988 11.988 11.988s11.988-5.367 11.988-11.988C23.999 5.367 17.638 0 12.017 0zm0 18.285c-4.487 0-8.129-3.642-8.129-8.129c0-4.487 3.642-8.13 8.129-8.13s8.13 3.643 8.13 8.13c0 4.487-3.643 8.129-8.13 8.129zm0-15.428c-3.324 0-6.029 2.704-6.029 6.029s2.705 6.03 6.029 6.03 6.03-2.705 6.03-6.03-2.705-6.029-6.03-6.029zm6.546 8.59c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876zm-5.67 0c0 .484-.392.876-.876.876s-.876-.392-.876-.876.392-.876.876-.876.876.392.876.876z" />
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-100 hover:bg-blue-600 text-slate-600 hover:text-white rounded-xl flex items-center justify-center transition-all duration-200 hover:shadow-md"
                aria-label="Facebook"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        {/* <div className="border-t border-gray-300 pt-6 mt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-0 font-medium text-center sm:text-left">
              © {new Date().getFullYear()} {academicName}. All Rights Reserved.
            </p>

            <div className="flex items-center gap-4 text-xs sm:text-sm">
              <Link
                to={`${baseUrl}/privacy`}
                className="text-gray-600 hover:text-gray-900 transition duration-200"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                to={`${baseUrl}/terms`}
                className="text-gray-600 hover:text-gray-900 transition duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
};

export default Footer;