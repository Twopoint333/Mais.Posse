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
export type NewTestimonial = Omit<Database['public']['Tables']['testimonials']['Insert'], 'id' | 'created_at' | 'logo_url'> & { logo_file: File };
// Note: logo_url and old_logo_path will be paths, not full URLs
export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update'] & { logo_file?: File; old_logo_path?: string };

// Context type definition
interface AdminContextType {
  // Marketing Campaigns
  marketingCampaigns: MarketingCampaign[] | undefined;
  isLoadingCampaigns: boolean;
  isErrorCampaigns: boolean;
  errorCampaigns: Error | null;
  addCampaign: (campaign: NewMarketingCampaign) => Promise<unknown>;
  deleteCampaign: (campaign: MarketingCampaign) => Promise<void>;

  // Team Members
  teamMembers: TeamMember[] | undefined;
  isLoadingTeam: boolean;
  isErrorTeam: boolean;
  errorTeam: Error | null;
  addTeamMember: (member: NewTeamMember) => Promise<unknown>;
  deleteTeamMember: (member: TeamMember) => Promise<void>;

  // Testimonials
  testimonials: Testimonial[] | undefined;
  isLoadingTestimonials: boolean;
  isErrorTestimonials: boolean;
  errorTestimonials: Error | null;
  addTestimonial: (testimonial: NewTestimonial) => Promise<unknown>;
  updateTestimonial: (testimonial: UpdateTestimonial) => Promise<unknown>;
  deleteTestimonial: (testimonial: Testimonial) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

const BUCKET_NAME = 'site_assets';

// --- Helper Functions ---
// Returns the path of the uploaded file
const uploadFile = async (file: File): Promise<string> => {
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    // The path no longer contains the "public/" prefix, which was causing issues.
    const path = `${Date.now()}-${sanitizedFileName}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(path, file);
    if (error) throw error;
    return path;
};

// Deletes a file by its path
const deleteFile = async (path: string | null) => {
    if (!path) return;
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([path]);
    if (error && error.message !== 'The resource was not found') {
        // Log the error but don't throw, to allow DB record deletion even if file deletion fails
        console.error("Failed to delete file from storage:", error);
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

  // --- Marketing Campaigns ---
  const { data: marketingCampaigns, isLoading: isLoadingCampaigns, isError: isErrorCampaigns, error: errorCampaigns } = useQuery<MarketingCampaign[], Error>({
    queryKey: ['marketing_campaigns'],
    queryFn: () => fetcher('marketing_campaigns'),
  });
  const addCampaignMutation = useMutation<unknown, Error, NewMarketingCampaign>({
    mutationFn: async ({ file }) => {
        const imagePath = await uploadFile(file);
        return inserter('marketing_campaigns', { image_url: imagePath });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });
  const deleteCampaignMutation = useMutation<void, Error, MarketingCampaign>({
    mutationFn: async (campaign) => {
        await deleteFile(campaign.image_url);
        await deleter('marketing_campaigns', campaign.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['marketing_campaigns'] }),
  });

  // --- Team Members ---
  const { data: teamMembers, isLoading: isLoadingTeam, isError: isErrorTeam, error: errorTeam } = useQuery<TeamMember[], Error>({
    queryKey: ['team_members'],
    queryFn: () => fetcher('team_members'),
  });
  const addTeamMemberMutation = useMutation<unknown, Error, NewTeamMember>({
    mutationFn: async ({ file }) => {
        const imagePath = await uploadFile(file);
        return inserter('team_members', { image_url: imagePath });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });
  const deleteTeamMemberMutation = useMutation<void, Error, TeamMember>({
    mutationFn: async (member) => {
        await deleteFile(member.image_url);
        await deleter('team_members', member.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['team_members'] }),
  });

  // --- Testimonials ---
  const { data: testimonials, isLoading: isLoadingTestimonials, isError: isErrorTestimonials, error: errorTestimonials } = useQuery<Testimonial[], Error>({
    queryKey: ['testimonials'],
    queryFn: () => fetcher('testimonials'),
  });
  const addTestimonialMutation = useMutation<unknown, Error, NewTestimonial>({
    mutationFn: async (testimonial) => {
        const logoPath = await uploadFile(testimonial.logo_file);
        const { logo_file, ...dbData } = testimonial;
        return inserter('testimonials', { ...dbData, logo_url: logoPath });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const updateTestimonialMutation = useMutation<unknown, Error, UpdateTestimonial>({
    mutationFn: async (testimonial) => {
        const { logo_file, old_logo_path, ...dbData } = testimonial;
        let newLogoPath: string | undefined = undefined;

        if (logo_file) {
            newLogoPath = await uploadFile(logo_file);
            if (old_logo_path) {
                await deleteFile(old_logo_path);
            }
        }
        
        const dataToUpdate = newLogoPath ? { ...dbData, logo_url: newLogoPath } : dbData;
        return updater('testimonials', dataToUpdate);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const deleteTestimonialMutation = useMutation<void, Error, Testimonial>({
    mutationFn: async (testimonial) => {
        await deleteFile(testimonial.logo_url);
        await deleter('testimonials', testimonial.id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });

  const value: AdminContextType = {
    marketingCampaigns,
    isLoadingCampaigns,
    isErrorCampaigns,
    errorCampaigns,
    addCampaign: addCampaignMutation.mutateAsync,
    deleteCampaign: deleteCampaignMutation.mutateAsync,

    teamMembers,
    isLoadingTeam,
    isErrorTeam,
    errorTeam,
    addTeamMember: addTeamMemberMutation.mutateAsync,
    deleteTeamMember: deleteTeamMemberMutation.mutateAsync,

    testimonials,
    isLoadingTestimonials,
    isErrorTestimonials,
    errorTestimonials,
    addTestimonial: addTestimonialMutation.mutateAsync,
    updateTestimonial: updateTestimonialMutation.mutateAsync,
    deleteTestimonial: deleteTestimonialMutation.mutateAsync,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
