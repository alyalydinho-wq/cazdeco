import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Tag, Percent, Euro, X, CheckCircle2 } from 'lucide-react';

export default function AdminPromotions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const [promotions, setPromotions] = useState([
    { id: 1, code: 'BIENVENUE10', type: 'percentage', value: 10, expiry: '31/12/2026', usage: '45/100', active: true },
    { id: 2, code: 'LIVRAISONFREE', type: 'fixed', value: 50, expiry: '30/06/2026', usage: '12/∞', active: true },
    { id: 3, code: 'PROMOETE25', type: 'percentage', value: 25, expiry: '31/08/2026', usage: '0/50', active: false },
  ]);

  const [editingPromo, setEditingPromo] = useState<any>(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 0,
    expiry: '',
    usage: '',
    active: true
  });

  const openAddModal = () => {
    setEditingPromo(null);
    setFormData({ code: '', type: 'percentage', value: 0, expiry: '', usage: '', active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (promo: any) => {
    setEditingPromo(promo);
    setFormData({ ...promo });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce code promo ?")) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      setToastMessage('Code promo supprimé');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleSave = () => {
    if (!formData.code || !formData.value) return;

    if (editingPromo) {
      setPromotions(prev => prev.map(p => p.id === editingPromo.id ? { ...p, ...formData } : p));
      setToastMessage('Code promo modifié');
    } else {
      setPromotions(prev => [...prev, { ...formData, id: Date.now(), usage: formData.usage || '0/∞' }]);
      setToastMessage('Code promo ajouté');
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
        <h1 className="text-2xl font-bold">Codes Promo & Promotions</h1>
        <button onClick={openAddModal} className="bg-[#E63329] hover:bg-[#c42b22] text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition">
          <Plus size={20} />
          <span>Créer un code promo</span>
        </button>
      </div>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800 bg-[#0f172a]/50">
              <th className="p-4 font-medium pl-6">Code Promo</th>
              <th className="p-4 font-medium">Réduction</th>
              <th className="p-4 font-medium">Date d'expiration</th>
              <th className="p-4 font-medium">Utilisations</th>
              <th className="p-4 font-medium">Statut</th>
              <th className="p-4 font-medium text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((promo) => (
              <tr key={promo.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-[#E63329]">
                      <Tag size={16} />
                    </div>
                    <span className="font-bold text-base font-mono tracking-wider">{promo.code}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="font-bold text-emerald-400 flex items-center gap-1">
                    {promo.value}
                    {promo.type === 'percentage' ? <Percent size={14} /> : <Euro size={14} />}
                  </span>
                </td>
                <td className="p-4 text-slate-300">{promo.expiry}</td>
                <td className="p-4 text-slate-400">{promo.usage}</td>
                <td className="p-4">
                  {promo.active ? (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">Actif</span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-bold rounded-md bg-slate-700 text-slate-400 border border-slate-600">Inactif</span>
                  )}
                </td>
                <td className="p-4 pr-6">
                  <div className="flex justify-end gap-3 text-slate-400">
                    <button onClick={() => openEditModal(promo)} className="hover:text-blue-500 transition"><Edit2 size={18} /></button>
                    <button onClick={() => handleDelete(promo.id)} className="hover:text-red-500 transition"><Trash2 size={18} /></button>
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
              <h2 className="text-xl font-bold">{editingPromo ? "Modifier code promo" : "Nouveau code promo"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Code promo <span className="text-red-500">*</span></label>
                <input 
                  type="text" 
                  value={formData.code}
                  onChange={(e) => setFormData(p => ({ ...p, code: e.target.value }))}
                  placeholder="Ex: PROMO2026" 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none uppercase" 
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Type de réduction</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData(p => ({ ...p, type: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                  >
                    <option value="percentage">Pourcentage (%)</option>
                    <option value="fixed">Montant fixe (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Valeur <span className="text-red-500">*</span></label>
                  <input 
                    type="number" 
                    value={formData.value || ''}
                    onChange={(e) => setFormData(p => ({ ...p, value: Number(e.target.value) }))}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                    required 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Date d'expiration</label>
                  <input 
                    type="text" 
                    value={formData.expiry}
                    onChange={(e) => setFormData(p => ({ ...p, expiry: e.target.value }))}
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-slate-400 focus:border-[#E63329] focus:outline-none" 
                    placeholder="31/12/2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Limite d'utilisation</label>
                  <input 
                    type="text" 
                    value={formData.usage}
                    onChange={(e) => setFormData(p => ({ ...p, usage: e.target.value }))}
                    placeholder="∞" 
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Statut</label>
                <select 
                  value={formData.active ? "actif" : "inactif"}
                  onChange={(e) => setFormData(p => ({ ...p, active: e.target.value === "actif" }))}
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-[#E63329] focus:outline-none"
                >
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
