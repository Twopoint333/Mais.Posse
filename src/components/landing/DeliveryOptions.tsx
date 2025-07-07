
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
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">
          Flexibilidade nas entregas
        </h2>
        
        <p className="text-center text-gray-700 mb-12 max-w-3xl mx-auto">
          Escolha o modelo que funciona melhor para o seu negócio: utilize nossa equipe de entregadores ou mantenha sua própria equipe.
        </p>
        
        <div className="flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/2 mb-8 md:mb-0">
            <img 
              src={entregadorImg}
              alt="Entregador Mais Delivery" 
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
          
          <div className="w-full md:w-1/2 grid grid-cols-1 gap-6">
            {deliveryOptions.map((option, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6"
              >
                <div className="flex items-center mb-4">
                  <div className="p-2 bg-primary/10 rounded-full mr-4">
                    {option.icon}
                  </div>
                  
                  <h3 className="text-xl font-bold text-primary">
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
