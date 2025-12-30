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

  const getCurrentDate = () => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getFullYear()}`;
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
  <div
    className="formatted-content max-w-none mb-4 md:mb-6 text-gray-700 leading-relaxed text-sm md:text-[15px] font-sans px-2 md:px-0"
    style={{ lineHeight: '1.6', fontWeight: '400' }}
    dangerouslySetInnerHTML={{ __html: formatContent(content, formData) }}
  />
  
  <div className="declaration_footer_flex flex flex-col md:flex-row justify-between items-center md:items-center gap-6 md:gap-8 mt-6 md:mt-8 p-4 md:p-6 border-t border-gray-200 bg-gray-50/50 rounded-lg">
    {/* Left Section - Place & Date */}
    <div className="w-full md:w-auto">
      <p className="text-sm font-semibold text-gray-800 mb-2 md:mb-0">
        Place: {'Hyderabad'}
      </p>
      <p className="text-sm font-semibold text-gray-800 mt-2">
        Date: {getCurrentDate()}
      </p>
    </div>
    
    {/* Right Section - Signature */}
    <div className="w-full md:w-auto text-center md:text-left">
      {fileData["candidate_signature"] && (
        <div className="flex flex-col items-center md:items-start">
          <img
            src={fileData["candidate_signature"]}
            alt="Signature Preview"
            className="w-32 h-14 md:w-48 md:h-20 object-contain mb-2 border border-gray-300 rounded"
          />
          <div className="text-center md:text-left">
            <p className="text-sm font-semibold text-gray-800">
              Signature of Parent or Legal Guardian
            </p>
            <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto md:mx-0">
              (Legal Guardian only if they have authority from the child's parent)
            </p>
            <p className="text-sm text-gray-800 mt-2">
              Name: <strong>{getParentName()}</strong>
            </p>
          </div>
        </div>
      )}
      
      {!fileData["candidate_signature"] && (
        <div className="text-center md:text-left">
          <div className="w-32 h-14 md:w-48 md:h-20 border border-dashed border-gray-300 rounded flex items-center justify-center mb-2 bg-white">
            <span className="text-xs text-gray-500">No Signature Uploaded</span>
          </div>
          <p className="text-sm font-semibold text-gray-800">
            Signature of Parent or Legal Guardian
          </p>
          <p className="text-xs text-gray-600 mt-1 max-w-xs mx-auto md:mx-0">
            (Legal Guardian only if they have authority from the child's parent)
          </p>
          <p className="text-sm text-gray-800 mt-2">
            Name: <strong>{getParentName()}</strong>
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
        id="declaration-checkbox"
        checked={accepted}
        onChange={(e) => onConditionChange('declaration', e.target.checked)}
        className={`w-4 h-4 md:w-5 md:h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 ${
          errors['declaration-checkbox'] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
    </div>
    
    <div>
      <label
        htmlFor="declaration-checkbox"
        className={`block text-xs md:text-sm leading-relaxed cursor-pointer ${
          errors['declaration'] ? 'text-red-600' : 'text-gray-700'
        }`}
      >
        I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
      </label>
      
      {errors['declaration'] && (
        <p className="text-red-500 text-xs mt-1 md:mt-2 ml-0 md:ml-1">
          Please accept the terms and conditions.
        </p>
      )}
    </div>
  </div>

  {/* Mobile-specific spacing */}
  <div className="h-4 md:h-0"></div>
</div>
  );
};

export default DeclarationStep;