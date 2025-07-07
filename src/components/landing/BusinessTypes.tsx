import React from 'react';
import { Store, ShoppingBag, Users } from 'lucide-react';

export const BusinessTypes = () => {
  return (
    <section className="py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">
          Posso cadastrar minha loja mesmo não sendo restaurante?
        </h2>
        
        <p className="text-center text-muted-foreground text-base md:text-lg mb-8 md:mb-12 max-w-3xl mx-auto">
          Claro! O Mais Delivery é pra todo mundo: restaurante, mercadinho, pet shop, conveniência e muito mais. 
          Se você quer vender e crescer com a gente, é só chegar. Aqui, o importante é ter vontade de fazer acontecer!
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: <Store className="w-12 h-12 text-accent-cta" />,
              title: "Farmácias",
              description: "Ofereça medicamentos e produtos de saúde com entrega rápida para clientes que precisam de pronta disponibilidade."
            },
            {
              icon: <ShoppingBag className="w-12 h-12 text-accent-cta" />,
              title: "Lojas de conveniência",
              description: "Ofereça produtos essenciais com a praticidade que seus clientes precisam a qualquer hora do dia."
            },
            {
              icon: <Users className="w-12 h-12 text-accent-cta" />,
              title: "Serviços gerais",
              description: "Amplie seu alcance oferecendo serviços diversos através da nossa plataforma de delivery."
            }
          ].map((type, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-md p-4 md:p-6 text-center transition-all duration-500"
            >
              <div className="flex justify-center mb-4">
                {type.icon}
              </div>
              
              <h3 className="text-lg md:text-xl font-bold text-primary mb-3">
                {type.title}
              </h3>
              
              <p className="text-muted-foreground text-sm md:text-base">
                {type.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
