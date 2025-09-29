import React from 'react';
import Header from '../Common/Header';

const Confirmation = () => {
    const paymentDetails = {
        applicationId: "2024000004",
        transactionId: "pay_RMbSJxpVqg0iIa",
        amount: "1060",
        date: "27-09-25 04:35:45 PM",
        status: "Captured"
    };

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
            <Header />
            <div className="container mx-auto px-4 py-8">

                {/* Main Confirmation Box */}
                <div className="group relative mb-8">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#1e40af] to-[#dc2626] rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-300"></div>
                    <div className="relative bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#1e40af] to-[#dc2626]"></div>

                        {/* Form Header */}
                        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-[#1e40af]/5 to-[#dc2626]/5">
                            <div className="text-center">
                                <h4 className="text-2xl font-bold text-[#1e40af] mb-2">
                                    FINE ARTS AND DESIGN ENTRANCE EXAMINATION - 2024
                                </h4>
                                <h6 className="text-lg text-gray-600">
                                    Online Application Form
                                </h6>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Step Indicator */}
                            <StepIndicator
                                steps={["FILL APPLICATION", "CONFIRM & PAY", "Invoice"]}
                                currentStep={3}
                            />

                            {/* Confirmation Content */}
                            <div className="bg-gray-50 rounded-2xl p-6">

                                {/* Success Message */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <h5 className="text-xl font-bold text-gray-900 mb-2">Thank you for your payment!</h5>
                                    <p className="text-gray-600">Your transaction was successful!</p>
                                </div>

                                {/* Description */}
                                <p className="text-gray-700 text-center mb-6">
                                    Thank you for your payment! Below are the details of your transaction. If you have any questions, feel free to contact our support team.
                                </p>

                                <hr className="border-gray-200 my-6" />

                                {/* Payment Details */}
                                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
                                    <table className="w-full">
                                        <tbody>
                                            <tr className="bg-gray-50">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200 w-1/3">
                                                    Application ID:
                                                </td>
                                                <td className="px-6 py-3 text-gray-900 font-medium">
                                                    {paymentDetails.applicationId}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Transaction ID:
                                                </td>
                                                <td className="px-6 py-3 text-gray-900 font-medium">
                                                    {paymentDetails.transactionId}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Amount:
                                                </td>
                                                <td className="px-6 py-3 text-gray-900 font-medium">
                                                    INR {paymentDetails.amount}
                                                </td>
                                            </tr>
                                            <tr className="bg-white">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Date:
                                                </td>
                                                <td className="px-6 py-3 text-gray-900 font-medium">
                                                    {paymentDetails.date}
                                                </td>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <td className="px-6 py-3 text-sm font-semibold text-gray-700 border-r border-gray-200">
                                                    Status:
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        {paymentDetails.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <hr className="border-gray-200 my-6" />

                                {/* Final Message */}
                                <p className="text-gray-600 text-center text-sm mb-6">
                                    We truly appreciate your business. Should you need further assistance, don't hesitate to get in touch.
                                </p>

                                {/* Download Button */}
                                <div className="text-center">
                                    <button className="bg-gradient-to-r from-[#059669] to-[#d97706] text-white px-8 py-3 rounded-full font-semibold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 inline-flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        Download Application
                                    </button>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between items-center mt-8">
                                <button className="bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Back
                                </button>

                                <div className="flex-1 max-w-xs mx-4">
                                    <button className="bg-gradient-to-r from-[#1e40af] to-[#0369a1] text-white w-full py-3 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-200">
                                        Go to Dashboard
                                    </button>
                                </div>

                                <button className="bg-gradient-to-r from-[#059669] to-[#d97706] text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    Print Receipt
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Confirmation;