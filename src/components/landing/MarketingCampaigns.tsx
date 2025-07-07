
import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export const MarketingCampaigns = () => {
  const { marketingCampaigns, isLoadingCampaigns, isErrorCampaigns, errorCampaigns } = useAdmin();
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

  const renderContent = () => {
    if (isLoadingCampaigns) {
      return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (isErrorCampaigns) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Campanhas</AlertTitle>
          <AlertDescription>
            Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorCampaigns?.message || JSON.stringify(errorCampaigns, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!marketingCampaigns || marketingCampaigns.length === 0) {
      return <p className="text-center text-muted-foreground">Nenhuma campanha para exibir no momento.</p>;
    }

    return (
      <>
        <Carousel
          setApi={setApi}
          plugins={[
            Autoplay({
              delay: 2000,
              stopOnInteraction: true,
            }),
          ]}
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {marketingCampaigns.map((campaign, index) => {
              let publicUrl = '';
              if (typeof campaign.image_url === 'string' && campaign.image_url.trim() !== '') {
                // Robustly handle both old paths (with "public/") and new paths (without).
                const imagePath = campaign.image_url.replace(/^public\//, '');
                const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
                publicUrl = data?.publicUrl ?? '';
              }
              
              return (
                <CarouselItem key={campaign.id} className="basis-4/5 sm:basis-1/2 md:basis-1/3">
                  <div className="p-1">
                    {publicUrl ? (
                      <div className="overflow-hidden rounded-lg shadow-md">
                        <img 
                          src={publicUrl} 
                          alt={`Campanha de Marketing ${index + 1}`} 
                          className="w-full object-cover rounded-lg aspect-[9/16] transition-transform duration-300 ease-in-out hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="w-full bg-muted rounded-lg aspect-video flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Imagem indisponível</p>
                      </div>
                    )}
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
        </Carousel>
        {marketingCampaigns && marketingCampaigns.length > 1 && (
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
      </>
    );
  };

  return (
    <section className="py-8 md:py-12 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary">
          CAMPANHAS DE MARKETING QUE FUNCIONAM
        </h2>
        
        <p className="text-center text-muted-foreground text-sm md:text-base mb-6 md:mb-8 max-w-3xl mx-auto">
          Impulsione sua marca com ações estratégicas de marketing cooperado para conquistar mais clientes!
        </p>
        
        {renderContent()}
      </div>
    </section>
  );
};
