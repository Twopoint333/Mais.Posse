# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/228c3d84-c937-4e7f-9190-45199364bdc1

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/228c3d84-c937-4e7f-9190-45199364bdc1) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase

## Supabase Setup

This project uses Supabase for the database and file storage to power the Admin Panel. To run the project locally or set it up from scratch, you'll need to configure Supabase.

1.  **Create a Supabase Project:** If you haven't already, create a new project at [database.new](https://database.new).
2.  **Get API Keys:** In your Supabase project dashboard, go to **Project Settings** (the gear icon) > **API**. You will find the **Project URL** and the **`anon` public API key**.
3.  **Update Client:** Paste these values into `src/integrations/supabase/client.ts`.
4.  **Run Setup Script:** Go to the **SQL Editor** in your Supabase dashboard and execute the following script. This will create the necessary tables, storage bucket, and access policies.

```sql
-- Apaga políticas antigas para garantir uma configuração limpa
DROP POLICY IF EXISTS "Public Full Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Public Read Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Admin Full Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Public Full Access" ON public.team_members;
DROP POLICY IF EXISTS "Public Read Access" ON public.team_members;
DROP POLICY IF EXISTS "Admin Full Access" ON public.team_members;
DROP POLICY IF EXISTS "Public Full Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Access" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Full Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;

-- 1. Cria as tabelas se elas não existirem
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quote TEXT NOT NULL,
  author TEXT NOT NULL,
  business TEXT NOT NULL,
  location TEXT NOT NULL,
  logo_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilita RLS (se ainda não estiver) e cria as políticas de acesso para as tabelas
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Access" ON public.marketing_campaigns FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON public.marketing_campaigns FOR ALL TO anon WITH CHECK (true);

CREATE POLICY "Public Read Access" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON public.team_members FOR ALL TO anon WITH CHECK (true);

CREATE POLICY "Public Read Access" ON public.testimonials FOR SELECT USING (true);
CREATE POLICY "Admin Full Access" ON public.testimonials FOR ALL TO anon WITH CHECK (true);


-- 3. Configura o Storage (Armazenamento de Arquivos)
-- Cria o bucket se ele não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site_assets', 'site_assets', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
ON CONFLICT (id) DO UPDATE SET public = true, file_size_limit = 5242880, allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- Cria políticas de acesso para o bucket 'site_assets'
CREATE POLICY "Public Read Access" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'site_assets');
CREATE POLICY "Admin Upload Access" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'site_assets');
CREATE POLICY "Admin Update Access" ON storage.objects FOR UPDATE TO anon USING (bucket_id = 'site_assets');
CREATE POLICY "Admin Delete Access" ON storage.objects FOR DELETE TO anon USING (bucket_id = 'site_assets');

```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/228c3d84-c937-4e7f-9190-45199364bdc1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
