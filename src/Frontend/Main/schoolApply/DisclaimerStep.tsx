// components/FormSteps/DisclaimerStep.tsx
import React from 'react';
import { Box, FormControlLabel, Checkbox, Typography } from '@mui/material';

interface DisclaimerStepProps {
  content: string;
  formData: { [key: string]: any };
  fileData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
}

const DisclaimerStep: React.FC<DisclaimerStepProps> = ({
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
      const value = formData[key] || '';
      formattedContent = formattedContent.replace(
        new RegExp(placeholder, 'g'),
        `<strong>${value}</strong>`
      );
    });

    // Remove any remaining placeholders
    formattedContent = formattedContent.replace(/{[^}]*}/g, '');

    return formattedContent;
  };

  return (
    <Box className="school_paragraph">
      <div 
        dangerouslySetInnerHTML={{ 
          __html: formatContent(content) 
        }} 
        className="prose max-w-none mb-6"
      />
      
      <Box className="disclaimer_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <Box>
          <Typography variant="body2" className="font-semibold">
            Signature & Seal of School
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
          <Typography variant="caption" className="text-gray-600">
            (Legal Guardian only if they have authority from the child's parent)
          </Typography>
        </Box>
      </Box>

      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={(e) => onConditionChange('disclaimer', e.target.checked)}
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

export default DisclaimerStep;