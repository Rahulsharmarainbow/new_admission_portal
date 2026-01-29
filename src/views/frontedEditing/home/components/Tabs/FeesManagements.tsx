import React, { useEffect, useState } from "react";
import { Card, Label, TextInput, Button, Spinner, Alert } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "src/Frontend/Common/Loader";

const FeesManagements = ({ selectedAcademic, user, apiUrl }) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [feesData, setFeesData] = useState({
    // Fees Details Fields (Fees Card)
    fee_details: {
      main_title: "",
      sub_title: "",
      class_name: "",
      tution_fee_1: "",
      tution_fee_2: "",
      tution_fee_3: ""
    },
    
    // Transportation Fee Details Fields (Transportation Card)
    transportation_fee: {
      main_title: "",
      sub_title: "",
      class_name: "",
      tution_fee_1: "",
      tution_fee_2: "",
      tution_fee_3: ""
    }
  });

  useEffect(() => {
    if (selectedAcademic) fetchFeesData();
  }, [selectedAcademic]);

  // API से डेटा fetch करें - नए endpoint के according
  const fetchFeesData = async () => {
    if (!selectedAcademic) return;
    
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-fees-details`,
        { academic_id: selectedAcademic },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (res.data.status) {
        // API response format के according data set करें
        const data = res.data.data;
        setFeesData({
          fee_details: {
            main_title: data?.fees_details?.main_title || "",
            sub_title: data?.fees_details?.sub_title || "",
            class_name: data?.fees_details?.class_name || "",
            tution_fee_1: data?.fees_details?.tution_fee_1 || "",
            tution_fee_2: data?.fees_details?.tution_fee_2 || "",
            tution_fee_3: data?.fees_details?.tution_fee_3 || ""
          },
          transportation_fee: {
            main_title: data?.transportation_fee_details?.main_title || "",
            sub_title: data?.transportation_fee_details?.sub_title || "",
            class_name: data?.transportation_fee_details?.class_name || "",
            tution_fee_1: data?.transportation_fee_details?.tution_fee_1 || "",
            tution_fee_2: data?.transportation_fee_details?.tution_fee_2 || "",
            tution_fee_3: data?.transportation_fee_details?.tution_fee_3 || ""
          }
        });
      } else {
        console.log(res.data.message || "Failed to load fees data");
      }
    } catch (err) {
      console.error("Error fetching fees data:", err);
      if (err.response?.status === 404) {
        // Data नहीं मिला तो empty state set करें
        setFeesData({
          fee_details: {
            main_title: "",
            sub_title: "",
            class_name: "",
            tution_fee_1: "",
            tution_fee_2: "",
            tution_fee_3: ""
          },
          transportation_fee: {
            main_title: "",
            sub_title: "",
            class_name: "",
            tution_fee_1: "",
            tution_fee_2: "",
            tution_fee_3: ""
          }
        });
      } else {
        toast.error("Error fetching fees data");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fees card input field change handler
  const handleFeesInputChange = (field, value) => {
    setFeesData(prev => ({
      ...prev,
      fee_details: {
        ...prev.fee_details,
        [field]: value
      }
    }));
  };

  // Transportation card input field change handler
  const handleTransportInputChange = (field, value) => {
    setFeesData(prev => ({
      ...prev,
      transportation_fee: {
        ...prev.transportation_fee,
        [field]: value
      }
    }));
  };

  // Save data to API - नए endpoint के according
  const handleSave = async () => {
    if (!selectedAcademic) {
      toast.error("Please select an academic");
      return;
    }

    setSaving(true);
    try {
      const payload = {
        academic_id: selectedAcademic,
        fee_details: feesData.fee_details,
        transportation_fee: feesData.transportation_fee
      };

      console.log("Saving payload:", payload); // Debug के लिए

      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-fees-details-update`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (res.data.status) {
        toast.success(res.data.message || "Fees data updated successfully!");
        fetchFeesData(); // Refresh data
      } else {
        console.log(res.data.message || "Failed to update fees data");
      }
    } catch (err) {
      console.error("Error updating fees data:", err);
      console.log(err.response?.data?.message || "Error updating fees data");
    } finally {
      setSaving(false);
    }
  };

  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <Alert color="info">
          <span className="font-medium">Info!</span> Please select an academic to manage fees data.
        </Alert>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 space-y-8">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader />
          </div>
        ) : (
          <>
            {/* Fees Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-blue-700">Fees Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="fee_main_title" className="mb-2 block">
                    Fees Main Title <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="fee_main_title"
                    value={feesData.fee_details.main_title}
                    onChange={(e) => handleFeesInputChange('main_title', e.target.value)}
                    placeholder="e.g., School Tuition Fees"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fee_sub_title" className="mb-2 block">
                    Fees Sub Title
                  </Label>
                  <TextInput
                    id="fee_sub_title"
                    value={feesData.fee_details.sub_title}
                    onChange={(e) => handleFeesInputChange('sub_title', e.target.value)}
                    placeholder="e.g., Academic Year 2025-26"
                  />
                </div>

                <div>
                  <Label htmlFor="fee_class_name" className="mb-2 block">
                    Class Name <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="fee_class_name"
                    value={feesData.fee_details.class_name}
                    onChange={(e) => handleFeesInputChange('class_name', e.target.value)}
                    placeholder="e.g., Class 5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fee_tution_fee_1" className="mb-2 block">
                    Tuition Fee 1 <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="fee_tution_fee_1"
                    value={feesData.fee_details.tution_fee_1}
                    onChange={(e) => handleFeesInputChange('tution_fee_1', e.target.value)}
                    placeholder="Enter Tuition Fee 1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="fee_tution_fee_2" className="mb-2 block">
                    Tuition Fee 2
                  </Label>
                  <TextInput
                    id="fee_tution_fee_2"
                    value={feesData.fee_details.tution_fee_2}
                    onChange={(e) => handleFeesInputChange('tution_fee_2', e.target.value)}
                    placeholder="Enter Tuition Fee 2"
                  />
                </div>

                <div>
                  <Label htmlFor="fee_tution_fee_3" className="mb-2 block">
                    Tuition Fee 3
                  </Label>
                  <TextInput
                    id="fee_tution_fee_3"
                    value={feesData.fee_details.tution_fee_3}
                    onChange={(e) => handleFeesInputChange('tution_fee_3', e.target.value)}
                    placeholder="Enter Tuition Fee 3"
                  />
                </div>
              </div>
            </div>

            {/* Transportation Card */}
            <div className="border border-gray-200 rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-semibold mb-4 text-green-700">Transportation Card</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="transport_main_title" className="mb-2 block">
                    Transportation Main Title <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="transport_main_title"
                    value={feesData.transportation_fee.main_title}
                    onChange={(e) => handleTransportInputChange('main_title', e.target.value)}
                    placeholder="e.g., School Transportation Fees"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="transport_sub_title" className="mb-2 block">
                    Transportation Sub Title
                  </Label>
                  <TextInput
                    id="transport_sub_title"
                    value={feesData.transportation_fee.sub_title}
                    onChange={(e) => handleTransportInputChange('sub_title', e.target.value)}
                    placeholder="e.g., Bus Facility Charges"
                  />
                </div>

                <div>
                  <Label htmlFor="transport_class_name" className="mb-2 block">
                    Class Name <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="transport_class_name"
                    value={feesData.transportation_fee.class_name}
                    onChange={(e) => handleTransportInputChange('class_name', e.target.value)}
                    placeholder="e.g., Class 5"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="transport_tution_fee_1" className="mb-2 block">
                    Transportation Fee 1 <span className="text-red-500">*</span>
                  </Label>
                  <TextInput
                    id="transport_tution_fee_1"                
                    value={feesData.transportation_fee.tution_fee_1}
                    onChange={(e) => handleTransportInputChange('tution_fee_1', e.target.value)}
                    placeholder="e.g., 3000"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="transport_tution_fee_2" className="mb-2 block">
                    Transportation Fee 2
                  </Label>
                  <TextInput
                    id="transport_tution_fee_2"
                    value={feesData.transportation_fee.tution_fee_2}
                    onChange={(e) => handleTransportInputChange('tution_fee_2', e.target.value)}
                    placeholder="e.g., 4500"
                  />
                </div>

                <div>
                  <Label htmlFor="transport_tution_fee_3" className="mb-2 block">
                    Transportation Fee 3
                  </Label>
                  <TextInput
                    id="transport_tution_fee_3"
                    value={feesData.transportation_fee.tution_fee_3}
                    onChange={(e) => handleTransportInputChange('tution_fee_3', e.target.value)}
                    placeholder="e.g., 6000"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4 border-t">
              <Button
                color="success"
                onClick={handleSave}
                disabled={saving || loading}
                className="px-8"
              >
                {saving ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save All Changes"
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default FeesManagements;