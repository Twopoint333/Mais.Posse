
import React from 'react';
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useInView } from '@/hooks/useInView';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { ArrowRight } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export const Testimonials = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  
  const { testimonials } = useAdmin();
  
  if (testimonials.length === 0) {
    return null;
  }
  
  return (
    <section id="depoimentos" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-[#A21C1C]">
          O que dizem nossos parceiros
        </h2>
        
        <div ref={ref} className="relative">
          <Carousel opts={{
            align: "start",
            loop: true
          }} className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 pl-4">
                  <div className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{
                    transitionDelay: `${index * 150}ms`
                  }}>
                    <div className="flex justify-center mb-4">
                      <div className="bg-[#A21C1C] rounded-full p-2 flex items-center justify-center">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={testimonial.logoUrl} alt={`${testimonial.business} Logo`} className="object-contain" />
                          <AvatarFallback>{testimonial.business[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    
                    <blockquote className="mb-6">
                      <p className="text-[#1F2937] italic mb-4">"{testimonial.quote}"</p>
                      <footer className="text-sm">
                        <span className="font-bold text-[#1F2937]">{testimonial.author}, </span>
                        <span className="text-[#1F2937]">{testimonial.business} – </span>
                        <span className="text-[#A21C1C] font-medium">{testimonial.location}</span>
                      </footer>
                    </blockquote>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          
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
      </div>
    </section>
  );
};
