import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import Loader from '../Common/Loader';
import axios from 'axios';
import toast from 'react-hot-toast';

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

const Home = () => {
  const { institute_id } = useParams();
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstituteData = async () => {
      try {
        setLoading(true);
        const response = await axios.post(
          `${apiUrl}/Public/Get-home-page-data`,
          {
            unique_code: institute_id
          },
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (response.data) {
          setInstitute(response.data);
        } else {
          setError('No data found for this institute');
          toast.error('No data found for this institute');
        }
      } catch (err) {
        console.error('Error fetching institute data:', err);
        setError('Failed to load institute data');
        toast.error('Failed to load institute data');
      } finally {
        setLoading(false);
      }
    };

    if (institute_id) {
      fetchInstituteData();
    }
  }, [institute_id]);

  // New Badge Component with fixed background color
  const NewBadge = ({ className = "", size = "default" }) => {
    const textSize = size === "small" ? "text-[8px]" : "text-[10px]";
    const padding = size === "small" ? "px-1 py-0.5" : "px-1.5 py-0.5";
    const dotSize = size === "small" ? "h-[4px] w-[4px]" : "h-[6px] w-[6px]";

    return (
      <sup className={`ml-1 ${className}`}>
        <span className={`animate-pulse inline-flex items-center bg-gradient-to-r from-[#dc2626] to-[#ea580c] text-white ${textSize} leading-none font-bold ${padding} rounded-full shadow-sm`}>
          <span className="mr-[2px]">NEW</span>
          <span className={`relative flex ${dotSize}`}>
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className={`relative inline-flex rounded-full ${dotSize} bg-white`}></span>
          </span>
        </span>
      </sup>
    );
  };

  if (loading) {
    return <Loader />;
  }

  if (error || !institute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error || 'Failed to load institute data'}</p>
        </div>
      </div>
    );
  }

  // Transform API data to match component structure
  const transformApiData = (data) => {
    const homeLines = data.home_other_lines || [];
    const titleLine = homeLines.find(line => line.title && line.title.includes('ENTRANCE EXAMINATION')) || homeLines[0] || {};
    const subtitleLine = homeLines.find(line => line.title && line.title.includes('ENTRANCE EXAMINATION') && line !== titleLine) || homeLines[1] || {};
    const descriptionLine = homeLines.find(line => line.title && line.title.length > 50) || homeLines[2] || {};

    return {
      name: data.header?.name || 'Institute',
      examInfo: {
        title: titleLine.title || "ENTRANCE EXAMINATION - 2024",
        subtitle: subtitleLine.title || "GENERAL ENTRANCE EXAMINATION - 2024",
        description: descriptionLine.title || "Institute entrance examination for various programs for the Academic Year 2024-25"
      },
      alert: {
        messages: data.marquee?.filter(m => m.status !== 0).map(m => m.title) || ["Registration open for 2024 admissions"],
        icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
        showNewBadge: data.marquee?.some(m => m.status !== 0) || false
      },
      cards: {
        information: {
          title: "Information",
          link: {
            text: "Download Brochure & Details",
            url: data.notification?.[0]?.doc_url || "#"
          },
          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
          showNewBadge: data.notification?.some(n => n.new === 1) || false
        },
        application: {
          title: "Application",
          link: {
            text: data.buttons?.[0]?.text || "Apply Online",
            url: data.buttons?.[0]?.href || "#"
          },
          showNewBadge: data.buttons?.some(b => b.new === 1) || false
        },
        latestNews: {
          title: "Latest News",
          content: data.news?.map(n => n.name) || ["No news available"],
          showNewBadge: data.news?.some(n => n.new === 1) || false
        }
      }
    };
  };

  const transformedData = transformApiData(institute);
  const { examInfo, alert, cards } = transformedData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header 
        instituteName={institute.header?.name} 
        logo={institute.header?.logo ? `${assetUrl}/${institute.header.logo}` : null}
        address={institute.header?.address}
      />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8">

        {/* Exam Information Section */}
        <div className="relative p-8 mb-8 text-center bg-white rounded-2xl shadow-xl border border-gray-200">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ENTRANCE EXAM 2024
            </div>
          </div>

          <div className="text-center mb-6 mt-4">
            <h4 className="text-3xl font-bold text-[#1e40af] mb-2">
              {examInfo.title}
            </h4>
            <div className="w-24 h-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] mx-auto rounded-full"></div>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-6 py-3 rounded-xl shadow-lg inline-flex items-center transform hover:scale-105 transition-transform duration-200">
                {examInfo.subtitle}
                {alert.showNewBadge && <NewBadge className="ml-2" />}
              </h2>
            </div>
            <div className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
              {examInfo.description}
            </div>
          </div>

          {/* Alert Marquee */}
          {alert.messages.length > 0 && (
            <div className="bg-gradient-to-r from-[#d97706]/20 to-[#ea580c]/20 border border-[#d97706] rounded-xl p-4 mb-2 overflow-hidden shadow-inner">
              <marquee behavior="scroll" direction="left" scrollamount="5">
                {alert.messages.map((message, index) => (
                  <span key={index} className="inline-flex items-center bg-white text-[#dc2626] text-base font-semibold px-6 py-2 rounded-full shadow-md mx-4 border border-[#dc2626] whitespace-nowrap">
                    <svg className="w-5 h-5 mr-3 text-[#ea580c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d={alert.icon} clipRule="evenodd" />
                    </svg>
                    {message}
                    {alert.showNewBadge && <NewBadge size="small" />}
                  </span>
                ))}
              </marquee>
            </div>
          )}
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Information Box - Blue Theme */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#0369a1]"></div>
              <div className="p-6 border-b border-gray-100 relative">
                <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  {cards.information.title}
                  {cards.information.showNewBadge && <NewBadge className="ml-2" />}
                </h4>
              </div>
              <div className="p-6 flex-grow flex items-center bg-gray-50 rounded-b-2xl">
                <div className="flex items-center bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1e40af] mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cards.information.icon} />
                  </svg>
                  <a href={cards.information.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1e40af] hover:text-[#dc2626] transition-colors duration-200 inline-flex items-center text-lg">
                    {cards.information.link.text}
                    {cards.information.showNewBadge && <NewBadge size="small" className="ml-2" />}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Application Box - Red/Orange Theme */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-[#ea580c] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#dc2626] to-[#ea580c]"></div>
              <div className="p-6 border-b border-gray-100 relative">
                <h4 className="text-center text-xl font-bold text-[#dc2626] inline-flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                  {cards.application.title}
                  {cards.application.showNewBadge && <NewBadge className="ml-2" />}
                </h4>
              </div>
              <div className="p-6 flex-grow flex items-center bg-gray-50 rounded-b-2xl">
                <div className="flex items-center justify-center bg-white rounded-xl p-6 w-full shadow-inner border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <a href={cards.application.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-white transition-colors duration-200 inline-flex items-center text-lg bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                    </svg>
                    {cards.application.link.text}
                    {cards.application.showNewBadge && <NewBadge size="small" className="ml-2" />}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Latest News Box - Green Theme */}
          <div className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#059669] to-[#d97706] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
            <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#059669] to-[#d97706]"></div>
              <div className="p-6 border-b border-gray-100 relative">
                <h4 className="text-center text-xl font-bold text-[#059669] inline-flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                  </svg>
                  {cards.latestNews.title}
                  {cards.latestNews.showNewBadge && <NewBadge className="ml-2" />}
                </h4>
              </div>
              <div className="p-6 flex-grow bg-gray-50 rounded-b-2xl">
                <div className="bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 h-48 overflow-y-auto hover:shadow-md transition-shadow duration-200">
                  {cards.latestNews.content && cards.latestNews.content.length > 0 ? (
                    <div className="space-y-3">
                      {cards.latestNews.content.map((news, index) => (
                        <div key={index} className="p-3 border-l-4 border-[#059669] bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all duration-200">
                          <p className="text-gray-700 inline-flex items-center text-sm">
                            <span className="w-2 h-2 bg-[#ea580c] rounded-full mr-3"></span>
                            {news}
                            {cards.latestNews.showNewBadge && index === 0 && <NewBadge size="small" className="ml-2" />}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">No news available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer footerData={institute.footer} />
    </div>
  );
};

export default Home;








// import React from 'react';
// import { useParams } from 'react-router';
// import Header from '../Common/Header';
// import Footer from '../Common/Footer';

// // Sample data for different institutes (you can expand this later)
// const instituteData = {
//   '1': {
//     name: 'Avantika University',
//     examInfo: {
//       title: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
//       subtitle: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
//       description: "Avantika University Ujjain is conducting Fine Arts and Design Entrance Examination (FADEE) for admission into four year BFA and B. Design Programs offered in Constituent Colleges for the Academic Year 2024-25"
//     },
//     alert: {
//       messages: [
//         "Important: Registration deadline extended until June 30, 2024",
//         "Scholarship applications now open for meritorious students",
//         "Campus tour dates announced - Register now!"
//       ],
//       icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
//       showNewBadge: true
//     },
//     cards: {
//       information: {
//         title: "Information",
//         link: {
//           text: "Download Brochure & Details",
//           url: "https://avantika.edu.in/information"
//         },
//         icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
//         showNewBadge: true
//       },
//       application: {
//         title: "Application",
//         link: {
//           text: "Start Your Application",
//           url: "https://avantika.edu.in/apply"
//         },
//         showNewBadge: true
//       },
//       latestNews: {
//         title: "Latest News",
//         content: [
//           "Admission process starts from July 1st",
//           "New Design Thinking workshop announced",
//           "Industry experts to conduct masterclasses"
//         ],
//         showNewBadge: true
//       }
//     }
//   },
//   'default': {
//     name: 'Default Institute',
//     examInfo: {
//       title: "ENTRANCE EXAMINATION - 2024",
//       subtitle: "GENERAL ENTRANCE EXAMINATION - 2024",
//       description: "Institute entrance examination for various programs for the Academic Year 2024-25"
//     },
//     alert: {
//       messages: [
//         "Registration open for 2024 admissions"
//       ],
//       icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z",
//       showNewBadge: false
//     },
//     cards: {
//       information: {
//         title: "Information",
//         link: {
//           text: "Institute information",
//           url: "https://example.com/information"
//         },
//         icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
//         showNewBadge: false
//       },
//       application: {
//         title: "Application",
//         link: {
//           text: "Apply Online",
//           url: "https://example.com/apply"
//         },
//         showNewBadge: false
//       },
//       latestNews: {
//         title: "Latest News",
//         content: ["Admissions open", "New programs announced"],
//         showNewBadge: false
//       }
//     }
//   }
// };

// const Home = () => {
//   const { institute_id } = useParams();

//   // Get institute data based on institute_id, fallback to default if not found
//   const institute = instituteData[institute_id] || instituteData['default'];
//   const { examInfo, alert, cards } = institute;

//   // New Badge Component with fixed background color
//   const NewBadge = ({ className = "", size = "default" }) => {
//     const textSize = size === "small" ? "text-[8px]" : "text-[10px]";
//     const padding = size === "small" ? "px-1 py-0.5" : "px-1.5 py-0.5";
//     const dotSize = size === "small" ? "h-[4px] w-[4px]" : "h-[6px] w-[6px]";

//     return (
//       <sup className={`ml-1 ${className}`}>
//         <span className={`animate-pulse inline-flex items-center bg-gradient-to-r from-[#dc2626] to-[#ea580c] text-white ${textSize} leading-none font-bold ${padding} rounded-full shadow-sm`}>
//           <span className="mr-[2px]">NEW</span>
//           <span className={`relative flex ${dotSize}`}>
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
//             <span className={`relative inline-flex rounded-full ${dotSize} bg-white`}></span>
//           </span>
//         </span>
//       </sup>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <Header instituteName={institute.name} />

//       {/* Main Content Section */}
//       <div className="container mx-auto px-4 py-8">

//         {/* Exam Information Section */}
//         <div className="relative p-8 mb-8 text-center bg-white rounded-2xl shadow-xl border border-gray-200">
//           <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
//             <div className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
//               ENTRANCE EXAM 2024
//             </div>
//           </div>

//           <div className="text-center mb-6 mt-4">
//             <h4 className="text-3xl font-bold text-[#1e40af] mb-2">
//               {examInfo.title}
//             </h4>
//             <div className="w-24 h-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] mx-auto rounded-full"></div>
//           </div>

//           <div className="mb-6">
//             <div className="mb-4">
//               <h2 className="text-xl font-bold text-white bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-6 py-3 rounded-xl shadow-lg inline-flex items-center transform hover:scale-105 transition-transform duration-200">
//                 {examInfo.subtitle}
//                 {alert.showNewBadge && <NewBadge className="ml-2" />}
//               </h2>
//             </div>
//             <div className="text-gray-700 leading-relaxed text-lg max-w-4xl mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
//               {examInfo.description}
//             </div>
//           </div>

//           {/* Alert Marquee */}
//           <div className="bg-gradient-to-r from-[#d97706]/20 to-[#ea580c]/20 border border-[#d97706] rounded-xl p-4 mb-2 overflow-hidden shadow-inner">
//             <marquee behavior="scroll" direction="left" scrollamount="5">
//               {alert.messages.map((message, index) => (
//                 <span key={index} className="inline-flex items-center bg-white text-[#dc2626] text-base font-semibold px-6 py-2 rounded-full shadow-md mx-4 border border-[#dc2626] whitespace-nowrap">
//                   <svg className="w-5 h-5 mr-3 text-[#ea580c]" fill="currentColor" viewBox="0 0 20 20">
//                     <path fillRule="evenodd" d={alert.icon} clipRule="evenodd" />
//                   </svg>
//                   {message}
//                   {alert.showNewBadge && <NewBadge size="small" />}
//                 </span>
//               ))}
//             </marquee>
//           </div>
//         </div>

//         {/* Cards Grid */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
//           {/* Information Box - Blue Theme */}
//           <div className="group relative">
//             <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
//             <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#0369a1]"></div>
//               <div className="p-6 border-b border-gray-100 relative">
//                 <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//                   </svg>
//                   {cards.information.title}
//                   {cards.information.showNewBadge && <NewBadge className="ml-2" />}
//                 </h4>
//               </div>
//               <div className="p-6 flex-grow flex items-center bg-gray-50 rounded-b-2xl">
//                 <div className="flex items-center bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 hover:shadow-md transition-shadow duration-200">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#1e40af] mr-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={cards.information.icon} />
//                   </svg>
//                   <a href={cards.information.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-[#1e40af] hover:text-[#dc2626] transition-colors duration-200 inline-flex items-center text-lg">
//                     {cards.information.link.text}
//                     {cards.information.showNewBadge && <NewBadge size="small" className="ml-2" />}
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Application Box - Red/Orange Theme */}
//           <div className="group relative">
//             <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-[#ea580c] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
//             <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#dc2626] to-[#ea580c]"></div>
//               <div className="p-6 border-b border-gray-100 relative">
//                 <h4 className="text-center text-xl font-bold text-[#dc2626] inline-flex items-center justify-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
//                   </svg>
//                   {cards.application.title}
//                   {cards.application.showNewBadge && <NewBadge className="ml-2" />}
//                 </h4>
//               </div>
//               <div className="p-6 flex-grow flex items-center bg-gray-50 rounded-b-2xl">
//                 <div className="flex items-center justify-center bg-white rounded-xl p-6 w-full shadow-inner border border-gray-200 hover:shadow-md transition-shadow duration-200">
//                   <a href={cards.application.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-white hover:text-white transition-colors duration-200 inline-flex items-center text-lg bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-6 py-3 rounded-full shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200">
//                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
//                     </svg>
//                     {cards.application.link.text}
//                     {cards.application.showNewBadge && <NewBadge size="small" className="ml-2" />}
//                   </a>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Latest News Box - Green Theme */}
//           <div className="group relative">
//             <div className="absolute -inset-1 bg-gradient-to-r from-[#059669] to-[#d97706] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
//             <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
//               <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#059669] to-[#d97706]"></div>
//               <div className="p-6 border-b border-gray-100 relative">
//                 <h4 className="text-center text-xl font-bold text-[#059669] inline-flex items-center justify-center">
//                   <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                     <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
//                   </svg>
//                   {cards.latestNews.title}
//                   {cards.latestNews.showNewBadge && <NewBadge className="ml-2" />}
//                 </h4>
//               </div>
//               <div className="p-6 flex-grow bg-gray-50 rounded-b-2xl">
//                 <div className="bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 h-48 overflow-y-auto hover:shadow-md transition-shadow duration-200">
//                   {cards.latestNews.content && cards.latestNews.content.length > 0 ? (
//                     <div className="space-y-3">
//                       {cards.latestNews.content.map((news, index) => (
//                         <div key={index} className="p-3 border-l-4 border-[#059669] bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all duration-200">
//                           <p className="text-gray-700 inline-flex items-center text-sm">
//                             <span className="w-2 h-2 bg-[#ea580c] rounded-full mr-3"></span>
//                             {news}
//                             {cards.latestNews.showNewBadge && index === 0 && <NewBadge size="small" className="ml-2" />}
//                           </p>
//                         </div>
//                       ))}
//                     </div>
//                   ) : (
//                     <p className="text-gray-500 text-center py-8">No news available</p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// };

// export default Home;