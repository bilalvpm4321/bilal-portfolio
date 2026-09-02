export interface Profile {
  id: string;
  full_name: string;
  headline: string;
  bio: string | null;
  about: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  avatar_url: string | null;
  about_image_url?: string | null;
  resume_url: string | null;
  availability_status: string | null;
  years_experience: string | null;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProjectTechnology {
  id: string;
  project_id: string;
  name: string;
  icon?: string | null;
  display_order: number;
  created_at?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  detailed_description: string | null;
  category: string;
  image_url: string | null;
  video_url?: string | null;
  gallery_images: string[];
  github_url: string | null;
  live_url: string | null;
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  project_date: string | null;
  metrics: Record<string, string>;
  highlights: string[];
  technologies?: ProjectTechnology[];
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon: string | null;
  level: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  company_url: string | null;
  description: string | null;
  responsibilities: string[];
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  location: string | null;
  technologies: string[];
  display_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  field_of_study: string;
  institution: string;
  start_year: string;
  end_year: string;
  grade_or_status: string | null;
  location: string | null;
  display_order: number;
  created_at: string;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string | null;
  date_or_year: string | null;
  description: string | null;
  badge: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Leadership {
  id: string;
  role: string;
  organization: string;
  period: string;
  description: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  issue_date: string | null;
  credential_id: string | null;
  credential_url: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon: string | null;
  label: string | null;
  display_order: number;
  is_visible: boolean;
  created_at: string;
}

export interface SiteSetting {
  id: string;
  key: string;
  value: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export interface PortfolioData {
  profile: Profile | null;
  projects: Project[];
  skills: Skill[];
  experience: Experience[];
  education: Education[];
  achievements: Achievement[];
  leadership: Leadership[];
  certifications: Certification[];
  socialLinks: SocialLink[];
  siteSettings: Record<string, any>;
}
