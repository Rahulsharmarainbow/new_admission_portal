import { useState } from 'react';
import { Icon } from "@iconify/react";
import user1 from "/src/assets/images/profile/user-1.jpg";
import { Link } from "react-router";
import { useAuth } from "src/hook/useAuth";
const assetUrl = import.meta.env.VITE_ASSET_URL;


const Profile = () => {
  const { logout , user} = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    setIsOpen(false);
    logout();
  }

  return (
    <div className="relative over">
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-15 w-15 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer"
      >
        <img
         src={`${assetUrl}/${user?.profile}`}
          alt="logo"
          height="35"
          width="35"
          className="rounded-full"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50 overflow-hidden">
          <Link
            to={`profile`}
            className="px-4 py-3 flex items-center hover:bg-gray-100 w-full gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="solar:user-circle-outline" height={20} />
            My Profile
          </Link>
          
          <Link
            to="#"
            className="px-4 py-3 flex items-center hover:bg-gray-100 w-full gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="solar:letter-linear" height={20} />
            My Account
          </Link>
          
          <Link
            to="/"
            className="px-4 py-3 flex items-center hover:bg-gray-100 w-full gap-3 text-sm"
            onClick={() => setIsOpen(false)}
          >
            <Icon icon="solar:checklist-linear" height={20} />
            My Task
          </Link>
          
          <div className="border-t border-gray-200">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-3 flex items-center hover:bg-red-50 text-red-600 gap-3 text-sm"
            >
              <Icon icon="solar:logout-2-linear" height={20} />
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Close when clicking outside */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default Profile;







// import { Button, Dropdown, DropdownItem } from "flowbite-react";
// import { Icon } from "@iconify/react";
// import user1 from "/src/assets/images/profile/user-1.jpg";
// import { Link } from "react-router";

// const Profile = () => {
//   return (
//     <div className="relative group/menu">
//       <Dropdown
//         label=""
//         className="rounded-sm w-44"
//         dismissOnClick={false}
//         renderTrigger={() => (
//           <span className="h-10 w-10 hover:text-primary hover:bg-lightprimary rounded-full flex justify-center items-center cursor-pointer group-hover/menu:bg-lightprimary group-hover/menu:text-primary">
//             <img
//               src={user1}
//               alt="logo"
//               height="35"
//               width="35"
//               className="rounded-full"
//             />
//           </span>
//         )}
//       >

//         <DropdownItem
//           as={Link}
//           to="#"
//           className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
//         >
//           <Icon icon="solar:user-circle-outline" height={20} />
//           My Profile
//         </DropdownItem>
//         <DropdownItem
//           as={Link}
//           to="#"
//           className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
//         >
//           <Icon icon="solar:letter-linear" height={20} />
//           My Account
//         </DropdownItem>
//         <DropdownItem
//           as={Link}
//           to="/"
//           className="px-3 py-3 flex items-center bg-hover group/link w-full gap-3 text-dark"
//         >
//           <Icon icon="solar:checklist-linear" height={20} />
//           My Task
//         </DropdownItem>
//         <div className="p-3 pt-0">
//         <Button as={Link}  size={'sm'}  to="/auth/login" className="mt-2 border border-primary text-primary bg-transparent hover:bg-lightprimary outline-none focus:outline-none">Logout</Button>
//         </div>
//       </Dropdown>
//     </div>
//   );
// };

// export default Profile;





















