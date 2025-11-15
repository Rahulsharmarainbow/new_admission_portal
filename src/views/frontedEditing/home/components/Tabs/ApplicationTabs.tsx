// import React, { useEffect, useState } from "react";
// import {
//   Tabs,
//   Card,
//   Label,
//   TextInput,
//   Button,
//   Spinner,
//   FileInput,
//   ToggleSwitch,
// } from "flowbite-react";
// import { HiOutlineDocumentText } from "react-icons/hi";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import Loader from "src/Frontend/Common/Loader";

// const ApplicationTabs = ({ selectedAcademic, user, apiUrl }) => {
//   const [activeTab, setActiveTab] = useState(
//     localStorage.getItem("frontend_active_tab") || "application"
//   );
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     application: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     news: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     notification: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     marquee: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//   });

//   const [tabItems, setTabItems] = useState({
//     application: [],
//     news: [],
//     notification: [],
//     marquee: [],
//   });

//   const [editId, setEditId] = useState({
//     application: null,
//     news: null,
//     notification: null,
//     marquee: null,
//   });

//   // Restore selected tab on mount
//   useEffect(() => {
//     const savedTab = localStorage.getItem("frontend_active_tab");
//     if (savedTab) setActiveTab(savedTab);
//   }, []);

//   // Fetch previously added list
//   useEffect(() => {
//     if (!selectedAcademic) return;
//     fetchFooterItems(activeTab);
//   }, [selectedAcademic]);

//   // Save active tab to localStorage whenever changed
//   useEffect(() => {
//     localStorage.setItem("frontend_active_tab", activeTab);
//   }, [activeTab]);

//   // ---------- Fetch Items ----------
//   const fetchFooterItems = async (tab = activeTab) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/get-application-tabs`,
//         { academic_id: selectedAcademic },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       if (res.data.success) {
//         const items = res.data.data;
//         const grouped = {
//           application: items.filter((i) => i.tab_name === "application"),
//           news: items.filter((i) => i.tab_name === "news"),
//           notification: items.filter((i) => i.tab_name === "notification"),
//           marquee: items.filter((i) => i.tab_name === "marquee"),
//         };
//         setTabItems(grouped);
//         setActiveTab(tab);
//       } else {
//         toast.error(res.data.message || "Failed to load items");
//       }
//     } catch (e) {
//       toast.error("Failed to load items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Delete Item ----------
//   const handleDelete = async (id, tab) => {
//     try {
//       setSaving(true);
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/delete-application-tab`,
//         { id },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       if (res.data.success) {
//         toast.success(`${tab} item deleted successfully`);
//         fetchFooterItems(tab); // refresh same tab
//       } else toast.error(res.data.message || "Failed to delete item");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error deleting item");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------- Handle Edit ----------
//   const handleEdit = (item) => {
//     const tab = item.tab_name;
//     setEditId((prev) => ({ ...prev, [tab]: item.id }));
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: {
//         title: item.text || "",
//         isNew: item.new === 1,
//         type: item.url ? "url" : "document",
//         redirectUrl: item.url || "",
//         document: null,
//       },
//     }));
//   };

//   const handleCancelEdit = (tab) => {
//     setEditId((prev) => ({ ...prev, [tab]: null }));
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     }));
//   };

//   // ---------- Add / Update ----------
//   const handleAddSubmit = async (e, tab) => {
//     e.preventDefault();
//     const fd = formData[tab];
//     if (!fd.title) return toast.error("Please enter title");

//     const data = new FormData();
//     data.append("academic_id", selectedAcademic);
//     data.append("category", tab);
//     data.append("title", fd.title);
//     data.append("is_new", fd.isNew ? "1" : "0");
//     data.append("type", fd.type);
//     if (fd.type === "url") data.append("url", fd.redirectUrl);
//     else if (fd.document) data.append("file", fd.document);
//     if (editId[tab]) data.append("id", editId[tab]);

//     try {
//       setSaving(true);
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/update-application-tabs`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success(editId[tab] ? `${tab} updated` : `${tab} added`);
//         setFormData((prev) => ({
//           ...prev,
//           [tab]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//         }));
//         setEditId((prev) => ({ ...prev, [tab]: null }));
//         fetchFooterItems(tab);
//       } else toast.error(res.data.message || "Failed to save item");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error saving item");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------- Form Renderer ----------
//   const renderTabForm = (tabName) => {
//     const fd = formData[tabName];
//     const editing = !!editId[tabName];

//     return (
//       <form onSubmit={(e) => handleAddSubmit(e, tabName)} className="mt-6 border rounded-lg p-6 bg-gray-50">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label htmlFor={`${tabName}_title`} className="block mb-2">
//               Title *
//             </Label>
//             <TextInput
//               id={`${tabName}_title`}
//               value={fd.title}
//               onChange={(e) => handleInputChange(tabName, "title", e.target.value)}
//               placeholder="Enter title"
//               required
//             />
//           </div>

//           <div className="flex items-center gap-3 mt-6">
//             <ToggleSwitch
//               checked={fd.isNew}
//               label="Mark as New"
//               onChange={(checked) => handleInputChange(tabName, "isNew", checked)}
//             />
//           </div>

//           <div className="md:col-span-2 flex gap-6 mt-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name={`${tabName}_type`}
//                 value="url"
//                 checked={fd.type === "url"}
//                 onChange={() => handleInputChange(tabName, "type", "url")}
//               />
//               <span>Redirect URL</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name={`${tabName}_type`}
//                 value="document"
//                 checked={fd.type === "document"}
//                 onChange={() => handleInputChange(tabName, "type", "document")}
//               />
//               <span>Document Upload</span>
//             </label>
//           </div>

//           {fd.type === "url" ? (
//             <div className="md:col-span-2">
//               <Label className="block mb-2">Redirect URL</Label>
//               <TextInput
//                 placeholder="https://example.com"
//                 value={fd.redirectUrl}
//                 onChange={(e) => handleInputChange(tabName, "redirectUrl", e.target.value)}
//               />
//             </div>
//           ) : (
//             <div className="md:col-span-2">
//               <Label className="block mb-2">Upload Document</Label>
//               <FileInput
//                 accept=".pdf,.doc,.docx,.jpg,.png"
//                 onChange={(e) => handleInputChange(tabName, "document", e.target.files?.[0] || null)}
//               />
//             </div>
//           )}
//         </div>

//         <div className="flex justify-between mt-6 border-t pt-4">
//           {editing && (
//             <Button color="light" onClick={() => handleCancelEdit(tabName)} type="button" disabled={saving}>
//               Cancel Edit
//             </Button>
//           )}
//           <Button type="submit" disabled={saving}>
//             {saving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : editing ? "Update Item" : "Add Item"}
//           </Button>
//         </div>

//         {/* Existing List */}
//         <div className="mt-8">
//           <h4 className="font-semibold text-gray-700 mb-3">Existing Items</h4>
//           {tabItems[tabName]?.length === 0 ? (
//             <p className="text-gray-500 text-sm">No items found</p>
//           ) : (
//             <ul className="space-y-2">
//               {tabItems[tabName].map((item) => (
//                 <li key={item.id} className="p-3 border rounded-md bg-white flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">{item.text}</p>
//                     {/* {item.url && (
//                       <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm underline">
//                         View
//                       </a>
//                     )} */}
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       size="xs"
//                       onClick={() => handleEdit(item)}
//                       className="border border-blue-500 text-white hover:bg-blue-50 hover:border-blue-600 font-medium rounded-md transition-all duration-200"
//                     >
//                       ✏️ Edit
//                     </Button>
//                     <Button
//                       size="xs"
//                       onClick={() => handleDelete(item.id, tabName)}
//                       disabled={saving}
//                       className="border border-red-500 text-white hover:bg-red-50 hover:border-red-600 font-medium rounded-md transition-all duration-200"
//                     >
//                       🗑 Delete
//                     </Button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </form>
//     );
//   };

//   const handleInputChange = (tab, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: { ...prev[tab], [field]: value },
//     }));
//   };

//   if (!selectedAcademic)
//     return (
//       <Card className="p-6">
//         <p className="text-gray-500 italic">Please select an academic from above to edit footer details.</p>
//       </Card>
//     );

//   return (
//     <Card>
//       <div className="p-6">
//         {loading ? (
//           <Loader />
//         ) : (
//           <Tabs
//             aria-label="Content Tabs"
//             variant="underline"
//             activeKey={activeTab}
//             onActiveTabChange={(tabKey) => setActiveTab(tabKey)}
//           >
//             <Tabs.Item eventKey="application" icon={HiOutlineDocumentText} title="Application">
//               {renderTabForm("application")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="news" icon={HiOutlineDocumentText} title="News">
//               {renderTabForm("news")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="notification" icon={HiOutlineDocumentText} title="Notification">
//               {renderTabForm("notification")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="marquee" icon={HiOutlineDocumentText} title="Marquee">
//               {renderTabForm("marquee")}
//             </Tabs.Item>
//           </Tabs>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default ApplicationTabs;













// import React, { useEffect, useState } from "react";
// import {
//   Tabs,
//   Card,
//   Label,
//   TextInput,
//   Button,
//   Spinner,
//   FileInput,
//   ToggleSwitch,
// } from "flowbite-react";
// import { HiOutlineDocumentText } from "react-icons/hi";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import Loader from "src/Frontend/Common/Loader";

// const ApplicationTabs = ({ selectedAcademic, user, apiUrl }) => {
//   const [activeTab, setActiveTab] = useState(
//     localStorage.getItem("frontend_active_tab") || "application"
//   );
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);

//   const [formData, setFormData] = useState({
//     application: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     news: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     notification: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     marquee: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//   });

//   const [tabItems, setTabItems] = useState({
//     application: [],
//     news: [],
//     notification: [],
//     marquee: [],
//   });

//   const [editId, setEditId] = useState({
//     application: null,
//     news: null,
//     notification: null,
//     marquee: null,
//   });

//   // On mount, restore active tab from localStorage
//   useEffect(() => {
//     const savedTab = localStorage.getItem("frontend_active_tab");
//     if (savedTab) setActiveTab(savedTab);
//   }, []);

//   // Save active tab to localStorage on change (but DO NOT call fetch here!)
//   useEffect(() => {
//     localStorage.setItem("frontend_active_tab", activeTab);
//   }, [activeTab]);

//   // Fetch items ONLY when academic changes (never on tab change)
//   useEffect(() => {
//     if (!selectedAcademic) return;
//     fetchFooterItems(activeTab);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedAcademic]);

//   // ---------- Fetch Items ----------
//   const fetchFooterItems = async (tab = activeTab) => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/get-application-tabs`,
//         { academic_id: selectedAcademic },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );
//       if (res.data.success) {
//         const items = res.data.data;
//         const grouped = {
//           application: items.filter((i) => i.tab_name === "application"),
//           news: items.filter((i) => i.tab_name === "news"),
//           notification: items.filter((i) => i.tab_name === "notification"),
//           marquee: items.filter((i) => i.tab_name === "marquee"),
//         };
//         setTabItems(grouped);
//         // NO setActiveTab here!
//       } else {
//         toast.error(res.data.message || "Failed to load items");
//       }
//     } catch (e) {
//       toast.error("Failed to load items");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ---------- Delete Item ----------
//   const handleDelete = async (id, tab) => {
//     try {
//       setSaving(true);
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/delete-application-tab`,
//         { id },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       if (res.data.success) {
//         toast.success(`${tab} item deleted successfully`);
//         fetchFooterItems(tab); // stays on current tab
//       } else toast.error(res.data.message || "Failed to delete item");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error deleting item");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------- Handle Edit ----------
//   const handleEdit = (item) => {
//     const tab = item.tab_name;
//     setEditId((prev) => ({ ...prev, [tab]: item.id }));
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: {
//         title: item.text || "",
//         isNew: item.new === 1,
//         type: item.url ? "url" : "document",
//         redirectUrl: item.url || "",
//         document: null,
//       },
//     }));
//   };

//   const handleCancelEdit = (tab) => {
//     setEditId((prev) => ({ ...prev, [tab]: null }));
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//     }));
//   };

//   // ---------- Add / Update ----------
//   const handleAddSubmit = async (e, tab) => {
//     e.preventDefault();
//     const fd = formData[tab];
//     if (!fd.title) return toast.error("Please enter title");

//     const data = new FormData();
//     data.append("academic_id", selectedAcademic);
//     data.append("category", tab);
//     data.append("title", fd.title);
//     data.append("is_new", fd.isNew ? "1" : "0");
//     data.append("type", fd.type);
//     if (fd.type === "url") data.append("url", fd.redirectUrl);
//     else if (fd.document) data.append("file", fd.document);
//     if (editId[tab]) data.append("id", editId[tab]);

//     try {
//       setSaving(true);
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/update-application-tabs`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             "Content-Type": "multipart/form-data",
//           },
//         }
//       );

//       if (res.data.success) {
//         toast.success(editId[tab] ? `${tab} updated` : `${tab} added`);
//         setFormData((prev) => ({
//           ...prev,
//           [tab]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
//         }));
//         setEditId((prev) => ({ ...prev, [tab]: null }));
//         fetchFooterItems(tab); // stays on same tab
//       } else toast.error(res.data.message || "Failed to save item");
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Error saving item");
//     } finally {
//       setSaving(false);
//     }
//   };

//   // ---------- Form Renderer ----------
//   const renderTabForm = (tabName) => {
//     const fd = formData[tabName];
//     const editing = !!editId[tabName];

//     return (
//       <form onSubmit={(e) => handleAddSubmit(e, tabName)} className="mt-6 border rounded-lg p-6 bg-gray-50">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <Label htmlFor={`${tabName}_title`} className="block mb-2">
//               Title *
//             </Label>
//             <TextInput
//               id={`${tabName}_title`}
//               value={fd.title}
//               onChange={(e) => handleInputChange(tabName, "title", e.target.value)}
//               placeholder="Enter title"
//               required
//             />
//           </div>
//           <div className="flex items-center gap-3 mt-6">
//             <ToggleSwitch
//               checked={fd.isNew}
//               label="Mark as New"
//               onChange={(checked) => handleInputChange(tabName, "isNew", checked)}
//             />
//           </div>
//           <div className="md:col-span-2 flex gap-6 mt-4">
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name={`${tabName}_type`}
//                 value="url"
//                 checked={fd.type === "url"}
//                 onChange={() => handleInputChange(tabName, "type", "url")}
//               />
//               <span>Redirect URL</span>
//             </label>
//             <label className="flex items-center gap-2">
//               <input
//                 type="radio"
//                 name={`${tabName}_type`}
//                 value="document"
//                 checked={fd.type === "document"}
//                 onChange={() => handleInputChange(tabName, "type", "document")}
//               />
//               <span>Document Upload</span>
//             </label>
//           </div>
//           {fd.type === "url" ? (
//             <div className="md:col-span-2">
//               <Label className="block mb-2">Redirect URL</Label>
//               <TextInput
//                 placeholder="https://example.com"
//                 value={fd.redirectUrl}
//                 onChange={(e) => handleInputChange(tabName, "redirectUrl", e.target.value)}
//               />
//             </div>
//           ) : (
//             <div className="md:col-span-2">
//               <Label className="block mb-2">Upload Document</Label>
//               <FileInput
//                 accept=".pdf,.doc,.docx,.jpg,.png"
//                 onChange={(e) => handleInputChange(tabName, "document", e.target.files?.[0] || null)}
//               />
//             </div>
//           )}
//         </div>
//         <div className="flex justify-between mt-6 border-t pt-4">
//           {editing && (
//             <Button color="light" onClick={() => handleCancelEdit(tabName)} type="button" disabled={saving}>
//               Cancel Edit
//             </Button>
//           )}
//           <Button type="submit" disabled={saving}>
//             {saving ? <><Spinner size="sm" className="mr-2" /> Saving...</> : editing ? "Update Item" : "Add Item"}
//           </Button>
//         </div>
//         {/* Existing List */}
//         <div className="mt-8">
//           <h4 className="font-semibold text-gray-700 mb-3">Existing Items</h4>
//           {tabItems[tabName]?.length === 0 ? (
//             <p className="text-gray-500 text-sm">No items found</p>
//           ) : (
//             <ul className="space-y-2">
//               {tabItems[tabName].map((item) => (
//                 <li key={item.id} className="p-3 border rounded-md bg-white flex justify-between items-center">
//                   <div>
//                     <p className="font-medium">{item.text}</p>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       size="xs"
//                       onClick={() => handleEdit(item)}
//                       className="border border-blue-500 text-white hover:bg-blue-50 hover:border-blue-600 font-medium rounded-md transition-all duration-200"
//                     >
//                       ✏️ Edit
//                     </Button>
//                     <Button
//                       size="xs"
//                       onClick={() => handleDelete(item.id, tabName)}
//                       disabled={saving}
//                       className="border border-red-500 text-white hover:bg-red-50 hover:border-red-600 font-medium rounded-md transition-all duration-200"
//                     >
//                       🗑 Delete
//                     </Button>
//                   </div>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </div>
//       </form>
//     );
//   };

//   const handleInputChange = (tab, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [tab]: { ...prev[tab], [field]: value },
//     }));
//   };

//   if (!selectedAcademic)
//     return (
//       <Card className="p-6">
//         <p className="text-gray-500 italic">Please select an academic from above to edit footer details.</p>
//       </Card>
//     );

//   return (
//     <Card>
//       <div className="p-6">
//         {loading ? (
//           <Loader />
//         ) : (
//           <Tabs
//             aria-label="Content Tabs"
//             variant="underline"
//             activeKey={activeTab}
//             onActiveTabChange={setActiveTab} // tab click par sirf yahin change kare
//           >
//             <Tabs.Item eventKey="application" icon={HiOutlineDocumentText} title="Application">
//               {renderTabForm("application")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="news" icon={HiOutlineDocumentText} title="News">
//               {renderTabForm("news")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="notification" icon={HiOutlineDocumentText} title="Notification">
//               {renderTabForm("notification")}
//             </Tabs.Item>
//             <Tabs.Item eventKey="marquee" icon={HiOutlineDocumentText} title="Marquee">
//               {renderTabForm("marquee")}
//             </Tabs.Item>
//           </Tabs>
//         )}
//       </div>
//     </Card>
//   );
// };

// export default ApplicationTabs;





























import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const tabButtonClass = (active) =>
  `inline-block px-6 py-3 cursor-pointer text-sm font-medium border-b-2 ${
    active
      ? "border-blue-700 text-blue-700"
      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
  } transition-colors`;

const TAB_KEYS = ["application", "news", "notification", "marquee"];
const TAB_TITLES = ["Application", "News", "Notification", "Marquee"];

const ApplicationTabs = ({ selectedAcademic, user, apiUrl }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    application: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
    news: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
    notification: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
    marquee: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
  });

  const [tabItems, setTabItems] = useState({
    application: [],
    news: [],
    notification: [],
    marquee: [],
  });

  const [editId, setEditId] = useState({
    application: null,
    news: null,
    notification: null,
    marquee: null,
  });

  useEffect(() => {
    if (!selectedAcademic) return;
    fetchFooterItems();
  }, [selectedAcademic]);

  const fetchFooterItems = async () => {
    setLoading(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/get-application-tabs`,
        { academic_id: selectedAcademic },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (res.data.success) {
        const items = res.data.data;
        setTabItems({
          application: items.filter((i) => i.tab_name === "application"),
          news: items.filter((i) => i.tab_name === "news"),
          notification: items.filter((i) => i.tab_name === "notification"),
          marquee: items.filter((i) => i.tab_name === "marquee"),
        });
      } else {
        toast.error(res.data.message || "Failed to load items");
      }
    } catch (error) {
      toast.error("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, tabKey) => {
    setSaving(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/delete-application-tab`,
        { id },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );
      if (res.data.success) {
        toast.success(`${tabKey} item deleted successfully`);
        fetchFooterItems();
      } else {
        toast.error(res.data.message || "Failed to delete item");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting item");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const tabKey = item.tab_name;
    setEditId((prev) => ({ ...prev, [tabKey]: item.id }));
    setFormData((prev) => ({
      ...prev,
      [tabKey]: {
        title: item.text || "",
        isNew: item.new === 1,
        type: item.url ? "url" : "document",
        redirectUrl: item.url || "",
        document: null,
      },
    }));
    const idx = TAB_KEYS.indexOf(tabKey);
    if (idx >= 0) setActiveTab(idx);
  };

  const handleCancelEdit = (tabKey) => {
    setEditId((prev) => ({ ...prev, [tabKey]: null }));
    setFormData((prev) => ({
      ...prev,
      [tabKey]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
    }));
  };

  const handleAddSubmit = async (e, tabKey) => {
    e.preventDefault();

    setActiveTab(TAB_KEYS.indexOf(tabKey));

    const fd = formData[tabKey];
    if (!fd.title) {
      toast.error("Please enter title");
      return;
    }

    const data = new FormData();
    data.append("academic_id", selectedAcademic);
    data.append("category", tabKey);
    data.append("title", fd.title);
    data.append("is_new", fd.isNew ? "1" : "0");
    data.append("type", fd.type);
    if (fd.type === "url") data.append("url", fd.redirectUrl);
    else if (fd.document) data.append("file", fd.document);
    if (editId[tabKey]) data.append("id", editId[tabKey]);

    setSaving(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-application-tabs`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (res.data.success) {
        toast.success(editId[tabKey] ? `${tabKey} updated` : `${tabKey} added`);
        setFormData((prev) => ({
          ...prev,
          [tabKey]: { title: "", isNew: false, type: "url", redirectUrl: "", document: null },
        }));
        setEditId((prev) => ({ ...prev, [tabKey]: null }));
        fetchFooterItems();
      } else {
        toast.error(res.data.message || "Failed to save item");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving item");
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (tabKey, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [tabKey]: { ...prev[tabKey], [field]: value },
    }));
  };

  if (!selectedAcademic)
    return (
      <div className="p-6 bg-white rounded shadow text-gray-500 italic">
        Please select an academic from above to edit footer details.
      </div>
    );

  const currentTabKey = TAB_KEYS[activeTab];

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">

      {/* Tabs */}
      <div className="flex border-b border-gray-300 mb-6">
        {TAB_TITLES.map((title, idx) => (
          <button
            key={title}
            type="button"
            onClick={() => setActiveTab(idx)}
            className={`inline-block px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === idx
                ? "border-blue-700 text-blue-700"
                : "border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900"
            }`}
            aria-current={activeTab === idx ? "page" : undefined}
          >
            {title}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className=" p-6 rounded-lg shadow-sm">

        {loading ? (
          <div className="text-center text-gray-500">Loading...</div>
        ) : (
          <form onSubmit={(e) => handleAddSubmit(e, currentTabKey)} className="space-y-6">
            <div>
              <label
                htmlFor={`${currentTabKey}-title`}
                className="block mb-2 font-semibold text-gray-700"
              >
                Title *
              </label>
              <input
                id={`${currentTabKey}-title`}
                type="text"
                value={formData[currentTabKey].title}
                onChange={(e) => handleInputChange(currentTabKey, "title", e.target.value)}
                required
                className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="inline-flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData[currentTabKey].isNew}
                  onChange={(e) => handleInputChange(currentTabKey, "isNew", e.target.checked)}
                  className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                />
                <span>Mark as New</span>
              </label>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Type</label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${currentTabKey}-type`}
                    value="url"
                    checked={formData[currentTabKey].type === "url"}
                    onChange={() => handleInputChange(currentTabKey, "type", "url")}
                    className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span>Redirect URL</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${currentTabKey}-type`}
                    value="document"
                    checked={formData[currentTabKey].type === "document"}
                    onChange={() => handleInputChange(currentTabKey, "type", "document")}
                    className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span>Document Upload</span>
                </label>
              </div>
            </div>

            {formData[currentTabKey].type === "url" ? (
              <div>
                <label
                  htmlFor={`${currentTabKey}-redirectUrl`}
                  className="block mb-2 font-semibold text-gray-700"
                >
                  Redirect URL
                </label>
                <input
                  id={`${currentTabKey}-redirectUrl`}
                  type="url"
                  value={formData[currentTabKey].redirectUrl}
                  onChange={(e) => handleInputChange(currentTabKey, "redirectUrl", e.target.value)}
                  className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
                />
              </div>
            ) : (
              // <div>
              //   <label
              //     htmlFor={`${currentTabKey}-file`}
              //     className="block mb-2 font-medium text-gray-700"
              //   >
              //     Upload Document
              //   </label>
              //   <input
              //     id={`${currentTabKey}-file`}
              //     type="file"
              //     accept=".pdf,.doc,.docx,.jpg,.png"
              //     onChange={(e) => handleInputChange(currentTabKey, "document", e.target.files?.[0] || null)}
              //     className="w-full text-gray-700"
              //   />
              // </div>
              <div>
  <label
    htmlFor={`${currentTabKey}-file`}
    className="block mb-2 font-semibold text-gray-700"
  >
    Upload Document
  </label>

  {/* Hidden file input */}
  <input
    id={`${currentTabKey}-file`}
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.png"
    onChange={(e) => handleInputChange(currentTabKey, "document", e.target.files?.[0] || null)}
    className="hidden"
  />

  {/* Styled button to trigger file dialog */}
  <label
    htmlFor={`${currentTabKey}-file`}
    className="inline-block cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
  >
    Choose File
  </label>

  {/* Optional: Show selected file name */}
  {formData[currentTabKey].document && (
    <p className="mt-2 text-gray-700 text-sm">{formData[currentTabKey].document.name}</p>
  )}
</div>

            )}

            <div className="flex justify-between">
              {editId[currentTabKey] && (
                <button
                  type="button"
                  onClick={() => handleCancelEdit(currentTabKey)}
                  disabled={saving}
                  className="px-4 py-2 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  Cancel Edit
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : editId[currentTabKey] ? "Update Item" : "Add Item"}
              </button>
            </div>

            <div>
              <h3 className="font-semibold  mb-4">Existing Items</h3>
              {tabItems[currentTabKey].length === 0 ? (
                <p className="text-gray-500">No items found</p>
              ) : (
                <ul className="space-y-2">
                  {tabItems[currentTabKey].map((item) => (
                    <li
                      key={item.id}
                      className="flex justify-between items-center p-3 rounded border border-gray-300 bg-white"
                    >
                      <span>{item.text}</span>
                      <div className="space-x-2">
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs bg-blue-600 text-white hover:bg-blue-700"
                          onClick={() => handleEdit(item)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
                          onClick={() => handleDelete(item.id, currentTabKey)}
                          disabled={saving}
                        >
                          🗑 Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ApplicationTabs;
