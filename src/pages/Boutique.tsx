import { useState, useMemo, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { useStore } from '../store';
import ProductCard from '../components/ProductCard';

const mobilierSubcategories = [
  { id: '1', name: 'Canapés', slug: 'canapes', icon: '🛋️' },
  { id: '2', name: 'Fauteuils & Chaises', slug: 'fauteuils-chaises', icon: '🪑' },
  { id: '3', name: 'Tables', slug: 'tables', icon: '🪵' },
  { id: '4', name: 'Tables Basses', slug: 'tables-basses', icon: '🥣' },
  { id: '5', name: 'Bureaux', slug: 'bureaux', icon: '💻' },
  { id: '6', name: 'Séléction Bois de Manguier', slug: 'bois-manguier', icon: '🥭' },
  { id: '7', name: 'Lits', slug: 'lits', icon: '🛏️' },
  { id: '8', name: 'Armoires & Dressings', slug: 'armoires-dressings', icon: '🚪' },
  { id: '9', name: 'Bibliothèques', slug: 'bibliotheques', icon: '📚' },
  { id: '10', name: 'Plein air', slug: 'plein-air', icon: '☀️' },
];

const carrelageSubcategories = [
  { id: '1', name: 'Carrelage Sol', slug: 'carrelage-sol', icon: '🧱' },
  { id: '2', name: 'Carrelage Murs', slug: 'carrelage-murs', icon: '🔳' },
];

export default function Boutique() {
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest'); // 'price_asc', 'price_desc', 'newest', 'popular'
  
  const settings = useStore(state => state.settings);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const urlParamCategory = searchParams.get('category');
  const searchQueryParam = searchParams.get('search');
  const activeSubcategorySlug = searchParams.get('subcategory') || null;

  // Determine specialized category based on pathname
  let pathCategorySlug: string | null = null;
  if (location.pathname === '/carrelage') {
    pathCategorySlug = 'carrelage';
  } else if (location.pathname === '/plan-de-travail') {
    pathCategorySlug = 'plan-de-travail';
  } else if (location.pathname === '/mobilier') {
    pathCategorySlug = 'mobilier';
  } else if (location.pathname === '/luminaires') {
    pathCategorySlug = 'luminaires';
  }

  const activeCategorySlug = pathCategorySlug || urlParamCategory || null;

  const getSubcategoryLink = (subSlug: string | null) => {
    const basePath = location.pathname;
    const query = new URLSearchParams(location.search);
    
    if (subSlug) {
      query.set('subcategory', subSlug);
    } else {
      query.delete('subcategory');
    }
    
    const targetCat = activeCategorySlug || 'mobilier';
    
    if (basePath === '/mobilier' || basePath === '/carrelage') {
      const qStr = query.toString();
      return qStr ? `${basePath}?${qStr}` : basePath;
    } else {
      query.set('category', targetCat);
      return `/boutique?${query.toString()}`;
    }
  };

  // Category specific banners mapping
  const defaultCategoryBanners: Record<string, { image: string; title: string; subtitle: string }> = {
    'boutique': {
      image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1920&h=600&q=80",
      title: "Notre Boutique",
      subtitle: "Explorez notre catalogue complet pour l'aménagement de votre intérieur."
    },
    'sanitaires': {
      image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=1920&h=600&fit=crop",
      title: "Sanitaires",
      subtitle: "Transformez votre salle de bain en un espace de détente. Découvrez notre sélection de robinetterie, douches et meubles vasques alliant design et durabilité."
    },
    'cuisines': {
      image: "/lokticuisine.webp",
      title: "Cuisine",
      subtitle: "Découvrez des solutions fonctionnelles et abordables pour créer la cuisine de vos rêves. Explorez nos designs personnalisables et nos solutions de rangement intelligentes. Faisons de votre cuisine le cœur de votre maison !"
    },
    'mobilier': {
      image: "/mamanfilslokat.jpg",
      title: "Mobilier d'Intérieur",
      subtitle: "Créez un intérieur qui vous ressemble avec notre collection de meubles. Du salon à la chambre, trouvez des pièces uniques pour un confort optimal au quotidien."
    },
    'articles-deco': {
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=1920&h=600&fit=crop",
      title: "Articles Déco",
      subtitle: "Les détails qui font la différence. Explorez notre gamme d'objets décoratifs, miroirs et accessoires pour donner du caractère et du style à chaque pièce de votre maison."
    },
    'carrelage': {
      image: "/nouveautecarrelage.jpg",
      title: "Carrelage & Revêtements",
      subtitle: "Revêtez vos sols et murs avec élégance. Un large choix de textures, couleurs et formats pour sublimer vos espaces intérieurs et extérieurs avec qualité."
    },
    'luminaires': {
      image: "/tifille.jpg",
      title: "Luminaires",
      subtitle: "Illuminez votre foyer avec style. Suspensions, lampadaires et appliques : découvrez des solutions d'éclairage qui créent l'ambiance parfaite pour chaque moment."
    },
    'mobilier-sejour': {
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1920&h=600&fit=crop",
      title: "Mobilier / Séjour",
      subtitle: "Le cœur de votre maison mérite le meilleur. Canapés, tables basses et rangements pensés pour allier convivialité et élégance dans votre salon."
    },
    'electromenager': {
      image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1920&h=600&fit=crop",
      title: "Électroménager",
      subtitle: "La technologie au service de votre confort. Équipez votre maison avec nos appareils performants et économes pour simplifier vos tâches quotidiennes."
    },
    'literie': {
      image: "https://images.unsplash.com/photo-1505691938895-1758d7eaa511?q=80&w=1920&h=600&fit=crop",
      title: "Literie",
      subtitle: "Offrez-vous le sommeil que vous méritez. Matelas, sommiers et oreillers de haute qualité pour des nuits réparatrices et un réveil en pleine forme."
    },
    'produit-jetable': {
      image: "https://images.unsplash.com/photo-1517433447747-24bf20bf6a33?q=80&w=1920&h=600&fit=crop",
      title: "Produit Jetable",
      subtitle: "Praticité et respect de l'environnement. Découvrez nos solutions jetables écologiques pour vos événements et votre quotidien, sans compromis sur la qualité."
    },
    'festivite': {
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1920&h=600&fit=crop",
      title: "Festivité",
      subtitle: "Célébrez vos moments précieux. Tout le nécessaire pour vos fêtes et événements : décoration, accessoires et ambiances pour des souvenirs inoubliables."
    },
    'meuble-tv': {
      image: "https://images.unsplash.com/photo-1593010260424-9b2f694e9f78?q=80&w=1920&h=600&fit=crop",
      title: "Meuble TV",
      subtitle: "Alliez multimédia et décoration. Des meubles TV fonctionnels et esthétiques pour intégrer harmonieusement vos écrans dans votre espace de vie."
    },
    'plan-de-travail': {
      image: "/couplelokta.webp",
      title: "Plan de travail",
      subtitle: "La touche finale de votre cuisine. Matériaux robustes et finitions impeccables pour des plans de travail qui résistent au temps et magnifient votre espace."
    }
  };

  const categoryBanners = {
    ...defaultCategoryBanners,
    ...(settings.categoryBanners || {})
  };

  const activeBannerKey = activeCategorySlug || 'boutique';
  const customBanner = categoryBanners[activeBannerKey] || categoryBanners['boutique'];

  let heroImage = customBanner.image;
  let heroTitle = customBanner.title;
  let heroSubtitle = customBanner.subtitle;

  if (searchQueryParam) {
    heroTitle = `Résultats pour "${searchQueryParam}"`;
    heroSubtitle = "Trouvez les meilleurs articles correspondant à votre recherche.";
  }

  const products = useStore(state => state.products);
  const categories = useStore(state => state.categories);

  const activeCategory = useMemo(() => {
    return categories.find(c => c.slug === activeCategorySlug);
  }, [categories, activeCategorySlug]);

  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    // Filter by active category
    if (activeCategory) {
      filtered = filtered.filter(p => p.categoryId === activeCategory.id);
    }

    // Filter by active subcategory
    if (activeSubcategorySlug) {
      filtered = filtered.filter(p => p.subcategory === activeSubcategorySlug);
    }

    // Filter by search query
    if (searchQueryParam) {
      const query = searchQueryParam.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) || 
        p.description.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query)
      );
    }
    
    // Check if user is looking for a category not matched by slug directly
    if (activeCategorySlug === 'cuisines') {
       const catCuisine = categories.find(c => c.slug === 'cuisines');
       if (catCuisine) filtered = products.filter(p => p.categoryId === catCuisine.id);
    }
    
    // Sort
    return [...filtered].sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'newest') return b.createdAt - a.createdAt;
      // popular mock
      if (sortBy === 'popular') return (a.badge === 'Best-seller' ? -1 : 1);
      return 0;
    });
  }, [products, activeCategory, activeCategorySlug, activeSubcategorySlug, sortBy, categories, searchQueryParam]);

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero */}
      <div className="relative h-64 md:h-[400px] bg-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-black/20 z-10 transition-colors"></div>
        <img 
          src={heroImage} 
          alt={heroTitle}
          className={`absolute inset-0 w-full h-full object-cover animate-image-zoom origin-center ${heroImage.includes('mamanfilslokat.jpg') ? 'object-[center_30%]' : ''}`}
        />
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="font-heading font-light text-4xl md:text-5xl lg:text-6xl mb-4 tracking-wide drop-shadow-sm">{heroTitle}</h1>
          <p className="text-sm md:text-base max-w-2xl mx-auto font-light tracking-wide opacity-90 drop-shadow-sm">{heroSubtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden flex justify-between items-center bg-gray-50 p-4 rounded border border-gray-200">
            <button 
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="flex items-center gap-2 font-bold uppercase text-sm"
            >
              <SlidersHorizontal size={18} /> Filtres & Catégories
            </button>
            <div className="text-sm font-semibold">{filteredProducts.length} produits</div>
          </div>

          {/* Sidebar / Filters */}
          <div className={`lg:w-1/4 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="sticky top-24 space-y-8">
              
              {/* Mobilier Subcategories (Left Side Sidebar Filter) */}
              {activeCategorySlug === 'mobilier' && (
                <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-5">
                  <h3 className="font-heading text-xs mb-4 uppercase tracking-[0.2em] text-gray-850 border-b border-gray-200/60 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63329]"></span>
                    Sélection Mobilier
                  </h3>
                  <ul className="space-y-1.5">
                    <li>
                      <Link 
                        to={getSubcategoryLink(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider rounded-lg transition-all ${
                          !activeSubcategorySlug 
                            ? 'bg-[#E63329] text-white font-semibold shadow-md shadow-red-100/50' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-base">🛋️</span>
                        <span>Tout le mobilier</span>
                      </Link>
                    </li>
                    {mobilierSubcategories.map((sub) => {
                      const isActive = activeSubcategorySlug === sub.slug;
                      return (
                        <li key={sub.slug}>
                          <Link 
                            to={getSubcategoryLink(sub.slug)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider rounded-lg transition-all ${
                              isActive 
                                ? 'bg-[#E63329] text-white font-semibold shadow-md shadow-red-100/50' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <span className="text-base">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Carrelage Subcategories (Left Side Sidebar Filter) */}
              {activeCategorySlug === 'carrelage' && (
                <div className="bg-gray-50/60 rounded-xl border border-gray-100 p-5">
                  <h3 className="font-heading text-xs mb-4 uppercase tracking-[0.2em] text-gray-850 border-b border-gray-200/60 pb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63329]"></span>
                    Sélection Carrelage
                  </h3>
                  <ul className="space-y-1.5">
                    <li>
                      <Link 
                        to={getSubcategoryLink(null)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider rounded-lg transition-all ${
                          !activeSubcategorySlug 
                            ? 'bg-[#E63329] text-white font-semibold shadow-md shadow-red-100/50' 
                            : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                        }`}
                      >
                        <span className="text-base">🧱</span>
                        <span>Tout le carrelage</span>
                      </Link>
                    </li>
                    {carrelageSubcategories.map((sub) => {
                      const isActive = activeSubcategorySlug === sub.slug;
                      return (
                        <li key={sub.slug}>
                          <Link 
                            to={getSubcategoryLink(sub.slug)}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 text-xs uppercase tracking-wider rounded-lg transition-all ${
                              isActive 
                                ? 'bg-[#E63329] text-white font-semibold shadow-md shadow-red-100/50' 
                                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                          >
                            <span className="text-base">{sub.icon}</span>
                            <span>{sub.name}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Category Links */}
              {!pathCategorySlug && (
                <div>
                  <h3 className="font-heading text-lg mb-4 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Catégories</h3>
                  <ul className="space-y-3 mt-4">
                    <li>
                      <Link 
                        to="/boutique" 
                        className={`block text-xs uppercase tracking-wider py-1 hover:text-gray-900 transition-colors ${!activeCategorySlug ? 'font-medium text-gray-900' : 'text-gray-400'}`}
                      >
                        Tous les produits
                      </Link>
                    </li>
                    {categories.map(cat => (
                      <li key={cat.id}>
                        <Link 
                          to={`/boutique?category=${cat.slug}`}
                          className={`block text-xs uppercase tracking-wider py-1 hover:text-gray-900 transition-colors ${activeCategorySlug === cat.slug ? 'font-medium text-gray-900' : 'text-gray-400'}`}
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Specific Filters (Examples) */}
              <div className="pt-4">
                <h3 className="font-heading text-lg mb-4 uppercase tracking-[0.2em] border-b border-gray-100 pb-3">Trier par</h3>
                <div className="space-y-4 mt-6 text-sm font-light text-gray-600">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === 'newest'} onChange={() => setSortBy('newest')} className="text-caz-red focus:ring-caz-red rounded-full" />
                    <span className="group-hover:text-gray-900 transition-colors">Nouveautés</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === 'popular'} onChange={() => setSortBy('popular')} className="text-caz-red focus:ring-caz-red rounded-full" />
                    <span className="group-hover:text-gray-900 transition-colors">Popularité</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === 'price_asc'} onChange={() => setSortBy('price_asc')} className="text-caz-red focus:ring-caz-red rounded-full" />
                    <span className="group-hover:text-gray-900 transition-colors">Prix croissant</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="sort" checked={sortBy === 'price_desc'} onChange={() => setSortBy('price_desc')} className="text-caz-red focus:ring-caz-red rounded-full" />
                    <span className="group-hover:text-gray-900 transition-colors">Prix décroissant</span>
                  </label>
                </div>
              </div>

            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:w-3/4">
            
            {/* Mobilier Subcategories Top Banner */}
            {activeCategorySlug === 'mobilier' && (
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-medium text-xs uppercase tracking-[0.2em] text-[#E63329] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63329] animate-pulse"></span>
                    Nos Collections Mobilier
                  </h3>
                  {activeSubcategorySlug && (
                    <Link 
                      to={getSubcategoryLink(null)}
                      className="text-xs text-gray-500 hover:text-gray-950 transition flex items-center gap-1 font-medium hover:underline"
                    >
                      Effacer le filtre &times;
                    </Link>
                  )}
                </div>
                
                {/* Horizontal scroll container with hidden scrollbar */}
                <div 
                  className="flex gap-3 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Tout voir Card */}
                  <Link 
                    to={getSubcategoryLink(null)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-24 rounded-2xl border transition-all duration-300 ${
                      !activeSubcategorySlug 
                        ? 'bg-gradient-to-br from-[#E63329] to-[#bf241d] text-white border-[#E63329] shadow-lg shadow-red-100 scale-105' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl mb-2">🏠</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-center px-1">Tout voir</span>
                  </Link>
                  
                  {mobilierSubcategories.map((sub) => {
                    const isActive = activeSubcategorySlug === sub.slug;
                    return (
                      <Link 
                        key={sub.slug}
                        to={getSubcategoryLink(sub.slug)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-28 h-24 rounded-2xl border transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-[#E63329] to-[#bf241d] text-white border-[#E63329] shadow-lg shadow-red-100 scale-105 font-medium' 
                            : 'bg-white text-gray-650 border-gray-100 hover:border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <span className="text-2xl mb-2">{sub.icon}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-center px-2 line-clamp-2 leading-tight">
                          {sub.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Carrelage Subcategories Top Banner */}
            {activeCategorySlug === 'carrelage' && (
              <div className="mb-8 font-heading">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium text-xs uppercase tracking-[0.2em] text-[#E63329] flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E63329] animate-pulse"></span>
                    Nos Collections Carrelage
                  </h3>
                  {activeSubcategorySlug && (
                    <Link 
                      to={getSubcategoryLink(null)}
                      className="text-xs text-gray-500 hover:text-gray-950 transition flex items-center gap-1 font-medium hover:underline"
                    >
                      Effacer le filtre &times;
                    </Link>
                  )}
                </div>
                
                {/* Horizontal scroll container with hidden scrollbar */}
                <div 
                  className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 sm:mx-0 sm:px-0"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {/* Tout voir Card */}
                  <Link 
                    to={getSubcategoryLink(null)}
                    className={`flex-shrink-0 flex flex-col items-center justify-center w-36 h-24 rounded-2xl border transition-all duration-300 ${
                      !activeSubcategorySlug 
                        ? 'bg-gradient-to-br from-[#E63329] to-[#bf241d] text-white border-[#E63329] shadow-lg shadow-red-100 scale-105' 
                        : 'bg-white text-gray-600 border-gray-100 hover:border-gray-200 hover:shadow-md'
                    }`}
                  >
                    <span className="text-2xl mb-2">🧱</span>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-center px-1">Tout voir</span>
                  </Link>
                  
                  {carrelageSubcategories.map((sub) => {
                    const isActive = activeSubcategorySlug === sub.slug;
                    return (
                      <Link 
                        key={sub.slug}
                        to={getSubcategoryLink(sub.slug)}
                        className={`flex-shrink-0 flex flex-col items-center justify-center w-36 h-24 rounded-2xl border transition-all duration-300 ${
                          isActive 
                            ? 'bg-gradient-to-br from-[#E63329] to-[#bf241d] text-white border-[#E63329] shadow-lg shadow-red-100 scale-105 font-medium' 
                            : 'bg-white text-gray-650 border-gray-100 hover:border-gray-200 hover:shadow-md'
                        }`}
                      >
                        <span className="text-2xl mb-2">{sub.icon}</span>
                        <span className="text-[10px] uppercase font-bold tracking-wider text-center px-2 line-clamp-2 leading-tight">
                          {sub.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="hidden lg:flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <span className="text-gray-500">{filteredProducts.length} produits trouvés</span>
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded">
                <p className="text-gray-500 text-lg">Aucun produit ne correspond à votre recherche.</p>
                <button 
                  onClick={() => setSortBy('newest')} 
                  className="mt-4 text-caz-red font-bold underline"
                >
                  Réinitialiser les filtres
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
