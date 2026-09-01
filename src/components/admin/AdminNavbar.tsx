import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Menu, Radio, ExternalLink, ShieldCheck, User } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  title?: string;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onToggleSidebar,
  title = 'Dashboard',
}) => {
  const { user, isMockAuth } = useAuth();
  const configured = isSupabaseConfigured();

  return (
    <header className="h-16 bg-[#0a0c13]/80 backdrop-blur-md border-b border-white/[0.08] px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-400 hover:text-white lg:hidden hover:bg-white/5"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Realtime / Backend status pill */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-mono font-medium border ${
            configured
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
          <span>{configured ? 'Supabase Live Realtime' : 'Local Sandbox Mode'}</span>
        </div>

        {/* User preview */}
        <div className="flex items-center gap-2 pl-3 border-l border-white/[0.08]">
          <div className="w-8 h-8 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center font-bold text-xs">
            <User className="w-4 h-4" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-xs font-bold text-white truncate max-w-[140px]">
              {user?.email || 'admin@bilal.dev'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};
