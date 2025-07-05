
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Clock, CheckCircle } from 'lucide-react';

const ThankYou = () => {
  useEffect(() => {
    // Scroll to top when the page loads
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center flex-grow">
        <Card className="w-full max-w-2xl shadow-lg border-t-4 border-t-[#A21C1C] animate-fade-in">
          <CardHeader className="text-center pb-2">
            <CheckCircle className="h-16 w-16 text-[#A21C1C] mx-auto mb-4" />
            <CardTitle className="text-3xl font-bold text-[#1F2937]">
              Obrigado pelo seu interesse!
            </CardTitle>
            <CardDescription className="text-lg mt-2">
              Recebemos seus dados com sucesso
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-4 text-center">
            <p className="text-[#1F2937] mb-6 text-lg">
              Nossa equipe irá analisar suas informações e entraremos em contato em até <strong>48 horas</strong> para iniciar o processo de cadastro no aplicativo.
            </p>
            
            <div className="bg-gray-100 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-2">Precisa falar conosco?</h3>
              <p className="mb-4">
                Entre em contato com nossa equipe comercial pelo WhatsApp:
              </p>
              <Button 
                className="bg-[#25D366] hover:bg-[#20BD5C] mx-auto block"
                onClick={() => window.open('https://wa.link/74r6oq', '_blank')}
              >
                Falar com um consultor
              </Button>
              
              <div className="flex items-center justify-center mt-4 text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                <span>Atendimento das 8h às 17h em dias úteis</span>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 italic">
              Caso tenha enviado mensagem fora do horário comercial, responderemos assim que possível.
            </p>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-2 pb-6">
            <Link to="/">
              <Button variant="outline" className="gap-2">
                <ArrowLeft size={16} />
                Voltar para a página inicial
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ThankYou;
