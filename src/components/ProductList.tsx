import { useState } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ChevronRight, Plus, Minus, Wheat, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductListProps {
  products: Product[];
  onAddToCart: (product: Product, quantity: number) => void;
}

export default function ProductList({ products, onAddToCart }: ProductListProps) {
  // Store quantities for each product locally before adding to cart
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  const handleQtyChange = (productId: string, delta: number) => {
    const current = quantities[productId] || 1;
    const next = Math.max(1, current + delta);
    setQuantities({ ...quantities, [productId]: next });
  };

  const handleManualQtyChange = (productId: string, value: string) => {
    const parsed = parseInt(value, 10);
    const next = isNaN(parsed) || parsed < 1 ? 1 : parsed;
    setQuantities({ ...quantities, [productId]: next });
  };

  const handleAddClick = (product: Product) => {
    const qty = quantities[product.id] || 1;
    onAddToCart(product, qty);
    
    // Animate a success state on the specific product button
    setAddedItems({ ...addedItems, [product.id]: true });
    setTimeout(() => {
      setAddedItems(prev => ({ ...prev, [product.id]: false }));
    }, 2000);
  };

  return (
    <section id="produtos" className="py-16 bg-paper text-ink relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cream/60 via-transparent to-transparent opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-olive/10 text-olive rounded-full text-xs font-mono uppercase tracking-wider border border-olive/20">
            <Wheat className="w-3.5 h-3.5" />
            <span>Colheita do Dia</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-ink tracking-tight">
            Nossos Aipins Selecionados
          </h2>
          <div className="h-1 w-24 bg-earth mx-auto rounded-full" />
          <p className="text-sm sm:text-base text-ink/80">
            Aipim fresquinho de excelente cozimento, amora e maciez. Embalado no capricho direto do "Edelcio" para sua família!
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
          {products.map((product) => {
            const qty = quantities[product.id] || 1;
            const isAdded = !!addedItems[product.id];

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-clay/15 hover:border-moss/35 transition-all shadow-md hover:shadow-xl hover:-translate-y-1 relative"
              >
                {/* Product Image Section */}
                <div className="relative aspect-4/3 overflow-hidden bg-cream/40">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  
                  {/* Stock Badge */}
                  <div className="absolute top-4 right-4 bg-white/90 text-olive border border-olive/20 px-3 py-1.5 rounded-xl font-mono text-xs select-none backdrop-blur-md font-bold">
                    Disponível: <span className="font-bold text-moss">{product.availableWeight} kg</span>
                  </div>

                  {/* Pricing Badge (float over image) */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-black/0 flex items-end justify-between">
                    <span className="text-2xl font-serif font-black text-white">
                      R$ {product.pricePerKg.toFixed(2)}
                      <span className="text-xs text-white/80 font-sans font-normal lowercase select-none"> / {product.unit}</span>
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-ink group-hover:text-moss transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-ink/80 leading-relaxed min-h-[48px]">
                      {product.description}
                    </p>
                  </div>

                  {/* Quantity and Checkout interaction */}
                  <div className="pt-4 border-t border-clay/10 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs font-mono uppercase tracking-widest text-[#283618]/70 select-none font-bold">
                        Quantidade (kg)
                      </span>
                      
                      {/* Counter Controls */}
                      <div className="flex items-center gap-1 bg-cream/50 p-1.5 rounded-xl border border-clay/10">
                        <button
                          onClick={() => handleQtyChange(product.id, -1)}
                          className="w-9 h-9 flex items-center justify-center bg-white border border-clay/15 text-ink hover:text-earth rounded-lg cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                          disabled={qty <= 1}
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        
                        <input
                          type="text"
                          inputMode="numeric"
                          value={qty}
                          onChange={(e) => handleManualQtyChange(product.id, e.target.value)}
                          className="w-12 text-center font-bold text-ink bg-transparent border-0 focus:ring-0 text-sm focus:outline-none"
                        />
                        
                        <button
                          onClick={() => handleQtyChange(product.id, 1)}
                          className="w-9 h-9 flex items-center justify-center bg-white border border-clay/15 text-ink hover:text-earth rounded-lg cursor-pointer transition-colors disabled:opacity-40"
                          disabled={qty >= product.availableWeight}
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Add to order button */}
                    <button
                      onClick={() => handleAddClick(product)}
                      disabled={product.availableWeight <= 0}
                      className={`w-full py-4 px-6 rounded-2xl font-serif font-bold text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md active:scale-[0.98] ${
                        product.availableWeight <= 0
                          ? 'bg-cream border border-clay/10 text-[#283618]/45 cursor-not-allowed shadow-none'
                          : isAdded
                          ? 'bg-moss hover:bg-olive text-white border border-moss/10 shadow-md'
                          : 'bg-olive hover:bg-moss text-white border border-olive/10 shadow-md'
                      }`}
                    >
                      {isAdded ? (
                        <>
                          <Check className="w-5 h-5 animate-bounce" />
                          <span>Adicionado ao Pedido!</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag className="w-5 h-5" />
                          <span>Adicionar {qty} kg ao Pedido</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
