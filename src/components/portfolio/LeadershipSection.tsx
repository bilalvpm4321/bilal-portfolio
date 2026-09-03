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
    <section id="leadership" className="py-24 relative overflow-hidden bg-[#f9faf7] text-[#1b281c]">
      {/* Ambient Olive Green Circles of Varied Sizes (Filled with Olive Green) */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Top-Left Giant Glow Circle (750px) */}
        <div className="absolute -top-40 -left-52 w-[750px] h-[750px] bg-[#738666]/16 rounded-full blur-[160px]" />
        {/* Bottom-Right Medium Glow (480px) */}
        <div className="absolute -bottom-24 -right-28 w-[480px] h-[480px] bg-[#738666]/18 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b281c] font-display tracking-tight">
            Leadership & Volunteering
          </h2>
          <div className="w-12 h-1 bg-[#738666] rounded-full mt-3" />
        </div>


        {/* 3D Interactive Accordion Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="w-full"
        >
          <AccordionGallery
            items={galleryItems}
            defaultIndex={0}
            height={480}
            gap={12}
            radius={24}
            expandRatio={0.52}
            trigger="hover"
          />
        </motion.div>
      </div>
    </section>
  );
};
