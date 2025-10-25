import React, { useState, useEffect, ReactNode } from 'react';
import { MdRemoveRedEye, MdCheckCircle, MdOutlineCheckCircle, MdDeleteForever } from 'react-icons/md';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import { useAuth } from 'src/hook/useAuth';
import { Pagination } from 'src/Frontend/Common/Pagination';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import toast from 'react-hot-toast';
import TicketDetailsModal from './TicketDetailsModal';
import AddTicketModal from './AddTicketModal';
import ResolveTicketModal from './ResolveTicketModal';

interface TicketTableProps {
  status: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

interface Ticket {
  ticket_description: ReactNode;
  ticket_title: ReactNode;
  created_by: ReactNode;
  priority: string;
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

interface TicketDetails {
  ticket_id: number;
  ticket_title: string;
  ticket_description: string;
  status: string;
  priority: string;
  // created_by: string;
  // accepted_by: string;
  // resolve_by: string;
  // accepted_at: string | null;
  // resolve_at: string | null;
  // resolve_remark: string;
  // created_at: string;
}

interface AddTicketForm {
  ticket_description: any;
  ticket_title: any;
  priority: string;
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
  
  // Modal states
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [ticketDetails, setTicketDetails] = useState<TicketDetails | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showAddTicketModal, setShowAddTicketModal] = useState(false);
  const [addTicketLoading, setAddTicketLoading] = useState(false);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [resolveTicketLoading, setResolveTicketLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Form states
  const [addTicketForm, setAddTicketForm] = useState<AddTicketForm>({
    ticket_title: '',
    priority: '',
    ticket_description: ''
  });
  const [resolveTicketForm, setResolveTicketForm] = useState<ResolveTicketForm>({
    remark: ''
  });
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL;
  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch tickets data
  const fetchTickets = async () => {
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
        `${apiUrl}/${user?.role}/Tickets/get-tickets-Details`,
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
        `${apiUrl}/${user?.role}/Tickets/delete-tickets`,
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

  // Accept ticket (Open Tickets)
  const handleAcceptTicket = async (ticketId: number) => {
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/accept-tickets`,
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
  const handleResolveTicket = async (form: ResolveTicketForm) => {
    if (!selectedTicketId) return;

    setResolveTicketLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/resolve-tickets`,
        {
          remark: form.remark,
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

  // Add new ticket
  const handleAddTicket = async (form: AddTicketForm) => {
    setAddTicketLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Tickets/add-tickets`,
        {
          ticket_title: form.ticket_title,
          priority: form.priority,
          ticket_description: form.ticket_description,
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

  // Open resolve modal
  const handleOpenResolveModal = (ticketId: number) => {
    setSelectedTicketId(ticketId);
    setShowResolveModal(true);
  };

  // Open delete modal
  const handleOpenDeleteModal = (ticketId: number) => {
    setTicketToDelete(ticketId);
    setShowDeleteModal(true);
  };

  return (
    <>
      {/* Main Content */}
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
                              <MdDeleteForever size={20} />
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

      {/* Modals */}
      <TicketDetailsModal
        isOpen={showTicketModal}
        onClose={() => {
          setShowTicketModal(false);
          setTicketDetails(null);
        }}
        ticketDetails={ticketDetails}
        loading={loadingDetails}
      />

      <AddTicketModal
        isOpen={showAddTicketModal}
        onClose={() => setShowAddTicketModal(false)}
        onSubmit={handleAddTicket}
        loading={addTicketLoading}
      />

      <ResolveTicketModal
        isOpen={showResolveModal}
        onClose={() => {
          setShowResolveModal(false);
          setSelectedTicketId(null);
        }}
        onSubmit={handleResolveTicket}
        loading={resolveTicketLoading}
      />

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setTicketToDelete(null);
        }}
        onConfirm={handleDeleteTicket}
        title="Delete Ticket"
        message="Are you sure you want to delete this ticket? This action cannot be undone."
       loading={deleteLoading}
      />
    </>
  );
};

export default TicketTable;



















