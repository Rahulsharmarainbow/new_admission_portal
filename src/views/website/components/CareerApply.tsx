// src/pages/CareerApply.tsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router';
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
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  
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
  const [loadingRequirements, setLoadingRequirements] = useState<Set<number>>(new Set());
  const [expandedRequirements, setExpandedRequirements] = useState<Set<number>>(new Set());
  
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
        } else {
          setFilteredJobs(prev => [...prev, ...response.data.data]);
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
      document.title = `${careerData.header.academic_name}`;
      
      const setFavicon = (faviconUrl: string) => {
        const existingLinks = document.querySelectorAll('link[rel*="icon"]');
        existingLinks.forEach(link => link.remove());

        const link = document.createElement('link');
        link.rel = 'icon';
        link.type = 'image/x-icon';
        link.href = faviconUrl;
        document.head.appendChild(link);
      };

      const faviconUrl = careerData.header?.favicon
        ? `${assetUrl}/${careerData.header.favicon}`
        : '';
      
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

  // Toggle requirements expansion
  const toggleRequirements = (jobId: number) => {
    setExpandedRequirements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  if (loading) {
    return <Loader/>;
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
        <title>{careerData.header.academic_name}</title>
        <meta name="description" content="Explore career opportunities and join our team" />
      </Helmet>

      <Header
        instituteName={careerData.header.academic_name}
        logo={careerData.header.academic_logo}
        address={careerData.footer.academic_address}
        baseUrl={careerData.baseUrl}
        institute_id={institute_id}
        primaryWebsiteUrl={careerData.website || ''}
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

           {/* Job Search - IMPROVED SECTION */}
      <section className="border-b border-slate-200 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 className="text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                  Find Your Dream Job
                </h2>
              </div>
            </div>

            {/* Live search input - FIXED */}
            <div className="relative max-w-3xl">
              <div className="relative">
                <svg
                  className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-400 pointer-events-none z-10"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
                  placeholder="Search by job title, company, location, or skills..."
                  className="w-full pl-14 pr-12 py-4 border-2 border-blue-300 bg-white/95 backdrop-blur-sm rounded-2xl focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 focus:outline-none transition-all duration-300 text-lg text-gray-800 placeholder-gray-500 shadow-xl hover:shadow-2xl hover:border-blue-400"
                />
                {search && (
                  <button
                    onClick={() => setSearch('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
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
                    const requirements = job.requirements;
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
                                    {/* Show only first requirement initially */}
                                    <li className="text-xs text-slate-600 flex gap-2">
                                      <span className="text-emerald-600 font-bold">•</span>
                                      <span>{requirements[0]}</span>
                                    </li>
                                    
                                    {/* Show remaining requirements if expanded */}
                                    {expandedRequirements.has(job.id) && requirements.slice(1).map((requirement, index) => (
                                      <li key={index + 1} className="text-xs text-slate-600 flex gap-2">
                                        <span className="text-emerald-600 font-bold">•</span>
                                        <span>{requirement}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  
                                  {/* Read more/less button */}
                                  {requirements.length > 1 && (
                                    <button
                                      onClick={() => toggleRequirements(job.id)}
                                      className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
                                    >
                                      {expandedRequirements.has(job.id) ? (
                                        <>
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                          </svg>
                                          Read less
                                        </>
                                      ) : (
                                        <>
                                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                          </svg>
                                          Read more ({requirements.length - 1} more)
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              ) : null}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
                              <Link
                                to={`${careerData.baseUrl}/job_details/${job.id}`} 
                                >
                              <button
                                className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                              >
                                Apply now
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </button>
                              </Link>
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
        baseUrl={careerData.baseUrl}
        instituteName={careerData.header.academic_name}
        institute={careerData}
      />
    </div>
  );
};

export default CareerApply;