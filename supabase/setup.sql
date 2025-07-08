-- =================================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETO E SEGURO PARA O SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase.
-- Ele pode ser executado várias vezes sem perda de dados.
-- =================================================================

-- 1. Criação das Tabelas (de forma segura, sem apagar dados)
-- Cria tabelas somente se elas não existirem.
CREATE TABLE IF NOT EXISTS public.marketing_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    quote text NOT NULL,
    author text NOT NULL,
    business text NOT NULL,
    city text NOT NULL,
    state character varying(2) NOT NULL,
    logo_url text, -- Será ajustado para ser opcional
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    video_url text,
    thumbnail_url text
);

-- ALTERAÇÕES NA TABELA: Garante que as colunas existem e têm as propriedades corretas.
-- Adiciona colunas de vídeo/thumbnail se não existirem
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS video_url text;
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS thumbnail_url text;

-- Remove a restrição "NOT NULL" da coluna 'logo_url' para torná-la opcional.
-- ISTO CORRIGE O ERRO "violates not-null constraint" ao tentar remover um logo.
ALTER TABLE public.testimonials ALTER COLUMN logo_url DROP NOT NULL;


-- 2. Configuração do Storage (Armazenamento de Arquivos)
-- Cria o "bucket" (repositório) para os arquivos do site, se ele não existir.
-- O bucket é definido como público para facilitar o acesso às imagens e vídeos.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('site_assets', 'site_assets', true, null, null)
ON CONFLICT (id) DO NOTHING;


-- 3. Segurança (Row Level Security - RLS)
-- Habilita a segurança em nível de linha para todas as tabelas.
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Apaga políticas antigas para evitar duplicatas e conflitos.
DROP POLICY IF EXISTS "Allow public read access" ON "public"."marketing_campaigns";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."team_members";
DROP POLICY IF EXISTS "Allow public read access" ON "public"."testimonials";
DROP POLICY IF EXISTS "Allow authenticated users to manage content" ON "public"."marketing_campaigns";
DROP POLICY IF EXISTS "Allow authenticated users to manage content" ON "public"."team_members";
DROP POLICY IF EXISTS "Allow authenticated users to manage content" ON "public"."testimonials";
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Uploads" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Updates" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Deletes" ON storage.objects;

-- Define as políticas de acesso para as TABELAS
-- Permite que qualquer pessoa (visitantes do site) leia (SELECT) os dados.
CREATE POLICY "Allow public read access" ON public.marketing_campaigns FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.team_members FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON public.testimonials FOR SELECT USING (true);

-- Permite que usuários autenticados (ou seja, você no painel admin) possam
-- inserir, atualizar e deletar conteúdo.
CREATE POLICY "Allow authenticated users to manage content" ON public.marketing_campaigns
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage content" ON public.team_members
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated users to manage content" ON public.testimonials
FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- Define as políticas de acesso para o STORAGE
-- Permite que qualquer pessoa veja os arquivos (necessário para exibir no site).
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'site_assets');

-- Permite que usuários autenticados (admin) enviem novos arquivos.
CREATE POLICY "Authenticated Uploads" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site_assets');

-- Permite que usuários autenticados (admin) atualizem arquivos.
CREATE POLICY "Authenticated Updates" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'site_assets');

-- Permite que usuários autenticados (admin) deletem arquivos.
CREATE POLICY "Authenticated Deletes" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'site_assets');

GRANT ALL ON TABLE public.marketing_campaigns TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.team_members TO anon, authenticated, service_role;
GRANT ALL ON TABLE public.testimonials TO anon, authenticated, service_role;
