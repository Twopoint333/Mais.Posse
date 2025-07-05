
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Check } from 'lucide-react';

export const Pricing = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  const pricingOptions = [
    {
      title: "Taxa Única de Adesão",
      price: "R$ 150,00",
      benefits: [
        "Presença no App Mais Delivery\nSeja encontrado por milhares de clientes em sua cidade.",
        "Cadastro do cardápio e suporte na ativação\nNossa equipe ajuda em todo o processo inicial.",
        "Treinamento e suporte local\nConte com consultores para te apoiar desde o início."
      ]
    },
    {
      title: "Comissão por Pedido",
      price: "9,5%",
      benefits: [
        "Sem mensalidade\nPague apenas pelos pedidos realizados.",
        "Cancelamento sem multas\nLiberdade total para sair quando quiser.",
        "Acesso a campanhas e promoções\nSua loja participa das ações de marketing locais e regionais."
      ]
    }
  ];

  return (
    <section id="precos" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#A21C1C]">
          Preços Transparentes
        </h2>
        
        <div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto"
        >
          {pricingOptions.map((option, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden shadow-lg transition-all duration-500 ${
                inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className={`bg-gradient-to-br from-[#A21C1C] to-[#F59F00] py-6 px-8 text-white`}>
                <h3 className="text-xl font-bold">{option.title}</h3>
                <p className="text-3xl font-bold">{option.price}</p>
              </div>
              
              <div className="bg-white p-6">
                <ul className="space-y-6">
                  {option.benefits.map((benefit, idx) => {
                    const [title, description] = benefit.split('\n');
                    return (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-4 w-4 bg-[#F59F00] rounded-full opacity-60"></div>
                        </div>
                        <div>
                          <p className="font-medium text-[#1F2937]">{title}</p>
                          <p className="text-sm text-gray-600 mt-1">{description}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-center text-gray-500 mt-8">
          Cancele a qualquer momento sem taxas ou multas.
        </p>
      </div>
    </section>
  );
};
