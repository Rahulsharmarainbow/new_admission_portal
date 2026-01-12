
import React from 'react';
import { Link } from 'react-router';

const assetUrl =
  import.meta.env.VITE_ASSET_URL || '';

interface HeaderProps {
  baseUrl?: string;
  institute_id?: string;
  instituteName?: string;
  logo?: string;
  address?: string;
  primaryWebsiteUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  baseUrl,
  institute_id,
  instituteName = 'Career Portal',
  logo,
  address,
  primaryWebsiteUrl = '',
}) => {

  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };

  const logoUrl = getLogoUrl(logo);


  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-3">

        {/* MAIN FLEX */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

          {/* Left Block */}
          <div className="flex items-center gap-3 min-w-0">

            {logoUrl && (
              <Link to={baseUrl}>
                <button className="flex-shrink-0">
                <img
                  src={logoUrl}
                  alt="Institute Logo"
                  className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                />
              </button>
              </Link>
            )}

            <div className="min-w-0">
              <Link to={baseUrl}>
              <button className="text-left">
                <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 truncate hover:text-indigo-600">
                  {instituteName}
                </h1>
              </button>
              </Link>

              {address && (
                <p className="text-xs sm:text-sm text-slate-500 truncate">
                  {address}
                </p>
              )}
            </div>
          </div>

          {/* Right Button */}
          <div className="flex justify-start md:justify-end">
            <Link to={primaryWebsiteUrl}>
            <button
              className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
            >
              Go to Homepage
            </button>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
