import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { Product } from '../types';
import { ShoppingCart, Truck, Shield, Ruler, Calculator as CalcIcon, X } from 'lucide-react';
import CarrelageCalculator from '../components/CarrelageCalculator';
import { db, isFirebaseConfigured, mapFirestoreDocToProduct } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [dbProducts, setDbProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    console.log("ProductDetail Page: checking Firebase config. Status:", isFirebaseConfigured);
    if (!isFirebaseConfigured) {
      console.warn("ProductDetail Page: Firebase is not configured, using store backup.");
      return;
    }
    
    console.log("ProductDetail Page: Subscribing to Firestore products collection...");
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      console.log(`ProductDetail Page: snapshot received with ${snapshot.docs.length} products`);
      try {
        const prods = snapshot.docs.map(doc => mapFirestoreDocToProduct(doc.id, doc.data()));
        console.log("ProductDetail Page: mapped products successfully:", prods);
        setDbProducts(prods);
      } catch (err) {
        console.error("ProductDetail Page: Error mapping products from snapshot:", err);
      }
    }, (error) => {
      console.error("Firestore products real-time load failed for ProductDetail page:", error);
    });
    return () => unsubscribe();
  }, []);

  const storeProducts = useStore(state => state.products);
  const products = dbProducts !== null ? dbProducts : storeProducts;
  const product = products.find(p => String(p.id) === String(id));
  
  const addToCart = useStore(state => state.addToCart);
  
  const [quantity, setQuantity] = useState(1);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(useStore.persist.hasHydrated());
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    // Listen for hydration finish
    const unsub = useStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    
    // Check if store has already hydrated just in case
    if (useStore.persist.hasHydrated()) {
      setIsHydrated(true);
    }
    
    return () => unsub();
  }, []);

  if (!isHydrated) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-caz-red mx-auto"></div>
        <p className="mt-4 text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produit introuvable</h2>
        <button onClick={() => navigate('/boutique')} className="text-caz-red hover:underline">
          Retour à la boutique
        </button>
      </div>
    );
  }

  const categories = useStore(state => state.categories);
  const productCategory = categories.find(c => String(c.id) === String(product.categoryId));
  const isCarrelage = productCategory?.slug === 'carrelage' || String(product.categoryId) === '5' || (!!product.tileLength && !!product.tileWidth);
  const isPlanTravail = productCategory?.slug === 'plan-de-travail' || String(product.categoryId) === '13';

  const handleAddToCart = () => {
    addToCart(product, quantity);
    // Optionnel: Ouvrir le tiroir panier
  };

  return (
    <div className="bg-white min-h-[calc(100vh-200px)] pt-8 pb-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-caz-red">Accueil</a> &gt; 
          <a href="/boutique" className="hover:text-caz-red mx-2">Boutique</a> &gt; 
          <span className="text-gray-800 ml-2">{product.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Images */}
          <div className="lg:w-1/2">
            <div 
              className="aspect-square bg-gray-50 rounded-lg overflow-hidden border border-gray-100 mb-4 cursor-pointer relative group"
              onClick={() => setIsImageModalOpen(true)}
            >
              <img src={product.images[activeImageIdx] || product.images[0]} alt={product.name} className="w-full h-full object-contain" />
              <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white/80 text-gray-800 text-sm font-medium px-4 py-2 rounded-full shadow-sm backdrop-blur-sm">
                  Cliquer pour agrandir
                </span>
              </div>
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setActiveImageIdx(idx)}
                    className={`aspect-square rounded border cursor-pointer overflow-hidden bg-gray-50 ${activeImageIdx === idx ? 'border-caz-red' : 'border-gray-200 hover:border-caz-red'}`}
                  >
                     <img src={img} alt="" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex flex-wrap gap-2 mb-4">
              {(product.status === 'outofstock' || product.stock === 0) ? (
                <span className="inline-block bg-red-600 text-white text-xs font-bold uppercase px-3 py-1 rounded animate-pulse">
                  En rupture de stock
                </span>
              ) : (
                (() => {
                  const bList = product.badges && product.badges.length > 0 
                    ? product.badges 
                    : (product.badge ? [product.badge] : []);
                  return bList.map((bg, idx) => (
                    <span key={idx} className={`inline-block text-white text-xs font-bold uppercase px-3 py-1 rounded ${
                      bg === 'Promo' || bg === 'Coups de cœur' ? 'bg-[#9B120B]' : 
                      bg === 'Nouveauté' ? 'bg-gray-800' : 'bg-caz-gold'
                    }`}>
                      {bg}
                    </span>
                  ));
                })()
              )}
            </div>
            
            <h1 className="font-satoshi font-bold text-3xl md:text-4xl text-caz-gray-dark mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-6">Réf: {product.sku}</p>
            
            <div className="mb-8">
              {product.oldPrice && (
                <span className="text-xl text-gray-400 line-through mr-3">{product.oldPrice.toFixed(2)} €</span>
              )}
              <span className="font-satoshi font-bold text-4xl text-caz-red">{product.price.toFixed(2)} €</span>
              {isCarrelage && <span className="text-sm text-gray-500 font-normal ml-2">/ m²</span>}
              {isPlanTravail && <span className="text-sm text-gray-500 font-normal ml-2">/ mètre linéaire</span>}
            </div>

            <p className="text-gray-700 mb-8 max-w-lg leading-relaxed whitespace-pre-line">
              {product.description}
            </p>

            {/* Special Actions per category */}
            {isCarrelage && (
              <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                <div className="flex items-start gap-4 mb-4">
                  <Ruler className="text-caz-red shrink-0" size={24} />
                  <div>
                    <h4 className="font-bold text-gray-800">Dimensions : {product.tileLength || 60} x {product.tileWidth || 60} cm</h4>
                    <p className="text-sm text-gray-600">Conditionnement : {product.tilesPerBox || 4} carreaux / {product.sqmPerBox || 1.44} m² par boîte</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsCalcOpen(true)}
                  className="w-full bg-white border-2 border-caz-red text-caz-red hover:bg-caz-red hover:text-white font-bold py-3 rounded flex items-center justify-center gap-2 transition"
                >
                  <CalcIcon size={20} />
                  Calculer la quantité nécessaire
                </button>
              </div>
            )}

            {/* Add to Cart Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 mt-auto">
              {(product.status === 'outofstock' || product.stock === 0) ? (
                <>
                  <div className="flex border border-gray-200 bg-gray-50 rounded h-14 opacity-50 cursor-not-allowed">
                    <button 
                      disabled
                      className="px-4 text-xl text-gray-400 rounded-l"
                    >
                      -
                    </button>
                    <input 
                      disabled
                      type="number" 
                      value={0} 
                      className="w-16 text-center font-bold outline-none border-x border-gray-200 bg-gray-50 text-gray-400"
                    />
                    <button 
                      disabled
                      className="px-4 text-xl text-gray-400 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    disabled
                    className="flex-1 bg-gray-300 text-gray-500 font-bold h-14 rounded flex items-center justify-center gap-2 cursor-not-allowed text-lg"
                  >
                    Rupture de stock
                  </button>
                </>
              ) : (
                <>
                  <div className="flex border border-gray-300 rounded h-14">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-l"
                    >
                      -
                    </button>
                    <input 
                      type="number" 
                      value={quantity} 
                      onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                      className="w-16 text-center font-bold outline-none border-x border-gray-300"
                    />
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 text-xl text-gray-600 hover:bg-gray-100 rounded-r"
                    >
                      +
                    </button>
                  </div>
                  
                  <button 
                    onClick={handleAddToCart}
                    className="flex-1 bg-caz-gray-dark hover:bg-black text-white font-bold h-14 rounded flex items-center justify-center gap-2 transition text-lg"
                  >
                    <ShoppingCart size={24} /> Ajouter au panier
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-200">
              <div className="flex gap-3 text-sm text-gray-600">
                <Truck className="text-gray-400 shrink-0" size={20} />
                <span>Livraison partout à Mayotte (sous 24/48h selon stock)</span>
              </div>
              <div className="flex gap-3 text-sm text-gray-600">
                <Shield className="text-gray-400 shrink-0" size={20} />
                <span>Garantie constructeur incluse. SAV localisé.</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {isCarrelage && (
        <CarrelageCalculator 
          key={`${product.id}-${isCalcOpen}`}
          isOpen={isCalcOpen}
          onClose={() => setIsCalcOpen(false)}
          productTileLength={product.tileLength || 60}
          productTileWidth={product.tileWidth || 60}
          tilesPerBox={product.tilesPerBox || 4}
          sqmPerBox={product.sqmPerBox || 1.44}
          onApplyQuantity={(qty) => setQuantity(qty)}
        />
      )}

      {isImageModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setIsImageModalOpen(false)}>
          <button 
            onClick={() => setIsImageModalOpen(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300 p-2 z-50"
          >
            <X size={36} />
          </button>
          
          <img 
            src={product.images[activeImageIdx] || product.images[0]} 
            alt={product.name} 
            className="max-w-full max-h-[90vh] object-contain rounded-lg relative z-40 shadow-2xl" 
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
