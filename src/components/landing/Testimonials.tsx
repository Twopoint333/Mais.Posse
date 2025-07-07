
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

export const Testimonials = () => {
  const { testimonials, isLoadingTestimonials, isErrorTestimonials, errorTestimonials } = useAdmin();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [playingVideoId, setPlayingVideoId] = React.useState<string | null>(null);
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  const getPublicUrl = (path: string | null | undefined) => {
    if (!path) return '';
    const imagePath = path.replace(/^public\//, '');
    const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
    return data?.publicUrl ?? '';
  };

  React.useEffect(() => {
    if (!api) return;

    if (playingVideoId) {
      api.plugins().autoplay?.stop();
    } else if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api, playingVideoId]);

  React.useEffect(() => {
    if (!api || !testimonials?.length || testimonials.length === 0) return;
  
    const onSelect = () => {
      if (!api) return;
      // The modulo operator is needed for the loop functionality
      setCurrent(api.selectedScrollSnap() % testimonials.length);
    };
  
    api.on("select", onSelect);
  
    return () => {
      api.off("select", onSelect);
    };
  }, [api, testimonials]);

  const handlePlayClick = (testimonialId: string) => {
    setPlayingVideoId(testimonialId);
  };

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
                    const logoPublicUrl = getPublicUrl(testimonial.logo_url);
                    const hasVideo = testimonial.video_url && testimonial.thumbnail_url;

                    return (
                        <CarouselItem key={`${testimonial.id}-${index}`} className="pl-4 basis-full md:basis-1/2">
                          <div className="p-1 h-full">
                            <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                                {hasVideo && (
                                  <div className="relative aspect-video w-full bg-slate-900">
                                    {playingVideoId === testimonial.id ? (
                                      <video
                                        src={testimonial.video_url ?? ''}
                                        controls
                                        autoPlay
                                        className="h-full w-full object-cover"
                                        onEnded={() => setPlayingVideoId(null)}
                                        onPause={() => setPlayingVideoId(null)}
                                      >
                                        Seu navegador não suporta a tag de vídeo.
                                      </video>
                                    ) : (
                                      <>
                                        <img
                                          src={testimonial.thumbnail_url ?? 'https://placehold.co/1600x900/000000/FFFFFF?text=Video'}
                                          alt={`Thumbnail for ${testimonial.business} testimonial`}
                                          className="h-full w-full object-cover"
                                          loading="lazy"
                                        />
                                        <div 
                                          className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-opacity hover:opacity-80"
                                          onClick={() => handlePlayClick(testimonial.id)}
                                        >
                                          <PlayCircle className="h-16 w-16 text-white/90 transition-transform hover:scale-110" />
                                        </div>
                                      </>
                                    )}
                                  </div>
                                )}
                                <div className="p-6 flex flex-col flex-grow relative">
                                  <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                                  <div className="flex items-center mb-4 relative">
                                      <Avatar className="h-12 w-12 border-2 border-primary/10">
                                          {logoPublicUrl && <AvatarImage src={logoPublicUrl} alt={`${testimonial.business} Logo`} className="object-contain" />}
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
        <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-primary">
          O que dizem nossos parceiros
        </h2>
        {renderContent()}
      </div>
    </section>
  );
};
