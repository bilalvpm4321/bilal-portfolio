import React from 'react';

interface TechIconProps {
  className?: string;
}

export const HtmlIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M5 3l2.4 23.5L16 29l8.6-2.5L27 3H5z" fill="#E44D26" />
    <path d="M16 26.8l6.8-2 2-19.8H16v21.8z" fill="#F16529" />
    <path d="M16 12.6h-4.3l-.3-3.6H16V5.4H7.8l.9 10.7H16v-3.5zm0 8.3l-3.9-1-.3-3.2H8.3l.5 5.8 7.2 2v-3.6z" fill="#EBEBEB" />
    <path d="M16 12.6h4.3l-.4 4.5-3.9 1v3.6l7.2-2 .9-10.7H16v3.6zm0-7.2v3.6h7.9l.3-3.6H16z" fill="#FFFFFF" />
  </svg>
);

export const CssIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M5 3l2.4 23.5L16 29l8.6-2.5L27 3H5z" fill="#1572B6" />
    <path d="M16 26.8l6.8-2 2-19.8H16v21.8z" fill="#33A9DC" />
    <path d="M16 12.6h-4.3l-.3-3.6H16V5.4H7.8l.9 10.7H16v-3.5zm0 8.3l-3.9-1-.3-3.2H8.3l.5 5.8 7.2 2v-3.6z" fill="#EBEBEB" />
    <path d="M16 12.6h4.3l-.4 4.5-3.9 1v3.6l7.2-2 .9-10.7H16v3.6zm0-7.2v3.6h7.9l.3-3.6H16z" fill="#FFFFFF" />
  </svg>
);

export const JsIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="#F7DF1E" />
    <path d="M18.8 21.6c.5.9 1.3 1.5 2.5 1.5 1.1 0 1.8-.6 1.8-1.4 0-1-.8-1.4-2.1-2l-.7-.3c-2.1-.9-3.5-2-3.5-4.4 0-2.2 1.7-3.9 4.3-3.9 1.9 0 3.2.7 4.1 2.3l-2.1 1.4c-.5-.8-1-1.2-2-1.2-.9 0-1.5.6-1.5 1.3 0 .9.6 1.3 1.9 1.9l.7.3c2.4 1 3.8 2.1 3.8 4.6 0 2.6-2 4.1-4.7 4.1-2.6 0-4.3-1.2-5.1-2.9l2.2-1.4zm-9.3.4c.4.7.8 1.3 1.6 1.3.8 0 1.4-.4 1.4-1.8v-10h2.8v10.1c0 3-1.7 4.3-4.1 4.3-2.2 0-3.5-1.1-4.2-2.6l2.5-1.3z" fill="#000000" />
  </svg>
);

export const TsIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="#3178C6" />
    <path d="M19.2 14.5v11.3h-2.9V14.5H12V12h11.5v2.5h-4.3zm6.3 7.1c.5.8 1.3 1.3 2.3 1.3 1 0 1.6-.5 1.6-1.2 0-.8-.7-1.2-1.9-1.7l-.6-.3c-1.9-.8-3.1-1.7-3.1-3.8 0-1.9 1.5-3.4 3.8-3.4 1.7 0 2.9.6 3.7 2l-1.9 1.2c-.4-.7-.9-1-1.8-1-.8 0-1.3.5-1.3 1.1 0 .7.5 1.1 1.7 1.6l.6.3c2.1.9 3.4 1.8 3.4 4 0 2.3-1.8 3.6-4.2 3.6-2.3 0-3.8-1-4.5-2.5l2.2-1.2z" fill="#FFFFFF" />
  </svg>
);

export const ReactIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="3" fill="#61DAFB" />
    <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.8" />
    <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(60 16 16)" />
    <ellipse cx="16" cy="16" rx="13" ry="5" stroke="#61DAFB" strokeWidth="1.8" transform="rotate(120 16 16)" />
  </svg>
);

export const NextJsIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="15" fill="#000000" stroke="#333333" strokeWidth="1.5" />
    <path d="M21.5 22.5L12 10.5h-2v11h2v-8.2l8.8 11.2h.7v-2zM20 10.5h2v6.5h-2v-6.5z" fill="#FFFFFF" />
  </svg>
);

export const TailwindIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16 9c-3.6 0-5.8 1.8-6.7 5.4 1.3-1.8 3-2.5 4.9-2 1.2.3 2 1.2 2.9 2.1 1.5 1.5 3.3 3.3 6.9 3.3 3.6 0 5.8-1.8 6.7-5.4-1.3 1.8-3 2.5-4.9 2-1.2-.3-2-1.2-2.9-2.1-1.5-1.5-3.3-3.3-6.9-3.3zm-8 7.5c-3.6 0-5.8 1.8-6.7 5.4 1.3-1.8 3-2.5 4.9-2 1.2.3 2 1.2 2.9 2.1 1.5 1.5 3.3 3.3 6.9 3.3 3.6 0 5.8-1.8 6.7-5.4-1.3 1.8-3 2.5-4.9 2-1.2-.3-2-1.2-2.9-2.1-1.5-1.5-3.3-3.3-6.9-3.3z" fill="#38BDF8" />
  </svg>
);

export const ViteIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M28.4 4.5L16.7 26.2c-.3.6-1.1.6-1.4 0L3.6 4.5c-.4-.7.1-1.5.9-1.5h23c.8 0 1.3.8.9 1.5z" fill="url(#viteGrad)" />
    <path d="M19.5 2.5l-8.7 17.5 5.5-1.5-4 8 11.5-15.5-5.5 1.5 4-10-2.8 0z" fill="#FFD62E" />
    <defs>
      <linearGradient id="viteGrad" x1="4" y1="3" x2="28" y2="27" gradientUnits="userSpaceOnUse">
        <stop stopColor="#41D1FF" />
        <stop offset="1" stopColor="#BD34FE" />
      </linearGradient>
    </defs>
  </svg>
);

export const PythonIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M15.8 3C9.5 3 9.9 5.7 9.9 5.7L10 8.5h6v.8H7.3S3 8.8 3 15.1c0 6.2 3.8 6 3.8 6l2.3-.1v-3.4s-.1-3.8 3.8-3.8h6.2s3.6.1 3.6-3.5V6.7S23 3 15.8 3zm-3.3 2.4c.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2z" fill="#387EB8" />
    <path d="M16.2 29c6.3 0 5.9-2.7 5.9-2.7L22 23.5h-6v-.8h8.7s4.3.5 4.3-5.8c0-6.2-3.8-6-3.8-6l-2.3.1v3.4s.1 3.8-3.8 3.8H13s-3.6-.1-3.6 3.5v3.6S9 29 16.2 29zm3.3-2.4c-.7 0-1.2-.5-1.2-1.2 0-.7.5-1.2 1.2-1.2.7 0 1.2.5 1.2 1.2 0 .7-.5 1.2-1.2 1.2z" fill="#FFE052" />
  </svg>
);

export const NodeIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16 2.5L4 9.4v13.8L16 30.1l12-6.9V9.4L16 2.5z" fill="#539E43" />
    <path d="M16 4.7l10 5.8v11.6L16 27.9 6 22.1V10.5L16 4.7z" fill="#333333" />
    <path d="M16 11l5 3v5l-5 3-5-3v-5l5-3z" fill="#539E43" />
  </svg>
);

export const FastApiIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#009688" />
    <path d="M17.5 6L9 18h6l-1.5 8 8.5-12h-6l1.5-8z" fill="#FFFFFF" />
  </svg>
);

export const FirebaseIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M5.5 24.3L8 8.6c.1-.8 1.1-1.1 1.6-.5l3.8 5-7.9 11.2z" fill="#FFC24A" />
    <path d="M16.3 4.4c-.5-.7-1.6-.6-1.9.3L11.5 12l4.8-7.6z" fill="#FFA000" />
    <path d="M5.5 24.3l10.2 5.8c.4.2.9.2 1.3 0l9.5-5.8L5.5 24.3z" fill="#FF8F00" />
    <path d="M26.5 24.3L21.8 15l-8.4-1.9 13.1 11.2z" fill="#FFCA28" />
  </svg>
);

export const SupabaseIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M17.8 2.8c-.8-1-2.4-.6-2.6.7L13 16.5h11.2c1.4 0 2.2 1.6 1.4 2.7l-9.8 13.5c-.8 1.1-2.5.6-2.6-.7l2.2-13.5H4.2c-1.4 0-2.2-1.6-1.4-2.7L12.6 2.8c.6-.7 1.6-.9 2.4-.4z" fill="url(#supaGrad)" />
    <defs>
      <linearGradient id="supaGrad" x1="3" y1="2" x2="26" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3ECF8E" />
        <stop offset="1" stopColor="#1E8657" />
      </linearGradient>
    </defs>
  </svg>
);

export const MongoIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16.2 2.5s-6.7 5.5-6.7 13.3c0 5.6 3.6 9.8 6.7 13.7 3.1-3.9 6.7-8.1 6.7-13.7C22.9 8 16.2 2.5 16.2 2.5z" fill="#47A248" />
    <path d="M16.2 29.5V2.5s.4.3.8.7c2.8 2.8 5.9 7 5.9 12.6 0 5.6-3.6 9.8-6.7 13.7z" fill="#499D4A" />
    <path d="M16.2 26.5s-1.8-2.6-1.8-5c0-2.8 1.8-4.4 1.8-4.4v9.4z" fill="#FFFFFF" opacity="0.7" />
  </svg>
);

export const PostgresIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#336791" />
    <path d="M16 7c-4.4 0-8 3.6-8 8 0 2.2.9 4.2 2.3 5.7l1.4-1.4c-1-1.1-1.7-2.6-1.7-4.3 0-3.3 2.7-6 6-6s6 2.7 6 6c0 1.7-.7 3.2-1.7 4.3l1.4 1.4C23.1 19.2 24 17.2 24 15c0-4.4-3.6-8-8-8z" fill="#FFFFFF" />
    <circle cx="13" cy="13" r="1.5" fill="#FFFFFF" />
    <circle cx="19" cy="13" r="1.5" fill="#FFFFFF" />
    <path d="M16 16v5l2-1.5" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const DockerIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M29.5 15.2c-.4-.3-1.4-.4-2.1-.1-.3-.7-.8-1.3-1.5-1.7l-.8-.5-.5.8c-.5.8-.6 1.8-.4 2.6-.9.4-2.4.4-3.5 0l-.3-.1C19.7 13 16 13.3 13 15.5l-8.5.1c-.8 0-1.5.7-1.5 1.5.3 4.2 3.8 8.9 12.2 8.9 9.5 0 13.8-5.3 14.7-9.5l.1-.6-.5-.7z" fill="#2496ED" />
    <rect x="7" y="14" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="10" y="14" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="13" y="14" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="10" y="11.5" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="13" y="11.5" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="16" y="11.5" width="2" height="2" rx=".4" fill="#2496ED" />
    <rect x="13" y="9" width="2" height="2" rx=".4" fill="#2496ED" />
    <circle cx="7" cy="18" r=".8" fill="#FFFFFF" />
  </svg>
);

export const GithubIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="15" fill="#24292E" />
    <path d="M16 6.5C10.8 6.5 6.5 10.8 6.5 16.1c0 4.2 2.8 7.8 6.6 9.1.5.1.7-.2.7-.5v-1.7c-2.7.6-3.2-1.3-3.2-1.3-.4-1.1-1.1-1.4-1.1-1.4-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.8.8.1-.6.3-1.1.6-1.3-2.1-.2-4.4-1.1-4.4-4.7 0-1 .4-1.9 1-2.6-.1-.2-.4-1.2.1-2.6 0 0 .8-.3 2.7 1 .8-.2 1.6-.3 2.4-.3.8 0 1.6.1 2.4.3 1.9-1.3 2.7-1 2.7-1 .5 1.4.2 2.4.1 2.6.6.7 1 1.6 1 2.6 0 3.7-2.3 4.5-4.4 4.7.4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 3.8-1.3 6.6-4.9 6.6-9.1 0-5.3-4.3-9.6-9.6-9.6z" fill="#FFFFFF" />
  </svg>
);

export const GcpIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M24 16.5c0-.6-.1-1.2-.2-1.8H16v3.4h4.5c-.2 1.1-.8 2-1.8 2.6v2.2h2.9c1.7-1.6 2.4-3.9 2.4-6.4z" fill="#4285F4" />
    <path d="M16 24.5c2.3 0 4.2-.8 5.6-2.1l-2.9-2.2c-.8.5-1.7.8-2.7.8-2.1 0-3.9-1.4-4.5-3.4H8.5v2.3C10 22.8 12.8 24.5 16 24.5z" fill="#34A853" />
    <path d="M11.5 17.6c-.2-.5-.2-1.1-.2-1.6s.1-1.1.2-1.6v-2.3H8.5C7.9 13.3 7.5 14.6 7.5 16s.4 2.7 1 3.9l3-2.3z" fill="#FBBC05" />
    <path d="M16 10.7c1.3 0 2.4.4 3.3 1.3l2.5-2.5C20.2 8.1 18.3 7.5 16 7.5c-3.2 0-6 1.7-7.5 4.6l3 2.3c.6-2 2.4-3.7 4.5-3.7z" fill="#EA4335" />
  </svg>
);

export const AwsIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="#232F3E" />
    <path d="M9 13.5l1.6 4.3h-3.2L9 13.5zm-2.8 6.5h5.6l1 2.5h2.4L10.2 9H7.8L3 22.5h2.2l1-2.5zm11.2-4.7c0-2-1.3-3.1-3.2-3.1-1.8 0-3.1 1.1-3.1 3.1 0 2 1.3 3.1 3.1 3.1 1.9 0 3.2-1.1 3.2-3.1zm2.3 0c0 3.3-2.3 5.1-5.5 5.1-3.1 0-5.5-1.8-5.5-5.1 0-3.3 2.4-5.1 5.5-5.1 3.2 0 5.5 1.8 5.5 5.1zm4.8 2.2l1.6-4.5 1.6 4.5h-3.2zm-2.6 5h2.2l.9-2.5h4.6l.9 2.5h2.3l-4.5-11.5h-2L23.1 22.5z" fill="#FF9900" />
    <path d="M7 26c5.5 2.5 12.5 2.5 18 0" stroke="#FF9900" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const OpenAiIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="#10A37F" />
    <path d="M24.2 13.6c-.3-1.8-1.5-3.3-3.2-3.9-.5-.2-1-.2-1.5-.2-.3-.8-.9-1.6-1.6-2.1-1.6-1.1-3.6-1.1-5.2 0-.8.5-1.4 1.3-1.7 2.2-1.8.3-3.3 1.5-3.9 3.2-.6 1.7-.3 3.6.8 5-.3 1.8.1 3.6 1.2 4.9 1.1 1.3 2.8 2 4.5 1.8.3.8.9 1.6 1.6 2.1 1.6 1.1 3.6 1.1 5.2 0 .8-.5 1.4-1.3 1.7-2.2 1.8-.3 3.3-1.5 3.9-3.2.6-1.7.3-3.6-.8-5 .3-1.8-.1-3.6-1-4.6z" stroke="#FFFFFF" strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    <path d="M16 11.5v9M12 13.5l8 4.5M20 13.5l-8 4.5" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export const PyTorchIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16.5 4l-.5.5v5.2l2.3-2.3 4.2 4.2c2.5 2.5 2.5 6.6 0 9.1-2.5 2.5-6.6 2.5-9.1 0-2.5-2.5-2.5-6.6 0-9.1l5.1-5.1V4l-6.6 6.6c-3.4 3.4-3.4 8.9 0 12.3 3.4 3.4 8.9 3.4 12.3 0 3.4-3.4 3.4-8.9 0-12.3L16.5 4z" fill="#EE4C2C" />
    <circle cx="21" cy="8" r="1.5" fill="#EE4C2C" />
  </svg>
);

export const LinuxIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16 3c-4.5 0-7 3.5-7 8 0 2 .5 5 1.5 7.5-1.5 1-2.5 3-2.5 5 0 3 3 4.5 7 4.5h2c4 0 7-1.5 7-4.5 0-2-1-4-2.5-5 1-2.5 1.5-5.5 1.5-7.5 0-4.5-2.5-8-7-8z" fill="#FCC624" />
    <path d="M16 5c-3.5 0-5.5 2.5-5.5 6.5 0 2 .5 5 1.5 7.5 1-1.5 2.5-2.5 4-2.5s3 1 4 2.5c1-2.5 1.5-5.5 1.5-7.5 0-4-2-6.5-5.5-6.5z" fill="#000000" />
    <circle cx="14" cy="9" r="1.5" fill="#FFFFFF" />
    <circle cx="18" cy="9" r="1.5" fill="#FFFFFF" />
    <circle cx="14" cy="9" r=".6" fill="#000000" />
    <circle cx="18" cy="9" r=".6" fill="#000000" />
    <path d="M14.5 12h3l-1.5 2-1.5-2z" fill="#FFA500" />
  </svg>
);

export const PostmanIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#FF6C37" />
    <path d="M22.5 13.5c-.5-2.2-2.5-3.8-4.8-3.8-2.7 0-5 2.2-5 5 0 .4.1.8.2 1.2L9.5 18l3.2 1.2 1.5 3.3 2.1-3.4c.5.2 1.1.3 1.7.3 2.8 0 5-2.2 5-5 0-.3 0-.6-.5-.9z" fill="#FFFFFF" />
  </svg>
);

export const CppIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <path d="M16 2.5l11.5 6.6v13.8L16 29.5 4.5 22.9V9.1L16 2.5z" fill="#00599C" />
    <path d="M16 8c-4.4 0-8 3.6-8 8s3.6 8 8 8c3 0 5.6-1.7 6.9-4.2l-3-1.5c-.7 1.4-2.2 2.3-3.9 2.3-2.5 0-4.5-2-4.5-4.6s2-4.6 4.5-4.6c1.7 0 3.2.9 3.9 2.3l3-1.5C21.6 9.7 19 8 16 8zm6 6h2v-2h1.5v2h2v1.5h-2v2H24v-2h-2V14zm7 0h2v-2h1.5v2h2v1.5h-2v2h-1.5v-2h-2V14z" fill="#FFFFFF" />
  </svg>
);

export const SqlIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="#00758F" />
    <path d="M16 7c-5 0-9 1.3-9 3v12c0 1.7 4 3 9 3s9-1.3 9-3V10c0-1.7-4-3-9-3zm0 2.2c3.8 0 7 .9 7 1.8s-3.2 1.8-7 1.8-7-.9-7-1.8 3.2-1.8 7-1.8zm0 5.2c3.8 0 7-.9 7-1.8v2.2c0 .9-3.2 1.8-7 1.8s-7-.9-7-1.8v-2.2c0 .9 3.2 1.8 7 1.8zm0 5c3.8 0 7-.9 7-1.8v2.2c0 .9-3.2 1.8-7 1.8s-7-.9-7-1.8V18c0 .9 3.2 1.8 7 1.8z" fill="#F29111" />
  </svg>
);

export const BrainAiIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#8B5CF6" />
    <path d="M12 10a4 4 0 0 0-4 4c0 1.5.8 2.8 2 3.5-.2.5-.3 1-.3 1.5a4 4 0 0 0 4 4c.3 0 .7 0 1-.2V10h-2.7zm8 0h-2.7v12.8c.3.2.7.2 1 .2a4 4 0 0 0 4-4c0-.5-.1-1-.3-1.5 1.2-.7 2-2 2-3.5a4 4 0 0 0-4-4z" fill="#FFFFFF" />
    <circle cx="13" cy="14" r="1" fill="#8B5CF6" />
    <circle cx="19" cy="14" r="1" fill="#8B5CF6" />
    <path d="M16 6v4m-6-1l3 3m9-3l-3 3" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const CvIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#0284C7" />
    <circle cx="16" cy="16" r="8" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="3 3" />
    <circle cx="16" cy="16" r="4" fill="#38BDF8" />
    <circle cx="16" cy="16" r="1.5" fill="#FFFFFF" />
    <path d="M8 8l3 3m13-3l-3 3m-10 10l-3 3m13-3l3 3" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const NlpIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <circle cx="16" cy="16" r="14" fill="#EC4899" />
    <path d="M8 19v-6a8 8 0 0 1 16 0v6" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    <rect x="6" y="17" width="4" height="6" rx="1.5" fill="#FFFFFF" />
    <rect x="22" y="17" width="4" height="6" rx="1.5" fill="#FFFFFF" />
    <path d="M13 15h6m-6 3h4" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export const GenAiIcon: React.FC<TechIconProps> = ({ className = 'w-10 h-10' }) => (
  <svg viewBox="0 0 32 32" className={className} fill="none">
    <rect width="32" height="32" rx="6" fill="url(#genGrad)" />
    <path d="M16 6l2.5 6.5L25 15l-6.5 2.5L16 24l-2.5-6.5L7 15l6.5-2.5L16 6z" fill="#FFFFFF" />
    <path d="M24 6l1 2.5L27.5 9.5l-2.5 1L24 13l-1-2.5-2.5-1L23 8.5 24 6z" fill="#FFD700" />
    <defs>
      <linearGradient id="genGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="0.5" stopColor="#EC4899" />
        <stop offset="1" stopColor="#F59E0B" />
      </linearGradient>
    </defs>
  </svg>
);

// Map skill name to SVG icon component
export const getTechIcon = (name: string, className = 'w-10 h-10') => {
  const n = name.toLowerCase();
  if (n.includes('html')) return <HtmlIcon className={className} />;
  if (n.includes('css')) return <CssIcon className={className} />;
  if (n.includes('typescript') || n.includes('ts')) return <TsIcon className={className} />;
  if (n.includes('javascript') || n.includes('js')) return <JsIcon className={className} />;
  if (n.includes('react')) return <ReactIcon className={className} />;
  if (n.includes('next')) return <NextJsIcon className={className} />;
  if (n.includes('tailwind')) return <TailwindIcon className={className} />;
  if (n.includes('vite') || n.includes('pwa')) return <ViteIcon className={className} />;
  if (n.includes('python')) return <PythonIcon className={className} />;
  if (n.includes('node')) return <NodeIcon className={className} />;
  if (n.includes('fastapi')) return <FastApiIcon className={className} />;
  if (n.includes('firebase')) return <FirebaseIcon className={className} />;
  if (n.includes('supabase')) return <SupabaseIcon className={className} />;
  if (n.includes('mongo')) return <MongoIcon className={className} />;
  if (n.includes('postgres')) return <PostgresIcon className={className} />;
  if (n.includes('docker')) return <DockerIcon className={className} />;
  if (n.includes('git') || n.includes('github')) return <GithubIcon className={className} />;
  if (n.includes('gcp') || n.includes('google cloud')) return <GcpIcon className={className} />;
  if (n.includes('aws') || n.includes('lambda') || n.includes('dynamodb')) return <AwsIcon className={className} />;
  if (n.includes('openai') || n.includes('gpt') || n.includes('prompt')) return <OpenAiIcon className={className} />;
  if (n.includes('pytorch') || n.includes('deep learning')) return <PyTorchIcon className={className} />;
  if (n.includes('computer vision') || n.includes('vision') || n.includes('cv')) return <CvIcon className={className} />;
  if (n.includes('nlp') || n.includes('natural language')) return <NlpIcon className={className} />;
  if (n.includes('gen') || n.includes('generative')) return <GenAiIcon className={className} />;
  if (n.includes('c++') || n.includes('c / c++') || n.includes('cpp')) return <CppIcon className={className} />;
  if (n.includes('sql')) return <SqlIcon className={className} />;
  if (n.includes('linux') || n.includes('bash')) return <LinuxIcon className={className} />;
  if (n.includes('postman')) return <PostmanIcon className={className} />;
  if (n.includes('machine learning') || n.includes('ai') || n.includes('xgboost') || n.includes('scikit')) return <BrainAiIcon className={className} />;
  
  return <BrainAiIcon className={className} />;
};
