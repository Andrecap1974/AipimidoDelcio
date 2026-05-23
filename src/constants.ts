import { Product, NeighborhoodDeliveryFee, AppSettings, OrderRecord } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'aipim-com-casca',
    name: 'Aipim com Casca (In Natura)',
    description: 'Aipim colhido no dia, bem fresquinho, com casca, excelente cozimento, macio e saboroso.',
    pricePerKg: 5.00,
    unit: 'kg',
    availableWeight: 200,
    image: '/src/assets/images/aipim_com_casca_1779549507427.png'
  },
  {
    id: 'aipim-descascado',
    name: 'Aipim Descascado (Prático)',
    description: 'Aipim selecionado, higienizado, descascado e embalado. Pronto para ir direto para a panela de cozimento.',
    pricePerKg: 8.00,
    unit: 'kg',
    availableWeight: 150,
    image: '/src/assets/images/aipim_descascado_1779549524886.png'
  }
];

export const INITIAL_NEIGHBORHOODS: NeighborhoodDeliveryFee[] = [
  { id: '1', name: 'Canudos', fee: 5.00, active: true },
  { id: '2', name: 'Centro', fee: 6.00, active: true },
  { id: '3', name: 'Hamburgo Velho', fee: 7.00, active: true },
  { id: '4', name: 'Rondônia', fee: 7.00, active: true },
  { id: '5', name: 'Pátria Nova', fee: 6.00, active: true },
  { id: '6', name: 'Lomba Grande', fee: 10.00, active: true },
  { id: '7', name: 'Ideal', fee: 6.00, active: true },
  { id: '8', name: 'Santo Afonso', fee: 8.00, active: true }
];

export const INITIAL_SETTINGS: AppSettings = {
  phone: '51999172765', // (51) 999172765
  instagram: '',
  address: 'Rua Dublin, 968 - Canudos, Novo Hamburgo - RS',
  hours: 'Segunda a Sábado das 08:00 às 18:00',
  minOrderValue: 15.00,
  deliveryEnabled: true,
  pixKey: '51999172765',
  pixType: 'Celular',
  pixKeyName: 'Edelcio dos Santos'
};

export const INITIAL_ORDERS: OrderRecord[] = [
  {
    id: 'PED-1024',
    customer: {
      name: 'Maria Rodrigues',
      phone: '51987654321',
      address: 'Rua das Flores, 452',
      neighborhood: 'Canudos',
      city: 'Novo Hamburgo',
      cep: '93546-000',
      deliveryType: 'delivery',
      paymentMethod: 'pix'
    },
    items: [
      { productId: 'aipim-descascado', name: 'Aipim Descascado (Prático)', quantity: 3, price: 8.00 },
      { productId: 'aipim-com-casca', name: 'Aipim com Casca (In Natura)', quantity: 2, price: 5.00 }
    ],
    subtotal: 34.00,
    deliveryFee: 5.00,
    total: 39.00,
    date: '2026-05-23T10:30:00Z',
    status: 'Saiu para Entrega'
  },
  {
    id: 'PED-1023',
    customer: {
      name: 'Carlos Oliveira',
      phone: '51998887766',
      address: 'Av. das Nações, 1200 - Ap 302',
      neighborhood: 'Centro',
      city: 'Novo Hamburgo',
      cep: '93510-000',
      deliveryType: 'delivery',
      paymentMethod: 'money',
      changeFor: '50.00'
    },
    items: [
      { productId: 'aipim-descascado', name: 'Aipim Descascado (Prático)', quantity: 5, price: 8.00 }
    ],
    subtotal: 40.00,
    deliveryFee: 6.00,
    total: 46.00,
    date: '2026-05-22T16:15:00Z',
    status: 'Entregue'
  }
];

export const HERO_IMAGE_URL = '/src/assets/images/mandioca_hero_1779549488591.png';
