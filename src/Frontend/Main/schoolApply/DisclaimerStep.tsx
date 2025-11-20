import React from 'react';
import { Icon } from '@iconify/react';

interface DisclaimerStepProps {
  content: string;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
  directorSignature: string;
}

  const assetUrl = import.meta.env.VITE_ASSET_URL;

const DisclaimerStep: React.FC<DisclaimerStepProps> = ({
  content,
  formData,
  fileData,
  accepted,
  onConditionChange,
  directorSignature,
}) => {
// const formatContent = (htmlContent: string | null | undefined) => {
//   if (!htmlContent) return "";

//   let formattedContent: string = htmlContent ?? "";

//   const data = formData ?? {};

//   Object.keys(data).forEach((key) => {
//     const placeholder = `{${key}}`;
//     const value = data[key] ? String(data[key]) : ""; 

//     formattedContent = formattedContent?.replace?.(
//       new RegExp(placeholder, "g"),
//       `<strong>${value}</strong>`
//     ) ?? formattedContent;
//   });

//   formattedContent = formattedContent?.replace?.(/{[^}]*}/g, "") ?? formattedContent;

//   return formattedContent;
// };

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



  return (
    <div className="school_paragraph">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatContent(content, formData) 
        }} 
        className="prose max-w-none mb-6 text-gray-700 leading-relaxed text-sm"
      />
      
      <div className="disclaimer_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <div>
          {directorSignature && (
            <img
              src={assetUrl + '/' + directorSignature}
              alt="Signature Preview"
              className="w-48 h-20 object-contain block mx-auto mb-2 border border-gray-300 rounded"
            />
          )}
          <p className="text-sm font-semibold text-gray-800">
            Signature & Seal of School
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
          <p className="text-xs text-gray-600 mt-1">
            (Legal Guardian only if they have authority from the child's parent)
          </p>
        </div>
      </div>

      <div className="flex items-start space-x-3 mt-6 p-4 bg-gray-50 rounded-lg">
        <input
          type="checkbox"
          id="disclaimer-checkbox"
          checked={accepted}
          onChange={(e) => onConditionChange('disclaimer', e.target.checked)}
          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 mt-1"
        />
        <label htmlFor="disclaimer-checkbox" className="text-sm text-gray-700">
          I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
        </label>
      </div>
    </div>
  );
};

export default DisclaimerStep;