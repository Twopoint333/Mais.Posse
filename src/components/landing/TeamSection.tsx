import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from '@/components/ui/card';

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
      <Carousel
        opts={{
          align: "start",
          loop: teamMembers.length > 5,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {teamMembers.map((member, index) => {
            let publicUrl = '';
            if (typeof member.image_url === 'string' && member.image_url.trim() !== '') {
              const imagePath = member.image_url.replace(/^public\//, '');
              const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
              publicUrl = data?.publicUrl ?? '';
            }
            
            return (
              publicUrl && (
                <CarouselItem key={member.id} className="pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5">
                  <div className="p-1">
                      <Card className="overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                          <CardContent className="p-0">
                              <img
                                  src={publicUrl}
                                  alt={`Equipe Mais Delivery ${index + 1}`}
                                  className="w-full h-full object-cover aspect-square transition-transform duration-300 hover:scale-105"
                               />
                          </CardContent>
                      </Card>
                  </div>
                </CarouselItem>
              )
            );
          })}
        </CarouselContent>
        <CarouselPrevious className="hidden sm:flex" />
        <CarouselNext className="hidden sm:flex" />
      </Carousel>
    );
  }

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">
                Uma Equipe Dedicada ao Seu Sucesso
            </h2>
            <p className="text-[#1F2937] text-lg">
                Por trás da nossa tecnologia existe uma equipe completa de profissionais dedicados a garantir o sucesso do seu negócio. Nossa central de monitoramento funciona das 7:30 às 00:00, todos os dias, garantindo que cada pedido seja entregue com excelência.
            </p>
        </div>
        {renderContent()}
      </div>
    </section>
  );
};
