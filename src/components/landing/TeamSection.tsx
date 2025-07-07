
import React, { useState, useEffect, useRef } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useInView } from '@/hooks/useInView';


export const TeamSection = () => {
  const { teamMembers, isLoadingTeam, isErrorTeam, errorTeam } = useAdmin();
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
    if (isLoadingTeam) {
      return (
        <div className="flex justify-center items-center h-64 md:h-80">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    if (isErrorTeam) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Equipe</AlertTitle>
          <AlertDescription>
             Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorTeam?.message || JSON.stringify(errorTeam, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )
    }
    
    if (!teamMembers || teamMembers.length === 0) {
      return (
        <div className="flex items-center justify-center bg-muted rounded-lg h-64 md:h-80">
            <p className="text-muted-foreground">Nenhuma foto da equipe para exibir.</p>
        </div>
      );
    }

    // To ensure smooth looping, we duplicate slides if there are too few.
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
              let publicUrl = '';
              if (typeof member.image_url === 'string' && member.image_url.trim() !== '') {
                const imagePath = member.image_url.replace(/^public\//, '');
                const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
                publicUrl = data?.publicUrl ?? '';
              }
              
              return (
                publicUrl && (
                  <CarouselItem key={`${member.id}-${index}`}>
                    <div className="overflow-hidden rounded-lg shadow-md">
                      <img
                          src={publicUrl}
                          alt={`Equipe Mais Delivery ${index + 1}`}
                          className="h-64 sm:h-72 md:h-80 w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                )
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
