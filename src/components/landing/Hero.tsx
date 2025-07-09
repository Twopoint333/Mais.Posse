import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Play } from 'lucide-react';
import heroBg from '../../motoboy.jpg';

export const Hero = () => {
  useEffect(() => {
    const heroSection = document.querySelector('#hero');
    if (heroSection) {
      heroSection.classList.add('animate-fade-in');
    }
  }, []);
  
  return (
    <section 
      id="hero" 
      className="scroll-m-20 relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center px-4 py-20 md:py-24 bg-primary"
      data-ai-hint="delivery food"
    >
      <img
        src={heroBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-[0.15]"
      />
      
      <div className="container mx-auto relative z-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 transform translate-y-0 opacity-100 transition-all duration-700 delay-300">
          Evolua com o Mais Delivery e aumente suas vendas
        </h1>
        
        <p className="text-base md:text-xl text-white mb-8 max-w-2xl mx-auto transform translate-y-0 opacity-100 transition-all duration-700 delay-500">
          O Mais Delivery já transformou negócios em mais de 300 cidades — o próximo pode ser o seu.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 transform translate-y-0 opacity-100 transition-all duration-700 delay-700">
          <Button 
            asChild 
            size="lg" 
            className="w-full sm:w-auto bg-accent-cta hover:bg-accent-cta/90 text-primary-foreground border-2 border-white shadow-lg"
          >
            <a href="#cta">Quero ser parceiro</a>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            size="lg" 
            className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white/20"
          >
            <a href="https://www.youtube.com/watch?v=DDDqWTgDNsI" target="_blank" rel="noopener noreferrer">
              <Play className="mr-2 text-accent-cta" /> Assista o vídeo
            </a>
          </Button>
        </div>
        
        <ul className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            '+ 300 cidades em todo o Brasil', 
            '+ Clientes potenciais', 
            '+ Eficiência no atendimento e gestão', 
            '+ Vendas com novo canal de pedidos'
          ].map((item, index) => (
            <li 
              key={index} 
              className="bg-white/10 backdrop-blur-sm text-white py-3 px-4 rounded-lg font-medium transform transition-all duration-500 text-sm" 
              style={{
                animationDelay: `${300 + index * 100}ms`
              }}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
