
import React from 'react';

interface FooterProps {
  onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
  return (
    <footer className="relative mt-20 border-t border-white/5 bg-black/80 backdrop-blur-md">
      <div className="container mx-auto py-16 px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          <div className="space-y-4">
             <span className="text-2xl font-light tracking-[0.2em] text-white">
                HE<span className="text-transparent bg-clip-text bg-gold-gradient font-bold">EIN</span>
            </span>
            <p className="text-gray-400 font-light text-sm leading-relaxed max-w-xs">
              A curadoria definitiva de essências luxuosas. Transformando a presença em uma assinatura inesquecível.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gold-gradient">Links</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Privacidade</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gold-gradient">Suporte</h4>
            <ul className="space-y-3 text-sm font-light">
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Rastreamento</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">Devoluções</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold text-white tracking-widest uppercase mb-6 text-transparent bg-clip-text bg-gold-gradient">Newsletter</h4>
            <p className="text-gray-400 text-sm font-light mb-4">Acesso exclusivo a lançamentos.</p>
            <form className="flex group">
              <input 
                type="email" 
                placeholder="Seu e-mail" 
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm rounded-l-lg focus:outline-none focus:border-brand-gold/50 transition-all placeholder-gray-600 font-light" 
              />
              <button type="submit" className="bg-white/10 border border-l-0 border-white/10 text-brand-gold px-5 py-3 rounded-r-lg hover:bg-brand-gold hover:text-black transition-all duration-300">
                ›
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-16 border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-light">
          <p>&copy; {new Date().getFullYear()} Heein Fragrâncias. Luxo Redefinido.</p>
          <button onClick={onAdminLoginClick} className="mt-4 md:mt-0 opacity-50 hover:opacity-100 hover:text-brand-gold transition-opacity">
            Acesso Restrito
          </button>
        </div>
      </div>
    </footer>
  );
};
