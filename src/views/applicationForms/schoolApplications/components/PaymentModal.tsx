import React, { useState, useEffect } from 'react';
import { MdOutlinePayment, MdClose, MdCheckCircle } from 'react-icons/md';
import { FiInfo } from 'react-icons/fi';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  application,
  onPaymentSuccess,
  fetchPaymentDetailsApi,
  processPaymentApi 
}) => {
  const [paymentData, setPaymentData] = useState({
    totalPayable: 0,
    discount: 0,
    finalAmount: 0,
    loading: false,
    error: null,
    success: false,
    transactionId: null
  });

  const [discountInput, setDiscountInput] = useState('');

  // Fetch payment details when modal opens
  useEffect(() => {
    if (isOpen && application) {
      fetchPaymentDetails();
    }
  }, [isOpen, application]);

  const fetchPaymentDetails = async () => {
    try {
      setPaymentData(prev => ({ ...prev, loading: true, error: null }));
      
      const details = await fetchPaymentDetailsApi(application.id);
      
      setPaymentData(prev => ({
        ...prev,
        totalPayable: details.total_payable_fee || 0,
        finalAmount: details.total_payable_fee || 0,
        loading: false
      }));
      
      setDiscountInput('');
    } catch (error) {
      setPaymentData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load payment details. Please try again.'
      }));
    }
  };

  const handleDiscountChange = (value) => {
    const discount = parseFloat(value) || 0;
    const maxDiscount = paymentData.totalPayable;
    const validDiscount = Math.min(Math.max(0, discount), maxDiscount);
    
    setDiscountInput(value);
    
    const finalAmount = Math.max(0, paymentData.totalPayable - validDiscount);
    
    setPaymentData(prev => ({
      ...prev,
      discount: validDiscount,
      finalAmount: finalAmount
    }));
  };

  const handlePayment = async () => {
    try {
      setPaymentData(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await processPaymentApi(
        application.id,
        paymentData.discount,
        paymentData.finalAmount
      );
      
      if (result.success) {
        setPaymentData(prev => ({
          ...prev,
          success: true,
          transactionId: result.transactionId,
          loading: false
        }));
        
        // Call success callback after 2 seconds
        setTimeout(() => {
          if (onPaymentSuccess) {
            onPaymentSuccess(application.id, result);
          }
          handleClose();
        }, 2000);
      } else {
        throw new Error(result.message || 'Payment failed');
      }
    } catch (error) {
      setPaymentData(prev => ({
        ...prev,
        loading: false,
        error: error.message
      }));
    }
  };

  const handleClose = () => {
    setPaymentData({
      totalPayable: 0,
      discount: 0,
      finalAmount: 0,
      loading: false,
      error: null,
      success: false,
      transactionId: null
    });
    setDiscountInput('');
    onClose();
  };

  if (!isOpen || !application) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-slideUp">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              {paymentData.success ? 'Payment Successful!' : 'Complete Payment'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Application ID: {application.id}
            </p>
          </div>
          {!paymentData.success && (
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              disabled={paymentData.loading}
            >
              <MdClose className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Success State */}
          {paymentData.success ? (
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <MdCheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h4 className="text-2xl font-bold text-green-700 mb-2">
                Payment Successful!
              </h4>
              <p className="text-gray-600 mb-4">
                Your payment of ₹{paymentData.finalAmount.toFixed(2)} has been processed.
              </p>
              {paymentData.transactionId && (
                <p className="text-sm text-gray-500">
                  Transaction ID: {paymentData.transactionId}
                </p>
              )}
            </div>
          ) : (
            <>
             
              {/* Error Message */}
              {paymentData.error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{paymentData.error}</p>
                </div>
              )}

              {/* Loading State */}
              {paymentData.loading && !paymentData.error ? (
                <div className="py-8 text-center">
                  <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Processing payment...</p>
                </div>
              ) : (
                <>
                  {/* Total Payable Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Total Payable Amount
                    </label>
                    <div className="p-4 bg-gray-50 rounded-lg border">
                      <span className="text-2xl font-bold text-gray-800">
                        ₹{paymentData.totalPayable.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* Discount Input */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Discount Amount (₹)
                      </label>
                      <span className="text-xs text-gray-500">
                        Max: ₹{paymentData.totalPayable.toFixed(2)}
                      </span>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max={paymentData.totalPayable}
                      step="0.01"
                      value={discountInput}
                      onChange={(e) => handleDiscountChange(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                      placeholder="Enter discount amount"
                      disabled={paymentData.loading}
                    />
                    
                    {/* Discount Help Text */}
                    {paymentData.discount > 0 && (
                      <div className="flex justify-between mt-2">
                        <span className="text-sm text-green-600">
                          Discount: ₹{paymentData.discount.toFixed(2)}
                        </span>
                        <span className="text-sm text-gray-500">
                          {((paymentData.discount / paymentData.totalPayable) * 100).toFixed(1)}% off
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Final Amount */}
                  <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-600 mb-1">Final Amount to Pay</p>
                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-green-700">
                        ₹{paymentData.finalAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </p>
                      {paymentData.discount > 0 && (
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                          Save ₹{paymentData.discount.toFixed(2)}
                        </span>
                      )}
                    </div>
                    {paymentData.discount > 0 && (
                      <p className="text-sm text-gray-500 mt-2">
                        Original: <span className="line-through">₹{paymentData.totalPayable.toFixed(2)}</span>
                      </p>
                    )}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        {!paymentData.success && (
          <div className="p-6 border-t bg-gray-50 rounded-b-xl">
            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
                disabled={paymentData.loading}
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={
                  paymentData.loading || 
                  paymentData.finalAmount <= 0 ||
                  paymentData.success
                }
                className="flex-1 py-3 px-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                {paymentData.loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <MdOutlinePayment className="w-5 h-5" />
                    Pay ₹{paymentData.finalAmount.toFixed(2)}
                  </>
                )}
              </button>
            </div>
            
            {/* Payment Note */}
            <p className="text-xs text-gray-500 text-center mt-4">
              By proceeding, you agree to the terms and conditions.
              {paymentData.finalAmount > 0 && (
                <span className="block mt-1">
                  Amount includes all applicable taxes.
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;