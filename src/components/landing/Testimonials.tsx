
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
  
  const [activeVideoUrl, setActiveVideoUrl] = React.useState<string | null>(null);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  const getPublicUrl = (path: string | null | undefined) => {
    if (!path) return '';
    const imagePath = path.replace(/^public\//, '');
    const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
    return data?.publicUrl ?? '';
  };
  
  const videoTestimonials = React.useMemo(() => 
    testimonials?.filter(t => t.video_url && t.thumbnail_url) ?? [], 
  [testimonials]);
  
  const textTestimonials = React.useMemo(() => 
    testimonials?.filter(t => !t.video_url) ?? [],
  [testimonials]);

  React.useEffect(() => {
    if (!api) return;

    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api]);

  React.useEffect(() => {
    if (!api || !textTestimonials?.length || textTestimonials.length === 0) return;
  
    const onSelect = () => {
      if (!api) return;
      // The modulo operator is needed for the loop functionality
      setCurrent(api.selectedScrollSnap() % textTestimonials.length);
    };
  
    api.on("select", onSelect);
  
    return () => {
      api.off("select", onSelect);
    };
  }, [api, textTestimonials]);

  const renderTextTestimonials = () => {
    if (isLoadingTestimonials && !testimonials) {
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
    
    if (!textTestimonials || textTestimonials.length === 0) {
       return null;
    }
    
    let displayTextTestimonials = [...textTestimonials];
    while (displayTextTestimonials.length > 0 && displayTextTestimonials.length < 4) {
        displayTextTestimonials.push(...textTestimonials.map(t => ({...t, id: `${t.id}-${displayTextTestimonials.length}`})));
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
                {displayTextTestimonials.map((testimonial, index) => {
                    const publicUrl = getPublicUrl(testimonial.logo_url);

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
        {textTestimonials && textTestimonials.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
                {Array.from({ length: textTestimonials.length }).map((_, i) => (
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

        {isLoadingTestimonials && !testimonials && (
             <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )}

        {videoTestimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
                {videoTestimonials.map((video) => {
                    const videoUrl = getPublicUrl(video.video_url);
                    const thumbnailUrl = getPublicUrl(video.thumbnail_url);
                    const isActive = activeVideoUrl === videoUrl;

                    return (
                        <div key={video.id} className="rounded-lg shadow-lg overflow-hidden flex flex-col bg-white">
                            <div className="relative aspect-[9/16] bg-black">
                                {isActive ? (
                                    <video
                                        src={videoUrl}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-cover"
                                        onEnded={() => setActiveVideoUrl(null)}
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full cursor-pointer group"
                                        onClick={() => setActiveVideoUrl(videoUrl)}
                                    >
                                        <img
                                            src={thumbnailUrl}
                                            alt={`Depoimento de ${video.business}`}
                                            className="w-full h-full object-cover"
                                            data-ai-hint="business person"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                                            <PlayCircle className="w-20 h-20 text-white/80 group-hover:text-white group-hover:scale-110 transition-all" />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="p-4 border-t bg-white">
                                <h3 className="font-bold text-lg text-primary">{video.business}</h3>
                                <p className="text-sm text-muted-foreground">{video.author}</p>
                                <p className="text-xs text-muted-foreground">{video.city}, {video.state}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        )}
        
        {renderTextTestimonials()}
      </div>
    </section>
  );
};
