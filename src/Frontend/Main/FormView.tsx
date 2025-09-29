import React, { useState, useEffect } from 'react';
import Header from '../Common/Header';
import { Link } from 'react-router';

const FormView = () => {
    const [formData, setFormData] = useState(null);

    // Sample JSON data (आपके actual data से replace करें)
    const sampleData = {
        examTitle: "FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024",
        formType: "Online Application Form",
        currentStep: 2,
        totalSteps: 3,
        steps: ["FILL APPLICATION", "CONFIRM & PAY", "Invoice"],

        streamDetails: {
            stream: "BSC CS",
            favouriteSubject: "maths"
        },

        candidateDetails: {
            name: "hardik",
            gender: "Female",
            fatherName: "Mukesh",
            motherName: "Mamta",
            dob: "1913-02-14",
            state: "Chhattisgarh",
            district: "Durg",
            idMark1: "mole on right hand's thumb",
            idMark2: "mole on right hand's forearm",
            aadhaar: "124578963657",
            newInput1: "sa"
        },

        addressDetails: {
            doorNo: "7522",
            streetArea: "824",
            state: "Karnataka",
            district: "Chitradurga",
            cityTown: "Ohio",
            pincode: "7894587",
            mobile: "7440498598",
            email: "mchawdap97@gmail.com"
        },

        studyDetails: {
            class6: { state: "Chhattisgarh", district: "Balod" },
            class7: { state: "Andhra Pradesh", district: "Anantapur" },
            class8: { state: "Andhra Pradesh", district: "Anantapur" },
            class9: { state: "Andhra Pradesh", district: "Anatapur" },
            class10: { state: "Andhra Pradesh", district: "Anantapur" },
            inter1st: { state: "Andhra Pradesh", district: "Anantapur" },
            inter2nd: { state: "Andhra Pradesh", district: "Anantapur" }
        },

        qualifyingExam: {
            intermediate: {
                board: "Central Board of Secondary Education (CBSE)",
                year: "2027",
                hallTicket: "4512"
            },
            tenth: {
                board: "Other State Boards3",
                year: "2013",
                hallTicket: "54231"
            }
        },

        casteDetails: {
            category: "GEN",
            localArea: "Other State",
            specialCategory: "ABC+",
            annualIncome: "Below 1.5 Lakh"
        },

        payableAmount: "1060"
    };

    useEffect(() => {
        // यहाँ आप API call करके actual data fetch कर सकते हैं
        setFormData(sampleData);
    }, []);

    if (!formData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-xl font-semibold text-gray-600">Loading...</div>
            </div>
        );
    }

    // Step Indicator Component
    const StepIndicator = ({ steps, currentStep }) => {
        return (
            <div className="flex items-center justify-center mb-8">
                {steps.map((step, index) => (
                    <React.Fragment key={index}>
                        <div className={`flex flex-col items-center ${index < currentStep ? 'text-green-600' : index === currentStep ? 'text-blue-600' : 'text-gray-400'}`}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${index < currentStep ? 'bg-green-500 border-green-500 text-white' :
                                    index === currentStep ? 'bg-blue-500 border-blue-500 text-white' :
                                        'border-gray-300 bg-white'
                                }`}>
                                {index < currentStep ? (
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <span className="font-semibold">{index + 1}</span>
                                )}
                            </div>
                            <span className="text-xs mt-2 font-medium">{step}</span>
                        </div>

                        {index < steps.length - 1 && (
                            <div className={`w-20 h-1 mx-2 ${index < currentStep ? 'bg-green-500' : 'bg-gray-300'
                                }`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        );
    };

    // Section Header Component
    const SectionHeader = ({ title, icon }) => (
        <div className="text-center mb-6">
            <h4 className="text-lg font-bold text-[#dc2626] inline-flex items-center">
                {icon}
                {title}
            </h4>
        </div>
    );

    // Table Display Component
    const TableDisplay = ({ data, columns }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
                <tbody>
                    {Object.entries(data).map(([key, value], index) => (
                        <tr key={key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 w-1/3">
                                {columns[key] || key.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                            </td>
                            <td className="px-4 py-3 text-gray-900 font-medium">
                                {typeof value === 'object' ? (
                                    <div className="space-y-1">
                                        {Object.entries(value).map(([subKey, subValue]) => (
                                            <div key={subKey} className="flex justify-between">
                                                <span className="text-gray-600 text-sm">{subKey}:</span>
                                                <span className="text-gray-900 font-medium">{subValue}</span>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    value || 'Not provided'
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Study Details Table Component
    const StudyDetailsTable = ({ studyDetails }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full">
                <thead>
                    <tr className="bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Class</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">State</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">District</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(studyDetails).map(([className, details], index) => (
                        <tr key={className} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                                {className.split(/(?=[A-Z])/).join(' ').toUpperCase()}
                            </td>
                            <td className="px-4 py-3 text-gray-900 border-r border-gray-200">{details.state}</td>
                            <td className="px-4 py-3 text-gray-900">{details.district}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    // Qualifying Exam Table Component
    const QualifyingExamTable = ({ qualifyingExam }) => (
        <div className="space-y-6">
            {/* Intermediate */}
            <div>
                <h5 className="font-semibold text-gray-800 mb-3">Intermediate / 10+2 / 3 year Diploma Education</h5>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Board Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Year of Passing/Appearing</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hall Ticket Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">{qualifyingExam.intermediate.board}</td>
                                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">{qualifyingExam.intermediate.year}</td>
                                <td className="px-4 py-3 text-gray-900">{qualifyingExam.intermediate.hallTicket}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 10th Class */}
            <div>
                <h5 className="font-semibold text-gray-800 mb-3">10th Class</h5>
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Board Name</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-r border-gray-200">Year of Passing/Appearing</th>
                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Hall Ticket Number</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="bg-gray-50">
                                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">{qualifyingExam.tenth.board}</td>
                                <td className="px-4 py-3 text-gray-900 border-r border-gray-200">{qualifyingExam.tenth.year}</td>
                                <td className="px-4 py-3 text-gray-900">{qualifyingExam.tenth.hallTicket}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ">
            <Header/>
            <div className="container mx-auto px-4 py-8">

                {/* Main Form Box */}
                <div className="group relative mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

                        {/* Form Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
                            <div className="text-center">
                                <h4 className="text-2xl font-bold text-[#1e40af] mb-2">
                                    {formData.examTitle}
                                </h4>
                                <h6 className="text-lg text-gray-600">
                                    {formData.formType}
                                </h6>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Step Indicator */}
                            <StepIndicator steps={formData.steps} currentStep={formData.currentStep} />

                            {/* Preview Form Content */}
                            <div className="preview_form bg-gray-50 rounded-2xl p-6">

                                {/* Stream Details */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Stream Details"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.664 1.319a1 1 0 01.672 0l8 3.2A1 1 0 0119 5.4v.6a1 1 0 01-1 1h-4a1 1 0 01-1-1V5.4L10 3.2 5 5.4V6a1 1 0 01-1 1H1a1 1 0 01-1-1v-.6a1 1 0 01.664-.881l8-3.2zM1 8a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1V8zm1 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H2a1 1 0 01-1-1v-1zm7-4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1V8zm1 4a1 1 0 011-1h4a1 1 0 011 1v1a1 1 0 01-1 1H9a1 1 0 01-1-1v-1z" />
                                            </svg>
                                        }
                                    />

                                    <TableDisplay
                                        data={formData.streamDetails}
                                        columns={{
                                            stream: "Stream applying for",
                                            favouriteSubject: "Favourite Subject"
                                        }}
                                    />
                                </div>

                                {/* Candidate Details */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Candidate Details"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                                            </svg>
                                        }
                                    />

                                    <TableDisplay
                                        data={formData.candidateDetails}
                                        columns={{
                                            name: "Name",
                                            gender: "Gender",
                                            fatherName: "Father Name",
                                            motherName: "Mother Name",
                                            dob: "Date Of Birth",
                                            state: "State",
                                            district: "District",
                                            idMark1: "Identification Mark 1",
                                            idMark2: "Identification Mark 2",
                                            aadhaar: "Aadhaar Number",
                                            newInput1: "New Input 1"
                                        }}
                                    />
                                </div>

                                {/* Image Upload Section */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Image Upload"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V8a2 2 0 00-2-2h-5L9 4H4zm7 5a1 1 0 11-2 0 1 1 0 012 0z" />
                                            </svg>
                                        }
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="text-center">
                                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
                                                <div className="mx-auto w-32 h-32 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                                    <span className="text-gray-400">Profile Photo</span>
                                                </div>
                                                <span className="text-sm text-gray-600">Click to upload profile photo</span>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300">
                                                <div className="mx-auto w-40 h-20 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
                                                    <span className="text-gray-400">Signature</span>
                                                </div>
                                                <span className="text-sm text-gray-600">Click to upload signature</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Address Details */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Address Details"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                                            </svg>
                                        }
                                    />

                                    <TableDisplay
                                        data={formData.addressDetails}
                                        columns={{
                                            doorNo: "Door No / Flat",
                                            streetArea: "Street / Area",
                                            state: "State",
                                            district: "District",
                                            cityTown: "City / Town",
                                            pincode: "Pincode",
                                            mobile: "Mobile Number",
                                            email: "Email ID"
                                        }}
                                    />
                                </div>

                                {/* Study Details */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Study Details"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                            </svg>
                                        }
                                    />

                                    <StudyDetailsTable studyDetails={formData.studyDetails} />
                                </div>

                                {/* Qualifying Examination */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Qualifying Examination"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                                            </svg>
                                        }
                                    />

                                    <QualifyingExamTable qualifyingExam={formData.qualifyingExam} />
                                </div>

                                {/* Caste Details */}
                                <div className="mb-8">
                                    <SectionHeader
                                        title="Caste Details"
                                        icon={
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                                            </svg>
                                        }
                                    />

                                    <TableDisplay
                                        data={formData.casteDetails}
                                        columns={{
                                            category: "Category (Caste)",
                                            localArea: "Local Area",
                                            specialCategory: "Special Category",
                                            annualIncome: "Annual Income of Parents"
                                        }}
                                    />
                                </div>

                                {/* Payable Amount */}
                                <div className="bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5 rounded-2xl p-6 mb-6">
                                    <h3 className="text-xl font-bold text-center text-[#1e40af] mb-4">Payable Amount Details</h3>
                                    <div className="bg-white rounded-xl p-6 shadow-sm">
                                        <table className="w-full">
                                            <thead>
                                                <tr className="border-b-2 border-gray-200">
                                                    <th className="text-left py-3 text-lg font-semibold text-gray-700">Total Payable Fee</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td className="py-4 text-2xl font-bold text-[#dc2626]">₹{formData.payableAmount}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-8">
                                <button className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Back
                                </button>

                                <div className="flex-1 max-w-xs mx-4">
                                    <button className="bg-gradient-to-r from-[#059669] to-[#d97706] text-white w-full py-3 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                                        Pay Now
                                    </button>
                                </div>

                                <Link to='/Confirmation' className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Next
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FormView;