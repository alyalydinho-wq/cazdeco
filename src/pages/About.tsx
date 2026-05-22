import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="bg-white">
      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#F5521E] to-[#9B120B] text-white py-12 px-6 text-center">
        <h1 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-4">À Propos de Caz'Deco</h1>
        <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base">
          Votre spécialiste en aménagement et décoration d'intérieur à Mayotte.
        </p>
      </div>

      {/* Bento Grid layout as requested */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden rounded-xl shadow-lg border border-gray-100">
          
          {/* Left Large Image */}
          <div className="relative h-[400px] md:h-auto">
            <img 
              src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200" 
              alt="Mobilier design confortable" 
              className="absolute inset-0 w-full h-full object-cover" 
            />
          </div>

          {/* Right 2x2 Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 h-full">
            
            {/* Box 1: Livraison Rapide */}
            <div className="bg-[#FAF2EE] p-8 md:p-12 flex flex-col justify-center text-center aspect-square md:aspect-auto">
              <h3 className="text-xl md:text-2xl font-black text-[#A03D31] uppercase mb-4 tracking-wider">Livraison Rapide</h3>
              <p className="text-[#333333] font-medium text-sm md:text-base">Sur l'ensemble de Mayotte</p>
            </div>
            
            {/* Box 2: Vente + Ecommerce */}
            <div className="bg-[#B95D4A] p-8 md:p-12 flex flex-col justify-center text-center text-white aspect-square md:aspect-auto">
              <h3 className="text-[16px] md:text-lg font-black uppercase mb-4 tracking-wider leading-snug">
                1 Point de vente + 1 site Ecommerce
              </h3>
              <div className="text-sm md:text-sm space-y-2 text-white/90 font-medium text-left">
                <p>- Point de vente de 400m2: 1 Impasse maharaja, Kaweni</p>
                <p>- Site ecommerce: www.cazdeco.odoo.com</p>
              </div>
            </div>

            {/* Box 3: Qualité-Prix */}
            <div className="bg-[#D64727] p-8 md:p-12 flex flex-col justify-center text-center text-white aspect-square md:aspect-auto">
              <h3 className="text-xl md:text-2xl font-black uppercase mb-4 tracking-wider">Qualité-Prix</h3>
              <p className="text-white/90 font-medium text-sm md:text-base">Rapport qualité prix imbattable !</p>
            </div>

            {/* Box 4: Large Gamme */}
            <div className="bg-[#FAF2EE] p-8 md:p-12 flex flex-col justify-center text-center aspect-square md:aspect-auto">
              <h3 className="text-xl md:text-2xl font-black text-[#A03D31] uppercase mb-4 tracking-wider leading-tight">Large Gamme de Produits</h3>
              <p className="text-[#333333] font-medium text-sm md:text-base">+5000 références</p>
            </div>

          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-center text-2xl font-black uppercase tracking-wider text-[#333333] mb-12">L'équipe dirigeante</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8">
            
            {/* Team Member 1 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300" 
                  alt="Mohamed GOULAMALY" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-1">
                  Mohamed GOULAMALY, <span className="font-normal text-gray-600 block sm:inline">Gérant</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  Fondateur et visionnaire en chef, Mohamed est le moteur de l'entreprise. Il aime rester occupé en participant au développement des stratégies logicielles, marketing et d'expérience client.
                </p>
              </div>
            </div>

            {/* Team Member 2 */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="w-40 h-40 rounded-full overflow-hidden shrink-0 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&q=80&w=300&h=300" 
                  alt="Shemir GOULAMALY" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#333333] mb-1">
                  Shemir GOULAMALY, <span className="font-normal text-gray-600 block sm:inline">Responsable commercial</span>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mt-3">
                  Shemir adore relever des défis. Fort de son expérience de plusieurs années en tant que responsable commercial dans le commerce, Shemir a aidé l'entreprise à en arriver là où elle est aujourd'hui. Il fait partie des meilleurs esprits de l'équipe.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
