// import React, { useState, useEffect } from 'react';
// import { Button } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { useNavigate } from 'react-router';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useAuth } from 'src/hook/useAuth';

// interface Notification {
//   id: number;
//   title: string;
//   message: string;
//   created_at: string;
//   s_id: number;
//   is_read: number;
// }

// interface NotificationsResponse {
//   status: boolean;
//   rows: Notification[];
//   total: number;
// }

// const NotificationsPage: React.FC = () => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
//   const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
//   const [filter, setFilter] = useState<'all' | 'unread'>('all');
//   const [pagination, setPagination] = useState({
//     page: 0,
//     rowsPerPage: 10,
//     total: 0
//   });
  
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const apiUrl = import.meta.env.VITE_API_URL;

//   // 🔹 Fetch notifications from API
//   const fetchNotifications = async () => {
//     if (!user?.id) return;

//     setLoading(true);
//     try {
//       const response = await axios.post<NotificationsResponse>(
//         `${apiUrl}/${user?.role}/Notifications/all-noitifications`,
//         {
//           page: pagination.page,
//           rowsPerPage: pagination.rowsPerPage,
//           order: 'desc',
//           orderBy: 'id',
//           search: '',
//           s_id: user.id
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'superadmin_auth_token': user?.token,
//             'accept': 'application/json',
//             'content-type': 'application/json',
//           }
//         }
//       );

//       if (response.data.status) {
//         setNotifications(response.data.rows || []);
//         setPagination(prev => ({
//           ...prev,
//           total: response.data.total
//         }));
//       }
//     } catch (error) {
//       console.error('Error fetching notifications:', error);
//       setNotifications([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchNotifications();
//   }, [user, pagination.page, pagination.rowsPerPage]);

//   // 🔹 Mark single notification as read
//   const markAsRead = async (id: number) => {
//     setMarkingAsRead(id);
//     try {
//       await axios.post(
//         `${apiUrl}/${user?.role}/Notifications/read-noitifications`,
//         { id },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'superadmin_auth_token': user?.token,
//             'accept': 'application/json',
//             'content-type': 'application/json',
//           }
//         }
//       );

//       // Update local state
//       setNotifications(
//         notifications.map((notification) =>
//           notification.id === id ? { ...notification, is_read: 1 } : notification
//         )
//       );
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     } finally {
//       setMarkingAsRead(null);
//     }
//   };

//   // 🔹 Mark all notifications as read
//   const markAllAsRead = async () => {
//     if (!user?.id) return;

//     setMarkingAllAsRead(true);
//     try {
//       await axios.post(
//         `${apiUrl}/${user?.role}/Notifications/all-read-noitifications`,
//         { s_id: user.id },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'superadmin_auth_token': user?.token,
//             'accept': 'application/json',
//             'content-type': 'application/json',
//           }
//         }
//       );

//       // Update local state
//       setNotifications(
//         notifications.map((notification) => ({ ...notification, is_read: 1 }))
//       );
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     } finally {
//       setMarkingAllAsRead(false);
//     }
//   };

//   // 🔹 Get notification type from title/message
//   const getNotificationType = (notification: Notification): string => {
//     const title = notification.title.toLowerCase();
//     const message = notification.message.toLowerCase();

//     if (title.includes('admission') || message.includes('application')) {
//       return 'admission';
//     } else if (title.includes('payment') || message.includes('payment')) {
//       return 'payment';
//     } else if (title.includes('college') || message.includes('college')) {
//       return 'college';
//     } else if (title.includes('school') || message.includes('school')) {
//       return 'school';
//     } else {
//       return 'system';
//     }
//   };

//   // 🔹 Get notification icon and color
//   const getNotificationIcon = (notification: Notification) => {
//     const type = getNotificationType(notification);
    
//     const iconConfig = {
//       admission: { icon: "solar:document-line-duotone", color: "text-blue-500 bg-blue-100" },
//       payment: { icon: "solar:card-line-duotone", color: "text-green-500 bg-green-100" },
//       college: { icon: "solar:building-line-duotone", color: "text-purple-500 bg-purple-100" },
//       school: { icon: "solar:school-line-duotone", color: "text-orange-500 bg-orange-100" },
//       system: { icon: "solar:settings-line-duotone", color: "text-gray-500 bg-gray-100" }
//     };

//     const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.system;
    
//     return (
//       <div className={`p-3 rounded-xl ${config.color}`}>
//         <Icon icon={config.icon} height={24} />
//       </div>
//     );
//   };

//   // 🔹 Format date to relative time
//   const formatRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   // 🔹 Get type display name
//   const getTypeDisplayName = (notification: Notification) => {
//     const type = getNotificationType(notification);
    
//     const typeNames = {
//       admission: 'Admission',
//       payment: 'Payment',
//       college: 'College',
//       school: 'School',
//       system: 'System'
//     };

//     return typeNames[type as keyof typeof typeNames] || 'Notification';
//   };

//   // 🔹 Get type badge color
//   const getTypeBadgeColor = (notification: Notification) => {
//     const type = getNotificationType(notification);
    
//     const badgeColors = {
//       admission: 'bg-blue-100 text-blue-800',
//       payment: 'bg-green-100 text-green-800',
//       college: 'bg-purple-100 text-purple-800',
//       school: 'bg-orange-100 text-orange-800',
//       system: 'bg-gray-100 text-gray-800'
//     };

//     return badgeColors[type as keyof typeof badgeColors] || 'bg-gray-100 text-gray-800';
//   };

//   const filteredNotifications = filter === 'unread' 
//     ? notifications.filter(n => !n.is_read)
//     : notifications;

//   const unreadCount = notifications.filter(n => !n.is_read).length;

//   // 🔹 Handle pagination
//   const handlePageChange = (newPage: number) => {
//     setPagination(prev => ({
//       ...prev,
//       page: newPage
//     }));
//   };

//   const totalPages = Math.ceil(pagination.total / pagination.rowsPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
//             <div className="text-center sm:text-left">
//               <div className="flex items-center gap-3 justify-center sm:justify-start mb-3">
//                 <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
//                   <Icon icon="solar:bell-bing-line-duotone" height={32} className="text-blue-600" />
//                 </div>
//                 <div>
//                   <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
//                   <p className="text-gray-600 mt-0">
//                     Stay updated with your latest activities
//                   </p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col sm:flex-row items-center gap-4">
//               {/* Filter Tabs */}
//               <div className="flex bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
//                 <button
//                   onClick={() => setFilter('all')}
//                   className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
//                     filter === 'all' 
//                       ? 'bg-blue-600 text-white shadow-sm' 
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                   }`}
//                 >
//                   All Notifications ({notifications.length})
//                 </button>
//                 <button
//                   onClick={() => setFilter('unread')}
//                   className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
//                     filter === 'unread' 
//                       ? 'bg-blue-600 text-white shadow-sm' 
//                       : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
//                   }`}
//                 >
//                   Unread {unreadCount > 0 && `(${unreadCount})`}
//                 </button>
//               </div>
              
//               {/* Action Buttons */}
//               <div className="flex gap-2">
//                 {unreadCount > 0 && (
//                   <Button
//                     onClick={markAllAsRead}
//                     disabled={markingAllAsRead}
//                     color="light"
//                     className="flex items-center gap-2 border border-gray-300 shadow-sm"
//                   >
//                     {markingAllAsRead ? (
//                       <Loader size="sm" />
//                     ) : (
//                       <Icon icon="solar:check-read-line-duotone" height={16} />
//                     )}
//                     {markingAllAsRead ? 'Marking all...' : 'Mark all read'}
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Loading State */}
//         {loading && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
//             <Loader size="lg" />
//             <p className="text-gray-600 mt-4">Loading notifications...</p>
//           </div>
//         )}

//         {/* Notifications List */}
//         {!loading && (
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
//             {filteredNotifications.length > 0 ? (
//               <div className="divide-y divide-gray-100">
//                 {filteredNotifications.map((notification) => (
//                   <div
//                     key={notification.id}
//                     className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
//                       !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
//                     }`}
//                   >
//                     <div className="flex gap-4">
//                       <div className="flex-shrink-0">
//                         {getNotificationIcon(notification)}
//                       </div>
                      
//                       <div className="flex-1 min-w-0">
//                         <div className="flex items-start justify-between mb-3">
//                           <div className="flex-1">
//                             <h3 className={`text-base font-semibold ${
//                               !notification.is_read ? 'text-gray-900' : 'text-gray-700'
//                             }`}>
//                               {notification.title}
//                             </h3>
//                             <p className="text-gray-600 text-sm mt-2 leading-relaxed">
//                               {notification.message}
//                             </p>
//                           </div>
                          
//                           <div className="flex items-center gap-2 ml-4">
//                             {!notification.is_read && (
//                               <button
//                                 onClick={() => markAsRead(notification.id)}
//                                 disabled={markingAsRead === notification.id}
//                                 className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
//                                 title="Mark as read"
//                               >
//                                 {markingAsRead === notification.id ? (
//                                   <Loader size="sm" />
//                                 ) : (
//                                   <Icon icon="solar:check-read-line-duotone" height={18} />
//                                 )}
//                               </button>
//                             )}
//                           </div>
//                         </div>
                        
//                         <div className="flex items-center justify-between mt-4">
//                           <div className="flex items-center gap-4">
//                             <span className="text-sm text-gray-500 flex items-center gap-1">
//                               <Icon icon="solar:clock-circle-line-duotone" height={14} />
//                               {formatRelativeTime(notification.created_at)}
//                             </span>
//                             {/* <span className={`text-xs font-medium px-3 py-1 rounded-full ${getTypeBadgeColor(notification)}`}>
//                               {getTypeDisplayName(notification)}
//                             </span> */}
//                           </div>
                          
//                           {!notification.is_read && (
//                             <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
//                               <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
//                               Unread
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-16">
//                 <div className="max-w-md mx-auto">
//                   <Icon icon="solar:check-read-line-duotone" height={80} className="text-gray-300 mx-auto mb-4" />
//                   <h3 className="text-xl font-semibold text-gray-900 mb-2">
//                     {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
//                   </h3>
//                   <p className="text-gray-500 mb-6">
//                     {filter === 'unread' 
//                       ? "You're all caught up! There are no unread notifications."
//                       : "You don't have any notifications at the moment. They'll appear here when you receive updates."
//                     }
//                   </p>
//                   {filter === 'unread' && (
//                     <Button
//                       onClick={() => setFilter('all')}
//                       color="light"
//                       className="inline-flex items-center gap-2"
//                     >
//                       <Icon icon="solar:eye-line-duotone" height={16} />
//                       View all notifications
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Pagination */}
//             {totalPages > 1 && (
//               <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div className="text-sm text-gray-600">
//                     Showing {filteredNotifications.length} of {pagination.total} notifications
//                   </div>
//                   <div className="flex gap-2">
//                     <Button
//                       onClick={() => handlePageChange(pagination.page - 1)}
//                       disabled={pagination.page === 0}
//                       color="light"
//                       size="sm"
//                     >
//                       Previous
//                     </Button>
//                     <Button
//                       onClick={() => handlePageChange(pagination.page + 1)}
//                       disabled={pagination.page >= totalPages - 1}
//                       color="light"
//                       size="sm"
//                     >
//                       Next
//                     </Button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         )}

//         {/* Back Button */}
//         <div className="mt-8 text-center">
//           <Button
//             onClick={() => navigate(-1)}
//             color="light"
//             className="inline-flex items-center gap-2 border border-gray-300 shadow-sm"
//           >
//             <Icon icon="solar:arrow-left-line-duotone" height={16} />
//              Back
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NotificationsPage;
































import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useAuth } from 'src/hook/useAuth';
import { useNotification } from './NotificationContext'; // ✅ Import useNotification

interface Notification {
  id: number;
  title: string;
  message: string;
  created_at: string;
  s_id: number;
  is_read: number;
}

interface NotificationsResponse {
  status: boolean;
  rows: Notification[];
  total: number;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAsRead, setMarkingAsRead] = useState<number | null>(null);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [pagination, setPagination] = useState({
    page: 0,
    rowsPerPage: 10,
    total: 0
  });
  
  const navigate = useNavigate();
  const { user } = useAuth();
  const { updateUnreadCount, refreshNotifications } = useNotification(); // ✅ Use notification context
  const apiUrl = import.meta.env.VITE_API_URL;

  // Calculate unread count
  const unreadCount = notifications.filter(n => !n.is_read).length;

  // Update global unread count whenever notifications change
  useEffect(() => {
    updateUnreadCount(unreadCount);
  }, [unreadCount, updateUnreadCount]);

  // 🔹 Fetch notifications from API
  const fetchNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await axios.post<NotificationsResponse>(
        `${apiUrl}/${user?.role}/Notifications/all-noitifications`,
        {
          page: pagination.page,
          rowsPerPage: pagination.rowsPerPage,
          order: 'desc',
          orderBy: 'id',
          search: '',
          s_id: user.id
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'superadmin_auth_token': user?.token,
            'accept': 'application/json',
            'content-type': 'application/json',
          }
        }
      );

      if (response.data.status) {
        const fetchedNotifications = response.data.rows || [];
        setNotifications(fetchedNotifications);
        setPagination(prev => ({
          ...prev,
          total: response.data.total
        }));

        // Update global unread count
        const newUnreadCount = fetchedNotifications.filter(n => !n.is_read).length;
        updateUnreadCount(newUnreadCount);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
      updateUnreadCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user, pagination.page, pagination.rowsPerPage]);

  // 🔹 Mark single notification as read
  const markAsRead = async (id: number) => {
    setMarkingAsRead(id);
    try {
      await axios.post(
        `${apiUrl}/${user?.role}/Notifications/read-noitifications`,
        { id },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'superadmin_auth_token': user?.token,
            'accept': 'application/json',
            'content-type': 'application/json',
          }
        }
      );

      // Update local state
      const updatedNotifications = notifications.map((notification) =>
        notification.id === id ? { ...notification, is_read: 1 } : notification
      );
      setNotifications(updatedNotifications);

      // Update global unread count
      const newUnreadCount = updatedNotifications.filter(n => !n.is_read).length;
      updateUnreadCount(newUnreadCount);

      // Trigger refresh in other components
      refreshNotifications();

    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setMarkingAsRead(null);
    }
  };

  // 🔹 Mark all notifications as read
  const markAllAsRead = async () => {
    if (!user?.id) return;

    setMarkingAllAsRead(true);
    try {
      await axios.post(
        `${apiUrl}/${user?.role}/Notifications/all-read-noitifications`,
        { s_id: user.id },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'superadmin_auth_token': user?.token,
            'accept': 'application/json',
            'content-type': 'application/json',
          }
        }
      );

      // Update local state
      const updatedNotifications = notifications.map((notification) => ({ 
        ...notification, 
        is_read: 1 
      }));
      setNotifications(updatedNotifications);

      // Update global unread count to 0
      updateUnreadCount(0);

      // Trigger refresh in other components
      refreshNotifications();

    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  // ... (rest of your existing functions: getNotificationType, getNotificationIcon, formatRelativeTime, etc.)

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  // 🔹 Handle pagination
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.rowsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="text-center sm:text-left">
              <div className="flex items-center gap-3 justify-center sm:justify-start mb-3">
                <div className="p-2 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Icon icon="solar:bell-bing-line-duotone" height={32} className="text-blue-600" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Notifications</h1>
                  <p className="text-gray-600 mt-0">
                    Stay updated with your latest activities
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Filter Tabs */}
              <div className="flex bg-white border border-gray-300 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  All Notifications ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  Unread {unreadCount > 0 && `(${unreadCount})`}
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <Button
                    onClick={markAllAsRead}
                    disabled={markingAllAsRead}
                    color="light"
                    className="flex items-center gap-2 border border-gray-300 shadow-sm"
                  >
                    {markingAllAsRead ? (
                      <Loader size="sm" />
                    ) : (
                      <Icon icon="solar:check-read-line-duotone" height={16} />
                    )}
                    {markingAllAsRead ? 'Marking all...' : 'Mark all read'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <Loader size="lg" />
            <p className="text-gray-600 mt-4">Loading notifications...</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {filteredNotifications.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {filteredNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
                      !notification.is_read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="flex gap-4">
                      <div className="flex-shrink-0">
                        {getNotificationIcon(notification)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className={`text-base font-semibold ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h3>
                            <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                              {notification.message}
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            {!notification.is_read && (
                              <button
                                onClick={() => markAsRead(notification.id)}
                                disabled={markingAsRead === notification.id}
                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                title="Mark as read"
                              >
                                {markingAsRead === notification.id ? (
                                  <Loader size="sm" />
                                ) : (
                                  <Icon icon="solar:check-read-line-duotone" height={18} />
                                )}
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Icon icon="solar:clock-circle-line-duotone" height={14} />
                              {formatRelativeTime(notification.created_at)}
                            </span>
                          </div>
                          
                          {!notification.is_read && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              Unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="max-w-md mx-auto">
                  <Icon icon="solar:check-read-line-duotone" height={80} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {filter === 'unread' 
                      ? "You're all caught up! There are no unread notifications."
                      : "You don't have any notifications at the moment. They'll appear here when you receive updates."
                    }
                  </p>
                  {filter === 'unread' && (
                    <Button
                      onClick={() => setFilter('all')}
                      color="light"
                      className="inline-flex items-center gap-2"
                    >
                      <Icon icon="solar:eye-line-duotone" height={16} />
                      View all notifications
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {filteredNotifications.length} of {pagination.total} notifications
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 0}
                      color="light"
                      size="sm"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= totalPages - 1}
                      color="light"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate(-1)}
            color="light"
            className="inline-flex items-center gap-2 border border-gray-300 shadow-sm"
          >
            <Icon icon="solar:arrow-left-line-duotone" height={16} />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;