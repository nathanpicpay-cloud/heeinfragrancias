
import React, { useState, useEffect } from 'react';
import type { Product, Brand, Collection } from '../types';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: any) => void;
  product: Product | null;
  brands: Brand[];
  collections: Collection[];
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const ProductFormModal: React.FC<ProductFormModalProps> = ({ isOpen, onClose, onSave, product, brands, collections }) => {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    gender: 'Unissex',
    category: '',
    price: 0,
    notes: '',
    image: '',
    description: '',
    collection: '',
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        brand: product.brand,
        gender: product.gender,
        category: product.category,
        price: product.price,
        notes: product.notes.join(', '),
        image: product.image,
        description: product.description,
        collection: product.collection || '',
      });
    } else {
      setFormData({
        name: '', brand: '', gender: 'Unissex', category: '', price: 0, notes: '', image: '', description: '', collection: '',
      });
    }
  }, [product, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'price' ? parseFloat(value) || 0 : value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      alert('Por favor, adicione uma imagem para o produto.');
      return;
    }
    const productData = {
      ...formData,
      notes: formData.notes.split(',').map(note => note.trim()),
      collection: formData.collection || undefined, // Garante que seja undefined se vazio
    };
    if (product) {
      onSave({ ...product, ...productData });
    } else {
      onSave(productData);
    }
  };

  if (!isOpen) return null;
  
  const defaultSelectClass = "mt-1 block w-full bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold";

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-opacity duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-brand-dark border border-brand-gold/30 rounded-lg shadow-gold-glow-lg w-full max-w-2xl p-8 relative transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: 'fade-in-scale 0.3s forwards' }}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-brand-gold">
          <CloseIcon />
        </button>
        
        <h2 className="text-3xl font-bold text-center text-brand-gold mb-6">
          {product ? 'Editar Perfume' : 'Adicionar Novo Perfume'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={defaultSelectClass} />
            </div>
            <div>
              <label htmlFor="brand" className="block text-sm font-medium text-gray-300">Marca</label>
              <select id="brand" name="brand" value={formData.brand} onChange={handleChange} required className={defaultSelectClass}>
                <option value="" disabled>Selecione uma marca</option>
                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-300">Categoria</label>
              <input id="category" name="category" type="text" value={formData.category} onChange={handleChange} required className={defaultSelectClass} />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300">Preço</label>
              <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className={defaultSelectClass} />
            </div>
            <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-300">Gênero</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className={defaultSelectClass}>
                    <option value="Unissex">Unissex</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
            </div>
             <div>
              <label htmlFor="collection" className="block text-sm font-medium text-gray-300">Coleção</label>
              <select id="collection" name="collection" value={formData.collection} onChange={handleChange} className={defaultSelectClass}>
                <option value="">Nenhuma</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
           <div>
            <label className="block text-sm font-medium text-gray-300">Imagem do Produto</label>
            <div className="mt-2 flex items-center space-x-4">
              {formData.image && (
                <img src={formData.image} alt="Pré-visualização" className="h-24 w-24 rounded-md object-cover border-2 border-brand-gold/50" />
              )}
              <label htmlFor="image-upload" className="cursor-pointer bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                {formData.image ? 'Alterar Imagem' : 'Selecionar Imagem'}
              </label>
              <input 
                id="image-upload" 
                name="image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="hidden" 
              />
            </div>
          </div>
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300">Notas (separadas por vírgula)</label>
            <input id="notes" name="notes" type="text" value={formData.notes} onChange={handleChange} required className={defaultSelectClass} />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descrição</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={4} className={defaultSelectClass} />
          </div>

          <div className="pt-4 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors mr-3 active:scale-95">Cancelar</button>
            <button type="submit" className="bg-brand-gold text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-all duration-300 shadow-gold-glow active:scale-95">Salvar</button>
          </div>
        </form>
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
