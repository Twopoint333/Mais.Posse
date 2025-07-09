
import React, { useState, useEffect, useRef } from 'react';
import { Check } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useInView } from '@/hooks/useInView';

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
  const autoplayPlugin = useRef(Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: false }));

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  useEffect(() => {
    if (!api) return;

    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api]);

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)

    return () => {
      api.off("select", onSelect)
    }
  }, [api])


  return (
    <section ref={inViewRef} id="beneficios" className="scroll-m-20 py-8 md:py-12 px-4 bg-gray-50 overflow-hidden">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center text-primary mb-3">
          POR QUE SE CADASTRAR NO MAIS DELIVERY?
        </h2>
        
        <p className="text-center text-muted-foreground mb-8 md:mb-10 max-w-3xl mx-auto text-sm md:text-base">O Mais Delivery é uma startup de marketplace que está transformando o cenário do delivery no Brasil. Presente em mais de 300 cidades, geramos oportunidades, impulsionamos pequenos negócios e movimentamos a economia local — tudo com tecnologia acessível e impacto real.</p>
        
        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-4 transition-all duration-500 hover:shadow-lg hover:scale-[1.02] flex flex-col h-full">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <Check className="w-5 h-5 text-accent-cta" />
              </div>
              <h3 className="text-base font-bold text-primary mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm">
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
            plugins={[autoplayPlugin.current]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {features.map((feature, index) => (
                <CarouselItem key={index} className="pl-4 basis-full">
                  <div className="h-full">
                    <div className="flex flex-col h-full bg-white rounded-xl p-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3 flex-shrink-0">
                        <Check className="w-5 h-5 text-accent-cta" />
                      </div>
                      <h3 className="text-base font-bold text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground text-sm flex-grow">
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
