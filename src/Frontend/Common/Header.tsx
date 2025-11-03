import React from 'react';

const Header = ({ instituteName, logo, address }) => {
  const headerData = {
    logo: {
      src: logo || "https://admissionportalbackend.testingscrew.com/public/company_logos/1752817396_academic.jpg",
      alt: "University Logo",
      width: "270",
      height: "85"
    },
    university: {
      name: instituteName || "University",
      address: address || "University Address"
    }
  };

  const { logo: logoData, university } = headerData;

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white shadow-sm">
      <header>
        <div className="flex justify-center mb-4">
          <img 
            alt={logoData.alt} 
            loading="lazy" 
            width={logoData.width} 
            height={logoData.height} 
            decoding="async" 
            src={logoData.src} 
            className="object-contain"
          />
        </div>
      </header>
      <div className="text-center">
        <p className="text-xl font-bold text-gray-800 mb-1">
          {university.name}
        </p>
        <p className="text-sm text-gray-600">
          {university.address}
        </p>
      </div>
    </div>
  );
};

export default Header;








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