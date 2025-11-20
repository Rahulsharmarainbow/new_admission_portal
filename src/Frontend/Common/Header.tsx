import React from 'react';
import { Link } from 'react-router';

  const assetUrl = import.meta.env.VITE_ASSET_URL;

const Header = ({ baseUrl,institute_id,instituteName, logo, address }) => {
  const headerData = {
    logo: {
      src: assetUrl +"/" + logo || "https://admissionportalbackend.testingscrew.com/public/company_logos/1752817396_academic.jpg",
      alt: "University Logo",
      width: "100",
      height: "100"
    },
    unique_code:institute_id,

    university: {
      name: instituteName || "University",
      address: address || "University Address"
    }
  };

  const { logo: logoData, university } = headerData;

  return (
    <header className="bg-white border-b border-gray-200">
        <div className="bg-white shadow-md  container mx-auto px-4 py-1 rounded-b-2xl">
          <div className="flex flex-col md:flex-row items-center justify-center text-center md:text-left">
            {headerData?.logo && (
              <Link to={`${baseUrl}`} reloadDocument>
                <img 
                  src={`${headerData.logo.src}`} 
                  alt="Institute Logo" 
                  className="h-20 w-48 md:w-20 object-contain mr-3 cursor-pointer"
                />
              </Link>
            )}

            <div className="text-center">
              <h1 className="md:text-3xl xl:text-4xl font-bold text-gray-900 underline underline-offset-4 decoration-red-800 inline-block pb-1 uppercase">
                {headerData.university?.name || 'Institute Name'}
              </h1>
              {headerData.university?.address && (
                <p className="text-sm text-gray-600 mt-1">
                  {headerData.university.address}
                </p>
              )}
              
            </div>
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