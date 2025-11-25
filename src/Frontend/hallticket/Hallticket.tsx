'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import Header from '../Common/Header';
import Footer from '../Common/Footer';
import { useParams } from 'react-router';

const apiUrl = import.meta.env.VITE_API_URL;

const HallTicket = (props) => {
  const [applicationNumber, setApplicationNumber] = useState('');
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [token, settoken] = useState('');
  const [step, setStep] = useState(1);
  const [hallTicketDetails, setHallTicketDetails] = useState([]);
  const [downloading, setDownloading] = useState(null);
  const [loading, setLoading] = useState(false);
  const [institute, setInstitute] = useState(null);
  let { institute_id } = useParams();

  if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; // use domain as fallback
  }

  useEffect(() => {
    fetchInstituteData();
  }, []);

  const fetchInstituteData = async () => {
    try {
      const response = await fetch(`${apiUrl}/Public/Get-header-footer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          unique_code: institute_id
        }),
      });

      const result = await response.json();
      if (result.success) {
        setInstitute(result);
      }
    } catch (error) {
      console.error('Error fetching institute data:', error);
    }
  };

  const handleDownload = async (ticketId) => {
    try {
      setDownloading(ticketId);

      const response = await fetch(`${apiUrl}/frontend/download-hall-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '/',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6'
        },
        body: JSON.stringify({
          hall_ticket_id: ticketId,
          unique_code: institute_id, // Using institute_id from params
          token: token
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to download PDF');
      }

      const data = await response.json();
      
      if (data.success && data.pdf) {
        const base64PDF = data.pdf;
        
        // Create a blob from base64
        const byteCharacters = atob(base64PDF);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        
        // Create download link
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${data.filename || 'hall-ticket'}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        toast.success('Hall ticket downloaded successfully!');
      } else {
        throw new Error('Download failed - no PDF data received');
      }

      setDownloading(null);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      toast.error('Failed to download PDF');
      setDownloading(null);
    }
  };

  const handleGoBack = () => {
    setStep(1);
    settoken("");
    setHallTicketDetails([]);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const data = {
      roll_no: applicationNumber,
      applicant_name: name,
      dob: dob
    };

    try {
      const response = await fetch(`${apiUrl}/frontend/check-hall-ticket`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'accept': '/',
          'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();
      console.log('API Response:', result); // For debugging
      
      if (result.status) {
        const ticketDetails = result.hall_ticket || [];
        setHallTicketDetails(Array.isArray(ticketDetails) ? ticketDetails : [ticketDetails]);
        settoken(result.token || '');
        setApplicationNumber('');
        setName('');
        setDob('');
        setStep(2);
        toast.success('Hall ticket details fetched successfully!');
      } else {
        toast.error(result.message || 'No hall ticket found');
        setHallTicketDetails([]);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!institute) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="MuiGrid-container client_main_page">
      <div className="">
        {/* Header Component */}
        <Header 
        baseUrl = {institute.baseUrl}
          institute_id={props.institute_id} 
          instituteName={institute.header?.name} 
          logo={institute.header?.logo} 
          address={institute.header?.address} 
          otherLogo={institute.header?.academic_new_logo}
        />
        
        <div className="flex flex-col justify-center items-center bg-clr">
          {step === 1 && (
            <div className="box-brdr w-full px-3">
              <div className="flex justify-center items-center">
                <div className="w-full md:w-2/5 bg-white p-6 shadow-lg rounded-lg border border-gray-200 my-10">
                  <div className="heading mb-8 text-center">
                    <h1 className="text-3xl font-bold mb-2">GENERATE HALL TICKET</h1>
                    <p className="text-gray-600">Enter your details below for Hall Ticket Download</p>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                      <label htmlFor="application-number" className="block text-sm font-medium text-gray-700 mb-1">
                        Application Number / Roll No *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <input
                          id="application-number"
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Your Application Number / Roll No"
                          value={applicationNumber}
                          onChange={(e) => setApplicationNumber(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-4">
                      <label htmlFor="applicant-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <input
                          id="applicant-name"
                          type="text"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mb-6">
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <input
                          id="dob"
                          type="date"
                          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          value={dob}
                          onChange={(e) => setDob(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : (
                          'Submit'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="box-brdr w-full px-3 my-10">
              <div className="flex justify-center items-center">
                <div className="w-full md:w-3/4 bg-white p-6 shadow-lg rounded-lg border border-gray-200 my-10">
                  <div className="heading mb-6 text-center">
                    <h1 className="text-3xl font-bold">Hall Ticket Details</h1>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Exam Name</th>
                          <th className="py-3 px-4 border-b text-left font-medium text-gray-700">Hall Ticket No</th>
                          <th className="py-3 px-4 border-b text-right font-medium text-gray-700">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {hallTicketDetails && hallTicketDetails.length > 0 ? (
                          hallTicketDetails.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-gray-50 border-b">
                              <td className="py-3 px-4">{ticket.exam_name || 'N/A'}</td>
                              <td className="py-3 px-4">{ticket.hall_ticket_no || 'N/A'}</td>
                              <td className="py-3 px-4 text-right">
                                <button
                                  onClick={() => handleDownload(ticket.id)}
                                  disabled={downloading === ticket.id}
                                  className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition duration-200"
                                >
                                  {downloading === ticket.id ? (
                                    <>
                                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Downloading
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                      </svg>
                                      Download PDF
                                    </>
                                  )}
                                </button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={3} className="py-4 px-4 text-center">
                              <h1 className="text-xl font-semibold text-gray-600">Hall tickets not available</h1>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-6 text-center">
                    <button
                      onClick={handleGoBack}
                      className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition duration-200"
                    >
                      Go Back
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Component */}
          <Footer footerData={institute.footer} baseUrl = {institute.baseUrl}/>
        </div>
      </div>
    </div>
  );
};

export default HallTicket;