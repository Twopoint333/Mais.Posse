
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

// Bulletproof getPublicUrl function
const getPublicUrl = (pathOrUrl: string | null | undefined): string => {
  if (!pathOrUrl || typeof pathOrUrl !== 'string' || pathOrUrl.trim() === '') {
    return '';
  }
  if (pathOrUrl.startsWith('http')) {
    return pathOrUrl;
  }
  const imagePath = pathOrUrl.replace(/^public\//, '');
  if (!imagePath) return '';
  
  const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
  return data?.publicUrl ?? '';
};


export const Testimonials = () => {
  const { testimonials, isLoadingTestimonials, isErrorTestimonials, errorTestimonials } = useAdmin();
  const [textApi, setTextApi] = React.useState<CarouselApi | undefined>();
  const [currentText, setCurrentText] = React.useState(0);
  const [videoInModal, setVideoInModal] = React.useState<Testimonial | null>(null);

  const autoplayPluginText = React.useRef(Autoplay({ delay: 6000, stopOnInteraction: true, stopOnMouseEnter: true }));

  const { ref: inViewRef, inView } = useInView({ threshold: 0.1, once: false });

  // Filter and validate testimonials robustly.
  const videoTestimonials = React.useMemo(() =>
    testimonials?.filter((t): t is Testimonial =>
      !!(t && t.id && t.video_url && t.quote && t.author && t.business)
    ) ?? [],
  [testimonials]);

  const textTestimonials = React.useMemo(() =>
    testimonials?.filter((t): t is Testimonial =>
      !!(t && t.id && !t.video_url && t.quote && t.author && t.business)
    ) ?? [],
  [testimonials]);

  // Safer effect to control autoplay
  React.useEffect(() => {
    const autoplay = autoplayPluginText.current;
    if (!autoplay || !textApi) return;

    if (inView && !videoInModal) {
      autoplay.play();
    } else {
      autoplay.stop();
    }
  }, [inView, videoInModal, textApi]);


  React.useEffect(() => {
    if (!textApi) return;
    const onSelect = (api: CarouselApi) => {
      setCurrentText(api.selectedScrollSnap());
    };
    textApi.on("select", onSelect);
    textApi.on("reInit", onSelect);

    onSelect(textApi);

    return () => {
      textApi.off("select", onSelect);
      textApi.off("reInit", onSelect);
    };
  }, [textApi]);

  const handleVideoClick = (testimonial: Testimonial) => {
    if (testimonial.video_url) {
      setVideoInModal(testimonial);
    }
  };

  // The main render function
  const renderContent = () => {
    if (isLoadingTestimonials) {
      return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (isErrorTestimonials) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Depoimentos</AlertTitle>
          <AlertDescription>
             Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorTestimonials?.message ?? "Ocorreu um erro desconhecido."}
            </pre>
          </AlertDescription>
        </Alert>
      )
    }

    if (!testimonials || (videoTestimonials.length === 0 && textTestimonials.length === 0)) {
       return <p className="text-center text-muted-foreground">Nenhum depoimento para exibir no momento.</p>;
    }

    return (
       <>
        {videoTestimonials.length > 0 && (
          <div className="mb-16">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-primary">
              Veja também em vídeo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {videoTestimonials.map((testimonial) => {
                const { id, business, author, quote, city, state, thumbnail_url, logo_url } = testimonial;
                const logoPublicUrl = getPublicUrl(logo_url);
                const thumbnailPublicUrl = getPublicUrl(thumbnail_url);

                return (
                  <div key={id} className="p-1 h-full">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                      <div className="relative aspect-video w-full bg-slate-900">
                          <img
                            src={thumbnailPublicUrl || 'https://placehold.co/1600x900.png'}
                            alt={`Thumbnail para ${business ?? 'parceiro'}`}
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
                      </div>
                      <div className="p-6 flex flex-col flex-grow relative">
                        <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                        <div className="flex items-center mb-4 relative">
                            <Avatar className="h-12 w-12 border-2 border-primary/10">
                                {logoPublicUrl && <AvatarImage src={logoPublicUrl} alt={`${business ?? ''} Logo`} className="object-contain" />}
                                <AvatarFallback>{(business?.charAt(0) ?? 'P').toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="ml-4">
                                <p className="font-bold text-foreground">{author ?? 'Parceiro'}</p>
                                <p className="text-sm text-muted-foreground">{business ?? 'Mais Delivery'}</p>
                            </div>
                        </div>
                        <blockquote className="flex-grow relative">
                            <p className="text-foreground/80 text-sm italic">"{quote ?? 'Depoimento incrível!'}"</p>
                        </blockquote>
                        <footer className="mt-4 text-xs text-primary font-medium relative text-right">
                            {city}{state ? `, ${state}` : ''}
                        </footer>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {textTestimonials.length > 0 && (
          <div className="relative">
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-primary">
              O que dizem nossos parceiros
            </h2>
            <Carousel
                setApi={setTextApi}
                plugins={[autoplayPluginText.current]}
                opts={{ align: "start", loop: textTestimonials.length > 3 }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {textTestimonials.map((testimonial) => {
                        const { id, business, author, quote, city, state, logo_url } = testimonial;
                        const logoPublicUrl = getPublicUrl(logo_url);
                        return (
                            <CarouselItem key={id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                              <div className="p-1 h-full">
                                <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 relative">
                                    <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                                    <div className="flex items-center mb-4 relative">
                                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                                            {logoPublicUrl && <AvatarImage src={logoPublicUrl} alt={`${business ?? ''} Logo`} className="object-contain" />}
                                            <AvatarFallback>{(business?.charAt(0) ?? 'P').toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div className="ml-4">
                                            <p className="font-bold text-foreground">{author ?? 'Parceiro'}</p>
                                            <p className="text-sm text-muted-foreground">{business ?? 'Mais Delivery'}</p>
                                        </div>
                                    </div>
                                    <blockquote className="flex-grow relative my-4">
                                        <p className="text-foreground/80 text-sm italic">"{quote ?? 'Depoimento incrível!'}"</p>
                                    </blockquote>
                                    <footer className="mt-auto text-xs text-primary font-medium relative text-right">
                                        {city}{state ? `, ${state}` : ''}
                                    </footer>
                                </div>
                              </div>
                            </CarouselItem>
                        )
                    })}
                </CarouselContent>
            </Carousel>
            {textTestimonials.length > 1 && textApi && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: textApi.scrollSnapList().length }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => textApi?.scrollTo(i)}
                        className={`h-2 w-2 rounded-full transition-colors ${i === currentText ? 'bg-primary' : 'bg-primary/20'}`}
                        aria-label={`Go to slide ${i + 1}`}
                    />
                    ))}
                </div>
            )}
          </div>
        )}

        <Dialog open={!!videoInModal} onOpenChange={(isOpen) => !isOpen && setVideoInModal(null)}>
            <DialogContent className="p-0 border-0 max-w-4xl w-full bg-transparent shadow-none">
                {videoInModal?.video_url && (
                <div className="aspect-video">
                    <video
                        src={getPublicUrl(videoInModal.video_url)}
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
        {renderContent()}
      </div>
    </section>
  );
};
