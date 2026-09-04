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
    <div className="min-h-screen bg-[#f7f8f4] text-[#1b281c] selection:bg-[#738666]/25 selection:text-[#1b281c] flex flex-col justify-between relative overflow-hidden">
      {/* Animated Infinite Cross-Line Background Marquee */}
      <CertificateBackgroundMarquee opacity="opacity-[0.045]" />

      <Navbar />

      <main className="pt-28 pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1 relative z-10">
        {/* Back Link & Breadcrumb */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/#certificates"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#556950] hover:text-[#1b281c] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Portfolio</span>
          </Link>

          <Link to="/admin/certifications" className="text-xs text-[#738666] hover:underline font-mono">
            Admin CMS Login →
          </Link>
        </div>

        {/* Hero Banner Header */}
        <div className="relative rounded-[32px] sm:rounded-[40px] bg-gradient-to-br from-[#eef1ea] via-[#f3f5f0] to-[#e8ede4] border border-[#738666]/20 p-8 sm:p-12 mb-10 overflow-hidden shadow-xl shadow-[#1b281c]/[0.02]">
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#738666]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#738666]/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-[#738666]/30 text-[#3b4e39] text-xs font-semibold uppercase tracking-wider mb-4 shadow-xs">
              <Award className="w-3.5 h-3.5 text-[#738666]" />
              <span>Certified Credentials & Accreditations</span>
            </div>

            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-extrabold text-[#1b281c] font-display tracking-tight leading-none mb-5">
              Certifications
            </h1>

            <p className="text-sm sm:text-base text-[#4d6048] leading-relaxed mb-8">
              A curated catalog of authenticated technical accreditations, machine learning specializations, and cloud engineering credentials earned from global technology leaders.
            </p>

            {/* Quick Metrics Bar */}
            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-6 border-t border-[#738666]/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#738666]/15 text-[#3b4e39] flex items-center justify-center font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1b281c] font-display">
                    {visibleCertificates.length}
                  </div>
                  <div className="text-[11px] text-[#556950] uppercase tracking-wider font-medium">
                    Total Certificates
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-[#738666]/20 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#738666]/15 text-[#3b4e39] flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#1b281c] font-display">
                    {uniqueIssuersCount}
                  </div>
                  <div className="text-[11px] text-[#556950] uppercase tracking-wider font-medium">
                    Issuing Authorities
                  </div>
                </div>
              </div>

              <div className="w-px h-8 bg-[#738666]/20 hidden sm:block" />

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-emerald-900 font-display">
                    100%
                  </div>
                  <div className="text-[11px] text-[#556950] uppercase tracking-wider font-medium">
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
                className="w-full pl-10 pr-4 py-2.5 rounded-full bg-white border border-[#738666]/25 text-[#1b281c] text-xs placeholder-[#556950]/60 focus:outline-none focus:border-[#738666] shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#556950] hover:text-[#1b281c]"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-xs font-medium text-[#556950] self-center">
              Showing <span className="font-bold text-[#1b281c]">{filteredCertificates.length}</span> credentials
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
                      : 'bg-white hover:bg-[#738666]/10 text-[#3b4e39] border border-[#738666]/20'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-[#738666]/15 text-[#3b4e39]'
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
          <div className="rounded-3xl bg-white border border-[#738666]/20 p-12 text-center space-y-3 shadow-sm">
            <Award className="w-12 h-12 text-[#738666] mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-[#1b281c]">No Matching Certifications</h3>
            <p className="text-xs text-[#556950] max-w-sm mx-auto">
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
                  className="group rounded-3xl bg-white border border-[#738666]/20 overflow-hidden shadow-md shadow-[#1b281c]/[0.02] hover:shadow-xl hover:shadow-[#738666]/12 hover:border-[#738666]/40 transition-all flex flex-col justify-between"
                >
                  {/* Top Image Preview */}
                  <div
                    onClick={() => setSelectedCert(cert)}
                    className="relative w-full min-h-[200px] max-h-[360px] bg-[#eef1ea]/70 overflow-hidden border-b border-[#738666]/15 cursor-pointer flex items-center justify-center p-2.5 group/preview"
                  >
                    {certImage ? (
                      <img
                        src={certImage}
                        alt={cert.name}
                        className="w-full h-auto max-h-[340px] object-contain rounded-xl transition-transform duration-300 group-hover/preview:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-[#738666] p-6 text-center">
                        <Award className="w-10 h-10 stroke-1" />
                        <span className="text-xs font-semibold">Verified Certificate</span>
                      </div>
                    )}

                    {/* Category pill on top of image */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-semibold bg-white/90 backdrop-blur-md text-[#3b4e39] border border-[#738666]/20 shadow-xs">
                      {cert.category || 'Certification'}
                    </div>

                    {cert.issue_date && (
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-mono">
                        {cert.issue_date}
                      </div>
                    )}

                    {/* Hover Inspect Overlay */}
                    <div className="absolute inset-0 bg-[#1b281c]/40 backdrop-blur-xs opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="px-4 py-2 rounded-full bg-white text-[#1b281c] text-xs font-semibold shadow-lg flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-[#738666]" />
                        Inspect Certificate
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-[#1b281c] font-display line-clamp-2 mb-1 group-hover:text-[#556950] transition-colors">
                        {cert.name}
                      </h3>

                      <p className="text-xs font-semibold text-[#556950] mb-3 flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[#738666] shrink-0" />
                        <span>{cert.issuer}</span>
                      </p>

                      {cert.description && (
                        <p className="text-xs text-[#3b4e39]/80 line-clamp-2 mb-4 leading-relaxed">
                          {cert.description}
                        </p>
                      )}

                      {/* Verified Skills */}
                      {cert.skills && cert.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {cert.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#738666]/10 text-[#2c3e2b]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Card Footer Actions */}
                    <div className="pt-4 border-t border-[#738666]/15 flex items-center justify-between gap-2">
                      <button
                        onClick={() => setSelectedCert(cert)}
                        className="text-xs font-semibold text-[#3b4e39] hover:text-[#1b281c] flex items-center gap-1 cursor-pointer transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#738666]" />
                        <span>Inspect</span>
                      </button>

                      {cert.credential_url ? (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#738666] hover:bg-[#5b6e50] text-white text-xs font-semibold shadow-xs transition-all"
                        >
                          <ShieldCheck className="w-3 h-3" />
                          <span>Verify</span>
                          <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-[11px] text-[#556950] font-mono">
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
          <div className="space-y-4 text-[#1b281c]">
            {/* Image Preview */}
            <div className="w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-[#738666]/20 max-h-[78vh] flex items-center justify-center p-3">
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#738666]/15 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#1b281c]">
                    Issued by <span className="text-[#738666]">{selectedCert.issuer}</span>
                  </h4>
                  <p className="text-xs text-[#556950] mt-0.5">
                    Issue Date: {selectedCert.issue_date || 'N/A'} {selectedCert.expires_at ? `· Valid until ${selectedCert.expires_at}` : ''}
                  </p>
                </div>

                {selectedCert.credential_id && (
                  <div className="px-3 py-1 rounded-lg bg-[#738666]/10 border border-[#738666]/20 font-mono text-xs text-[#3b4e39]">
                    Credential ID: {selectedCert.credential_id}
                  </div>
                )}
              </div>

              {selectedCert.description && (
                <p className="text-xs sm:text-sm text-[#3b4e39] leading-relaxed">
                  {selectedCert.description}
                </p>
              )}

              {selectedCert.skills && selectedCert.skills.length > 0 && (
                <div>
                  <h5 className="text-xs font-semibold text-[#1b281c] uppercase tracking-wider mb-2">
                    Verified Competencies
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCert.skills.map((s) => (
                      <span
                        key={s}
                        className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#738666]/10 text-[#2f422d] border border-[#738666]/20"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#738666]/15">
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
