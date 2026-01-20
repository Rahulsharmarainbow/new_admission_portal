import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Apply from "./Apply";
import Loader from "../Common/Loader";
import { Helmet } from "react-helmet-async";
import NotFound from "./NotFound";
import Header from "src/views/website/components/Header";
import Footer from "src/views/website/components/Footer";

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

const CareerTypePage = ({pageData, loading}:any) => {
  let { institute_id, page_route } = useParams();

    const hexToRgb = (hex: string): string => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result 
      ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
      : '59, 130, 246'; // default blue
  };

  // Helper function to check if font is a Google Font
  const isGoogleFont = (fontFamily: string): boolean => {
    const systemFonts = [
      'Arial', 'Helvetica', 'Georgia', 'Times', 'Verdana', 
      'Tahoma', 'Trebuchet MS', 'Courier New', 'Comic Sans MS'
    ];
    return !systemFonts.some(font => fontFamily.includes(font));
  };


  // Apply theme + font
useEffect(() => {
  if (!pageData?.banner) return;

  const { theme_colour, font_family } = pageData.banner;

  if (theme_colour) {
    document.documentElement.style.setProperty('--theme-color', theme_colour);
    document.documentElement.style.setProperty('--theme-color-rgb', hexToRgb(theme_colour));
  }

  if (font_family) {
    document.documentElement.style.setProperty('--font-family', font_family);

    if (isGoogleFont(font_family)) {
      const id = `google-font-${font_family}`;
      if (!document.getElementById(id)) {
        const link = document.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${font_family.replace(/\s+/g, '+')}&display=swap`;
        document.head.appendChild(link);
      }
    }
  }
}, [pageData]);


  // ✅ Remove inline font-family
  const cleanHTML = (html) => {
    return html?.replace(/font-family\s*:[^;"]*;?/gi, "");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>{pageData?.header?.academic_name || "Admission Portal"}</title>
        <link
          rel="icon"
          type="image/png"
          href={
            pageData?.header?.logo
              ? `${assetUrl}/${pageData.header.academic_logo}`
              : "/favicon.ico"
          }
        />
        <meta
          name="description"
          content={`Welcome to ${
            pageData?.header?.academic_name || "Institute"
          } admission portal`}
        />
      </Helmet>

      <Header
        instituteName={pageData?.header?.academic_name || ''}
        logo={pageData?.header?.academic_logo || ''}
        address={pageData?.footer?.academic_address || ''}
        baseUrl={pageData?.baseUrl}
        institute_id={institute_id}
        primaryWebsiteUrl={pageData?.website || ''}
        themeColor={pageData?.banner?.theme_colour}
      />

      <main className="flex-grow bg-transparent mx-3 md:mx-8 py-10 flex justify-center">
        <div className="bg-white w-full max-w-8xl rounded-2xl shadow-lg p-6 sm:p-10">
          <div
  className="prose max-w-none leading-relaxed text-gray-700"
  style={{ fontFamily: 'var(--font-family)' }}
  dangerouslySetInnerHTML={{
    __html: cleanHTML(pageData?.page?.content),
  }}
/>

        </div>
      </main>

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
