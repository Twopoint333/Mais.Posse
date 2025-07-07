-- =================================================================
-- MAIS DELIVERY - SUPABASE SETUP SCRIPT
-- =================================================================
-- This script will:
-- 1. Create the necessary tables: marketing_campaigns, team_members, testimonials.
-- 2. Create the storage bucket 'site_assets' for images and videos.
-- 3. Set up Row Level Security (RLS) policies to allow public read
--    and admin actions (uploads/deletes).
--
-- Run this script in your Supabase SQL Editor.
-- =================================================================

-- =========
-- 1. TABLES
-- =========

-- Create marketing_campaigns table
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.marketing_campaigns IS 'Stores marketing campaign images.';

-- Create team_members table
CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);
COMMENT ON TABLE public.team_members IS 'Stores images of team members.';

-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    quote text NOT NULL,
    author text NOT NULL,
    business text NOT NULL,
    city text NOT NULL,
    state text NOT NULL,
    logo_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    video_url text,
    thumbnail_url text
);
COMMENT ON TABLE public.testimonials IS 'Stores partner testimonials, including text, logos, and videos.';

-- Add video/thumbnail columns if they don't exist (for backwards compatibility)
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS thumbnail_url text;


-- =================
-- 2. STORAGE
-- =================

-- Create a bucket for site assets if it doesn't exist.
-- Set it to public to allow direct image access via URL.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_assets', 'site_assets', true)
ON CONFLICT (id) DO NOTHING;

COMMENT ON BUCKET site_assets IS 'Stores all public assets like campaign images, team photos, and logos.';

-- =================================================================
-- 3. ROW LEVEL SECURITY (RLS) & STORAGE POLICIES
-- =================================================================
-- These policies control who can see and modify data.
-- We allow anyone (anon role) to read data, and the anon key is used
-- by the client-side admin panel to modify data.
-- This is a basic setup. For higher security, use a service_role key
-- on a secure backend instead of client-side admin logic.
-- =================================================================

-- --- RLS POLICIES FOR TABLES ---

-- MARKETING CAMPAIGNS
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read campaigns" ON public.marketing_campaigns;
CREATE POLICY "Public can read campaigns" ON public.marketing_campaigns FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anon can manage campaigns" ON public.marketing_campaigns;
CREATE POLICY "Anon can manage campaigns" ON public.marketing_campaigns FOR ALL USING (true);

-- TEAM MEMBERS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read team members" ON public.team_members;
CREATE POLICY "Public can read team members" ON public.team_members FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anon can manage team members" ON public.team_members;
CREATE POLICY "Anon can manage team members" ON public.team_members FOR ALL USING (true);

-- TESTIMONIALS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can read testimonials" ON public.testimonials;
CREATE POLICY "Public can read testimonials" ON public.testimonials FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anon can manage testimonials" ON public.testimonials;
CREATE POLICY "Anon can manage testimonials" ON public.testimonials FOR ALL USING (true);


-- --- STORAGE POLICIES ---

-- Allow public read access to all files in the bucket.
DROP POLICY IF EXISTS "Allow public read access" ON storage.objects;
CREATE POLICY "Allow public read access" ON storage.objects FOR SELECT USING (bucket_id = 'site_assets');

-- Allow anon role (used by the admin panel) to upload files.
DROP POLICY IF EXISTS "Allow anon upload" ON storage.objects;
CREATE POLICY "Allow anon upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'site_assets');

-- Allow anon role to update files.
DROP POLICY IF EXISTS "Allow anon update" ON storage.objects;
CREATE POLICY "Allow anon update" ON storage.objects FOR UPDATE USING (bucket_id = 'site_assets');

-- Allow anon role to delete files.
DROP POLICY IF EXISTS "Allow anon delete" ON storage.objects;
CREATE POLICY "Allow anon delete" ON storage.objects FOR DELETE USING (bucket_id = 'site_assets');

-- =================================================================
-- SETUP COMPLETE
-- =================================================================
