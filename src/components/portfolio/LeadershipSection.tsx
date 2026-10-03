import React from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Badge } from '../common/Badge';
import { Users, MousePointerClick } from 'lucide-react';
import { Leadership } from '../../types/database';
import { AccordionGallery, AccordionGalleryItem } from './AccordionGallery';

const enrichLeadershipItem = (item: Leadership): AccordionGalleryItem => {
  const combined = `${item.organization} ${item.role}`.toLowerCase();

  let badge = 'Leadership';
  let tags = ['Community', 'Leadership', 'Outreach'];

  if (combined.includes('cusat') || combined.includes('council')) {
    badge = 'University Executive';
    tags = ['Student Council', 'University Initiatives', 'Student Advocacy'];
  } else if (combined.includes('ieee') && (combined.includes('vice') || combined.includes('ras'))) {
    badge = 'Robotics Society Lead';
    tags = ['IEEE RAS', 'Robotics & AI', 'Workshops'];
  } else if (combined.includes('ieee') && combined.includes('chairperson')) {
    badge = 'Executive Operations';
    tags = ['Chapter Direction', 'Technical Seminars', 'Strategy'];
  } else if (combined.includes('gdsc') || combined.includes('google')) {
    badge = 'Google Developer Club';
    tags = ['Tech Branding', 'Developer Community', 'Digital Media'];
  } else if (combined.includes('nss') || combined.includes('event')) {
    badge = 'Hackathons & Drives';
    tags = ['Technical Hackathons', 'Community Camps', 'Logistics'];
  } else if (combined.includes('palliative') || combined.includes('oasis')) {
    badge = 'Healthcare Outreach';
    tags = ['Palliative Care', 'Healthcare Drives', 'Social Impact'];
  }

  return {
    id: item.id,
    role: item.role,
    organization: item.organization,
    period: item.period,
    description: item.description,
    badge,
    tags,
  };
};

export const LeadershipSection: React.FC = () => {
  const { data } = usePortfolio();
  const leaderships = data.leadership.filter((l) => l.is_visible);
  const galleryItems = leaderships.map(enrichLeadershipItem);

  return (
    <section id="leadership" className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-[#f9faf7] dark:bg-[#08080a] text-[#1b281c] dark:text-zinc-100 transition-colors duration-300 w-full">
      {/* Ambient Glow Circles */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Giant Glow Circle */}
        <div className="absolute -top-40 -left-52 w-[650px] h-[650px] bg-[#738666]/16 dark:bg-white/[0.02] rounded-full blur-[90px]" />
        {/* Bottom-Right Medium Glow */}
        <div className="absolute -bottom-24 -right-28 w-[450px] h-[450px] bg-[#738666]/18 dark:bg-white/[0.02] rounded-full blur-[70px]" />
      </div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-10">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Leadership & Volunteering
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white rounded-full mt-4" />
        </div>


        {/* 3D Interactive Accordion Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full"
        >
          <AccordionGallery
            items={galleryItems}
            defaultIndex={0}
            height={520}
            gap={14}
            radius={32}
            expandRatio={0.56}
            duration={0.38}
            tilt={1.2}
            trigger="hover"
          />
        </motion.div>
      </div>
    </section>
  );
};
