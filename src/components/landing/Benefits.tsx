
import React, { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

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
  
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }
    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
    
    api.on("reInit", () => {
      setCount(api.scrollSnapList().length)
      setCurrent(api.selectedScrollSnap())
    });

  }, [api])


  return (
    <section id="beneficios" className="scroll-m-20 py-8 md:py-16 px-4 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-primary mb-3">
          POR QUE SE CADASTRAR NO MAIS DELIVERY?
        </h2>
        
        <p className="text-center text-[#1F2937] mb-12 max-w-3xl mx-auto">O Mais Delivery é uma startup de marketplace que está transformando o cenário do delivery no Brasil. Presente em mais de 300 cidades, geramos oportunidades, impulsionamos pequenos negócios e movimentamos a economia local — tudo com tecnologia acessível e impacto real.</p>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] flex flex-col h-full">
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

        {/* Mobile Horizontal Scroll with Dots */}
        <div className="md:hidden">
          <Carousel
            setApi={setApi}
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 5000, stopOnInteraction: true })]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-4 basis-4/5">
                  <div className="h-full p-1">
                    <div className="flex flex-col h-full bg-white rounded-xl shadow-md p-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 flex-shrink-0">
                        <Check className="w-6 h-6 text-accent-cta" />
                      </div>
                      <h3 className="text-lg font-bold text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-[#1F2937] flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                onClick={() => api?.scrollTo(i)}
                className={`h-2 w-2 rounded-full transition-colors ${i === current ? 'bg-primary' : 'bg-primary/20'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
