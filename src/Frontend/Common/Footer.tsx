import React from 'react';
import { Link } from 'react-router';

const Footer = ({ footerData }) => {
  // Default data if no footerData provided
  const defaultFooterData = {
    title: "General Enquiries & Technical Support",
    sections: {
      getInTouch: {
        title: "Get in touch",
        color: "blue",
        content: footerData?.in_touch?.address || "University Address"
      },
      admissionEnquiries: {
        title: "Admission Enquiries",
        color: "green",
        contacts: [
          {
            type: "email",
            value: footerData?.admission?.admissio_query_email || "info@university.edu.in",
            href: `mailto:${footerData?.admission?.admissio_query_email || "info@university.edu.in"}`,
            icon: "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6"
          },
          {
            type: "phone",
            value: footerData?.admission?.admissio_query_mobile || "1234567890",
            href: `tel:${footerData?.admission?.admissio_query_mobile || "1234567890"}`,
            icon: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
          }
        ]
      },
      technicalSupport: {
        title: "Technical Support",
        color: "purple",
        contacts: [
          {
            type: "email",
            value: footerData?.technical?.technical_support_email || "support@example.com",
            href: `mailto:${footerData?.technical?.technical_support_email || "support@example.com"}`,
            icon: "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6"
          },
          {
            type: "phone",
            value: footerData?.technical?.technical_primary_contact || "1234567890",
            href: `tel:${footerData?.technical?.technical_primary_contact || "1234567890"}`,
            icon: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
          }
        ]
      }
    },
    bottomFooter: {
      copyright: footerData?.footer_line || "© 2025. University. All Rights Reserved",
      links: [
        {
          text: "About",
          href: "/page/about",
          color: "blue"
        },
        {
          text: "Privacy Policy",
          href: "/page/privacy-policy",
          color: "green"
        },
        {
          text: "Disclaimer",
          href: "/page/disclaimer",
          color: "yellow"
        },
        {
          text: "Cancellation Policy",
          href: "/page/cancellation-policy",
          color: "red"
        }
      ]
    }
  };

  const { title, sections, bottomFooter } = defaultFooterData;

  // Color mapping for consistent Tailwind classes
  const colorClasses = {
    blue: {
      text: 'text-blue-600',
      hover: 'hover:text-blue-600'
    },
    green: {
      text: 'text-green-600',
      hover: 'hover:text-green-600'
    },
    yellow: {
      text: 'text-yellow-600',
      hover: 'hover:text-yellow-600'
    },
    red: {
      text: 'text-red-600',
      hover: 'hover:text-red-600'
    },
    purple: {
      text: 'text-purple-600',
      hover: 'hover:text-purple-600'
    }
  };

  return (
    <div>
      {/* Footer Section */}
      <div className="bg-white text-gray-800 p-8 mx-4 mb-4 border-t border-gray-200">
        <h3 className="text-2xl font-bold mb-6 text-center text-red-800">
          {title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Get in touch */}
          <div className="p-4">
            <h5 className={`text-lg font-semibold mb-3 ${colorClasses.blue.text}`}>
              {sections.getInTouch.title}
            </h5>
            <p className="text-gray-700 leading-relaxed">
              {sections.getInTouch.content}
            </p>
          </div>

          {/* Admission Enquiries */}
          <div className="p-4">
            <h5 className={`text-lg font-semibold mb-3 ${colorClasses.green.text}`}>
              {sections.admissionEnquiries.title}
            </h5>
            {sections.admissionEnquiries.contacts.map((contact, index) => (
              <p key={index} className="text-gray-700 mb-3 flex items-center transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d={contact.icon}></path>
                </svg>
                <a href={contact.href} className={`hover:${colorClasses.green.hover} transition duration-200`}>
                  {contact.value}
                </a>
              </p>
            ))}
          </div>

          {/* Technical Support */}
          <div className="p-4">
            <h5 className={`text-lg font-semibold mb-3 ${colorClasses.purple.text}`}>
              {sections.technicalSupport.title}
            </h5>
            {sections.technicalSupport.contacts.map((contact, index) => (
              <p key={index} className="text-gray-700 mb-3 flex items-center transition duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <path d={contact.icon}></path>
                </svg>
                <a href={contact.href} className={`hover:${colorClasses.purple.hover} transition duration-200`}>
                  {contact.value}
                </a>
              </p>
            ))}
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-300 pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 sm:mb-0 font-medium">
              {bottomFooter.copyright}
            </p>
            <div className="flex items-center space-x-3 text-sm">
              {bottomFooter.links.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400">|</span>}
                  <Link 
                    to={link.href} 
                    className={`text-gray-600 ${colorClasses[link.color].hover} transition duration-200 font-medium px-2 py-1 rounded`}
                  >
                    {link.text}
                  </Link>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;







// import React from 'react';
// import { Link } from 'react-router';

// const footerData = {
//   title: "General Enquiries & Technical Support",
//   sections: {
//     getInTouch: {
//       title: "Get in touch",
//       color: "blue",
//       content: "Avantika University, Vishwanathpuram, Lekoda, Ujjain - 456006 | MP | India"
//     },
//     admissionEnquiries: {
//       title: "Admission Enquiries",
//       color: "green",
//       contacts: [
//         {
//           type: "email",
//           value: "info@avantikauni.edu.in",
//           href: "mailto:info@avantikauni.edu.in",
//           icon: "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6"
//         },
//         {
//           type: "phone",
//           value: "1234567890",
//           href: "tel:1234567890",
//           icon: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
//         }
//       ]
//     },
//     technicalSupport: {
//       title: "Technical Support",
//       color: "purple",
//       contacts: [
//         {
//           type: "email",
//           value: "support@flyingstars.biz",
//           href: "mailto:support@flyingstars.biz",
//           icon: "M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z M3 7l9 6l9 -6"
//         },
//         {
//           type: "phone",
//           value: "1234567890 / 1234567885",
//           href: "tel:1234567890",
//           icon: "M5 4h4l2 5l-2.5 1.5a11 11 0 0 0 5 5l1.5 -2.5l5 2v4a2 2 0 0 1 -2 2a16 16 0 0 1 -15 -15a2 2 0 0 1 2 -2"
//         }
//       ]
//     }
//   },
//   bottomFooter: {
//     copyright: "© 2025. Avantika University Ujjain. All Rights Reserved",
//     links: [
//       {
//         text: "About",
//         href: "/page/about",
//         color: "blue"
//       },
//       {
//         text: "Privacy Policy",
//         href: "/page/privacy-policy",
//         color: "green"
//       },
//       {
//         text: "Disclaimer",
//         href: "/page/disclaimer",
//         color: "yellow"
//       },
//       {
//         text: "Cancellation Policy",
//         href: "/page/cancellation-policy",
//         color: "red"
//       }
//     ]
//   }
// };

// const Footer = () => {
//   const { title, sections, bottomFooter } = footerData;

//   // Color mapping for consistent Tailwind classes
//   const colorClasses = {
//     blue: {
//       text: 'text-blue-600',
//       hover: 'hover:text-blue-600'
//     },
//     green: {
//       text: 'text-green-600',
//       hover: 'hover:text-green-600'
//     },
//     yellow: {
//       text: 'text-yellow-600',
//       hover: 'hover:text-yellow-600'
//     },
//     red: {
//       text: 'text-red-600',
//       hover: 'hover:text-red-600'
//     },
//     purple: {
//       text: 'text-purple-600',
//       hover: 'hover:text-purple-600'
//     }
//   };

//   return (
//     <div>
//       {/* Footer Section */}
//       <div className="bg-white text-gray-800 p-8 mx-4 mb-4 border-t border-gray-200">
//         <h3 className="text-2xl font-bold mb-6 text-center text-red-800">
//           {title}
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
//           {/* Get in touch */}
//           <div className="p-4">
//             <h5 className={`text-lg font-semibold mb-3 ${colorClasses.blue.text}`}>
//               {sections.getInTouch.title}
//             </h5>
//             <p className="text-gray-700 leading-relaxed">
//               {sections.getInTouch.content}
//             </p>
//           </div>

//           {/* Admission Enquiries */}
//           <div className="p-4">
//             <h5 className={`text-lg font-semibold mb-3 ${colorClasses.green.text}`}>
//               {sections.admissionEnquiries.title}
//             </h5>
//             {sections.admissionEnquiries.contacts.map((contact, index) => (
//               <p key={index} className="text-gray-700 mb-3 flex items-center transition duration-200">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                   <path d={contact.icon}></path>
//                 </svg>
//                 <a href={contact.href} className={`hover:${colorClasses.green.hover} transition duration-200`}>
//                   {contact.value}
//                 </a>
//               </p>
//             ))}
//           </div>

//           {/* Technical Support */}
//           <div className="p-4">
//             <h5 className={`text-lg font-semibold mb-3 ${colorClasses.purple.text}`}>
//               {sections.technicalSupport.title}
//             </h5>
//             {sections.technicalSupport.contacts.map((contact, index) => (
//               <p key={index} className="text-gray-700 mb-3 flex items-center transition duration-200">
//                 <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
//                   <path d={contact.icon}></path>
//                 </svg>
//                 <a href={contact.href} className={`hover:${colorClasses.purple.hover} transition duration-200`}>
//                   {contact.value}
//                 </a>
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* Bottom Footer */}
//         <div className="border-t border-gray-300 pt-6">
//           <div className="flex flex-col sm:flex-row justify-between items-center">
//             <p className="text-gray-600 text-sm mb-4 sm:mb-0 font-medium">
//               {bottomFooter.copyright}
//             </p>
//             <div className="flex items-center space-x-3 text-sm">
//               {bottomFooter.links.map((link, index) => (
//                 <React.Fragment key={index}>
//                   {index > 0 && <span className="text-gray-400">|</span>}
//                   <Link 
//                     to={link.href} 
//                     className={`text-gray-600 ${colorClasses[link.color].hover} transition duration-200 font-medium px-2 py-1 rounded`}
//                   >
//                     {link.text}
//                   </Link>
//                 </React.Fragment>
//               ))}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Footer;