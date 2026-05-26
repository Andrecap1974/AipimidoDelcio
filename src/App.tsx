import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Phone,
  Sprout,
  MessageSquare,
  Award,
  Clock,
  MapPin,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck
} from 'lucide-react';

// Type definitions & Constants
import { Product, OrderItem, AppSettings, NeighborhoodDeliveryFee, OrderRecord } from './types';
import {
  INITIAL_PRODUCTS,
  INITIAL_NEIGHBORHOODS,
  INITIAL_SETTINGS,
  INITIAL_ORDERS
} from './constants';

// Clean Modular Components
import Header from './components/Header';
import Hero from './components/Hero';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import Footer from './components/Footer';
import { getWhatsAppUrl } from './utils/phone';

export default function App() {
  // --- STATE PERSISTENCE & CONTROL ---
  const [products, setProducts] = useState<Product[]>([]);
  const [settings, setSettings] = useState<AppSettings>(INITIAL_SETTINGS);
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodDeliveryFee[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [cart, setCart] = useState<OrderItem[]>([]);

  // Modal open controllers
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Load initial states from localStorage
  useEffect(() => {
    // 1. Products
    const storedProds = localStorage.getItem('edelcio_products');
    if (storedProds) {
      try {
        let parsedProds = JSON.parse(storedProds);
        let productsMigrated = false;
        if (Array.isArray(parsedProds)) {
          parsedProds = parsedProds.map((p: any) => {
            if (p.image && (p.image.includes('/src/assets/images/') || p.image.startsWith('/images/'))) {
              productsMigrated = true;
              let cleanImage = p.image;
              if (cleanImage.includes('/src/assets/images/')) {
                cleanImage = cleanImage.replace('/src/assets/images/', './images/');
              } else if (cleanImage.startsWith('/images/')) {
                cleanImage = cleanImage.replace('/images/', './images/');
              }
              return { ...p, image: cleanImage };
            }
            return p;
          });
        } else {
          parsedProds = INITIAL_PRODUCTS;
          productsMigrated = true;
        }
        setProducts(parsedProds);
        if (productsMigrated) {
          localStorage.setItem('edelcio_products', JSON.stringify(parsedProds));
        }
      } catch (e) {
        setProducts(INITIAL_PRODUCTS);
        localStorage.setItem('edelcio_products', JSON.stringify(INITIAL_PRODUCTS));
      }
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('edelcio_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    // 2. Settings
    const storedSettings = localStorage.getItem('edelcio_settings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (e) {
        setSettings(INITIAL_SETTINGS);
        localStorage.setItem('edelcio_settings', JSON.stringify(INITIAL_SETTINGS));
      }
    } else {
      setSettings(INITIAL_SETTINGS);
      localStorage.setItem('edelcio_settings', JSON.stringify(INITIAL_SETTINGS));
    }

    // 3. Neighborhoods
    const storedNeighs = localStorage.getItem('edelcio_neighborhoods');
    if (storedNeighs) {
      try {
        setNeighborhoods(JSON.parse(storedNeighs));
      } catch (e) {
        setNeighborhoods(INITIAL_NEIGHBORHOODS);
        localStorage.setItem('edelcio_neighborhoods', JSON.stringify(INITIAL_NEIGHBORHOODS));
      }
    } else {
      setNeighborhoods(INITIAL_NEIGHBORHOODS);
      localStorage.setItem('edelcio_neighborhoods', JSON.stringify(INITIAL_NEIGHBORHOODS));
    }

    // 4. Orders
    const storedOrders = localStorage.getItem('edelcio_orders');
    if (storedOrders) {
      try {
        setOrders(JSON.parse(storedOrders));
      } catch (e) {
        setOrders(INITIAL_ORDERS);
        localStorage.setItem('edelcio_orders', JSON.stringify(INITIAL_ORDERS));
      }
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('edelcio_orders', JSON.stringify(INITIAL_ORDERS));
    }

    // 5. Cart
    const storedCart = localStorage.getItem('edelcio_cart');
    if (storedCart) {
      try {
        let parsedCart = JSON.parse(storedCart);
        let cartMigrated = false;
        if (Array.isArray(parsedCart)) {
          parsedCart = parsedCart.map((item: any) => {
            if (item.product && item.product.image && (item.product.image.includes('/src/assets/images/') || item.product.image.startsWith('/images/'))) {
              cartMigrated = true;
              let cleanImage = item.product.image;
              if (cleanImage.includes('/src/assets/images/')) {
                cleanImage = cleanImage.replace('/src/assets/images/', './images/');
              } else if (cleanImage.startsWith('/images/')) {
                cleanImage = cleanImage.replace('/images/', './images/');
              }
              return {
                ...item,
                product: {
                  ...item.product,
                  image: cleanImage
                }
              };
            }
            return item;
          });
        } else {
          parsedCart = [];
          cartMigrated = true;
        }
        setCart(parsedCart);
        if (cartMigrated) {
          localStorage.setItem('edelcio_cart', JSON.stringify(parsedCart));
        }
      } catch (e) {
        setCart([]);
      }
    }
  }, []);

  // Set localStorage values on edits
  const handleUpdateProducts = (updatedProds: Product[]) => {
    setProducts(updatedProds);
    localStorage.setItem('edelcio_products', JSON.stringify(updatedProds));
  };

  const handleUpdateSettings = (updatedSett: AppSettings) => {
    setSettings(updatedSett);
    localStorage.setItem('edelcio_settings', JSON.stringify(updatedSett));
  };

  const handleUpdateNeighborhoods = (updatedNeighs: NeighborhoodDeliveryFee[]) => {
    setNeighborhoods(updatedNeighs);
    localStorage.setItem('edelcio_neighborhoods', JSON.stringify(updatedNeighs));
  };

  const handleUpdateOrders = (updatedOrd: OrderRecord[]) => {
    setOrders(updatedOrd);
    localStorage.setItem('edelcio_orders', JSON.stringify(updatedOrd));
  };

  const handleResetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setSettings(INITIAL_SETTINGS);
    setNeighborhoods(INITIAL_NEIGHBORHOODS);
    setOrders(INITIAL_ORDERS);
    setCart([]);
    
    localStorage.setItem('edelcio_products', JSON.stringify(INITIAL_PRODUCTS));
    localStorage.setItem('edelcio_settings', JSON.stringify(INITIAL_SETTINGS));
    localStorage.setItem('edelcio_neighborhoods', JSON.stringify(INITIAL_NEIGHBORHOODS));
    localStorage.setItem('edelcio_orders', JSON.stringify(INITIAL_ORDERS));
    localStorage.setItem('edelcio_cart', JSON.stringify([]));

    window.location.reload();
  };

  const handleForceImages = (type: 'relative' | 'online') => {
    const updated = products.map((prod) => {
      if (prod.id === 'aipim-com-casca') {
        return {
          ...prod,
          image: type === 'relative' 
            ? './images/aipim_com_casca_1779549507427.png' 
            : 'https://upload.wikimedia.org/wikipedia/commons/8/82/Cassava_roots.jpg'
        };
      } else if (prod.id === 'aipim-descascado') {
        return {
          ...prod,
          image: type === 'relative' 
            ? './images/aipim_descascado_1779549524886.png' 
            : 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Cassave_wortels.jpg'
        };
      }
      return prod;
    });
    setProducts(updated);
    localStorage.setItem('edelcio_products', JSON.stringify(updated));
  };

  // --- CART OPERATIONS ---
  const handleAddToCart = (product: Product, quantity: number) => {
    const qtyVal = Number(quantity) || 1;
    let newCart = [...cart];
    const existingIndex = newCart.findIndex((item) => item.product.id === product.id);

    if (existingIndex >= 0) {
      newCart[existingIndex].quantity = (Number(newCart[existingIndex].quantity) || 0) + qtyVal;
    } else {
      newCart.push({ product, quantity: qtyVal });
    }

    setCart(newCart);
    localStorage.setItem('edelcio_cart', JSON.stringify(newCart));
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number) => {
    const qtyVal = Number(quantity) || 1;
    const newCart = cart.map((item) =>
      item.product.id === productId ? { ...item, quantity: Math.max(1, qtyVal) } : item
    );
    setCart(newCart);
    localStorage.setItem('edelcio_cart', JSON.stringify(newCart));
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter((item) => item.product.id !== productId);
    setCart(newCart);
    localStorage.setItem('edelcio_cart', JSON.stringify(newCart));
  };

  const handleClearCart = () => {
    setCart([]);
    localStorage.setItem('edelcio_cart', JSON.stringify([]));
  };

  const handleOrderCompleted = (newOrder: OrderRecord) => {
    const nextOrdersList = [...orders, newOrder];
    handleUpdateOrders(nextOrdersList);
    handleClearCart();
  };

  // Smooth scroll handler
  const handleNavigateTo = (id: string) => {
    if (id === 'home' || id === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (id === 'pedido') {
      setIsCartOpen(true);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col font-sans selection:bg-earth selection:text-white">
      
      {/* 1. Header Navigation */}
      <Header
        onAdminClick={() => setIsAdminOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)}
        onNavigateTo={handleNavigateTo}
      />

      {/* 2. Hero Section */}
      <Hero
        onOrderNowClick={() => handleNavigateTo('produtos')}
        hours={settings.hours}
      />

      {/* 3. Core Products Listing */}
      <div className="relative">
        <ProductList
          products={products}
          onAddToCart={handleAddToCart}
          onForceImages={handleForceImages}
        />
      </div>

      {/* 4. Farmers Testimonial / Why Choose Section */}
      <section className="py-20 bg-cream/70 relative overflow-hidden text-center border-y border-clay/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/40 via-transparent to-transparent opacity-30 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="space-y-4 max-w-xl mx-auto">
            <h3 className="text-3xl font-serif font-black text-ink">
              O Segredo do Cozimento Perfeito
            </h3>
            <div className="h-1 w-16 bg-earth mx-auto rounded-full" />
            <p className="text-ink/80 text-sm leading-relaxed font-sans">
              O aipim do Edelcio é cultivado com adubação orgânica tradicional, colhido na época certa e descascado com higiene. Ele derrete ao cozinhar, perfeito para lanches, sopas ou acompanhamentos!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
            <div className="p-6 bg-white rounded-3xl border border-clay/10 space-y-3 shadow-sm hover:border-moss/40 hover:shadow-md transition-all text-center font-sans">
              <div className="w-12 h-12 bg-olive/10 text-olive border border-olive/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-ink text-sm">Cozimento Ágil</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Selecionamos apenas raízes jovens e macias. Cozinha incrivelmente rápido!
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-clay/10 space-y-3 shadow-sm hover:border-earth/40 hover:shadow-md transition-all text-center font-sans">
              <div className="w-12 h-12 bg-earth/10 text-earth border border-earth/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Clock className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-ink text-sm">Fresco e Sem Mudas</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Colhemos diretamente do solo e fatiamos no dia de sua entrega ou retirada!
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border border-clay/10 space-y-3 shadow-sm hover:border-moss/40 hover:shadow-md transition-all text-center font-sans">
              <div className="w-12 h-12 bg-moss/10 text-moss border border-moss/20 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Truck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-ink text-sm">Taxa Justa ou Isento</h4>
              <p className="text-xs text-ink/75 leading-relaxed">
                Entregamos em vários bairros de Novo Hamburgo ou retire diretamente conosco sem custo!
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 5. App Footer Contacts & Rights */}
      <Footer
        settings={settings}
        onAdminClick={() => setIsAdminOpen(true)}
      />

      {/* Floating interactive WhatsApp Launcher Button */}
      <motion.a
        href={getWhatsAppUrl(settings.phone)}
        target="_blank"
        rel="noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-30 p-4 bg-olive hover:bg-moss text-white rounded-full shadow-2xl border border-olive/20 flex items-center gap-2 group cursor-pointer"
        title="Falar com o Edelcio"
      >
        <Phone className="w-6 h-6 text-white animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-sans font-extrabold text-sm whitespace-nowrap leading-none text-white">
          Falar com Edelcio
        </span>
      </motion.a>

      {/* SHOPPING CART OVERLAY MODAL */}
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
        settings={settings}
        neighborhoods={neighborhoods}
        onOrderCompleted={handleOrderCompleted}
      />

      {/* ADMIN CONTROL PANEL OVERLAY MODAL */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        onUpdateProducts={handleUpdateProducts}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        neighborhoods={neighborhoods}
        onUpdateNeighborhoods={handleUpdateNeighborhoods}
        orders={orders}
        onUpdateOrders={handleUpdateOrders}
        onResetToDefaults={handleResetToDefaults}
      />

    </div>
  );
}
