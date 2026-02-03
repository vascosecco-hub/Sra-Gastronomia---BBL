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

export interface DetailedSale {
  id: string;
  date: string; // ISO string
  customerName: string;
  whatsapp: string;
  category: string;
  product: string;
  price: number;
  address: string;
}

export interface HeatmapPoint {
  dayIndex: number; // 0-6 (Sun-Sat) or 1-30 (Day of month) - Requirement says "days of month"
  hour: number; // 0-23
  intensity: number; // 0-1
}
