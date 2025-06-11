'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedTextProps {
  text: string;
  animation?: 'typewriter' | 'fadeIn' | 'slideUp';
  delay?: number;
  speed?: number;
  className?: string;
  onComplete?: () => void;
}

export default function AnimatedText({
  text,
  animation = 'fadeIn',
  delay = 0,
  speed = 50,
  className = '',
  onComplete
}: AnimatedTextProps) {
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (animation === 'typewriter') {
      let currentIndex = 0;
      const timer = setTimeout(() => {
        const interval = setInterval(() => {
          if (currentIndex <= text.length) {
            setDisplayText(text.slice(0, currentIndex));
            currentIndex++;
          } else {
            clearInterval(interval);
            setIsComplete(true);
            onComplete?.();
          }
        }, speed);

        return () => clearInterval(interval);
      }, delay);

      return () => clearTimeout(timer);
    } else {
      setDisplayText(text);
      setTimeout(() => {
        setIsComplete(true);
        onComplete?.();
      }, delay);
    }
  }, [text, animation, delay, speed, onComplete]);

  if (animation === 'typewriter') {
    return (
      <span className={`${className} ${isComplete ? '' : 'animate-typewriter'}`}>
        {displayText}
      </span>
    );
  }

  if (animation === 'slideUp') {
    return (
      <motion.span
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: delay / 1000,
          ease: [0.4, 0, 0.2, 1]
        }}
        className={className}
      >
        {displayText}
      </motion.span>
    );
  }

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: delay / 1000,
        ease: [0, 0, 0.2, 1]
      }}
      className={className}
    >
      {displayText}
    </motion.span>
  );
}
