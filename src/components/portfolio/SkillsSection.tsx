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
  Sparkles,
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
    <section id="skills" className="py-24 relative overflow-hidden bg-[#07080c]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-14">
          <Badge variant="accent" size="md" className="mb-3" icon={<Cpu className="w-3.5 h-3.5" />}>
            Technical Expertise
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Skills & Core Technologies
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            A comprehensive overview of programming languages, AI/ML frameworks, cloud infrastructure, and developer tools.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
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
                    ? 'bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/25 scale-105'
                    : 'bg-white/[0.04] text-slate-300 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
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
                className="p-3.5 flex flex-col justify-between h-full bg-[#0d0f17]/90 border-white/[0.06] group"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center text-xs group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-slate-950 transition-all duration-200">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                      skill.level === 'Expert'
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : skill.level === 'Advanced'
                        ? 'bg-sky-500/10 text-sky-400 border-sky-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}
                  >
                    {skill.level}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-sky-300 transition-colors">
                    {skill.name}
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">{skill.category}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
