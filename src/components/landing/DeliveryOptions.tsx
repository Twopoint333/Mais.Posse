
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Truck, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

export const DeliveryOptions = () => {
  const { ref, inView } = useInView({ threshold: 0.1 });
  
  const deliveryOptions = [
    {
      icon: <Truck className="w-12 h-12 text-[#F59F00]" />,
      title: "Entrega pelo Mais Delivery",
      description: "Utilize nossa equipe de entregadores treinados e agilize seus pedidos com total segurança."
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-[#F59F00]" />,
      title: "Entrega própria",
      description: "Mantenha sua própria equipe de entregadores e gerencie as entregas do seu jeito."
    }
  ];

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-[#A21C1C]">
          Flexibilidade nas entregas
        </h2>
        
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Escolha o modelo que funciona melhor para o seu negócio: utilize nossa equipe de entregadores ou mantenha sua própria equipe.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div 
            ref={ref}
            className="w-full md:w-1/2 mb-8 md:mb-0"
          >
            <img 
              src="https://i.imgur.com/l7zw4p9.jpeg" 
              alt="Entregador Mais Delivery" 
              className={`w-full h-auto rounded-lg shadow-lg transition-all duration-800 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}
            />
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">
            {deliveryOptions.map((option, index) => (
              <div 
                key={index}
                className={`bg-white rounded-xl shadow-md p-6 transition-all duration-800 ${
                  inView 
                    ? 'opacity-100 translate-x-0' 
                    : 'opacity-0 translate-x-10'
                }`}
                style={{ 
                  transitionDelay: `${index * 200}ms`
                }}
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-[#A21C1C]/10 rounded-full mr-4">
                    {option.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-[#A21C1C]">
                    {option.title}
                  </h3>
                </div>
                
                <p className="text-gray-700 pl-16">
                  {option.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
