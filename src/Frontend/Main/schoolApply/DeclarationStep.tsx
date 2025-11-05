// components/FormSteps/DeclarationStep.tsx
import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';

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
  const formatContent = (htmlContent: string) => {
    let formattedContent = htmlContent;
    
    // Replace placeholders with form data
    Object.keys(formData).forEach(key => {
      const placeholder = `{${key}}`;
      let value = formData[`s_${key}`] || formData[key] || '';
      formattedContent = formattedContent.replace(
        new RegExp(placeholder, 'g'),
        `<strong>${value}</strong>`
      );
    });

    // Remove any remaining placeholders
    formattedContent = formattedContent.replace(/{[^}]*}/g, '');

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
    <Box className="school_paragraph">
      <Typography variant="h6" className="text-center mb-4 text-gray-700">
        (Please read carefully before signing)
      </Typography>
      
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatContent(content) 
        }} 
        className="prose max-w-none mb-6"
      />
      
      <Box className="declaration_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <Box>
          <Typography variant="body2" className="font-semibold">
            Place: {formData['city'] || 'Hyderabad'}
          </Typography>
          <Typography variant="body2" className="font-semibold mt-2">
            Date: {getCurrentDate()}
          </Typography>
        </Box>
        
        <Box className="text-center">
          {fileData.signature_pic_preview && (
            <img
              src={fileData.signature_pic_preview.previewUrl}
              alt="Signature Preview"
              className="w-48 h-20 object-contain block mx-auto mb-2"
            />
          )}
          <Typography variant="body2" className="font-semibold">
            Signature of Parent or Legal Guardian
          </Typography>
          <Typography variant="caption" className="text-gray-600 block">
            (Legal Guardian only if they have authority from the child's parent)
          </Typography>
          <Typography variant="body2" className="mt-2">
            Name: <strong>{getParentName()}</strong>
          </Typography>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={(e) => onConditionChange('declaration', e.target.checked)}
            color="primary"
          />
        }
        label={
          <Typography variant="body2">
            I have carefully gone through the instructions and I am conversant and shall abide by the eligibility conditions and other regulations.
          </Typography>
        }
        className="mt-6"
      />
    </Box>
  );
};

export default DeclarationStep;