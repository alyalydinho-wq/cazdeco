import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Ban, 
  CheckCircle2, 
  Plus, 
  Edit2, 
  Trash2, 
  X, 
  AlertTriangle, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  TrendingUp, 
  FileText,
  UserCheck,
  Award,
  PlusCircle
} from 'lucide-react';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  date: string;
  orders: number;
  total: number;
  active: boolean;
  notes: string;
}

export default function AdminCustomers() {
  const [searchTerm, setSearchTerm] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Simulated initial customers with enhanced fields
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'Jean Dupont', email: 'jean.dupont@email.com', phone: '06 39 12 34 56', address: '1 rue Mahabou, Mamoudzou 97600', date: '12/01/2026', orders: 3, total: 1450.00, active: true, notes: 'Client fidèle. Préfère l\'aménagement de salon.' },
    { id: 2, name: 'Marie Payet', email: 'marie.p@email.com', phone: '06 39 98 76 54', address: '12 Impasse des Fleurs, Kawéni 97600', date: '05/03/2026', orders: 1, total: 1250.00, active: true, notes: 'Intéressée par les offres de carrelage.' },
    { id: 3, name: 'Lucas Hoarau', email: 'lucas.h@email.com', phone: '06 39 45 61 23', address: '8 Rue Mahabou, Mamoudzou 97600', date: '18/04/2026', orders: 5, total: 850.50, active: true, notes: 'Acheteur professionnel d\'outils et déco.' },
    { id: 4, name: 'Sophie Grondin', email: 'sophie.g@email.com', phone: '06 39 77 88 99', address: 'Lotissement Balambo, Majicavo 97600', date: '10/05/2026', orders: 0, total: 0.00, active: false, notes: 'Compte créé mais n\'a pas encore de commandes.' },
    { id: 5, name: 'Paul Fontaine', email: 'paul.f@email.com', phone: '06 39 11 22 33', address: '1 Impasse Maharaja, Kaweni 97600', date: '15/05/2026', orders: 2, total: 320.00, active: true, notes: 'Préfère la livraison directe à Kaweni.' },
  ]);

  // Modal control states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [detailsCustomer, setDetailsCustomer] = useState<Customer | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [isSimulationModalOpen, setIsSimulationModalOpen] = useState(false);
  const [simulationCustomerId, setSimulationCustomerId] = useState<number | null>(null);
  const [simulatedOrderMultiplier, setSimulatedOrderMultiplier] = useState('1');
  const [simulatedOrderValue, setSimulatedOrderValue] = useState('150');

  // Fields state for add/edit form
  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    active: true,
    orders: '0',
    total: '0.00',
    notes: '',
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleToggle = (id: number) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === id) {
        const newStatus = !c.active;
        showNotification(`Client ${newStatus ? 'réactivé' : 'désactivé'} avec succès`);
        return { ...c, active: newStatus };
      }
      return c;
    }));
  };

  const openAddModal = () => {
    setFormMode('add');
    setSelectedCustomerId(null);
    setFields({
      name: '',
      email: '',
      phone: '',
      address: '',
      active: true,
      orders: '0',
      total: '0.00',
      notes: '',
    });
    setIsFormModalOpen(true);
  };

  const openEditModal = (customer: Customer) => {
    setFormMode('edit');
    setSelectedCustomerId(customer.id);
    setFields({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      active: customer.active,
      orders: customer.orders.toString(),
      total: customer.total.toFixed(2),
      notes: customer.notes,
    });
    setIsFormModalOpen(true);
  };

  const openDetailsModal = (customer: Customer) => {
    setDetailsCustomer(customer);
    setIsDetailsModalOpen(true);
  };

  const openDeleteModal = (customer: Customer) => {
    setCustomerToDelete(customer);
    setIsDeleteModalOpen(true);
  };

  const openSimulationModal = (customer: Customer) => {
    setSimulationCustomerId(customer.id);
    setSimulatedOrderMultiplier('1');
    setSimulatedOrderValue('150');
    setIsSimulationModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fields.name.trim() || !fields.email.trim()) {
      showNotification('Le nom et l\'email sont obligatoires.', 'error');
      return;
    }

    if (formMode === 'add') {
      const newCustomer: Customer = {
        id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
        name: fields.name,
        email: fields.email,
        phone: fields.phone || 'Non renseigné',
        address: fields.address || 'Non renseignée',
        date: new Date().toLocaleDateString('fr-FR'),
        orders: parseInt(fields.orders) || 0,
        total: parseFloat(fields.total) || 0.00,
        active: fields.active,
        notes: fields.notes,
      };
      setCustomers(prev => [...prev, newCustomer]);
      showNotification('Nouveau client ajouté avec succès');
    } else {
      setCustomers(prev => prev.map(c => {
        if (c.id === selectedCustomerId) {
          return {
            ...c,
            name: fields.name,
            email: fields.email,
            phone: fields.phone || 'Non renseigné',
            address: fields.address || 'Non renseignée',
            active: fields.active,
            orders: parseInt(fields.orders) || 0,
            total: parseFloat(fields.total) || 0.00,
            notes: fields.notes,
          };
        }
        return c;
      }));
      showNotification('Client modifié avec succès');
    }

    setIsFormModalOpen(false);
  };

  const handleDeleteConfirm = () => {
    if (customerToDelete) {
      setCustomers(prev => prev.filter(c => c.id !== customerToDelete.id));
      showNotification(`Le client "${customerToDelete.name}" a été définitivement supprimé.`);
      setIsDeleteModalOpen(false);
      setCustomerToDelete(null);
    }
  };

  const handleSimulationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const count = parseInt(simulatedOrderMultiplier) || 1;
    const value = parseFloat(simulatedOrderValue) || 150.00;

    setCustomers(prev => prev.map(c => {
      if (c.id === simulationCustomerId) {
        return {
          ...c,
          orders: c.orders + count,
          total: c.total + (value * count),
        };
      }
      return c;
    }));

    showNotification(`Simulation réussie ! +${count} commande(s) (${(value * count).toFixed(2)} €) ajoutée(s).`);
    setIsSimulationModalOpen(false);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 text-white text-sm relative">
      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed bottom-6 right-6 ${toastType === 'success' ? 'bg-emerald-500' : 'bg-[#E63329]'} text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-in slide-in-from-bottom-5`}>
          <CheckCircle2 size={20} />
          <span className="font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header section with add button */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Gestion des clients</h1>
          <p className="text-slate-400 text-xs">Suivi des comptes clients de la boutique, de leurs commandes et de leurs coordonnées.</p>
        </div>
        
        <button 
          onClick={openAddModal}
          className="bg-[#E63329] hover:bg-[#c22b22] text-white font-medium px-4 py-2.5 rounded-lg flex items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={18} strokeWidth={2.5} />
          <span className="text-xs font-bold uppercase tracking-wider">Ajouter un client</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-4">
        <div className="flex mb-6 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par nom, email ou téléphone..." 
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E63329]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto rounded-lg border border-slate-800/85">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 bg-[#0f172a]/50">
                <th className="p-4 font-medium pl-6 rounded-tl-lg">Nom du client</th>
                <th className="p-4 font-medium">Contact</th>
                <th className="p-4 font-medium">Date d'inscription</th>
                <th className="p-4 font-medium text-center">Commandes</th>
                <th className="p-4 font-medium text-right">Total dépensé</th>
                <th className="p-4 font-medium text-center">Statut</th>
                <th className="p-4 font-medium text-right rounded-tr-lg pr-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className={`border-b border-slate-800 hover:bg-slate-800/50 transition-colors ${!customer.active ? 'opacity-60 bg-red-950/5' : ''}`}>
                    <td className="p-4 pl-6 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-700/60 text-white flex items-center justify-center text-xs font-bold uppercase border border-slate-600">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-semibold text-white">{customer.name}</div>
                          <span className="text-[10px] text-slate-500 uppercase font-mono tracking-wider">ID: {customer.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-0.5 text-xs text-slate-400">
                        <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-500" /> {customer.email}</span>
                        <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-500" /> {customer.phone}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar size={13} className="text-slate-500" />
                        {customer.date}
                      </span>
                    </td>
                    <td className="p-4 text-center font-semibold text-slate-300">
                      <span className="px-2 py-1 rounded bg-[#0f172a] text-xs font-mono">{customer.orders}</span>
                    </td>
                    <td className="p-4 text-right font-mono text-emerald-400 font-bold">{customer.total.toFixed(2)} €</td>
                    <td className="p-4 text-center">
                      {customer.active ? (
                        <span className="text-emerald-500 text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">Actif</span>
                      ) : (
                        <span className="text-red-500 text-[11px] font-bold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 uppercase tracking-widest">Bloqué</span>
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <div className="flex items-center justify-end gap-1.5 text-slate-400">
                        <button 
                          onClick={() => openDetailsModal(customer)} 
                          className="p-1.5 hover:bg-slate-700/50 hover:text-white rounded transition" 
                          title="Fiche détaillée"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => openEditModal(customer)} 
                          className="p-1.5 hover:bg-slate-700/50 hover:text-cyan-400 rounded transition" 
                          title="Modifier les détails"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => openSimulationModal(customer)}
                          className="p-1.5 hover:bg-slate-700/50 hover:text-amber-400 rounded transition"
                          title="Simuler un achat"
                        >
                          <PlusCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleToggle(customer.id)} 
                          className={`p-1.5 rounded transition ${customer.active ? 'hover:text-red-400 hover:bg-red-500/10' : 'hover:text-emerald-400 hover:bg-emerald-500/10'}`} 
                          title={customer.active ? "Bloquer l'accès" : "Réactiver le compte"}
                        >
                          <Ban size={18} />
                        </button>
                        <button 
                          onClick={() => openDeleteModal(customer)} 
                          className="p-1.5 hover:bg-red-500/10 hover:text-[#E63329] rounded transition" 
                          title="Supprimer définitivement"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    <p className="text-base font-medium">Aucun client trouvé</p>
                    <p className="text-xs mt-1">Modifiez vos critères de recherche.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORM MODAL (Add / Edit) */}
      {isFormModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 w-full max-w-lg p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200 text-white">
            <button 
              onClick={() => setIsFormModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-full"
            >
              <X size={20} />
            </button>
            
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 border-b border-slate-800 pb-3">
              {formMode === 'add' ? (
                <>
                  <Plus className="text-[#E63329]" size={22} />
                  <span>Ajouter un nouveau client</span>
                </>
              ) : (
                <>
                  <Edit2 className="text-[#E63329]" size={20} />
                  <span>Modifier le profil de {fields.name}</span>
                </>
              )}
            </h2>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nom complet *</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Ex: Jean Dupont"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E63329] text-sm"
                    value={fields.name}
                    onChange={(e) => setFields({ ...fields, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Adresse email *</label>
                  <input 
                    type="email" 
                    required
                    placeholder="Ex: mail@domain.com"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E63329] text-sm"
                    value={fields.email}
                    onChange={(e) => setFields({ ...fields, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">N° de téléphone</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 06 39 00 00 00"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E63329] text-sm"
                    value={fields.phone}
                    onChange={(e) => setFields({ ...fields, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Adresse postale</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 1 Impousse Maharaja, Kawéni"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-[#E63329] text-sm"
                    value={fields.address}
                    onChange={(e) => setFields({ ...fields, address: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#0f172a]/40 p-3 rounded-lg border border-slate-800">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre d'achats</label>
                  <input 
                    type="number" 
                    min="0"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#E63329] text-xs font-mono"
                    value={fields.orders}
                    onChange={(e) => setFields({ ...fields, orders: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Total dépensé (€)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-[#E63329] text-xs font-mono"
                    value={fields.total}
                    onChange={(e) => setFields({ ...fields, total: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Commentaires & Remarques</label>
                <textarea 
                  rows={3}
                  placeholder="Notes internes à l'attention du staff..."
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white text-xs resize-none focus:outline-none focus:border-[#E63329]"
                  value={fields.notes}
                  onChange={(e) => setFields({ ...fields, notes: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-3 py-1">
                <input 
                  type="checkbox" 
                  id="client-active-checkbox"
                  className="w-4.5 h-4.5 accent-[#E63329] rounded cursor-pointer"
                  checked={fields.active}
                  onChange={(e) => setFields({ ...fields, active: e.target.checked })}
                />
                <label htmlFor="client-active-checkbox" className="text-slate-300 font-medium text-xs cursor-pointer select-none">
                  Compte client actif (autorisé à commander)
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs font-bold uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#E63329] hover:bg-red-700 text-white rounded-lg transition text-xs font-bold uppercase tracking-wider"
                >
                  {formMode === 'add' ? 'Créer le compte' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED VIEW MODAL */}
      {isDetailsModalOpen && detailsCustomer && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 w-full max-w-xl p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsDetailsModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-full"
            >
              <X size={20} />
            </button>

            {/* Profile banner */}
            <div className="flex items-start gap-4 pb-5 border-b border-slate-800">
              <div className="w-14 h-14 rounded-full bg-[#E63329]/10 text-[#E63329] flex items-center justify-center text-lg font-bold border border-[#E63329]/20 shrink-0">
                {detailsCustomer.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white leading-snug">{detailsCustomer.name}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[10px] uppercase font-mono tracking-wider bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">ID: {detailsCustomer.id}</span>
                  {detailsCustomer.active ? (
                    <span className="text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 uppercase tracking-widest">Actif</span>
                  ) : (
                    <span className="text-red-500 text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 uppercase tracking-widest">Bloqué</span>
                  )}
                </div>
              </div>
            </div>

            {/* Core statistics cards */}
            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                  <TrendingUp size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Total Dépensé</div>
                  <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{detailsCustomer.total.toFixed(2)} €</div>
                </div>
              </div>
              
              <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-800 flex items-center gap-3">
                <div className="w-9 h-9 shrink-0 rounded bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Commandes validées</div>
                  <div className="text-lg font-bold text-indigo-400 font-mono mt-0.5">{detailsCustomer.orders}</div>
                </div>
              </div>
            </div>

            {/* Contact Details stack */}
            <div className="space-y-3.5 bg-[#0f172a]/45 border border-slate-800 p-4 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-1.5 border-b border-slate-800 flex items-center gap-1.5">
                <UserCheck size={14} className="text-slate-500" /> Coordonnées du client
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                <div className="flex items-center gap-2.5 text-slate-300">
                  <Mail size={15} className="text-slate-500 shrink-0" />
                  <div className="text-xs truncate">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Email</span>
                    <a href={`mailto:${detailsCustomer.email}`} className="hover:underline text-sky-400">{detailsCustomer.email}</a>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 text-slate-300">
                  <Phone size={15} className="text-slate-500 shrink-0" />
                  <div className="text-xs truncate">
                    <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Téléphone</span>
                    {detailsCustomer.phone !== 'Non renseigné' ? (
                      <a href={`tel:${detailsCustomer.phone}`} className="hover:underline text-sky-400">{detailsCustomer.phone}</a>
                    ) : (
                      <span className="text-slate-500">{detailsCustomer.phone}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-slate-300 pt-2 border-t border-slate-800/60">
                <MapPin size={15} className="text-slate-500 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Adresse de livraison</span>
                  <p className="leading-relaxed">{detailsCustomer.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 text-slate-300 pt-2 border-t border-slate-800/60">
                <Calendar size={15} className="text-slate-500 shrink-0" />
                <div className="text-xs">
                  <span className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5">Membre depuis</span>
                  <p>{detailsCustomer.date}</p>
                </div>
              </div>
            </div>

            {/* Notes Section */}
            <div className="mt-4 p-4 bg-[#0f172a]/20 border border-slate-800 rounded-lg">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <FileText size={14} className="text-slate-500" /> Notes Internes
              </h3>
              <p className="text-xs leading-relaxed text-slate-300 font-light italic">
                {detailsCustomer.notes || "Aucune note consignée pour ce client."}
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-800">
              <button 
                onClick={() => {
                  setIsDetailsModalOpen(false);
                  openEditModal(detailsCustomer);
                }}
                className="px-4 py-2 border border-slate-700 hover:border-white text-slate-400 hover:text-white rounded-lg transition text-xs font-bold uppercase tracking-wider"
              >
                Modifier le profil
              </button>
              <button 
                onClick={() => setIsDetailsModalOpen(false)}
                className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition text-xs font-bold uppercase tracking-wider border border-slate-700"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SIMULATE ORDER MODAL (Other useful actions) */}
      {isSimulationModalOpen && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 w-full max-w-md p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsSimulationModalOpen(false)} 
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition p-1 hover:bg-slate-800 rounded-full"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <PlusCircle className="text-amber-500" size={22} />
              <span>Simuler / Enregistrer un achat</span>
            </h2>

            <p className="text-slate-400 text-xs mb-4 leading-relaxed">
              Ajoute instantanément un ou plusieurs achats simulés pour tester ou mettre à jour manuellement la fiche du client.
            </p>

            <form onSubmit={handleSimulationSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Nombre de commandes</label>
                <select 
                  className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 text-sm font-mono"
                  value={simulatedOrderMultiplier}
                  onChange={(e) => setSimulatedOrderMultiplier(e.target.value)}
                >
                  <option value="1">1 commande (+1)</option>
                  <option value="2">2 commandes (+2)</option>
                  <option value="3">3 commandes (+3)</option>
                  <option value="5">5 commandes (+5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">Valeur de chaque commande (€)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    required
                    min="1"
                    className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2.5 pl-10 text-white focus:outline-none focus:border-amber-500 text-sm font-mono"
                    value={simulatedOrderValue}
                    onChange={(e) => setSimulatedOrderValue(e.target.value)}
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-mono font-bold">€</span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button 
                  type="button"
                  onClick={() => setIsSimulationModalOpen(false)}
                  className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs font-bold uppercase tracking-wider"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-[#0f172a] rounded-lg transition text-xs font-bold uppercase tracking-wider"
                >
                  Ajouter l'achat
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && customerToDelete && (
        <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 w-full max-w-sm p-6 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <h2 className="text-lg font-bold mb-3 flex items-center gap-2 text-white">
              <AlertTriangle className="text-[#E63329]" size={22} />
              <span>Supprimer le client ?</span>
            </h2>
            
            <p className="text-slate-300 text-xs leading-relaxed mb-6">
              Êtes-vous sûr de vouloir supprimer définitivement le compte du client <strong className="text-[#E63329]">{customerToDelete.name}</strong> ? 
              Toutes les données associées (son historique de {customerToDelete.orders} commande(s) et {customerToDelete.total.toFixed(2)} € dépensés) seront perdues à jamais.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 border border-slate-700 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition text-xs font-semibold"
              >
                Annuler
              </button>
              <button 
                onClick={handleDeleteConfirm}
                className="px-5 py-2 bg-[#E63329] hover:bg-red-700 text-white rounded-lg transition text-xs font-semibold"
              >
                Oui, supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
