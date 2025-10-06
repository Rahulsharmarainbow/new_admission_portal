import React from "react";
import { Card, Checkbox } from "flowbite-react";
import { HiCloudUpload } from "react-icons/hi";
import { FormData } from "src/types/formTypes";

interface RollBasedAccessProps {
  formData: FormData;
  updateFormData: (updates: Partial<FormData>) => void;
}

const RollBasedAccess: React.FC<RollBasedAccessProps> = ({ formData, updateFormData }) => {
  
  // Only show for College and University (not School)
  if (formData.selectType === "1") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400 break-words">
          Roll based access is not available for School accounts.
        </p>
      </div>
    );
  }

  const handleCheckboxChange = (field: string, value: boolean) => {
    updateFormData({ [field]: value });
  };

  const accessCards = [
    {
      title: "Give Access For Hall Ticket Generate",
      description: "Allow generation of hall tickets for examinations",
      field: 'switchState',
      checked: formData.switchState
    },
    {
      title: "Give Access For Nominal Roll Access", 
      description: "Provide access to nominal roll management",
      field: 'nominalState',
      checked: formData.nominalState
    }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {accessCards.map((card) => (
          <Card key={card.field} className="hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="p-2 bg-gray-100 rounded-lg dark:bg-gray-700 flex-shrink-0">
                  <HiCloudUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
                <div className="min-w-0">
                  <h6 className="font-semibold text-gray-900 dark:text-white break-words">
                    {card.title}
                  </h6>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 break-words">
                    {card.description}
                  </p>
                </div>
              </div>
              <Checkbox
                checked={card.checked}
                onChange={(e) => handleCheckboxChange(card.field, e.target.checked)}
                className="flex-shrink-0 ml-2"
              />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RollBasedAccess;