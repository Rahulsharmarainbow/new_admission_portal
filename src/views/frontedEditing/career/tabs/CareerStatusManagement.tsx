import React, { useState, useEffect } from 'react';
import { Button, TextInput, Modal, Label, Spinner, Badge, ModalHeader, ModalBody } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { HiPlus, HiSearch, HiOutlineRefresh } from 'react-icons/hi';
import { TbEdit } from 'react-icons/tb';
import { MdDeleteForever } from 'react-icons/md';
import Loader from 'src/Frontend/Common/Loader';
import { useDebounce } from 'src/hook/useDebounce';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { Pagination } from 'src/Frontend/Common/Pagination';

interface CareerStatus {
  id: number;
  academic_id: number;
  name: string;
  value: number;
}

interface CareerStatusListResponse {
  status: boolean;
  data: CareerStatus[];
  total: number;
}

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}


interface CareerStatusModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; value: number }) => void;
  isEditing: boolean;
  initialData?: CareerStatus;
  loading: boolean;
}

const CareerStatusModal: React.FC<CareerStatusModalProps> = ({
  show,
  onClose,
  onSubmit,
  isEditing,
  initialData,
  loading,
}) => {
  const [name, setName] = useState('');
  const [value, setValue] = useState<number>(1);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setValue(initialData.value);
    } else {
      setName('');
      setValue(1);
    }
  }, [initialData, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, value });
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader>
        {isEditing ? 'Edit Career Status' : 'Add Career Status'}
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="block mb-2">
              Status Name <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Active, Closed, Draft"
              required
            />
          </div>

          <div>
            <Label htmlFor="value" className="block mb-2">
              Status Value <span className="text-red-500">*</span>
            </Label>
            <TextInput
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value) || 1)}
              placeholder="e.g., 1, 2, 3"
              required
              min="1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button color="alternative" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  {isEditing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEditing ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};

interface CareerStatusManagementProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const CareerStatusManagement: React.FC<CareerStatusManagementProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [statuses, setStatuses] = useState<CareerStatus[]>([]);
  const [total, setTotal] = useState(0);
  
  const [filters, setFilters] = useState({
    search: '',
    page: 0,
    rowsPerPage: 10,
    order: 'desc' as 'asc' | 'desc',
    orderBy: 'id' as string,
  });
  
  const debouncedSearch = useDebounce(filters.search, 500);
  
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editingStatus, setEditingStatus] = useState<CareerStatus | undefined>(undefined);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedDeleteItems, setSelectedDeleteItems] = useState<CareerStatus[]>([]);

  useEffect(() => {
    if (selectedAcademic) {
      fetchStatuses();
    } else {
      setStatuses([]);
      setTotal(0);
    }
  }, [selectedAcademic, filters.page, debouncedSearch, filters.order, filters.orderBy]);

  useEffect(() => {
    setSelectedIds([]);
    setSelectAll(false);
  }, [statuses]);

  const fetchStatuses = async () => {
    if (!selectedAcademic) return;
    
    setLoading(true);
    try {
      const response = await axios.post<CareerStatusListResponse>(
        `${apiUrl}/SuperAdmin/CareerStatus/list-status`,
        {
          search: debouncedSearch,
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          academic_id: parseInt(selectedAcademic),
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        setStatuses(response.data.data);
        setTotal(response.data.total);
      } else {
        toast.error('Failed to fetch career statuses');
        setStatuses([]);
        setTotal(0);
      }
    } catch (error: any) {
      console.error('Error fetching career statuses:', error);
      toast.error(error.response?.data?.message || 'Error fetching data');
      setStatuses([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilters(prev => ({ ...prev, search: value, page: 0 }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page: page - 1 }));
  };

  const handleRowsPerPageChange = (rows: number) => {
    setFilters(prev => ({ ...prev, rowsPerPage: rows, page: 0 }));
  };

  const handleSort = (column: string) => {
    if (filters.orderBy === column) {
      setFilters(prev => ({
        ...prev,
        order: prev.order === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        orderBy: column,
        order: 'asc',
      }));
    }
  };

  const getSortIcon = (column: string) => {
    if (filters.orderBy !== column) return null;
    return filters.order === 'asc' ? '↑' : '↓';
  };

  const handleAddStatus = () => {
    setEditingStatus(undefined);
    setModalOpen(true);
  };

  const handleEditStatus = (status: CareerStatus) => {
    setEditingStatus(status);
    setModalOpen(true);
  };

  const handleModalSubmit = async (data: { name: string; value: number }) => {
    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    setModalLoading(true);
    try {
      const endpoint = editingStatus 
        ? `${apiUrl}/SuperAdmin/CareerStatus/update-status`
        : `${apiUrl}/SuperAdmin/CareerStatus/add-status`;

      const payload = editingStatus
        ? {
            s_id: user?.id,
            id: editingStatus.id,
            academic_id: parseInt(selectedAcademic),
            name: data.name,
            value: data.value,
          }
        : {
            s_id: user?.id,
            academic_id: parseInt(selectedAcademic),
            name: data.name,
            value: data.value,
          };

      const response = await axios.post(
        endpoint,
        payload,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        toast.success(editingStatus ? 'Status updated successfully!' : 'Status added successfully!');
        setModalOpen(false);
        fetchStatuses();
      } else {
        toast.error(response.data.message || 'Failed to save status');
      }
    } catch (error: any) {
      console.error('Error saving status:', error);
      toast.error(error.response?.data?.message || 'Error saving status');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteClick = (items: CareerStatus | CareerStatus[]) => {
    const itemsArray = Array.isArray(items) ? items : [items];
    setSelectedDeleteItems(itemsArray);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (selectedDeleteItems.length === 0) return;

    setDeleteLoading(true);
    try {
      const ids = selectedDeleteItems.map(item => item.id);
      const response = await axios.post(
        `${apiUrl}/SuperAdmin/CareerStatus/delete-status`,
        {
          s_id: user?.id,
          ids,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.status) {
        toast.success(`${selectedDeleteItems.length} status(es) deleted successfully!`);
        setDeleteModalOpen(false);
        setSelectedIds([]);
        fetchStatuses();
      } else {
        toast.error(response.data.message || 'Failed to delete status(es)');
      }
    } catch (error: any) {
      console.error('Error deleting statuses:', error);
      toast.error(error.response?.data?.message || 'Error deleting statuses');
    } finally {
      setDeleteLoading(false);
      setSelectedDeleteItems([]);
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
    } else {
      setSelectedIds(statuses.map(status => status.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectItem = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  if (!selectedAcademic) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to manage career statuses.
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* Modals */}
      <CareerStatusModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleModalSubmit}
        isEditing={!!editingStatus}
        initialData={editingStatus}
        loading={modalLoading}
      />

      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setSelectedDeleteItems([]);
        }}
        onConfirm={handleDeleteConfirm}
        title={
          selectedDeleteItems.length > 1
            ? `Delete ${selectedDeleteItems.length} Statuses`
            : `Delete "${selectedDeleteItems[0]?.name}"`
        }
        message={
          selectedDeleteItems.length > 1
            ? `Are you sure you want to delete ${selectedDeleteItems.length} selected statuses? This action cannot be undone.`
            : `Are you sure you want to delete "${selectedDeleteItems[0]?.name}" status? This action cannot be undone.`
        }
        loading={deleteLoading}
      />

      {/* Main Content */}
      <div className={`transition-all duration-300 ${modalOpen || deleteModalOpen ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="bg-white rounded-lg shadow-md relative overflow-x-auto">
          {/* Table Header - Search and Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-6 pb-4">
            {/* Search Input - Left side */}
            <div className="relative w-full sm:w-64">
              <TextInput
                type="text"
                placeholder="Search statuses..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                icon={HiSearch}
                className="w-full"
              />
            </div>

            {/* Action Buttons - Right side */}
            <div className="flex flex-wrap gap-2">
              {selectedIds.length > 0 && (
                <Button
                  color="failure"
                  onClick={() => handleDeleteClick(statuses.filter(s => selectedIds.includes(s.id)))}
                  disabled={loading}
                  className="flex items-center gap-2"
                >
                  <MdDeleteForever className="h-4 w-4" />
                  Delete Selected ({selectedIds.length})
                </Button>
              )}
              
              <Button
                color="blue"
                onClick={handleAddStatus}
                className="flex items-center gap-2"
              >
                <HiPlus className="h-4 w-4" />
                Add Status
              </Button>
            </div>
          </div>

          {/* Table Container with Loader */}
          <div className="relative">
            {loading && (
              <div className="absolute inset-0 bg-white bg-opacity-70 z-10 flex items-center justify-center">
                <Loader />
              </div>
            )}
            
            <div className="shadow-md rounded-lg min-w-full">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="w-20 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectAll}
                        onChange={handleSelectAll}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                      />
                    </th>
                    <th
                      scope="col"
                      className="w-20 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider select-none"
                    >
                        S.NO 
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center justify-center">
                        Status Name {getSortIcon('name')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('value')}
                    >
                      <div className="flex items-center justify-center">
                        Priority Value {getSortIcon('value')}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="w-32 px-8 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {statuses.length > 0 ? (
                    statuses.map((status, index) => (
                      <tr key={status.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-8 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedIds.includes(status.id)}
                            onChange={() => handleSelectItem(status.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                          />
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                          <Badge color="gray" className="px-3 py-1">
                            {status.name}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center">
                          <Badge color={status.value === 1 ? "success" : "gray"} className="px-3 py-1">
                            {status.value}
                          </Badge>
                        </td>
                        <td className="px-8 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-3">
                            {/* Edit Button */}
                            <button
                              className="text-blue-500 hover:text-blue-700 p-1 transition-colors duration-200 rounded-lg hover:bg-blue-50"
                              onClick={() => handleEditStatus(status)}
                              title="Edit Status"
                            >
                              <TbEdit size={18} />
                            </button>

                            {/* Delete Button */}
                            <button
                              className="text-red-500 hover:text-red-700 p-1 transition-colors duration-200 rounded-lg hover:bg-red-50"
                              onClick={() => handleDeleteClick(status)}
                              title="Delete Status"
                            >
                              <MdDeleteForever size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-gray-500">
                          <svg
                            className="w-16 h-16 text-gray-300 mb-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1}
                              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <p className="text-lg font-medium text-gray-600 mb-2">No statuses found</p>
                          <p className="text-sm text-gray-500 mb-4">
                            {filters.search
                              ? 'Try adjusting your search criteria'
                              : 'Get started by adding your first status'}
                          </p>
                          <Button onClick={handleAddStatus} color="blue" className="flex items-center gap-2">
                            <HiPlus className="w-4 h-4" />
                            Add Status
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {statuses.length > 0 && (
            <div className="mt-6 p-4 border-t border-gray-200">
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
    </div>
  );
};

export default CareerStatusManagement;