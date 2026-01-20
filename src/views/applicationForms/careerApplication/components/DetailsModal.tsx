import React, { useState, useEffect } from 'react';
import { Button, Textarea, Modal, Checkbox, Badge, ModalBody, ModalHeader, ModalFooter } from 'flowbite-react';
import { MdClose, MdDownload, MdEdit, MdDeleteForever, MdAdd } from 'react-icons/md';
import { TbLoader2 } from 'react-icons/tb';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useAuth } from 'src/hook/useAuth';
import { CareerApplication } from './CareerManagementTable';

interface Note {
  id: number;
  notes: string;
  admin_id: number;
  admin_name: string;
  admin_email: string;
  created_at: string;
}

interface ApplicationData {
  textarea_brief: any;
  id: number;
  academic_id: number;
  job_id: number;
  job_title: string;
  refference_id: string;
  status: number;
  name: string;
  email: string;
  mobile: string;
  resume: string;
  candidate_details: {
    textarea_brief: any;
    name: string;
    email: string;
    mobile: string;
    document: string;
  };
  notes: Note[];
}

interface DetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: CareerApplication | null;
}

const DetailsModal: React.FC<DetailsModalProps> = ({ isOpen, onClose, application }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'details' | 'notes'>('details');
  const [applicationData, setApplicationData] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notesLoading, setNotesLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState<number[]>([]);
  const [showAddNoteModal, setShowAddNoteModal] = useState(false);
  const [showEditNoteModal, setShowEditNoteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [newNote, setNewNote] = useState('');
  const [editNote, setEditNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && application?.id) {
      fetchApplicationDetails();
    } else {
      setApplicationData(null);
      setSelectedNotes([]);
      setActiveTab('details');
    }
  }, [isOpen, application]);

  const fetchApplicationDetails = async () => {
    if (!application?.id) return;

    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/career-application-details`,
        { application_id: application.id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true && response.data?.data) {
        setApplicationData(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching application details:', error);
      toast.error('Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotes = async () => {
    if (!application?.id) return;

    setNotesLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerApplication/career-application-details`,
        { application_id: application.id },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true && response.data?.data?.notes) {
        setApplicationData(prev => prev ? {
          ...prev,
          notes: response.data.data.notes
        } : null);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to load notes');
    } finally {
      setNotesLoading(false);
    }
  };

  const handleDownloadResume = async () => {
    if (!applicationData) return;

    const resumeUrl = applicationData.candidate_details?.document || applicationData.resume;
    if (!resumeUrl) {
      toast.error('No resume available for download');
      return;
    }

    try { 
      setDownloadLoading(true); 
      const fullUrl = `${resumeUrl}`;
      const response = await fetch(fullUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const filename = resumeUrl.split('/').pop() || 'resume.pdf';
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success('Resume downloaded successfully');
    } catch (error) {
      console.error('Error downloading resume:', error);
      toast.error('Failed to download resume');
    } finally {
      setDownloadLoading(false);
    }
  };

  const handleAddNote = async () => {
    if (!application?.id || !applicationData || !newNote.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerNotes/add`,
        {
          application_id: application.id,
          academic_id: applicationData.academic_id,
          admin_id: user?.id,
          notes: newNote.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true) {
        toast.success('Note added successfully');
        setNewNote('');
        setShowAddNoteModal(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error adding note:', error);
      toast.error('Failed to add note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditNote = async () => {
    if (!currentNote || !editNote.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerNotes/update`,
        {
          id: currentNote.id,
          admin_id: user?.id,
          notes: editNote.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true) {
        toast.success('Note updated successfully');
        setCurrentNote(null);
        setEditNote('');
        setShowEditNoteModal(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error updating note:', error);
      toast.error('Failed to update note');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteNotes = async () => {
    if (selectedNotes.length === 0) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerNotes/delete`,
        {
          admin_id: user?.id,
          ids: selectedNotes
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data?.status === true) {
        toast.success(`${selectedNotes.length} note(s) deleted successfully`);
        setSelectedNotes([]);
        setShowDeleteModal(false);
        fetchNotes();
      }
    } catch (error) {
      console.error('Error deleting notes:', error);
      toast.error('Failed to delete notes');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSelectAllNotes = () => {
    if (!applicationData?.notes) return;

    if (selectedNotes.length === applicationData.notes.length) {
      setSelectedNotes([]);
    } else {
      setSelectedNotes(applicationData.notes.map(note => note.id));
    }
  };

  const handleSelectNote = (noteId: number) => {
    if (selectedNotes.includes(noteId)) {
      setSelectedNotes(selectedNotes.filter(id => id !== noteId));
    } else {
      setSelectedNotes([...selectedNotes, noteId]);
    }
  };

  const getStatusBadge = (status: number) => {
    const statusMap: Record<number, { color: string; label: string }> = {
      1: { color: 'gray', label: 'Applied' },
      2: { color: 'blue', label: 'Shortlisted' },
      3: { color: 'yellow', label: 'Interview' },
      4: { color: 'purple', label: 'Offer' },
      5: { color: 'green', label: 'Hired' },
      6: { color: 'red', label: 'Rejected' },
    };
    
    return statusMap[status] || { color: 'gray', label: 'Unknown' };
  };

  if (!isOpen || !application) return null;

  const statusBadge = getStatusBadge(applicationData?.status || application.status);

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-md bg-white/10 bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Application Details
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100"
            >
              <MdClose className="w-6 h-6" />
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b">
            <div className="flex space-x-1 px-6">
              <button
                onClick={() => setActiveTab('details')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'details'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                Application Details
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'notes'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-b-2 hover:border-gray-300'
                }`}
              >
                Notes ({applicationData?.notes?.length || 0})
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading details...</span>
              </div>
            ) : activeTab === 'details' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Full Name</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.name || application.name}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Email Address</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.email || application.email}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Mobile Number</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.mobile || application.mobile}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Brief</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.candidate_details?.textarea_brief || application.textarea_brief}</p>
                      </div>
                    </div>
                  </div>

                  
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                  {/* Job Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Job Information</h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Job Title</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.job_title || application.job_title}</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-500">Reference ID</label>
                        <p className="mt-1 text-sm text-gray-900">{applicationData?.refference_id || application.refference_id}</p>
                      </div>
                      {applicationData?.candidate_details?.document && (
                        <div>
                          <label className="block text-sm font-medium text-gray-500">Resume</label>
                          <Button
                            onClick={handleDownloadResume}
                            className="flex items-center mt-2 bg-blue-600 hover:bg-blue-700 text-white"
                            disabled={downloadLoading}
                          >
                            {downloadLoading ? (
                              <>
                                <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <MdDownload className="w-4 h-4" />
                                <span>Download Resume</span>
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Notes Tab */
              <div className="space-y-6">
                {/* Bulk Actions */}
                {selectedNotes.length > 0 && (
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-blue-700">
                          {selectedNotes.length} note(s) selected
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Button
                          color="failure"
                          onClick={() => setShowDeleteModal(true)}
                          disabled={isDeleting}
                          className="flex items-center gap-2"
                        >
                          <MdDeleteForever className="h-4 w-4" />
                          Delete Selected
                        </Button>

                        <Button
                          color="alternative"
                          onClick={() => setSelectedNotes([])}
                          className="hover:bg-gray-200"
                        >
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add Note Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowAddNoteModal(true)}
                    className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
                  >
                    <MdAdd className="w-4 h-4" />
                    Add Note
                  </Button>
                </div>

                {/* Notes Table */}
                {notesLoading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    <span className="ml-3 text-gray-600">Loading notes...</span>
                  </div>
                ) : applicationData?.notes && applicationData.notes.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="w-12 px-4 py-3 text-center">
                            <Checkbox
                              checked={applicationData.notes.length > 0 && selectedNotes.length === applicationData.notes.length}
                              onChange={handleSelectAllNotes}
                            />
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">S.No</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Notes</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Added By</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {applicationData.notes.map((note, index) => (
                          <tr key={note.id} className="hover:bg-gray-50">
                            <td className="px-4 py-4 text-center">
                              <Checkbox
                                checked={selectedNotes.includes(note.id)}
                                onChange={() => handleSelectNote(note.id)}
                              />
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">{index + 1}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="max-w-md">{note.notes}</div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div>
                                <div className="font-medium">{note.admin_name}</div>
                                <div className="text-gray-500 text-xs">{note.admin_email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-900">{note.created_at}</td>
                            <td className="px-4 py-4 text-sm text-gray-900">
                              <div className="flex space-x-2">
                                <Button
                                  size="xs"
                                  color="blue"
                                  onClick={() => {
                                    setCurrentNote(note);
                                    setEditNote(note.notes);
                                    setShowEditNoteModal(true);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <MdEdit className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="xs"
                                  color="failure"
                                  onClick={() => {
                                    setSelectedNotes([note.id]);
                                    setShowDeleteModal(true);
                                  }}
                                  className="flex items-center gap-1"
                                >
                                  <MdDeleteForever className="w-3 h-3" />
                                  Delete
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="w-16 h-16 mx-auto text-gray-300 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p className="text-lg font-medium text-gray-600 mb-2">No notes found</p>
                    <p className="text-sm text-gray-500 mb-4">Add your first note to track this application</p>
                    {/* <Button
                      onClick={() => setShowAddNoteModal(true)}
                      color="blue"
                      className="gap-2"
                    >
                      <MdAdd className="w-4 h-4" />
                      Add Note
                    </Button> */}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 flex justify-end space-x-3 border-t">
            <Button
              onClick={onClose}
              color="gray"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700"
            >
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      <Modal show={showAddNoteModal} onClose={() => setShowAddNoteModal(false)}>
        <ModalHeader>Add Note</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Enter your note here..."
              rows={4}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end space-x-3">
            <Button color="gray" onClick={() => setShowAddNoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleAddNote}
              disabled={!newNote.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Note'
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Edit Note Modal */}
      <Modal show={showEditNoteModal} onClose={() => setShowEditNoteModal(false)}>
        <ModalHeader>Edit Note</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Textarea
              value={editNote}
              onChange={(e) => setEditNote(e.target.value)}
              placeholder="Edit your note..."
              rows={4}
              required
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end space-x-3">
            <Button color="gray" onClick={() => setShowEditNoteModal(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditNote}
              disabled={!editNote.trim() || isSubmitting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <TbLoader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Note'
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <ModalHeader>Delete Notes</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <p className="text-gray-700">
              Are you sure you want to delete {selectedNotes.length} selected note(s)? This action cannot be undone.
            </p>
          </div>
        </ModalBody>
        <ModalFooter>
          <div className="flex justify-end space-x-3">
            <Button color="gray" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              color="failure"
              onClick={handleDeleteNotes}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {isDeleting ? (
                <>
                  <TbLoader2 className="w-4 h-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <MdDeleteForever className="h-4 w-4" />
                  Delete
                </>
              )}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default DetailsModal;