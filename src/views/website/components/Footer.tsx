// Footer.tsx (Updated with Theme Color)
import React from 'react';
import { Link } from 'react-router';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandWhatsapp,
  IconBrandTelegram,
  IconBrandGithub,
  IconBrandTiktok,
  IconWorld,
  IconMail,
  IconPhone,
  IconMapPin,
} from '@tabler/icons-react';

const assetUrl = import.meta.env.VITE_ASSET_URL || '';

interface FooterProps {
  baseUrl?: string;
  instituteName?: string;
  institute?: any;
  footerData?: any;
  developedBy?: any;
  themeColor?: string;
  fontFamily?: string;
}

const Footer: React.FC<FooterProps> = ({
  baseUrl = '',
  instituteName = '',
  institute,
  footerData,
  developedBy,
  themeColor = '#3B82F6',
  fontFamily,
}) => {
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };

  const instituteHeader = institute?.header || {};
  const footerInfo = footerData || {};

  const logoUrl = getLogoUrl(instituteHeader.academic_logo);
  const academicName = instituteName || instituteHeader.academic_name || 'Career Portal';
  const academicAddress = footerInfo.academic_address || '';
  const academicEmail = footerInfo.academic_email || '';
  const academicMobile = footerInfo.academic_mobile || '';
  const academic_description = footerInfo.academic_description || '';
  const academicWebsite = footerInfo?.academic_website || '';

  const socialLinks = React.useMemo(() => {
    if (!footerInfo.social_icon) return [];
    try {
      return Array.isArray(footerInfo.social_icon)
        ? footerInfo.social_icon
        : JSON.parse(footerInfo.social_icon || '[]');
    } catch (error) {
      console.error('Error parsing social icons:', error);
      return [];
    }
  }, [footerInfo.social_icon]);

  // Convert hex to RGB for CSS variables
  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '59, 130, 246'; // default blue
  };

  const themeRgb = hexToRgb(themeColor);

  // CSS styles for theme color
  const themeStyles = {
    '--theme-color': themeColor,
    '--theme-color-rgb': themeRgb,
    '--font-family': fontFamily || 'Inter, system-ui, -apple-system, sans-serif',
  } as React.CSSProperties;

  return (
    <footer 
      className="mt-20"
      style={themeStyles}
    >
      {/* Apply font family to entire footer */}
      <div className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <div className="flex flex-col space-y-6">
                {/* Logo Section with Theme Color */}
                <Link to={baseUrl} className="group">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div 
                        className="absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"
                        style={{ background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}99 50%, ${themeColor}66 100%)` }}
                      ></div>
                      {logoUrl ? (
                        <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg overflow-hidden relative z-10 border-2 border-slate-100">
                          <img
                            src={logoUrl}
                            alt={`${academicName} Logo`}
                            className="h-12 w-12 object-contain p-1"
                            loading="lazy"
                            onError={(e) => {
                              e.currentTarget.src =
                                'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                            }}
                          />
                        </div>
                      ) : (
                        <div 
                          className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300"
                          style={{ 
                            background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}99 50%, ${themeColor}66 100%)` 
                          }}
                        >
                          <span className="text-white font-bold text-xl">
                            {academicName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 
                        className="text-xl font-bold text-slate-900 group-hover:theme-text transition-colors"
                        style={{ fontFamily: fontFamily || 'inherit' }}
                      >
                        {academicName}
                      </h2>
                    </div>
                  </div>
                </Link>

                {/* Description with theme color accent */}
                <p 
                  className="text-sm text-slate-600 leading-relaxed"
                  style={{ fontFamily: fontFamily || 'inherit' }}
                >
                  {academic_description}
                </p>

                {/* Social Media Links with Theme Color */}
                <div className="space-y-3">
                  <p 
                    className="text-sm font-semibold text-slate-700"
                    style={{ fontFamily: fontFamily || 'inherit' }}
                  >
                    Follow Us
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {socialLinks.slice(0, 6).map((social, index) => (
                      <a
                        key={index}
                        href={social.icon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg"
                        aria-label={social.icon}
                        title={social.icon}
                        style={{
                          borderColor: themeColor,
                          borderWidth: '1px',
                        }}
                      >
                        <div 
                          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          style={{ backgroundColor: themeColor }}
                        ></div>
                        {social.icon === 'Facebook' && (
                          <IconBrandFacebook className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'Instagram' && (
                          <IconBrandInstagram className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'LinkedIn' && (
                          <IconBrandLinkedin className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'Twitter' && (
                          <IconBrandTwitter className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'YouTube' && (
                          <IconBrandYoutube className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'WhatsApp' && (
                          <IconBrandWhatsapp className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'Telegram' && (
                          <IconBrandTelegram className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'GitHub' && (
                          <IconBrandGithub className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'TikTok' && (
                          <IconBrandTiktok className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                        {social.icon === 'Website' && (
                          <IconWorld className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                        )}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info Column */}
            <div className="lg:col-span-2">
              <h3 
                className="text-lg font-semibold text-slate-900 mb-6 relative inline-block"
                style={{ fontFamily: fontFamily || 'inherit' }}
              >
                Contact Information
                <span 
                  className="absolute -bottom-2 left-0 w-12 h-1 rounded-full"
                  style={{ backgroundColor: themeColor }}
                ></span>
              </h3>

              <div className="space-y-6">
                {/* Address */}
                {academicAddress && (
                  <div className="flex items-start space-x-3 group cursor-default">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                      style={{ 
                        backgroundColor: `${themeColor}20`,
                        border: `1px solid ${themeColor}40`
                      }}
                    >
                      <IconMapPin className="w-5 h-5" style={{ color: themeColor }} />
                    </div>
                    <div>
                      <p 
                        className="text-sm font-medium text-slate-700"
                        style={{ fontFamily: fontFamily || 'inherit' }}
                      >
                        Address
                      </p>
                      <div 
                        className="text-sm text-slate-600 mt-1 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: academicAddress }}
                        style={{ fontFamily: fontFamily || 'inherit' }}
                      />
                    </div>
                  </div>
                )}

                {/* Email & Phone Row */}
                <div className="grid grid-cols-1 md:grid-cols-8 lg:gap-10">
                  {academicEmail && (
                    <div className="flex items-start space-x-3 group col-span-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundColor: `${themeColor}20`,
                          border: `1px solid ${themeColor}40`
                        }}
                      >
                        <IconMail className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      <div>
                        <p 
                          className="text-sm font-medium text-slate-700"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          Email
                        </p>
                        <a
                          href={`mailto:${academicEmail}`}
                          className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors inline-block mt-1"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          {academicEmail}
                        </a>
                      </div>
                    </div>
                  )}

                  {academicMobile && (
                    <div className="flex items-start space-x-3 group col-span-2">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundColor: `${themeColor}20`,
                          border: `1px solid ${themeColor}40`
                        }}
                      >
                        <IconPhone className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      <div>
                        <p 
                          className="text-sm font-medium text-slate-700"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          Phone
                        </p>
                        <a
                          href={`tel:${academicMobile.replace(/\D/g, '')}`}
                          className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors inline-block mt-1"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          {academicMobile}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Website */}
                  {academicWebsite && (
                    <div className="flex items-start space-x-3 group col-span-3">
                      <div 
                        className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300"
                        style={{ 
                          backgroundColor: `${themeColor}20`,
                          border: `1px solid ${themeColor}40`
                        }}
                      >
                        <IconWorld className="w-5 h-5" style={{ color: themeColor }} />
                      </div>
                      <div>
                        <p 
                          className="text-sm font-medium text-slate-700"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          Website
                        </p>
                        <a
                          href={
                            academicWebsite.startsWith('http')
                              ? academicWebsite
                              : `https://${academicWebsite}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-slate-600 hover:text-slate-700 font-medium transition-colors inline-block mt-1"
                          style={{ fontFamily: fontFamily || 'inherit' }}
                        >
                          {academicWebsite.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom with Theme Color */}
      <div 
        className="py-4"
        style={{ 
          backgroundColor: themeColor,
          background: `linear-gradient(135deg, ${themeColor} 0%, ${themeColor}99 50%, ${themeColor}66 100%)` 
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p 
              className="text-sm text-white/90 text-center md:text-left"
              style={{ fontFamily: fontFamily || 'inherit' }}
            >
              &copy; {new Date().getFullYear()} {academicName}. 
            </p>
            {developedBy && (
              <p 
                className="text-sm text-white/80 text-center md:text-right"
                style={{ fontFamily: fontFamily || 'inherit' }}
              >
                {developedBy}
              </p>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;