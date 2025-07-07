-- =================================================================
-- SCRIPT DE RECONFIGURAÇÃO COMPLETA E FINAL (Versão 2 - Corrige Schema)
-- Este script redefine permissões, e o mais importante, ATUALIZA A ESTRUTURA
-- da tabela 'testimonials' para resolver o erro "Could not find column 'city'".
-- =================================================================

-- Etapa 1: Concede permissões básicas ao role 'anon' (visitante do site)
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Etapa 2: Limpa todas as políticas antigas para evitar conflitos
DROP POLICY IF EXISTS "Public Read Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Admin Full Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Public Full Access" ON public.marketing_campaigns;
DROP POLICY IF EXISTS "Public Read Access" ON public.team_members;
DROP POLICY IF EXISTS "Admin Full Access" ON public.team_members;
DROP POLICY IF EXISTS "Public Full Access" ON public.team_members;
DROP POLICY IF EXISTS "Public Read Access" ON public.testimonials;
DROP POLICY IF EXISTS "Admin Full Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Full Access" ON public.testimonials;
DROP POLICY IF EXISTS "Public Full Access" ON storage.objects;

-- Etapa 3: Garante que as tabelas de campanhas e equipe existem
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), image_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());
CREATE TABLE IF NOT EXISTS public.team_members (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), image_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

-- Etapa 4: ATUALIZA a tabela de depoimentos (testimonials)
-- Primeiro, garante que a tabela exista com as colunas BÁSICAS.
CREATE TABLE IF NOT EXISTS public.testimonials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), quote TEXT NOT NULL, author TEXT NOT NULL, business TEXT NOT NULL, logo_url TEXT NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW());

-- Adiciona as colunas 'city' e 'state' se elas não existirem.
-- Isso é o que corrige o erro "Could not find the 'city' column".
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS state TEXT;

-- Remove a coluna 'location' antiga, se ela existir.
ALTER TABLE public.testimonials DROP COLUMN IF EXISTS location;

-- Define as novas colunas como NOT NULL para corresponder ao código.
-- Isso pode falhar se a tabela já tiver dados sem cidade/estado.
-- Para segurança, mantenha comentado se não tiver certeza.
-- ALTER TABLE public.testimonials ALTER COLUMN city SET NOT NULL;
-- ALTER TABLE public.testimonials ALTER COLUMN state SET NOT NULL;


-- Etapa 5: Habilita RLS e cria uma política única e totalmente permissiva
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Full Access" ON public.marketing_campaigns FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access" ON public.team_members FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Public Full Access" ON public.testimonials FOR ALL TO anon USING (true) WITH CHECK (true);

-- Etapa 6: Reconfigura o Storage
INSERT INTO storage.buckets (id, name, public) VALUES ('site_assets', 'site_assets', true) ON CONFLICT (id) DO NOTHING;
CREATE POLICY "Public Full Access" ON storage.objects FOR ALL TO anon USING (bucket_id = 'site_assets') WITH CHECK (bucket_id = 'site_assets');
