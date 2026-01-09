// // src/pages/ApplyJobPage.tsx
// import { useState, useRef } from "react";
// import { useSearchParams, useNavigate } from "react-router";
// import Header from "./Header";
// import Footer from "./Footer";


// export const ApplyJobPage: React.FC = () => {
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();

//   const jobTitle = searchParams.get("title") || "WordPress Developer";
//   const company = searchParams.get("company") || "Flying Stars Tech";
//   const location = searchParams.get("location") || "Remote";
//   const jobId = searchParams.get("jobId") || "1";

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     coverLetter: "",
//     resume: null as File | null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         alert("File size should be less than 5MB");
//         return;
//       }
//       setFormData((prev) => ({ ...prev, resume: file }));
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate form
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.resume
//     ) {
//       alert("Please fill all required fields");
//       setIsSubmitting(false);
//       return;
//     }

//     // Simulate API call
//     try {
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       console.log("Application submitted:", {
//         jobId,
//         jobTitle,
//         company,
//         location,
//         ...formData,
//       });

//       // Show success message
//       alert(
//         `✅ Application submitted successfully!\n\nRole: ${jobTitle}\nCompany: ${company}\n\nWe'll contact you at ${formData.email} soon.`
//       );

//       // Reset form
//       setFormData({
//         name: "",
//         email: "",
//         phone: "",
//         subject: "",
//         coverLetter: "",
//         resume: null,
//       });
//       if (fileInputRef.current) fileInputRef.current.value = "";

//       // Navigate back after delay
//       setTimeout(() => navigate("/"), 2000);
//     } catch (error) {
//       console.error("Submission error:", error);
//       alert(
//         "❌ There was an error submitting your application. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (
//         file.type === "application/pdf" ||
//         file.type === "application/msword" ||
//         file.type ===
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         setFormData((prev) => ({ ...prev, resume: file }));
//       } else {
//         alert("Please upload only PDF or Word documents");
//       }
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* Reusable Header */}
//       <Header/>

//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Main container with 50-50 split */}
//           <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-slate-200">
//               {/* Left Column - Job Details (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
//                 <div className="sticky top-6">
//                   {/* Job Title & Company */}
//                   <div className="mb-8">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-4">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       Active Hiring
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
//                       {jobTitle}
//                     </h1>
//                     <div className="flex items-center gap-3 text-lg text-slate-700">
//                       <span className="font-semibold">{company}</span>
//                       <span className="text-slate-400">•</span>
//                       <span className="flex items-center gap-1">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {location}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Job Requirements */}
//                   <div className="mb-8">
//                     <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
//                       Job Description
//                     </h2>
//                     <p className="text-slate-700 mb-6">
//                       We are looking for an experienced WordPress Developer
//                       (3-6 years) with strong expertise in both frontend and
//                       backend development. The ideal candidate should be able to
//                       build, customize, and optimize WordPress themes, plugins,
//                       and integrations while ensuring pixel-perfect design,
//                       responsive layouts, and high performance.
//                     </p>

//                     <h3 className="text-lg font-bold text-slate-900 mb-3">
//                       Roles & Responsibilities
//                     </h3>
//                     <ul className="space-y-2 mb-8">
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Design and develop custom WordPress themes, plugins
//                           and integrations of APIs
//                         </span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Manage the development of new websites from concept to
//                           deployment
//                         </span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Implement responsive and mobile-friendly designs using
//                           HTML5, CSS3, JavaScript, and Bootstrap/Tailwind
//                         </span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Troubleshoot and resolve plugin conflicts, theme
//                           issues, and server-related errors
//                         </span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Collaborate with UI/UX designers to ensure creative
//                           and responsive designs
//                         </span>
//                       </li>
//                       <li className="flex items-start gap-3">
//                         <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
//                         <span className="text-slate-700">
//                           Optimize websites for speed, performance, and SEO best
//                           practices
//                         </span>
//                       </li>
//                     </ul>

//                     <h3 className="text-lg font-bold text-slate-900 mb-3">
//                       Requirements
//                     </h3>
//                     <div className="flex flex-wrap gap-2 mb-8">
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         3-6 years experience
//                       </span>
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         WordPress
//                       </span>
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         PHP
//                       </span>
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         HTML5/CSS3
//                       </span>
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         JavaScript
//                       </span>
//                       <span className="px-3 py-1 bg-slate-100 text-slate-700 text-xs font-medium rounded-full">
//                         Responsive Design
//                       </span>
//                     </div>

//                     <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6">
//                       <h4 className="font-bold text-slate-900 mb-2">
//                         📧 Need Help?
//                       </h4>
//                       <p className="text-sm text-slate-600 mb-3">
//                         Have questions about this role? Contact our HR team
//                       </p>
//                       <a
//                         href="mailto:careers@flyingstars.com"
//                         className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                           />
//                         </svg>
//                         careers@flyingstars.com
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Application Form (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10">
//                 <div className="max-w-lg mx-auto">
//                   {/* Form Header */}
//                   <div className="text-center mb-8">
//                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
//                       Apply for this Job
//                     </h2>
//                     <p className="text-slate-600">
//                       Fill in your details to submit your application
//                     </p>
//                     <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
//                       <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
//                     </div>
//                   </div>

//                   {/* Form */}
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name & Email Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           required
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="Your full name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Email <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           required
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="your.email@example.com"
//                         />
//                       </div>
//                     </div>

//                     {/* Phone & Subject Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Phone Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           required
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="+91 98765 43210"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Subject
//                         </label>
//                         <input
//                           type="text"
//                           name="subject"
//                           value={formData.subject}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="Application Subject"
//                         />
//                       </div>
//                     </div>

//                     {/* Resume Upload */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Upload Resume <span className="text-red-500">*</span>
//                       </label>
//                       <div
//                         className="relative"
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                       >
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           name="resume"
//                           accept=".pdf,.doc,.docx"
//                           required
//                           onChange={handleFileChange}
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                         />
//                         <div
//                           className={`flex items-center justify-between px-6 py-5 border-2 ${
//                             formData.resume
//                               ? "border-emerald-500 bg-emerald-50"
//                               : "border-dashed border-slate-300"
//                           } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//                         >
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-xl ${
//                                 formData.resume
//                                   ? "bg-emerald-100"
//                                   : "bg-slate-100"
//                               }`}
//                             >
//                               <svg
//                                 className={`w-5 h-5 ${
//                                   formData.resume
//                                     ? "text-emerald-600"
//                                     : "text-slate-500"
//                                 }`}
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                 />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-semibold text-slate-900 text-sm">
//                                 {formData.resume
//                                   ? formData.resume.name
//                                   : "Choose File"}
//                               </p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {formData.resume
//                                   ? `Uploaded (${(
//                                       formData.resume.size /
//                                       1024 /
//                                       1024
//                                     ).toFixed(2)} MB)`
//                                   : "No file chosen"}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             type="button"
//                             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//                             onClick={() => fileInputRef.current?.click()}
//                           >
//                             Browse
//                           </button>
//                         </div>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-2">
//                         PDF, DOC, DOCX (Max 5MB)
//                       </p>
//                     </div>

//                     {/* Cover Letter */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Give us a brief about yourself{" "}
//                         <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         name="coverLetter"
//                         required
//                         value={formData.coverLetter}
//                         onChange={handleInputChange}
//                         rows={4}
//                         className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//                         placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//                       />
//                     </div>

//                     {/* Terms and Conditions */}
//                     <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         required
//                         className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//                       />
//                       <label htmlFor="terms" className="text-sm text-slate-700">
//                         I agree to the{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Terms of Service
//                         </a>{" "}
//                         and{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Privacy Policy
//                         </a>
//                         . I confirm that the information provided is accurate.
//                       </label>
//                     </div>

//                     {/* Submit button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-emerald-500/30 ${
//                         isSubmitting ? "opacity-75 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin w-5 h-5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                           SUBMIT APPLICATION
//                         </>
//                       )}
//                     </button>

//                     {/* Application tips */}
//                     <div className="text-center pt-4 border-t border-slate-200">
//                       <p className="text-xs text-slate-500">
//                         Your application will be reviewed within 48 hours. We'll
//                         contact you via email for next steps.
//                       </p>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Reusable Footer */}
//       <Footer/>
//     </div>
//   );
// };

// export default ApplyJobPage;













// // src/pages/ApplyJobPage.tsx
// import { useState, useRef, useEffect } from "react";
// import { useSearchParams, useNavigate, useLocation, useParams } from "react-router";
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from "./Header";
// import Footer from "./Footer";

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type JobDetails = {
//   job_id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   academic_id: number;
//   academic_name: string;
//   location?: string;
//   job_type?: string;
//   experience?: string;
//   salary?: string;
//   deadline?: string;
//   requirements?: string[];
//   responsibilities?: string[];
// };

// export const ApplyJobPage: React.FC = () => {
//   const { institute_id } = useParams();
//   const [searchParams] = useSearchParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const stateInstituteId = location.state?.institute_id;

//   // Get job ID from URL parameters
//   const jobId = searchParams.get("jobId") || "";
//   const jobTitle = searchParams.get("title") || "";
//   const company = searchParams.get("company") || "";
//   const locationParam = searchParams.get("location") || "";

//   const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
//   const [institute, setInstitute] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [instituteLoading, setInstituteLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     coverLetter: "",
//     resume: null as File | null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Extract unique_code from URL
//  const getUniqueCode = () => {
//     // First check if passed in state
//     if (stateInstituteId) {
//       return stateInstituteId;
//     }

//      if (institute_id && institute_id !== ':institute_id') {
//       return institute_id;
//     }
    
//     const pathParts = location.pathname.split('/');
//     for (const part of pathParts) {
//       if (part && part !== 'aapply' && part !== 'apply' && part !== '') {
//         if (/^[a-zA-Z0-9]+$/.test(part) && part.length > 5) {
//           return part;
//         }
//       }
//     }
    
//     const searchParams = new URLSearchParams(location.search);
//     return searchParams.get('code') || searchParams.get('institute');
//   };

//   // Fetch institute data
//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       const uniqueCode = getUniqueCode();
//       if (!uniqueCode) {
//         console.log('No unique code found for institute');
//         return;
//       }

//       try {
//         setInstituteLoading(true);
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

//         console.log('Institute Data API Response:', response.data);
//         if (response.data && response.data.status === true) {
//           setInstitute(response.data);
//         }
//       } catch (err: any) {
//         console.error('Error fetching institute data:', err);
//       } finally {
//         setInstituteLoading(false);
//       }
//     };

//     fetchInstituteData();
//   }, []);

//   // Fetch job details from API
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         if (!jobId) {
//           setError('Job ID not found');
//           toast.error('Job ID not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         // API call to get job details
//         const response = await axios.post(
//           `${apiUrl}/PublicCareer/get-job-details`,
//           {
//             job_id: parseInt(jobId)
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('Job Details API Response:', response.data);

//         if (response.data && response.data.status === true) {
//           const data = response.data.data;
//           setJobDetails(data);
//         } else {
//           setError('Job details not found');
//           toast.error('Job details not available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching job details:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load job details';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchJobDetails();
//   }, [jobId]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size should be less than 5MB");
//         return;
//       }
//       setFormData((prev) => ({ ...prev, resume: file }));
//       toast.success('Resume uploaded successfully');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     // Validate form
//     if (
//       !formData.name ||
//       !formData.email ||
//       !formData.phone ||
//       !formData.resume
//     ) {
//       toast.error("Please fill all required fields");
//       setIsSubmitting(false);
//       return;
//     }

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('job_id', jobId);
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('email', formData.email);
//       formDataToSend.append('phone', formData.phone);
//       formDataToSend.append('subject', formData.subject || `Application for ${jobDetails?.job_title || jobTitle}`);
//       formDataToSend.append('cover_letter', formData.coverLetter);
//       if (formData.resume) {
//         formDataToSend.append('resume', formData.resume);
//       }

//       // Add unique_code if available
//       const uniqueCode = getUniqueCode();
//       if (uniqueCode) {
//         formDataToSend.append('unique_code', uniqueCode);
//       }

//       // API call to submit application
//       const response = await axios.post(
//         `${apiUrl}/PublicCareer/submit-application`,
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data && response.data.status === true) {
//         toast.success(
//           `✅ Application submitted successfully!\n\nWe'll contact you at ${formData.email} soon.`
//         );

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           subject: "",
//           coverLetter: "",
//           resume: null,
//         });
//         if (fileInputRef.current) fileInputRef.current.value = "";

//         // Navigate back after delay
//         setTimeout(() => navigate(-1), 2000);
//       } else {
//         toast.error(response.data?.message || 'Failed to submit application');
//       }
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       toast.error(
//         error.response?.data?.message || "❌ There was an error submitting your application. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       if (
//         file.type === "application/pdf" ||
//         file.type === "application/msword" ||
//         file.type ===
//           "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
//       ) {
//         if (file.size > 5 * 1024 * 1024) {
//           toast.error("File size should be less than 5MB");
//           return;
//         }
//         setFormData((prev) => ({ ...prev, resume: file }));
//         toast.success('Resume uploaded successfully');
//       } else {
//         toast.error("Please upload only PDF or Word documents");
//       }
//     }
//   };

//   // Get institute data safely
//   const getInstituteLogo = () => {
//     console.log('Institute Data:', institute);
//     if (!institute || !institute.header) return '';
//     return institute.header.academic_logo || '';
//   };

//   const getInstituteAddress = () => {
//     if (!institute || !institute.footer) return '';
//     return institute.footer.academic_address || '';
//   };

//   const getInstituteWebsiteUrl = () => {
//     if (!institute) return 'https://example.com';
//     return institute.website || 'https://example.com';
//   };

//   const getInstituteName = () => {
//     if (!institute || !institute.header) return jobDetails?.academic_name || '';
//     return institute.header.academic_name || jobDetails?.academic_name || '';
//   };

//   // Get job details for display
//   const displayJobTitle = jobDetails?.job_title || jobTitle;
//   const displayCompany = jobDetails?.company_name || company;
//   const displayLocation = locationParam || 'Not specified';

//   const uniqueCode = getUniqueCode();

//   // Show loading only when both job details and institute are loading
//   const isLoading = loading || instituteLoading;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !jobDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center p-8">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h3>
//           <p className="text-slate-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* Dynamic Header */}
//       <Header
//         logo={getInstituteLogo()}
//         address={getInstituteAddress()}
//         instituteName={getInstituteName()}
//         baseUrl={`/${uniqueCode || ''}`}
//         institute_id={uniqueCode}
//         primaryWebsiteUrl={getInstituteWebsiteUrl()}
//       />

//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Main container with 50-50 split */}
//           <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-slate-200">
//               {/* Left Column - Job Details (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
//                 <div className="sticky top-6">
//                   {/* Job Title & Company */}
//                   <div className="mb-8">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-4">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       Active Hiring
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
//                       {displayJobTitle}
//                     </h1>
//                     <div className="flex items-center gap-3 text-lg text-slate-700">
//                       <span className="font-semibold">{displayCompany}</span>
//                       <span className="text-slate-400">•</span>
//                       <span className="flex items-center gap-1">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {displayLocation}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Job Description - Dynamic from API */}
//                   <div className="mb-8">
//                     <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
//                       Job Description
//                     </h2>
//                     {jobDetails.description ? (
//                       <div 
//                         className="prose prose-slate max-w-none"
//                         dangerouslySetInnerHTML={{ __html: jobDetails.description }}
//                       />
//                     ) : (
//                       <p className="text-slate-700 mb-6">
//                         We are looking for an experienced professional with strong expertise in development.
//                       </p>
//                     )}

//                     {/* Contact Information */}
//                     <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6 mt-8">
//                       <h4 className="font-bold text-slate-900 mb-2">
//                         📧 Need Help?
//                       </h4>
//                       <p className="text-sm text-slate-600 mb-3">
//                         Have questions about this role? Contact our HR team
//                       </p>
//                       <a
//                         href={`mailto:careers@${displayCompany.toLowerCase().replace(/\s+/g, '')}.com`}
//                         className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                           />
//                         </svg>
//                         careers@{displayCompany.toLowerCase().replace(/\s+/g, '')}.com
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Application Form (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10">
//                 <div className="max-w-lg mx-auto">
//                   {/* Form Header */}
//                   <div className="text-center mb-8">
//                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
//                       Apply for this Job
//                     </h2>
//                     <p className="text-slate-600">
//                       Fill in your details to submit your application
//                     </p>
//                     <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
//                       <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
//                     </div>
//                   </div>

//                   {/* Form */}
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name & Email Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           required
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="Your full name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Email <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           required
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="your.email@example.com"
//                         />
//                       </div>
//                     </div>

//                     {/* Phone & Subject Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Phone Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           required
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="+91 98765 43210"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Subject
//                         </label>
//                         <input
//                           type="text"
//                           name="subject"
//                           value={formData.subject}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder={`Application for ${displayJobTitle}`}
//                           defaultValue={`Application for ${displayJobTitle}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Resume Upload */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Upload Resume <span className="text-red-500">*</span>
//                       </label>
//                       <div
//                         className="relative"
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                       >
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           name="resume"
//                           accept=".pdf,.doc,.docx,.txt"
//                           required
//                           onChange={handleFileChange}
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                         />
//                         <div
//                           className={`flex items-center justify-between px-6 py-5 border-2 ${
//                             formData.resume
//                               ? "border-emerald-500 bg-emerald-50"
//                               : "border-dashed border-slate-300"
//                           } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//                         >
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-xl ${
//                                 formData.resume
//                                   ? "bg-emerald-100"
//                                   : "bg-slate-100"
//                               }`}
//                             >
//                               <svg
//                                 className={`w-5 h-5 ${
//                                   formData.resume
//                                     ? "text-emerald-600"
//                                     : "text-slate-500"
//                                 }`}
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                 />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-semibold text-slate-900 text-sm">
//                                 {formData.resume
//                                   ? formData.resume.name
//                                   : "Choose File"}
//                               </p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {formData.resume
//                                   ? `Uploaded (${(
//                                       formData.resume.size /
//                                       1024 /
//                                       1024
//                                     ).toFixed(2)} MB)`
//                                   : "No file chosen"}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             type="button"
//                             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//                             onClick={() => fileInputRef.current?.click()}
//                           >
//                             Browse
//                           </button>
//                         </div>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-2">
//                         PDF, DOC, DOCX, TXT (Max 5MB)
//                       </p>
//                     </div>

//                     {/* Cover Letter */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Cover Letter <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         name="coverLetter"
//                         required
//                         value={formData.coverLetter}
//                         onChange={handleInputChange}
//                         rows={4}
//                         className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//                         placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//                       />
//                     </div>

//                     {/* Terms and Conditions */}
//                     <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         required
//                         className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//                       />
//                       <label htmlFor="terms" className="text-sm text-slate-700">
//                         I agree to the{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Terms of Service
//                         </a>{" "}
//                         and{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Privacy Policy
//                         </a>
//                         . I confirm that the information provided is accurate.
//                       </label>
//                     </div>

//                     {/* Submit button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting}
//                       className={`w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-emerald-500/30 ${
//                         isSubmitting ? "opacity-75 cursor-not-allowed" : ""
//                       }`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin w-5 h-5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                           SUBMIT APPLICATION
//                         </>
//                       )}
//                     </button>

//                     {/* Application tips */}
//                     <div className="text-center pt-4 border-t border-slate-200">
//                       <p className="text-xs text-slate-500">
//                         Your application will be reviewed within 48 hours. We'll
//                         contact you via email for next steps.
//                       </p>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Dynamic Footer */}
//       <Footer 
//         baseUrl={`/${uniqueCode || ''}`}
//         instituteName={getInstituteName()}
//         institute={institute}
//         footerData={institute?.footer}
//       />
//     </div>
//   );
// };

// export default ApplyJobPage;











// // src/pages/ApplyJobPage.tsx
// import { useState, useRef, useEffect } from "react";
// import { useSearchParams, useNavigate, useLocation, useParams } from "react-router";
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from "./Header";
// import Footer from "./Footer";

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type JobDetails = {
//   job_id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   requirements?: string[];
//   responsibilities?: string[];
//   academic_id: number;
//   academic_name: string;
//   location?: string;
//   job_type?: string;
//   experience?: string;
//   salary?: string;
//   deadline?: string;
//   apply_url?: string;
//   created_at?: string;
//   status?: string;
//   job_meta?: {
//     first?: number;
//     second?: number;
//     third?: number;
//   };
// };

// type InstituteData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner?: {
//     title?: string;
//     long_description?: string;
//     banner_image?: string;
//   };
//   footer?: {
//     academic_name?: string;
//     academic_email?: string;
//     academic_address?: string;
//   };
//   website?: string;
//   contact_email?: string;
//   hr_email?: string;
// };

// export const ApplyJobPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { instituteId, jobId } = useParams(); 
//   const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
//   const [institute, setInstitute] = useState<InstituteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [instituteLoading, setInstituteLoading] = useState(false);
  
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     subject: "",
//     coverLetter: "",
//     resume: null as File | null,
//   });
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   // Fetch institute data
//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       if (!instituteId) {
//         console.log('No unique code found for institute');
//         return;
//       }

//       try {
//         setInstituteLoading(true);
//         const response = await axios.post<InstituteData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           {
//             unique_code: instituteId
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('Institute Data API Response:', response.data);
//         if (response.data && response.data.status === true) {
//           setInstitute(response.data);
//         }
//       } catch (err: any) {
//         console.error('Error fetching institute data:', err);
//       } finally {
//         setInstituteLoading(false);
//       }
//     };

//     fetchInstituteData();
//   }, [location.pathname, location.search]);

//   // Fetch job details from API
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         if (!jobId) {
//           setError('Job ID not found');
//           toast.error('Job ID not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         // API call to get job details
//         const response = await axios.post<{
//           status: boolean;
//           data: JobDetails;
//           message?: string;
//         }>(
//           `${apiUrl}/PublicCareer/get-job-details`,
//           {
//             job_id: parseInt(jobId)
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('Job Details API Response:', response.data);

//         if (response.data && response.data.status === true) {
//           setJobDetails(response.data.data);
          
//           // Auto-set subject if not already set
//           if (!formData.subject && response.data.data.job_title) {
//             setFormData(prev => ({
//               ...prev,
//               subject: `Application for ${response.data.data.job_title}`
//             }));
//           }
//         } else {
//           setError(response.data?.message || 'Job details not found');
//           toast.error(response.data?.message || 'Job details not available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching job details:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load job details';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (jobId) {
//       fetchJobDetails();
//     }
//   }, [jobId]);

//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size should be less than 5MB");
//         return;
//       }
      
//       // Check file type
//       const allowedTypes = [
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'text/plain'
//       ];
      
//       if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
//         toast.error("Please upload only PDF, DOC, DOCX or TXT files");
//         return;
//       }
      
//       setFormData((prev) => ({ ...prev, resume: file }));
//       toast.success('Resume uploaded successfully');
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Check if job details are available
//     if (!jobDetails) {
//       toast.error("Job information is not available. Please try again.");
//       return;
//     }
    
//     // Validate form
//     if (
//       !formData.name.trim() ||
//       !formData.email.trim() ||
//       !formData.phone.trim() ||
//       !formData.coverLetter.trim() ||
//       !formData.resume
//     ) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(formData.email)) {
//       toast.error("Please enter a valid email address");
//       return;
//     }

//     // Phone validation (basic)
//     if (formData.phone.length < 10) {
//       toast.error("Please enter a valid phone number");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('job_id', jobId);
//       formDataToSend.append('name', formData.name.trim());
//       formDataToSend.append('email', formData.email.trim());
//       formDataToSend.append('phone', formData.phone.trim());
//       formDataToSend.append('subject', formData.subject.trim() || `Application for ${jobDetails.job_title}`);
//       formDataToSend.append('cover_letter', formData.coverLetter.trim());
//       if (formData.resume) {
//         formDataToSend.append('resume', formData.resume);
//       }

//       if (instituteId) {
//         formDataToSend.append('unique_code', instituteId);
//       }

//       // Add academic_id from job details
//       if (jobDetails.academic_id) {
//         formDataToSend.append('academic_id', jobDetails.academic_id.toString());
//       }

//       // API call to submit application
//       const response = await axios.post<{
//         status: boolean;
//         message: string;
//         data?: any;
//       }>(
//         `${apiUrl}/PublicCareer/submit-application`,
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data && response.data.status === true) {
//         toast.success(
//           response.data.message || `✅ Application submitted successfully!\n\nWe'll contact you at ${formData.email} soon.`
//         );

//         // Reset form
//         setFormData({
//           name: "",
//           email: "",
//           phone: "",
//           subject: "",
//           coverLetter: "",
//           resume: null,
//         });
//         if (fileInputRef.current) fileInputRef.current.value = "";

//         // Navigate back after delay
//         setTimeout(() => navigate(-1), 2000);
//       } else {
//         toast.error(response.data?.message || 'Failed to submit application');
//       }
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       toast.error(
//         error.response?.data?.message || 
//         error.response?.data?.error || 
//         "❌ There was an error submitting your application. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       const allowedTypes = [
//         'application/pdf',
//         'application/msword',
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'text/plain'
//       ];
      
//       if (allowedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
//         if (file.size > 5 * 1024 * 1024) {
//           toast.error("File size should be less than 5MB");
//           return;
//         }
//         setFormData((prev) => ({ ...prev, resume: file }));
//         toast.success('Resume uploaded successfully');
//       } else {
//         toast.error("Please upload only PDF, DOC, DOCX or TXT documents");
//       }
//     }
//   };

//   // Get institute data safely
//   const getInstituteLogo = () => {
//     if (!institute?.header?.academic_logo) return '';
//     return institute.header.academic_logo;
//   };

//   const getInstituteAddress = () => {
//     return institute?.footer?.academic_address || '';
//   };

//   const getInstituteWebsiteUrl = () => {
//     return institute?.website || 'https://example.com';
//   };

//   const getInstituteName = () => {
//     if (institute?.header?.academic_name) {
//       return institute.header.academic_name;
//     }
//     return jobDetails?.academic_name || '';
//   };

//   const getHRContactEmail = () => {
//     // First try institute HR email
//     if (institute?.hr_email) {
//       return institute.hr_email;
//     }
//     if (institute?.contact_email) {
//       return institute.contact_email;
//     }
//     if (institute?.footer?.academic_email) {
//       return institute.footer.academic_email;
//     }
    
//     // Fallback to company domain
//     const companyName = jobDetails?.company_name || '';
//     if (companyName) {
//       const domain = companyName.toLowerCase()
//         .replace(/[^\w\s]/g, '')
//         .replace(/\s+/g, '');
//       return `careers@${domain}.com`;
//     }
    
//     return 'careers@example.com';
//   };

//   // Render job requirements if available
//   const renderJobRequirements = () => {
//     if (!jobDetails?.requirements || jobDetails.requirements.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements:</h3>
//         <ul className="space-y-2">
//           {jobDetails.requirements.map((req, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-slate-700">{req}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job responsibilities if available
//   const renderJobResponsibilities = () => {
//     if (!jobDetails?.responsibilities || jobDetails.responsibilities.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Responsibilities:</h3>
//         <ul className="space-y-2">
//           {jobDetails.responsibilities.map((resp, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <span className="text-slate-700">{resp}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job metadata if available
//   const renderJobMetadata = () => {
//     const metadata = [];
    
//     if (jobDetails?.location) {
//       metadata.push({
//         label: "Location",
//         value: jobDetails.location,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.job_type) {
//       metadata.push({
//         label: "Job Type",
//         value: jobDetails.job_type,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.experience) {
//       metadata.push({
//         label: "Experience",
//         value: jobDetails.experience,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.salary) {
//       metadata.push({
//         label: "Salary",
//         value: jobDetails.salary,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.deadline) {
//       metadata.push({
//         label: "Deadline",
//         value: new Date(jobDetails.deadline).toLocaleDateString('en-IN'),
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//         )
//       });
//     }
    
//     if (metadata.length === 0) return null;
    
//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Job Details</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {metadata.map((item, index) => (
//             <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
//               <div className="text-slate-500">
//                 {item.icon}
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500">{item.label}</p>
//                 <p className="font-semibold text-slate-900">{item.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const isLoading = loading || instituteLoading;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !jobDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center p-8">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h3>
//           <p className="text-slate-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* Dynamic Header */}
//       <Header
//         logo={getInstituteLogo()}
//         address={getInstituteAddress()}
//         instituteName={getInstituteName()}
//         baseUrl={`/${instituteId || ''}`}
//         institute_id={instituteId}
//         primaryWebsiteUrl={getInstituteWebsiteUrl()}
//       />

//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Main container with 50-50 split */}
//           <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-slate-200">
//               {/* Left Column - Job Details (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
//                 <div className="sticky top-6">
//                   {/* Job Title & Company */}
//                   <div className="mb-8">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-4">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {jobDetails.status === 'active' ? 'Active Hiring' : 'Position Closed'}
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
//                       {jobDetails.job_title}
//                     </h1>
//                     <div className="flex items-center gap-3 text-lg text-slate-700">
//                       <span className="font-semibold">{jobDetails.company_name}</span>
//                       <span className="text-slate-400">•</span>
//                       <span className="flex items-center gap-1">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {jobDetails.location || 'Not specified'}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Job Description - Dynamic from API */}
//                   <div className="mb-8">
//                     <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
//                       Job Description
//                     </h2>
//                     {jobDetails.description ? (
//                       <div 
//                         className="prose prose-slate max-w-none"
//                         dangerouslySetInnerHTML={{ __html: jobDetails.description }}
//                       />
//                     ) : (
//                       <p className="text-slate-700 mb-6">
//                         We are looking for an experienced professional with strong expertise in development.
//                       </p>
//                     )}

//                     {/* Render Requirements if available */}
//                     {renderJobRequirements()}

//                     {/* Render Responsibilities if available */}
//                     {renderJobResponsibilities()}

//                     {/* Render Job Metadata */}
//                     {renderJobMetadata()}

//                     {/* Contact Information */}
//                     <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6 mt-8">
//                       <h4 className="font-bold text-slate-900 mb-2">
//                         📧 Need Help?
//                       </h4>
//                       <p className="text-sm text-slate-600 mb-3">
//                         Have questions about this role? Contact our HR team
//                       </p>
//                       <a
//                         href={`mailto:${getHRContactEmail()}`}
//                         className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                           />
//                         </svg>
//                         {getHRContactEmail()}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Application Form (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10">
//                 <div className="max-w-lg mx-auto">
//                   {/* Form Header */}
//                   <div className="text-center mb-8">
//                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
//                       Apply for this Job
//                     </h2>
//                     <p className="text-slate-600">
//                       Fill in your details to submit your application
//                     </p>
//                     <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
//                       <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
//                     </div>
//                   </div>

//                   {/* Form */}
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {/* Name & Email Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Name <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="text"
//                           name="name"
//                           required
//                           value={formData.name}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="Your full name"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Email <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="email"
//                           name="email"
//                           required
//                           value={formData.email}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="your.email@example.com"
//                         />
//                       </div>
//                     </div>

//                     {/* Phone & Subject Row */}
//                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Phone Number <span className="text-red-500">*</span>
//                         </label>
//                         <input
//                           type="tel"
//                           name="phone"
//                           required
//                           value={formData.phone}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder="+91 98765 43210"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-semibold text-slate-900 mb-2">
//                           Subject
//                         </label>
//                         <input
//                           type="text"
//                           name="subject"
//                           value={formData.subject}
//                           onChange={handleInputChange}
//                           className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                           placeholder={`Application for ${jobDetails.job_title}`}
//                         />
//                       </div>
//                     </div>

//                     {/* Resume Upload */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Upload Resume <span className="text-red-500">*</span>
//                       </label>
//                       <div
//                         className="relative"
//                         onDragOver={handleDragOver}
//                         onDrop={handleDrop}
//                       >
//                         <input
//                           ref={fileInputRef}
//                           type="file"
//                           name="resume"
//                           accept=".pdf,.doc,.docx,.txt"
//                           required
//                           onChange={handleFileChange}
//                           className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//                         />
//                         <div
//                           className={`flex items-center justify-between px-6 py-5 border-2 ${
//                             formData.resume
//                               ? "border-emerald-500 bg-emerald-50"
//                               : "border-dashed border-slate-300"
//                           } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//                         >
//                           <div className="flex items-center gap-4">
//                             <div
//                               className={`p-3 rounded-xl ${
//                                 formData.resume
//                                   ? "bg-emerald-100"
//                                   : "bg-slate-100"
//                               }`}
//                             >
//                               <svg
//                                 className={`w-5 h-5 ${
//                                   formData.resume
//                                     ? "text-emerald-600"
//                                     : "text-slate-500"
//                                 }`}
//                                 fill="none"
//                                 stroke="currentColor"
//                                 viewBox="0 0 24 24"
//                               >
//                                 <path
//                                   strokeLinecap="round"
//                                   strokeLinejoin="round"
//                                   strokeWidth={2}
//                                   d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                 />
//                               </svg>
//                             </div>
//                             <div>
//                               <p className="font-semibold text-slate-900 text-sm">
//                                 {formData.resume
//                                   ? formData.resume.name
//                                   : "Choose File"}
//                               </p>
//                               <p className="text-xs text-slate-500 mt-1">
//                                 {formData.resume
//                                   ? `Uploaded (${(
//                                       formData.resume.size /
//                                       1024 /
//                                       1024
//                                     ).toFixed(2)} MB)`
//                                   : "No file chosen"}
//                               </p>
//                             </div>
//                           </div>
//                           <button
//                             type="button"
//                             className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//                             onClick={() => fileInputRef.current?.click()}
//                           >
//                             Browse
//                           </button>
//                         </div>
//                       </div>
//                       <p className="text-xs text-slate-500 mt-2">
//                         PDF, DOC, DOCX, TXT (Max 5MB)
//                       </p>
//                     </div>

//                     {/* Cover Letter */}
//                     <div>
//                       <label className="block text-sm font-semibold text-slate-900 mb-2">
//                         Cover Letter <span className="text-red-500">*</span>
//                       </label>
//                       <textarea
//                         name="coverLetter"
//                         required
//                         value={formData.coverLetter}
//                         onChange={handleInputChange}
//                         rows={4}
//                         className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//                         placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//                       />
//                     </div>

//                     {/* Terms and Conditions */}
//                     <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         required
//                         className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//                       />
//                       <label htmlFor="terms" className="text-sm text-slate-700">
//                         I agree to the{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Terms of Service
//                         </a>{" "}
//                         and{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Privacy Policy
//                         </a>
//                         . I confirm that the information provided is accurate.
//                       </label>
//                     </div>

//                     {/* Submit button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting || jobDetails.status !== 'active'}
//                       className={`w-full bg-gradient-to-r ${
//                         jobDetails.status === 'active'
//                           ? 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
//                           : 'from-slate-400 to-slate-500 cursor-not-allowed'
//                       } text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border ${
//                         jobDetails.status === 'active' 
//                           ? 'border-emerald-500/30' 
//                           : 'border-slate-400/30'
//                       } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin w-5 h-5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : jobDetails.status === 'active' ? (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                           SUBMIT APPLICATION
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
                   
//                         </>
//                       )}
//                     </button>

//                     {/* Application tips */}
//                     <div className="text-center pt-4 border-t border-slate-200">
//                       <p className="text-xs text-slate-500">
//                         Your application will be reviewed within 48 hours. We'll
//                         contact you via email for next steps.
//                       </p>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Dynamic Footer */}
//       <Footer 
//         baseUrl={`/${instituteId || ''}`}
//         instituteName={getInstituteName()}
//         institute={institute}
//         footerData={institute?.footer}
//       />
//     </div>
//   );
// };

// export default ApplyJobPage;












// // src/pages/ApplyJobPage.tsx
// import { useState, useRef, useEffect } from "react";
// import { useSearchParams, useNavigate, useLocation, useParams } from "react-router";
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from "./Header";
// import Footer from "./Footer";

// const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
// const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// type FormField = {
//   type: string;
//   name: string;
//   label: string;
//   placeholder: string;
//   required: number;
//   validation: string | null;
//   value: string | null;
//   options?: string[]; // For select/dropdown fields
// };

// type FormSection = {
//   width?: string;
//   gap?: number;
//   justify?: string;
//   children: FormField[];
// };

// type JobDetails = {
//   job_id: number;
//   job_title: string;
//   company_name: string;
//   description: string;
//   requirements?: string[];
//   responsibilities?: string[];
//   academic_id: number;
//   academic_name: string;
//   location?: string;
//   job_type?: string;
//   experience?: string;
//   salary?: string;
//   deadline?: string;
//   apply_url?: string;
//   created_at?: string;
//   status?: string;
//   job_meta?: {
//     first?: number;
//     second?: number;
//     third?: number;
//   };
//   result?: FormSection[]; // Dynamic form sections from API
// };

// type InstituteData = {
//   status: boolean;
//   academic_id: number;
//   unique_code: string;
//   header: {
//     academic_name: string;
//     academic_logo: string;
//   };
//   banner?: {
//     title?: string;
//     long_description?: string;
//     banner_image?: string;
//   };
//   footer?: {
//     academic_name?: string;
//     academic_email?: string;
//     academic_address?: string;
//   };
//   website?: string;
//   contact_email?: string;
//   hr_email?: string;
// };

// export const ApplyJobPage: React.FC = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { instituteId, jobId } = useParams(); 
//   const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
//   const [institute, setInstitute] = useState<InstituteData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [instituteLoading, setInstituteLoading] = useState(false);
  
//   // Dynamic form data state
//   const [formData, setFormData] = useState<Record<string, any>>({});
//   const [formErrors, setFormErrors] = useState<Record<string, string>>({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

//   // Fetch institute data
//   useEffect(() => {
//     const fetchInstituteData = async () => {
//       if (!instituteId) {
//         console.log('No unique code found for institute');
//         return;
//       }

//       try {
//         setInstituteLoading(true);
//         const response = await axios.post<InstituteData>(
//           `${apiUrl}/PublicCareer/get-career-home`,
//           {
//             unique_code: instituteId
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('Institute Data API Response:', response.data);
//         if (response.data && response.data.status === true) {
//           setInstitute(response.data);
//         }
//       } catch (err: any) {
//         console.error('Error fetching institute data:', err);
//       } finally {
//         setInstituteLoading(false);
//       }
//     };

//     fetchInstituteData();
//   }, [location.pathname, location.search]);

//   // Fetch job details from API
//   useEffect(() => {
//     const fetchJobDetails = async () => {
//       try {
//         if (!jobId) {
//           setError('Job ID not found');
//           toast.error('Job ID not found');
//           setLoading(false);
//           return;
//         }

//         setLoading(true);
        
//         // API call to get job details
//         const response = await axios.post<{
//           status: boolean;
//           data: JobDetails;
//           message?: string;
//         }>(
//           `${apiUrl}/PublicCareer/get-job-details`,
//           {
//             job_id: parseInt(jobId)
//           },
//           {
//             headers: {
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         console.log('Job Details API Response:', response.data);

//         if (response.data && response.data.status === true) {
//           const jobData = response.data.data;
//           setJobDetails(jobData);
          
//           // Initialize form data based on dynamic fields
//           const initialFormData: Record<string, any> = {};
//           if (jobData.result) {
//             jobData.result.forEach((section: FormSection) => {
//               section.children.forEach((field: FormField) => {
//                 // Set default values based on field type
//                 switch(field.type) {
//                   case 'text':
//                   case 'email':
//                   case 'tel':
//                   case 'number':
//                   case 'textarea':
//                     initialFormData[field.name] = field.value || '';
//                     break;
//                   case 'select':
//                   case 'dropdown':
//                     initialFormData[field.name] = field.value || '';
//                     break;
//                   case 'checkbox':
//                   case 'radio':
//                     initialFormData[field.name] = field.value || false;
//                     break;
//                   case 'file':
//                   case 'file_button':
//                     initialFormData[field.name] = null;
//                     break;
//                   default:
//                     initialFormData[field.name] = field.value || '';
//                 }
//               });
//             });
//           }
          
//           // Add default fields if not present in dynamic form
//           if (!initialFormData.subject) {
//             initialFormData.subject = `Application for ${jobData.job_title}`;
//           }
//           if (!initialFormData.cover_letter) {
//             initialFormData.cover_letter = '';
//           }
          
//           setFormData(initialFormData);
//         } else {
//           setError(response.data?.message || 'Job details not found');
//           toast.error(response.data?.message || 'Job details not available');
//         }
//       } catch (err: any) {
//         console.error('Error fetching job details:', err);
//         const errorMessage = err.response?.data?.message || err.message || 'Failed to load job details';
//         setError(errorMessage);
//         toast.error(errorMessage);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (jobId) {
//       fetchJobDetails();
//     }
//   }, [jobId]);

//   // Handle dynamic form input changes
//   const handleInputChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value, type } = e.target;
    
//     if (type === 'checkbox') {
//       const checked = (e.target as HTMLInputElement).checked;
//       setFormData(prev => ({ ...prev, [name]: checked }));
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     // Clear error for this field
//     if (formErrors[name]) {
//       setFormErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // Handle file input changes
//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
//     if (e.target.files && e.target.files[0]) {
//       const file = e.target.files[0];
      
//       // Check file size (5MB limit)
//       if (file.size > 5 * 1024 * 1024) {
//         toast.error("File size should be less than 5MB");
//         return;
//       }
      
//       // Check file types based on field name
//       let allowedTypes: string[] = [];
//       if (fieldName === 'resume' || fieldName.includes('file')) {
//         allowedTypes = [
//           'application/pdf',
//           'application/msword',
//           'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//           'text/plain'
//         ];
//       } else {
//         // Default allowed types for other files
//         allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
//       }
      
//       if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt|jpg|jpeg|png)$/i)) {
//         toast.error(`Please upload only ${fieldName === 'resume' ? 'PDF, DOC, DOCX or TXT' : 'Image or PDF'} files`);
//         return;
//       }
      
//       setFormData(prev => ({ ...prev, [fieldName]: file }));
//       toast.success(`${fieldName.replace(/_/g, ' ')} uploaded successfully`);
//     }
//   };

//   // Handle drag and drop for files
//   const handleDragOver = (e: React.DragEvent, fieldName: string) => {
//     e.preventDefault();
//     e.stopPropagation();
//   };

//   const handleDrop = (e: React.DragEvent, fieldName: string) => {
//     e.preventDefault();
//     e.stopPropagation();

//     if (e.dataTransfer.files && e.dataTransfer.files[0]) {
//       const file = e.dataTransfer.files[0];
//       const allowedTypes = ['application/pdf', 'application/msword', 
//         'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//         'text/plain', 'image/jpeg', 'image/png', 'image/jpg'];
      
//       if (allowedTypes.includes(file.type) || file.name.match(/\.(pdf|doc|docx|txt|jpg|jpeg|png)$/i)) {
//         if (file.size > 5 * 1024 * 1024) {
//           toast.error("File size should be less than 5MB");
//           return;
//         }
//         setFormData(prev => ({ ...prev, [fieldName]: file }));
//         toast.success(`${fieldName.replace(/_/g, ' ')} uploaded successfully`);
//       } else {
//         toast.error("Please upload only supported file types");
//       }
//     }
//   };

//   // Validate form field based on validation rules
//   const validateField = (field: FormField, value: any): string => {
//     if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
//       return `${field.label} is required`;
//     }

//     if (value && typeof value === 'string' && field.validation) {
//       switch(field.validation) {
//         case 'email':
//           const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//           if (!emailRegex.test(value)) {
//             return 'Please enter a valid email address';
//           }
//           break;
//         case 'mobile':
//           const mobileRegex = /^[0-9]{10}$/;
//           if (!mobileRegex.test(value.replace(/\D/g, ''))) {
//             return 'Please enter a valid 10-digit mobile number';
//           }
//           break;
//         case 'number':
//           if (isNaN(Number(value))) {
//             return `${field.label} must be a number`;
//           }
//           break;
//         // Add more validation rules as needed
//       }
//     }

//     if (field.type === 'file_button' && field.required && !value) {
//       return `${field.label} is required`;
//     }

//     return '';
//   };

//   // Validate entire form
//   const validateForm = (): boolean => {
//     const errors: Record<string, string> = {};
//     let isValid = true;

//     if (jobDetails?.result) {
//       jobDetails.result.forEach((section: FormSection) => {
//         section.children.forEach((field: FormField) => {
//           const error = validateField(field, formData[field.name]);
//           if (error) {
//             errors[field.name] = error;
//             isValid = false;
//           }
//         });
//       });
//     }

//     // Validate cover letter if it exists in form
//     if (formData.cover_letter && !formData.cover_letter.trim()) {
//       errors.cover_letter = 'Cover letter is required';
//       isValid = false;
//     }

//     setFormErrors(errors);
//     return isValid;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     // Check if job details are available
//     if (!jobDetails) {
//       toast.error("Job information is not available. Please try again.");
//       return;
//     }
    
//     // Validate form
//     if (!validateForm()) {
//       toast.error("Please fix the errors in the form");
//       return;
//     }

//     setIsSubmitting(true);

//     try {
//       const formDataToSend = new FormData();
      
//       // Add job_id and basic info
//       formDataToSend.append('job_id', jobId || '');
//       if (instituteId) {
//         formDataToSend.append('unique_code', instituteId);
//       }
//       if (jobDetails.academic_id) {
//         formDataToSend.append('academic_id', jobDetails.academic_id.toString());
//       }

//       // Add all form data
//       Object.keys(formData).forEach(key => {
//         const value = formData[key];
//         if (value instanceof File) {
//           formDataToSend.append(key, value);
//         } else if (value !== null && value !== undefined) {
//           formDataToSend.append(key, value.toString());
//         }
//       });

//       // Add job title as subject if not already provided
//       if (!formData.subject && jobDetails.job_title) {
//         formDataToSend.append('subject', `Application for ${jobDetails.job_title}`);
//       }

//       // API call to submit application
//       const response = await axios.post<{
//         status: boolean;
//         message: string;
//         data?: any;
//       }>(
//         `${apiUrl}/PublicCareer/submit-application`,
//         formDataToSend,
//         {
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           },
//         }
//       );

//       if (response.data && response.data.status === true) {
//         toast.success(
//           response.data.message || `✅ Application submitted successfully!\n\nWe'll contact you soon.`
//         );

//         // Reset form based on dynamic fields
//         const resetFormData: Record<string, any> = {};
//         if (jobDetails.result) {
//           jobDetails.result.forEach((section: FormSection) => {
//             section.children.forEach((field: FormField) => {
//               switch(field.type) {
//                 case 'file':
//                 case 'file_button':
//                   resetFormData[field.name] = null;
//                   if (fileInputRefs.current[field.name]) {
//                     fileInputRefs.current[field.name]!.value = '';
//                   }
//                   break;
//                 default:
//                   resetFormData[field.name] = field.value || '';
//               }
//             });
//           });
//         }
//         setFormData(resetFormData);
//         setFormErrors({});

//         // Navigate back after delay
//         setTimeout(() => navigate(-1), 2000);
//       } else {
//         toast.error(response.data?.message || 'Failed to submit application');
//       }
//     } catch (error: any) {
//       console.error('Submission error:', error);
//       toast.error(
//         error.response?.data?.message || 
//         error.response?.data?.error || 
//         "❌ There was an error submitting your application. Please try again."
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Render dynamic form fields
//   const renderFormField = (field: FormField) => {
//     const error = formErrors[field.name];
    
//     switch(field.type) {
//       case 'text':
//       case 'email':
//       case 'tel':
//       case 'number':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <input
//               type={field.type === 'tel' ? 'tel' : field.type}
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'textarea':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <textarea
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               rows={4}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'select':
//       case 'dropdown':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <select
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 bg-white`}
//             >
//               <option value="">Select {field.label}</option>
//               {field.options?.map((option, index) => (
//                 <option key={index} value={option}>
//                   {option}
//                 </option>
//               ))}
//             </select>
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'file':
//       case 'file_button':
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <div
//               className="relative"
//               onDragOver={(e) => handleDragOver(e, field.name)}
//               onDrop={(e) => handleDrop(e, field.name)}
//             >
//               <input
//                 ref={el => fileInputRefs.current[field.name] = el}
//                 type="file"
//                 name={field.name}
//                 accept={field.name === 'resume' ? ".pdf,.doc,.docx,.txt" : ".pdf,.jpg,.jpeg,.png"}
//                 required={field.required === 1}
//                 onChange={(e) => handleFileChange(e, field.name)}
//                 className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
//               />
//               <div
//                 className={`flex items-center justify-between px-6 py-5 border-2 ${
//                   formData[field.name]
//                     ? "border-emerald-500 bg-emerald-50"
//                     : error 
//                     ? "border-red-300 bg-red-50" 
//                     : "border-dashed border-slate-300"
//                 } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
//               >
//                 <div className="flex items-center gap-4">
//                   <div
//                     className={`p-3 rounded-xl ${
//                       formData[field.name]
//                         ? "bg-emerald-100"
//                         : error
//                         ? "bg-red-100"
//                         : "bg-slate-100"
//                     }`}
//                   >
//                     <svg
//                       className={`w-5 h-5 ${
//                         formData[field.name]
//                           ? "text-emerald-600"
//                           : error
//                           ? "text-red-600"
//                           : "text-slate-500"
//                       }`}
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                       />
//                     </svg>
//                   </div>
//                   <div>
//                     <p className="font-semibold text-slate-900 text-sm">
//                       {formData[field.name] instanceof File 
//                         ? formData[field.name].name
//                         : field.placeholder || "Choose File"}
//                     </p>
//                     <p className="text-xs text-slate-500 mt-1">
//                       {formData[field.name] instanceof File 
//                         ? `Uploaded (${(formData[field.name].size / 1024 / 1024).toFixed(2)} MB)`
//                         : "No file chosen"}
//                     </p>
//                   </div>
//                 </div>
//                 <button
//                   type="button"
//                   className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
//                   onClick={() => fileInputRefs.current[field.name]?.click()}
//                 >
//                   Browse
//                 </button>
//               </div>
//             </div>
//             <p className="text-xs text-slate-500 mt-2">
//               {field.name === 'resume' 
//                 ? "PDF, DOC, DOCX, TXT (Max 5MB)"
//                 : "PDF, JPG, JPEG, PNG (Max 5MB)"}
//             </p>
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       case 'checkbox':
//         return (
//           <div key={field.name} className="flex items-start gap-3">
//             <input
//               type="checkbox"
//               name={field.name}
//               id={field.name}
//               checked={!!formData[field.name]}
//               onChange={handleInputChange}
//               className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//             />
//             <label htmlFor={field.name} className="text-sm text-slate-700">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );

//       default:
//         return (
//           <div key={field.name}>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
//             </label>
//             <input
//               type="text"
//               name={field.name}
//               required={field.required === 1}
//               value={formData[field.name] || ''}
//               onChange={handleInputChange}
//               className={`w-full px-4 py-3.5 border ${
//                 error ? 'border-red-300' : 'border-slate-300'
//               } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
//               placeholder={field.placeholder}
//             />
//             {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
//           </div>
//         );
//     }
//   };

//   // Render dynamic form sections
//   const renderDynamicForm = () => {
//     if (!jobDetails?.result || jobDetails.result.length === 0) {
//       // Fallback to default form if no dynamic fields
//       return (
//         <div className="space-y-6">
//           {/* Default form fields */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">
//                 Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 required
//                 value={formData.name || ''}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                 placeholder="Your full name"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-semibold text-slate-900 mb-2">
//                 Email <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 required
//                 value={formData.email || ''}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
//                 placeholder="your.email@example.com"
//               />
//             </div>
//           </div>

//           <div>
//             <label className="block text-sm font-semibold text-slate-900 mb-2">
//               Cover Letter <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               name="cover_letter"
//               required
//               value={formData.cover_letter || ''}
//               onChange={handleInputChange}
//               rows={4}
//               className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//               placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//             />
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="space-y-8">
//         {jobDetails.result.map((section: FormSection, sectionIndex: number) => (
//           <div 
//             key={sectionIndex}
//             className={`grid grid-cols-1 ${
//               section.width === '100%' ? 'lg:grid-cols-1' : 
//               'lg:grid-cols-2'
//             } gap-${section.gap || 4}`}
//             style={{
//               justifyContent: section.justify || 'start'
//             }}
//           >
//             {section.children.map((field: FormField) => (
//               <div 
//                 key={field.name}
//                 className={section.width === '100%' ? 'col-span-full' : ''}
//               >
//                 {renderFormField(field)}
//               </div>
//             ))}
//           </div>
//         ))}
        
//         {/* Always include cover letter field */}
//         <div>
//           <label className="block text-sm font-semibold text-slate-900 mb-2">
//             Cover Letter <span className="text-red-500">*</span>
//           </label>
//           <textarea
//             name="cover_letter"
//             required
//             value={formData.cover_letter || ''}
//             onChange={handleInputChange}
//             rows={4}
//             className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
//             placeholder="Tell us about your experience, skills, and why you're interested in this role..."
//           />
//           {formErrors.cover_letter && (
//             <p className="mt-1 text-sm text-red-600">{formErrors.cover_letter}</p>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Get institute data safely
//   const getInstituteLogo = () => {
//     if (!institute?.header?.academic_logo) return '';
//     return institute.header.academic_logo;
//   };

//   const getInstituteAddress = () => {
//     return institute?.footer?.academic_address || '';
//   };

//   const getInstituteWebsiteUrl = () => {
//     return institute?.website || 'https://example.com';
//   };

//   const getInstituteName = () => {
//     if (institute?.header?.academic_name) {
//       return institute.header.academic_name;
//     }
//     return jobDetails?.academic_name || '';
//   };

//   const getHRContactEmail = () => {
//     if (institute?.hr_email) {
//       return institute.hr_email;
//     }
//     if (institute?.contact_email) {
//       return institute.contact_email;
//     }
//     if (institute?.footer?.academic_email) {
//       return institute.footer.academic_email;
//     }
    
//     const companyName = jobDetails?.company_name || '';
//     if (companyName) {
//       const domain = companyName.toLowerCase()
//         .replace(/[^\w\s]/g, '')
//         .replace(/\s+/g, '');
//       return `careers@${domain}.com`;
//     }
    
//     return 'careers@example.com';
//   };

//   // Render job requirements if available
//   const renderJobRequirements = () => {
//     if (!jobDetails?.requirements || jobDetails.requirements.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements:</h3>
//         <ul className="space-y-2">
//           {jobDetails.requirements.map((req, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//               <span className="text-slate-700">{req}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job responsibilities if available
//   const renderJobResponsibilities = () => {
//     if (!jobDetails?.responsibilities || jobDetails.responsibilities.length === 0) {
//       return null;
//     }

//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Responsibilities:</h3>
//         <ul className="space-y-2">
//           {jobDetails.responsibilities.map((resp, index) => (
//             <li key={index} className="flex items-start gap-2">
//               <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
//               </svg>
//               <span className="text-slate-700">{resp}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     );
//   };

//   // Render job metadata if available
//   const renderJobMetadata = () => {
//     const metadata = [];
    
//     if (jobDetails?.location) {
//       metadata.push({
//         label: "Location",
//         value: jobDetails.location,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.job_type) {
//       metadata.push({
//         label: "Job Type",
//         value: jobDetails.job_type,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.experience) {
//       metadata.push({
//         label: "Experience",
//         value: jobDetails.experience,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.salary) {
//       metadata.push({
//         label: "Salary",
//         value: jobDetails.salary,
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//           </svg>
//         )
//       });
//     }
    
//     if (jobDetails?.deadline) {
//       metadata.push({
//         label: "Deadline",
//         value: new Date(jobDetails.deadline).toLocaleDateString('en-IN'),
//         icon: (
//           <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
//           </svg>
//         )
//       });
//     }
    
//     if (metadata.length === 0) return null;
    
//     return (
//       <div className="mt-6">
//         <h3 className="text-lg font-bold text-slate-900 mb-3">Job Details</h3>
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {metadata.map((item, index) => (
//             <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
//               <div className="text-slate-500">
//                 {item.icon}
//               </div>
//               <div>
//                 <p className="text-xs text-slate-500">{item.label}</p>
//                 <p className="font-semibold text-slate-900">{item.value}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const isLoading = loading || instituteLoading;

//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
//           <p className="mt-4 text-slate-600">Loading job details...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error || !jobDetails) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <div className="text-center p-8">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
//             <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h3>
//           <p className="text-slate-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
//           <button
//             onClick={() => navigate(-1)}
//             className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
//           >
//             Go Back
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex flex-col bg-slate-50">
//       {/* Dynamic Header */}
//       <Header
//         logo={getInstituteLogo()}
//         address={getInstituteAddress()}
//         instituteName={getInstituteName()}
//         baseUrl={`/${instituteId || ''}`}
//         institute_id={instituteId}
//         primaryWebsiteUrl={getInstituteWebsiteUrl()}
//       />

//       {/* Main Content */}
//       <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
//         <div className="max-w-7xl mx-auto">
//           {/* Main container with 50-50 split */}
//           <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
//             <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-slate-200">
//               {/* Left Column - Job Details (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
//                 <div className="sticky top-6">
//                   {/* Job Title & Company */}
//                   <div className="mb-8">
//                     <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-4">
//                       <svg
//                         className="w-4 h-4"
//                         fill="none"
//                         stroke="currentColor"
//                         viewBox="0 0 24 24"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth={2}
//                           d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                         />
//                       </svg>
//                       {jobDetails.status === 'active' ? 'Active Hiring' : 'Position Closed'}
//                     </div>
//                     <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
//                       {jobDetails.job_title}
//                     </h1>
//                     <div className="flex items-center gap-3 text-lg text-slate-700">
//                       <span className="font-semibold">{jobDetails.company_name}</span>
//                       <span className="text-slate-400">•</span>
//                       <span className="flex items-center gap-1">
//                         <svg
//                           className="w-5 h-5"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
//                           />
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
//                           />
//                         </svg>
//                         {jobDetails.location || 'Not specified'}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Job Description - Dynamic from API */}
//                   <div className="mb-8">
//                     <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
//                       Job Description
//                     </h2>
//                     {jobDetails.description ? (
//                       <div 
//                         className="prose prose-slate max-w-none"
//                         dangerouslySetInnerHTML={{ __html: jobDetails.description }}
//                       />
//                     ) : (
//                       <p className="text-slate-700 mb-6">
//                         We are looking for an experienced professional with strong expertise in development.
//                       </p>
//                     )}

//                     {/* Render Requirements if available */}
//                     {renderJobRequirements()}

//                     {/* Render Responsibilities if available */}
//                     {renderJobResponsibilities()}

//                     {/* Render Job Metadata */}
//                     {renderJobMetadata()}

//                     {/* Contact Information */}
//                     <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6 mt-8">
//                       <h4 className="font-bold text-slate-900 mb-2">
//                         📧 Need Help?
//                       </h4>
//                       <p className="text-sm text-slate-600 mb-3">
//                         Have questions about this role? Contact our HR team
//                       </p>
//                       <a
//                         href={`mailto:${getHRContactEmail()}`}
//                         className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
//                       >
//                         <svg
//                           className="w-4 h-4"
//                           fill="none"
//                           stroke="currentColor"
//                           viewBox="0 0 24 24"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//                           />
//                         </svg>
//                         {getHRContactEmail()}
//                       </a>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Right Column - Application Form (50%) */}
//               <div className="p-6 sm:p-8 lg:p-10">
//                 <div className="max-w-lg mx-auto">
//                   {/* Form Header */}
//                   <div className="text-center mb-8">
//                     <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
//                       Apply for this Job
//                     </h2>
//                     <p className="text-slate-600">
//                       Fill in your details to submit your application
//                     </p>
//                     <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
//                       <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
//                     </div>
//                   </div>

//                   {/* Dynamic Form */}
//                   <form onSubmit={handleSubmit} className="space-y-6">
//                     {renderDynamicForm()}

//                     {/* Terms and Conditions */}
//                     <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
//                       <input
//                         type="checkbox"
//                         id="terms"
//                         required
//                         className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
//                       />
//                       <label htmlFor="terms" className="text-sm text-slate-700">
//                         I agree to the{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Terms of Service
//                         </a>{" "}
//                         and{" "}
//                         <a
//                           href="#"
//                           className="text-emerald-600 font-semibold hover:text-emerald-700"
//                         >
//                           Privacy Policy
//                         </a>
//                         . I confirm that the information provided is accurate.
//                       </label>
//                     </div>

//                     {/* Submit button */}
//                     <button
//                       type="submit"
//                       disabled={isSubmitting || jobDetails.status !== 'active'}
//                       className={`w-full bg-gradient-to-r ${
//                         jobDetails.status === 'active'
//                           ? 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
//                           : 'from-slate-400 to-slate-500 cursor-not-allowed'
//                       } text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border ${
//                         jobDetails.status === 'active' 
//                           ? 'border-emerald-500/30' 
//                           : 'border-slate-400/30'
//                       } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
//                     >
//                       {isSubmitting ? (
//                         <>
//                           <svg
//                             className="animate-spin w-5 h-5 text-white"
//                             fill="none"
//                             viewBox="0 0 24 24"
//                           >
//                             <circle
//                               className="opacity-25"
//                               cx="12"
//                               cy="12"
//                               r="10"
//                               stroke="currentColor"
//                               strokeWidth="4"
//                             ></circle>
//                             <path
//                               className="opacity-75"
//                               fill="currentColor"
//                               d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                             ></path>
//                           </svg>
//                           Submitting...
//                         </>
//                       ) : jobDetails.status === 'active' ? (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                           SUBMIT APPLICATION
//                         </>
//                       ) : (
//                         <>
//                           <svg
//                             className="w-6 h-6"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M6 18L18 6M6 6l12 12"
//                             />
//                           </svg>
//                           POSITION CLOSED
//                         </>
//                       )}
//                     </button>

//                     {/* Application tips */}
//                     <div className="text-center pt-4 border-t border-slate-200">
//                       <p className="text-xs text-slate-500">
//                         Your application will be reviewed within 48 hours. We'll
//                         contact you via email for next steps.
//                       </p>
//                     </div>
//                   </form>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       {/* Dynamic Footer */}
//       <Footer 
//         baseUrl={`/${instituteId || ''}`}
//         instituteName={getInstituteName()}
//         institute={institute}
//         footerData={institute?.footer}
//       />
//     </div>
//   );
// };

// export default ApplyJobPage;










// src/pages/ApplyJobPage.tsx
import { useState, useRef, useEffect } from "react";
import { useSearchParams, useNavigate, useLocation, useParams } from "react-router";
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from "./Header";
import Footer from "./Footer";

const apiUrl = import.meta.env.VITE_API_URL || 'https://admissionportalbackend.testingscrew.com/public/api';
const assetUrl = import.meta.env.VITE_ASSET_URL || 'https://admissionportalbackend.testingscrew.com/public';

// Configuration for file uploads
const FILE_UPLOAD_CONFIG = {
  maxSize: 5, // MB - configurable
  allowedTypes: ["pdf", "doc", "docx"], // configurable
  maxSizeInBytes: 5 * 1024 * 1024, // 5MB in bytes
  allowedMimeTypes: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]
};

type FormField = {
  type: string;
  name: string;
  label: string;
  placeholder: string;
  required: number;
  validation: string | null;
  value: string | null;
  options?: string[];
  fileConfig?: { // Optional file configuration per field
    maxSize?: number;
    allowedTypes?: string[];
  };
};

type FormSection = {
  width?: string;
  gap?: number;
  justify?: string;
  children: FormField[];
};

type JobDetails = {
  job_id: number;
  job_title: string;
  company_name: string;
  description: string;
  requirements?: string[];
  responsibilities?: string[];
  academic_id: number;
  academic_name: string;
  location?: string;
  job_type?: string;
  experience?: string;
  salary?: string;
  deadline?: string;
  apply_url?: string;
  created_at?: string;
  status?: string;
  job_meta?: {
    first?: number;
    second?: number;
    third?: number;
  };
  result?: FormSection[];
};

type InstituteData = {
  status: boolean;
  academic_id: number;
  unique_code: string;
  header: {
    academic_name: string;
    academic_logo: string;
  };
  banner?: {
    title?: string;
    long_description?: string;
    banner_image?: string;
  };
  footer?: {
    academic_name?: string;
    academic_email?: string;
    academic_address?: string;
  };
  website?: string;
  contact_email?: string;
  hr_email?: string;
};

export const ApplyJobPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { instituteId, jobId } = useParams(); 
  const [jobDetails, setJobDetails] = useState<JobDetails | null>(null);
  const [institute, setInstitute] = useState<InstituteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [instituteLoading, setInstituteLoading] = useState(false);
  
  // Dynamic form data state
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Configuration state (could be fetched from API)
  const [uploadConfig, setUploadConfig] = useState(FILE_UPLOAD_CONFIG);

  // Function to validate file based on field
  const validateFile = (file: File, fieldName: string, fieldConfig?: FormField['fileConfig']) => {
    // Use field-specific config if available, otherwise use global config
    const maxSize = fieldConfig?.maxSize || uploadConfig.maxSize;
    const allowedTypes = fieldConfig?.allowedTypes || uploadConfig.allowedTypes;
    const maxSizeInBytes = maxSize * 1024 * 1024;
    
    // Check file size
    if (file.size > maxSizeInBytes) {
      return {
        isValid: false,
        message: `File size should be less than ${maxSize}MB`
      };
    }
    
    // Check file type
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    const fileType = file.type.toLowerCase();
    
    // Check against allowed types
    const isTypeValid = allowedTypes.some(type => 
      fileExtension === type.toLowerCase() || 
      fileType.includes(type.toLowerCase())
    );
    
    // Also check MIME types
    const isMimeTypeValid = FILE_UPLOAD_CONFIG.allowedMimeTypes.some(mimeType =>
      fileType.includes(mimeType.split('/')[1]?.toLowerCase() || '') ||
      fileType === mimeType
    );
    
    if (!isTypeValid && !isMimeTypeValid) {
      const allowedTypesStr = allowedTypes.map(t => t.toUpperCase()).join(', ');
      return {
        isValid: false,
        message: `Please upload only ${allowedTypesStr} files`
      };
    }
    
    return {
      isValid: true,
      message: ''
    };
  };

  // Fetch institute data
  useEffect(() => {
    const fetchInstituteData = async () => {
      if (!instituteId) {
        console.log('No unique code found for institute');
        return;
      }

      try {
        setInstituteLoading(true);
        const response = await axios.post<InstituteData>(
          `${apiUrl}/PublicCareer/get-career-home`,
          {
            unique_code: instituteId
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Institute Data API Response:', response.data);
        if (response.data && response.data.status === true) {
          setInstitute(response.data);
          
          // You could also fetch upload config from institute data if available
          // if (response.data.upload_config) {
          //   setUploadConfig({
          //     maxSize: response.data.upload_config.maxSize || 5,
          //     allowedTypes: response.data.upload_config.allowedTypes || ["pdf", "doc", "docx"],
          //     maxSizeInBytes: (response.data.upload_config.maxSize || 5) * 1024 * 1024,
          //     allowedMimeTypes: FILE_UPLOAD_CONFIG.allowedMimeTypes
          //   });
          // }
        }
      } catch (err: any) {
        console.error('Error fetching institute data:', err);
      } finally {
        setInstituteLoading(false);
      }
    };

    fetchInstituteData();
  }, [location.pathname, location.search]);

  // Fetch job details from API
  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        if (!jobId) {
          setError('Job ID not found');
          toast.error('Job ID not found');
          setLoading(false);
          return;
        }

        setLoading(true);
        
        // API call to get job details
        const response = await axios.post<{
          status: boolean;
          data: JobDetails;
          message?: string;
        }>(
          `${apiUrl}/PublicCareer/get-job-details`,
          {
            job_id: parseInt(jobId)
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        console.log('Job Details API Response:', response.data);

        if (response.data && response.data.status === true) {
          const jobData = response.data.data;
          setJobDetails(jobData);
          
          // Initialize form data based on dynamic fields
          const initialFormData: Record<string, any> = {};
          if (jobData.result) {
            jobData.result.forEach((section: FormSection) => {
              section.children.forEach((field: FormField) => {
                // Set default values based on field type
                switch(field.type) {
                  case 'text':
                  case 'email':
                  case 'tel':
                  case 'number':
                  case 'textarea':
                    initialFormData[field.name] = field.value || '';
                    break;
                  case 'select':
                  case 'dropdown':
                    initialFormData[field.name] = field.value || '';
                    break;
                  case 'checkbox':
                  case 'radio':
                    initialFormData[field.name] = field.value || false;
                    break;
                  case 'file':
                  case 'file_button':
                    initialFormData[field.name] = null;
                    break;
                  default:
                    initialFormData[field.name] = field.value || '';
                }
              });
            });
          }
          
          // Add default fields if not present in dynamic form
          if (!initialFormData.subject) {
            initialFormData.subject = `Application for ${jobData.job_title}`;
          }
          if (!initialFormData.cover_letter) {
            initialFormData.cover_letter = '';
          }
          
          setFormData(initialFormData);
        } else {
          setError(response.data?.message || 'Job details not found');
          toast.error(response.data?.message || 'Job details not available');
        }
      } catch (err: any) {
        console.error('Error fetching job details:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load job details';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  // Handle dynamic form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle file input changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string, fieldConfig?: FormField['fileConfig']) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file
      const validation = validateFile(file, fieldName, fieldConfig);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      toast.success(`${fieldName.replace(/_/g, ' ')} uploaded successfully`);
    }
  };

  // Handle drag and drop for files
  const handleDragOver = (e: React.DragEvent, fieldName: string) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, fieldName: string, fieldConfig?: FormField['fileConfig']) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file
      const validation = validateFile(file, fieldName, fieldConfig);
      if (!validation.isValid) {
        toast.error(validation.message);
        return;
      }
      
      setFormData(prev => ({ ...prev, [fieldName]: file }));
      toast.success(`${fieldName.replace(/_/g, ' ')} uploaded successfully`);
    }
  };

  // Validate form field based on validation rules
  const validateField = (field: FormField, value: any): string => {
    if (field.required && (!value || (typeof value === 'string' && !value.trim()))) {
      return `${field.label} is required`;
    }

    if (value && typeof value === 'string' && field.validation) {
      switch(field.validation) {
        case 'email':
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return 'Please enter a valid email address';
          }
          break;
        case 'mobile':
          const mobileRegex = /^[0-9]{10}$/;
          if (!mobileRegex.test(value.replace(/\D/g, ''))) {
            return 'Please enter a valid 10-digit mobile number';
          }
          break;
        case 'number':
          if (isNaN(Number(value))) {
            return `${field.label} must be a number`;
          }
          break;
      }
    }

    if ((field.type === 'file' || field.type === 'file_button') && field.required && !value) {
      return `${field.label} is required`;
    }

    return '';
  };

  // Validate entire form
  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    if (jobDetails?.result) {
      jobDetails.result.forEach((section: FormSection) => {
        section.children.forEach((field: FormField) => {
          const error = validateField(field, formData[field.name]);
          if (error) {
            errors[field.name] = error;
            isValid = false;
          }
        });
      });
    }

    // Validate cover letter if it exists in form
    if (formData.cover_letter && !formData.cover_letter.trim()) {
      errors.cover_letter = 'Cover letter is required';
      isValid = false;
    }

    setFormErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if job details are available
    if (!jobDetails) {
      toast.error("Job information is not available. Please try again.");
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      
      // Add job_id and basic info
      formDataToSend.append('job_id', jobId || '');
      if (instituteId) {
        formDataToSend.append('unique_code', instituteId);
      }
      if (jobDetails.academic_id) {
        formDataToSend.append('academic_id', jobDetails.academic_id.toString());
      }

      // Add all form data
      Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (value instanceof File) {
          formDataToSend.append(key, value);
        } else if (value !== null && value !== undefined) {
          formDataToSend.append(key, value.toString());
        }
      });

      // Add job title as subject if not already provided
      if (!formData.subject && jobDetails.job_title) {
        formDataToSend.append('subject', `Application for ${jobDetails.job_title}`);
      }

      // API call to submit application
      const response = await axios.post<{
        status: boolean;
        message: string;
        data?: any;
      }>(
        `${apiUrl}/PublicCareer/submit-application`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data && response.data.status === true) {
        toast.success(
          response.data.message || `✅ Application submitted successfully!\n\nWe'll contact you soon.`
        );

        // Reset form based on dynamic fields
        const resetFormData: Record<string, any> = {};
        if (jobDetails.result) {
          jobDetails.result.forEach((section: FormSection) => {
            section.children.forEach((field: FormField) => {
              switch(field.type) {
                case 'file':
                case 'file_button':
                  resetFormData[field.name] = null;
                  if (fileInputRefs.current[field.name]) {
                    fileInputRefs.current[field.name]!.value = '';
                  }
                  break;
                default:
                  resetFormData[field.name] = field.value || '';
              }
            });
          });
        }
        setFormData(resetFormData);
        setFormErrors({});

        // Navigate back after delay
        setTimeout(() => navigate(-1), 2000);
      } else {
        toast.error(response.data?.message || 'Failed to submit application');
      }
    } catch (error: any) {
      console.error('Submission error:', error);
      toast.error(
        error.response?.data?.message || 
        error.response?.data?.error || 
        "❌ There was an error submitting your application. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render dynamic form fields
  const renderFormField = (field: FormField) => {
    const error = formErrors[field.name];
    
    switch(field.type) {
      case 'text':
      case 'email':
      case 'tel':
      case 'number':
        return (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            <input
              type={field.type === 'tel' ? 'tel' : field.type}
              name={field.name}
              required={field.required === 1}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border ${
                error ? 'border-red-300' : 'border-slate-300'
              } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
              placeholder={field.placeholder}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            <textarea
              name={field.name}
              required={field.required === 1}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              rows={4}
              className={`w-full px-4 py-3.5 border ${
                error ? 'border-red-300' : 'border-slate-300'
              } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none`}
              placeholder={field.placeholder}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'select':
      case 'dropdown':
        return (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            <select
              name={field.name}
              required={field.required === 1}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border ${
                error ? 'border-red-300' : 'border-slate-300'
              } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 bg-white`}
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'file':
      case 'file_button':
        // Use field-specific config or global config
        const fieldMaxSize = field.fileConfig?.maxSize || uploadConfig.maxSize;
        const fieldAllowedTypes = field.fileConfig?.allowedTypes || uploadConfig.allowedTypes;
        const allowedTypesStr = fieldAllowedTypes.map(t => t.toUpperCase()).join(', ');
        
        return (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            <div
              className="relative"
              onDragOver={(e) => handleDragOver(e, field.name)}
              onDrop={(e) => handleDrop(e, field.name, field.fileConfig)}
            >
              <input
                ref={el => fileInputRefs.current[field.name] = el}
                type="file"
                name={field.name}
                accept={fieldAllowedTypes.map(t => `.${t.toLowerCase()}`).join(',')}
                required={field.required === 1}
                onChange={(e) => handleFileChange(e, field.name, field.fileConfig)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`flex items-center justify-between px-6 py-5 border-2 ${
                  formData[field.name]
                    ? "border-emerald-500 bg-emerald-50"
                    : error 
                    ? "border-red-300 bg-red-50" 
                    : "border-dashed border-slate-300"
                } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      formData[field.name]
                        ? "bg-emerald-100"
                        : error
                        ? "bg-red-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        formData[field.name]
                          ? "text-emerald-600"
                          : error
                          ? "text-red-600"
                          : "text-slate-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formData[field.name] instanceof File 
                        ? formData[field.name].name
                        : field.placeholder || "Choose File"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData[field.name] instanceof File 
                        ? `Uploaded (${(formData[field.name].size / 1024 / 1024).toFixed(2)} MB)`
                        : "No file chosen"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  onClick={() => fileInputRefs.current[field.name]?.click()}
                >
                  Browse
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {allowedTypesStr} (Max {fieldMaxSize}MB)
            </p>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.name} className="flex items-start gap-3">
            <input
              type="checkbox"
              name={field.name}
              id={field.name}
              checked={!!formData[field.name]}
              onChange={handleInputChange}
              className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
            />
            <label htmlFor={field.name} className="text-sm text-slate-700">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );

      default:
        return (
          <div key={field.name}>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              {field.label} {field.required ? <span className="text-red-500">*</span> : ''}
            </label>
            <input
              type="text"
              name={field.name}
              required={field.required === 1}
              value={formData[field.name] || ''}
              onChange={handleInputChange}
              className={`w-full px-4 py-3.5 border ${
                error ? 'border-red-300' : 'border-slate-300'
              } rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400`}
              placeholder={field.placeholder}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
          </div>
        );
    }
  };

  // Render dynamic form sections
  const renderDynamicForm = () => {
    if (!jobDetails?.result || jobDetails.result.length === 0) {
      // Fallback to default form if no dynamic fields
      return (
        <div className="space-y-6">
          {/* Default form fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
                placeholder="Your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400"
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          {/* Resume Upload with configurable settings */}
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Upload Resume <span className="text-red-500">*</span>
            </label>
            <div
              className="relative"
              onDragOver={(e) => handleDragOver(e, 'resume')}
              onDrop={(e) => handleDrop(e, 'resume')}
            >
              <input
                ref={el => fileInputRefs.current['resume'] = el}
                type="file"
                name="resume"
                accept={uploadConfig.allowedTypes.map(t => `.${t.toLowerCase()}`).join(',')}
                required
                onChange={(e) => handleFileChange(e, 'resume')}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div
                className={`flex items-center justify-between px-6 py-5 border-2 ${
                  formData['resume']
                    ? "border-emerald-500 bg-emerald-50"
                    : formErrors['resume']
                    ? "border-red-300 bg-red-50" 
                    : "border-dashed border-slate-300"
                } rounded-2xl hover:border-emerald-400 transition-all cursor-pointer bg-slate-50 hover:bg-emerald-50`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-xl ${
                      formData['resume']
                        ? "bg-emerald-100"
                        : formErrors['resume']
                        ? "bg-red-100"
                        : "bg-slate-100"
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 ${
                        formData['resume']
                          ? "text-emerald-600"
                          : formErrors['resume']
                          ? "text-red-600"
                          : "text-slate-500"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm">
                      {formData['resume'] instanceof File 
                        ? formData['resume'].name
                        : "Choose Resume"}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {formData['resume'] instanceof File 
                        ? `Uploaded (${(formData['resume'].size / 1024 / 1024).toFixed(2)} MB)`
                        : "No file chosen"}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                  onClick={() => fileInputRefs.current['resume']?.click()}
                >
                  Browse
                </button>
              </div>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              {uploadConfig.allowedTypes.map(t => t.toUpperCase()).join(', ')} (Max {uploadConfig.maxSize}MB)
            </p>
            {formErrors['resume'] && <p className="mt-1 text-sm text-red-600">{formErrors['resume']}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              name="cover_letter"
              required
              value={formData.cover_letter || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
              placeholder="Tell us about your experience, skills, and why you're interested in this role..."
            />
            {formErrors.cover_letter && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cover_letter}</p>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        {jobDetails.result.map((section: FormSection, sectionIndex: number) => (
          <div 
            key={sectionIndex}
            className={`grid grid-cols-1 ${
              section.width === '100%' ? 'lg:grid-cols-1' : 
              'lg:grid-cols-2'
            } gap-${section.gap || 4}`}
            style={{
              justifyContent: section.justify || 'start'
            }}
          >
            {section.children.map((field: FormField) => (
              <div 
                key={field.name}
                className={section.width === '100%' ? 'col-span-full' : ''}
              >
                {renderFormField(field)}
              </div>
            ))}
          </div>
        ))}
        
        {/* Always include cover letter field if not already in dynamic form */}
        {!jobDetails.result.some(section => 
          section.children.some(field => field.name === 'cover_letter')
        ) && (
          <div>
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              Cover Letter <span className="text-red-500">*</span>
            </label>
            <textarea
              name="cover_letter"
              required
              value={formData.cover_letter || ''}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-4 py-3.5 border border-slate-300 rounded-2xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm placeholder-slate-500 hover:border-slate-400 resize-none"
              placeholder="Tell us about your experience, skills, and why you're interested in this role..."
            />
            {formErrors.cover_letter && (
              <p className="mt-1 text-sm text-red-600">{formErrors.cover_letter}</p>
            )}
          </div>
        )}
      </div>
    );
  };

  // Get institute data safely
  const getInstituteLogo = () => {
    if (!institute?.header?.academic_logo) return '';
    return institute.header.academic_logo;
  };

  const getInstituteAddress = () => {
    return institute?.footer?.academic_address || '';
  };

  const getInstituteWebsiteUrl = () => {
    return institute?.website || 'https://example.com';
  };

  const getInstituteName = () => {
    if (institute?.header?.academic_name) {
      return institute.header.academic_name;
    }
    return jobDetails?.academic_name || '';
  };

  const getHRContactEmail = () => {
    if (institute?.hr_email) {
      return institute.hr_email;
    }
    if (institute?.contact_email) {
      return institute.contact_email;
    }
    if (institute?.footer?.academic_email) {
      return institute.footer.academic_email;
    }
    
    const companyName = jobDetails?.company_name || '';
    if (companyName) {
      const domain = companyName.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .replace(/\s+/g, '');
      return `careers@${domain}.com`;
    }
    
    return 'careers@example.com';
  };

  // Render job requirements if available
  const renderJobRequirements = () => {
    if (!jobDetails?.requirements || jobDetails.requirements.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Requirements:</h3>
        <ul className="space-y-2">
          {jobDetails.requirements.map((req, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-slate-700">{req}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render job responsibilities if available
  const renderJobResponsibilities = () => {
    if (!jobDetails?.responsibilities || jobDetails.responsibilities.length === 0) {
      return null;
    }

    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Responsibilities:</h3>
        <ul className="space-y-2">
          {jobDetails.responsibilities.map((resp, index) => (
            <li key={index} className="flex items-start gap-2">
              <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="text-slate-700">{resp}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render job metadata if available
  const renderJobMetadata = () => {
    const metadata = [];
    
    if (jobDetails?.location) {
      metadata.push({
        label: "Location",
        value: jobDetails.location,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
      });
    }
    
    if (jobDetails?.job_type) {
      metadata.push({
        label: "Job Type",
        value: jobDetails.job_type,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      });
    }
    
    if (jobDetails?.experience) {
      metadata.push({
        label: "Experience",
        value: jobDetails.experience,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      });
    }
    
    if (jobDetails?.salary) {
      metadata.push({
        label: "Salary",
        value: jobDetails.salary,
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        )
      });
    }
    
    if (jobDetails?.deadline) {
      metadata.push({
        label: "Deadline",
        value: new Date(jobDetails.deadline).toLocaleDateString('en-IN'),
        icon: (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      });
    }
    
    if (metadata.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-bold text-slate-900 mb-3">Job Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {metadata.map((item, index) => (
            <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="text-slate-500">
                {item.icon}
              </div>
              <div>
                <p className="text-xs text-slate-500">{item.label}</p>
                <p className="font-semibold text-slate-900">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const isLoading = loading || instituteLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !jobDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Job Not Found</h3>
          <p className="text-slate-600 mb-6">{error || 'The job you are looking for does not exist.'}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Dynamic Header */}
      <Header
        logo={getInstituteLogo()}
        address={getInstituteAddress()}
        instituteName={getInstituteName()}
        baseUrl={`/${instituteId || ''}`}
        institute_id={instituteId}
        primaryWebsiteUrl={getInstituteWebsiteUrl()}
      />

      {/* Main Content */}
      <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-100 py-8 px-4 sm:py-12 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Main container with 50-50 split */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-x-0 lg:divide-x divide-slate-200">
              {/* Left Column - Job Details (50%) */}
              <div className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="sticky top-6">
                  {/* Job Title & Company */}
                  <div className="mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-emerald-100 to-emerald-50 text-emerald-800 text-xs font-semibold rounded-full mb-4">
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {jobDetails.status === 'active' ? 'Active Hiring' : 'Position Closed'}
                    </div>
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                      {jobDetails.job_title}
                    </h1>
                    <div className="flex items-center gap-3 text-lg text-slate-700">
                      <span className="font-semibold">{jobDetails.company_name}</span>
                      <span className="text-slate-400">•</span>
                      <span className="flex items-center gap-1">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {jobDetails.location || 'Not specified'}
                      </span>
                    </div>
                  </div>

                  {/* Job Description - Dynamic from API */}
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-4 pb-3 border-b border-slate-300">
                      Job Description
                    </h2>
                    {jobDetails.description ? (
                      <div 
                        className="prose prose-slate max-w-none"
                        dangerouslySetInnerHTML={{ __html: jobDetails.description }}
                      />
                    ) : (
                      <p className="text-slate-700 mb-6">
                        We are looking for an experienced professional with strong expertise in development.
                      </p>
                    )}

                    {/* Render Requirements if available */}
                    {renderJobRequirements()}

                    {/* Render Responsibilities if available */}
                    {renderJobResponsibilities()}

                    {/* Render Job Metadata */}
                    {renderJobMetadata()}

                    {/* Contact Information */}
                    <div className="bg-gradient-to-r from-emerald-50 to-slate-50 border border-emerald-100 rounded-2xl p-6 mt-8">
                      <h4 className="font-bold text-slate-900 mb-2">
                        📧 Need Help?
                      </h4>
                      <p className="text-sm text-slate-600 mb-3">
                        Have questions about this role? Contact our HR team
                      </p>
                      <a
                        href={`mailto:${getHRContactEmail()}`}
                        className="inline-flex items-center gap-2 text-emerald-600 font-semibold hover:text-emerald-700"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        {getHRContactEmail()}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Application Form (50%) */}
              <div className="p-6 sm:p-8 lg:p-10">
                <div className="max-w-lg mx-auto">
                  {/* Form Header */}
                  <div className="text-center mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2">
                      Apply for this Job
                    </h2>
                    <p className="text-slate-600">
                      Fill in your details to submit your application
                    </p>
                    <div className="w-full bg-slate-100 rounded-full h-2 mt-6">
                      <div className="bg-emerald-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Dynamic Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {renderDynamicForm()}

                    {/* Terms and Conditions */}
                    <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="checkbox"
                        id="terms"
                        required
                        className="mt-1 w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-500"
                      />
                      <label htmlFor="terms" className="text-sm text-slate-700">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-emerald-600 font-semibold hover:text-emerald-700"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-emerald-600 font-semibold hover:text-emerald-700"
                        >
                          Privacy Policy
                        </a>
                        . I confirm that the information provided is accurate.
                      </label>
                    </div>

                    {/* Submit button */}
                    <button
                      type="submit"
                      disabled={isSubmitting || jobDetails.status !== 'active'}
                      className={`w-full bg-gradient-to-r ${
                        jobDetails.status === 'active'
                          ? 'from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800'
                          : 'from-slate-400 to-slate-500 cursor-not-allowed'
                      } text-white font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center gap-3 border ${
                        jobDetails.status === 'active' 
                          ? 'border-emerald-500/30' 
                          : 'border-slate-400/30'
                      } ${isSubmitting ? "opacity-75 cursor-not-allowed" : ""}`}
                    >
                      {isSubmitting ? (
                        <>
                          <svg
                            className="animate-spin w-5 h-5 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Submitting...
                        </>
                      ) : jobDetails.status === 'active' ? (
                        <>
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          SUBMIT APPLICATION
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                          POSITION CLOSED
                        </>
                      )}
                    </button>

                    {/* Application tips */}
                    <div className="text-center pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500">
                        Your application will be reviewed within 48 hours. We'll
                        contact you via email for next steps.
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Dynamic Footer */}
      <Footer 
        baseUrl={`/${instituteId || ''}`}
        instituteName={getInstituteName()}
        institute={institute}
        footerData={institute?.footer}
      />
    </div>
  );
};

export default ApplyJobPage;