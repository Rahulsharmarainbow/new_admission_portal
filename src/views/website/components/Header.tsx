// import React from "react";

// interface HeaderProps {
//   primaryWebsiteUrl?: string;
// }

// const Header: React.FC<HeaderProps> = ({
//   primaryWebsiteUrl = "https://your-primary-website.com",
// }) => {
//   return (
//     <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm rounded-lg mx-2 my-2">
//       <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8">
//         <div className="flex items-center justify-between h-20 lg:h-16 gap-3 lg:gap-6 py-2 lg:py-0">
//           {/* Logo + Title */}
//           <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
//             <div className="h-10 w-10 sm:h-11 sm:w-11 lg:h-12 lg:w-12 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-orange-500 flex-shrink-0">
//               <img
//                 src="https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png/220px-National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png"
//                 alt="NUSRL Logo"
//                 className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 object-contain"
//               />
//             </div>
//             <div className="flex flex-col min-w-0 flex-1">
//               <h1 className="text-sm lg:text-base font-bold text-slate-900 leading-tight truncate">
//                 NATIONAL UNIVERSITY OF STUDY AND RESEARCH IN LAW, RANCHI
//               </h1>
//               <span className="text-xs text-slate-500 truncate">
//                 At: V. Nagri, Kanke, Ranchi (Jharkhand) – 834006
//               </span>
//             </div>
//           </div>

//           {/* Button - Always right side */}
//           <a
//             href={primaryWebsiteUrl}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="px-3 sm:px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1 whitespace-nowrap flex-shrink-0"
//           >
//             Go to homepage
//           </a>
//         </div>
//       </div>
//     </header>
//   );
// };

// export default Header;





// src/pages/Header.tsx
import React from 'react';
import { Link } from 'react-router';

const assetUrl =
  import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

interface HeaderProps {
  baseUrl?: string;
  institute_id?: string;
  instituteName?: string;
  logo?: string;
  address?: string;
  primaryWebsiteUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  baseUrl = '',
  institute_id,
  instituteName = 'Career Portal',
  logo,
  address,
  primaryWebsiteUrl = 'https://example.com',
}) => {
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };
  console.log('Logo Path:', logo);

  const logoUrl = getLogoUrl(logo);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm rounded-lg  py-5">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-16 gap-3 lg:gap-6 py-2 lg:py-0">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Desktop Logo */}
            {logoUrl && (
              //   <Link
              //     to={baseUrl || '/'}
              //     className="hidden md:block"
              //   >
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                className="hidden md:block"
              >
                <div className="h-15 w-13 sm:h-16 sm:w-14 lg:h-25 lg:w-22 rounded-lg bg-white flex items-center justify-center overflow-hidden  flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt="Institute Logo"
                    className="h-25 w-25 sm:h-26 sm:w-26 lg:h-28 lg:w-28 object-contain"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png/220px-National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png';
                    }}
                  />
                </div>
              </Link>
            )}

            {/* Mobile Logo */}
            {logoUrl && (
              <div className="md:hidden">
                <img
                  src={logoUrl}
                  alt="Institute Logo"
                  className="h-15 w-15 object-contain"
                  onError={(e) => {
                    e.currentTarget.src =
                      'https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png/220px-National_University_of_Study_and_Research_in_Law%2C_Ranchi_Logo.png';
                  }}
                />
              </div>
            )}

            {/* Title and Address */}
            <div className="flex flex-col min-w-0 flex-1">
              {/* <Link
                to={baseUrl || '/'}
                className="min-w-0 hover:no-underline"
              >
                <h1 className="text-sm lg:text-base font-bold text-slate-900 leading-tight truncate hover:text-indigo-600 transition-colors">
                  {instituteName}
                </h1>
              </Link> */}
              <Link
                to="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.location.reload();
                }}
                className="min-w-0 hover:no-underline"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight truncate hover:text-indigo-600 transition-colors">
                  {instituteName}
                </h1>
              </Link>

              {address && <span className="text-md text-slate-500 truncate mt-1">{address}</span>}
            </div>
          </div>

          {/* Button - Always right side */}
       
        </div>
      </div>
    </header>
  );
};

export default Header;
