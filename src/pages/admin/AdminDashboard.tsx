import React from 'react';
import { Package, TrendingUp, AlertTriangle, Users, ShoppingCart } from 'lucide-react';
import { useStore } from '../../store';

export default function AdminDashboard() {
  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);

  const outOfStockCount = products.filter(p => p.stock === 0 || p.status === 'outofstock').length;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white mb-6">Tableau de bord</h1>
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Commandes du jour</p>
              <h3 className="text-3xl font-bold text-white mt-2">12</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
              <ShoppingCart size={20} />
            </div>
          </div>
        </div>
        
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Chiffre d'affaires (mois)</p>
              <h3 className="text-3xl font-bold text-white mt-2">14 250 €</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
              <TrendingUp size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Produits en stock</p>
              <h3 className="text-3xl font-bold text-white mt-2">{products.length}</h3>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Package size={20} />
            </div>
          </div>
        </div>

        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-sm font-medium">Produits en rupture</p>
              <div className="flex items-center gap-2 mt-2">
                <h3 className="text-3xl font-bold text-white">{outOfStockCount}</h3>
                {outOfStockCount > 0 && (
                  <span className="bg-red-500/20 text-red-500 text-xs px-2 py-1 rounded-full font-bold">
                    Action requise
                  </span>
                )}
              </div>
            </div>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${outOfStockCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-slate-700 text-slate-400'}`}>
              <AlertTriangle size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Grid for Charts & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800">
          <h3 className="text-lg font-bold text-white mb-4">Dernières commandes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-slate-400 border-b border-slate-700">
                  <th className="pb-3 font-medium">N°</th>
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Total</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  { id: '#CMD-1045', client: 'Jean Dupont', total: '450.00 €', status: 'En attente', color: 'bg-yellow-500/20 text-yellow-500' },
                  { id: '#CMD-1044', client: 'Marie Payet', total: '1 250.00 €', status: 'Confirmée', color: 'bg-blue-500/20 text-blue-500' },
                  { id: '#CMD-1043', client: 'Lucas Hoarau', total: '85.00 €', status: 'Expédiée', color: 'bg-emerald-500/20 text-emerald-500' }
                ].map(cmd => (
                  <tr key={cmd.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                    <td className="py-3 text-white font-medium">{cmd.id}</td>
                    <td className="py-3 text-slate-300">{cmd.client}</td>
                    <td className="py-3 text-slate-300">{cmd.total}</td>
                    <td className="py-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${cmd.color}`}>
                        {cmd.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-[#1e293b] p-6 rounded-xl border border-slate-800 flex items-center justify-center min-h-[300px]">
          <div className="text-center">
            <TrendingUp size={48} className="mx-auto text-slate-600 mb-4" />
            <p className="text-slate-400">Graphique des ventes des 7 derniers jours (simulation en cours)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
