import React, { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
  MapPin,
  Phone,
  Minus,
  Plus,
  Trash2,
  ArrowRight,
  LayoutDashboard,
  TrendingUp,
  Users,
  Package,
  Calendar,
  MessageCircle,
  Loader2,
  Lock,
  LogOut,
  User,
  Instagram
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { Product, CartItem, OrderForm, DetailedSale, HeatmapPoint } from './types';
import { PRODUCTS, KPIS, SALES_DATA, TOP_PRODUCTS } from './constants';
import { supabase } from './supabaseClient';
import { Session } from '@supabase/supabase-js';
import { aiService } from './aiService';
import { generateMockSales, generateHeatmapData } from './crmMockService';

// --- COMPONENTS ---

// 1. HEADER
const Header = ({
  cartCount,
  onOpenCart,
  onNavigate,
  session
}: {
  cartCount: number;
  onOpenCart: () => void;
  onNavigate: (view: string) => void;
  session: Session | null;
}) => (
  <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200">
    <div className="container mx-auto px-4 md:px-8 h-20 flex items-center justify-between">
      {/* Logo */}
      <div
        className="font-display font-bold text-2xl tracking-widest cursor-pointer"
        onClick={() => onNavigate('home')}
      >
        SRA<span className="text-brand-wood">.</span>GASTRONOMIA
      </div>

      {/* Desktop Nav */}
      <nav className="hidden lg:flex items-center space-x-8 text-sm font-semibold tracking-widest uppercase text-gray-600">
        <button onClick={() => onNavigate('home')} className="hover:text-black transition">Home</button>
        <button onClick={() => onNavigate('menu')} className="hover:text-black transition">Cardápio</button>
        <button onClick={() => onNavigate('events')} className="hover:text-black transition">Eventos</button>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* WhatsApp CTA */}
        <a
          href="https://app.gptmaker.ai/widget/3E85F2A3DA4031A6D17E8A7F6D386327/iframe"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center gap-2 group cursor-pointer"
        >
          <div className="bg-green-100 p-2 rounded-full text-green-600 group-hover:bg-green-200 transition">
            <MessageCircle size={20} />
          </div>
          <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">
            Fale com a gente!
          </span>
        </a>

        {/* CRM-SG Access */}
        <button
          onClick={() => onNavigate('dashboard')}
          className="hidden md:flex items-center gap-2 group cursor-pointer bg-red-100 p-2 rounded-full text-red-600 hover:bg-red-200 transition"
        >
          <LayoutDashboard size={20} />
          <span className="text-sm font-bold text-gray-700 group-hover:text-black transition">
            CRM-SG
          </span>
        </button>

        {/* Cart Button */}
        <button
          className="relative flex items-center gap-2 group p-1 pr-2 hover:bg-gray-50 rounded-full transition"
          onClick={onOpenCart}
        >
          <div className="relative p-2 bg-gray-100 rounded-full group-hover:bg-gray-200 transition">
            <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-brand-black" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-brand-ocre text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </div>
          <span className="hidden md:block text-xs font-bold text-gray-500 w-24 leading-tight text-left">
            Revise e envie seu pedido
          </span>
        </button>

        {/* Dashboard Access 'SA' */}
        <button
          onClick={() => onNavigate('dashboard')}
          className={`w-9 h-9 flex items-center justify-center rounded-full font-display font-bold text-xs transition shadow-sm border border-gray-800 ${session
            ? 'bg-green-600 text-white hover:bg-green-700'
            : 'bg-brand-black text-white hover:bg-brand-wood'
            }`}
          title={session ? "Acessar Painel" : "Login Administrativo"}
        >
          {session ? <User size={16} /> : 'SA'}
        </button>

        <button className="lg:hidden p-2">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </div>
  </header>
);

// 2. HERO
const Hero = ({ onCtaClick }: { onCtaClick: () => void }) => (
  <section className="relative h-[80vh] w-full bg-gray-900 overflow-hidden">
    <img
      src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80"
      alt="Industrial Restaurant Interior"
      className="absolute inset-0 w-full h-full object-cover opacity-60"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
      <h1 className="font-display text-4xl md:text-6xl text-white font-bold tracking-widest mb-6 uppercase">
        Restaurante e Lanchonete <br /> <span className="text-brand-ocre">Aqui e na sua casa</span>
      </h1>
      <p className="text-gray-300 max-w-lg mb-10 text-lg md:text-xl font-bold">
        Gastronomia descomplicada em um ótimo ambiente.
        Sabores autênticos, ingredientes locais.
      </p>
      <div className="flex flex-col md:flex-row gap-4">
        <button
          onClick={onCtaClick}
          className="bg-white text-brand-black px-8 py-4 font-bold tracking-widest uppercase hover:bg-brand-ocre hover:text-white transition duration-300"
        >
          Em Casa, Peça Aqui
        </button>
        <button
          onClick={onCtaClick}
          className="border border-white text-white px-8 py-4 font-bold tracking-widest uppercase hover:bg-white hover:text-black transition duration-300"
        >
          Nosso Cardápio
        </button>
      </div>
    </div>
  </section>
);

// 3. PRODUCT LIST
const ProductList = ({ addToCart }: { addToCart: (p: Product) => void }) => {
  const [filter, setFilter] = useState<string>('todos');

  const filteredProducts = filter === 'todos'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  const categories = ['todos', 'entrada', 'principal', 'bebida', 'sobremesa'];

  return (
    <section className="py-20 container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="font-display text-4xl font-bold uppercase tracking-wide mb-2">Nosso Cardápio</h2>
          <div className="h-1 w-20 bg-brand-ocre"></div>
        </div>

        <div className="flex space-x-2 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border transition whitespace-nowrap ${filter === cat
                ? 'bg-brand-black text-white border-brand-black'
                : 'bg-transparent text-gray-500 border-gray-300 hover:border-brand-black hover:text-brand-black'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredProducts.map(product => (
          <div key={product.id} className="group bg-white border border-gray-100 shadow-sm hover:shadow-xl transition duration-300 flex flex-col">
            <div className="h-64 overflow-hidden relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 text-sm font-bold shadow-sm">
                R$ {product.price.toFixed(2)}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-display text-xl font-bold mb-2">{product.name}</h3>
              <p className="text-gray-500 text-sm mb-6 flex-grow">{product.description}</p>
              <button
                onClick={() => addToCart(product)}
                className="w-full bg-brand-black text-white py-3 font-bold uppercase tracking-widest hover:bg-brand-wood transition flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Adicionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// 4. CART & CHECKOUT
const CartDrawer = ({
  isOpen,
  onClose,
  cart,
  updateQty,
  onCheckout
}: {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  updateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
}) => {
  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <h2 className="font-display text-2xl font-bold uppercase tracking-wide">Seu Pedido</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="text-center text-gray-500 mt-20">
              <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>Seu carrinho está vazio.</p>
              <button onClick={onClose} className="mt-4 text-brand-wood font-bold underline">
                Ver Cardápio
              </button>
            </div>
          ) : (
            cart.map(item => (
              <div key={item.id} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded bg-gray-100" />
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">R$ {item.price.toFixed(2)}</p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      {item.quantity === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                    </button>
                    <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="p-1 rounded border border-gray-300 hover:bg-gray-100"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="text-right font-bold">
                  R$ {(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between mb-6 text-xl font-bold">
              <span>Total</span>
              <span>R$ {total.toFixed(2)}</span>
            </div>
            <button
              onClick={() => { onClose(); onCheckout(); }}
              className="w-full bg-brand-botanic text-white py-4 font-bold uppercase tracking-widest hover:bg-green-800 transition flex items-center justify-center gap-2 shadow-lg"
            >
              Fechar Pedido <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// 5. CHECKOUT FORM
const CheckoutModal = ({
  cart,
  onClose,
  onConfirm,
  isLoading
}: {
  cart: CartItem[];
  onClose: () => void;
  onConfirm: (data: OrderForm) => void;
  isLoading: boolean;
}) => {
  const [formData, setFormData] = useState<OrderForm>({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'credit'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(formData);
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white w-full max-w-lg relative p-8 rounded shadow-2xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full" disabled={isLoading}>
          <X className="w-5 h-5" />
        </button>

        <h2 className="font-display text-2xl font-bold mb-6 border-b pb-4">Finalizar Pedido</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Seu Nome</label>
            <input
              required
              disabled={isLoading}
              type="text"
              className="w-full bg-white text-black border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-black"
              placeholder="Ex: João Silva"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">WhatsApp (com DDD)</label>
            <input
              required
              disabled={isLoading}
              type="tel"
              className="w-full bg-white text-black border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-black"
              placeholder="Ex: 11999998888"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Endereço de Entrega</label>
            <textarea
              required
              disabled={isLoading}
              className="w-full bg-white text-black border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-black h-24 resize-none"
              placeholder="Rua, Número, Complemento, Bairro"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Forma de Pagamento</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'credit', label: 'Cartão Crédito' },
                { id: 'debit', label: 'Cartão Débito' },
                { id: 'pix', label: 'PIX' },
                { id: 'cash', label: 'Dinheiro' }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  disabled={isLoading}
                  onClick={() => setFormData({ ...formData, paymentMethod: method.id as any })}
                  className={`p-3 text-sm font-semibold border rounded transition ${formData.paymentMethod === method.id
                    ? 'bg-brand-black text-white border-brand-black'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-6 border-t flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total a pagar</p>
              <p className="text-2xl font-bold text-brand-botanic">R$ {total.toFixed(2)}</p>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-8 py-3 rounded font-bold uppercase tracking-wider hover:bg-green-700 transition flex items-center gap-2 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" /> Processando...
                </>
              ) : (
                <>
                  Enviar Pedido <Instagram size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 6. LOGIN MODAL
const LoginModal = ({ onClose, onSuccess }: { onClose: () => void, onSuccess: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setLoading(false);
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
      <div className="bg-white w-full max-w-sm relative p-8 rounded-lg shadow-2xl animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-black">
          <X size={20} />
        </button>

        <div className="text-center mb-6">
          <div className="inline-block p-3 rounded-full bg-brand-black text-white mb-3">
            <Lock size={24} />
          </div>
          <h2 className="font-display text-2xl font-bold uppercase">Área Restrita</h2>
          <p className="text-sm text-gray-500">Acesso exclusivo para administradores</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 text-center border border-red-100">
            {error === "Invalid login credentials" ? "E-mail ou senha incorretos." : error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full bg-white text-black border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full bg-white text-black border border-gray-300 p-3 rounded focus:outline-none focus:border-brand-black focus:ring-1 focus:ring-brand-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-black text-white py-3 font-bold uppercase hover:bg-brand-wood transition disabled:opacity-70 flex justify-center"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Entrar no Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
};

// 7. DASHBOARD (Integrated CRM)
const Dashboard = ({ onLogout, session }: { onLogout: () => void, session: Session }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [sales, setSales] = useState<DetailedSale[]>([]);
  const [heatmapData, setHeatmapData] = useState<HeatmapPoint[]>([]);

  // Filters
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    customer: '',
    category: '',
    product: '',
    minPrice: '',
    address: ''
  });

  useEffect(() => {
    // Load initial data
    setSales(generateMockSales(150));
    setHeatmapData(generateHeatmapData());
  }, []);

  // Filter Logic
  const filteredSales = sales.filter(sale => {
    const saleDate = sale.date.split('T')[0];
    const matchesDate = saleDate >= startDate && saleDate <= endDate;
    const matchesCustomer = sale.customerName.toLowerCase().includes(filters.customer.toLowerCase());
    const matchesCategory = sale.category.toLowerCase().includes(filters.category.toLowerCase());
    const matchesProduct = sale.product.toLowerCase().includes(filters.product.toLowerCase());
    const matchesAddress = sale.address.toLowerCase().includes(filters.address.toLowerCase());
    const matchesPrice = filters.minPrice ? sale.price >= Number(filters.minPrice) : true;

    return matchesDate && matchesCustomer && matchesCategory && matchesProduct && matchesAddress && matchesPrice;
  });

  // Aggregations
  const totalRevenue = filteredSales.reduce((acc, curr) => acc + curr.price, 0);
  const totalOrders = filteredSales.length;
  const uniqueCustomers = new Set(filteredSales.map(s => s.customerName)).size;
  const avgTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  const kpis = [
    { label: 'Faturamento', value: `R$ ${totalRevenue.toFixed(2)}`, color: 'text-green-500' },
    { label: 'Pedidos', value: totalOrders, color: 'text-blue-500' },
    { label: 'Clientes Únicos', value: uniqueCustomers, color: 'text-purple-500' },
    { label: 'Ticket Médio', value: `R$ ${avgTicket.toFixed(2)}`, color: 'text-brand-ocre' },
  ];

  // Chart Data Preparation
  const groupBy = (key: keyof DetailedSale) => {
    const counts: Record<string, number> = {};
    filteredSales.forEach(sale => {
      const val = String(sale[key]);
      counts[val] = (counts[val] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  };

  const categoryData = groupBy('category');
  const productData = groupBy('product').sort((a, b) => b.value - a.value).slice(0, 5);

  const COLORS = ['#8B5A2B', '#C9A227', '#4A6741', '#D97706', '#B45309'];

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 font-sans flex relative">
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white p-6 flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="font-display font-bold text-2xl tracking-widest mb-10">
          CRM<span className="text-brand-ocre">-SG</span>
        </div>
        <nav className="space-y-2 flex-grow">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-ocre/20 text-brand-ocre rounded font-bold border-l-4 border-brand-ocre">
            <LayoutDashboard size={20} /> Painel Geral
          </button>
          <div className="px-4 py-2 text-xs font-bold text-gray-500 uppercase mt-4">Analítico</div>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
            <TrendingUp size={20} /> Vendas
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white transition">
            <MapPin size={20} /> Mapa de Calor
          </button>
        </nav>
        <button onClick={onLogout} className="mt-auto flex items-center gap-2 text-red-400 hover:text-white transition">
          <LogOut size={16} /> Sair
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 md:ml-64 p-4 md:p-8 bg-gray-50 overflow-y-auto h-screen">
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 text-gray-600">
              <Menu size={24} />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Performance de Vendas</h1>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-3 py-1 rounded shadow-sm border">
            <Calendar size={14} /> {new Date().toLocaleDateString()}
          </div>
        </header>

        {/* Global Date Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 mb-6 flex flex-wrap gap-4 items-end">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Início</label>
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border rounded p-2 text-sm" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Data Fim</label>
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border rounded p-2 text-sm" />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {kpis.map((kpi, i) => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
              <p className="text-xs text-gray-500 font-bold uppercase">{kpi.label}</p>
              <h3 className={`text-2xl font-bold mt-1 ${kpi.color}`}>{kpi.value}</h3>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="font-bold mb-4 text-gray-800">Vendas por Categoria</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 h-80">
            <h3 className="font-bold mb-4 text-gray-800">Top 5 Produtos</h3>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={productData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5A2B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2">
            <MapPin size={18} className="text-red-500" /> Mapa de Calor de Vendas (Mês Atual)
          </h3>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="flex mb-1">
                <div className="w-8"></div>
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={h} className="flex-1 text-[10px] text-gray-400 text-center">{h}h</div>
                ))}
              </div>
              {Array.from({ length: 30 }).map((_, d) => {
                const day = d + 1;
                return (
                  <div key={day} className="flex mb-1 h-6">
                    <div className="w-8 text-xs text-gray-500 font-mono flex items-center justify-center">{day}</div>
                    {Array.from({ length: 24 }).map((_, h) => {
                      const point = heatmapData.find(p => p.dayIndex === day && p.hour === h);
                      const intensity = point ? point.intensity : 0;
                      // Red (Hot/High) -> Yellow (Cold/Low)
                      // High Intensity (1) -> R=255, G=0
                      // Low Intensity (0) -> R=255, G=255
                      const g = Math.floor(255 * (1 - intensity));
                      const color = `rgb(255, ${g}, 0)`;
                      const opacity = intensity * 0.8 + 0.2; // Ensure visible

                      return (
                        <div
                          key={h}
                          className="flex-1 mx-[1px] rounded-sm transition hover:scale-110"
                          style={{ backgroundColor: color, opacity }}
                          title={`Dia ${day} às ${h}h: Intensidade ${(intensity * 100).toFixed(0)}%`}
                        />
                      );
                    })}
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-end gap-2 mt-2 text-xs text-gray-500">
              <span className="w-3 h-3 bg-[rgb(255,255,0)] inline-block rounded-sm"></span> Menor Movimento
              <span className="w-3 h-3 bg-[rgb(255,0,0)] inline-block rounded-sm ml-2"></span> Maior Movimento
            </div>
          </div>
        </div>

        {/* Detailed Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row gap-4 justify-between items-end">
            <h3 className="font-bold text-gray-800">Detalhamento de Vendas</h3>
            <div className="flex gap-2">
              <input placeholder="Cliente..." className="p-2 text-sm border rounded w-32" value={filters.customer} onChange={e => setFilters({ ...filters, customer: e.target.value })} />
              <input placeholder="Categoria..." className="p-2 text-sm border rounded w-32" value={filters.category} onChange={e => setFilters({ ...filters, category: e.target.value })} />
            </div>
          </div>
          <div className="overflow-x-auto max-h-96">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-100 text-gray-600 font-bold sticky top-0">
                <tr>
                  <th className="p-3">Data/Hora</th>
                  <th className="p-3">Cliente</th>
                  <th className="p-3">WhatsApp</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Produto</th>
                  <th className="p-3">Valor</th>
                  <th className="p-3">Endereço</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredSales.map(sale => (
                  <tr key={sale.id} className="hover:bg-gray-50 transition">
                    <td className="p-3 text-gray-500">{new Date(sale.date).toLocaleString()}</td>
                    <td className="p-3 font-medium">{sale.customerName}</td>
                    <td className="p-3 text-gray-500">{sale.whatsapp}</td>
                    <td className="p-3"><span className="px-2 py-1 bg-gray-100 rounded text-xs uppercase font-bold">{sale.category}</span></td>
                    <td className="p-3">{sale.product}</td>
                    <td className="p-3 text-green-600 font-bold">R$ {sale.price.toFixed(2)}</td>
                    <td className="p-3 text-gray-500 max-w-xs truncate" title={sale.address}>{sale.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-3 bg-gray-50 text-xs text-gray-500 text-center border-t">
            Exibindo {filteredSales.length} registros
          </div>
        </div>
      </main>
    </div>
  );
};

// 8. MAIN APP ORCHESTRATOR
export default function App() {
  const [currentView, setCurrentView] = useState('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Auth State
  const [session, setSession] = useState<Session | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);

      // If user logs out while on dashboard, kick them out
      if (!session && currentView === 'dashboard') {
        setCurrentView('home');
      }
    });

    return () => subscription.unsubscribe();
  }, [currentView]);

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      if (session) {
        setCurrentView('dashboard');
      } else {
        setIsLoginOpen(true);
      }
    } else {
      setCurrentView(view);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentView('home');
  };

  // Cart Logic
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) return { ...item, quantity: Math.max(0, item.quantity + delta) };
      return item;
    }).filter(item => item.quantity > 0));
  };

  const handleCheckoutConfirm = async (data: OrderForm) => {
    setIsLoading(true);
    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    // 1. Prepare Supabase Data
    const orderPayload = {
      whatsapp: data.phone,
      nome: data.name,
      endereco: data.address,
      forma_pagamento: data.paymentMethod,
      valor_total: total,
      canal: 'site',
      created_at: new Date().toISOString()
    };

    try {
      // 2. Insert into 'orders'
      const { data: orderResult, error: orderError } = await supabase
        .from('orders')
        .insert([orderPayload])
        .select()
        .single();

      if (orderError) throw orderError;

      if (orderResult) {
        // 3. Prepare items
        const orderItems = cart.map(item => ({
          order_id: orderResult.id,
          produto: item.name,
          preco: item.price,
          quantidade: item.quantity,
          subtotal: item.price * item.quantity
        }));

        // 4. Insert into 'order_items'
        const { error: itemsError } = await supabase
          .from('order_items')
          .insert(orderItems);

        if (itemsError) throw itemsError;

        console.log("Order saved to Supabase:", orderResult.id);
      }

      // 5. Send to AI Webhook (Replacement for GPT Maker)
      // Generate Message (still useful for the payload)
      const itemsList = cart.map(i => `• ${i.quantity}x ${i.name}`).join('\n');
      const message = `*NOVO PEDIDO - SRA GASTRONOMIA* 🍽️\n\n` +
        `*Cliente:* ${data.name}\n` +
        `*WhatsApp:* ${data.phone}\n` +
        `*Endereço:* ${data.address}\n` +
        `*Pagamento:* ${data.paymentMethod.toUpperCase()}\n\n` +
        `*Pedido:*\n${itemsList}\n\n` +
        `*Total: R$ ${total.toFixed(2)}*`;

      // Call Webhook
      const aiResponse = await aiService.sendOrderToAI(
        {
          customer: { name: data.name, phone: data.phone, address: data.address },
          order: { items: cart, total, payment: data.paymentMethod },
          order_id: orderResult ? orderResult.id : 'temp-' + Date.now()
        },
        message
      );

      // Reset
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);

      // Display AI Response
      if (aiResponse && aiResponse.display_message) {
        alert(aiResponse.display_message);
      } else if (aiResponse && aiResponse.message) {
        // Fallback
        alert(aiResponse.message);
      } else {
        alert("Pedido recebido! Nossa IA processou seu pedido.");
      }

    } catch (error) {
      console.error("Error processing order:", error);
      // Show the specific error message to help debugging
      alert(`Houve um erro ao processar seu pedido: ${error instanceof Error ? error.message : JSON.stringify(error)}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'dashboard' && session) {
    return <Dashboard onLogout={handleLogout} session={session} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}
        session={session}
      />

      <main className="flex-grow">
        {currentView === 'home' && (
          <Hero onCtaClick={() => setCurrentView('menu')} />
        )}

        {(currentView === 'menu' || currentView === 'home') && (
          <div id="menu-section">
            <ProductList addToCart={addToCart} />
          </div>
        )}

        {currentView === 'events' && (
          <div className="py-20 text-center container mx-auto">
            <h2 className="text-3xl font-display font-bold">Eventos Privados</h2>
            <p className="mt-4 text-gray-600">Entre em contato para reservar o galpão.</p>
          </div>
        )}
      </main>

      {/* Footers */}
      <footer className="bg-brand-black text-white py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          <div>
            <div className="font-display font-bold text-xl mb-4 tracking-widest">SRA.GASTRONOMIA</div>
            <p className="text-gray-400">Cozinha autoral em ambiente industrial.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Contato</h4>
            <p className="flex items-center gap-2 mb-2"><Phone size={14} /> (11) 99999-9999</p>
            <p className="flex items-center gap-2"><MapPin size={14} /> Rua do Galpão, 123 - SP</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 uppercase">Horários</h4>
            <p className="text-gray-400">Ter - Sex: 18h - 23h</p>
            <p className="text-gray-400">Sáb - Dom: 12h - 23h</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-xs text-gray-500">
          <p>© 2024 Sra Gastronomia. All rights reserved.</p>
        </div>
      </footer>

      {/* Modals */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateQuantity}
        onCheckout={() => setIsCheckoutOpen(true)}
      />

      {isCheckoutOpen && (
        <CheckoutModal
          cart={cart}
          onClose={() => setIsCheckoutOpen(false)}
          onConfirm={handleCheckoutConfirm}
          isLoading={isLoading}
        />
      )}

      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onSuccess={() => {
            setIsLoginOpen(false);
            setCurrentView('dashboard');
          }}
        />
      )}
    </div>
  );
}