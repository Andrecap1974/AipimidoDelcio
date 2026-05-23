import { Phone, MapPin, Clock, Sprout, Heart } from 'lucide-react';
import { AppSettings } from '../types';

interface FooterProps {
  settings: AppSettings;
  onAdminClick: () => void;
}

export default function Footer({ settings, onAdminClick }: FooterProps) {
  return (
    <footer id="contato" className="bg-ink text-white/80 border-t border-olive/20 relative overflow-hidden">
      {/* Visual rural decorations */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,_var(--tw-gradient-stops))] from-olive/15 via-transparent to-transparent opacity-50 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          
          {/* Brand section */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-olive p-2 rounded-xl text-white flex items-center justify-center border border-olive/15 shadow-inner">
                <Sprout className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-serif font-black tracking-tight text-cream">
                Aipim do <span className="text-earth">Edelcio</span>
              </h3>
            </div>
            
            <p className="text-xs text-white/70 font-serif leading-relaxed max-w-sm">
              Trabalhamos duro e com carinho na lavoura para levar até você o melhor aipim da região. Selecionado, de cozimento rápido e sem conservantes!
            </p>

            <span className="text-xs text-cream/90 font-serif italic block pt-1 select-none">
              “Do campo direto para sua mesa”
            </span>
          </div>

          {/* Quick Contact Info */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FEFAE0] block">
              Contatos Rápidos
            </span>

            <div className="space-y-3.5 text-xs">
              <a
                href={`https://wa.me/${settings.phone}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 text-white/80 hover:text-cream transition-colors"
              >
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 text-cream">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-sans block text-white/70">WhatsApp para Pedidos</span>
                  <span className="font-mono font-bold text-cream">
                    (51) {settings.phone.slice(2, 7)}-{settings.phone.slice(7)}
                  </span>
                </div>
              </a>
            </div>
          </div>

          {/* Physical Address & Hours */}
          <div className="md:col-span-4 space-y-4">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FEFAE0] block">
              Funcionamento & Retirada
            </span>

            <div className="space-y-3.5 text-xs">
              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 text-cream mt-0.5">
                  <MapPin className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <span className="font-serif block text-white/70">Endereço de Retirada</span>
                  <p className="font-sans text-cream pt-0.5 leading-snug">
                    {settings.address}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1.5 rounded-lg bg-white/10 border border-white/10 text-cream mt-0.5">
                  <Clock className="w-4 h-4 shrink-0" />
                </div>
                <div>
                  <span className="font-serif block text-white/70">Horário de Atendimento</span>
                  <p className="font-mono text-cream pt-0.5 font-semibold">
                    {settings.hours}
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Lower row details */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs select-none">
          <div className="text-white/60 font-serif">
            &copy; {new Date().getFullYear()} Aipim do Edelcio. Todos os direitos reservados.
          </div>
          
          <div className="flex items-center gap-4 text-white/60 font-mono">
            <button
              onClick={onAdminClick}
              className="hover:text-cream transition-colors cursor-pointer border border-white/15 hover:border-white/20 px-2 py-1 rounded bg-white/5"
            >
              Acesso Restrito
            </button>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-white/50">
              Desenvolvido com <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 animate-pulse" /> para a Lavoura Familiar
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
