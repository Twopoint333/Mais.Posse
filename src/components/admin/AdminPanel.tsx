import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface AdminPanelProps {
  onLogout: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onLogout }) => {
  return (
    <div className="p-4 md:p-8">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <div>
          <Button onClick={onLogout} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" /> Sair
          </Button>
        </div>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Painel em Carregamento</CardTitle>
        </CardHeader>
        <CardContent>
          <p>O painel de administração está carregando. Por favor, aguarde.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPanel;
