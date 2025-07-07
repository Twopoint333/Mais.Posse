import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

export const Advantages = () => {
  const advantages = ["Catálogo do estabelecimento dentro da plataforma", "Equipe de Monitoramento (07:30–00:00)", "Suporte Técnico Online", "Equipe de Marketing", "Treinamento passo a passo", "Equipe de Entregadores", "Consultor de Suporte Local", "Campanhas, Cupons, Promoções e Parcerias", "Flexibilidade na Entrega (própria ou Mais Delivery)"];
  
  const { ref, inView } = useInView({ threshold: 0.5, once: true });
  const [videoUrl, setVideoUrl] = useState("https://www.youtube.com/embed/mrQK78o7hUk");

  useEffect(() => {
    if (inView) {
      // Append autoplay and mute parameters when the video is in view
      // Mute is required for autoplay in most browsers
      setVideoUrl("https://www.youtube.com/embed/mrQK78o7hUk?autoplay=1&mute=1");
    }
  }, [inView]);

  return (
    <section id="vantagens" className="scroll-m-20 py-12 md:py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 text-primary">Vender mais é só o começo. Veja o que mais você ganha</h2>
        
        <p className="text-center text-muted-foreground text-base md:text-lg mb-8 max-w-3xl mx-auto">
          Mais do que uma plataforma — uma solução completa para o seu negócio crescer
        </p>

        <div className="max-w-3xl mx-auto mb-12" ref={ref}>
          <div className="aspect-video rounded-lg overflow-hidden shadow-lg">
            <iframe 
              className="w-full h-full rounded-lg" 
              src={videoUrl}
              title="YouTube video player" 
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
              allowFullScreen
            ></iframe>
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {advantages.map((advantage, index) => (
            <div 
              key={index} 
              className="flex items-start gap-3 bg-white rounded-lg p-3 shadow-sm border"
            >
              <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center mt-0.5">
                <Check className="w-4 h-4 text-accent-cta" />
              </div>
              <span className="text-foreground text-xs md:text-sm">{advantage}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
