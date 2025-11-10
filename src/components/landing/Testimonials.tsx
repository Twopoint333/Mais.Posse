
import * as React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from 'lucide-react';
import { testimonials as allTestimonials } from '@/lib/static-data';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { InstagramEmbed } from './InstagramEmbed';

// Simplified type for this component
interface Testimonial {
  id: string;
  quote: string;
  author: string;
  business: string;
  city: string;
  state: string;
  logo_url?: string | null;
  instagram_url?: string | null;
}

export const Testimonials = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplayPlugin = React.useRef(Autoplay({ delay: 5000, stopOnInteraction: true }));

  // Filter testimonials once
  const validTestimonials = React.useMemo(() => 
    allTestimonials.filter(t => t && t.id && t.quote && t.author && t.business), 
    []
  );

  const videoTestimonials = React.useMemo(() => 
    validTestimonials.filter(t => !!t.instagram_url),
    [validTestimonials]
  );
  const textTestimonials = React.useMemo(() => 
    validTestimonials.filter(t => !t.instagram_url),
    [validTestimonials]
  );

  React.useEffect(() => {
    if (!api) return;
    
    setCurrent(api.selectedScrollSnap());
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    api.on("select", onSelect);
    
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  if (validTestimonials.length === 0) {
    return null; // Don't render the section if there are no valid testimonials
  }

  return (
    <section id="depoimentos" className="scroll-m-20 py-8 md:py-10 px-4 bg-gray-50">
      <div className="container mx-auto">
        {videoTestimonials.length > 0 && (
          <div className="mb-12">
            <h3 className="text-xl md:text-2xl font-bold text-center mb-8 text-primary">
              Histórias de sucesso em vídeo
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {videoTestimonials.map((testimonial) => (
                <div key={testimonial.id} className="h-full">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                    {testimonial.instagram_url && (
                       <InstagramEmbed url={testimonial.instagram_url} />
                    )}
                    <div className="p-6 flex flex-col flex-grow relative">
                      <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                      <div className="flex items-center mb-4 relative">
                          <Avatar className="h-12 w-12 border-2 border-primary/10">
                              {testimonial.logo_url && <AvatarImage src={testimonial.logo_url} alt={`${testimonial.business ?? ''} Logo`} className="object-contain" />}
                              <AvatarFallback>{(testimonial.business?.charAt(0) ?? 'P').toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="ml-4">
                              <p className="font-bold text-foreground">{testimonial.author ?? 'Parceiro'}</p>
                              <p className="text-sm text-muted-foreground">{testimonial.business ?? 'Mais Delivery'}</p>
                          </div>
                      </div>
                      <blockquote className="flex-grow relative my-4">
                        <p className="text-foreground/80 text-sm italic">"{testimonial.quote ?? 'Depoimento incrível!'}"</p>
                      </blockquote>
                      <footer className="mt-auto text-xs text-primary font-medium relative text-right">
                          {testimonial.city}{testimonial.state ? `, ${testimonial.state}` : ''}
                      </footer>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {textTestimonials.length > 0 && (
          <div className="relative">
             {videoTestimonials.length > 0 && (
              <p className="text-center text-muted-foreground text-base md:text-lg mb-4 max-w-2xl mx-auto">
                E tem mais! Veja o que outros parceiros têm a dizer:
              </p>
            )}
            <h2 className="text-xl md:text-2xl font-bold text-center mb-8 md:mb-10 text-primary">
              Depoimentos dos nossos parceiros
            </h2>
            <Carousel
                setApi={setApi}
                plugins={[autoplayPlugin.current]}
                opts={{ align: "start", loop: textTestimonials.length > 2 }}
                className="w-full"
            >
                <CarouselContent className="-ml-4">
                    {textTestimonials.map((testimonial) => (
                        <CarouselItem key={testimonial.id} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                          <div className="h-full p-1">
                            <div className="bg-white rounded-2xl overflow-hidden flex flex-col h-full p-6 transition-all duration-300 hover:-translate-y-1 relative shadow-lg hover:shadow-xl">
                                <Quote className="absolute top-3 right-3 w-20 h-20 text-primary/5" strokeWidth={1.5} />
                                <div className="flex items-center mb-4 relative">
                                    <Avatar className="h-12 w-12 border-2 border-primary/10">
                                        {testimonial.logo_url && <AvatarImage src={testimonial.logo_url} alt={`${testimonial.business ?? ''} Logo`} className="object-contain" />}
                                        <AvatarFallback>{(testimonial.business?.charAt(0) ?? 'P').toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="ml-4">
                                        <p className="font-bold text-foreground">{testimonial.author ?? 'Parceiro'}</p>
                                        <p className="text-sm text-muted-foreground">{testimonial.business ?? 'Mais Delivery'}</p>
                                    </div>
                                </div>
                                <blockquote className="flex-grow relative my-4">
                                    <p className="text-foreground/80 text-sm italic">"{testimonial.quote ?? 'Depoimento incrível!'}"</p>
                                </blockquote>
                                <footer className="mt-auto text-xs text-primary font-medium relative text-right">
                                    {testimonial.city}{testimonial.state ? `, ${testimonial.state}` : ''}
                                </footer>
                            </div>
                          </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>
            {textTestimonials.length > 1 && api && (
                <div className="flex justify-center gap-2 mt-4">
                    {Array.from({ length: api.scrollSnapList().length }).map((_, i) => (
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
        )}
      </div>
    </section>
  );
};
