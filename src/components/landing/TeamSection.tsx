
import React, { useState, useEffect, useRef } from 'react';
import { teamMembers } from '@/lib/static-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useInView } from '@/hooks/useInView';


export const TeamSection = () => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const autoplayPlugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: false }));

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


  const renderContent = () => {
    if (!teamMembers || teamMembers.length === 0) {
      return (
        <div className="flex items-center justify-center bg-muted rounded-lg h-64 md:h-80">
            <p className="text-muted-foreground">Nenhuma foto da equipe para exibir.</p>
        </div>
      );
    }

    let displayMembers = [...teamMembers];
    while (displayMembers.length < 4 && teamMembers.length > 0) {
        displayMembers.push(...teamMembers.map(m => ({...m, id: `${m.id}-${displayMembers.length}`})));
    }


    return (
      <div className="relative">
        <Carousel
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {displayMembers.map((member, index) => {
              return (
                <CarouselItem key={`${member.id}-${index}`}>
                  <div className="overflow-hidden rounded-lg shadow-md">
                    <img
                        src={member.image_url}
                        alt={`Equipe Mais Delivery ${index + 1}`}
                        className="h-64 sm:h-72 md:h-80 w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        {teamMembers && teamMembers.length > 1 && (
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
        )}
      </div>
    );
  }

  return (
    <section ref={inViewRef} className="py-8 md:py-12 px-4 bg-white">
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 text-primary">Uma Equipe Dedicada ao Seu Sucesso</h2>
                    <p className="text-muted-foreground text-sm md:text-base mb-6">Por trás da nossa tecnologia existe uma equipe completa de profissionais dedicados a garantir o sucesso do seu negócio. Nossa central de monitoramento funciona das 7:30 às 00:00, todos os dias, garantindo que cada pedido seja entregue com excelência.</p>
                </div>
                {renderContent()}
            </div>
        </div>
    </section>
  );
};
