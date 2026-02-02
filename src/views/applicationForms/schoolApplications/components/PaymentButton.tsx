import React, { useState } from 'react';
import { MdOutlinePayment } from 'react-icons/md';
import PaymentModal from './PaymentModal';


const PaymentButton = ({ application, fetchPaymentDetailsApi, processPaymentApi, onPaymentSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    setIsModalOpen(true);
  };

  const handlePaymentSuccess = (applicationId, result) => {
    if (onPaymentSuccess) {
      onPaymentSuccess(applicationId, result);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-lg text-sm bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-sm hover:shadow flex items-center gap-1"
      >
        <MdOutlinePayment className="w-4 h-4" />
        Pay Now
      </button>

      <PaymentModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        application={application}
        onPaymentSuccess={handlePaymentSuccess}
        fetchPaymentDetailsApi={fetchPaymentDetailsApi}
        processPaymentApi={processPaymentApi}
      />
    </>
  );
};

export default PaymentButton;