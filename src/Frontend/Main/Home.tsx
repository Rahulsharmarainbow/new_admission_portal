import React, { useState, useEffect } from 'react';
import {Link, useParams } from 'react-router';
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
            url: data.buttons?.[0]?.href ||  (data.institute_id ? `/Frontend/${data.institute_id}/apply` : "#")
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
      {/* Custom Header with logo on left and name in center */}
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="bg-white shadow-md  container mx-auto px-4 py-1 rounded-b-2xl">
          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
            {institute.header?.logo && (
              <Link to={`/Frontend/${institute_id}/home`} reloadDocument>
                <img 
                  src={`${assetUrl}/${institute.header.logo}`} 
                  alt="Institute Logo" 
                  className="h-20 w-48 md:w-20 object-contain mr-3 cursor-pointer"
                />
              </Link>
            )}

            <div className="text-center">
              <h1 className="md:text-3xl xl:text-4xl font-bold text-gray-900 underline underline-offset-4 decoration-red-800 inline-block pb-1 uppercase">
                {institute.header?.name || 'Institute Name'}
              </h1>
              {institute.header?.address && (
                <p className="text-sm text-gray-600 mt-1">
                  {institute.header.address}
                </p>
              )}
              
            </div>
          </div>

        </div>
      </header>

      {/* Main Content Section */}
      <div className="bg-transparent mx-2 md:mx-8 py-8">

        {/* Exam Information Section */}
        <div className="relative p-8 mb-8 text-center bg-white rounded-2xl shadow-xl border border-gray-200">
          {/* <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
              ENTRANCE EXAM 2024
            </div>
          </div> */}

          <div className="text-center mb-6 mt-4">
           <h4 className="text-xl md:text-3xl font-bold text-[#1e40af] mb-2">
              {examInfo.title}
            </h4>
            <div className="w-24 h-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] mx-auto rounded-full"></div>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-xl font-bold text-white bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-6 py-3 rounded-xl shadow-lg inline-flex items-center transform hover:scale-105 transition-transform duration-200">
                {examInfo.subtitle}
                {/* {alert.showNewBadge && <NewBadge className="ml-2" />} */}
              </h2>
            </div>
            <div className="text-gray-700 leading-relaxed text-base max-w-7xl mx-auto bg-gray-50 p-6 rounded-xl border border-gray-200">
              {examInfo.description}
            </div>
          </div>

        {institute.marquee && institute.marquee.length > 0 && (
  <div className="bg-gradient-to-r from-[#d97706]/20 to-[#ea580c]/20 border border-[#d97706] rounded-xl p-4 mb-2 overflow-hidden shadow-inner">
    <marquee behavior="scroll" direction="left" scrollamount="5">
      {institute.marquee.map((message, index) => (
        <span
          key={index}
          className="inline-flex items-center bg-white text-[#dc2626] text-base font-semibold px-6 py-2 rounded-full shadow-md mx-4 border border-[#dc2626] whitespace-nowrap"
        >
          <svg
            className="w-5 h-5 mr-3 text-[#ea580c]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16z"
              clipRule="evenodd"
            />
          </svg>

          {/* ✅ Show marquee text */}
          {message.text}

          {/* ✅ Show “new” badge if needed */}
          {message.new === 1 && <NewBadge size="small" className="ml-2" />}

          {/* ✅ Clickable if URL is provided */}
          {message.url && (
            <a
              href={message.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-4 text-[#1e40af] underline hover:text-[#dc2626]"
            >
              Visit
            </a>
          )}
        </span>
      ))}
    </marquee>
  </div>
)}

        </div>
 

 <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
  {/* 🧾 Information / Notifications */}
  <div className="group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#0369a1] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#0369a1]"></div>
      <div className="p-6 border-b border-gray-100 relative">
        <h4 className="text-center text-xl font-bold text-[#1e40af] inline-flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Notifications
          {/* {institute.notification?.length > 0 && <NewBadge className="ml-2" />} */}
        </h4>
      </div>

      <div className="p-6 flex-grow bg-gray-50 rounded-b-2xl">
        <div className="bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 h-48 overflow-y-auto hover:shadow-md transition-shadow duration-200">
          {institute.notification && institute.notification.length > 0 ? (
            <ul className="space-y-3">
              {institute.notification && institute.notification.length > 0 ? (
                institute.notification.map((note, index) => (
                  <li
                    key={index}
                    className="flex items-center text-sm text-gray-700 hover:bg-gray-50 p-2 rounded-lg transition-all duration-200"
                  >
                    <span className="relative w-2 h-2 bg-[#1e40af] rounded-full mr-3"></span>

                    {note.url ? (
                      <a
                        href={note.url.startsWith("http") ? note.url : `/Frontend/${institute_id}/${note.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-[#1e40af] font-medium transition-colors duration-200"
                      >
                        {note.text || "Untitled Notification"}
                      </a>
                    ) : (
                      <span>{note.text || "Untitled Notification"}</span>
                    )}

                    {note.new === 1 && <NewBadge className="ml-2" />}
                  </li>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">No notifications available</p>
              )}
            </ul>

          ) : (
            <p className="text-gray-500 text-center py-8">No notifications available</p>
          )}
        </div>
      </div>
    </div>
  </div>

  {/* 📝 Applications */}
  <div className="group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-[#dc2626] to-[#ea580c] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#dc2626] to-[#ea580c]"></div>
      <div className="p-6 border-b border-gray-100 relative">
        <h4 className="text-center text-xl font-bold text-[#dc2626] inline-flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
          </svg>
          Applications
          {/* {institute.buttons?.length > 0 && <NewBadge className="ml-2" />} */}
        </h4>
      </div>

      <div className="p-6 flex-grow flex items-center bg-gray-50 rounded-b-2xl">
  <div className="flex flex-col gap-3 w-full">
    {institute.buttons && institute.buttons.length > 0 ? (
      institute.buttons.map((btn, index) => (
        <a
          key={index}
          href={btn.url?.startsWith("http") ? btn.url : `/Frontend/${institute_id}/${btn.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="font-bold text-white text-sm sm:text-base bg-gradient-to-r from-[#dc2626] to-[#ea580c] px-4 py-3 rounded-full text-center shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 flex justify-center items-center gap-2"
        >
          {btn.text || "Open"}
          {btn.new === 1 && <NewBadge className="ml-2" />}
        </a>
      ))
    ) : (
      <p className="text-gray-500 text-center py-8">No applications available</p>
    )}
  </div>
</div>

    </div>
  </div>

  {/* 📰 Latest News */}
  <div className="group relative">
    <div className="absolute -inset-1 bg-gradient-to-r from-[#059669] to-[#d97706] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 flex flex-col h-full transform group-hover:scale-105 transition-transform duration-300 overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#059669] to-[#d97706]"></div>
      <div className="p-6 border-b border-gray-100 relative">
        <h4 className="text-center text-xl font-bold text-[#059669] inline-flex items-center justify-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
          </svg>
          Latest News
          {/* {institute.news?.length > 0 && <NewBadge className="ml-2" />} */}
        </h4>
      </div>

     <div className="p-6 flex-grow bg-gray-50 rounded-b-2xl">
  <div className="bg-white rounded-xl p-4 w-full shadow-inner border border-gray-200 h-48 overflow-y-auto hover:shadow-md transition-shadow duration-200">
    {institute.news && institute.news.length > 0 ? (
      <div className="space-y-3">
        {institute.news.map((news, index) => (
          <div
            key={index}
            className="p-3 border-l-4 border-[#059669] bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-all duration-200"
          >
            <p className="text-gray-700 inline-flex items-center text-sm">
              <span className="w-2 h-2 bg-[#ea580c] rounded-full mr-3"></span>
              {news.url ? (
                <a
                  href={news.url.startsWith("http") ? news.url : `/Frontend/${institute_id}/${news.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#059669] font-medium transition-colors duration-200"
                >
                  {news.text || "Untitled News"}
                </a>
              ) : (
                news.text || "Untitled News"
              )}
              {news.new === 1 && <NewBadge className="ml-2" />}
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