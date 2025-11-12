import React from 'react';
import { Link, useParams } from 'react-router';
import { IconMail, IconPhone } from '@tabler/icons-react';
import NewBadge from './NewBadge'; // Assuming you have this component

const Footer = ({ footerData,baseUrl }) => {
  const { institute_id } = useParams();

  // Default sections
  const defaultSections = {
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
            href: `mailto:${footerData?.admission?.admissio_query_email || "info@university.edu.in"}`
          },
          {
            type: "phone",
            value: footerData?.admission?.admissio_query_mobile || "1234567890",
            href: `tel:${footerData?.admission?.admissio_query_mobile || "1234567890"}`
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
            href: `mailto:${footerData?.technical?.technical_support_email || "support@example.com"}`
          },
          {
            type: "phone",
            value: footerData?.technical?.technical_primary_contact || "1234567890",
            href: `tel:${footerData?.technical?.technical_primary_contact || "1234567890"}`
          }
        ]
      }
    },
    bottomFooter: {
      copyright:
        footerData?.footer_line || "© 2025. University. All Rights Reserved",
      links: footerData?.footerPages || [] // Expecting array of {id, page_name, page_route}
    }
  };

  const { title, sections, bottomFooter } = defaultSections;

  const colorClasses = {
    blue: { text: "text-blue-600", hover: "hover:text-blue-600" },
    green: { text: "text-green-600", hover: "hover:text-green-600" },
    yellow: { text: "text-yellow-600", hover: "hover:text-yellow-600" },
    red: { text: "text-red-600", hover: "hover:text-red-600" },
    purple: { text: "text-purple-600", hover: "hover:text-purple-600" }
  };

  const getIcon = (type) => {
    switch (type) {
      case "email":
        return <IconMail size={18} stroke={2} className="mr-2 text-gray-600" />;
      case "phone":
        return <IconPhone size={18} stroke={2} className="mr-2 text-gray-600" />;
      default:
        return null;
    }
  };

  return (
    <div>
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
                {getIcon(contact.type)}
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
                {getIcon(contact.type)}
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
            <p className="text-gray-600 text-xs sm:text-sm mb-4 sm:mb-0 font-medium text-center sm:text-left">
              {bottomFooter?.copyright}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-end items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-center">
              {bottomFooter?.links?.map((link, index) => (
                <React.Fragment key={index}>
                  {index > 0 && <span className="text-gray-400 hidden sm:inline">|</span>}
                  <Link
                    to={`${baseUrl}/${link.page_route}`}
                    className="text-gray-600 hover:text-gray-900 transition duration-200 font-medium px-2 py-1 rounded"
                  >
                    {link.page_name}
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
