import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type aliases for convenience
type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type NewMarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Insert'];
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type NewTeamMember = Database['public']['Tables']['team_members']['Insert'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type NewTestimonial = Database['public']['Tables']['testimonials']['Insert'];
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update'];


// Context type definition
interface AdminContextType {
  // Marketing Campaigns
  marketingCampaigns: MarketingCampaign[] | undefined;
  isLoadingCampaigns: boolean;
  addCampaign: (campaign: NewMarketingCampaign) => void;
  deleteCampaign: (id: string) => void;

  // Team Members
  teamMembers: TeamMember[] | undefined;
  isLoadingTeam: boolean;
  addTeamMember: (member: NewTeamMember) => void;
  deleteTeamMember: (id: string) => void;

  // Testimonials
  testimonials: Testimonial[] | undefined;
  isLoadingTestimonials: boolean;
  addTestimonial: (testimonial: NewTestimonial) => void;
  updateTestimonial: (testimonial: UpdateTestimonial) => void;
  deleteTestimonial: (id: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// API functions
const fetcher = async (table: string) => {
  const { data, error } = await supabase.from(table).select('*').order('created_at');
  if (error) throw new Error(error.message);
  return data;
};

const inserter = async (table: string, newItem: any) => {
  const { error } = await supabase.from(table).insert(newItem);
  if (error) throw new Error(error.message);
};

const updater = async (table: string, updatedItem: any) => {
    const { id, ...rest } = updatedItem;
    if (!id) throw new Error("Update requires an ID");
    const { error } = await supabase.from(table).update(rest).eq('id', id);
    if (error) throw new Error(error.message);
}

const deleter = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
};

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // --- Marketing Campaigns ---
  const { data: marketingCampaigns, isLoading: isLoadingCampaigns } = useQuery({
    queryKey: ['marketing_campaigns'],
    queryFn: () => fetcher('marketing_campaigns') as Promise<MarketingCampaign[]>,
  });
  const addCampaignMutation = useMutation({
    mutationFn: (campaign: NewMarketingCampaign) => inserter('marketing_campaigns', campaign),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });
  const deleteCampaignMutation = useMutation({
    mutationFn: (id: string) => deleter('marketing_campaigns', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });

  // --- Team Members ---
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery({
    queryKey: ['team_members'],
    queryFn: () => fetcher('team_members') as Promise<TeamMember[]>,
  });
  const addTeamMemberMutation = useMutation({
    mutationFn: (member: NewTeamMember) => inserter('team_members', member),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });
  const deleteTeamMemberMutation = useMutation({
    mutationFn: (id: string) => deleter('team_members', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });

  // --- Testimonials ---
  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery({
    queryKey: ['testimonials'],
    queryFn: () => fetcher('testimonials') as Promise<Testimonial[]>,
  });
  const addTestimonialMutation = useMutation({
    mutationFn: (testimonial: NewTestimonial) => inserter('testimonials', testimonial),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const updateTestimonialMutation = useMutation({
    mutationFn: (testimonial: UpdateTestimonial) => updater('testimonials', testimonial),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const deleteTestimonialMutation = useMutation({
    mutationFn: (id: string) => deleter('testimonials', id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const value = {
    marketingCampaigns,
    isLoadingCampaigns,
    addCampaign: addCampaignMutation.mutate,
    deleteCampaign: deleteCampaignMutation.mutate,

    teamMembers,
    isLoadingTeam,
    addTeamMember: addTeamMemberMutation.mutate,
    deleteTeamMember: deleteTeamMemberMutation.mutate,

    testimonials,
    isLoadingTestimonials,
    addTestimonial: addTestimonialMutation.mutate,
    updateTestimonial: updateTestimonialMutation.mutate,
    deleteTestimonial: deleteTestimonialMutation.mutate,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
