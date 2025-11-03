import React, { useState, useEffect, useRef, useCallback } from "react";
import { Button, Modal, TextInput, Label, ModalFooter, ModalHeader, ModalBody } from "flowbite-react";
import axios from "axios";
import { useAuth } from "src/hook/useAuth";
import toast from "react-hot-toast";
import AcademicDropdown from "src/Frontend/Common/AcademicDropdown";
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
  const editorInstanceRef = useRef<any>(null);

  const apiUrl = import.meta.env.VITE_API_URL;

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
    },
    events: {
      afterInit: (editor: any) => {
        editorInstanceRef.current = editor;
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      setFormData({
        academic_id: editingContent ? editingContent.academic_id.toString() : "",
        page_name: editingContent ? editingContent.page_name : "",
        page_route: editingContent ? editingContent.page_route : "",
        html_content: editingContent ? editingContent.html_content : "",
      });
      
      setAutoGenerateRoute(!editingContent);
      setErrors({});
    }
  }, [isOpen, editingContent]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.academic_id) newErrors.academic_id = "Academic is required";
    if (!formData.page_name.trim()) newErrors.page_name = "Page name is required";
    if (!formData.page_route.trim()) newErrors.page_route = "Page route is required";
    if (!formData.html_content.trim()) newErrors.html_content = "Content is required";

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
        onClose();
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

  const handleInputChange = useCallback((field: keyof FormData, value: string) => {
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
  }, [errors]);

  const handleAcademicChange = useCallback((academicId: string) => {
    handleInputChange("academic_id", academicId);
  }, [handleInputChange]);

  const generatePageRoute = (pageName: string) => {
    return pageName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/(^_|_$)/g, '');
  };

  const handlePageNameChange = useCallback((value: string) => {
    setFormData((prev) => {
      const newFormData = {
        ...prev,
        page_name: value,
      };
      
      if (autoGenerateRoute && (!prev.page_route || prev.page_route === generatePageRoute(prev.page_name))) {
        newFormData.page_route = generatePageRoute(value);
      }
      
      return newFormData;
    });
    
    if (errors.page_name) {
      setErrors((prev) => ({
        ...prev,
        page_name: undefined,
      }));
    }
  }, [autoGenerateRoute, errors.page_name]);

  const handlePageRouteChange = useCallback((value: string) => {
    handleInputChange("page_route", value.toLowerCase());
    setAutoGenerateRoute(false);
  }, [handleInputChange]);

  const handleEditorChange = useCallback((newContent: string) => {
    handleInputChange("html_content", newContent);
  }, [handleInputChange]);

  return (
    // <Modal show={isOpen} onClose={onClose} size="5xl">
    //   <ModalHeader>
    //     {editingContent ? "Edit Content" : "Add New Content"}
    //   </ModalHeader>
      
    //   <ModalBody>
    //     <form onSubmit={handleSubmit} className="space-y-5">
    //       {/* School, Page Name, and Page Route in ONE ROW */}
    //       <div className="flex flex-row gap-4">
    //         {/* Academic Dropdown */}
    //         <div className="flex-1">
    //           <Label className="block mb-2">
    //             School <span className="text-red-500">*</span>
    //           </Label>
    //           <AcademicDropdown
    //             value={formData.academic_id}
    //             onChange={handleAcademicChange}
    //             placeholder="Select academics..."
    //             includeAllOption={true}
    //             label=""
    //           />
    //           {errors.academic_id && (
    //             <p className="text-red-500 text-sm mt-1">{errors.academic_id}</p>
    //           )}
    //         </div>

    //         {/* Page Name Input */}
    //         <div className="flex-1">
    //           <Label className="block mb-2">
    //             Page Name <span className="text-red-500">*</span>
    //           </Label>
    //           <TextInput
    //             id="page_name"
    //             type="text"
    //             value={formData.page_name}
    //             onChange={(e) => handlePageNameChange(e.target.value)}
    //             placeholder="e.g., Declaration Forms, Terms and Conditions"
    //             color={errors.page_name ? "failure" : "gray"}
    //           />
    //           {errors.page_name && (
    //             <p className="text-red-500 text-sm mt-1">{errors.page_name}</p>
    //           )}
    //         </div>

    //         {/* Page Route Input */}
    //         <div className="flex-1">
    //           <Label className="block mb-2">
    //             Page Route <span className="text-red-500">*</span>
    //           </Label>
    //           <TextInput
    //             id="page_route"
    //             type="text"
    //             value={formData.page_route}
    //             onChange={(e) => handlePageRouteChange(e.target.value)}
    //             placeholder="e.g., declaration_forms"
    //             color={errors.page_route ? "failure" : "gray"}
    //           />
    //           {errors.page_route ? (
    //             <p className="text-red-500 text-sm mt-1">{errors.page_route}</p>
    //           ) : (
    //             <p className="text-gray-500 text-sm mt-1">
    //               Use lowercase letters, numbers, underscores, and hyphens only.
    //               {autoGenerateRoute && " (Auto-generated)"}
    //             </p>
    //           )}
    //         </div>
    //       </div>

    //       {/* HTML Content Editor */}
    //       <div>
    //         <Label className="block mb-2">
    //           HTML Content <span className="text-red-500">*</span>
    //         </Label>
    //         <div className="border border-gray-300 rounded-lg overflow-hidden">
    //           <JoditEditor
    //             ref={editorRef}
    //             value={formData.html_content}
    //             config={editorConfig}
    //             onBlur={handleEditorChange}
    //             onChange={handleEditorChange}
    //           />
    //         </div>
    //         {errors.html_content && (
    //           <p className="text-red-500 text-sm mt-1">{errors.html_content}</p>
    //         )}
    //       </div>

    //       {/* Content Preview */}
    //       {formData.html_content && (
    //         <div>
    //           <Label className="block mb-2">
    //             Content Preview : 
    //           </Label>
    //           <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 max-h-60 overflow-y-auto">
    //             <div 
    //               className="prose prose-sm max-w-none"
    //               dangerouslySetInnerHTML={{ __html: formData.html_content }}
    //             />
    //           </div>
    //         </div>
    //       )}
    //     </form>
    //   </ModalBody>

    //   <ModalFooter>
    //     <div className="flex justify-end space-x-3 w-full">
    //       <Button 
    //         color="alternative" 
    //         onClick={onClose} 
    //         disabled={loading}
    //         type="button"
    //       >
    //         Cancel
    //       </Button>
    //       <Button 
    //         onClick={handleSubmit}
    //         gradientDuoTone="cyanToBlue" 
    //         disabled={loading}
    //         type="button"
    //       >
    //         {loading ? (
    //           <div className="flex items-center gap-2">
    //             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
    //             {editingContent ? "Updating..." : "Adding..."}
    //           </div>
    //         ) : editingContent ? (
    //           "Update Content"
    //         ) : (
    //           "Add Content"
    //         )}
    //       </Button>
    //     </div>
    //   </ModalFooter>
    // </Modal>
    <Modal show={isOpen} onClose={onClose} size="5xl">
  <ModalHeader>
    {editingContent ? "Edit Content" : "Add New Content"}
  </ModalHeader>

  <ModalBody>
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* School, Page Name, and Page Route in ONE ROW */}
      <div className="flex flex-wrap sm:flex-nowrap gap-4">
        {/* Academic Dropdown */}
       {(user?.role === 'SuperAdmin' || user?.role === 'SupportAdmin') &&  ( <div className="w-full sm:w-1/3">
          <Label className="block mb-2">
            School <span className="text-red-500">*</span>
          </Label>
          <AcademicDropdown
            value={formData.academic_id}
            onChange={handleAcademicChange}
            placeholder="Select academics..."
            includeAllOption={true}
            label=""
          />
          {errors.academic_id && (
            <p className="text-red-500 text-sm mt-1">
              {errors.academic_id}
            </p>
          )}
        </div>)}

        {/* Page Name Input */}
        <div className="w-full sm:w-1/3">
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
            <p className="text-red-500 text-sm mt-1">
              {errors.page_name}
            </p>
          )}
        </div>

        {/* Page Route Input */}
        <div className="w-full sm:w-1/3">
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
         
        </div>
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
            onBlur={handleEditorChange}
            onChange={handleEditorChange}
          />
        </div>
        {errors.html_content && (
          <p className="text-red-500 text-sm mt-1">
            {errors.html_content}
          </p>
        )}
      </div>

      {/* Content Preview */}
      {formData.html_content && (
        <div>
          <Label className="block mb-2">Content Preview :</Label>
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
        type="button"
      >
        Cancel
      </Button>
      <Button
        onClick={handleSubmit}
        gradientDuoTone="cyanToBlue"
        disabled={loading}
        type="button"
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