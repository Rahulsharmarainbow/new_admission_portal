import React, { useState, useEffect, useRef } from "react";
import { Button, Modal, TextInput, Label, ModalFooter, ModalHeader, ModalBody } from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import SchoolDropdown from "src/Frontend/Common/SchoolDropdown";
import JoditEditor from "jodit-react";

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
  const [autoGenerateRoute, setAutoGenerateRoute] = useState(true);
  
  const editorRef = useRef<any>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

  // Jodit Editor configuration
  const editorConfig = {
    readonly: false,
    height: 400,
    toolbarAdaptive: false,
    toolbarSticky: true,
    buttons: [
      'source',
      '|',
      'bold',
      'italic',
      'underline',
      'strikethrough',
      '|',
      'ul',
      'ol',
      '|',
      'font',
      'fontsize',
      'brush',
      'paragraph',
      '|',
      'image',
      'video',
      'table',
      'link',
      '|',
      'left',
      'center',
      'right',
      'justify',
      '|',
      'undo',
      'redo',
      '|',
      'hr',
      'eraser',
      'copyformat',
      'fullsize'
    ],
    removeButtons: [],
    showXPathInStatusbar: false,
    showCharsCounter: false,
    showWordsCounter: false,
    toolbarButtonSize: 'medium',
    theme: 'default',
    uploader: {
      insertImageAsBase64URI: true
    },
    placeholder: 'Start typing your content here...',
    style: {
      font: '14px Arial, sans-serif',
    }
  };

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
        setAutoGenerateRoute(false); // Disable auto-generation in edit mode
      } else {
        setFormData({
          academic_id: "",
          page_name: "",
          page_route: "",
          html_content: "",
        });
        setAutoGenerateRoute(true); // Enable auto-generation in add mode
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
    if(formData.academic_id === ''){
      toast.error('Please select an academic');
      return;
    }

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
          `${apiUrl}/${user?.role}/SchoolManagement/Content/Update-Content`,
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
          `${apiUrl}/${user?.role}/SchoolManagement/Content/Add-Content`,
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
    
    // Auto-generate page route only if autoGenerateRoute is true and page_route is empty or matches the generated version
    if (autoGenerateRoute && (!formData.page_route || formData.page_route === generatePageRoute(formData.page_name))) {
      handleInputChange("page_route", generatePageRoute(value));
    }
  };

  const handlePageRouteChange = (value: string) => {
    handleInputChange("page_route", value.toLowerCase());
    // When user manually edits page route, disable auto-generation
    setAutoGenerateRoute(false);
  };

  // Handle editor content change
  const handleEditorChange = (newContent: string) => {
    handleInputChange("html_content", newContent);
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <ModalHeader>
        {editingContent ? "Edit Content" : "Add New Content"}
      </ModalHeader>
      
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* School Dropdown */}
          <div className="w-auto">
            <Label className="block mb-2">
              Select School <span className="text-red-500">*</span>
            </Label>
            <SchoolDropdown
              value={formData.academic_id}
              formData={formData}
              setFormData={setFormData}
              onChange={handleAcademicChange}
              includeAllOption={false}
            />
            {/* {errors.academic_id && (
              <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
            )} */}
          </div>

          {/* Page Name Input */}
          <div>
            <Label className="block mb-2">
              Page Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="page_name"
              type="text"
              value={formData.page_name}
              onChange={(e) => handlePageNameChange(e.target.value)}
              placeholder="e.g., Declaration Forms, Terms and Conditions"
              color={errors.page_name ? "failure" : "gray"}
            />
            {errors.page_name && (
              <p className="text-red-500 text-sm mt-1">{errors.page_name}</p>
            )}
          </div>

          {/* Page Route Input */}
          <div>
            <Label className="block mb-2">
              Page Route <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="page_route"
              type="text"
              value={formData.page_route}
              onChange={(e) => handlePageRouteChange(e.target.value)}
              placeholder="e.g., declaration_forms"
              color={errors.page_route ? "failure" : "gray"}
            />
            {errors.page_route ? (
              <p className="text-red-500 text-sm mt-1">{errors.page_route}</p>
            ) : (
              <p className="text-gray-500 text-sm mt-1">
                This will be used in the URL path. Use lowercase letters, numbers, underscores, and hyphens only.
                {autoGenerateRoute && " (Auto-generated from page name)"}
              </p>
            )}
          </div>

          {/* HTML Content Editor */}
          <div>
            <Label className="block mb-2">
              HTML Content <span className="text-red-500">*</span>
            </Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editorRef}
                value={formData.html_content}
                config={editorConfig}
                onBlur={(newContent: string) => handleEditorChange(newContent)}
                onChange={(newContent: string) => handleEditorChange(newContent)}
              />
            </div>
            {errors.html_content && (
              <p className="text-red-500 text-sm mt-1">{errors.html_content}</p>
            )}
          </div>

          {/* Content Preview */}
          {formData.html_content && (
            <div>
              <Label className="block mb-2">
                Content Preview : 
              </Label>
              <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: formData.html_content }}
                />
              </div>
            </div>
          )}
        </form>
      </ModalBody>

      <ModalFooter>
        <div className="flex justify-end space-x-3 w-full">
          <Button 
            color="alternative" 
            onClick={onClose} 
            disabled={loading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            gradientDuoTone="cyanToBlue" 
            disabled={loading}
          >
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
      </ModalFooter>
    </Modal>
  );
};

export default ContentForm;