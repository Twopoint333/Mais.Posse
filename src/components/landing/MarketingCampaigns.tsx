
import React from 'react';
import { useInView } from '@/hooks/useInView';
import { Loader2, AlertTriangle } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { supabase } from '@/integrations/supabase/client';

export const MarketingCampaigns = () => {
  const {
    ref,
    inView
  } = useInView({
    threshold: 0.1
  });
  
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
            Não foi possível buscar os dados. Verifique as permissões no Supabase. Erro:
            <pre className="mt-2 whitespace-pre-wrap text-xs bg-black/10 p-2 rounded-md">
              {JSON.stringify(errorCampaigns, null, 2)}
            </pre>
          </AlertDescription>
        </Alert>
      );
    }
    
    if (!marketingCampaigns || marketingCampaigns.length === 0) {
      return <p className="text-center text-muted-foreground">Nenhuma campanha para exibir no momento.</p>;
    }

    return (
       <div ref={ref} className={`transition-all duration-500 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {marketingCampaigns.map((campaign, index) => {
            const publicUrl = campaign.image_url 
              ? supabase.storage.from('site_assets').getPublicUrl(campaign.image_url).data.publicUrl 
              : '';
            
            return (
              <div key={campaign.id} className="p-1">
                <img 
                    src={publicUrl} 
                    alt={`Campanha de Marketing ${index + 1}`} 
                    className="w-full h-full object-cover rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                  />
              </div>
            );
          })}
        </div>
      </div>
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
