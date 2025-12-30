import React from 'react';
import { Icon } from '@iconify/react';


interface DisclaimerStepProps {
  content: string;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
  directorSignature: string;
  errors: { [key: string]: string };
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

const DisclaimerStep: React.FC<DisclaimerStepProps> = ({
  content,
  formData,
  fileData,
  accepted,
  onConditionChange,
  directorSignature,
  errors,
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

  const formatContent = (
  htmlContent: string | null | undefined,
  formData: any
) => {
  if (!htmlContent) return "";

  let formattedContent: string = htmlContent;
  const data = formData ?? {};
  const lookupMap: any = {};

  // Build lookup map
  Object.keys(data).forEach((key) => {
    const originalValue = data[key];
    const normalized = key.replace(/^s[_]?/i, "").toLowerCase();

    lookupMap[key.toLowerCase()] = originalValue;
    lookupMap[normalized] = originalValue;
    lookupMap[key.toLowerCase().replace(/_/g, "")] = originalValue;
    lookupMap[normalized.replace(/_/g, "")] = originalValue;
  });

  // --------------------------------------------------
  // Replace all placeholders EXCEPT {relation_name}
  // --------------------------------------------------
  formattedContent = formattedContent.replace(/\{([^}]+)\}/g, (match, p1) => {
    if (p1.toLowerCase() === "relation_name") {
      return match; // ⛔ DO NOT replace here — skip
    }

    const cleanKey = p1.toLowerCase().replace(/^s[_]?/i, "").replace(/_/g, "");
    let value = lookupMap[cleanKey] ? String(lookupMap[cleanKey]) : "";

    if (p1.toLowerCase() === "class" && value.includes("$")) {
      value = value.split("$")[1] ?? "";
    }

    return value;
  });

  // -------------------------------------------------------
  // Special Handler for {relation_name}
  // -------------------------------------------------------
  if (formattedContent.includes("{relation_name}")) {
    const rel = (data.s_relationship || "").toLowerCase();

    let relationKey = rel + "_name";
    let relationValue = data[relationKey] ? String(data[relationKey]) : "";

    if (rel === "guardian" && !relationValue) {
      relationValue = data["father_name"] ? String(data["father_name"]) : "";
    }

    formattedContent = formattedContent.replace(
      /\{relation_name\}/gi,
      relationValue
    );
  }

  return formattedContent;
};
const getParentName = () => {
  const rel = (formData['s_relationship'] || "").toLowerCase();  
  let relationKey = `${rel}_name`;  // father_name / mother_name / guardian_name

  // Main value based on Srelationship
  let value = formData[relationKey] ? String(formData[relationKey]) : '';

  // Fallback for Guardian → if guardian_name missing, use father_name
  if (rel === "guardian" && !value) {
    value = formData["father_name"] ? String(formData["father_name"]) : "";
  }

  // If still no value → fallback to first_name + middle_name + last_name
  if (!value) {
    return [
      formData['first_name'],
      formData['middle_name'],
      formData['last_name']
    ].filter(Boolean).join(' ');
  }

  return value;
};



  return (
   <div className="school_paragraph">
  {/* Main Content */}
  <div
    className="formatted-content max-w-none mb-4 md:mb-6 text-gray-700 leading-relaxed text-sm md:text-[15px] font-sans px-2 md:px-0"
    style={{ lineHeight: '1.6', fontWeight: '400' }}
    dangerouslySetInnerHTML={{ __html: formatContent(content, formData) }}
  />

  {/* Footer Section with Signatures */}
  <div className="disclaimer_footer_flex flex flex-col sm:flex-row justify-between items-center gap-6 md:gap-8 mt-6 md:mt-8 p-4 md:p-6 border-t border-gray-200 bg-gray-50/50 rounded-lg">
    {/* School Signature Section */}
    <div className="w-full sm:w-auto text-center sm:text-left">
      {directorSignature ? (
        <>
          <img
            src={assetUrl + '/' + directorSignature}
            alt="School Signature"
            className="w-32 h-14 md:w-48 md:h-20 object-contain mx-auto sm:mx-0 mb-2  rounded"
          />
          <p className="text-xs md:text-sm font-semibold text-gray-600">
            Signature & Seal of School
          </p>
        </>
      ) : (
        <div className="text-center sm:text-left">
          <div className="w-32 h-14 md:w-48 md:h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center mb-2 bg-white mx-auto sm:mx-0">
            <span className="text-xs text-gray-500">No School Signature</span>
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-600">
            Signature & Seal of School
          </p>
        </div>
      )}
    </div>

    {/* Parent Signature Section */}
    <div className="w-full sm:w-auto text-center sm:text-left">
      {fileData['candidate_signature'] ? (
        <>
          <img
            src={fileData['candidate_signature']}
            alt="Parent Signature"
            className="w-32 h-14 md:w-48 md:h-20 object-contain mx-auto sm:mx-0 mb-2 border border-gray-300 rounded"
          />
          <p className="text-xs md:text-sm font-semibold text-gray-800">
            Signature of Parent or Legal Guardian
          </p>
          <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto sm:mx-0">
            (Legal Guardian only if they have authority from the child's parent)
          </p>
        </>
      ) : (
        <div className="text-center sm:text-left">
          <div className="w-32 h-14 md:w-48 md:h-20 border-2 border-dashed border-gray-300 rounded flex items-center justify-center mb-2 bg-white mx-auto sm:mx-0">
            <span className="text-xs text-gray-500">No Signature Uploaded</span>
          </div>
          <p className="text-xs md:text-sm font-semibold text-gray-800">
            Signature of Parent or Legal Guardian
          </p>
          <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto sm:mx-0">
            (Legal Guardian only if they have authority from the child's parent)
          </p>
        </div>
      )}
    </div>
  </div>

  {/* Checkbox Section */}
  <div className="flex items-start gap-3 mt-4 md:mt-6 p-3 md:p-4 bg-gray-50 rounded-lg border border-gray-200">
    <div className="flex-shrink-0 mt-0.5">
      <input
        type="checkbox"
        id="disclaimer-checkbox"
        checked={accepted}
        onChange={(e) => onConditionChange('disclaimer', e.target.checked)}
        className={`w-4 h-4 md:w-5 md:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
          errors['disclaimer'] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
    
    <div className="flex-1">
      <label
        htmlFor="disclaimer-checkbox"
        className={`block text-xs md:text-sm leading-relaxed cursor-pointer ${
          errors['disclaimer'] ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        I have carefully gone through the instructions and I am conversant and shall abide by the
        eligibility conditions and other regulations.
      </label>
      
      {errors['disclaimer'] && (
        <p className="text-red-500 text-xs mt-1 md:mt-2 ml-0">
          Please accept the terms and conditions.
        </p>
      )}
    </div>
  </div>

  {/* Mobile spacing */}
  <div className="h-4 md:h-0"></div>
</div>
  );
};

export default DisclaimerStep;
