// import { useState, useEffect, useRef } from 'react';
// import { Navbar, Drawer, DrawerItems } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { AiOutlineClose } from 'react-icons/ai';   // ✅ Added react icon
// import Profile from './Profile';
// import Notification from './notification';
// import MobileSidebar from '../sidebar/MobileSidebar';

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   const handleClose = () => setIsOpen(false);

//   // 🔹 Fetch autocomplete suggestions (DuckDuckGo API)
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!searchValue.trim()) {
//         setSuggestions([]);
//         return;
//       }
//       try {
//         const res = await fetch(
//           `https://duckduckgo.com/ac/?q=${encodeURIComponent(searchValue)}`
//         );
//         const data = await res.json();
//         setSuggestions(data.map((item: any) => item.phrase));
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//       }
//     };

//     const timeout = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(timeout);
//   }, [searchValue]);

//   const handleSelect = (text: string) => {
//     setSearchValue(text);
//     setSuggestions([]);
//     console.log('Selected:', text);
//   };

//   // 🔹 Keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'ArrowDown') {
//       setActiveIndex((prev) => (prev + 1) % suggestions.length);
//     } else if (e.key === 'ArrowUp') {
//       setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
//     } else if (e.key === 'Enter' && activeIndex >= 0) {
//       handleSelect(suggestions[activeIndex]);
//     }
//   };

//   // 🔹 Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // 🔹 Clear input
//   const clearSearch = () => {
//     setSearchValue('');
//     setSuggestions([]);
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-50 ">
//         <Navbar fluid className="rounded-lg bg-white shadow-md py-4">
//           <div className="flex gap-3 items-center justify-between w-full">
//             <div className="flex gap-2 items-center w-full">
//               {/* Mobile Sidebar Toggle */}
//               <span
//                 onClick={() => setIsOpen(true)}
//                 className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
//               >
//                 <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
//               </span>

//               <Notification />

//               {/* 🔹 Search Bar */}
//               <div className="relative flex-1 max-w-[1100px]" ref={dropdownRef}>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {/* Search Icon (left) */}
//                 <svg
//                   className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>

//                 {/* ❌ Clear Icon (React Icon) */}
//                 {searchValue && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
//                   >
//                     <AiOutlineClose size={18} />
//                   </button>
//                 )}

//                 {/* 🔽 Autocomplete Dropdown */}
//                 {suggestions.length > 0 && (
//                   <ul
//                     className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden"
//                   >
//                     {suggestions.slice(0, 5).map((item, index) => (
//                       <li
//                         key={index}
//                         onClick={() => handleSelect(item)}
//                         className={`px-4 py-2 cursor-pointer ${
//                           index === activeIndex
//                             ? 'bg-blue-50 text-blue-700'
//                             : 'hover:bg-blue-100'
//                         }`}
//                       >
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>
//             </div>

//             {/* Profile */}
//             <div className="flex gap-4 items-center ml-4">
//               <Profile />
//             </div>
//           </div>
//         </Navbar>
//       </header>

//       {/* Mobile Sidebar */}
//       <Drawer open={isOpen} onClose={handleClose} className="w-64">
//         <DrawerItems>
//           <MobileSidebar />
//         </DrawerItems>
//       </Drawer>
//     </>
//   );
// };

// export default Header;

// import { useState } from 'react';
// import { Button, DrawerItems, Navbar } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import Profile from './Profile';
// import Notification from './notification';
// import { Drawer } from 'flowbite-react';
// import MobileSidebar from '../sidebar/MobileSidebar';
// import { Link } from 'react-router';

// const Header = () => {
//   // mobile-sidebar
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const handleClose = () => setIsOpen(false);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Handle search functionality here
//     console.log('Searching for:', searchValue);
//     // You can add your search logic here
//   };

//   return (
//     <>
//       <header >
//         <Navbar fluid className={`rounded-lg bg-white shadow-md  py-4 mt-4 `}>  {/*only change is mt-4*/}
//           {/* Mobile Toggle Icon */}

//           <div className="flex gap-3 items-center justify-between w-full ">
//             <div className="flex gap-2 items-center">
//               <span
//                 onClick={() => setIsOpen(true)}
//                 className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
//               >
//                 <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
//               </span>

//               {/* Notification - Left me */}
//               <Notification />

//               {/* Search Bar - Notification ke right me */}
//               <div className="relative w-full sm:w-64">
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//                 <svg
//                   className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//               </div>
//             </div>

//             <div className="flex gap-4 items-center">
//               {/* Profile - Right corner me */}
//               <Profile />
//             </div>
//           </div>
//         </Navbar>
//       </header>

//       {/* Mobile Sidebar */}
//       <Drawer open={isOpen} onClose={handleClose} className='w-64'>
//         <DrawerItems>
//           <MobileSidebar />
//         </DrawerItems>
//       </Drawer>
//     </>
//   );
// };

// export default Header;

// // components/Header.tsx
// import { useState, useEffect, useRef } from 'react';
// import { Navbar, Drawer, DrawerItems } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { AiOutlineClose } from 'react-icons/ai';
// import { useNavigate } from 'react-router';
// import Profile from './Profile';
// import MobileSidebar from '../sidebar/MobileSidebar';
// import NotificationIcon from './components/NotificationIcon';
// import NotificationDropdown from './components/NotificationDropdown';
// import { useAuth } from 'src/hook/useAuth';

// // Mock data - replace with API later
// const mockNotifications = [
//   {
//     id: 1,
//     title: 'New Message Received',
//     message: 'You have a new message from John Doe regarding your project submission',
//     time: '5 min ago',
//     read: false,
//     type: 'message'
//   },
//   {
//     id: 2,
//     title: 'Payment Successful',
//     message: 'Your payment of $299 has been processed successfully',
//     time: '1 hour ago',
//     read: false,
//     type: 'payment'
//   },
//   {
//     id: 3,
//     title: 'System Update Completed',
//     message: 'System maintenance has been completed successfully',
//     time: '2 hours ago',
//     read: true,
//     type: 'system'
//   },
//   {
//     id: 4,
//     title: 'New Follower',
//     message: 'Sarah Johnson started following your profile',
//     time: '5 hours ago',
//     read: true,
//     type: 'social'
//   },
//   {
//     id: 5,
//     title: 'Order Shipped',
//     message: 'Your order #12345 has been shipped with tracking number',
//     time: '1 day ago',
//     read: true,
//     type: 'order'
//   }
// ];

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const [showNotifications, setShowNotifications] = useState(false);
//   const [notifications, setNotifications] = useState(mockNotifications);
//   const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const notificationRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const handleClose = () => setIsOpen(false);

//   // 🔹 Fetch autocomplete suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!searchValue.trim()) {
//         setSuggestions([]);
//         return;
//       }
//       try {
//         const res = await fetch(
//           `https://duckduckgo.com/ac/?q=${encodeURIComponent(searchValue)}`
//         );
//         const data = await res.json();
//         setSuggestions(data.map((item: any) => item.phrase));
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//       }
//     };

//     const timeout = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(timeout);
//   }, [searchValue]);

//   const handleSelect = (text: string) => {
//     setSearchValue(text);
//     setSuggestions([]);
//   };

//   // 🔹 Keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'ArrowDown') {
//       setActiveIndex((prev) => (prev + 1) % suggestions.length);
//     } else if (e.key === 'ArrowUp') {
//       setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
//     } else if (e.key === 'Enter' && activeIndex >= 0) {
//       handleSelect(suggestions[activeIndex]);
//     }
//   };

//   // 🔹 Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setSuggestions([]);
//       }
//       if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
//         setShowNotifications(false);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   // 🔹 Clear input
//   const clearSearch = () => {
//     setSearchValue('');
//     setSuggestions([]);
//   };

//   // 🔹 Notification functions
//   const handleNotificationMouseEnter = () => {
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//       setHoverTimeout(null);
//     }
//     setShowNotifications(true);
//   };

//   const handleNotificationMouseLeave = () => {
//     const timeout = setTimeout(() => {
//       setShowNotifications(false);
//     }, 300);
//     setHoverTimeout(timeout);
//   };

//   const handleDropdownMouseEnter = () => {
//     if (hoverTimeout) {
//       clearTimeout(hoverTimeout);
//       setHoverTimeout(null);
//     }
//     setShowNotifications(true);
//   };

//   const handleDropdownMouseLeave = () => {
//     const timeout = setTimeout(() => {
//       setShowNotifications(false);
//     }, 300);
//     setHoverTimeout(timeout);
//   };

//   const handleShowAllNotifications = () => {
//     setShowNotifications(false);
//     navigate(`/${user?.role}/notifications`);
//   };

//   const markAsRead = (id: number) => {
//     setNotifications(notifications.map(notification =>
//       notification.id === id ? { ...notification, read: true } : notification
//     ));
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(notification => ({ ...notification, read: true })));
//   };

//   const unreadCount = notifications.filter(n => !n.read).length;

//   // Format role for display
//   const formatRole = (role: string) => {
//     const roleMap: { [key: string]: string } = {
//       'super_admin': 'Super Admin',
//       'support_admin': 'Support Admin',
//       'admin': 'Admin',
//       'user': 'User',
//       'moderator': 'Moderator'
//     };
//     return roleMap[role] || role.split('_').map(word =>
//       word.charAt(0).toUpperCase() + word.slice(1)
//     ).join(' ');
//   };

//   // Get user's display name
//   const getUserDisplayName = () => {
//     if (user?.name) return user.name;
//     if (user?.username) return user.username;
//     if (user?.email) return user.email.split('@')[0];
//     return 'User';
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-50">
//         <Navbar fluid className="rounded-lg bg-white shadow-md py-4">
//           <div className="flex gap-3 items-center justify-between w-full">
//             <div className="flex gap-2 items-center w-full">
//               {/* Mobile Sidebar Toggle */}
//               <span
//                 onClick={() => setIsOpen(true)}
//                 className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
//               >
//                 <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
//               </span>

//               {/* Search Bar */}
//               <div className="relative flex-1 max-w-[900px]" ref={dropdownRef}>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {/* Search Icon */}
//                 <svg
//                   className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>

//                 {/* Clear Icon */}
//                 {searchValue && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
//                   >
//                     <AiOutlineClose size={18} />
//                   </button>
//                 )}

//                 {/* Autocomplete Dropdown */}
//                 {suggestions.length > 0 && (
//                   <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
//                     {suggestions.slice(0, 5).map((item, index) => (
//                       <li
//                         key={index}
//                         onClick={() => handleSelect(item)}
//                         className={`px-4 py-2 cursor-pointer ${
//                           index === activeIndex
//                             ? 'bg-blue-50 text-blue-700'
//                             : 'hover:bg-blue-100'
//                         }`}
//                       >
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {/* Notification Icon (between search and profile) */}
//               <div className="relative" ref={notificationRef}>
//                 <NotificationIcon
//                   unreadCount={unreadCount}
//                   onMouseEnter={handleNotificationMouseEnter}
//                   onMouseLeave={handleNotificationMouseLeave}
//                 />

//                 <NotificationDropdown
//                   notifications={notifications}
//                   unreadCount={unreadCount}
//                   showNotifications={showNotifications}
//                   onMarkAsRead={markAsRead}
//                   onMarkAllAsRead={markAllAsRead}
//                   onShowAll={handleShowAllNotifications}
//                   onMouseEnter={handleDropdownMouseEnter}
//                   onMouseLeave={handleDropdownMouseLeave}
//                 />
//               </div>

//               {/* Profile with User Info */}
//               <div className="flex gap-4 items-center">
//                 <div className="flex items-center gap-3">
//                   <Profile />

//                   {/* User Name and Role */}
//                   {user && (
//                     <div className="hidden sm:block">
//                       <div className="flex flex-col items-start">
//                         <span className="text-sm font-semibold text-gray-900 leading-tight">
//                           {getUserDisplayName()}
//                         </span>
//                         <span className="text-xs text-gray-500 leading-tight">
//                           {formatRole(user.role || 'user')}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Navbar>
//       </header>

//       {/* Mobile Sidebar */}
//       <Drawer open={isOpen} onClose={handleClose} className="w-64">
//         <DrawerItems>
//           <MobileSidebar />
//         </DrawerItems>
//       </Drawer>
//     </>
//   );
// };

// export default Header;


















// components/Header.tsx
import { useState, useEffect, useRef } from 'react';
import { Navbar, Drawer, DrawerItems } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { AiOutlineClose } from 'react-icons/ai';
import { useNavigate } from 'react-router';
import Profile from './Profile';
import MobileSidebar from '../sidebar/MobileSidebar';
import NotificationIcon from './components/NotificationIcon';
import NotificationDropdown from './components/NotificationDropdown';
import { useAuth } from 'src/hook/useAuth';

// Mock data - replace with API later
const mockNotifications = [
  {
    id: 1,
    title: 'New Message Received',
    message: 'You have a new message from John Doe regarding your project submission',
    time: '5 min ago',
    read: false,
    type: 'message',
  },
  {
    id: 2,
    title: 'Payment Successful',
    message: 'Your payment of $299 has been processed successfully',
    time: '1 hour ago',
    read: false,
    type: 'payment',
  },
  {
    id: 3,
    title: 'System Update Completed',
    message: 'System maintenance has been completed successfully',
    time: '2 hours ago',
    read: true,
    type: 'system',
  },
  {
    id: 4,
    title: 'New Follower',
    message: 'Sarah Johnson started following your profile',
    time: '5 hours ago',
    read: true,
    type: 'social',
  },
  {
    id: 5,
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped with tracking number',
    time: '1 day ago',
    read: true,
    type: 'order',
  },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false); // State for sidebar toggle
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => setIsOpen(false);

  // Toggle sidebar function
  // const toggleSidebar = () => {
  //   setSidebarOpen(!sidebarOpen);
  //   // You can add your sidebar toggle logic here
  //   console.log('Sidebar toggled:', !sidebarOpen);
  // };

  // 🔹 Fetch autocomplete suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(searchValue)}`);
        const data = await res.json();
        setSuggestions(data.map((item: any) => item.phrase));
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      }
    };

    const timeout = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeout);
  }, [searchValue]);

  const handleSelect = (text: string) => {
    setSearchValue(text);
    setSuggestions([]);
  };

  // 🔹 Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      handleSelect(suggestions[activeIndex]);
    }
  };

  // 🔹 Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSuggestions([]);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Clear input
  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
  };

  // 🔹 Notification functions
  const handleNotificationMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowNotifications(true);
  };

  const handleNotificationMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowNotifications(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowNotifications(true);
  };

  const handleDropdownMouseLeave = () => {
    const timeout = setTimeout(() => {
      setShowNotifications(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  const handleShowAllNotifications = () => {
    setShowNotifications(false);
    navigate(`/${user?.role}/notifications`);
  };

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Format role for display
  const formatRole = (role: string) => {
    const roleMap: { [key: string]: string } = {
      super_admin: 'Super Admin',
      support_admin: 'Support Admin',
      admin: 'Admin',
      user: 'User',
      moderator: 'Moderator',
    };
    return (
      roleMap[role] ||
      role
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
  };

  // Get user's display name
  const getUserDisplayName = () => {
    if (user?.name) return user.name;
    if (user?.username) return user.username;
    if (user?.email) return user.email.split('@')[0];
    return 'User';
  };

  return (
    <>
      <header className="sticky top-0 z-50">
        <Navbar fluid className="rounded-lg bg-white shadow-md py-4">
          <div className="flex gap-3 items-center justify-between w-full">
            <div className="flex gap-2 items-center w-full">
              {/* Mobile Sidebar Toggle (Hidden on desktop) */}

              {/* Search Bar with 900px width */}
              <div className="relative w-[900px] max-w-[900px]" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Search Icon */}
                <svg
                  className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>

                {/* Clear Icon */}
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <AiOutlineClose size={18} />
                  </button>
                )}

                {/* Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
                    {suggestions.slice(0, 5).map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item)}
                        className={`px-4 py-2 cursor-pointer ${
                          index === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-100'
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Notification Icon (between search and profile) */}
              <div className="relative" ref={notificationRef}>
                <NotificationIcon
                  unreadCount={unreadCount}
                  onMouseEnter={handleNotificationMouseEnter}
                  onMouseLeave={handleNotificationMouseLeave}
                />

                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  showNotifications={showNotifications}
                  onMarkAsRead={markAsRead}
                  onMarkAllAsRead={markAllAsRead}
                  onShowAll={handleShowAllNotifications}
                  onMouseEnter={handleDropdownMouseEnter}
                  onMouseLeave={handleDropdownMouseLeave}
                />
              </div>

              {/* Profile with User Info */}
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-3">
                  <Profile />

                  {/* User Name and Role */}
                  {user && (
                    <div className="hidden sm:block">
                      <div className="flex flex-col items-start w-auto max-w-full">
                        <span className="text-sm font-semibold text-gray-900 leading-tight whitespace-normal break-words">
                          {getUserDisplayName()}
                        </span>
                        <span className="text-xs text-gray-500 leading-tight whitespace-normal break-words">
                          {formatRole(user.role || 'user')}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Navbar>
      </header>

      {/* Mobile Sidebar */}
      <Drawer open={isOpen} onClose={handleClose} className="w-64">
        <DrawerItems>
          <MobileSidebar />
        </DrawerItems>
      </Drawer>
    </>
  );
};

export default Header;
















// import { useState, useEffect, useRef } from 'react';
// import { Navbar, Drawer, DrawerItems } from 'flowbite-react';
// import { Icon } from '@iconify/react';
// import { AiOutlineClose } from 'react-icons/ai';
// import { useNavigate } from 'react-router';
// import Profile from './Profile';
// import MobileSidebar from '../sidebar/MobileSidebar';
// import { useAuth } from 'src/hook/useAuth';

// // Mock notifications data
// const mockNotifications = [
//   {
//     id: 1,
//     title: 'New Message Received',
//     message: 'You have a new message from John Doe regarding your project submission',
//     time: '5 min ago',
//     read: false,
//     type: 'message',
//   },
//   // ... other notifications
// ];

// const Header = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [searchValue, setSearchValue] = useState('');
//   const [suggestions, setSuggestions] = useState<string[]>([]);
//   const [activeIndex, setActiveIndex] = useState(-1);
//   const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const navigate = useNavigate();
//   const { user } = useAuth();

//   const handleClose = () => setIsOpen(false);

//   // Simple sidebar toggle function
//   const toggleSidebar = () => {
//     setSidebarCollapsed(!sidebarCollapsed);
//     const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;
//     const mainContent = document.querySelector('.main-content') as HTMLElement;
    
//     if (sidebar) {
//       if (sidebarCollapsed) {
//         // Open sidebar
//         sidebar.style.width = '280px';
//         sidebar.style.transform = 'translateX(0)';
//         if (mainContent) {
//           mainContent.style.marginLeft = '280px';
//         }
//       } else {
//         // Close sidebar
//         sidebar.style.width = '0';
//         sidebar.style.transform = 'translateX(-100%)';
//         if (mainContent) {
//           mainContent.style.marginLeft = '0';
//         }
//       }
//     }
//   };

//   // Initialize sidebar on component mount
//   useEffect(() => {
//     const sidebar = document.querySelector('.menu-sidebar') as HTMLElement;
//     const mainContent = document.querySelector('.main-content') as HTMLElement;
    
//     if (sidebar) {
//       sidebar.style.transition = 'all 0.3s ease-in-out';
//     }
//     if (mainContent) {
//       mainContent.style.transition = 'margin-left 0.3s ease-in-out';
//     }
//   }, []);

//   // Fetch autocomplete suggestions
//   useEffect(() => {
//     const fetchSuggestions = async () => {
//       if (!searchValue.trim()) {
//         setSuggestions([]);
//         return;
//       }
//       try {
//         const res = await fetch(`https://duckduckgo.com/ac/?q=${encodeURIComponent(searchValue)}`);
//         const data = await res.json();
//         setSuggestions(data.map((item: any) => item.phrase));
//       } catch (error) {
//         console.error('Error fetching suggestions:', error);
//       }
//     };

//     const timeout = setTimeout(fetchSuggestions, 300);
//     return () => clearTimeout(timeout);
//   }, [searchValue]);

//   const handleSelect = (text: string) => {
//     setSearchValue(text);
//     setSuggestions([]);
//   };

//   // Keyboard navigation
//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'ArrowDown') {
//       setActiveIndex((prev) => (prev + 1) % suggestions.length);
//     } else if (e.key === 'ArrowUp') {
//       setActiveIndex((prev) => (prev - 1 + suggestions.length) % suggestions.length);
//     } else if (e.key === 'Enter' && activeIndex >= 0) {
//       handleSelect(suggestions[activeIndex]);
//     }
//   };

//   // Close suggestions when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setSuggestions([]);
//       }
//     };
//     document.addEventListener('mousedown', handleClickOutside);
//     return () => document.removeEventListener('mousedown', handleClickOutside);
//   }, []);

//   const clearSearch = () => {
//     setSearchValue('');
//     setSuggestions([]);
//   };

//   // Format role for display
//   const formatRole = (role: string) => {
//     const roleMap: { [key: string]: string } = {
//       super_admin: 'Super Admin',
//       support_admin: 'Support Admin',
//       admin: 'Admin',
//       user: 'User',
//       moderator: 'Moderator',
//     };
//     return (
//       roleMap[role] ||
//       role
//         .split('_')
//         .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ')
//     );
//   };

//   // Get user's display name
//   const getUserDisplayName = () => {
//     if (user?.name) return user.name;
//     if (user?.username) return user.username;
//     if (user?.email) return user.email.split('@')[0];
//     return 'User';
//   };

//   return (
//     <>
//       <header className="sticky top-0 z-40">
//         <Navbar fluid className="rounded-lg bg-white shadow-md py-4">
//           <div className="flex gap-3 items-center justify-between w-full">
//             <div className="flex gap-2 items-center w-full">
//               {/* Fries Menu Icon - Simple Toggle */}
//               <button
//                 onClick={toggleSidebar}
//                 className="h-10 w-10 flex text-gray-600 hover:text-primary hover:bg-gray-100 rounded-lg justify-center items-center cursor-pointer transition-all duration-200"
//                 title={sidebarCollapsed ? "Open Sidebar" : "Close Sidebar"}
//               >
//                 <Icon icon="solar:hamburger-menu-line-duotone" height={24} />
//               </button>

//               {/* Mobile Sidebar Toggle */}
//               <span
//                 onClick={() => setIsOpen(true)}
//                 className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
//               >
//                 <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
//               </span>

//               {/* Search Bar */}
//               <div className="relative w-[900px] max-w-[900px]" ref={dropdownRef}>
//                 <input
//                   type="text"
//                   placeholder="Search..."
//                   value={searchValue}
//                   onChange={(e) => setSearchValue(e.target.value)}
//                   onKeyDown={handleKeyDown}
//                   className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 {/* Search Icon */}
//                 <svg
//                   className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
//                   fill="none"
//                   viewBox="0 0 24 24"
//                   stroke="currentColor"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>

//                 {/* Clear Icon */}
//                 {searchValue && (
//                   <button
//                     onClick={clearSearch}
//                     className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
//                   >
//                     <AiOutlineClose size={18} />
//                   </button>
//                 )}

//                 {/* Autocomplete Dropdown */}
//                 {suggestions.length > 0 && (
//                   <ul className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden">
//                     {suggestions.slice(0, 5).map((item, index) => (
//                       <li
//                         key={index}
//                         onClick={() => handleSelect(item)}
//                         className={`px-4 py-2 cursor-pointer ${
//                           index === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-100'
//                         }`}
//                       >
//                         {item}
//                       </li>
//                     ))}
//                   </ul>
//                 )}
//               </div>

//               {/* Profile with User Info */}
//               <div className="flex gap-4 items-center ml-auto">
//                 <div className="flex items-center gap-3">
//                   <Profile />

//                   {/* User Name and Role */}
//                   {user && (
//                     <div className="hidden sm:block">
//                       <div className="flex flex-col items-start">
//                         <span className="text-sm font-semibold text-gray-900 leading-tight">
//                           {getUserDisplayName()}
//                         </span>
//                         <span className="text-xs text-gray-500 leading-tight">
//                           {formatRole(user.role || 'user')}
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         </Navbar>
//       </header>

//       {/* Mobile Sidebar */}
//       <Drawer open={isOpen} onClose={handleClose} className="w-64">
//         <DrawerItems>
//           <MobileSidebar />
//         </DrawerItems>
//       </Drawer>
//     </>
//   );
// };

// export default Header;