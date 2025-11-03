// pages/NotificationsPage.tsx
import React, { useState } from 'react';
import { Button } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { useNavigate } from 'react-router';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: string;
}

const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: 'New Message Received',
      message: 'You have a new message from John Doe regarding your recent project submission. Please check your inbox for more details.',
      time: '5 min ago',
      read: false,
      type: 'message'
    },
    {
      id: 2,
      title: 'Payment Successful',
      message: 'Your payment of $299 has been processed successfully. Transaction ID: TXN123456. You will receive a confirmation email shortly.',
      time: '1 hour ago',
      read: false,
      type: 'payment'
    },
    {
      id: 3,
      title: 'System Update Completed',
      message: 'Scheduled system maintenance has been completed successfully. All services are now running optimally.',
      time: '2 hours ago',
      read: true,
      type: 'system'
    },
    {
      id: 4,
      title: 'New Follower',
      message: 'Sarah Johnson started following your profile. Check out their profile to connect and network.',
      time: '5 hours ago',
      read: true,
      type: 'social'
    },
    {
      id: 5,
      title: 'Order Shipped',
      message: 'Your order #12345 has been shipped. Tracking number: TRK789012. Expected delivery within 2-3 business days.',
      time: '1 day ago',
      read: true,
      type: 'order'
    },
    {
      id: 6,
      title: 'Meeting Reminder',
      message: 'Team meeting scheduled for today at 3:00 PM in Conference Room B. Please bring your project updates and progress reports.',
      time: '2 days ago',
      read: true,
      type: 'reminder'
    },
    {
      id: 7,
      title: 'Security Alert',
      message: 'New login detected from an unknown device. If this was not you, please secure your account immediately by changing your password.',
      time: '3 days ago',
      read: true,
      type: 'system'
    },
    {
      id: 8,
      title: 'Subscription Renewal',
      message: 'Your premium subscription will renew in 7 days. Please review your payment method to ensure uninterrupted service.',
      time: '4 days ago',
      read: true,
      type: 'payment'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    const iconConfig = {
      message: { icon: "solar:chat-line-line-duotone", color: "text-blue-500 bg-blue-100" },
      payment: { icon: "solar:card-line-duotone", color: "text-green-500 bg-green-100" },
      system: { icon: "solar:settings-line-duotone", color: "text-purple-500 bg-purple-100" },
      social: { icon: "solar:user-hand-up-line-duotone", color: "text-pink-500 bg-pink-100" },
      order: { icon: "solar:box-line-duotone", color: "text-orange-500 bg-orange-100" },
      reminder: { icon: "solar:clock-circle-line-duotone", color: "text-yellow-500 bg-yellow-100" }
    };

    const config = iconConfig[type as keyof typeof iconConfig] || iconConfig.message;
    
    return (
      <div className={`p-3 rounded-xl ${config.color}`}>
        <Icon icon={config.icon} height={24} />
      </div>
    );
  };

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.read)
    : notifications;

  const unreadCount = notifications.filter(n => !n.read).length;

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
                  All Notifications
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
                    color="light"
                    className="flex items-center gap-2 border border-gray-300 shadow-sm"
                  >
                    <Icon icon="solar:check-read-line-duotone" height={16} />
                    Mark all read
                  </Button>
                )}
                
                {notifications.length > 0 && (
                  <Button
                    onClick={clearAll}
                    color="light"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 border border-gray-300 shadow-sm"
                  >
                    <Icon icon="solar:trash-bin-trash-line-duotone" height={16} />
                    Clear all
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {filteredNotifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-all duration-200 ${
                    !notification.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className={`text-base font-semibold ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h3>
                          <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                            {notification.message}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              title="Mark as read"
                            >
                              <Icon icon="solar:check-read-line-duotone" height={18} />
                            </button>
                          )}
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                            title="Delete notification"
                          >
                            <Icon icon="solar:trash-bin-trash-line-duotone" height={18} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4">
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <Icon icon="solar:clock-circle-line-duotone" height={14} />
                            {notification.time}
                          </span>
                          <span className={`text-xs font-medium px-3 py-1 rounded-full ${
                            notification.type === 'message' ? 'bg-blue-100 text-blue-800' :
                            notification.type === 'payment' ? 'bg-green-100 text-green-800' :
                            notification.type === 'system' ? 'bg-purple-100 text-purple-800' :
                            notification.type === 'social' ? 'bg-pink-100 text-pink-800' :
                            notification.type === 'order' ? 'bg-orange-100 text-orange-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                          </span>
                        </div>
                        
                        {!notification.read && (
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
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <Button
            onClick={() => navigate(-1)}
            color="light"
            className="inline-flex items-center gap-2 border border-gray-300 shadow-sm"
          >
            <Icon icon="solar:arrow-left-line-duotone" height={16} />
            Back to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;