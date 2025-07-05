
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useMedia } from '@/hooks/useMedia';

interface HeaderProps {
  isScrolled: boolean;
  visible: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  isScrolled,
  visible
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useMedia('(max-width: 768px)');
  
  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <>
      <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ease-out ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'} ${visible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <a href="#hero" className="flex items-center">
            <img src="/lovable-uploads/476b844f-a75b-468e-ba6a-1e7345b83181.png" alt="Mais Delivery Logo" className="h-12 md:h-12" />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#beneficios" className="text-[#A21C1C] font-medium hover:text-opacity-80 transition-colors">Benefícios</a>
            <a href="#como-funciona" className="text-[#A21C1C] font-medium hover:text-opacity-80 transition-colors">Como Funciona</a>
            <a href="#depoimentos" className="text-[#A21C1C] font-medium hover:text-opacity-80 transition-colors">Depoimentos</a>
            <Button asChild className="bg-[#A21C1C] hover:bg-[#911616] px-6">
              <a href="#cta">Seja Parceiro</a>
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" onClick={() => setMenuOpen(true)} size="icon" className="md:hidden text-[#A21C1C]">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={closeMenu}>
        <div className={`fixed top-0 right-0 h-full w-4/5 max-w-xs bg-white shadow-xl transform transition-transform duration-300 ease-out ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`} onClick={e => e.stopPropagation()}>
          <div className="flex justify-between items-center p-4 border-b">
            <img src="/lovable-uploads/476b844f-a75b-468e-ba6a-1e7345b83181.png" alt="Mais Delivery Logo" className="h-8" />
            <Button variant="ghost" size="icon" onClick={closeMenu} className="text-[#A21C1C]">
              <X className="h-6 w-6" />
            </Button>
          </div>
          
          <nav className="flex flex-col p-4">
            <a href="#beneficios" className="py-3 text-[#A21C1C] font-medium border-b border-gray-100" onClick={closeMenu}>
              Benefícios
            </a>
            <a href="#como-funciona" className="py-3 text-[#A21C1C] font-medium border-b border-gray-100" onClick={closeMenu}>
              Como Funciona
            </a>
            <a href="#depoimentos" className="py-3 text-[#A21C1C] font-medium border-b border-gray-100" onClick={closeMenu}>
              Depoimentos
            </a>
            <Button asChild className="mt-4 bg-[#A21C1C] hover:bg-[#911616]">
              <a href="#cta" onClick={closeMenu}>
                Seja Parceiro
              </a>
            </Button>
          </nav>
        </div>
      </div>
    </>
  );
};
