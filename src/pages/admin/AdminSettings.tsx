import React, { useState, useEffect } from 'react';
import { Save, CheckCircle2, Plus, Trash2 } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);
  
  const settings = useStore(state => state.settings);
  const updateSettings = useStore(state => state.updateSettings);

  const [formData, setFormData] = useState(settings);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleBannerChange = (id: string, field: string, value: string) => {
    setFormData(prev => {
      const updatedBanners = (prev.heroBanners || []).map(b => 
        b.id === id ? { ...b, [field]: value } : b
      );
      return { ...prev, heroBanners: updatedBanners };
    });
  };

  const deleteBanner = (id: string) => {
    setFormData(prev => ({
      ...prev,
      heroBanners: (prev.heroBanners || []).filter(b => b.id !== id)
    }));
  };

  const addBanner = () => {
    const newId = Math.random().toString(36).substring(2, 9).toUpperCase();
    const newBanner = {
      id: newId,
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=1080&q=80",
      title: "Nouvelle Bannière",
      subtitle: "Description de la nouvelle bannière promotionnelle.",
      buttonText: "Boutique",
      buttonLink: "/boutique"
    };
    setFormData(prev => ({
      ...prev,
      heroBanners: [...(prev.heroBanners || []), newBanner]
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'shippingStandard' || name === 'shippingFreeThreshold' ? Number(value) : value
    }));
  };

  const handleSave = () => {
    updateSettings(formData);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-white text-sm relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5">
          <CheckCircle2 size={20} />
          <span className="font-medium">Modifications enregistrées avec succès</span>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Paramètres du site</h1>
        <button 
          onClick={handleSave}
          className="bg-[#E63329] hover:bg-[#c42b22] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition"
        >
          <Save size={20} />
          <span>Enregistrer les modifications</span>
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Navigation Tabs */}
        <div className="w-full md:w-64 bg-[#1e293b] border border-slate-800 rounded-xl overflow-hidden shrink-0">
          <button 
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-3 font-medium transition-colors border-l-2 ${activeTab === 'general' ? 'border-[#E63329] bg-slate-800 text-white' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Général
          </button>
          <button 
            onClick={() => setActiveTab('banners')}
            className={`w-full text-left px-4 py-3 font-medium transition-colors border-l-2 ${activeTab === 'banners' ? 'border-[#E63329] bg-slate-800 text-white' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Bannières & Slider
          </button>
          <button 
            onClick={() => setActiveTab('shipping')}
            className={`w-full text-left px-4 py-3 font-medium transition-colors border-l-2 ${activeTab === 'shipping' ? 'border-[#E63329] bg-slate-800 text-white' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Livraison
          </button>
          <button 
            onClick={() => setActiveTab('security')}
            className={`w-full text-left px-4 py-3 font-medium transition-colors border-l-2 ${activeTab === 'security' ? 'border-[#E63329] bg-slate-800 text-white' : 'border-transparent text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            Sécurité (Admin)
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 bg-[#1e293b] border border-slate-800 rounded-xl p-6 w-full">
          {activeTab === 'general' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">Informations principales</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nom du site</label>
                  <input type="text" name="siteName" value={formData.siteName || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Slogan</label>
                  <input type="text" name="slogan" value={formData.slogan || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-slate-300 font-medium mb-1">Texte Promotionnel Banniére</label>
                  <input type="text" name="promotionalText" value={formData.promotionalText || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email de contact</label>
                  <input type="email" name="contactEmail" value={formData.contactEmail || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Téléphone</label>
                  <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Adresse (Pied de page)</label>
                  <textarea rows={3} name="address" value={formData.address || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]"></textarea>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">Paramètres de livraison (La Réunion, Mayotte)</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Frais de livraison standard (€)</label>
                  <input type="number" name="shippingStandard" value={formData.shippingStandard || 0} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Livraison gratuite à partir de (€)</label>
                  <input type="number" name="shippingFreeThreshold" value={formData.shippingFreeThreshold || 0} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Délai estimé (jours)</label>
                  <input type="text" name="shippingDelay" value={formData.shippingDelay || ''} onChange={handleChange} className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">Identifiants Administrateur</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Email administrateur</label>
                  <input type="email" defaultValue="admin@cazdeco.re" className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
              </div>

              <h2 className="text-lg font-bold border-b border-slate-700 pb-2 mb-4">Changer le mot de passe</h2>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Ancien mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Confirmer mot de passe</label>
                  <input type="password" placeholder="••••••••" className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:border-[#E63329]" />
                </div>
                <button className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded font-medium transition">Mettre à jour le mot de passe</button>
              </div>
            </div>
          )}

          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-700 pb-2 mb-4">
                <div>
                  <h2 className="text-lg font-bold">Gestion du Slider Accueil</h2>
                  <p className="text-xs text-slate-400">Configurez les bannières publicitaires animées de la page d'accueil</p>
                </div>
                <button
                  type="button"
                  onClick={addBanner}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition"
                >
                  <Plus size={14} />
                  <span>Ajouter une diapositive</span>
                </button>
              </div>

              {(!formData.heroBanners || formData.heroBanners.length === 0) ? (
                <div className="text-center py-12 bg-[#0f172a]/40 border border-dashed border-slate-700 rounded-lg">
                  <p className="text-slate-400">Aucune bannière configurée. Cliquez sur "Ajouter une diapositive" pour commencer.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {formData.heroBanners.map((banner, index) => (
                    <div key={banner.id} className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 flex flex-col lg:flex-row gap-6">
                      {/* Slide Preview Background wrapper */}
                      <div className="w-full lg:w-48 shrink-0">
                        <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Aperçu de l'image</span>
                        <div className="aspect-[16/9] lg:aspect-square bg-slate-800 rounded-lg overflow-hidden relative border border-slate-700">
                          {banner.image ? (
                            <img src={banner.image} alt="Preview" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900">
                              <span className="text-xs">Pas d'image</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Config Inputs */}
                      <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-white uppercase tracking-widest bg-[#E63329] px-2 py-1 rounded">Diapositive #{index + 1}</span>
                          <button
                            type="button"
                            onClick={() => deleteBanner(banner.id)}
                            className="text-slate-400 hover:text-red-500 hover:bg-red-500/10 p-1.5 rounded transition"
                            title="Supprimer cette diapositive"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs text-slate-300 font-medium mb-1">URL de l'image (Ex: Unsplash, ou lien de la Médiathèque)</label>
                            <input
                              type="text"
                              value={banner.image}
                              onChange={(e) => handleBannerChange(banner.id, 'image', e.target.value)}
                              className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E63329]"
                              placeholder="https://..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 font-medium mb-1">Lien du bouton (ex: /boutique?category=...)</label>
                            <input
                              type="text"
                              value={banner.buttonLink}
                              onChange={(e) => handleBannerChange(banner.id, 'buttonLink', e.target.value)}
                              className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E63329]"
                              placeholder="/boutique"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300 font-medium mb-1">Titre principal</label>
                          <input
                            type="text"
                            value={banner.title}
                            onChange={(e) => handleBannerChange(banner.id, 'title', e.target.value)}
                            className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-[#E63329]"
                            placeholder="Titre accrocheur..."
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-2">
                            <label className="block text-xs text-slate-300 font-medium mb-1">Sous-titre / Description courte</label>
                            <input
                              type="text"
                              value={banner.subtitle}
                              onChange={(e) => handleBannerChange(banner.id, 'subtitle', e.target.value)}
                              className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E63329]"
                              placeholder="Description complémentaire..."
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300 font-medium mb-1">Texte du bouton</label>
                            <input
                              type="text"
                              value={banner.buttonText}
                              onChange={(e) => handleBannerChange(banner.id, 'buttonText', e.target.value)}
                              className="w-full bg-[#1e293b] border border-slate-700 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#E63329]"
                              placeholder="Découvrir"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
