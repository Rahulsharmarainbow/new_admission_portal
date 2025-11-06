import React from 'react';

interface DeclarationStepProps {
  content: string;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
}

const DeclarationStep: React.FC<DeclarationStepProps> = ({
  content,
  formData,
  fileData,
  accepted,
  onConditionChange
}) => {
 const formatContent = (htmlContent: string | null | undefined) => {
  if (!htmlContent) return "";

  let formattedContent: string = htmlContent ?? "";

  const data = formData ?? {};

  Object.keys(data).forEach((key) => {
    const placeholder = `{${key}}`;
    const value = data[key] ? String(data[key]) : ""; // always string ✅

    formattedContent = formattedContent?.replace?.(
      new RegExp(placeholder, "g"),
      `<strong>${value}</strong>`
    ) ?? formattedContent;
  });

  formattedContent = formattedContent?.replace?.(/{[^}]*}/g, "") ?? formattedContent;

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
      
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatContent(content) 
        }} 
        className="prose max-w-none mb-6 text-gray-700 leading-relaxed"
      />
      
      <div className="declaration_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            Place: {formData['city'] || 'Hyderabad'}
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

      <div className="flex items-start space-x-3 mt-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="declaration-checkbox"
          checked={accepted}
          onChange={(e) => onConditionChange('declaration', e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
        />
        <label htmlFor="declaration-checkbox" className="text-sm text-gray-700">
          I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
        </label>
      </div>
    </div>
  );
};

export default DeclarationStep;