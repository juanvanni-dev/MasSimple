export interface ProductOption {
  label: string;
  price: number;
  subtype?: string;
}

export interface ProductFlavor {
  label: string;
  foto_url?: string | null;
}

export interface Product {
  id: string;
  name: string;
  emoji?: string;
  stock: 'disponible' | 'agotado';
  flavors?: (string | ProductFlavor)[];
  options?: ProductOption[];
  foto_url?: string | null;
  category?: string;
  created_at?: string;
}

export interface CartItem {
  key: string;
  pid: string;
  oi: number;
  name: string;
  emoji: string;
  label: string;
  flavor: string;
  price: number;
  qty: number;
}

export interface OrderItem {
  name: string;
  flavor?: string;
  label: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  name: string;
  items: string;
  items_json?: OrderItem[];
  total: number;
  status: 'pendiente' | 'confirmado' | 'cancelado';
  date: string;
  timestamp: number;
  vendedora?: string;
}
