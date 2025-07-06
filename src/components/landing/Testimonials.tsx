
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2 } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

export const Testimonials = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  
  const { testimonials, isLoadingTestimonials } = useAdmin();

  if (isLoadingTestimonials) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }
  
  if (!testimonials || testimonials.length === 0) {
    return null;
  }
  
  return (
    <section id="depoimentos" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
          O que dizem nossos parceiros
        </h2>
        
        <div ref={ref} className="relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className={`bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full transition-all duration-500 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`} style={{
                  transitionDelay: `${index * 150}ms`
                }}>
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary rounded-full p-2 flex items-center justify-center">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={testimonial.logo_url} alt={`${testimonial.business} Logo`} className="object-contain" />
                        <AvatarFallback>{testimonial.business[0]}</AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                  
                  <blockquote className="mb-6">
                    <p className="text-[#1F2937] italic mb-4">"{testimonial.quote}"</p>
                    <footer className="text-sm">
                      <span className="font-bold text-[#1F2937]">{testimonial.author}, </span>
                      <span className="text-[#1F2937]">{testimonial.business} – </span>
                      <span className="text-primary font-medium">{testimonial.location}</span>
                    </footer>
                  </blockquote>
                </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
