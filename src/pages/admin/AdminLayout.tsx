import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Package, Folders, Image as ImageIcon, 
  ShoppingCart, Users, Tag, Settings, LogOut 
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function AdminLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAdminAuth = () => {
      const sessionStr = sessionStorage.getItem('cazdecoAdmin');
      if (!sessionStr) {
        setIsAuthenticated(false);
        return;
      }
      try {
        const session = JSON.parse(sessionStr);
        // Session expire après 8h
        if (Date.now() - session.loginTime > 8 * 60 * 60 * 1000) {
          sessionStorage.removeItem('cazdecoAdmin');
          window.location.href = '/admin/login?expired=1';
          return;
        }
        setIsAuthenticated(true);
      } catch (e) {
        setIsAuthenticated(false);
      }
    };
    checkAdminAuth();
  }, [location.pathname]);

  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" replace />;
  }

  if (isAuthenticated === null) {
    return <div className="min-h-screen bg-[#0f172a]" />; // Loading state
  }

  const handleLogout = () => {
    sessionStorage.removeItem('cazdecoAdmin');
    localStorage.removeItem('cazdecoAdminRemember'); // In case they want full logout
    window.location.href = '/admin/login';
  };

  const navItems = [
    { name: 'Tableau de bord', path: '/admin', icon: LayoutDashboard },
    { name: 'Produits', path: '/admin/produits', icon: Package },
    { name: 'Catégories', path: '/admin/categories', icon: Folders },
    { name: 'Médiathèque', path: '/admin/media', icon: ImageIcon },
    { name: 'Commandes', path: '/admin/commandes', icon: ShoppingCart },
    { name: 'Clients', path: '/admin/clients', icon: Users },
    { name: 'Promotions', path: '/admin/promotions', icon: Tag },
    { name: 'Paramètres', path: '/admin/parametres', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1e293b] border-r border-slate-800 flex flex-col hidden md:flex shrink-0">
        <div className="p-6 border-b border-slate-800">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-heading font-black text-2xl tracking-tighter text-white">
              CAZ<span className="text-[#E63329]">DECO</span>
            </span>
          </Link>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mt-2 block">Administration</span>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
              return (
                <li key={item.path}>
                  <Link 
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition ${
                      isActive 
                        ? 'bg-[#E63329]/10 text-[#E63329] font-medium' 
                        : 'hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full text-left text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#0f172a]">
        <header className="h-16 bg-[#1e293b] border-b border-slate-800 flex items-center justify-between px-6 shrink-0">
          <h2 className="text-xl font-heading font-semibold text-white">
            {navItems.find(i => i.path === location.pathname)?.name || 'Administration'}
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-sm border border-slate-600">
              AD
            </div>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
