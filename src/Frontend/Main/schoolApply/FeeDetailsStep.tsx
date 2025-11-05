// components/FormSteps/FeeDetailsStep.tsx
import React from 'react';
import { 
  Box, 
  FormControlLabel, 
  Checkbox, 
  Typography, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

interface FeeDetailsStepProps {
  classes: any[];
  transportation_fee: any[];
  transportation_setting: any;
  formData: { [key: string]: any };
  accepted: boolean;
  onConditionChange: (condition: string, value: boolean) => void;
}

const FeeDetailsStep: React.FC<FeeDetailsStepProps> = ({
  classes,
  transportation_fee,
  transportation_setting,
  formData,
  accepted,
  onConditionChange
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
    <Box className="fee-tables">
      {/* Caution Deposit */}
      <Box className="tbl_header flex justify-between items-center mb-4 p-4 bg-gray-50 rounded-lg">
        <Typography variant="h6" className="font-bold">
          Caution Deposit (Refundable):
        </Typography>
        <Typography variant="h6" className="font-bold text-blue-600">
          {formatPrice(transportation_setting)} /-
        </Typography>
      </Box>

      {/* Tuition Fee Table */}
      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold">Class Name</TableCell>
              <TableCell className="font-bold">Tuition Fee-I (June 24 to Sept 24)</TableCell>
              <TableCell className="font-bold">Tuition Fee-II (Oct 24 to Jan 25)</TableCell>
              <TableCell className="font-bold">Tuition Fee-III (Feb 25 to May 25)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classes?.map((classData, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="font-medium">{classData.class_name}</TableCell>
                <TableCell>{formatPrice(classData.tution_fee_1)}</TableCell>
                <TableCell>{formatPrice(classData.tution_fee_2)}</TableCell>
                <TableCell>{formatPrice(classData.tution_fee_3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Transportation Fee Section */}
      <Box className="tbl_header mb-4 p-4 bg-yellow-50 rounded-lg">
        <Typography variant="h6" className="font-bold text-gray-800">
          TRANSPORTATION: OPTIONAL
        </Typography>
        <Typography variant="body2" className="text-gray-600 mt-1">
          Available only on the routes operated by the school
        </Typography>
      </Box>

      <TableContainer component={Paper} className="mb-6">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-100">
              <TableCell className="font-bold">Distance</TableCell>
              <TableCell className="font-bold">(June 24 to Sept 24)</TableCell>
              <TableCell className="font-bold">(Oct 24 to Jan 25)</TableCell>
              <TableCell className="font-bold">(Feb 25 to May 25)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transportation_fee?.map((transportData, index) => (
              <TableRow key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <TableCell className="font-medium">{transportData.distance}</TableCell>
                <TableCell>{formatPrice(transportData.fee1)}</TableCell>
                <TableCell>{formatPrice(transportData.fee2)}</TableCell>
                <TableCell>{formatPrice(transportData.fee3)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Parent Agreement Section */}
      <Box className="disclaimer_footer_flex flex justify-between items-start mt-8 p-6 border-t border-gray-200">
        <Box>
          <Typography variant="body2" className="font-semibold">
            I accept to pay the tuition fee as above.
          </Typography>
        </Box>
        
        <Box className="text-center">
          <Typography variant="body2" className="font-semibold mb-2">
            Parent Name: {getParentName()}
          </Typography>
          {formData.signature_pic_preview && (
            <img
              src={formData.signature_pic_preview}
              alt="Parent Signature"
              className="w-32 h-16 object-contain block mx-auto mb-2 border border-gray-300"
            />
          )}
          <Typography variant="body2" className="font-semibold">
            Parent Signature
          </Typography>
        </Box>
      </Box>

      {/* Agreement Checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={accepted}
            onChange={(e) => onConditionChange('fee', e.target.checked)}
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

      {/* Important Note */}
      <Box className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <Typography variant="body2" className="text-red-700 font-semibold text-center">
          Tuition fee and Transport Fee once paid will not be refunded in any case
        </Typography>
      </Box>
    </Box>
  );
};

export default FeeDetailsStep;