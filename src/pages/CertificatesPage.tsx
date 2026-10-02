import React, { useState, useMemo, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';
import { Certification } from '../types/database';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { CertificateBackgroundMarquee } from '../components/portfolio/CertificateBackgroundMarquee';
import {
  ArrowLeft,
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  Eye,
  Download,
  CheckCircle2,
  Sparkles,
  Layers,
  GraduationCap,
} from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  const { data, loading } = usePortfolio();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = 'Certifications & Accreditations | Bilal Ahamed PT';
  }, []);

  const visibleCertificates = useMemo(() => {
    return data.certifications
      .filter((c) => c.is_visible)
      .sort((a, b) => a.display_order - b.display_order);
  }, [data.certifications]);

  // Derive unique categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: Record<string, number> = { All: visibleCertificates.length };
    visibleCertificates.forEach((c) => {
      const cat = c.category || 'General';
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [visibleCertificates]);

  const categories = Object.keys(categoriesWithCounts);

  // Filtered certificates based on search & category
  const filteredCertificates = useMemo(() => {
    return visibleCertificates.filter((cert) => {
      const matchesCategory =
        selectedCategory === 'All' || (cert.category || 'General') === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        cert.name.toLowerCase().includes(q) ||
        cert.issuer.toLowerCase().includes(q) ||
        (cert.credential_id && cert.credential_id.toLowerCase().includes(q)) ||
        (cert.description && cert.description.toLowerCase().includes(q)) ||
        (cert.skills && cert.skills.some((s) => s.toLowerCase().includes(q)));

      return matchesCategory && matchesSearch;
    });
  }, [visibleCertificates, selectedCategory, searchQuery]);

  // Unique issuers count
  const uniqueIssuersCount = useMemo(() => {
    return new Set(visibleCertificates.map((c) => c.issuer)).size;
  }, [visibleCertificates]);

  return (
    <div className="min-h-screen bg-[#f7f8f4] dark:bg-[#080c09] text-[#1b281c] dark:text-[#e5ede4] selection:bg-[#738666]/25 selection:text-[#1b281c] flex flex-col justify-between relative overflow-hidden transition-colors duration-300">
      {/* Animated Infinite Cross-Line Background Marquee */}
      <CertificateBackgroundMarquee opacity="opacity-[0.045] dark:opacity-[0.03]" />

      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 relative z-10">
        {/* Back Link & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/#certificates"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#556950] dark:text-[#9bb393] hover:text-[#1b281c] dark:hover:text-[#ffffff] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>

          <Link to="/admin/certifications" className="text-xs text-[#738666] dark:text-[#8ea788] hover:underline font-mono">
            Admin CMS Login →
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#eef1ea] via-[#f3f5f0] to-[#e8ede4] dark:from-[#111912] dark:via-[#0e1610] dark:to-[#080d09] border border-[#738666]/20 dark:border-[#738666]/30 p-8 sm:p-12 mb-10 overflow-hidden shadow-xl shadow-[#1b281c]/[0.02] dark:shadow-black/40">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#738666]/15 dark:bg-[#738666]/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#738666]/20 dark:bg-[#738666]/12 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 dark:bg-[#141e15]/80 border border-[#738666]/30 text-[#3b4e39] dark:text-[#c5d8c3] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#738666]" />
              <span>Certified Credentials & Accreditations</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-[#1b281c] dark:text-[#f0f7ef] font-display tracking-tight leading-none mb-5">
              Certifications
            </h1>

            <p className="text-sm sm:text-base text-[#4d6048] dark:text-[#b8ceb5] leading-relaxed mb-8">
              A curated catalog of authenticated technical accreditations, machine learning specializations, and cloud engineering credentials earned from global technology leaders.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-[#738666]/20 dark:border-[#738666]/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#738666]/15 dark:bg-[#738666]/25 text-[#3b4e39] dark:text-[#c5d8c3] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1b281c] dark:text-[#f0f7ef] font-display">
                    {visibleCertificates.length}
                  </div>
                  <div className="text-[11px] text-[#556950] dark:text-[#8ea788] uppercase tracking-wider font-medium">
                    Total Certificates
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-[#738666]/20 dark:bg-[#738666]/30 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#738666]/15 dark:bg-[#738666]/25 text-[#3b4e39] dark:text-[#c5d8c3] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1b281c] dark:text-[#f0f7ef] font-display">
                    {uniqueIssuersCount}
                  </div>
                  <div className="text-[11px] text-[#556950] dark:text-[#8ea788] uppercase tracking-wider font-medium">
                    Issuing Authorities
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-[#738666]/20 dark:bg-[#738666]/30 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-900 dark:text-emerald-200 font-display">
                    100%
                  </div>
                  <div className="text-[11px] text-[#556950] dark:text-[#8ea788] uppercase tracking-wider font-medium">
                    Authenticated
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-[#738666] absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, organization, or skill..."
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white dark:bg-[#101812] border border-[#738666]/25 dark:border-[#738666]/35 text-[#1b281c] dark:text-[#f0f7ef] text-xs placeholder-[#556950]/60 dark:placeholder-[#7f997a]/60 focus:outline-none focus:border-[#738666] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#556950] dark:text-[#8ea788] hover:text-[#1b281c] dark:hover:text-[#ffffff]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-xs font-medium text-[#556950] dark:text-[#8ea788] self-center">
              Showing <span className="font-bold text-[#1b281c] dark:text-[#f0f7ef]">{filteredCertificates.length}</span> credentials
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              const count = categoriesWithCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#738666] text-white shadow-xs'
                      : 'bg-white dark:bg-[#101812] hover:bg-[#738666]/10 dark:hover:bg-[#738666]/20 text-[#3b4e39] dark:text-[#b8ceb5] border border-[#738666]/20 dark:border-[#738666]/30'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#738666]/15 dark:bg-[#738666]/25 text-[#3b4e39] dark:text-[#c4d7c0]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Certificate Cards Gallery */}
        {filteredCertificates.length === 0 ? (
          <div className="rounded-3xl bg-white dark:bg-[#0e1610] border border-[#738666]/20 dark:border-[#738666]/30 p-12 text-center space-y-3 shadow-sm">
            <Award className="w-12 h-12 text-[#738666] mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-[#1b281c] dark:text-[#f0f7ef]">No Matching Certifications</h3>
            <p className="text-xs text-[#556950] dark:text-[#8ea788] max-w-sm mx-auto">
              No certifications matched your search or category filter. Try clearing your search query.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('All');
              }}
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredCertificates.map((cert, index) => {
              const certImage = cert.certificate_url || cert.image_url;
              return (
                <motion.div
                  key={cert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="group rounded-3xl bg-white dark:bg-[#0e1610] border border-[#738666]/20 dark:border-[#738666]/30 overflow-hidden shadow-md shadow-[#1b281c]/[0.02] dark:shadow-black/30 hover:shadow-xl hover:shadow-[#738666]/12 hover:border-[#738666]/40 dark:hover:border-[#738666]/50 transition-all flex flex-col justify-between"
                >
                  {/* Top Image Preview */}
                  <div
                    onClick={() => setSelectedCert(cert)}
                    className="relative w-full min-h-[200px] max-h-[360px] bg-[#eef1ea]/70 dark:bg-[#131d14]/70 overflow-hidden border-b border-[#738666]/15 dark:border-[#738666]/25 cursor-pointer flex items-center justify-center p-2.5 group/preview"
                  >
                    {certImage ? (
                      <img
                        src={certImage}
                        alt={cert.name}
                        decoding="async"
                        className="w-full h-auto max-h-[340px] object-contain rounded-xl transition-transform duration-300 group-hover/preview:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#738666] p-6 text-center">
                        <Award className="w-10 h-10 stroke-1" />
                        <span className="text-sm font-semibold text-[#32452e] dark:text-[#c4d7c0]">Verified Certificate</span>
                      </div>
                    )}

                    {/* Category pill on top of image */}
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-white/95 dark:bg-[#141e15]/95 backdrop-blur-md text-[#273b24] dark:text-[#c8dec6] border border-[#738666]/25 dark:border-[#738666]/35 shadow-xs">
                      {cert.category || 'Certification'}
                    </div>

                    {cert.issue_date && (
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-mono font-bold">
                        {cert.issue_date}
                      </div>
                    )}

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-[#1b281c]/40 dark:bg-black/60 backdrop-blur-xs opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4.5 py-2.5 rounded-full bg-white dark:bg-[#182419] text-[#1b281c] dark:text-[#f0f7ef] text-sm font-bold shadow-lg flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#738666]" />
                        Inspect Certificate
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-[#1b281c] dark:text-[#f0f7ef] font-display line-clamp-2 mb-1.5 group-hover:text-[#556950] dark:group-hover:text-[#9bc490] transition-colors">
                        {cert.name}
                      </h3>

                      <p className="text-sm sm:text-base font-semibold text-[#3b5038] dark:text-[#9bb393] mb-3 flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-[#738666] shrink-0" />
                        <span>{cert.issuer}</span>
                      </p>

                      {cert.description && (
                        <p className="text-sm text-[#273a24] dark:text-[#b8ceb5] line-clamp-2 mb-4 leading-relaxed font-normal">
                          {cert.description}
                        </p>
                      )}

                      {/* Verified Skills */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#738666]/12 dark:bg-[#738666]/20 text-[#223520] dark:text-[#c8dec6] border border-[#738666]/20 dark:border-[#738666]/30"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-[#738666]/15 dark:border-[#738666]/25 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="text-xs sm:text-sm font-bold text-[#2d402a] dark:text-[#b8ceb5] hover:text-[#1b281c] dark:hover:text-[#f0f7ef] flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Eye className="w-4 h-4 text-[#738666]" />
                        <span>Inspect</span>
                      </button>

                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#738666] hover:bg-[#5b6e50] text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-xs font-mono font-semibold text-[#486045] dark:text-[#8ea788]">
                          ID: {cert.credential_id || 'N/A'}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />

      {/* High-Resolution Certificate Inspection Lightbox */}
      {selectedCert && (
        <Modal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          title={selectedCert.name}
          maxWidth="4xl"
        >
          <div className="space-y-4 text-[#1b281c] dark:text-[#e5ede4]">
            {/* Image Preview */}
            <div className="w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-[#738666]/20 dark:border-[#738666]/30 max-h-[78vh] flex items-center justify-center p-3">
              {selectedCert.certificate_url || selectedCert.image_url ? (
                <img
                  src={selectedCert.certificate_url || selectedCert.image_url || ''}
                  alt={selectedCert.name}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl shadow-2xl"
                />
              ) : (
                <div className="p-12 text-center text-slate-400">
                  <Award className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                  <p className="text-xs">No direct document image attached for this certificate.</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#738666]/15 dark:border-[#738666]/25 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#1b281c] dark:text-[#f0f7ef]">
                    Issued by <span className="text-[#738666] dark:text-[#9bc490]">{selectedCert.issuer}</span>
                  </h4>
                  <p className="text-xs text-[#556950] dark:text-[#8ea788] mt-0.5">
                    Issue Date: {selectedCert.issue_date || 'N/A'} {selectedCert.expires_at ? `· Valid until ${selectedCert.expires_at}` : ''}
                  </p>
                </div>

                {selectedCert.credential_id && (
                  <div className="px-3 py-1 rounded-lg bg-[#738666]/10 dark:bg-[#738666]/20 border border-[#738666]/20 dark:border-[#738666]/30 font-mono text-xs text-[#3b4e39] dark:text-[#c4d7c0]">
                    Credential ID: {selectedCert.credential_id}
                  </div>
                )}
              </div>

              {selectedCert.description && (
                <p className="text-xs sm:text-sm text-[#3b4e39] dark:text-[#c7d8c4] leading-relaxed">
                  {selectedCert.description}
                </p>
              )}

              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-[#1b281c] dark:text-[#e5ede4] uppercase tracking-wider mb-2">
                    Verified Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#738666]/10 dark:bg-[#738666]/20 text-[#2f422d] dark:text-[#c8dec6] border border-[#738666]/20 dark:border-[#738666]/30"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#738666]/15 dark:border-[#738666]/25">
                {(selectedCert.certificate_url || selectedCert.image_url) && (
                  <a
                    href={selectedCert.certificate_url || selectedCert.image_url || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                      Download Certificate
                    </Button>
                  </a>
                )}

                {selectedCert.credential_url && (
                  <a
                    href={selectedCert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Verify Official Credential
                    </Button>
                  </a>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
