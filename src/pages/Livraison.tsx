import { Truck, Clock, ShieldCheck, PhoneCall } from 'lucide-react';

export default function Livraison() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-[#a03d31] text-white py-20 px-6 overflow-hidden">
        {/* Subtle background abstract curves (marketing style) */}
        <div className="absolute inset-0 opacity-10">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,50 Q25,25 50,50 T100,50" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,60 Q25,35 50,60 T100,60" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,70 Q25,45 50,70 T100,70" stroke="white" strokeWidth="0.5" fill="none" />
            <path d="M0,40 Q25,15 50,40 T100,40" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>
        
        <div className="container mx-auto max-w-5xl relative z-10">
          <h1 className="text-3xl md:text-4xl font-medium mb-10">Notre service de livraison</h1>
          
          <div className="space-y-6 text-[15px] leading-relaxed text-white/95 font-light">
            <p>
              Grace à nos fidèles transporteurs, nous proposons la livraison des commandes sur l'ensemble de Mayotte.
            </p>
            <p>
              Explorez la simplicité et la rapidité avec notre service de livraison. Profitez d'une expédition efficace qui vous permet de recevoir vos articles le jour même ou dans un délai express de 24 à 72 heures. Nous mettons à votre disposition un système de suivi en temps réel, vous tenant informé à chaque étape du processus. Notre engagement envers la qualité garantit que vos produits arrivent rapidement et en parfait état. Choisissez la confiance et l'efficacité pour une expérience de livraison exceptionnelle, car nous sommes déterminés à répondre à vos besoins dans les délais qui vous conviennent.
            </p>
            <p className="font-semibold pt-4">
              Pour un devis, merci de nous contacter au 06.92.25.70.19
            </p>
          </div>
        </div>
      </div>

      {/* Mid Section - Delivery Fast */}
      <div className="bg-[#FAF2EE] py-16">
         <h2 className="text-center text-3xl md:text-5xl text-[#A03D31] font-medium mb-16 px-4">Livraison rapide !</h2>
         
         {/* Marketing Images & Features Grid */}
         <div className="container mx-auto px-4 max-w-6xl">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
             {/* Feature 1 */}
             <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-20 h-20 bg-[#FAF2EE] text-[#A03D31] rounded-full flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-[#F5521E] to-[#9B120B] group-hover:text-white transition-colors">
                 <Truck size={36} />
               </div>
               <h3 className="text-xl font-black text-[#333333] mb-3 uppercase tracking-wider">Flotte Sécurisée</h3>
               <p className="text-gray-600">Transport de vos colis encombrants avec soin, de notre magasin de Kaweni jusqu'à votre domicile.</p>
             </div>

             {/* Feature 2 */}
             <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-20 h-20 bg-[#FAF2EE] text-[#A03D31] rounded-full flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-[#F5521E] to-[#9B120B] group-hover:text-white transition-colors">
                 <Clock size={36} />
               </div>
               <h3 className="text-xl font-black text-[#333333] mb-3 uppercase tracking-wider">Délais Express</h3>
               <p className="text-gray-600">Réception le jour même ou sous 24 à 72h selon votre zone de livraison à travers Mayotte.</p>
             </div>

             {/* Feature 3 */}
             <div className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col items-center text-center group hover:-translate-y-1 transition-transform duration-300">
               <div className="w-20 h-20 bg-[#FAF2EE] text-[#A03D31] rounded-full flex items-center justify-center mb-6 group-hover:bg-gradient-to-br from-[#F5521E] to-[#9B120B] group-hover:text-white transition-colors">
                 <ShieldCheck size={36} />
               </div>
               <h3 className="text-xl font-black text-[#333333] mb-3 uppercase tracking-wider">Intégrité Garantie</h3>
               <p className="text-gray-600">Vos articles arrivent en parfait état. Nos équipes s'assurent d'une manipulation experte et rigoureuse.</p>
             </div>
           </div>

           {/* Professional image banner */}
           <div className="rounded-2xl overflow-hidden relative h-[350px] md:h-[450px] shadow-2xl group">
             <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors z-10 duration-500"></div>
             <img 
               src="https://images.unsplash.com/photo-1580674285054-bed31e145f59?auto=format&fit=crop&q=80&w=1200" 
               alt="Services de livraison professionnels" 
               className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out" 
             />
             <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white px-4 text-center">
               <span className="text-sm md:text-base font-bold tracking-[0.2em] uppercase mb-4 text-white/80">Caz'Deco Delivery</span>
               <h3 className="text-3xl md:text-5xl font-black uppercase tracking-wider mb-6 drop-shadow-lg">On s'occupe de tout</h3>
               <a href="tel:0692257019" className="inline-flex items-center gap-3 bg-gradient-to-br from-[#F5521E] to-[#9B120B] px-8 py-4 rounded-full text-lg font-bold hover:opacity-90 transition-opacity drop-shadow-md">
                 <PhoneCall size={24} />
                 Appeler le 06.92.25.70.19
               </a>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}
