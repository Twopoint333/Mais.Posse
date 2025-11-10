
import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { marketingCampaigns } from '@/lib/static-data';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/useInView';

export const MarketingCampaigns = () => {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const autoplayPlugin = React.useRef(Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: false }));

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  React.useEffect(() => {
    if (!api) return;

    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api]);

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap())

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on("select", onSelect)
    
    const onReInit = () => {
        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap());
    };
    api.on("reInit", onReInit);

    return () => {
      api.off("select", onSelect)
      api.off("reInit", onReInit)
    }
  }, [api])

  const renderContent = () => {
    if (!marketingCampaigns || marketingCampaigns.length === 0) {
      return <p className="text-center text-muted-foreground">Nenhuma campanha para exibir no momento.</p>;
    }

    let displayCampaigns = [...marketingCampaigns];
    while (displayCampaigns.length < 8 && marketingCampaigns.length > 0) {
      displayCampaigns.push(...marketingCampaigns.map((c, i) => ({...c, id: `${c.id}-${i}-${displayCampaigns.length}`})));
    }

    return (
      <>
        <Carousel
          setApi={setApi}
          plugins={[autoplayPlugin.current]}
          opts={{
            align: "center",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent>
            {displayCampaigns.map((campaign, index) => {
              return (
                <CarouselItem key={`${campaign.id}-${index}`} className="basis-4/5 sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                  <div className="p-1">
                    <div className="overflow-hidden rounded-lg shadow-md bg-muted/20">
                      <img 
                        src={campaign.image_url} 
                        alt={`Campanha de Marketing ${index + 1}`} 
                        className={cn("w-full object-cover object-center rounded-lg aspect-[9/16] transition-transform duration-300 ease-in-out", "md:scale-100 scale-110")}
                      />
                    </div>
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
    <section ref={inViewRef} className="py-4 md:py-6 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6 text-primary">
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
