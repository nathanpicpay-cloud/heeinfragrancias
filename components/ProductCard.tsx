
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
      className="group relative cursor-pointer overflow-hidden rounded-lg bg-black/40 backdrop-blur-sm border border-transparent transition-all duration-300 hover:border-brand-gold/50 hover:shadow-gold-glow"
      onClick={() => onViewProduct(product)}
    >
      <div className="aspect-w-1 aspect-h-1 w-full">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent h-28 flex flex-col justify-end">
        {/* Info visible by default */}
        <div className="transition-all duration-300 ease-out group-hover:opacity-0 group-hover:-translate-y-4">
          <div className="flex items-baseline space-x-2">
            <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
            <p className="text-sm text-gray-400 truncate">{product.brand}</p>
          </div>
          <p className="mt-1 text-xl font-bold text-brand-gold text-left">
            R$ {product.price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        
        {/* Button appears on hover */}
        <div className="absolute bottom-4 left-4 right-4 transition-all duration-300 ease-out opacity-0 group-hover:opacity-100">
             <button 
                onClick={handleAddToCartClick}
                className="w-full bg-brand-gold text-black font-bold py-2 rounded-md"
            >
                Adicionar ao Carrinho
            </button>
        </div>
      </div>
    </div>
  );
};
