/**
 * Utility functions for optimizing, resizing, and preloading images.
 */

interface OptimizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  resize?: 'contain' | 'cover' | 'fill';
}

/**
 * Transforms Supabase Storage URLs into dynamic CDN-resized & compressed images.
 * Supabase Storage Pro/CDN transforms `/storage/v1/object/public/...` into `/storage/v1/render/image/public/...`.
 */
export function getOptimizedImageUrl(
  url?: string | null,
  options: OptimizeOptions = {}
): string {
  if (!url) return '';

  const { width = 640, quality = 75, resize = 'contain' } = options;

  // Supabase Storage Transformation
  if (url.includes('/storage/v1/object/public/')) {
    // Avoid re-transforming if already transformed
    const cleanUrl = url.split('?')[0];
    const transformed = cleanUrl.replace(
      '/storage/v1/object/public/',
      '/storage/v1/render/image/public/'
    );
    const params = new URLSearchParams();
    if (width) params.set('width', width.toString());
    if (options.height) params.set('height', options.height.toString());
    if (quality) params.set('quality', quality.toString());
    if (resize) params.set('resize', resize);

    return `${transformed}?${params.toString()}`;
  }

  // Unsplash images optimization
  if (url.includes('images.unsplash.com')) {
    try {
      const parsed = new URL(url);
      if (width) parsed.searchParams.set('w', width.toString());
      if (quality) parsed.searchParams.set('q', quality.toString());
      parsed.searchParams.set('auto', 'format');
      return parsed.toString();
    } catch {
      return url;
    }
  }

  return url;
}

/**
 * Preload high-priority images into browser memory cache.
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    if (!src) return resolve();
    const img = new Image();
    img.src = src;
    img.onload = () => resolve();
    img.onerror = () => resolve();
  });
}

/**
 * Preload multiple images sequentially or in parallel batches.
 */
export function preloadImages(srcs: string[]): void {
  const valid = srcs.filter(Boolean);
  valid.forEach((src) => {
    preloadImage(src);
  });
}

/**
 * Client-side browser image compression before uploading.
 * Shrinks huge 5MB - 15MB camera scans into sharp, fast < 350KB files.
 */
export async function compressImageFile(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
  } = {}
): Promise<File> {
  const { maxWidth = 1600, maxHeight = 1600, quality = 0.82 } = options;

  // Only compress raster images; pass SVGs or GIFs through directly
  if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;

      img.onload = () => {
        let { width, height } = img;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            maxHeight && (height = maxHeight);
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(file); // Fallback to raw file if canvas fails
          return;
        }

        // Draw with high quality interpolation
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP or JPEG
        const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
        canvas.toBlob(
          (blob) => {
            if (!blob || blob.size >= file.size) {
              // If compression didn't help (or file already tiny), keep original
              resolve(file);
              return;
            }

            const compressedFile = new File([blob], file.name, {
              type: outputType,
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          },
          outputType,
          quality
        );
      };

      img.onerror = () => resolve(file);
    };

    reader.onerror = () => resolve(file);
  });
}
