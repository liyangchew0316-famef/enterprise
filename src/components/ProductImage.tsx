import React, { useState, useEffect } from 'react';
import { imageConfig, resolveAssetUrl, FALLBACK_IMAGE_DATA_URI } from '../config/assets';

interface ProductImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  productId?: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
  fallbackKey?: keyof typeof imageConfig.products | 'header' | 'footer' | 'fallback';
}

export const ProductImage: React.FC<ProductImageProps> = ({
  src,
  productId,
  alt,
  className = '',
  fallbackSrc,
  fallbackKey,
  ...props
}) => {
  const resolvedSrc = resolveAssetUrl(src, { productId, fallbackKey });
  const [currentSrc, setCurrentSrc] = useState<string>(resolvedSrc);
  const [hasError, setHasError] = useState<boolean>(false);

  // Synchronize state when src or productId props change
  useEffect(() => {
    const nextSrc = resolveAssetUrl(src, { productId, fallbackKey });
    setCurrentSrc(nextSrc);
    setHasError(false);
  }, [src, productId, fallbackKey]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      const fallback = 
        fallbackSrc || 
        resolveAssetUrl(undefined, { productId, fallbackKey }) || 
        imageConfig.logos.fallback || 
        FALLBACK_IMAGE_DATA_URI;
      
      if (currentSrc !== fallback) {
        setCurrentSrc(fallback);
      }
    }
  };

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      {...props}
    />
  );
};
