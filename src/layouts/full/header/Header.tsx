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
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';

interface AcademicItem {
  id: number;
  academic_name: string;
  academic_type: string;
  academic_email: string;
  path: string;
  unique_code: string;
  status: number;
  created_at: string;
}

interface ApplicationItem {
  id: number;
  application_number: string;
  student_name: string;
  college_name: string;
  // Add other application fields as needed
}

interface SuperAdminItem {
  id: number;
  name: string;
  email: string;
  // Add other superadmin fields as needed
}

interface SearchResponse {
  academic: AcademicItem[];
  applications: ApplicationItem[];
  superadmins: SuperAdminItem[];
}

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

const apiUrl = import.meta.env.VITE_API_URL;

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse>({
    academic: [],
    applications: [],
    superadmins: []
  });
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notificationLoading, setNotificationLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleClose = () => setIsOpen(false);

  // 🔹 Fetch search results from API
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchValue.trim()) {
        setSearchResults({
          academic: [],
          applications: [],
          superadmins: []
        });
        setSuggestions([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/SuperAdmin/Notifications/search-bar`,
          { query: searchValue }, 
          {
            headers: {
              'Authorization': `Bearer ${user?.token}`,
              'superadmin_auth_token': user?.token,
              'accept': 'application/json, text/plain, */*',
              'accept-language': 'en-US,en;q=0.9',
              'content-type': 'application/json',
            }
          }
        );

        if (response.data.data) {
          setSearchResults(response.data.data || {
            academic: [],
            applications: [],
            superadmins: []
          });
          
          // Create suggestions from all search results
          const suggestionList = [
            ...response.data.data.academic.map((item: AcademicItem) => 
              `${item.academic_name} (${item.academic_type})`
            ),
            ...response.data.data.applications.map((item: ApplicationItem) => 
              `${item.application_number} - ${item.student_name}`
            ),
            // ...response.data.data.superadmins.map((item: SuperAdminItem) => 
            //   `${item.name} (Super Admin)`
            // )
          ];
          setSuggestions(suggestionList);
        }
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults({
          academic: [],
          applications: [],
          superadmins: []
        });
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSearchResults, 500);
    return () => clearTimeout(timeout);
  }, [searchValue, user?.token]);

  const handleSelect = (text: string) => {
    setSearchValue(text);
    setSearchResults({
      academic: [],
      applications: [],
      superadmins: []
    });
    setSuggestions([]);
  };

  // 🔹 Handle academic item click
  const handleAcademicClick = (academic: AcademicItem) => {
    // Navigate to academic details page
    navigate(academic.path || `/SuperAdmin/Academic/${academic.id}`);
    setSearchValue('');
    setSearchResults({
      academic: [],
      applications: [],
      superadmins: []
    });
    setSuggestions([]);
  };

  // 🔹 Handle application item click
  const handleApplicationClick = (application: ApplicationItem) => {
    navigate(`/SuperAdmin/school-applications/${application.id}`);
    setSearchValue('');
    setSearchResults({
      academic: [],
      applications: [],
      superadmins: []
    });
    setSuggestions([]);
  };

  // 🔹 Handle superadmin item click
  const handleSuperAdminClick = (superadmin: SuperAdminItem) => {
    // Navigate to superadmin profile or details page
    navigate(`/SuperAdmin/users/${superadmin.id}`);
    setSearchValue('');
    setSearchResults({
      academic: [],
      applications: [],
      superadmins: []
    });
    setSuggestions([]);
  };

  // 🔹 Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      setActiveIndex((prev) => {
        const totalItems = 
          searchResults.academic.length + 
          searchResults.applications.length + 
          searchResults.superadmins.length;
        return (prev + 1) % totalItems;
      });
    } else if (e.key === 'ArrowUp') {
      setActiveIndex((prev) => {
        const totalItems = 
          searchResults.academic.length + 
          searchResults.applications.length + 
          searchResults.superadmins.length;
        return (prev - 1 + totalItems) % totalItems;
      });
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      // Handle enter key based on active index
      const totalAcademic = searchResults.academic.length;
      const totalApplications = searchResults.applications.length;
      
      if (activeIndex < totalAcademic) {
        handleAcademicClick(searchResults.academic[activeIndex]);
      } else if (activeIndex < totalAcademic + totalApplications) {
        handleApplicationClick(searchResults.applications[activeIndex - totalAcademic]);
      } else {
        const superadminIndex = activeIndex - totalAcademic - totalApplications;
        handleSuperAdminClick(searchResults.superadmins[superadminIndex]);
      }
    } else if (e.key === 'Enter' && searchValue.trim()) {
      // Perform search on enter
      setActiveIndex(-1);
    }
  };

  // 🔹 Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setSearchResults({
          academic: [],
          applications: [],
          superadmins: []
        });
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
    setSearchResults({
      academic: [],
      applications: [],
      superadmins: []
    });
    setSuggestions([]);
  };

  // 🔹 Get total search results count
  const getTotalResultsCount = () => {
    return (
      searchResults.academic.length + 
      searchResults.applications.length + 
      searchResults.superadmins.length
    );
  };

  // 🔹 Get item by flat index
  const getItemByIndex = (index: number) => {
    const totalAcademic = searchResults.academic.length;
    const totalApplications = searchResults.applications.length;
    
    if (index < totalAcademic) {
      return { type: 'academic', data: searchResults.academic[index] };
    } else if (index < totalAcademic + totalApplications) {
      return { 
        type: 'application', 
        data: searchResults.applications[index - totalAcademic] 
      };
    } else {
      const superadminIndex = index - totalAcademic - totalApplications;
      return { 
        type: 'superadmin', 
        data: searchResults.superadmins[superadminIndex] 
      };
    }
  };

  // 🔹 Notification functions
  const fetchNotifications = async () => {
    if (!user?.id) return;

    setNotificationLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Notifications/get-noitifications`,
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

      if (response.data.status === 'success') {
        setNotifications(response.data.data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setNotificationLoading(false);
    }
  };

  const handleNotificationMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setShowNotifications(true);
    fetchNotifications();
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

  const markAsRead = async (id: number) => {
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
      setNotifications(
        notifications.map((notification) =>
          notification.id === id ? { ...notification, is_read: 1 } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

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
      setNotifications(
        notifications.map((notification) => ({ ...notification, is_read: 1 }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

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
              {/* Search Bar with 900px width */}
              <div className="relative w-[900px] max-w-[900px]" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search academics, applications, users..."
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

                {/* Search Results Dropdown */}
                {(getTotalResultsCount() > 0 || loading) && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden max-h-80 overflow-y-auto">
                    {loading ? (
                      <div className="px-4 py-3 text-center text-gray-500">
                        <Loader />
                      </div>
                    ) : (
                      <>
                        {/* Academics Section */}
                        {searchResults.academic.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                              Academics ({searchResults.academic.length})
                            </div>
                            {searchResults.academic.map((academic, index) => (
                              <div
                                key={`academic-${academic.id}`}
                                onClick={() => handleAcademicClick(academic)}
                                className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                  index === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-100'
                                }`}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {academic.academic_name}
                                  </span>
                                  <span className="text-xs text-gray-600">
                                    {academic.academic_type} • {academic.academic_email}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Applications Section */}
                        {searchResults.applications.length > 0 && (
                          <div className="border-b border-gray-100">
                            <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                              Applications ({searchResults.applications.length})
                            </div>
                            {searchResults.applications.map((application, index) => {
                              const flatIndex = searchResults.academic.length + index;
                              return (
                                <div
                                  key={`application-${application.id}`}
                                  onClick={() => handleApplicationClick(application)}
                                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                    flatIndex === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-100'
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {application.application_number}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {application.student_name} • {application.college_name}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* Super Admins Section */}
                        {searchResults.superadmins.length > 0 && (
                          <div>
                            <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                              Users ({searchResults.superadmins.length})
                            </div>
                            {searchResults.superadmins.map((superadmin, index) => {
                              const flatIndex = searchResults.academic.length + searchResults.applications.length + index;
                              return (
                                <div
                                  key={`superadmin-${superadmin.id}`}
                                  onClick={() => handleSuperAdminClick(superadmin)}
                                  className={`px-4 py-3 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                                    flatIndex === activeIndex ? 'bg-blue-50 text-blue-700' : 'hover:bg-blue-100'
                                  }`}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium text-sm">
                                      {superadmin.name}
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {superadmin.email}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>
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
                  loading={notificationLoading}
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