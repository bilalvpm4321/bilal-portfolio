import React, { useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Sparkles,
  Layers,
  Activity,
  Image as ImageIcon,
} from 'lucide-react';
import { Github } from '../components/common/BrandIcons';
import { motion } from 'framer-motion';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data, loading } = usePortfolio();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const project = useMemo(() => {
    return data.projects.find((p) => p.slug === slug);
  }, [data.projects, slug]);

  if (!project && !loading) {
    return (
      <div className="min-h-screen bg-[#08090d] text-gray-100 flex flex-col justify-between">
        <Navbar />
        <div className="max-w-xl mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-extrabold text-white mb-3">Project Not Found</h1>
          <p className="text-slate-400 text-sm mb-6">
            The project "{slug}" could not be located or may have been updated.
          </p>
          <Link to="/">
            <Button variant="primary" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) return null;

  const imageUrl =
    project.image_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-[#08090d] text-gray-100">
      <Navbar />

      <main className="pt-28 pb-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back navigation */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] transition-colors cursor-pointer"
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
          className="mb-10"
        >
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {project.category}
            </span>
            {project.is_featured && (
              <Badge variant="warning" size="sm" icon={<Sparkles className="w-3 h-3" />}>
                Featured Project
              </Badge>
            )}
            {project.project_date && (
              <span className="text-xs font-mono text-slate-400 flex items-center gap-1 ml-auto">
                <Calendar className="w-3.5 h-3.5 text-sky-400" />
                {project.project_date}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-display tracking-tight mb-4">
            {project.title}
          </h1>

          <p className="text-lg text-slate-300 leading-relaxed max-w-3xl">
            {project.short_description}
          </p>
        </motion.div>

        {/* Hero Cover Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="relative aspect-[16/9] w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/[0.1] shadow-2xl mb-12"
        >
          <img
            src={imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </motion.div>

        {/* Quick Actions Strip */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-[#0d0f17]/90 border border-white/[0.08] mb-12">
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
                  leftIcon={<ExternalLink className="w-4 h-4 text-slate-950" />}
                >
                  Launch Live Demo
                </Button>
              </a>
            )}
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Production Verified</span>
          </div>
        </div>

        {/* Grid of Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-16">
          {/* Main narrative */}
          <div className="lg:col-span-8 space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-3">Project Description & Architecture</h2>
              <div className="text-slate-300 leading-relaxed text-base space-y-4 whitespace-pre-line">
                {project.detailed_description || project.short_description}
              </div>
            </div>

            {/* Highlights */}
            {project.highlights && project.highlights.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Key Innovations & Features</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {project.highlights.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-start gap-3"
                    >
                      <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-200">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gallery Images if present */}
            {project.gallery_images && project.gallery_images.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-sky-400" />
                  <span>Gallery & Screenshots</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.gallery_images.map((img, i) => (
                    <div
                      key={i}
                      className="rounded-xl overflow-hidden aspect-[4/3] bg-slate-900 border border-white/[0.08]"
                    >
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Tech Stack */}
            <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <span>Technologies Used</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1 rounded-lg bg-sky-500/10 text-sky-300 text-xs font-semibold border border-sky-500/20"
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            </Card>

            {/* Metrics */}
            {project.metrics && Object.keys(project.metrics).length > 0 && (
              <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>Metrics & Results</span>
                </h3>
                <div className="space-y-3">
                  {Object.entries(project.metrics).map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
                      <span className="text-xs text-slate-400 capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-sm font-bold text-sky-400 font-mono">
                        {String(value)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
