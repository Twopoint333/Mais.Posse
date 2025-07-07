
import React from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAdmin } from '@/context/AdminContext';
import { supabase } from '@/integrations/supabase/client';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export const MarketingCampaigns = () => {
  const { marketingCampaigns, isLoadingCampaigns, isErrorCampaigns, errorCampaigns } = useAdmin();

  const renderContent = () => {
    if (isLoadingCampaigns) {
      return <div className="flex justify-center items-center h-40"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    if (isErrorCampaigns) {
      return (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Erro ao Carregar Campanhas</AlertTitle>
          <AlertDescription>
            Não foi possível buscar os dados. Verifique as permissões no Supabase.
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {errorCampaigns?.message || JSON.stringify(errorCampaigns, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!marketingCampaigns || marketingCampaigns.length === 0) {
      return <p className="text-center text-muted-foreground">Nenhuma campanha para exibir no momento.</p>;
    }

    return (
      <Carousel
        opts={{
          align: "start",
          loop: marketingCampaigns.length > 1,
        }}
        className="w-full"
      >
        <CarouselContent>
          {marketingCampaigns.map((campaign, index) => {
            let publicUrl = '';
            if (typeof campaign.image_url === 'string' && campaign.image_url.trim() !== '') {
              // Robustly handle both old paths (with "public/") and new paths (without).
              const imagePath = campaign.image_url.replace(/^public\//, '');
              const { data } = supabase.storage.from('site_assets').getPublicUrl(imagePath);
              publicUrl = data?.publicUrl ?? '';
            }
            
            return (
              <CarouselItem key={campaign.id} className="md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  {publicUrl ? (
                    <img 
                      src={publicUrl} 
                      alt={`Campanha de Marketing ${index + 1}`} 
                      className="w-full object-cover rounded-lg shadow-md aspect-[9/16]"
                    />
                  ) : (
                    <div className="w-full bg-muted rounded-lg aspect-[9/16] flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Imagem indisponível</p>
                    </div>
                  )}
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    );
  };

  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="container mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-primary">
          CAMPANHAS DE MARKETING QUE FUNCIONAM
        </h2>
        
        <p className="text-center text-lg text-[#1F2937] mb-12 max-w-3xl mx-auto">
          Impulsione sua marca com ações estratégicas de marketing cooperado para conquistar mais clientes!
        </p>
        
        {renderContent()}
      </div>
    </section>
  );
};
