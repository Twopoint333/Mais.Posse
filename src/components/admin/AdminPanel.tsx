import React, { useState } from 'react';
import { useAdmin, MarketingCampaign, TeamMember, Testimonial } from '@/context/AdminContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const {
    marketingCampaigns, setMarketingCampaigns,
    teamMembers, setTeamMembers,
    testimonials, setTestimonials,
    resetData
  } = useAdmin();
  const { toast } = useToast();

  // State for forms
  const [newCampaignUrl, setNewCampaignUrl] = useState('');
  const [newTeamMemberUrl, setNewTeamMemberUrl] = useState('');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isTestimonialDialogOpen, setIsTestimonialDialogOpen] = useState(false);

  // Handlers for Marketing Campaigns
  const handleAddCampaign = () => {
    if (!newCampaignUrl.trim()) return;
    const newCampaign: MarketingCampaign = { id: crypto.randomUUID(), imageUrl: newCampaignUrl };
    setMarketingCampaigns([...marketingCampaigns, newCampaign]);
    setNewCampaignUrl('');
    toast({ title: 'Campanha adicionada!' });
  };

  const handleDeleteCampaign = (id: string) => {
    setMarketingCampaigns(marketingCampaigns.filter(c => c.id !== id));
    toast({ title: 'Campanha removida!', variant: 'destructive' });
  };

  // Handlers for Team Members
  const handleAddTeamMember = () => {
    if (!newTeamMemberUrl.trim()) return;
    const newMember: TeamMember = { id: crypto.randomUUID(), imageUrl: newTeamMemberUrl };
    setTeamMembers([...teamMembers, newMember]);
    setNewTeamMemberUrl('');
    toast({ title: 'Membro da equipe adicionado!' });
  };

  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter(m => m.id !== id));
    toast({ title: 'Membro da equipe removido!', variant: 'destructive' });
  };

  // Handlers for Testimonials
  const handleOpenTestimonialDialog = (testimonial: Testimonial | null) => {
    setEditingTestimonial(testimonial);
    setIsTestimonialDialogOpen(true);
  };

  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const testimonialData = Object.fromEntries(formData.entries()) as Omit<Testimonial, 'id'>;
    
    if (editingTestimonial) {
      // Edit existing
      const updatedTestimonials = testimonials.map(t =>
        t.id === editingTestimonial.id ? { ...t, ...testimonialData } : t
      );
      setTestimonials(updatedTestimonials);
      toast({ title: 'Depoimento atualizado!' });
    } else {
      // Add new
      const newTestimonial: Testimonial = { ...testimonialData, id: crypto.randomUUID() };
      setTestimonials([...testimonials, newTestimonial]);
      toast({ title: 'Depoimento adicionado!' });
    }
    
    setIsTestimonialDialogOpen(false);
    setEditingTestimonial(null);
  };
  
  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(testimonials.filter(t => t.id !== id));
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
                  placeholder="URL da imagem da campanha"
                  value={newCampaignUrl}
                  onChange={(e) => setNewCampaignUrl(e.target.value)}
                />
                <Button onClick={handleAddCampaign}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="space-y-2">
                {marketingCampaigns.map(campaign => (
                  <div key={campaign.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <img src={campaign.imageUrl} alt="Campanha" className="w-16 h-16 object-cover rounded" />
                    <span className="flex-grow truncate text-sm">{campaign.imageUrl}</span>
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
                  placeholder="URL da imagem do membro da equipe"
                  value={newTeamMemberUrl}
                  onChange={(e) => setNewTeamMemberUrl(e.target.value)}
                />
                <Button onClick={handleAddTeamMember}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="space-y-2">
                {teamMembers.map(member => (
                  <div key={member.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <img src={member.imageUrl} alt="Equipe" className="w-16 h-16 object-cover rounded" />
                    <span className="flex-grow truncate text-sm">{member.imageUrl}</span>
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
              <Input name="logoUrl" placeholder="URL do logo" defaultValue={editingTestimonial?.logoUrl} required />
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
