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
import { Product, CartItem, OrderForm } from './types';
import { PRODUCTS, KPIS, SALES_DATA, TOP_PRODUCTS } from './constants';
import { supabase } from './supabaseClient';
// import { Session } from '@supabase/supabase-js'; // No longer needed for simplified login

// --- COMPONENTS ---

// 1. HEADER
const Header = ({ 
  cartCount, 
  onOpenCart, 
  onNavigate,
  isLoggedIn
}: { 
  cartCount: number; 
  onOpenCart: () => void; 
  onNavigate: (view: string) => void;
  isLoggedIn: boolean;
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
          className={`w-9 h-9 flex items-center justify-center rounded-full font-display font-bold text-xs transition shadow-sm border border-gray-800 ${
            isLoggedIn 
            ? 'bg-green-600 text-white hover:bg-green-700' 
            : 'bg-brand-black text-white hover:bg-brand-wood'
          }`}
          title={isLoggedIn ? "Acessar Painel" : "Login Administrativo"}
        >
          {isLoggedIn ? <User size={16} /> : 'SA'}
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
        Restaurante e Lanchonete <br/> <span className="text-brand-ocre">Aqui e na sua casa</span>
      </h1>
      <p className="text-gray-300 max-w-lg mb-10 text-lg md:text-xl font-light">
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
              className={`px-4 py-2 text-sm font-bold uppercase tracking-wider border transition whitespace-nowrap ${
                filter === cat 
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
              onChange={e => setFormData({...formData, name: e.target.value})}
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
              onChange={e => setFormData({...formData, phone: e.target.value})}
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
              onChange={e => setFormData({...formData, address: e.target.value})}
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
                  onClick={() => setFormData({...formData, paymentMethod: method.id as any})}
                  className={`p-3 text-sm font-semibold border rounded transition ${
                    formData.paymentMethod === method.id 
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
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate a successful login without actual authentication
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 500);
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

        <form onSubmit={handleLogin} className="space-y-4">
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

// 7. DASHBOARD (Internal)
const Dashboard = ({ isLoggedIn }: { isLoggedIn: boolean }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const COLORS = ['#8B5A2B', '#C9A227', '#4A6741', '#1A1A1A'];
  
  // Custom Heatmap Grid simulation
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const hours = Array.from({length: 12}, (_, i) => i + 11); // 11h to 22h

  return (
    <div className="min-h-screen bg-brand-dark text-gray-100 font-sans flex relative">
      
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Responsive Logic */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 p-6 flex flex-col transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0
      `}>
        <div className="flex justify-between items-center mb-10">
          <div className="font-display font-bold text-2xl tracking-widest text-white">
            SRA<span className="text-brand-ocre">.</span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <div className="mb-6 px-4 py-3 bg-gray-800 rounded border border-gray-700">
           <p className="text-xs text-gray-400 uppercase font-bold mb-1">Usuário Logado</p>
           <p className="text-sm text-white truncate">Administrador</p>
        </div>
        
        <nav className="space-y-2 flex-grow">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-brand-ocre/10 text-brand-ocre rounded font-medium">
            <LayoutDashboard size={20} /> Visão Geral
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition">
            <Package size={20} /> Produtos
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition">
            <Users size={20} /> Clientes
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-400 hover:bg-gray-800 hover:text-white rounded transition">
            <TrendingUp size={20} /> Vendas
          </button>
        </nav>


      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden ml-0 md:ml-64 p-4 md:p-8">
        <header className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-gray-400 hover:text-white bg-gray-800 rounded"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard Comercial</h1>
              <p className="text-gray-400 text-sm">Atualizado em: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          <div className="flex gap-4">
             <div className="bg-gray-800 px-4 py-2 rounded text-sm flex items-center gap-2 w-full md:w-auto justify-center">
                <Calendar size={16} /> Últimos 30 dias
             </div>
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {KPIS.map((kpi, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-lg border border-gray-700">
              <p className="text-gray-400 text-sm font-medium mb-1">{kpi.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold text-white">{kpi.value}</h3>
                <span className={`text-sm font-bold flex items-center ${kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                  {kpi.trend === 'up' ? '+' : ''}{kpi.change}%
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Sales Chart */}
          <div className="lg:col-span-2 bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-bold mb-6">Vendas vs Período</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SALES_DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }}
                  />
                  <Bar dataKey="value" fill="#C9A227" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Products Pie */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h3 className="text-lg font-bold mb-4">Top Produtos</h3>
            <div className="h-64 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={TOP_PRODUCTS}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="sales"
                  >
                    {TOP_PRODUCTS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="mt-4 space-y-2">
                {TOP_PRODUCTS.map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                      <span className="text-gray-300">{p.name}</span>
                    </div>
                    <span className="font-bold text-white">{p.sales}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Heatmap Section */}
        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
            <MapPin size={18} className="text-brand-ocre" /> Mapa de Calor (Horário de Pico)
          </h3>
          <div className="overflow-x-auto custom-scrollbar">
            <div className="min-w-[600px]">
              <div className="flex mb-2">
                <div className="w-12"></div>
                {hours.map(h => (
                  <div key={h} className="flex-1 text-center text-xs text-gray-500 font-mono">
                    {h}h
                  </div>
                ))}
              </div>
              {days.map((day, dIdx) => (
                <div key={day} className="flex items-center mb-2">
                  <div className="w-12 text-xs font-bold text-gray-400">{day}</div>
                  {hours.map((_, hIdx) => {
                    // Simulate random intensity
                    const intensity = Math.random();
                    let bgClass = 'bg-gray-700'; // low
                    if (intensity > 0.6) bgClass = 'bg-yellow-900/40';
                    if (intensity > 0.8) bgClass = 'bg-brand-ocre/60';
                    if (intensity > 0.9) bgClass = 'bg-brand-ocre';
                    
                    return (
                      <div key={hIdx} className="flex-1 px-1">
                        <div 
                          className={`h-8 w-full rounded-sm ${bgClass} hover:ring-1 ring-white transition cursor-pointer`}
                          title={`${day} às ${hours[hIdx]}h`}
                        ></div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  useEffect(() => {
    // No longer using Supabase session for dashboard access
    // The isLoggedIn state is managed by the LoginModal's onSuccess callback
  }, []);

  const handleNavigate = (view: string) => {
    if (view === 'dashboard') {
      if (isLoggedIn) {
        setCurrentView('dashboard');
      } else {
        setIsLoginOpen(true);
      }
    } else {
      setCurrentView(view);
    }
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

      // 5. Redirect to GPT Maker (only if successful DB save)
      // Generate Message
      const itemsList = cart.map(i => `• ${i.quantity}x ${i.name}`).join('\n');
      const message = `*NOVO PEDIDO - SRA GASTRONOMIA* 🍽️\n\n` +
        `*Cliente:* ${data.name}\n` +
        `*WhatsApp:* ${data.phone}\n` +
        `*Endereço:* ${data.address}\n` +
        `*Pagamento:* ${data.paymentMethod.toUpperCase()}\n\n` +
        `*Pedido:*\n${itemsList}\n\n` +
        `*Total: R$ ${total.toFixed(2)}*`;

      const encodedMessage = encodeURIComponent(message);
      const gptMakerUrl = `https://app.gptmaker.ai/widget/3E85F2A3DA4031A6D17E8A7F6D386327/iframe?message=${encodedMessage}`;

      // Open GPT Maker
      window.open(gptMakerUrl, '_blank');
      
      // Reset
      setCart([]);
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      alert("Pedido realizado e salvo com sucesso! Redirecionando para atendimento...");

    } catch (error) {
      console.error("Error processing order:", error);
      alert("Houve um erro ao processar seu pedido no sistema. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (currentView === 'dashboard') {
    return <Dashboard isLoggedIn={isLoggedIn} />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)}
        onNavigate={handleNavigate}

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
            <p className="flex items-center gap-2 mb-2"><Phone size={14}/> (11) 99999-9999</p>
            <p className="flex items-center gap-2"><MapPin size={14}/> Rua do Galpão, 123 - SP</p>
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