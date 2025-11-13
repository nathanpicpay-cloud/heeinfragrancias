
import React, { useState, useEffect } from 'react';
import type { Brand, Collection } from '../types';

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  categoryType: 'brand' | 'collection' | null;
  editingCategory: Brand | Collection | null;
}

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const CategoryFormModal: React.FC<CategoryFormModalProps> = ({ isOpen, onClose, onSave, categoryType, editingCategory }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const isBrand = categoryType === 'brand';
  const isEditing = !!editingCategory;

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      if ('description' in editingCategory) {
        setDescription(editingCategory.description);
      }
    } else {
      setName('');
      setDescription('');
    }
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let data: any = { name };
    if (isEditing) {
      data.id = editingCategory!.id;
    }
    if (!isBrand) {
      data.description = description;
    }
    onSave(data);
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-brand-dark border border-brand-gold/30 rounded-lg shadow-gold-glow-lg w-full max-w-lg p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-brand-gold">
          <CloseIcon />
        </button>
        
        <h2 className="text-3xl font-bold text-center text-brand-gold mb-6">
          {isEditing ? 'Editar' : 'Nova'} {isBrand ? 'Marca' : 'Coleção'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">Nome</label>
            <input 
              id="name" 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="mt-1 block w-full bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
            />
          </div>
          {!isBrand && (
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-300">Descrição</label>
              <textarea 
                id="description" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                required 
                rows={3} 
                className="mt-1 block w-full bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold" 
              />
            </div>
          )}
          <div className="pt-4 flex justify-end">
            <button type="button" onClick={onClose} className="bg-gray-700 text-white font-bold py-2 px-6 rounded-md hover:bg-gray-600 transition-colors mr-3 active:scale-95">Cancelar</button>
            <button type="submit" className="bg-brand-gold text-black font-bold py-2 px-6 rounded-md hover:bg-yellow-400 transition-colors shadow-gold-glow active:scale-95">Salvar</button>
          </div>
        </form>
      </div>
    </div>
  );
};