import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../store';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore(state => state.addToCart);

  return (
    <div className={`bg-white flex flex-col group h-full relative p-2 transition-all duration-300 hover:shadow-xl ${(product.status === 'outofstock' || product.stock === 0) ? 'opacity-80' : ''}`}>
      <div className="relative overflow-hidden bg-white aspect-square w-full">
        <Link to={`/produit/${product.id}`} className="block w-full h-full">
          <img 
            src={product.images[0]} 
            alt={product.name} 
            className={`w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 ${(product.status === 'outofstock' || product.stock === 0) ? 'opacity-70 grayscale-[20%]' : ''}`}
            loading="lazy"
          />
        </Link>
        
        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10">
          {(product.status === 'outofstock' || product.stock === 0) ? (
            <span className="text-white text-[10px] font-bold px-2.5 py-1 bg-red-600 uppercase tracking-widest rounded-sm">
              En rupture
            </span>
          ) : (
            (() => {
              const bList = product.badges && product.badges.length > 0 
                ? product.badges 
                : (product.badge ? [product.badge] : []);
              return bList.map((bg, idx) => (
                <span key={idx} className={`text-white text-[10px] font-medium px-2.5 py-1 uppercase tracking-wider ${
                  bg === 'Promo' || bg === 'Coups de cœur' ? 'bg-[#9B120B]' : 
                  bg === 'Nouveauté' ? 'bg-gray-800' : 'bg-caz-gold'
                }`}>
                  {bg === 'Promo' && product.oldPrice ? `-${Math.round((1 - product.price / product.oldPrice) * 100)}%` : bg}
                </span>
              ));
            })()
          )}
        </div>
        
        {/* Quick actions overlay */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button className="bg-white border border-gray-100 p-2 rounded-full shadow-sm hover:text-caz-red transition text-gray-400">
            <Heart size={16} strokeWidth={1.5} />
          </button>
        </div>

        {/* Hover Add to Cart */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-10 bg-gradient-to-t from-white/90 to-transparent">
          {(product.status === 'outofstock' || product.stock === 0) ? (
            <button 
              disabled
              className="w-full bg-slate-400 text-white py-2.5 text-[11px] font-bold tracking-wide uppercase cursor-not-allowed"
            >
              Rupture de stock
            </button>
          ) : (
            <button 
              onClick={() => addToCart(product, 1)}
              className="w-full bg-gray-900 hover:bg-caz-red text-white py-2.5 text-[11px] font-medium tracking-wide uppercase transition-colors"
            >
              Ajouter au panier
            </button>
          )}
        </div>
      </div>
      
      <div className="pt-4 pb-2 flex flex-col flex-1 text-center bg-white relative z-20">
        <Link to={`/produit/${product.id}`} className="block flex-1 flex flex-col">
          <h4 className="text-[15px] md:text-[17px] font-satoshi font-bold text-gray-900 line-clamp-2 mb-1 group-hover:text-caz-red transition-colors whitespace-normal leading-snug tracking-tight">{product.name}</h4>
        </Link>
        
        <div className="mt-3">
          <div className="flex items-center justify-center gap-2">
            <span className="text-[15px] font-satoshi font-bold text-gray-900">{product.price.toFixed(2)} €</span>
            {product.oldPrice && (
              <span className="text-[13px] text-gray-400 line-through font-light">{product.oldPrice.toFixed(2)} €</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
