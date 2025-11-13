
import React, { useState, useEffect, useRef } from 'react';
import type { Page, Product, CartItem, User, Brand, Collection, SiteSettings, AppData } from './types';
import { PRODUCTS as PRODUCTS_DATA, BRANDS as BRANDS_DATA, COLLECTIONS as COLLECTIONS_DATA } from './constants';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ProductCard } from './components/ProductCard';
import { AuthModal } from './components/AuthModal';
import { AdminPanel } from './components/AdminPanel';
import { FlyingProductAnimator } from './components/FlyingProductAnimator';
import { WhatsAppButton } from './components/WhatsAppButton';

type Filters = {
    brands: string[];
    genders: string[];
    categories: string[];
    maxPrice: number | null;
}

const HeroSection: React.FC<{ onNavigate: (page: Page, param?: string) => void; heroImage: string }> = ({ onNavigate, heroImage }) => (
    <div className="relative h-[60vh] md:h-[80vh] bg-cover bg-center flex items-center justify-center text-center" style={{ backgroundImage: `url('${heroImage}')` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="relative z-10 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wider leading-tight">Heein Fragrâncias</h1>
            <p className="mt-4 text-lg md:text-xl text-gray-300">Essências dos melhores perfumes do mundo.</p>
            <button
                onClick={() => onNavigate('products')}
                className="mt-8 bg-brand-gold text-black font-bold py-3 px-8 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-gold-glow active:scale-100"
            >
                Catálogo
            </button>
        </div>
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
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <section>
                    <h2 className="text-3xl font-bold text-center mb-8 text-brand-gold tracking-wide">Mais Vendidos</h2>
                    <div className="relative w-full overflow-hidden group">
                        <div className="flex w-max space-x-6 animate-scroll-x pause-animation">
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
                         <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-brand-dark to-transparent pointer-events-none"></div>
                         <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-brand-dark to-transparent pointer-events-none"></div>
                    </div>
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
    if (!collectionId) return <p>Coleção não encontrada.</p>;
    
    const collectionProducts = products.filter(p => p.collection === collectionId);
    const details = collections.find(c => c.id === collectionId);
    
    if (!details) return <p>Detalhes da coleção não encontrados.</p>;

    return (
         <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center mb-10">
                <h1 className="text-4xl font-bold text-brand-gold tracking-wide">{details.name}</h1>
                <p className="mt-2 text-lg text-gray-300 max-w-3xl mx-auto">{details.description}</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {collectionProducts.map(product => (
                    <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
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
        <div className="py-4 border-b border-gray-800">
            <h3 className="font-semibold text-white mb-2">{title}</h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">{children}</div>
        </div>
    );

    const Checkbox: React.FC<{label: string; checked: boolean; onChange: () => void}> = ({label, checked, onChange}) => (
         <label className="flex items-center space-x-2 text-gray-300 hover:text-brand-gold cursor-pointer">
            <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 rounded bg-gray-700 border-gray-600 text-brand-gold focus:ring-brand-gold" />
            <span>{label}</span>
        </label>
    );

    return (
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="sticky top-24">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-gold">Filtros</h2>
                    {hasActiveFilters && (
                        <button onClick={clearFilters} className="text-sm text-gray-400 hover:text-white">Limpar</button>
                    )}
                </div>
                <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                    <FilterSection title="Gênero">
                        {allGenders.map(gender => <Checkbox key={gender} label={gender} checked={filters.genders.includes(gender)} onChange={() => handleCheckboxChange('genders', gender)} />)}
                    </FilterSection>
                    <FilterSection title="Marca">
                        {brands.map(brand => <Checkbox key={brand.id} label={brand.name} checked={filters.brands.includes(brand.name)} onChange={() => handleCheckboxChange('brands', brand.name)} />)}
                    </FilterSection>
                    <FilterSection title="Estilo Olfativo">
                         {allCategories.map(category => <Checkbox key={category} label={category} checked={filters.categories.includes(category)} onChange={() => handleCheckboxChange('categories', category)} />)}
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
        const query = searchQuery.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query) ||
            p.notes.some(note => note.toLowerCase().includes(query)) ||
            p.description.toLowerCase().includes(query)
        );
    }
    
    const title = searchQuery
        ? `Resultados para "${searchQuery}"` 
        : "Nosso Catálogo";

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-10 text-brand-gold tracking-wide">{title}</h1>

            <div className="mb-8 max-w-3xl mx-auto">
                <input 
                    type="text"
                    placeholder="Pesquisar por nome, marca, estilo olfativo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900/50 border-2 border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-gold transition-all duration-300 placeholder-gray-500"
                />
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                <FilterSidebar
                    brands={brands}
                    products={products}
                    filters={filters}
                    onFilterChange={setFilters}
                />
                <div className="flex-1">
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredProducts.map(product => (
                                <ProductCard key={product.id} product={product} onViewProduct={onViewProduct} onAddToCart={onAddToCart} />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 text-lg pt-10">Nenhum perfume encontrado com os filtros selecionados.</p>
                    )}
                </div>
            </div>
        </main>
    )
};


const ProductDetailPage: React.FC<{ product: Product, onAddToCart: (product: Product, imageElement?: HTMLImageElement) => void; }> = ({ product, onAddToCart }) => {
    const imageRef = useRef<HTMLImageElement>(null);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-start">
                <div>
                    <img ref={imageRef} src={product.image} alt={product.name} className="w-full rounded-lg shadow-gold-glow-lg"/>
                </div>
                <div>
                    <h1 className="text-4xl font-bold text-brand-gold">{product.name}</h1>
                    <p className="text-xl text-gray-300 mt-1">{product.brand}</p>
                    <p className="text-gray-400 mt-2">{product.gender} / {product.category}</p>
                    <p className="text-3xl font-bold text-white my-4">R$ {product.price.toFixed(2).replace('.', ',')}</p>
                    <p className="text-gray-400 leading-relaxed">{product.description}</p>
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold text-white">Notas Olfativas:</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {product.notes.map(note => <span key={note} className="bg-gray-800 text-brand-gold text-sm font-medium px-3 py-1 rounded-full">{note}</span>)}
                        </div>
                    </div>
                    <button onClick={() => onAddToCart(product, imageRef.current || undefined)} className="mt-8 w-full bg-brand-gold text-black font-bold py-3 rounded-md hover:bg-yellow-400 transition-all duration-300 transform hover:scale-105 shadow-gold-glow active:scale-100">
                        Adicionar ao Carrinho
                    </button>
                </div>
            </div>
        </main>
    );
};


const CartPage: React.FC<{ cart: CartItem[], onRemoveFromCart: (id: number) => void; onNavigate: (page: Page) => void }> = ({ cart, onRemoveFromCart, onNavigate }) => {
    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-4xl font-bold text-center mb-10 text-brand-gold tracking-wide">Seu Carrinho</h1>
            {cart.length === 0 ? (
                <p className="text-center text-gray-400">Seu carrinho está vazio.</p>
            ) : (
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="flex items-center bg-gray-900 p-4 rounded-lg border border-gray-800">
                                <img src={item.image} alt={item.name} className="w-20 h-28 object-cover rounded-md"/>
                                <div className="ml-4 flex-grow">
                                    <h2 className="font-semibold text-white">{item.name}</h2>
                                    <p className="text-sm text-gray-400">{item.brand}</p>
                                    <p className="text-lg font-bold text-brand-gold mt-1">R$ {item.price.toFixed(2).replace('.', ',')}</p>
                                </div>
                                <div className="text-center">
                                    <p>Qtd: {item.quantity}</p>
                                    <button onClick={() => onRemoveFromCart(item.id)} className="text-red-500 hover:text-red-400 text-sm mt-1">Remover</button>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 h-fit">
                        <h2 className="text-2xl font-bold mb-4">Resumo</h2>
                        <div className="flex justify-between text-gray-300">
                            <span>Subtotal</span>
                            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-lg mt-2">
                            <span>Total</span>
                            <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                        </div>
                        <button onClick={() => onNavigate('checkout')} className="mt-6 w-full bg-brand-gold text-black font-bold py-3 rounded-md hover:bg-yellow-400 transition-all duration-300 shadow-gold-glow active:scale-95">
                           Finalizar Compra
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
};

const CheckoutPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
        <h1 className="text-4xl font-bold text-center mb-10 text-brand-gold tracking-wide">Checkout</h1>
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-300">Email</label>
                <input type="email" className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-white p-2" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-300">Nome Completo</label>
                <input type="text" className="mt-1 block w-full bg-gray-800 border-gray-700 rounded-md shadow-sm focus:ring-brand-gold focus:border-brand-gold text-white p-2" />
            </div>
            <div>
                 <h2 className="text-xl font-semibold text-white mb-4">Pagamento</h2>
                 <p className="text-gray-400">Funcionalidade de pagamento a ser implementada.</p>
            </div>
             <button onClick={() => alert('Compra finalizada com sucesso!')} className="mt-6 w-full bg-brand-gold text-black font-bold py-3 rounded-md hover:bg-yellow-400 transition-all duration-300 shadow-gold-glow active:scale-95">
                Pagar Agora
            </button>
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
    } catch (error) {
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
    } catch (error) {
        // FIX: The caught error is of type 'unknown' and must be converted to a string before being passed to console.error.
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
    } catch (error) {
      // FIX: The caught error is of type 'unknown' and must be converted to a string before being passed to console.error.
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
    window.scrollTo(0, 0);
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
        // Create a new array of products with the updated price.
        // This ensures immutability, which is key for React to detect changes reliably.
        const updatedProducts = currentAppData.products.map(product => {
            // Create a new product object for each item.
            return { ...product, price: newPrice };
        });

        // Return a completely new state object with the updated products.
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
    <div className="flex flex-col min-h-screen">
      <Header 
        cartItemCount={cartItemCount} 
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onProfileClick={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        cartIconRef={cartIconRef}
        siteSettings={appData.siteSettings}
      />
      <div key={page + (pageParam || '')} className="flex-grow animate-fade-in">
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
