import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

export const CallToAction = () => {
  const clickUpFormUrl = "https://forms.clickup.com/9007116077/f/8cdvbtd-1933/04EZ2JLNT1SGLXPAF2?Nome%20da%20tarefa=Estabelecimento%20Interessado";
  
  const handlePartnerClick = () => {
    window.open(clickUpFormUrl, '_blank');
  };

  return (
    <section id="cta" className="scroll-m-20 py-12 md:py-16 px-4 bg-primary text-white overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
              Pronto para impulsionar suas vendas?
            </h2>
            <p className="text-base md:text-lg mb-8 text-primary-foreground/90">
              Junte-se a centenas de estabelecimentos que já estão crescendo com o Mais Delivery. O cadastro é rápido e nossa equipe te ajuda em todas as etapas.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto text-base md:text-lg bg-accent-cta hover:bg-accent-cta/90 text-primary-foreground font-bold shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse-cta"
              onClick={handlePartnerClick}
            >
              Quero ser parceiro <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
      </div>
    </section>
  );
};
