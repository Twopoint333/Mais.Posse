-- =================================================================
-- SCRIPT DE CONFIGURAÇÃO COMPLETO PARA O SUPABASE
-- Execute este script no SQL Editor do seu projeto Supabase.
-- =================================================================

-- 1. Criação das Tabelas
-- Apaga tabelas existentes para garantir um recomeço limpo (cuidado em produção)
DROP TABLE IF EXISTS "public"."marketing_campaigns" CASCADE;
DROP TABLE IF EXISTS "public"."team_members" CASCADE;
DROP TABLE IF EXISTS "public"."testimonials" CASCADE;

-- Tabela para Campanhas de Marketing
CREATE TABLE public.marketing_campaigns (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabela para Membros da Equipe
CREATE TABLE public.team_members (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    image_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Tabela para Depoimentos (com campos para vídeo)
CREATE TABLE public.testimonials (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    quote text NOT NULL,
    author text NOT NULL,
    business text NOT NULL,
    city text NOT NULL,
    state character varying(2) NOT NULL,
    logo_url text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    video_url text, -- URL para o vídeo no Supabase Storage
    thumbnail_url text -- URL para a miniatura do vídeo
);

-- 2. Configuração do Storage (Armazenamento de Arquivos)
-- Cria o "bucket" (repositório) para os arquivos do site, se ele não existir.
-- O bucket é definido como público para facilitar o acesso às imagens e vídeos.
INSERT INTO storage.buckets (id, name, public)
VALUES ('site_assets', 'site_assets', true)
ON CONFLICT (id) DO NOTHING;


-- 3. Segurança (Row Level Security - RLS)
-- Habilita a segurança em nível de linha para todas as tabelas.
-- Isso garante que as regras de acesso que definiremos sejam aplicadas.
ALTER TABLE public.marketing_campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Apaga políticas antigas para evitar duplicatas
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
