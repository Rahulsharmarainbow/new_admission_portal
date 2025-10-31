
import { useState, useEffect, useRef } from 'react';
import { Navbar, Drawer, DrawerItems } from 'flowbite-react';
import { Icon } from '@iconify/react';
import { AiOutlineClose } from 'react-icons/ai';   // ✅ Added react icon
import Profile from './Profile';
import Notification from './notification';
import MobileSidebar from '../sidebar/MobileSidebar';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClose = () => setIsOpen(false);

  // 🔹 Fetch autocomplete suggestions (DuckDuckGo API)
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!searchValue.trim()) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(
          `https://duckduckgo.com/ac/?q=${encodeURIComponent(searchValue)}`
        );
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
    console.log('Selected:', text);
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
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 🔹 Clear input
  const clearSearch = () => {
    setSearchValue('');
    setSuggestions([]);
  };

  return (
    <>
      <header className="sticky top-0 z-50 ">
        <Navbar fluid className="rounded-lg bg-white shadow-md py-4">
          <div className="flex gap-3 items-center justify-between w-full">
            <div className="flex gap-2 items-center w-full">
              {/* Mobile Sidebar Toggle */}
              <span
                onClick={() => setIsOpen(true)}
                className="h-10 w-10 flex text-black dark:text-white text-opacity-65 xl:hidden hover:text-primary hover:bg-lightprimary rounded-full justify-center items-center cursor-pointer"
              >
                <Icon icon="solar:hamburger-menu-line-duotone" height={21} />
              </span>

              <Notification />

              {/* 🔹 Search Bar */}
              <div className="relative flex-1 max-w-[1100px]" ref={dropdownRef}>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {/* Search Icon (left) */}
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

                {/* ❌ Clear Icon (React Icon) */}
                {searchValue && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <AiOutlineClose size={18} />
                  </button>
                )}

                {/* 🔽 Autocomplete Dropdown */}
                {suggestions.length > 0 && (
                  <ul
                    className="absolute left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-md z-50 overflow-hidden"
                  >
                    {suggestions.slice(0, 5).map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSelect(item)}
                        className={`px-4 py-2 cursor-pointer ${
                          index === activeIndex
                            ? 'bg-blue-50 text-blue-700'
                            : 'hover:bg-blue-100'
                        }`}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Profile */}
            <div className="flex gap-4 items-center ml-4">
              <Profile />
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




