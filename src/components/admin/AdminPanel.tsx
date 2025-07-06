import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, PlusCircle, Trash2, Edit } from 'lucide-react';
import { useAdmin, Testimonial } from '@/context/AdminContext';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  const {
    marketingCampaigns, setMarketingCampaigns,
    teamMembers, setTeamMembers,
    testimonials, setTestimonials,
    resetData,
  } = useAdmin();

  // State for forms
  const [newCampaignUrl, setNewCampaignUrl] = useState('');
  const [newTeamMemberUrl, setNewTeamMemberUrl] = useState('');
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);

  const genId = () => new Date().getTime().toString();

  // Handlers for Marketing Campaigns
  const handleAddCampaign = () => {
    if (newCampaignUrl.trim()) {
      setMarketingCampaigns(prev => [...prev, { id: genId(), imageUrl: newCampaignUrl.trim() }]);
      setNewCampaignUrl('');
    }
  };
  const handleDeleteCampaign = (id: string) => {
    setMarketingCampaigns(prev => prev.filter(c => c.id !== id));
  };

  // Handlers for Team Members
  const handleAddTeamMember = () => {
    if (newTeamMemberUrl.trim()) {
      setTeamMembers(prev => [...prev, { id: genId(), imageUrl: newTeamMemberUrl.trim() }]);
      setNewTeamMemberUrl('');
    }
  };
  const handleDeleteTeamMember = (id: string) => {
    setTeamMembers(prev => prev.filter(m => m.id !== id));
  };

  // Handlers for Testimonials
  const handleSaveTestimonial = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    if (editingTestimonial.id === 'new') {
      // Adding new testimonial
      setTestimonials(prev => [...prev, { ...editingTestimonial, id: genId() }]);
    } else {
      // Updating existing testimonial
      setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? editingTestimonial : t));
    }
    setEditingTestimonial(null);
  };
  const handleDeleteTestimonial = (id: string) => {
    setTestimonials(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="p-4 md:p-8 space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div className="flex gap-2">
           <Button onClick={resetData} variant="outline">Redefinir Dados</Button>
          <Button onClick={onLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
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
              <CardDescription>Adicione ou remova imagens das campanhas de marketing.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="URL da imagem da campanha"
                  value={newCampaignUrl}
                  onChange={(e) => setNewCampaignUrl(e.target.value)}
                />
                <Button onClick={handleAddCampaign}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {marketingCampaigns.map(campaign => (
                  <div key={campaign.id} className="relative group">
                    <img src={campaign.imageUrl} alt="Campanha" className="rounded-md object-cover aspect-[9/16]" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteCampaign(campaign.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
              <CardTitle>Gerenciar Membros da Equipe</CardTitle>
              <CardDescription>Adicione ou remova fotos da equipe.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex gap-2">
                <Input
                  placeholder="URL da imagem do membro da equipe"
                  value={newTeamMemberUrl}
                  onChange={(e) => setNewTeamMemberUrl(e.target.value)}
                />
                <Button onClick={handleAddTeamMember}><PlusCircle className="mr-2 h-4 w-4" /> Adicionar</Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {teamMembers.map(member => (
                  <div key={member.id} className="relative group">
                    <img src={member.imageUrl} alt="Membro da Equipe" className="rounded-md object-cover aspect-square" />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteTeamMember(member.id)}
                    >
                      <Trash2 className="h-4 w-4" />
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
                <Button onClick={() => setEditingTestimonial({ id: 'new', quote: '', author: '', business: '', location: '', logoUrl: '' })}>
                    <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Depoimento
                </Button>
              <div className="space-y-4">
                {testimonials.map(testimonial => (
                  <Card key={testimonial.id} className="flex items-start gap-4 p-4">
                    <img src={testimonial.logoUrl} alt={testimonial.business} className="w-16 h-16 object-contain rounded-full border" />
                    <div className="flex-grow">
                      <blockquote className="italic">"{testimonial.quote}"</blockquote>
                      <p className="text-sm text-muted-foreground mt-2">- {testimonial.author}, {testimonial.business} ({testimonial.location})</p>
                    </div>
                    <div className="flex flex-col gap-2">
                       <Button variant="outline" size="icon" onClick={() => setEditingTestimonial(testimonial)}>
                          <Edit className="h-4 w-4" />
                       </Button>
                       <Button variant="destructive" size="icon" onClick={() => handleDeleteTestimonial(testimonial.id)}>
                          <Trash2 className="h-4 w-4" />
                       </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Testimonial Dialog */}
      <Dialog open={!!editingTestimonial} onOpenChange={(open) => !open && setEditingTestimonial(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTestimonial?.id === 'new' ? 'Adicionar' : 'Editar'} Depoimento</DialogTitle>
            <DialogDescription>
              Preencha as informações do depoimento.
            </DialogDescription>
          </DialogHeader>
          {editingTestimonial && (
             <form onSubmit={handleSaveTestimonial} className="space-y-4">
              <Input placeholder="URL do Logo" value={editingTestimonial.logoUrl} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, logoUrl: e.target.value })} required />
              <Textarea placeholder="Citação do depoimento" value={editingTestimonial.quote} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })} required rows={4}/>
              <Input placeholder="Autor" value={editingTestimonial.author} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, author: e.target.value })} required />
              <Input placeholder="Negócio" value={editingTestimonial.business} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, business: e.target.value })} required />
              <Input placeholder="Localização (Cidade/Estado)" value={editingTestimonial.location} onChange={(e) => setEditingTestimonial({ ...editingTestimonial, location: e.target.value })} required />
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditingTestimonial(null)}>Cancelar</Button>
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPanel;
