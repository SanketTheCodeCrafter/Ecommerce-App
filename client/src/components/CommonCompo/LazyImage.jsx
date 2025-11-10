import React, { useState, useRef, useEffect, useCallback } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkxvYWRpbmcuLi48L3RleHQ+PC9zdmc+',
  onLoad,
  onError,
  loading = 'lazy',
  ...props 
}) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);
  const prevSrcRef = useRef(src);

  const handleImageLoad = useCallback(() => {
    setImageSrc(src);
    setIsLoaded(true);
    if (onLoad) onLoad();
  }, [src, onLoad]);

  const handleImageError = useCallback(() => {
    setHasError(true);
    if (onError) onError();
  }, [onError]);

  // Reset state when src changes
  useEffect(() => {
    if (src && prevSrcRef.current !== src) {
      setImageSrc(placeholder);
      setIsLoaded(false);
      setHasError(false);
      prevSrcRef.current = src;
    }
  }, [src, placeholder]);

  useEffect(() => {
    // If image is already loaded or has error, don't set up observer
    if (isLoaded || hasError || !src) return;

    // If loading is 'eager', load immediately
    if (loading === 'eager') {
      const img = new Image();
      img.onload = handleImageLoad;
      img.onerror = handleImageError;
      img.src = src;
      return;
    }

    // Create Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start loading the image
            const img = new Image();
            img.onload = handleImageLoad;
            img.onerror = handleImageError;
            img.src = src;
            
            // Stop observing once we start loading
            if (observerRef.current && imgRef.current) {
              observerRef.current.unobserve(imgRef.current);
            }
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current && imgRef.current) {
        observerRef.current.unobserve(imgRef.current);
      }
    };
  }, [src, isLoaded, hasError, loading, handleImageLoad, handleImageError]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={`${className} ${!isLoaded ? 'opacity-70' : 'opacity-100'} transition-opacity duration-300`}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

export default React.memo(LazyImage);

