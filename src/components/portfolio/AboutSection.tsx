import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { MapPin, GraduationCap, Briefcase, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { data } = usePortfolio();
  const profile = data.profile;

  const aboutText =
    profile?.about ||
    'M.Tech Computer Science and Engineering (AI & Data Science) student at Cochin University of Science and Technology with hands-on experience in full-stack development, Artificial Intelligence, Machine Learning, cloud technologies, and real-time applications. Skilled in Python, React, Firebase, AWS, and Google Cloud Platform, with experience developing AI-powered applications using OpenAI technologies. Proficient in AI coding tools, prompt engineering, database integration, debugging, testing, deployment, and collaborative software development.';

  // Separate About Section photo with fallback to hero avatar
  const aboutImageUrl =
    profile?.about_image_url ||
    data.siteSettings?.about?.image_url ||
    profile?.avatar_url ||
    '';

  return (
    <section id="about" className="pt-8 sm:pt-12 pb-24 relative overflow-hidden bg-[#f9faf7] text-[#1b281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Interactive Staged Grid: Photo stands tall on left, Heading & Box on right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-0 items-start relative">
          
          {/* Visual / Profile Image (Standing tall at top with no dead space above) */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 flex items-start justify-center lg:justify-end relative z-20 pointer-events-none"
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

          {/* Right Column: Heading in the space next to head + Big Box under hand + Small Boxes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col gap-6 relative z-10 lg:pt-1"
          >
            {/* The Section Heading Positioned in the Rounded Space Next to Head & Shoulders */}
            <div className="flex flex-col items-start text-left space-y-2">
              <Badge variant="primary" size="md" icon={<Sparkles className="w-3.5 h-3.5 text-[#738666]" />}>
                About Me
              </Badge>
              <h2 className="text-3xl sm:text-5xl lg:text-[50px] xl:text-[56px] font-extrabold text-[#1b281c] font-display tracking-wide lg:tracking-[0.04em] leading-[1.08]">
                <span className="block">Background &</span>
                <span className="inline-flex flex-col items-center">
                  <span>Technical Focus</span>
                  <span className="w-20 h-1 bg-[#738666]/70 rounded-full mt-2 inline-block" />
                </span>
              </h2>
            </div>

            {/* The Big Box resting directly under his outstretched hand (exact position preserved) */}
            <Card className="p-6 sm:p-8 pt-7 sm:pt-9 bg-white border-[#738666]/12 shadow-xs hover:border-[#738666]/25 transition-all rounded-3xl relative lg:-ml-10 xl:-ml-14 lg:mt-[58px] xl:mt-[62px]">
              <h3 className="text-xl sm:text-2xl font-bold text-[#1b281c] font-display mb-3.5 leading-snug">
                Bridging Intelligent AI Models with Scalable Full-Stack Architectures
              </h3>
              <p className="text-[#4a5d46] leading-relaxed text-sm sm:text-base font-normal">
                {aboutText}
              </p>
            </Card>

            {/* Small Boxes Resized with Subtle, Refined Borders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5 lg:-ml-10 xl:-ml-14">
              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/20 shadow-xs hover:shadow-sm transition-all rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Current Degree</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate">M.Tech AI & Data Science</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">CUSAT (2025–2027)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/20 shadow-xs hover:shadow-sm transition-all rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Undergraduate Degree</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate">B.Tech Information Tech</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">GEC Idukki (2021–2025)</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/20 shadow-xs hover:shadow-sm transition-all rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Location</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate">{profile?.location || 'Kerala, India'}</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">Open to Remote / Relocation</p>
                  </div>
                </div>
              </Card>

              <Card className="p-3.5 sm:p-4 bg-white border-[#738666]/12 hover:border-[#738666]/20 shadow-xs hover:shadow-sm transition-all rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#738666]/12 text-[#738666] border border-[#738666]/15 flex items-center justify-center shrink-0">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[11px] font-semibold text-[#556950] uppercase tracking-wider truncate">Primary Stack</h4>
                    <p className="text-xs sm:text-sm font-bold text-[#1b281c] truncate">React • Python • FastAPI</p>
                    <p className="text-[11px] text-[#738666] font-medium truncate">GCP • Firebase • Supabase</p>
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
