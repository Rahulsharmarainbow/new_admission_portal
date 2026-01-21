// src/pages/CareerApply.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router';
import { Helmet } from 'react-helmet-async';
import axios from 'axios';
import toast from 'react-hot-toast';
import Header from './Header';
import Footer from './Footer';
import Loader from 'src/Frontend/Common/Loader';
import { ArrowRightIcon } from 'flowbite-react';

const apiUrl = import.meta.env.VITE_API_URL;
const assetUrl = import.meta.env.VITE_ASSET_URL;

type FilterItem = {
  id: number;
  name: string;
};

type FilterType = {
  type_name: string;
  data: FilterItem[];
};

type Job = {
  requirements: any;
  slug: any;
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

type CareerData = {
  status: boolean;
  academic_id: number;
  unique_code: string;
  header: {
    academic_name: string;
    academic_logo: string;
  };
  banner: {
    developed_by: unknown;
    search_text_color: string;
    search_color: any;
    banner_text_color: string;
    banner_color: any;
    theme_colour: string;
    font_family: string;
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

const CareerApply: React.FC = () => {
  let { institute_id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const jobsContainerRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isFiltering, setIsFiltering] = useState(false);
  // State for career data
  const [careerData, setCareerData] = useState<CareerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for jobs
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  // State for filters
  const [filters, setFilters] = useState<FilterType[]>([]);
  const [activeFilters, setActiveFilters] = useState<FilterState>({});
  const [selectedFilters, setSelectedFilters] = useState<number[]>([]);
  const [expandedRequirements, setExpandedRequirements] = useState<Set<number>>(new Set());
  
  // Infinite scroll pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Scroll to top ref
  const scrollToTopRef = useRef<HTMLDivElement>(null);
  const filterDebounceRef = useRef<NodeJS.Timeout | null>(null);
  // Apply theme color and font family
  useEffect(() => {
    if (careerData?.banner) {
      const { theme_colour, font_family } = careerData.banner;
      
      // Apply theme color as CSS variable
      if (theme_colour) {
        document.documentElement.style.setProperty('--theme-color', theme_colour);
        document.documentElement.style.setProperty('--theme-color-rgb', hexToRgb(theme_colour));
      }
      
      // Apply font family
      if (font_family) {
        document.documentElement.style.setProperty('--font-family', font_family);
        
        // Load Google Font if it's a Google Font
        if (isGoogleFont(font_family)) {
          const link = document.createElement('link');
          link.href = `https://fonts.googleapis.com/css2?family=${font_family.replace(/\s+/g, '+')}:wght@300;400;500;600;700&display=swap`;
          link.rel = 'stylesheet';
          document.head.appendChild(link);
        }
      }
    }
  }, [careerData]);

  // Helper function to convert hex to rgb
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

  // Add CSS for theme variables
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      :root {
        --theme-color: ${careerData?.banner?.theme_colour || '#3B82F6'};
        --theme-color-rgb: ${careerData?.banner?.theme_colour ? hexToRgb(careerData.banner.theme_colour) : '59, 130, 246'};
        --font-family: ${careerData?.banner?.font_family || 'Inter, system-ui, -apple-system, sans-serif'};
      }
      
      .theme-bg {
        background-color: var(--theme-color);
      }
      
      .theme-bg-gradient {
        background: linear-gradient(135deg, var(--theme-color) 0%, 
          rgba(var(--theme-color-rgb), 0.9) 50%, 
          rgba(var(--theme-color-rgb), 0.7) 100%);
      }
      
      .theme-text {
        color: var(--theme-color);
      }
      
      .theme-border {
        border-color: var(--theme-color);
      }
      
      .theme-hover:hover {
        background-color: var(--theme-color);
      }
      
      .theme-button {
        background-color: var(--theme-color);
        color: white;
      }
      
      .theme-button:hover {
        background-color: rgba(var(--theme-color-rgb), 0.9);
      }
      
      body {
        font-family: var(--font-family);
        scroll-behavior: smooth;
      }
      
      /* Custom scrollbar for smooth scrolling */
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      
      .scrollbar-thin::-webkit-scrollbar-track {
        background: #f1f1f1;
        border-radius: 10px;
      }
      
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background: #c1c1c1;
        border-radius: 10px;
      }
      
      .scrollbar-thin::-webkit-scrollbar-thumb:hover {
        background: #a1a1a1;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, [careerData?.banner?.theme_colour, careerData?.banner?.font_family]);

  // Fetch initial career data
  useEffect(() => {
    const fetchCareerData = async () => {
      try {
        if (!institute_id || institute_id === ':institute_id') {
          institute_id = window.location.hostname;
        }
        if (!institute_id) {
          setError('Institute code not found.');
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
          
          // if (response.data.jobs && Array.isArray(response.data.jobs)) {
          //   setJobs(response.data.jobs);
          // }
          
          if (response.data.filters && Array.isArray(response.data.filters)) {
            setFilters(response.data.filters);
            
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

  // Fetch jobs with filters and pagination
const fetchJobs = useCallback(
  async (pageNum: number, reset = false) => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setIsFetching(true);

      const formattedFilters: Record<string, string[]> = {};
      Object.entries(activeFilters).forEach(([k, v]) => {
        if (v.length) formattedFilters[k] = v.map(String);
      });

      const response = await axios.post(
        `${apiUrl}/PublicCareer/get-career-jobs`,
        {
          unique_code: institute_id,
          page: pageNum,
          rowsPerPage,
          filters: formattedFilters,
          search: search.trim(),
        }
      );

      if (response.data?.status) {
        setJobs(prev =>
          reset ? response.data.data : [...prev, ...response.data.data]
        );
        setPage(reset ? 1 : pageNum + 1);

        setHasMore(
          response.data.has_more ??
          response.data.data.length === rowsPerPage
        );
      }
    } finally {
      loadingRef.current = false;
      setIsFetching(false); // ✅ loader always stops
      setIsSearching(false);
    }
  },
  [activeFilters, search, institute_id]
);



const scrollToFirstJob = useCallback(() => {
  if (!jobsContainerRef.current) return;

  const firstJob =
    jobsContainerRef.current.querySelector('[data-job-card]');

  if (firstJob) {
    firstJob.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}, []);



useEffect(() => {
  if (jobs.length === 0) return;
  scrollToFirstJob();
}, [jobs, scrollToFirstJob]);


// Handle filter change - COMPLETE VERSION
// const handleFilterChange = (filterType: string, filterId: number) => {
//   setActiveFilters(prev => {
//     const list = prev[filterType] || [];
//     const updated = list.includes(filterId)
//       ? list.filter(id => id !== filterId)
//       : [...list, filterId];

//     return { ...prev, [filterType]: updated };
//   });
// };

const handleFilterChange = (type: string, id: number) => {
  setActiveFilters(prev => {
    const list = prev[type] || [];
    return {
      ...prev,
      [type]: list.includes(id)
        ? list.filter(x => x !== id)
        : [...list, id],
    };
  });
};





// Separate function for fetching filtered jobs
const fetchFilteredJobs = useCallback(() => {
  // Debounce multiple rapid filter changes
  if (filterDebounceRef.current) {
    clearTimeout(filterDebounceRef.current);
  }
  
  filterDebounceRef.current = setTimeout(() => {
    setJobs([]);
    setPage(0);
    fetchJobs(0, true);
    
    // Scroll filters to top
    const filtersContainer = document.querySelector('.filters-container');
    if (filtersContainer) {
      filtersContainer.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, 300); // 300ms debounce for filters
}, [fetchJobs]);

  // Handle search input change with debounce
 const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const value = e.target.value;
  setSearch(value);
  setIsSearching(true);
  setIsFiltering(true); // Filtering शुरू
  
  // Clear previous timeout
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  // Set new timeout for API call
  searchTimeoutRef.current = setTimeout(() => {
    if (value.trim() !== '' || Object.keys(activeFilters).some(key => activeFilters[key].length > 0)) {
      setJobs([]);
      setPage(0);
      fetchJobs(0, true);
    } else {
      // Reset to initial jobs
      if (careerData?.jobs) {
        setJobs(careerData.jobs);
        setIsFiltering(false);
      }
    }
  }, 500);
};



// Cleanup on unmount
useEffect(() => {
  return () => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    if (filterDebounceRef.current) {
      clearTimeout(filterDebounceRef.current);
    }
  };
}, []);

  // Handle search button click
const handleSearch = () => {
  setIsFiltering(true);
  
  // Clear any existing timeout
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }
  
  setJobs([]);
  setPage(0);
  fetchJobs(0, true);
};

  // Handle search clear
const handleClearSearch = () => {
  // clear timers
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current);
  }

  setIsFiltering(true);
  setSearch('');        // 🔑 only state change
  setPage(0);
  setJobs([]);
};


  // Infinite scroll observer with better handling
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingRef.current && !isSearching) {
          fetchJobs(page);
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '100px' // Load 100px before reaching the bottom
      }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [fetchJobs, hasMore, page, isSearching]);


useEffect(() => {
  if (careerData?.jobs?.length) {
    setJobs(careerData.jobs); // first page
    setPage(2);               // next API page
  }
}, [careerData]);


useEffect(() => {
  const timeout = setTimeout(() => {
    setJobs([]);
    setPage(0);
    fetchJobs(0, true);  
  }, 300);

  return () => clearTimeout(timeout);
}, [activeFilters, search, fetchJobs]);




  // Clear all filters
//  const clearAllFilters = () => {
//   // पहले states को clear करें
//   const resetFilters: FilterState = {};
//   filters.forEach(filter => {
//     resetFilters[filter.type_name] = [];
//   });
//   setActiveFilters(resetFilters);
//   setSelectedFilters([]);
//   setSearch('');
  
//   // Clear search timeout
//   if (searchTimeoutRef.current) {
//     clearTimeout(searchTimeoutRef.current);
//   }
  
//   // Clear filter debounce
//   if (filterDebounceRef.current) {
//     clearTimeout(filterDebounceRef.current);
//   }
  
//   // Set loading state for job list
//   setJobs([]);
//   setIsLoadingMore(true);
  
//   // Scroll to top
//   // if (scrollToTopRef.current) {
//   //   window.scrollTo({
//   //     top: scrollToTopRef.current.offsetTop || 0,
//   //     behavior: 'smooth'
//   //   });
//   // }
  
//   // Direct API call with empty filters (no debounce)
//   // setTimeout(() => {
//   //   fetchFilteredJobsDirect();
//   // }, 100);
// };

const clearAllFilters = () => {
  const reset: FilterState = {};
  filters.forEach(f => (reset[f.type_name] = []));

  setSearch('');
  setActiveFilters(reset);
  setJobs([]);
  setPage(0);
};




const fetchFilteredJobsDirect = useCallback(async () => {
  try {
    if (!institute_id || institute_id === ':institute_id') {
      institute_id = window.location.hostname;
    }

    setIsLoadingMore(true);
    
    const response = await axios.post<{
      status: boolean;
      total: number;
      data: Job[];
      has_more?: boolean;
    }>(
      `${apiUrl}/PublicCareer/get-career-jobs`,
      {
        unique_code: institute_id,
        page: 0,
        rowsPerPage,
        filters: {}, // Empty filters
        search: '' // Empty search
      },
      { headers: { 'Content-Type': 'application/json' } }
    );

    if (response.data?.status === true) {
      setJobs(response.data.data);
      setPage(2);
      
      const hasMoreJobs = response.data.has_more !== undefined 
        ? response.data.has_more 
        : response.data.data.length === rowsPerPage;
      setHasMore(hasMoreJobs);
    }
  } catch (err: any) {
    console.error('Error fetching jobs:', err);
    toast.error(err.response?.data?.message || 'Failed to load jobs');
  } finally {
    setIsLoadingMore(false);
  }
}, [institute_id, rowsPerPage]);

  // Check if any filter is active
  const hasActiveFilters = () => {
    return Object.keys(activeFilters).some(key => activeFilters[key].length > 0) || search.trim() !== '';
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

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

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
    const banner = careerData?.banner || {};
    const isVideo = banner.banner_image?.endsWith('.mp4') || banner.banner_image?.endsWith('.webm') || banner.banner_type === 'video';
    const bannerImage = banner.banner_image ? `${assetUrl}/${banner.banner_image}` : "";
    
    return { isVideo, bannerImage, title: banner.title, description: banner.long_description };
  };

  const bannerContent = getBannerContent();

  // Banner styles
  const bannerStyles = {
    background: careerData?.banner?.banner_color 
      ? careerData.banner.banner_color.includes('gradient')
        ? careerData.banner.banner_color
        : `linear-gradient(135deg, ${careerData.banner.banner_color} 0%, ${careerData.banner.banner_color}99 50%, ${careerData.banner.banner_color}66 100%)`
      : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)'
  };

  const bannerTextStyle = {
    color: careerData?.banner?.banner_text_color || '#ffffff'
  };

  // Search section styles
  const searchSectionStyles = {
    background: careerData?.banner?.search_color 
      ? careerData.banner.search_color.includes('gradient')
        ? careerData.banner.search_color
        : `linear-gradient(135deg, ${careerData.banner.search_color} 0%, ${careerData.banner.search_color}99 50%, ${careerData.banner.search_color}66 100%)`
      : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e40af 100%)'
  };

  const searchTextStyle = {
    color: careerData?.banner?.search_text_color || '#ffffff'
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>{careerData?.header?.academic_name || 'Career Portal'}</title>
        <meta name="description" content="Explore career opportunities and join our team" />
      </Helmet>

      <Header
        instituteName={careerData?.header?.academic_name || ''}
        logo={careerData?.header?.academic_logo || ''}
        address={careerData?.footer?.academic_address || ''}
        baseUrl={careerData?.baseUrl}
        institute_id={institute_id}
        primaryWebsiteUrl={careerData?.website || ''}
        themeColor={careerData?.banner?.theme_colour}
      />
      
      <section className="py-6 md:py-8">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
            {/* LEFT TEXT BLOCK */}
            <div 
              className="text-white p-8 md:p-12 flex flex-col justify-center space-y-5"
              style={bannerStyles}
            >
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
                style={bannerTextStyle}
              >
                {careerData?.banner?.title || 'Build Your Career With Us'}
              </h2>

              <div className="text-sm md:text-base max-w-xl space-y-3">
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: careerData?.banner?.long_description || ` `
                  }}
                  style={bannerTextStyle}
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
                  alt={`${careerData?.header?.academic_name} career opportunities`}
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

      {/* Job Search Section */}
      <section 
        className="border-b border-slate-200"
        style={searchSectionStyles}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
              <div>
                <h2 
                  className="text-3xl lg:text-4xl"
                  style={searchTextStyle}
                >
                  Find Your Dream Job
                </h2>
              </div>
            </div>

            {/* Live search input */}
            <div className="relative max-w-xl">
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                  <svg 
                    className="w-6 h-6" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                    style={{ color: '#6b7280' }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                
                <input
                  ref={searchInputRef}
                  type="text"
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search by job title, company, location, or skills..."
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 bg-white rounded-full focus:ring-3 focus:ring-theme-color/20 focus:border-theme-color focus:outline-none transition-all duration-300 text-base text-gray-800 placeholder-gray-500 shadow-lg"
                />
                
                {search && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    type="button"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                <button
                  type="button"
                  onClick={handleSearch}
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-md"
                  style={{ 
                    backgroundColor: careerData?.banner?.theme_colour || '#3B82F6',
                    color: careerData?.banner?.search_text_color || '#ffffff'
                  }}
                >
                  <ArrowRightIcon />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
  <div ref={jobsContainerRef} />
      {/* Job Listings + Filters */}
      <main className="flex-1 py-8 scrollbar-thin" ref={jobsContainerRef}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Job cards */}
            <div className={filters.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}>
              <div className="space-y-6">
                { 
                  isFetching  ? (
                    <Loader />
                  ) : (
                    jobs.length === 0 ? (
                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                    <svg
                      className="w-20 h-20 mx-auto text-slate-400 mb-6"
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
                    <h3 className="text-xl font-semibold text-slate-900 mb-2">
                      No jobs found
                    </h3>
                    <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
                      {hasActiveFilters() 
                        ? "Try adjusting your search or filters to find what you're looking for."
                        : "No job positions are currently available. Check back later for new opportunities."
                      }
                    </p>
                    {hasActiveFilters() && (
                      <button
                        onClick={clearAllFilters}
                        className="px-6 py-2.5 theme-button rounded-xl transition-colors text-sm font-medium"
                      >
                        Clear all filters
                      </button>
                    )}
                  </div>
                ) : (
                  <>
                    {/* Jobs Count */}
                      
            {/* Scroll to top anchor */}
                  <div ref={scrollToTopRef} className="absolute top-0" />
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-900">
                        Available Jobs 
                      </h3>
                      {hasActiveFilters() && (
                        <button
                          onClick={clearAllFilters}
                          className="text-sm text-slate-600 hover:text-slate-800 flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Clear filters
                        </button>
                      )}
                    </div>

                    {/* Jobs Grid */}
                    <div className="space-y-6">
                      {jobs.map((job) => {
                        const jobMetaDetails = getJobMetaDetails(job);
                        const requirements = job.requirements;
                        return (
                          <article
                            key={job.id}
                            data-job-card
                            className="group bg-white border border-slate-200 hover:border-theme-color hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden hover:-translate-y-1"
                          >
                            <div className="p-6 lg:p-8">
                              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="space-y-3 flex-1">
                                  <div className="flex justify-between items-start">
                                    <h3 className="text-lg lg:text-xl font-bold text-slate-900 group-hover:theme-text line-clamp-2 pr-4">
                                      {job.job_title}
                                    </h3>
                                    {job.salary && (
                                      <span className="text-sm font-semibold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full whitespace-nowrap">
                                        {job.salary}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-base text-slate-700 font-semibold">
                                    {job.company_name}
                                  </p>
                                  
                                  {/* Job Meta Details */}
                                  {jobMetaDetails.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-3">
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

                                  {/* Requirements Section */}
                                  {requirements && Array.isArray(requirements) && requirements.length > 0 && (
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
                                  )}
                                </div>

                                <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
                                  <Link
                                    to={`${careerData?.baseUrl}/job_details/${job.slug}`} 
                                    className="w-full sm:w-auto"
                                  >
                                    <button
                                      className="w-full sm:w-auto px-6 py-2.5 theme-button text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
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
                    </div>

                    {/* Infinite Scroll Loader - FIXED POSITION */}
                    <div ref={observerTarget} className="relative">
                      {isLoadingMore && (
                        <Loader />
                      )}
                    </div>
                    
                    {/* End of list message */}
                    {!hasMore && jobs.length > 0 && (
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 text-slate-500 text-sm">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          You've reached the end of the list
                        </div>
                      </div>
                    )}
                  </>
                )
                  )
                }
              </div>
            </div>

            {/* Filters */}
            {filters.length > 0 && (
              <aside className="lg:col-span-4">
                <div className="filters-container sticky top-24 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-300 hover:shadow-lg">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-1">Filter Jobs</h3>
                      <p className="text-sm text-slate-600">Refine results by selecting filters below</p>
                    </div>

                    {/* Dynamic Filters from API */}
                    {filters.map((filter) => (
                      <div key={filter.type_name} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-slate-700 block mb-1 capitalize">
                            {filter.type_name.toLowerCase()}
                          </label>
                          {getActiveFilterCount(filter.type_name) > 0 && (
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: careerData?.banner?.theme_colour || '#3B82F6',
                                color: '#ffffff'
                              }}
                            >
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
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 border ${
                                  isActive
                                    ? "text-white shadow-sm"
                                    : "text-slate-700 hover:bg-slate-50 border-slate-300"
                                }`}
                                style={isActive ? { 
                                  backgroundColor: careerData?.banner?.theme_colour || '#3B82F6',
                                  borderColor: careerData?.banner?.theme_colour || '#3B82F6'
                                } : {}}
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
                        className="w-full px-4 py-3 border-2 border-slate-300 hover:border-slate-400 text-slate-700 text-sm font-medium rounded-xl transition-all duration-200 hover:bg-slate-50 flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        Clear all filters
                      </button>
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
        footerData={careerData?.footer} 
        baseUrl={careerData?.baseUrl}
        instituteName={careerData?.header?.academic_name}
        institute={careerData}
        developedBy={careerData?.banner?.developed_by}
        themeColor={careerData?.banner?.theme_colour}
        fontFamily={careerData?.banner?.font_family}
      />
    </div>
  );
};

export default CareerApply;





// // src/pages/CareerApply.tsx
// import React, { useState, useEffect, useRef } from 'react';
// import { useNavigate, useParams, useLocation, Link } from 'react-router';
// import { Helmet } from 'react-helmet-async';
// import axios from 'axios';
// import toast from 'react-hot-toast';
// import Header from './Header';
// import Footer from './Footer';
// import Loader from 'src/Frontend/Common/Loader';
// import { ArrowRightIcon } from 'flowbite-react';

// const apiUrl = import.meta.env.VITE_API_URL;
// const assetUrl = import.meta.env.VITE_ASSET_URL;

// type FilterItem = {
//   id: number;
//   name: string;
// };

// type FilterType = {
//   type_name: string;
//   data: FilterItem[];
// };

// type Job = {
//   slug: any;
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

// type JobDetails = {
//   job_id: number;
//   requirements: string[];
//   [key: string]: any;
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
//     developed_by: unknown;
//     search_text_color: string;
//     search_color: any;
//     banner_text_color: string;
//     banner_color: any;
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
//   let { institute_id } = useParams();
//   const location = useLocation();
//   const searchInputRef = useRef<HTMLInputElement>(null);
  
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
//   const [loadingRequirements, setLoadingRequirements] = useState<Set<number>>(new Set());
//   const [expandedRequirements, setExpandedRequirements] = useState<Set<number>>(new Set());
  
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
        
//          if (!institute_id || institute_id === ':institute_id') {
//           institute_id = window.location.hostname; // use domain as fallback
//         }
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

// const fetchFilteredJobs = async (filtersToApply: FilterState, searchText: string, pageNum: number, reset = false) => {
//   try {
//     if (!institute_id || institute_id === ':institute_id') {
//       institute_id = window.location.hostname; // use domain as fallback
//     }

//     setIsSearching(true);
    
//     // Convert filters to the required format: { location: ["1", "2"], experience: ["11", "12"] }
//     const formattedFilters: { [key: string]: string[] } = {};
    
//     Object.entries(filtersToApply).forEach(([filterType, filterIds]) => {
//       if (filterIds.length > 0) {
//         formattedFilters[filterType] = filterIds.map(id => id.toString());
//       }
//     });
    
//     const response = await axios.post<{
//       status: boolean;
//       total: number;
//       data: Job[];
//     }>(
//       `${apiUrl}/PublicCareer/get-career-jobs`,
//       {
//         unique_code: institute_id,
//         page: pageNum,
//         rowsPerPage,
//         filters: formattedFilters, // Changed to formattedFilters
//         search: searchText
//       },
//       { headers: { 'Content-Type': 'application/json' } }
//     );

//     if (response.data?.status === true) {
//       if (reset) {
//         setFilteredJobs(response.data.data);
//       } else {
//         setFilteredJobs(prev => [...prev, ...response.data.data]);
//       }
//       setTotalJobs(response.data.total);
//       setHasMore(response.data.data.length === rowsPerPage);
//     }
//   } catch (err: any) {
//     console.error('Error fetching filtered jobs:', err);
//     toast.error(err.response?.data?.message || 'Failed to load jobs');
//   } finally {
//     setIsSearching(false);
//     setIsLoadingMore(false);
//   }
// };

//   // Handle filter change
// // Handle filter change
// const handleFilterChange = (filterType: string, filterId: number) => {
//   setActiveFilters(prev => {
//     const currentFilters = prev[filterType] || [];
//     const newFilters = currentFilters.includes(filterId)
//       ? currentFilters.filter(id => id !== filterId)
//       : [...currentFilters, filterId];
    
//     const updated = { ...prev, [filterType]: newFilters };
//     setPage(0);
//     fetchFilteredJobs(updated, search, 0, true);
    
//     return updated;
//   });
// };

// // Update the useEffect for search to use the new filter structure
// useEffect(() => {
//   const timer = setTimeout(() => {
//     if (search.trim() !== '') {
//       setPage(0);
//       fetchFilteredJobs(activeFilters, search, 0, true);
//     } else if (Object.keys(activeFilters).some(key => activeFilters[key].length > 0)) {
//       fetchFilteredJobs(activeFilters, '', 0, true);
//     } else {
//       setFilteredJobs(jobs);
//       setTotalJobs(jobs.length);
//     }
//   }, 500);

//   return () => clearTimeout(timer);
// }, [activeFilters, search]);

// // Also update handleSearch function
// const handleSearch = () => {
//   setPage(0);
//   fetchFilteredJobs(activeFilters, search, 0, true);
// };

//   // Handle load more
//   const handleLoadMore = () => {
//     const nextPage = page + 1;
//     setPage(nextPage);
//     setIsLoadingMore(true);
//     fetchFilteredJobs(selectedFilters, search, nextPage, false);
//   };

//   // Clear all filters
// // Clear all filters
// const clearAllFilters = () => {
//   const resetFilters: FilterState = {};
//   filters.forEach(filter => {
//     resetFilters[filter.type_name] = [];
//   });
//   setActiveFilters(resetFilters);
//   setSearch('');
//   setPage(0);
//   fetchFilteredJobs(resetFilters, '', 0, true);
// };

//   // Check if any filter is active
// // Check if any filter is active
// const hasActiveFilters = () => {
//   return Object.keys(activeFilters).some(key => activeFilters[key].length > 0) || search.trim() !== '';
// };
//   // Get count of active filters for a specific type
//   const getActiveFilterCount = (filterType: string) => {
//     return activeFilters[filterType]?.length || 0;
//   };

//   // Set page title and favicon
//   useEffect(() => {
//     if (careerData) {
//       document.title = `${careerData.header.academic_name}`;
      
//       const setFavicon = (faviconUrl: string) => {
//         const existingLinks = document.querySelectorAll('link[rel*="icon"]');
//         existingLinks.forEach(link => link.remove());

//         const link = document.createElement('link');
//         link.rel = 'icon';
//         link.type = 'image/x-icon';
//         link.href = faviconUrl;
//         document.head.appendChild(link);
//       };

//       const faviconUrl = careerData.header?.favicon
//         ? `${assetUrl}/${careerData.header.favicon}`
//         : '';
      
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

//   // Toggle requirements expansion
//   const toggleRequirements = (jobId: number) => {
//     setExpandedRequirements(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(jobId)) {
//         newSet.delete(jobId);
//       } else {
//         newSet.add(jobId);
//       }
//       return newSet;
//     });
//   };

//   if (loading) {
//     return <Loader/>;
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
//         <title>{careerData.header.academic_name}</title>
//         <meta name="description" content="Explore career opportunities and join our team" />
//       </Helmet>

//       <Header
//         instituteName={careerData.header.academic_name}
//         logo={careerData.header.academic_logo}
//         address={careerData.footer.academic_address}
//         baseUrl={careerData.baseUrl}
//         institute_id={institute_id}
//         primaryWebsiteUrl={careerData.website || ''}
//       />

//       <section className="py-6 md:py-8">
//   <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
//     <div className="grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-3xl shadow-2xl">
//       {/* LEFT TEXT BLOCK */}
//       <div 
//         className="text-white p-8 md:p-12 flex flex-col justify-center space-y-5"
//         style={{
//           background: careerData.banner?.banner_color 
//             ? careerData.banner.banner_color.includes('gradient')
//               ? careerData.banner.banner_color
//               : `linear-gradient(135deg, ${careerData.banner.banner_color} 0%, ${careerData.banner.banner_color}99 50%, ${careerData.banner.banner_color}66 100%)`
//             : 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fbbf24 100%)'
//         }}
//       >
//         <h2 
//           className="text-3xl md:text-4xl lg:text-5xl font-extrabold leading-tight"
//           style={{ 
//             color: careerData.banner?.banner_text_color || '#ffffff' 
//           }}
//         >
//           {careerData.banner?.title || 'Build Your Career With Us'}
//         </h2>

//         <div 
//           className="text-sm md:text-base max-w-xl space-y-3"
//           style={{ 
//             color: careerData.banner?.banner_color || 'rgba(255, 255, 255, 0.9)' 
//           }}
//         >
//           <div 
//             className="prose prose-invert max-w-none"
//             dangerouslySetInnerHTML={{ 
//               __html: careerData.banner?.long_description || ` `
//             }}
//             style={{ 
//               color: careerData.banner?.banner_text_color || 'rgba(255, 255, 255, 0.9)' 
//             }}
//           />
//         </div>
//       </div>

//       {/* RIGHT IMAGE/VIDEO BLOCK */}
//       <div className="w-full h-full relative">
//         {bannerContent.isVideo ? (
//           <video
//             className="w-full h-full object-cover"
//             autoPlay
//             muted
//             loop
//             playsInline
//             poster="https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg"
//           >
//             <source src={bannerContent.bannerImage} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <img
//             src={bannerContent.bannerImage}
//             alt={`${careerData.header.academic_name} career opportunities`}
//             className="w-full h-full object-cover"
//             onError={(e) => {
//               e.currentTarget.src = "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg";
//             }}
//           />
//         )}
//       </div>
//     </div>
//   </div>
// </section>

//            {/* Job Search - IMPROVED SECTION */}
//       <section 
//   className="border-b border-slate-200"
//   style={{
//     background: careerData.banner?.search_color 
//       ? careerData.banner.search_color.includes('gradient')
//         ? careerData.banner.search_color
//         : `linear-gradient(135deg, ${careerData.banner.search_color} 0%, ${careerData.banner.search_color}99 50%, ${careerData.banner.search_color}66 100%)`
//       : 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 50%, #1e40af 100%)'
//   }}
// >
//   <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
//     <div className="space-y-6">
//       <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
//         <div>
//           <h2 
//             className="text-3xl lg:text-4xl"
//             style={{ color: careerData.banner?.search_text_color || '#ffffff' }}
//           >
//             Find Your Dream Job
//           </h2>
//         </div>
//       </div>

//       {/* Live search input - FIXED */}
//       <div className="relative max-w-xl">
//         <div className="relative">
//           {/* Search icon inside input */}
//           <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
//             <svg 
//               className="w-6 h-6" 
//               fill="none" 
//               stroke="currentColor" 
//               viewBox="0 0 24 24"
//               style={{ color: '#6b7280' }}
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2.5}
//                 d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
//               />
//             </svg>
//           </div>
          
//           <input
//             ref={searchInputRef}
//             type="text"
//             value={search}
//             onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
//             placeholder="Search by job title, company, location, or skills..."
//             className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-200 bg-white rounded-full focus:ring-3 focus:ring-blue-500/20 focus:border-blue-400 focus:outline-none transition-all duration-300 text-base text-gray-800 placeholder-gray-500 shadow-lg"
//             style={{
//               borderColor: careerData.banner?.search_color || '#d1d5db',
//               boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
//             }}
//           />
          
//           {search && (
//             <button
//               // onClick={() => setSearch('')}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
//               type="button"
//               style={{ backgroundColor: 'transparent' }}
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           )}
          
//           {/* Search button on right side (like in image) */}
//           <button
//             type="button"
//             onClick={() => handleSearch()}
//             className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-4 rounded-full font-medium transition-all duration-300 hover:shadow-md"
//             style={{
//               backgroundColor: careerData.banner?.search_color || '#3b82f6',
//               color: careerData.banner?.search_text_color || '#ffffff',
//               fontFamily: "'Inter', sans-serif"
//             }}
//           >
//             <ArrowRightIcon />
//           </button>
//         </div>
//       </div>
//     </div>
//   </div>
// </section>

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
//                     const requirements = job.requirements;
//                     const isLoadingReq = loadingRequirements.has(job.id);
                    
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
//                               {isLoadingReq ? (
//                                 <div className="mt-4 pt-4 border-t border-slate-100">
//                                   <div className="flex items-center gap-2 text-sm text-slate-500">
//                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-indigo-600"></div>
//                                     Loading requirements...
//                                   </div>
//                                 </div>
//                               ) : requirements.length > 0 ? (
//                                 <div className="mt-4 pt-4 border-t border-slate-100">
//                                   <h4 className="text-sm font-semibold text-slate-900 mb-2">Key Requirements:</h4>
//                                   <ul className="space-y-2">
//                                     {/* Show only first requirement initially */}
//                                     <li className="text-xs text-slate-600 flex gap-2">
//                                       <span className="text-emerald-600 font-bold">•</span>
//                                       <span>{requirements[0]}</span>
//                                     </li>
                                    
//                                     {/* Show remaining requirements if expanded */}
//                                     {expandedRequirements.has(job.id) && requirements.slice(1).map((requirement, index) => (
//                                       <li key={index + 1} className="text-xs text-slate-600 flex gap-2">
//                                         <span className="text-emerald-600 font-bold">•</span>
//                                         <span>{requirement}</span>
//                                       </li>
//                                     ))}
//                                   </ul>
                                  
//                                   {/* Read more/less button */}
//                                   {requirements.length > 1 && (
//                                     <button
//                                       onClick={() => toggleRequirements(job.id)}
//                                       className="mt-2 text-xs text-indigo-600 hover:text-indigo-800 font-medium flex items-center gap-1"
//                                     >
//                                       {expandedRequirements.has(job.id) ? (
//                                         <>
//                                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
//                                           </svg>
//                                           Read less
//                                         </>
//                                       ) : (
//                                         <>
//                                           <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
//                                           </svg>
//                                           Read more ({requirements.length - 1} more)
//                                         </>
//                                       )}
//                                     </button>
//                                   )}
//                                 </div>
//                               ) : null}
//                             </div>

//                             <div className="flex flex-col sm:flex-row gap-2 mt-4 lg:mt-0 lg:w-auto">
//                               <Link
//                                 to={`${careerData.baseUrl}/job_details/${job.slug}`} 
//                                 >
//                               <button
//                                 className="flex-1 lg:flex-none px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-sm font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
//                               >
//                                 Apply now
//                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
//                                 </svg>
//                               </button>
//                               </Link>
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
//         baseUrl={careerData.baseUrl}
//         instituteName={careerData.header.academic_name}
//         institute={careerData}
//         developedBy={careerData.banner.developed_by}
//       />
//     </div>
//   );
// };

// export default CareerApply;