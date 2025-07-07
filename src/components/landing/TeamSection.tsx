import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export const TeamSection = () => {
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
             Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorTeam?.message || JSON.stringify(errorTeam, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      )
    }
    
    if (!teamMembers || teamMembers.length === 0) {
      return (
        <div className="flex items-center justify-center bg-muted rounded-lg aspect-video">
            <p className="text-muted-foreground">Nenhuma foto da equipe para exibir.</p>
        </div>
      );
    }

    return (
      <div className="columns-2 md:columns-3 gap-4">
        {teamMembers.map((member, index) => {
          let publicUrl = '';
          if (typeof member.image_url === 'string' && member.image_url.trim() !== '') {
            const imagePath = member.image_url.replace(/^public\//, '');
            const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
            publicUrl = data?.publicUrl ?? '';
          }
            
          return (
            publicUrl && (
              <img
                key={member.id}
                src={publicUrl}
                alt={`Equipe Mais Delivery ${index + 1}`}
                className="w-full h-auto rounded-lg shadow-md mb-4 break-inside-avoid hover:scale-105 transition-transform duration-300"
              />
            )
          );
        })}
      </div>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div className="text-left">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                    Uma Equipe Dedicada ao Seu Sucesso
                </h2>
                <p className="text-[#1F2937] text-lg mb-8">
                    Por trás da nossa tecnologia existe uma equipe completa de profissionais dedicados a garantir o sucesso do seu negócio. Nossa central de monitoramento funciona das 7:30 às 00:00, todos os dias, garantindo que cada pedido seja entregue com excelência.
                </p>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
      </div>
    </section>
  );
};
