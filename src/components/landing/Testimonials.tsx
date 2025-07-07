
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, AlertTriangle, Quote, PlayCircle } from 'lucide-react';
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

  const [isFirstVideoVisible, setFirstVideoVisible] = React.useState(false);
  const [isSecondVideoVisible, setSecondVideoVisible] = React.useState(false);

  const videoTestimonials = [
    {
      business: 'Hamburgueria do Chefe',
      author: 'Ana Pereira',
      city: 'Posse',
      state: 'GO',
      permalink: 'https://www.instagram.com/reel/DK-TV6bNqBb/?igsh=MWwzYTk4b3l0ZXBtdA==',
      thumbnail: 'https://placehold.co/500x580.png',
      onClick: () => setFirstVideoVisible(true),
      isVisible: isFirstVideoVisible
    },
    {
      business: 'Pizzaria Sabor Divino',
      author: 'Carlos Almeida',
      city: 'Posse',
      state: 'GO',
      permalink: 'https://www.instagram.com/reel/DJ9a8D9yqoD/?igsh=MWhjdndmODJiZGw2dw==',
      thumbnail: 'https://placehold.co/500x580.png',
      onClick: () => setSecondVideoVisible(true),
      isVisible: isSecondVideoVisible
    }
  ];

  React.useEffect(() => {
    // Process embeds if they are visible (either initially or after a click)
    if ((isFirstVideoVisible || isSecondVideoVisible) && window.instgrm) {
      setTimeout(() => {
        window.instgrm?.Embeds.process();
      }, 100);
    }
  }, [inView, isFirstVideoVisible, isSecondVideoVisible]);

  React.useEffect(() => {
    if (!api) return;

    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api]);

  React.useEffect(() => {
    if (!api || !testimonials) {
      return
    }

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
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden p-6 flex flex-col h-full relative transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                                <div className="flex items-center mb-4 relative">
                                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                                        {publicUrl && <AvatarImage src={publicUrl} alt={`${testimonial.business} Logo`} className="object-contain" />}
                                        <AvatarFallback>{testimonial.business[0]}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4">
                                        <p className="font-bold text-foreground">{testimonial.author}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.business}</p>
                                    </div>
                                </div>
                                <blockquote className="flex-grow relative">
                                    <p className="text-foreground/80 text-sm italic">"{testimonial.quote}"</p>
                                </blockquote>
                                <footer className="mt-4 text-xs text-primary font-medium relative text-right">
                                    {testimonial.city}, {testimonial.state}
                                </footer>
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
                {video.isVisible ? (
                  <blockquote 
                    className="instagram-media" 
                    data-instgrm-permalink={video.permalink}
                    data-instgrm-version="14"
                  ></blockquote>
                ) : (
                  <div className="relative cursor-pointer" onClick={video.onClick}>
                    <img src={video.thumbnail} alt={`Depoimento em vídeo de ${video.business}`} className="w-full h-auto" data-ai-hint="video thumbnail"/>
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <PlayCircle className="w-16 h-16 text-white/80" />
                    </div>
                  </div>
                )}
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
