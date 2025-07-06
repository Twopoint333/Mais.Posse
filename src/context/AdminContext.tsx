import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type aliases for convenience
type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type NewMarketingCampaign = { file: File };
type TeamMember = Database['public']['Tables']['team_members']['Row'];
type NewTeamMember = { file: File };
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type NewTestimonial = Omit<Database['public']['Tables']['testimonials']['Insert'], 'id' | 'created_at' | 'logo_url' | 'is_published'> & { logo_file: File };
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update'] & { logo_file?: File; old_logo_url?: string };

// Context type definition
interface AdminContextType {
  // Marketing Campaigns
  marketingCampaigns: MarketingCampaign[] | undefined;
  isLoadingCampaigns: boolean;
  addCampaign: (campaign: NewMarketingCampaign) => Promise<void>;
  deleteCampaign: (campaign: MarketingCampaign) => Promise<void>;
  toggleCampaignStatus: (campaign: MarketingCampaign) => Promise<void>;

  // Team Members
  teamMembers: TeamMember[] | undefined;
  isLoadingTeam: boolean;
  addTeamMember: (member: NewTeamMember) => Promise<void>;
  deleteTeamMember: (member: TeamMember) => Promise<void>;
  toggleTeamMemberStatus: (member: TeamMember) => Promise<void>;

  // Testimonials
  testimonials: Testimonial[] | undefined;
  isLoadingTestimonials: boolean;
  addTestimonial: (testimonial: NewTestimonial) => Promise<void>;
  updateTestimonial: (testimonial: UpdateTestimonial) => Promise<void>;
  deleteTestimonial: (testimonial: Testimonial) => Promise<void>;
  toggleTestimonialStatus: (testimonial: Testimonial) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

// --- Helper Functions ---
const uploadFile = async (bucket: string, file: File): Promise<string> => {
    const fileName = `public/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from(bucket).upload(fileName, file);
    if (error) throw error;
    
    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
};

const deleteFileFromUrl = async (fileUrl: string) => {
    if (!fileUrl) {
        console.warn("Skipping deletion of empty file URL");
        return;
    }
    try {
        const url = new URL(fileUrl);
        // Pathname looks like: /storage/v1/object/public/site_assets/public/12345-image.png
        const pathWithBucket = url.pathname.split('/public/').pop();
        if (!pathWithBucket) {
             console.error("Could not parse path from URL:", fileUrl);
             return;
        }
        
        const [bucket, ...pathParts] = pathWithBucket.split('/');
        const path = pathParts.join('/');

        if (!bucket || !path) {
            console.error("Could not parse bucket and path from URL:", fileUrl);
            return;
        }

        const { error } = await supabase.storage.from(bucket).remove([path]);
        if (error) {
            // It's okay if the file doesn't exist, might have been manually deleted.
            if (error.message !== 'The resource was not found') {
                console.error("Failed to delete file from storage:", error.message);
            }
        }
    } catch (e) {
        console.error("Invalid URL for file deletion:", fileUrl, e);
    }
};

// --- API Functions ---
const fetcher = async (table: string) => {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

const inserter = async (table: string, newItem: any) => {
  const { data, error } = await supabase.from(table).insert(newItem).select();
  if (error) throw new Error(error.message);
  return data;
};

const updater = async (table: string, updatedItem: any) => {
    const { id, ...rest } = updatedItem;
    if (!id) throw new Error("Update requires an ID");
    const { data, error } = await supabase.from(table).update(rest).eq('id', id).select();
    if (error) throw new Error(error.message);
    return data;
}

const deleter = async (table: string, id: string) => {
  const { error } = await supabase.from(table).delete().eq('id', id);
  if (error) throw new Error(error.message);
};


export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();

  // Generic status toggle mutation
  const updateItemStatusMutation = useMutation({
    mutationFn: async ({ table, id, currentStatus }: { table: string, id: string, currentStatus: boolean }) => {
        return updater(table, { id, is_published: !currentStatus });
    },
    onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: [variables.table] });
    }
  });


  // --- Marketing Campaigns ---
  const { data: marketingCampaigns, isLoading: isLoadingCampaigns } = useQuery<MarketingCampaign[]>({
    queryKey: ['marketing_campaigns'],
    queryFn: () => fetcher('marketing_campaigns'),
  });
  const addCampaignMutation = useMutation({
    mutationFn: async ({ file }: NewMarketingCampaign) => {
        const imageUrl = await uploadFile('site_assets', file);
        return inserter('marketing_campaigns', { image_url: imageUrl, is_published: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });
  const deleteCampaignMutation = useMutation({
    mutationFn: async (campaign: MarketingCampaign) => {
        await deleteFileFromUrl(campaign.image_url);
        return deleter('marketing_campaigns', campaign.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });

  // --- Team Members ---
  const { data: teamMembers, isLoading: isLoadingTeam } = useQuery<TeamMember[]>({
    queryKey: ['team_members'],
    queryFn: () => fetcher('team_members'),
  });
  const addTeamMemberMutation = useMutation({
    mutationFn: async ({ file }: NewTeamMember) => {
        const imageUrl = await uploadFile('site_assets', file);
        return inserter('team_members', { image_url: imageUrl, is_published: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });
  const deleteTeamMemberMutation = useMutation({
    mutationFn: async (member: TeamMember) => {
        await deleteFileFromUrl(member.image_url);
        return deleter('team_members', member.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });

  // --- Testimonials ---
  const { data: testimonials, isLoading: isLoadingTestimonials } = useQuery<Testimonial[]>({
    queryKey: ['testimonials'],
    queryFn: () => fetcher('testimonials'),
  });
  const addTestimonialMutation = useMutation({
    mutationFn: async (testimonial: NewTestimonial) => {
        const logoUrl = await uploadFile('site_assets', testimonial.logo_file);
        const { logo_file, ...dbData } = testimonial;
        return inserter('testimonials', { ...dbData, logo_url: logoUrl, is_published: true });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const updateTestimonialMutation = useMutation({
    mutationFn: async (testimonial: UpdateTestimonial) => {
        const { logo_file, old_logo_url, ...dbData } = testimonial;
        let newLogoUrl: string | undefined = undefined;

        if (logo_file) {
            newLogoUrl = await uploadFile('site_assets', logo_file);
            if (old_logo_url) {
                await deleteFileFromUrl(old_logo_url);
            }
        }
        
        const dataToUpdate = newLogoUrl ? { ...dbData, logo_url: newLogoUrl } : dbData;
        return updater('testimonials', dataToUpdate);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const deleteTestimonialMutation = useMutation({
    mutationFn: async (testimonial: Testimonial) => {
        await deleteFileFromUrl(testimonial.logo_url);
        return deleter('testimonials', testimonial.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const value: AdminContextType = {
    marketingCampaigns,
    isLoadingCampaigns,
    addCampaign: addCampaignMutation.mutateAsync,
    deleteCampaign: deleteCampaignMutation.mutateAsync,
    toggleCampaignStatus: (campaign) => updateItemStatusMutation.mutateAsync({ table: 'marketing_campaigns', id: campaign.id, currentStatus: campaign.is_published }),

    teamMembers,
    isLoadingTeam,
    addTeamMember: addTeamMemberMutation.mutateAsync,
    deleteTeamMember: deleteTeamMemberMutation.mutateAsync,
    toggleTeamMemberStatus: (member) => updateItemStatusMutation.mutateAsync({ table: 'team_members', id: member.id, currentStatus: member.is_published }),

    testimonials,
    isLoadingTestimonials,
    addTestimonial: addTestimonialMutation.mutateAsync,
    updateTestimonial: updateTestimonialMutation.mutateAsync,
    deleteTestimonial: deleteTestimonialMutation.mutateAsync,
    toggleTestimonialStatus: (testimonial) => updateItemStatusMutation.mutateAsync({ table: 'testimonials', id: testimonial.id, currentStatus: testimonial.is_published }),
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
