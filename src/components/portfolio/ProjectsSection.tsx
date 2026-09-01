import React, { useState, useMemo } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { Project } from '../../types/database';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';
import { Badge } from '../common/Badge';
import { FolderGit2, Sparkles, Filter } from 'lucide-react';

export const ProjectsSection: React.FC = () => {
  const { data, loading } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeModalProject, setActiveModalProject] = useState<Project | null>(null);

  // Filter only published projects for public portfolio view
  const publishedProjects = useMemo(() => {
    return data.projects.filter((p) => p.is_published);
  }, [data.projects]);

  // Unique categories
  const categories = useMemo(() => {
    const list = publishedProjects.map((p) => p.category);
    const unique = Array.from(new Set(list));
    return ['All', ...unique];
  }, [publishedProjects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return publishedProjects;
    return publishedProjects.filter((p) => p.category === selectedCategory);
  }, [publishedProjects, selectedCategory]);

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge variant="primary" size="md" className="mb-3" icon={<FolderGit2 className="w-3.5 h-3.5" />}>
            Featured Work
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Projects & Technical Implementations
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            Selected projects demonstrating AI/ML architectures, real-time cloud backends, and full-stack engineering.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
        </div>

        {/* Category Filter */}
        {categories.length > 2 && (
          <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25 scale-105'
                      : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        )}

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] max-w-md mx-auto">
            <FolderGit2 className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-white mb-1">No Projects Found</h3>
            <p className="text-xs text-slate-400">
              No projects match the selected category. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project, index) => (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                onOpenModal={(p) => setActiveModalProject(p)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Quick View Modal */}
      <ProjectModal
        project={activeModalProject}
        isOpen={Boolean(activeModalProject)}
        onClose={() => setActiveModalProject(null)}
      />
    </section>
  );
};
