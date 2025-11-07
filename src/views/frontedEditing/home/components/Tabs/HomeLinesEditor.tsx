import React, { useEffect, useState } from "react";
import { Card, Label, TextInput, Button, Spinner } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "src/Frontend/Common/Loader";

const HomeLinesEditor = ({ selectedAcademic, user, apiUrl }) => {
  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (selectedAcademic) fetchLines();
  }, [selectedAcademic]);

  const fetchLines = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-homelines`,
        { academic_id: selectedAcademic },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (res.data.success) {
        setLines(res.data.data);
      } else toast.error(res.data.message || "Failed to load home lines");
    } catch (err) {
      toast.error("Error fetching home lines");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (index, value) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, title: value } : line))
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-homelines`,
        { academic_id: selectedAcademic, lines },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      if (res.data.success) {
        toast.success("Home lines updated successfully!");
        setLines(res.data.data);
      } else toast.error(res.data.message || "Failed to update home lines");
    } catch (err) {
      toast.error("Error updating home lines");
    } finally {
      setSaving(false);
    }
  };

  if (!selectedAcademic)
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic to manage home lines.
        </p>
      </Card>
    );

  return (
    <Card>
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Home Page Lines</h3>
        {loading ? (
          <Loader />
        ) : (
          <form className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index}>
                <TextInput
                  placeholder={`Enter line ${index + 1}`}
                  value={lines[index]?.title || ""}
                  onChange={(e) => handleChange(index, e.target.value)}
                />
              </div>
            ))}
            <Button
              className="mt-6"
              onClick={handleSave}
              disabled={saving}
              type="button"
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="mr-2" /> Saving...
                </>
              ) : (
                "Save Lines"
              )}
            </Button>
          </form>
        )}
      </div>
    </Card>
  );
};

export default HomeLinesEditor;
