import React from 'react';

export default function MentionsLegales() {
  return (
    <div className="bg-gradient-to-br from-[#F5521E] to-[#9B120B] min-h-[calc(100vh-400px)] py-16 px-4 md:px-8 flex items-center justify-center">
      <div className="container mx-auto max-w-6xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 text-white flex flex-col md:flex-row gap-12 items-center md:items-start">
          
          {/* Logo Section */}
          <div className="w-48 h-48 md:w-80 md:h-80 shrink-0 bg-white rounded-xl shadow-lg p-6 flex items-center justify-center">
            <img src="/logo.png" alt="Caz'Deco Logo" className="w-full h-full object-contain" />
          </div>

          {/* Text Section */}
          <div className="flex-1 space-y-6 text-sm md:text-base leading-relaxed content-start font-medium text-white/95">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-8 border-b border-white/20 pb-4">Mentions Légales</h1>
            
            <p>
              Le site cazdeco.com est immatriculée au Registre du Commerce et des Sociétés (RCS) de Mamoudzou sous le numéro 922 072 335.<br />
              <strong className="text-white">Siège social :</strong> 1 IMP MAHARAJAH 97600 MAMOUDZOU.
            </p>

            <p>
              <strong className="text-white">Activité principale déclarée :</strong> L'achat et la vente de tous meubles, objets mobiliers et plus généralement tout ce qui concerne l'ameublement, la fabrication, la représentation, l'entrepôt, la manutention, l'importation et l'exportation. L'achat, la vente, la représentation, le négoce en général, la distribution et la commercialisation de tous matériels, équipements, pièces détachées et appareils de toute nature. L'importation et l'exportation de tous produits non réglementés.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <p><strong className="text-white">Code NAF ou APE :</strong> 47.59A <span className="opacity-80">(Commerce de détail de meubles)</span></p>
              <p><strong className="text-white">Domaine d’activité :</strong> Commerce de détail, à l'exception des automobiles et des motocycles</p>
              <p><strong className="text-white">Convention collective supposée :</strong> Négoce de l'ameublement - IDCC 1880</p>
              <p><strong className="text-white">Date de clôture d'exercice comptable :</strong> 31/12/2023</p>
              <p><strong className="text-white">Numéro de TVA intracommunautaire :</strong> FR20922072335</p>
              <p><strong className="text-white">Le dirigeant de la société est :</strong> Shemir GOULAMALY.</p>
              <p><strong className="text-white">Le capital social de la société est de :</strong> 1 000,00 €.</p>
            </div>

            <p className="pt-6 border-t border-white/20">
              Pour toute question ou réclamation concernant le site de CAZ DECO MAYOTTE, vous pouvez nous contacter par email à <a href="mailto:cazdeco976@gmail.com" className="font-bold hover:underline">cazdeco976@gmail.com</a> ou par téléphone au <a href="tel:+262639257019" className="font-bold hover:underline">+262 639 25 70 19</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
