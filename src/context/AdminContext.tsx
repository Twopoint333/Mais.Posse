import React, { createContext, useContext, ReactNode } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Type aliases for convenience
export type MarketingCampaign = Database['public']['Tables']['marketing_campaigns']['Row'];
type NewMarketingCampaign = { files: File[] };
export type TeamMember = Database['public']['Tables']['team_members']['Row'];
type NewTeamMember = { files: File[] };
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];

export type NewTestimonial = Omit<Database['public']['Tables']['testimonials']['Insert'], 'id' | 'created_at' | 'logo_url'> & { 
  logo_file?: File;
  video_url?: string | null;
  thumbnail_url?: string | null;
};

export type UpdateTestimonial = Database['public']['Tables']['testimonials']['Update'] & { 
  logo_file?: File; 
  old_logo_path?: string | null;
  remove_logo?: boolean;
};


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
const deleteFile = async (path: string | null | undefined) => {
    if (!path) return;
    // Robustly handle old paths that might still include "public/"
    const imagePath = path.replace(/^public\//, '');
    const { error } = await supabase.storage.from(BUCKET_NAME).remove([imagePath]);
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
    mutationFn: async ({ files }) => {
        const uploadPromises = files.map(file => uploadFile(file));
        const imagePaths = await Promise.all(uploadPromises);
        const newCampaigns = imagePaths.map(image_url => ({ image_url }));
        return inserter('marketing_campaigns', newCampaigns);
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
    mutationFn: async ({ files }) => {
        const uploadPromises = files.map(file => uploadFile(file));
        const imagePaths = await Promise.all(uploadPromises);
        const newMembers = imagePaths.map(image_url => ({ image_url }));
        return inserter('team_members', newMembers);
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
        const { logo_file, ...dbData } = testimonial;
        let logoPath: string | null = null;
        if (logo_file) {
          logoPath = await uploadFile(logo_file);
        }
        return inserter('testimonials', { ...dbData, logo_url: logoPath });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['testimonials'] }),
  });
  const updateTestimonialMutation = useMutation<unknown, Error, UpdateTestimonial>({
    mutationFn: async (testimonial) => {
        const { logo_file, old_logo_path, remove_logo, ...dbData } = testimonial;
        const dataToUpdate: Partial<Testimonial> & { id: string } = { ...dbData as Testimonial };

        if (remove_logo) {
            dataToUpdate.logo_url = null;
            if (old_logo_path) await deleteFile(old_logo_path);
        } else if (logo_file) {
            dataToUpdate.logo_url = await uploadFile(logo_file);
            if (old_logo_path) await deleteFile(old_logo_path);
        }
        
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
