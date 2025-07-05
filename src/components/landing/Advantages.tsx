
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Badge } from "@/components/ui/badge";
import { Check } from 'lucide-react';
export const Advantages = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  const advantages = ["Catálogo do estabelecimento dentro da plataforma", "Equipe de Monitoramento (07:30–00:00)", "Suporte Técnico Online", "Equipe de Marketing", "Treinamento passo a passo", "Equipe de Entregadores", "Consultor de Suporte Local", "Campanhas, Cupons, Promoções e Parcerias", "Flexibilidade na Entrega (própria ou Mais Delivery)"];
  return <section id="vantagens" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-[#A21C1C]">Vender mais é só o começo. Veja o que mais você ganha</h2>
        
        <p className="text-center text-[#1F2937] mb-8 max-w-3xl mx-auto">
          Mais do que uma plataforma — uma solução completa para o seu negócio crescer
        </p>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
            <iframe className="w-full h-64 md:h-96 rounded-lg" src="https://www.youtube.com/embed/mrQK78o7hUk" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
          </div>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {advantages.map((advantage, index) => <div key={index} className={`flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-sm transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{
          transitionDelay: `${index * 100}ms`
        }}>
              <div className="w-8 h-8 rounded-full bg-[#A21C1C]/10 flex items-center justify-center flex-shrink-0">
                <Check className={`w-4 h-4 text-[#F59F00] ${inView ? 'animate-pulse' : ''}`} />
              </div>
              <span className="text-[#1F2937]">{advantage}</span>
            </div>)}
        </div>
      </div>
    </section>;
};
