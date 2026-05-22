import React, { ReactNode, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Heart, Menu, X, Search, ChevronRight, Home, Truck, Phone, Facebook, Instagram, HelpCircle, MapPin } from 'lucide-react';
import { useStore } from '../../store';
import CartDrawer from './CartDrawer';
import AuthModal from '../AuthModal';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const cart = useStore(state => state.cart);
  const settings = useStore(state => state.settings);
  const user = useStore(state => state.user);
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/boutique?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Header */}
      <header className="shadow-sm z-40 relative">
        {/* Main Header (Gradient) */}
        <div className="bg-gradient-to-r from-[#E63329] to-[#9B120B] text-white">
          <div className="flex items-center justify-between px-4 md:px-8 py-4 mx-auto w-full max-w-[1600px]">
            {/* Mobile Menu & Left Space */}
            <div className="flex items-center gap-4 w-1/4">
              <button 
                className="md:hidden text-white hover:text-gray-200 transition"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu strokeWidth={1.5} size={24} />
              </button>
              
              <div className="hidden md:flex flex-1 max-w-sm">
                <form onSubmit={handleSearch} className="relative w-full">
                  <input 
                    type="text" 
                    placeholder="Je cherche un produit..." 
                    className="w-full bg-white text-gray-900 rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-white border-none shadow-inner"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-caz-red transition">
                    <Search size={18} strokeWidth={2} />
                  </button>
                </form>
              </div>
            </div>

            {/* Logo Center */}
            <div className="flex justify-center w-2/4">
              <Link to="/" className="flex items-center">
                <div className="bg-white border-[0.5px] border-white/80 p-0.5 shadow-sm rounded-sm">
                  <img src="/logo.png" alt="CAZ'DECO" className="h-[60px] md:h-[90px] object-contain" />
                </div>
              </Link>
            </div>

            {/* Utilities Right */}
            <div className="flex items-center justify-end gap-6 text-white w-1/4">
              <div className="hidden lg:flex items-center gap-4 text-white">
                <a href={settings.facebookUrl || "https://facebook.com"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition group">
                  <Facebook strokeWidth={1.5} size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href={settings.instagramUrl || "https://instagram.com"} target="_blank" rel="noreferrer" className="hover:text-white/80 transition group">
                  <Instagram strokeWidth={1.5} size={24} className="group-hover:scale-110 transition-transform" />
                </a>
              </div>
              
              <a 
                href="https://www.google.com/maps/search/?api=1&query=1+IMPASSE+MAHARAJA+KAWENI+97600+MAYOTTE" 
                target="_blank" 
                rel="noreferrer"
                className="hidden lg:flex items-center gap-2 hover:text-white/80 transition group"
              >
                <MapPin strokeWidth={1.5} size={28} className="group-hover:scale-110 transition-transform" />
                <span className="text-[12px] font-medium tracking-wide">Showroom</span>
              </a>

              <button 
                onClick={() => setIsAuthOpen(true)}
                className="hidden sm:flex items-center gap-2 hover:text-white/80 transition group"
              >
                {user ? (
                  <div className="w-7 h-7 rounded-full bg-white/20 text-white flex items-center justify-center font-bold text-xs border border-white/40 group-hover:bg-white/30 transition-colors">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <User strokeWidth={1.5} size={30} className="group-hover:scale-110 transition-transform" />
                )}
                <span className="text-[12px] font-medium tracking-wide whitespace-nowrap">
                  {user ? user.name : "Me connecter"}
                </span>
              </button>

              <button 
                className="flex items-center justify-center cursor-pointer hover:text-white/80 transition relative sm:ml-2 group"
                onClick={() => setIsCartOpen(true)}
              >
                <ShoppingCart strokeWidth={1.5} size={24} className="group-hover:scale-110 transition-transform" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-white text-caz-red text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold shadow-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Navigation (White) */}
        <nav className="hidden md:flex justify-center gap-12 py-4 border-b border-gray-100 text-[13px] font-medium tracking-wide bg-white uppercase">
          <Link to="/" className="hover:text-caz-red transition pb-1">Accueil</Link>
          <Link to="/boutique" className="hover:text-caz-red transition pb-1">Boutique</Link>
          <Link to="/carrelage" className="hover:text-caz-red transition pb-1">Carrelage</Link>
          <Link to="/plan-de-travail" className="hover:text-caz-red transition pb-1">Plan de travail</Link>
          <Link to="/mobilier" className="hover:text-caz-red transition pb-1">Mobilier</Link>
          <Link to="/luminaires" className="hover:text-caz-red transition pb-1">Luminaires</Link>
        </nav>

        {/* Promotional Ticker (Red) */}
        <div className="bg-gradient-to-r from-[#E63329] to-[#9B120B] text-white py-2 overflow-hidden flex whitespace-nowrap shadow-inner border-y border-white/10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-marquee flex gap-12 font-medium text-[11px] uppercase tracking-wider px-6 flex-shrink-0" aria-hidden={i > 0}>
              <span className="flex items-center gap-2">{settings.promotionalText || "Paiement jusqu'à 4 fois sans frais. Livraison express sur toute l'île. Support client à votre écoute."}</span>
              <span className="flex items-center gap-2">{settings.promotionalText || "Paiement jusqu'à 4 fois sans frais. Livraison express sur toute l'île. Support client à votre écoute."}</span>
            </div>
          ))}
        </div>

        {/* Mobile Search - Visible only on small screens */}
        <div className="p-3 md:hidden bg-white border-b border-gray-100">
          <form onSubmit={handleSearch} className="relative w-full">
            <input 
              type="text" 
              placeholder="Rechercher..." 
              className="w-full pl-4 pr-12 py-2 rounded-full border border-gray-300 focus:outline-none focus:border-caz-red"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
              <Search size={20} />
            </button>
          </form>
        </div>
      </header>

      {/* Mobile Menu Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 transition-opacity" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Menu Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-4/5 max-w-sm bg-white z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4 border-b border-gray-100 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="CAZ'DECO" className="w-12 h-12 object-contain shadow-sm" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-caz-red">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-y-auto h-full pb-20">
          <ul className="flex flex-col text-left font-semibold">
            <li>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Accueil <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
            <li>
              <Link to="/boutique" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Boutique <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
            <li>
              <Link to="/carrelage" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Carrelage <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
            <li>
              <Link to="/plan-de-travail" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Plan de travail <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
            <li>
              <Link to="/mobilier" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Mobilier <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
            <li>
              <Link to="/luminaires" onClick={() => setIsMobileMenuOpen(false)} className="px-6 py-4 border-b border-gray-50 flex items-center justify-between hover:bg-gray-50">
                Luminaires <ChevronRight size={16} className="text-gray-400" />
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <main className="flex-1 bg-caz-gray-light pb-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-[#E63329] to-[#9B120B] text-white mt-auto pt-16 pb-8 font-light">
        <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12 border-b border-white/20 pb-12">
          
          <div className="flex flex-col gap-6">
            <div className="bg-white p-3 rounded shadow-sm w-fit">
              <img src="/logo.png" alt="CAZ'DECO" className="w-[120px] object-contain" />
            </div>
            <p className="text-sm opacity-90 leading-relaxed">
              Design, mobilier et aménagement intérieur d'excellence pour sublimer votre espace de vie.
            </p>
            <div className="flex items-center gap-4 mt-2">
              <a href="https://www.facebook.com/CAZDECO" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
                <Facebook size={16} strokeWidth={1.5} />
              </a>
              <a href="https://www.instagram.com/caz_deco/" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full border border-gray-600 flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors">
                <Instagram size={16} strokeWidth={1.5} />
              </a>
            </div>
          </div>
          
          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-medium uppercase tracking-wider text-sm mb-4 text-white">Notre boutique</h3>
            <p className="text-sm opacity-80 leading-relaxed font-light">
              <span className="block mb-2">1 IMPASSE MAHARAJA KAWENI 97600 MAYOTTE</span>
            </p>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1887.411132204561!2d45.2281895!3d-12.77583!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2213337a77e8a9f5%3A0xc3466f272a27b822!2s1%20Imp.%20Maharaja%2C%20Mamoudzou%2097600%2C%20Mayotte!5e0!3m2!1sen!2sfr!4v1716200000000!5m2!1sen!2sfr" 
              width="100%" 
              height="250" 
              style={{ border: 0, borderRadius: '4px', opacity: 0.8 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>

          <div className="flex flex-col gap-4 lg:pl-12">
            <h3 className="font-sans font-medium uppercase tracking-wider text-sm mb-4 text-white">Liens utiles</h3>
            <div className="flex flex-col gap-3 text-sm opacity-80">
              <Link to="/" className="hover:text-caz-red transition-colors w-fit">Accueil</Link>
              <Link to="/a-propos" className="hover:text-caz-red transition-colors w-fit">À propos de CAZ DECO</Link>
              <Link to="/livraison" className="hover:text-caz-red transition-colors w-fit">Suivi de livraison</Link>
              <Link to="/mentions-legales" className="hover:text-caz-red transition-colors w-fit">Mentions Légales</Link>
              <Link to="/politique-confidentialite" className="hover:text-caz-red transition-colors w-fit">Données personnelles</Link>
              <Link to="/cgv" className="hover:text-caz-red transition-colors w-fit">CGV</Link>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="font-sans font-medium uppercase tracking-wider text-sm mb-4 text-white">Besoin d'aide ?</h3>
            <div className="flex flex-col gap-4 text-sm opacity-80">
              <p className="leading-relaxed font-light">
                Notre service client est à votre écoute pour vous conseiller.
              </p>
              <div className="flex items-center gap-3 mt-2">
                <Phone size={18} strokeWidth={1.5} />
                <a href="tel:0639577837" className="hover:text-caz-red transition-colors font-medium">06.39.57.78.37</a>
              </div>
              <div className="flex items-center gap-3">
                <HelpCircle size={18} strokeWidth={1.5} />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-caz-red transition-colors">{settings.contactEmail}</a>
              </div>
              <Link to="/contact" className="mt-4 px-6 py-2.5 border border-white hover:bg-white hover:text-gray-900 transition-colors uppercase text-xs tracking-wider text-center w-fit">
                Nous contacter
              </Link>
              <Link to="/admin/login" className="text-[10px] mt-4 opacity-40 hover:opacity-100 transition-opacity w-fit">Accès Administration</Link>
            </div>
          </div>
          
        </div>
        
        <div className="container mx-auto px-8 flex justify-between items-center text-xs opacity-60">
          <p>© 2025 {settings.siteName}. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Truck size={16} strokeWidth={1} />
            <ShoppingCart size={16} strokeWidth={1} />
            <Home size={16} strokeWidth={1} />
          </div>
        </div>
      </footer>

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </div>
  );
}
