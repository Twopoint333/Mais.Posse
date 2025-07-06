import React, { useState, useRef } from 'react';
import { useAdmin, MarketingCampaign, TeamMember, Testimonial } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Trash, Edit, Plus, LogOut, RefreshCw } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AdminPanelProps {
  onLogout: () => void;
}

const newId = () => `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const {
    marketingCampaigns, setMarketingCampaigns,
    teamMembers, setTeamMembers,
    testimonials, setTestimonials,
    resetData
  } = useAdmin();
  const { toast } = useToast();

  // State for forms
  const [newCampaignFile, setNewCampaignFile] = useState<File | null>(null);
  const [newTeamMemberFile, setNewTeamMemberFile] = useState<File | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [testimonialLogoFile, setTestimonialLogoFile] = useState<File | null>(null);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);

  const campaignInputRef = useRef<HTMLInputElement>(null);
  const teamMemberInputRef = useRef<HTMLInputElement>(null);

  // Handlers for Marketing Campaigns
  const handleAddCampaign = () => {
    if (!newCampaignFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newCampaign: MarketingCampaign = { id: newId(), imageUrl: reader.result as string };
      setMarketingCampaigns(prev => [...prev, newCampaign]);
      setNewCampaignFile(null);
      if (campaignInputRef.current) {
        campaignInputRef.current.value = '';
      }
      toast({ title: 'Campanha adicionada!' });
    }
    reader.readAsDataURL(newCampaignFile);
  };

  const handleDeleteCampaign = (id: string) => {
    setMarketingCampaigns(prev => prev.filter(c => c.id !== id));
    toast({ title: 'Campanha removida!', variant: 'destructive' });
  };

  // Handlers for Team Members
  const handleAddTeamMember = () => {
    if (!newTeamMemberFile) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const newMember: TeamMember = { id: newId(), imageUrl: reader.result as string };
      setTeamMembers(prev => [...prev, newMember]);
      setNewTeamMemberFile(null);
      if (teamMemberInputRef.current) {
        teamMemberInputRef.current.value = '';
      }
      toast({ title: 'Membro da equipe adicionado!' });
    }
    reader.readAsDataURL(newTeamMemberFile);
  };

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
    toast({ title: 'Membro da equipe removido!', variant: 'destructive' });
  };

  // Handlers for Testimonials
  const handleOpenTestimonialDialog = (testimonial: Testimonial | null) => {
    setEditingTestimonial(testimonial);
    setTestimonialLogoFile(null);
    setIsTestimonialDialogOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const testimonialTextData = {
      quote: formData.get('quote') as string,
      author: formData.get('author') as string,
      business: formData.get('business') as string,
      location: formData.get('location') as string,
    };

    const saveTestimonial = (finalLogoUrl: string) => {
      if (editingTestimonial) {
        const updatedTestimonial: Testimonial = {
          ...editingTestimonial,
          ...testimonialTextData,
          logoUrl: finalLogoUrl,
        };
        setTestimonials(prev => prev.map(t =>
          t.id === editingTestimonial.id ? updatedTestimonial : t
        ));
        toast({ title: 'Depoimento atualizado!' });
      } else {
        const newTestimonial: Testimonial = {
          ...testimonialTextData,
          logoUrl: finalLogoUrl,
          id: newId(),
        };
        setTestimonials(prev => [...prev, newTestimonial]);
        toast({ title: 'Depoimento adicionado!' });
      }
      
      setIsTestimonialDialogOpen(false);
      setEditingTestimonial(null);
      setTestimonialLogoFile(null);
    };

    if (testimonialLogoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        saveTestimonial(reader.result as string);
      };
      reader.readAsDataURL(testimonialLogoFile);
    } else {
      if (editingTestimonial && editingTestimonial.logoUrl) {
        saveTestimonial(editingTestimonial.logoUrl);
      } else {
        toast({
          title: "Erro",
          description: "Por favor, selecione uma imagem para o logo.",
          variant: "destructive",
        });
      }
    }
  };
  
  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
    toast({ title: 'Depoimento removido!', variant: 'destructive' });
  };

  const handleResetData = () => {
    resetData();
    toast({ title: 'Dados redefinidos para o padrão!' });
  }

  return (
    <div className="p-4 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="mr-2">
                <RefreshCw className="mr-2 h-4 w-4" /> Redefinir Dados
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação redefinirá todas as imagens e depoimentos para os valores padrão. Essa ação não pode ser desfeita.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleResetData} className="bg-destructive hover:bg-destructive/90">Sim, redefinir</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={onLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>
      
      <Tabs defaultValue="campaigns" className="w-full">
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
              <CardDescription>Adicione ou remova as imagens que aparecem no carrossel de campanhas.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  ref={campaignInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewCampaignFile(e.target.files ? e.target.files[0] : null)}
                  className="cursor-pointer"
                />
                <Button onClick={handleAddCampaign} disabled={!newCampaignFile}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="space-y-2">
                {marketingCampaigns.map(campaign => (
                  <div key={campaign.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <img src={campaign.imageUrl} alt="Campanha" className="w-16 h-16 object-cover rounded" />
                    <span className="flex-grow truncate text-sm">Imagem da campanha</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCampaign(campaign.id)}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Members Tab */}
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Gerenciar Fotos da Equipe</CardTitle>
              <CardDescription>Adicione ou remova as imagens da seção "Uma Equipe Dedicada ao Seu Sucesso".</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  ref={teamMemberInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setNewTeamMemberFile(e.target.files ? e.target.files[0] : null)}
                  className="cursor-pointer"
                />
                <Button onClick={handleAddTeamMember} disabled={!newTeamMemberFile}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <img src={member.imageUrl} alt="Equipe" className="w-16 h-16 object-cover rounded" />
                    <span className="flex-grow truncate text-sm">Imagem do membro da equipe</span>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteTeamMember(member.id)}>
                      <Trash className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
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
              <Button onClick={() => handleOpenTestimonialDialog(null)}><Plus className="mr-2 h-4 w-4" /> Adicionar Depoimento</Button>
              <div className="space-y-2">
                {testimonials.map(testimonial => (
                  <div key={testimonial.id} className="flex items-start gap-4 p-3 border rounded-md">
                    <img src={testimonial.logoUrl} alt="Logo" className="w-12 h-12 object-contain rounded-full bg-gray-100 p-1" />
                    <div className="flex-grow">
                      <p className="italic">"{testimonial.quote}"</p>
                      <p className="text-sm text-muted-foreground mt-2">- {testimonial.author}, {testimonial.business} ({testimonial.location})</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button variant="outline" size="icon" onClick={() => handleOpenTestimonialDialog(testimonial)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                        <Trash className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialog for Add/Edit Testimonial */}
      <Dialog open={isTestimonialDialogOpen} onOpenChange={setIsTestimonialDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestimonial ? 'Editar' : 'Adicionar'} Depoimento</DialogTitle>
            <DialogDescription>
              Preencha os dados do depoimento abaixo.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSaveTestimonial} className="space-y-4 py-4">
              <Textarea name="quote" placeholder="Citação do depoimento" defaultValue={editingTestimonial?.quote} required className="min-h-[100px]" />
              <Input name="author" placeholder="Autor" defaultValue={editingTestimonial?.author} required />
              <Input name="business" placeholder="Nome do negócio" defaultValue={editingTestimonial?.business} required />
              <Input name="location" placeholder="Localização (Cidade/UF)" defaultValue={editingTestimonial?.location} required />
              <div className="space-y-2">
                <Label htmlFor="logo">Logo do Parceiro</Label>
                <Input
                  id="logo"
                  name="logo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setTestimonialLogoFile(e.target.files ? e.target.files[0] : null)}
                  className="cursor-pointer"
                />
                {editingTestimonial?.logoUrl && !testimonialLogoFile && (
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <p>Logo atual:</p>
                    <img src={editingTestimonial.logoUrl} alt="Logo" className="h-8 w-8 rounded-full object-contain bg-gray-100" />
                  </div>
                )}
                {testimonialLogoFile && (
                  <p className="text-sm text-muted-foreground">Novo logo selecionado: {testimonialLogoFile.name}</p>
                )}
              </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsTestimonialDialogOpen(false)}>Cancelar</Button>
              <Button type="submit">Salvar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
