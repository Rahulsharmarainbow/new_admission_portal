import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Button,
  Modal,
  TextInput,
  Label,
  ModalFooter,
  ModalHeader,
  ModalBody,
} from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import AcademicDropdown from "src/Frontend/Common/AcademicDropdown";
import JoditEditor from "jodit-react";
import CareerDropdown from "src/Frontend/Common/CareerDropdown";

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

  // ✅ Memoized Editor Config (to prevent reinitialization)
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        "source",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "ul",
        "ol",
        "|",
        "font",
        "fontsize",
        "brush",
        "paragraph",
        "|",
        "image",
        "video",
        "table",
        "link",
        "|",
        "left",
        "center",
        "right",
        "justify",
        "|",
        "undo",
        "redo",
        "|",
        "hr",
        "eraser",
        "copyformat",
        "fullsize",
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: "Start typing your content here...",
      theme: "default",
    }),
    []
  );

  // ✅ Initialize or reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        academic_id: editingContent?.academic_id?.toString() || "",
        page_name: editingContent?.page_name || "",
        page_route: editingContent?.page_route || "",
        html_content: editingContent?.html_content || "",
      });
      setAutoGenerateRoute(!editingContent);
      setErrors({});
    }
  }, [isOpen, editingContent]);

  // ✅ Input change handlers
  const handleInputChange = useCallback(
    (field: keyof FormData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: undefined }));
      }
    },
    [errors]
  );

  const handleAcademicChange = useCallback(
    (academicId: string) => handleInputChange("academic_id", academicId),
    [handleInputChange]
  );

  // ✅ Auto-generate route based on page name
  const generatePageRoute = (pageName: string) =>
    pageName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/(^_|_$)/g, "");

  const handlePageNameChange = useCallback(
    (value: string) => {
      setFormData((prev) => {
        const newData = { ...prev, page_name: value };
        if (
          autoGenerateRoute &&
          (!prev.page_route ||
            prev.page_route === generatePageRoute(prev.page_name))
        ) {
          newData.page_route = generatePageRoute(value);
        }
        return newData;
      });
      if (errors.page_name)
        setErrors((prev) => ({ ...prev, page_name: undefined }));
    },
    [autoGenerateRoute, errors.page_name]
  );

  const handlePageRouteChange = useCallback(
    (value: string) => {
      handleInputChange("page_route", value.toLowerCase());
      setAutoGenerateRoute(false);
    },
    [handleInputChange]
  );

  // ✅ Jodit onBlur handler (saves content only on blur)
  const handleEditorBlur = useCallback(
    (newContent: string) => {
      setFormData((prev) => ({ ...prev, html_content: newContent }));
      if (errors.html_content)
        setErrors((prev) => ({ ...prev, html_content: undefined }));
    },
    [errors.html_content]
  );

  // ✅ Validation
  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.academic_id && user?.role !== "CustomerAdmin")
      newErrors.academic_id = "Academic is required";
    if (!formData.page_name.trim())
      newErrors.page_name = "Page name is required";
    if (!formData.page_route.trim())
      newErrors.page_route = "Page route is required";
    if (!formData.html_content.trim())
      newErrors.html_content = "Content is required";

    const routeRegex = /^[a-z0-9_-]+$/;
    if (formData.page_route && !routeRegex.test(formData.page_route)) {
      newErrors.page_route =
        "Page route can only contain lowercase letters, numbers, underscores, and hyphens";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const payload = {
        ...formData,
        s_id: user?.id,
      };

      const endpoint = editingContent
        ? `${apiUrl}/${user?.role}/SchoolManagement/Content/Update-Content`
        : `${apiUrl}/${user?.role}/SchoolManagement/Content/Add-Content`;

      const response = await axios.post(
        endpoint,
        editingContent ? { ...payload, id: editingContent.id } : payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.status === true) {
        toast.success(
          editingContent
            ? "Content updated successfully!"
            : "Content added successfully!"
        );
        onSuccess();
        onClose();
      } else {
        toast.error(response.data.message || "Operation failed");
      }
    } catch (error: any) {
      console.error("Error saving content:", error);
      toast.error("Failed to save content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} size="5xl">
      <ModalHeader>
        {editingContent ? "Edit Content" : "Add New Content"}
      </ModalHeader>

      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-wrap sm:flex-nowrap gap-4">
            {/* Academic Dropdown */}
            {(user?.role === "SuperAdmin" || user?.role === "SupportAdmin") && (
              <div className="w-full sm:w-1/3">
                <Label className="block mb-2">
                  College <span className="text-red-500">*</span>
                </Label>
                <CareerDropdown
                  value={formData.academic_id}
                  onChange={handleAcademicChange}
                  placeholder="Select academic..."
                />
                {errors.academic_id && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.academic_id}
                  </p>
                )}
              </div>
            )}

            {/* Page Name */}
            <div className="w-full sm:w-1/3">
              <Label className="block mb-2">
                Page Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                value={formData.page_name}
                onChange={(e) => handlePageNameChange(e.target.value)}
                placeholder="e.g., About Us"
                color={errors.page_name ? "failure" : "gray"}
              />
              {errors.page_name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.page_name}
                </p>
              )}
            </div>

            {/* Page Route */}
            <div className="w-full sm:w-1/3">
              <Label className="block mb-2">
                Page Route <span className="text-red-500">*</span>
              </Label>
              <TextInput
                value={formData.page_route}
                onChange={(e) => handlePageRouteChange(e.target.value)}
                placeholder="e.g., about_us"
                color={errors.page_route ? "failure" : "gray"}
              />
              {errors.page_route && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.page_route}
                </p>
              )}
            </div>
          </div>

          {/* Jodit Editor */}
          <div>
            <Label className="block mb-2">
              HTML Content <span className="text-red-500">*</span>
            </Label>
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <JoditEditor
                ref={editorRef}
                value={formData.html_content}
                config={editorConfig}
                onBlur={handleEditorBlur}
              />
            </div>
            {errors.html_content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.html_content}
              </p>
            )}
          </div>
        </form>
      </ModalBody>

      <ModalFooter>
        <Button color="alternative" onClick={onClose} disabled={loading}>
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
      </ModalFooter>
    </Modal>
  );
};

export default ContentForm;
