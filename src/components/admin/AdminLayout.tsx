import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { AdminNavbar } from './AdminNavbar';

const PAGE_TITLES: Record<string, string> = {
  '/admin': 'CMS Overview & Analytics',
  '/admin/dashboard': 'CMS Overview & Analytics',
  '/admin/profile': 'Profile & Identity Management',
  '/admin/projects': 'Projects Management',
  '/admin/projects/new': 'Create New Project',
  '/admin/skills': 'Skills & Technologies',
  '/admin/experience': 'Work Experience & Roles',
  '/admin/education': 'Education & Degrees',
  '/admin/achievements': 'Achievements & Honors',
  '/admin/leadership': 'Leadership & Volunteering',
  '/admin/certifications': 'Certifications',
  '/admin/social-links': 'Social Links & Contact Channels',
  '/admin/media': 'Media & Storage Explorer',
  '/admin/messages': 'Contact Messages Inbox',
  '/admin/settings': 'Site Settings & SEO',
};

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const currentTitle = PAGE_TITLES[location.pathname] || 'Admin Dashboard';

  return (
    <div className="theme-admin min-h-screen bg-[#07080c] text-gray-100 flex">
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        isOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <AdminNavbar
          onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          title={currentTitle}
        />

        <main className="p-4 sm:p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
