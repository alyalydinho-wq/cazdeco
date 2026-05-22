import React, { useState } from 'react';
import { Search, Filter, Eye, Printer, X, CheckCircle2 } from 'lucide-react';

export default function AdminOrders() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Simulated orders
  const [orders, setOrders] = useState([
    { id: '#CMD-1045', date: '18/05/2026 14:30', client: 'Jean Dupont', email: 'jean.dupont@email.com', total: 450.00, status: 'En attente' },
    { id: '#CMD-1044', date: '18/05/2026 10:15', client: 'Marie Payet', email: 'marie.p@email.com', total: 1250.00, status: 'Confirmée' },
    { id: '#CMD-1043', date: '17/05/2026 16:45', client: 'Lucas Hoarau', email: 'lucas.h@email.com', total: 85.00, status: 'Expédiée' },
    { id: '#CMD-1042', date: '16/05/2026 09:20', client: 'Sophie Grondin', email: 'sophie.g@email.com', total: 320.50, status: 'Livrée' },
    { id: '#CMD-1041', date: '15/05/2026 11:10', client: 'Paul Fontaine', email: 'paul.f@email.com', total: 120.00, status: 'Annulée' },
  ]);

  const handleUpdate = (newStatus: string) => {
    if (selectedOrder) {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: newStatus } : o));
      setToastMessage('Statut mis à jour avec succès');
      setSelectedOrder(null);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En attente': return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/50';
      case 'Confirmée': return 'bg-blue-500/20 text-blue-500 border-blue-500/50';
      case 'En préparation': return 'bg-purple-500/20 text-purple-500 border-purple-500/50';
      case 'Expédiée': return 'bg-indigo-500/20 text-indigo-500 border-indigo-500/50';
      case 'Livrée': return 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50';
      case 'Annulée': return 'bg-red-500/20 text-red-500 border-red-500/50';
      default: return 'bg-slate-500/20 text-slate-500 border-slate-500/50';
    }
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

      <h1 className="text-2xl font-bold text-white">Gestion des commandes</h1>

      <div className="bg-[#1e293b] rounded-xl border border-slate-800 p-4">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Rechercher par n°, client..." 
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E63329]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <select className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-[#E63329] appearance-none">
              <option value="all">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Confirmée">Confirmée</option>
              <option value="Expédiée">Expédiée</option>
              <option value="Annulée">Annulée</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800 bg-[#0f172a]/50">
                <th className="p-4 font-medium rounded-tl-lg">N° Commande</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Client</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Statut</th>
                <th className="p-4 font-medium text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.filter(o => o.id.includes(searchTerm) || o.client.toLowerCase().includes(searchTerm.toLowerCase())).map((order) => (
                <tr key={order.id} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                  <td className="p-4 font-medium text-white">{order.id}</td>
                  <td className="p-4 text-slate-400">{order.date}</td>
                  <td className="p-4">
                    <div className="font-medium text-slate-200">{order.client}</div>
                  </td>
                  <td className="p-4 font-medium font-mono">{order.total.toFixed(2)} €</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button onClick={() => setSelectedOrder(order)} className="p-2 bg-slate-800 hover:bg-[#E63329] hover:text-white rounded transition" title="Détails de la commande">
                        <Eye size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1e293b] rounded-xl border border-slate-700 shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold flex items-center gap-3">
                Commande {selectedOrder.id}
                <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </h2>
              <div className="flex gap-2">
                <button className="text-slate-400 hover:text-white p-2 rounded transition bg-slate-800 hover:bg-slate-700" title="Imprimer">
                  <Printer size={20} />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-white p-2 rounded transition bg-slate-800 hover:bg-slate-700">
                  <X size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2">Client</h3>
                  <p className="font-medium">{selectedOrder.client}</p>
                  <p className="text-slate-400">{selectedOrder.email}</p>
                  <p className="text-slate-400">+262 692 00 00 00</p>
                </div>
                <div className="bg-[#0f172a] p-4 rounded-lg border border-slate-700">
                  <h3 className="font-bold text-slate-300 mb-3 border-b border-slate-800 pb-2">Adresse de livraison</h3>
                  <p>123 Rue de la République</p>
                  <p>97400 Saint-Denis</p>
                  <p>La Réunion</p>
                </div>
              </div>

              <h3 className="font-bold text-lg mb-4">Articles commandés</h3>
              <div className="bg-[#0f172a] rounded-lg border border-slate-700 overflow-hidden mb-6">
                <table className="w-full text-left">
                  <thead className="bg-[#1e293b] border-b border-slate-700 text-slate-400">
                    <tr>
                      <th className="p-3 font-medium">Produit</th>
                      <th className="p-3 font-medium text-center">Quantité</th>
                      <th className="p-3 font-medium text-right">Prix Unitaire</th>
                      <th className="p-3 font-medium text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-800">
                      <td className="p-3 flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-800 rounded"></div>
                        <span>Canapé Design Velours</span>
                      </td>
                      <td className="p-3 text-center">1</td>
                      <td className="p-3 text-right">450.00 €</td>
                      <td className="p-3 text-right font-medium">450.00 €</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end">
                <div className="w-full max-w-sm bg-[#0f172a] p-4 rounded-lg border border-slate-700 space-y-2">
                  <div className="flex justify-between text-slate-400"><span>Sous-total</span> <span>400.00 €</span></div>
                  <div className="flex justify-between text-slate-400"><span>Livraison</span> <span>50.00 €</span></div>
                  <div className="flex justify-between text-slate-400"><span>TVA (8.5%)</span> <span>Inclus</span></div>
                  <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
                    <span>Total Payé</span> <span>450.00 €</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-700 bg-[#0f172a]/50 rounded-b-xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <label className="text-slate-400 font-medium whitespace-nowrap">Changer le statut :</label>
                <select 
                  id={`status-select-${selectedOrder.id}`}
                  className="bg-[#1e293b] border border-slate-700 rounded-lg px-3 py-2 text-white outline-none focus:border-[#E63329]"
                  defaultValue={selectedOrder.status}
                >
                  <option value="En attente">En attente</option>
                  <option value="Confirmée">Confirmée</option>
                  <option value="En préparation">En préparation</option>
                  <option value="Expédiée">Expédiée</option>
                  <option value="Livrée">Livrée</option>
                  <option value="Annulée">Annulée</option>
                </select>
                <button 
                  onClick={() => {
                    const select = document.getElementById(`status-select-${selectedOrder.id}`) as HTMLSelectElement;
                    handleUpdate(select.value);
                  }} 
                  className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition"
                >Mettre à jour</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
