import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Apply from "./Apply";
import Loader from "../Common/Loader";
import { Helmet } from "react-helmet-async";
import Header from "../Common/Header";
import Footer from "../Common/Footer";
import NotFound from "./NotFound";
import CareerTypePage from "./CareerTypePage";

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

const TypePage = () => {
  let { institute_id, page_route } = useParams();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch page data
  useEffect(() => {
    // if (!institute_id || !page_route) return;
    if (!institute_id || institute_id === ':institute_id') {
    institute_id = window.location.hostname; // use domain as fallback
  }

    const fetchPageData = async () => {
      setLoading(true); // show loader while fetching
      try {
        const response = await fetch(`${apiUrl}/Public/getDynamicPageData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            academic_id: institute_id,
            page_route: page_route,
          }),
        });

        const data = await response.json();
        setPageData(data);
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
        window.scrollTo({ top: 0, behavior: "smooth" }); // ✅ scroll AFTER load
      }
    };

    fetchPageData();
  }, [institute_id, page_route]);
  
  // ✅ Show loader first
  if (loading) return <Loader />;

  
  // ✅ Handle special route
  if (page_route === "apply") return <Apply />;

  // ✅ Not found case
  if (!pageData) {
    return <NotFound />;
  }

  // ✅ Remove inline font-family
  const cleanHTML = (html) => {
    return html.replace(/font-family\s*:[^;"]*;?/gi, "");
  };

    if(pageData.academic_type === 4) {
    return <CareerTypePage pageData={pageData} loading={loading} />;
  }


  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Helmet>
        <title>{pageData?.header?.name || "Admission Portal"}</title>
        <link
          rel="icon"
          type="image/png"
          href={
            pageData?.header?.logo
              ? `${assetUrl}/${pageData.header.logo}`
              : "/favicon.ico"
          }
        />
        <meta
          name="description"
          content={`Welcome to ${
            pageData?.header?.name || "Institute"
          } admission portal`}
        />
      </Helmet>

      <Header
        baseUrl={pageData.baseUrl}
        institute_id={pageData.unique_code}
        instituteName={pageData.header?.name}
        logo={pageData.header?.logo}
        address={pageData.header?.address}
        otherLogo={pageData.header?.academic_new_logo}
      />

      <main className="flex-grow bg-transparent mx-3 md:mx-8 py-10 flex justify-center">
        <div className="bg-white w-full max-w-8xl rounded-2xl shadow-lg p-6 sm:p-10">
          <div
            className="prose max-w-none text-gray-700 leading-relaxed prose-headings:text-gray-900 prose-p:my-4 prose-p:text-base prose-p:leading-7 prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-li:marker:text-primary"
            dangerouslySetInnerHTML={{ __html: cleanHTML(pageData?.data?.content) }}
          />
        </div>
      </main>

      <Footer footerData={pageData.footer} baseUrl={pageData.baseUrl} />
    </div>
  );
};

export default TypePage;
