// import React, { useState, useEffect } from 'react';
// import { MdRemoveRedEye, MdCheckCircle, MdOutlineCheckCircle } from 'react-icons/md';
// import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
// import axios from 'axios';
// import Loader from 'src/Frontend/Common/Loader';
// import { useDebounce } from 'src/hook/useDebounce';
// import { useAuth } from 'src/hook/useAuth';
// import { Pagination } from 'src/Frontend/Common/Pagination';
// import toast from 'react-hot-toast';

// interface Ticket {
//   ticket_id: number;
//   ticket_title: string;
//   ticket_description: string;
//   priority: 'low' | 'medium' | 'high';
//   status: 'open' | 'accepted' | 'resolved';
//   created_by: string;
// }

// interface TicketDetails {
//   ticket_id: number;
//   ticket_title: string;
//   ticket_description: string;
//   status: string;
//   priority: string;
//   created_by: string;
//   accepted_by: string;
//   resolve_by: string;
//   accepted_at: string | null;
//   resolve_at: string | null;
//   resolve_remark: string;
//   created_at: string;
// }

// interface TicketTableProps {
//   status: 'open' | 'accepted' | 'resolved';
// }

// interface Filters {
//   page: number;
//   rowsPerPage: number;
//   order: 'asc' | 'desc';
//   orderBy: string;
//   search: string;
// }

// interface AddTicketForm {
//   ticket_title: string;
//   priority: 'low' | 'medium' | 'high' | '';
//   ticket_description: string;
// }

// interface ResolveTicketForm {
//   remark: string;
// }

// const TicketTable: React.FC<TicketTableProps> = ({ status }) => {
//   const { user } = useAuth();
//   const [tickets, setTickets] = useState<Ticket[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [filters, setFilters] = useState<Filters>({
//     page: 0,
//     rowsPerPage: 10,
//     order: 'desc',
//     orderBy: 'ticket_id',
//     search: '',
//   });
//   const [total, setTotal] = useState(0);
//   const [sort, setSort] = useState({ key: 'ticket_id', direction: 'desc' as 'asc' | 'desc' });
//   const [showTicketModal, setShowTicketModal] = useState(false);
//   const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
//   const [loadingDetails, setLoadingDetails] = useState(false);
//   const [showAddTicketModal, setShowAddTicketModal] = useState(false);
//   const [addTicketLoading, setAddTicketLoading] = useState(false);
//   const [addTicketForm, setAddTicketForm] = useState<AddTicketForm>({
//     ticket_title: '',
//     priority: '',
//     ticket_description: ''
//   });
//   const [showResolveModal, setShowResolveModal] = useState(false);
//   const [resolveTicketLoading, setResolveTicketLoading] = useState(false);
//   const [resolveTicketForm, setResolveTicketForm] = useState<ResolveTicketForm>({
//     remark: ''
//   });
//   const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

//   const apiUrl = import.meta.env.VITE_API_URL;

//   const debouncedSearch = useDebounce(filters.search, 500);

//   // Fetch tickets data
//   const fetchTickets = async () => {
//     setLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Tickets/get-tickets`,
//         {
//           page: filters.page,
//           rowsPerPage: filters.rowsPerPage,
//           order: filters.order,
//           orderBy: filters.orderBy,
//           search: filters.search,
//           status: status,
//           s_id: user?.id
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
//         setTickets(response.data.rows || []);
//         setTotal(response.data.total || 0);
//       }
//     } catch (error) {
//       console.error('Error fetching tickets:', error);
//       toast.error('Failed to fetch tickets');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTickets();
//   }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, status]);

//   // Fetch ticket details
//   const fetchTicketDetails = async (ticketId: number) => {
//     setLoadingDetails(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Tickets/get-tickets-Details`,
//         {
//           ticket_id: ticketId
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
//         setTicketDetails(response.data.data);
//         setShowTicketModal(true);
//       }
//     } catch (error) {
//       console.error('Error fetching ticket details:', error);
//       toast.error('Failed to load ticket details');
//     } finally {
//       setLoadingDetails(false);
//     }
//   };

//   // Accept ticket (Open Tickets)
//   const handleAcceptTicket = async (ticketId: number) => {
//     if (!confirm('Are you sure you want to accept this ticket?')) {
//       return;
//     }

//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Tickets/accept-tickets`,
//         {
//           ticket_id: ticketId,
//           s_id: user?.id
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
//         toast.success('Ticket accepted successfully!');
//         // Refresh tickets list
//         fetchTickets();
//       } else {
//         toast.error('Failed to accept ticket: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error accepting ticket:', error);
//       toast.error('Failed to accept ticket. Please try again.');
//     }
//   };

//   // Resolve ticket (Accepted Tickets)
//   const handleResolveTicket = async () => {
//     if (!selectedTicketId) return;

//     if (!resolveTicketForm.remark.trim()) {
//       toast.error('Please enter resolution remark');
//       return;
//     }

//     setResolveTicketLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Tickets/resolve-tickets`,
//         {
//           remark: resolveTicketForm.remark,
//           ticket_id: selectedTicketId,
//           s_id: user?.id
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
//         toast.success('Ticket resolved successfully!');
//         setShowResolveModal(false);
//         setResolveTicketForm({ remark: '' });
//         setSelectedTicketId(null);
//         // Refresh tickets list
//         fetchTickets();
//       } else {
//         toast.error('Failed to resolve ticket: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error resolving ticket:', error);
//       toast.error('Failed to resolve ticket. Please try again.');
//     } finally {
//       setResolveTicketLoading(false);
//     }
//   };

//   // Open resolve modal
//   const handleOpenResolveModal = (ticketId: number) => {
//     setSelectedTicketId(ticketId);
//     setShowResolveModal(true);
//   };

//   // Close resolve modal
//   const handleCloseResolveModal = () => {
//     setShowResolveModal(false);
//     setResolveTicketForm({ remark: '' });
//     setSelectedTicketId(null);
//   };

//   // Add new ticket
//   const handleAddTicket = async () => {
//     // Validation
//     if (!addTicketForm.ticket_title.trim()) {
//       toast.error('Please enter ticket title');
//       return;
//     }
//     if (!addTicketForm.priority) {
//       toast.error('Please select priority');
//       return;
//     }
//     if (!addTicketForm.ticket_description.trim()) {
//       toast.error('Please enter ticket description');
//       return;
//     }

//     setAddTicketLoading(true);
//     try {
//       const response = await axios.post(
//         `${apiUrl}/SuperAdmin/Tickets/add-tickets`,
//         {
//           ticket_title: addTicketForm.ticket_title,
//           priority: addTicketForm.priority,
//           ticket_description: addTicketForm.ticket_description,
//           s_id: user?.id
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
//         toast.success('Ticket added successfully!');
//         setShowAddTicketModal(false);
//         setAddTicketForm({
//           ticket_title: '',
//           priority: '',
//           ticket_description: ''
//         });
//         // Refresh tickets list
//         fetchTickets();
//       } else {
//         toast.error('Failed to add ticket: ' + response.data.message);
//       }
//     } catch (error: any) {
//       console.error('Error adding ticket:', error);
//       toast.error('Failed to add ticket. Please try again.');
//     } finally {
//       setAddTicketLoading(false);
//     }
//   };

//   // Handle view action
//   const handleViewTicket = (ticketId: number) => {
//     fetchTicketDetails(ticketId);
//   };

//   // Close modals
//   const handleCloseModal = () => {
//     setShowTicketModal(false);
//     setTicketDetails(null);
//   };

//   const handleCloseAddTicketModal = () => {
//     setShowAddTicketModal(false);
//     setAddTicketForm({
//       ticket_title: '',
//       priority: '',
//       ticket_description: ''
//     });
//   };

//   // Handle form input changes
//   const handleInputChange = (field: keyof AddTicketForm, value: string) => {
//     setAddTicketForm(prev => ({
//       ...prev,
//       [field]: value
//     }));
//   };

//   const handleResolveInputChange = (value: string) => {
//     setResolveTicketForm({ remark: value });
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
//     setFilters(prev => ({ ...prev, page }));
//   };

//   // Handle rows per page change
//   const handleRowsPerPageChange = (rowsPerPage: number) => {
//     setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
//   };

//   // Get priority color
//   const getPriorityInfo = (priority: string) => {
//     switch (priority) {
//       case 'high':
//         return {
//           color: 'text-red-600',
//           bgColor: 'bg-red-100'
//         };
//       case 'medium':
//         return {
//           color: 'text-yellow-600',
//           bgColor: 'bg-yellow-100'
//         };
//       case 'low':
//         return {
//           color: 'text-green-600',
//           bgColor: 'bg-green-100'
//         };
//       default:
//         return {
//           color: 'text-gray-600',
//           bgColor: 'bg-gray-100'
//         };
//     }
//   };

//   // Format date
//   const formatDate = (dateString: string | null) => {
//     if (!dateString) return 'N/A';
//     return new Date(dateString).toLocaleString('en-IN', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   if (loading) {
//     return <Loader />;
//   }

//   return (
//     <>
//       {/* Main Content with Conditional Blur */}
//       <div className={`transition-all duration-300 ${showTicketModal || showAddTicketModal || showResolveModal ? 'blur-sm pointer-events-none' : ''}`}>
//         <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
//           {/* Search Bar and Add Button */}
//           <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//             <div className="relative w-full sm:w-64">
//               <input
//                 type="text"
//                 placeholder="Search tickets..."
//                 value={filters.search}
//                 onChange={(e) => handleSearch(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               />
//               <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//               </svg>
//             </div>
            
//             {/* Add Ticket Button - Only show for Open Tickets */}
//             {status === 'open' && (
//               <button
//                 onClick={() => setShowAddTicketModal(true)}
//                 className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//                 </svg>
//                 Add Ticket
//               </button>
//             )}
//           </div>

//           {/* Table */}
//           <div className="shadow-md rounded-lg min-w-full">
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
//                       Ticket Title {getSortIcon('ticket_title')}
//                     </div>
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Ticket Description
//                   </th>
//                   <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('priority')}>
//                     <div className="flex items-center">
//                       Priority {getSortIcon('priority')}
//                     </div>
//                   </th>
//                   <th scope="col" className="w-32 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Action
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {tickets.length > 0 ? (
//                   tickets.map((ticket, index) => {
//                     const priorityInfo = getPriorityInfo(ticket.priority);
//                     return (
//                       <tr key={ticket.ticket_id} className="hover:bg-gray-50">
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {(filters.page * filters.rowsPerPage) + index + 1}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {ticket.created_by}
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                           {ticket.ticket_title}
//                         </td>
//                         <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
//                           <div className="line-clamp-2">
//                             {ticket.ticket_description}
//                           </div>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm">
//                           <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.color}`}>
//                             {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
//                           </span>
//                         </td>
//                         <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
//                           <div className="flex items-center space-x-2">
//                             {/* Eye Icon - View Details */}
//                             <button 
//                               className="text-blue-500 hover:text-blue-700 p-1"
//                               onClick={() => handleViewTicket(ticket.ticket_id)}
//                               title="View Ticket Details"
//                             >
//                               <MdRemoveRedEye size={20} />
//                             </button>

//                             {/* Green Check Icon - For Open Tickets */}
//                             {status === 'open' && (
//                               <button 
//                                 className="text-green-500 hover:text-green-700 p-1"
//                                 onClick={() => handleAcceptTicket(ticket.ticket_id)}
//                                 title="Accept Ticket"
//                               >
//                                 <MdCheckCircle size={20} />
//                               </button>
//                             )}

//                             {/* Blue Check Icon - For Accepted Tickets */}
//                             {status === 'accepted' && (
//                               <button 
//                                 className="text-blue-500 hover:text-blue-700 p-1"
//                                 onClick={() => handleOpenResolveModal(ticket.ticket_id)}
//                                 title="Resolve Ticket"
//                               >
//                                 <MdOutlineCheckCircle size={20} />
//                               </button>
//                             )}
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })
//                 ) : (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
//                       <div className="flex flex-col items-center justify-center">
//                         <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <p className="text-lg font-medium text-gray-600">No tickets found</p>
//                         <p className="text-sm text-gray-500 mt-1">
//                           {filters.search ? 'Try adjusting your search criteria' : `No ${status} tickets available`}
//                         </p>
//                       </div>
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>

//           {/* Pagination */}
//           {tickets.length > 0 && (
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

//       {/* Ticket Details Modal */}
//       {showTicketModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
//             onClick={handleCloseModal}
//           />
          
//           <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
//               <h2 className="text-xl font-semibold text-gray-800">Ticket Details</h2>
//               <button
//                 onClick={handleCloseModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6">
//               {loadingDetails ? (
//                 <div className="flex justify-center items-center py-8">
//                   <Loader />
//                 </div>
//               ) : ticketDetails ? (
//                 <div className="space-y-6">
//                   {/* Status and Priority */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         ticketDetails.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
//                         ticketDetails.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {ticketDetails.status.charAt(0).toUpperCase() + ticketDetails.status.slice(1)}
//                       </span>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
//                       <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                         ticketDetails.priority === 'high' ? 'bg-red-100 text-red-800' :
//                         ticketDetails.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
//                         'bg-green-100 text-green-800'
//                       }`}>
//                         {ticketDetails.priority.charAt(0).toUpperCase() + ticketDetails.priority.slice(1)}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Title */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Ticket Title</label>
//                     <p className="text-gray-900 font-medium text-lg">{ticketDetails.ticket_title}</p>
//                   </div>

//                   {/* Description */}
//                   <div>
//                     <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
//                     <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                       <p className="text-gray-900 whitespace-pre-wrap">{ticketDetails.ticket_description}</p>
//                     </div>
//                   </div>

//                   {/* Created Info */}
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Raised By</label>
//                       <p className="text-gray-900 font-medium">{ticketDetails.created_by}</p>
//                     </div>
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
//                       <p className="text-gray-900">{formatDate(ticketDetails.created_at)}</p>
//                     </div>
//                   </div>

//                   {/* Accepted Info - Conditional */}
//                   {ticketDetails.accepted_by && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Accepted By</label>
//                         <p className="text-gray-900 font-medium">{ticketDetails.accepted_by}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Accepted At</label>
//                         <p className="text-gray-900">{formatDate(ticketDetails.accepted_at)}</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Resolved Info - Conditional */}
//                   {ticketDetails.resolve_by && (
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Resolved By</label>
//                         <p className="text-gray-900 font-medium">{ticketDetails.resolve_by}</p>
//                       </div>
//                       <div>
//                         <label className="block text-sm font-medium text-gray-600 mb-1">Resolved At</label>
//                         <p className="text-gray-900">{formatDate(ticketDetails.resolve_at)}</p>
//                       </div>
//                     </div>
//                   )}

//                   {/* Resolution Remark - Always Show if Available */}
//                   {ticketDetails.resolve_remark && (
//                     <div>
//                       <label className="block text-sm font-medium text-gray-600 mb-1">Resolution Remark</label>
//                       <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
//                         <p className="text-gray-900 whitespace-pre-wrap">{ticketDetails.resolve_remark}</p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ) : (
//                 <div className="text-center py-8 text-gray-500">
//                   <p>Unable to load ticket details</p>
//                 </div>
//               )}
//             </div>

//             <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white">
//               <button
//                 onClick={handleCloseModal}
//                 className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Add Ticket Modal */}
//       {showAddTicketModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
//             onClick={handleCloseAddTicketModal}
//           />
          
//           <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
//               <h2 className="text-xl font-semibold text-gray-800">Add Ticket</h2>
//               <button
//                 onClick={handleCloseAddTicketModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 {/* Ticket Title */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Ticket Title <span className="text-red-500">*</span>
//                   </label>
//                   <input
//                     type="text"
//                     value={addTicketForm.ticket_title}
//                     onChange={(e) => handleInputChange('ticket_title', e.target.value)}
//                     placeholder="Enter ticket title"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   />
//                 </div>

//                 {/* Priority Dropdown */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Priority <span className="text-red-500">*</span>
//                   </label>
//                   <select
//                     value={addTicketForm.priority}
//                     onChange={(e) => handleInputChange('priority', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   >
//                     <option value="">Select priority</option>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                   </select>
//                 </div>

//                 {/* Ticket Description */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Ticket Description <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={addTicketForm.ticket_description}
//                     onChange={(e) => handleInputChange('ticket_description', e.target.value)}
//                     placeholder="Enter ticket description"
//                     rows={4}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white gap-3">
//               <button
//                 onClick={handleCloseAddTicketModal}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleAddTicket}
//                 disabled={addTicketLoading}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {addTicketLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Adding...
//                   </>
//                 ) : (
//                   'Submit'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Resolve Ticket Modal */}
//       {showResolveModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//           <div 
//             className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
//             onClick={handleCloseResolveModal}
//           />
          
//           <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10">
//             <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
//               <h2 className="text-xl font-semibold text-gray-800">Resolve Ticket</h2>
//               <button
//                 onClick={handleCloseResolveModal}
//                 className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
//               >
//                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <div className="p-6">
//               <div className="space-y-4">
//                 {/* Resolution Remark */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Resolution Remark <span className="text-red-500">*</span>
//                   </label>
//                   <textarea
//                     value={resolveTicketForm.remark}
//                     onChange={(e) => handleResolveInputChange(e.target.value)}
//                     placeholder="Enter resolution remark"
//                     rows={4}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white gap-3">
//               <button
//                 onClick={handleCloseResolveModal}
//                 className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleResolveTicket}
//                 disabled={resolveTicketLoading}
//                 className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//               >
//                 {resolveTicketLoading ? (
//                   <>
//                     <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                     Submitting...
//                   </>
//                 ) : (
//                   'Submit'
//                 )}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default TicketTable;
























import React, { useState, useEffect } from 'react';
import { MdRemoveRedEye, MdCheckCircle, MdOutlineCheckCircle, MdDelete } from 'react-icons/md';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import toast from 'react-hot-toast';

interface Ticket {
  ticket_id: number;
  ticket_title: string;
  ticket_description: string;
  priority: 'low' | 'medium' | 'high';
  status: 'open' | 'accepted' | 'resolved';
  created_by: string;
}

interface TicketDetails {
  ticket_id: number;
  ticket_title: string;
  ticket_description: string;
  status: string;
  priority: string;
  created_by: string;
  accepted_by: string;
  resolve_by: string;
  accepted_at: string | null;
  resolve_at: string | null;
  resolve_remark: string;
  created_at: string;
}

interface TicketTableProps {
  status: 'open' | 'accepted' | 'resolved';
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

interface AddTicketForm {
  ticket_title: string;
  priority: 'low' | 'medium' | 'high' | '';
  ticket_description: string;
}

interface ResolveTicketForm {
  remark: string;
}

const TicketTable: React.FC<TicketTableProps> = ({ status }) => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
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
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [addTicketLoading, setAddTicketLoading] = useState(false);
  const [addTicketForm, setAddTicketForm] = useState<AddTicketForm>({
    ticket_title: '',
    priority: '',
    ticket_description: ''
  });
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveTicketLoading, setResolveTicketLoading] = useState(false);
  const [resolveTicketForm, setResolveTicketForm] = useState<ResolveTicketForm>({
    remark: ''
  });
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch tickets data
  const fetchTickets = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/get-tickets`,
        {
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
          status: status,
          s_id: user?.id
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
        setTickets(response.data.rows || []);
        setTotal(response.data.total || 0);
      }
    } catch (error) {
      console.error('Error fetching tickets:', error);
      toast.error('Failed to fetch tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch, status]);

  // Fetch ticket details
  const fetchTicketDetails = async (ticketId: number) => {
    setLoadingDetails(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/get-tickets-Details`,
        {
          ticket_id: ticketId
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

      if (response.data.status === 'success') {
        setTicketDetails(response.data.data);
        setShowTicketModal(true);
      }
    } catch (error) {
      console.error('Error fetching ticket details:', error);
      toast.error('Failed to load ticket details');
    } finally {
      setLoadingDetails(false);
    }
  };

  // Delete ticket
  const handleDeleteTicket = async () => {
    if (!ticketToDelete) return;

    setDeleteLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/delete-tickets`,
        {
          ids: [ticketToDelete],
          s_id: user?.id
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
        toast.success('Ticket deleted successfully!');
        setShowDeleteModal(false);
        setTicketToDelete(null);
        // Refresh tickets list
        fetchTickets();
      } else {
        toast.error('Failed to delete ticket: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket. Please try again.');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Open delete confirmation modal
  const handleOpenDeleteModal = (ticketId: number) => {
    setTicketToDelete(ticketId);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setTicketToDelete(null);
  };

  // Accept ticket (Open Tickets)
  const handleAcceptTicket = async (ticketId: number) => {
    if (!confirm('Are you sure you want to accept this ticket?')) {
      return;
    }

    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/accept-tickets`,
        {
          ticket_id: ticketId,
          s_id: user?.id
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

      if (response.data.status === 'success') {
        toast.success('Ticket accepted successfully!');
        // Refresh tickets list
        fetchTickets();
      } else {
        toast.error('Failed to accept ticket: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error accepting ticket:', error);
      toast.error('Failed to accept ticket. Please try again.');
    }
  };

  // Resolve ticket (Accepted Tickets)
  const handleResolveTicket = async () => {
    if (!selectedTicketId) return;

    if (!resolveTicketForm.remark.trim()) {
      toast.error('Please enter resolution remark');
      return;
    }

    setResolveTicketLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/resolve-tickets`,
        {
          remark: resolveTicketForm.remark,
          ticket_id: selectedTicketId,
          s_id: user?.id
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
        toast.success('Ticket resolved successfully!');
        setShowResolveModal(false);
        setResolveTicketForm({ remark: '' });
        setSelectedTicketId(null);
        // Refresh tickets list
        fetchTickets();
      } else {
        toast.error('Failed to resolve ticket: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error resolving ticket:', error);
      toast.error('Failed to resolve ticket. Please try again.');
    } finally {
      setResolveTicketLoading(false);
    }
  };

  // Open resolve modal
  const handleOpenResolveModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setShowResolveModal(true);
  };

  // Close resolve modal
  const handleCloseResolveModal = () => {
    setShowResolveModal(false);
    setResolveTicketForm({ remark: '' });
    setSelectedTicketId(null);
  };

  // Add new ticket
  const handleAddTicket = async () => {
    // Validation
    if (!addTicketForm.ticket_title.trim()) {
      toast.error('Please enter ticket title');
      return;
    }
    if (!addTicketForm.priority) {
      toast.error('Please select priority');
      return;
    }
    if (!addTicketForm.ticket_description.trim()) {
      toast.error('Please enter ticket description');
      return;
    }

    setAddTicketLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/Tickets/add-tickets`,
        {
          ticket_title: addTicketForm.ticket_title,
          priority: addTicketForm.priority,
          ticket_description: addTicketForm.ticket_description,
          s_id: user?.id
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
        toast.success('Ticket added successfully!');
        setShowAddTicketModal(false);
        setAddTicketForm({
          ticket_title: '',
          priority: '',
          ticket_description: ''
        });
        // Refresh tickets list
        fetchTickets();
      } else {
        toast.error('Failed to add ticket: ' + response.data.message);
      }
    } catch (error: any) {
      console.error('Error adding ticket:', error);
      toast.error('Failed to add ticket. Please try again.');
    } finally {
      setAddTicketLoading(false);
    }
  };

  // Handle view action
  const handleViewTicket = (ticketId: number) => {
    fetchTicketDetails(ticketId);
  };

  // Close modals
  const handleCloseModal = () => {
    setShowTicketModal(false);
    setTicketDetails(null);
  };

  const handleCloseAddTicketModal = () => {
    setShowAddTicketModal(false);
    setAddTicketForm({
      ticket_title: '',
      priority: '',
      ticket_description: ''
    });
  };

  // Handle form input changes
  const handleInputChange = (field: keyof AddTicketForm, value: string) => {
    setAddTicketForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleResolveInputChange = (value: string) => {
    setResolveTicketForm({ remark: value });
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
    setFilters(prev => ({ ...prev, page }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Get priority color
  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case 'high':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-100'
        };
      case 'medium':
        return {
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100'
        };
      case 'low':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        };
    }
  };

  // Format date
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Main Content with Conditional Blur */}
      <div className={`transition-all duration-300 ${showTicketModal || showAddTicketModal || showResolveModal || showDeleteModal ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="p-4 bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Search Bar and Add Button */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search tickets..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Add Ticket Button - Only show for Open Tickets */}
            {status === 'open' && (
              <button
                onClick={() => setShowAddTicketModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors whitespace-nowrap"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Ticket
              </button>
            )}
          </div>

          {/* Table */}
          <div className="shadow-md rounded-lg min-w-full">
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
                      Ticket Title {getSortIcon('ticket_title')}
                    </div>
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Description
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none" onClick={() => handleSort('priority')}>
                    <div className="flex items-center">
                      Priority {getSortIcon('priority')}
                    </div>
                  </th>
                  <th scope="col" className="w-40 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tickets.length > 0 ? (
                  tickets.map((ticket, index) => {
                    const priorityInfo = getPriorityInfo(ticket.priority);
                    return (
                      <tr key={ticket.ticket_id} className="hover:bg-gray-50">
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {(filters.page * filters.rowsPerPage) + index + 1}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                          {ticket.created_by}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {ticket.ticket_title}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500 max-w-xs">
                          <div className="line-clamp-2">
                            {ticket.ticket_description}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${priorityInfo.bgColor} ${priorityInfo.color}`}>
                            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                          </span>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {/* Eye Icon - View Details */}
                            <button 
                              className="text-blue-500 hover:text-blue-700 p-1"
                              onClick={() => handleViewTicket(ticket.ticket_id)}
                              title="View Ticket Details"
                            >
                              <MdRemoveRedEye size={20} />
                            </button>

                            {/* Green Check Icon - For Open Tickets */}
                            {status === 'open' && (
                              <button 
                                className="text-green-500 hover:text-green-700 p-1"
                                onClick={() => handleAcceptTicket(ticket.ticket_id)}
                                title="Accept Ticket"
                              >
                                <MdCheckCircle size={20} />
                              </button>
                            )}

                            {/* Blue Check Icon - For Accepted Tickets */}
                            {status === 'accepted' && (
                              <button 
                                className="text-blue-500 hover:text-blue-700 p-1"
                                onClick={() => handleOpenResolveModal(ticket.ticket_id)}
                                title="Resolve Ticket"
                              >
                                <MdOutlineCheckCircle size={20} />
                              </button>
                            )}

                            {/* Delete Icon - For All Tables */}
                            <button 
                              className="text-red-500 hover:text-red-700 p-1"
                              onClick={() => handleOpenDeleteModal(ticket.ticket_id)}
                              title="Delete Ticket"
                            >
                              <MdDelete size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-lg font-medium text-gray-600">No tickets found</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {filters.search ? 'Try adjusting your search criteria' : `No ${status} tickets available`}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {tickets.length > 0 && (
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

      {/* Ticket Details Modal */}
      {showTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={handleCloseModal}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Ticket Details</h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {loadingDetails ? (
                <div className="flex justify-center items-center py-8">
                  <Loader />
                </div>
              ) : ticketDetails ? (
                <div className="space-y-6">
                  {/* Status and Priority */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        ticketDetails.status === 'open' ? 'bg-yellow-100 text-yellow-800' :
                        ticketDetails.status === 'accepted' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticketDetails.status.charAt(0).toUpperCase() + ticketDetails.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Priority</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        ticketDetails.priority === 'high' ? 'bg-red-100 text-red-800' :
                        ticketDetails.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {ticketDetails.priority.charAt(0).toUpperCase() + ticketDetails.priority.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ticket Title</label>
                    <p className="text-gray-900 font-medium text-lg">{ticketDetails.ticket_title}</p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <p className="text-gray-900 whitespace-pre-wrap">{ticketDetails.ticket_description}</p>
                    </div>
                  </div>

                  {/* Created Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Raised By</label>
                      <p className="text-gray-900 font-medium">{ticketDetails.created_by}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Created At</label>
                      <p className="text-gray-900">{formatDate(ticketDetails.created_at)}</p>
                    </div>
                  </div>

                  {/* Accepted Info - Conditional */}
                  {ticketDetails.accepted_by && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Accepted By</label>
                        <p className="text-gray-900 font-medium">{ticketDetails.accepted_by}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Accepted At</label>
                        <p className="text-gray-900">{formatDate(ticketDetails.accepted_at)}</p>
                      </div>
                    </div>
                  )}

                  {/* Resolved Info - Conditional */}
                  {ticketDetails.resolve_by && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Resolved By</label>
                        <p className="text-gray-900 font-medium">{ticketDetails.resolve_by}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">Resolved At</label>
                        <p className="text-gray-900">{formatDate(ticketDetails.resolve_at)}</p>
                      </div>
                    </div>
                  )}

                  {/* Resolution Remark - Always Show if Available */}
                  {ticketDetails.resolve_remark && (
                    <div>
                      <label className="block text-sm font-medium text-gray-600 mb-1">Resolution Remark</label>
                      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                        <p className="text-gray-900 whitespace-pre-wrap">{ticketDetails.resolve_remark}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Unable to load ticket details</p>
                </div>
              )}
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white">
              <button
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Ticket Modal */}
      {showAddTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={handleCloseAddTicketModal}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Add Ticket</h2>
              <button
                onClick={handleCloseAddTicketModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Ticket Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={addTicketForm.ticket_title}
                    onChange={(e) => handleInputChange('ticket_title', e.target.value)}
                    placeholder="Enter ticket title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Priority Dropdown */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={addTicketForm.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select priority</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Ticket Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ticket Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={addTicketForm.ticket_description}
                    onChange={(e) => handleInputChange('ticket_description', e.target.value)}
                    placeholder="Enter ticket description"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white gap-3">
              <button
                onClick={handleCloseAddTicketModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTicket}
                disabled={addTicketLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {addTicketLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resolve Ticket Modal */}
      {showResolveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={handleCloseResolveModal}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Resolve Ticket</h2>
              <button
                onClick={handleCloseResolveModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {/* Resolution Remark */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Resolution Remark <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={resolveTicketForm.remark}
                    onChange={(e) => handleResolveInputChange(e.target.value)}
                    placeholder="Enter resolution remark"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white gap-3">
              <button
                onClick={handleCloseResolveModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleResolveTicket}
                disabled={resolveTicketLoading}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {resolveTicketLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"
            onClick={handleCloseDeleteModal}
          />
          
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto z-10">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-xl font-semibold text-gray-800">Delete Ticket</h2>
              <button
                onClick={handleCloseDeleteModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <MdDelete className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Delete Ticket</h3>
                <p className="text-sm text-gray-500">
                  Are you sure you want to delete this ticket? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex justify-end p-6 border-t border-gray-200 sticky bottom-0 bg-white gap-3">
              <button
                onClick={handleCloseDeleteModal}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTicket}
                disabled={deleteLoading}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {deleteLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TicketTable;