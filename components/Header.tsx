
import React, { useState, useEffect } from 'react';
import type { Page, User, SiteSettings } from '../types';
import { NAV_LINKS } from '../constants';

interface HeaderProps {
  cartItemCount: number;
  onNavigate: (page: Page, param?: string) => void;
  currentUser: User | null;
  onProfileClick: () => void;
  onLogout: () => void;
  cartIconRef: React.RefObject<HTMLButtonElement>;
  siteSettings: SiteSettings;
}

const ShoppingBagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ cartItemCount, onNavigate, currentUser, onProfileClick, onLogout, cartIconRef, siteSettings }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 border-b ${
        scrolled 
          ? 'bg-black/60 backdrop-blur-xl border-white/5 py-2' 
          : 'bg-transparent border-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer flex items-center group" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt="Heein Fragrâncias Logo" className="h-10 w-auto transition-transform duration-300 group-hover:scale-105" />
            ) : (
              <span className="text-2xl font-light tracking-[0.2em] text-white">
                HE<span className="text-transparent bg-clip-text bg-gold-gradient font-bold">EIN</span>
              </span>
            )}
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex md:space-x-12">
            {NAV_LINKS.map(link => (
              <a
                key={link.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.page as Page, link.param);
                }}
                className="text-gray-300 hover:text-brand-gold-light transition-colors duration-300 text-sm font-light tracking-widest uppercase relative group"
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-brand-gold group-hover:w-full transition-all duration-500 ease-out"></span>
              </a>
            ))}
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-6">
             <button 
                ref={cartIconRef}
                onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}
                className="relative text-white hover:text-brand-gold-light transition-all duration-300 hover:scale-110"
              >
                <ShoppingBagIcon />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold-gradient text-[10px] font-bold text-black shadow-gold-glow animate-pulse">
                      {cartItemCount}
                    </span>
                )}
            </button>
            <div className="relative">
              <button 
                onClick={currentUser ? () => setProfileDropdownOpen(!isProfileDropdownOpen) : () => { onProfileClick(); setMobileMenuOpen(false); }}
                className="text-white hover:text-brand-gold-light transition-all duration-300 hover:scale-110"
              >
                  <UserIcon />
              </button>
              {currentUser && (
                <div 
                  className={`absolute right-0 mt-4 w-56 glass-panel rounded-xl shadow-glass py-2 z-50 origin-top-right transition-all duration-300 ease-out
                    ${isProfileDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`
                  }
                >
                  <div className="px-5 py-3 border-b border-white/5">
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-gray-400 truncate">{currentUser.email}</p>
                  </div>
                  {currentUser.role === 'admin' && (
                     <a href="#" onClick={(e) => {
                      e.preventDefault();
                      onNavigate('admin');
                      setProfileDropdownOpen(false);
                    }} className="block px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-brand-gold transition-colors">
                      Painel Admin
                    </a>
                  )}
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                    setProfileDropdownOpen(false);
                  }} className="block px-5 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-brand-gold transition-colors">
                    Sair
                  </a>
                </div>
              )}
            </div>

            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-brand-gold transition-colors duration-300"
                aria-label="Abrir menu"
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isMobileMenuOpen ? 'max-h-96 opacity-100 py-6' : 'max-h-0 opacity-0'}`}>
            <nav className="flex flex-col items-center space-y-6">
                {NAV_LINKS.map(link => (
                <a
                    key={link.name}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.page as Page, link.param);
                        setMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-brand-gold transition-colors duration-300 font-light tracking-widest uppercase text-sm"
                >
                    {link.name}
                </a>
                ))}
            </nav>
        </div>

      </div>
    </header>
  );
};
