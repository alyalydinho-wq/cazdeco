import { MapPin, Phone, Mail, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { useStore } from '../store';

export default function Contact() {
  const settings = useStore(state => state.settings);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
    }, 5000);
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="bg-black py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2">
            Contactez-nous
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 mt-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <p className="text-[#333333] mb-8 font-medium">
            Contactez-nous pour tout ce qui concerne notre entreprise ou nos services.<br />
            Nous ferons de notre mieux pour vous répondre dans les plus brefs délais.
          </p>

          {isSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-lg text-center">
              <h3 className="text-lg font-bold mb-2">Merci pour votre message !</h3>
              <p>Nous vous répondrons dans les plus brefs délais.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label className="text-sm text-[#333333] md:text-right">Nom <span className="text-[#E63329]">*</span></label>
                <div className="md:col-span-3">
                  <input type="text" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label className="text-sm text-[#333333] md:text-right">Numéro de téléphone</label>
                <div className="md:col-span-3">
                  <div className="flex">
                    <span className="bg-gray-50 border border-r-0 border-gray-300 rounded-l-md px-3 py-2 text-gray-500 text-sm">
                      +262
                    </span>
                    <input type="tel" className="w-full border border-gray-300 rounded-r-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label className="text-sm text-[#333333] md:text-right">E-mail <span className="text-[#E63329]">*</span></label>
                <div className="md:col-span-3">
                  <input type="email" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label className="text-sm text-[#333333] md:text-right">Société</label>
                <div className="md:col-span-3">
                  <input type="text" className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-center gap-4">
                <label className="text-sm text-[#333333] md:text-right">Sujet <span className="text-[#E63329]">*</span></label>
                <div className="md:col-span-3">
                  <input type="text" required className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 items-start gap-4">
                <label className="text-sm text-[#333333] md:text-right pt-2">Question <span className="text-[#E63329]">*</span></label>
                <div className="md:col-span-3">
                  <textarea required rows={5} className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-[#E63329] focus:outline-none resize-none"></textarea>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-start-2 md:col-span-3">
                  <button type="submit" className="bg-gradient-to-br from-[#F5521E] to-[#9B120B] hover:opacity-90 text-white px-6 py-2.5 rounded-md font-medium transition-opacity">
                    Soumettre
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Contact Info Section */}
        <div>
          <h3 className="text-[#333333] font-medium mb-6 uppercase tracking-wider text-sm">Contact:</h3>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <MapPin className="text-[#333333] shrink-0 w-5 h-5" />
              <p className="text-sm text-[#333333] leading-relaxed uppercase">{settings.address}</p>
            </div>
            
            <div className="flex gap-3 items-center">
              <Phone className="text-[#333333] shrink-0 w-5 h-5" />
              <p className="text-sm text-[#333333] uppercase">06.39.57.78.37</p>
            </div>
            
            <div className="flex gap-3 items-center">
              <Mail className="text-[#333333] shrink-0 w-5 h-5" />
              <p className="text-sm text-[#333333] uppercase">CAZDECO976@GMAIL.COM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
