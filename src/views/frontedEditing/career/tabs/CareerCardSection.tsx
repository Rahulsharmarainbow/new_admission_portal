import React, { useEffect, useState } from 'react';
import { Card, Label, TextInput, Button, Spinner, Textarea } from 'flowbite-react';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import Loader from 'src/Frontend/Common/Loader';

interface CareerCardData {
  id?: number;
  card_title?: string;
  card_description?: string;
  card_icon?: string;
  card_link?: string;
  card_order?: number;
  card_status?: boolean;
}

interface CareerCardSectionProps {
  selectedAcademic: string;
  user: any;
  apiUrl: string;
}

const assetUrl = import.meta.env.VITE_ASSET_URL;

const CareerCardSection: React.FC<CareerCardSectionProps> = ({
  selectedAcademic,
  user,
  apiUrl,
}) => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [cards, setCards] = useState<CareerCardData[]>([]);
  const [editingCard, setEditingCard] = useState<CareerCardData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form fields
  const [cardTitle, setCardTitle] = useState('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardIcon, setCardIcon] = useState<File | string | null>(null);
  const [cardIconPreview, setCardIconPreview] = useState('');
  const [cardLink, setCardLink] = useState('');
  const [cardOrder, setCardOrder] = useState(0);
  const [cardStatus, setCardStatus] = useState(true);

  useEffect(() => {
    if (selectedAcademic) getCareerCards(selectedAcademic);
  }, [selectedAcademic]);

  const getCareerCards = async (academicId: string) => {
    if (!academicId) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/get-career-cards`,
        { academic_id: parseInt(academicId) },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
            'Content-Type': 'application/json',
          },
        },
      );

      if (response.data.success) {
        setCards(response.data.data || []);
      } else {
        toast.error(response.data.message || 'Failed to fetch career cards');
      }
    } catch (error: any) {
      console.error('Error fetching career cards:', error);
      toast.error(error.response?.data?.message || 'Error fetching cards');
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

    if (!cardTitle || !cardDescription) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append('academic_id', parseInt(selectedAcademic).toString());
      formData.append('s_id', user?.id?.toString() || '');
      formData.append('card_title', cardTitle);
      formData.append('card_description', cardDescription);
      formData.append('card_link', cardLink);
      formData.append('card_order', cardOrder.toString());
      formData.append('card_status', cardStatus.toString());
      
      if (cardIcon instanceof File) {
        formData.append('card_icon', cardIcon);
      } else if (typeof cardIcon === 'string') {
        formData.append('card_icon', cardIcon);
      }

      if (isEditing && editingCard?.id) {
        formData.append('card_id', editingCard.id.toString());
      }

      const endpoint = isEditing 
        ? 'update-career-card' 
        : 'create-career-card';

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
        toast.success(`Card ${isEditing ? 'updated' : 'created'} successfully!`);
        resetForm();
        getCareerCards(selectedAcademic);
      } else {
        toast.error(response.data.message || `Failed to ${isEditing ? 'update' : 'create'} card`);
      }
    } catch (error: any) {
      console.error('Error saving card:', error);
      toast.error(error.response?.data?.message || 'Error saving card');
    } finally {
      setSaving(false);
    }
  };

  const editCard = (card: CareerCardData) => {
    setEditingCard(card);
    setIsEditing(true);
    setCardTitle(card.card_title || '');
    setCardDescription(card.card_description || '');
    setCardLink(card.card_link || '');
    setCardOrder(card.card_order || 0);
    setCardStatus(card.card_status || true);
    
    if (card.card_icon) {
      setCardIcon(card.card_icon);
      setCardIconPreview(`${assetUrl}/${card.card_icon}`);
    } else {
      setCardIcon(null);
      setCardIconPreview('');
    }
  };

  const deleteCard = async (cardId: number) => {
    if (!confirm('Are you sure you want to delete this card?')) return;

    try {
      const response = await axios.post(
        `${apiUrl}/${user?.role}/CareerEditing/delete-career-card`,
        {
          academic_id: parseInt(selectedAcademic),
          card_id: cardId,
          s_id: user?.id,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      if (response.data.success) {
        toast.success('Card deleted successfully!');
        getCareerCards(selectedAcademic);
      } else {
        toast.error(response.data.message || 'Failed to delete card');
      }
    } catch (error: any) {
      console.error('Error deleting card:', error);
      toast.error(error.response?.data?.message || 'Error deleting card');
    }
  };

  const resetForm = () => {
    setEditingCard(null);
    setIsEditing(false);
    setCardTitle('');
    setCardDescription('');
    setCardIcon(null);
    setCardIconPreview('');
    setCardLink('');
    setCardOrder(0);
    setCardStatus(true);
  };

  if (!selectedAcademic) {
    return (
      <Card className="p-6">
        <p className="text-gray-500 italic">
          Please select an academic from above to manage career cards.
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
          {/* Add/Edit Card Form */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                {isEditing ? 'Edit Card' : 'Add New Card'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="cardTitle" className="block mb-2">
                      Card Title *
                    </Label>
                    <TextInput
                      id="cardTitle"
                      type="text"
                      value={cardTitle}
                      onChange={(e) => setCardTitle(e.target.value)}
                      placeholder="Enter card title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardOrder" className="block mb-2">
                      Display Order
                    </Label>
                    <TextInput
                      id="cardOrder"
                      type="number"
                      value={cardOrder}
                      onChange={(e) => setCardOrder(parseInt(e.target.value) || 0)}
                      placeholder="Order number"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="cardDescription" className="block mb-2">
                      Description *
                    </Label>
                    <Textarea
                      id="cardDescription"
                      value={cardDescription}
                      onChange={(e) => setCardDescription(e.target.value)}
                      placeholder="Enter card description"
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardLink" className="block mb-2">
                      Link URL
                    </Label>
                    <TextInput
                      id="cardLink"
                      type="url"
                      value={cardLink}
                      onChange={(e) => setCardLink(e.target.value)}
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardStatus" className="block mb-2">
                      Status
                    </Label>
                    <select
                      id="cardStatus"
                      value={cardStatus.toString()}
                      onChange={(e) => setCardStatus(e.target.value === 'true')}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="true">Active</option>
                      <option value="false">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="cardIcon" className="block mb-2">
                      Card Icon
                    </Label>
                    <div className="flex items-center gap-4">
                      {cardIconPreview && (
                        <div className="w-16 h-16 flex items-center justify-center border border-gray-200 rounded-lg shadow-sm bg-white">
                          <img
                            src={cardIconPreview}
                            alt="Icon Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      )}
                      <input
                        id="cardIcon"
                        type="file"
                        accept="image/*"
                        className="block border border-gray-300 rounded-lg p-2 text-sm"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          setCardIcon(file || null);
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => setCardIconPreview(reader.result as string);
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended: 64x64 pixels</p>
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
                      isEditing ? 'Update Card' : 'Add Card'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>

          {/* Cards List */}
          <Card>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Existing Cards</h2>
              
              {cards.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No cards found. Add your first card above.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cards.map((card) => (
                    <div key={card.id} className="border rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          {card.card_icon && (
                            <img
                              src={`${assetUrl}/${card.card_icon}`}
                              alt={card.card_title}
                              className="w-10 h-10 object-contain"
                            />
                          )}
                          <h3 className="font-medium">{card.card_title}</h3>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          card.card_status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {card.card_status ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {card.card_description}
                      </p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <span>Order: {card.card_order}</span>
                        {card.card_link && (
                          <a 
                            href={card.card_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Link
                          </a>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button
                          size="xs"
                          color="light"
                          onClick={() => editCard(card)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="xs"
                          color="failure"
                          onClick={() => deleteCard(card.id!)}
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

export default CareerCardSection;