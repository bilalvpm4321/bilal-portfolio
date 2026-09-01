import React, { useState } from 'react';
import { usePortfolio } from '../../context/PortfolioContext';
import { useToast } from '../../components/common/Toast';
import { Certification } from '../../types/database';
import { Card } from '../../components/common/Card';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Plus, Edit2, Trash2, Award, Calendar, ExternalLink } from 'lucide-react';

export const AdminCertificationsPage: React.FC = () => {
  const { data, createCertification, updateCertification, deleteCertification } = usePortfolio();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    credential_url: '',
    display_order: 1,
    is_visible: true,
  });

  const handleOpenAdd = () => {
    setEditingCert(null);
    setFormData({
      name: '',
      issuer: '',
      issue_date: '',
      credential_id: '',
      credential_url: '',
      display_order: data.certifications.length + 1,
      is_visible: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cert: Certification) => {
    setEditingCert(cert);
    setFormData({
      name: cert.name,
      issuer: cert.issuer,
      issue_date: cert.issue_date || '',
      credential_id: cert.credential_id || '',
      credential_url: cert.credential_url || '',
      display_order: cert.display_order,
      is_visible: cert.is_visible,
    });
    setIsModalOpen(true);
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.issuer) {
      error('Please complete required fields (Name, Issuer).');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingCert) {
        const res = await updateCertification(editingCert.id, formData);
        if (res.success) {
          success('Certification updated');
          setIsModalOpen(false);
        } else {
          error('Failed to update certification');
        }
      } else {
        const res = await createCertification(formData);
        if (res.success) {
          success('Certification added');
          setIsModalOpen(false);
        } else {
          error('Failed to add certification');
        }
      }
    } catch (err: any) {
      error('Error saving certification', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!certToDelete) return;
    try {
      const res = await deleteCertification(certToDelete.id);
      if (res.success) {
        success('Certification deleted');
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white">Certifications & Licenses</h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Add cloud certifications, AI/ML accreditations, and technical certificates.
          </p>
        </div>

        <Button variant="primary" size="md" onClick={handleOpenAdd} leftIcon={<Plus className="w-4 h-4" />}>
          Add Certification
        </Button>
      </div>

      {data.certifications.length === 0 ? (
        <Card className="p-8 text-center bg-[#0d0f17]/95 border-white/[0.08]">
          <Award className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-white">No Certifications Added Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Click "Add Certification" to attach course completions, cloud accreditations, or badges.
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.certifications.map((cert) => (
            <Card key={cert.id} className="p-5 bg-[#0d0f17]/95 border-white/[0.08] flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Award className="w-5 h-5" />
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="p-1.5 text-sky-400 hover:bg-sky-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setCertToDelete(cert)}
                      className="p-1.5 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-white mb-0.5">{cert.name}</h3>
                <p className="text-xs text-sky-400 font-semibold mb-2">{cert.issuer}</p>
                {cert.issue_date && (
                  <p className="text-xs font-mono text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    {cert.issue_date}
                  </p>
                )}
              </div>

              {cert.credential_url && (
                <a
                  href={cert.credential_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 pt-3 border-t border-white/[0.04] text-xs text-slate-300 hover:text-white flex items-center gap-1"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3 h-3 text-sky-400" />
                </a>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCert ? 'Edit Certification' : 'Add Certification'}
      >
        <form onSubmit={handleSaveCert} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Certification Name <span className="text-sky-400">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. AWS Certified Developer / Google Cloud Associate"
              required
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Issuing Organization <span className="text-sky-400">*</span>
              </label>
              <input
                type="text"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services, DeepLearning.AI"
                required
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Issue Date
              </label>
              <input
                type="text"
                value={formData.issue_date}
                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                placeholder="e.g. 2024"
                className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Credential / Verification URL
            </label>
            <input
              type="url"
              value={formData.credential_url}
              onChange={(e) => setFormData({ ...formData, credential_url: e.target.value })}
              placeholder="https://credly.com/..."
              className="w-full px-4 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-white text-sm focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t border-white/[0.08]">
            <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={isSubmitting}>
              Save Certification
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={Boolean(certToDelete)}
        onClose={() => setCertToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Certification"
        message={`Delete "${certToDelete?.name}"?`}
      />
    </div>
  );
};
