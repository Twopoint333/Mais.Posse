
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, PlusCircle, Trash2, Edit, Loader2 } from 'lucide-react';
import { useAdmin, Testimonial } from '@/context/AdminContext';
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

interface AdminPanelProps {
  onLogout: () => void;
}

const getPublicUrl = (path: string | null | undefined) => {
  if (typeof path === 'string' && path.trim() !== '') {
    const { data } = supabase.storage.from('site_assets').getPublicUrl(path);
    return data?.publicUrl ?? '';
  }
  return '';
};

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const {
    marketingCampaigns, addCampaign, deleteCampaign, isLoadingCampaigns,
    teamMembers, addTeamMember, deleteTeamMember, isLoadingTeam,
    testimonials, addTestimonial, updateTestimonial, deleteTestimonial, isLoadingTestimonials,
  } = useAdmin();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for forms
  const [newCampaignFile, setNewCampaignFile] = useState<File | null>(null);
  const [newTeamMemberFile, setNewTeamMemberFile] = useState<File | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<(Partial<Testimonial> & { logo_file?: File }) | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Refs for file inputs
  const campaignFileRef = useRef<HTMLInputElement>(null);
  const teamMemberFileRef = useRef<HTMLInputElement>(null);
  const testimonialLogoRef = useRef<HTMLInputElement>(null);

  const handleApiError = (error: unknown, action: string) => {
    console.error(`Full error object when trying to ${action}:`, error);
    let description = "Ocorreu um erro. Por favor, tente novamente.";
    if (error instanceof Error) {
        if (error.message.includes('security rules') || error.message.includes('permission denied') || error.message.includes('violates row-level security policy')) {
            description = "Falha de permissão. Verifique se o script SQL mais recente foi executado corretamente no Supabase.";
        } else {
            description = error.message;
        }
    }
    console.error(`Failed to ${action}:`, error);
    toast({
      variant: "destructive",
      title: `Erro ao ${action}`,
      description: description,
    });
  };

  const handleLogoutAndRedirect = () => {
    onLogout();
    navigate('/');
  };

  // Handlers for Marketing Campaigns
  const handleAddCampaign = async () => {
    if (newCampaignFile) {
      setIsSubmitting(true);
      try {
        await addCampaign({ file: newCampaignFile });
        setNewCampaignFile(null);
        if (campaignFileRef.current) campaignFileRef.current.value = "";
        toast({ title: "Campanha adicionada com sucesso!" });
      } catch (error) {
        handleApiError(error, "adicionar campanha");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handlers for Team Members
  const handleAddTeamMember = async () => {
    if (newTeamMemberFile) {
      setIsSubmitting(true);
      try {
        await addTeamMember({ file: newTeamMemberFile });
        setNewTeamMemberFile(null);
        if (teamMemberFileRef.current) teamMemberFileRef.current.value = "";
        toast({ title: "Membro da equipe adicionado com sucesso!" });
      } catch (error) {
        handleApiError(error, "adicionar membro da equipe");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Handlers for Testimonials
  const handleSaveTestimonial = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    setIsSubmitting(true);
    try {
      const { id, created_at, logo_file, ...data } = editingTestimonial;

      if (id) { // Update
        const originalTestimonial = testimonials?.find(t => t.id === id);
        await updateTestimonial({ 
            ...data, 
            id,
            logo_file,
            old_logo_path: logo_file ? originalTestimonial?.logo_url : undefined 
        });
        toast({ title: "Depoimento atualizado com sucesso!" });
      } else { // Insert
        if (logo_file && data.quote && data.author && data.business && data.location) {
          await addTestimonial({ 
              quote: data.quote,
              author: data.author,
              business: data.business,
              location: data.location,
              logo_file: logo_file,
           });
          toast({ title: "Depoimento adicionado com sucesso!" });
        } else {
            toast({ variant: "destructive", title: "Todos os campos e o logo são obrigatórios." });
        }
      }
      setEditingTestimonial(null);
    } catch (error) {
        handleApiError(error, id ? "atualizar depoimento" : "adicionar depoimento");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const openNewTestimonialDialog = () => {
    setEditingTestimonial({
        quote: '', author: '', business: '', location: ''
    })
  }
  
  const openEditTestimonialDialog = (testimonial: Testimonial) => {
      setEditingTestimonial({ ...testimonial });
  }

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <Button onClick={handleLogoutAndRedirect} variant="destructive">
          <LogOut className="mr-2 h-4 w-4" /> Sair
        </Button>
      </header>

      <Tabs defaultValue="campaigns">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="campaigns">Campanhas</TabsTrigger>
          <TabsTrigger value="team">Equipe</TabsTrigger>
          <TabsTrigger value="testimonials">Depoimentos</TabsTrigger>
        </TabsList>

        {/* Marketing Campaigns Tab */}
        <TabsContent value="campaigns">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Campanhas de Marketing</CardTitle>
              <CardDescription>Adicione ou remova imagens que aparecerão no site.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={campaignFileRef}
                  onChange={(e) => setNewCampaignFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
                <Button onClick={handleAddCampaign} disabled={!newCampaignFile || isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                  Adicionar
                </Button>
              </div>
              {isLoadingCampaigns ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {marketingCampaigns?.map(campaign => (
                    <div key={campaign.id} className="relative group">
                      <img src={getPublicUrl(campaign.image_url)} alt="Campanha" className="rounded-md object-cover aspect-[9/16]" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-2 flex justify-end items-start">
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={async () => {
                              try {
                                  await deleteCampaign(campaign);
                                  toast({ title: "Campanha removida com sucesso!" });
                              } catch (e) {
                                  handleApiError(e, "remover campanha");
                              }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Membros da Equipe</CardTitle>
              <CardDescription>Adicione ou remova fotos da equipe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  ref={teamMemberFileRef}
                  onChange={(e) => setNewTeamMemberFile(e.target.files?.[0] || null)}
                  disabled={isSubmitting}
                />
                <Button onClick={handleAddTeamMember} disabled={!newTeamMemberFile || isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <PlusCircle className="mr-2 h-4 w-4" />}
                    Adicionar
                </Button>
              </div>
              {isLoadingTeam ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {teamMembers?.map(member => (
                    <div key={member.id} className="relative group">
                      <img src={getPublicUrl(member.image_url)} alt="Membro da Equipe" className="rounded-md object-cover aspect-square" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded-md p-2 flex justify-end items-start">
                        <Button
                            variant="destructive"
                            size="icon"
                            onClick={async () => {
                                try {
                                    await deleteTeamMember(member);
                                    toast({ title: "Membro da equipe removido com sucesso!" });
                                } catch(e) {
                                    handleApiError(e, "remover membro da equipe");
                                }
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Tab */}
        <TabsContent value="testimonials">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Depoimentos</CardTitle>
              <CardDescription>Adicione, edite ou remova depoimentos de parceiros.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={openNewTestimonialDialog}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Depoimento
                </Button>
                {isLoadingTestimonials ? <div className="flex justify-center"><Loader2 className="animate-spin" /></div> : (
                    <div className="space-y-4">
                        {testimonials?.map(testimonial => (
                            <Card key={testimonial.id} className="flex items-start gap-4 p-4">
                                <img src={getPublicUrl(testimonial.logo_url)} alt={testimonial.business} className="w-16 h-16 object-contain rounded-full border" />
                                <div className="flex-grow">
                                <blockquote className="italic">"{testimonial.quote}"</blockquote>
                                <p className="text-sm text-muted-foreground mt-2">- {testimonial.author}, {testimonial.business} ({testimonial.location})</p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="icon" onClick={() => openEditTestimonialDialog(testimonial)}>
                                      <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="destructive" size="icon" onClick={async () => {
                                      try {
                                          await deleteTestimonial(testimonial);
                                          toast({ title: "Depoimento removido com sucesso!" });
                                      } catch(e) {
                                          handleApiError(e, "remover depoimento");
                                      }
                                  }}>
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Testimonial Dialog */}
      <Dialog open={!!editingTestimonial} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestimonial?.id ? 'Editar' : 'Adicionar'} Depoimento</DialogTitle>
            <DialogDescription>
              Preencha as informações do depoimento. Para editar, apenas o logo não é obrigatório.
            </DialogDescription>
          </DialogHeader>
          {editingTestimonial && (
             <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <div>
                <label className='text-sm font-medium'>Logo</label>
                <Input type="file" accept='image/*' ref={testimonialLogoRef} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, logo_file: e.target.files?.[0] || undefined })} required={!editingTestimonial.id} />
                {editingTestimonial.id && editingTestimonial.logo_url && <p className='text-xs text-muted-foreground mt-1'>Deixe em branco para manter o logo atual: <a href={getPublicUrl(editingTestimonial.logo_url)} target="_blank" rel="noopener noreferrer" className="underline">ver imagem</a></p>}
              </div>
              <Textarea placeholder="Citação do depoimento" value={editingTestimonial.quote || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })} required rows={4}/>
              <Input placeholder="Autor" value={editingTestimonial.author || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })} required />
              <Input placeholder="Negócio" value={editingTestimonial.business || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, business: e.target.value })} required />
              <Input placeholder="Localização (Cidade/Estado)" value={editingTestimonial.location || ''} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })} required />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditingTestimonial(null)} disabled={isSubmitting}>Cancelar</Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Salvar
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
