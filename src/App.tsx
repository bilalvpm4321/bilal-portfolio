import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { PortfolioProvider } from './context/PortfolioContext';
import { ToastProvider } from './components/common/Toast';

// Public Pages
import { HomePage } from './pages/HomePage';
import { ProjectDetailsPage } from './pages/ProjectDetailsPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { NotFoundPage } from './pages/NotFoundPage';

// Admin CMS Pages
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProfilePage } from './pages/admin/AdminProfilePage';
import { AdminProjectsPage } from './pages/admin/AdminProjectsPage';
import { AdminProjectEditPage } from './pages/admin/AdminProjectEditPage';
import { AdminSkillsPage } from './pages/admin/AdminSkillsPage';
import { AdminExperiencePage } from './pages/admin/AdminExperiencePage';
import { AdminEducationPage } from './pages/admin/AdminEducationPage';
import { AdminAchievementsPage } from './pages/admin/AdminAchievementsPage';
import { AdminLeadershipPage } from './pages/admin/AdminLeadershipPage';
import { AdminCertificationsPage } from './pages/admin/AdminCertificationsPage';
import { AdminCertificateUploadPage } from './pages/admin/AdminCertificateUploadPage';
import { AdminSocialLinksPage } from './pages/admin/AdminSocialLinksPage';
import { AdminMediaPage } from './pages/admin/AdminMediaPage';
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PortfolioProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                {/* Public Portfolio Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
                <Route path="/certificates" element={<CertificatesPage />} />

                {/* Direct Admin CMS Dashboard Routes (accessible via /admin URL) */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="profile" element={<AdminProfilePage />} />
                  <Route path="projects" element={<AdminProjectsPage />} />
                  <Route path="projects/new" element={<AdminProjectEditPage />} />
                  <Route path="projects/:id/edit" element={<AdminProjectEditPage />} />
                  <Route path="skills" element={<AdminSkillsPage />} />
                  <Route path="experience" element={<AdminExperiencePage />} />
                  <Route path="education" element={<AdminEducationPage />} />
                  <Route path="achievements" element={<AdminAchievementsPage />} />
                  <Route path="leadership" element={<AdminLeadershipPage />} />
                  <Route path="certifications" element={<AdminCertificationsPage />} />
                  <Route path="certifications/new" element={<AdminCertificateUploadPage />} />
                  <Route path="certifications/:id/edit" element={<AdminCertificateUploadPage />} />
                  <Route path="certificates" element={<Navigate to="/admin/certifications" replace />} />
                  <Route path="certificates/new" element={<Navigate to="/admin/certifications/new" replace />} />
                  <Route path="social-links" element={<AdminSocialLinksPage />} />
                  <Route path="media" element={<AdminMediaPage />} />
                  <Route path="messages" element={<AdminMessagesPage />} />
                  <Route path="settings" element={<AdminSettingsPage />} />
                </Route>

                {/* 404 Catch-All */}
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </PortfolioProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
