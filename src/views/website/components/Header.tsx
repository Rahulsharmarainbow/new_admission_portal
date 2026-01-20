// Header.tsx (Updated)
import React from 'react';
import { Link } from 'react-router';

const assetUrl = import.meta.env.VITE_ASSET_URL || '';

interface HeaderProps {
  baseUrl?: string;
  institute_id?: string;
  instituteName?: string;
  logo?: string;
  address?: string;
  primaryWebsiteUrl?: string;
  themeColor?: string;
}

const Header: React.FC<HeaderProps> = ({
  baseUrl,
  institute_id,
  instituteName = 'Career Portal',
  logo,
  address,
  primaryWebsiteUrl = '',
  themeColor,
}) => {
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };

  const logoUrl = getLogoUrl(logo);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Left Block */}
          <div className="flex items-start gap-3 flex-1">
            {logoUrl && (
              <Link to={baseUrl || '/'}>
                <button className="flex-shrink-0">
                  <img
                    src={logoUrl}
                    alt="Institute Logo"
                    className="h-12 w-12 sm:h-14 sm:w-14 object-contain"
                  />
                </button>
              </Link>
            )}

            <div className="flex-1">
              <Link to={baseUrl || '/'}>
                <button className="text-left w-full">
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-slate-900 truncate hover:theme-text">
                    {instituteName}
                  </h1>
                </button>
              </Link>

              {address && (
                <div className="text-xs sm:text-sm text-slate-500 leading-relaxed break-words whitespace-normal">
                 <div dangerouslySetInnerHTML={{__html: address}} />
                </div>
              )}
            </div>
          </div>

          {/* Right Button */}
          <div className="flex justify-start md:justify-end">
            {primaryWebsiteUrl && (
              <a
                href={primaryWebsiteUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="w-full text-white md:w-auto theme-button px-4 py-2 rounded-lg text-sm font-medium transition shadow-md"
                  style={themeColor ? { backgroundColor: themeColor } : {}}
                >
                  Go to Homepage
                </button>
              </a>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;