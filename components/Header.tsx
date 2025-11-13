
import React, { useState } from 'react';
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
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
);

const UserIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
);

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
);

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);


export const Header: React.FC<HeaderProps> = ({ cartItemCount, onNavigate, currentUser, onProfileClick, onLogout, cartIconRef, siteSettings }) => {
  const [isProfileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-lg border-b border-brand-gold/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0 cursor-pointer h-10 flex items-center" onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}>
            {siteSettings.logo ? (
              <img src={siteSettings.logo} alt="Heein Fragrâncias Logo" className="h-full" />
            ) : (
              <span className="text-3xl font-bold tracking-wider text-brand-gold">HF</span>
            )}
          </div>
          <nav className="hidden md:flex md:space-x-8">
            {NAV_LINKS.map(link => (
              <a
                key={link.name}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(link.page as Page, link.param);
                }}
                className="text-white hover:text-brand-gold transition-colors duration-300 font-medium tracking-wide relative group"
              >
                {link.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-brand-gold group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </nav>
          <div className="flex items-center space-x-4">
             <button 
                ref={cartIconRef}
                onClick={() => { onNavigate('cart'); setMobileMenuOpen(false); }}
                className="relative text-white hover:text-brand-gold transition-colors duration-300"
              >
                <ShoppingBagIcon />
                {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold text-xs font-bold text-black">{cartItemCount}</span>
                )}
            </button>
            <div className="relative">
              <button 
                onClick={currentUser ? () => setProfileDropdownOpen(!isProfileDropdownOpen) : () => { onProfileClick(); setMobileMenuOpen(false); }}
                className="text-white hover:text-brand-gold transition-colors duration-300"
              >
                  <UserIcon />
              </button>
              {currentUser && (
                <div 
                  className={`absolute right-0 mt-2 w-48 bg-brand-dark border border-brand-gold/50 rounded-md shadow-lg py-1 z-50 origin-top-right transition-all duration-200 ease-out
                    ${isProfileDropdownOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`
                  }
                >
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-brand-gold/20">
                    <p className="font-semibold">{currentUser.name}</p>
                    <p className="text-xs truncate">{currentUser.email}</p>
                  </div>
                  {currentUser.role === 'admin' && (
                     <a href="#" onClick={(e) => {
                      e.preventDefault();
                      onNavigate('admin');
                      setProfileDropdownOpen(false);
                    }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors">
                      Painel Admin
                    </a>
                  )}
                  <a href="#" onClick={(e) => {
                    e.preventDefault();
                    onLogout();
                    setProfileDropdownOpen(false);
                  }} className="block px-4 py-2 text-sm text-gray-300 hover:bg-brand-gold/10 hover:text-brand-gold transition-colors">
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

        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen py-4 border-t border-brand-gold/20' : 'max-h-0'}`}>
            <nav className="flex flex-col items-center space-y-4">
                {NAV_LINKS.map(link => (
                <a
                    key={link.name}
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavigate(link.page as Page, link.param);
                        setMobileMenuOpen(false);
                    }}
                    className="text-white hover:text-brand-gold transition-colors duration-300 font-medium tracking-wide text-lg"
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
