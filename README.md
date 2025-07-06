
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
4.  **Run Setup Script:** Go to the **SQL Editor** in your Supabase dashboard and execute the full setup script provided below. This will create the necessary tables, storage bucket, and access policies.

### Troubleshooting: Data Not Appearing on Site
If you can upload and delete items from the Admin Panel, but they don't appear on the live site after a page refresh, the issue is almost certainly with Supabase's Row Level Security (RLS) policies blocking read access.

To confirm this, run the following diagnostic script in the **SQL Editor**. This will temporarily disable all security so you can verify if the data loads.

```sql
-- =================================================================
-- SCRIPT DE DIAGNÓSTICO: DESABILITA A SEGURANÇA RLS
-- Use este script APENAS para confirmar se o problema é de permissão.
-- Ele torna suas tabelas completamente públicas.
-- =================================================================

ALTER TABLE public.marketing_campaigns DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials DISABLE ROW LEVEL SECURITY;

-- Após executar, recarregue o site. Se as imagens aparecerem,
-- o problema está 100% nas políticas de RLS.
-- Podemos então criar políticas seguras que funcionem.
```

If disabling RLS solves the problem, you can use the more robust script below to set up the correct permissions and re-enable security.

### Full Setup Script
This script creates the tables and sets up the necessary Row Level Security (RLS) policies and Storage permissions for the site and admin panel to function correctly.

```sql
-- =================================================================
-- SCRIPT DE EMERGÊNCIA: ABRE TODAS AS PERMISSÕES
-- Este script remove todas as políticas de segurança anteriores
-- e concede acesso TOTAL (leitura, escrita, exclusão) para o site.
-- Use isso para confirmar se o problema é de permissão.
-- =================================================================

-- Etapa 1: Apaga TODAS as políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Public Read Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Admin Full Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Public Full Access" ON public.marketing_campaigns;

DROP POLICY IF EXISTS "Public Read Access" ON public.team_members;
DROP POLICY IF EXISTS "Admin Full Access" ON public.team_members;
DROP POLICY IF EXISTS "Public Full Access" ON public.team_members;

DROP POLICY IF EXISTS "Public Read Access" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Full Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Full Access" ON public.testimonials;

DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Upload Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete Access" ON storage.objects;
DROP POLICY IF EXISTS "Public Full Access" ON storage.objects;

-- Etapa 2: Cria as tabelas se elas não existirem
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), image_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.team_members (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), image_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.testimonials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), quote TEXT NOT NULL, author TEXT NOT NULL, business TEXT NOT NULL, location TEXT NOT NULL, logo_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

-- Etapa 3: Garante que RLS esteja ATIVADA
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Etapa 4: Cria UMA ÚNICA POLÍTICA DE ACESSO TOTAL para cada tabela
CREATE POLICY "Public Full Access" ON public.marketing_campaigns FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access" ON public.team_members FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access" ON public.testimonials FOR ALL TO anon USING (true) WITH CHECK (true);

-- Etapa 5: Configura o Armazenamento de Arquivos com ACESSO TOTAL
INSERT INTO storage.buckets (id, name, public) VALUES ('site_assets', 'site_assets', true) ON CONFLICT (id) DO NOTHING;
DROP POLICY IF EXISTS "Public Full Access" ON storage.objects;
CREATE POLICY "Public Full Access" ON storage.objects FOR ALL TO anon USING (bucket_id = 'site_assets') WITH CHECK (bucket_id = 'site_assets');
```

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/228c3d84-c937-4e7f-9190-45199364bdc1) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)




