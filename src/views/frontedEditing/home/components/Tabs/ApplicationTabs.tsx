import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const TAB_KEYS = ['application', 'news', 'notification', 'marquee'];
const TAB_TITLES = ['Application', 'News', 'Notification', 'Marquee'];

const ApplicationTabs = ({ selectedAcademic, user, apiUrl }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  // 初始化表单数据，包含日期和时间字段
  const [formData, setFormData] = useState({
    application: {
      title: '',
      isNew: false,
      type: 'url',
      redirectUrl: '',
      full_url: '',
      document: null,
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
    },
    news: {
      title: '',
      isNew: false,
      type: 'url',
      full_url: '',
      redirectUrl: '',
      document: null,
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
    },
    notification: {
      title: '',
      isNew: false,
      type: 'url',
      redirectUrl: '',
      full_url: '',
      document: null,
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
    },
    marquee: {
      title: '',
      isNew: false,
      type: 'url',
      redirectUrl: '',
      full_url: '',
      document: null,
      startDate: '',
      startTime: '00:00',
      endDate: '',
      endTime: '23:59',
    },
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
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );
      if (res.data.success) {
        const items = res.data.data;
        setTabItems({
          application: items.filter((i) => i.tab_name === 'application'),
          news: items.filter((i) => i.tab_name === 'news'),
          notification: items.filter((i) => i.tab_name === 'notification'),
          marquee: items.filter((i) => i.tab_name === 'marquee'),
        });
      } else {
        toast.error(res.data.message || 'Failed to load items');
      }
    } catch (error) {
      toast.error('Failed to load items');
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
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );
      if (res.data.success) {
        toast.success(`${tabKey} item deleted successfully`);
        fetchFooterItems();
      } else {
        toast.error(res.data.message || 'Failed to delete item');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error deleting item');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (item) => {
    const tabKey = item.tab_name;
    setEditId((prev) => ({ ...prev, [tabKey]: item.id }));

    let startDate = '';
    let startTime = '00:00';
    let endDate = '';
    let endTime = '23:59';

    if (item.start_date) {
      if (item.start_date.includes(' ')) {
        const [datePart, timePart] = item.start_date.split(' ');
        startDate = datePart;
        startTime = timePart.substring(0, 5); // 只取 HH:mm
      } else {
        startDate = item.start_date;
      }
    }

    if (item.end_date) {
      if (item.end_date.includes(' ')) {
        const [datePart, timePart] = item.end_date.split(' ');
        endDate = datePart;
        endTime = timePart.substring(0, 5); // 只取 HH:mm
      } else {
        endDate = item.end_date;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [tabKey]: {
        title: item.text || '',
        isNew: item.new === '1',
        type: item.url ? 'url' : 'document',
        redirectUrl: item.url || '',
        full_url: item.full_url || '',
        document: null,
        startDate,
        startTime,
        endDate,
        endTime,
      },
    }));
    const idx = TAB_KEYS.indexOf(tabKey);
    if (idx >= 0) setActiveTab(idx);
  };

  const handleCancelEdit = (tabKey) => {
    setEditId((prev) => ({ ...prev, [tabKey]: null }));
    setFormData((prev) => ({
      ...prev,
      [tabKey]: {
        title: '',
        isNew: false,
        type: 'url',
        redirectUrl: '',
        full_url: '',
        document: null,
        startDate: '',
        startTime: '00:00',
        endDate: '',
        endTime: '23:59',
      },
    }));
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, id, tabKey) => {
    setDraggingId(id);
    e.dataTransfer.setData('text/plain', `${id},${tabKey}`);
    e.currentTarget.style.opacity = '0.4';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  };

  const handleDragLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
  };

  const handleDrop = async (e, targetId, tabKey) => {
    e.preventDefault();
    e.currentTarget.style.backgroundColor = '';

    const data = e.dataTransfer.getData('text/plain').split(',');
    const sourceId = parseInt(data[0]);
    const sourceTabKey = data[1];

    if (sourceId === targetId || sourceTabKey !== tabKey) return;

    // Reorder items locally
    const items = [...tabItems[tabKey]];
    const sourceIndex = items.findIndex((item) => item.id === sourceId);
    const targetIndex = items.findIndex((item) => item.id === targetId);

    if (sourceIndex === -1 || targetIndex === -1) return;

    const [movedItem] = items.splice(sourceIndex, 1);
    items.splice(targetIndex, 0, movedItem);

    // Update local state
    setTabItems((prev) => ({
      ...prev,
      [tabKey]: items,
    }));

    // Update order in backend
    await updateItemOrder(items, tabKey);

    setDraggingId(null);
  };

  const handleDragEnd = (e) => {
    e.currentTarget.style.opacity = '1';
    setDraggingId(null);
  };

  const updateItemOrder = async (items, tabKey) => {
    try {
      const orderData = items.map((item, index) => ({
        id: item.id,
        display_order: index + 1,
      }));

      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-application-tab-order`,
        {
          academic_id: selectedAcademic,
          tab_name: tabKey,
          order_data: orderData,
        },
        { headers: { Authorization: `Bearer ${user?.token}` } },
      );

      if (res.data.success) {
        toast.success(`Order updated successfully`);
      } else {
        toast.error(res.data.message || 'Failed to update order');
        // Revert to original order if update fails
        fetchFooterItems();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating order');
      // Revert to original order if update fails
      fetchFooterItems();
    }
  };

  const handleAddSubmit = async (e, tabKey) => {
    e.preventDefault();

    setActiveTab(TAB_KEYS.indexOf(tabKey));

    const fd = formData[tabKey];
    if (!fd.title) {
      toast.error('Please enter title');
      return;
    }

    // Date validation
    if (fd.startDate && fd.endDate) {
      const startDateTime = `${fd.startDate} ${fd.startTime}:00`;
      const endDateTime = `${fd.endDate} ${fd.endTime}:00`;
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);
      if (start > end) {
        toast.error('Start date/time cannot be after end date/time');
        return;
      }
    }

    const data = new FormData();
    data.append('academic_id', selectedAcademic);
    data.append('category', tabKey);
    data.append('title', fd.title);
    data.append('is_new', fd.isNew ? '1' : '0');
    data.append('type', fd.type);

    if (fd.type === 'url') data.append('url', fd.redirectUrl);
    else if (fd.document) data.append('file', fd.document);

    // Add start and end dates with time
    if (fd.startDate) {
      const startDateTime = `${fd.startDate} ${fd.startTime}:00`;
      data.append('start_date', startDateTime);
    }

    if (fd.endDate) {
      const endDateTime = `${fd.endDate} ${fd.endTime}:00`;
      data.append('end_date', endDateTime);
    }

    if (editId[tabKey]) data.append('id', editId[tabKey]);

    setSaving(true);
    try {
      const res = await axios.post(
        `${apiUrl}/${user?.role}/FrontendEditing/update-application-tabs`,
        data,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );
      if (res.data.success) {
        toast.success(editId[tabKey] ? `${tabKey} updated` : `${tabKey} added`);
        setFormData((prev) => ({
          ...prev,
          [tabKey]: {
            title: '',
            isNew: false,
            type: 'url',
            redirectUrl: '',
            full_url: '',
            document: null,
            startDate: '',
            startTime: '00:00',
            endDate: '',
            endTime: '23:59',
          },
        }));
        setEditId((prev) => ({ ...prev, [tabKey]: null }));
        fetchFooterItems();
      } else {
        toast.error(res.data.message || 'Failed to save item');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving item');
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

  // Format date for display with time
  const formatDateTimeForDisplay = (dateTimeString) => {
    if (!dateTimeString) return 'Not set';

    try {
      const date = new Date(dateTimeString);
      if (dateTimeString.includes(' ')) {
        const [datePart, timePart] = dateTimeString.split(' ');
        const time = timePart.substring(0, 5); // HH:mm
        return `${date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })} at ${time}`;
      } else {
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
      }
    } catch (error) {
      return dateTimeString;
    }
  };

  // Check if item is currently active based on dates and times
  const isItemActive = (item) => {
    if (!item.start_date && !item.end_date) return true; // No date restriction

    const now = new Date();

    if (item.start_date && item.end_date) {
      const start = new Date(item.start_date);
      const end = new Date(item.end_date);
      return now >= start && now <= end;
    } else if (item.start_date && !item.end_date) {
      const start = new Date(item.start_date);
      return now >= start;
    } else if (!item.start_date && item.end_date) {
      const end = new Date(item.end_date);
      return now <= end;
    }

    return true;
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
                ? 'border-blue-700 text-blue-700'
                : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
            aria-current={activeTab === idx ? 'page' : undefined}
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
                onChange={(e) => handleInputChange(currentTabKey, 'title', e.target.value)}
                required
                className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="inline-flex items-center space-x-2 text-gray-700">
                <input
                  type="checkbox"
                  checked={formData[currentTabKey].isNew}
                  onChange={(e) => handleInputChange(currentTabKey, 'isNew', e.target.checked)}
                  className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                />
                <span>Mark as New</span>
              </label>
            </div>

            {/* Start Date and Time Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">
                  Start Date & Time (Optional)
                </h4>
                <div>
                  <label
                    htmlFor={`${currentTabKey}-startDate`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Start Date
                  </label>
                  <input
                    id={`${currentTabKey}-startDate`}
                    type="date"
                    value={formData[currentTabKey].startDate}
                    onChange={(e) => handleInputChange(currentTabKey, 'startDate', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-700 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${currentTabKey}-startTime`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    Start Time
                  </label>
                  <input
                    id={`${currentTabKey}-startTime`}
                    type="time"
                    value={formData[currentTabKey].startTime}
                    onChange={(e) => handleInputChange(currentTabKey, 'startTime', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-700 focus:outline-none transition"
                    step="300" // 5分钟间隔
                  />
                </div>
              </div>

              {/* End Date and Time Fields */}
              <div className="space-y-4">
                <h4 className="font-medium text-gray-700 border-b pb-2">
                  End Date & Time (Optional)
                </h4>
                <div>
                  <label
                    htmlFor={`${currentTabKey}-endDate`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    End Date
                  </label>
                  <input
                    id={`${currentTabKey}-endDate`}
                    type="date"
                    value={formData[currentTabKey].endDate}
                    onChange={(e) => handleInputChange(currentTabKey, 'endDate', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-700 focus:outline-none transition"
                  />
                </div>
                <div>
                  <label
                    htmlFor={`${currentTabKey}-endTime`}
                    className="block mb-2 font-medium text-gray-700"
                  >
                    End Time
                  </label>
                  <input
                    id={`${currentTabKey}-endTime`}
                    type="time"
                    value={formData[currentTabKey].endTime}
                    onChange={(e) => handleInputChange(currentTabKey, 'endTime', e.target.value)}
                    className="w-full p-2 rounded-lg border border-gray-300 text-gray-900 focus:border-blue-700 focus:outline-none transition"
                    step="300" // 5分钟间隔
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700">Type</label>
              <div className="flex space-x-6">
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${currentTabKey}-type`}
                    value="url"
                    checked={formData[currentTabKey].type === 'url'}
                    onChange={() => handleInputChange(currentTabKey, 'type', 'url')}
                    className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span>Redirect URL</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input
                    type="radio"
                    name={`${currentTabKey}-type`}
                    value="document"
                    checked={formData[currentTabKey].type === 'document'}
                    onChange={() => handleInputChange(currentTabKey, 'type', 'document')}
                    className="rounded text-blue-600 focus:ring focus:ring-blue-300"
                  />
                  <span>Document Upload</span>
                </label>
              </div>
            </div>

            {formData[currentTabKey].type === 'url' ? (
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
                  value={formData[currentTabKey].full_url}
                  onChange={(e) => {
                    const value = e.target.value;

                    setFormData((prev) => ({
                      ...prev,
                      [currentTabKey]: {
                        ...prev[currentTabKey],
                        full_url: value, // 👈 UI value (input)
                        redirectUrl: value, // 👈 submit value (default)
                      },
                    }));
                  }}
                  className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
                />
              </div>
            ) : (
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
                  onChange={(e) =>
                    handleInputChange(currentTabKey, 'document', e.target.files?.[0] || null)
                  }
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
                  <p className="mt-2 text-gray-700 text-sm">
                    {formData[currentTabKey].document.name}
                  </p>
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
                {saving ? 'Saving...' : editId[currentTabKey] ? 'Update Item' : 'Add Item'}
              </button>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Existing Items</h3>
              {tabItems[currentTabKey].length === 0 ? (
                <p className="text-gray-500">No items found</p>
              ) : (
                <ul className="space-y-2">
                  {tabItems[currentTabKey].map((item, index) => (
                    <li
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id, currentTabKey)}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, item.id, currentTabKey)}
                      onDragEnd={handleDragEnd}
                      className={`flex justify-between items-center p-3 rounded border border-gray-300 bg-white cursor-move transition-all ${
                        draggingId === item.id ? 'opacity-40' : 'opacity-100'
                      } ${!isItemActive(item) ? 'opacity-60 bg-gray-50' : ''}`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-1">
                          <span className="text-gray-400 text-lg">⋮⋮</span>
                          <span className="text-sm text-gray-500 w-6 text-center">
                            {index + 1}.
                          </span>
                          <span className="font-medium">{item.text}</span>
                          {item.new === '1' && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                              New
                            </span>
                          )}
                          {!isItemActive(item) && (
                            <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                              Inactive
                            </span>
                          )}
                        </div>

                        {/* Date and Time information */}
                        <div className="ml-10 text-xs text-gray-500 space-y-1">
                          {(item.start_date || item.end_date) && (
                            <div className="space-y-1">
                              <div>
                                <span className="font-medium">Visibility Period: </span>
                              </div>
                              {item.start_date && (
                                <div className="ml-2">
                                  <span className="font-medium">From: </span>
                                  <span>{formatDateTimeForDisplay(item.start_date)}</span>
                                </div>
                              )}
                              {item.end_date && (
                                <div className="ml-2">
                                  <span className="font-medium">Until: </span>
                                  <span>{formatDateTimeForDisplay(item.end_date)}</span>
                                </div>
                              )}
                            </div>
                          )}
                          {item.url && (
                            <div>
                              <span className="font-medium">URL: </span>
                              <span className="truncate">{item.url}</span>
                            </div>
                          )}
                        </div>
                      </div>
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

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-hot-toast';

// const tabButtonClass = (active) =>
//   `inline-block px-6 py-3 cursor-pointer text-sm font-medium border-b-2 ${
//     active
//       ? 'border-blue-700 text-blue-700'
//       : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
//   } transition-colors`;

// const TAB_KEYS = ['application', 'news', 'notification', 'marquee'];
// const TAB_TITLES = ['Application', 'News', 'Notification', 'Marquee'];

// const ApplicationTabs = ({ selectedAcademic, user, apiUrl }) => {
//   const [activeTab, setActiveTab] = useState(0);
//   const [loading, setLoading] = useState(false);
//   const [saving, setSaving] = useState(false);
//   const [draggingId, setDraggingId] = useState(null);

//   const [formData, setFormData] = useState({
//     application: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
//     news: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
//     notification: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
//     marquee: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
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

//   useEffect(() => {
//     if (!selectedAcademic) return;
//     fetchFooterItems();
//   }, [selectedAcademic]);

//   const fetchFooterItems = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/get-application-tabs`,
//         { academic_id: selectedAcademic },
//         { headers: { Authorization: `Bearer ${user?.token}` } },
//       );
//       if (res.data.success) {
//         const items = res.data.data;
//         setTabItems({
//           application: items.filter((i) => i.tab_name === 'application'),
//           news: items.filter((i) => i.tab_name === 'news'),
//           notification: items.filter((i) => i.tab_name === 'notification'),
//           marquee: items.filter((i) => i.tab_name === 'marquee'),
//         });
//       } else {
//         toast.error(res.data.message || 'Failed to load items');
//       }
//     } catch (error) {
//       toast.error('Failed to load items');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id, tabKey) => {
//     setSaving(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/delete-application-tab`,
//         { id },
//         { headers: { Authorization: `Bearer ${user?.token}` } },
//       );
//       if (res.data.success) {
//         toast.success(`${tabKey} item deleted successfully`);
//         fetchFooterItems();
//       } else {
//         toast.error(res.data.message || 'Failed to delete item');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error deleting item');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleEdit = (item) => {
//     const tabKey = item.tab_name;
//     setEditId((prev) => ({ ...prev, [tabKey]: item.id }));
//     setFormData((prev) => ({
//       ...prev,
//       [tabKey]: {
//         title: item.text || '',
//         isNew: item.new === '1',
//         type: item.url ? 'url' : 'document',
//         redirectUrl: item.url || '',
//         document: null,
//       },
//     }));
//     const idx = TAB_KEYS.indexOf(tabKey);
//     if (idx >= 0) setActiveTab(idx);
//   };

//   const handleCancelEdit = (tabKey) => {
//     setEditId((prev) => ({ ...prev, [tabKey]: null }));
//     setFormData((prev) => ({
//       ...prev,
//       [tabKey]: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
//     }));
//   };

//   // Drag and Drop Handlers
//   const handleDragStart = (e, id, tabKey) => {
//     setDraggingId(id);
//     e.dataTransfer.setData('text/plain', `${id},${tabKey}`);
//     e.currentTarget.style.opacity = '0.4';
//   };

//   const handleDragOver = (e) => {
//     e.preventDefault();
//     e.currentTarget.style.backgroundColor = '#f3f4f6';
//   };

//   const handleDragLeave = (e) => {
//     e.currentTarget.style.backgroundColor = '';
//   };

//   const handleDrop = async (e, targetId, tabKey) => {
//     e.preventDefault();
//     e.currentTarget.style.backgroundColor = '';

//     const data = e.dataTransfer.getData('text/plain').split(',');
//     const sourceId = parseInt(data[0]);
//     const sourceTabKey = data[1];

//     if (sourceId === targetId || sourceTabKey !== tabKey) return;

//     // Reorder items locally
//     const items = [...tabItems[tabKey]];
//     const sourceIndex = items.findIndex(item => item.id === sourceId);
//     const targetIndex = items.findIndex(item => item.id === targetId);

//     if (sourceIndex === -1 || targetIndex === -1) return;

//     const [movedItem] = items.splice(sourceIndex, 1);
//     items.splice(targetIndex, 0, movedItem);

//     // Update local state
//     setTabItems(prev => ({
//       ...prev,
//       [tabKey]: items
//     }));

//     // Update order in backend
//     await updateItemOrder(items, tabKey);

//     setDraggingId(null);
//   };

//   const handleDragEnd = (e) => {
//     e.currentTarget.style.opacity = '1';
//     setDraggingId(null);
//   };

//   const updateItemOrder = async (items, tabKey) => {
//     try {
//       const orderData = items.map((item, index) => ({
//         id: item.id,
//         display_order: index + 1
//       }));

//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/update-application-tab-order`,
//         {
//           academic_id: selectedAcademic,
//           tab_name: tabKey,
//           order_data: orderData
//         },
//         { headers: { Authorization: `Bearer ${user?.token}` } }
//       );

//       if (res.data.success) {
//         toast.success(`Order updated successfully`);
//       } else {
//         toast.error(res.data.message || 'Failed to update order');
//         // Revert to original order if update fails
//         fetchFooterItems();
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error updating order');
//       // Revert to original order if update fails
//       fetchFooterItems();
//     }
//   };

//   const handleAddSubmit = async (e, tabKey) => {
//     e.preventDefault();

//     setActiveTab(TAB_KEYS.indexOf(tabKey));

//     const fd = formData[tabKey];
//     if (!fd.title) {
//       toast.error('Please enter title');
//       return;
//     }

//     const data = new FormData();
//     data.append('academic_id', selectedAcademic);
//     data.append('category', tabKey);
//     data.append('title', fd.title);
//     data.append('is_new', fd.isNew ? '1' : '0');
//     data.append('type', fd.type);
//     if (fd.type === 'url') data.append('url', fd.redirectUrl);
//     else if (fd.document) data.append('file', fd.document);
//     if (editId[tabKey]) data.append('id', editId[tabKey]);

//     setSaving(true);
//     try {
//       const res = await axios.post(
//         `${apiUrl}/${user?.role}/FrontendEditing/update-application-tabs`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${user?.token}`,
//             'Content-Type': 'multipart/form-data',
//           },
//         },
//       );
//       if (res.data.success) {
//         toast.success(editId[tabKey] ? `${tabKey} updated` : `${tabKey} added`);
//         setFormData((prev) => ({
//           ...prev,
//           [tabKey]: { title: '', isNew: false, type: 'url', redirectUrl: '', document: null },
//         }));
//         setEditId((prev) => ({ ...prev, [tabKey]: null }));
//         fetchFooterItems();
//       } else {
//         toast.error(res.data.message || 'Failed to save item');
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Error saving item');
//     } finally {
//       setSaving(false);
//     }
//   };

//   const handleInputChange = (tabKey, field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [tabKey]: { ...prev[tabKey], [field]: value },
//     }));
//   };

//   if (!selectedAcademic)
//     return (
//       <div className="p-6 bg-white rounded shadow text-gray-500 italic">
//         Please select an academic from above to edit footer details.
//       </div>
//     );

//   const currentTabKey = TAB_KEYS[activeTab];

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-white shadow rounded">
//       {/* Tabs */}
//       <div className="flex border-b border-gray-300 mb-6">
//         {TAB_TITLES.map((title, idx) => (
//           <button
//             key={title}
//             type="button"
//             onClick={() => setActiveTab(idx)}
//             className={`inline-block px-6 py-3 text-sm font-semibold border-b-2 transition-colors ${
//               activeTab === idx
//                 ? 'border-blue-700 text-blue-700'
//                 : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900'
//             }`}
//             aria-current={activeTab === idx ? 'page' : undefined}
//           >
//             {title}
//           </button>
//         ))}
//       </div>

//       {/* Tab Content Container */}
//       <div className=" p-6 rounded-lg shadow-sm">
//         {loading ? (
//           <div className="text-center text-gray-500">Loading...</div>
//         ) : (
//           <form onSubmit={(e) => handleAddSubmit(e, currentTabKey)} className="space-y-6">
//             <div>
//               <label
//                 htmlFor={`${currentTabKey}-title`}
//                 className="block mb-2 font-semibold text-gray-700"
//               >
//                 Title *
//               </label>
//               <input
//                 id={`${currentTabKey}-title`}
//                 type="text"
//                 value={formData[currentTabKey].title}
//                 onChange={(e) => handleInputChange(currentTabKey, 'title', e.target.value)}
//                 required
//                 className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
//               />
//             </div>

//             <div>
//               <label className="inline-flex items-center space-x-2 text-gray-700">
//                 <input
//                   type="checkbox"
//                   checked={formData[currentTabKey].isNew}
//                   onChange={(e) => handleInputChange(currentTabKey, 'isNew', e.target.checked)}
//                   className="rounded text-blue-600 focus:ring focus:ring-blue-300"
//                 />
//                 <span>Mark as New</span>
//               </label>
//             </div>

//             <div>
//               <label className="block mb-2 font-medium text-gray-700">Type</label>
//               <div className="flex space-x-6">
//                 <label className="inline-flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     name={`${currentTabKey}-type`}
//                     value="url"
//                     checked={formData[currentTabKey].type === 'url'}
//                     onChange={() => handleInputChange(currentTabKey, 'type', 'url')}
//                     className="rounded text-blue-600 focus:ring focus:ring-blue-300"
//                   />
//                   <span>Redirect URL</span>
//                 </label>
//                 <label className="inline-flex items-center space-x-2">
//                   <input
//                     type="radio"
//                     name={`${currentTabKey}-type`}
//                     value="document"
//                     checked={formData[currentTabKey].type === 'document'}
//                     onChange={() => handleInputChange(currentTabKey, 'type', 'document')}
//                     className="rounded text-blue-600 focus:ring focus:ring-blue-300"
//                   />
//                   <span>Document Upload</span>
//                 </label>
//               </div>
//             </div>

//             {formData[currentTabKey].type === 'url' ? (
//               <div>
//                 <label
//                   htmlFor={`${currentTabKey}-redirectUrl`}
//                   className="block mb-2 font-semibold text-gray-700"
//                 >
//                   Redirect URL
//                 </label>
//                 <input
//                   id={`${currentTabKey}-redirectUrl`}
//                   type="url"
//                   value={formData[currentTabKey].redirectUrl}
//                   onChange={(e) => handleInputChange(currentTabKey, 'redirectUrl', e.target.value)}
//                   className="w-full p-2 rounded-lg border border-gray-300  text-gray-900 focus:border-blue-700 focus:outline-none transition"
//                 />
//               </div>
//             ) : (
//               <div>
//                 <label
//                   htmlFor={`${currentTabKey}-file`}
//                   className="block mb-2 font-semibold text-gray-700"
//                 >
//                   Upload Document
//                 </label>

//                 {/* Hidden file input */}
//                 <input
//                   id={`${currentTabKey}-file`}
//                   type="file"
//                   accept=".pdf,.doc,.docx,.jpg,.png"
//                   onChange={(e) =>
//                     handleInputChange(currentTabKey, 'document', e.target.files?.[0] || null)
//                   }
//                   className="hidden"
//                 />

//                 {/* Styled button to trigger file dialog */}
//                 <label
//                   htmlFor={`${currentTabKey}-file`}
//                   className="inline-block cursor-pointer px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
//                 >
//                   Choose File
//                 </label>

//                 {/* Optional: Show selected file name */}
//                 {formData[currentTabKey].document && (
//                   <p className="mt-2 text-gray-700 text-sm">
//                     {formData[currentTabKey].document.name}
//                   </p>
//                 )}
//               </div>
//             )}

//             <div className="flex justify-between">
//               {editId[currentTabKey] && (
//                 <button
//                   type="button"
//                   onClick={() => handleCancelEdit(currentTabKey)}
//                   disabled={saving}
//                   className="px-4 py-2 rounded border bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
//                 >
//                   Cancel Edit
//                 </button>
//               )}

//               <button
//                 type="submit"
//                 disabled={saving}
//                 className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-800 disabled:opacity-50"
//               >
//                 {saving ? 'Saving...' : editId[currentTabKey] ? 'Update Item' : 'Add Item'}
//               </button>
//             </div>

//             <div>
//               <h3 className="font-semibold mb-4">Existing Items</h3>
//               {tabItems[currentTabKey].length === 0 ? (
//                 <p className="text-gray-500">No items found</p>
//               ) : (
//                 <ul className="space-y-2">
//                   {tabItems[currentTabKey].map((item, index) => (
//                     <li
//                       key={item.id}
//                       draggable
//                       onDragStart={(e) => handleDragStart(e, item.id, currentTabKey)}
//                       onDragOver={handleDragOver}
//                       onDragLeave={handleDragLeave}
//                       onDrop={(e) => handleDrop(e, item.id, currentTabKey)}
//                       onDragEnd={handleDragEnd}
//                       className={`flex justify-between items-center p-3 rounded border border-gray-300 bg-white cursor-move transition-all ${
//                         draggingId === item.id ? 'opacity-40' : 'opacity-100'
//                       }`}
//                     >
//                       <div className="flex items-center space-x-3">
//                         <span className="text-gray-400 text-lg">⋮⋮</span>
//                         <span className="text-sm text-gray-500 w-6 text-center">{index + 1}.</span>
//                         <span>{item.text}</span>
//                         {item.new === '1' && (
//                           <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
//                             New
//                           </span>
//                         )}
//                       </div>
//                       <div className="space-x-2">
//                         <button
//                           type="button"
//                           className="px-2 py-1 rounded text-xs bg-blue-600 text-white hover:bg-blue-700"
//                           onClick={() => handleEdit(item)}
//                         >
//                           ✏️ Edit
//                         </button>
//                         <button
//                           type="button"
//                           className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
//                           onClick={() => handleDelete(item.id, currentTabKey)}
//                           disabled={saving}
//                         >
//                           🗑 Delete
//                         </button>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </div>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ApplicationTabs;
