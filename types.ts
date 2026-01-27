export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entrada' | 'principal' | 'bebida' | 'sobremesa';
  image: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface OrderForm {
  name: string;
  phone: string;
  address: string;
  paymentMethod: 'pix' | 'credit' | 'debit' | 'cash';
}

export interface DashboardMetric {
  label: string;
  value: string | number;
  change: number; // percentage
  trend: 'up' | 'down';
}

export interface SalesData {
  name: string;
  value: number;
}
