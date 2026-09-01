import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MapPin, Mail, Phone, GraduationCap, Briefcase, Sparkles, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const aboutText =
    profile?.about ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.';

  const avatarUrl =
    profile?.avatar_url ||
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80';

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="primary" size="md" className="mb-3" icon={<Sparkles className="w-3.5 h-3.5" />}>
            About Me
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Background & Technical Focus
          </h2>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual / Profile Image Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5"
          >
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 to-indigo-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-60 transition duration-500" />
              <div className="relative rounded-3xl overflow-hidden bg-[#0d0f17] border border-white/[0.1] shadow-2xl p-3">
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-slate-900">
                  <img
                    src={avatarUrl}
                    alt={profile?.full_name || 'Bilal Ahamed PT'}
                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090a0f] via-transparent to-transparent opacity-80" />
                  
                  {/* Floating status card inside image */}
                  <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-[#090a10]/90 backdrop-blur-md border border-white/[0.1] shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-semibold text-white">Bilal Ahamed PT</p>
                        <p className="text-[11px] text-sky-400 font-medium">M.Tech AI & Data Science @ CUSAT</p>
                      </div>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Editorial Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Bridging Intelligent AI Models with Scalable Full-Stack Architectures
              </h3>
              <p className="text-slate-300 leading-relaxed text-base mb-6 font-normal">
                {aboutText}
              </p>
            </div>

            {/* Key Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Current Degree</h4>
                    <p className="text-sm font-bold text-white mt-0.5">M.Tech AI & Data Science</p>
                    <p className="text-xs text-sky-400/90">CUSAT (2025–2027)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Undergraduate Degree</h4>
                    <p className="text-sm font-bold text-white mt-0.5">B.Tech Information Tech</p>
                    <p className="text-xs text-indigo-400/90">GEC Idukki (2021–2025)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Location</h4>
                    <p className="text-sm font-bold text-white mt-0.5">{profile?.location || 'Kerala, India'}</p>
                    <p className="text-xs text-slate-400">Open to Remote / Relocation</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4 bg-white/[0.02] border-white/[0.06]">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Primary Stack</h4>
                    <p className="text-sm font-bold text-white mt-0.5">React • Python • FastAPIs</p>
                    <p className="text-xs text-purple-400/90">GCP • Firebase • Supabase</p>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
