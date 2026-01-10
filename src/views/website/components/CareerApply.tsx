// // src/pages/FlyingStarsHome.tsx
// import React, { useMemo, useState } from "react";
// import { useNavigate } from "react-router";
// import Header from "./Header";
// import Footer from "./Footer";

// type Job = {
//   id: number;
//   title: string;
//   company: string;
//   location: string;
//   type: string;
//   experience: string;
// };

// const MOCK_JOBS: Job[] = [
//   {
//     id: 1,
//     title: "Frontend Developer (React)",
//     company: "Flying Stars Tech",
//     location: "Bengaluru, India",
//     type: "Full-time",
//     experience: "2-4 years",
//   },
//   {
//     id: 2,
//     title: "Backend Developer (Node.js)",
//     company: "Flying Stars Tech",
//     location: "Pune, India",
//     type: "Full-time",
//     experience: "3-5 years",
//   },
//   {
//     id: 3,
//     title: "UI/UX Designer",
//     company: "Flying Stars Studio",
//     location: "Remote",
//     type: "Contract",
//     experience: "1-3 years",
//   },
//   {
//     id: 4,
//     title: "DevOps Engineer",
//     company: "Flying Stars Cloud",
//     location: "Hyderabad, India",
//     type: "Full-time",
//     experience: "4-6 years",
//   },
//   {
//     id: 5,
//     title: "Full Stack Developer",
//     company: "Flying Stars Solutions",
//     location: "Remote",
//     type: "Part-time",
//     experience: "3-5 years",
//   },
//   {
//     id: 6,
//     title: "Product Manager",
//     company: "Flying Stars Studio",
//     location: "Bengaluru, India",
//     type: "Full-time",
//     experience: "5+ years",
//   },
// ];

// // Filter options from FILE 1
// const jobTypes = ["All", "Full-time", "Part-time", "Contract"];
// const locations = ["All", "Bengaluru, India", "Pune, India", "Hyderabad, India", "Remote"];

// interface FlyingStarsHomeProps {
//   primaryWebsiteUrl?: string;
//   dynamicImageUrl?: string;
// }

// const CareerApply: React.FC<FlyingStarsHomeProps> = ({
//   primaryWebsiteUrl = "https://your-primary-website.com",
//   dynamicImageUrl = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg",
// }) => {
//   const navigate = useNavigate();
//   const [search, setSearch] = useState("");
//   const [selectedType, setSelectedType] = useState("All");
//   const [selectedLocation, setSelectedLocation] = useState("All");

//   const filteredJobs = useMemo(() => {
//     return MOCK_JOBS.filter((job) => {
//       const matchesSearch =
//         search.trim().length === 0 ||
//         `${job.title} ${job.company} ${job.location} ${job.type} ${job.experience}`
//           .toLowerCase()
//           .includes(search.toLowerCase());

//       const matchesType = selectedType === "All" || job.type === selectedType;
//       const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;

//       return matchesSearch && matchesType && matchesLocation;
//     });
//   }, [search, selectedType, selectedLocation]);

//   const handleApplyClick = (job: Job) => {
//     navigate(
//       `/aapply?jobId=${job.id}&title=${encodeURIComponent(
//         job.title
//       )}&company=${encodeURIComponent(
//         job.company
//       )}&location=${encodeURIComponent(job.location)}`
//     );
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
     


// <Header/>


//       {/* HERO BANNER */}
//       <section className="py-10 md:py-10">
//         <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
//           {/* MAIN JOINED CARD */}
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
//               <p className="text-sm md:text-base font-semibold tracking-wide uppercase text-white/90">
//                 Fly high with Flying Stars
//               </p>

//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
//                 Love{" "}
//                 <span className="inline-flex items-center justify-center w-8 h-8 md:w-9 md:h-9 rounded-full bg-white text-orange-500 text-lg md:text-xl mx-1">
//                   ♥
//                 </span>
//                 What You Do, Grow with a Team That Brings Out Your Best
//               </h2>

//               <p className="text-sm md:text-base text-white/90 max-w-xl">
//                 Join a dynamic team of innovators, problem-solvers, and creative
//                 visionaries shaping the digital future.
//               </p>

//               <p className="text-xs md:text-sm text-white/90 max-w-xl">
//                 At Flying Stars, continuous learning, collaboration, and
//                 innovation power impactful projects while maintaining a fun,
//                 positive work culture where quality and integrity come first.
//               </p>

//               <p className="text-xs md:text-sm text-white/90 max-w-xl">
//                 Be part of a journey where your contributions drive meaningful
//                 change and fuel extraordinary success.
//               </p>
//             </div>

//             {/* RIGHT IMAGE BLOCK */}
//             <div className="w-full h-full">
//               <img
//                 src={dynamicImageUrl}
//                 alt="Flying Stars team member"
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search */}
//       <section className="bg-white border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-4">
//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                   Search jobs
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Type a role, skill, location, or keyword to see matching jobs
//                   instantly.
//                 </p>
//               </div>
//             </div>

//             {/* Live search input */}
//             <div className="relative">
//               <svg
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by role, skill, company, location..."
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//               />
//             </div>

//             <div className="text-sm text-slate-600 flex items-center justify-between">
//               <span>
//                 Showing{" "}
//                 <span className="font-semibold text-slate-900">
//                   {filteredJobs.length}
//                 </span>{" "}
//                 open positions
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards 70% */}
//             <div className="lg:col-span-8 space-y-4">
//               {filteredJobs.length === 0 ? (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No jobs found
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Try adjusting your search or filters.
//                   </p>
//                 </div>
//               ) : (
//                 filteredJobs.map((job) => (
//                   <article
//                     key={job.id}
//                     className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                   >
//                     <div className="p-6 lg:p-8">
//                       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                         <div className="space-y-2">
//                           <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2">
//                             {job.title}
//                           </h3>
//                           <p className="text-base text-slate-700 font-semibold">
//                             {job.company}
//                           </p>
//                           <div className="flex flex-wrap gap-3 mt-3">
//                             <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
//                               <svg
//                                 className="w-3 h-3"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                               </svg>
//                               {job.location}
//                             </span>
//                             <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
//                               <svg
//                                 className="w-3 h-3"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                                 />
//                               </svg>
//                               {job.type}
//                             </span>
//                             <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                               {job.experience}
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                           <button
//                             onClick={() => handleApplyClick(job)}
//                             className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
//                           >
//                             Apply now →
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               )}
//             </div>

//             {/* Filters 30% - FROM FILE 1 */}
//             <aside className="lg:col-span-4">
//               <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                 <div className="space-y-4">
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                     <p className="text-xs text-slate-600">Refine results by job type and location.</p>
//                   </div>

//                   {/* Job type filters */}
//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-slate-700 block mb-1">Job type</label>
//                     <div className="flex flex-wrap gap-2">
//                       {jobTypes.map((type) => (
//                         <button
//                           key={type}
//                           onClick={() => setSelectedType(type)}
//                           className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                             selectedType === type
//                               ? "bg-indigo-600 text-white shadow-sm"
//                               : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                           }`}
//                         >
//                           {type}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Location filters */}
//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-slate-700 block mb-1">Location</label>
//                     <div className="flex flex-wrap gap-2">
//                       {locations.map((loc) => (
//                         <button
//                           key={loc}
//                           onClick={() => setSelectedLocation(loc)}
//                           className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                             selectedLocation === loc
//                               ? "bg-indigo-600 text-white shadow-sm"
//                               : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                           }`}
//                         >
//                           {loc}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   <button
//                     onClick={() => {
//                       setSelectedType("All");
//                       setSelectedLocation("All");
//                       setSearch("");
//                     }}
//                     className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer/>
//     </div>
//   );
// };



// export default CareerApply;









// // src/pages/CareerApply.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import NotFound from 'src/Frontend/Main/NotFound';

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type Job = {
//   id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   location: string;
//   job_type: string;
//   experience: string;
//   created_at: string;
//   apply_url?: string;
//   salary?: string;
//   deadline?: string;
//   status?: string;
// };

// // Filter options from API response
// const jobTypes = ["All", "Full Time", "Part time", "Contract", "Internship", "Remote"];
// const locations = ["All", "Pune (India)", "Bengaluru, India", "Remote", "Hyderabad, India", "Delhi, India", "Mumbai, India"];

// const CareerApply: React.FC = () => {
//   const { institute_id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for institute data
//   const [institute, setInstitute] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // State for jobs
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedType, setSelectedType] = useState("All");
//   const [selectedLocation, setSelectedLocation] = useState("All");

//   // Extract unique_code from URL or use institute_id
//   const getUniqueCode = () => {
//     console.log('Current institute_id from params:', institute_id);
    
//     // If institute_id is provided in URL params
//     if (institute_id && institute_id !== ':institute_id') {
//       return institute_id;
//     }
    
//     // Try to extract from URL path
//     const pathParts = location.pathname.split('/');
//     console.log('Path parts:', pathParts);
    
//     // Look for potential unique_code in URL path
//     for (const part of pathParts) {
//       if (part && part !== 'careers' && part !== 'career' && part !== 'apply' && part !== '') {
//         // Check if it looks like a unique code (alphanumeric, length > 5)
//         if (/^[a-zA-Z0-9]+$/.test(part) && part.length > 5) {
//           console.log('Found potential unique_code in path:', part);
//           return part;
//         }
//       }
//     }
    
//     // Try to get from query parameters
//     const searchParams = new URLSearchParams(location.search);
//     const codeFromQuery = searchParams.get('code') || searchParams.get('institute');
//     if (codeFromQuery) {
//       console.log('Found unique_code in query params:', codeFromQuery);
//       return codeFromQuery;
//     }
    
//     console.log('No unique_code found');
//     return null;
//   };

//   // Fetch institute and career data
//   useEffect(() => {
//     const fetchCareerData = async () => {
//       try {
//         const uniqueCode = getUniqueCode();
        
//         if (!uniqueCode) {
//           setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
//           toast.error('Institute code not found');
//           setLoading(false);
//           return;
//         }

//         console.log('Making API call with unique_code:', uniqueCode);
        
//         setLoading(true);
        
//         // API call to get career data
//         const response = await axios.post(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           {
//             unique_code: uniqueCode
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('API Response:', response.data);

//         if (response.data && response.data.status === true) {
//           const data = response.data;
//           setInstitute(data);
          
//           // Transform API jobs data according to response structure
//           if (data.jobs && Array.isArray(data.jobs)) {
//             const transformedJobs: Job[] = data.jobs.map((job: any, index: number) => ({
//               id: job.id || index + 1,
//               job_title: job.job_title || 'Job Position',
//               company_name: job.company_name || data.header?.academic_name || 'Company',
//               description: job.description || '',
//               location: job.location || 'Not specified',
//               job_type: job.job_type || 'Full Time',
//               experience: job.experience || 'Not specified',
//               created_at: job.created_at,
//               apply_url: job.apply_url,
//               salary: job.salary,
//               deadline: job.deadline,
//               status: job.status || 'active'
//             }));
//             setJobs(transformedJobs);
//             console.log('Transformed jobs:', transformedJobs);
//           } else {
//             console.log('No jobs in API response');
//             setJobs([]);
//           }
//         } else {
//           setError('No career data found for this institute');
//           toast.error('No career data available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching career data:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCareerData();
//   }, [institute_id, location.pathname, location.search]);

//   // Filter jobs
//   const filteredJobs = jobs.filter((job) => {
//     const matchesSearch =
//       search.trim().length === 0 ||
//       `${job.job_title} ${job.company_name} ${job.location} ${job.job_type} ${job.experience} ${job.description || ''}`
//         .toLowerCase()
//         .includes(search.toLowerCase());

//     const matchesType = selectedType === "All" || job.job_type === selectedType;
//     const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;

//     return matchesSearch && matchesType && matchesLocation;
//   });

//   const handleApplyClick = (job: Job) => {
//   if (job.apply_url) {
//     window.open(job.apply_url, '_blank');
//   } else {
//     const uniqueCode = getUniqueCode(); // पहले unique code निकालें
    
//     navigate(
//       `/aapply?jobId=${job.id}&title=${encodeURIComponent(
//         job.job_title
//       )}&company=${encodeURIComponent(
//         job.company_name
//       )}&location=${encodeURIComponent(job.location)}&type=${encodeURIComponent(job.job_type)}`,
//       {
//         state: { 
//           institute_id: uniqueCode 
//         }
//       }
//     );
//   }
// };

//   // Set page title and favicon
//   useEffect(() => {
//     if (institute) {
//       const instituteName = institute.header?.academic_name || 'Career Portal';
//       document.title = `${instituteName} - Careers`;
      
//       // Set favicon
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = institute.header?.academic_logo
//         ? `${assetUrl}/${institute.header.academic_logo}`
//         : '/favicon.ico';
      
//       setFavicon(faviconUrl);
//     }
//   }, [institute]);

//   if (loading) {
//     return <Loader/>;
//   }

//   if (error || !institute) {
//     return <NotFound/>;
//   }

//   // Get dynamic image from API or use default
//   const getDynamicImageUrl = () => {
//     if (institute.header?.banner?.banner_image) {
//       return `${assetUrl}/${institute.header.banner.banner_image}`;
//     }
//     if (institute.header?.academic_logo) {
//       return `${assetUrl}/${institute.header.academic_logo}`;
//     }
//     return "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//   };

//   // Get institute website URL
//   const getInstituteWebsiteUrl = () => {
//     return institute.website || 'https://example.com';
//   };

//   // Get institute name
//   const getInstituteName = () => {
//     return institute.header?.academic_name || 'Career Portal';
//   };

//   // Get institute address
//   const getInstituteAddress = () => {
//     return institute.footer?.academic_address || '';
//   };

//   // Get institute logo
//   const getInstituteLogo = () => {
//     return institute.header?.academic_logo || '';
//   };

//   // Get career description from banner
//   const getCareerDescription = () => {
//     if (institute.header?.banner?.long_description) {
//       // Remove HTML tags for plain text
//       return institute.header.banner.long_description.replace(/<[^>]*>/g, '');
//     }
//     return `Join a dynamic team at ${getInstituteName()} and build your career with us.`;
//   };

//   // Get HTML description for display
//   const getHTMLDescription = () => {
//     return institute.header?.banner?.long_description || '';
//   };

//   // Get banner title
//   const getBannerTitle = () => {
//     return institute.header?.banner?.title || 'Build Your Career With Us';
//   };

//   // Get current unique code for display
//   const currentUniqueCode = getUniqueCode();

//   // Extract unique job types and locations from API response
//   const extractJobTypes = () => {
//     const types = new Set(["All"]);
//     jobs.forEach(job => {
//       if (job.job_type) {
//         types.add(job.job_type);
//       }
//     });
//     return Array.from(types);
//   };

//   const extractLocations = () => {
//     const locs = new Set(["All"]);
//     jobs.forEach(job => {
//       if (job.location) {
//         locs.add(job.location);
//       }
//     });
//     return Array.from(locs);
//   };

//   const availableJobTypes = extractJobTypes();
//   const availableLocations = extractLocations();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <Helmet>
//         <title>{getInstituteName()} - Careers</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={getInstituteName()}
//         logo={getInstituteLogo()}
//         address={getInstituteAddress()}
//         baseUrl={`/${currentUniqueCode || ''}`}
//         institute_id={currentUniqueCode}
//         primaryWebsiteUrl={getInstituteWebsiteUrl()}
//       />

//       {/* HERO BANNER */}
//       <section className="py-6 md:py-8">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           {/* MAIN JOINED CARD */}
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
//               <p className="text-sm md:text-base font-semibold tracking-wide uppercase text-white/90">
//                 Build your career with {getInstituteName()}
//               </p>

//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
//                 {getBannerTitle()}
//               </h2>

             

//               <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
//   {getHTMLDescription() ? (
//     <div 
//       className="prose prose-invert max-w-none"
//       dangerouslySetInnerHTML={{ __html: getHTMLDescription() }}
//     />
//   ) : (
//     <>
//       <p>
//         Join a dynamic team of innovators, problem-solvers, and creative
//         visionaries shaping the future at {getInstituteName()}.
//       </p>
//       <p>
//         We believe in innovation, collaboration, and growth. Join our team 
//         to work on cutting-edge technologies and build impactful solutions.
//       </p>
//     </>
//   )}
// </div>

//               {/* Key Highlights */}
//               <div className="mt-4">
//                 <h4 className="font-bold text-white mb-2">Why Join Us:</h4>
//                 <ul className="list-disc list-inside space-y-1">
//                   <li>Friendly work environment</li>
//                   <li>Learning & development opportunities</li>
//                   <li>Competitive salary packages</li>
//                   <li>Cutting-edge technologies</li>
//                   <li>Impactful projects</li>
//                 </ul>
//               </div>
//             </div>

//             {/* RIGHT IMAGE BLOCK */}
//             <div className="w-full h-full">
//               <img
//                 src={getDynamicImageUrl()}
//                 alt={`${getInstituteName()} career opportunities`}
//                 className="w-full h-full object-cover"
//                 onError={(e) => {
//                   e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//                 }}
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search */}
//       <section className="bg-white border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-4">
//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                   Search jobs
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Type a role, skill, location, or keyword to see matching jobs
//                   instantly.
//                 </p>
//               </div>
//               <div className="text-sm text-slate-600">
//                 Total Positions: <span className="font-bold text-indigo-600">{jobs.length}</span>
//               </div>
//             </div>

//             {/* Live search input */}
//             <div className="relative">
//               <svg
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by role, skill, company, location..."
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//               />
//             </div>

//             <div className="text-sm text-slate-600 flex items-center justify-between">
//               <span>
//                 Showing{" "}
//                 <span className="font-semibold text-slate-900">
//                   {filteredJobs.length}
//                 </span>{" "}
//                 open positions
//               </span>
//               <span className="text-xs text-slate-500">
//                 {filteredJobs.length === jobs.length ? 'All positions' : 'Filtered results'}
//               </span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards 70% */}
//             <div className="lg:col-span-8 space-y-4">
//               {filteredJobs.length === 0 ? (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No jobs found
//                   </h3>
//                   <p className="text-sm text-slate-600">
//                     Try adjusting your search or filters.
//                   </p>
//                   <button
//                     onClick={() => {
//                       setSelectedType("All");
//                       setSelectedLocation("All");
//                       setSearch("");
//                     }}
//                     className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                   >
//                     Clear all filters
//                   </button>
//                 </div>
//               ) : (
//                 filteredJobs.map((job) => (
//                   <article
//                     key={job.id}
//                     className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                   >
//                     <div className="p-6 lg:p-8">
//                       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                         <div className="space-y-2 flex-1">
//                           <div className="flex justify-between items-start">
//                             <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
//                               {job.job_title}
//                             </h3>
//                             {job.salary && (
//                               <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
//                                 {job.salary}
//                               </span>
//                             )}
//                           </div>
//                           <p className="text-base text-slate-700 font-semibold">
//                             {job.company_name}
//                           </p>
//                           <div className="flex flex-wrap gap-3 mt-3">
//                             <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
//                               <svg
//                                 className="w-3 h-3"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                 />
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                 />
//                               </svg>
//                               {job.location}
//                             </span>
//                             <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
//                               job.job_type === 'Full Time' 
//                                 ? 'bg-emerald-100 text-emerald-800'
//                                 : job.job_type === 'Part time'
//                                 ? 'bg-blue-100 text-blue-800'
//                                 : 'bg-slate-100 text-slate-800'
//                             }`}>
//                               <svg
//                                 className="w-3 h-3"
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                                 />
//                               </svg>
//                               {job.job_type}
//                             </span>
//                             <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                               {job.experience}
//                             </span>
//                             {job.created_at && (
//                               <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                                 Posted: {new Date(job.created_at).toLocaleDateString()}
//                               </span>
//                             )}
//                           </div>
//                           {job.description && (
//   <div 
//     className="text-sm text-slate-600 mt-3 line-clamp-2 prose prose-sm max-w-none"
//     dangerouslySetInnerHTML={{ __html: job.description }}
//   />
// )}
//                         </div>

//                         <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                           <button
//                             onClick={() => handleApplyClick(job)}
//                             className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                           >
//                             Apply now
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                             </svg>
//                           </button>
//                         </div>
//                       </div>
//                     </div>
//                   </article>
//                 ))
//               )}
//             </div>

//             {/* Filters 30% */}
//             <aside className="lg:col-span-4">
//               <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                 <div className="space-y-6">
//                   <div>
//                     <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                     <p className="text-xs text-slate-600">Refine results by job type and location.</p>
//                   </div>

//                   {/* Job type filters - Dynamic from API */}
//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-slate-700 block mb-1">Job type</label>
//                     <div className="flex flex-wrap gap-2">
//                       {availableJobTypes.map((type) => (
//                         <button
//                           key={type}
//                           onClick={() => setSelectedType(type)}
//                           className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                             selectedType === type
//                               ? "bg-indigo-600 text-white shadow-sm"
//                               : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                           }`}
//                         >
//                           {type}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Location filters - Dynamic from API */}
//                   <div className="space-y-2">
//                     <label className="text-xs font-medium text-slate-700 block mb-1">Location</label>
//                     <div className="flex flex-wrap gap-2">
//                       {availableLocations.map((loc) => (
//                         <button
//                           key={loc}
//                           onClick={() => setSelectedLocation(loc)}
//                           className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                             selectedLocation === loc
//                               ? "bg-indigo-600 text-white shadow-sm"
//                               : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                           }`}
//                         >
//                           {loc}
//                         </button>
//                       ))}
//                     </div>
//                   </div>

                 
//                   <button
//                     onClick={() => {
//                       setSelectedType("All");
//                       setSelectedLocation("All");
//                       setSearch("");
//                     }}
//                     className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
//                   >
//                     <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                     </svg>
//                     Clear all filters
//                   </button>
//                 </div>
//               </div>
//             </aside>
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer 
//         footerData={institute?.footer} 
//         baseUrl={`/${currentUniqueCode || ''}`}
//         instituteName={getInstituteName()}
//         institute={institute}
//       />
//     </div>
//   );
// };

// export default CareerApply;









// // src/pages/CareerApply.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import NotFound from 'src/Frontend/Main/NotFound';

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type Job = {
//   id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   location: string;
//   job_type: string;
//   experience: string;
//   created_at: string;
//   apply_url?: string;
//   salary?: string;
//   deadline?: string;
//   status?: string;
//   job_meta?: {
//     first?: number;
//     second?: number;
//     third?: number;
//   };
// };

// type CareerData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner: {
//     title: string;
//     long_description: string;
//     banner_image: string;
//     banner_type?: string; // 'image' or 'video'
//   };
//   jobs: Job[];
//   footer: {
//     academic_name: string;
//     academic_email: string;
//     academic_address: string;
//   };
//   website?: string;
//   features?: {
//     show_search?: boolean;
//     show_filters?: boolean;
//     why_join_us?: string[];
//   };
// };

// const CareerApply: React.FC = () => {
//   const { institute_id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for career data
//   const [careerData, setCareerData] = useState<CareerData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // State for jobs
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [search, setSearch] = useState("");
//   const [selectedType, setSelectedType] = useState("All");
//   const [selectedLocation, setSelectedLocation] = useState("All");

//   // Extract unique_code from URL or use institute_id
//   const getUniqueCode = () => {
//     if (institute_id && institute_id !== ':institute_id') {
//       return institute_id;
//     }
    
//     // Try to extract from URL path
//     const pathParts = location.pathname.split('/');
    
//     for (const part of pathParts) {
//       if (part && part !== 'careers' && part !== 'career' && part !== 'apply' && part !== '') {
//         if (/^[a-zA-Z0-9]+$/.test(part) && part.length > 5) {
//           return part;
//         }
//       }
//     }
    
//     // Try to get from query parameters
//     const searchParams = new URLSearchParams(location.search);
//     const codeFromQuery = searchParams.get('code') || searchParams.get('institute');
//     if (codeFromQuery) {
//       return codeFromQuery;
//     }
    
//     return null;
//   };

//   // Fetch career data
//   useEffect(() => {
//     const fetchCareerData = async () => {
//       try {
//         const uniqueCode = getUniqueCode();
        
//         if (!uniqueCode) {
//           setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
//           toast.error('Institute code not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         const response = await axios.post<CareerData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           {
//             unique_code: uniqueCode
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         if (response.data && response.data.status === true) {
//           setCareerData(response.data);
          
//           if (response.data.jobs && Array.isArray(response.data.jobs)) {
//             setJobs(response.data.jobs);
//           } else {
//             setJobs([]);
//           }
//         } else {
//           setError('No career data found for this institute');
//           toast.error('No career data available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching career data:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCareerData();
//   }, [institute_id, location.pathname, location.search]);

//   // Filter jobs
//   const filteredJobs = jobs.filter((job) => {
//     const matchesSearch =
//       search.trim().length === 0 ||
//       `${job.job_title} ${job.company_name} ${job.location} ${job.job_type} ${job.experience} ${job.description || ''}`
//         .toLowerCase()
//         .includes(search.toLowerCase());

//     const matchesType = selectedType === "All" || job.job_type === selectedType;
//     const matchesLocation = selectedLocation === "All" || job.location === selectedLocation;

//     return matchesSearch && matchesType && matchesLocation;
//   });

//   const handleApplyClick = (job: Job) => {
//     if (job.apply_url) {
//       window.open(job.apply_url, '_blank');
//     } else {
//       const uniqueCode = getUniqueCode();
//       navigate(
//         `/aapply?jobId=${job.id}&title=${encodeURIComponent(
//           job.job_title
//         )}&company=${encodeURIComponent(
//           job.company_name
//         )}&location=${encodeURIComponent(job.location)}&type=${encodeURIComponent(job.job_type)}`,
//         {
//           state: { 
//             institute_id: uniqueCode 
//           }
//         }
//       );
//     }
//   };

//   // Set page title and favicon
//   useEffect(() => {
//     if (careerData) {
//       document.title = `${careerData.header.academic_name} - Careers`;
      
//       // Set favicon
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = careerData.header?.academic_logo
//         ? `${assetUrl}/${careerData.header.academic_logo}`
//         : '/favicon.ico';
      
//       setFavicon(faviconUrl);
//     }
//   }, [careerData]);

//   if (loading) {
//     return <Loader/>;
//   }

//   if (error || !careerData) {
//     return <NotFound/>;
//   }

//   // Get dynamic banner content
//   const getBannerContent = () => {
//     const banner = careerData.banner;
//     const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
    
//     const bannerImage = banner.banner_image 
//       ? `${assetUrl}/${banner.banner_image}`
//       : "";
    
//     return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
//   };

//   // Get "Why Join Us" points
//   const getWhyJoinUsPoints = () => {
//     if (careerData.features?.why_join_us && careerData.features.why_join_us.length > 0) {
//       return careerData.features.why_join_us;
//     }
    
//     // Default points if not provided in API
//     return [];
//   };

//   // Extract unique job types and locations from API response
//   const extractJobTypes = () => {
//     const types = new Set(["All"]);
//     jobs.forEach(job => {
//       if (job.job_type) {
//         types.add(job.job_type);
//       }
//     });
//     return Array.from(types);
//   };

//   const extractLocations = () => {
//     const locs = new Set(["All"]);
//     jobs.forEach(job => {
//       if (job.location) {
//         locs.add(job.location);
//       }
//     });
//     return Array.from(locs);
//   };

//   const availableJobTypes = extractJobTypes();
//   const availableLocations = extractLocations();

//   // Check if search should be shown
//   const showSearch = careerData.features?.show_search !== false;
  
//   // Check if filters should be shown
//   const showFilters = careerData.features?.show_filters !== false;

//   const currentUniqueCode = getUniqueCode();
//   const bannerContent = getBannerContent();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <Helmet>
//         <title>{careerData.header.academic_name} - Careers</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={careerData.header.academic_name}
//         logo={careerData.header.academic_logo}
//         address={careerData.footer.academic_address}
//         baseUrl={`/${currentUniqueCode || ''}`}
//         institute_id={currentUniqueCode}
//         primaryWebsiteUrl={careerData.website || 'https://example.com'}
//       />

//       {/* HERO BANNER */}
//       <section className="py-6 md:py-8">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
              

//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight">
//                 {careerData.banner.title || 'Build Your Career With Us'}
//               </h2>

//               <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
//                 <div 
//                   className="prose prose-invert max-w-none"
//                   dangerouslySetInnerHTML={{ 
//                     __html: careerData.banner.long_description || ` `
//                   }}
//                 />
//               </div>

//               {/* Why Join Us - Dynamic from API or default */}
//               {getWhyJoinUsPoints().length > 0 && (
//                 <div className="mt-4">
//                   <h4 className="font-bold text-white mb-2">Why Join Us:</h4>
//                   <ul className="list-disc list-inside space-y-1">
//                     {getWhyJoinUsPoints().map((point, index) => (
//                       <li key={index}>{point}</li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </div>

//             {/* RIGHT IMAGE/VIDEO BLOCK */}
//             <div className="w-full h-full relative">
//               {bannerContent.isVideo ? (
//                 <video
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
//                 >
//                   <source src={bannerContent.bannerImage} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   src={bannerContent.bannerImage}
//                   alt={`${careerData.header.academic_name} career opportunities`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search - Conditional based on API */}
//       {showSearch && (
//         <section className="bg-white border-b border-slate-200">
//           <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//             <div className="space-y-4">
//               <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//                 <div>
//                   <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                     Search jobs
//                   </h2>
//                   <p className="text-sm text-slate-600 mt-1">
//                     Type a role, skill, location, or keyword to see matching jobs instantly.
//                   </p>
//                 </div>
//                 <div className="text-sm text-slate-600">
//                   Total Positions: <span className="font-bold text-indigo-600">{jobs.length}</span>
//                 </div>
//               </div>

//               <div className="relative">
//                 <svg
//                   className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                   />
//                 </svg>
//                 <input
//                   type="text"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search by role, skill, company, location..."
//                   className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//                 />
//               </div>

//               <div className="text-sm text-slate-600 flex items-center justify-between">
//                 <span>
//                   Showing{" "}
//                   <span className="font-semibold text-slate-900">
//                     {filteredJobs.length}
//                   </span>{" "}
//                   open positions
//                 </span>
//                 <span className="text-xs text-slate-500">
//                   {filteredJobs.length === jobs.length ? 'All positions' : 'Filtered results'}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards -*/}
//             <div className={showFilters ? "lg:col-span-8" : "lg:col-span-12"}>
//               <div className="space-y-4">
//                 {filteredJobs.length === 0 ? (
//                   <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                     <svg
//                       className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={1.5}
//                         d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                       />
//                     </svg>
//                     <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                       No jobs found
//                     </h3>
//                     <p className="text-sm text-slate-600">
//                       Try adjusting your search or filters.
//                     </p>
//                     <button
//                       onClick={() => {
//                         setSelectedType("All");
//                         setSelectedLocation("All");
//                         setSearch("");
//                       }}
//                       className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   </div>
//                 ) : (
//                   filteredJobs.map((job) => (
//                     <article
//                       key={job.id}
//                       className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                     >
//                       <div className="p-6 lg:p-8">
//                         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                           <div className="space-y-2 flex-1">
//                             <div className="flex justify-between items-start">
//                               <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
//                                 {job.job_title}
//                               </h3>
//                               {job.salary && (
//                                 <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
//                                   {job.salary}
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-base text-slate-700 font-semibold">
//                               {job.company_name}
//                             </p>
//                             <div className="flex flex-wrap gap-3 mt-3">
//                               <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
//                                 <svg
//                                   className="w-3 h-3"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                   />
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                   />
//                                 </svg>
//                                 {job.location}
//                               </span>
//                               <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
//                                 job.job_type === 'Full Time' 
//                                   ? 'bg-emerald-100 text-emerald-800'
//                                   : job.job_type === 'Part time'
//                                   ? 'bg-blue-100 text-blue-800'
//                                   : 'bg-slate-100 text-slate-800'
//                               }`}>
//                                 <svg
//                                   className="w-3 h-3"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                                   />
//                                 </svg>
//                                 {job.job_type}
//                               </span>
//                               {job.experience && (
//                                 <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                                   {job.experience}
//                                 </span>
//                               )}
//                               {job.created_at && (
//                                 <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                                   Posted: {new Date(job.created_at).toLocaleDateString('en-IN')}
//                                 </span>
//                               )}
//                             </div>
//                             {job.description && (
//                               <div 
//                                 className="text-sm text-slate-600 mt-3 line-clamp-2 prose prose-sm max-w-none"
//                                 dangerouslySetInnerHTML={{ __html: job.description }}
//                               />
//                             )}
//                           </div>

//                           <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                             <button
//                               onClick={() => handleApplyClick(job)}
//                               className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                             >
//                               Apply now
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </article>
//                   ))
//                 )}
//               </div>
//             </div>

//             {/* Filters - Conditional based on API */}
//             {showFilters && (
//               <aside className="lg:col-span-4">
//                 <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                       <p className="text-xs text-slate-600">Refine results by job type and location.</p>
//                     </div>

//                     {/* Job type filters - Dynamic from API */}
//                     {availableJobTypes.length > 1 && (
//                       <div className="space-y-2">
//                         <label className="text-xs font-medium text-slate-700 block mb-1">Job type</label>
//                         <div className="flex flex-wrap gap-2">
//                           {availableJobTypes.map((type) => (
//                             <button
//                               key={type}
//                               onClick={() => setSelectedType(type)}
//                               className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                                 selectedType === type
//                                   ? "bg-indigo-600 text-white shadow-sm"
//                                   : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                               }`}
//                             >
//                               {type}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Location filters - Dynamic from API */}
//                     {availableLocations.length > 1 && (
//                       <div className="space-y-2">
//                         <label className="text-xs font-medium text-slate-700 block mb-1">Location</label>
//                         <div className="flex flex-wrap gap-2">
//                           {availableLocations.map((loc) => (
//                             <button
//                               key={loc}
//                               onClick={() => setSelectedLocation(loc)}
//                               className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                                 selectedLocation === loc
//                                   ? "bg-indigo-600 text-white shadow-sm"
//                                   : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                               }`}
//                             >
//                               {loc}
//                             </button>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {(selectedType !== "All" || selectedLocation !== "All") && (
//                       <button
//                         onClick={() => {
//                           setSelectedType("All");
//                           setSelectedLocation("All");
//                           setSearch("");
//                         }}
//                         className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Clear all filters
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               </aside>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer 
//         footerData={careerData.footer} 
//         baseUrl={`/${currentUniqueCode || ''}`}
//         instituteName={careerData.header.academic_name}
//         institute={careerData}
//       />
//     </div>
//   );
// };

// export default CareerApply;











// // src/pages/CareerApply.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import NotFound from 'src/Frontend/Main/NotFound';

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type FilterItem = {
//   id: number;
//   name: string;
// };

// type FilterType = {
//   type_name: string;
//   data: FilterItem[];
// };

// type Job = {
//   id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   location: string;
//   job_type: string;
//   experience: string;
//   created_at: string;
//   apply_url?: string;
//   salary?: string;
//   deadline?: string;
//   status?: string;
//   job_meta?: {
//     first?: number;
//     second?: number;
//     third?: number;
//   };
// };

// type CareerData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner: {
//     title: string;
//     long_description: string;
//     banner_image: string;
//     banner_type?: string;
//   };
//   jobs: Job[];
//   filters?: FilterType[];
//   footer: {
//     academic_name: string;
//     academic_email: string;
//     academic_address: string;
//   };
//   website?: string;
//   features?: {
//     show_search?: boolean;
//     show_filters?: boolean;
//     why_join_us?: string[];
//   };
// };

// type FilterState = {
//   [key: string]: number[];
// };

// const CareerApply: React.FC = () => {
//   const { institute_id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for career data
//   const [careerData, setCareerData] = useState<CareerData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log("CARIAER DATA:", careerData);
//   // State for jobs
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
//   const [search, setSearch] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
  
//   // State for filters
//   const [filters, setFilters] = useState<FilterType[]>([]);
//   const [activeFilters, setActiveFilters] = useState<FilterState>({});
//   const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  
//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10);
//   const [totalJobs, setTotalJobs] = useState(0);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch initial career data
//   useEffect(() => {
//     const fetchCareerData = async () => {
//       try {
        
//         if (!institute_id) {
//           setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
//           toast.error('Institute code not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         const response = await axios.post<CareerData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           { unique_code: institute_id },
//           { headers: { 'Content-Type': 'application/json' } }
//         );

//         if (response.data?.status === true) {
//           setCareerData(response.data);
          
//           if (response.data.jobs && Array.isArray(response.data.jobs)) {
//             setJobs(response.data.jobs);
//             setFilteredJobs(response.data.jobs);
//             setTotalJobs(response.data.jobs.length);
//           }
          
//           if (response.data.filters && Array.isArray(response.data.filters)) {
//             setFilters(response.data.filters);
            
//             // Initialize active filters state
//             const initialFilters: FilterState = {};
//             response.data.filters.forEach(filter => {
//               initialFilters[filter.type_name] = [];
//             });
//             setActiveFilters(initialFilters);
//           }
//         } else {
//           setError('No career data found for this institute');
//           toast.error('No career data available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching career data:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCareerData();
//   }, [institute_id, location.pathname, location.search]);

//   // Function to fetch filtered jobs from API
//   const fetchFilteredJobs = async (filtersToApply: number[], searchText: string, pageNum: number, reset = false) => {
//     try {
//       if (!institute_id) return;

//       setIsSearching(true);
      
//       const response = await axios.post<{
//         status: boolean;
//         total: number;
//         data: Job[];
//       }>(
//         `${apiUrl}/PublicCareer/get-career-jobs`,
//         {
//           unique_code: institute_id,
//           page: pageNum,
//           rowsPerPage,
//           filters: filtersToApply,
//           search: searchText
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       if (response.data?.status === true) {
//         if (reset) {
//           setFilteredJobs(response.data.data);
//         } else {
//           setFilteredJobs(prev => [...prev, ...response.data.data]);
//         }
//         setTotalJobs(response.data.total);
//         setHasMore(response.data.data.length === rowsPerPage);
//       }
//     } catch (err: any) {
//       console.error('Error fetching filtered jobs:', err);
//       toast.error(err.response?.data?.message || 'Failed to load jobs');
//     } finally {
//       setIsSearching(false);
//       setIsLoadingMore(false);
//     }
//   };

//   // Handle filter change
//   const handleFilterChange = (filterType: string, filterId: number) => {
//     setActiveFilters(prev => {
//       const currentFilters = prev[filterType] || [];
//       const newFilters = currentFilters.includes(filterId)
//         ? currentFilters.filter(id => id !== filterId)
//         : [...currentFilters, filterId];
      
//       const updated = { ...prev, [filterType]: newFilters };
      
//       // Extract all filter IDs for API call
//       const allFilterIds = Object.values(updated).flat();
//       setSelectedFilters(allFilterIds);
      
//       // Reset page when filters change
//       setPage(0);
      
//       // Fetch filtered jobs
//       fetchFilteredJobs(allFilterIds, search, 0, true);
      
//       return updated;
//     });
//   };

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search.trim() !== '') {
//         // Reset page on search
//         setPage(0);
//         fetchFilteredJobs(selectedFilters, search, 0, true);
//       } else if (selectedFilters.length > 0) {
//         // If search is cleared but filters exist
//         fetchFilteredJobs(selectedFilters, '', 0, true);
//       } else {
//         // If both search and filters are cleared, show all jobs
//         setFilteredJobs(jobs);
//         setTotalJobs(jobs.length);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, selectedFilters]);

//   // Handle load more
//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     setIsLoadingMore(true);
//     fetchFilteredJobs(selectedFilters, search, nextPage, false);
//   };

//   const handleApplyClick = (job: Job) => {
//     if(careerData?.baseUrl){
//       navigate(`${careerData.baseUrl}/job_details/${job.id}`);
//       return;
//     }else{
//       navigate(`/Frontend/${institute_id}/job_details/${job.id}`);
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     const resetFilters: FilterState = {};
//     filters.forEach(filter => {
//       resetFilters[filter.type_name] = [];
//     });
//     setActiveFilters(resetFilters);
//     setSelectedFilters([]);
//     setSearch('');
//     setPage(0);
//     setFilteredJobs(jobs);
//     setTotalJobs(jobs.length);
//   };

//   // Check if any filter is active
//   const hasActiveFilters = () => {
//     return selectedFilters.length > 0 || search.trim() !== '';
//   };

//   // Get count of active filters for a specific type
//   const getActiveFilterCount = (filterType: string) => {
//     return activeFilters[filterType]?.length || 0;
//   };

//   // Set page title and favicon
//   useEffect(() => {
//     if (careerData) {
//       document.title = `${careerData.header.academic_name} - Careers`;
      
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = careerData.header?.academic_logo
//         ? `${assetUrl}/${careerData.header.academic_logo}`
//         : '/favicon.ico';
      
//       setFavicon(faviconUrl);
//     }
//   }, [careerData]);

//   if (loading) {
//     return <Loader/>;
//   }

//   if (error || !careerData) {
//     return <NotFound/>;
//   }

//   // Get dynamic banner content
//   const getBannerContent = () => {
//     const banner = careerData.banner;
//     const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
//     const bannerImage = banner.banner_image ? `${assetUrl}/${banner.banner_image}` : "";
    
//     return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
//   };

//   const bannerContent = getBannerContent();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <Helmet>
//         <title>{careerData.header.academic_name} - Careers</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={careerData.header.academic_name}
//         logo={careerData.header.academic_logo}
//         address={careerData.footer.academic_address}
//         baseUrl={`/${institute_id || ''}`}
//         institute_id={institute_id}
//         primaryWebsiteUrl={careerData.website || 'https://example.com'}
//       />

//       {/* HERO BANNER */}
//       <section className="py-6 md:py-8">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-500 via-amber-450 to-yellow-300 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
//                 {careerData.banner.title || 'Build Your Career With Us'}
//               </h2>

//               <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
//                 <div 
//                   className="prose prose-invert max-w-none"
//                   dangerouslySetInnerHTML={{ 
//                     __html: careerData.banner.long_description || ` `
//                   }}
//                 />
//               </div>
//             </div>

//             {/* RIGHT IMAGE/VIDEO BLOCK */}
//             <div className="w-full h-full relative">
//               {bannerContent.isVideo ? (
//                 <video
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
//                 >
//                   <source src={bannerContent.bannerImage} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   src={bannerContent.bannerImage}
//                   alt={`${careerData.header.academic_name} career opportunities`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search */}
//       <section className="bg-white border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-4">
//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                   Search jobs
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Type a role, skill, location, or keyword to see matching jobs instantly.
//                 </p>
//               </div>
//               <div className="text-sm text-slate-600">
//                 Total Positions: <span className="font-bold text-indigo-600">{totalJobs}</span>
//               </div>
//             </div>

//             {/* Live search input */}
//             <div className="relative">
//               <svg
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by role, skill, company, location..."
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//                 disabled={isSearching}
//               />
//               {isSearching && (
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
//                 </div>
//               )}
//             </div>

//             <div className="text-sm text-slate-600 flex items-center justify-between">
//               <span>
//                 Showing{" "}
//                 <span className="font-semibold text-slate-900">
//                   {filteredJobs.length}
//                 </span>{" "}
//                 {search.trim() || selectedFilters.length > 0 ? 'filtered' : 'open'} positions
//               </span>
//               {hasActiveFilters() && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
//                 >
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards */}
//             <div className="lg:col-span-8 space-y-4">
//               {isSearching ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                   <p className="mt-4 text-slate-600">Searching jobs...</p>
//                 </div>
//               ) : filteredJobs.length === 0 ? (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No jobs found
//                   </h3>
//                   <p className="text-sm text-slate-600 mb-4">
//                     {hasActiveFilters() 
//                       ? "Try adjusting your search or filters."
//                       : "No job positions are currently available."
//                     }
//                   </p>
//                   {hasActiveFilters() && (
//                     <button
//                       onClick={clearAllFilters}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   {filteredJobs.map((job) => (
//                     <article
//                       key={job.id}
//                       className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                     >
//                       <div className="p-6 lg:p-8">
//                         <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                           <div className="space-y-2 flex-1">
//                             <div className="flex justify-between items-start">
//                               <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
//                                 {job.job_title}
//                               </h3>
//                               {job.salary && (
//                                 <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
//                                   {job.salary}
//                                 </span>
//                               )}
//                             </div>
//                             <p className="text-base text-slate-700 font-semibold">
//                               {job.company_name}
//                             </p>
//                             <div className="flex flex-wrap gap-3 mt-3">
//                               <span className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
//                                 <svg
//                                   className="w-3 h-3"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                                   />
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                                   />
//                                 </svg>
//                                 {job.location}
//                               </span>
//                               <span className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${
//                                 job.job_type === 'Full Time' 
//                                   ? 'bg-emerald-100 text-emerald-800'
//                                   : job.job_type === 'Part time'
//                                   ? 'bg-blue-100 text-blue-800'
//                                   : 'bg-slate-100 text-slate-800'
//                               }`}>
//                                 <svg
//                                   className="w-3 h-3"
//                                   fill="none"
//                                   stroke="currentColor"
//                                   viewBox="0 0 24 24"
//                                 >
//                                   <path
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                     strokeWidth={2}
//                                     d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                                   />
//                                 </svg>
//                                 {job.job_type}
//                               </span>
//                               {job.experience && (
//                                 <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                                   {job.experience}
//                                 </span>
//                               )}
//                               {job.created_at && (
//                                 <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
//                                   Posted: {new Date(job.created_at).toLocaleDateString('en-IN')}
//                                 </span>
//                               )}
//                             </div>
//                             {job.description && (
//                               <div 
//                                 className="text-sm text-slate-600 mt-3 line-clamp-2 prose prose-sm max-w-none"
//                                 dangerouslySetInnerHTML={{ __html: job.description }}
//                               />
//                             )}
//                           </div>

//                           <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                             <button
//                               onClick={() => handleApplyClick(job)}
//                               className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                             >
//                               Apply now
//                               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                               </svg>
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     </article>
//                   ))}

//                   {/* Load More Button */}
//                   {hasMore && filteredJobs.length > 0 && (
//                     <div className="text-center pt-6">
//                       <button
//                         onClick={handleLoadMore}
//                         disabled={isLoadingMore}
//                         className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
//                       >
//                         {isLoadingMore ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             Load More Jobs
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Filters */}
//             {filters.length > 0 && (
//               <aside className="lg:col-span-4">
//                 <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                       <p className="text-xs text-slate-600">Refine results by applying filters</p>
//                     </div>

//                     {/* Dynamic Filters from API */}
//                     {filters.map((filter) => (
//                       <div key={filter.type_name} className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <label className="text-xs font-medium text-slate-700 block mb-1 capitalize">
//                             {filter.type_name.toLowerCase()}
//                           </label>
//                           {getActiveFilterCount(filter.type_name) > 0 && (
//                             <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
//                               {getActiveFilterCount(filter.type_name)} selected
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {filter.data.map((item) => {
//                             const isActive = activeFilters[filter.type_name]?.includes(item.id) || false;
//                             return (
//                               <button
//                                 key={item.id}
//                                 type="button"
//                                 onClick={() => handleFilterChange(filter.type_name, item.id)}
//                                 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                                   isActive
//                                     ? "bg-indigo-600 text-white shadow-sm border border-indigo-600"
//                                     : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                                 }`}
//                               >
//                                 {item.name}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}

//                     {/* Clear All Filters Button */}
//                     {hasActiveFilters() && (
//                       <button
//                         onClick={clearAllFilters}
//                         className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Clear all filters
//                       </button>
//                     )}

//                     {/* Active Filters Summary */}
//                     {selectedFilters.length > 0 && (
//                       <div className="pt-4 border-t border-slate-200">
//                         <h4 className="text-xs font-semibold text-slate-900 mb-2">Active Filters:</h4>
//                         <div className="flex flex-wrap gap-1">
//                           {selectedFilters.map((filterId) => {
//                             let filterName = '';
//                             let filterType = '';
                            
//                             filters.forEach(filter => {
//                               const item = filter.data.find(d => d.id === filterId);
//                               if (item) {
//                                 filterName = item.name;
//                                 filterType = filter.type_name;
//                               }
//                             });
                            
//                             return (
//                               <span 
//                                 key={filterId} 
//                                 className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
//                               >
//                                 {filterName}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     // Find which filter type this belongs to
//                                     filters.forEach(filter => {
//                                       if (filter.data.find(d => d.id === filterId)) {
//                                         handleFilterChange(filter.type_name, filterId);
//                                       }
//                                     });
//                                   }}
//                                   className="text-indigo-400 hover:text-indigo-600"
//                                 >
//                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </span>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </aside>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer 
//         footerData={careerData.footer} 
//         baseUrl={`/${institute_id || ''}`}
//         instituteName={careerData.header.academic_name}
//         institute={careerData}
//       />
//     </div>
//   );
// };

// export default CareerApply;










// // src/pages/CareerApply.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import NotFound from 'src/Frontend/Main/NotFound';

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type FilterItem = {
//   id: number;
//   name: string;
// };

// type FilterType = {
//   type_name: string;
//   data: FilterItem[];
// };

// type Job = {
//   id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   location: string;
//   job_type: string;
//   experience: string;
//   created_at: string;
//   apply_url?: string;
//   salary?: string;
//   deadline?: string;
//   status?: string;
//   job_meta?: {
//     [key: string]: number;
//   };
//   job_meta_names?: {
//     [key: string]: string;
//   };
// };

// type CareerData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner: {
//     title: string;
//     long_description: string;
//     banner_image: string;
//     banner_type?: string;
//   };
//   jobs: Job[];
//   filters?: FilterType[];
//   footer: {
//     academic_name: string;
//     academic_email: string;
//     academic_address: string;
//   };
//   website?: string;
//   features?: {
//     show_search?: boolean;
//     show_filters?: boolean;
//     why_join_us?: string[];
//   };
//   baseUrl?: string;
// };

// type FilterState = {
//   [key: string]: number[];
// };

// const CareerApply: React.FC = () => {
//   const { institute_id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for career data
//   const [careerData, setCareerData] = useState<CareerData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log("CAREER DATA:", careerData);
  
//   // State for jobs
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
//   const [search, setSearch] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
  
//   // State for filters
//   const [filters, setFilters] = useState<FilterType[]>([]);
//   const [activeFilters, setActiveFilters] = useState<FilterState>({});
//   const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  
//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10);
//   const [totalJobs, setTotalJobs] = useState(0);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch initial career data
//   useEffect(() => {
//     const fetchCareerData = async () => {
//       try {
        
//         if (!institute_id) {
//           setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
//           toast.error('Institute code not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         const response = await axios.post<CareerData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           { unique_code: institute_id },
//           { headers: { 'Content-Type': 'application/json' } }
//         );

//         if (response.data?.status === true) {
//           setCareerData(response.data);
          
//           if (response.data.jobs && Array.isArray(response.data.jobs)) {
//             setJobs(response.data.jobs);
//             setFilteredJobs(response.data.jobs);
//             setTotalJobs(response.data.jobs.length);
//           }
          
//           if (response.data.filters && Array.isArray(response.data.filters)) {
//             setFilters(response.data.filters);
            
//             // Initialize active filters state
//             const initialFilters: FilterState = {};
//             response.data.filters.forEach(filter => {
//               initialFilters[filter.type_name] = [];
//             });
//             setActiveFilters(initialFilters);
//           }
//         } else {
//           setError('No career data found for this institute');
//           toast.error('No career data available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching career data:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCareerData();
//   }, [institute_id, location.pathname, location.search]);

//   // Function to fetch filtered jobs from API
//   const fetchFilteredJobs = async (filtersToApply: number[], searchText: string, pageNum: number, reset = false) => {
//     try {
//       if (!institute_id) return;

//       setIsSearching(true);
      
//       const response = await axios.post<{
//         status: boolean;
//         total: number;
//         data: Job[];
//       }>(
//         `${apiUrl}/PublicCareer/get-career-jobs`,
//         {
//           unique_code: institute_id,
//           page: pageNum,
//           rowsPerPage,
//           filters: filtersToApply,
//           search: searchText
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       if (response.data?.status === true) {
//         if (reset) {
//           setFilteredJobs(response.data.data);
//         } else {
//           setFilteredJobs(prev => [...prev, ...response.data.data]);
//         }
//         setTotalJobs(response.data.total);
//         setHasMore(response.data.data.length === rowsPerPage);
//       }
//     } catch (err: any) {
//       console.error('Error fetching filtered jobs:', err);
//       toast.error(err.response?.data?.message || 'Failed to load jobs');
//     } finally {
//       setIsSearching(false);
//       setIsLoadingMore(false);
//     }
//   };

//   // Handle filter change
//   const handleFilterChange = (filterType: string, filterId: number) => {
//     setActiveFilters(prev => {
//       const currentFilters = prev[filterType] || [];
//       const newFilters = currentFilters.includes(filterId)
//         ? currentFilters.filter(id => id !== filterId)
//         : [...currentFilters, filterId];
      
//       const updated = { ...prev, [filterType]: newFilters };
      
//       // Extract all filter IDs for API call
//       const allFilterIds = Object.values(updated).flat();
//       setSelectedFilters(allFilterIds);
      
//       // Reset page when filters change
//       setPage(0);
      
//       // Fetch filtered jobs
//       fetchFilteredJobs(allFilterIds, search, 0, true);
      
//       return updated;
//     });
//   };

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search.trim() !== '') {
//         // Reset page on search
//         setPage(0);
//         fetchFilteredJobs(selectedFilters, search, 0, true);
//       } else if (selectedFilters.length > 0) {
//         // If search is cleared but filters exist
//         fetchFilteredJobs(selectedFilters, '', 0, true);
//       } else {
//         // If both search and filters are cleared, show all jobs
//         setFilteredJobs(jobs);
//         setTotalJobs(jobs.length);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, selectedFilters]);

//   // Handle load more
//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     setIsLoadingMore(true);
//     fetchFilteredJobs(selectedFilters, search, nextPage, false);
//   };

//   const handleApplyClick = (job: Job) => {
//     if(careerData?.baseUrl){
//       navigate(`${careerData.baseUrl}/job_details/${job.id}`);
//       return;
//     }else{
//       navigate(`/Frontend/${institute_id}/job_details/${job.id}`);
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     const resetFilters: FilterState = {};
//     filters.forEach(filter => {
//       resetFilters[filter.type_name] = [];
//     });
//     setActiveFilters(resetFilters);
//     setSelectedFilters([]);
//     setSearch('');
//     setPage(0);
//     setFilteredJobs(jobs);
//     setTotalJobs(jobs.length);
//   };

//   // Check if any filter is active
//   const hasActiveFilters = () => {
//     return selectedFilters.length > 0 || search.trim() !== '';
//   };

//   // Get count of active filters for a specific type
//   const getActiveFilterCount = (filterType: string) => {
//     return activeFilters[filterType]?.length || 0;
//   };

//   // Set page title and favicon
//   useEffect(() => {
//     if (careerData) {
//       document.title = `${careerData.header.academic_name} - Careers`;
      
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = careerData.header?.academic_logo
//         ? `${assetUrl}/${careerData.header.academic_logo}`
//         : '/favicon.ico';
      
//       setFavicon(faviconUrl);
//     }
//   }, [careerData]);

//   // Helper function to get job meta details
//   const getJobMetaDetails = (job: Job) => {
//     const metaDetails = [];
    
//     if (job.job_meta_names) {
//       // Get Job Type
//       if (job.job_meta_names['Job Type']) {
//         metaDetails.push({
//           label: 'Job Type',
//           value: job.job_meta_names['Job Type'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           ),
//           color: job.job_meta_names['Job Type'] === 'Full Time' 
//             ? 'bg-emerald-100 text-emerald-800'
//             : job.job_meta_names['Job Type'] === 'Part Time'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-slate-100 text-slate-800'
//         });
//       }
      
//       // Get Location
//       if (job.job_meta_names['Location']) {
//         metaDetails.push({
//           label: 'Location',
//           value: job.job_meta_names['Location'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           ),
//           color: 'bg-slate-100 text-slate-600'
//         });
//       }
      
//       // Get Experience
//       if (job.job_meta_names['Experience']) {
//         metaDetails.push({
//           label: 'Experience',
//           value: job.job_meta_names['Experience'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           ),
//           color: 'bg-slate-100 text-slate-600'
//         });
//       }
      
//       // Get other meta fields dynamically
//       Object.keys(job.job_meta_names).forEach(key => {
//         if (!['Job Type', 'Location', 'Experience'].includes(key)) {
//           metaDetails.push({
//             label: key,
//             value: job.job_meta_names[key],
//             icon: null,
//             color: 'bg-slate-100 text-slate-600'
//           });
//         }
//       });
//     }
    
//     return metaDetails;
//   };

//   // Helper function to extract requirements from description
//   // const extractRequirementsFromDescription = (description: string): string[] => {
//   //   const requirements: string[] = [];
    
//   //   if (!description) return requirements;
    
//   //   try {
//   //     // Remove HTML tags
//   //     const plainText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      
//   //     // Extract key requirements (you can customize this logic)
//   //     const sentences = plainText.split('.').filter(sentence => sentence.trim().length > 0);
      
//   //     // Take first 3-5 relevant sentences
//   //     for (let i = 0; i < Math.min(sentences.length, 5); i++) {
//   //       const sentence = sentences[i].trim();
//   //       if (sentence.length > 20 && sentence.length < 150) {
//   //         requirements.push(sentence + '.');
//   //       }
//   //     }
//   //   } catch (error) {
//   //     console.error('Error extracting requirements:', error);
//   //   }
    
//   //   return requirements.length > 0 ? requirements : ['No specific requirements listed.'];
//   // };

//   const extractRequirementsFromDescription = (description: string): string[] => {
//   const requirements: string[] = [];
  
//   if (!description) return requirements;
  
//   try {
//     // Create a temporary DOM element to parse HTML
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(description, 'text/html');
    
//     // Find all list items (li)
//     const listItems = doc.querySelectorAll('li');
    
//     if (listItems.length > 0) {
//       listItems.forEach(item => {
//         const text = item.textContent?.trim();
//         if (text && text.length > 5) {
//           // Clean up the text
//           const cleanText = text.replace(/\s+/g, ' ').trim();
//           requirements.push(cleanText);
//         }
//       });
//     }
    
//     // If no list items, try to find paragraphs with requirement-like content
//     if (requirements.length === 0) {
//       const elements = doc.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
//       elements.forEach(element => {
//         const text = element.textContent?.trim();
//         if (text && text.length > 20 && text.length < 200) {
//           const lowerText = text.toLowerCase();
//           const requirementKeywords = [
//             'experience', 'skill', 'knowledge', 'ability', 
//             'proficiency', 'understanding', 'familiarity',
//             'expertise', 'qualification', 'requirement',
//             'must have', 'should have', 'required',
//             'minimum', 'years', 'degree', 'certification'
//           ];
          
//           if (requirementKeywords.some(keyword => lowerText.includes(keyword))) {
//             requirements.push(text);
//           }
//         }
//       });
//     }
    
//     return requirements.slice(0,4); // Limit to 10 requirements
    
//   } catch (error) {
//     console.error('Error extracting requirements from description:', error);
    
//     // Simple fallback: split by sentences
//     const plainText = description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
//     const sentences = plainText.split(/[.!?]+/).filter(sentence => {
//       const trimmed = sentence.trim();
//       return trimmed.length > 20 && trimmed.length < 150;
//     });
    
//     return sentences.slice(0, 5);
//   }
// };
  

//   if (loading) {
//     return <Loader/>;
//   }

//   if (error || !careerData) {
//     return <NotFound/>;
//   }

//   // Get dynamic banner content
//   const getBannerContent = () => {
//     const banner = careerData.banner;
//     const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
//     const bannerImage = banner.banner_image ? `${assetUrl}/${banner.banner_image}` : "";
    
//     return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
//   };

//   const bannerContent = getBannerContent();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <Helmet>
//         <title>{careerData.header.academic_name} - Careers</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={careerData.header.academic_name}
//         logo={careerData.header.academic_logo}
//         address={careerData.footer.academic_address}
//         baseUrl={`/${institute_id || ''}`}
//         institute_id={institute_id}
//         primaryWebsiteUrl={careerData.website || 'https://example.com'}
//       />

//       {/* HERO BANNER */}
//       <section className="py-6 md:py-8">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-500 via-amber-450 to-yellow-300 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
//                 {careerData.banner.title || 'Build Your Career With Us'}
//               </h2>

//               <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
//                 <div 
//                   className="prose prose-invert max-w-none"
//                   dangerouslySetInnerHTML={{ 
//                     __html: careerData.banner.long_description || ` `
//                   }}
//                 />
//               </div>
//             </div>

//             {/* RIGHT IMAGE/VIDEO BLOCK */}
//             <div className="w-full h-full relative">
//               {bannerContent.isVideo ? (
//                 <video
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
//                 >
//                   <source src={bannerContent.bannerImage} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   src={bannerContent.bannerImage}
//                   alt={`${careerData.header.academic_name} career opportunities`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search */}
//       <section className="bg-white border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-4">
//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                   Search jobs
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Type a role, skill, location, or keyword to see matching jobs instantly.
//                 </p>
//               </div>
//               <div className="text-sm text-slate-600">
//                 Total Positions: <span className="font-bold text-indigo-600">{totalJobs}</span>
//               </div>
//             </div>

//             {/* Live search input */}
//             <div className="relative">
//               <svg
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by role, skill, company, location..."
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//                 disabled={isSearching}
//               />
//               {isSearching && (
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
//                 </div>
//               )}
//             </div>

//             <div className="text-sm text-slate-600 flex items-center justify-between">
//               <span>
//                 Showing{" "}
//                 <span className="font-semibold text-slate-900">
//                   {filteredJobs.length}
//                 </span>{" "}
//                 {search.trim() || selectedFilters.length > 0 ? 'filtered' : 'open'} positions
//               </span>
//               {hasActiveFilters() && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
//                 >
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards */}
//             <div className="lg:col-span-8 space-y-4">
//               {isSearching ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                   <p className="mt-4 text-slate-600">Searching jobs...</p>
//                 </div>
//               ) : filteredJobs.length === 0 ? (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No jobs found
//                   </h3>
//                   <p className="text-sm text-slate-600 mb-4">
//                     {hasActiveFilters() 
//                       ? "Try adjusting your search or filters."
//                       : "No job positions are currently available."
//                     }
//                   </p>
//                   {hasActiveFilters() && (
//                     <button
//                       onClick={clearAllFilters}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   {filteredJobs.map((job) => {
//                     const jobMetaDetails = getJobMetaDetails(job);
//                     const requirements = extractRequirementsFromDescription(job.description);
                    
//                     return (
//                       <article
//                         key={job.id}
//                         className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                       >
//                         <div className="p-6 lg:p-8">
//                           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                             <div className="space-y-3 flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
//                                   {job.job_title}
//                                 </h3>
//                                 {job.salary && (
//                                   <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
//                                     {job.salary}
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="text-base text-slate-700 font-semibold">
//                                 {job.company_name}
//                               </p>
                              
//                               {/* Job Meta Details */}
//                               {jobMetaDetails.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   {jobMetaDetails.map((meta, index) => (
//                                     <span 
//                                       key={index} 
//                                       className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${meta.color}`}
//                                       title={meta.label}
//                                     >
//                                       {meta.icon}
//                                       <span className="font-medium">{meta.value}</span>
//                                     </span>
//                                   ))}
                                  
//                                   {/* Posted Date */}
//                                   {job.created_at && (
//                                     <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
//                                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                       </svg>
//                                       {new Date(job.created_at).toLocaleDateString('en-IN')}
//                                     </span>
//                                   )}
//                                 </div>
//                               )}
                              
//                               {/* Requirements Preview */}
//                               {/* {requirements.length > 0 && (
//                                 <div className="mt-4 pt-4 border-t border-slate-100">
//                                   <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Requirements:</h4>
//                                   <ul className="space-y-1.5">
//                                     {requirements.slice(0, 3).map((req, index) => (
//                                       <li key={index} className="flex items-start gap-2 text-xs text-slate-600">
//                                         <svg className="w-3 h-3 mt-0.5 flex-shrink-0 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//                                         </svg>
//                                         <span className="line-clamp-2">{req}</span>
//                                       </li>
//                                     ))}
//                                     {requirements.length > 3 && (
//                                       <li className="text-xs text-indigo-600 font-medium">
//                                         + {requirements.length - 3} more requirements...
//                                       </li>
//                                     )}
//                                   </ul>
//                                 </div>
//                               )} */}

//                               {requirements.length > 0 && (
//   <div className="mt-4 pt-4 border-t border-slate-100">
//     <h4 className="text-sm font-semibold text-slate-900 mb-2">Requirements:</h4>
//     <ul className="space-y-2">
//       {requirements.map((req, index) => (
//         <li key={index} className="text-xs text-slate-600 flex gap-2">
//           <span className="text-emerald-600 font-bold">•</span>
//           <span>{req}</span>
//         </li>
//       ))}
//     </ul>
//   </div>
// )}
//                             </div>

//                             <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                               <button
//                                 onClick={() => handleApplyClick(job)}
//                                 className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                               >
//                                 Apply now
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </article>
//                     );
//                   })}

//                   {/* Load More Button */}
//                   {hasMore && filteredJobs.length > 0 && (
//                     <div className="text-center pt-6">
//                       <button
//                         onClick={handleLoadMore}
//                         disabled={isLoadingMore}
//                         className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
//                       >
//                         {isLoadingMore ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             Load More Jobs
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Filters */}
//             {filters.length > 0 && (
//               <aside className="lg:col-span-4">
//                 <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                       <p className="text-xs text-slate-600">Refine results by applying filters</p>
//                     </div>

//                     {/* Dynamic Filters from API */}
//                     {filters.map((filter) => (
//                       <div key={filter.type_name} className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <label className="text-xs font-medium text-slate-700 block mb-1 capitalize">
//                             {filter.type_name.toLowerCase()}
//                           </label>
//                           {getActiveFilterCount(filter.type_name) > 0 && (
//                             <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
//                               {getActiveFilterCount(filter.type_name)} selected
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {filter.data.map((item) => {
//                             const isActive = activeFilters[filter.type_name]?.includes(item.id) || false;
//                             return (
//                               <button
//                                 key={item.id}
//                                 type="button"
//                                 onClick={() => handleFilterChange(filter.type_name, item.id)}
//                                 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                                   isActive
//                                     ? "bg-indigo-600 text-white shadow-sm border border-indigo-600"
//                                     : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                                 }`}
//                               >
//                                 {item.name}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}

//                     {/* Clear All Filters Button */}
//                     {hasActiveFilters() && (
//                       <button
//                         onClick={clearAllFilters}
//                         className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Clear all filters
//                       </button>
//                     )}

//                     {/* Active Filters Summary */}
//                     {selectedFilters.length > 0 && (
//                       <div className="pt-4 border-t border-slate-200">
//                         <h4 className="text-xs font-semibold text-slate-900 mb-2">Active Filters:</h4>
//                         <div className="flex flex-wrap gap-1">
//                           {selectedFilters.map((filterId) => {
//                             let filterName = '';
//                             let filterType = '';
                            
//                             filters.forEach(filter => {
//                               const item = filter.data.find(d => d.id === filterId);
//                               if (item) {
//                                 filterName = item.name;
//                                 filterType = filter.type_name;
//                               }
//                             });
                            
//                             return (
//                               <span 
//                                 key={filterId} 
//                                 className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
//                               >
//                                 {filterName}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     // Find which filter type this belongs to
//                                     filters.forEach(filter => {
//                                       if (filter.data.find(d => d.id === filterId)) {
//                                         handleFilterChange(filter.type_name, filterId);
//                                       }
//                                     });
//                                   }}
//                                   className="text-indigo-400 hover:text-indigo-600"
//                                 >
//                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </span>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </aside>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer 
//         footerData={careerData.footer} 
//         baseUrl={`/${institute_id || ''}`}
//         instituteName={careerData.header.academic_name}
//         institute={careerData}
//       />
//     </div>
//   );
// };

// export default CareerApply;








// // src/pages/CareerApply.tsx
// import React, { useState, useEffect } from 'react';
// import { useNavigate, useParams, useLocation } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import NotFound from 'src/Frontend/Main/NotFound';

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type FilterItem = {
//   id: number;
//   name: string;
// };

// type FilterType = {
//   type_name: string;
//   data: FilterItem[];
// };

// type Job = {
//   id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   location: string;
//   job_type: string;
//   experience: string;
//   created_at: string;
//   apply_url?: string;
//   salary?: string;
//   deadline?: string;
//   status?: string;
//   job_meta?: {
//     [key: string]: number;
//   };
//   job_meta_names?: {
//     [key: string]: string;
//   };
//   requirements?: string[]; // Added requirements array from API
// };

// type CareerData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner: {
//     title: string;
//     long_description: string;
//     banner_image: string;
//     banner_type?: string;
//   };
//   jobs: Job[];
//   filters?: FilterType[];
//   footer: {
//     academic_name: string;
//     academic_email: string;
//     academic_address: string;
//   };
//   website?: string;
//   features?: {
//     show_search?: boolean;
//     show_filters?: boolean;
//     why_join_us?: string[];
//   };
//   baseUrl?: string;
// };


// type FilterState = {
//   [key: string]: number[];
// };


// const CareerApply: React.FC = () => {
//   const { institute_id } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   // State for career data
//   const [careerData, setCareerData] = useState<CareerData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   console.log("CAREER DATA:", careerData);
  
//   // State for jobs
//   const [jobs, setJobs] = useState<Job[]>([]);
//   const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
//   const [search, setSearch] = useState("");
//   const [isSearching, setIsSearching] = useState(false);
  
//   // State for filters
//   const [filters, setFilters] = useState<FilterType[]>([]);
//   const [activeFilters, setActiveFilters] = useState<FilterState>({});
//   const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  
//   // Pagination
//   const [page, setPage] = useState(0);
//   const [rowsPerPage] = useState(10);
//   const [totalJobs, setTotalJobs] = useState(0);
//   const [isLoadingMore, setIsLoadingMore] = useState(false);
//   const [hasMore, setHasMore] = useState(true);

//   // Fetch initial career data
//   useEffect(() => {
//     const fetchCareerData = async () => {
//       try {
        
//         if (!institute_id) {
//           setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
//           toast.error('Institute code not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         const response = await axios.post<CareerData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           { unique_code: institute_id },
//           { headers: { 'Content-Type': 'application/json' } }
//         );

//         if (response.data?.status === true) {
//           setCareerData(response.data);
          
//           if (response.data.jobs && Array.isArray(response.data.jobs)) {
//             setJobs(response.data.jobs);
//             setFilteredJobs(response.data.jobs);
//             setTotalJobs(response.data.jobs.length);
//           }
          
//           if (response.data.filters && Array.isArray(response.data.filters)) {
//             setFilters(response.data.filters);
            
//             // Initialize active filters state
//             const initialFilters: FilterState = {};
//             response.data.filters.forEach(filter => {
//               initialFilters[filter.type_name] = [];
//             });
//             setActiveFilters(initialFilters);
//           }
//         } else {
//           setError('No career data found for this institute');
//           toast.error('No career data available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching career data:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCareerData();
//   }, [institute_id, location.pathname, location.search]);

//   // Function to fetch filtered jobs from API
//   const fetchFilteredJobs = async (filtersToApply: number[], searchText: string, pageNum: number, reset = false) => {
//     try {
//       if (!institute_id) return;

//       setIsSearching(true);
      
//       const response = await axios.post<{
//         status: boolean;
//         total: number;
//         data: Job[];
//       }>(
//         `${apiUrl}/PublicCareer/get-career-jobs`,
//         {
//           unique_code: institute_id,
//           page: pageNum,
//           rowsPerPage,
//           filters: filtersToApply,
//           search: searchText
//         },
//         { headers: { 'Content-Type': 'application/json' } }
//       );

//       if (response.data?.status === true) {
//         if (reset) {
//           setFilteredJobs(response.data.data);
//         } else {
//           setFilteredJobs(prev => [...prev, ...response.data.data]);
//         }
//         setTotalJobs(response.data.total);
//         setHasMore(response.data.data.length === rowsPerPage);
//       }
//     } catch (err: any) {
//       console.error('Error fetching filtered jobs:', err);
//       toast.error(err.response?.data?.message || 'Failed to load jobs');
//     } finally {
//       setIsSearching(false);
//       setIsLoadingMore(false);
//     }
//   };

//   // Handle filter change
//   const handleFilterChange = (filterType: string, filterId: number) => {
//     setActiveFilters(prev => {
//       const currentFilters = prev[filterType] || [];
//       const newFilters = currentFilters.includes(filterId)
//         ? currentFilters.filter(id => id !== filterId)
//         : [...currentFilters, filterId];
      
//       const updated = { ...prev, [filterType]: newFilters };
      
//       // Extract all filter IDs for API call
//       const allFilterIds = Object.values(updated).flat();
//       setSelectedFilters(allFilterIds);
      
//       // Reset page when filters change
//       setPage(0);
      
//       // Fetch filtered jobs
//       fetchFilteredJobs(allFilterIds, search, 0, true);
      
//       return updated;
//     });
//   };

//   // Handle search with debounce
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       if (search.trim() !== '') {
//         // Reset page on search
//         setPage(0);
//         fetchFilteredJobs(selectedFilters, search, 0, true);
//       } else if (selectedFilters.length > 0) {
//         // If search is cleared but filters exist
//         fetchFilteredJobs(selectedFilters, '', 0, true);
//       } else {
//         // If both search and filters are cleared, show all jobs
//         setFilteredJobs(jobs);
//         setTotalJobs(jobs.length);
//       }
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [search, selectedFilters]);

//   // Handle load more
//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     setIsLoadingMore(true);
//     fetchFilteredJobs(selectedFilters, search, nextPage, false);
//   };

//   const handleApplyClick = (job: Job) => {
//     console.log("vfkdjvbdbvueufe", job);

//     if(careerData?.baseUrl){
//       navigate(`${careerData.baseUrl}/job_details/${job.id}`);
//       return;
//     }else{
//       navigate(`/Frontend/${institute_id}/job_details/${job.id}`);
//     }
//   };

//   // Clear all filters
//   const clearAllFilters = () => {
//     const resetFilters: FilterState = {};
//     filters.forEach(filter => {
//       resetFilters[filter.type_name] = [];
//     });
//     setActiveFilters(resetFilters);
//     setSelectedFilters([]);
//     setSearch('');
//     setPage(0);
//     setFilteredJobs(jobs);
//     setTotalJobs(jobs.length);
//   };

//   // Check if any filter is active
//   const hasActiveFilters = () => {
//     return selectedFilters.length > 0 || search.trim() !== '';
//   };

//   // Get count of active filters for a specific type
//   const getActiveFilterCount = (filterType: string) => {
//     return activeFilters[filterType]?.length || 0;
//   };

//   // Set page title and favicon
//   useEffect(() => {
//     if (careerData) {
//       document.title = `${careerData.header.academic_name} - Careers`;
      
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = careerData.header?.academic_logo
//         ? `${assetUrl}/${careerData.header.academic_logo}`
//         : '/favicon.ico';
      
//       setFavicon(faviconUrl);
//     }
//   }, [careerData]);

//   // Helper function to get job meta details
//   const getJobMetaDetails = (job: Job) => {
//     const metaDetails = [];
    
//     if (job.job_meta_names) {
//       // Get Job Type
//       if (job.job_meta_names['Job Type']) {
//         metaDetails.push({
//           label: 'Job Type',
//           value: job.job_meta_names['Job Type'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//             </svg>
//           ),
//           color: job.job_meta_names['Job Type'] === 'Full Time' 
//             ? 'bg-emerald-100 text-emerald-800'
//             : job.job_meta_names['Job Type'] === 'Part Time'
//             ? 'bg-blue-100 text-blue-800'
//             : 'bg-slate-100 text-slate-800'
//         });
//       }
      
//       // Get Location
//       if (job.job_meta_names['Location']) {
//         metaDetails.push({
//           label: 'Location',
//           value: job.job_meta_names['Location'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//             </svg>
//           ),
//           color: 'bg-slate-100 text-slate-600'
//         });
//       }
      
//       // Get Experience
//       if (job.job_meta_names['Experience']) {
//         metaDetails.push({
//           label: 'Experience',
//           value: job.job_meta_names['Experience'],
//           icon: (
//             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           ),
//           color: 'bg-slate-100 text-slate-600'
//         });
//       }
      
//       // Get other meta fields dynamically
//       Object.keys(job.job_meta_names).forEach(key => {
//         if (!['Job Type', 'Location', 'Experience'].includes(key)) {
//           metaDetails.push({
//             label: key,
//             value: job.job_meta_names[key],
//             icon: null,
//             color: 'bg-slate-100 text-slate-600'
//           });
//         }
//       });
//     }
    
//     return metaDetails;
//   };

//   // Helper function to get job requirements from API response
//   const getJobRequirements = (job: Job): string[] => {
//     // Use the API's requirements array if available
//     if (job.requirements && Array.isArray(job.requirements)) {
//       // Limit to first 4 requirements as requested
//       return job.requirements.slice(0, 4);
//     }
    
//     // Fallback: Return empty array if no requirements from API
//     return [];
//   };

//   if (loading) {
//     return <Loader/>;
//   }

//   if (error || !careerData) {
//     return <NotFound/>;
//   }

//   // Get dynamic banner content
//   const getBannerContent = () => {
//     const banner = careerData.banner;
//     const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
//     const bannerImage = banner.banner_image ? `${assetUrl}/${banner.banner_image}` : "";
    
//     return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
//   };

//   const bannerContent = getBannerContent();

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       <Helmet>
//         <title>{careerData.header.academic_name} - Careers</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={careerData.header.academic_name}
//         logo={careerData.header.academic_logo}
//         address={careerData.footer.academic_address}
//         baseUrl={`/${institute_id || ''}`}
//         institute_id={institute_id}
//         primaryWebsiteUrl={careerData.website || 'https://example.com'}
//       />

//       {/* HERO BANNER */}
//       <section className="py-6 md:py-8">
//         <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//             {/* LEFT TEXT BLOCK */}
//             <div className="bg-gradient-to-r from-orange-500 via-amber-450 to-yellow-300 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
//               <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
//                 {careerData.banner.title || 'Build Your Career With Us'}
//               </h2>

//               <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
//                 <div 
//                   className="prose prose-invert max-w-none"
//                   dangerouslySetInnerHTML={{ 
//                     __html: careerData.banner.long_description || ` `
//                   }}
//                 />
//               </div>
//             </div>

//             {/* RIGHT IMAGE/VIDEO BLOCK */}
//             <div className="w-full h-full relative">
//               {bannerContent.isVideo ? (
//                 <video
//                   className="w-full h-full object-cover"
//                   autoPlay
//                   muted
//                   loop
//                   playsInline
//                   poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
//                 >
//                   <source src={bannerContent.bannerImage} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               ) : (
//                 <img
//                   src={bannerContent.bannerImage}
//                   alt={`${careerData.header.academic_name} career opportunities`}
//                   className="w-full h-full object-cover"
//                   onError={(e) => {
//                     e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//                   }}
//                 />
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Search */}
//       <section className="bg-white border-b border-slate-200">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="space-y-4">
//             <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//               <div>
//                 <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
//                   Search jobs
//                 </h2>
//                 <p className="text-sm text-slate-600 mt-1">
//                   Type a role, skill, location, or keyword to see matching jobs instantly.
//                 </p>
//               </div>
//               <div className="text-sm text-slate-600">
//                 Total Positions: <span className="font-bold text-indigo-600">{totalJobs}</span>
//               </div>
//             </div>

//             {/* Live search input */}
//             <div className="relative">
//               <svg
//                 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                 />
//               </svg>
//               <input
//                 type="text"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search by role, skill, company, location..."
//                 className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
//                 disabled={isSearching}
//               />
//               {isSearching && (
//                 <div className="absolute right-4 top-1/2 -translate-y-1/2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
//                 </div>
//               )}
//             </div>

//             <div className="text-sm text-slate-600 flex items-center justify-between">
//               <span>
//                 Showing{" "}
//                 <span className="font-semibold text-slate-900">
//                   {filteredJobs.length}
//                 </span>{" "}
//                 {search.trim() || selectedFilters.length > 0 ? 'filtered' : 'open'} positions
//               </span>
//               {hasActiveFilters() && (
//                 <button
//                   onClick={clearAllFilters}
//                   className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
//                 >
//                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                   Clear all filters
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Job Listings + Filters */}
//       <main className="flex-1 py-8">
//         <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
//             {/* Job cards */}
//             <div className="lg:col-span-8 space-y-4">
//               {isSearching ? (
//                 <div className="text-center py-12">
//                   <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
//                   <p className="mt-4 text-slate-600">Searching jobs...</p>
//                 </div>
//               ) : filteredJobs.length === 0 ? (
//                 <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
//                   <svg
//                     className="w-16 h-16 mx-auto text-slate-400 mb-4"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={1.5}
//                       d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//                     />
//                   </svg>
//                   <h3 className="text-lg font-semibold text-slate-900 mb-2">
//                     No jobs found
//                   </h3>
//                   <p className="text-sm text-slate-600 mb-4">
//                     {hasActiveFilters() 
//                       ? "Try adjusting your search or filters."
//                       : "No job positions are currently available."
//                     }
//                   </p>
//                   {hasActiveFilters() && (
//                     <button
//                       onClick={clearAllFilters}
//                       className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
//                     >
//                       Clear all filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   {filteredJobs.map((job) => {
//                     const jobMetaDetails = getJobMetaDetails(job);
//                     const requirements = getJobRequirements(job);
                    
//                     return (
//                       <article
//                         key={job.id}
//                         className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
//                       >
//                         <div className="p-6 lg:p-8">
//                           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//                             <div className="space-y-3 flex-1">
//                               <div className="flex justify-between items-start">
//                                 <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
//                                   {job.job_title}
//                                 </h3>
//                                 {job.salary && (
//                                   <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
//                                     {job.salary}
//                                   </span>
//                                 )}
//                               </div>
//                               <p className="text-base text-slate-700 font-semibold">
//                                 {job.company_name}
//                               </p>
                              
//                               {/* Job Meta Details */}
//                               {jobMetaDetails.length > 0 && (
//                                 <div className="flex flex-wrap gap-2 mt-2">
//                                   {jobMetaDetails.map((meta, index) => (
//                                     <span 
//                                       key={index} 
//                                       className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${meta.color}`}
//                                       title={meta.label}
//                                     >
//                                       {meta.icon}
//                                       <span className="font-medium">{meta.value}</span>
//                                     </span>
//                                   ))}
                                  
//                                   {/* Posted Date */}
//                                   {job.created_at && (
//                                     <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
//                                       <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//                                       </svg>
//                                       {new Date(job.created_at).toLocaleDateString('en-IN')}
//                                     </span>
//                                   )}
//                                 </div>
//                               )}
                              
//                               {/* Requirements from API */}
//                               {requirements.length > 0 && (
//                                 <div className="mt-4 pt-4 border-t border-slate-100">
//                                   <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Requirements:</h4>
//                                   <ul className="space-y-2">
//                                     {requirements.map((requirement, index) => (
//                                       <li key={index} className="text-xs text-slate-600 flex gap-2">
//                                         <span className="text-emerald-600 font-bold">•</span>
//                                         <span>{requirement}</span>
//                                       </li>
//                                     ))}
//                                   </ul>
//                                 </div>
//                               )}
//                             </div>

//                             <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                               <button
//                                 onClick={() => handleApplyClick(job)}
//                                 className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                               >
//                                 Apply now
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                 </svg>
//                               </button>
//                             </div>
//                           </div>
//                         </div>
//                       </article>
//                     );
//                   })}

//                   {/* Load More Button */}
//                   {hasMore && filteredJobs.length > 0 && (
//                     <div className="text-center pt-6">
//                       <button
//                         onClick={handleLoadMore}
//                         disabled={isLoadingMore}
//                         className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
//                       >
//                         {isLoadingMore ? (
//                           <>
//                             <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             Load More Jobs
//                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                             </svg>
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </div>

//             {/* Filters */}
//             {filters.length > 0 && (
//               <aside className="lg:col-span-4">
//                 <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
//                   <div className="space-y-6">
//                     <div>
//                       <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
//                       <p className="text-xs text-slate-600">Refine results by applying filters</p>
//                     </div>

//                     {/* Dynamic Filters from API */}
//                     {filters.map((filter) => (
//                       <div key={filter.type_name} className="space-y-2">
//                         <div className="flex items-center justify-between">
//                           <label className="text-xs font-medium text-slate-700 block mb-1 capitalize">
//                             {filter.type_name.toLowerCase()}
//                           </label>
//                           {getActiveFilterCount(filter.type_name) > 0 && (
//                             <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
//                               {getActiveFilterCount(filter.type_name)} selected
//                             </span>
//                           )}
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {filter.data.map((item) => {
//                             const isActive = activeFilters[filter.type_name]?.includes(item.id) || false;
//                             return (
//                               <button
//                                 key={item.id}
//                                 type="button"
//                                 onClick={() => handleFilterChange(filter.type_name, item.id)}
//                                 className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
//                                   isActive
//                                     ? "bg-indigo-600 text-white shadow-sm border border-indigo-600"
//                                     : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
//                                 }`}
//                               >
//                                 {item.name}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}

//                     {/* Clear All Filters Button */}
//                     {hasActiveFilters() && (
//                       <button
//                         onClick={clearAllFilters}
//                         className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
//                       >
//                         <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                         </svg>
//                         Clear all filters
//                       </button>
//                     )}

//                     {/* Active Filters Summary */}
//                     {selectedFilters.length > 0 && (
//                       <div className="pt-4 border-t border-slate-200">
//                         <h4 className="text-xs font-semibold text-slate-900 mb-2">Active Filters:</h4>
//                         <div className="flex flex-wrap gap-1">
//                           {selectedFilters.map((filterId) => {
//                             let filterName = '';
//                             let filterType = '';
                            
//                             filters.forEach(filter => {
//                               const item = filter.data.find(d => d.id === filterId);
//                               if (item) {
//                                 filterName = item.name;
//                                 filterType = filter.type_name;
//                               }
//                             });
                            
//                             return (
//                               <span 
//                                 key={filterId} 
//                                 className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
//                               >
//                                 {filterName}
//                                 <button
//                                   type="button"
//                                   onClick={() => {
//                                     // Find which filter type this belongs to
//                                     filters.forEach(filter => {
//                                       if (filter.data.find(d => d.id === filterId)) {
//                                         handleFilterChange(filter.type_name, filterId);
//                                       }
//                                     });
//                                   }}
//                                   className="text-indigo-400 hover:text-indigo-600"
//                                 >
//                                   <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                                   </svg>
//                                 </button>
//                               </span>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               </aside>
//             )}
//           </div>
//         </div>
//       </main>

//       {/* Footer Component */}
//       <Footer 
//         footerData={careerData.footer} 
//         baseUrl={`/${institute_id || ''}`}
//         instituteName={careerData.header.academic_name}
//         institute={careerData}
//       />
//     </div>
//   );
// };

// export default CareerApply;









// src/pages/CareerApply.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import Loader from 'src/Frontend/Common/Loader';
import NotFound from 'src/Frontend/Main/NotFound';

const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

type FilterItem = {
  id: number;
  name: string;
};

type FilterType = {
  type_name: string;
  data: FilterItem[];
};

type Job = {
  id: number;
  job_title: string;
  company_name: string;
  description: string;
  location: string;
  job_type: string;
  experience: string;
  created_at: string;
  apply_url?: string;
  salary?: string;
  deadline?: string;
  status?: string;
  job_meta?: {
    [key: string]: number;
  };
  job_meta_names?: {
    [key: string]: string;
  };
};

type JobDetails = {
  job_id: number;
  requirements: string[];
  [key: string]: any;
};

type CareerData = {
  status: boolean;
  academic_id: number;
  unique_code: string;
  header: {
    academic_name: string;
    academic_logo: string;
  };
  banner: {
    title: string;
    long_description: string;
    banner_image: string;
    banner_type?: string;
  };
  jobs: Job[];
  filters?: FilterType[];
  footer: {
    academic_name: string;
    academic_email: string;
    academic_address: string;
  };
  website?: string;
  features?: {
    show_search?: boolean;
    show_filters?: boolean;
    why_join_us?: string[];
  };
  baseUrl?: string;
};

type FilterState = {
  [key: string]: number[];
};

type JobRequirementsCache = {
  [jobId: number]: string[];
};

const CareerApply: React.FC = () => {
  const { institute_id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  // State for career data
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  console.log("CAREER DATA:", careerData);
  
  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  
  // State for job requirements
  const [jobRequirementsCache, setJobRequirementsCache] = useState<JobRequirementsCache>({});
  const [loadingRequirements, setLoadingRequirements] = useState<Set<number>>(new Set());
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [totalJobs, setTotalJobs] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Fetch initial career data
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        
        if (!institute_id) {
          setError('Institute code not found. Please check the URL or provide ?code=YOUR_CODE parameter.');
          toast.error('Institute code not found');
          setLoading(false);
          return;
        }

        setLoading(true);
        
        const response = await axios.post<CareerData>(
          `${apiUrl}/PublicCareer/get-career-home`,
          { unique_code: institute_id },
          { headers: { 'Content-Type': 'application/json' } }
        );

        if (response.data?.status === true) {
          setCareerData(response.data);
          
          if (response.data.jobs && Array.isArray(response.data.jobs)) {
            setJobs(response.data.jobs);
            setFilteredJobs(response.data.jobs);
            setTotalJobs(response.data.jobs.length);
            
            // Fetch requirements for first few jobs
            fetchRequirementsForJobs(response.data.jobs.slice(0, 5));
          }
          
          if (response.data.filters && Array.isArray(response.data.filters)) {
            setFilters(response.data.filters);
            
            // Initialize active filters state
            const initialFilters: FilterState = {};
            response.data.filters.forEach(filter => {
              initialFilters[filter.type_name] = [];
            });
            setActiveFilters(initialFilters);
          }
        } else {
          setError('No career data found for this institute');
          toast.error('No career data available');
        }
      } catch (err: any) {
        console.error('Error fetching career data:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load career data';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerData();
  }, [institute_id, location.pathname, location.search]);

  // Fetch job requirements from API
  const fetchJobRequirements = async (jobId: number): Promise<string[]> => {
    try {
      // Check cache first
      if (jobRequirementsCache[jobId]) {
        return jobRequirementsCache[jobId];
      }

      setLoadingRequirements(prev => new Set(prev).add(jobId));

      const response = await axios.post<{
        status: boolean;
        data: JobDetails;
      }>(
        `${apiUrl}/PublicCareer/get-job-details`,
        { job_id: jobId },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data?.status === true && response.data.data?.requirements) {
        const requirements = response.data.data.requirements.slice(0, 4); // Limit to 4
        // Update cache
        setJobRequirementsCache(prev => ({
          ...prev,
          [jobId]: requirements
        }));
        return requirements;
      }
      
      return [];
    } catch (err: any) {
      console.error(`Error fetching requirements for job ${jobId}:`, err);
      return [];
    } finally {
      setLoadingRequirements(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  // Fetch requirements for multiple jobs
  const fetchRequirementsForJobs = async (jobs: Job[]) => {
    const requirementsPromises = jobs.map(job => fetchJobRequirements(job.id));
    await Promise.all(requirementsPromises);
  };

  // Function to fetch filtered jobs from API
  const fetchFilteredJobs = async (filtersToApply: number[], searchText: string, pageNum: number, reset = false) => {
    try {
      if (!institute_id) return;

      setIsSearching(true);
      
      const response = await axios.post<{
        status: boolean;
        total: number;
        data: Job[];
      }>(
        `${apiUrl}/PublicCareer/get-career-jobs`,
        {
          unique_code: institute_id,
          page: pageNum,
          rowsPerPage,
          filters: filtersToApply,
          search: searchText
        },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data?.status === true) {
        if (reset) {
          setFilteredJobs(response.data.data);
          // Fetch requirements for new jobs
          fetchRequirementsForJobs(response.data.data.slice(0, 5));
        } else {
          setFilteredJobs(prev => [...prev, ...response.data.data]);
          // Fetch requirements for newly loaded jobs
          fetchRequirementsForJobs(response.data.data);
        }
        setTotalJobs(response.data.total);
        setHasMore(response.data.data.length === rowsPerPage);
      }
    } catch (err: any) {
      console.error('Error fetching filtered jobs:', err);
      toast.error(err.response?.data?.message || 'Failed to load jobs');
    } finally {
      setIsSearching(false);
      setIsLoadingMore(false);
    }
  };

  // Handle filter change
  const handleFilterChange = (filterType: string, filterId: number) => {
    setActiveFilters(prev => {
      const currentFilters = prev[filterType] || [];
      const newFilters = currentFilters.includes(filterId)
        ? currentFilters.filter(id => id !== filterId)
        : [...currentFilters, filterId];
      
      const updated = { ...prev, [filterType]: newFilters };
      
      // Extract all filter IDs for API call
      const allFilterIds = Object.values(updated).flat();
      setSelectedFilters(allFilterIds);
      
      // Reset page when filters change
      setPage(0);
      
      // Fetch filtered jobs
      fetchFilteredJobs(allFilterIds, search, 0, true);
      
      return updated;
    });
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search.trim() !== '') {
        // Reset page on search
        setPage(0);
        fetchFilteredJobs(selectedFilters, search, 0, true);
      } else if (selectedFilters.length > 0) {
        // If search is cleared but filters exist
        fetchFilteredJobs(selectedFilters, '', 0, true);
      } else {
        // If both search and filters are cleared, show all jobs
        setFilteredJobs(jobs);
        setTotalJobs(jobs.length);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [search, selectedFilters]);

  // Handle load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    setIsLoadingMore(true);
    fetchFilteredJobs(selectedFilters, search, nextPage, false);
  };

  const handleApplyClick = (job: Job) => {
    if(careerData?.baseUrl){
      navigate(`${careerData.baseUrl}/job_details/${job.id}`);
      return;
    }else{
      navigate(`/Frontend/${institute_id}/job_details/${job.id}`);
    }
  };

  // Clear all filters
  const clearAllFilters = () => {
    const resetFilters: FilterState = {};
    filters.forEach(filter => {
      resetFilters[filter.type_name] = [];
    });
    setActiveFilters(resetFilters);
    setSelectedFilters([]);
    setSearch('');
    setPage(0);
    setFilteredJobs(jobs);
    setTotalJobs(jobs.length);
  };

  // Check if any filter is active
  const hasActiveFilters = () => {
    return selectedFilters.length > 0 || search.trim() !== '';
  };

  // Get count of active filters for a specific type
  const getActiveFilterCount = (filterType: string) => {
    return activeFilters[filterType]?.length || 0;
  };

  // Set page title and favicon
  useEffect(() => {
    if (careerData) {
      document.title = `${careerData.header.academic_name} - Careers`;
      
      const setFavicon = (faviconUrl: string) => {
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = faviconUrl;
        document.head.appendChild(link);
      };

      const faviconUrl = careerData.header?.academic_logo
        ? `${assetUrl}/${careerData.header.academic_logo}`
        : '/favicon.ico';
      
      setFavicon(faviconUrl);
    }
  }, [careerData]);

  // Helper function to get job meta details
  const getJobMetaDetails = (job: Job) => {
    const metaDetails = [];
    
    if (job.job_meta_names) {
      // Get Job Type
      if (job.job_meta_names['Job Type']) {
        metaDetails.push({
          label: 'Job Type',
          value: job.job_meta_names['Job Type'],
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          ),
          color: job.job_meta_names['Job Type'] === 'Full Time' 
            ? 'bg-emerald-100 text-emerald-800'
            : job.job_meta_names['Job Type'] === 'Part Time'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-slate-100 text-slate-800'
        });
      }
      
      // Get Location
      if (job.job_meta_names['Location']) {
        metaDetails.push({
          label: 'Location',
          value: job.job_meta_names['Location'],
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          ),
          color: 'bg-slate-100 text-slate-600'
        });
      }
      
      // Get Experience
      if (job.job_meta_names['Experience']) {
        metaDetails.push({
          label: 'Experience',
          value: job.job_meta_names['Experience'],
          icon: (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          color: 'bg-slate-100 text-slate-600'
        });
      }
      
      // Get other meta fields dynamically
      Object.keys(job.job_meta_names).forEach(key => {
        if (!['Job Type', 'Location', 'Experience'].includes(key)) {
          metaDetails.push({
            label: key,
            value: job.job_meta_names[key],
            icon: null,
            color: 'bg-slate-100 text-slate-600'
          });
        }
      });
    }
    
    return metaDetails;
  };

  // Helper function to get job requirements (with lazy loading)
  const getJobRequirements = (job: Job) => {
    // Return cached requirements if available
    if (jobRequirementsCache[job.id]) {
      return jobRequirementsCache[job.id];
    }
    
    // If not cached but we haven't started loading yet, trigger load
    if (!loadingRequirements.has(job.id)) {
      // Load in background
      fetchJobRequirements(job.id);
    }
    
    // Return empty array while loading
    return [];
  };

  if (loading) {
    return <Loader/>;
  }

  if (error || !careerData) {
    return <NotFound/>;
  }

  // Get dynamic banner content
  const getBannerContent = () => {
    const banner = careerData.banner;
    const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
    const bannerImage = banner.banner_image ? `${assetUrl}/${banner.banner_image}` : "";
    
    return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
  };

  const bannerContent = getBannerContent();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>{careerData.header.academic_name} - Careers</title>
        <meta name="description" content="Explore career opportunities and join our team" />
      </Helmet>

      <Header
        instituteName={careerData.header.academic_name}
        logo={careerData.header.academic_logo}
        address={careerData.footer.academic_address}
        baseUrl={`/${institute_id || ''}`}
        institute_id={institute_id}
        primaryWebsiteUrl={careerData.website || 'https://example.com'}
      />

      {/* HERO BANNER */}
      <section className="py-6 md:py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
            {/* LEFT TEXT BLOCK */}
            <div className="bg-gradient-to-r from-orange-500 via-amber-450 to-yellow-300 text-white p-8 md:p-12 flex flex-col justify-center space-y-5">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight text-white">
                {careerData.banner.title || 'Build Your Career With Us'}
              </h2>

              <div className="text-sm md:text-base text-white/90 max-w-xl space-y-3">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: careerData.banner.long_description || ` `
                  }}
                />
              </div>
            </div>

            {/* RIGHT IMAGE/VIDEO BLOCK */}
            <div className="w-full h-full relative">
              {bannerContent.isVideo ? (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
                >
                  <source src={bannerContent.bannerImage} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img
                  src={bannerContent.bannerImage}
                  alt={`${careerData.header.academic_name} career opportunities`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Search */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                  Search jobs
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Type a role, skill, location, or keyword to see matching jobs instantly.
                </p>
              </div>
              <div className="text-sm text-slate-600">
                Total Positions: <span className="font-bold text-indigo-600">{totalJobs}</span>
              </div>
            </div>

            {/* Live search input */}
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by role, skill, company, location..."
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 text-sm placeholder-slate-500"
                disabled={isSearching}
              />
              {isSearching && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-indigo-600"></div>
                </div>
              )}
            </div>

            <div className="text-sm text-slate-600 flex items-center justify-between">
              <span>
                Showing{" "}
                <span className="font-semibold text-slate-900">
                  {filteredJobs.length}
                </span>{" "}
                {search.trim() || selectedFilters.length > 0 ? 'filtered' : 'open'} positions
              </span>
              {hasActiveFilters() && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings + Filters */}
      <main className="flex-1 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Job cards */}
            <div className="lg:col-span-8 space-y-4">
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-slate-600">Searching jobs...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                  <svg
                    className="w-16 h-16 mx-auto text-slate-400 mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    No jobs found
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    {hasActiveFilters() 
                      ? "Try adjusting your search or filters."
                      : "No job positions are currently available."
                    }
                  </p>
                  {hasActiveFilters() && (
                    <button
                      onClick={clearAllFilters}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {filteredJobs.map((job) => {
                    const jobMetaDetails = getJobMetaDetails(job);
                    const requirements = getJobRequirements(job);
                    const isLoadingReq = loadingRequirements.has(job.id);
                    
                    return (
                      <article
                        key={job.id}
                        className="group bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
                      >
                        <div className="p-6 lg:p-8">
                          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                            <div className="space-y-3 flex-1">
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:text-indigo-600 line-clamp-2 pr-4">
                                  {job.job_title}
                                </h3>
                                {job.salary && (
                                  <span className="text-sm font-semibold bg-green-100 text-green-800 px-3 py-1 rounded-full whitespace-nowrap">
                                    {job.salary}
                                  </span>
                                )}
                              </div>
                              <p className="text-base text-slate-700 font-semibold">
                                {job.company_name}
                              </p>
                              
                              {/* Job Meta Details */}
                              {jobMetaDetails.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {jobMetaDetails.map((meta, index) => (
                                    <span 
                                      key={index} 
                                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${meta.color}`}
                                      title={meta.label}
                                    >
                                      {meta.icon}
                                      <span className="font-medium">{meta.value}</span>
                                    </span>
                                  ))}
                                  
                                  {/* Posted Date */}
                                  {job.created_at && (
                                    <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full flex items-center gap-1">
                                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                      </svg>
                                      {new Date(job.created_at).toLocaleDateString('en-IN')}
                                    </span>
                                  )}
                                </div>
                              )}
                              
                              {/* Requirements from API */}
                              {isLoadingReq ? (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <div className="flex items-center gap-2 text-sm text-slate-500">
                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
                                    Loading requirements...
                                  </div>
                                </div>
                              ) : requirements.length > 0 ? (
                                <div className="mt-4 pt-4 border-t border-slate-100">
                                  <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Requirements:</h4>
                                  <ul className="space-y-2">
                                    {requirements.map((requirement, index) => (
                                      <li key={index} className="text-xs text-slate-600 flex gap-2">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{requirement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
                              <button
                                onClick={() => handleApplyClick(job)}
                                className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                Apply now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}

                  {/* Load More Button */}
                  {hasMore && filteredJobs.length > 0 && (
                    <div className="text-center pt-6">
                      <button
                        onClick={handleLoadMore}
                        disabled={isLoadingMore}
                        className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                      >
                        {isLoadingMore ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            Load More Jobs
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1">Filter jobs</h3>
                      <p className="text-xs text-slate-600">Refine results by applying filters</p>
                    </div>

                    {/* Dynamic Filters from API */}
                    {filters.map((filter) => (
                      <div key={filter.type_name} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-slate-700 block mb-1 capitalize">
                            {filter.type_name.toLowerCase()}
                          </label>
                          {getActiveFilterCount(filter.type_name) > 0 && (
                            <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                              {getActiveFilterCount(filter.type_name)} selected
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {filter.data.map((item) => {
                            const isActive = activeFilters[filter.type_name]?.includes(item.id) || false;
                            return (
                              <button
                                key={item.id}
                                type="button"
                                onClick={() => handleFilterChange(filter.type_name, item.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 ${
                                  isActive
                                    ? "bg-indigo-600 text-white shadow-sm border border-indigo-600"
                                    : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                                }`}
                              >
                                {item.name}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}

                    {/* Clear All Filters Button */}
                    {hasActiveFilters() && (
                      <button
                        onClick={clearAllFilters}
                        className="w-full px-4 py-2.5 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                      </button>
                    )}

                    {/* Active Filters Summary */}
                    {selectedFilters.length > 0 && (
                      <div className="pt-4 border-t border-slate-200">
                        <h4 className="text-xs font-semibold text-slate-900 mb-2">Active Filters:</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedFilters.map((filterId) => {
                            let filterName = '';
                            let filterType = '';
                            
                            filters.forEach(filter => {
                              const item = filter.data.find(d => d.id === filterId);
                              if (item) {
                                filterName = item.name;
                                filterType = filter.type_name;
                              }
                            });
                            
                            return (
                              <span 
                                key={filterId} 
                                className="inline-flex items-center gap-1 text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded"
                              >
                                {filterName}
                                <button
                                  type="button"
                                  onClick={() => {
                                    // Find which filter type this belongs to
                                    filters.forEach(filter => {
                                      if (filter.data.find(d => d.id === filterId)) {
                                        handleFilterChange(filter.type_name, filterId);
                                      }
                                    });
                                  }}
                                  className="text-indigo-400 hover:text-indigo-600"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </aside>
            )}
          </div>
        </div>
      </main>

      {/* Footer Component */}
      <Footer 
        footerData={careerData.footer} 
        baseUrl={`/${institute_id || ''}`}
        instituteName={careerData.header.academic_name}
        institute={careerData}
      />
    </div>
  );
};

export default CareerApply;