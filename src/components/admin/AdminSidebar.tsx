import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolio } from '../../context/PortfolioContext';
import {
  LayoutDashboard,
  User,
  FolderGit2,
  Brain,
  Briefcase,
  GraduationCap,
  Trophy,
  Users,
  Award,
  Share2,
  Image as ImageIcon,
  MessageSquare,
  Settings,
  ExternalLink,
  LogOut,
  Sparkles,
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen: boolean;
  onCloseMobile?: () => void;
}

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Profile & Bio', path: '/admin/profile', icon: User },
  { name: 'Projects', path: '/admin/projects', icon: FolderGit2 },
  { name: 'Skills & Tech', path: '/admin/skills', icon: Brain },
  { name: 'Experience', path: '/admin/experience', icon: Briefcase },
  { name: 'Education', path: '/admin/education', icon: GraduationCap },
  { name: 'Achievements', path: '/admin/achievements', icon: Trophy },
  { name: 'Leadership', path: '/admin/leadership', icon: Users },
  { name: 'Certifications', path: '/admin/certifications', icon: Award },
  { name: 'Social Links', path: '/admin/social-links', icon: Share2 },
  { name: 'Media Storage', path: '/admin/media', icon: ImageIcon },
  { name: 'Messages', path: '/admin/messages', icon: MessageSquare },
  { name: 'Site Settings', path: '/admin/settings', icon: Settings },
];

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onCloseMobile }) => {
  const { user, signOut } = useAuth();
  const { messages } = usePortfolio();

  const unreadMessagesCount = messages.filter((m) => !m.is_read).length;

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0c13] border-r border-white/[0.08] flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* Sidebar Header */}
      <div>
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-slate-950 font-bold text-sm">
              CMS
            </div>
            <div>
              <h2 className="text-sm font-bold text-white tracking-tight">Portfolio Admin</h2>
              <p className="text-[10px] font-mono text-sky-400">Bilal Ahamed PT</p>
            </div>
          </Link>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 max-h-[calc(100vh-190px)] overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-sky-500/15 text-sky-400 border border-sky-500/20'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </div>

                {item.name === 'Messages' && unreadMessagesCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-500 text-white text-[10px] font-bold">
                    {unreadMessagesCount}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-white/[0.08] bg-black/20 space-y-2">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06] text-xs font-medium text-slate-300 hover:text-white transition-colors"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            View Live Portfolio
          </span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
        </Link>

        <button
          onClick={signOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
