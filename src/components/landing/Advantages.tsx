
import React from 'react';
import { Check } from 'lucide-react';

export const Advantages = () => {
  const advantages = ["Catálogo do estabelecimento dentro da plataforma", "Equipe de Monitoramento (07:30–00:00)", "Suporte Técnico Online", "Equipe de Marketing", "Treinamento passo a passo", "Equipe de Entregadores", "Consultor de Suporte Local", "Campanhas, Cupons, Promoções e Parcerias", "Flexibilidade na Entrega (própria ou Mais Delivery)"];
  
  return (
    <section id="vantagens" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">Vender mais é só o começo. Veja o que mais você ganha</h2>
        
        <p className="text-center text-[#1F2937] mb-8 max-w-3xl mx-auto">
          Mais do que uma plataforma — uma solução completa para o seu negócio crescer
        </p>

        <div className="max-w-3xl mx-auto mb-12">
          <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden shadow-lg">
            <iframe className="w-full h-64 md:h-96 rounded-lg" src="https://www.youtube.com/embed/mrQK78o7hUk" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="flex items-center gap-3 bg-white rounded-full px-4 py-3 shadow-sm transition-all duration-500"
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Check className="w-4 h-4 text-accent-cta" />
              </div>
              <span className="text-[#1F2937]">{advantage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
