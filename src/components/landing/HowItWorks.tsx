import React from 'react';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { MessageSquare, TrendingUp, Timer } from 'lucide-react';

export const HowItWorks = () => {
  const features = [{
    icon: <MessageSquare className="w-10 h-10 text-accent-cta" />,
    title: "Gestão Delivery",
    description: "Painel de controle, pedidos, cardápio e desempenho em um clique.",
    expandedDescription: "Tenha total controle do seu negócio com um dashboard completo e fácil de usar. Gerencie todos os aspectos do seu delivery em um só lugar."
  }, {
    icon: <TrendingUp className="w-10 h-10 text-accent-cta" />,
    title: "Impulsionamento",
    description: "Acrescente um novo canal de vendas, onde milhares de novos clientes encontrarão você.",
    expandedDescription: "Aumente sua visibilidade na plataforma e alcance mais clientes. Nossa base de usuários está sempre crescendo e procurando por novos estabelecimentos."
  }, {
    icon: <Timer className="w-10 h-10 text-accent-cta" />,
    title: "Eficiência no Atendimento",
    description: "Pedidos feitos de forma rápida e automatizada, eliminando ligações demoradas.",
    expandedDescription: "Você recebe tudo pronto para produzir e entregar. Agilize seu processo e aumente a satisfação dos clientes com nosso sistema automatizado."
  }];
  
  return (
    <section id="como-funciona" className="scroll-m-20 py-12 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
          Somos muito mais do que um aplicativo de delivery
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <HoverCard key={index}>
              <HoverCardTrigger asChild>
                <div className="bg-white rounded-2xl shadow-md p-4 md:p-6 flex flex-col items-center text-center h-full transition-all duration-500 cursor-pointer hover:shadow-xl hover:scale-[1.02]">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  
                  <h3 className="text-lg md:text-xl font-bold text-primary mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm md:text-base">
                    {feature.description}
                  </p>
                </div>
              </HoverCardTrigger>
              <HoverCardContent className="w-80 p-4">
                <div>
                  <h4 className="text-lg font-bold mb-2 text-primary">{feature.title}</h4>
                  <p className="text-muted-foreground">{feature.expandedDescription}</p>
                </div>
              </HoverCardContent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
};
