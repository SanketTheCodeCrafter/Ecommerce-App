import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ 
  src, 
  alt, 
  className, 
  priority = false,
  onLoad,
  ...props 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(priority);
  const imgRef = useRef(null);

  useEffect(() => {
    if (priority) {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
        threshold: 0.01,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
      observer.disconnect();
    };
  }, [priority]);

  const handleLoad = () => {
    setImageLoaded(true);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div ref={imgRef} className="relative" {...props}>
      {/* Skeleton placeholder */}
      {!imageLoaded && (
        <div className={`absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse ${className}`} />
      )}
      
      {/* Actual image */}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-300 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          } ${imageError ? 'hidden' : ''}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Error fallback */}
      {imageError && (
        <div className={`absolute inset-0 flex items-center justify-center bg-gray-100 ${className}`}>
          <span className="text-xs text-gray-400">Image not available</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyImage);

