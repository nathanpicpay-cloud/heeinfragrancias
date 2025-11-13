
import React, { useState } from 'react';
import type { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: User) => void;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
        // Simulate successful login for any other user
        onAuthSuccess({ id: Date.now(), name: 'Usuário', email, role: 'user' });
      }
    } else {
      // Simulate successful signup
      onAuthSuccess({ id: Date.now(), name, email, role: 'user' });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-brand-dark border border-brand-gold/30 rounded-lg shadow-gold-glow-lg w-full max-w-md p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s forwards' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-brand-gold">
          <CloseIcon />
        </button>
        
        <h2 className="text-3xl font-bold text-center text-brand-gold mb-6">
          {isLoginView ? 'Login' : 'Criar Conta'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLoginView && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
              <input 
                id="name" 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
              />
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email</label>
            <input 
              id="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">Senha</label>
            <input 
              id="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full bg-gray-800 border border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div>
            <button type="submit" className="w-full bg-brand-gold text-black font-bold py-3 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-gold-glow active:scale-95">
              {isLoginView ? 'Entrar' : 'Cadastrar'}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          {isLoginView ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button onClick={handleSwitchView} className="font-medium text-brand-gold hover:underline ml-1">
            {isLoginView ? 'Cadastre-se' : 'Faça login'}
          </button>
        </p>
      </div>
      <style>{`
        @keyframes fade-in-scale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fade-in-scale 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};