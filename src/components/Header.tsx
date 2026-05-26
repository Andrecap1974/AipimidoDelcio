import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingBag, Settings, Sprout } from 'lucide-react';

interface HeaderProps {
  onAdminClick: () => void;
  onCartClick: () => void;
  cartCount: number;
  onNavigateTo: (id: string) => void;
}

export default function Header({
  onAdminClick,
  onCartClick,
  cartCount,
  onNavigateTo,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleMenuClick = (id: string) => {
    onNavigateTo(id);
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 text-ink backdrop-blur-md border-b border-clay/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleMenuClick('home')}>
            <div className="bg-olive p-2 rounded-xl text-white flex items-center justify-center border border-olive/10 shadow-inner">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-serif font-bold tracking-tight text-moss flex items-center gap-1">
                Aipim do <span className="text-earth">Edelcio</span>
              </h1>
              <p className="text-[10px] font-mono tracking-widest text-clay uppercase">
                Da Terra Pra Mesa
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={() => handleMenuClick('home')}
              className="hover:text-earth transition-colors text-ink/80 cursor-pointer"
            >
              Inicio
            </button>
            <button
              onClick={() => handleMenuClick('produtos')}
              className="hover:text-earth transition-colors text-ink/80 cursor-pointer"
            >
              Produtos
            </button>
            <button
              onClick={() => handleMenuClick('pedido')}
              className="hover:text-earth transition-colors text-ink/80 cursor-pointer"
            >
              Fazer Pedido
            </button>
            <button
              onClick={() => handleMenuClick('contato')}
              className="hover:text-earth transition-colors text-ink/80 cursor-pointer"
            >
              Contato
            </button>
          </nav>

          {/* Action Buttons & Hamburger */}
          <div className="flex items-center gap-3">
            {/* Cart Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onCartClick}
              className="relative p-2.5 bg-moss hover:bg-olive text-white rounded-xl flex items-center gap-2 border border-moss/10 transition-all font-sans cursor-pointer shadow-md"
              id="header-cart-btn"
            >
              <ShoppingBag className="w-5 h-5" />
              <span className="hidden sm:inline font-medium text-sm">Meu Pedido</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-earth text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  {cartCount}
                </span>
              )}
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-ink/80 hover:text-ink md:hidden cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-clay/10"
          >
            <div className="px-4 py-4 space-y-3 flex flex-col font-medium text-ink/80">
              <button
                onClick={() => handleMenuClick('home')}
                className="py-2.5 px-3 rounded-lg hover:bg-cream/40 hover:text-earth text-left transition-colors cursor-pointer"
              >
                Inicio
              </button>
              <button
                onClick={() => handleMenuClick('produtos')}
                className="py-2.5 px-3 rounded-lg hover:bg-cream/40 hover:text-earth text-left transition-colors cursor-pointer"
              >
                Produtos
              </button>
              <button
                onClick={() => handleMenuClick('pedido')}
                className="py-2.5 px-3 rounded-lg hover:bg-cream/40 hover:text-earth text-left transition-colors cursor-pointer"
              >
                Fazer Pedido
              </button>
              <button
                onClick={() => handleMenuClick('contato')}
                className="py-2.5 px-3 rounded-lg hover:bg-cream/40 hover:text-earth text-left transition-colors cursor-pointer"
              >
                Contato
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
