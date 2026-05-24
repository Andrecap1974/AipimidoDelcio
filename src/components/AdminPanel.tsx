import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Plus,
  Trash2,
  Edit2,
  Check,
  Settings,
  ShoppingBag,
  Truck,
  DollarSign,
  QrCode,
  FileSpreadsheet,
  TrendingUp,
  RotateCcw,
  User,
  MapPin,
  Clock,
  PhoneCall,
  Lock
} from 'lucide-react';
import { Product, AppSettings, NeighborhoodDeliveryFee, OrderRecord } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  neighborhoods: NeighborhoodDeliveryFee[];
  onUpdateNeighborhoods: (neighs: NeighborhoodDeliveryFee[]) => void;
  orders: OrderRecord[];
  onUpdateOrders: (orders: OrderRecord[]) => void;
  onResetToDefaults: () => void;
}

export default function AdminPanel({
  isOpen,
  onClose,
  products,
  onUpdateProducts,
  settings,
  onUpdateSettings,
  neighborhoods,
  onUpdateNeighborhoods,
  orders,
  onUpdateOrders,
  onResetToDefaults,
}: AdminPanelProps) {
  // Navigation tabs of Admin panel
  const [activeTab, setActiveTab] = useState<'pedidos' | 'produtos' | 'entregas' | 'contato_pix'>('pedidos');

  // Product Editing state variables
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    description: '',
    pricePerKg: 0,
    unit: 'kg',
    availableWeight: 0,
    image: '',
  });

  // Neighborhood adding state variables
  const [newNeighName, setNewNeighName] = useState('');
  const [newNeighFee, setNewNeighFee] = useState<number>(0);

  // Settings State changes
  const [localSettings, setLocalSettings] = useState<AppSettings>({ ...settings });

  // Handle edit product action trigger
  const handleEditProductClick = (prod: Product) => {
    setEditingProduct(prod);
    setProductForm({
      name: prod.name,
      description: prod.description,
      pricePerKg: prod.pricePerKg,
      unit: prod.unit,
      availableWeight: prod.availableWeight,
      image: prod.image,
    });
  };

  // Save edited or newly added product
  const handleSaveProduct = (e: FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || productForm.pricePerKg <= 0) return;

    if (editingProduct) {
      const updatedList = products.map((p) =>
        p.id === editingProduct.id ? { ...p, ...productForm } : p
      );
      onUpdateProducts(updatedList);
      setEditingProduct(null);
    } else if (isAddingProduct) {
      const newProd: Product = {
        id: `prod-${Date.now()}`,
        ...productForm,
      };
      // fallback placeholder if image empty
      if (!newProd.image) {
        newProd.image = 'https://picsum.photos/seed/aipim/640/480';
      }
      onUpdateProducts([...products, newProd]);
      setIsAddingProduct(false);
    }

    // reset local product template
    setProductForm({
      name: '',
      description: '',
      pricePerKg: 0,
      unit: 'kg',
      availableWeight: 0,
      image: '',
    });
  };

  const handleDeleteProduct = (prodId: string) => {
    if (confirm('Tem certeza que deseja excluir este produto?')) {
      onUpdateProducts(products.filter((p) => p.id !== prodId));
    }
  };

  // Add neighborhood delivey fee listing
  const handleAddNeighborhood = (e: FormEvent) => {
    e.preventDefault();
    if (!newNeighName.trim()) return;

    const newNeigh: NeighborhoodDeliveryFee = {
      id: `neigh-${Date.now()}`,
      name: newNeighName.trim(),
      fee: newNeighFee >= 0 ? newNeighFee : 0,
      active: true,
    };

    onUpdateNeighborhoods([...neighborhoods, newNeigh]);
    setNewNeighName('');
    setNewNeighFee(0);
  };

  const handleToggleNeigh = (neighId: string) => {
    const updated = neighborhoods.map((n) =>
      n.id === neighId ? { ...n, active: !n.active } : n
    );
    onUpdateNeighborhoods(updated);
  };

  const handleDeleteNeigh = (neighId: string) => {
    onUpdateNeighborhoods(neighborhoods.filter((n) => n.id !== neighId));
  };

  // Save Settings Changes
  const handleSettingsSubmit = (e: FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    alert('Configurações gerais salvas com sucesso!');
  };

  // Edit received Order status
  const handleUpdateOrderStatus = (orderId: string, status: OrderRecord['status']) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
    onUpdateOrders(updated);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('Deseja excluir este registro de pedido do painel?')) {
      onUpdateOrders(orders.filter((o) => o.id !== orderId));
    }
  };

  // Simple statistics
  const stats = {
    totalRevenue: orders
      .filter((o) => o.status === 'Entregue' || o.status === 'Pronto para Retirada')
      .reduce((acc, curr) => acc + curr.total, 0),
    totalDeliveries: orders.filter((o) => o.status !== 'Cancelado').length,
    pendingCount: orders.filter((o) => o.status === 'Pendente').length,
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Animated backdrop mask */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/90 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Core Panel Container Card */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-5xl bg-stone-900 border border-amber-900/10 text-stone-100 rounded-3xl overflow-hidden shadow-2xl relative z-10 flex flex-col max-h-[90vh] font-sans"
          >
            {/* Header section with password locks description */}
            <div className="px-6 py-5 bg-stone-950 border-b border-stone-850 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="bg-amber-955 p-2 rounded-xl border border-amber-800 text-amber-500">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-black text-amber-50 leading-none">
                    Controle Administrativo
                  </h2>
                  <p className="text-[10px] text-stone-400 font-mono mt-1">Admin Geral • Aipim do Edelcio</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={onResetToDefaults}
                  className="px-3 py-1.5 text-[11px] font-mono font-bold bg-amber-950/40 hover:bg-stone-850 text-amber-500 border border-amber-900/30 rounded-lg cursor-pointer transition-all"
                  title="Restaurar dados de simulação padrões"
                >
                  Resetar Padrões
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl hover:bg-stone-800 text-stone-400 hover:text-stone-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Admin Tabs Bar */}
            <div className="flex bg-stone-950/65 border-b border-stone-850 overflow-x-auto select-none shrink-0 scrollbar-none">
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-serif text-sm font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'pedidos'
                    ? 'border-amber-500 text-amber-400 bg-stone-900/20'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-850/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>Pedidos Recebidos ({orders.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('produtos')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-serif text-sm font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'produtos'
                    ? 'border-amber-500 text-amber-400 bg-stone-900/20'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-850/20'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 shrink-0" />
                <span>Produtos & Preços</span>
              </button>

              <button
                onClick={() => setActiveTab('entregas')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-serif text-sm font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'entregas'
                    ? 'border-amber-500 text-amber-400 bg-stone-900/20'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-850/20'
                }`}
              >
                <Truck className="w-4 h-4 shrink-0" />
                <span>Taxas & Bairros</span>
              </button>

              <button
                onClick={() => setActiveTab('contato_pix')}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 font-serif text-sm font-bold cursor-pointer whitespace-nowrap transition-all ${
                  activeTab === 'contato_pix'
                    ? 'border-amber-500 text-amber-400 bg-stone-900/20'
                    : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-stone-850/20'
                }`}
              >
                <Settings className="w-4 h-4 shrink-0" />
                <span>Contatos & PIX</span>
              </button>
            </div>

            {/* TAB PANELS CONTAINER */}
            <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-stone-900/40">
              
              {/* STATS OVERVIEW SECTION */}
              {activeTab === 'pedidos' && (
                <div className="space-y-6">
                  {/* Performance stats bento grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-stone-950 border border-stone-850 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block font-serif">Arrecadação Confirmada</span>
                        <span className="text-lg font-mono font-bold text-amber-400 mt-1 block">
                          R$ {stats.totalRevenue.toFixed(2)}
                        </span>
                      </div>
                      <TrendingUp className="w-8 h-8 text-amber-500/25 shrink-0" />
                    </div>

                    <div className="p-4 bg-stone-950 border border-stone-850 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block font-serif">Pedidos Cadastrados</span>
                        <span className="text-lg font-mono font-bold text-emerald-400 mt-1 block">
                          {stats.totalDeliveries}
                        </span>
                      </div>
                      <ShoppingBag className="w-8 h-8 text-emerald-500/25 shrink-0" />
                    </div>

                    <div className="p-4 bg-stone-950 border border-stone-850 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-xs text-stone-400 block font-serif">Pendentes para Aceite</span>
                        <span className="text-lg font-mono font-bold text-red-400 mt-1 block">
                          {stats.pendingCount}
                        </span>
                      </div>
                      <Clock className="w-8 h-8 text-red-500/25 shrink-0 animate-pulse" />
                    </div>
                  </div>

                  {/* Orders Table Feed */}
                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block border-b border-stone-800 pb-2">
                      Fila de Pedidos Realizados
                    </span>

                    {orders.length === 0 ? (
                      <div className="p-12 text-center bg-stone-950/30 rounded-2xl border border-stone-850">
                        <p className="text-stone-400 text-sm font-serif">Nenhum pedido recebido até o momento.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {[...orders].reverse().map((order) => (
                          <div
                            key={order.id}
                            className={`p-5 rounded-2xl border bg-stone-950/80 flex flex-col md:flex-row gap-5 items-stretch justify-between transition-all ${
                              order.status === 'Pendente'
                                ? 'border-amber-600/30 shadow-amber-900/5 shadow-md'
                                : order.status === 'Cancelado'
                                ? 'border-stone-850 opacity-60'
                                : 'border-stone-800'
                            }`}
                          >
                            {/* Lead details */}
                            <div className="space-y-3 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-mono font-bold text-amber-400">
                                  {order.id}
                                </span>
                                <span className="text-xs text-stone-400 font-mono">
                                  {new Date(order.date).toLocaleString('pt-BR')}
                                </span>
                                
                                <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-md ${
                                  order.status === 'Pendente' ? 'bg-amber-950 border border-amber-800 text-amber-400' :
                                  order.status === 'Preparando' ? 'bg-blue-950 border border-blue-800 text-blue-400' :
                                  order.status === 'Pronto para Retirada' ? 'bg-pink-950 border border-pink-850 text-pink-400' :
                                  order.status === 'Saiu para Entrega' ? 'bg-indigo-950 border border-indigo-800 text-indigo-400' :
                                  order.status === 'Entregue' ? 'bg-emerald-950 border border-emerald-800 text-emerald-400' :
                                  'bg-stone-900 text-stone-500'
                                }`}>
                                  {order.status}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                <div>
                                  <span className="text-[10px] text-stone-400 block font-serif">Cliente:</span>
                                  <p className="font-bold text-stone-200 flex items-center gap-1.5 pt-0.5">
                                    <User className="w-3.5 h-3.5 text-stone-500 shrink-0" />
                                    {order.customer.name}
                                  </p>
                                  <a
                                    href={`https://wa.me/${order.customer.phone}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-amber-400 hover:underline flex items-center gap-1 mt-1 font-mono hover:text-amber-300"
                                  >
                                    <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                                    {order.customer.phone}
                                  </a>
                                </div>

                                <div>
                                  <span className="text-[10px] text-stone-400 block font-serif">Logística:</span>
                                  <p className="font-semibold text-stone-300 flex items-start gap-1.5 pt-0.5 leading-tight">
                                    <MapPin className="w-3.5 h-3.5 text-stone-500 shrink-0 mt-0.5" />
                                    {order.customer.deliveryType === 'delivery' 
                                      ? `${order.customer.address}, Bairro: ${order.customer.neighborhood}`
                                      : 'Retirada Direta no Local'}
                                  </p>
                                </div>
                              </div>

                              {/* Items overview in order */}
                              <div className="bg-stone-950/50 p-3 rounded-xl border border-stone-900 text-xs text-stone-300">
                                <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 block mb-1">Itens do pedido:</span>
                                <div className="space-y-1">
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className="flex justify-between">
                                      <span>• {item.quantity} kg de {item.name}</span>
                                      <span className="font-mono text-stone-400">R$ {(item.price * item.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Summary price metrics and status edit trigger */}
                            <div className="flex flex-col justify-between items-stretch md:items-end gap-4 border-t md:border-t-0 md:border-l border-stone-850 pt-4 md:pt-0 md:pl-5 shrink-0 min-w-[200px]">
                              <div className="text-left md:text-right">
                                <span className="text-[10px] text-stone-400 block font-serif">Valor Total:</span>
                                <span className="text-xl font-mono font-black text-amber-400">
                                  R$ {order.total.toFixed(2)}
                                </span>
                                <span className="text-[9px] text-stone-500 block mt-0.5 font-mono uppercase">
                                  Pagamento: {order.customer.paymentMethod}
                                  {order.customer.changeFor && ` (Troco para R$ ${order.customer.changeFor})`}
                                </span>
                              </div>

                              <div className="space-y-2">
                                <label className="text-[10px] text-stone-400 block font-serif text-left md:text-right">Ações / Etapa atual:</label>
                                <div className="flex gap-2">
                                  <select
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value as OrderRecord['status'])}
                                    className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1.5 text-xs text-stone-200 outline-none focus:border-amber-500 cursor-pointer"
                                  >
                                    <option value="Pendente">Pendente</option>
                                    <option value="Preparando">Preparando</option>
                                    <option value="Pronto para Retirada">Pronto Retirada</option>
                                    <option value="Saiu para Entrega">Saiu para Entrega</option>
                                    <option value="Entregue">Entregue</option>
                                    <option value="Cancelado">Cancelado</option>
                                  </select>

                                  <button
                                    onClick={() => handleDeleteOrder(order.id)}
                                    className="p-1.5 bg-red-955 hover:bg-red-900 border border-red-900 text-red-400 rounded-lg cursor-pointer transition-colors"
                                    title="Excluir pedido"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* PRODUCTS CONFIG SECTION */}
              {activeTab === 'produtos' && (
                <div className="space-y-6">
                  {/* Buttons for creating new product */}
                  {!isAddingProduct && !editingProduct && (
                    <div className="flex justify-between items-center bg-stone-950/40 p-4 border border-stone-850 rounded-2xl">
                      <p className="text-xs text-stone-300 font-serif">
                        Clique ao lado para registrar um novo corte ou embalagem de aipim.
                      </p>
                      <button
                        onClick={() => {
                          setIsAddingProduct(true);
                          setEditingProduct(null);
                        }}
                        className="py-2 px-4 bg-emerald-800 hover:bg-emerald-700 text-stone-100 font-serif font-bold text-xs rounded-xl border border-emerald-600 cursor-pointer flex items-center gap-1"
                      >
                        <Plus className="w-4 h-4" /> Registrar Novo
                      </button>
                    </div>
                  )}

                  {/* Product Form Editor Block */}
                  {(isAddingProduct || editingProduct) && (
                    <div className="p-5 bg-stone-950 border border-amber-900/10 rounded-2xl space-y-4">
                      <h4 className="text-sm font-serif font-bold text-amber-100 flex items-center gap-1 border-b border-stone-850 pb-2">
                        <Edit2 className="w-4 h-4 text-amber-500" />
                        {editingProduct ? `Editando: ${editingProduct.name}` : 'Registrar Novo Produto de Aipim'}
                      </h4>

                      <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Título do Produto *</label>
                            <input
                              type="text"
                              required
                              value={productForm.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              placeholder="Ex: Aipim Congelado Macio"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Valor por kg (R$) *</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={productForm.pricePerKg === 0 ? '' : productForm.pricePerKg}
                              onChange={(e) => setProductForm({ ...productForm, pricePerKg: parseFloat(e.target.value) || 0 })}
                              placeholder="5.00"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Descrição Comercial</label>
                          <textarea
                            rows={2}
                            value={productForm.description}
                            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                            placeholder="Descreva a qualidade, se já vem descascado, etc."
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg p-3 text-stone-100 outline-none focus:border-amber-500"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Peso Disponível (kg) *</label>
                            <input
                              type="number"
                              required
                              value={productForm.availableWeight}
                              onChange={(e) => setProductForm({ ...productForm, availableWeight: parseInt(e.target.value) || 0 })}
                              placeholder="150"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                            />
                          </div>

                          <div>
                            <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">URL da Imagem do Produto</label>
                            <input
                              type="text"
                              value={productForm.image}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              placeholder="Ex: /src/assets/images/... ou URL pública"
                              className="w-full bg-stone-900 border border-stone-800 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 pre-tag"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-2 text-[11px] select-none">
                          <button
                            type="button"
                            onClick={() => {
                              setIsAddingProduct(false);
                              setEditingProduct(null);
                            }}
                            className="px-4 py-2 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-stone-300 rounded-lg cursor-pointer"
                          >
                            Cancelar
                          </button>
                          
                          <button
                            type="submit"
                            className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 rounded-lg font-bold border border-amber-450 cursor-pointer"
                          >
                            Salvar Alterações
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* List of current Products */}
                  <div className="space-y-3">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block border-b border-stone-800 pb-2">
                      Cardápio Ativo
                    </span>

                    {products.map((p) => (
                      <div
                        key={p.id}
                        className="p-4 bg-stone-950/70 border border-stone-850 rounded-2xl flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <img
                            src={p.image}
                            alt={p.name}
                            className="w-14 h-14 object-cover rounded-xl border border-stone-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="font-serif font-bold text-amber-5 or text-amber-100 text-sm">
                              {p.name}
                            </h4>
                            <p className="text-xs text-stone-400 line-clamp-1 mt-0.5 max-w-sm sm:max-w-md">
                              {p.description}
                            </p>
                            <div className="flex gap-4 items-center mt-1 text-[11px] font-mono text-stone-400">
                              <span>Sabor: <strong className="text-amber-400">R$ {p.pricePerKg.toFixed(2)}/kg</strong></span>
                              <span>Estoque: <strong className="text-emerald-400">{p.availableWeight} kg</strong></span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditProductClick(p)}
                            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 text-amber-400 p-2 rounded-lg cursor-pointer transition-colors"
                            title="Editar produto"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          
                          <button
                            disabled={products.length <= 1}
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-2 bg-stone-900 hover:bg-stone-800 border border-stone-800 disabled:opacity-40 disabled:cursor-not-allowed text-red-400 p-2 rounded-lg cursor-pointer transition-colors"
                            title="Excluir produto"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* OUT OF DELIVERY SECTION */}
              {activeTab === 'entregas' && (
                <div className="space-y-6 text-xs">
                  
                  {/* Delivery core metrics toggle */}
                  <div className="p-5 bg-stone-950 rounded-2xl border border-stone-850 space-y-4">
                    <span className="font-serif font-bold text-amber-100 text-sm block border-b border-stone-850 pb-2">
                      Configuração do Serviço de Entrega
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 leading-relaxed">
                      {/* Active status */}
                      <div className="space-y-1.5">
                        <span className="text-stone-450 font-serif">Status das Entregas</span>
                        <div className="flex gap-3 items-center pt-1">
                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, deliveryEnabled: true })}
                            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition-all cursor-pointer border ${
                              settings.deliveryEnabled
                                ? 'bg-emerald-950/50 border-emerald-500 text-emerald-400 shadow-md'
                                : 'bg-stone-900 border-stone-850 text-stone-400'
                            }`}
                          >
                            Habilitado
                          </button>

                          <button
                            type="button"
                            onClick={() => onUpdateSettings({ ...settings, deliveryEnabled: false })}
                            className={`px-4 py-2.5 rounded-xl font-bold font-serif transition-all cursor-pointer border ${
                              !settings.deliveryEnabled
                                ? 'bg-red-950/50 border-red-500 text-red-400 shadow-md'
                                : 'bg-stone-900 border-stone-850 text-stone-400'
                            }`}
                          >
                            Desativado
                          </button>
                        </div>
                        <span className="text-[10px] text-stone-500 block pt-1 leading-normal">
                          Se desativado, o carrinho forçará apenas a opção Retirada no Local.
                        </span>
                      </div>

                      {/* Minimum pricing */}
                      <div className="space-y-1.5">
                        <label className="text-stone-450 font-serif block">Valor Mínimo do Pedido (R$)</label>
                        <div className="flex gap-1.5 items-center pt-1">
                          <span className="bg-stone-900 px-3 py-2.5 rounded-lg border border-stone-850 text-stone-400 font-mono font-bold">R$</span>
                          <input
                            type="number"
                            step="0.01"
                            value={settings.minOrderValue}
                            onChange={(e) => onUpdateSettings({ ...settings, minOrderValue: parseFloat(e.target.value) || 0 })}
                            className="bg-stone-900 border border-stone-850 rounded-lg px-3 py-2.5 text-stone-100 outline-none focus:border-amber-500 font-mono text-sm max-w-[120px]"
                          />
                        </div>
                        <span className="text-[10px] text-stone-500 block pt-1 leading-normal">
                          O cliente não poderá fechar o pedido se os produtos somarem menos que este valor.
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Add and configure neighborhoods */}
                  <div className="space-y-4">
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-400 block border-b border-stone-800 pb-2">
                      Bairros Atendidos & Taxas de Entrega
                    </span>

                    {/* Quick Neighborhood Add Form */}
                    <form onSubmit={handleAddNeighborhood} className="flex flex-wrap gap-3 p-4 bg-stone-950/40 border border-stone-850 rounded-2xl items-end">
                      <div className="flex-1 min-w-[150px]">
                        <label className="text-[10px] text-stone-400 block mb-1 font-serif">Nome do Bairro</label>
                        <input
                          type="text"
                          required
                          value={newNeighName}
                          onChange={(e) => setNewNeighName(e.target.value)}
                          placeholder="Ex: Menino Deus"
                          className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] text-stone-400 block mb-1 font-serif">Taxa (R$)</label>
                        <input
                          type="number"
                          step="0.01"
                          required
                          value={newNeighFee === 0 ? '' : newNeighFee}
                          onChange={(e) => setNewNeighFee(parseFloat(e.target.value) || 0)}
                          placeholder="8.00"
                          className="bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 max-w-[100px] font-mono"
                        />
                      </div>

                      <button
                        type="submit"
                        className="py-2.5 px-4 bg-emerald-800 hover:bg-emerald-700 font-serif font-bold text-[11px] rounded-lg border border-emerald-600 cursor-pointer flex items-center gap-1 select-none text-stone-100"
                      >
                        <Plus className="w-3.5 h-3.5" /> Adicionar Bairro
                      </button>
                    </form>

                    {/* Neighborhoods List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4">
                      {neighborhoods.map((n) => (
                        <div
                          key={n.id}
                          className={`p-3.5 rounded-xl border bg-stone-950/60 flex items-center justify-between gap-3 ${
                            n.active ? 'border-stone-800' : 'border-stone-850 opacity-40'
                          }`}
                        >
                          <div>
                            <span className="font-serif font-bold text-stone-100 text-xs sm:text-sm block">
                              {n.name}
                            </span>
                            <span className="text-[11px] text-amber-400 font-mono mt-0.5 block">
                              Taxa: R$ {n.fee.toFixed(2)}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5 select-none shrink-0">
                            {/* Toggle active status */}
                            <button
                              onClick={() => handleToggleNeigh(n.id)}
                              className={`px-2 py-1 text-[10px] font-bold rounded-md border cursor-pointer ${
                                n.active
                                  ? 'bg-emerald-950/30 border-emerald-800 text-emerald-400'
                                  : 'bg-stone-900 border-stone-800 text-stone-500'
                              }`}
                            >
                              {n.active ? 'Ativo' : 'Inativo'}
                            </button>

                            {/* Delete neighborhood */}
                            <button
                              onClick={() => handleDeleteNeigh(n.id)}
                              className="p-1.5 bg-stone-900 hover:bg-stone-850 border border-stone-800 text-red-400 rounded-md cursor-pointer"
                              title="Remover bairro"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                  </div>
                </div>
              )}

              {/* CONTACTS AND PIX INFORMATION SECTION */}
              {activeTab === 'contato_pix' && (
                <div className="space-y-6 text-xs">
                  <form onSubmit={handleSettingsSubmit} className="space-y-6">
                    {/* General Settings */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-stone-850 space-y-4">
                      <span className="font-serif font-bold text-amber-100 text-sm block border-b border-stone-850 pb-2">
                        WhatsApp & Contato
                      </span>

                      <div>
                        <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Telefone WhatsApp (Apenas Números) *</label>
                        <input
                          type="text"
                          required
                          value={localSettings.phone}
                          onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value.replace(/[^0-9]/g, '') })}
                          placeholder="51999172765"
                          className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 font-mono"
                        />
                        <span className="text-[10px] text-stone-500 block pt-1">Preencha com o DDI (55) + DDD + Celular. Exemplo: 51999172765</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Horário de Atendimento Comercial</label>
                          <input
                            type="text"
                            value={localSettings.hours}
                            onChange={(e) => setLocalSettings({ ...localSettings, hours: e.target.value })}
                            placeholder="Segunda a Sábado das 08:00 às 18:00"
                            className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Endereço de Retirada</label>
                          <input
                            type="text"
                            value={localSettings.address}
                            onChange={(e) => setLocalSettings({ ...localSettings, address: e.target.value })}
                            placeholder="Rua Dublin, 968 - Canudos, Novo Hamburgo - RS"
                            className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* PIX Settings */}
                    <div className="p-5 bg-stone-950 rounded-2xl border border-stone-850 space-y-4">
                      <span className="font-serif font-bold text-amber-100 text-sm block border-b border-stone-850 pb-2">
                        Dados de Recebimento PIX
                      </span>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Chave Pix *</label>
                          <input
                            type="text"
                            required
                            value={localSettings.pixKey}
                            onChange={(e) => setLocalSettings({ ...localSettings, pixKey: e.target.value })}
                            placeholder="Chave pix"
                            className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Tipo de Chave *</label>
                          <input
                            type="text"
                            required
                            value={localSettings.pixType}
                            onChange={(e) => setLocalSettings({ ...localSettings, pixType: e.target.value })}
                            placeholder="Ex: Celular, CNPJ, E-mail"
                            className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-serif font-bold text-stone-300 block mb-1">Nome do Titular (Favorecido) *</label>
                          <input
                            type="text"
                            required
                            value={localSettings.pixKeyName}
                            onChange={(e) => setLocalSettings({ ...localSettings, pixKeyName: e.target.value })}
                            placeholder="Ex: Edelcio Joao Frohlich"
                            className="w-full bg-stone-900 border border-stone-850 rounded-lg px-3 py-2 text-stone-100 outline-none focus:border-amber-500"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2 select-none">
                      <button
                        type="submit"
                        className="py-3 px-6 bg-emerald-800 hover:bg-emerald-700 font-serif font-bold text-xs rounded-xl border border-emerald-600 cursor-pointer text-stone-100"
                      >
                        Salvar Informações do Negócio
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
