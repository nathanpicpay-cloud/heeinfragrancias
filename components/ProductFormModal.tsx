
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
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
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
      collection: formData.collection || undefined,
    };
    if (product) {
      onSave({ ...product, ...productData });
    } else {
      onSave(productData);
    }
  };

  if (!isOpen) return null;
  
  const inputClass = "w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all font-light text-sm";
  const labelClass = "block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2";

  return (
    <div 
      className="fixed inset-0 bg-black/90 backdrop-blur-md z-[60] flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="glass-panel w-full max-w-2xl p-8 rounded-3xl relative animate-[fade-in-up_0.3s_forwards] max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-gray-400 hover:text-brand-gold transition-colors">
          <CloseIcon />
        </button>
        
        <h2 className="text-2xl font-light text-white mb-8 tracking-wide border-b border-white/10 pb-4">
          {product ? 'Editar Perfume' : 'Adicionar Novo'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label htmlFor="name" className={labelClass}>Nome</label>
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="brand" className={labelClass}>Marca</label>
              <select id="brand" name="brand" value={formData.brand} onChange={handleChange} required className={inputClass}>
                <option value="" disabled>Selecione uma marca</option>
                {brands.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="category" className={labelClass}>Categoria</label>
              <input id="category" name="category" type="text" value={formData.category} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
              <label htmlFor="price" className={labelClass}>Preço</label>
              <input id="price" name="price" type="number" step="0.01" value={formData.price} onChange={handleChange} required className={inputClass} />
            </div>
            <div>
                <label htmlFor="gender" className={labelClass}>Gênero</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required className={inputClass}>
                    <option value="Unissex">Unissex</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                </select>
            </div>
             <div>
              <label htmlFor="collection" className={labelClass}>Coleção</label>
              <select id="collection" name="collection" value={formData.collection} onChange={handleChange} className={inputClass}>
                <option value="">Nenhuma</option>
                {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
           <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <label className={labelClass}>Imagem do Produto</label>
            <div className="mt-3 flex items-center space-x-4">
              {formData.image && (
                <img src={formData.image} alt="Preview" className="h-20 w-20 rounded-lg object-cover border border-white/20" />
              )}
              <label htmlFor="image-upload" className="cursor-pointer bg-white/10 text-brand-gold font-bold py-2 px-4 rounded-lg hover:bg-brand-gold hover:text-black transition-colors text-sm uppercase tracking-wide">
                {formData.image ? 'Alterar' : 'Upload'}
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
            <label htmlFor="notes" className={labelClass}>Notas (separadas por vírgula)</label>
            <input id="notes" name="notes" type="text" value={formData.notes} onChange={handleChange} required className={inputClass} />
          </div>
          <div>
            <label htmlFor="description" className={labelClass}>Descrição</label>
            <textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={3} className={inputClass} />
          </div>

          <div className="pt-6 flex justify-end gap-3 border-t border-white/10 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-3 rounded-lg text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">Cancelar</button>
            <button type="submit" className="bg-brand-gold text-black font-bold py-3 px-8 rounded-lg hover:bg-brand-gold-light transition-all shadow-gold-glow active:scale-95">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};
