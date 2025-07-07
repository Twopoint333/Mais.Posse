
import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export const Testimonials = () => {
  const { testimonials, isLoadingTestimonials, isErrorTestimonials, errorTestimonials } = useAdmin();

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
    
    return (
       <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => {
            let publicUrl = '';
            if (typeof testimonial.logo_url === 'string' && testimonial.logo_url.trim() !== '') {
                // Robustly handle both old paths (with "public/") and new paths (without).
                const logoPath = testimonial.logo_url.replace(/^public\//, '');
                const { data } = supabase.storage.from('site_assets').getPublicUrl(logoPath);
                publicUrl = data?.publicUrl ?? '';
            }

            return (
              <div key={testimonial.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 h-full">
                  <div className="flex justify-center mb-4">
                    <div className="bg-primary rounded-full p-2 flex items-center justify-center">
                      <Avatar className="h-12 w-12">
                        {publicUrl && <AvatarImage src={publicUrl} alt={`${testimonial.business} Logo`} className="object-contain" />}
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
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section id="depoimentos" className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 text-primary">
          O que dizem nossos parceiros
        </h2>
        
        {renderContent()}

      </div>
    </section>
  );
};
