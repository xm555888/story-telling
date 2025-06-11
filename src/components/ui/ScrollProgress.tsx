'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollProgressProps {
  className?: string;
}

export default function ScrollProgress({ className = '' }: ScrollProgressProps) {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollTop / docHeight;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return (
    <div className={`fixed top-0 left-0 w-full h-1 bg-gray-800 z-50 ${className}`}>
      <motion.div
        className="h-full bg-white"
        style={{ scaleX: scrollProgress }}
        initial={{ scaleX: 0 }}
        transition={{ duration: 0.1 }}
        transformOrigin="left"
      />
    </div>
  );
}
