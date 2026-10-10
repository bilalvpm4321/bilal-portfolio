import React, { useState, useEffect } from 'react';
import { Award, RefreshCw } from 'lucide-react';
import { getOptimizedImageUrl } from '../../lib/imageOptimization';

interface CertificateImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  targetWidth?: number;
  quality?: number;
}

export const CertificateImage: React.FC<CertificateImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  targetWidth = 640,
  quality = 75,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [retryWithOriginal, setRetryWithOriginal] = useState(false);

  // Derive optimized URL vs fallback raw URL
  const optimizedUrl = React.useMemo(() => {
    if (!src) return '';
    if (retryWithOriginal) return src;
    return getOptimizedImageUrl(src, { width: targetWidth, quality, resize: 'contain' });
  }, [src, retryWithOriginal, targetWidth, quality]);

  // Reset state on src change
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    setRetryWithOriginal(false);
  }, [src]);

  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center p-6 text-center text-[#738666] dark:text-zinc-400 ${containerClassName}`}>
        <Award className="w-10 h-10 stroke-1 mb-2 opacity-70" />
        <span className="text-xs font-semibold text-[#32452e] dark:text-zinc-300">Verified Credential</span>
      </div>
    );
  }

  const handleError = () => {
    // If the optimized CDN URL failed, attempt once with original raw URL
    if (!retryWithOriginal && optimizedUrl !== src) {
      setRetryWithOriginal(true);
      return;
    }
    setHasError(true);
  };

  return (
    <div className={`relative overflow-hidden flex items-center justify-center ${containerClassName}`}>
      {/* Animated Shimmer Skeleton while loading */}
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/[0.04] via-black/[0.08] to-black/[0.04] dark:from-white/[0.03] dark:via-white/[0.08] dark:to-white/[0.03] animate-pulse rounded-xl flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 opacity-40">
            <Award className="w-8 h-8 text-[#738666] dark:text-zinc-400 animate-bounce" />
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#556950] dark:text-zinc-400">Loading Credential</span>
          </div>
        </div>
      )}

      {/* Fallback if both fail */}
      {hasError ? (
        <div className="flex flex-col items-center justify-center p-6 text-center text-[#738666] dark:text-zinc-400">
          <Award className="w-10 h-10 stroke-1 mb-2 opacity-60 text-amber-500" />
          <span className="text-xs font-semibold text-[#32452e] dark:text-zinc-300">{alt}</span>
          <span className="text-[10px] text-zinc-500 mt-0.5">Verified Document</span>
        </div>
      ) : (
        <img
          src={optimizedUrl}
          alt={alt}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setIsLoaded(true)}
          onError={handleError}
          className={`transition-opacity duration-300 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
        />
      )}
    </div>
  );
};
