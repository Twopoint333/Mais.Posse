import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Advantages = () => {
  const advantages = [
    "Catálogo do estabelecimento dentro da plataforma", 
    "Equipe de Monitoramento (07:30–00:00)", 
    "Suporte Técnico Online", 
    "Equipe de Marketing", 
    "Treinamento passo a passo", 
    "Equipe de Entregadores", 
    "Consultor de Suporte Local", 
    "Campanhas, Cupons, Promoções e Parcerias", 
    "Flexibilidade na Entrega (própria ou Mais Delivery)"
  ];

  return (
    <section id="vantagens" className="scroll-m-20 py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">Vender mais é só o começo. Veja o que mais você ganha</h2>
        
        <p className="text-center text-muted-foreground text-base md:text-lg mb-8 max-w-3xl mx-auto">
          Mais do que uma plataforma — uma solução completa para o seu negócio crescer
        </p>
        
        <div className="max-w-3xl mx-auto space-y-4">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="flex items-start gap-4 bg-white rounded-lg p-4 shadow-sm border"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-5 h-5 text-accent-cta" />
              </div>
              <span className="text-foreground text-base">{advantage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
