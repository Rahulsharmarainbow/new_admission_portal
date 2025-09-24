import React from 'react';
import { useParams } from 'react-router';
import Header from '../Common/Header';
import Footer from '../Common/Footer';

// Sample data for different institutes (you can expand this later)
const instituteData = {
  'avantika': {
    name: 'Avantika University',
    examInfo: {
      title: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
      subtitle: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
      description: "Avantika University Ujjain is conducting Fine Arts and Design Entrance Examination (FADEE) for admission into four year BFA and B. Design Programs offered in Constituent Colleges for the Academic Year 2024-25"
    },
    alert: {
      messages: [
        "Important: Registration deadline extended until June 30, 2024"
      ],
      icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
    },
    cards: {
      information: {
        title: "Information",
        link: {
          text: "new information",
          url: "https://avantika.edu.in/information"
        },
        icon: "M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z M10 16h6 M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M4 8h3 M4 12h3 M4 16h3"
      },
      application: {
        title: "Application",
        link: {
          text: "Online Application",
          url: "https://avantika.edu.in/apply"
        }
      },
      latestNews: {
        title: "Latest News",
        content: ["Admission process starts from July 1st", "Campus tour scheduled for June 25th"]
      }
    }
  },
  'default': {
    name: 'Default Institute',
    examInfo: {
      title: "ENTRANCE EXAMINATION - 2024",
      subtitle: "GENERAL ENTRANCE EXAMINATION - 2024",
      description: "Institute entrance examination for various programs for the Academic Year 2024-25"
    },
    alert: {
      messages: [
        "Registration open for 2024 admissions"
      ],
      icon: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
    },
    cards: {
      information: {
        title: "Information",
        link: {
          text: "Institute information",
          url: "https://example.com/information"
        },
        icon: "M20 6v12a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2z M10 16h6 M13 11m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0 M4 8h3 M4 12h3 M4 16h3"
      },
      application: {
        title: "Application",
        link: {
          text: "Apply Online",
          url: "https://example.com/apply"
        }
      },
      latestNews: {
        title: "Latest News",
        content: ["Admissions open", "New programs announced"]
      }
    }
  }
};

const Home = () => {
  const { institute_id } = useParams();
  
  // Get institute data based on institute_id, fallback to default if not found
  const institute = instituteData[institute_id] || instituteData['default'];
  const { examInfo, alert, cards } = institute;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header instituteName={institute.name} />

      {/* Main Content Section */}
      <div className="container mx-auto px-4 py-8">
        {/* Institute ID Display */}
        <div className="text-center mb-4">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            Institute ID: {institute_id}
          </span>
        </div>

        {/* Exam Information Section */}
        <div className="p-6 mb-8 text-center">
          <div className="text-center mb-6">
            <h4 className="text-2xl font-bold text-gray-800">
              {examInfo.title}
            </h4>
          </div>

          <div className="mb-6">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-red-800 bg-gray-200 px-4 py-2 rounded">
                {examInfo.subtitle}
              </h2>
            </div>
            <div className="text-gray-700 leading-relaxed">
              {examInfo.description}
            </div>
          </div>

          {/* Alert Marquee */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mb-6 overflow-hidden">
            <marquee behavior="scroll" direction="left" scrollamount="6" className="flex items-center space-x-8">
              {alert.messages.map((message, index) => (
                <span key={index} className="flex items-center text-red-700 text-base font-semibold bg-white px-4 py-2 rounded-full shadow-sm mx-4">
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d={alert.icon} clipRule="evenodd" />
                  </svg>
                  {message}
                </span>
              ))}
            </marquee>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Information Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-center text-lg font-semibold text-gray-800">{cards.information.title}</h4>
            </div>
            <div className="p-4 flex-grow flex items-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600 mr-3">
                  <path d={cards.information.icon}></path>
                </svg>
                <a href={cards.information.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-800">
                  {cards.information.link.text}
                </a>
              </div>
            </div>
          </div>

          {/* Application Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-center text-lg font-semibold text-gray-800">{cards.application.title}</h4>
            </div>
            <div className="p-4 flex-grow flex items-center">
              <div className="flex items-center bg-gray-100 rounded-lg p-3 w-full">
                <a href={cards.application.link.url} target="_blank" rel="noopener noreferrer" className="font-bold text-blue-600 hover:text-blue-800">
                  {cards.application.link.text}
                </a>
              </div>
            </div>
          </div>

          {/* Latest News Box */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex flex-col h-full">
            <div className="p-4 border-b border-gray-200">
              <h4 className="text-center text-lg font-semibold text-gray-800">{cards.latestNews.title}</h4>
            </div>
            <div className="p-4 flex-grow">
              <div className="h-32 overflow-y-auto">
                {cards.latestNews.content && cards.latestNews.content.length > 0 ? (
                  cards.latestNews.content.map((news, index) => (
                    <div key={index} className="p-2 border-b border-gray-100">
                      <p className="text-gray-700">{news}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No news available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Home;