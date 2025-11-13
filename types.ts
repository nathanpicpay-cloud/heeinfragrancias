export interface Product {
  id: number;
  slug: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  notes: string[];
  rating: number;
  image: string;
  description: string;
  collection?: string;
  gender: 'Masculino' | 'Feminino' | 'Unissex';
}

export interface CartItem extends Product {
  quantity: number;
}

export type Page = 'home' | 'products' | 'productDetail' | 'cart' | 'checkout' | 'collection' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface Brand {
  id: number;
  name: string;
}

export interface Collection {
  id: string; // slug
  name: string;
  description: string;
}

export interface SiteSettings {
  logo: string;
  heroImage: string;
}

export interface AppData {
  products: Product[];
  brands: Brand[];
  collections: Collection[];
  siteSettings: SiteSettings;
}