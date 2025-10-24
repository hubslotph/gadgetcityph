export interface ProductImage {
  url: string;
  alt?: string;
  thumbnail?: string;
}

export interface Product {
  id?: string;
  _id?: string;
  name: string;
  description?: string;
  price: number;
  originalPrice?: number;
  category: string;
  brand: string;
  model?: string;
  images: ProductImage[];
  stock?: number;
  specifications?: Record<string, string>;
  features?: string[];
  rating?: number;
  reviewCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
  tags?: string[];
  warranty?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface Order {
  _id?: string;
  items: CartItem[];
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    province: string;
    zipCode: string;
  };
  paymentMethod: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt?: string;
  updatedAt?: string;
}