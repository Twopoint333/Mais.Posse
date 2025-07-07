
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, AlertTriangle, Quote, PlayCircle } from 'lucide-react';
import { useAdmin, Testimonial } from '@/context/AdminContext';
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export const Testimonials = () => {
  const { testimonials, isLoadingTestimonials, isErrorTestimonials, errorTestimonials } = useAdmin();
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)
  const [videoInModal, setVideoInModal] = React.useState<Testimonial | null>(null);

  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true })
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  const textTestimonials = React.useMemo(() => testimonials?.filter(t => !t.video_url) || [], [testimonials]);
  const videoTestimonials = React.useMemo(() => testimonials?.filter(t => !!t.video_url) || [], [testimonials]);

  const getPublicUrl = (pathOrUrl: string | null | undefined) => {
    if (!pathOrUrl) return '';

    // If it's already a full URL, return it directly.
    if (pathOrUrl.startsWith('http')) {
      return pathOrUrl;
    }

    // Otherwise, assume it's a path and build the public URL.
    const imagePath = pathOrUrl.replace(/^public\//, '');
    const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
    return data?.publicUrl ?? '';
  };

  React.useEffect(() => {
    if (!api) return;

    if (videoInModal) {
      api.plugins().autoplay?.stop();
    } else if (inView && textTestimonials.length > 0) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api, videoInModal, textTestimonials.length]);

  React.useEffect(() => {
    if (!api || !textTestimonials?.length) return;
  
    const onSelect = () => {
      if (!api) return;
      setCurrent(api.selectedScrollSnap());
    };
  
    api.on("select", onSelect);
    api.on("reInit", onSelect);
  
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api, textTestimonials.length]);

  const handleVideoClick = (testimonial: Testimonial) => {
    if (testimonial.video_url) {
        setVideoInModal(testimonial);
    }
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
    
    let displayTextTestimonials = [...textTestimonials];
    while (displayTextTestimonials.length > 0 && displayTextTestimonials.length < 4) {
        displayTextTestimonials.push(...textTestimonials.map(t => ({...t, id: `${t.id}-${displayTextTestimonials.length}-${Math.random()}`})));
    }

    return (
       <>
        {textTestimonials.length > 0 && (
          <div className="relative">
            <Carousel
                setApi={setApi}
                plugins={[autoplayPlugin.current]}
                opts={{ align: "start", loop: displayTextTestimonials.length > 1 }}
                className="w-full"
            >
                <CarouselContent className="-ml-4 md:items-stretch">
                    {displayTextTestimonials.map((testimonial, index) => {
                        const logoPublicUrl = getPublicUrl(testimonial.logo_url);
                        return (
                            <CarouselItem key={`${testimonial.id}-${index}`} className="pl-4 basis-full md:basis-1/2">
                              <div className="p-1 h-full">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
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
                                    <blockquote className="flex-grow relative my-4">
                                        <p className="text-foreground/80 text-sm italic">"{testimonial.quote}"</p>
                                    </blockquote>
                                    <footer className="mt-auto text-xs text-primary font-medium relative text-right">
                                        {testimonial.city}, {testimonial.state}
                                    </footer>
                                </div>
                              </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
            {textTestimonials.length > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: textTestimonials.length }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => api?.scrollTo(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${i === (current % textTestimonials.length) ? 'bg-primary' : 'bg-primary/20'}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                    ))}
                </div>
            )}
          </div>
        )}

        {videoTestimonials.length > 0 && (
          <div className="mt-16">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-primary">
              Veja também em vídeo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
              {videoTestimonials.map((testimonial) => {
                  const logoPublicUrl = getPublicUrl(testimonial.logo_url);

                  return (
                    <div key={testimonial.id} className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="relative aspect-video w-full bg-slate-900">
                          <>
                            <img
                              src={getPublicUrl(testimonial.thumbnail_url) || 'https://placehold.co/1600x900.png'}
                              alt={`Thumbnail for ${testimonial.business} testimonial`}
                              className="h-full w-full object-cover"
                              loading="lazy"
                              data-ai-hint="video testimonial"
                            />
                            <div 
                              className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/30 transition-opacity hover:opacity-80"
                              onClick={() => handleVideoClick(testimonial)}
                            >
                              <PlayCircle className="h-16 w-16 text-white/90 transition-transform hover:scale-110" />
                            </div>
                          </>
                      </div>
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
                  );
                })}
              </div>
          </div>
        )}

        <Dialog open={!!videoInModal} onOpenChange={(isOpen) => !isOpen && setVideoInModal(null)}>
            <DialogContent className="p-0 border-0 max-w-4xl w-full bg-transparent shadow-none">
                {videoInModal && videoInModal.video_url && (
                <div className="aspect-video">
                    <video
                        src={videoInModal.video_url}
                        controls
                        autoPlay
                        className="h-full w-full object-contain rounded-lg"
                        onEnded={() => setVideoInModal(null)}
                    >
                    Seu navegador não suporta a tag de vídeo.
                    </video>
                </div>
                )}
            </DialogContent>
        </Dialog>
      </>
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
