export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  oldPrice?: number;
  stock: number;
  status: 'active' | 'inactive' | 'outofstock';
  badge?: 'Nouveauté' | 'Promo' | 'Best-seller' | 'Coups de cœur' | 'Exclusif' | '';
  isBestSeller?: boolean;
  images: string[];
  sku: string;
  subcategory?: string; // subcategory slug
  // Carrelage specific
  tileLength?: number; // cm
  tileWidth?: number; // cm
  tilesPerBox?: number;
  sqmPerBox?: number;
  createdAt: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image?: string;
  parentId?: string;
  status: 'active' | 'inactive';
  order: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  // For carrelage: specifically how many boxes, though quantity usually represents the unit sold
}

export interface Order {
  id: string;
  date: number;
  customerDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  items: CartItem[];
  subtotal: number;
  shipping: number;
  taxes: number;
  total: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'shipped' | 'delivered' | 'cancelled';
}

export interface User {
  id: string;
  email: string;
  name: string;
  registeredAt: number;
  loyaltyPoints?: number;
  dailyBonusClaimedAt?: number;
  phone?: string;
}
