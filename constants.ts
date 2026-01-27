import { Product, DashboardMetric, SalesData } from './types';

export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Costela Defumada',
    description: 'Costela bovina defumada por 12h, acompanha purê de batata rústica.',
    price: 89.90,
    category: 'principal',
    image: 'https://picsum.photos/id/292/400/300'
  },
  {
    id: '2',
    name: 'Burger Industrial',
    description: 'Blend da casa 180g, queijo cheddar inglês, cebola caramelizada no pão brioche.',
    price: 42.00,
    category: 'principal',
    image: 'https://picsum.photos/id/163/400/300'
  },
  {
    id: '3',
    name: 'Dadinhos de Tapioca',
    description: 'Cubos de tapioca com queijo coalho, acompanha geleia de pimenta.',
    price: 28.00,
    category: 'entrada',
    image: 'https://picsum.photos/id/493/400/300'
  },
  {
    id: '4',
    name: 'Salada Botânica',
    description: 'Mix de folhas, nozes, queijo gorgonzola e molho de mel e mostarda.',
    price: 36.00,
    category: 'entrada',
    image: 'https://picsum.photos/id/365/400/300'
  },
  {
    id: '5',
    name: 'Cheesecake de Frutas Vermelhas',
    description: 'Base de biscoito, creme suave de queijo e calda artesanal.',
    price: 22.00,
    category: 'sobremesa',
    image: 'https://picsum.photos/id/102/400/300'
  },
  {
    id: '6',
    name: 'Soda Italiana Artesanal',
    description: 'Xarope de frutas feito na casa com água com gás.',
    price: 14.00,
    category: 'bebida',
    image: 'https://picsum.photos/id/431/400/300'
  }
];

export const KPIS: DashboardMetric[] = [
  { label: 'Faturamento Total', value: 'R$ 42.590', change: 12.5, trend: 'up' },
  { label: 'Pedidos (Mês)', value: '342', change: 8.2, trend: 'up' },
  { label: 'Ticket Médio', value: 'R$ 124,50', change: -2.1, trend: 'down' },
  { label: 'Novos Clientes', value: '89', change: 5.4, trend: 'up' },
];

export const SALES_DATA: SalesData[] = [
  { name: 'Seg', value: 4000 },
  { name: 'Ter', value: 3000 },
  { name: 'Qua', value: 5000 },
  { name: 'Qui', value: 8000 },
  { name: 'Sex', value: 12000 },
  { name: 'Sáb', value: 15000 },
  { name: 'Dom', value: 11000 },
];

export const TOP_PRODUCTS = [
  { name: 'Costela Defumada', sales: 120, revenue: 10788 },
  { name: 'Burger Industrial', sales: 98, revenue: 4116 },
  { name: 'Dadinhos', sales: 85, revenue: 2380 },
  { name: 'Gin Tônica', sales: 60, revenue: 1800 },
];
