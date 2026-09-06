-- ==============================================================================
-- 005_storage_video_130mb.sql
-- Increase storage limit for 'portfolio' bucket to 200MB (supporting 130MB+ videos)
-- and add video MIME types (MP4, WebM, QuickTime, etc.)
-- ==============================================================================

-- Update the 'portfolio' storage bucket configuration
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'portfolio',
    'portfolio',
    true,
    209715200, -- 200MB in bytes (130MB requirement + headroom)
    ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/ogg',
        'video/x-matroska',
        'video/avi',
        'video/mpeg',
        'video/x-msvideo'
    ]
)
ON CONFLICT (id) DO UPDATE SET
    public = true,
    file_size_limit = 209715200,
    allowed_mime_types = ARRAY[
        'image/jpeg',
        'image/png',
        'image/webp',
        'image/gif',
        'image/svg+xml',
        'application/pdf',
        'video/mp4',
        'video/webm',
        'video/quicktime',
        'video/ogg',
        'video/x-matroska',
        'video/avi',
        'video/mpeg',
        'video/x-msvideo'
    ];

-- Ensure public read and upload access policies are active
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Public Access'
    ) THEN
        CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'portfolio');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Direct Upload Access'
    ) THEN
        CREATE POLICY "Direct Upload Access" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Direct Update Access'
    ) THEN
        CREATE POLICY "Direct Update Access" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio');
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = 'Direct Delete Access'
    ) THEN
        CREATE POLICY "Direct Delete Access" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio');
    END IF;
END $$;
