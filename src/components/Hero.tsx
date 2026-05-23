import { motion } from 'motion/react';
import { Leaf, Award, Compass, ShoppingBag } from 'lucide-react';

interface HeroProps {
  onOrderNowClick: () => void;
  title?: string;
  subtitle?: string;
  hours?: string;
}

export default function Hero({
  onOrderNowClick,
  title = 'Aipim Fresquinho Direto da Lavoura para sua Casa',
  subtitle = 'Mandioca selecionada, colhida no capricho com as melhores raízes da nossa agricultura familiar. Macio, cozinha rápido e tem sabor de verdade!',
  hours = 'Segunda a Sábado das 08:00 às 18:00',
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-ink text-white py-16 md:py-28 lg:py-36">
      {/* Background Graphic Content */}
      <div className="absolute inset-0 z-0 bg-ink">
        <img
          src="/images/mandioca_hero_1779549488591.png"
          alt="Lavoura e Aipim do Edelcio"
          className="w-full h-full object-cover opacity-25 select-none scale-105 transform motion-safe:animate-[pulse_10s_infinite]"
          referrerPolicy="no-referrer"
        />
        {/* Organic Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-moss/60 to-ink/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/70 via-transparent to-ink/70" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Main Visual Typography Column */}
          <div className="lg:col-span-7 space-y-8 text-left">
            
            {/* Organic Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-olive/30 border border-olive/40 text-cream rounded-full text-xs font-mono uppercase tracking-wider"
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>Colheita Direta da Horta</span>
            </motion.div>

            {/* Main Headline */}
            <div className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-serif font-black tracking-tight leading-tight text-white"
              >
                Aipim do <span className="text-[#FEFAE0] underline decoration-earth/55 underline-offset-8">Edelcio</span>
              </motion.h2>
              <motion.h3
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl sm:text-2xl font-serif text-cream/90 leading-snug font-medium"
              >
                {title}
              </motion.h3>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-sm sm:text-base md:text-lg max-w-xl font-sans leading-relaxed"
            >
              {subtitle}
            </motion.p>

            {/* Interactive Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 pt-2"
            >
              <button
                onClick={onOrderNowClick}
                className="flex items-center gap-2.5 px-8 py-4 bg-earth hover:bg-clay text-white font-sans font-bold text-base rounded-xl border border-clay/20 shadow-xl transition-all cursor-pointer hover:shadow-earth/10 active:scale-95 group"
              >
                <ShoppingBag className="w-5 h-5 text-white group-hover:translate-x-0.5 transition-transform" />
                <span>Escolher Meus Produtos</span>
              </button>
              
              <div className="text-left py-2 font-mono text-xs text-cream/70 flex flex-col gap-0.5 border-l-2 border-olive/30 pl-4">
                <span className="text-cream font-semibold flex items-center gap-1">
                  🌐 Novo Hamburgo & Região
                </span>
                <span>{hours}</span>
              </div>
            </motion.div>
          </div>

          {/* Feature Grid Column */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-5 rounded-2xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all flex items-start gap-4"
            >
              <div className="bg-earth p-3 rounded-xl text-white border border-clay/35 shadow-inner">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base">Cozimento Perfeito</h4>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Aipim selecionado manualmente. Derrete na boca e é ideal para fritar ou cozinhar com aquela carne de panela.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-5 rounded-2xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all flex items-start gap-4"
            >
              <div className="bg-olive p-3 rounded-xl text-cream border border-olive/20 shadow-inner">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base">Agricultura Familiar</h4>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Cultivado com adubo natural e respeito à terra, apoiando a lavoura familiar tradicional.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="p-5 rounded-2xl bg-white/10 border border-white/10 shadow-lg backdrop-blur-sm hover:border-white/20 transition-all flex items-start gap-4 sm:col-span-2 lg:col-span-1"
            >
              <div className="bg-white/20 p-3 rounded-xl text-cream border border-white/20 shadow-inner">
                <Compass className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-white text-base">Selecione e Prontinho</h4>
                <p className="text-xs text-white/80 mt-1 leading-relaxed">
                  Sem burocracia: monte seu pedido, preencha seus dados de entrega e nos envie no WhatsApp para combinarmos!
                </p>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </section>
  );
}
