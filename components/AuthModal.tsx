
import React, { useState } from 'react';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSwitchView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (!isLoginView && !name)) {
      setError('Por favor, preencha todos os campos.');
      return;
    }
    setError('');

    // --- Mock Authentication Logic ---
    if (isLoginView) {
      if (email === 'admin@heein.com' && password === 'adminlucas') {
        onAuthSuccess({ id: 1, name: 'Admin Heein', email, role: 'admin' });
      } else {
        onAuthSuccess({ id: Date.now(), name: 'Usuário', email, role: 'user' });
      }
    } else {
      onAuthSuccess({ id: Date.now(), name, email, role: 'user' });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 transition-opacity duration-500"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-md p-10 rounded-3xl relative transform transition-all duration-500 scale-95 opacity-0 animate-[fade-in-up_0.4s_forwards]"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-brand-gold transition-colors">
          <CloseIcon />
        </button>
        
        <h2 className="text-3xl font-light text-center text-white mb-8 tracking-wide">
          {isLoginView ? 'Bem-vindo' : 'Criar Conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Nome</label>
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-light" 
                placeholder="Seu nome"
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
               className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-light" 
               placeholder="seu@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-light" 
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded border border-red-500/20">{error}</p>}

          <div>
            <button type="submit" className="w-full bg-brand-gold text-black font-bold py-4 rounded-lg hover:bg-brand-gold-light transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95">
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-8 font-light">
          {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={handleSwitchView} className="font-medium text-brand-gold hover:text-white ml-2 underline decoration-brand-gold/30 hover:decoration-white transition-all">
            {isLoginView ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
    </div>
  );
};
