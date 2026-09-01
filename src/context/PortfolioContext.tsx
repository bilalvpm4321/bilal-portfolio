import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { initialPortfolioData } from '../lib/fallbackData';
import {
  PortfolioData,
  Profile,
  Project,
  Skill,
  Experience,
  Education,
  Achievement,
  Leadership,
  Certification,
  SocialLink,
  ContactMessage,
} from '../types/database';

interface PortfolioContextType {
  data: PortfolioData;
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  
  // Profile
  updateProfile: (profile: Partial<Profile>) => Promise<{ success: boolean; error: Error | null }>;
  
  // Projects
  createProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>, technologies: string[]) => Promise<{ success: boolean; error: Error | null; data?: Project }>;
  updateProject: (id: string, project: Partial<Project>, technologies?: string[]) => Promise<{ success: boolean; error: Error | null }>;
  deleteProject: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  reorderProjects: (orderedIds: string[]) => Promise<{ success: boolean; error: Error | null }>;
  
  // Skills
  createSkill: (skill: Omit<Skill, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateSkill: (id: string, skill: Partial<Skill>) => Promise<{ success: boolean; error: Error | null }>;
  deleteSkill: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Experience
  createExperience: (exp: Omit<Experience, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateExperience: (id: string, exp: Partial<Experience>) => Promise<{ success: boolean; error: Error | null }>;
  deleteExperience: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Education
  createEducation: (edu: Omit<Education, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateEducation: (id: string, edu: Partial<Education>) => Promise<{ success: boolean; error: Error | null }>;
  deleteEducation: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Achievements
  createAchievement: (ach: Omit<Achievement, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateAchievement: (id: string, ach: Partial<Achievement>) => Promise<{ success: boolean; error: Error | null }>;
  deleteAchievement: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Leadership
  createLeadership: (lead: Omit<Leadership, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateLeadership: (id: string, lead: Partial<Leadership>) => Promise<{ success: boolean; error: Error | null }>;
  deleteLeadership: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Certifications
  createCertification: (cert: Omit<Certification, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateCertification: (id: string, cert: Partial<Certification>) => Promise<{ success: boolean; error: Error | null }>;
  deleteCertification: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Social Links
  createSocialLink: (link: Omit<SocialLink, 'id' | 'created_at'>) => Promise<{ success: boolean; error: Error | null }>;
  updateSocialLink: (id: string, link: Partial<SocialLink>) => Promise<{ success: boolean; error: Error | null }>;
  deleteSocialLink: (id: string) => Promise<{ success: boolean; error: Error | null }>;
  
  // Settings
  updateSiteSetting: (key: string, value: Record<string, any>) => Promise<{ success: boolean; error: Error | null }>;
  
  // Messages
  messages: ContactMessage[];
  fetchMessages: () => Promise<void>;
  submitContactMessage: (msg: { name: string; email: string; subject?: string; message: string }) => Promise<{ success: boolean; error: Error | null }>;
  markMessageAsRead: (id: string, is_read: boolean) => Promise<{ success: boolean; error: Error | null }>;
  deleteMessage: (id: string) => Promise<{ success: boolean; error: Error | null }>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialPortfolioData);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all portfolio data from Supabase
  const fetchData = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      // Load from localStorage or default fallback
      const saved = localStorage.getItem('bilal_portfolio_local_data');
      if (saved) {
        try {
          setData(JSON.parse(saved));
        } catch {
          setData(initialPortfolioData);
        }
      } else {
        setData(initialPortfolioData);
      }
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [
        profileRes,
        projectsRes,
        projectTechRes,
        skillsRes,
        experienceRes,
        educationRes,
        achievementsRes,
        leadershipRes,
        certificationsRes,
        socialLinksRes,
        settingsRes,
      ] = await Promise.all([
        supabase.from('profiles').select('*').limit(1).maybeSingle(),
        supabase.from('projects').select('*').order('display_order', { ascending: true }),
        supabase.from('project_technologies').select('*').order('display_order', { ascending: true }),
        supabase.from('skills').select('*').order('display_order', { ascending: true }),
        supabase.from('experience').select('*').order('display_order', { ascending: true }),
        supabase.from('education').select('*').order('display_order', { ascending: true }),
        supabase.from('achievements').select('*').order('display_order', { ascending: true }),
        supabase.from('leadership').select('*').order('display_order', { ascending: true }),
        supabase.from('certifications').select('*').order('display_order', { ascending: true }),
        supabase.from('social_links').select('*').order('display_order', { ascending: true }),
        supabase.from('site_settings').select('*'),
      ]);

      // Combine project technologies
      const techList = projectTechRes.data || [];
      const projectsWithTech = (projectsRes.data || []).map((project: Project) => ({
        ...project,
        technologies: techList.filter((t) => t.project_id === project.id),
      }));

      // Parse site settings
      const settingsMap: Record<string, any> = {};
      (settingsRes.data || []).forEach((setting: any) => {
        settingsMap[setting.key] = setting.value;
      });

      const hasRemoteData = Boolean(
        profileRes.data || (projectsRes.data && projectsRes.data.length > 0)
      );

      if (hasRemoteData) {
        setData({
          profile: profileRes.data || initialPortfolioData.profile,
          projects: projectsWithTech.length > 0 ? projectsWithTech : initialPortfolioData.projects,
          skills: (skillsRes.data && skillsRes.data.length > 0) ? skillsRes.data : initialPortfolioData.skills,
          experience: (experienceRes.data && experienceRes.data.length > 0) ? experienceRes.data : initialPortfolioData.experience,
          education: (educationRes.data && educationRes.data.length > 0) ? educationRes.data : initialPortfolioData.education,
          achievements: (achievementsRes.data && achievementsRes.data.length > 0) ? achievementsRes.data : initialPortfolioData.achievements,
          leadership: (leadershipRes.data && leadershipRes.data.length > 0) ? leadershipRes.data : initialPortfolioData.leadership,
          certifications: certificationsRes.data || [],
          socialLinks: (socialLinksRes.data && socialLinksRes.data.length > 0) ? socialLinksRes.data : initialPortfolioData.socialLinks,
          siteSettings: Object.keys(settingsMap).length > 0 ? settingsMap : initialPortfolioData.siteSettings,
        });
      } else {
        setData(initialPortfolioData);
      }
    } catch (err: any) {
      console.error('Error loading portfolio data from Supabase:', err);
      setError(err.message || 'Failed to fetch portfolio data');
      setData(initialPortfolioData);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save local changes to localStorage when offline/in-memory mode
  const syncLocal = (updatedData: PortfolioData) => {
    setData(updatedData);
    if (!isSupabaseConfigured()) {
      localStorage.setItem('bilal_portfolio_local_data', JSON.stringify(updatedData));
    }
  };

  // Initial load
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Realtime Subscriptions
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    // Subscribe to realtime database changes across all main tables
    const channel = supabase
      .channel('portfolio_realtime_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'project_technologies' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'experience' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'education' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'achievements' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leadership' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'certifications' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'social_links' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData]);

  // Profile Updates
  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      if (isSupabaseConfigured() && data.profile?.id) {
        const { error: sbError } = await supabase
          .from('profiles')
          .update(updates)
          .eq('id', data.profile.id);
        if (sbError) throw sbError;
      }

      const updatedProfile = { ...(data.profile || initialPortfolioData.profile!), ...updates };
      syncLocal({ ...data, profile: updatedProfile });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Update profile error:', err);
      return { success: false, error: err };
    }
  };

  // Projects CRUD
  const createProject = async (
    newProject: Omit<Project, 'id' | 'created_at' | 'updated_at'>,
    techNames: string[]
  ) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `proj-${Date.now()}`;
      const projectPayload = {
        ...newProject,
        id: generatedId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { data: inserted, error: sbError } = await supabase
          .from('projects')
          .insert([projectPayload])
          .select()
          .single();
        if (sbError) throw sbError;

        if (techNames && techNames.length > 0) {
          const techPayload = techNames.map((name, index) => ({
            project_id: inserted.id,
            name: name.trim(),
            display_order: index + 1,
          }));
          await supabase.from('project_technologies').insert(techPayload);
        }
      }

      const projectWithTech: Project = {
        ...projectPayload,
        technologies: techNames.map((name, i) => ({
          id: `t-${i}-${Date.now()}`,
          project_id: generatedId,
          name: name.trim(),
          display_order: i + 1,
        })),
      };

      const updatedProjects = [...data.projects, projectWithTech].sort(
        (a, b) => a.display_order - b.display_order
      );
      syncLocal({ ...data, projects: updatedProjects });
      return { success: true, error: null, data: projectWithTech };
    } catch (err: any) {
      console.error('Create project error:', err);
      return { success: false, error: err };
    }
  };

  const updateProject = async (
    id: string,
    updates: Partial<Project>,
    techNames?: string[]
  ) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase
          .from('projects')
          .update(updates)
          .eq('id', id);
        if (sbError) throw sbError;

        if (techNames !== undefined) {
          await supabase.from('project_technologies').delete().eq('project_id', id);
          if (techNames.length > 0) {
            const techPayload = techNames.map((name, index) => ({
              project_id: id,
              name: name.trim(),
              display_order: index + 1,
            }));
            await supabase.from('project_technologies').insert(techPayload);
          }
        }
      }

      const updatedProjects = data.projects.map((p) => {
        if (p.id !== id) return p;
        const updatedTech = techNames !== undefined
          ? techNames.map((name, i) => ({
              id: `t-${i}-${Date.now()}`,
              project_id: id,
              name: name.trim(),
              display_order: i + 1,
            }))
          : p.technologies;
        return { ...p, ...updates, technologies: updatedTech, updated_at: new Date().toISOString() };
      }).sort((a, b) => a.display_order - b.display_order);

      syncLocal({ ...data, projects: updatedProjects });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Update project error:', err);
      return { success: false, error: err };
    }
  };

  const deleteProject = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('projects').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updatedProjects = data.projects.filter((p) => p.id !== id);
      syncLocal({ ...data, projects: updatedProjects });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Delete project error:', err);
      return { success: false, error: err };
    }
  };

  const reorderProjects = async (orderedIds: string[]) => {
    try {
      const updatedProjects = data.projects.map((p) => {
        const index = orderedIds.indexOf(p.id);
        return index !== -1 ? { ...p, display_order: index + 1 } : p;
      }).sort((a, b) => a.display_order - b.display_order);

      if (isSupabaseConfigured()) {
        for (let i = 0; i < orderedIds.length; i++) {
          await supabase
            .from('projects')
            .update({ display_order: i + 1 })
            .eq('id', orderedIds[i]);
        }
      }

      syncLocal({ ...data, projects: updatedProjects });
      return { success: true, error: null };
    } catch (err: any) {
      console.error('Reorder projects error:', err);
      return { success: false, error: err };
    }
  };

  // Skills CRUD
  const createSkill = async (newSkill: Omit<Skill, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `skill-${Date.now()}`;
      const payload: Skill = {
        ...newSkill,
        id: generatedId,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('skills').insert([payload]);
        if (sbError) throw sbError;
      }

      const updatedSkills = [...data.skills, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, skills: updatedSkills });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateSkill = async (id: string, updates: Partial<Skill>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('skills').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updatedSkills = data.skills.map((s) => (s.id === id ? { ...s, ...updates } : s));
      syncLocal({ ...data, skills: updatedSkills });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteSkill = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('skills').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updatedSkills = data.skills.filter((s) => s.id !== id);
      syncLocal({ ...data, skills: updatedSkills });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Experience CRUD
  const createExperience = async (newExp: Omit<Experience, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `exp-${Date.now()}`;
      const payload: Experience = {
        ...newExp,
        id: generatedId,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('experience').insert([payload]);
        if (sbError) throw sbError;
      }

      const updatedExperience = [...data.experience, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, experience: updatedExperience });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateExperience = async (id: string, updates: Partial<Experience>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('experience').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updatedExperience = data.experience.map((e) => (e.id === id ? { ...e, ...updates } : e));
      syncLocal({ ...data, experience: updatedExperience });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteExperience = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('experience').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updatedExperience = data.experience.filter((e) => e.id !== id);
      syncLocal({ ...data, experience: updatedExperience });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Education CRUD
  const createEducation = async (newEdu: Omit<Education, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `edu-${Date.now()}`;
      const payload: Education = { ...newEdu, id: generatedId, created_at: new Date().toISOString() };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('education').insert([payload]);
        if (sbError) throw sbError;
      }

      const updated = [...data.education, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, education: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateEducation = async (id: string, updates: Partial<Education>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('education').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.education.map((e) => (e.id === id ? { ...e, ...updates } : e));
      syncLocal({ ...data, education: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteEducation = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('education').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.education.filter((e) => e.id !== id);
      syncLocal({ ...data, education: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Achievements CRUD
  const createAchievement = async (newAch: Omit<Achievement, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `ach-${Date.now()}`;
      const payload: Achievement = { ...newAch, id: generatedId, created_at: new Date().toISOString() };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('achievements').insert([payload]);
        if (sbError) throw sbError;
      }

      const updated = [...data.achievements, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, achievements: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateAchievement = async (id: string, updates: Partial<Achievement>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('achievements').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.achievements.map((a) => (a.id === id ? { ...a, ...updates } : a));
      syncLocal({ ...data, achievements: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteAchievement = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('achievements').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.achievements.filter((a) => a.id !== id);
      syncLocal({ ...data, achievements: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Leadership CRUD
  const createLeadership = async (newLead: Omit<Leadership, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `lead-${Date.now()}`;
      const payload: Leadership = { ...newLead, id: generatedId, created_at: new Date().toISOString() };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('leadership').insert([payload]);
        if (sbError) throw sbError;
      }

      const updated = [...data.leadership, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, leadership: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateLeadership = async (id: string, updates: Partial<Leadership>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('leadership').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.leadership.map((l) => (l.id === id ? { ...l, ...updates } : l));
      syncLocal({ ...data, leadership: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteLeadership = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('leadership').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.leadership.filter((l) => l.id !== id);
      syncLocal({ ...data, leadership: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Certifications CRUD
  const createCertification = async (newCert: Omit<Certification, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `cert-${Date.now()}`;
      const payload: Certification = { ...newCert, id: generatedId, created_at: new Date().toISOString() };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('certifications').insert([payload]);
        if (sbError) throw sbError;
      }

      const updated = [...data.certifications, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, certifications: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateCertification = async (id: string, updates: Partial<Certification>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('certifications').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.certifications.map((c) => (c.id === id ? { ...c, ...updates } : c));
      syncLocal({ ...data, certifications: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteCertification = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('certifications').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.certifications.filter((c) => c.id !== id);
      syncLocal({ ...data, certifications: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Social Links CRUD
  const createSocialLink = async (newLink: Omit<SocialLink, 'id' | 'created_at'>) => {
    try {
      const generatedId = crypto.randomUUID ? crypto.randomUUID() : `soc-${Date.now()}`;
      const payload: SocialLink = { ...newLink, id: generatedId, created_at: new Date().toISOString() };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('social_links').insert([payload]);
        if (sbError) throw sbError;
      }

      const updated = [...data.socialLinks, payload].sort((a, b) => a.display_order - b.display_order);
      syncLocal({ ...data, socialLinks: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('social_links').update(updates).eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.socialLinks.map((s) => (s.id === id ? { ...s, ...updates } : s));
      syncLocal({ ...data, socialLinks: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteSocialLink = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('social_links').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = data.socialLinks.filter((s) => s.id !== id);
      syncLocal({ ...data, socialLinks: updated });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Site Settings
  const updateSiteSetting = async (key: string, value: Record<string, any>) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase
          .from('site_settings')
          .upsert({ key, value });
        if (sbError) throw sbError;
      }

      const updatedSettings = { ...data.siteSettings, [key]: value };
      syncLocal({ ...data, siteSettings: updatedSettings });
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  // Messages
  const fetchMessages = async () => {
    if (!isSupabaseConfigured()) {
      const saved = localStorage.getItem('bilal_contact_messages');
      if (saved) {
        try {
          setMessages(JSON.parse(saved));
        } catch {
          setMessages([]);
        }
      }
      return;
    }

    try {
      const { data: remoteMsgs, error: sbError } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;
      setMessages(remoteMsgs || []);
    } catch (err) {
      console.error('Error fetching contact messages:', err);
    }
  };

  const submitContactMessage = async (msg: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }) => {
    try {
      const payload: ContactMessage = {
        id: crypto.randomUUID ? crypto.randomUUID() : `msg-${Date.now()}`,
        name: msg.name,
        email: msg.email,
        subject: msg.subject || null,
        message: msg.message,
        is_read: false,
        created_at: new Date().toISOString(),
      };

      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('contact_messages').insert([payload]);
        if (sbError) throw sbError;
      }

      // Store in local message log
      const updatedMessages = [payload, ...messages];
      setMessages(updatedMessages);
      localStorage.setItem('bilal_contact_messages', JSON.stringify(updatedMessages));

      return { success: true, error: null };
    } catch (err: any) {
      console.error('Submit contact message error:', err);
      return { success: false, error: err };
    }
  };

  const markMessageAsRead = async (id: string, is_read: boolean) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase
          .from('contact_messages')
          .update({ is_read })
          .eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = messages.map((m) => (m.id === id ? { ...m, is_read } : m));
      setMessages(updated);
      localStorage.setItem('bilal_contact_messages', JSON.stringify(updated));
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { error: sbError } = await supabase.from('contact_messages').delete().eq('id', id);
        if (sbError) throw sbError;
      }

      const updated = messages.filter((m) => m.id !== id);
      setMessages(updated);
      localStorage.setItem('bilal_contact_messages', JSON.stringify(updated));
      return { success: true, error: null };
    } catch (err: any) {
      return { success: false, error: err };
    }
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        loading,
        error,
        refreshData: fetchData,
        updateProfile,
        createProject,
        updateProject,
        deleteProject,
        reorderProjects,
        createSkill,
        updateSkill,
        deleteSkill,
        createExperience,
        updateExperience,
        deleteExperience,
        createEducation,
        updateEducation,
        deleteEducation,
        createAchievement,
        updateAchievement,
        deleteAchievement,
        createLeadership,
        updateLeadership,
        deleteLeadership,
        createCertification,
        updateCertification,
        deleteCertification,
        createSocialLink,
        updateSocialLink,
        deleteSocialLink,
        updateSiteSetting,
        messages,
        fetchMessages,
        submitContactMessage,
        markMessageAsRead,
        deleteMessage,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
