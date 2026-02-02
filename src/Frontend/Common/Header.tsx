import React from 'react';
import { Link } from 'react-router';

const assetUrl = import.meta.env.VITE_ASSET_URL;

const Header = ({ baseUrl, institute_id, instituteName, logo, otherLogo, address }) => {
  const headerData = {
    logo: {
      src:
        assetUrl + '/' + logo ||
        '',
      alt: 'University Logo',
      width: '100',
      height: '100',
    },
    otherLogo: {
      src:
        assetUrl + '/' + otherLogo ||
        '',
      alt: 'University Logo',
      width: '100',
      height: '100',
    },
    unique_code: institute_id,

    university: {
      name: instituteName || 'University',
      address: address || 'University Address',
    },
  };

  const { logo: logoData, university } = headerData;

  return (
   <header className="bg-white border-b border-gray-200">
  <div className="bg-white shadow-md container mx-auto px-4 py-2 rounded-b-2xl">

    {/* MOBILE: 2 logos top row  |  DESKTOP: All in one row */}
    <div className="flex flex-col md:flex-row items-center md:justify-center">

      {/* MOBILE LOGO ROW */}
      <div className="flex w-full justify-center md:hidden mb-2">
        {/* Left Logo */}
        {headerData?.logo && (
          
          <img
            src={headerData.logo.src}
            alt="Institute Logo"
            className="h-16 w-20 object-contain "
          />
        )}

        {/* Right Logo */}
        {otherLogo && (
          <img
            src={headerData.otherLogo.src}
            alt="Institute Logo"
            className="h-16 w-20 object-contain"
          />
        )}
      </div>

      {/* DESKTOP LEFT LOGO */}
      {headerData?.logo && (
        <Link
          to={`${baseUrl}`}
          reloadDocument
          className="hidden md:block mr-4"
        >
          <img
            src={headerData.logo.src}
            alt="Institute Logo"
            className="h-28 w-28 object-contain cursor-pointer"
          />
        </Link>
      )}

      {/* HEADING */}
      <div className="text-center">
         <Link
          to={`${baseUrl}`}
          reloadDocument
          className=" md:block mr-4"
        >
        <h1 className="md:text-3xl xl:text-4xl text-lg font-bold text-gray-900 underline underline-offset-4 decoration-red-800 pb-1 uppercase">
          {headerData.university?.name || "Institute Name"}
        </h1>
        </Link>

        {headerData.university?.address && (
           <Link
          to={`${baseUrl}`}
          reloadDocument
          className=" md:block mr-4"
        >
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            <div dangerouslySetInnerHTML={{ __html: headerData.university.address }} />
          </p>
          </Link>
        )}
      </div>

      {/* DESKTOP RIGHT LOGO */}
      {otherLogo && (
        <Link
          to={`${baseUrl}`}
          reloadDocument
          className="hidden md:block ml-4"
        >
          <img
            src={headerData.otherLogo.src}
            alt="Institute Logo"
            className="h-28 w-28 object-contain cursor-pointer"
          />
        </Link>
      )}

    </div>
  </div>
</header>

  );
};

export default Header;

// import React from 'react';

// const Header = ({ instituteName, logo, address }) => {
//   const headerData = {
//     logo: {
//       src: logo || "https://admissionportalbackend.testingscrew.com/public/company_logos/1752817396_academic.jpg",
//       alt: "University Logo",
//       width: "270",
//       height: "85"
//     },
//     university: {
//       name: instituteName || "University",
//       address: address || "University Address"
//     }
//   };

//   const { logo: logoData, university } = headerData;

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm">
//       <header>
//         <div className="flex justify-center mb-4">
//           <img
//             alt={logoData.alt}
//             loading="lazy"
//             width={logoData.width}
//             height={logoData.height}
//             decoding="async"
//             src={logoData.src}
//             className="object-contain"
//           />
//         </div>
//       </header>
//       <div className="text-center">
//         <p className="text-xl font-bold text-gray-800 mb-1">
//           {university.name}
//         </p>
//         <p className="text-sm text-gray-600">
//           {university.address}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Header;

// import React from 'react';

// const headerData = {
//   logo: {
//     src: "https://admissionportalbackend.testingscrew.com/public/company_logos/1752817396_academic.jpg",
//     alt: "University Logo",
//     width: "270",
//     height: "85"
//   },
//   university: {
//     name: "Avantika University Ujjain",
//     address: "Avantika University, Vishwanathpuram, Lekoda, Ujjain - 456006 | MP | India"
//   }
// };

// const Header = () => {
//   const { logo, university } = headerData;

//   return (
//     <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm">
//       <header>
//         <div className="flex justify-center mb-4">
//           <img
//             alt={logo.alt}
//             loading="lazy"
//             width={logo.width}
//             height={logo.height}
//             decoding="async"
//             src={logo.src}
//             className="object-contain"
//           />
//         </div>
//       </header>
//       <div className="text-center">
//         <p className="text-xl font-bold text-gray-800 mb-1">
//           {university.name}
//         </p>
//         <p className="text-sm text-gray-600">
//           {university.address}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Header;
