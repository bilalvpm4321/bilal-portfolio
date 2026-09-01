-- ==============================================================================
-- COMPLETE ALL-IN-ONE SQL SETUP SCRIPT FOR BILAL AHAMED PT PORTFOLIO
-- Execute this entire file in your Supabase SQL Editor: https://app.supabase.com/project/fzyzsgcdpcrmbpvhodri/sql
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

-- 3. PROJECT TECHNOLOGIES TABLE
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

-- INDEXES
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

-- UPDATED_AT TRIGGER
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

-- RLS POLICIES
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

DROP POLICY IF EXISTS "Profiles Full Access" ON public.profiles;
CREATE POLICY "Profiles Full Access" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Projects Full Access" ON public.projects;
CREATE POLICY "Projects Full Access" ON public.projects FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Project Technologies Full Access" ON public.project_technologies;
CREATE POLICY "Project Technologies Full Access" ON public.project_technologies FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Skills Full Access" ON public.skills;
CREATE POLICY "Skills Full Access" ON public.skills FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Experience Full Access" ON public.experience;
CREATE POLICY "Experience Full Access" ON public.experience FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Education Full Access" ON public.education;
CREATE POLICY "Education Full Access" ON public.education FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Achievements Full Access" ON public.achievements;
CREATE POLICY "Achievements Full Access" ON public.achievements FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Leadership Full Access" ON public.leadership;
CREATE POLICY "Leadership Full Access" ON public.leadership FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Certifications Full Access" ON public.certifications;
CREATE POLICY "Certifications Full Access" ON public.certifications FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Social Links Full Access" ON public.social_links;
CREATE POLICY "Social Links Full Access" ON public.social_links FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Site Settings Full Access" ON public.site_settings;
CREATE POLICY "Site Settings Full Access" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Contact Messages Full Access" ON public.contact_messages;
CREATE POLICY "Contact Messages Full Access" ON public.contact_messages FOR ALL USING (true) WITH CHECK (true);

-- STORAGE BUCKET SETUP
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio',
    'portfolio',
    true,
    10485760,
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf']
)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Direct Upload Access" ON storage.objects;
CREATE POLICY "Direct Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Direct Update Access" ON storage.objects;
CREATE POLICY "Direct Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');

DROP POLICY IF EXISTS "Direct Delete Access" ON storage.objects;
CREATE POLICY "Direct Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');

-- REALTIME PUBLICATION
DO $$
BEGIN
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.project_technologies;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.skills;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.experience;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.education;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.achievements;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.leadership;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.social_links;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
    BEGIN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
END $$;

-- ==============================================================================
-- INITIAL SEED DATA
-- ==============================================================================

-- Profiles Seed
INSERT INTO public.profiles (
    id,
    full_name,
    headline,
    bio,
    about,
    email,
    phone,
    location,
    avatar_url,
    resume_url,
    availability_status,
    years_experience,
    is_visible
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Bilal Ahamed PT',
    'AI & Data Science | Full Stack Developer',
    'M.Tech Computer Science and Engineering (AI & Data Science) student at CUSAT with hands-on experience in full-stack development, Generative AI, Machine Learning, cloud technologies, and real-time systems.',
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.',
    'bilalvpm2@gmail.com',
    '+91-7306448145',
    'Kerala, India',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
    '/resume.pdf',
    'Open to Opportunities & Collaborations',
    '2+ Years',
    true
) ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    headline = EXCLUDED.headline,
    bio = EXCLUDED.bio,
    about = EXCLUDED.about;

-- Project 1: Smile AI Tutor
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    detailed_description,
    category,
    image_url,
    gallery_images,
    github_url,
    live_url,
    is_featured,
    is_published,
    display_order,
    project_date,
    metrics,
    highlights
) VALUES (
    '11111111-1111-1111-1111-111111111101',
    'Smile AI Tutor',
    'smile-ai-tutor',
    'AI-powered personalized learning platform designed to deliver adaptive, student-centric education using Generative AI, NLP, Computer Vision, and adaptive assessment.',
    'AI-powered personalized learning platform designed to deliver adaptive, student-centric education using Generative AI, NLP, Computer Vision, and adaptive assessment. The platform generates learning modules, evaluates student performance, and dynamically personalizes learning paths with practical modules and handwriting evaluation.',
    'Generative AI / NLP / Full Stack',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80"]'::JSONB,
    'https://github.com/bilalvpm4321',
    '',
    true,
    true,
    1,
    '2024 - Present',
    '{"accuracy": "94%", "studentsImpacted": "500+", "latency": "<300ms"}'::JSONB,
    ARRAY[
        'AI-generated adaptive courses & curriculum',
        'Interactive assessments & performance-based progression',
        'Practical learning modules with conversational AI',
        'AI-powered handwritten assignment evaluation with Computer Vision',
        'Personalized learning support & real-time analytics'
    ]
) ON CONFLICT (slug) DO NOTHING;

-- Project 2: YodhaC.AI
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    detailed_description,
    category,
    image_url,
    gallery_images,
    github_url,
    live_url,
    is_featured,
    is_published,
    display_order,
    project_date,
    metrics,
    highlights
) VALUES (
    '11111111-1111-1111-1111-111111111102',
    'YodhaC.AI',
    'yodhac-ai',
    'Advanced enterprise phishing intelligence and network monitoring platform designed to monitor office systems for malicious URLs and phishing attempts.',
    'Advanced enterprise phishing intelligence and network monitoring platform designed to monitor office systems for malicious URLs and phishing attempts. When a potentially malicious or phishing URL is detected on an office system, the platform identifies the source system and alerts the administrator with its IP address, allowing security teams to monitor and respond to threats across the office network.',
    'AI / Cybersecurity / ML',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80',
    '["https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80"]'::JSONB,
    'https://github.com/bilalvpm4321',
    '',
    true,
    true,
    2,
    '2024',
    '{"detectionRate": "98.7%", "alertLatency": "Real-time", "classification": "XGBoost"}'::JSONB,
    ARRAY[
        'Phishing URL detection & Machine Learning classification',
        'Real-time network packet monitoring & security alerts',
        'Source IP identification & office-wide system monitoring',
        'Automated security response dashboard for system admins'
    ]
) ON CONFLICT (slug) DO NOTHING;

-- Project 3: Smart Wastebin Management System
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    detailed_description,
    category,
    image_url,
    gallery_images,
    github_url,
    live_url,
    is_featured,
    is_published,
    display_order,
    project_date,
    metrics,
    highlights
) VALUES (
    '11111111-1111-1111-1111-111111111103',
    'Smart Wastebin Management System',
    'smart-wastebin-management-system',
    'ESP32-based smart waste monitoring system using ultrasonic sensors, MQTT, and AWS cloud with predictive fill time ML model.',
    'Built an ESP32-based smart waste monitoring system using ultrasonic sensors and MQTT. Integrated AWS Lambda and DynamoDB for real-time processing and storage, with a machine learning model to predict bin fill time for optimized waste collection.',
    'IoT / AWS / Machine Learning',
    'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=1200&q=80',
    '[]'::JSONB,
    'https://github.com/bilalvpm4321/Wastebin_management',
    '',
    false,
    true,
    3,
    '2024',
    '{"predictionAccuracy": "92%", "cloudLatency": "120ms"}'::JSONB,
    ARRAY[
        'ESP32 microcontroller integration with ultrasonic sensors',
        'Real-time MQTT telemetry streaming to AWS cloud',
        'AWS Lambda serverless processing and DynamoDB storage',
        'Machine Learning model predicting fill time for smart garbage route optimization'
    ]
) ON CONFLICT (slug) DO NOTHING;

-- Project 4: Fake News Detection in Malayalam
INSERT INTO public.projects (
    id,
    title,
    slug,
    short_description,
    detailed_description,
    category,
    image_url,
    gallery_images,
    github_url,
    live_url,
    is_featured,
    is_published,
    display_order,
    project_date,
    metrics,
    highlights
) VALUES (
    '11111111-1111-1111-1111-111111111104',
    'Fake News Detection in Malayalam',
    'fake-news-detection-malayalam',
    'Multilingual fake news detection system using NLP and Computer Vision for text, image, and URL authenticity verification.',
    'Developed a multilingual fake news detection system using NLP and computer vision for text, image, and URL analysis. Implemented image tampering detection, URL credibility checks, reverse search, confidence scoring, and an administrative verification dashboard.',
    'NLP / Computer Vision / AI',
    'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80',
    '[]'::JSONB,
    'https://github.com/bilalvpm4321/Yeah-Fake-news-detection-in-maklayalam',
    '',
    false,
    true,
    4,
    '2023 - 2024',
    '{"languages": "Malayalam & English", "pipeline": "Multimodal NLP+CV"}'::JSONB,
    ARRAY[
        'Multimodal NLP for regional Malayalam news corpus analysis',
        'Image tampering and deepfake/manipulation detection',
        'URL credibility checking and automated reverse search',
        'Confidence scoring algorithm with admin moderation dashboard'
    ]
) ON CONFLICT (slug) DO NOTHING;

-- Project Technologies
INSERT INTO public.project_technologies (project_id, name, icon, display_order)
SELECT id, 'React / Next.js', 'react', 1 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'TypeScript', 'typescript', 2 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'FastAPI', 'fastapi', 3 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'Python', 'python', 4 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'OpenAI GPT Models', 'openai', 5 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'Computer Vision', 'cv', 6 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'MongoDB', 'mongodb', 7 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'Firebase / Firestore', 'firebase', 8 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'PWA', 'pwa', 9 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'YouTube API', 'youtube', 10 FROM public.projects WHERE slug = 'smile-ai-tutor'
UNION ALL SELECT id, 'React', 'react', 1 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'FastAPI', 'fastapi', 2 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'Python', 'python', 3 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'XGBoost', 'ml', 4 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'Wireshark', 'network', 5 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'Docker', 'docker', 6 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'Fly.io', 'cloud', 7 FROM public.projects WHERE slug = 'yodhac-ai'
UNION ALL SELECT id, 'ESP32', 'hardware', 1 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'Ultrasonic Sensors', 'sensor', 2 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'MQTT', 'mqtt', 3 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'AWS Lambda', 'aws', 4 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'AWS DynamoDB', 'aws', 5 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'Machine Learning', 'ml', 6 FROM public.projects WHERE slug = 'smart-wastebin-management-system'
UNION ALL SELECT id, 'Python', 'python', 1 FROM public.projects WHERE slug = 'fake-news-detection-malayalam'
UNION ALL SELECT id, 'NLP', 'nlp', 2 FROM public.projects WHERE slug = 'fake-news-detection-malayalam'
UNION ALL SELECT id, 'Computer Vision', 'cv', 3 FROM public.projects WHERE slug = 'fake-news-detection-malayalam'
UNION ALL SELECT id, 'Machine Learning', 'ml', 4 FROM public.projects WHERE slug = 'fake-news-detection-malayalam'
UNION ALL SELECT id, 'Web Scraping', 'scraping', 5 FROM public.projects WHERE slug = 'fake-news-detection-malayalam'
ON CONFLICT DO NOTHING;

-- Skills
INSERT INTO public.skills (name, category, level, display_order, is_visible) VALUES
('Python', 'Programming', 'Expert', 1, true),
('JavaScript (ES6+)', 'Programming', 'Advanced', 2, true),
('TypeScript', 'Programming', 'Advanced', 3, true),
('C / C++', 'Programming', 'Proficient', 4, true),
('SQL', 'Programming', 'Advanced', 5, true),
('Generative AI', 'AI & Machine Learning', 'Advanced', 1, true),
('OpenAI GPT & Prompt Engineering', 'AI & Machine Learning', 'Advanced', 2, true),
('Machine Learning', 'AI & Machine Learning', 'Advanced', 3, true),
('Deep Learning', 'AI & Machine Learning', 'Proficient', 4, true),
('Natural Language Processing (NLP)', 'AI & Machine Learning', 'Advanced', 5, true),
('Computer Vision', 'AI & Machine Learning', 'Proficient', 6, true),
('XGBoost & Scikit-Learn', 'AI & Machine Learning', 'Advanced', 7, true),
('React.js', 'Frontend', 'Advanced', 1, true),
('Next.js', 'Frontend', 'Advanced', 2, true),
('Tailwind CSS', 'Frontend', 'Expert', 3, true),
('HTML5 & Modern CSS3', 'Frontend', 'Expert', 4, true),
('Vite & PWA', 'Frontend', 'Advanced', 5, true),
('Framer Motion', 'Frontend', 'Advanced', 6, true),
('FastAPI', 'Backend & Cloud', 'Advanced', 1, true),
('Node.js & Express', 'Backend & Cloud', 'Proficient', 2, true),
('Firebase & Firestore', 'Backend & Cloud', 'Advanced', 3, true),
('Supabase (Postgres/Realtime)', 'Backend & Cloud', 'Advanced', 4, true),
('Google Cloud Platform (GCP)', 'Backend & Cloud', 'Proficient', 5, true),
('AWS Lambda & DynamoDB', 'Backend & Cloud', 'Proficient', 6, true),
('RESTful APIs & JWT', 'Backend & Cloud', 'Advanced', 7, true),
('PostgreSQL', 'Databases', 'Advanced', 1, true),
('MongoDB', 'Databases', 'Advanced', 2, true),
('Firebase Realtime Database', 'Databases', 'Advanced', 3, true),
('AWS DynamoDB', 'Databases', 'Proficient', 4, true),
('Docker', 'DevOps & Tools', 'Proficient', 1, true),
('Git & GitHub', 'DevOps & Tools', 'Advanced', 2, true),
('Wireshark', 'DevOps & Tools', 'Proficient', 3, true),
('Fly.io', 'DevOps & Tools', 'Proficient', 4, true),
('Linux / Bash', 'DevOps & Tools', 'Proficient', 5, true),
('Postman', 'DevOps & Tools', 'Advanced', 6, true),
('MQTT Protocol', 'DevOps & Tools', 'Proficient', 7, true)
ON CONFLICT DO NOTHING;

-- Experience
INSERT INTO public.experience (
    title,
    company,
    company_url,
    description,
    responsibilities,
    start_date,
    end_date,
    is_current,
    location,
    technologies,
    display_order
) VALUES (
    'Full Stack Developer',
    'Expectation Walkers Gen AI Research and Services Pvt. Ltd.',
    'https://expectationwalkers.com',
    'Full-stack development, AI integration, and cloud deployment for generative AI products.',
    ARRAY[
        'Developed and maintained full-stack web applications using React and modern web technologies.',
        'Integrated Firebase services and real-time databases for efficient data management and synchronization.',
        'Used Google Cloud Platform services for scalable application deployment.',
        'Integrated OpenAI technologies for conversational AI and intelligent automation.',
        'Utilized AI coding tools and prompt engineering techniques to improve development efficiency.',
        'Collaborated on debugging, testing, deployment, and feature implementation.'
    ],
    'May 2026',
    'Sep 2026',
    false,
    'Kerala, India',
    ARRAY['React', 'TypeScript', 'Firebase', 'OpenAI APIs', 'Google Cloud Platform', 'Prompt Engineering'],
    1
), (
    'Python Programming Intern',
    'Revertech IT Solutions',
    'https://revertech.in',
    'Python programming and automated script development.',
    ARRAY[
        'Worked on Python programming, core language concepts, and basic automation tasks.',
        'Built utility scripts and assisted in backend development modules.'
    ],
    'Aug 2024',
    'Sep 2024',
    false,
    'Kerala, India',
    ARRAY['Python', 'Automation', 'Data Structures'],
    2
) ON CONFLICT DO NOTHING;

-- Education
INSERT INTO public.education (
    degree,
    field_of_study,
    institution,
    start_year,
    end_year,
    grade_or_status,
    location,
    display_order
) VALUES (
    'M.Tech',
    'Computer Science and Engineering (AI & Data Science)',
    'Cochin University of Science and Technology (CUSAT)',
    '2025',
    '2027',
    'Pursuing',
    'Kochi, Kerala, India',
    1
), (
    'B.Tech',
    'Information Technology',
    'Government Engineering College Idukki (GECI)',
    '2021',
    '2025',
    'Graduated',
    'Idukki, Kerala, India',
    2
) ON CONFLICT DO NOTHING;

-- Achievements
INSERT INTO public.achievements (
    title,
    subtitle,
    date_or_year,
    description,
    badge,
    display_order,
    is_visible
) VALUES (
    'GATE 2024 Qualified',
    'Computer Science and Information Technology',
    '2024',
    'Qualified the prestigious Graduate Aptitude Test in Engineering in Computer Science & Information Technology, demonstrating strong theoretical foundations in algorithms, system architecture, and computation.',
    'National Examination',
    1,
    true
), (
    'Best Employee of the Month',
    'Awarded twice at Expectation Walkers',
    '2026',
    'Recognized twice for outstanding contributions, dedication to AI product development, fast turnaround, and proactive problem-solving.',
    'Double Recipient',
    2,
    true
), (
    'IEEE Best Student Volunteer Award',
    'IEEE RAS SBC GECI',
    '2023',
    'Honored with the Best Student Volunteer Award for exceptional dedication, leadership in student branch activities, and community impact.',
    'Leadership Honor',
    3,
    true
) ON CONFLICT DO NOTHING;

-- Leadership
INSERT INTO public.leadership (
    role,
    organization,
    period,
    description,
    display_order,
    is_visible
) VALUES (
    'University Union Council Coordinator',
    'CUSAT',
    '2025–26',
    'Coordinating student activities, university-level initiatives, and student advocacy across academic faculties.',
    1,
    true
), (
    'Vice Chairperson',
    'IEEE RAS SBC GECI',
    '2023–24',
    'Led robotics and automation society initiatives, workshops, technical competitions, and regional student chapters.',
    2,
    true
), (
    'Chairperson',
    'IEEE RAS SBC GECI',
    '2022–23',
    'Directed all student branch chapter operations, executive team planning, tech seminars, and outreach programs.',
    3,
    true
), (
    'Social Media Coordinator',
    'GDSC GECI (Google Developer Student Clubs)',
    '2023–24',
    'Managed digital engagement, technical event branding, and developer student outreach across social channels.',
    4,
    true
), (
    'Event Coordinator',
    'IEEE RAS SBC and NSS GECI',
    '2022–24',
    'Organized major technical hackathons, volunteering drives, and community service camps.',
    5,
    true
), (
    'Oasis Pain and Palliative Department Representative',
    'GECI',
    '2022–23',
    'Facilitated healthcare volunteering drives, student community service, and palliative patient care initiatives.',
    6,
    true
) ON CONFLICT DO NOTHING;

-- Social Links
INSERT INTO public.social_links (
    platform,
    url,
    icon,
    label,
    display_order,
    is_visible
) VALUES (
    'GitHub',
    'https://github.com/bilalvpm4321',
    'github',
    'github.com/bilalvpm4321',
    1,
    true
), (
    'LinkedIn',
    'https://www.linkedin.com/in/bilalvpm4321',
    'linkedin',
    'linkedin.com/in/bilalvpm4321',
    2,
    true
), (
    'Email',
    'mailto:bilalvpm2@gmail.com',
    'mail',
    'bilalvpm2@gmail.com',
    3,
    true
), (
    'Phone',
    'tel:+917306448145',
    'phone',
    '+91-7306448145',
    4,
    true
) ON CONFLICT DO NOTHING;

-- Site Settings
INSERT INTO public.site_settings (key, value) VALUES
('general', '{"siteTitle": "Bilal Ahamed PT | AI & Full Stack Developer", "metaDescription": "Official portfolio of Bilal Ahamed PT. M.Tech AI & Data Science student at CUSAT, Full Stack Developer, Generative AI & ML specialist.", "accentColor": "#38bdf8", "enableContactForm": true, "enableRealtime": true}'::JSONB),
('hero', '{"badgeText": "Available for AI & Full-Stack Roles", "yearsExperience": "2+", "completedProjects": "10+", "focusArea": "Generative AI & Scalable Web Systems"}'::JSONB)
ON CONFLICT (key) DO NOTHING;
