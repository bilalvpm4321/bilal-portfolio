import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Home, AlertCircle } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-[#08080a] text-[#1b281c] dark:text-zinc-100 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-[#738666]/12 dark:bg-white/10 text-[#738666] dark:text-white border border-[#738666]/25 dark:border-white/10 flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h1 className="text-6xl font-black text-[#1b281c] dark:text-white font-editorial mb-3">404</h1>
        <h2 className="text-xl font-bold text-[#1b281c] dark:text-white mb-3">Page Not Found</h2>
        <p className="text-sm text-[#4a5d46] dark:text-zinc-400 mb-8 leading-relaxed">
          The page you are looking for does not exist or has been moved.
        </p>
        <Link to="/">
          <Button variant="primary" leftIcon={<Home className="w-4 h-4" />}>
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
};
