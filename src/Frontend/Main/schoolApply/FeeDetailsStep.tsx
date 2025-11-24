import React from 'react';

interface FeeDetailsStepProps {
  classes: any[];
  transportation_fee: any[];
  transportation_setting: any;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
  errors: { [key: string]: string };
}

  const assetUrl = import.meta.env.VITE_ASSET_URL;

const FeeDetailsStep: React.FC<FeeDetailsStepProps> = ({
  classes,
  transportation_fee,
  transportation_setting,
  formData,
  fileData,
  accepted,
  onConditionChange,
  errors
}) => {
  const formatPrice = (amount: string | number) => {
    if (!amount || isNaN(Number(amount))) return amount;
    const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    const formattedAmount = numericAmount.toLocaleString('en-IN');
    return `₹ ${formattedAmount}`;
  };

  const getParentName = () => {
    return formData['father_name'] || formData['first_name'] || 'N/A';
  };

  return (
    <div className="fee-tables space-y-6">
      {/* Caution Deposit */}
      <div className="tbl_header flex justify-between items-center p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h6 className="text-lg font-bold text-gray-800">
          Caution Deposit (Refundable):
        </h6>
        <h6 className="text-lg font-bold text-blue-600">
          {formatPrice(transportation_setting)} /-
        </h6>
      </div>

      {/* Tuition Fee Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Class Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tuition Fee-I (June 24 to Sept 24)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tuition Fee-II (Oct 24 to Jan 25)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Tuition Fee-III (Feb 25 to May 25)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {classes?.map((classData, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {classData.class_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(classData.tution_fee_1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(classData.tution_fee_2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(classData.tution_fee_3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transportation Fee Section */}
      <div className="tbl_header p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h6 className="text-lg font-bold text-gray-800">
          TRANSPORTATION: OPTIONAL
        </h6>
        <p className="text-sm text-gray-600 mt-1">
          Available only on the routes operated by the school
        </p>
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                (June 24 to Sept 24)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                (Oct 24 to Jan 25)
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                (Feb 25 to May 25)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transportation_fee?.map((transportData, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {transportData.distance}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(transportData.fee1)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(transportData.fee2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {formatPrice(transportData.fee3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Parent Agreement Section */}
      <div className="disclaimer_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            I accept to pay the tuition fee as above.
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-800 mb-2">
            Parent Name: {getParentName()}
          </p>
          {fileData["candidate_signature"] && (
            <img
              src={fileData["candidate_signature"]}
              alt="Parent Signature"
              className="w-32 h-16 object-contain block mx-auto mb-2 border border-gray-300 rounded"
            />
          )}
          <p className="text-sm font-semibold text-gray-800">
            Parent Signature
          </p>
        </div>
      </div>

      {/* Agreement Checkbox */}
      {/* <div className="flex items-start space-x-3 mt-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="fee-checkbox"
          checked={accepted}
          onChange={(e) => onConditionChange('fee', e.target.checked)}
          className={`w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1 ${
                  errors["fee-checkbox"] ? 'border-red-500' : 'border-gray-300'
                }`}
        />
        <label htmlFor="fee-checkbox" className="text-sm text-gray-700">
          I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
        </label>
        {errors["fee-checkbox"] && (
              <p className="text-red-500 text-xs mt-1 ml-7">{"Please accept the terms and conditions."}</p>
            )}
      </div> */}

       <div className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-lg relative">
        <input
          type="checkbox"
          id="fee-checkbox"
          checked={accepted}
          onChange={(e) => onConditionChange('fee', e.target.checked)}
          className={`w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
            errors['fee'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />

        <label
          htmlFor="fee-checkbox"
          className={`text-sm leading-5 
      ${errors['fee'] ? 'text-red-500' : 'text-gray-700'}`}
        >
           I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
        </label>
      </div>

      {errors['fee'] && (
        <p className="text-red-500 text-xs mt-1 ml-8">Please accept the terms and conditions.</p>
      )}

      {/* Important Note */}
      {/* <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-sm text-red-700 font-semibold text-center">
          Tuition fee and Transport Fee once paid will not be refunded in any case
        </p>
      </div> */}
    </div>
  );
};

export default FeeDetailsStep;