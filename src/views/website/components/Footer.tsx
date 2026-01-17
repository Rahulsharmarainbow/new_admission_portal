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
  IconCopyright,
  IconChevronRight
} from '@tabler/icons-react';

const assetUrl = import.meta.env.VITE_ASSET_URL || '';

interface FooterProps {
  baseUrl?: string;
  instituteName?: string;
  institute?: any;
  footerData?: any;
}

const Footer: React.FC<FooterProps> = ({
  baseUrl = '',
  instituteName = '',
  institute,
  footerData,
}) => {
  // Helper function to safely get values
  const getLogoUrl = (logoPath?: string) => {
    if (!logoPath) return null;
    return logoPath.startsWith('http') ? logoPath : `${assetUrl}/${logoPath}`;
  };

  // Extract data with fallbacks
  const instituteHeader = institute?.header || {};
  const footerInfo = footerData || {};
  
  const logoUrl = getLogoUrl(instituteHeader.academic_logo);
  const academicName = instituteName || instituteHeader.academic_name || 'Career Portal';
  const academicAddress = footerInfo.academic_address || '';
  const academicEmail = footerInfo.academic_email || '';
  const academicMobile = footerInfo.academic_mobile || '';
  const academic_description = footerInfo.academic_description || '';
  const academicWebsite = footerInfo?.academic_website || '';
  
  // Process social links safely
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

  // Quick links for footer
  const quickLinks = [
    { name: 'Home', path: `${baseUrl}/` },
    { name: 'About Us', path: `${baseUrl}/about` },
    { name: 'Careers', path: `${baseUrl}/careers` },
    { name: 'Contact', path: `${baseUrl}/contact` },
  ];

  const policyLinks = [
    { name: 'Privacy Policy', path: `${baseUrl}/privacy` },
    { name: 'Terms of Service', path: `${baseUrl}/terms` },
    { name: 'Cookie Policy', path: `${baseUrl}/cookies` },
  ];

  // Icon mapping configuration
  const iconConfig = {
    'Facebook': {
      bgColor: 'group-hover:bg-blue-600',
      icon: IconBrandFacebook,
      gradient: 'from-blue-500 to-blue-700'
    },
    'Instagram': {
      bgColor: 'group-hover:bg-gradient-to-r group-hover:from-pink-500 group-hover:via-red-500 group-hover:to-yellow-500',
      icon: IconBrandInstagram,
      gradient: 'from-pink-500 via-red-500 to-yellow-500'
    },
    'LinkedIn': {
      bgColor: 'group-hover:bg-blue-700',
      icon: IconBrandLinkedin,
      gradient: 'from-blue-600 to-blue-800'
    },
    'Twitter': {
      bgColor: 'group-hover:bg-sky-500',
      icon: IconBrandTwitter,
      gradient: 'from-sky-400 to-sky-600'
    },
    'YouTube': {
      bgColor: 'group-hover:bg-red-600',
      icon: IconBrandYoutube,
      gradient: 'from-red-500 to-red-700'
    },
    'WhatsApp': {
      bgColor: 'group-hover:bg-emerald-500',
      icon: IconBrandWhatsapp,
      gradient: 'from-emerald-400 to-emerald-600'
    },
    'Telegram': {
      bgColor: 'group-hover:bg-blue-500',
      icon: IconBrandTelegram,
      gradient: 'from-blue-400 to-blue-600'
    },
    'GitHub': {
      bgColor: 'group-hover:bg-gray-800',
      icon: IconBrandGithub,
      gradient: 'from-gray-700 to-gray-900'
    },
    'TikTok': {
      bgColor: 'group-hover:bg-black',
      icon: IconBrandTiktok,
      gradient: 'from-gray-800 to-black'
    },
    'Website': {
      bgColor: 'group-hover:bg-purple-600',
      icon: IconWorld,
      gradient: 'from-purple-500 to-purple-700'
    },
    'Email': {
      bgColor: 'group-hover:bg-red-500',
      icon: IconMail,
      gradient: 'from-red-400 to-red-600'
    },
    'Phone': {
      bgColor: 'group-hover:bg-green-500',
      icon: IconPhone,
      gradient: 'from-green-400 to-green-600'
    },
    'Location': {
      bgColor: 'group-hover:bg-orange-500',
      icon: IconMapPin,
      gradient: 'from-orange-400 to-orange-600'
    }
  };

  return (
    <footer className="bg-gradient-to-b from-white to-slate-50 border-t border-slate-200 mt-20">
      {/* Main Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-5">
          
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="flex flex-col space-y-6">
              {/* Logo Section */}
              <Link to={baseUrl} className="group">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-orange-400 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300"></div>
                    {logoUrl ? (
                      <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-lg border-2 border-orange-500 overflow-hidden relative z-10">
                        <img
                          src={logoUrl}
                          alt={`${academicName} Logo`}
                          className="h-12 w-12 object-contain p-1"
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.src = 'https://upload.wikimedia.org/wikipedia/commons/a/ac/No_image_available.svg';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg relative z-10 group-hover:scale-105 transition-transform duration-300">
                        <span className="text-white font-bold text-xl">
                          {academicName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {academicName}
                    </h2>
                    {/* <p className="text-sm text-slate-600 mt-1">Career Portal</p> */}
                  </div>
                </div>
              </Link>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed">
                {academic_description}
              </p>

              {/* Social Media Links */}
              <div className="space-y-3">
                <p className="text-sm font-semibold text-slate-700">Follow Us</p>
                <div className="flex flex-wrap gap-2">
                  {socialLinks.slice(0, 6).map((social, index) => {
                    const config = iconConfig[social.icon] || iconConfig.Website;
                    const IconComponent = config.icon;
                    
                    return (
                      <a
                        key={index}
                        href={social.icon_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`group relative w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg ${config.bgColor}`}
                        aria-label={social.icon}
                        title={social.icon}
                      >
                        <div className={`absolute inset-0 rounded-xl bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                        <IconComponent className="w-5 h-5 text-slate-600 group-hover:text-white relative z-10 transition-colors duration-300" />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

        

          {/* Contact Info Column */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-slate-900 mb-6 relative inline-block">
              Contact Information
              <span className="absolute -bottom-2 left-0 w-8 h-1 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full"></span>
            </h3>
            
            <div className="space-y-6">
              {/* Address */}
              {academicAddress && (
                <div className="flex items-start space-x-3 group cursor-default">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconMapPin className="w-5 h-5 text-orange-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Address</p>
                    <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                      {academicAddress}
                    </p>
                  </div>
                </div>
              )}

              {/* Email & Phone Row */}
              <div className="grid grid-cols-1 md:grid-cols-8 lg:gap-10">
                {academicEmail && (
                  <div className="flex items-start space-x-3 group col-span-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-50 to-pink-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconMail className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email</p>
                      <a
                        href={`mailto:${academicEmail}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-block mt-1"
                      >
                        {academicEmail}
                      </a>
                    </div>
                  </div>
                )}

                {academicMobile && (
                  <div className="flex items-start space-x-3 group col-span-2">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <IconPhone className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-700">Phone</p>
                      <a
                        href={`tel:${academicMobile.replace(/\D/g, '')}`}
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-block mt-1"
                      >
                        {academicMobile}
                      </a>
                    </div>
                  </div>
                )}
              

              {/* Website */}
              {academicWebsite && (
                <div className="flex items-start space-x-3 group col-span-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-purple-50 to-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <IconWorld className="w-5 h-5 text-purple-500" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-700">Website</p>
                    <a
                      href={academicWebsite.startsWith('http') ? academicWebsite : `https://${academicWebsite}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-indigo-600 hover:text-indigo-700 font-medium transition-colors inline-block mt-1"
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

   
    </footer>
  );
};

export default Footer;