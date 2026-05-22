import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { auth, isFirebaseConfigured } from '../../lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const ADMIN_CREDENTIALS = {
  email: "admin@cazdeco.re",
  password: "CazDeco2025!" // En production ceci devrait être géré côté serveur
};

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@cazdeco.re');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const expired = new URLSearchParams(location.search).get('expired');
    if (expired) {
      setError('Votre session a expiré. Veuillez vous reconnecter.');
    }
    
    // Check if remembered
    const rememberedEmail = localStorage.getItem('cazdecoAdminRemember');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, [location]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (blockedUntil && blockedUntil > Date.now()) {
      timer = setInterval(() => {
        const remaining = Math.ceil((blockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setBlockedUntil(null);
          setAttempts(0);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    } else if (blockedUntil) {
      setBlockedUntil(null);
      setAttempts(0);
    }
    return () => clearInterval(timer);
  }, [blockedUntil]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (blockedUntil && blockedUntil > Date.now()) return;

    setLoading(true);
    
    if (isFirebaseConfigured) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        sessionStorage.setItem('cazdecoAdmin', JSON.stringify({ email: userCredential.user.email, loginTime: Date.now() }));
        if (rememberMe) {
          localStorage.setItem('cazdecoAdminRemember', email);
        } else {
          localStorage.removeItem('cazdecoAdminRemember');
        }
        navigate('/admin');
      } catch (err: any) {
        handleFailedAttempt(err.message || 'Email ou mot de passe incorrect (Firebase)');
      } finally {
        setLoading(false);
      }
    } else {
      // Fallback local login
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('cazdecoAdmin', JSON.stringify({ email, loginTime: Date.now() }));
        if (rememberMe) {
          localStorage.setItem('cazdecoAdminRemember', email);
        } else {
          localStorage.removeItem('cazdecoAdminRemember');
        }
        navigate('/admin');
      } else {
        handleFailedAttempt('Email ou mot de passe incorrect');
      }
      setLoading(false);
    }
  };

  const handleFailedAttempt = (errorMsg: string) => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);
    if (newAttempts >= 3) {
      setBlockedUntil(Date.now() + 30000); // 30 seconds
      setError(`Trop de tentatives. Réessayez dans 30 secondes.`);
    } else {
      setError(errorMsg);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans">
      <div className="bg-[#1e293b] p-8 rounded-xl w-full max-w-md shadow-2xl border border-slate-800">
        <div className="text-center mb-8 flex flex-col items-center">
          <img src="/logo.png" alt="CAZ'DECO" className="w-16 h-16 object-contain mb-4 bg-white rounded-full p-1" />
          <span className="font-heading font-black text-3xl tracking-tighter text-white">
            CAZ'<span className="text-[#E63329]">DECO</span>
          </span>
          <p className="text-slate-400 mt-2 text-sm uppercase tracking-widest font-bold">Espace Administrateur</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg mb-6 text-sm text-center">
            {error} {blockedUntil ? `(${countdown}s)` : ''}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-300 text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] focus:ring-1 focus:ring-[#E63329] transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!!blockedUntil}
              required
            />
          </div>
          <div className="relative">
            <label className="block text-slate-300 text-sm font-medium mb-1">Mot de passe</label>
            <input 
              type={showPassword ? "text" : "password"} 
              className="w-full bg-[#0f172a] border border-slate-700 text-white rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#E63329] focus:ring-1 focus:ring-[#E63329] transition-colors pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={!!blockedUntil}
              required
            />
            <button 
              type="button"
              className="absolute right-3 top-[34px] text-slate-400 hover:text-white"
              onClick={() => setShowPassword(!showPassword)}
              disabled={!!blockedUntil}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-slate-700 bg-[#0f172a] text-[#E63329] focus:ring-[#E63329]"
                disabled={!!blockedUntil}
              />
              <span className="text-sm text-slate-300">Se souvenir de moi</span>
            </label>
          </div>

          <button 
            type="submit"
            className="w-full bg-[#E63329] text-white rounded-lg px-4 py-3 font-bold hover:bg-[#c42b22] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            disabled={!!blockedUntil}
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
