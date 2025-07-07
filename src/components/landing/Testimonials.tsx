
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, AlertTriangle, PlayCircle } from 'lucide-react';
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
import { Dialog, DialogContent } from "@/components/ui/dialog";


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
  const [selectedVideo, setSelectedVideo] = React.useState<string | null>(null);
  
  const autoplayPlugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: false })
  );

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  const videoTestimonials = [
    {
      url: "https://www.instagram.com/p/C-i9x_yOquL/",
      thumbnail: "https://placehold.co/300x533.png",
      embedHtml: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/C-i9x_yOquL/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`
    },
    {
      url: "https://www.instagram.com/reel/C8q7_I6OkD_/",
      thumbnail: "https://placehold.co/300x533.png",
      embedHtml: `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/reel/C8q7_I6OkD_/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="14" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"></blockquote>`
    }
  ];

  React.useEffect(() => {
    if (!api) return;

    if (inView) {
      api.plugins().autoplay?.play();
    } else {
      api.plugins().autoplay?.stop();
    }
  }, [inView, api]);

  React.useEffect(() => {
    // This effect triggers the Instagram script to render the embeds inside the modal
    if (selectedVideo && window.instgrm) {
      window.instgrm.Embeds.process();
    }
  }, [selectedVideo]);

  React.useEffect(() => {
    if (!api) {
      return
    }

    // Use testimonials.length for the dots count, not the duplicated slide count
    const onSelect = () => {
      if (!api || !testimonials) return;
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
                            <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-3 flex flex-col h-full">
                                <div className="flex justify-center mb-4">
                                  <div className="bg-primary rounded-full p-2 flex items-center justify-center">
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
        <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-primary">
          O que dizem nossos parceiros
        </h2>
        
        {renderContent()}

        <div className="mt-16">
          <h3 className="text-xl md:text-2xl font-bold text-center mb-4 text-primary">
            Veja na prática
          </h3>
          <p className="text-center text-muted-foreground text-sm md:text-base mb-8 max-w-3xl mx-auto">
            Confira o que nossos parceiros estão dizendo sobre a experiência com o Mais Delivery.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start">
            {videoTestimonials.map((video, index) => (
              <div key={index} data-ai-hint="video testimonial" className="relative rounded-lg overflow-hidden shadow-lg group cursor-pointer transition-transform hover:scale-105" onClick={() => setSelectedVideo(video.url)}>
                <img src={video.thumbnail} alt={`Depoimento em vídeo ${index + 1}`} className="w-full h-auto object-cover" />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <PlayCircle className="h-20 w-20 text-white opacity-80 group-hover:opacity-100 transition-opacity transform group-hover:scale-110" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedVideo} onOpenChange={(isOpen) => !isOpen && setSelectedVideo(null)}>
        <DialogContent className="bg-transparent border-none shadow-none p-0 max-w-fit overflow-hidden">
          {selectedVideo && (
            <div
              className="[&>div]:mx-auto" // Center the blockquote inside
              dangerouslySetInnerHTML={{ __html: videoTestimonials.find(v => v.url === selectedVideo)?.embedHtml || '' }}
            />
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};
