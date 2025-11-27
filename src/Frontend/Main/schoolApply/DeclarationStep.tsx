import React from 'react';

interface DeclarationStepProps {
  content: string;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
  directorSignature: string
  errors: { [key: string]: string }
}

  const assetUrl = import.meta.env.VITE_ASSET_URL;

const DeclarationStep: React.FC<DeclarationStepProps> = ({
  content,
  formData,
  fileData,
  accepted,
  onConditionChange,
  directorSignature,
  errors
}) => {

const formatContent = (htmlContent: string | null | undefined, formData: any) => {
  if (!htmlContent) return "";

  let formattedContent: string = htmlContent;
  const data = formData ?? {};

  // Replace placeholders with formData values
  Object.keys(data).forEach((key) => {
    const placeholder = `{${key}}`;
    let value = data[key] ? String(data[key]) : "";

    // Special condition for "class"
    if (key === "class" && value.includes("$")) {
      value = value.split("$")[1] ?? "";
    }

    formattedContent = formattedContent.replace(
      new RegExp(placeholder, "g"),
      `<strong>${value}</strong>`
    );
  });

  // Remove all placeholders not found in formData
  formattedContent = formattedContent.replace(/\{[^}]+\}/g, "");

  return formattedContent;
};



  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
  };

  const getParentName = () => {
    return [
      formData['first_name'],
      formData['middle_name'], 
      formData['last_name']
    ].filter(Boolean).join(' ');
  };

  return (
    <div className="school_paragraph">
      <h6 className="text-center mb-4 text-gray-700 font-semibold">
        (Please read carefully before signing)
      </h6>
      
      {/* <div 
  dangerouslySetInnerHTML={{ 
    __html: formatContent(content, formData) 
  }} 
  className="max-w-none mb-6 text-gray-700 leading-relaxed text-[15px] font-sans"
  style={{
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    lineHeight: '1.6',
    fontWeight: '400'
  }}
/> */}

  <div
      className="formatted-content max-w-none mb-6 text-gray-700 leading-relaxed text-[15px] font-sans"
      style={{ lineHeight: '1.6', fontWeight: '400' }}
      dangerouslySetInnerHTML={{ __html: formatContent(content, formData) }}
      />
      
      <div className="declaration_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Place: {formData['address_street'] || 'Hyderabad'}
          </p>
          <p className="text-sm font-semibold text-gray-800 mt-2">
            Date: {getCurrentDate()}
          </p>
        </div>
        
        <div className="text-center">
          {fileData["candidate_signature"] && (
            <img
              src={fileData["candidate_signature"]}
              alt="Signature Preview"
              className="w-48 h-20 object-contain block mx-auto mb-2 border border-gray-300 rounded"
            />
          )}
          <p className="text-sm font-semibold text-gray-800">
            Signature of Parent or Legal Guardian
          </p>
          <p className="text-xs text-gray-600 block mt-1">
            (Legal Guardian only if they have authority from the child's parent)
          </p>
          <p className="text-sm text-gray-800 mt-2">
            Name: <strong>{getParentName()}</strong>
          </p>
        </div>
      </div>

       <div className="flex items-start gap-3 mt-6 p-4 bg-gray-50 rounded-lg relative">
        <input
          type="checkbox"
          id="declaration-checkbox"
          checked={accepted}
          onChange={(e) => onConditionChange('declaration', e.target.checked)}
          className={`w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
            errors['declaration-checkbox'] ? 'border-red-500' : 'border-gray-300'
          }`}
        />

        <label
          htmlFor="disclaimer-checkbox"
          className={`text-sm leading-5 
      ${errors['declaration'] ? 'text-red-500' : 'text-gray-700'}`}
        >
          I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
        </label>
      </div>

      {errors['declaration'] && (
        <p className="text-red-500 text-xs mt-1 ml-8">Please accept the terms and conditions.</p>
      )}
    </div>
  );
};

export default DeclarationStep;