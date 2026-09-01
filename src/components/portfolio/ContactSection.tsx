import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../common/Toast';
import { Card } from '../common/Card';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import {
  Mail,
  Phone,
  Send,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { Github, Linkedin } from '../common/BrandIcons';
import confetti from 'canvas-confetti';

const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const ContactSection: React.FC = () => {
  const { data, submitContactMessage } = usePortfolio();
  const { success, error } = useToast();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const profile = data.profile;
  const email = profile?.email || 'bilalvpm2@gmail.com';
  const phone = profile?.phone || '+91-7306448145';

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    success(`Copied "${text}" to clipboard!`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const onSubmit = async (formData: ContactFormData) => {
    setIsSubmitting(true);
    try {
      const res = await submitContactMessage(formData);
      if (res.success) {
        success('Thank you! Your message has been sent successfully.', "I'll get back to you promptly.");
        reset();
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.75 },
          });
        } catch {}
      } else {
        error('Could not submit message. Please email directly at bilalvpm2@gmail.com');
      }
    } catch {
      error('An error occurred. Please try again or reach out via email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#07080c]/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <Badge variant="primary" size="md" className="mb-3" icon={<MessageSquare className="w-3.5 h-3.5" />}>
            Get In Touch
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-display tracking-tight">
            Let's Build Something Exceptional
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mt-2">
            Available for AI/ML development, full-stack engineering roles, technical collaborations, and research opportunities.
          </p>
          <div className="w-12 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full mt-3" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact Details & Social Cards */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-5 flex flex-col justify-between gap-6"
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Direct Contact Channels</h3>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Feel free to email, call, or connect via LinkedIn and GitHub. I respond quickly to inquiries.
              </p>

              <div className="space-y-3.5">
                {/* Email Card */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between group hover:border-sky-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-sky-500/10 text-sky-400 border border-sky-500/20">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</p>
                      <a href={`mailto:${email}`} className="text-sm font-bold text-white hover:text-sky-400 transition-colors">
                        {email}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(email, 'email')}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Copy Email"
                  >
                    {copiedKey === 'email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* Phone Card */}
                <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between group hover:border-sky-500/30 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Phone</p>
                      <a href={`tel:${phone}`} className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">
                        {phone}
                      </a>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(phone, 'phone')}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                    title="Copy Phone"
                  >
                    {copiedKey === 'phone' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>

                {/* LinkedIn Card */}
                <a
                  href="https://www.linkedin.com/in/bilalvpm4321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between group hover:border-blue-500/40 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">LinkedIn</p>
                      <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                        linkedin.com/in/bilalvpm4321
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>

                {/* GitHub Card */}
                <a
                  href="https://github.com/bilalvpm4321"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between group hover:border-sky-500/30 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-slate-800 text-slate-200 border border-slate-700">
                      <Github className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">GitHub</p>
                      <p className="text-sm font-bold text-white group-hover:text-sky-400 transition-colors">
                        github.com/bilalvpm4321
                      </p>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Contact Message Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7"
          >
            <Card className="p-6 sm:p-8 bg-[#0d0f17]/95 border-white/[0.08]">
              <h3 className="text-xl font-bold text-white mb-2">Send a Direct Message</h3>
              <p className="text-slate-400 text-xs mb-6">
                Have a project or opportunity in mind? Send a message and it will be received securely.
              </p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Your Name <span className="text-sky-400">*</span>
                    </label>
                    <input
                      {...register('name')}
                      type="text"
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                    />
                    {errors.name && (
                      <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.name.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                      Email Address <span className="text-sky-400">*</span>
                    </label>
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="e.g. john@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                    />
                    {errors.email && (
                      <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.email.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Subject / Topic
                  </label>
                  <input
                    {...register('subject')}
                    type="text"
                    placeholder="e.g. Full-Stack / AI Opportunity or Project Collaboration"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Message <span className="text-sky-400">*</span>
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Tell me about your project, role, or proposal..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-sky-400 focus:ring-1 focus:ring-sky-400 transition-all resize-none"
                  />
                  {errors.message && (
                    <p className="text-[11px] text-rose-400 mt-1 font-medium">{errors.message.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<Send className="w-4 h-4" />}
                  className="w-full"
                >
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
