import React, { useState, useEffect } from 'react';
import { MdRemoveRedEye, MdDeleteForever } from 'react-icons/md';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import AddFeedbackModal from './components/AddFeedbackModal';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';

interface FeedbackTableProps {
  status: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

interface Feedback {
  ticket_description: React.ReactNode;
  ticket_title: React.ReactNode;
  created_by: React.ReactNode;
  ticket_id: number;
  name: string;
  email: string;
  mobile: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const FeedbackTable: React.FC<FeedbackTableProps> = ({ status }) => {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'ticket_id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [sort, setSort] = useState({ key: 'ticket_id', direction: 'desc' as 'asc' | 'desc' });
  
  // Modal states
  const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);
  const [addFeedbackLoading, setAddFeedbackLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form state
  const [addFeedbackForm, setAddFeedbackForm] = useState({
    ticket_title: '',
    ticket_description: ''
  });

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch feedbacks data
  const fetchFeedbacks = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/get-tickets`,
        {
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
          status: status,
          s_id: user?.id,
          type: 1 // Pass type 1 for feedback
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data) {
        setFeedbacks(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching feedbacks:', error);
      toast.error('Failed to fetch feedbacks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, status]);

  // Delete feedback
  const handleDeleteFeedback = async () => {
    if (!feedbackToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/delete-tickets`,
        {
          ids: [feedbackToDelete],
          s_id: user?.id,
          type: 1 // Pass type 1 for feedback
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.status === true) {
        toast.success('Feedback deleted successfully!');
        setShowDeleteModal(false);
        setFeedbackToDelete(null);
        fetchFeedbacks();
      } else {
        toast.error('Failed to delete feedback: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error deleting feedback:', error);
      toast.error('Failed to delete feedback. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add new feedback
  const handleAddFeedback = async (form: { ticket_title: string; ticket_description: string }) => {
    setAddFeedbackLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/add-tickets`,
        {
          ticket_title: form.ticket_title,
          ticket_description: form.ticket_description,
          s_id: user?.id,
          type: 1 // Pass type 1 for feedback
        },
        {
          headers: {
            'Authorization': `Bearer ${user?.token}`,
            'accept': '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Feedback added successfully!');
        setShowAddFeedbackModal(false);
        setAddFeedbackForm({
          ticket_title: '',
          ticket_description: ''
        });
        fetchFeedbacks();
      } else {
        toast.error('Failed to add feedback: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error adding feedback:', error);
      toast.error('Failed to add feedback. Please try again.');
    } finally {
      setAddFeedbackLoading(false);
    }
  };

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters(prev => ({
      ...prev,
      search: searchValue,
      page: 0
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters(prev => ({
      ...prev,
      order: direction,
      orderBy: key,
      page: 0
    }));
  };

  const getSortIcon = (key: string) => {
    if (sort.key !== key) {
      return <FaSort className="text-gray-400" />;
    }
    if (sort.direction === 'asc') {
      return <FaSortUp className="text-gray-600" />;
    }
    return <FaSortDown className="text-gray-600" />;
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Open delete modal
  const handleOpenDeleteModal = (feedbackId: number) => {
    setFeedbackToDelete(feedbackId);
    setShowDeleteModal(true);
  };

  return (
    <>
     <BreadcrumbHeader 
            title="FeedBack" 
            paths={[
              { name: 'Dashboard', link: `/${user?.role}/dashboard` },
              { name: 'FeedBack', link: '#' }
            ]} 
          />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${showAddFeedbackModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Search Bar and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search feedbacks..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Add Feedback Button */}
            <button
              onClick={() => setShowAddFeedbackModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Feedback
            </button>
          </div>

          {/* Table with Loader */}
          <div className="shadow-md rounded-lg min-w-full relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
                <Loader />
              </div>
            )}
            
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    S.NO
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('created_by')}>
                    <div className="flex items-center">
                      Raised By {getSortIcon('created_by')}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('ticket_title')}>
                    <div className="flex items-center">
                      Feedback Title {getSortIcon('ticket_title')}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Feedback Description
                  </th>
                 
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback, index) => (
                    <tr key={feedback.ticket_id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {(filters.page * filters.rowsPerPage) + index + 1}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        {feedback.created_by}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {feedback.ticket_title}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                        <div className="line-clamp-2">
                          {feedback.ticket_description}
                        </div>
                      </td>
                     
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-600">No feedbacks found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {filters.search ? 'Try adjusting your search criteria' : `No ${status} feedbacks available`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {feedbacks.length > 0 && (
            <div className="mt-6">
              <Pagination
                currentPage={filters.page + 1}
                totalPages={Math.ceil(total / filters.rowsPerPage)}
                totalItems={total}
                rowsPerPage={filters.rowsPerPage}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddFeedbackModal
        isOpen={showAddFeedbackModal}
        onClose={() => setShowAddFeedbackModal(false)}
        onSubmit={handleAddFeedback}
        loading={addFeedbackLoading}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFeedbackToDelete(null);
        }}
        onConfirm={handleDeleteFeedback}
        title="Delete Feedback"
        message="Are you sure you want to delete this feedback? This action cannot be undone."
        loading={deleteLoading}
      />
    </>
  );
};

export default FeedbackTable;











// import React, { useState, useEffect, ReactNode } from 'react';
// import { MdRemoveRedEye, MdCheckCircle, MdOutlineCheckCircle, MdDeleteForever } from 'react-icons/md';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
// import toast from 'react-hot-toast';
// import FeedbackDetailsModal from './components/AddFeedbackModal';
// import AddFeedbackModal from './components/AddFeedbackModal';
// //import ResolveFeedbackModal from './ResolveFeedbackModal';

// // interface FeedbackTableProps {
// //   status: string;
// // }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// interface Feedback {
//   feedback_description: ReactNode;
//   feedback_title: ReactNode;
//   created_by: ReactNode;
//   feedback_id: number;
//   name: string;
//   email: string;
//   mobile: string;
//   subject: string;
//   message: string;
//   status: string;
//   created_at: string;
//   updated_at: string;
// }

// interface FeedbackDetails {
//   feedback_id: number;
//   feedback_title: string;
//   feedback_description: string;
//   status: string;
// }

// interface AddFeedbackForm {
//   feedback_description: any;
//   feedback_title: any;
// }

// interface ResolveFeedbackForm {
//   remark: string;
// }

// const FeedbackTable: React.FC<FeedbackTableProps> = ({ status }) => {
//   const { user } = useAuth();
//   const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'feedback_id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ key: 'feedback_id', direction: 'desc' as 'asc' | 'desc' });
  
//   // Modal states
//   const [showFeedbackModal, setShowFeedbackModal] = useState(false);
//   const [feedbackDetails, setFeedbackDetails] = useState<FeedbackDetails | null>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [showAddFeedbackModal, setShowAddFeedbackModal] = useState(false);
//   const [addFeedbackLoading, setAddFeedbackLoading] = useState(false);
//   const [showResolveModal, setShowResolveModal] = useState(false);
//   const [resolveFeedbackLoading, setResolveFeedbackLoading] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [feedbackToDelete, setFeedbackToDelete] = useState<number | null>(null);
//   const [deleteLoading, setDeleteLoading] = useState(false);

//   // Form states
//   const [addFeedbackForm, setAddFeedbackForm] = useState<AddFeedbackForm>({
//     feedback_title: '',
//     feedback_description: ''
//   });
//   const [resolveFeedbackForm, setResolveFeedbackForm] = useState<ResolveFeedbackForm>({
//     remark: ''
//   });
//   const [selectedFeedbackId, setSelectedFeedbackId] = useState<number | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;
//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch feedbacks data
//   const fetchFeedbacks = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/get-tickets`,
//         {
//           page: filters.page,
//           rowsPerPage: filters.rowsPerPage,
//           order: filters.order,
//           orderBy: filters.orderBy,
//           search: filters.search,
//           status: status,
//           s_id: user?.id,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data) {
//         setFeedbacks(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching feedbacks:', error);
//       toast.error('Failed to fetch feedbacks');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchFeedbacks();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, status]);

//   // Fetch feedback details
//   const fetchFeedbackDetails = async (feedbackId: number) => {
//     setLoadingDetails(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/get-tickets-Details`,
//         {
//           ticket_id: feedbackId,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.status === 'success') {
//         setFeedbackDetails(response.data.data);
//         setShowFeedbackModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching feedback details:', error);
//       toast.error('Failed to load feedback details');
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   // Delete feedback
//   const handleDeleteFeedback = async () => {
//     if (!feedbackToDelete) return;

//     setDeleteLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/delete-tickets`,
//         {
//           ids: [feedbackToDelete],
//           s_id: user?.id,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
          
//         }
//       );

//       if (response.data.status === true) {
//         toast.success('Feedback deleted successfully!');
//         setShowDeleteModal(false);
//         setFeedbackToDelete(null);
//         fetchFeedbacks();
//       } else {
//         toast.error('Failed to delete feedback: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error deleting feedback:', error);
//       toast.error('Failed to delete feedback. Please try again.');
//     } finally {
//       setDeleteLoading(false);
//     }
//   };

//   // Accept feedback (Open Feedbacks)
//   const handleAcceptFeedback = async (feedbackId: number) => {
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/accept-tickets`,
//         {
//           ticket_id: feedbackId,
//           s_id: user?.id,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.status === 'success') {
//         toast.success('Feedback accepted successfully!');
//         fetchFeedbacks();
//       } else {
//         toast.error('Failed to accept feedback: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error accepting feedback:', error);
//       toast.error('Failed to accept feedback. Please try again.');
//     }
//   };

//   // Resolve feedback (Accepted Feedbacks)
//   const handleResolveFeedback = async (form: ResolveFeedbackForm) => {
//     if (!selectedFeedbackId) return;

//     setResolveFeedbackLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/resolve-tickets`,
//         {
//           remark: form.remark,
//           ticket_id: selectedFeedbackId,
//           s_id: user?.id,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.status === true) {
//         toast.success('Feedback resolved successfully!');
//         setShowResolveModal(false);
//         setResolveFeedbackForm({ remark: '' });
//         setSelectedFeedbackId(null);
//         fetchFeedbacks();
//       } else {
//         toast.error('Failed to resolve feedback: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error resolving feedback:', error);
//       toast.error('Failed to resolve feedback. Please try again.');
//     } finally {
//       setResolveFeedbackLoading(false);
//     }
//   };

//   // Add new feedback
//   const handleAddFeedback = async (form: AddFeedbackForm) => {
//     setAddFeedbackLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/${user?.role}/Tickets/add-tickets`,
//         {
//           ticket_title: form.feedback_title,
//           ticket_description: form.feedback_description,
//           s_id: user?.id,
//           type: 1 // Type 1 for feedbacks
//         },
//         {
//           headers: {
//             'Authorization': `Bearer ${user?.token}`,
//             'accept': '/',
//             'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       if (response.data.success) {
//         toast.success('Feedback added successfully!');
//         setShowAddFeedbackModal(false);
//         setAddFeedbackForm({
//           feedback_title: '',
//           feedback_description: ''
//         });
//         fetchFeedbacks();
//       } else {
//         toast.error('Failed to add feedback: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error adding feedback:', error);
//       toast.error('Failed to add feedback. Please try again.');
//     } finally {
//       setAddFeedbackLoading(false);
//     }
//   };

//   // Handle view action
//   const handleViewFeedback = (feedbackId: number) => {
//     fetchFeedbackDetails(feedbackId);
//   };

//   // Handle search
//   const handleSearch = (searchValue: string) => {
//     setFilters(prev => ({
//       ...prev,
//       search: searchValue,
//       page: 0
//     }));
//   };

//   // Handle sort
//   const handleSort = (key: string) => {
//     const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
//     setSort({ key, direction });
//     setFilters(prev => ({
//       ...prev,
//       order: direction,
//       orderBy: key,
//       page: 0
//     }));
//   };

//   const getSortIcon = (key: string) => {
//     if (sort.key !== key) {
//       return <FaSort className="text-gray-400" />;
//     }
//     if (sort.direction === 'asc') {
//       return <FaSortUp className="text-gray-600" />;
//     }
//     return <FaSortDown className="text-gray-600" />;
//   };

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     setFilters(prev => ({ ...prev, page: page - 1 }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Handle view action
//   const handleViewTicket = (ticketId: number) => {
//     fetchFeedbackDetails(ticketId);
//   };

//   // Open resolve modal
//   const handleOpenResolveModal = (feedbackId: number) => {
//     setSelectedFeedbackId(feedbackId);
//     setShowResolveModal(true);
//   };

//   // Open delete modal
//   const handleOpenDeleteModal = (feedbackId: number) => {
//     setFeedbackToDelete(feedbackId);
//     setShowDeleteModal(true);
//   };

//   return (
//     <>
//       {/* Main Content */}
//       <div className={`transition-all duration-300 ${showFeedbackModal || showAddFeedbackModal || showResolveModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
//         <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
//           {/* Search Bar and Add Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search feedbacks..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
            
//             {/* Add Feedback Button */}
           
//               <button
//                 onClick={() => setShowAddFeedbackModal(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Feedback
//               </button>
            
//           </div>

//           {/* Table with Loader */}
//           <div className="shadow-md rounded-lg min-w-full relative">
//             {loading && (
//               <div className="absolute inset-0 bg-white bg-opacity-80 flex items-center justify-center z-10">
//                 <Loader />
//               </div>
//             )}
            
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th scope="col" className="w-12 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     S.NO
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('created_by')}>
//                     <div className="flex items-center">
//                       Raised By {getSortIcon('created_by')}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('ticket_title')}>
//                     <div className="flex items-center">
//                       Feedback Title {getSortIcon('ticket_title')}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Feedback Description
//                   </th>
//                   <th scope="col" className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {feedbacks.length > 0 ? (
//                   feedbacks.map((feedback, index) => {
//                     return (
//                       <tr key={feedback.feedback_id} className="hover:bg-gray-50">
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {(filters.page * filters.rowsPerPage) + index + 1}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {feedback.created_by}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {feedback.feedback_title}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
//                           <div className="line-clamp-2">
//                             {feedback.feedback_description}
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             {/* Eye Icon - View Details */}
//                             <button 
//                               className="text-blue-500 hover:text-blue-700 p-1"
//                               onClick={() => handleViewFeedback(feedback.feedback_id)}
//                               title="View Feedback Details"
//                             >
//                               <MdRemoveRedEye size={20} />
//                             </button>

//                             {/* Green Check Icon - For Open Feedbacks */}
//                             {status === 'open' && (user?.role === "SuperAdmin" || user?.role === "SupportAdmin") && (
//                               <button 
//                                 className="text-green-500 hover:text-green-700 p-1"
//                                 onClick={() => handleAcceptFeedback(feedback.feedback_id)}
//                                 title="Accept Feedback"
//                               >
//                                 <MdCheckCircle size={20} />
//                               </button>
//                             )}

//                             {/* Blue Check Icon - For Accepted Feedbacks */}
//                             {status === 'accepted' && (
//                               <button 
//                                 className="text-blue-500 hover:text-blue-700 p-1"
//                                 onClick={() => handleOpenResolveModal(feedback.feedback_id)}
//                                 title="Resolve Feedback"
//                               >
//                                 <MdOutlineCheckCircle size={20} />
//                               </button>
//                             )}

//                             {/* Delete Icon - For All Tables */}
//                             <button 
//                               className="text-red-500 hover:text-red-700 p-1"
//                               onClick={() => handleOpenDeleteModal(feedback.feedback_id)}
//                               title="Delete Feedback"
//                             >
//                               <MdDeleteForever size={20} />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <p className="text-lg font-medium text-gray-600">No feedbacks found</p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {filters.search ? 'Try adjusting your search criteria' : `No ${status} feedbacks available`}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {feedbacks.length > 0 && (
//             <div className="mt-6">
//               <Pagination
//                 currentPage={filters.page + 1}
//                 totalPages={Math.ceil(total / filters.rowsPerPage)}
//                 totalItems={total}
//                 rowsPerPage={filters.rowsPerPage}
//                 onPageChange={handlePageChange}
//                 onRowsPerPageChange={handleRowsPerPageChange}
//               />
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Modals */}
//       {/* <FeedbackDetailsModal
//         isOpen={showFeedbackModal}
//         onClose={() => {
//           setShowFeedbackModal(false);
//           setFeedbackDetails(null);
//         }}
//         feedbackDetails={feedbackDetails}
//         loading={loadingDetails}
//       /> */}

//       <AddFeedbackModal
//         isOpen={showAddFeedbackModal}
//         onClose={() => setShowAddFeedbackModal(false)}
//         onSubmit={handleAddFeedback}
//         loading={addFeedbackLoading}
//       />

//       {/* <ResolveFeedbackModal
//         isOpen={showResolveModal}
//         onClose={() => {
//           setShowResolveModal(false);
//           setSelectedFeedbackId(null);
//         }}
//         onSubmit={handleResolveFeedback}
//         loading={resolveFeedbackLoading}
//       /> */}

//       <DeleteConfirmationModal
//         isOpen={showDeleteModal}
//         onClose={() => {
//           setShowDeleteModal(false);
//           setFeedbackToDelete(null);
//         }}
//         onConfirm={handleDeleteFeedback}
//         title="Delete Feedback"
//         message="Are you sure you want to delete this feedback? This action cannot be undone."
//         loading={deleteLoading}
//       />
//     </>
//   );
// };

// export default FeedbackTable;