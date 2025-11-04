import React from 'react';
import { Icon } from '@iconify/react';

interface NotificationIconProps {
  unreadCount: number;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const NotificationIcon: React.FC<NotificationIconProps> = ({
  unreadCount,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <div 
      className="relative cursor-pointer p-2"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <Icon 
        icon="solar:bell-bing-line-duotone" 
        height={24} 
        className="text-gray-600 hover:text-primary transition-colors" 
      />
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium shadow-sm">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </div>
  );
};

export default NotificationIcon;