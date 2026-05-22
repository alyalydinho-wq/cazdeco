import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, Truck, ShieldCheck, CreditCard } from 'lucide-react';
import { useStore } from '../store';

export default function Cart() {
  const cart = useStore(state => state.cart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const shippingThreshold = 500;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 25;
  const total = subtotal + shippingCost;

  if (cart.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={48} className="text-gray-300" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
        <p className="text-gray-600 mb-8 max-w-xs">Il semble que vous n'ayez pas encore ajouté de produits à votre panier.</p>
        <Link 
          to="/boutique" 
          className="px-8 py-3 bg-caz-red text-white font-bold rounded hover:bg-red-700 transition uppercase tracking-wider text-sm"
        >
          Découvrir nos produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto px-4 py-12">
      <div className="flex items-center gap-2 mb-8">
        <Link to="/boutique" className="text-gray-500 hover:text-caz-red flex items-center gap-1 transition">
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Retour à la boutique</span>
        </Link>
      </div>

      <h1 className="text-3xl font-heading font-bold text-gray-900 mb-10">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-8">
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <div className="col-span-6">Produit</div>
            <div className="col-span-2 text-center">Prix</div>
            <div className="col-span-2 text-center">Quantité</div>
            <div className="col-span-2 text-right">Total</div>
          </div>

          {cart.map((item) => (
            <div key={item.product.id} className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-8 border-b border-gray-100 items-center">
              {/* Product Info */}
              <div className="col-span-1 md:col-span-6 flex gap-4">
                <div className="w-24 h-24 bg-gray-50 border border-gray-100 rounded overflow-hidden flex-shrink-0">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex flex-col justify-center">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{item.product.name}</h3>
                  <button 
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-gray-400 hover:text-red-500 flex items-center gap-1 mt-2 text-xs transition"
                  >
                    <Trash2 size={14} />
                    <span>Supprimer</span>
                  </button>
                </div>
              </div>

              {/* Price (Mobile) */}
              <div className="md:col-span-2 text-center">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase mr-2">Prix :</span>
                <span className="text-gray-900 font-medium">{item.product.price.toFixed(2)} €</span>
              </div>

              {/* Quantity */}
              <div className="md:col-span-2 flex justify-center">
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded px-2 py-1">
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="text-gray-400 hover:text-caz-red p-1 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="text-sm font-bold min-w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="text-gray-400 hover:text-caz-red p-1 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Total Row */}
              <div className="md:col-span-2 text-right">
                <span className="md:hidden text-xs font-bold text-gray-400 uppercase mr-2">Total :</span>
                <span className="text-lg font-bold text-caz-red">{(item.product.price * item.quantity).toFixed(2)} €</span>
              </div>
            </div>
          ))}

          {/* Reassurance */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
              <Truck size={24} className="text-caz-red mb-3" />
              <h4 className="text-xs font-bold uppercase mb-1">Livraison rapide</h4>
              <p className="text-[11px] text-gray-500">Expédition partout à Mayotte</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
              <ShieldCheck size={24} className="text-caz-red mb-3" />
              <h4 className="text-xs font-bold uppercase mb-1">Produits Garantis</h4>
              <p className="text-[11px] text-gray-500">Qualité et excellence</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-gray-50 rounded-lg text-center">
              <CreditCard size={24} className="text-caz-red mb-3" />
              <h4 className="text-xs font-bold uppercase mb-1">Paiement Sécurisé</h4>
              <p className="text-[11px] text-gray-500">Jusqu'à 4x sans frais</p>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm sticky top-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Récapitulatif</h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span className="font-medium text-gray-900">{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600 font-bold">Offerte</span>
                ) : (
                  <span className="font-medium text-gray-900">{shippingCost.toFixed(2)} €</span>
                )}
              </div>
              {shippingCost > 0 && (
                <div className="bg-red-50 p-3 rounded text-[11px] text-caz-red font-medium">
                  Plus que <strong>{(shippingThreshold - subtotal).toFixed(2)} €</strong> pour bénéficier de la livraison gratuite !
                </div>
              )}
            </div>

            <div className="border-t border-gray-100 pt-6 mb-8 text-lg font-bold text-gray-900 flex justify-between">
              <span>Total</span>
              <span className="text-2xl text-caz-red">{total.toFixed(2)} €</span>
            </div>

            <button 
              onClick={() => navigate('/commande')}
              className="w-full py-4 bg-gradient-to-r from-caz-red to-[#9B120B] text-white font-bold rounded hover:shadow-lg transition transform hover:-translate-y-0.5 uppercase tracking-widest mb-4"
            >
              Passer la commande
            </button>
            <p className="text-[11px] text-gray-400 text-center">TVA incluse</p>
          </div>
        </div>
      </div>
    </div>
  );
}
