-- ==============================================================================
-- 003_storage_policies.sql
-- Storage bucket and direct access policies for 'portfolio' assets
-- ==============================================================================

-- 1. Create the 'portfolio' storage bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio',
    'portfolio',
    true,
    209715200, -- 200MB limit (supporting up to 130MB+ videos)
    ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-matroska', 'video/avi', 'video/mpeg', 'video/x-msvideo'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 209715200,
    allowed_mime_types = ARRAY[
        'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml', 'application/pdf',
        'video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-matroska', 'video/avi', 'video/mpeg', 'video/x-msvideo'
    ];

-- 2. Storage Policies for 'portfolio' bucket

-- Public read access
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

-- Direct upload access
DROP POLICY IF EXISTS "Direct Upload Access" ON storage.objects;
CREATE POLICY "Direct Upload Access"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio');

-- Direct update access
DROP POLICY IF EXISTS "Direct Update Access" ON storage.objects;
CREATE POLICY "Direct Update Access"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio');

-- Direct delete access
DROP POLICY IF EXISTS "Direct Delete Access" ON storage.objects;
CREATE POLICY "Direct Delete Access"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio');
