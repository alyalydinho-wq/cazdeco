import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useStore } from './store';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Boutique from './pages/Boutique';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import Livraison from './pages/Livraison';
import MentionsLegales from './pages/MentionsLegales';
import PolitiqueConfidentialite from './pages/PolitiqueConfidentialite';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminCategories from './pages/admin/AdminCategories';
import AdminMedia from './pages/admin/AdminMedia';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPromotions from './pages/admin/AdminPromotions';
import AdminSettings from './pages/admin/AdminSettings';
import AdminCustomers from './pages/admin/AdminCustomers';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';

function ScrollToTop() {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Some browsers need a slight delay to allow layout to settle
    const timeout = setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.body.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }, 20);
    return () => clearTimeout(timeout);
  }, [pathname, search]);

  return null;
}

export default function App() {
  const initializeFirebaseSync = useStore(state => state.initializeFirebaseSync);

  useEffect(() => {
    initializeFirebaseSync();
  }, [initializeFirebaseSync]);

  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Admin Routes - No MainLayout */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="produits" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="media" element={<AdminMedia />} />
          <Route path="commandes" element={<AdminOrders />} />
          <Route path="clients" element={<AdminCustomers />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="parametres" element={<AdminSettings />} />
          <Route path="*" element={<div className="text-white p-6">Page en construction</div>} />
        </Route>

        {/* Public Routes with MainLayout */}
        <Route path="*" element={
          <MainLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/boutique" element={<Boutique />} />
              <Route path="/carrelage" element={<Boutique />} />
              <Route path="/plan-de-travail" element={<Boutique />} />
              <Route path="/mobilier" element={<Boutique />} />
              <Route path="/luminaires" element={<Boutique />} />
              <Route path="/produit/:id" element={<ProductDetail />} />
              <Route path="/panier" element={<Cart />} />
              <Route path="/commande" element={<Checkout />} />
              <Route path="/confirmation/:id" element={<Confirmation />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/a-propos" element={<About />} />
              <Route path="/livraison" element={<Livraison />} />
              <Route path="/mentions-legales" element={<MentionsLegales />} />
              <Route path="/politique-confidentialite" element={<PolitiqueConfidentialite />} />
              <Route path="/cgv" element={<div className="min-h-[50vh] flex items-center justify-center p-6"><h1 className="text-2xl">Page en construction</h1></div>} />
            </Routes>
          </MainLayout>
        } />
      </Routes>
    </Router>
  );
}
