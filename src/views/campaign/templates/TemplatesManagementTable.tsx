import React, { useState, useEffect } from 'react';
import { MdDeleteForever } from 'react-icons/md';
import { TbEdit } from "react-icons/tb";
import { BsPlusLg, BsSearch } from 'react-icons/bs';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import { Button, Tooltip, Checkbox } from 'flowbite-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Loader from 'src/Frontend/Common/Loader';
import BreadcrumbHeader from 'src/Frontend/Common/BreadcrumbHeader';
import { useAuth } from 'src/hook/useAuth';
import DeleteConfirmationModal from 'src/Frontend/Common/DeleteConfirmationModal';
import { useDebounce } from 'src/hook/useDebounce';
import { Pagination } from 'src/Frontend/Common/Pagination';
import TemplateFormModal from './components/TemplateFormModal';

interface Template {
  id: number;
  name: string;
  wtsp_body: string;
  email_body: string;
  sms_body: string;
  created_at: string;
}

interface Filters {
  page: number;
  rowsPerPage: number;
  order: 'asc' | 'desc';
  orderBy: string;
  search: string;
}

const TemplatesManagementTable: React.FC = () => {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    page: 0,
    rowsPerPage: 10,
    order: 'desc',
    orderBy: 'id',
    search: '',
  });
  const [total, setTotal] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<number | null>(null);
  const [selectedTemplates, setSelectedTemplates] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [sort, setSort] = useState({ key: 'id', direction: 'desc' as 'asc' | 'desc' });
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [bulkDeleteLoading, setBulkDeleteLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  const debouncedSearch = useDebounce(filters.search, 500);

  // Fetch templates data
  const fetchTemplates = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/Campaign/list`,
        {
          page: filters.page,
          rowsPerPage: filters.rowsPerPage,
          order: filters.order,
          orderBy: filters.orderBy,
          search: filters.search,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            accept: '/',
            'accept-language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7,hi;q=0.6',
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data) {
        setTemplates(response.data.rows || []);
        setTotal(response.data.total || 0);
        setSelectedTemplates([]); // Reset selection when data changes
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch templates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, [filters.page, filters.rowsPerPage, filters.order, filters.orderBy, debouncedSearch]);

  // Handle search
  const handleSearch = (searchValue: string) => {
    setFilters((prev) => ({
      ...prev,
      search: searchValue,
      page: 0,
    }));
  };

  // Handle sort
  const handleSort = (key: string) => {
    const direction = sort.key === key && sort.direction === 'asc' ? 'desc' : 'asc';
    setSort({ key, direction });
    setFilters((prev) => ({
      ...prev,
      order: direction,
      orderBy: key,
      page: 0,
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
    setFilters((prev) => ({ ...prev, page: page-1 }));
  };

  // Handle rows per page change
  const handleRowsPerPageChange = (rowsPerPage: number) => {
    setFilters((prev) => ({ ...prev, rowsPerPage, page: 0 }));
  };

  // Handle add new template
  const handleAddTemplate = () => {
    setEditingTemplate(null);
    setShowFormModal(true);
  };

  // Handle edit template
  const handleEditTemplate = (template: Template) => {
    setEditingTemplate(template);
    setShowFormModal(true);
  };

  // Handle form submission success
  const handleFormSuccess = () => {
    setShowFormModal(false);
    setEditingTemplate(null);
    fetchTemplates();
    toast.success(editingTemplate ? 'Template updated successfully!' : 'Template added successfully!');
  };

  // Handle single delete
  const handleDeleteClick = (id: number) => {
    setTemplateToDelete(id);
    setShowDeleteModal(true);
  };

  // Handle bulk delete
  const handleBulkDeleteClick = () => {
    if (selectedTemplates.length === 0) {
      toast.error('Please select at least one template to delete');
      return;
    }
    setShowBulkDeleteModal(true);
  };

  // Handle select all templates
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTemplates(templates.map(template => template.id));
    } else {
      setSelectedTemplates([]);
    }
  };

  // Handle individual template selection
  const handleSelectTemplate = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedTemplates(prev => [...prev, id]);
    } else {
      setSelectedTemplates(prev => prev.filter(templateId => templateId !== id));
    }
  };

  // Check if all templates are selected
  const isAllSelected = templates.length > 0 && selectedTemplates.length === templates.length;

  // Check if some templates are selected
  const isIndeterminate = selectedTemplates.length > 0 && selectedTemplates.length < templates.length;

  // Single delete confirmation
  const confirmDelete = async () => {
    if (templateToDelete !== null) {
      setDeleteLoading(true);
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/Campaign/delete`,
          {
            ids: [templateToDelete],
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Template deleted successfully!');
          fetchTemplates();
        } else {
          console.error('Delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete template');
        }
      } catch (error: any) {
        console.error('Error deleting template:', error);
        toast.error('Failed to delete template');
      } finally {
        setShowDeleteModal(false);
        setTemplateToDelete(null);
        setDeleteLoading(true);
      }
    }
  };

  // Bulk delete confirmation
  const confirmBulkDelete = async () => {
    if (selectedTemplates.length > 0) {
        setBulkDeleteLoading(true); 
      try {
        const response = await axios.post(
          `${apiUrl}/${user?.role}/Campaign/delete`,
          {
            ids: selectedTemplates,
            s_id: user?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${user?.token}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (response.data.status === true) {
          toast.success(response.data.message || 'Templates deleted successfully!');
          fetchTemplates();
          setSelectedTemplates([]);
        } else {
          console.error('Bulk delete failed:', response.data.message);
          toast.error(response.data.message || 'Failed to delete templates');
        }
      } catch (error: any) {
        console.error('Error deleting templates:', error);
        toast.error('Failed to delete templates');
      } finally {
        setShowBulkDeleteModal(false);
        setBulkDeleteLoading(false); 
      }
    }
  };

  // Truncate text for display
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return `${text.substring(0, maxLength)}...`;
  };

  const stripHtml = (html: string | null | undefined) => {
  if (!html) return "";
  const doc = new DOMParser().parseFromString(html, "text/html");
  return doc.body.textContent || "";
};


  return (
    <>
      <div className="mb-6">
        <BreadcrumbHeader
          title="Templates"
          paths={[{ name: 'Templates', link: '#' }]}
        />
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-md">
        {/* Search Bar and Add Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <BsSearch className="w-4 h-4 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search by template name..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 text-sm border border-gray-300 rounded-lg 
                       bg-white focus:ring-blue-500 focus:border-blue-500 
                       placeholder-gray-400 transition-all duration-200"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedTemplates.length > 0 && (
              <Button
                onClick={handleBulkDeleteClick}
                className="whitespace-nowrap bg-red-600 hover:bg-red-700 text-white"
              >
                <MdDeleteForever className="mr-2 w-4 h-4" />
                Delete Selected ({selectedTemplates.length})
              </Button>
            )}
            <Button
              onClick={handleAddTemplate}
              className="whitespace-nowrap bg-blue-600 hover:bg-blue-700 text-white"
            >
              <BsPlusLg className="mr-2 w-4 h-4" />
              Add Template
            </Button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <Loader />
        ) : (
          <div className="rounded-lg border border-gray-200 shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="w-12 py-3 px-4 text-center">
                      <Checkbox
                        checked={isAllSelected}
                        indeterminate={isIndeterminate}
                        onChange={handleSelectAll}
                      />
                    </th>
                    <th className="w-12 py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      S.NO
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Template Name</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      WhatsApp Body
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email Body
                    </th>
                    <th className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      SMS Body
                    </th>
                    <th
                      className="py-3 px-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider cursor-pointer select-none"
                      onClick={() => handleSort('created_at')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Created Date</span>
                        {getSortIcon('created_at')}
                      </div>
                    </th>
                    <th className="w-20 py-3 px-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {templates.length > 0 ? (
                    templates.map((template, index) => (
                      <tr key={template.id} className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="py-4 px-4 text-center">
                          <Checkbox
                            checked={selectedTemplates.includes(template.id)}
                            onChange={(e) => handleSelectTemplate(template.id, e.target.checked)}
                          />
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filters.page * filters.rowsPerPage + index + 1}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {template.name}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                          <Tooltip
  content={stripHtml(template.wtsp_body)}
  placement="top"
  style="light"
  animation="duration-300"
>
  <span className="truncate block">
    {truncateText(stripHtml(template.wtsp_body), 50)}
  </span>
</Tooltip>

                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                          <Tooltip
  content={stripHtml(template.email_body)}
  placement="top"
  style="light"
  animation="duration-300"
>
  <span className="truncate block">
    {truncateText(stripHtml(template.email_body), 50)}
  </span>
</Tooltip>

                        </td>
                        <td className="py-4 px-4 text-sm text-gray-600 max-w-xs">
                          <Tooltip
  content={stripHtml(template.sms_body)}
  placement="top"
  style="light"
  animation="duration-300"
>
  <span className="truncate block">
    {truncateText(stripHtml(template.sms_body), 50)}
  </span>
</Tooltip>

                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-sm text-gray-600">
                          {new Date(template.created_at).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-4 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center space-x-2">
                            <Tooltip content="Edit" placement="top">
                              <button
                                onClick={() => handleEditTemplate(template)}
                                className="text-blue-600 hover:text-blue-800 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                              >
                                <TbEdit className="w-5 h-5" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete" placement="top">
                              <button
                                onClick={() => handleDeleteClick(template.id)}
                                className="text-red-600 hover:text-red-800 p-2 rounded-lg hover:bg-red-50 transition-colors"
                              >
                                <MdDeleteForever className="w-5 h-5" />
                              </button>
                            </Tooltip>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={8} className="py-12 px-6 text-center">
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
                          <p className="text-lg font-medium text-gray-600 mb-2">No templates found</p>
                          <p className="text-sm text-gray-500">
                            {filters.search
                              ? 'Try adjusting your search criteria'
                              : 'No templates available'}
                          </p>
                          {!filters.search && (
                            <Button
                              onClick={handleAddTemplate}
                              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <BsPlusLg className="mr-2 w-4 h-4" />
                              Add Your First Template
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {templates.length > 0 && (
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

        {/* Template Form Modal */}
        <TemplateFormModal
          isOpen={showFormModal}
          onClose={() => {
            setShowFormModal(false);
            setEditingTemplate(null);
          }}
          onSuccess={handleFormSuccess}
          template={editingTemplate}
        />

        {/* Single Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={confirmDelete}
          title="Delete Template"
          message="Are you sure you want to delete this template? This action cannot be undone."
           loading={deleteLoading}
        />

        {/* Bulk Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showBulkDeleteModal}
          onClose={() => setShowBulkDeleteModal(false)}
          onConfirm={confirmBulkDelete}
          title="Delete Templates"
          message={`Are you sure you want to delete ${selectedTemplates.length} selected template(s)? This action cannot be undone.`}
           loading={bulkDeleteLoading}
        />
      </div>
    </>
  );
};

export default TemplatesManagementTable;