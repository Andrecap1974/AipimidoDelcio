export interface Product {
  id: string;
  name: string;
  description: string;
  pricePerKg: number;
  unit: string; // e.g. "kg"
  availableWeight: number; // weight in kg
  image: string;
}

export interface OrderItem {
  product: Product;
  quantity: number; // in kg
}

export interface CustomerData {
  name: string;
  phone: string;
  address: string;
  neighborhood: string;
  city: string;
  cep: string;
  deliveryType: 'delivery' | 'pickup';
  paymentMethod: 'pix' | 'money';
  changeFor?: string; // value of money they will pay to calculate change
}

export interface NeighborhoodDeliveryFee {
  id: string;
  name: string;
  fee: number;
  active: boolean;
}

export interface AppSettings {
  phone: string;
  instagram: string;
  address: string;
  hours: string;
  minOrderValue: number;
  deliveryEnabled: boolean;
  pixKey: string;
  pixType: string;
  pixKeyName: string;
}

export interface OrderRecord {
  id: string;
  customer: CustomerData;
  items: {
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  date: string; // ISO string or formatted date
  status: 'Pendente' | 'Preparando' | 'Pronto para Retirada' | 'Saiu para Entrega' | 'Entregue' | 'Cancelado';
}
