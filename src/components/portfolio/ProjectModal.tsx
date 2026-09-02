import React, { useState } from 'react';
import { Project } from '../../types/database';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ExternalLink, Layers, CheckCircle, Calendar, Video as VideoIcon, Image as ImageIcon } from 'lucide-react';
import { Github } from '../common/BrandIcons';
import { Link } from 'react-router-dom';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose }) => {
  const [showVideo, setShowVideo] = useState<boolean>(true);

  if (!project) return null;

  const isOpen = !!project;
  const imageUrl =
    project.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

  const hasVideo = !!project.video_url;

  const isYouTubeOrVimeo = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('vimeo.com');
  };

  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch')) {
      const videoId = new URL(url).searchParams.get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="2xl">
      <div className="flex flex-col gap-6 text-[#1b281c]">
        {/* Media Header (Video Demo or Cover Image) */}
        <div className="space-y-2">
          {hasVideo && (
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5 bg-[#f1f4ed] p-1 rounded-lg border border-[#738666]/20">
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    showVideo ? 'bg-[#738666] text-white' : 'text-[#556950] hover:text-[#1b281c]'
                  }`}
                >
                  <VideoIcon className="w-3.5 h-3.5" />
                  <span>Video Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideo(false)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer ${
                    !showVideo ? 'bg-[#738666] text-white' : 'text-[#556950] hover:text-[#1b281c]'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Cover Photo</span>
                </button>
              </div>
            </div>
          )}

          <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-[#f1f4ed] border border-[#738666]/20">
            {hasVideo && showVideo ? (
              isYouTubeOrVimeo(project.video_url!) ? (
                <iframe
                  src={getEmbedUrl(project.video_url!)}
                  title={`${project.title} Video Demo`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  src={project.video_url!}
                  poster={imageUrl}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-contain bg-black"
                >
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <>
                <img
                  src={imageUrl}
                  alt={project.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between text-white">
                  <div>
                    <span className="text-xs font-semibold text-[#cce3bf] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <h2 className="text-xl font-bold font-display mt-0.5">{project.title}</h2>
                  </div>
                  {project.project_date && (
                    <span className="text-xs font-medium flex items-center gap-1 bg-black/60 px-2.5 py-1 rounded-md border border-white/20">
                      <Calendar className="w-3.5 h-3.5 text-[#cce3bf]" />
                      {project.project_date}
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Detailed Description */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-2">
            Overview
          </h3>
          <p className="text-[#1b281c] text-sm leading-relaxed whitespace-pre-line">
            {project.detailed_description || project.short_description}
          </p>
        </div>

        {/* Highlights / Key Capabilities */}
        {project.highlights && project.highlights.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-3">
              Key Capabilities & Innovations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {project.highlights.map((highlight, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2.5 rounded-xl bg-[#f8faf6] border border-[#738666]/20 text-xs text-[#1b281c]"
                >
                  <CheckCircle className="w-4 h-4 text-[#738666] shrink-0 mt-0.5" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metrics if present */}
        {project.metrics && Object.keys(project.metrics).length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-3">
              Performance & Impact Metrics
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {Object.entries(project.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="p-3 rounded-xl bg-[#f8faf6] border border-[#738666]/20 flex flex-col"
                >
                  <span className="text-lg font-bold text-[#738666]">{String(value)}</span>
                  <span className="text-[11px] text-[#556950] capitalize mt-0.5 font-medium">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technologies List */}
        {project.technologies && project.technologies.length > 0 && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-2.5 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#738666]" />
              <span>Technologies Used</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <Badge key={tech.id || tech.name} variant="secondary" size="sm">
                  {tech.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#738666]/15">
          <div className="flex items-center gap-2">
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
                  className="border-[#738666]/30 text-[#1b281c]"
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
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  className="bg-[#738666] hover:bg-[#627456] text-white border-[#738666]"
                >
                  Live Demo
                </Button>
              </a>
            )}
          </div>

          <Link to={`/projects/${project.slug}`} onClick={onClose}>
            <Button variant="ghost" size="sm" className="text-[#738666] hover:text-[#1b281c]">
              Full Project Page →
            </Button>
          </Link>
        </div>
      </div>
    </Modal>
  );
};
