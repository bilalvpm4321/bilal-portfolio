-- ==============================================================================
-- 004_add_certificate_fields.sql
-- Add certificate upload and classification fields to certifications table
-- ==============================================================================

ALTER TABLE public.certifications
  ADD COLUMN IF NOT EXISTS certificate_url TEXT,
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS description TEXT,
  ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}'::TEXT[],
  ADD COLUMN IF NOT EXISTS expires_at TEXT;

-- Create index on category and visibility for faster public queries
CREATE INDEX IF NOT EXISTS idx_certifications_category ON public.certifications (category);
CREATE INDEX IF NOT EXISTS idx_certifications_visibility ON public.certifications (is_visible, display_order);
