import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, ShieldCheck, CreditCard, HeadphonesIcon, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';
import { db, isFirebaseConfigured, mapFirestoreDocToProduct } from '../lib/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { Product } from '../types';

export default function Home() {
  const [dbProducts, setDbProducts] = useState<Product[] | null>(null);

  useEffect(() => {
    console.log("Home Page: checking Firebase config. Status:", isFirebaseConfigured);
    if (!isFirebaseConfigured) {
      console.warn("Home Page: Firebase is not configured, using store backup.");
      return;
    }
    
    console.log("Home Page: Subscribing to Firestore products collection...");
    const unsubscribe = onSnapshot(collection(db, "products"), (snapshot) => {
      console.log(`Home Page: snapshot received with ${snapshot.docs.length} products`);
      try {
        const prods = snapshot.docs.map(doc => mapFirestoreDocToProduct(doc.id, doc.data()));
        console.log("Home Page: mapped products successfully:", prods);
        setDbProducts(prods);
      } catch (err) {
        console.error("Home Page: Error mapping products from snapshot:", err);
      }
    }, (error) => {
      console.error("Firestore products real-time load failed for Home page:", error);
    });
    return () => unsubscribe();
  }, []);

  const storeProducts = useStore(state => state.products);
  const products = dbProducts !== null ? dbProducts : storeProducts;
  const categories = useStore(state => state.categories);
  const settings = useStore(state => state.settings);
  const scrollRef = useRef<HTMLDivElement>(null);
  const bestSellersScrollRef = useRef<HTMLDivElement>(null);
  
  const defaultBanners = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=1080&q=80",
      title: "Sublimez votre intérieur avec élégance",
      subtitle: "Découvrez nos nouvelles collections de mobilier, carrelage et décoration pour créer un espace qui vous ressemble.",
      buttonText: "Découvrir la collection",
      buttonLink: "/boutique?category=mobilier"
    },
    {
      id: "2",
      image: "/nouveautecarrelage.jpg",
      title: "Carrelages & Faïences d'exception",
      subtitle: "Un large choix de faïences et de carrelages de haute qualité pour toutes vos pièces d'eau, cuisines et extérieurs.",
      buttonText: "Voir les carrelages",
      buttonLink: "/boutique?category=carrelage"
    }
  ];
  
  const rawBanners = settings.heroBanners && settings.heroBanners.length > 1 ? settings.heroBanners : defaultBanners;
  
  // Sanitize banner images to ensure any dead Unsplash url is replaced with a working local image
  const heroBanners = rawBanners.map(banner => {
    if (!banner.image || banner.image.includes('1502005097973-ef5694285e65') || banner.image.includes('1502005097973')) {
      return { ...banner, image: "/nouveautecarrelage.jpg" };
    }
    return banner;
  });

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroBanners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % heroBanners.length);
  };

  const featuredProducts = products.filter(p => p.badge === 'Coups de cœur' || p.badge === 'Best-seller' || p.badge === 'Promo').slice(0, 10);
  const newestProducts = [...products].sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)).slice(0, 10);
  
  const bestSellersProducts = products.filter(p => p.isBestSeller).length > 0 ? products.filter(p => p.isBestSeller) : products.slice(0, 4);

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const scrollBestSellersLeft = () => {
    if (bestSellersScrollRef.current) {
      bestSellersScrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollBestSellersRight = () => {
    if (bestSellersScrollRef.current) {
      bestSellersScrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden bg-gray-900">
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4 pointer-events-none">
          <div className="relative w-full h-full max-w-4xl mx-auto flex flex-col items-center justify-center">
            {heroBanners.map((banner, index) => (
              <div
                key={banner.id}
                className={`transition-all duration-1000 transform absolute inset-y-0 inset-x-0 flex flex-col items-center justify-center text-center px-4 ${
                  index === currentSlide
                    ? 'opacity-100 scale-100 translate-x-0 z-20 pointer-events-auto'
                    : 'opacity-0 scale-95 translate-x-8 z-10 pointer-events-none'
                }`}
              >
                <h2 className="text-white font-heading text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight max-w-4xl font-light tracking-wide drop-shadow-md">
                  {banner.title}
                </h2>
                <p className="text-white text-sm md:text-base mb-10 max-w-2xl font-light tracking-wide opacity-95 drop-shadow-sm">
                  {banner.subtitle}
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <Link
                    to={banner.buttonLink}
                    className="inline-flex items-center justify-center bg-white text-gray-900 border border-white px-10 py-3 font-medium hover:bg-transparent hover:text-white transition-colors tracking-widest uppercase text-xs"
                  >
                    {banner.buttonText}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Images */}
        {heroBanners.map((banner, index) => (
          <div
            key={`img-${banner.id}`}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            <div className="absolute inset-0 bg-black/45 z-10"></div>
            <img
              src={banner.image}
              alt={banner.title}
              className={`w-full h-full object-cover origin-center ${
                index === currentSlide ? 'animate-image-zoom' : ''
              }`}
              referrerPolicy="no-referrer"
            />
          </div>
        ))}

        {/* Slider Navigation Arrows */}
        {heroBanners.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-black/45 hover:border-white text-white flex items-center justify-center transition-all"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full border border-white/20 bg-black/20 hover:bg-black/45 hover:border-white text-white flex items-center justify-center transition-all"
              aria-label="Next Slide"
            >
              <ChevronRight size={24} />
            </button>

            {/* Slide Indicators / Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
              {heroBanners.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentSlide ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </section>

      {/* Trust Badges */}
      <section className="bg-white py-12 border-b border-gray-100 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-gray-400">
            <div className="flex flex-col items-center gap-4">
              <Truck size={28} strokeWidth={1} />
              <div>
                <h4 className="font-heading text-lg text-gray-800 mb-1">Livraison experte</h4>
                <p className="text-xs font-light tracking-wide">Partout sur l'île, sur RDV</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <ShieldCheck size={28} strokeWidth={1} />
              <div>
                <h4 className="font-heading text-lg text-gray-800 mb-1">Installation</h4>
                <p className="text-xs font-light tracking-wide">Par nos artisans qualifiés</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <CreditCard size={28} strokeWidth={1} />
              <div>
                <h4 className="font-heading text-lg text-gray-800 mb-1">Paiement Sécurisé</h4>
                <p className="text-xs font-light tracking-wide">CB, Visa, 3x sans frais</p>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <HeadphonesIcon size={28} strokeWidth={1} />
              <div>
                <h4 className="font-heading text-lg text-gray-800 mb-1">Service Client</h4>
                <p className="text-xs font-light tracking-wide">À votre écoute 6j/7</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      {bestSellersProducts.length > 0 && (
        <section className="bg-[#fcfaf8] py-14 overflow-hidden border-b border-gray-100">
          <div className="container mx-auto px-4 sm:px-8 mb-8 flex justify-between items-end">
            <h2 className="font-heading text-3xl text-gray-900 font-medium">Découvrez nos best-sellers du moment</h2>
            <Link to="/boutique?badge=Best-seller" className="hidden sm:flex items-center gap-2 text-sm text-gray-600 hover:text-caz-red transition group">
              Voir tout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="relative w-full group">
            <button 
              onClick={scrollBestSellersLeft}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 w-10 h-10 flex items-center justify-center rounded-full text-gray-800 hover:bg-caz-red hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={scrollBestSellersRight}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-100 w-10 h-10 flex items-center justify-center rounded-full text-gray-800 hover:bg-caz-red hover:text-white transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 disabled:opacity-0"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            <div 
              ref={bestSellersScrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-proximity hide-scrollbar px-4 sm:px-8 pb-4 pt-2 touch-pan-x"
            >
              {bestSellersProducts.map((product) => (
                <div key={product.id} className="w-[260px] sm:w-[300px] shrink-0 bg-white snap-start">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Categories Grid - Lifestyle square tiles */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl md:text-4xl text-gray-900 mb-4">Inspirations par espace</h3>
            <div className="w-16 h-px bg-gray-300 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to="/carrelage" className="relative aspect-square overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
              <img src="/carrelage.jpg" alt="Carrelage" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white bg-black/40 px-6 py-3 backdrop-blur-sm shadow-sm group-hover:bg-black/60 transition-colors">Découvrir le Carrelage</span>
              </div>
            </Link>
            <Link to="/mobilier" className="relative aspect-square overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
              <img src="/mamanfilslokat.jpg" alt="Mobilier" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white bg-black/40 px-6 py-3 backdrop-blur-sm shadow-sm group-hover:bg-black/60 transition-colors">Découvrir le Mobilier</span>
              </div>
            </Link>
            <Link to="/luminaires" className="relative aspect-square overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
              <img src="/tifille.jpg" alt="Luminaires" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white bg-black/40 px-6 py-3 backdrop-blur-sm shadow-sm group-hover:bg-black/60 transition-colors">Découvrir les Luminaires</span>
              </div>
            </Link>
            <Link to="/boutique?category=cuisines" className="relative aspect-square overflow-hidden cursor-pointer group lg:col-span-2">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
              <img src="/lokticuisine.webp" alt="Nos Cuisines" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white bg-black/40 px-6 py-3 backdrop-blur-sm shadow-sm group-hover:bg-black/60 transition-colors">Nos Cuisines</span>
              </div>
            </Link>
            <Link to="/plan-de-travail" className="relative aspect-square overflow-hidden cursor-pointer group">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-10"></div>
              <img src="/couplelokta.webp" alt="Plans de travail" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 flex items-center justify-center z-20">
                <span className="text-lg font-medium tracking-[0.2em] uppercase text-white bg-black/40 px-6 py-3 backdrop-blur-sm shadow-sm group-hover:bg-black/60 transition-colors">Nos Plans de Travail</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-caz-gray-light overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 relative">
          <div className="text-center mb-12">
            <h3 className="font-heading text-3xl md:text-4xl text-gray-900 mb-4">Nouveautés & Coups de Cœur</h3>
            <div className="w-16 h-px bg-gray-300 mx-auto mb-6"></div>
            <Link to="/boutique" className="text-xs font-medium tracking-[0.2em] text-gray-500 hover:text-gray-900 uppercase transition-colors">
              Voir toute la sélection
            </Link>
          </div>
          
          <div className="relative group mt-8 px-2 sm:px-0">
            <button 
              onClick={scrollLeft} 
              className="absolute left-1 sm:left-0 top-1/2 -translate-y-1/2 sm:-translate-x-4 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10"
            >
              <ChevronLeft size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={scrollRight} 
              className="absolute right-1 sm:right-0 top-1/2 -translate-y-1/2 sm:translate-x-4 w-10 h-10 rounded-full border border-gray-200 bg-white shadow-lg flex items-center justify-center text-gray-600 hover:text-gray-900 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-10"
            >
              <ChevronRight size={20} strokeWidth={1.5} />
            </button>

            <div 
              ref={scrollRef}
              className="flex overflow-x-auto gap-4 sm:gap-6 snap-x snap-proximity hide-scrollbar pb-8 pt-4 px-4 md:px-2 touch-pan-x"
            >
              {featuredProducts.length > 0 ? (
                featuredProducts.map((product) => (
                  <div key={product.id} className="w-[260px] sm:w-[320px] flex-shrink-0 snap-start">
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-8 text-gray-500">
                  Aucun produit pour le moment.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us -> Lifestyle feature */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 w-full relative">
              <img src="/nouveautecarrelage.jpg" alt="Carrelage haut de gamme" className="w-full h-auto object-cover max-h-[700px] shadow-sm" />
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-caz-gray-light -z-10 hidden lg:block"></div>
            </div>
            <div className="flex-1 max-w-xl">
              <h4 className="text-xs uppercase tracking-[0.2em] text-gray-400 mb-4 font-medium">EXCLUSIVITÉ CAZ DECO</h4>
              <h2 className="font-satoshi font-bold text-4xl md:text-5xl text-gray-900 mb-8 leading-tight">NOUVEAUTÉ.<br />CARRELAGE 60X120 CM</h2>
              <div className="text-gray-600 mb-8 text-base font-light leading-relaxed space-y-4">
                <p>
                  Nos modèles de carreaux grand format 60x120 cm sont enfin disponibles.
                </p>
                <p>
                  Profitez d'une touche d’élégance et de modernité à tous vos espaces. Avec des finitions variées, telles que l’aspect marbre raffiné, ou finition mat, ils apportent de l'esthétisme et de la praticité. Idéal pour agrandir visuellement vos pièces, ce format met en valeur les lignes et réduit le nombre de joints pour un rendu harmonieux et contemporain.
                </p>
              </div>
              
              <div className="mt-12">
                <Link to="/carrelage" className="px-10 py-4 border border-gray-900 text-gray-900 font-medium hover:bg-gray-900 hover:text-white transition-colors inline-block uppercase text-xs tracking-wider">
                  Découvrir la collection
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
