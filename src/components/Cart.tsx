import { useState, useMemo, FormEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ShoppingBag,
  Trash2,
  Phone,
  MapPin,
  ClipboardCheck,
  CheckCircle2,
  Coins,
  QrCode,
  DollarSign,
  Truck,
  Store,
  AlertTriangle,
  Copy
} from 'lucide-react';
import { Product, OrderItem, CustomerData, AppSettings, NeighborhoodDeliveryFee, OrderRecord } from '../types';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: OrderItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
  settings: AppSettings;
  neighborhoods: NeighborhoodDeliveryFee[];
  onOrderCompleted: (order: OrderRecord) => void;
}

export default function Cart({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  settings,
  neighborhoods,
  onOrderCompleted,
}: CartProps) {
  // Order completed visual state
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastOrderNumber, setLastOrderNumber] = useState('');
  const [copiedPix, setCopiedPix] = useState(false);

  // Form Field States
  const [customer, setCustomer] = useState<CustomerData>({
    name: '',
    phone: '',
    address: '',
    neighborhood: neighborhoods[0]?.name || '',
    city: 'Novo Hamburgo',
    cep: '',
    deliveryType: settings.deliveryEnabled ? 'delivery' : 'pickup',
    paymentMethod: 'pix',
    changeFor: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Ensure we have a default neighborhood selected when neighborhoods load or change
  useEffect(() => {
    const activeNeighs = neighborhoods.filter((n) => n.active);
    if (activeNeighs.length > 0) {
      const currentIsValid = activeNeighs.some(
        (n) => n.name.toLowerCase() === (customer.neighborhood || '').toLowerCase()
      );
      if (!currentIsValid) {
        setCustomer((prev) => ({
          ...prev,
          neighborhood: activeNeighs[0].name,
        }));
      }
    }
  }, [neighborhoods, customer.neighborhood]);

  // Subtotal calculation
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.product.pricePerKg * item.quantity), 0);
  }, [cartItems]);

  // Delivery Fee selection
  const deliveryFee = useMemo(() => {
    if (customer.deliveryType === 'pickup') return 0;
    const selectedBairro = neighborhoods.find(
      (n) => n.name.toLowerCase() === customer.neighborhood.toLowerCase() && n.active
    );
    return selectedBairro ? selectedBairro.fee : 0;
  }, [customer.deliveryType, customer.neighborhood, neighborhoods]);

  // Total calculation
  const grandTotal = useMemo(() => {
    return subtotal + deliveryFee;
  }, [subtotal, deliveryFee]);

  // Check minimum order rule
  const isBelowMinOrder = useMemo(() => {
    return subtotal > 0 && subtotal < settings.minOrderValue;
  }, [subtotal, settings.minOrderValue]);

  // Calculate dynamic change due
  const changeDue = useMemo(() => {
    if (customer.paymentMethod !== 'money' || !customer.changeFor) return 0;
    const cashValue = parseFloat(customer.changeFor.replace(',', '.'));
    if (isNaN(cashValue) || cashValue <= grandTotal) return 0;
    return cashValue - grandTotal;
  }, [customer.paymentMethod, customer.changeFor, grandTotal]);

  const handleInputChange = (field: keyof CustomerData, value: any) => {
    setCustomer(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleCopyPix = () => {
    navigator.clipboard.writeText(settings.pixKey);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 2000);
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    if (!customer.name.trim()) errors.name = 'Por favor, informe seu nome.';
    if (!customer.phone.trim()) errors.phone = 'Por favor, informe seu telefone/WhatsApp.';

    if (customer.deliveryType === 'delivery') {
      if (!customer.address.trim()) errors.address = 'O endereço é obrigatório para entrega.';
      if (!customer.neighborhood) errors.neighborhood = 'Escolha um bairro para entrega.';
      if (!customer.city.trim()) errors.city = 'A cidade é obrigatória.';
    }

    if (customer.paymentMethod === 'money' && customer.changeFor) {
      const parsedChange = parseFloat(customer.changeFor.replace(',', '.'));
      if (customer.changeFor.trim() && (isNaN(parsedChange) || parsedChange < grandTotal)) {
        errors.changeFor = `O valor do troco deve ser maior que o total (R$ ${grandTotal.toFixed(2)}).`;
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckout = (e: FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (isBelowMinOrder) return;
    if (!validateForm()) {
      // Smooth scroll to fields error
      const formEl = document.getElementById('checkout-form');
      formEl?.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    // Generate random / sequential simulated order ID
    const orderNo = `PED-${Math.floor(1000 + Math.random() * 9000)}`;
    setLastOrderNumber(orderNo);

    // Save order data in Local System
    const orderRecord: OrderRecord = {
      id: orderNo,
      customer: { ...customer },
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.pricePerKg,
      })),
      subtotal,
      deliveryFee,
      total: grandTotal,
      date: new Date().toISOString(),
      status: 'Pendente',
    };

    // Callback to save to localStorage and orders list
    onOrderCompleted(orderRecord);

    // Generate formatted text message for WhatsApp
    let itemSummaryText = '';
    cartItems.forEach((item) => {
      itemSummaryText += `• *${item.quantity} kg* de ${item.product.name} - R$ ${(item.product.pricePerKg * item.quantity).toFixed(2)}\n`;
    });

    const deliveryMethodLabel = customer.deliveryType === 'delivery' ? '🚗 Entrega em Casa' : '🏪 Retirada no Local';
    const paymentMethodLabel = customer.paymentMethod === 'pix' ? '📱 PIX' : '💵 Dinheiro';
    
    let changeSummary = '';
    if (customer.paymentMethod === 'money' && customer.changeFor) {
      const isNeedChange = parseFloat(customer.changeFor.replace(',', '.')) > grandTotal;
      changeSummary = isNeedChange 
        ? `\n   ↳ Precisa de troco para: R$ ${parseFloat(customer.changeFor.replace(',', '.')).toFixed(2)} (Troco: R$ ${changeDue.toFixed(2)})`
        : `\n   ↳ Não precisa de troco (Troco justo)`;
    }

    const formatMessage = `🌾 *NOVO PEDIDO - AIPIM DO EDELCIO* 🌾
---------------------------------------------
Olá, Edelcio! Gostaria de fazer o seguinte pedido pelo site (Chave: *${orderNo}*):

*ITENS DO PEDIDO:*
${itemSummaryText}
*RESUMO DOS VALORES:*
  Subtotal: R$ ${subtotal.toFixed(2)}
  ${customer.deliveryType === 'delivery' ? `Taxa de Entrega: R$ ${deliveryFee.toFixed(2)} (${customer.neighborhood})` : 'Taxa de Entrega: Isento (Retirada)'}
  *TOTAL PARCIAL:* *R$ ${grandTotal.toFixed(2)}*

*DADOS DO CLIENTE:*
  👤 Nome: ${customer.name}
  📞 WhatsApp: ${customer.phone}
  📍 Modo: ${deliveryMethodLabel}
${customer.deliveryType === 'delivery' ? `  🏠 Endereço: ${customer.address}
  🏡 Bairro: ${customer.neighborhood}
  🌆 Cidade: ${customer.city}
  ✉️ CEP: ${customer.cep || 'Não informado'}` : `  🏪 Ponto de Retirada: ${settings.address}`}

*FORMA DE PAGAMENTO:*
  ${paymentMethodLabel}${changeSummary}

---------------------------------------------
Aguardo a confirmação e o tempo de preparo! Muito obrigado!`;

    // Encode URL text
    const encodedText = encodeURIComponent(formatMessage);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${settings.phone}&text=${encodedText}`;

    // Open WhatsApp link
    window.open(whatsappUrl, '_blank');

    // Trigger success interface
    setIsSuccess(true);
    onClearCart();
  };

  const handleResetSuccess = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" aria-modal="true" role="dialog">
          {/* Dark overlay backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Right slide panel drawer container */}
          <div className="absolute inset-y-0 right-0 max-w-full pl-10 flex">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-screen max-w-lg bg-white border-l border-clay/15 text-ink flex flex-col shadow-2xl h-full font-sans"
            >
              {/* Header section of Cart panel */}
              <div className="px-6 py-6 border-b border-clay/10 bg-cream flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-earth animate-bounce" />
                  <h2 className="text-xl font-serif font-black text-ink leading-none">
                    Meu Pedido
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl hover:bg-cream text-ink/60 hover:text-ink cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Success checkout step */}
              {isSuccess ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 scale-150 bg-[#4A5D23]/10 rounded-full blur-xl" />
                    <CheckCircle2 className="w-20 h-20 text-olive relative z-10" />
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-2xl font-serif font-black text-ink">Pedido Enviado!</h3>
                    <p className="text-xs font-mono text-white font-bold uppercase tracking-wider bg-moss border border-olive px-3 py-1 rounded-full inline-block">
                      Código: {lastOrderNumber}
                    </p>
                    <p className="text-ink/80 text-sm max-w-xs mt-2 mx-auto leading-relaxed">
                      O seu pedido foi cadastrado no sistema do Edelcio e a janela para o WhatsApp foi aberta para você finalizar o envio!
                    </p>
                  </div>

                  <div className="p-4 bg-cream/40 rounded-2xl border border-clay/15 text-xs text-ink/80 text-left max-w-sm w-full space-y-1">
                    <span className="font-bold text-earth block mb-1">Próximos Passos:</span>
                    <p>1. Transmitir a mensagem gerada na conversa do WhatsApp.</p>
                    <p>2. O Edelcio irá confirmar o horário de entrega ou de retirada.</p>
                    <p>3. Feito! Em breve seu aipim delicioso estará na sua mesa.</p>
                  </div>

                  <button
                    onClick={handleResetSuccess}
                    className="w-full max-w-xs py-4 px-6 bg-earth hover:bg-clay text-white font-serif font-bold rounded-2xl border border-clay/20 shadow-md cursor-pointer transition-colors"
                  >
                    Fechar e Continuar Navegando
                  </button>
                </div>
              ) : (
                /* Standard cart interaction steps */
                <div className="flex-1 overflow-y-auto min-h-0 flex flex-col justify-between">
                  {cartItems.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="p-4 rounded-full bg-cream/40 border border-clay/10">
                        <ShoppingBag className="w-12 h-12 text-ink/40" />
                      </div>
                      <div>
                        <h3 className="text-lg font-serif font-bold text-ink/80">Seu carrinho está vazio</h3>
                        <p className="text-xs text-ink/65 mt-1 max-w-[240px] leading-relaxed">
                          Volte para a lista de produtos e escolha o tipo de aipim perfeito para sua refeição!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 space-y-8">
                      {/* Section Checklist of selected items */}
                      <div className="space-y-4">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#283618]/70 block border-b border-clay/10 pb-2 font-bold">
                          Itens Selecionados
                        </span>

                        <div className="space-y-3">
                          {cartItems.map((item) => (
                            <div
                              key={item.product.id}
                              className="flex gap-4 p-3 bg-cream/35 rounded-2xl border border-clay/10 items-center justify-between"
                            >
                              <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-12 h-12 object-cover rounded-xl border border-clay/10 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-serif font-bold text-ink truncate">
                                  {item.product.name}
                                </h4>
                                <span className="text-xs text-earth font-mono font-medium block">
                                  R$ {item.product.pricePerKg.toFixed(2)}/kg
                                </span>
                              </div>

                              {/* Simple Quantity update triggers inside cart */}
                              <div className="flex items-center gap-1.5 shrink-0">
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-clay/15 text-ink rounded-lg hover:border-moss hover:text-moss cursor-pointer text-xs disabled:opacity-40"
                                  disabled={item.quantity <= 1}
                                >
                                  -
                                </button>
                                <span className="w-8 text-center text-sm font-bold text-ink">
                                  {item.quantity} kg
                                </span>
                                <button
                                  onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                  className="w-7 h-7 flex items-center justify-center bg-white border border-clay/15 text-ink rounded-lg hover:border-moss hover:text-moss cursor-pointer text-xs"
                                >
                                  +
                                </button>

                                <button
                                  onClick={() => onRemoveItem(item.product.id)}
                                  className="p-1.5 text-ink/40 hover:text-red-500 hover:bg-red-50 rounded-lg cursor-pointer ml-1 transition-colors"
                                  title="Remover item"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Minimum Order Value Alert */}
                      {isBelowMinOrder && (
                        <div className="p-3 bg-[#DDA15E]/15 border border-[#BC6C25]/40 rounded-xl flex items-start gap-2.5 text-xs text-earth leading-relaxed font-semibold">
                          <AlertTriangle className="w-4 h-4 shrink-0 text-earth" />
                          <div>
                            <span className="font-bold text-[#BC6C25]">Valor mínimo não atingido:</span> O valor mínimo dos produtos para realizar o pedido é de <span className="font-bold text-earth">R$ {settings.minOrderValue.toFixed(2)}</span>. Adicione mais kg ao seu carrinho. (Subtotal atual: R$ {subtotal.toFixed(2)})
                          </div>
                        </div>
                      )}

                      {/* Checkout Information Form */}
                      <form id="checkout-form" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                        <span className="text-xs font-mono uppercase tracking-widest text-[#283618]/70 block border-b border-clay/10 pb-2 font-bold">
                          Dados de Entrega & Pagamento
                        </span>

                        {/* Delivery Type Selection */}
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            disabled={!settings.deliveryEnabled}
                            onClick={() => handleInputChange('deliveryType', 'delivery')}
                            className={`py-3 px-4 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                              !settings.deliveryEnabled
                                ? 'bg-cream/20 border-clay/5 text-ink/30 cursor-not-allowed'
                                : customer.deliveryType === 'delivery'
                                ? 'bg-olive/15 border-olive text-olive font-bold'
                                : 'bg-cream/40 border-clay/10 hover:border-clay/20 text-ink/80'
                            }`}
                          >
                            <Truck className="w-4 h-4" />
                            <span>Entrega em Casa</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleInputChange('deliveryType', 'pickup')}
                            className={`py-3 px-4 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                              customer.deliveryType === 'pickup'
                                ? 'bg-olive/15 border-olive text-olive font-bold'
                                : 'bg-cream/40 border-clay/10 hover:border-clay/20 text-ink/80'
                            }`}
                          >
                            <Store className="w-4 h-4" />
                            <span>Retirada Local</span>
                          </button>
                        </div>

                        {!settings.deliveryEnabled && (
                          <p className="text-[11px] text-earth font-mono text-center">
                            * A entrega em domicílio encontra-se temporariamente desativada.
                          </p>
                        )}

                        {/* Standard Inputs */}
                        <div className="space-y-4">
                          <div>
                            <label className="text-xs font-serif font-bold text-ink block mb-1">
                              Nome Completo *
                            </label>
                            <input
                              type="text"
                              required
                              value={customer.name}
                              onChange={(e) => handleInputChange('name', e.target.value)}
                              placeholder="Digite seu nome"
                              className={`w-full bg-cream/10 border rounded-xl px-4 py-3 text-sm focus:outline-none text-ink ${
                                formErrors.name ? 'border-red-500 focus:border-red-400' : 'border-clay/20 focus:border-olive'
                              }`}
                            />
                            {formErrors.name && (
                              <p className="text-red-500 text-[11px] mt-1">{formErrors.name}</p>
                            )}
                          </div>

                          <div>
                            <label className="text-xs font-serif font-bold text-ink block mb-1">
                              Telefone ou WhatsApp *
                            </label>
                            <input
                              type="tel"
                              required
                              value={customer.phone}
                              onChange={(e) => handleInputChange('phone', e.target.value)}
                              placeholder="Ex: (51) 99999-9999"
                              className={`w-full bg-cream/10 border rounded-xl px-4 py-3 text-sm focus:outline-none text-ink ${
                                formErrors.phone ? 'border-red-500 focus:border-red-400' : 'border-clay/20 focus:border-olive'
                              }`}
                            />
                            {formErrors.phone && (
                              <p className="text-red-500 text-[11px] mt-1">{formErrors.phone}</p>
                            )}
                          </div>

                          {/* Delivery-Only Fields */}
                          {customer.deliveryType === 'delivery' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="space-y-4"
                            >
                              <div>
                                <label className="text-xs font-serif font-bold text-ink block mb-1">
                                  Bairro Atendido *
                                </label>
                                <select
                                  value={customer.neighborhood}
                                  onChange={(e) => handleInputChange('neighborhood', e.target.value)}
                                  className="w-full bg-cream/20 border border-clay/15 rounded-xl px-4 py-3 text-sm focus:outline-none text-ink focus:border-olive"
                                >
                                  {neighborhoods
                                    .filter((n) => n.active)
                                    .map((neigh) => (
                                      <option key={neigh.id} value={neigh.name}>
                                        {neigh.name} (Taxa: R$ {neigh.fee.toFixed(2)})
                                      </option>
                                    ))}
                                </select>
                              </div>

                              <div>
                                <label className="text-xs font-serif font-bold text-ink block mb-1">
                                  Endereço Completo (Rua, Número, Ap) *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={customer.address}
                                  onChange={(e) => handleInputChange('address', e.target.value)}
                                  placeholder="Digite seu endereço para entrega"
                                  className={`w-full bg-cream/10 border rounded-xl px-4 py-3 text-sm focus:outline-none text-ink ${
                                    formErrors.address ? 'border-red-500 focus:border-red-400' : 'border-clay/20 focus:border-olive'
                                  }`}
                                />
                                {formErrors.address && (
                                  <p className="text-red-500 text-[11px] mt-1">{formErrors.address}</p>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="text-xs font-serif font-bold text-ink block mb-1">
                                    Cidade *
                                  </label>
                                  <input
                                    type="text"
                                    required
                                    value={customer.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    placeholder="Novo Hamburgo"
                                    className="w-full bg-cream/10 border border-clay/20 rounded-xl px-4 py-3 text-sm focus:outline-none text-ink"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs font-serif font-bold text-ink block mb-1">
                                    CEP
                                  </label>
                                  <input
                                    type="text"
                                    value={customer.cep}
                                    onChange={(e) => handleInputChange('cep', e.target.value)}
                                    placeholder="Ex: 90000-000"
                                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-sm focus:outline-none text-stone-100"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {customer.deliveryType === 'pickup' && (
                            <div className="p-4 bg-olive/10 border border-olive/20 rounded-2xl text-xs space-y-1.5">
                              <span className="font-bold text-olive flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5" /> Endereço de Retirada:
                              </span>
                              <p className="text-ink/90 leading-relaxed font-serif">
                                {settings.address}
                              </p>
                              <span className="text-ink/70 font-mono block pt-1">
                                Horário: {settings.hours}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Payment Selection Options */}
                        <div className="space-y-4 pt-2">
                          <label className="text-xs font-serif font-bold text-ink block">
                            Forma de Pagamento
                          </label>

                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => handleInputChange('paymentMethod', 'pix')}
                              className={`py-3 px-4 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                                customer.paymentMethod === 'pix'
                                  ? 'bg-olive/15 border-olive text-olive font-bold shadow-sm'
                                  : 'bg-cream/40 border-clay/10 hover:border-clay/20 text-ink/80'
                              }`}
                            >
                              <QrCode className="w-4 h-4" />
                              <span>PIX</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleInputChange('paymentMethod', 'money')}
                              className={`py-3 px-4 rounded-xl font-serif text-sm font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                                customer.paymentMethod === 'money'
                                  ? 'bg-olive/15 border-olive text-olive font-bold shadow-sm'
                                  : 'bg-cream/40 border-clay/10 hover:border-clay/20 text-ink/80'
                              }`}
                            >
                              <Coins className="w-4 h-4" />
                              <span>Dinheiro</span>
                            </button>
                          </div>

                          {/* PIX details display */}
                          {customer.paymentMethod === 'pix' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-4 bg-cream/40 border border-clay/10 rounded-2xl space-y-3"
                            >
                              <div className="flex justify-between items-start">
                                <div>
                                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#283618]/80 block font-bold">
                                    Tipo: {settings.pixType}
                                  </span>
                                  <span className="text-sm font-mono font-bold text-ink select-all block">
                                    {settings.pixKey}
                                  </span>
                                  <span className="text-[10px] text-ink/60 block mt-0.5 font-serif">
                                    Favorecido: {settings.pixKeyName}
                                  </span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={handleCopyPix}
                                  className="p-2 bg-white hover:bg-cream border border-clay/15 text-ink rounded-lg flex items-center gap-1 text-xs cursor-pointer transition-colors shrink-0"
                                >
                                  {copiedPix ? (
                                    <>
                                      <ClipboardCheck className="w-3.5 h-3.5 text-olive" />
                                      <span className="font-mono text-[10px]">Copiado</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3.5 h-3.5" />
                                      <span className="font-mono text-[10px]">Copiar</span>
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="flex gap-4 items-center bg-cream/10 p-3 rounded-xl border border-clay/10">
                                <div className="text-[11px] leading-relaxed text-ink/80 font-serif">
                                  <p className="font-bold text-earth">Pague agora ou na entrega / retirada.</p>
                                  <p>Transfira o valor exato no seu aplicativo do banco usando a chave PIX acima.</p>
                                </div>
                              </div>
                            </motion.div>
                          )}

                          {/* Cash Change logic display */}
                          {customer.paymentMethod === 'money' && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              className="p-4 bg-cream/40 border border-clay/10 rounded-2xl space-y-4"
                            >
                              <div>
                                <label className="text-xs font-serif font-bold text-ink block mb-1">
                                  Precisa de troco?
                                </label>
                                <div className="flex gap-4 items-center mt-1.5">
                                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                                    <input
                                      type="radio"
                                      name="need_change"
                                      checked={customer.changeFor !== undefined && customer.changeFor !== ''}
                                      onChange={() => handleInputChange('changeFor', '0')}
                                      className="accent-olive w-4 h-4 bg-white"
                                    />
                                    <span>Sim</span>
                                  </label>

                                  <label className="flex items-center gap-2 cursor-pointer text-sm font-semibold">
                                    <input
                                      type="radio"
                                      name="need_change"
                                      checked={customer.changeFor === ''}
                                      onChange={() => handleInputChange('changeFor', '')}
                                      className="accent-olive w-4 h-4 bg-white"
                                    />
                                    <span>Não, valor justo</span>
                                  </label>
                                </div>
                              </div>

                              {customer.changeFor !== '' && (
                                <div className="space-y-2">
                                  <label className="text-xs font-serif font-bold text-ink block mb-1">
                                    Troco para quanto em dinheiro? (R$)
                                  </label>
                                  <input
                                    type="text"
                                    value={customer.changeFor === '0' ? '' : customer.changeFor}
                                    onChange={(e) => handleInputChange('changeFor', e.target.value)}
                                    placeholder="Ex: 50.00 ou 100.00"
                                    className={`w-full bg-white border rounded-xl px-4 py-3 text-sm focus:outline-none text-ink ${
                                      formErrors.changeFor ? 'border-red-500 focus:border-red-400' : 'border-clay/20 focus:border-olive'
                                    }`}
                                  />
                                  {formErrors.changeFor && (
                                    <p className="text-red-500 text-[11px] mt-1">{formErrors.changeFor}</p>
                                  )}

                                  {changeDue > 0 && (
                                    <p className="text-olive text-xs font-mono font-bold bg-olive/10 border border-olive/25 p-2.5 rounded-lg">
                                      💸 Troco calculado para você: R$ {changeDue.toFixed(2)}
                                    </p>
                                  )}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </div>
                      </form>

                      {/* Recalcurated summary metrics display */}
                      <div className="pt-6 border-t border-clay/10 space-y-3 text-sm">
                        <div className="flex justify-between text-ink/80 font-serif">
                          <span>Subtotal dos produtos:</span>
                          <span className="font-mono font-bold">R$ {subtotal.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-ink/80 font-serif">
                          <span>Taxa de Entrega:</span>
                          <span className="font-mono font-bold">
                            {customer.deliveryType === 'pickup' ? (
                              <span className="text-olive font-serif font-bold">Grátis (Retirada)</span>
                            ) : (
                              `R$ ${deliveryFee.toFixed(2)}`
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between text-ink text-base font-bold bg-cream p-4 rounded-xl border border-clay/12">
                          <span className="font-serif">Total Geral:</span>
                          <span className="text-earth font-mono text-lg font-black">R$ {grandTotal.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Final Confirm Button */}
                      <button
                        onClick={handleCheckout}
                        disabled={isBelowMinOrder}
                        className={`w-full mt-4 py-4 px-6 rounded-2xl font-serif font-black text-base flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                          isBelowMinOrder
                            ? 'bg-cream border border-clay/10 text-ink/40 cursor-not-allowed shadow-none'
                            : 'bg-olive hover:bg-moss text-white border border-olive/10 shadow-md shadow-olive/10'
                        }`}
                      >
                        <Phone className="w-5 h-5 shrink-0" />
                        <span>Enviar Pedido pelo WhatsApp</span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
