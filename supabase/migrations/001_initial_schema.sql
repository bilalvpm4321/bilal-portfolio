-- ==============================================================================
-- 001_initial_schema.sql
-- Direct-Access Schema & Unauthenticated RLS Policies for Bilal's Portfolio & CMS
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL DEFAULT 'Bilal Ahamed PT',
    headline TEXT NOT NULL DEFAULT 'AI & Data Science | Full Stack Developer',
    bio TEXT,
    about TEXT,
    email TEXT DEFAULT 'bilalvpm2@gmail.com',
    phone TEXT DEFAULT '+91-7306448145',
    location TEXT DEFAULT 'Kerala, India',
    avatar_url TEXT,
    resume_url TEXT,
    availability_status TEXT DEFAULT 'Open to Opportunities & Collaborations',
    years_experience TEXT DEFAULT '2+ Years',
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    short_description TEXT NOT NULL,
    detailed_description TEXT,
    category TEXT NOT NULL,
    image_url TEXT,
    gallery_images JSONB NOT NULL DEFAULT '[]'::JSONB,
    github_url TEXT,
    live_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    display_order INTEGER NOT NULL DEFAULT 0,
    project_date TEXT,
    metrics JSONB NOT NULL DEFAULT '{}'::JSONB,
    highlights TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. PROJECT TECHNOLOGIES TABLE (Normalized relational structure)
CREATE TABLE IF NOT EXISTS public.project_technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    icon TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. SKILLS TABLE
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    icon TEXT,
    level TEXT DEFAULT 'Proficient',
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. EXPERIENCE TABLE
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    company_url TEXT,
    description TEXT,
    responsibilities TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    start_date TEXT NOT NULL,
    end_date TEXT,
    is_current BOOLEAN NOT NULL DEFAULT false,
    location TEXT,
    technologies TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. EDUCATION TABLE
CREATE TABLE IF NOT EXISTS public.education (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    degree TEXT NOT NULL,
    field_of_study TEXT NOT NULL,
    institution TEXT NOT NULL,
    start_year TEXT NOT NULL,
    end_year TEXT NOT NULL,
    grade_or_status TEXT,
    location TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. ACHIEVEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    subtitle TEXT,
    date_or_year TEXT,
    description TEXT,
    badge TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. LEADERSHIP & VOLUNTEERING TABLE
CREATE TABLE IF NOT EXISTS public.leadership (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role TEXT NOT NULL,
    organization TEXT NOT NULL,
    period TEXT NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 9. CERTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TEXT,
    credential_id TEXT,
    credential_url TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. SOCIAL LINKS TABLE
CREATE TABLE IF NOT EXISTS public.social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    icon TEXT,
    label TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_visible BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. SITE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    value JSONB NOT NULL DEFAULT '{}'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. CONTACT MESSAGES TABLE
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_projects_slug ON public.projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_display_order ON public.projects(display_order);
CREATE INDEX IF NOT EXISTS idx_project_tech_project_id ON public.project_technologies(project_id);
CREATE INDEX IF NOT EXISTS idx_skills_category ON public.skills(category);
CREATE INDEX IF NOT EXISTS idx_skills_display_order ON public.skills(display_order);
CREATE INDEX IF NOT EXISTS idx_experience_display_order ON public.experience(display_order);
CREATE INDEX IF NOT EXISTS idx_education_display_order ON public.education(display_order);
CREATE INDEX IF NOT EXISTS idx_achievements_display_order ON public.achievements(display_order);
CREATE INDEX IF NOT EXISTS idx_leadership_display_order ON public.leadership(display_order);
CREATE INDEX IF NOT EXISTS idx_social_links_display_order ON public.social_links(display_order);

-- ==============================================================================
-- UPDATED_AT TRIGGER FUNCTION
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_projects_updated_at ON public.projects;
CREATE TRIGGER set_projects_updated_at BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_site_settings_updated_at ON public.site_settings;
CREATE TRIGGER set_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES FOR DIRECT-ACCESS ADMIN CMS
-- Enables full read, write, update, delete for the portfolio and CMS
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_technologies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leadership ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
DROP POLICY IF EXISTS "Profiles Full Access" ON public.profiles;
CREATE POLICY "Profiles Full Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

-- 2. Projects Policies
DROP POLICY IF EXISTS "Projects Full Access" ON public.projects;
CREATE POLICY "Projects Full Access" ON public.projects FOR ALL USING (true) WITH CHECK (true);

-- 3. Project Technologies Policies
DROP POLICY IF EXISTS "Project Technologies Full Access" ON public.project_technologies;
CREATE POLICY "Project Technologies Full Access" ON public.project_technologies FOR ALL USING (true) WITH CHECK (true);

-- 4. Skills Policies
DROP POLICY IF EXISTS "Skills Full Access" ON public.skills;
CREATE POLICY "Skills Full Access" ON public.skills FOR ALL USING (true) WITH CHECK (true);

-- 5. Experience Policies
DROP POLICY IF EXISTS "Experience Full Access" ON public.experience;
CREATE POLICY "Experience Full Access" ON public.experience FOR ALL USING (true) WITH CHECK (true);

-- 6. Education Policies
DROP POLICY IF EXISTS "Education Full Access" ON public.education;
CREATE POLICY "Education Full Access" ON public.education FOR ALL USING (true) WITH CHECK (true);

-- 7. Achievements Policies
DROP POLICY IF EXISTS "Achievements Full Access" ON public.achievements;
CREATE POLICY "Achievements Full Access" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

-- 8. Leadership Policies
DROP POLICY IF EXISTS "Leadership Full Access" ON public.leadership;
CREATE POLICY "Leadership Full Access" ON public.leadership FOR ALL USING (true) WITH CHECK (true);

-- 9. Certifications Policies
DROP POLICY IF EXISTS "Certifications Full Access" ON public.certifications;
CREATE POLICY "Certifications Full Access" ON public.certifications FOR ALL USING (true) WITH CHECK (true);

-- 10. Social Links Policies
DROP POLICY IF EXISTS "Social Links Full Access" ON public.social_links;
CREATE POLICY "Social Links Full Access" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

-- 11. Site Settings Policies
DROP POLICY IF EXISTS "Site Settings Full Access" ON public.site_settings;
CREATE POLICY "Site Settings Full Access" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- 12. Contact Messages Policies
DROP POLICY IF EXISTS "Contact Messages Full Access" ON public.contact_messages;
CREATE POLICY "Contact Messages Full Access" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- GRANTS & POSTGREST SCHEMA CACHE RELOAD
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role, postgres;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role, postgres;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role, postgres;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role, postgres;

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
