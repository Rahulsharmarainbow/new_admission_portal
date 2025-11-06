// import React from 'react';
// import { Icon } from '@iconify/react';
// import { useNavigate } from 'react-router';
// import Loader from 'src/Frontend/Common/Loader';

// interface Notification {
//   id: number;
//   s_id: number;
//   c_id: number | null;
//   is_read: number;
//   academic_id: number;
//   title: string;
//   message: string;
//   date: string;
// }

// interface NotificationDropdownProps {
//   notifications: Notification[];
//   unreadCount: number;
//   showNotifications: boolean;
//   onMarkAsRead: (id: number) => void;
//   onMarkAllAsRead: () => void;
//   onShowAll: () => void;
//   onMouseEnter: () => void;
//   onMouseLeave: () => void;
//   loading?: boolean;
// }

// const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
//   notifications,
//   unreadCount,
//   showNotifications,
//   onMarkAsRead,
//   onMarkAllAsRead,
//   onShowAll,
//   onMouseEnter,
//   onMouseLeave,
//   loading = false
// }) => {
//   const navigate = useNavigate();
//   const recentNotifications = notifications.slice(0, 5);

//   const getNotificationIcon = (title: string) => {
//     const iconConfig = {
//       message: { icon: "solar:chat-line-line-duotone", color: "text-blue-500" },
//       payment: { icon: "solar:card-line-duotone", color: "text-green-500" },
//       system: { icon: "solar:settings-line-duotone", color: "text-purple-500" },
//       social: { icon: "solar:user-hand-up-line-duotone", color: "text-pink-500" },
//       order: { icon: "solar:box-line-duotone", color: "text-orange-500" },
//       reminder: { icon: "solar:clock-circle-line-duotone", color: "text-yellow-500" }
//     };

//     // Default to message icon for admission notifications
//     const config = iconConfig.message;
//     return <Icon icon={config.icon} height={18} className={config.color} />;
//   };

//   // Format date to relative time
//   const formatRelativeTime = (dateString: string) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

//     if (diffInSeconds < 60) return 'Just now';
//     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
//     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
//     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
//     return date.toLocaleDateString();
//   };

//   if (!showNotifications) return null;

//   return (
//     <div 
//       className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//     >
//       {/* Header */}
//       <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
//         <div className="flex items-center justify-between">
//           <h3 className="font-semibold text-gray-900 text-lg">Notifications</h3>
//           <div className="flex items-center gap-2">
//             {unreadCount > 0 && (
//               <button
//                 onClick={onMarkAllAsRead}
//                 className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
//               >
//                 <Icon icon="solar:check-read-line-duotone" height={14} />
//                 Mark all read
//               </button>
//             )}
//           </div>
//         </div>
//         {unreadCount > 0 && (
//           <p className="text-sm text-gray-600 mt-1">
//             {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
//           </p>
//         )}
//       </div>

//       {/* Notifications List */}
//       <div className="max-h-96 overflow-y-auto">
//         {loading ? (
//           <div className="p-8 text-center">
//             <Loader />
//             <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
//           </div>
//         ) : recentNotifications.length > 0 ? (
//           <div className="divide-y divide-gray-100">
//             {recentNotifications.map((notification) => (
//               <div
//                 key={notification.id}
//                 className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${
//                   !notification.is_read ? 'bg-blue-50' : ''
//                 }`}
//                 onClick={() => onMarkAsRead(notification.id)}
//               >
//                 <div className="flex gap-3">
//                   <div className="flex-shrink-0 mt-1">
//                     {getNotificationIcon(notification.title)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <div className="flex items-start justify-between">
//                       <h4 className={`text-sm font-medium ${
//                         !notification.is_read ? 'text-gray-900' : 'text-gray-700'
//                       }`}>
//                         {notification.title}
//                       </h4>
//                       {!notification.is_read && (
//                         <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
//                       )}
//                     </div>
//                     <p className="text-sm text-gray-600 mt-1 line-clamp-2">
//                       {notification.message}
//                     </p>
//                     <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
//                       <Icon icon="solar:clock-circle-line-duotone" height={12} />
//                       {formatRelativeTime(notification.date)}
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         ) : (
//           <div className="p-8 text-center">
//             <Icon icon="solar:check-read-line-duotone" height={48} className="text-gray-300 mx-auto mb-3" />
//             <p className="text-gray-500 text-sm">No notifications</p>
//             <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
//           </div>
//         )}
//       </div>

//       {/* Footer */}
//       {recentNotifications.length > 0 && (
//         <div className="p-3 border-t border-gray-200 bg-gray-50">
//           <button
//             onClick={onShowAll}
//             className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium text-center hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
//           >
//             <Icon icon="solar:eye-line-duotone" height={16} />
//             View All Notifications
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default NotificationDropdown;



















import React from 'react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';
import Loader from 'src/Frontend/Common/Loader';

interface Notification {
  id: number;
  s_id: number;
  c_id: number | null;
  is_read: number;
  academic_id: number;
  title: string;
  message: string;
  date: string;
}

interface NotificationDropdownProps {
  notifications: Notification[];
  unreadCount: number;
  showNotifications: boolean;
  onMarkAsRead: (id: number) => void;
  onMarkAllAsRead: () => void;
  onShowAll: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  loading?: boolean;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  notifications,
  unreadCount,
  showNotifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onShowAll,
  onMouseEnter,
  onMouseLeave,
  loading = false
}) => {
  const navigate = useNavigate();
  const recentNotifications = notifications.slice(0, 5);

  const getNotificationIcon = (title: string) => {
    const iconConfig = {
      message: { icon: "solar:chat-line-line-duotone", color: "text-blue-500" },
      payment: { icon: "solar:card-line-duotone", color: "text-green-500" },
      system: { icon: "solar:settings-line-duotone", color: "text-purple-500" },
      social: { icon: "solar:user-hand-up-line-duotone", color: "text-pink-500" },
      order: { icon: "solar:box-line-duotone", color: "text-orange-500" },
      reminder: { icon: "solar:clock-circle-line-duotone", color: "text-yellow-500" }
    };

    const config = iconConfig.message;
    return <Icon icon={config.icon} height={18} className={config.color} />;
  };

  // Format date to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    
    return date.toLocaleDateString();
  };

  if (!showNotifications) return null;

  return (
    <div 
      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 overflow-hidden"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 text-lg">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition-colors"
              >
                <Icon icon="solar:check-read-line-duotone" height={14} />
                Mark all read
              </button>
            )}
          </div>
        </div>
        {unreadCount > 0 && (
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="p-8 text-center">
            <Loader />
            <p className="text-gray-500 text-sm mt-2">Loading notifications...</p>
          </div>
        ) : recentNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors group ${
                  !notification.is_read ? 'bg-blue-50' : ''
                }`}
                onClick={() => onMarkAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getNotificationIcon(notification.title)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h4 className={`text-sm font-medium ${
                        !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.is_read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                      <Icon icon="solar:clock-circle-line-duotone" height={12} />
                      {formatRelativeTime(notification.date)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Icon icon="solar:check-read-line-duotone" height={48} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No notifications</p>
            <p className="text-gray-400 text-xs mt-1">You're all caught up!</p>
          </div>
        )}
      </div>

      {/* Footer */}
      {recentNotifications.length > 0 && (
        <div className="p-3 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onShowAll}
            className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 font-medium text-center hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Icon icon="solar:eye-line-duotone" height={16} />
            View All Notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;