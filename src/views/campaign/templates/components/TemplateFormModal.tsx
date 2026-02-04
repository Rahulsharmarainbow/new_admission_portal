// import React, { useState, useEffect } from 'react';
// import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea } from 'flowbite-react';
// import axios from 'axios';
// import { useAuth } from 'src/hook/useAuth';
// import toast from 'react-hot-toast';

// interface TemplateFormModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
//   template: any | null;
// }

// interface FormData {
//   name: string;
//   wtsp_body: string;
//   email_body: string;
//   sms_body: string;
// }

// const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
//   isOpen,
//   onClose,
//   onSuccess,
//   template,
// }) => {
//   const { user } = useAuth();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<FormData>({
//     name: '',
//     wtsp_body: '',
//     email_body: '',
//     sms_body: '',
//   });

//   const apiUrl = import.meta.env.VITE_API_URL;

//   useEffect(() => {
//     if (isOpen) {
//       if (template) {
//         setFormData({
//           name: template.name,
//           wtsp_body: template.wtsp_body,
//           email_body: template.email_body,
//           sms_body: template.sms_body,
//         });
//       } else {
//         setFormData({
//           name: '',
//           wtsp_body: '',
//           email_body: '',
//           sms_body: '',
//         });
//       }
//     }
//   }, [isOpen, template]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    

//     if(formData.name === ''){
//       toast.error('Please select an academic');
//       return;
//     }
//     setLoading(true);

//     try {
//       const payload = {
//         name: formData.name,
//         wtsp_body: formData.wtsp_body,
//         email_body: formData.email_body,
//         sms_body: formData.sms_body,
//         s_id: user?.id,
//       };

//       if (template) {
//         await axios.post(
//           `${apiUrl}/${user?.role}/Campaign/update`,
//           { ...payload, id: template.id },
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       } else {
//         await axios.post(
//           `${apiUrl}/${user?.role}/Campaign/add`,
//           payload,
//           {
//             headers: {
//               Authorization: `Bearer ${user?.token}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );
//       }

//       onSuccess();
//     } catch (error: any) {
//       console.error('Error saving template:', error);
//       toast.error(error.response?.data?.message || 'Failed to save template');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (field: keyof FormData, value: string) => {
//     setFormData(prev => ({
//       ...prev,
//       [field]: value,
//     }));
//   };

//   const handleClose = () => {
//     setFormData({
//       name: '',
//       wtsp_body: '',
//       email_body: '',
//       sms_body: '',
//     });
//     onClose();
//   };

//   if (!isOpen) return null;

//   return (
//     <Modal show={isOpen} onClose={handleClose} size="4xl" className='overflow-visible'>
//       <ModalHeader>
//         <div className="flex justify-between items-center w-full">
//           <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
//             {template ? 'Edit Template' : 'Add New Template'}
//           </h2>
//         </div>
//       </ModalHeader>

//       <form onSubmit={handleSubmit}>
//         <ModalBody className="relative overflow-visible z-[100]">
//           <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
//             {/* Template Name */}
//             <div>
//               <Label className="block mb-2">Template Name <span className="text-red-500">*</span></Label>
//               <TextInput
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => handleInputChange('name', e.target.value)}
//                 placeholder="Enter template name"
//                 required
//                 disabled={loading}
//               />
//             </div>

//             {/* WhatsApp Body */}
//             <div>
//               <Label className="block mb-2">WhatsApp Body <span className="text-red-500">*</span></Label>
//               <Textarea
//                 value={formData.wtsp_body}
//                 onChange={(e) => handleInputChange('wtsp_body', e.target.value)}
//                 placeholder="Enter WhatsApp message template. Use {#variable#} for dynamic content."
//                 required
//                 disabled={loading}
//                 rows={4}
//                 className="resize-vertical"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
//               </p>
//             </div>

//             {/* Email Body */}
//             <div>
//               <Label className="block mb-2">Email Body <span className="text-red-500">*</span></Label>
//               <Textarea
//                 value={formData.email_body}
//                 onChange={(e) => handleInputChange('email_body', e.target.value)}
//                 placeholder="Enter email message template. Use {#variable#} for dynamic content."
//                 required
//                 disabled={loading}
//                 rows={4}
//                 className="resize-vertical"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
//               </p>
//             </div>

//             {/* SMS Body */}
//             <div>
//               <Label className="block mb-2">SMS Body <span className="text-red-500">*</span></Label>
//               <Textarea
//                 value={formData.sms_body}
//                 onChange={(e) => handleInputChange('sms_body', e.target.value)}
//                 placeholder="Enter SMS message template. Use {#variable#} for dynamic content."
//                 required
//                 disabled={loading}
//                 rows={3}
//                 className="resize-vertical"
//               />
//               <p className="text-sm text-gray-500 mt-1">
//                 Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
//               </p>
//             </div>

//             {/* Variables Help Section */}
//             <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
//               <h3 className="text-sm font-semibold text-blue-800 mb-2">Available Variables:</h3>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700">
//                 <code>{'{#name#}'}</code>
//                 <code>{'{#roll_no#}'}</code>
//                 <code>{'{#course#}'}</code>
//                 <code>{'{#application_no#}'}</code>
//                 <code>{'{#college_name#}'}</code>
//                 <code>{'{#date#}'}</code>
//               </div>
//               <p className="text-xs text-blue-600 mt-2">
//                 These variables will be automatically replaced with actual values when sending messages.
//               </p>
//             </div>
//           </div>
//         </ModalBody>

//         <ModalFooter className="flex justify-end gap-3">
//           <Button color="gray" onClick={handleClose} disabled={loading}>
//             Cancel
//           </Button>
//           <Button type="submit" color="blue" disabled={loading}>
//             {loading ? (
//               <>
//                 <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                 <span className="ml-2">Processing...</span>
//               </>
//             ) : (
//               template ? 'Update Template' : 'Add Template'
//             )}
//           </Button>
//         </ModalFooter>
//       </form>
//     </Modal>
//   );
// };

// export default TemplateFormModal;













import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, TextInput, Textarea } from 'flowbite-react';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import toast from 'react-hot-toast';
import JoditEditor from 'jodit-react';

interface TemplateFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  template: any | null;
}

interface FormData {
  name: string;
  wtsp_body: string;
  email_body: string;
  sms_body: string;
}

const TemplateFormModal: React.FC<TemplateFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  template,
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    wtsp_body: '',
    email_body: '',
    sms_body: '',
  });

    const wtsp_body = useRef<HTMLInputElement>(null);
    const email_body = useRef<HTMLInputElement>(null);
    const sms_body = useRef(null);

  const apiUrl = import.meta.env.VITE_API_URL;

     // Jodit Editor configuration
     const editorConfig = useMemo(
      () => ({
        readonly: false,
        height: 300,
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
        placeholder: "Start typing your email template here...",
        theme: "default",
      }),
      []
    );

  useEffect(() => {
    if (isOpen) {
      if (template) {
        setFormData({
          name: template.name,
          wtsp_body: template.wtsp_body,
          email_body: template.email_body,
          sms_body: template.sms_body,
        });
      } else {
        setFormData({
          name: '',
          wtsp_body: '',
          email_body: '',
          sms_body: '',
        });
      }
    }
  }, [isOpen, template]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.name === '') {
      toast.error('Please enter a template name');
      return;
    }
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        wtsp_body: formData.wtsp_body,
        email_body: formData.email_body,
        sms_body: formData.sms_body,
        s_id: user?.id,
      };

      if (template) {
        await axios.post(
          `${apiUrl}/${user?.role}/Campaign/update`,
          { ...payload, id: template.id },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      } else {
        await axios.post(
          `${apiUrl}/${user?.role}/Campaign/add`,
          payload,
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          }
        );
      }

      toast.success(template ? 'Template updated successfully!' : 'Template created successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error saving template:', error);
      toast.error(error.response?.data?.message || 'Failed to save template');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleClose = () => {
    setFormData({
      name: '',
      wtsp_body: '',
      email_body: '',
      sms_body: '',
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal 
      show={isOpen} 
      onClose={handleClose} 
      size="4xl" 
      className="overflow-visible"
    >
      <ModalHeader className="border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {template ? 'Edit Template' : 'Add New Template'}
        </h2>
      </ModalHeader>

      <form onSubmit={handleSubmit}>
        <ModalBody className="relative overflow-visible z-[100] py-6">
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
            {/* Template Name */}
            <div>
              <Label htmlFor="template-name" className="block mb-2 font-medium">
                Template Name <span className="text-red-500">*</span>
              </Label>
              <TextInput
                id="template-name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter template name"
                required
                disabled={loading}
                className="w-full"
              />
            </div>

            {/* WhatsApp Body */}
            <div>
              <Label htmlFor="whatsapp-body" className="block mb-2 font-medium">
                WhatsApp Body <span className="text-red-500">*</span>
              </Label>
              {/* <Textarea
                id="whatsapp-body"
                value={formData.wtsp_body}
                onChange={(e) => handleInputChange('wtsp_body', e.target.value)}
                placeholder="Enter WhatsApp message template. Use {#variable#} for dynamic content."
                required
                disabled={loading}
                rows={4}
                className="resize-vertical w-full"
              /> */}
              <JoditEditor
                ref={wtsp_body}
                value={formData.wtsp_body}
                config={editorConfig}
                onBlur={(e) => handleInputChange('wtsp_body', e)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>

            {/* Email Body */}
            <div>
              <Label htmlFor="email-body" className="block mb-2 font-medium">
                Email Body <span className="text-red-500">*</span>
              </Label>
              {/* <Textarea
                id="email-body"
                value={formData.email_body}
                onChange={(e) => handleInputChange('email_body', e.target.value)}
                placeholder="Enter email message template. Use {#variable#} for dynamic content."
                required
                disabled={loading}
                rows={4}
                className="resize-vertical w-full"
              /> */}
              <JoditEditor
                                  ref={email_body}
                                  value={formData.email_body}
                                  config={editorConfig}
                                  onBlur={(e) => handleInputChange('email_body', e)}
                                />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>

            {/* SMS Body */}
            <div>
              <Label htmlFor="sms-body" className="block mb-2 font-medium">
                SMS Body <span className="text-red-500">*</span>
              </Label>
              {/* <Textarea
                id="sms-body"
                value={formData.sms_body}
                onChange={(e) => handleInputChange('sms_body', e.target.value)}
                placeholder="Enter SMS message template. Use {#variable#} for dynamic content."
                required
                disabled={loading}
                rows={3}
                className="resize-vertical w-full"
              /> */}
              <JoditEditor
                                  ref={sms_body}
                                  value={formData.sms_body}
                                  config={editorConfig}
                                  onBlur={(e) => handleInputChange('sms_body', e)}
                                />
              <p className="text-sm text-gray-500 mt-1">
                Use variables like: {'{#name#}'}, {'{#roll_no#}'}, {'{#course#}'}, etc.
              </p>
            </div>

            {/* Variables Help Section */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-300 mb-2">
                Available Variables:
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm text-blue-700 dark:text-blue-400">
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#name#}'}</code>
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#roll_no#}'}</code>
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#course#}'}</code>
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#application_no#}'}</code>
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#college_name#}'}</code>
                <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded">{'{#date#}'}</code>
              </div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-2">
                These variables will be automatically replaced with actual values when sending messages.
              </p>
            </div>
          </div>
        </ModalBody>

        <ModalFooter className="border-t border-gray-200 dark:border-gray-700 py-4">
          <div className="flex justify-end gap-3 w-full">
            <Button 
              color="alternative" 
              onClick={handleClose} 
              disabled={loading}
              className="px-4 py-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              color="blue" 
              disabled={loading}
              className="px-4 py-2 min-w-[120px]"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                template ? 'Update Template' : 'Add Template'
              )}
            </Button>
          </div>
        </ModalFooter>
      </form>
    </Modal>
  );
};

export default TemplateFormModal;