import React, { useState, useEffect, useRef } from 'react';
import { 
  Upload, Search, Filter, Maximize2, Link as LinkIcon, Edit2, 
  Trash2, Check, X, FileImage, Copy, Plus, ArrowUp, ArrowDown, 
  Layers, Home, ShoppingBag, Eye, Save, RefreshCw
} from 'lucide-react';
import { useStore } from '../../store';

const defaultsList = [
  { key: 'boutique', label: "Boutique (Page générale d'en-tête boutique)", defaultImage: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=600&q=80", defaultTitle: "Notre Boutique", defaultSubtitle: "Explorez notre catalogue complet pour l'aménagement de votre intérieur." },
  { key: 'sanitaires', label: "Sanitaires & Salles de bain", defaultImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1920&h=600&fit=crop", defaultTitle: "Sanitaires", defaultSubtitle: "Transformez votre salle de bain en un espace de détente. Découvrez notre sélection de robinetterie, douches et meubles vasques alliant design et durabilité." },
  { key: 'cuisines', label: "Cuisines & Aménagements", defaultImage: "/lokticuisine.webp", defaultTitle: "Cuisine", defaultSubtitle: "Découvrez des solutions fonctionnelles et abordables pour créer la cuisine de vos rêves. Explorez nos designs personnalisables et nos solutions de rangement intelligentes. Faisons de votre cuisine le cœur de votre maison !" },
  { key: 'mobilier', label: "Mobilier (Général)", defaultImage: "/mamanfilslokat.jpg", defaultTitle: "Mobilier d'Intérieur", defaultSubtitle: "Créez un intérieur qui vous ressemble avec notre collection de meubles. Du salon à la chambre, trouvez des pièces uniques pour un confort optimal au quotidien." },
  { key: 'articles-deco', label: "Articles Déco", defaultImage: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&h=600&fit=crop", defaultTitle: "Articles Déco", defaultSubtitle: "Les détails qui font la différence. Explorez notre gamme d'objets décoratifs, miroirs et accessoires pour donner du caractère et du style à chaque pièce de votre maison." },
  { key: 'carrelage', label: "Carrelage & Revêtements Sols/Murs", defaultImage: "/nouveautecarrelage.jpg", defaultTitle: "Carrelage & Revêtements", defaultSubtitle: "Revêtez vos sols et murs avec élégance. Un large choix de textures, couleurs et formats pour sublimer vos espaces intérieurs et extérieurs avec qualité." },
  { key: 'luminaires', label: "Luminaires & Éclairage", defaultImage: "/tifille.jpg", defaultTitle: "Luminaires", defaultSubtitle: "Illuminez votre foyer avec style. Suspensions, lampadaires et appliques : découvrez des solutions d'éclairage qui créent l'ambiance parfaite pour chaque moment." },
  { key: 'mobilier-sejour', label: "Mobilier de Séjour", defaultImage: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1920&h=600&fit=crop", defaultTitle: "Mobilier / Séjour", defaultSubtitle: "Le cœur de votre maison mérite le meilleur. Canapés, tables basses et rangements pensés pour allier convivialité et élégance dans votre salon." },
  { key: 'electromenager', label: "Électroménager", defaultImage: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&h=600&fit=crop", defaultTitle: "Électroménager", defaultSubtitle: "La technologie au service de votre confort. Équipez votre maison avec nos appareils performants et économes pour simplifier vos tâches quotidiennes." },
  { key: 'literie', label: "Literie & Chambres", defaultImage: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1920&h=600&fit=crop", defaultTitle: "Literie", defaultSubtitle: "Offrez-vous le sommeil que vous méritez. Matelas, sommiers et oreillers de haute qualité pour des nuits réparatrices et un réveil en pleine forme." },
  { key: 'produit-jetable', label: "Produits Jetables Éco", defaultImage: "https://images.unsplash.com/photo-1517433447747-24bf20bf6a33?q=80&w=1920&h=600&fit=crop", defaultTitle: "Produit Jetable", defaultSubtitle: "Praticité et respect de l'environnement. Découvrez nos solutions jetables écologiques pour vos événements et votre quotidien, sans compromis sur la qualité." },
  { key: 'festivite', label: "Festivités", defaultImage: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1920&h=600&fit=crop", defaultTitle: "Festivité", defaultSubtitle: "Célébrez vos moments précieux. Tout le nécessaire pour vos fêtes et événements : décoration, accessoires et ambiances pour des souvenirs inoubliables." },
  { key: 'meuble-tv', label: "Meuble TV", defaultImage: "https://images.unsplash.com/photo-1593010260424-9b2f694e9f78?q=80&w=1920&h=600&fit=crop", defaultTitle: "Meuble TV", defaultSubtitle: "Alliez multimédia et décoration. Des meubles TV fonctionnels et esthétiques pour intégrer harmonieusement vos écrans dans votre espace de vie." },
  { key: 'plan-de-travail', label: "Plan de travail", defaultImage: "/couplelokta.webp", defaultTitle: "Plan de travail", defaultSubtitle: "La touche finale de votre cuisine. Matériaux robustes et finitions impeccables pour des plans de travail qui résistent au temps et magnifient votre espace." }
];

interface MediaItem {
  id: number;
  url: string;
  name: string;
  size: string;
  dim: string;
  date: string;
  type: string;
}

export default function AdminMedia() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('cazdeco-media');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && !parsed.some((item: any) => item.url === '/lokticuisine.webp' || item.name === 'lokticuisine.webp')) {
          parsed.unshift({ id: 0, url: '/lokticuisine.webp', name: 'lokticuisine.webp', size: '1.4 MB', dim: '1200x800', date: '21/05/2026', type: 'category' });
          localStorage.setItem('cazdeco-media', JSON.stringify(parsed));
        }
        return parsed;
      } catch (e) {
        console.error("Error reading saved media library, fallback to defaults.", e);
      }
    }
    return [
      { id: 0, url: '/lokticuisine.webp', name: 'lokticuisine.webp', size: '1.4 MB', dim: '1200x800', date: '21/05/2026', type: 'category' },
      { id: 1, url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=400&fit=crop', name: 'hero-banner.jpg', size: '1.2 MB', dim: '1920x800', date: '18/05/2026', type: 'banner' },
      { id: 2, url: '/carrelage.jpg', name: 'category-carrelage.jpg', size: '840 KB', dim: '800x600', date: '18/05/2026', type: 'category' },
      { id: 3, url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400&fit=crop', name: 'category-mobilier.jpg', size: '920 KB', dim: '800x600', date: '17/05/2026', type: 'category' },
      { id: 4, url: 'https://images.unsplash.com/photo-1584622781864-1ddc4fb11539?q=80&w=400&fit=crop', name: 'prod-canape-scand.jpg', size: '650 KB', dim: '800x800', date: '15/05/2026', type: 'product' },
      { id: 5, url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=400&fit=crop', name: 'category-luminaires.jpg', size: '780 KB', dim: '800x600', date: '15/05/2026', type: 'category' },
      { id: 6, url: 'https://images.unsplash.com/photo-1600566752355-35792bedcfea?q=80&w=400&fit=crop', name: 'prod-carrelage-marbre.jpg', size: '1.5 MB', dim: '1200x1200', date: '14/05/2026', type: 'product' }
    ];
  });

  // Banner and Page configurations
  const settings = useStore(state => state.settings);
  const updateSettings = useStore(state => state.updateSettings);

  const [activeTab, setActiveTab] = useState<'files' | 'banners'>('files');
  const [imagePickerTarget, setImagePickerTarget] = useState<{ id: string; type: 'slide' | 'category'; key?: string } | null>(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [toastMessage, setToastMessage] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Helper variables for banners configuration
  const localBanners = settings.heroBanners || [];
  const localCategoryBanners = settings.categoryBanners || {};

  // Banner Actions
  const handleUpdateSlideField = (index: number, field: string, value: string) => {
    const updated = [...localBanners];
    updated[index] = { ...updated[index], [field]: value };
    updateSettings({ heroBanners: updated });
    // Keep it synchronized
    showToast("Modification planifiée. Diapositive mise à jour !");
  };

  const handleAddSlide = () => {
    const newSlide = {
      id: String(Date.now()),
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=1080&q=80",
      title: "Nouveau Visuel en Tête (Bannière)",
      subtitle: "Insérez votre texte de présentation ici...",
      buttonText: "Visiter l'espace",
      buttonLink: "/boutique"
    };
    updateSettings({ heroBanners: [...localBanners, newSlide] });
    showToast("Nouvelle diapositive ajoutée au Début / Fin !");
  };

  const handleRemoveSlide = (id: string) => {
    const filtered = localBanners.filter(b => b.id !== id);
    updateSettings({ heroBanners: filtered });
    showToast("Diapositive supprimée de l'accueil");
  };

  const handleMoveSlide = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === localBanners.length - 1) return;

    const updated = [...localBanners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    updateSettings({ heroBanners: updated });
    showToast("Position de la diapositive modifiée");
  };

  const handleUpdateCategoryBanner = (key: string, field: string, value: string) => {
    const currentCustom = localCategoryBanners[key] || { image: '', title: '', subtitle: '' };
    
    // Lazy initialize from default if empty
    if (!currentCustom.title || !currentCustom.image) {
      const def = defaultsList.find(d => d.key === key);
      if (def) {
        currentCustom.image = currentCustom.image || def.defaultImage;
        currentCustom.title = currentCustom.title || def.defaultTitle;
        currentCustom.subtitle = currentCustom.subtitle || def.defaultSubtitle;
      }
    }

    const updatedCategoryBanners = {
      ...localCategoryBanners,
      [key]: {
        ...currentCustom,
        [field]: value
      }
    };

    updateSettings({ categoryBanners: updatedCategoryBanners });
  };

  // Custom Confirmation and Edit states
  const [activeMediaForZoom, setActiveMediaForZoom] = useState<MediaItem | null>(null);
  const [activeMediaForEdit, setActiveMediaForEdit] = useState<MediaItem | null>(null);
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<MediaItem | null>(null);
  const [copyFallbackItem, setCopyFallbackItem] = useState<MediaItem | null>(null);

  // Edit fields state
  const [editName, setEditName] = useState('');
  const [editType, setEditType] = useState('other');
  const [editUrl, setEditUrl] = useState('');
  const [editSize, setEditSize] = useState('');
  const [editDim, setEditDim] = useState('');

  // Hidden File Inputs Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem('cazdeco-media', JSON.stringify(mediaItems));
  }, [mediaItems]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File) => {
      if (file.size > 5 * 1024 * 1024) {
        showToast(`Le fichier "${file.name}" est trop volumineux (max 5Mo)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        const sizeStr = file.size < 1024 * 1024 
          ? `${(file.size / 1024).toFixed(0)} KB` 
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
        
        let fileType = 'other';
        if (file.name.includes('banner') || file.name.includes('slide')) fileType = 'banner';
        else if (file.name.includes('category') || file.name.includes('categ')) fileType = 'category';
        else if (file.name.includes('prod') || file.name.includes('item')) fileType = 'product';

        const newItem: MediaItem = {
          id: Date.now() + Math.floor(Math.random() * 1000),
          url: base64data,
          name: file.name,
          size: sizeStr,
          dim: '800x800',
          date: new Date().toLocaleDateString('fr-FR'),
          type: fileType
        };

        setMediaItems(prev => [newItem, ...prev]);
        showToast(`Image "${file.name}" ajoutée avec succès !`);
      };
      
      reader.readAsDataURL(file);
    });
    
    if (e.target) e.target.value = '';
  };

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Open Edit Modal with full details loaded
  const openEditModal = (item: MediaItem) => {
    setActiveMediaForEdit(item);
    setEditName(item.name);
    setEditType(item.type);
    setEditUrl(item.url);
    setEditSize(item.size);
    setEditDim(item.dim);
  };

  const triggerReplaceFileInput = () => {
    if (replaceFileInputRef.current) {
      replaceFileInputRef.current.click();
    }
  };

  const handleReplaceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 5 * 1024 * 1024) {
      showToast(`Le fichier est trop volumineux (max 5Mo)`);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      const sizeStr = file.size < 1024 * 1024 
        ? `${(file.size / 1024).toFixed(0)} KB` 
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
      
      setEditUrl(base64data);
      setEditSize(sizeStr);
      setEditDim('800x800'); // Standardized for local uploads
      showToast(`Nouvelle image chargée. N'oubliez pas d'enregistrer !`);
    };
    reader.readAsDataURL(file);
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMediaForEdit || !editName.trim()) return;

    setMediaItems(prev => prev.map(item => 
      item.id === activeMediaForEdit.id 
        ? { 
            ...item, 
            name: editName.trim(), 
            type: editType, 
            url: editUrl.trim(),
            size: editSize,
            dim: editDim
          }
        : item
    ));

    showToast(`Fichier mis à jour avec succès (Médiathèque)`);
    setActiveMediaForEdit(null);
  };

  // Safe delete flow without native confirm popups
  const askDeleteConfirmation = (item: MediaItem) => {
    setDeleteConfirmItem(item);
  };

  const handleDeleteConfirm = () => {
    if (!deleteConfirmItem) return;
    setMediaItems(prev => prev.filter(item => item.id !== deleteConfirmItem.id));
    showToast(`Le fichier "${deleteConfirmItem.name}" a été supprimé`);
    setDeleteConfirmItem(null);
  };

  const handleCopyLink = (item: MediaItem) => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(item.url)
        .then(() => {
          setCopiedId(item.id);
          showToast(`Lien copié dans le presse-papiers !`);
          setTimeout(() => setCopiedId(null), 2500);
        })
        .catch(err => {
          console.warn('Navigator clipboard failed, using fallback copy modal.', err);
          setCopyFallbackItem(item);
        });
    } else {
      setCopyFallbackItem(item);
    }
  };

  const filteredItems = mediaItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 text-white text-sm relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-700 text-white px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2 z-[9999] animate-bounce">
          <Check size={18} className="text-green-500 font-bold" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Hidden Upload Inputs */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileUpload} 
        accept="image/*" 
        multiple 
        className="hidden" 
      />

      <input 
        type="file" 
        ref={replaceFileInputRef} 
        onChange={handleReplaceFileUpload} 
        accept="image/*" 
        className="hidden" 
      />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold font-heading">Studio Visuels & Contenus</h1>
          <p className="text-xs text-slate-400">Gérez vos fichiers médias, bannières tournantes d'accueil et bannières par page du site</p>
        </div>
        
        {activeTab === 'files' ? (
          <button 
            onClick={handleBoxClick}
            className="bg-[#E63329] hover:bg-[#c42b22] text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-lg active:scale-95 text-xs uppercase tracking-wider"
          >
            <Upload size={16} />
            <span>Importer des Photos</span>
          </button>
        ) : (
          <button 
            onClick={handleAddSlide}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg font-bold flex items-center gap-2 transition shadow-lg active:scale-95 text-xs uppercase tracking-wider"
          >
            <Plus size={16} />
            <span>Ajouter une Diapositive</span>
          </button>
        )}
      </div>

      {/* Modern High-End Visual Tabs Switcher */}
      <div className="flex border-b border-slate-800 gap-1.5 pt-2">
        <button
          onClick={() => setActiveTab('files')}
          className={`px-5 py-3 rounded-t-xl font-bold flex items-center gap-2.5 transition-all text-xs uppercase tracking-wider ${
            activeTab === 'files' 
              ? 'bg-[#1e293b] border-t-2 border-t-[#E63329] text-white shadow' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-[#1e293b]/30'
          }`}
        >
          <FileImage size={16} className={activeTab === 'files' ? 'text-[#E63329]' : ''} />
          <span>📁 Fichiers de la Médiathèque</span>
        </button>
        <button
          onClick={() => setActiveTab('banners')}
          className={`px-5 py-3 rounded-t-xl font-bold flex items-center gap-2.5 transition-all text-xs uppercase tracking-wider ${
            activeTab === 'banners' 
              ? 'bg-[#1e293b] border-t-2 border-t-[#E63329] text-white shadow' 
              : 'text-slate-400 hover:text-slate-300 hover:bg-[#1e293b]/30'
          }`}
        >
          <Layers size={16} className={activeTab === 'banners' ? 'text-[#E63329]' : ''} />
          <span>✨ Éditeur des Bannières & En-têtes</span>
        </button>
      </div>

      {activeTab === 'files' && (
        <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 shadow-sm">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Rechercher par nom de fichier..." 
                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E63329]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="relative md:w-64">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-10 py-2.5 focus:outline-none focus:border-[#E63329] appearance-none cursor-pointer"
              >
                <option value="all">Tous les types</option>
                <option value="product">Produits</option>
                <option value="category">Catégories</option>
                <option value="banner">Bannières / Slider</option>
                <option value="other">Autres</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <span className="text-xs">▼</span>
              </div>
            </div>
          </div>

          {/* Drag and Drop Selector Zone */}
          <div 
            onClick={handleBoxClick}
            className="border-2 border-dashed border-slate-700 rounded-xl p-8 mb-6 text-center hover:border-[#E63329] transition-colors cursor-pointer bg-[#0f172a]/50 group"
            title="Cliquez pour importer des photos"
          >
            <Upload size={36} className="mx-auto text-slate-500 group-hover:text-[#E63329] mb-3 transition" />
            <p className="font-medium text-slate-300">Sélectionnez ou glissez-déposez des images</p>
            <p className="text-xs text-slate-500 mt-1">Fichiers acceptés : `.jpg, .png, .webp` (Taille max de 5Mo)</p>
          </div>

          {/* Media Grid with always-visible active buttons */}
          {filteredItems.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              Aucun fichier ne correspond à votre recherche ou filtre.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden flex flex-col h-full hover:border-slate-700 transition duration-200 shadow-md group"
                >
                  {/* Visual Area */}
                  <div className="aspect-video sm:aspect-square bg-slate-900 border-b border-slate-850 relative flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.name} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <span className="absolute bottom-2 right-2 bg-slate-950/85 px-2 py-0.5 rounded text-[9px] font-bold text-slate-300 uppercase tracking-widest">
                      {item.type === 'banner' ? 'Bannière' : item.type === 'category' ? 'Catégorie' : item.type === 'product' ? 'Produit' : 'Autre'}
                    </span>
                  </div>

                  {/* Info Text Area */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div className="mb-3">
                      <p className="text-xs font-bold text-slate-100 truncate" title={item.name}>{item.name}</p>
                      <p className="text-[10px] text-slate-500 mt-1">Ajouté le {item.date}</p>
                    </div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono bg-[#1e293b]/50 px-2 py-1 rounded">
                      <span>{item.dim}</span>
                      <span>{item.size}</span>
                    </div>
                  </div>
                  
                  {/* Always-visible active, clean, high-contrast actions bar */}
                  <div className="grid grid-cols-4 border-t border-slate-850 bg-slate-950/40 p-1 gap-1">
                    <button 
                      onClick={() => handleCopyLink(item)}
                      className={`h-9 rounded-lg flex items-center justify-center transition active:scale-95 ${
                        copiedId === item.id 
                          ? 'bg-green-600 text-white font-bold' 
                          : 'bg-[#1e293b] hover:bg-[#E63329] text-slate-300 hover:text-white'
                      }`}
                      title="Copier le lien"
                    >
                      {copiedId === item.id ? <Check size={14} className="stroke-[3px]" /> : <LinkIcon size={14} />}
                    </button>
                    <button 
                      onClick={() => openEditModal(item)}
                      className="h-9 bg-[#1e293b] hover:bg-[#E63329] text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition active:scale-95"
                      title="Modifier / Remplacer"
                    >
                      <Edit2 size={14} />
                    </button>
                    <button 
                      onClick={() => setActiveMediaForZoom(item)}
                      className="h-9 bg-[#1e293b] hover:bg-[#E63329] text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition active:scale-95"
                      title="Agrandir"
                    >
                      <Maximize2 size={14} />
                    </button>
                    <button 
                      onClick={() => askDeleteConfirmation(item)}
                      className="h-9 bg-[#1e293b] hover:bg-red-600 text-slate-300 hover:text-white rounded-lg flex items-center justify-center transition active:scale-95"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. TAB EDIT BANNER & CATEGORIES HEADERS */}
      {activeTab === 'banners' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          
          {/* SECTION 1: HOMEPAGE CAROUSEL */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                  <Home size={18} className="text-[#E63329]" />
                  <span>Carrousel de la Page d'accueil</span>
                </h3>
                <p className="text-xs text-slate-400">Modifiez les grandes bannières tournantes en haut de votre page d'accueil</p>
              </div>
              <button
                onClick={handleAddSlide}
                className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Plus size={14} />
                <span>Nouvelle diapo</span>
              </button>
            </div>

            {localBanners.length === 0 ? (
              <div className="text-center py-10 bg-[#0f172a]/40 border border-dashed border-slate-700 rounded-lg p-6">
                <p className="text-slate-400 font-medium">Aucun visuel enregistré. Cliquez sur le bouton ci-dessus pour ajouter votre premier slide.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {localBanners.map((slide, index) => (
                  <div key={slide.id} className="bg-[#0f172a] rounded-xl border border-slate-800 overflow-hidden shadow">
                    
                    {/* Header bar of Slide Card */}
                    <div className="bg-slate-950/40 px-4 py-3 border-b border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[#E63329]/15 text-[#E63329] text-xs font-bold font-mono flex items-center justify-center border border-[#E63329]/30">
                          {index + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">Diapositive n°{index + 1}</h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMoveSlide(index, 'up')}
                          className="p-1 px-2 bg-[#1e293b] hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                          title="Remonter"
                        >
                          <ArrowUp size={14} />
                        </button>
                        <button
                          disabled={index === localBanners.length - 1}
                          onClick={() => handleMoveSlide(index, 'down')}
                          className="p-1 px-2 bg-[#1e293b] hover:bg-slate-700 rounded text-slate-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition"
                          title="Descendre"
                        >
                          <ArrowDown size={14} />
                        </button>
                        <button
                          onClick={() => handleRemoveSlide(slide.id)}
                          className="p-1 px-2 bg-red-650/10 hover:bg-red-660 text-red-500 hover:text-white rounded transition"
                          title="Supprimer cette diapo"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Main editor area for Slider */}
                    <div className="p-5 grid grid-cols-1 lg:grid-cols-12 gap-6">
                      
                      {/* Left thumbnail image section */}
                      <div className="lg:col-span-4 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Visuel sélectionné</label>
                        <div className="relative aspect-[16/9] w-full rounded-lg overflow-hidden border border-slate-800 bg-slate-950 group">
                          <img src={slide.image} alt="Boutique Banner" className="w-full h-full object-cover" />
                        </div>
                        <div className="grid grid-cols-1 gap-2">
                          <button
                            type="button"
                            onClick={() => setImagePickerTarget({ id: String(index), type: 'slide' })}
                            className="w-full bg-[#E63329]/10 hover:bg-[#E63329]/20 border border-[#E63329]/30 hover:border-[#E63329]/60 text-white font-bold py-1.5 rounded text-xs transition active:scale-95 flex items-center justify-center gap-1.5"
                          >
                            <FileImage size={14} className="text-[#E63329]" />
                            <span>Sélectionner depuis Médiathèque</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <input 
                              type="text"
                              value={slide.image}
                              onChange={(e) => handleUpdateSlideField(index, 'image', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-slate-400 rounded px-2.5 py-1 text-[11px] font-mono focus:outline-none focus:border-[#E63329]"
                              placeholder="Ou collez le lien de l'image..."
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right form with Texts of Sliders */}
                      <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Grand titre de l'accueil</label>
                          <input 
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleUpdateSlideField(index, 'title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329] font-medium text-xs md:text-sm"
                            placeholder="Saisissez le grand titre principal du visuel..."
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Sous-titre / Paragraphe de présentation</label>
                          <textarea 
                            value={slide.subtitle}
                            rows={2}
                            onChange={(e) => handleUpdateSlideField(index, 'subtitle', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329] text-xs resize-none"
                            placeholder="Entrez une brève description explicative..."
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Intitulé du Bouton</label>
                          <input 
                            type="text"
                            value={slide.buttonText}
                            onChange={(e) => handleUpdateSlideField(index, 'buttonText', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329] text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Lien d'action (Adresse URL)</label>
                          <input 
                            type="text"
                            value={slide.buttonLink}
                            onChange={(e) => handleUpdateSlideField(index, 'buttonLink', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329] text-xs font-mono"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SECTION 2: CATEGORY SPECIFIC BANNERS */}
          <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-6 shadow-sm">
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#E63329]" />
                <span>En-têtes et Bannières de Catégories</span>
              </h3>
              <p className="text-xs text-slate-400">Modifiez précisément les images d'en-tête de votre boutique en ligne (Carrelage, Plan de travail, Mobilier, Luminaires, etc.)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {defaultsList.map((categoryDef) => {
                const currentSetting = (localCategoryBanners[categoryDef.key] || {}) as any;
                const image = currentSetting.image || categoryDef.defaultImage;
                const title = currentSetting.title || categoryDef.defaultTitle;
                const subtitle = currentSetting.subtitle || categoryDef.defaultSubtitle;

                return (
                  <div key={categoryDef.key} className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 flex flex-col justify-between hover:border-slate-700/80 transition shadow duration-150">
                    <div>
                      {/* Name of the page head mapping */}
                      <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-3">
                        <span className="font-bold text-slate-200 text-xs font-heading">{categoryDef.label}</span>
                        <span className="text-[10px] text-zinc-500 font-mono capitalize px-2 py-0.5 bg-slate-950 rounded">
                          slug : {categoryDef.key}
                        </span>
                      </div>

                      {/* Display category header miniature */}
                      <div className="aspect-[4/1] w-full rounded-lg overflow-hidden border border-slate-855 bg-slate-950/80 mb-4 relative flex items-center justify-center">
                        <img src={image} alt={categoryDef.defaultTitle} className="absolute inset-0 w-full h-full object-cover filter brightness-[0.4]" />
                        <div className="relative text-center p-2 z-10 pointer-events-none">
                          <p className="text-[11px] font-bold text-white leading-tight font-heading truncate max-w-xs">{title}</p>
                          <p className="text-[8px] text-slate-300 mt-0.5 line-clamp-1 max-w-xs">{subtitle}</p>
                        </div>
                      </div>

                      {/* Editor fields for this specific category */}
                      <div className="space-y-3.5">
                        
                        {/* Selector or URL input */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Image de fond</label>
                          <div className="flex gap-2">
                            <input 
                              type="text"
                              value={image}
                              onChange={(e) => handleUpdateCategoryBanner(categoryDef.key, 'image', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-1.5 text-xs font-mono focus:outline-none focus:border-[#E63329]"
                              placeholder="Image URL..."
                            />
                            <button
                              type="button"
                              onClick={() => setImagePickerTarget({ id: categoryDef.key, type: 'category' })}
                              className="bg-[#1e293b] hover:bg-[#E63329] text-white px-3 py-1.5 rounded text-xs font-bold transition flex items-center justify-center"
                              title="Importer depuis la médiathèque"
                            >
                              📁
                            </button>
                          </div>
                        </div>

                        {/* Title Override */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Titre d'En-tête</label>
                          <input 
                            type="text"
                            value={title}
                            onChange={(e) => handleUpdateCategoryBanner(categoryDef.key, 'title', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-1.5 text-xs focus:outline-none focus:border-[#E63329]"
                            placeholder="Laisser vide pour utiliser le titre par défaut"
                          />
                        </div>

                        {/* Subtitle Override */}
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Texte de description (Sous-titre)</label>
                          <textarea 
                            value={subtitle}
                            rows={3}
                            onChange={(e) => handleUpdateCategoryBanner(categoryDef.key, 'subtitle', e.target.value)}
                            className="w-full bg-slate-950 border border-slate-800 text-white rounded px-3 py-1.5 text-xs leading-relaxed resize-none focus:outline-none focus:border-[#E63329]"
                            placeholder="Saisissez une description de la catégorie..."
                          />
                        </div>

                      </div>
                    </div>

                    {/* Quick reset actions to restore original look */}
                    <div className="mt-4 pt-3 border-t border-slate-850 text-right">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = { ...localCategoryBanners };
                          delete updated[categoryDef.key];
                          updateSettings({ categoryBanners: updated });
                          showToast(`Image et textes de "${categoryDef.label}" réinitialisés !`);
                        }}
                        className="text-[10px] text-red-400 hover:text-red-300 font-bold transition flex items-center justify-end gap-1 ml-auto"
                      >
                        <RefreshCw size={10} />
                        <span>Réinitialiser aux valeurs d'origine</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* Lightbox / Zoom Modal */}
      {activeMediaForZoom && (
        <div className="fixed inset-0 bg-black/95 flex flex-col items-center justify-center p-4 z-[9999]">
          <button 
            onClick={() => setActiveMediaForZoom(null)}
            className="absolute top-6 right-6 text-slate-400 hover:text-white bg-slate-800 p-2.5 rounded-full transition shadow-xl"
            title="Fermer"
          >
            <X size={24} />
          </button>
          
          <div className="max-w-4xl max-h-[80vh] overflow-hidden rounded-lg shadow-2xl bg-slate-900 border border-slate-800 p-2">
            <img 
              src={activeMediaForZoom.url} 
              alt={activeMediaForZoom.name} 
              className="max-w-full max-h-[75vh] object-contain mx-auto" 
            />
          </div>
          
          <div className="mt-4 text-center">
            <h3 className="text-base font-bold text-white font-heading">{activeMediaForZoom.name}</h3>
            <p className="text-xs text-slate-400 mt-1">Dimensions : {activeMediaForZoom.dim} | Taille : {activeMediaForZoom.size} | Date : {activeMediaForZoom.date}</p>
          </div>
        </div>
      )}

      {/* Edit / Change Image Modal */}
      {activeMediaForEdit && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999] overflow-y-auto">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 w-full max-w-lg shadow-2xl relative my-8 animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setActiveMediaForEdit(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 font-heading">Modifier l'élément</h3>
            <p className="text-xs text-slate-400 mb-6">Mettez à jour le nom, modifiez la catégorie ou remplacez l'image elle-même.</p>
            
            <form onSubmit={handleEditSave} className="space-y-5">
              {/* Image Preview Container */}
              <div className="bg-[#0f172a] rounded-lg p-3 border border-slate-850 flex flex-col sm:flex-row gap-4 items-center">
                <div className="w-20 h-20 bg-slate-900 rounded overflow-hidden flex-shrink-0 border border-slate-800 flex items-center justify-center">
                  <img src={editUrl} alt="Quick preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 w-full text-center sm:text-left">
                  <p className="text-xs text-slate-300 font-bold mb-2">Changer / Remplacer cette image :</p>
                  <button
                    type="button"
                    onClick={triggerReplaceFileInput}
                    className="bg-[#E63329] hover:bg-[#c42b22] text-white px-3.5 py-1.5 rounded text-xs font-bold transition flex items-center gap-1.5 mx-auto sm:mx-0 active:scale-95"
                  >
                    <Upload size={14} />
                    <span>Choisir une nouvelle photo</span>
                  </button>
                  <p className="text-[10px] text-slate-500 mt-1">Sélectionnez un fichier pour remplacer l'actuel.</p>
                </div>
              </div>

              {/* Name input */}
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Nom du fichier</label>
                <input 
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] text-xs font-semibold"
                  required
                />
              </div>

              {/* URL String input */}
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Adresse URL de la source (Texte / Base64)</label>
                <input 
                  type="text"
                  value={editUrl}
                  onChange={(e) => setEditUrl(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 text-slate-300 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] text-xs font-mono"
                  placeholder="URL absolue ou Base64..."
                  required
                />
              </div>

              {/* Type Category selection */}
              <div>
                <label className="block text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Rubrique d'utilisation</label>
                <select
                  value={editType}
                  onChange={(e) => setEditType(e.target.value)}
                  className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] text-xs cursor-pointer"
                >
                  <option value="product">Produits (Dédié fiches produits)</option>
                  <option value="category">Catégories (Pour les images d'en-tête)</option>
                  <option value="banner">Bannières / Carrousels et Sliders</option>
                  <option value="other">Autres visuels génériques</option>
                </select>
              </div>

              {/* Technical indicators info */}
              <div className="grid grid-cols-2 gap-4 bg-[#0f172a]/50 p-3 rounded-lg border border-slate-800 text-[10px] text-slate-400 font-mono">
                <div>Dimensions : {editDim}</div>
                <div className="text-right">Taille : {editSize}</div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button 
                  type="button"
                  onClick={() => setActiveMediaForEdit(null)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium transition text-xs"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="bg-[#E63329] hover:bg-[#c42b22] text-white px-5 py-2 rounded-lg font-bold transition text-xs active:scale-95"
                >
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fallback Copy Dialog (In case direct writeText gets blocked in sandbox frames) */}
      {copyFallbackItem && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200">
            <button 
              onClick={() => setCopyFallbackItem(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
            >
              <X size={20} />
            </button>
            <h3 className="text-base font-bold text-white mb-2 font-heading">Copier le lien</h3>
            <p className="text-xs text-slate-400 mb-4">Votre navigateur requiert de copier manuellement l'adresse ci-dessous :</p>
            
            <div className="space-y-4">
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={copyFallbackItem.url} 
                  readOnly 
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                  className="bg-[#0f172a] border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono text-slate-300 w-full focus:outline-none focus:ring-1 focus:ring-[#E63329]"
                />
                <button
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(copyFallbackItem.url);
                    }
                    showToast("Copié !");
                    setCopyFallbackItem(null);
                  }}
                  className="bg-[#E63329] hover:bg-[#c42b22] text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                >
                  <Copy size={14} />
                  <span>Copier</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-500">Cliquez dans le champ pour tout sélectionner automatiquement.</p>
            </div>
          </div>
        </div>
      )}

      {/* Safe Custom Delete Confirmation Modal */}
      {deleteConfirmItem && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[9999] animate-fade-in">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 w-full max-w-md shadow-2xl relative animate-in zoom-in-95 duration-200 text-center">
            <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-550">
              <Trash2 size={24} />
            </div>
            
            <h3 className="text-lg font-bold text-white font-heading mb-2">Confirmer la suppression</h3>
            <p className="text-xs text-slate-300 mb-2 font-medium">Êtes-vous sûr de vouloir supprimer définitivement ce fichier ?</p>
            <p className="text-xs font-mono bg-[#0f172a] px-3 py-1.5 rounded border border-slate-800 text-red-400 truncate mb-6 max-w-full">
              {deleteConfirmItem.name}
            </p>

            <div className="flex gap-3 justify-center">
              <button
                type="button"
                onClick={() => setDeleteConfirmItem(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium transition text-xs"
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg font-bold transition text-xs active:scale-95"
              >
                Supprimer le fichier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Image Picker Modal from Library */}
      {imagePickerTarget && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center p-4 z-[9999] overflow-y-auto animate-fade-in text-white">
          <div className="bg-[#1e293b] border border-slate-800 rounded-xl p-6 w-full max-w-4xl shadow-2xl relative animate-in zoom-in-95 duration-250 my-8">
            <button 
              onClick={() => setImagePickerTarget(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-2 rounded-full hover:bg-slate-800 transition"
              title="Fermer"
            >
              <X size={20} />
            </button>
            
            <div className="border-b border-slate-800 pb-4 mb-6">
              <h3 className="text-lg font-bold text-white font-heading flex items-center gap-2">
                <FileImage size={18} className="text-[#E63329]" />
                <span>Sélectionner une photo de la Médiathèque</span>
              </h3>
              <p className="text-xs text-slate-400 mt-1">Cliquez sur n'importe quel visuel ci-dessous pour l'associer instantanément à votre en-tête ou diapositive.</p>
            </div>

            {/* Visual selector search input */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Rechercher par nom d'image..." 
                className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-[#E63329] text-xs"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {mediaItems.length === 0 ? (
              <div className="text-center py-10 bg-[#0f172a]/40 border border-dashed border-slate-700 rounded-lg p-6 text-slate-400">
                Vous n'avez pas encore d'images dans votre médiathèque. Veuillez d'abord en importer dans l'onglet "Fichiers".
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                {mediaItems
                  .filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        if (imagePickerTarget.type === 'slide') {
                          const idx = Number(imagePickerTarget.id);
                          handleUpdateSlideField(idx, 'image', item.url);
                        } else if (imagePickerTarget.type === 'category') {
                          handleUpdateCategoryBanner(imagePickerTarget.id, 'image', item.url);
                        }
                        setImagePickerTarget(null);
                        showToast("Visuel lié avec succès !");
                      }}
                      className="group text-left bg-[#0f172a] hover:bg-[#0f172a]/80 border border-slate-805 hover:border-[#E63329] rounded-lg overflow-hidden transition-all duration-150 relative"
                    >
                      <div className="aspect-video bg-slate-900 overflow-hidden relative">
                        <img 
                          src={item.url} 
                          alt={item.name} 
                          className="w-full h-full object-cover transition duration-300 group-hover:scale-110" 
                        />
                      </div>
                      <div className="p-2">
                        <p className="text-[10px] text-slate-300 truncate font-semibold">{item.name}</p>
                        <p className="text-[8px] text-slate-505 font-mono mt-0.5">{item.dim}</p>
                      </div>
                      <div className="absolute top-2 right-2 bg-[#E63329] text-white p-1 rounded opacity-0 group-hover:opacity-100 transition duration-150">
                        <Check size={10} className="stroke-[3px]" />
                      </div>
                    </button>
                  ))}
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setImagePickerTarget(null)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-lg font-medium transition text-xs"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
