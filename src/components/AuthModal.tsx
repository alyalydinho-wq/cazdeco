import React, { useState, useEffect } from 'react';
import { X, Mail, User, Phone, Check, LogOut, Coins, Percent, Award, Star, Copy, Sparkles, ShoppingBag } from 'lucide-react';
import { useStore } from '../store';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const user = useStore(state => state.user);
  const loginUser = useStore(state => state.loginUser);
  const logoutUser = useStore(state => state.logoutUser);
  const claimDailyBonus = useStore(state => state.claimDailyBonus);

  const [isSignUp, setIsSignUp] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [justClaimed, setJustClaimed] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setError('');
      setJustClaimed(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !email.includes('@')) {
      setError('Veuillez entrer une adresse e-mail valide.');
      return;
    }

    if (isSignUp) {
      if (!name.trim() || name.trim().length < 2) {
        setError('Veuillez entrer un prénom et nom valides.');
        return;
      }
      loginUser(email.trim().toLowerCase(), name.trim(), phone.trim());
    } else {
      // Login - simply log in with standard default or matching name
      const nameFromEmail = email.split('@')[0];
      const displayName = nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1);
      loginUser(email.trim().toLowerCase(), displayName, '');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleClaimBonus = () => {
    if (!user) return;
    
    // Check if claimed in last 24 hours
    const now = Date.now();
    const lastClaim = user.dailyBonusClaimedAt || 0;
    const differenceInHours = (now - lastClaim) / (1000 * 60 * 60);

    if (differenceInHours < 24) {
      setError("Vous avez déjà récupéré votre bonus aujourd'hui. Revenez demain !");
      return;
    }

    claimDailyBonus();
    setJustClaimed(true);
    setError('');
    setTimeout(() => setJustClaimed(false), 3000);
  };

  // Time remaining helper
  const getLastBonusTimeText = () => {
    if (!user || !user.dailyBonusClaimedAt) return null;
    const now = Date.now();
    const lastClaim = user.dailyBonusClaimedAt;
    const remainingMs = (24 * 60 * 60 * 1000) - (now - lastClaim);
    if (remainingMs <= 0) return null;
    
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    return `Nouveau bonus disponible dans ${hours}h ${minutes}min`;
  };

  const bonusTimerText = getLastBonusTimeText();
  const canClaimBonus = !user || !user.dailyBonusClaimedAt || (Date.now() - user.dailyBonusClaimedAt) >= (24 * 60 * 60 * 1000);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all duration-300">
      <div 
        id="auth-modal"
        className="bg-white rounded-xl shadow-2xl relative w-full max-w-md overflow-hidden transform transition-all border border-gray-100 animate-slide-up"
      >
        {/* Decorative Top Line */}
        <div className="h-2 bg-gradient-to-r from-[#E63329] via-[#C51D14] to-[#9B120B] w-full" />
        
        {/* Header Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-caz-red p-1 rounded-full hover:bg-gray-50 transition"
          aria-label="Fermer la modal"
        >
          <X size={20} />
        </button>

        {!user ? (
          /* ================= LOGIN & SIGNUP FORMS ================= */
          <div className="p-6 md:p-8">
            <div className="text-center mb-6">
              <div className="bg-red-50 text-caz-red p-3 rounded-full w-fit mx-auto mb-3">
                <Award size={32} strokeWidth={1.5} className="animate-pulse" />
              </div>
              <h2 className="font-satoshi font-bold text-2xl text-gray-900 leading-tight">
                {isSignUp ? "Rejoignez le Club Privilège" : "Espace Connexion"}
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {isSignUp 
                  ? "Créez votre compte en 10 secondes pour déverrouiller des avantages exclusifs" 
                  : "Connectez-vous pour retrouver vos points de fidélité et remises"}
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-caz-red text-caz-red p-3 text-xs mb-4 rounded-r font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Prénom & Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text"
                      required
                      placeholder="Ex: Jean Dupont"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-caz-red/20 focus:border-caz-red"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Adresse E-mail</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="email"
                    required
                    placeholder="Dupont@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-caz-red/20 focus:border-caz-red"
                  />
                </div>
              </div>

              {isSignUp && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">Téléphone <span className="text-gray-400 font-normal">(Optionnel)</span></label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="tel"
                      placeholder="Ex: 0639 57 78 37"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-caz-red/20 focus:border-caz-red"
                    />
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-[#E63329] to-[#9B120B] text-white rounded-lg font-medium text-sm hover:opacity-95 transition-opacity shadow-md flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                {isSignUp ? (
                  <>
                    <Sparkles size={16} /> Incorporer le Club Privilège (+50 pts)
                  </>
                ) : (
                  "Se connecter"
                )}
              </button>
            </form>

            {/* Benefit Teaser Card */}
            {isSignUp && (
              <div className="mt-5 p-3 rounded-lg bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 flex items-start gap-2.5">
                <Coins className="text-amber-500 mt-0.5 flex-shrink-0" size={18} />
                <div className="text-left">
                  <h4 className="text-xs font-semibold text-amber-900">VOS AVANTAGES DE BIENVENUE :</h4>
                  <ul className="text-[10px] text-amber-800 space-y-0.5 mt-1 font-light list-disc list-inside">
                    <li><strong className="font-semibold">50 points</strong> de fidélité crédités immédiatement.</li>
                    <li>Code promo de <strong className="font-semibold">-10%</strong> sur tous les paniers.</li>
                    <li>Bonus de points quotidien à réclamer chaque jour !</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Form Toggle Switch */}
            <div className="mt-6 text-center text-xs text-gray-500 border-t border-gray-100 pt-4">
              {isSignUp ? (
                <span>
                  Vous possédez déjà un compte ?{' '}
                  <button 
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(''); }}
                    className="text-caz-red font-semibold hover:underline"
                  >
                    Se connecter ici
                  </button>
                </span>
              ) : (
                <span>
                  Nouveau client ?{' '}
                  <button 
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(''); }}
                    className="text-caz-red font-semibold hover:underline"
                  >
                    Créer mon compte Privilège
                  </button>
                </span>
              )}
            </div>
          </div>
        ) : (
          /* ================= EXCLUSIVE PORTAL / LOYALTY PRIVILEGE CORE ================= */
          <div className="p-6 md:p-8">
            {/* Header Greeting */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#E63329] to-[#9B120B] flex items-center justify-center text-white font-bold text-lg select-none">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="text-left w-full flex justify-between items-center pr-4">
                <div>
                  <h3 className="text-sm text-gray-500">Ravi de vous revoir !</h3>
                  <h2 className="font-satoshi font-bold text-lg text-gray-900 leading-tight truncate max-w-[200px]">{user.name}</h2>
                </div>
                <span className="text-[10px] px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 font-semibold rounded-full flex items-center gap-1">
                  <Star size={10} className="fill-amber-500 text-amber-500" /> Bronze Member
                </span>
              </div>
            </div>

            {/* VIP loyalty card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#1A1A1A] via-[#2F2F2F] to-[#121212] text-white p-5 rounded-xl shadow-lg border-2 border-amber-400 mb-6 text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500/15 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-amber-400 font-semibold">CLUB PRIVILÈGE CAZ'DECO</span>
                  <h4 className="text-xs font-extralight text-amber-200/80">Premium Loyalty Card</h4>
                </div>
                <img src="/logo.png" alt="Caz Deco" className="h-8 bg-white/95 p-1 rounded border border-white/20 shadow-sm" />
              </div>

              <div className="mb-4">
                <span className="text-[10px] text-gray-400 block uppercase">Solde Points Fidélité</span>
                <div className="flex items-center gap-2">
                  <Coins className="text-amber-400" size={20} />
                  <span className="text-2xl font-bold font-mono text-amber-300">{user.loyaltyPoints || 0} <span className="text-xs font-light text-gray-300">points</span></span>
                </div>
              </div>

              <div className="flex justify-between items-end border-t border-white/10 pt-3">
                <div>
                  <span className="text-[8px] text-gray-400 block uppercase">Titulaire de la carte</span>
                  <span className="text-xs font-medium tracking-wide truncate max-w-[180px] block">{user.name}</span>
                </div>
                <div>
                  <span className="text-[8px] text-gray-400 block uppercase text-right">Identifiant client</span>
                  <span className="text-[10px] font-mono text-right text-amber-200/90 block">{user.id}</span>
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-l-4 border-caz-red text-caz-red p-2.5 text-xs mb-4 rounded-r font-medium text-left">
                {error}
              </div>
            )}

            {/* Daily Spin / Loyalty Reward claim */}
            <div className="mb-6 p-4 rounded-xl border border-gray-100 bg-[#FAF9F6] text-left">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <h4 className="text-xs font-semibold text-gray-900">🎁 BONUS FIDÉLITÉ JOURNALIER</h4>
                </div>
                {canClaimBonus ? (
                  <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold animate-pulse">Disponible</span>
                ) : (
                  <span className="text-[9px] text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Verrouillé</span>
                )}
              </div>
              
              <p className="text-xs text-gray-500 mb-3">
                Revenez chaque jour sur CAZ'DECO pour récolter gratuitement <strong className="font-semibold text-gray-700">15 points supplémentaires</strong> !
              </p>

              {canClaimBonus ? (
                <button
                  type="button"
                  onClick={handleClaimBonus}
                  className="w-full py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-950 font-semibold rounded-lg text-xs hover:from-amber-500 hover:to-amber-600 shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  {justClaimed ? (
                    <>
                      <Check size={14} /> Points bien récoltés ! (+15 pts)
                    </>
                  ) : (
                    "Récolter mes points du jour (+15 pts)"
                  )}
                </button>
              ) : (
                <div className="w-full py-2 bg-gray-100 text-gray-400 text-xs font-medium text-center rounded-lg border border-gray-200/50">
                  {bonusTimerText || "Revenez demain !"}
                </div>
              )}
            </div>

            {/* Exclusive Promo Coupons */}
            <div className="space-y-3 text-left">
              <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">🎟️ Mes remises réservées</h4>
              
              {/* Promo code 1 */}
              <div className="border border-emerald-100 bg-emerald-50/50 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-emerald-500 text-white rounded-lg p-2.5">
                    <Percent size={18} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Remise Spéciale Bienvenue</h5>
                    <p className="text-[10px] text-gray-500">10% offerts sur l'ensemble de la boutique</p>
                  </div>
                </div>
                <button
                  onClick={() => handleCopyCode('BIENVENUE10')}
                  className="px-3 py-1.5 border border-emerald-500 text-emerald-600 rounded-lg text-xs font-semibold hover:bg-emerald-500 hover:text-white transition flex items-center gap-1 cursor-pointer"
                >
                  {copiedCode === 'BIENVENUE10' ? (
                    "Copié !"
                  ) : (
                    <>
                      <Copy size={12} /> BIENVENUE10
                    </>
                  )}
                </button>
              </div>

              {/* Promo code 2 */}
              <div className={`border rounded-xl p-3 flex justify-between items-center transition ${user.loyaltyPoints && user.loyaltyPoints >= 100 ? 'border-amber-100 bg-amber-50/50' : 'border-gray-100 bg-gray-50 opacity-70'}`}>
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2.5 ${user.loyaltyPoints && user.loyaltyPoints >= 100 ? 'bg-amber-400 text-gray-950' : 'bg-gray-200 text-gray-500'}`}>
                    <Star size={18} className={user.loyaltyPoints && user.loyaltyPoints >= 100 ? 'fill-gray-950' : ''} />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-gray-900">Coupon Ambassadeur (-15%)</h5>
                    <p className="text-[10px] text-gray-500">
                      {user.loyaltyPoints && user.loyaltyPoints >= 100 
                        ? "Félicitations, coupon déverrouillé !" 
                        : "Besoins de 100 points pour débloquer le coupon"}
                    </p>
                  </div>
                </div>
                {user.loyaltyPoints && user.loyaltyPoints >= 100 ? (
                  <button
                    onClick={() => handleCopyCode('CAZAMBASSADEUR')}
                    className="px-3 py-1.5 border border-amber-500 text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    {copiedCode === 'CAZAMBASSADEUR' ? (
                      "Copié !"
                    ) : (
                      <>
                        <Copy size={12} /> CAZAMBASSADEUR
                      </>
                    )}
                  </button>
                ) : (
                  <span className="text-[10px] text-gray-400 border border-gray-200 px-2 py-1 rounded-lg bg-white">
                    Verrouillé
                  </span>
                )}
              </div>
            </div>

            {/* Logout actions / Footer */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[10px] text-gray-400">Enregistré le : {new Date(user.registeredAt).toLocaleDateString('fr-FR')}</span>
              <button
                type="button"
                onClick={logoutUser}
                className="text-xs font-medium text-gray-500 hover:text-caz-red flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut size={14} /> Se déconnecter
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
