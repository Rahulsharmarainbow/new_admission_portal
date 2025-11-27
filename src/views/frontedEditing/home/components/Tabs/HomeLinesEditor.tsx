import React, { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Card, Label, TextInput, Button, Spinner, FileInput } from "flowbite-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Loader from "src/Frontend/Common/Loader";
import JoditEditor from "jodit-react";

const HomeLinesEditor = ({ selectedAcademic, user, apiUrl }) => {
  const [lines, setLines] = useState([]);
  const [academicFields, setAcademicFields] = useState({
    apply_page_header: "",
    pdf_academic_address: "",
    pdf_examination_name: "",
    pdf_examination_title: "",
    pdf_signature_header: ""
  });
  const [signatureFile, setSignatureFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Jodit Editor ref for PDF Academic Address
  const pdfAddressEditorRef = useRef(null);

  const assetUrl = import.meta.env.VITE_ASSET_URL;

  // Jodit Editor configuration
  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 200,
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
      placeholder: "Enter PDF academic address here...",
      theme: "default",
    }),
    []
  );

  const handlePdfAddressChange = useCallback((newContent: string) => {
    setAcademicFields(prev => ({
      ...prev,
      pdf_academic_address: newContent
    }));
  }, []);

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
        // Ensure lines is always an array with at least 4 items
        const homeLines = res.data.data.home_lines || [];
        const paddedLines = Array.from({ length: 4 }, (_, index) => 
          homeLines[index] || { title: "" }
        );
        
        setLines(paddedLines);
        setAcademicFields(res.data.data.academic_fields || {
          apply_page_header: "",
          pdf_academic_address: "",
          pdf_examination_name: "",
          pdf_examination_title: "",
          pdf_signature_header: ""
        });
      } else toast.error(res.data.message || "Failed to load home lines");
    } catch (err) {
      toast.error("Error fetching home lines");
    } finally {
      setLoading(false);
    }
  };

  const handleLineChange = (index, value) => {
    setLines((prev) =>
      prev.map((line, i) => (i === index ? { ...line, title: value } : line))
    );
  };

  const handleAcademicFieldChange = (field, value) => {
    setAcademicFields(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('academic_id', selectedAcademic);
      formData.append('lines', JSON.stringify(lines));
      formData.append('academic_fields', JSON.stringify(academicFields));

      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-homelines`,
        {
          academic_id: selectedAcademic, 
          lines, 
          academic_fields: academicFields
        },
        { 
          headers: { 
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data'
          } 
        }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Home lines and academic fields updated successfully!");
        fetchLines();
      } else toast.error(res.data.message || "Failed to update");
    } catch (err) {
      toast.error("Error updating data");
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
      <div className="p-6 space-y-6">
        {/* Home Lines Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Home Page Lines</h3>
          {loading ? (
            <Loader />
          ) : (
            <> 
            <div className="space-y-4 pb-4">
              {lines.map((line, index) => (
                <div key={index}>
                  <TextInput
                    placeholder={`Enter line ${index + 1}`}
                    value={line?.title || ""}
                    onChange={(e) => handleLineChange(index, e.target.value)}
                  />
                </div>
              ))}
            </div>
             {/* Academic Fields Section */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Academic Fields</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="apply_page_header" className="mb-2">Apply Page Header </Label>
              <TextInput
                id="apply_page_header"
                value={academicFields.apply_page_header}
                onChange={(e) => handleAcademicFieldChange('apply_page_header', e.target.value)}
                placeholder="Enter apply page header"
              />
            </div>

            <div>
              <Label htmlFor="pdf_academic_address" className="mb-2">PDF Academic Address</Label>
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <JoditEditor
                  ref={pdfAddressEditorRef}
                  value={academicFields.pdf_academic_address}
                  config={editorConfig}
                  onBlur={handlePdfAddressChange}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pdf_examination_name" className="mb-2">PDF Examination Name</Label>
              <TextInput
                id="pdf_examination_name"
                value={academicFields.pdf_examination_name}
                onChange={(e) => handleAcademicFieldChange('pdf_examination_name', e.target.value)}
                placeholder="Enter PDF examination name"
              />
            </div>

            <div>
              <Label htmlFor="pdf_examination_title" className="mb-2">PDF Examination Title</Label>
              <TextInput
                id="pdf_examination_title"
                value={academicFields.pdf_examination_title}
                onChange={(e) => handleAcademicFieldChange('pdf_examination_title', e.target.value)}
                placeholder="Enter PDF examination title"
              />
            </div>

            <div>
              <Label htmlFor="pdf_signature_header" className="mb-2">PDF Signature Header</Label>
              <div className="space-y-2">
                <TextInput
                  id="pdf_signature_header"
                  value={academicFields.pdf_signature_header}
                  onChange={(e) => handleAcademicFieldChange('pdf_signature_header', e.target.value)}
                  placeholder="Enter PDF signature header text"
                />
              </div>
            </div>
          </div>
        </div>
            </>
          )}
        </div>

        {/* Save Button */}
        <Button
          className="mt-6"
          onClick={handleSave}
          disabled={saving || loading}
        >
          {saving ? (
            <>
              <Spinner size="sm" className="mr-2" /> Saving...
            </>
          ) : (
            "Save All Changes"
          )}
        </Button>
      </div>
    </Card>
  );
};

export default HomeLinesEditor;



// import React, { useEffect, useState } from "react";
// import { Card, Label, TextInput, Button, Spinner, FileInput } from "flowbite-react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import Loader from "src/Frontend/Common/Loader";

// const HomeLinesEditor = ({ selectedAcademic, user, apiUrl }) => {
//   const [lines, setLines] = useState([]);
//   const [academicFields, setAcademicFields] = useState({
//     apply_page_header: "",
//     pdf_academic_address: "",
//     pdf_examination_name: "",
//     pdf_examination_title: "",
//     pdf_signature_header: ""
//   });
//   const [signatureFile, setSignatureFile] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const assetUrl = import.meta.env.VITE_ASSET_URL;

//   useEffect(() => {
//     if (selectedAcademic) fetchLines();
//   }, [selectedAcademic]);

//   const fetchLines = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/get-homelines`,
//         { academic_id: selectedAcademic },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       if (res.data.success) {
//         // Ensure lines is always an array with at least 4 items
//         const homeLines = res.data.data.home_lines || [];
//         const paddedLines = Array.from({ length: 4 }, (_, index) => 
//           homeLines[index] || { title: "" }
//         );
        
//         setLines(paddedLines);
//         setAcademicFields(res.data.data.academic_fields || {
//           apply_page_header: "",
//           pdf_academic_address: "",
//           pdf_examination_name: "",
//           pdf_examination_title: "",
//           pdf_signature_header: ""
//         });
//       } else toast.error(res.data.message || "Failed to load home lines");
//     } catch (err) {
//       toast.error("Error fetching home lines");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLineChange = (index, value) => {
//     setLines((prev) =>
//       prev.map((line, i) => (i === index ? { ...line, title: value } : line))
//     );
//   };

//   const handleAcademicFieldChange = (field, value) => {
//     setAcademicFields(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleSave = async () => {
//     setSaving(true);
//     try {
//       const formData = new FormData();
//       formData.append('academic_id', selectedAcademic);
//       formData.append('lines', JSON.stringify(lines));
//       formData.append('academic_fields', JSON.stringify(academicFields));

//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/update-homelines`,
//         {
//           academic_id: selectedAcademic, lines, academicFields
//         },
//         { 
//           headers: { 
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data'
//           } 
//         }
//       );

//       if (res.data.success) {
//         toast.success(res.data.message || "Home lines and academic fields updated successfully!");
//         fetchLines();
//       } else toast.error(res.data.message || "Failed to update");
//     } catch (err) {
//       toast.error("Error updating data");
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (!selectedAcademic)
//     return (
//       <Card className="p-6">
//         <p className="text-gray-500 italic">
//           Please select an academic to manage home lines.
//         </p>
//       </Card>
//     );

//   return (
//     <Card>
//       <div className="p-6 space-y-6">
//         {/* Home Lines Section */}
//         <div>
//           <h3 className="text-lg font-semibold mb-4">Home Page Lines</h3>
//           {loading ? (
//             <Loader />
//           ) : (
//             <> 
//             <div className="space-y-4 pb-4">
//               {lines.map((line, index) => (
//                 <div key={index}>
//                   <TextInput
//                     placeholder={`Enter line ${index + 1}`}
//                     value={line?.title || ""}
//                     onChange={(e) => handleLineChange(index, e.target.value)}
//                   />
//                 </div>
//               ))}
//             </div>
//              {/* Academic Fields Section */}
//         <div className="border-t pt-6">
//           <h3 className="text-lg font-semibold mb-4">Academic Fields</h3>
//           <div className="space-y-4">
//             <div>
//               <Label htmlFor="apply_page_header" className="mb-2">Apply Page Header </Label>
//               <TextInput
//                 id="apply_page_header"
//                 value={academicFields.apply_page_header}
//                 onChange={(e) => handleAcademicFieldChange('apply_page_header', e.target.value)}
//                 placeholder="Enter apply page header"
//               />
//             </div>

//             <div>
//               <Label htmlFor="pdf_academic_address" className="mb-2">PDF Academic Address</Label>
//               <TextInput
//                 id="pdf_academic_address"
//                 value={academicFields.pdf_academic_address}
//                 onChange={(e) => handleAcademicFieldChange('pdf_academic_address', e.target.value)}
//                 placeholder="Enter PDF academic address"
//               />
//             </div>

//             <div>
//               <Label htmlFor="pdf_examination_name" className="mb-2">PDF Examination Name</Label>
//               <TextInput
//                 id="pdf_examination_name"
//                 value={academicFields.pdf_examination_name}
//                 onChange={(e) => handleAcademicFieldChange('pdf_examination_name', e.target.value)}
//                 placeholder="Enter PDF examination name"
//               />
//             </div>

//             <div>
//               <Label htmlFor="pdf_examination_title" className="mb-2">PDF Examination Title</Label>
//               <TextInput
//                 id="pdf_examination_title"
//                 value={academicFields.pdf_examination_title}
//                 onChange={(e) => handleAcademicFieldChange('pdf_examination_title', e.target.value)}
//                 placeholder="Enter PDF examination title"
//               />
//             </div>

//             <div>
//               <Label htmlFor="pdf_signature_header" className="mb-2">PDF Signature Header</Label>
//               <div className="space-y-2">
//                 <TextInput
//                   id="pdf_signature_header"
//                   value={academicFields.pdf_signature_header}
//                   onChange={(e) => handleAcademicFieldChange('pdf_signature_header', e.target.value)}
//                   placeholder="Enter PDF signature header text"
//                 />
          
//               </div>
//             </div>
//           </div>
//         </div>
//             </>
//           )}
//         </div>

       

//         {/* Save Button */}
//         <Button
//           className="mt-6"
//           onClick={handleSave}
//           disabled={saving || loading}
//         >
//           {saving ? (
//             <>
//               <Spinner size="sm" className="mr-2" /> Saving...
//             </>
//           ) : (
//             "Save All Changes"
//           )}
//         </Button>
//       </div>
//     </Card>
//   );
// };

// export default HomeLinesEditor;