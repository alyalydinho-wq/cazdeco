import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, Eye, Copy, X, Upload, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../store';
import { Product } from '../../types';

const mobilierSubcategories = [
  { id: '1', name: 'Canapés', slug: 'canapes', icon: '🛋️' },
  { id: '2', name: 'Fauteuils et Chaises', slug: 'fauteuils-chaises', icon: '🪑' },
  { id: '3', name: 'Tables', slug: 'tables', icon: '🪵' },
  { id: '4', name: 'Tables Basses', slug: 'tables-basses', icon: '🥣' },
  { id: '5', name: 'Bureaux', slug: 'bureaux', icon: '💻' },
  { id: '6', name: 'Sélection Bois de Manguier', slug: 'bois-manguier', icon: '🥭' },
  { id: '7', name: 'Lits', slug: 'lits', icon: '🛏️' },
  { id: '8', name: 'Armoires/Dressings/Placards', slug: 'armoires-dressings', icon: '🚪' },
  { id: '9', name: 'Bibliothèques', slug: 'bibliotheques', icon: '📚' },
  { id: '10', name: 'Plein air', slug: 'plein-air', icon: '☀️' },
];

const carrelageSubcategories = [
  { id: '1', name: 'CARRELAGE SOL', slug: 'carrelage-sol', icon: '🧱' },
  { id: '2', name: 'CARRELAGE MURS', slug: 'carrelage-murs', icon: '🔳' },
];

const sanitairesSubcategories = [
  { id: '1', name: 'Salles de bains', slug: 'salles-de-bains', icon: '🛁' },
  { id: '2', name: 'Lavabos', slug: 'lavabos', icon: '🚰' },
  { id: '3', name: 'WC', slug: 'wc', icon: '🚽' },
  { id: '4', name: 'Éviers', slug: 'eviers', icon: '🧼' },
];

export default function AdminProducts() {
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);
  const addProduct = useStore(state => state.addProduct);
  const updateProduct = useStore(state => state.updateProduct);
  const deleteProduct = useStore(state => state.deleteProduct);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    categoryId: '',
    subcategory: undefined,
    stock: 10,
    status: 'active',
    images: [''],
    sku: '',
    originalPrice: undefined,
    badge: undefined,
    badges: [],
    isBestSeller: false,
  });

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      categoryId: '',
      subcategory: undefined,
      stock: 10,
      status: 'active',
      images: [''],
      sku: 'SKU-' + Math.floor(Math.random() * 1000000),
      originalPrice: undefined,
      badge: undefined,
      badges: [],
      isBestSeller: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({ ...product });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setProductToDelete(id);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete);
      setToastMessage('Produit supprimé avec succès');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setProductToDelete(null);
    }
  };

  const handleDuplicate = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const timestamp = Date.now();
    const newProduct: Product = {
      ...product,
      id: 'PROD-' + timestamp,
      name: `${product.name} (Copie)`,
      sku: `${product.sku}-COPY`,
      createdAt: timestamp
    };
    addProduct(newProduct);
    setToastMessage('Produit dupliqué avec succès');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = () => {
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Veuillez remplir tous les champs obligatoires (*)");
      return;
    }

    const isMobilierSelected = (() => {
      const cat = categories.find(c => c.id === formData.categoryId);
      return cat?.slug === 'mobilier' || formData.categoryId === '3';
    })();

    const isCarrelageSelected = (() => {
      const cat = categories.find(c => c.id === formData.categoryId);
      return cat?.slug === 'carrelage' || formData.categoryId === '5';
    })();

    const isSanitairesSelected = (() => {
      const cat = categories.find(c => c.id === formData.categoryId);
      return cat?.slug === 'sanitaires' || formData.categoryId === '1';
    })();

    if (isMobilierSelected && !formData.subcategory) {
      alert("Veuillez sélectionner une sous-catégorie pour le mobilier.");
      return;
    }

    if (isCarrelageSelected && !formData.subcategory) {
      alert("Veuillez sélectionner une sous-catégorie pour le carrelage.");
      return;
    }

    if (isSanitairesSelected && !formData.subcategory) {
      alert("Veuillez sélectionner une sous-catégorie pour le sanitaire.");
      return;
    }

    // Filter out empty image URLs
    const finalImages = (formData.images || []).filter(img => img.trim() !== '');
    const finalData: any = { ...formData, images: finalImages.length > 0 ? finalImages : ['/placeholder.jpg'] };

    if (!isMobilierSelected && !isCarrelageSelected && !isSanitairesSelected) {
      delete finalData.subcategory;
    }

    // Firebase does not support undefined values
    Object.keys(finalData).forEach(key => {
      if (finalData[key] === undefined) {
        delete finalData[key];
      }
    });

    if (editingProduct) {
      updateProduct({ ...editingProduct, ...finalData } as Product);
      setToastMessage('Produit modifié avec succès');
    } else {
      addProduct({
        ...finalData,
        id: 'PROD-' + Date.now(),
        createdAt: Date.now(),
      } as Product);
      setToastMessage('Produit ajouté avec succès');
    }

    setIsModalOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleImageChange = (index: number, url: string) => {
    const newImages = [...(formData.images || [])];
    newImages[index] = url;
    setFormData({ ...formData, images: newImages });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = e.target.files;
      if (!files || files.length === 0) return;

      setToastMessage('Upload en cours...');
      setShowToast(true);

      // Use provided credentials, fallback to env only if needed, but the user explicitly gave us these:
      const cloudName = 'dibofn6p1';
      const uploadPreset = 'cazdeco';

      if (cloudName && uploadPreset) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
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
          
          setFormData(prev => {
            const currentImages = prev.images || [''];
            if (currentImages.length === 1 && currentImages[0] === '') {
              return { ...prev, images: [downloadURL] };
            }
            return { ...prev, images: [...currentImages, downloadURL] };
          });
        }
        
        setToastMessage('Images uploadées avec succès');
        setTimeout(() => setShowToast(false), 3000);
      } else {
        // Fallback original logic (Base64 Canvas Compression) for localStorage
        const filePromises = Array.from(files).map((file: File) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
              const img = new Image();
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const MAX_WIDTH = 600;
                const MAX_HEIGHT = 600;
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
                
                resolve(canvas.toDataURL('image/jpeg', 0.5));
              };
              img.onerror = () => reject(new Error("Erreur de chargement de l'image"));
              img.src = event.target?.result as string;
            };
            reader.onerror = () => reject(new Error("Erreur de lecture du fichier"));
            reader.readAsDataURL(file);
          });
        });

        const base64Images = await Promise.all(filePromises);
        
        setFormData(prev => {
          const newImages = [...(prev.images?.filter(i => i !== '') || [])];
          newImages.push(...base64Images);
          if (newImages.length === 0) newImages.push(''); // Ensure at least one element for input field
          return { ...prev, images: newImages };
        });

        setToastMessage('Images uploadées avec succès (Mock local)');
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de l'image. Veuillez réessayer.");
      setShowToast(false);
    } finally {
      // Allow user to select the same file again
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-6 text-white relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <button 
          onClick={openAddModal}
          className="bg-[#E63329] hover:bg-[#c42b22] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
          <Plus size={20} />
          <span>Ajouter un produit</span>
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher un produit..." 
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E63329]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] appearance-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 bg-[#0f172a]/50">
                <th className="p-3 font-medium rounded-tl-lg">Image</th>
                <th className="p-3 font-medium cursor-pointer hover:text-white transition">Nom</th>
                <th className="p-3 font-medium">Catégorie</th>
                <th className="p-3 font-medium cursor-pointer hover:text-white transition">Prix</th>
                <th className="p-3 font-medium cursor-pointer hover:text-white transition">Stock</th>
                <th className="p-3 font-medium">Statut</th>
                <th className="p-3 font-medium text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter(p => !filterCategory || p.categoryId === filterCategory)
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .map((product, idx) => (
                <tr key={product.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="p-3">
                    <div className="w-12 h-12 rounded bg-slate-800 flex items-center justify-center overflow-hidden">
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                  </td>
                  <td className="p-3 font-medium">{product.name}</td>
                  <td className="p-3 text-slate-400">
                    <div>{categories.find(c => c.id === product.categoryId)?.name || 'N/A'}</div>
                    {product.subcategory && (() => {
                      const mobSub = mobilierSubcategories.find(sub => sub.slug === product.subcategory);
                      const carrSub = carrelageSubcategories.find(sub => sub.slug === product.subcategory);
                      const sanSub = sanitairesSubcategories.find(sub => sub.slug === product.subcategory);
                      const activeSub = mobSub || carrSub || sanSub;
                      return activeSub ? (
                        <div className="text-xs text-[#E63329] font-medium mt-0.5 flex items-center gap-1">
                          <span>{activeSub.icon}</span>
                          <span>{activeSub.name}</span>
                        </div>
                      ) : (
                        <div className="text-xs text-[#E63329] font-medium mt-0.5 flex items-center gap-1">
                          <span>📦</span>
                          <span>{product.subcategory}</span>
                        </div>
                      );
                    })()}
                  </td>
                  <td className="p-3">{product.price.toFixed(2)} €</td>
                  <td className="p-3">
                    <span className={product.stock > 0 ? 'text-emerald-500' : 'text-red-500 font-bold'}>
                      {product.stock > 0 ? 'En stock' : 'Rupture'}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${product.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                      {product.status === 'active' ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <Link 
                        to={`/produit/${product.id}`} 
                        className="p-1 hover:text-white transition" 
                        title="Voir sur le site"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Eye size={18} />
                      </Link>
                      <button 
                        type="button" 
                        onClick={(e) => handleDuplicate(product, e)} 
                        className="p-1 hover:text-white transition" 
                        title="Dupliquer"
                      >
                        <Copy size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openEditModal(product); }} 
                        className="p-1 hover:text-blue-500 transition" 
                        title="Modifier"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        type="button"
                        onClick={(e) => handleDelete(product.id, e)} 
                        className="p-1 hover:text-red-500 transition" 
                        title="Supprimer"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination placeholder */}
        <div className="flex justify-between items-center mt-6 text-sm text-slate-400">
          <div>Affichage de la liste des produits</div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Confirmer la suppression</h3>
            <p className="text-slate-400 mb-6">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
              >
                Annuler
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition font-bold"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold">{editingProduct ? "Modifier le produit" : "Ajouter un produit"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Nom du produit <span className="text-red-500">*</span></label>
                      <input 
                        type="text" 
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                        required 
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                      <textarea 
                        rows={4} 
                        value={formData.description || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                      ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Prix (€) <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={formData.price || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                          required 
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Prix barré</label>
                        <input 
                          type="number" 
                          step="0.01" 
                          value={formData.originalPrice || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Stock dispo. <span className="text-red-500">*</span></label>
                        <input 
                          type="number"
                          value={formData.stock || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, stock: Number(e.target.value) }))}
                          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Référence (SKU) <span className="text-red-500">*</span></label>
                        <input 
                          type="text"
                          value={formData.sku || ''}
                          onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                          className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
                      <select 
                        value={formData.status || 'active'}
                        onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                      >
                        <option value="active">Actif</option>
                        <option value="inactive">Inactif</option>
                        <option value="outofstock">En rupture</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-2">Badges du produit</label>
                      <div className="grid grid-cols-2 gap-2 bg-[#0c1222] border border-slate-800 p-3 rounded-lg">
                        {[
                          { value: 'Coups de cœur', label: 'Coup de cœur' },
                          { value: 'Best-seller', label: 'Best-seller' },
                          { value: 'Nouveauté', label: 'Nouveauté' },
                          { value: 'Promo', label: 'Promotion' },
                          { value: 'Exclusif', label: 'Exclusif' }
                        ].map((option) => {
                          const currentBadges = formData.badges || (formData.badge ? [formData.badge] : []);
                          const isChecked = currentBadges.includes(option.value);
                          
                          const handleToggleBadge = (checked: boolean) => {
                            let newBadges = [...currentBadges];
                            if (checked) {
                              if (!newBadges.includes(option.value)) {
                                newBadges.push(option.value);
                              }
                            } else {
                              newBadges = newBadges.filter(b => b !== option.value);
                            }
                            
                            setFormData(prev => ({
                              ...prev,
                              badges: newBadges,
                              badge: newBadges[0] as any || undefined
                            }));
                          };

                          return (
                            <label key={option.value} className="flex items-center gap-2 px-2 py-1.5 hover:bg-slate-800/50 rounded cursor-pointer transition-colors text-slate-300">
                              <input 
                                type="checkbox"
                                checked={isChecked}
                                onChange={(e) => handleToggleBadge(e.target.checked)}
                                className="w-4 h-4 rounded bg-[#0f172a] border-slate-700 text-[#E63329] focus:ring-[#E63329]"
                              />
                              <span className="text-xs">{option.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="isBestSeller" 
                        checked={formData.isBestSeller || false}
                        onChange={(e) => setFormData(prev => ({ ...prev, isBestSeller: e.target.checked }))}
                        className="w-5 h-5 rounded bg-[#0f172a] border-slate-700 text-[#E63329] focus:ring-[#E63329]"
                      />
                      <label htmlFor="isBestSeller" className="text-sm font-medium text-slate-300">
                        Marquer comme Best-seller (Carrousel)
                      </label>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Catégorie <span className="text-red-500">*</span></label>
                      <select 
                        required
                        value={formData.categoryId || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, categoryId: e.target.value }))}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                      >
                        <option value="">Sélectionner une catégorie</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                    </div>

                    {/* Conditional Mobilier Subcategories */}
                    {(() => {
                      const selectedCat = categories.find(c => c.id === formData.categoryId);
                      const isMobilier = selectedCat?.slug === 'mobilier' || formData.categoryId === '3';
                      if (!isMobilier) return null;
                      return (
                        <div className="space-y-1 animate-in fade-in duration-300">
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Sous-catégorie Mobilier <span className="text-red-500">*</span>
                          </label>
                          <select 
                            required
                            value={formData.subcategory || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                            className="w-full bg-[#0f172a] border border-[#E63329]/60 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none ring-1 ring-[#E63329]/20"
                          >
                            <option value="">Sélectionner une sous-catégorie</option>
                            {mobilierSubcategories.map(sub => (
                              <option key={sub.slug} value={sub.slug}>
                                {sub.icon} {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })()}

                    {/* Conditional Sanitaires Subcategories */}
                    {(() => {
                      const selectedCat = categories.find(c => c.id === formData.categoryId);
                      const isSanitaires = selectedCat?.slug === 'sanitaires' || formData.categoryId === '1';
                      if (!isSanitaires) return null;
                      return (
                        <div className="space-y-1 animate-in fade-in duration-300">
                          <label className="block text-sm font-medium text-slate-300 mb-1">
                            Sous-catégorie Sanitaires <span className="text-red-500">*</span>
                          </label>
                          <select 
                            required
                            value={formData.subcategory || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                            className="w-full bg-[#0f172a] border border-[#E63329]/60 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none ring-1 ring-[#E63329]/20"
                          >
                            <option value="">Sélectionner une sous-catégorie</option>
                            {sanitairesSubcategories.map(sub => (
                              <option key={sub.slug} value={sub.slug}>
                                {sub.icon} {sub.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })()}

                    {/* Conditional Carrelage Subcategories */}
                    {(() => {
                      const selectedCat = categories.find(c => c.id === formData.categoryId);
                      const isCarrelage = selectedCat?.slug === 'carrelage' || formData.categoryId === '5';
                      if (!isCarrelage) return null;
                      return (
                        <div className="space-y-4 animate-in fade-in duration-300">
                          <div className="space-y-1">
                            <label className="block text-sm font-medium text-slate-300 mb-1">
                              Sous-catégorie Carrelage <span className="text-red-500">*</span>
                            </label>
                            <select 
                              required
                              value={formData.subcategory || ''}
                              onChange={(e) => setFormData(prev => ({ ...prev, subcategory: e.target.value }))}
                              className="w-full bg-[#0f172a] border border-[#E63329]/60 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none ring-1 ring-[#E63329]/20"
                            >
                              <option value="">Sélectionner une sous-catégorie</option>
                              {carrelageSubcategories.map(sub => (
                                <option key={sub.slug} value={sub.slug}>
                                  {sub.icon} {sub.name}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="bg-slate-900/60 p-4 border border-slate-800 rounded-lg space-y-3.5">
                            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-widest flex items-center gap-1.5">
                              <span>📐 Calculateur de Conditionnement</span>
                            </h4>
                            <div className="grid grid-cols-2 gap-3.5">
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Longueur carreau (cm)</label>
                                <input 
                                  type="number"
                                  placeholder="ex: 60"
                                  value={formData.tileLength || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, tileLength: Number(e.target.value) || undefined }))}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white text-xs focus:border-[#E63329] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Largeur carreau (cm)</label>
                                <input 
                                  type="number"
                                  placeholder="ex: 60"
                                  value={formData.tileWidth || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, tileWidth: Number(e.target.value) || undefined }))}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white text-xs focus:border-[#E63329] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">Carreaux par boîte</label>
                                <input 
                                  type="number"
                                  placeholder="ex: 4"
                                  value={formData.tilesPerBox || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, tilesPerBox: Number(e.target.value) || undefined }))}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white text-xs focus:border-[#E63329] focus:outline-none"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">m² par boîte</label>
                                <input 
                                  type="number"
                                  step="0.01"
                                  placeholder="ex: 1.44"
                                  value={formData.sqmPerBox || ''}
                                  onChange={(e) => setFormData(prev => ({ ...prev, sqmPerBox: Number(e.target.value) || undefined }))}
                                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white text-xs focus:border-[#E63329] focus:outline-none"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1">Images (URLs)</label>
                      
                      <div className="text-right mb-2">
                        <span className="text-xs text-slate-400">Max. 5 images</span>
                      </div>
                      
                      <div 
                        className="border-2 border-dashed border-slate-700 rounded-lg p-4 bg-[#0f172a] flex flex-col items-center justify-center text-center mt-2 cursor-pointer hover:border-[#E63329] transition group min-h-[160px]"
                        onClick={(e) => {
                          if ((e.target as HTMLElement).closest('button')) return; // Check if clicking delete button
                          document.getElementById('product-file-upload')?.click();
                        }}
                      >
                        <input 
                          id="product-file-upload"
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleFileUpload}
                        />
                        {formData.images && formData.images.filter(i => i.trim() !== '').length > 0 ? (
                          <div className="w-full h-full flex flex-col">
                            <div className="grid grid-cols-3 gap-3 mb-4 w-full">
                              {formData.images.map((img, idx) => {
                                if (img.trim() === '') return null;
                                return (
                                  <div key={idx} className="relative group rounded overflow-hidden aspect-square border border-slate-700 bg-slate-800">
                                    <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                    <button 
                                      type="button" 
                                      onClick={(e) => { 
                                        e.stopPropagation(); 
                                        setFormData(prev => {
                                          const newImages = [...(prev.images || [])];
                                          newImages.splice(idx, 1);
                                          if (newImages.length === 0) newImages.push('');
                                          return { ...prev, images: newImages };
                                        });
                                      }}
                                      className="absolute top-1 right-1 bg-red-500 text-white rounded p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition shadow-lg"
                                    >
                                      <Trash2 size={16}/>
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex flex-col items-center mt-auto p-3 border border-dashed border-slate-600 rounded-lg bg-slate-800/50 hover:bg-slate-800">
                              <Upload size={20} className="text-slate-400 mb-1 group-hover:text-[#E63329]" />
                              <span className="text-sm font-medium text-slate-300">Ajouter d'autres images</span>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center p-6">
                            <Upload size={32} className="text-slate-400 mb-3 group-hover:text-[#E63329]" />
                            <span className="text-sm font-medium">Cliquez pour télécharger des images</span>
                            <p className="text-xs text-slate-500 mt-2">PNG, JPG ou WEBP (Multiples possibles)</p>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-700 flex justify-end gap-3 bg-[#0f172a]/50 rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition font-medium">Annuler</button>
              <button onClick={handleSave} className="px-6 py-2.5 rounded-lg bg-[#E63329] hover:bg-[#c42b22] text-white transition font-medium">Enregistrer le produit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
