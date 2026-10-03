import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { Certification } from '../../types/database';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Stack } from '../common/Stack';
import {
  Award,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Eye,
  ArrowRight,
  Download,
  CheckCircle2,
  Layers,
  LayoutGrid,
} from 'lucide-react';
import { CertificateBackgroundMarquee } from './CertificateBackgroundMarquee';

export const CertificatesSection: React.FC = () => {
  const { data } = usePortfolio();
  const visibleCertifications = data.certifications
    .filter((c) => c.is_visible)
    .sort((a, b) => a.display_order - b.display_order);

  const [selectedCert, setSelectedCert] = useState<Certification | null>(null);
  const [viewMode, setViewMode] = useState<'stack' | 'grid'>('stack');

  if (visibleCertifications.length === 0) {
    return null;
  }

  const renderCertificateCard = React.useCallback((cert: Certification) => {
    const certImage = cert.certificate_url || cert.image_url;
    return (
      <div
        key={cert.id}
        className="w-full h-full bg-[#fafbfa] dark:bg-[#111114] border border-[#738666]/30 dark:border-white/[0.08] rounded-3xl p-5 sm:p-6 shadow-xl shadow-[#1b281c]/[0.08] dark:shadow-black/70 flex flex-col justify-between select-none relative overflow-hidden text-[#1b281c] dark:text-white transition-colors duration-300"
      >
        {/* Ambient decorative glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-[#738666]/10 dark:bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

        <div>
          {/* Top bar */}
          <div className="flex items-center justify-between gap-2 mb-3.5">
            <span className="px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold bg-[#738666]/15 dark:bg-white/[0.06] text-[#273a24] dark:text-zinc-300 border border-[#738666]/25 dark:border-white/[0.08] shadow-xs">
              {cert.category || 'Certification'}
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs sm:text-sm font-bold text-[#32452e] dark:text-zinc-400">
              <Calendar className="w-4 h-4 text-[#738666] dark:text-zinc-400" />
              <span>{cert.issue_date || 'Verified'}</span>
            </div>
          </div>

          {/* Certificate Image Area */}
          <div className="relative w-full h-[220px] sm:h-[260px] rounded-2xl overflow-hidden bg-[#f0f3eb] dark:bg-[#16161a] border border-[#738666]/20 dark:border-white/[0.08] mb-3.5 flex items-center justify-center p-2.5">
            {certImage ? (
              <img
                src={certImage}
                alt={cert.name}
                decoding="async"
                className="w-full h-full max-h-[250px] object-contain rounded-xl pointer-events-none"
                loading="lazy"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-[#738666] dark:text-zinc-400 p-6 text-center">
                <Award className="w-10 h-10 stroke-1" />
                <span className="text-sm font-semibold text-[#32452e] dark:text-zinc-300">Verified Credential</span>
              </div>
            )}

            {cert.credential_id && (
              <div className="absolute bottom-2 right-2 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-white text-xs font-mono pointer-events-none">
                ID: {cert.credential_id}
              </div>
            )}
          </div>

          {/* Title & Issuer */}
          <h3 className="text-lg sm:text-xl font-bold text-[#1b281c] dark:text-white font-display line-clamp-1 mb-1">
            {cert.name}
          </h3>
          <p className="text-sm sm:text-base font-semibold text-[#32452e] dark:text-zinc-400 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-[#738666] dark:text-zinc-400 shrink-0" />
            <span>{cert.issuer}</span>
          </p>
        </div>

        {/* Action Row */}
        <div className="pt-3.5 border-t border-[#738666]/15 dark:border-white/[0.08] flex items-center justify-between gap-2 mt-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedCert(cert);
            }}
            className="text-xs sm:text-sm font-bold text-[#2d402a] dark:text-zinc-300 hover:text-[#1b281c] dark:hover:text-white flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#738666] dark:text-zinc-400" />
            <span>Inspect Certificate</span>
          </button>

          {cert.credential_url ? (
            <a
              href={cert.credential_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#738666] dark:bg-white hover:bg-[#5b6e50] dark:hover:bg-zinc-200 text-white dark:text-black text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify</span>
              <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-white/[0.06] px-3 py-1 rounded-full border border-zinc-300 dark:border-white/[0.1]">
              <CheckCircle2 className="w-3.5 h-3.5 text-zinc-600 dark:text-zinc-300" />
              Issued
            </span>
          )}
        </div>
      </div>
    );
  }, []);

  const stackCards = useMemo(() => {
    return visibleCertifications.map((cert) => renderCertificateCard(cert));
  }, [visibleCertifications, renderCertificateCard]);

  return (
    <section className="py-8 sm:py-12 lg:py-16 relative overflow-hidden bg-white dark:bg-[#08080a] text-[#1b281c] dark:text-white transition-colors duration-300 w-full">
      {/* Ambient Atmospheric Glows */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-20 right-10 w-[540px] h-[540px] bg-[#738666]/15 dark:bg-white/[0.03] rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -left-16 w-[480px] h-[480px] bg-[#738666]/15 dark:bg-white/[0.02] border border-[#738666]/20 dark:border-white/[0.04] rounded-full blur-2xl" />
      </div>

      {/* Animated Infinite Cross-Line Background Marquee */}
      <CertificateBackgroundMarquee opacity="opacity-[0.035] dark:opacity-[0.03]" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10 w-full">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-[#1b281c] dark:text-white font-display tracking-tight leading-none">
            Certifications
          </h2>
          <div className="w-20 sm:w-24 h-1.5 bg-[#738666] dark:bg-white/40 rounded-full mt-4" />

          {/* View Mode Switch (Stack vs Grid) */}
          {visibleCertifications.length > 1 && (
            <div className="inline-flex items-center gap-1 bg-[#f0f3eb] dark:bg-[#16161a] p-1 rounded-full border border-[#738666]/20 dark:border-white/[0.08] mt-6 shadow-xs">
              <button
                type="button"
                onClick={() => setViewMode('stack')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'stack'
                    ? 'bg-[#738666] dark:bg-white text-white dark:text-black font-bold shadow-xs'
                    : 'text-[#3b4e39] dark:text-zinc-400 hover:text-[#1b281c] dark:hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Card Stack</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-[#738666] dark:bg-white text-white dark:text-black font-bold shadow-xs'
                    : 'text-[#3b4e39] dark:text-zinc-400 hover:text-[#1b281c] dark:hover:text-white'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Grid View</span>
              </button>
            </div>
          )}
        </div>

        {/* Stack View (React Bits Stack Component) */}
        {viewMode === 'stack' ? (
          <div className="flex flex-col items-center">
            {/* Stack Container Frame */}
            <div className="w-full max-w-[580px] sm:max-w-[640px] h-[490px] sm:h-[530px] relative mb-4">
              <Stack
                cards={stackCards}
                randomRotation={true}
                sensitivity={100}
                sendToBackOnClick={true}
                animationConfig={{ stiffness: 320, damping: 24 }}
              />
            </div>
            <p className="text-xs font-medium text-[#556950] dark:text-zinc-400 mb-4">
              Tip: Click or swipe the card to shuffle to the next certificate
            </p>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-8">
            {visibleCertifications.map((cert) => renderCertificateCard(cert))}
          </div>
        )}

        {/* View All Certificates Callout */}
        <div className="mt-4 text-center">
          <Link
            to="/certificates"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#1b281c] dark:bg-[#16161a] text-white hover:bg-[#738666] dark:hover:bg-white dark:hover:text-black border border-transparent dark:border-white/[0.1] text-xs sm:text-sm font-bold shadow-md transition-all group"
          >
            <span>Explore All {visibleCertifications.length} Certificates in Full Gallery</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedCert && (
        <Modal
          isOpen={Boolean(selectedCert)}
          onClose={() => setSelectedCert(null)}
          title={selectedCert.name}
          maxWidth="4xl"
        >
          <div className="space-y-4 text-[#1b281c] dark:text-zinc-100">
            {/* Image Preview */}
            <div className="w-full rounded-2xl overflow-hidden bg-slate-950/90 border border-[#738666]/20 dark:border-white/10 max-h-[78vh] flex items-center justify-center p-3">
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
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#738666]/15 dark:border-white/10 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-[#1b281c] dark:text-white">
                    Issued by <span className="text-[#738666] dark:text-white">{selectedCert.issuer}</span>
                  </h4>
                  <p className="text-xs text-[#556950] dark:text-zinc-400 mt-0.5">
                    Issue Date: {selectedCert.issue_date || 'N/A'} {selectedCert.expires_at ? `· Valid until ${selectedCert.expires_at}` : ''}
                  </p>
                </div>

                {selectedCert.credential_id && (
                  <div className="px-3 py-1 rounded-lg bg-[#738666]/10 dark:bg-white/10 border border-[#738666]/20 dark:border-white/10 font-mono text-xs text-[#3b4e39] dark:text-zinc-300">
                    Credential ID: {selectedCert.credential_id}
                  </div>
                )}
              </div>

              {selectedCert.description && (
                <p className="text-xs sm:text-sm text-[#3b4e39] dark:text-zinc-300 leading-relaxed">
                  {selectedCert.description}
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#738666]/15 dark:border-white/10">
                {(selectedCert.certificate_url || selectedCert.image_url) && (
                  <a
                    href={selectedCert.certificate_url || selectedCert.image_url || ''}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                  >
                    <Button variant="outline" size="sm" leftIcon={<Download className="w-3.5 h-3.5" />}>
                      Download Original
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
    </section>
  );
};


