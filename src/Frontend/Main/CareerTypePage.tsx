import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { Helmet } from 'react-helmet-async';
import Header from 'src/views/website/components/Header';
import Footer from 'src/views/website/components/Footer';
import NotFound from './NotFound';

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

const CareerTypePage = ({ pageData }: any) => {
  let { institute_id, page_route } = useParams();

  const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '59, 130, 246'; // default blue
  };

 

  // Apply theme + font to entire page
  useEffect(() => {
    if (!pageData?.banner) return;

    const { theme_colour, font_family } = pageData.banner;

    // Apply theme color
    if (theme_colour) {
      document.documentElement.style.setProperty('--theme-color', theme_colour);
      document.documentElement.style.setProperty('--theme-color-rgb', hexToRgb(theme_colour));
    }

    // Apply font family globally
    if (font_family) {
      const formattedFont = font_family.trim();

      // Apply font to document root
      document.documentElement.style.setProperty('--font-family', formattedFont);

      // Apply font to body and all elements
      document.body.style.fontFamily = formattedFont;

      // Load Google Font if needed
      // if (isGoogleFont(formattedFont)) {
        const fontName =formattedFont;
        const id = `google-font-${fontName}`;

        if (!document.getElementById(id)) {
          const link = document.createElement('link');
          link.id = id;
          link.rel = 'stylesheet';
          link.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@300;400;500;600;700&display=swap`;
          document.head.appendChild(link);
        }
      // }
    }

    // Cleanup on unmount
    return () => {
      document.documentElement.style.removeProperty('--font-family');
      document.body.style.fontFamily = '';
    };
  }, [pageData]);

  // ✅ Clean HTML - remove inline font-family and apply global font
  const cleanHTML = (html = '') => {
    return (
      html
        // remove embedded footer
        .replace(/<footer[\s\S]*?<\/footer>/gi, '')

        // remove fixed widths
        .replace(/width\s*:\s*\d+px;?/gi, '')
        .replace(/max-width\s*:\s*\d+px;?/gi, '')

        // remove bootstrap layout classes
        .replace(/class="[^"]*(container|row|col-[^"]*)[^"]*"/gi, 'class=""')

        // remove forced font styles
        .replace(/font-family\s*:[^;"]*;?/gi, '')
        .replace(/font-size\s*:\s*\d+px;?/gi, '')
    );
  };

  // Custom CSS for applying font to all elements
  const globalFontCSS = `
    * {
      font-family: var(--font-family, inherit) !important;
    }
    
    body {
      font-family: var(--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif) !important;
    }
    
    h1, h2, h3, h4, h5, h6,
    p, span, div, a, button, input, textarea, select,
    .prose, .prose * {
      font-family: var(--font-family, inherit) !important;
    }
  `;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 overflow-x-hidden">
      <Helmet>
        <title>{pageData?.header?.academic_name || 'Admission Portal'}</title>

        <link
          rel="icon"
          type="image/png"
          href={
            pageData?.header?.academic_logo
              ? `${assetUrl}/${pageData.header.academic_logo}`
              : '/favicon.ico'
          }
        />

        <meta
          name="description"
          content={`Welcome to ${pageData?.header?.academic_name || 'Institute'} admission portal`}
        />

        <style>{globalFontCSS}</style>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* HEADER */}
      <Header
        instituteName={pageData?.header?.academic_name || ''}
        logo={pageData?.header?.academic_logo || ''}
        address={pageData?.footer?.academic_address || ''}
        baseUrl={pageData?.baseUrl}
        institute_id={institute_id}
        primaryWebsiteUrl={pageData?.website || ''}
        themeColor={pageData?.banner?.theme_colour}
      />

      {/* MAIN */}
      <main className="flex-grow w-full px-2 sm:px-4 md:px-6 lg:px-8 py-6 md:py-10 flex justify-center">
        <div className="w-full max-w-7xl bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 overflow-hidden">
          <div
          style={{textAlign:"justify"}}
            className="
              cms-content
              prose
              prose-sm
              sm:prose-base
              lg:prose-lg
              max-w-none
              text-gray-700
              leading-relaxed
            "
                      dangerouslySetInnerHTML={{
                        __html: cleanHTML(pageData?.data?.content),
                      }}
                    />
          </div>
      </main>

      {/* FOOTER */}
      <Footer
        footerData={pageData?.footer}
        baseUrl={pageData?.baseUrl}
        instituteName={pageData?.header?.academic_name}
        institute={pageData}
        developedBy={pageData?.banner?.developed_by}
        themeColor={pageData?.banner?.theme_colour}
        fontFamily={pageData?.banner?.font_family}
      />
    </div>
  );
};

export default CareerTypePage;
