
import React, { useRef } from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onViewProduct: (product: Product) => void;
  onAddToCart: (product: Product, imageElement: HTMLImageElement) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onViewProduct, onAddToCart }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (imageRef.current) {
      onAddToCart(product, imageRef.current);
    }
  };

  return (
    <div
      className="group relative cursor-pointer rounded-2xl transition-all duration-500 hover:-translate-y-2"
      onClick={() => onViewProduct(product)}
    >
        {/* Glow Effect behind card */}
        <div className="absolute -inset-0.5 bg-gradient-to-b from-brand-gold/20 to-transparent rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>

        {/* Glass Container */}
        <div className="relative h-full flex flex-col overflow-hidden rounded-2xl glass-panel hover:shadow-gold-glow-lg transition-all duration-500">
            {/* Image Container */}
            <div className="aspect-[4/5] overflow-hidden relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                <img
                ref={imageRef}
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                
                {/* Floating Category Badge */}
                <div className="absolute top-3 right-3 z-20">
                    <span className="px-3 py-1 text-[10px] uppercase tracking-wider text-white bg-black/40 backdrop-blur-md border border-white/10 rounded-full">
                        {product.category}
                    </span>
                </div>
            </div>
      
            {/* Content Info */}
            <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-transparent to-black/40">
                <div>
                    <p className="text-xs text-brand-gold/80 tracking-widest uppercase mb-1 font-medium">{product.brand}</p>
                    <h3 className="text-lg font-light text-white tracking-wide truncate group-hover:text-brand-gold-light transition-colors duration-300">
                        {product.name}
                    </h3>
                </div>
                
                <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-medium text-white tracking-tight">
                        R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                    
                    <button 
                        onClick={handleAddToCartClick}
                        className="opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300 p-3 rounded-full bg-white/10 hover:bg-brand-gold hover:text-black text-white backdrop-blur-md border border-white/10"
                        aria-label="Adicionar ao carrinho"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    </div>
  );
};
