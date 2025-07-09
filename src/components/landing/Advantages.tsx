import React from 'react';
import { Check } from 'lucide-react';

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
        
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {advantages.map((advantage, index) => (
            <div
              key={index}
              className="relative rounded-lg p-[1px] bg-transparent overflow-hidden"
            >
              <div
                className="absolute inset-[-1000%] animate-border-spin"
                style={{
                  backgroundImage: `conic-gradient(from 180deg at 50% 50%, hsl(var(--primary)) 0deg, hsl(var(--accent-cta)) 180deg, hsl(var(--primary)) 360deg)`,
                }}
              />
              <div className="relative flex items-start gap-4 bg-white rounded-[7px] p-4 h-full">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                  <Check className="w-5 h-5 text-accent-cta" />
                </div>
                <span className="text-foreground text-base">{advantage}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
