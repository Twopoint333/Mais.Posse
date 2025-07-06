import React, { createContext, useContext, useState, SetStateAction } from 'react';

// Interfaces for data structures
export interface MarketingCampaign {
  id: string;
  imageUrl: string;
}

export interface TeamMember {
  id: string;
  imageUrl: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  business: string;
  location: string;
  logoUrl: string;
}

// Default data if localStorage is empty
const defaultData = {
  marketingCampaigns: [
    { id: '1', imageUrl: '/lovable-uploads/352c9ee3-e2b5-4ad6-bd4c-f074346670be.png' },
    { id: '2', imageUrl: '/lovable-uploads/3026788e-bc43-493f-9082-c4f5cd2d0a6b.png' },
    { id: '3', imageUrl: '/lovable-uploads/32fc0e1d-e6dc-4e3a-95e3-040557da4601.png' },
    { id: '4', imageUrl: '/lovable-uploads/cb108444-5f14-4286-a0de-ece70d147d42.png' },
    { id: '5', imageUrl: '/lovable-uploads/8cae2fea-a2f7-4120-927e-a63700a263f1.png' }
  ],
  teamMembers: [
    { id: '1', imageUrl: '/motoboy.jpg' },
    { id: '2', imageUrl: 'https://i.imgur.com/oILzGmK.jpeg' }
  ],
  testimonials: [
    {
      id: '1',
      quote: "No dia que aceitei integrar meu estabelecimento ao Mais Delivery, vi resultados imediatos. Agora estamos oferecendo nossos produtos para um público muito maior, sem precisar de investimento.",
      author: "José Pereira",
      business: "JP LANCHES",
      location: "Ibotirama/BA",
      logoUrl: "/lovable-uploads/f77b271e-548c-4262-acd1-cc6a29a145d8.png"
    },
    {
      id: '2',
      quote: "A parceria com o Mais Delivery transformou nossa visibilidade no mercado. O aumento nas vendas foi notável já nos primeiros meses, e a taxa justa torna o serviço extremamente vantajoso.",
      author: "Jairo Chagas",
      business: "JC IMPORTS",
      location: "Ibotirama/BA",
      logoUrl: "/lovable-uploads/fd760325-58a6-411e-a047-98f63307db41.png"
    },
    {
      id: '3',
      quote: "Nossa entrada no Mais Delivery foi uma decisão acertada. A plataforma é intuitiva e a equipe de suporte realmente se importa com nosso sucesso. Recomendamos o serviço.",
      author: "Eriques Fonseca",
      business: "Lanchonete Pinguim",
      location: "Barra/BA",
      logoUrl: "/lovable-uploads/c301d3fe-5693-4938-b64e-be25b2d44acf.png"
    }
  ]
};

// Helper to get data from localStorage
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key “${key}”:`, error);
    return defaultValue;
  }
};

// Helper to set data to localStorage
const setInStorage = <T,>(key: string, value: T) => {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Error setting localStorage key “${key}”:`, error);
  }
};

// Context type definition
interface AdminContextType {
  marketingCampaigns: MarketingCampaign[];
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  setMarketingCampaigns: React.Dispatch<SetStateAction<MarketingCampaign[]>>;
  setTeamMembers: React.Dispatch<SetStateAction<TeamMember[]>>;
  setTestimonials: React.Dispatch<SetStateAction<Testimonial[]>>;
  resetData: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [marketingCampaigns, _setMarketingCampaigns] = useState<MarketingCampaign[]>(() => getFromStorage('marketingCampaigns', defaultData.marketingCampaigns));
  const [teamMembers, _setTeamMembers] = useState<TeamMember[]>(() => getFromStorage('teamMembers', defaultData.teamMembers));
  const [testimonials, _setTestimonials] = useState<Testimonial[]>(() => getFromStorage('testimonials', defaultData.testimonials));

  const setMarketingCampaigns = (value: SetStateAction<MarketingCampaign[]>) => {
    _setMarketingCampaigns(prev => {
      const newValue = typeof value === 'function' ? (value as (prevState: MarketingCampaign[]) => MarketingCampaign[])(prev) : value;
      setInStorage('marketingCampaigns', newValue);
      return newValue;
    });
  };

  const setTeamMembers = (value: SetStateAction<TeamMember[]>) => {
    _setTeamMembers(prev => {
      const newValue = typeof value === 'function' ? (value as (prevState: TeamMember[]) => TeamMember[])(prev) : value;
      setInStorage('teamMembers', newValue);
      return newValue;
    });
  };

  const setTestimonials = (value: SetStateAction<Testimonial[]>) => {
    _setTestimonials(prev => {
      const newValue = typeof value === 'function' ? (value as (prevState: Testimonial[]) => Testimonial[])(prev) : value;
      setInStorage('testimonials', newValue);
      return newValue;
    });
  };

  const resetData = () => {
    setMarketingCampaigns(defaultData.marketingCampaigns);
    setTeamMembers(defaultData.teamMembers);
    setTestimonials(defaultData.testimonials);
  };
  
  return (
    <AdminContext.Provider value={{
      marketingCampaigns,
      teamMembers,
      testimonials,
      setMarketingCampaigns,
      setTeamMembers,
      setTestimonials,
      resetData
    }}>
      {children}
    </AdminContext.Provider>
  );
};
