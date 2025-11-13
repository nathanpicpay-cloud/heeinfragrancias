
import React, { useState, useEffect } from 'react';
import type { Product, Brand, Collection, SiteSettings } from '../types';
import { ProductFormModal } from './ProductFormModal';
import { CategoryFormModal } from './CategoryFormModal';

interface AdminPanelProps {
    products: Product[];
    brands: Brand[];
    collections: Collection[];
    siteSettings: SiteSettings;
    onUpdateSiteSettings: (settings: SiteSettings) => void;
    onCreateProduct: (productData: Omit<Product, 'id' | 'slug' | 'rating'>) => void;
    onUpdateProduct: (product: Product) => void;
    onDeleteProduct: (productId: number) => void;
    onCreateBrand: (data: Omit<Brand, 'id'>) => void;
    onUpdateBrand: (data: Brand) => void;
    onDeleteBrand: (id: number) => void;
    onCreateCollection: (data: Omit<Collection, 'id'>) => void;
    onUpdateCollection: (data: Collection) => void;
    onDeleteCollection: (id: string) => void;
    onUpdateAllPrices: (newPrice: number) => void;
}

const ImageUploader: React.FC<{ label: string; currentImage: string; onImageChange: (base64: string) => void; }> = ({ label, currentImage, onImageChange }) => {
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h3 className="text-xl font-bold text-white tracking-wide mb-2">{label}</h3>
            <div className="flex items-center space-x-4">
                {currentImage && (
                    <img src={currentImage} alt={`${label} Preview`} className="h-20 w-auto rounded-md object-contain bg-gray-700 border-2 border-brand-gold/50 p-1" />
                )}
                <label className="cursor-pointer bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm active:scale-95">
                    Alterar Imagem
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
            </div>
        </div>
    );
};


export const AdminPanel: React.FC<AdminPanelProps> = ({ 
    products, brands, collections, siteSettings, onUpdateSiteSettings,
    onCreateProduct, onUpdateProduct, onDeleteProduct,
    onCreateBrand, onUpdateBrand, onDeleteBrand,
    onCreateCollection, onUpdateCollection, onDeleteCollection,
    onUpdateAllPrices
}) => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Brand | Collection | null>(null);
    const [categoryType, setCategoryType] = useState<'brand' | 'collection' | null>(null);

    const [currentSettings, setCurrentSettings] = useState<SiteSettings>(siteSettings);
    const [bulkPrice, setBulkPrice] = useState('');

    useEffect(() => {
        setCurrentSettings(siteSettings);
    }, [siteSettings]);

    const handleSettingsChange = (field: keyof SiteSettings, value: string) => {
        setCurrentSettings(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveSettings = () => {
        onUpdateSiteSettings(currentSettings);
        alert('Configurações salvas!');
    };


    const handleOpenCreateProductModal = () => {
        setEditingProduct(null);
        setIsProductModalOpen(true);
    };

    const handleOpenEditProductModal = (product: Product) => {
        setEditingProduct(product);
        setIsProductModalOpen(true);
    };
    
    const handleSaveProduct = (productData: Product | Omit<Product, 'id' | 'slug' | 'rating'>) => {
        if ('id' in productData) {
            onUpdateProduct(productData as Product);
        } else {
            onCreateProduct(productData);
        }
        setIsProductModalOpen(false);
    };

    const handleDeleteProductClick = (productId: number) => {
        if (window.confirm('Tem certeza de que deseja excluir este produto? Isso não pode ser desfeito.')) {
            onDeleteProduct(productId);
        }
    };

    const handleOpenCreateCategoryModal = (type: 'brand' | 'collection') => {
        setCategoryType(type);
        setEditingCategory(null);
        setIsCategoryModalOpen(true);
    };

    const handleOpenEditCategoryModal = (type: 'brand' | 'collection', item: Brand | Collection) => {
        setCategoryType(type);
        setEditingCategory(item);
        setIsCategoryModalOpen(true);
    };

    const handleSaveCategory = (data: any) => {
        if (categoryType === 'brand') {
            if (data.id) onUpdateBrand(data); else onCreateBrand(data);
        } else if (categoryType === 'collection') {
            if (data.id) onUpdateCollection(data); else onCreateCollection(data);
        }
        setIsCategoryModalOpen(false);
    };

    const handleDeleteBrandClick = (brandId: number) => {
        if (window.confirm('Tem certeza? Excluir uma marca não removerá os produtos associados, mas eles ficarão sem marca.')) {
            onDeleteBrand(brandId);
        }
    };

    const handleDeleteCollectionClick = (collectionId: string) => {
        if (window.confirm('Tem certeza? Excluir uma coleção não removerá os produtos associados.')) {
            onDeleteCollection(collectionId);
        }
    };
    
    const handleBulkPriceUpdate = () => {
        // Handle both comma and dot as decimal separators
        const formattedPrice = bulkPrice.replace(',', '.');
        const newPrice = parseFloat(formattedPrice);

        if (isNaN(newPrice) || newPrice <= 0) {
            alert('Por favor, insira um preço válido.');
            return;
        }
        if (window.confirm(`Tem certeza de que deseja definir o preço de TODOS os perfumes para R$ ${newPrice.toFixed(2).replace('.', ',')}? Esta ação não pode ser desfeita.`)) {
            onUpdateAllPrices(newPrice);
            setBulkPrice('');
            alert('Preços atualizados com sucesso!');
        }
    };

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-brand-gold tracking-wide mb-10 text-center">Painel do Administrador</h1>
            
             {/* Site Settings Section */}
            <section className="mb-12">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">Configurações do Site</h2>
                    <button onClick={handleSaveSettings} className="bg-brand-gold text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors shadow-gold-glow text-sm active:scale-95">
                        Salvar Configurações
                    </button>
                </div>
                 <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-6 space-y-6">
                    <ImageUploader label="Logotipo do Site" currentImage={currentSettings.logo} onImageChange={(base64) => handleSettingsChange('logo', base64)} />
                    <ImageUploader label="Imagem Principal (Home)" currentImage={currentSettings.heroImage} onImageChange={(base64) => handleSettingsChange('heroImage', base64)} />
                </div>
            </section>

            {/* Products Section */}
            <section>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white tracking-wide">Gerenciar Perfumes</h2>
                    <button
                        onClick={handleOpenCreateProductModal}
                        className="bg-brand-gold text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-400 transition-colors shadow-gold-glow text-sm active:scale-95"
                    >
                        Adicionar Perfume
                    </button>
                </div>
                 <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-semibold text-white mb-2">Atualização de Preços em Massa</h3>
                    <div className="flex items-center space-x-2">
                        <input 
                            type="text" 
                            inputMode="decimal"
                            value={bulkPrice}
                            onChange={(e) => setBulkPrice(e.target.value)}
                            placeholder="Novo preço"
                            className="bg-gray-800 border-gray-700 text-white px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-gold w-32" 
                        />
                        <button 
                            onClick={handleBulkPriceUpdate}
                            className="bg-brand-gold/80 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-500 transition-colors text-sm active:scale-95"
                        >
                            Atualizar Todos
                        </button>
                    </div>
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                    {/* Products Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-800">
                            {/* ... table head ... */}
                             <thead className="bg-gray-900">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Produto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Marca</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Preço</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Ações</span>
                                </th>
                            </tr>
                        </thead>
                            <tbody className="bg-brand-dark divide-y divide-gray-800">
                                {products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-900 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div className="flex-shrink-0 h-10 w-10">
                                                    <img className="h-10 w-10 rounded-md object-cover" src={product.image} alt={product.name} />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-medium text-white">{product.name}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{product.brand}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-brand-gold font-semibold">R$ {product.price.toFixed(2).replace('.', ',')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => handleOpenEditProductModal(product)} className="text-brand-gold hover:text-yellow-300">Editar</button>
                                            <button onClick={() => handleDeleteProductClick(product.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            <div className="grid md:grid-cols-2 gap-x-12 mt-12">
                 {/* Brands Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Marcas</h2>
                        <button onClick={() => handleOpenCreateCategoryModal('brand')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm active:scale-95">
                            Nova Marca
                        </button>
                    </div>
                    <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-800">
                             <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-brand-dark divide-y divide-gray-800">
                                {brands.map(brand => (
                                    <tr key={brand.id} className="hover:bg-gray-900 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{brand.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => handleOpenEditCategoryModal('brand', brand)} className="text-brand-gold hover:text-yellow-300">Editar</button>
                                            <button onClick={() => handleDeleteBrandClick(brand.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Collections Section */}
                <section>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white tracking-wide">Coleções</h2>
                         <button onClick={() => handleOpenCreateCategoryModal('collection')} className="bg-gray-700 text-white font-bold py-2 px-4 rounded-md hover:bg-gray-600 transition-colors text-sm active:scale-95">
                            Nova Coleção
                        </button>
                    </div>
                     <div className="bg-gray-900/50 border border-gray-800 rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-800">
                             <thead className="bg-gray-900">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nome</th>
                                    <th className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-brand-dark divide-y divide-gray-800">
                                {collections.map(collection => (
                                    <tr key={collection.id} className="hover:bg-gray-900 transition-colors duration-200">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{collection.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                                            <button onClick={() => handleOpenEditCategoryModal('collection', collection)} className="text-brand-gold hover:text-yellow-300">Editar</button>
                                            <button onClick={() => handleDeleteCollectionClick(collection.id)} className="text-red-500 hover:text-red-400">Excluir</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>


            <ProductFormModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                onSave={handleSaveProduct}
                product={editingProduct}
                brands={brands}
                collections={collections}
            />

            <CategoryFormModal
                isOpen={isCategoryModalOpen}
                onClose={() => setIsCategoryModalOpen(false)}
                onSave={handleSaveCategory}
                categoryType={categoryType}
                editingCategory={editingCategory}
            />
        </main>
    );
};
