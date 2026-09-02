import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Project } from '../types/database';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Layers,
  Sparkles,
  Activity,
  CheckCircle2,
  Video as VideoIcon,
  Image as ImageIcon,
} from 'lucide-react';
import { Github } from '../components/common/BrandIcons';
import { motion } from 'framer-motion';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data, loading } = usePortfolio();
  const [project, setProject] = useState<Project | null>(null);
  const [showVideo, setShowVideo] = useState<boolean>(true);

  useEffect(() => {
    if (!loading && data.projects) {
      const found = data.projects.find((p) => p.slug === slug);
      if (found) {
        setProject(found);
        window.scrollTo(0, 0);
      }
    }
  }, [slug, data.projects, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-[#1b281c] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#738666] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-[#556950]">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-white text-[#1b281c] flex flex-col items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold font-display text-[#1b281c] mb-2">Project Not Found</h1>
          <p className="text-sm text-[#556950] mb-6">
            The project you are looking for does not exist or may have been unlisted.
          </p>
          <Link to="/#projects">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    );
  }

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

  const imageUrl =
    project.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';

  const hasVideo = Boolean(project.video_url);

  return (
    <div className="min-h-screen bg-white text-[#1b281c] selection:bg-[#738666]/25 selection:text-[#1b281c]">
      <Navbar />

      <main className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#556950] hover:text-[#1b281c] px-3 py-1.5 rounded-lg bg-[#f8faf6] border border-[#738666]/20 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>
        </div>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#738666]/12 text-[#3d5337] border border-[#738666]/30">
              {project.category}
            </span>
            {project.is_featured && (
              <Badge variant="warning" size="sm" icon={<Sparkles className="w-3 h-3 text-[#c8a869]" />}>
                Featured Project
              </Badge>
            )}
            {project.project_date && (
              <span className="text-xs font-mono text-[#556950] flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5 text-[#738666]" />
                {project.project_date}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#1b281c] font-display tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-base sm:text-lg text-[#4a5d46] leading-relaxed max-w-3xl">
            {project.short_description}
          </p>
        </motion.div>

        {/* Top Hero Media */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="mb-10 space-y-3"
        >
          {hasVideo && (
            <div className="flex items-center justify-between pb-1">
              <div className="flex items-center gap-1.5 bg-[#f1f4ed] p-1 rounded-lg border border-[#738666]/20">
                <button
                  type="button"
                  onClick={() => setShowVideo(true)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    showVideo ? 'bg-[#738666] text-white' : 'text-[#556950] hover:text-[#1b281c]'
                  }`}
                >
                  <VideoIcon className="w-4 h-4" />
                  <span>Video Demo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowVideo(false)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-all ${
                    !showVideo ? 'bg-[#738666] text-white' : 'text-[#556950] hover:text-[#1b281c]'
                  }`}
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Cover Photo</span>
                </button>
              </div>
            </div>
          )}

          <div className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-[#f1f4ed] border border-[#738666]/20 shadow-md">
            {hasVideo && showVideo ? (
              isYouTubeOrVimeo(project.video_url!) ? (
                <iframe
                  src={getEmbedUrl(project.video_url!)}
                  title={`${project.title} Video Player`}
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
                  Your browser does not support HTML5 video.
                </video>
              )
            ) : (
              <img
                src={imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </motion.div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#f8faf6] border border-[#738666]/20 mb-12 shadow-xs">
          <div className="flex items-center gap-3">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Github className="w-4 h-4" />}
                  className="border-[#738666]/30 text-[#1b281c]"
                >
                  View Source Code
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
                  size="md"
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                  className="bg-[#738666] hover:bg-[#627456] text-white border-[#738666]"
                >
                  Live Deployment
                </Button>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-[#556950]">
            <span>Slug:</span>
            <span className="text-[#738666]">/{project.slug}</span>
          </div>
        </div>

        {/* Content Breakdown Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          {/* Main Description Column */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="p-6 sm:p-8 bg-white border-[#738666]/20 shadow-xs">
              <h2 className="text-lg font-bold text-[#1b281c] font-display mb-4">
                Architecture & Implementation Overview
              </h2>
              <div className="text-[#4a5d46] leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line">
                {project.detailed_description || project.short_description}
              </div>
            </Card>

            {/* Key Highlights / Capabilities */}
            {project.highlights && project.highlights.length > 0 && (
              <Card className="p-6 sm:p-8 bg-white border-[#738666]/20 shadow-xs">
                <h2 className="text-lg font-bold text-[#1b281c] font-display mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#c8a869]" />
                  <span>Key Innovations & Features</span>
                </h2>
                <div className="grid grid-cols-1 gap-3">
                  {project.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3.5 rounded-xl bg-[#f8faf6] border border-[#738666]/20"
                    >
                      <CheckCircle2 className="w-5 h-5 text-[#738666] shrink-0 mt-0.5" />
                      <span className="text-sm text-[#1b281c]">{item}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Gallery Images if provided */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <Card className="p-6 sm:p-8 bg-white border-[#738666]/20 shadow-xs">
                <h2 className="text-lg font-bold text-[#1b281c] font-display mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-[#738666]" />
                  <span>Screenshots & System Architecture</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery_images.map((img, idx) => (
                    <div
                      key={idx}
                      className="aspect-video rounded-xl overflow-hidden border border-[#738666]/20 bg-[#f1f4ed] group"
                    >
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar: Tech Stack & Metrics */}
          <div className="lg:col-span-4 space-y-6">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <Card className="p-6 bg-white border-[#738666]/20 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-4 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#738666]" />
                  <span>Technology Stack</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech.id || tech.name}
                      className="px-3 py-1.5 rounded-xl bg-[#f1f4ed] text-[#2d432b] border border-[#738666]/20 text-xs font-semibold"
                    >
                      {tech.name}
                    </span>
                  ))}
                </div>
              </Card>
            )}

            {/* Performance Metrics */}
            {project.metrics && Object.keys(project.metrics).length > 0 && (
              <Card className="p-6 bg-white border-[#738666]/20 shadow-xs">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#556950] mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#738666]" />
                  <span>Performance Benchmarks</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div
                      key={key}
                      className="p-3 rounded-xl bg-[#f8faf6] border border-[#738666]/20 flex items-center justify-between"
                    >
                      <span className="text-xs text-[#556950] capitalize font-medium">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-sm font-mono font-bold text-[#738666]">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>

        {/* Footer Navigation CTA */}
        <div className="text-center pt-8 border-t border-[#738666]/20">
          <Link to="/#projects">
            <Button variant="outline" size="md" leftIcon={<ArrowLeft className="w-4 h-4" />} className="border-[#738666]/30 text-[#1b281c]">
              Explore More Projects
            </Button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
