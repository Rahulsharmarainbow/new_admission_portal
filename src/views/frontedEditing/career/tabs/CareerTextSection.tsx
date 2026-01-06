import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { Card, Label, TextInput, Button, Spinner } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';
import JoditEditor from 'jodit-react';

interface CareerTextData {
  id?: number;
  section_title?: string;
  section_content?: string;
  section_type?: string; // About, Mission, Vision, Values, etc.
  section_order?: number;
  section_status?: boolean;
}

interface CareerTextSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const CareerTextSection: React.FC<CareerTextSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sections, setSections] = useState<CareerTextData[]>([]);
  const [editingSection, setEditingSection] = useState<CareerTextData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [sectionType, setSectionType] = useState('About');
  const [sectionOrder, setSectionOrder] = useState(0);
  const [sectionStatus, setSectionStatus] = useState(true);

  const editorRef = useRef(null);

  const editorConfig = useMemo(
    () => ({
      readonly: false,
      height: 400,
      toolbarSticky: false,
      toolbarAdaptive: false,
      buttons: [
        'source',
        '|',
        'bold',
        'italic',
        'underline',
        'strikethrough',
        '|',
        'ul',
        'ol',
        '|',
        'font',
        'fontsize',
        'brush',
        'paragraph',
        '|',
        'image',
        'video',
        'table',
        'link',
        '|',
        'left',
        'center',
        'right',
        'justify',
        '|',
        'undo',
        'redo',
        '|',
        'hr',
        'eraser',
        'copyformat',
        'fullsize',
      ],
      showXPathInStatusbar: false,
      showCharsCounter: false,
      showWordsCounter: false,
      uploader: { insertImageAsBase64URI: true },
      placeholder: 'Start typing your content here...',
      theme: 'default',
    }),
    [],
  );

  const handleEditorBlur = useCallback((newContent: string) => {
    setSectionContent(newContent);
  }, []);

  const sectionTypes = ['About', 'Mission', 'Vision', 'Values', 'Why Join Us', 'Benefits', 'Other'];

  useEffect(() => {
    if (selectedAcademic) getCareerTextSections(selectedAcademic);
  }, [selectedAcademic]);

  const getCareerTextSections = async (academicId: string) => {
    if (!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/get-career-text-sections`,
        { academic_id: parseInt(academicId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        setSections(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch text sections');
      }
    } catch (error: any) {
      console.error('Error fetching text sections:', error);
      toast.error(error.response?.data?.message || 'Error fetching sections');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAcademic) {
      toast.error('Please select an academic first');
      return;
    }

    if (!sectionTitle || !sectionContent) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      formData.append('section_title', sectionTitle);
      formData.append('section_content', sectionContent);
      formData.append('section_type', sectionType);
      formData.append('section_order', sectionOrder.toString());
      formData.append('section_status', sectionStatus.toString());

      if (isEditing && editingSection?.id) {
        formData.append('section_id', editingSection.id.toString());
      }

      const endpoint = isEditing 
        ? 'update-career-text-section' 
        : 'create-career-text-section';

      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/${endpoint}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      if (response.data.success) {
        toast.success(`Section ${isEditing ? 'updated' : 'created'} successfully!`);
        resetForm();
        getCareerTextSections(selectedAcademic);
      } else {
        toast.error(response.data.message || `Failed to ${isEditing ? 'update' : 'create'} section`);
      }
    } catch (error: any) {
      console.error('Error saving section:', error);
      toast.error(error.response?.data?.message || 'Error saving section');
    } finally {
      setSaving(false);
    }
  };

  const editSection = (section: CareerTextData) => {
    setEditingSection(section);
    setIsEditing(true);
    setSectionTitle(section.section_title || '');
    setSectionContent(section.section_content || '');
    setSectionType(section.section_type || 'About');
    setSectionOrder(section.section_order || 0);
    setSectionStatus(section.section_status || true);
  };

  const deleteSection = async (sectionId: number) => {
    if (!confirm('Are you sure you want to delete this section?')) return;

    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/delete-career-text-section`,
        {
          academic_id: parseInt(selectedAcademic),
          section_id: sectionId,
          s_id: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success('Section deleted successfully!');
        getCareerTextSections(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to delete section');
      }
    } catch (error: any) {
      console.error('Error deleting section:', error);
      toast.error(error.response?.data?.message || 'Error deleting section');
    }
  };

  const resetForm = () => {
    setEditingSection(null);
    setIsEditing(false);
    setSectionTitle('');
    setSectionContent('');
    setSectionType('About');
    setSectionOrder(0);
    setSectionStatus(true);
  };

  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to manage text sections.
        </p>
      </Card>
    );
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-6">
          {/* Add/Edit Section Form */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isEditing ? 'Edit Text Section' : 'Add New Text Section'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="sectionTitle" className="block mb-2">
                      Section Title *
                    </Label>
                    <TextInput
                      id="sectionTitle"
                      type="text"
                      value={sectionTitle}
                      onChange={(e) => setSectionTitle(e.target.value)}
                      placeholder="Enter section title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="sectionType" className="block mb-2">
                      Section Type
                    </Label>
                    <select
                      id="sectionType"
                      value={sectionType}
                      onChange={(e) => setSectionType(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      {sectionTypes.map((type) => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="sectionOrder" className="block mb-2">
                      Display Order
                    </Label>
                    <TextInput
                      id="sectionOrder"
                      type="number"
                      value={sectionOrder}
                      onChange={(e) => setSectionOrder(parseInt(e.target.value) || 0)}
                      placeholder="Order number"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="sectionStatus" className="block mb-2">
                      Status
                    </Label>
                    <select
                      id="sectionStatus"
                      value={sectionStatus.toString()}
                      onChange={(e) => setSectionStatus(e.target.value === 'true')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="sectionContent" className="block mb-2">
                      Section Content *
                    </Label>
                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                      <JoditEditor
                        ref={editorRef}
                        value={sectionContent}
                        config={editorConfig}
                        onBlur={handleEditorBlur}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-6 mt-6 border-t">
                  {isEditing && (
                    <Button
                      type="button"
                      color="light"
                      onClick={resetForm}
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  )}
                  <Button type="submit" className="min-w-[120px]" disabled={saving}>
                    {saving ? (
                      <>
                        <Spinner size="sm" className="mr-2" /> Saving...
                      </>
                    ) : (
                      isEditing ? 'Update Section' : 'Add Section'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Sections List */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Existing Text Sections</h2>
              
              {sections.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No text sections found. Add your first section above.
                </p>
              ) : (
                <div className="space-y-6">
                  {sections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-medium text-lg">{section.section_title}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                            <span className="px-2 py-1 bg-gray-100 rounded">
                              {section.section_type}
                            </span>
                            <span>Order: {section.section_order}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          section.section_status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {section.section_status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <div 
                        className="prose max-w-none text-gray-700 mb-4"
                        dangerouslySetInnerHTML={{ __html: section.section_content || '' }}
                      />
                      
                      <div className="flex justify-end space-x-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => editSection(section)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => deleteSection(section.id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CareerTextSection;