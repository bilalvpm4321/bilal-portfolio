import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import { Badge } from '../common/Badge';
import { Card } from '../common/Card';
import {
  Code,
  Brain,
  Layout,
  Server,
  Database,
  Wrench,
  Layers,
  Cpu,
  Terminal,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  Programming: <Code className="w-4 h-4" />,
  'AI & Machine Learning': <Brain className="w-4 h-4" />,
  Frontend: <Layout className="w-4 h-4" />,
  'Backend & Cloud': <Server className="w-4 h-4" />,
  Databases: <Database className="w-4 h-4" />,
  'DevOps & Tools': <Wrench className="w-4 h-4" />,
};

export const SkillsSection: React.FC = () => {
  const { data } = usePortfolio();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories from visible skills
  const categories = useMemo(() => {
    const visible = data.skills.filter((s) => s.is_visible);
    const unique = Array.from(new Set(visible.map((s) => s.category)));
    return ['All', ...unique];
  }, [data.skills]);

  const filteredSkills = useMemo(() => {
    const visible = data.skills.filter((s) => s.is_visible);
    if (selectedCategory === 'All') return visible;
    return visible.filter((s) => s.category === selectedCategory);
  }, [data.skills, selectedCategory]);

  return (
    <section id="skills" className="py-24 relative overflow-hidden bg-white text-[#1b281c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge variant="primary" size="md" className="mb-3" icon={<Cpu className="w-3.5 h-3.5 text-[#738666]" />}>
            Technical Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1b281c] font-display tracking-tight">
            Skills & Core Technologies
          </h2>
          <p className="text-[#4a5d46] text-sm max-w-xl mt-2">
            A comprehensive overview of programming languages, AI/ML frameworks, cloud infrastructure, and developer tools.
          </p>
          <div className="w-12 h-1 bg-[#738666] rounded-full mt-3" />
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setSelectedCategory(category)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-[#738666] text-white border border-[#738666] shadow-md shadow-[#738666]/20 scale-105'
                    : 'bg-[#f8faf6] text-[#4a5d46] hover:text-[#1b281c] hover:bg-[#f1f4ed] border border-[#738666]/20'
                }`}
              >
                {category !== 'All' && CATEGORY_ICONS[category]}
                {category === 'All' && <Layers className="w-3.5 h-3.5" />}
                <span>{category}</span>
              </button>
            );
          })}
        </div>

        {/* Skills Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5"
        >
          {filteredSkills.map((skill, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, delay: index * 0.02 }}
              key={skill.id}
            >
              <Card
                hoverEffect
                className="p-3.5 flex flex-col justify-between h-full bg-white border-[#738666]/20 hover:border-[#738666]/50 shadow-xs group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-[#738666]/12 text-[#738666] border border-[#738666]/25 flex items-center justify-center text-xs group-hover:scale-110 group-hover:bg-[#738666] group-hover:text-white transition-all duration-200">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      skill.level === 'Expert'
                        ? 'bg-[#c8a869]/15 text-[#8d6d2b] border-[#c8a869]/30'
                        : skill.level === 'Advanced'
                        ? 'bg-[#738666]/15 text-[#3d5337] border-[#738666]/30'
                        : 'bg-[#f1f4ed] text-[#556950] border-[#738666]/20'
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#1b281c] group-hover:text-[#738666] transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-[#556950] mt-0.5">{skill.category}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
