import React from 'react';
import { Truck, ShoppingBag } from 'lucide-react';
import entregadorImg from '../../entregador.jpg';

export const DeliveryOptions = () => {
  const deliveryOptions = [
    {
      icon: <Truck className="w-12 h-12 text-accent-cta" />,
      title: "Entrega pelo Mais Delivery",
      description: "Utilize nossa equipe de entregadores treinados e agilize seus pedidos com total segurança."
    },
    {
      icon: <ShoppingBag className="w-12 h-12 text-accent-cta" />,
      title: "Entrega própria",
      description: "Mantenha sua própria equipe de entregadores e gerencie as entregas do seu jeito."
    }
  ];

  return (
    <section className="py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">
          Flexibilidade nas entregas
        </h2>
        
        <p className="text-center text-muted-foreground text-base md:text-lg mb-8 md:mb-12 max-w-3xl mx-auto">
          Escolha o modelo que funciona melhor para o seu negócio: utilize nossa equipe de entregadores ou mantenha sua própria equipe.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img 
              src={entregadorImg}
              alt="Entregador Mais Delivery" 
              className="w-full h-auto rounded-lg shadow-lg aspect-square object-cover"
            />
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">
            {deliveryOptions.map((option, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-4 md:p-6"
              >
                <div className="flex items-start sm:items-center mb-4 flex-col sm:flex-row">
                  <div className="p-2 bg-primary/10 rounded-full mr-0 sm:mr-4 mb-2 sm:mb-0 flex-shrink-0">
                    {option.icon}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-primary">
                    {option.title}
                  </h3>
                </div>
                
                <p className="text-muted-foreground text-sm md:text-base pl-0 sm:pl-16">
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
