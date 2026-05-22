import React, { useState } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Image as ImageIcon, X, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store';
import { Category } from '../../types';

export default function AdminCategories() {
  const categories = useStore(state => state.categories);
  const products = useStore(state => state.products);
  const addCategory = useStore(state => state.addCategory);
  const updateCategory = useStore(state => state.updateCategory);
  const deleteCategory = useStore(state => state.deleteCategory);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    image: '',
  });

  const getProductCount = (categoryId: string) => {
    return products.filter(p => p.categoryId === categoryId).length;
  };

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', image: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setEditingCategory(category);
    setFormData({ ...category });
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setToastMessage('Upload en cours...');
      setShowToast(true);

      // Use provided credentials
      const cloudName = 'dibofn6p1';
      const uploadPreset = 'cazdeco';

      if (cloudName && uploadPreset) {
        const formDataObj = new FormData();
        formDataObj.append('file', file);
        formDataObj.append('upload_preset', uploadPreset);

        const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
          method: 'POST',
          body: formDataObj,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Cloudinary error response:', errorText);
          throw new Error(`Erreur Cloudinary: ${response.status} ${response.statusText} - ${errorText}`);
        }

        const data = await response.json();
        const downloadURL = data.secure_url;
        
        setFormData(prev => ({ ...prev, image: downloadURL }));
        setToastMessage('Image uploadée avec succès');
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Fallback original logic (Base64 Canvas Compression) for localStorage
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 400; // Categories usually don't need huge images
            const MAX_HEIGHT = 400;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
              }
            } else {
              if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, width, height);
            
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.5);
            setFormData(prev => ({ ...prev, image: compressedBase64 }));
            
            setToastMessage('Image uploadée avec succès (Mock local)');
            setTimeout(() => setShowToast(false), 3000);
          };
          img.src = event.target?.result as string;
        };
        reader.readAsDataURL(file);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de l'image. Veuillez réessayer.");
      setShowToast(false);
    } finally {
      e.target.value = '';
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Voulez-vous vraiment supprimer cette catégorie ?')) {
      deleteCategory(id);
      setToastMessage('Catégorie supprimée avec succès');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSave = () => {
    if (!formData.name) return;

    if (editingCategory) {
      updateCategory({ ...editingCategory, ...formData, status: 'active', order: editingCategory.order || 0 } as Category);
      setToastMessage('Catégorie modifiée avec succès');
    } else {
      const slug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      addCategory({
        id: slug + '-' + Date.now(),
        name: formData.name,
        image: formData.image || '',
        slug,
        status: 'active',
        order: categories.length
      });
      setToastMessage('Catégorie ajoutée avec succès');
    }

    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-white text-sm relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gestion des catégories</h1>
        <button 
          onClick={openAddModal}
          className="bg-[#E63329] hover:bg-[#c42b22] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
          <Plus size={20} />
          <span>Ajouter une catégorie</span>
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 bg-[#0f172a]/50">
              <th className="p-4 w-12 font-medium"></th>
              <th className="p-4 font-medium">Image</th>
              <th className="p-4 font-medium">Nom de la catégorie</th>
              <th className="p-4 font-medium text-center">Produits</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category, idx) => (
              <tr key={category.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 text-slate-500 cursor-move">
                  <GripVertical size={20} />
                </td>
                <td className="p-4">
                  <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center text-slate-500 overflow-hidden">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={20} />
                    )}
                  </div>
                </td>
                <td className="p-4 font-medium text-base">{category.name}</td>
                <td className="p-4 text-center">
                  <span className="bg-slate-800 text-slate-300 py-1 px-3 rounded-full font-medium">
                    {getProductCount(category.id)}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-2 py-1 rounded bg-emerald-500/10 text-emerald-500 text-xs font-bold">Actif</span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-3 text-slate-400">
                    <button onClick={() => openEditModal(category)} className="hover:text-blue-500 transition" title="Modifier"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(category.id)} className="hover:text-red-500 transition" title="Supprimer"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl w-full max-w-lg flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">{editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Nom de la catégorie <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.name || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                  required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Slug URL</label>
                <input 
                  type="text" 
                  value={formData.slug || ''}
                  placeholder="genere-automatiquement" 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 focus:outline-none" 
                  readOnly 
                />
                <p className="text-xs text-slate-500 mt-1">Généré automatiquement à partir du nom</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Image de couverture URL</label>
                <input 
                  type="text" 
                  value={(formData.image || '').startsWith('data:image') ? 'Fichier image chargé localement' : (formData.image || '')}
                  disabled={(formData.image || '').startsWith('data:image')}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white disabled:opacity-50 focus:border-[#E63329] focus:outline-none mb-2" 
                />
                <div 
                  className="border-2 border-dashed border-slate-700 rounded-lg p-6 bg-[#0f172a] flex flex-col items-center justify-center text-center hover:border-[#E63329] transition-colors cursor-pointer group"
                  onClick={(e) => {
                    if ((e.target as HTMLElement).tagName !== 'INPUT') {
                      document.getElementById('category-file-upload')?.click();
                    }
                  }}
                >
                  <input 
                    id="category-file-upload"
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onClick={(e) => e.stopPropagation()}
                    onChange={handleFileUpload}
                  />
                  {formData.image ? (
                    <div className="relative group/img">
                      <img src={formData.image} alt="Preview" className="h-16 object-cover rounded" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition rounded">
                         <ImageIcon className="text-white" size={16} />
                      </div>
                    </div>
                  ) : (
                    <>
                      <ImageIcon size={32} className="text-slate-500 mb-2 group-hover:text-[#E63329]" />
                      <span className="text-sm font-medium">Cliquez pour ajouter une image</span>
                    </>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
                <select className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none">
                  <option value="actif">Actif</option>
                  <option value="inactif">Inactif</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-[#0f172a]/50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium">Annuler</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#E63329] hover:bg-[#c42b22] text-white transition font-medium">Enregistrer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
