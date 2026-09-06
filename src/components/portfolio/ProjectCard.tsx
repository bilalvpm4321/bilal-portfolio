import React from 'react';
import { Project } from '../../types/database';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';
import { Github } from '../common/BrandIcons';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpenModal: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onOpenModal,
}) => {
  const projectNumber = String(index + 1).padStart(2, '0');
  const imageUrl =
    project.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        hoverEffect
        className="group flex flex-col justify-between h-full bg-white border-[#738666]/20 hover:border-[#738666]/50 p-0 overflow-hidden shadow-xs hover:shadow-lg"
      >
        {/* Project Thumbnail Image Container */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#f1f4ed]">
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />

          {/* Top badges */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
            <span className="font-mono text-xs sm:text-sm font-bold px-3 py-1 rounded-lg bg-white/95 text-[#4b6345] border border-[#738666]/30 backdrop-blur-md shadow-xs">
              #{projectNumber}
            </span>

            {project.is_featured && (
              <Badge variant="warning" size="sm" icon={<Sparkles className="w-3.5 h-3.5 text-[#c8a869]" />}>
                Featured
              </Badge>
            )}
          </div>
        </div>

        {/* Project Body */}
        <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs sm:text-sm font-bold text-[#536b4e] uppercase tracking-wider">
                {project.category}
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-[#1b281c] mb-2.5 group-hover:text-[#556950] transition-colors font-display">
              {project.title}
            </h3>

            <p className="text-[#2e422b] text-[15px] sm:text-base line-clamp-3 mb-6 leading-relaxed font-normal">
              {project.short_description}
            </p>
          </div>

          <div>
            {/* Tech Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {project.technologies && project.technologies.length > 0
                ? project.technologies.slice(0, 5).map((tech) => (
                    <span
                      key={tech.id}
                      className="text-xs sm:text-sm font-semibold px-3 py-1 rounded-lg bg-[#f0f4ec] text-[#22381f] border border-[#738666]/25 shadow-xs"
                    >
                      {tech.name}
                    </span>
                  ))
                : null}
              {project.technologies && project.technologies.length > 5 && (
                <span className="text-xs sm:text-sm font-bold px-2.5 py-1 rounded-lg bg-[#f0f4ec] text-[#556c50] border border-[#738666]/20">
                  +{project.technologies.length - 5}
                </span>
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-[#738666]/15">
              <div className="flex items-center gap-2">
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} GitHub repository`}
                    className="p-2.5 rounded-xl bg-[#f8faf6] hover:bg-[#f1f4ed] text-[#3d5337] hover:text-[#1b281c] border border-[#738666]/25 transition-colors"
                  >
                    <Github className="w-4 h-4" />
                  </a>
                )}

                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${project.title} live demo`}
                    className="p-2.5 rounded-xl bg-[#f8faf6] hover:bg-[#f1f4ed] text-[#3d5337] hover:text-[#1b281c] border border-[#738666]/25 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenModal(project)}
                  className="text-xs sm:text-sm font-semibold border-[#738666]/30 text-[#1b281c] px-3.5 py-1.5"
                >
                  Quick View
                </Button>

                <Link to={`/projects/${project.slug}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowUpRight className="w-4 h-4" />}
                    className="text-xs sm:text-sm font-semibold bg-[#738666] hover:bg-[#627456] text-white border-[#738666] px-3.5 py-1.5"
                  >
                    Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
