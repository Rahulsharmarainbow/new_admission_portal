// src/pages/Header.tsx
import React from 'react';
import { Link, useNavigate, useParams } from 'react-router';

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
  const navigate = useNavigate();
  const { instituteId } = useParams();
  
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };
  console.log('Logo Path:', logo);

  const logoUrl = getLogoUrl(logo);

  const handleHomeClick = () => {
    const id = institute_id || instituteId ;
    navigate(`/Frontend/${id }`);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm rounded-lg  py-5">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-20 lg:h-16 gap-3 lg:gap-6 py-2 lg:py-0">
          {/* Logo + Title */}
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            {/* Desktop Logo */}
            {logoUrl && (
              <button
                onClick={handleHomeClick}
                className="hidden md:block cursor-pointer"
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
              </button>
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
              <button
                onClick={handleHomeClick}
                className="min-w-0 hover:no-underline text-left cursor-pointer"
              >
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 leading-tight truncate hover:text-indigo-600 transition-colors">
                  {instituteName}
                </h1>
              </button>

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
