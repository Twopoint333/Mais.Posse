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

  // Advantages with longer text that will span more columns
  const longAdvantages = new Set([
    "Catálogo do estabelecimento dentro da plataforma",
    "Equipe de Monitoramento (07:30–00:00)",
    "Campanhas, Cupons, Promoções e Parcerias",
    "Flexibilidade na Entrega (própria ou Mais Delivery)"
  ]);

  return (
    <section id="vantagens" className="scroll-m-20 py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">Vender mais é só o começo. Veja o que mais você ganha</h2>
        
        <p className="text-center text-muted-foreground text-base md:text-lg mb-8 max-w-3xl mx-auto">
          Mais do que uma plataforma — uma solução completa para o seu negócio crescer
        </p>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className={cn(
                "flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border",
                longAdvantages.has(advantage) && "col-span-2"
              )}
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-accent-cta" />
              </div>
              <span className="text-foreground text-sm">{advantage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
