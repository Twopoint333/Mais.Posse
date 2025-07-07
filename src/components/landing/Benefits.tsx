
import React from 'react';
import { Check } from 'lucide-react';

export const Benefits = () => {
  const features = [{
    title: "Publicidade e Marketing",
    description: "Participe de campanhas na plataforma e ganhe destaque com ações que aumentam a visibilidade da sua marca."
  }, {
    title: "Garantimos transparência financeira",
    description: "Acompanhe relatórios completos e atualizados para entender a performance e o faturamento do seu negócio."
  }, {
    title: "Nada de robôs! Suporte local e humanizado",
    description: "Receba atendimento real com um consultor exclusivo, pronto para orientar sua empresa em cada etapa."
  }, {
    title: "Autonomia para criar promoções exclusivas",
    description: "Crie ofertas personalizadas dentro da plataforma e impulsione suas vendas com campanhas sob seu controle."
  }];
  return (
    <section id="beneficios" className="py-8 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-3">
          POR QUE SE CADASTRAR NO MAIS DELIVERY?
        </h2>
        
        <p className="text-center text-[#1F2937] mb-12 max-w-3xl mx-auto">O Mais Delivery é uma startup de marketplace que está transformando o cenário do delivery no Brasil. Presente em mais de 300 cidades, geramos oportunidades, impulsionamos pequenos negócios e movimentamos a economia local — tudo com tecnologia acessível e impacto real.</p>
        
        <div className="md:grid md:grid-cols-2 lg:grid-cols-4 md:gap-8">
          <div className="flex gap-6 overflow-x-auto pb-4 md:contents">
            {features.map((feature, index) => (
              <div key={index} className="flex-shrink-0 w-4/5 sm:w-3/5 md:w-full bg-white rounded-xl shadow-md p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02]">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Check className="w-6 h-6 text-accent-cta" />
                </div>
                
                <h3 className="text-lg font-bold text-primary mb-2">
                  {feature.title}
                </h3>
                
                <p className="text-[#1F2937]">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
