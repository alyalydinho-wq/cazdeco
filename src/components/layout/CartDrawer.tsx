import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart = useStore(state => state.cart);
  const updateQuantity = useStore(state => state.updateQuantity);
  const removeFromCart = useStore(state => state.removeFromCart);
  const clearCart = useStore(state => state.clearCart);
  const navigate = useNavigate();

  const subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const delivery = subtotal > 200 ? 0 : 29.90;
  const total = subtotal + delivery;

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity" 
        onClick={onClose}
      />
      <div 
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-white z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-caz-gray-light">
          <h2 className="font-heading font-bold text-lg flex items-center gap-2">
            <ShoppingBag size={20} />
            Mon Panier ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h2>
          <button onClick={onClose} className="p-2 hover:text-caz-red transition">
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
              <ShoppingBag size={64} className="text-gray-200" />
              <p>Votre panier est vide</p>
              <button 
                onClick={() => {
                  onClose();
                  navigate('/boutique');
                }}
                className="px-6 py-2 bg-caz-red text-white font-semibold rounded-full hover:bg-caz-red-dark transition"
              >
                Continuer mes achats
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="text-sm font-semibold text-caz-gray-dark leading-tight">{item.product.name}</h3>
                        <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-caz-red p-1">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <p className="text-caz-red font-bold mt-1">{item.product.price.toFixed(2)} €</p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 w-fit rounded border border-gray-200 mt-2">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-200 text-gray-600 transition"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-semibold min-w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-200 text-gray-600 transition"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer / Summary */}
        {cart.length > 0 && (
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex flex-col gap-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Sous-total</span>
                <span>{subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Livraison</span>
                {delivery === 0 ? (
                  <span className="text-green-600 font-medium">Offerte</span>
                ) : (
                  <span>{delivery.toFixed(2)} €</span>
                )}
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 text-caz-gray-dark">
                <span>Total</span>
                <span>{total.toFixed(2)} €</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => {
                  onClose();
                  navigate('/panier');
                }}
                className="w-full py-3 bg-caz-red text-white font-bold rounded hover:bg-caz-red-dark transition uppercase tracking-wide text-sm"
              >
                Passer la commande
              </button>
              <button 
                onClick={clearCart}
                className="text-xs text-gray-500 hover:text-caz-red underline text-center mt-2"
              >
                Vider le panier
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
