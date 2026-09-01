import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/common/Toast';
import { isSupabaseConfigured } from '../../lib/supabase';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { ShieldCheck, Lock, Mail, ArrowLeft, Sparkles, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { signInWithEmail, user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/admin/dashboard';

  // If already logged in, redirect
  React.useEffect(() => {
    if (user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      error('Please enter both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      const res = await signInWithEmail(email, password);
      if (res.error) {
        error('Authentication Failed', res.error.message || 'Invalid email or password.');
      } else {
        success('Welcome back, Bilal!', 'Logged into Admin Dashboard.');
        navigate(from, { replace: true });
      }
    } catch (err: any) {
      error('Authentication Error', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setEmail('bilalvpm2@gmail.com');
    setPassword('admin123');
    setIsLoading(true);
    const res = await signInWithEmail('bilalvpm2@gmail.com', 'admin123');
    setIsLoading(false);
    if (!res.error) {
      success('Logged in as Administrator');
      navigate(from, { replace: true });
    }
  };

  const configured = isSupabaseConfigured();

  return (
    <div className="min-h-screen bg-[#07080c] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-sky-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
              configured
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
            }`}
          >
            {configured ? 'Supabase Auth' : 'Local Sandbox Mode'}
          </span>
        </div>

        <Card className="p-8 bg-[#0d0f17]/95 border-white/[0.08] shadow-2xl">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white mb-3 shadow-lg shadow-sky-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white font-display">Portfolio CMS Login</h1>
            <p className="text-xs text-slate-400 mt-1">
              Authenticate to manage portfolio content, projects, and media.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bilalvpm2@gmail.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In to Dashboard
            </Button>
          </form>

          {/* Local / Demo Helper */}
          <div className="mt-6 pt-6 border-t border-white/[0.06] text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="inline-flex items-center gap-1.5 text-xs text-sky-400 hover:text-sky-300 font-medium cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Click for instant admin demo sign-in</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};
