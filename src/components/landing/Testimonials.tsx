
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

// Extend window type to include instgrm
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

export const Testimonials = () => {
  const { testimonials, isLoadingTestimonials, isErrorTestimonials, errorTestimonials } = useAdmin();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  const videoTestimonials = [
    {
      business: 'Hamburgueria do Chefe',
      author: 'Ana Pereira',
      city: 'Posse',
      state: 'GO',
      permalink: 'https://www.instagram.com/reel/DK-TV6bNqBb/?igsh=MWwzYTk4b3l0ZXBtdA==',
    },
    {
      business: 'Pizzaria Sabor Divino',
      author: 'Carlos Almeida',
      city: 'Posse',
      state: 'GO',
      permalink: 'https://www.instagram.com/reel/DJ9a8D9yqoD/?igsh=MWhjdndmODJiZGw2dw==',
    }
  ];

  React.useEffect(() => {
    if (inView && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [inView, videoTestimonials]);

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

    // Use testimonials.length for the dots count, not the duplicated slide count
    const onSelect = () => {
      if (!api || !testimonials || testimonials.length === 0) return;
      setCurrent(api.selectedScrollSnap() % testimonials.length)
      autoplayPlugin.current.reset()
    }

    api.on("select", onSelect)
    
    return () => {
      api.off("select", onSelect)
    }
  }, [api, testimonials]);

  const renderContent = () => {
    if (isLoadingTestimonials) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    if (isErrorTestimonials) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Depoimentos</AlertTitle>
          <AlertDescription>
             Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorTestimonials?.message || JSON.stringify(errorTestimonials, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )
    }
    
    if (!testimonials || testimonials.length === 0) {
       return <p className="text-center text-muted-foreground">Nenhum depoimento para exibir no momento.</p>;
    }
    
    let displayTestimonials = [...testimonials];
    while (displayTestimonials.length > 0 && displayTestimonials.length < 4) {
        displayTestimonials.push(...testimonials.map(t => ({...t, id: `${t.id}-${displayTestimonials.length}`})));
    }

    return (
       <div className="relative">
        <Carousel
            setApi={setApi}
            plugins={[autoplayPlugin.current]}
            opts={{ align: "start", loop: true }}
            className="w-full"
        >
            <CarouselContent className="-ml-4">
                {displayTestimonials.map((testimonial, index) => {
                    let publicUrl = '';
                    if (typeof testimonial.logo_url === 'string' && testimonial.logo_url.trim() !== '') {
                        const logoPath = testimonial.logo_url.replace(/^public\//, '');
                        const { data } = supabase.storage.from('site_assets').getPublicUrl(logoPath);
                        publicUrl = data?.publicUrl ?? '';
                    }

                    return (
                        <CarouselItem key={`${testimonial.id}-${index}`} className="pl-4 basis-full md:basis-1/2">
                          <div className="p-1 h-full">
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 flex flex-col h-full">
                                <div className="flex justify-center mb-4">
                                  <div className="bg-primary/10 rounded-full p-2 flex items-center justify-center">
                                    <Avatar className="h-10 w-10">
                                      {publicUrl && <AvatarImage src={publicUrl} alt={`${testimonial.business} Logo`} className="object-contain" />}
                                      <AvatarFallback>{testimonial.business[0]}</AvatarFallback>
                                    </Avatar>
                                  </div>
                                </div>
                                
                                <blockquote className="mb-4 flex-grow">
                                  <p className="text-muted-foreground italic mb-4 text-sm">"{testimonial.quote}"</p>
                                  <footer className="text-xs">
                                    <span className="font-bold text-foreground">{testimonial.author}, </span>
                                    <span className="text-foreground">{testimonial.business} – </span>
                                    <span className="text-primary font-medium">{testimonial.city}, {testimonial.state}</span>
                                  </footer>
                                </blockquote>
                              </div>
                          </div>
                        </CarouselItem>
                    );
                })}
            </CarouselContent>
        </Carousel>
        {testimonials && testimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: testimonials.length }).map((_, i) => (
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
    <section ref={inViewRef} id="depoimentos" className="scroll-m-20 py-8 md:py-10 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 md:mb-8 text-primary">
          O que dizem nossos parceiros
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {videoTestimonials.map((video, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative">
                <blockquote 
                  className="instagram-media" 
                  data-instgrm-permalink={video.permalink}
                  data-instgrm-version="14" 
                  style={{ background: '#FFF', border: 0, margin: 0, padding: 0, width: '100%' }}
                ></blockquote>
                <div className="absolute bottom-0 left-0 right-0 h-[48px] bg-white z-10"></div>
              </div>
              <div className="bg-white p-3 rounded-b-lg mt-[-48px] relative z-10">
                <h3 className="font-bold text-base text-primary">{video.business}</h3>
                <p className="text-sm text-muted-foreground">{video.author}</p>
                <p className="text-xs text-muted-foreground">{video.city}, {video.state}</p>
              </div>
            </div>
          ))}
        </div>
        
        {renderContent()}
      </div>
    </section>
  );
};
