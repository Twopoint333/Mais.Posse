
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useIsMobile } from '@/hooks/use-mobile';

export const MarketingCampaigns = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  
  const isMobile = useIsMobile();
  const { marketingCampaigns } = useAdmin();
  const campaigns = marketingCampaigns.map(campaign => campaign.imageUrl);
  
  if (campaigns.length === 0) {
    return null;
  }
  
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-[#A21C1C]">
          CAMPANHAS DE MARKETING QUE FUNCIONAM
        </h2>
        
        <p className="text-center text-lg text-[#1F2937] mb-12 max-w-3xl mx-auto">
          Impulsione sua marca com ações estratégicas de marketing cooperado para conquistar mais clientes!
        </p>
        
        <div ref={ref} className={`transition-all duration-500 shadow-lg rounded-lg overflow-hidden ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <Carousel className="w-full mx-auto" opts={{
            align: "center",
            loop: true
          }}>
            <CarouselContent>
              {campaigns.map((campaign, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                  <div className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300 p-1 h-full">
                    <img 
                      src={campaign} 
                      alt={`Campanha de Marketing ${index + 1}`} 
                      className="w-full h-auto object-contain rounded-lg hover:scale-105 transition-transform duration-300"
                      style={isMobile ? 
                        { height: '450px', width: '100%', objectFit: 'contain' } : 
                        { height: '550px', width: '100%', objectFit: 'contain' }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
        
        <div className="flex justify-center w-full mt-6">
          <div className="flex flex-col items-center gap-1">
            <div className="flex items-center gap-2 text-[#A21C1C] text-sm">
              <span>Arraste para ver mais</span>
              <ArrowRight className="w-4 h-4 animate-bounce animate-infinite" />
            </div>
            <div className="h-0.5 w-24 bg-gradient-to-r from-transparent via-[#A21C1C] to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
