import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, ShoppingBag, Mail, Package, ArrowRight } from 'lucide-react';

export default function Confirmation() {
  const { id } = useParams();

  return (
    <div className="max-w-[800px] mx-auto px-4 py-20 text-center">
      <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
        <CheckCircle2 size={48} />
      </div>

      <h1 className="text-4xl font-heading font-bold text-gray-900 mb-4">Merci pour votre commande !</h1>
      <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
        Votre commande <span className="font-bold text-gray-900">#{id}</span> a été enregistrée avec succès. 
        Un email de confirmation vient de vous être envoyé.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 text-left">
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center mb-4">
            <Mail className="text-caz-red" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Suivi de commande</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Vous recevrez par email toutes les étapes de préparation de votre colis jusqu'à sa livraison.
          </p>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
          <div className="w-10 h-10 bg-white shadow-sm rounded-lg flex items-center justify-center mb-4">
            <Package className="text-caz-red" size={20} />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">Service Client</h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Une question ? Notre équipe est disponible au <span className="font-bold">06.39.57.78.37</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link 
          to="/boutique" 
          className="px-8 py-3 bg-gray-900 text-white font-bold rounded hover:bg-black transition uppercase tracking-widest text-xs flex items-center justify-center gap-2"
        >
          Continuer mes achats
          <ArrowRight size={14} />
        </Link>
        <Link 
          to="/" 
          className="px-8 py-3 border border-gray-200 text-gray-900 font-bold rounded hover:bg-gray-50 transition uppercase tracking-widest text-xs flex items-center justify-center gap-2"
        >
          Retour à l'accueil
        </Link>
      </div>
    </div>
  );
}
