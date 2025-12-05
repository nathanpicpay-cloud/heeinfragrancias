
import React, { useState, useEffect, useRef, ReactNode } from 'react';
import type { Page, Product, CartItem, User, Brand, Collection, SiteSettings, AppData } from './types';
import { PRODUCTS as PRODUCTS_DATA, BRANDS as BRANDS_DATA, COLLECTIONS as COLLECTIONS_DATA } from './constants';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { FlyingProductAnimator } from './components/FlyingProductAnimator';
import { WhatsAppButton } from './components/WhatsAppButton';

// --- Scroll Reveal Helper Component ---
const RevealOnScroll: React.FC<{ children: ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    const style = {
        transitionDelay: `${delay}ms`,
    };

    return (
        <div 
            ref={ref} 
            className={`transition-all duration-1000 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`}
            style={style}
        >
            {children}
        </div>
    );
};

type Filters = {
    brands: string[];
    genders: string[];
    categories: string[];
    maxPrice: number | null;
}

const HeroSection: React.FC<{ onNavigate: (page: Page, param?: string) => void; heroImage: string }> = ({ onNavigate, heroImage }) => (
    <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background with slow zoom animation */}
        <div 
            className="absolute inset-0 bg-cover bg-center animate-[shimmer_20s_infinite_alternate]" 
            style={{ 
                backgroundImage: `url('${heroImage}')`,
                animation: 'scale-up-center 30s ease-in-out infinite alternate',
                transformOrigin: 'center center'
            }} 
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-[#050505]"></div>
        
        <div className="relative z-10 px-6 max-w-5xl mx-auto text-center">
            <RevealOnScroll>
                <h2 className="text-brand-gold-light text-sm md:text-base font-medium tracking-[0.3em] uppercase mb-4 opacity-90">
                    Alta Perfumaria
                </h2>
            </RevealOnScroll>
            <RevealOnScroll delay={200}>
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white tracking-wide leading-tight mb-8 drop-shadow-lg">
                    A Essência do <br />
                    <span className="font-semibold text-transparent bg-clip-text bg-gold-gradient italic">Absoluto</span>
                </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={400}>
                <p className="text-lg md:text-xl text-gray-200 font-light max-w-2xl mx-auto mb-12 opacity-80 leading-relaxed">
                    Descubra fragrâncias que transcendem o tempo. Uma coleção curada das essências mais raras e exclusivas do mundo.
                </p>
            </RevealOnScroll>
            <RevealOnScroll delay={600}>
                <button
                    onClick={() => onNavigate('products')}
                    className="group relative px-10 py-4 bg-transparent overflow-hidden rounded-full border border-brand-gold/50 hover:border-brand-gold transition-colors duration-300"
                >
                    <div className="absolute inset-0 w-0 bg-brand-gold transition-all duration-[250ms] ease-out group-hover:w-full opacity-10"></div>
                    <span className="relative text-brand-gold group-hover:text-white font-medium tracking-widest uppercase text-sm">Explorar Coleção</span>
                </button>
            </RevealOnScroll>
        </div>
        <style>{`
            @keyframes scale-up-center {
                0% { transform: scale(1); }
                100% { transform: scale(1.1); }
            }
        `}</style>
    </div>
);

const HomePage: React.FC<{ products: Product[]; onViewProduct: (product: Product) => void; onAddToCart: (product: Product, imageElement: HTMLImageElement) => void; onNavigate: (page: Page, param?: string) => void; siteSettings: SiteSettings; }> = ({ products, onViewProduct, onAddToCart, onNavigate, siteSettings }) => {
    const bestSellerSlugs = ['silver-scent', 'one-million', 'good-girl', 'la-vie-est-belle', 'invictus', 'sauvage-dior', 'olympea', '212-vip-rose'];
    
    const bestSellers = products
        .filter(p => bestSellerSlugs.includes(p.slug))
        .sort((a, b) => bestSellerSlugs.indexOf(a.slug) - bestSellerSlugs.indexOf(b.slug));
        
    return (
        <>
            <HeroSection onNavigate={onNavigate} heroImage={siteSettings.heroImage} />
            <main className="container mx-auto px-6 lg:px-12 py-24">
                <section>
                    <RevealOnScroll>
                        <div className="flex flex-col items-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-light text-white tracking-[0.1em] text-center">
                                Mais <span className="font-semibold text-transparent bg-clip-text bg-gold-gradient">Desejados</span>
                            </h2>
                            <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-brand-gold to-transparent mt-6"></div>
                        </div>
                    </RevealOnScroll>
                    
                    <div className="relative w-full overflow-hidden group">
                        <div className="flex w-max space-x-8 animate-scroll-x pause-animation py-10">
                            {/* Duplicate content for seamless loop */}
                            {bestSellers.map((product) => (
                                <div key={product.id} className="flex-shrink-0 w-72">
                                    <ProductCard product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
                                </div>
                            ))}
                            {bestSellers.map((product) => (
                                <div key={`${product.id}-clone`} className="flex-shrink-0 w-72">
                                    <ProductCard product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
                                </div>
                            ))}
                        </div>
                         <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#050505] to-transparent pointer-events-none z-10"></div>
                         <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#050505] to-transparent pointer-events-none z-10"></div>
                    </div>
                </section>
                
                {/* Feature Section */}
                <section className="mt-32">
                    <RevealOnScroll>
                        <div className="glass-panel rounded-3xl p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-brand-gold/10 rounded-full blur-[100px]"></div>
                            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]"></div>
                            
                            <div className="grid md:grid-cols-2 gap-12 items-center relative z-10">
                                <div>
                                    <h3 className="text-3xl font-light text-white mb-6">Coleção <span className="italic font-serif text-brand-gold">Árabe</span> Exclusiva</h3>
                                    <p className="text-gray-400 font-light leading-relaxed mb-8">
                                        Mergulhe na opulência do Oriente. Notas de Oud, Especiarias raras e Âmbar que contam histórias milenares. Uma seleção para quem busca o extraordinário.
                                    </p>
                                    <button 
                                        onClick={() => onNavigate('collection', 'colecao_arabe')}
                                        className="text-white border-b border-brand-gold pb-1 hover:text-brand-gold transition-colors duration-300 tracking-widest text-sm uppercase"
                                    >
                                        Descobrir Coleção
                                    </button>
                                </div>
                                <div className="rounded-2xl overflow-hidden h-80 relative shadow-2xl">
                                    <img src="https://i.imgur.com/WDpriz2.jpeg" alt="Coleção Árabe" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" />
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </section>
            </main>
        </>
    );
};

const CollectionPage: React.FC<{
    products: Product[];
    collections: Collection[];
    collectionId: string | undefined;
    onViewProduct: (product: Product) => void;
    onAddToCart: (product: Product, imageElement: HTMLImageElement) => void;
}> = ({ products, collections, collectionId, onViewProduct, onAddToCart }) => {
    if (!collectionId) return <div className="min-h-screen flex items-center justify-center text-gray-400">Coleção não encontrada.</div>;
    
    const collectionProducts = products.filter(p => p.collection === collectionId);
    const details = collections.find(c => c.id === collectionId);
    
    if (!details) return <div className="min-h-screen flex items-center justify-center text-gray-400">Detalhes não encontrados.</div>;

    return (
         <main className="container mx-auto px-6 lg:px-12 py-24 min-h-screen">
            <RevealOnScroll>
                <div className="text-center mb-20">
                    <span className="text-brand-gold text-xs font-bold tracking-[0.3em] uppercase block mb-4">Coleção Exclusiva</span>
                    <h1 className="text-4xl md:text-5xl font-light text-white tracking-wide mb-6">{details.name}</h1>
                    <p className="text-lg text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">{details.description}</p>
                </div>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {collectionProducts.map((product, index) => (
                    <RevealOnScroll key={product.id} delay={index * 50}>
                        <ProductCard product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
                    </RevealOnScroll>
                ))}
            </div>
        </main>
    );
};

const FilterSidebar: React.FC<{
    brands: Brand[];
    products: Product[];
    filters: Filters;
    onFilterChange: (newFilters: Filters) => void;
}> = ({ brands, products, filters, onFilterChange }) => {
    
    const allCategories = [...new Set(products.map(p => p.category))].sort();
    const allGenders = [...new Set(products.map(p => p.gender))].sort();
    
    const handleCheckboxChange = (type: keyof Omit<Filters, 'maxPrice'>, value: string) => {
        const currentValues = filters[type];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        onFilterChange({ ...filters, [type]: newValues });
    };

    const clearFilters = () => {
        onFilterChange({ brands: [], genders: [], categories: [], maxPrice: null });
    }

    const hasActiveFilters = filters.brands.length > 0 || filters.genders.length > 0 || filters.categories.length > 0;

    const FilterSection: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
        <div className="py-6 border-b border-white/5 last:border-0">
            <h3 className="font-medium text-white/90 mb-4 tracking-wide text-sm uppercase">{title}</h3>
            <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">{children}</div>
        </div>
    );

    const Checkbox: React.FC<{label: string; checked: boolean; onChange: () => void}> = ({label, checked, onChange}) => (
         <label className="flex items-center space-x-3 text-gray-400 hover:text-brand-gold cursor-pointer group transition-colors">
            <div className={`w-4 h-4 border border-gray-600 rounded flex items-center justify-center transition-all ${checked ? 'bg-brand-gold border-brand-gold' : 'group-hover:border-brand-gold'}`}>
                {checked && <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
            </div>
            <span className="font-light text-sm">{label}</span>
        </label>
    );

    return (
        <aside className="w-full md:w-72 lg:w-80 flex-shrink-0">
            <div className="sticky top-28 glass-panel rounded-2xl p-6">
                <div className="flex justify-between items-center mb-6 border-b border-white/10 pb-4">
                    <h2 className="text-lg font-light text-white tracking-widest uppercase">Filtros</h2>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-xs text-brand-gold hover:text-white transition-colors underline decoration-brand-gold/50">Limpar</button>
                    )}
                </div>
                <div className="">
                    <FilterSection title="Gênero">
                        {allGenders.map(gender => <Checkbox key={gender} label={gender} checked={filters.genders.includes(gender)} onChange={() => handleCheckboxChange('genders', gender)} />)}
                    </FilterSection>
                    <FilterSection title="Estilo Olfativo">
                         {allCategories.map(category => <Checkbox key={category} label={category} checked={filters.categories.includes(category)} onChange={() => handleCheckboxChange('categories', category)} />)}
                    </FilterSection>
                    <FilterSection title="Marca">
                        {brands.map(brand => <Checkbox key={brand.id} label={brand.name} checked={filters.brands.includes(brand.name)} onChange={() => handleCheckboxChange('brands', brand.name)} />)}
                    </FilterSection>
                </div>
            </div>
        </aside>
    );
};

const ProductListPage: React.FC<{ 
    products: Product[]; 
    brands: Brand[];
    onViewProduct: (product: Product) => void; 
    onAddToCart: (product: Product, imageElement: HTMLImageElement) => void; 
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filters: Filters;
    setFilters: (filters: Filters) => void;
}> = ({ products, brands, onViewProduct, onAddToCart, searchQuery, setSearchQuery, filters, setFilters }) => {
    
    let filteredProducts = products;

    if (filters.brands.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.brands.includes(p.brand));
    }
    if (filters.genders.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.genders.includes(p.gender));
    }
    if (filters.categories.length > 0) {
        filteredProducts = filteredProducts.filter(p => filters.categories.includes(p.category));
    }

    if (searchQuery) {
        const query = String(searchQuery).toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.notes.some(note => note.toLowerCase().includes(query)) ||
            p.description.toLowerCase().includes(query)
        );
    }
    
    const title = searchQuery
        ? `Resultados: "${searchQuery}"` 
        : "Catálogo Completo";

    return (
        <main className="container mx-auto px-6 lg:px-12 py-24 min-h-screen">
             <RevealOnScroll>
                <div className="flex flex-col items-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-light text-white tracking-tight text-center mb-8">{title}</h1>
                    <div className="w-full max-w-2xl relative group">
                         <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/20 via-white/10 to-brand-gold/20 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <input 
                            type="text"
                            placeholder="Buscar essências..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="relative w-full bg-black/50 border border-white/10 text-white px-6 py-4 rounded-xl focus:outline-none focus:border-brand-gold/50 focus:bg-black/70 transition-all duration-300 placeholder-gray-500 font-light backdrop-blur-md"
                        />
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                         </div>
                    </div>
                </div>
            </RevealOnScroll>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
                <RevealOnScroll className="md:sticky md:top-24 h-fit">
                    <FilterSidebar
                        brands={brands}
                        products={products}
                        filters={filters}
                        onFilterChange={setFilters}
                    />
                </RevealOnScroll>
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredProducts.map((product, index) => (
                                <RevealOnScroll key={product.id} delay={index * 50}>
                                    <ProductCard product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
                                </RevealOnScroll>
                            ))}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                             <p className="text-xl font-light">Nenhuma fragrância encontrada.</p>
                             <button onClick={() => {setSearchQuery(''); setFilters({brands: [], genders: [], categories: [], maxPrice: null})}} className="mt-4 text-brand-gold hover:underline">Limpar filtros</button>
                         </div>
                    )}
                </div>
            </div>
        </main>
    )
};


const ProductDetailPage: React.FC<{ product: Product, onAddToCart: (product: Product, imageElement?: HTMLImageElement) => void; }> = ({ product, onAddToCart }) => {
    const imageRef = useRef<HTMLImageElement>(null);

    return (
        <main className="container mx-auto px-6 lg:px-12 py-24 min-h-screen flex items-center">
            <div className="glass-panel rounded-3xl p-8 lg:p-12 w-full">
                <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
                    <RevealOnScroll className="relative group">
                         <div className="absolute inset-0 bg-brand-gold/20 rounded-2xl blur-[50px] opacity-0 group-hover:opacity-30 transition duration-1000"></div>
                        <img ref={imageRef} src={product.image} alt={product.name} className="w-full rounded-2xl shadow-2xl relative z-10 transform transition duration-700 hover:scale-[1.02]"/>
                    </RevealOnScroll>
                    
                    <div className="space-y-8">
                        <RevealOnScroll delay={100}>
                            <h3 className="text-brand-gold text-sm font-bold tracking-[0.2em] uppercase mb-2">{product.brand}</h3>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-white leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-4 mt-4 text-gray-400 font-light text-sm">
                                <span className="px-3 py-1 border border-white/10 rounded-full">{product.gender}</span>
                                <span className="px-3 py-1 border border-white/10 rounded-full">{product.category}</span>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={200}>
                             <p className="text-4xl font-light text-white my-6">
                                R$ <span className="font-medium">{product.price.toFixed(2).replace('.', ',')}</span>
                            </p>
                        </RevealOnScroll>

                        <RevealOnScroll delay={300}>
                            <p className="text-gray-300 font-light leading-relaxed text-lg">{product.description}</p>
                        </RevealOnScroll>

                        <RevealOnScroll delay={400}>
                            <div className="space-y-3">
                                <h3 className="text-sm font-medium text-white uppercase tracking-widest">Notas Olfativas</h3>
                                <div className="flex flex-wrap gap-3">
                                    {product.notes.map(note => (
                                        <span key={note} className="bg-white/5 border border-white/10 text-gray-300 text-sm font-light px-4 py-2 rounded-lg backdrop-blur-sm">
                                            {note}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={500}>
                            <button 
                                onClick={() => onAddToCart(product, imageRef.current || undefined)} 
                                className="mt-4 w-full md:w-auto px-12 py-4 bg-brand-gold text-black font-semibold tracking-wide rounded-lg hover:bg-brand-gold-light transition-all duration-300 shadow-gold-glow hover:scale-105 active:scale-95"
                            >
                                Adicionar ao Carrinho
                            </button>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>
        </main>
    );
};


const CartPage: React.FC<{ cart: CartItem[], onRemoveFromCart: (id: number) => void; onNavigate: (page: Page) => void }> = ({ cart, onRemoveFromCart, onNavigate }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="container mx-auto px-6 lg:px-12 py-24 min-h-screen max-w-6xl">
            <RevealOnScroll>
                <h1 className="text-4xl font-light text-center mb-16 text-white tracking-wide">Sacola de Compras</h1>
            </RevealOnScroll>
            {cart.length === 0 ? (
                <div className="text-center py-20 glass-panel rounded-2xl">
                    <p className="text-xl text-gray-400 font-light mb-6">Sua sacola está vazia.</p>
                    <button onClick={() => onNavigate('products')} className="text-brand-gold hover:text-white border-b border-brand-gold pb-1 transition-colors">Voltar ao catálogo</button>
                </div>
            ) : (
                <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-6">
                        {cart.map((item, idx) => (
                            <RevealOnScroll key={item.id} delay={idx * 100}>
                                <div className="flex items-center p-6 glass-panel rounded-xl group transition-colors hover:bg-white/5">
                                    <div className="w-24 h-24 flex-shrink-0 bg-white/5 rounded-lg overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover mix-blend-overlay opacity-80 group-hover:opacity-100 transition-opacity"/>
                                    </div>
                                    <div className="ml-6 flex-grow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h2 className="font-medium text-white text-lg tracking-wide">{item.name}</h2>
                                                <p className="text-sm text-brand-gold/80 mt-1">{item.brand}</p>
                                            </div>
                                            <p className="text-lg font-light text-white">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <p className="text-sm text-gray-500 font-light">Qtd: {item.quantity}</p>
                                            <button onClick={() => onRemoveFromCart(item.id)} className="text-xs text-red-400 hover:text-red-300 transition-colors uppercase tracking-wider">Remover</button>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                    <RevealOnScroll delay={300}>
                        <div className="glass-panel p-8 rounded-2xl sticky top-28">
                            <h2 className="text-xl font-light text-white mb-8 tracking-wide border-b border-white/10 pb-4">Resumo do Pedido</h2>
                            <div className="flex justify-between text-gray-400 font-light mb-2">
                                <span>Subtotal</span>
                                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div className="flex justify-between text-gray-400 font-light mb-6">
                                <span>Frete</span>
                                <span className="text-xs text-brand-gold">Calculado no checkout</span>
                            </div>
                            <div className="flex justify-between font-medium text-white text-xl mb-8 pt-4 border-t border-white/10">
                                <span>Total</span>
                                <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <button onClick={() => onNavigate('checkout')} className="w-full bg-brand-gold text-black font-semibold py-4 rounded-lg hover:bg-brand-gold-light transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95">
                            Finalizar Compra
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            )}
        </main>
    );
};

const CheckoutPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <main className="container mx-auto px-6 lg:px-12 py-24 min-h-screen flex justify-center items-center">
        <div className="w-full max-w-2xl glass-panel p-10 rounded-3xl animate-fade-in-up">
            <h1 className="text-3xl font-light text-center mb-10 text-white tracking-widest uppercase">Checkout</h1>
            <div className="space-y-6">
                <div>
                    <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Email</label>
                    <input type="email" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" placeholder="seu@email.com" />
                </div>
                <div>
                    <label className="block text-xs font-bold text-brand-gold uppercase tracking-widest mb-2">Nome Completo</label>
                    <input type="text" className="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-white focus:border-brand-gold focus:ring-1 focus:ring-brand-gold outline-none transition-all" placeholder="Nome Sobrenome" />
                </div>
                <div className="pt-6 pb-2">
                     <h2 className="text-lg font-medium text-white mb-2">Pagamento</h2>
                     <div className="p-4 border border-white/10 rounded-lg bg-white/5 text-gray-400 text-sm font-light">
                        Ambiente seguro. Redirecionando para gateway...
                     </div>
                </div>
                 <button onClick={() => alert('Compra finalizada com sucesso!')} className="mt-4 w-full bg-brand-gold text-black font-bold py-4 rounded-lg hover:bg-brand-gold-light transition-all duration-300 shadow-gold-glow hover:shadow-gold-glow-lg active:scale-95">
                    Confirmar Pagamento
                </button>
            </div>
        </div>
    </main>
)

const initialAppData: AppData = {
    products: PRODUCTS_DATA,
    brands: BRANDS_DATA,
    collections: COLLECTIONS_DATA,
    siteSettings: {
        logo: 'https://i.imgur.com/u4Qj5In.png',
        heroImage: 'https://i.imgur.com/mWqyC7d.jpeg'
    }
};

const initialFilters: Filters = {
    brands: [],
    genders: [],
    categories: [],
    maxPrice: null,
};

function App() {
  const [appData, setAppData] = useState<AppData>(() => {
    try {
        const storedData = localStorage.getItem('appData');
        if (storedData) {
            const parsed = JSON.parse(storedData);
            if (parsed && typeof parsed === 'object' && parsed !== null && 'products' in parsed) {
                return parsed as AppData;
            }
        }
        return initialAppData;
    } catch (error: any) {
        console.error("Could not load data from localStorage. Using defaults.", String(error));
        return initialAppData;
    }
  });
  const [page, setPage] = useState<Page>('home');
  const [pageParam, setPageParam] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const cartIconRef = useRef<HTMLButtonElement>(null);
  const [flyAnimation, setFlyAnimation] = useState<{ imageSrc: string; startRect: DOMRect } | null>(null);

  useEffect(() => {
    try {
        localStorage.setItem('appData', JSON.stringify(appData));
    } catch (error: any) {
        console.error(`Could not save data to localStorage: ${String(error)}`);
    }
  }, [appData]);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser !== null && 'id' in parsedUser) {
          setCurrentUser(parsedUser as User);
        } else {
          setCurrentUser(null);
        }
      }
    } catch (error: any) {
      console.error(`Failed to parse user data from localStorage: ${String(error)}`);
    }
  }, []);

  const handleUpdateSiteSettings = (newSettings: SiteSettings) => {
    setAppData(prev => ({...prev, siteSettings: newSettings}));
  };

  const handleAuthSuccess = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
    setAuthModalOpen(false);
    if (user.role === 'admin') {
      handleNavigate('admin');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    handleNavigate('home');
  };

  const handleNavigate = (newPage: Page, param?: string) => {
    setSearchQuery('');
    setFilters(initialFilters);
    setPage(newPage);
    setPageParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    handleNavigate('productDetail');
  }

  const handleAddToCart = (product: Product, imageElement?: HTMLImageElement) => {
    if (imageElement) {
        const startRect = imageElement.getBoundingClientRect();
        setFlyAnimation({ imageSrc: product.image, startRect });
    }
    
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  }

  const handleRemoveFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }
  
  const handleCreateProduct = (newProductData: Omit<Product, 'id' | 'rating' | 'slug' | 'gender'> & { gender: string }) => {
    const newProduct: Product = {
        ...newProductData,
        id: Date.now(),
        slug: newProductData.name.toLowerCase().replace(/\s+/g, '-'),
        rating: 0,
        gender: newProductData.gender as 'Masculino' | 'Feminino' | 'Unissex',
      };
    setAppData(prev => ({...prev, products: [...prev.products, newProduct]}));
  };

  const handleUpdateProduct = (updatedProduct: Product) => {
    setAppData(prev => ({
        ...prev,
        products: prev.products.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    }));
  };

  const handleDeleteProduct = (productId: number) => {
    setAppData(prev => ({...prev, products: prev.products.filter(p => p.id !== productId)}));
  };

  const handleCreateBrand = (brandData: Omit<Brand, 'id'>) => {
    const newBrand = { ...brandData, id: Date.now() };
    setAppData(prev => ({...prev, brands: [...prev.brands, newBrand]}));
  };
  const handleUpdateBrand = (updatedBrand: Brand) => {
    setAppData(prev => ({
        ...prev, 
        brands: prev.brands.map(b => b.id === updatedBrand.id ? updatedBrand : b)
    }));
  };
  const handleDeleteBrand = (brandId: number) => {
    setAppData(prev => ({...prev, brands: prev.brands.filter(b => b.id !== brandId)}));
  };

  const handleCreateCollection = (collectionData: Omit<Collection, 'id'>) => {
    const newCollection: Collection = {
      ...collectionData,
      id: collectionData.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    };
    setAppData(prev => ({...prev, collections: [...prev.collections, newCollection]}));
  };
  const handleUpdateCollection = (updatedCollection: Collection) => {
    setAppData(prev => ({
        ...prev,
        collections: prev.collections.map(c => c.id === updatedCollection.id ? updatedCollection : c)
    }));
  };
  const handleDeleteCollection = (collectionId: string) => {
    setAppData(prev => ({...prev, collections: prev.collections.filter(c => c.id !== collectionId)}));
  };

  const handleUpdateAllPrices = (newPrice: number) => {
    setAppData(currentAppData => {
        const updatedProducts = currentAppData.products.map(product => {
            return { ...product, price: newPrice };
        });
        return {
            ...currentAppData,
            products: updatedProducts
        };
    });
  };

  const renderPage = () => {
    switch(page) {
      case 'home':
        return <HomePage products={appData.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} siteSettings={appData.siteSettings} />;
      case 'products':
        return <ProductListPage 
                    products={appData.products} 
                    brands={appData.brands} 
                    onViewProduct={handleViewProduct} 
                    onAddToCart={handleAddToCart} 
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    filters={filters}
                    setFilters={setFilters}
                />;
      case 'collection':
        return <CollectionPage products={appData.products} collections={appData.collections} collectionId={pageParam} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} />;
      case 'productDetail':
        return selectedProduct ? <ProductDetailPage product={selectedProduct} onAddToCart={handleAddToCart} /> : <HomePage products={appData.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} siteSettings={appData.siteSettings} />;
      case 'cart':
        return <CartPage cart={cart} onRemoveFromCart={handleRemoveFromCart} onNavigate={handleNavigate} />;
       case 'checkout':
        return <CheckoutPage onNavigate={handleNavigate} />;
      case 'admin':
        return currentUser?.role === 'admin' ? (
          <AdminPanel 
            products={appData.products}
            brands={appData.brands}
            collections={appData.collections}
            siteSettings={appData.siteSettings}
            onUpdateSiteSettings={handleUpdateSiteSettings}
            onCreateProduct={handleCreateProduct}
            onUpdateProduct={handleUpdateProduct}
            onDeleteProduct={handleDeleteProduct}
            onCreateBrand={handleCreateBrand}
            onUpdateBrand={handleUpdateBrand}
            onDeleteBrand={handleDeleteBrand}
            onCreateCollection={handleCreateCollection}
            onUpdateCollection={handleUpdateCollection}
            onDeleteCollection={handleDeleteCollection}
            onUpdateAllPrices={handleUpdateAllPrices}
          />
        ) : <HomePage products={appData.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} siteSettings={appData.siteSettings} />;
      default:
        return <HomePage products={appData.products} onViewProduct={handleViewProduct} onAddToCart={handleAddToCart} onNavigate={handleNavigate} siteSettings={appData.siteSettings} />;
    }
  }

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen text-gray-200">
      <Header 
        cartItemCount={cartItemCount} 
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onProfileClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        cartIconRef={cartIconRef}
        siteSettings={appData.siteSettings}
      />
      <div key={page + (pageParam || '')} className="flex-grow">
        {renderPage()}
      </div>
      <Footer onAdminLoginClick={() => setAuthModalOpen(true)} />
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
      {flyAnimation && cartIconRef.current && (
        <FlyingProductAnimator
          imageSrc={flyAnimation.imageSrc}
          startRect={flyAnimation.startRect}
          endRect={cartIconRef.current.getBoundingClientRect()}
          onAnimationEnd={() => setFlyAnimation(null)}
        />
      )}
      <WhatsAppButton />
    </div>
  );
}

export default App;
