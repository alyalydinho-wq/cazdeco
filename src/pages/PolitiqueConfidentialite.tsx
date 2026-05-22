import React from 'react';

export default function PolitiqueConfidentialite() {
  return (
    <div className="bg-gradient-to-br from-[#F5521E] to-[#9B120B] min-h-[calc(100vh-400px)] py-16 px-4 md:px-8 flex items-center justify-center">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
          <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider mb-8 border-b border-white/20 pb-4 text-center">
            Politique de confidentialité
          </h1>
          
          <div className="space-y-8 text-sm md:text-base leading-relaxed font-medium text-white/95">
            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Collecte des données</h2>
              <p>
                Nous collectons des informations vous concernant lorsque vous créez un compte, passez une commande ou remplissez un formulaire sur notre site. Les informations que nous collectons peuvent inclure votre nom, adresse e-mail, adresse de livraison, numéro de téléphone et informations de paiement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Utilisation des données</h2>
              <p>
                Les informations que nous collectons auprès de vous peuvent être utilisées pour traiter vos commandes, personnaliser votre expérience utilisateur, vous envoyer des e-mails promotionnels ou des newsletters, répondre à vos demandes de renseignements et améliorer notre site.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Protection des données</h2>
              <p>
                Nous mettons en place des mesures de sécurité pour protéger vos données contre tout accès non autorisé ou toute modification, divulgation ou destruction de vos données personnelles. Nous utilisons des protocoles de sécurité tels que SSL pour crypter les données sensibles que vous nous fournissez.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Partage des données</h2>
              <p>
                Nous ne vendons, n'échangeons ou ne transférons pas vos données personnelles à des tiers, sauf dans les cas où cela est nécessaire pour le traitement de votre commande, la livraison de votre commande ou pour se conformer à la loi.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Cookies</h2>
              <p>
                Nous utilisons des cookies pour améliorer votre expérience sur notre site en mémorisant vos préférences et en suivant l'utilisation de notre site. Vous pouvez choisir de désactiver les cookies dans les paramètres de votre navigateur.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Consentement</h2>
              <p>
                En utilisant notre site, vous consentez à notre politique de confidentialité.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold mb-3 text-white uppercase tracking-wide">Modification de la politique de confidentialité</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. Nous vous encourageons à consulter régulièrement cette page pour être informé des éventuelles modifications.
              </p>
            </section>

            <div className="pt-8 border-t border-white/20 text-center text-white font-semibold">
              <p>
                Nous espérons que cette politique de confidentialité répondra à vos besoins. N'hésitez pas à nous contacter si vous avez des questions ou des préoccupations concernant la confidentialité de vos données.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
