import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Certification } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import {
  Plus,
  Edit2,
  Trash2,
  Award,
  Calendar,
  ExternalLink,
  Upload,
  Search,
  Filter,
  ShieldCheck,
  Eye,
  Sparkles,
  Tag,
  CheckCircle2,
} from 'lucide-react';

export const AdminCertificationsPage: React.FC = () => {
  const { data, deleteCertification } = usePortfolio();
  const { success, error } = useToast();

  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [previewCert, setPreviewCert] = useState<Certification | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    data.certifications.forEach((c) => {
      if (c.category) set.add(c.category);
    });
    return ['All', ...Array.from(set)];
  }, [data.certifications]);

  // Filtered certifications
  const filteredCertifications = useMemo(() => {
    return data.certifications.filter((cert) => {
      const matchesSearch =
        cert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cert.issuer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cert.skills && cert.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())));

      const matchesCategory =
        selectedCategory === 'All' || cert.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [data.certifications, searchQuery, selectedCategory]);

  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    try {
      const res = await deleteCertification(certToDelete.id);
      if (res.success) {
        success('Certification deleted successfully');
        setCertToDelete(null);
      } else {
        error('Failed to delete certification');
      }
    } catch (err: any) {
      error('Error deleting certification', err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
              <Award className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold text-white">Certifications & Licenses</h1>
          </div>
          <p className="text-xs text-slate-400">
            Upload certificates, attach verification links, and showcase authenticated credentials on your portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/certificates" target="_blank">
            <Button variant="outline" size="md" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
              View Live Page
            </Button>
          </Link>
          <Link to="/admin/certifications/new">
            <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
              Upload Certificate
            </Button>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, issuer, or skill..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-xs placeholder-slate-500 focus:outline-none focus:border-sky-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-500/15 text-sky-400 border border-sky-500/30'
                  : 'bg-white/[0.02] text-slate-400 hover:text-white border border-white/[0.06]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      {filteredCertifications.length === 0 ? (
        <Card className="p-12 text-center bg-[#0d0f17]/95 border-white/[0.08] space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-500/10 text-sky-400 flex items-center justify-center mx-auto border border-sky-500/20">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              {searchQuery || selectedCategory !== 'All'
                ? 'No matching certificates found'
                : 'No Certifications Uploaded Yet'}
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search query or clear active category filters.'
                : 'Upload your verified cloud accreditations, machine learning certificates, or course badges.'}
            </p>
          </div>
          <Link to="/admin/certifications/new" className="inline-block">
            <Button variant="primary" size="md" leftIcon={<Upload className="w-4 h-4" />}>
              Upload First Certificate
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCertifications.map((cert) => {
            const certImage = cert.certificate_url || cert.image_url;
            return (
              <Card
                key={cert.id}
                className="bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between overflow-hidden group hover:border-sky-500/30 transition-all"
              >
                {/* Certificate Thumbnail Preview */}
                <div className="relative w-full min-h-[160px] max-h-[280px] bg-slate-950/80 border-b border-white/[0.08] overflow-hidden flex items-center justify-center p-2.5">
                  {certImage ? (
                    <img
                      src={certImage}
                      alt={cert.name}
                      className="w-full h-auto max-h-[260px] object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 text-slate-500">
                      <Award className="w-8 h-8 text-slate-600" />
                      <span className="text-[11px]">No file attached</span>
                    </div>
                  )}

                  {/* Top Overlay Badges */}
                  <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-black/70 backdrop-blur-md text-sky-300 border border-white/[0.1]">
                      {cert.category || 'General'}
                    </span>
                    {cert.is_visible ? (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                        Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800/80 text-slate-400 border border-white/[0.1]">
                        Draft
                      </span>
                    )}
                  </div>

                  {/* Quick Preview Hover Button */}
                  {certImage && (
                    <button
                      onClick={() => setPreviewCert(cert)}
                      className="absolute inset-0 bg-black/50 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-xs text-white font-medium cursor-pointer"
                    >
                      <Eye className="w-4 h-4 text-sky-400" />
                      <span>Inspect Certificate</span>
                    </button>
                  )}
                </div>

                {/* Content Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1 mb-1 group-hover:text-sky-300 transition-colors">
                      {cert.name}
                    </h3>
                    <p className="text-xs font-semibold text-sky-400 mb-2">{cert.issuer}</p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mb-3">
                      {cert.issue_date && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {cert.issue_date}
                        </span>
                      )}
                      {cert.credential_id && (
                        <span className="truncate max-w-[140px]">
                          ID: {cert.credential_id}
                        </span>
                      )}
                    </div>

                    {/* Skill Tags */}
                    {cert.skills && cert.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {cert.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-[10px] text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                        {cert.skills.length > 3 && (
                          <span className="text-[10px] text-slate-500 self-center">
                            +{cert.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between gap-2">
                    {cert.credential_url ? (
                      <a
                        href={cert.credential_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-300 hover:text-sky-400 flex items-center gap-1 transition-colors"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Verify Link</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-500">Unlinked</span>
                    )}

                    <div className="flex items-center gap-1">
                      <Link
                        to={`/admin/certifications/${cert.id}/edit`}
                        className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Edit Certificate"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setCertToDelete(cert)}
                        className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Delete Certificate"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Certificate Full Lightbox / Inspection Modal */}
      {previewCert && (
        <Modal
          isOpen={Boolean(previewCert)}
          onClose={() => setPreviewCert(null)}
          title={previewCert.name}
          maxWidth="4xl"
        >
          <div className="space-y-4">
            <div className="rounded-xl overflow-hidden bg-slate-950/90 border border-white/[0.1] max-h-[78vh] flex items-center justify-center p-3">
              {previewCert.certificate_url || previewCert.image_url ? (
                <img
                  src={previewCert.certificate_url || previewCert.image_url || ''}
                  alt={previewCert.name}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <p className="text-xs text-slate-400 p-8">No preview document attached.</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-white/[0.08]">
              <div>
                <p className="text-xs text-slate-400">
                  Issued by <span className="text-white font-semibold">{previewCert.issuer}</span> ({previewCert.issue_date || 'N/A'})
                </p>
                {previewCert.credential_id && (
                  <p className="text-[11px] font-mono text-slate-500">ID: {previewCert.credential_id}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                {previewCert.credential_url && (
                  <a
                    href={previewCert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" size="sm" rightIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                      Verify External Link
                    </Button>
                  </a>
                )}
                <Link to={`/admin/certifications/${previewCert.id}/edit`}>
                  <Button variant="outline" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(certToDelete)}
        onClose={() => setCertToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certificate"
        message={`Are you sure you want to delete "${certToDelete?.name}"? This action cannot be undone.`}
      />
    </div>
  );
};
