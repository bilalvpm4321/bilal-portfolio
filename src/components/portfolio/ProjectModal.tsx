import React from 'react';
import { Project } from '../../types/database';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExternalLink, Calendar, CheckCircle, Sparkles, Layers } from 'lucide-react';
import { Github } from '../common/BrandIcons';
import { Link } from 'react-router-dom';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  project,
  isOpen,
  onClose,
}) => {
  if (!project) return null;

  const imageUrl =
    project.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex flex-col gap-6">
        {/* Cover Image & Title */}
        <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 border border-white/[0.08]">
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0f17] via-transparent to-transparent" />
          
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">
                {project.category}
              </span>
              <h2 className="text-2xl font-bold text-white mt-0.5">{project.title}</h2>
            </div>
            {project.project_date && (
              <span className="text-xs font-medium text-slate-300 flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {project.project_date}
              </span>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
            Overview
          </h3>
          <p className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
            {project.detailed_description || project.short_description}
          </p>
        </div>

        {/* Highlights / Key Capabilities */}
        {project.highlights && project.highlights.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Key Capabilities & Innovations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-300"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics if present */}
        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Performance & Impact Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-sky-500/5 border border-sky-500/20 flex flex-col"
                >
                  <span className="text-lg font-bold text-sky-400">{String(value)}</span>
                  <span className="text-[11px] text-slate-400 capitalize mt-0.5">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Technologies Used */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2.5">
              Technologies & Architecture
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((t) => (
                <span
                  key={t.id}
                  className="px-3 py-1 text-xs font-medium rounded-lg bg-white/[0.05] text-slate-200 border border-white/[0.08]"
                >
                  {t.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Github className="w-4 h-4" />}
                >
                  Source Code
                </Button>
              </a>
            )}

            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ExternalLink className="w-4 h-4 text-slate-950" />}
                >
                  Live Demo
                </Button>
              </a>
            )}
          </div>

          <Link to={`/projects/${project.slug}`} onClick={onClose}>
            <Button variant="secondary" size="sm">
              Full Page View
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
