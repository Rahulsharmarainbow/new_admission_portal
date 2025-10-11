import React, { useState, useEffect } from "react";
import { Button, Modal, TextInput, Label } from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import SchoolDropdown from "src/Frontend/Common/SchoolDropdown";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Content {
  id: number;
  academic_id: string;
  page_name: string;
  page_route: string;
  html_content: string;
  created_at: string;
  academic_name: string;
}

interface ContentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingContent?: Content | null;
}

interface FormData {
  academic_id: string;
  page_name: string;
  page_route: string;
  html_content: string;
}

const ContentForm: React.FC<ContentFormProps> = ({
  isOpen,
  onClose,
  onSuccess,
  editingContent,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    academic_id: "",
    page_name: "",
    page_route: "",
    html_content: "",
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const apiUrl = import.meta.env.VITE_API_URL;

  // ReactQuill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'script': 'sub'}, { 'script': 'super' }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link', 'image', 'video'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'script',
    'list', 'bullet', 'indent',
    'align',
    'blockquote', 'code-block',
    'link', 'image', 'video'
  ];

  // Reset form when modal opens/closes or editing content changes
  useEffect(() => {
    if (isOpen) {
      if (editingContent) {
        setFormData({
          academic_id: editingContent.academic_id.toString(),
          page_name: editingContent.page_name,
          page_route: editingContent.page_route,
          html_content: editingContent.html_content,
        });
      } else {
        setFormData({
          academic_id: "",
          page_name: "",
          page_route: "",
          html_content: "",
        });
      }
      setErrors({});
    }
  }, [isOpen, editingContent]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.academic_id) newErrors.academic_id = "School is required";
    if (!formData.page_name.trim()) newErrors.page_name = "Page name is required";
    if (!formData.page_route.trim()) newErrors.page_route = "Page route is required";
    if (!formData.html_content.trim()) newErrors.html_content = "Content is required";

    // Validate page_route format (only lowercase letters, numbers, underscores, and hyphens)
    const routeRegex = /^[a-z0-9_-]+$/;
    if (formData.page_route && !routeRegex.test(formData.page_route)) {
      newErrors.page_route = "Page route can only contain lowercase letters, numbers, underscores, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        academic_id: formData.academic_id,
        page_name: formData.page_name,
        page_route: formData.page_route,
        html_content: formData.html_content,
        s_id: user?.id,
      };

      let response;
      if (editingContent) {
        response = await axios.post(
          `${apiUrl}/SuperAdmin/SchoolManagement/Content/Update-Content`,
          { ...payload, id: editingContent.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } else {
        response = await axios.post(
          `${apiUrl}/SuperAdmin/SchoolManagement/Content/Add-Content`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      if (response.data.status === true) {
        toast.success(
          editingContent
            ? "Content updated successfully!"
            : "Content added successfully!"
        );
        onSuccess();
      } else {
        toast.error(
          response.data.message ||
            `Failed to ${editingContent ? "update" : "add"} content`
        );
      }
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast.error(
        `Failed to ${editingContent ? "update" : "add"} content`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const handleAcademicChange = (academicId: string) => {
    handleInputChange("academic_id", academicId);
  };

  // Generate page route from page name
  const generatePageRoute = (pageName: string) => {
    return pageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
  };

  const handlePageNameChange = (value: string) => {
    handleInputChange("page_name", value);
    
    // Auto-generate page route if it's empty or matches the generated version of the previous page name
    if (!formData.page_route || formData.page_route === generatePageRoute(formData.page_name)) {
      handleInputChange("page_route", generatePageRoute(value));
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="4xl">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          {editingContent ? "Edit Content" : "Add New Content"}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* School Dropdown */}
          <div>
            <label
              htmlFor="academic_id"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Select School <span className="text-red-500">*</span>
            </label>
            <SchoolDropdown
              formData={formData}
              setFormData={setFormData}
              onChange={handleAcademicChange}
              includeAllOption={false}
            />
            {errors.academic_id && (
              <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
            )}
          </div>

          {/* Page Name Input */}
          <div>
            <label
              htmlFor="page_name"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Page Name <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="page_name"
              type="text"
              value={formData.page_name}
              onChange={(e) => handlePageNameChange(e.target.value)}
              placeholder="e.g., Declaration Forms, Terms and Conditions"
              color={errors.page_name ? "failure" : "gray"}
              helperText={errors.page_name}
            />
          </div>

          {/* Page Route Input */}
          <div>
            <label
              htmlFor="page_route"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Page Route <span className="text-red-500">*</span>
            </label>
            <TextInput
              id="page_route"
              type="text"
              value={formData.page_route}
              onChange={(e) => handleInputChange("page_route", e.target.value.toLowerCase())}
              placeholder="e.g., declaration_forms"
              color={errors.page_route ? "failure" : "gray"}
              helperText={errors.page_route || "This will be used in the URL path. Use lowercase letters, numbers, underscores, and hyphens only."}
            />
          </div>

          {/* HTML Content Editor */}
          <div>
            <label
              htmlFor="html_content"
              className="block mb-1 text-sm font-medium text-gray-700"
            >
              Content <span className="text-red-500">*</span>
            </label>
            <div className={`border rounded-lg ${errors.html_content ? 'border-red-500' : 'border-gray-300'}`}>
              <ReactQuill
                value={formData.html_content}
                onChange={(value) => handleInputChange("html_content", value)}
                modules={modules}
                formats={formats}
                theme="snow"
                style={{ height: '300px' }}
              />
            </div>
            {errors.html_content && (
              <p className="text-red-500 text-sm mt-1">{errors.html_content}</p>
            )}
          </div>

          {/* Content Preview (Optional) */}
          {formData.html_content && (
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">
                Content Preview
              </label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-40 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.html_content }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <Button color="gray" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" gradientDuoTone="cyanToBlue" disabled={loading}>
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {editingContent ? "Updating..." : "Adding..."}
                </div>
              ) : editingContent ? (
                "Update Content"
              ) : (
                "Add Content"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ContentForm;