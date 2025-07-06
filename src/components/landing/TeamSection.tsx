
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export const TeamSection = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  
  const { teamMembers, isLoadingTeam, isErrorTeam, errorTeam } = useAdmin();

  const renderContent = () => {
    if (isLoadingTeam) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      );
    }
  
    if (isErrorTeam) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Equipe</AlertTitle>
          <AlertDescription>
             Não foi possível buscar os dados. Verifique as permissões no Supabase. Erro:
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {JSON.stringify(errorTeam, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )
    }
    
    if (!teamMembers || teamMembers.length === 0) {
      return <p className="text-center text-muted-foreground">Nenhuma foto da equipe para exibir no momento.</p>;
    }

    return (
      <div className="relative shadow-lg rounded-lg overflow-hidden">
        <div className="grid grid-cols-2 gap-4">
          {teamMembers.map((member, index) => {
            const publicUrl = member.image_url 
              ? supabase.storage.from('site_assets').getPublicUrl(member.image_url).data.publicUrl
              : '';
              
            return (
              <div key={member.id}>
                <img src={publicUrl} alt={`Equipe Mais Delivery ${index + 1}`} className="rounded-lg shadow-md h-auto w-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div ref={ref} className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary">
              Uma Equipe Dedicada ao Seu Sucesso
            </h2>
            
            <p className="text-[#1F2937] text-lg mb-6">
              Por trás da nossa tecnologia existe uma equipe completa de profissionais dedicados a garantir o sucesso do seu negócio. Nossa central de monitoramento funciona das 7:30 às 00:00, todos os dias, garantindo que cada pedido seja entregue com excelência.
            </p>
          </div>
          
          {renderContent()}

        </div>
      </div>
    </section>
  );
};
