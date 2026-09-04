import React from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import {
  FolderGit2,
  Brain,
  Briefcase,
  Trophy,
  Award,
  Upload,
  MessageSquare,
  Plus,
  User,
  Sparkles,
  ArrowUpRight,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Activity,
  FileText,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { data, messages } = usePortfolio();

  const totalProjects = data.projects.length;
  const publishedProjects = data.projects.filter((p) => p.is_published).length;
  const totalSkills = data.skills.length;
  const totalExperience = data.experience.length;
  const totalAchievements = data.achievements.length;
  const totalCertifications = data.certifications.length;
  const totalMessages = messages.length;
  const unreadMessages = messages.filter((m) => !m.is_read).length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-sky-900/30 via-slate-900/40 to-indigo-950/30 border border-white/[0.08] relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-sky-400 font-semibold">
                Live CMS Controller
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display">
              Welcome back, Bilal Ahamed PT
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              Manage your portfolio content in realtime. Any modifications published here immediately sync across your website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link to="/admin/certifications/new">
              <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
                Upload Certificate
              </Button>
            </Link>
            <Link to="/admin/projects/new">
              <Button variant="secondary" size="md" leftIcon={<Plus className="w-4 h-4" />}>
                Add Project
              </Button>
            </Link>
            <Link to="/" target="_blank">
              <Button variant="outline" size="md" rightIcon={<ExternalLink className="w-4 h-4" />}>
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Certifications */}
        <Link to="/admin/certifications">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Certificates</span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalCertifications}</span>
              <span className="text-[11px] text-sky-400 font-medium">Verified</span>
            </div>
          </Card>
        </Link>
        {/* Projects */}
        <Link to="/admin/projects">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Projects</span>
              <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                <FolderGit2 className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalProjects}</span>
              <span className="text-[11px] text-emerald-400 font-medium">
                {publishedProjects} Live
              </span>
            </div>
          </Card>
        </Link>

        {/* Skills */}
        <Link to="/admin/skills">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Skills</span>
              <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                <Brain className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalSkills}</span>
              <span className="text-[11px] text-slate-400 font-medium">Categorized</span>
            </div>
          </Card>
        </Link>

        {/* Experience */}
        <Link to="/admin/experience">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Experience</span>
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalExperience}</span>
              <span className="text-[11px] text-slate-400 font-medium">Positions</span>
            </div>
          </Card>
        </Link>

        {/* Achievements */}
        <Link to="/admin/achievements">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Awards</span>
              <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                <Trophy className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalAchievements}</span>
              <span className="text-[11px] text-amber-400 font-medium">GATE Qualified</span>
            </div>
          </Card>
        </Link>

        {/* Messages */}
        <Link to="/admin/messages" className="col-span-2 lg:col-span-1">
          <Card hoverEffect className="p-4 bg-[#0d0f17]/95 border-white/[0.08]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase">Inquiries</span>
              <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                <MessageSquare className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white font-display">{totalMessages}</span>
              {unreadMessages > 0 ? (
                <span className="text-[11px] text-rose-400 font-bold">
                  {unreadMessages} Unread
                </span>
              ) : (
                <span className="text-[11px] text-slate-400 font-medium">All Read</span>
              )}
            </div>
          </Card>
        </Link>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <Link to="/admin/profile">
            <Card hoverEffect className="p-4 bg-white/[0.02] border-white/[0.06] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <User className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Profile & Hero</p>
                <p className="text-[11px] text-slate-400">Bio & Flowing Highlights</p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/profile">
            <Card hoverEffect className="p-4 bg-white/[0.02] border-white/[0.06] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Upload Resume</p>
                <p className="text-[11px] text-slate-400">PDF Document</p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/projects/new">
            <Card hoverEffect className="p-4 bg-white/[0.02] border-white/[0.06] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">New Project</p>
                <p className="text-[11px] text-slate-400">Showcase Work</p>
              </div>
            </Card>
          </Link>

          <Link to="/admin/media">
            <Card hoverEffect className="p-4 bg-white/[0.02] border-white/[0.06] flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-white">Media Manager</p>
                <p className="text-[11px] text-slate-400">Storage Files</p>
              </div>
            </Card>
          </Link>
        </div>
      </div>

      {/* Projects Overview Table */}
      <Card className="p-6 bg-[#0d0f17]/95 border-white/[0.08]">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-base font-bold text-white">Recent Projects</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ordered by display priority on your live portfolio.
            </p>
          </div>
          <Link to="/admin/projects">
            <Button variant="outline" size="sm">
              Manage All ({totalProjects})
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/[0.08] text-slate-400">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Title</th>
                <th className="pb-3 font-semibold">Category</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Featured</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {data.projects.slice(0, 5).map((project, idx) => (
                <tr key={project.id} className="hover:bg-white/[0.02]">
                  <td className="py-3 font-mono text-slate-400">#{project.display_order}</td>
                  <td className="py-3 font-semibold text-white">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-md bg-slate-800 overflow-hidden shrink-0">
                        {project.image_url ? (
                          <img src={project.image_url} alt="" className="w-full h-full object-cover" />
                        ) : null}
                      </div>
                      <span>{project.title}</span>
                    </div>
                  </td>
                  <td className="py-3 text-slate-300">{project.category}</td>
                  <td className="py-3">
                    {project.is_published ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-semibold">
                        Published
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-semibold">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="py-3">
                    {project.is_featured ? (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-semibold">
                        Yes
                      </span>
                    ) : (
                      <span className="text-slate-500">No</span>
                    )}
                  </td>
                  <td className="py-3 text-right">
                    <Link to={`/admin/projects/${project.id}/edit`}>
                      <button className="text-sky-400 hover:text-sky-300 font-semibold text-xs cursor-pointer">
                        Edit
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
