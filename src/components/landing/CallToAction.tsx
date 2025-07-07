
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export const CallToAction = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const clickUpFormUrl = "https://forms.clickup.com/9007116077/f/8cdvbtd-1933/04EZ2JLNT1SGLXPAF2?Nome%20da%20tarefa=Estabelecimento%20Interessado";
  
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      const timeout = setTimeout(() => {
        setIsPulsing(false);
      }, 1500);
      return () => clearTimeout(timeout);
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handlePartnerClick = () => {
    window.open(clickUpFormUrl, '_blank');
  };

  return (
    <section id="cta" className="scroll-m-20 py-16 px-4 bg-primary text-white overflow-hidden">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Pronto para impulsionar suas vendas?
            </h2>
            <p className="text-lg md:text-xl mb-8 text-primary-foreground/90">
              Junte-se a centenas de estabelecimentos que já estão crescendo com o Mais Delivery. O cadastro é rápido e nossa equipe te ajuda em todas as etapas.
            </p>
            <Button 
              size="lg" 
              className={`w-full md:w-auto text-lg bg-accent-cta hover:bg-accent-cta/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-300 ${isPulsing ? 'animate-pulse scale-105' : 'scale-100'}`}
              onClick={handlePartnerClick}
            >
              Quero ser parceiro <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="hidden md:flex justify-center items-center">
            <img 
              src="https://placehold.co/400x400.png"
              data-ai-hint="delivery app"
              alt="Aplicativo Mais Delivery em um smartphone" 
              className="rounded-lg shadow-2xl transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
