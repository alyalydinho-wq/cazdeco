import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { ArrowLeft, CheckCircle2, ShieldCheck, Truck, CreditCard } from 'lucide-react';

export default function Checkout() {
  const cart = useStore(state => state.cart);
  const clearCart = useStore(state => state.clearCart);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: '',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 25;
  const total = subtotal + shippingCost;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const orderId = Math.random().toString(36).substring(2, 9).toUpperCase();
      clearCart();
      setIsSubmitting(false);
      navigate(`/confirmation/${orderId}`);
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Votre panier est vide</h1>
        <Link to="/boutique" className="px-8 py-3 bg-caz-red text-white font-bold rounded-full">Retour à la boutique</Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/panier" className="text-gray-500 hover:text-caz-red flex items-center gap-1 transition">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour au panier</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Left Side: Contact & Shipping Form */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-caz-red text-white flex items-center justify-center text-sm font-bold">1</span>
                Informations de contact
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email</label>
                  <input 
                    type="email" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                    placeholder="votre@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Téléphone</label>
                  <input 
                    type="tel" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                    placeholder="06 39 XX XX XX"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-caz-red text-white flex items-center justify-center text-sm font-bold">2</span>
                Adresse de livraison
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prénom</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nom</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Adresse</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                    placeholder="N° et nom de rue"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Code Postal</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                      placeholder="97600"
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ville</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-caz-red focus:ring-1 focus:ring-caz-red outline-none transition"
                      placeholder="Mamoudzou"
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-caz-red text-white flex items-center justify-center text-sm font-bold">3</span>
                Paiement
              </h2>
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-4 text-sm text-gray-600">
                <CreditCard className="text-caz-red" />
                <p>Le paiement s'effectue par **lien sécurisé** ou **Virement** après validation de votre commande par notre équipe.</p>
              </div>
            </section>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`w-full py-4 rounded font-bold uppercase tracking-widest transition shadow-lg ${isSubmitting ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-caz-red hover:bg-caz-red-dark text-white'}`}
            >
              {isSubmitting ? 'Traitement en cours...' : 'Valider ma commande'}
            </button>
          </form>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="bg-gray-50 rounded-xl p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-8 border-b border-gray-200 pb-4">Résumé de votre commande</h2>
            
            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-16 bg-white rounded border border-gray-200 flex-shrink-0 p-1">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[13px] font-bold text-gray-900 truncate uppercase mt-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">Quantité: {item.quantity}</p>
                    <p className="text-sm font-bold text-caz-red mt-1">{(item.product.price * item.quantity).toFixed(2)} €</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200 mb-8">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Livraison</span>
                {shippingCost === 0 ? <span className="text-green-600 font-bold">Gratuite</span> : <span>{shippingCost.toFixed(2)} €</span>}
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-900 pt-4">
                <span>Total à régler</span>
                <span className="text-caz-red">{total.toFixed(2)} €</span>
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <Truck size={14} className="text-caz-red" />
                <span>Livraison standard (3 à 5 jours)</span>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <ShieldCheck size={14} className="text-caz-red" />
                <span>Transaction 100% sécurisée</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
