
import React from 'react';

interface FooterProps {
  onAdminLoginClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onAdminLoginClick }) => {
  return (
    <footer className="bg-black border-t border-brand-gold/20 mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold text-brand-gold mb-4">Heein Fragrâncias</h3>
            <p className="text-gray-400">Essências dos melhores perfumes do mundo.</p>
          </div>
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Links</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Sobre Nós</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Contato</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Ajuda</h4>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">FAQ</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Rastreio</a></li>
              <li><a href="#" className="text-gray-400 hover:text-brand-gold transition-colors">Trocas e Devoluções</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white tracking-wider uppercase mb-4">Newsletter</h4>
            <p className="text-gray-400 mb-2">Receba ofertas exclusivas.</p>
            <form className="flex">
              <input type="email" placeholder="Seu e-mail" className="w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-gold" />
              <button type="submit" className="bg-brand-gold text-black font-bold px-4 py-2 rounded-r-md hover:bg-yellow-400 transition-colors">
                ›
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-800 pt-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Heein Fragrâncias. Todos os direitos reservados.</p>
          <button onClick={onAdminLoginClick} className="text-xs text-gray-600 hover:text-brand-gold mt-2 transition-colors">
            Acesso Admin
          </button>
        </div>
      </div>
    </footer>
  );
};