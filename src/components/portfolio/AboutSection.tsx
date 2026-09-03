import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Sparkles, Cpu, Database, Wrench } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const aboutText =
    profile?.about ||
    profile?.bio ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.';

  const aboutImageUrl =
    profile?.about_image_url ||
    data.siteSettings?.about?.image_url ||
    profile?.avatar_url ||
    '';

  return (
    <section id="about" className="pt-8 sm:pt-12 pb-24 relative overflow-hidden bg-[#f9faf7] text-[#1b281c]">
      {/* Clean background without circles */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start relative">
          
          {/* Left Column: Standalone Profile Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex items-start justify-center lg:justify-end relative z-20"
          >
            {aboutImageUrl ? (
              <div className="relative w-full max-w-md sm:max-w-lg lg:max-w-[490px] xl:max-w-[530px] flex items-start justify-center lg:justify-end">
                <img
                  src={aboutImageUrl}
                  alt={profile?.full_name || 'Bilal'}
                  className="w-auto h-auto max-h-[620px] sm:max-h-[700px] lg:max-h-[780px] xl:max-h-[820px] max-w-full object-contain object-top mx-auto lg:mr-0 drop-shadow-sm select-none pointer-events-auto transition-transform duration-500 hover:scale-[1.01]"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-3xl bg-[#738666]/10 border border-[#738666]/15 flex flex-col items-center justify-center text-[#738666] mx-auto pointer-events-auto mt-6">
                <div className="w-20 h-20 rounded-full bg-[#738666] text-white flex items-center justify-center text-3xl font-bold font-editorial shadow-xs">
                  B
                </div>
                <span className="mt-3 text-xs font-mono tracking-wider text-[#556950]">Bilal</span>
              </div>
            )}
          </motion.div>

          {/* Right Column: Bio Narrative & Technical Skill Domain Boxes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-7 flex flex-col gap-6 relative z-10 lg:pt-1"
          >
            {/* Section Heading with Big Display Typography in Full Olive Green */}
            <div className="flex flex-col items-start text-left space-y-2">
              <h2 className="text-5xl sm:text-7xl lg:text-[84px] xl:text-[98px] font-black text-[#738666] font-display uppercase tracking-tight leading-[0.9] flex items-center gap-3 sm:gap-4">
                <span>ABOUT ME</span>
              </h2>
            </div>


            {/* Bio Card Narrative Resting Directly Under His Outstretched Hand */}
            <Card className="p-6 sm:p-8 pt-7 sm:pt-9 bg-white border-[#738666]/15 shadow-sm rounded-3xl relative lg:-ml-16 xl:-ml-24 lg:mt-[104px] xl:mt-[118px]">

              <h3 className="text-xl sm:text-2xl font-extrabold text-[#1b281c] mb-3 font-display">
                Building Intelligent Web Systems & AI Solutions
              </h3>
              <p className="text-sm sm:text-base text-[#4a5d46] leading-relaxed">
                {aboutText}
              </p>
            </Card>

            {/* Technical Skill Domain Boxes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 lg:-ml-16 xl:-ml-24">


              {/* Skill Box 1: Generative AI & ML */}
              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/30 shadow-xs hover:shadow-md transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0 group-hover:bg-[#738666] group-hover:text-white transition-colors">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">AI & Machine Learning</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate font-display">Generative AI & LLMs</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">OpenAI APIs • PyTorch • LangChain</p>
                  </div>
                </div>
              </Card>

              {/* Skill Box 2: Full-Stack Web Development */}
              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/30 shadow-xs hover:shadow-md transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0 group-hover:bg-[#738666] group-hover:text-white transition-colors">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Frontend & Backend</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate font-display">Full-Stack Web Engineering</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">React • TypeScript • Python • Next.js</p>
                  </div>
                </div>
              </Card>

              {/* Skill Box 3: Cloud & Realtime Systems */}
              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/30 shadow-xs hover:shadow-md transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0 group-hover:bg-[#738666] group-hover:text-white transition-colors">
                    <Database className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Cloud & Realtime DB</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate font-display">Cloud Infrastructure</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">GCP • Firebase • AWS • Supabase</p>
                  </div>
                </div>
              </Card>

              {/* Skill Box 4: Development & AI Coding Tools */}
              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/30 shadow-xs hover:shadow-md transition-all rounded-2xl group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0 group-hover:bg-[#738666] group-hover:text-white transition-colors">
                    <Wrench className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Tooling & Engineering</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate font-display">AI Tooling & Debugging</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">Prompt Engineering • Git • Docker</p>
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
