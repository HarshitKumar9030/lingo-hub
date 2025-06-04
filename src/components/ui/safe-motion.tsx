'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface SafeMotionProps {
  children: React.ReactNode;
  className?: string;
  initial?: any;
  animate?: any;
  transition?: any;
  whileHover?: any;
  whileTap?: any;
  exit?: any;
  style?: React.CSSProperties;
}

export function SafeMotionDiv({ children, className, initial, animate, transition, whileHover, whileTap, exit, style }: SafeMotionProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  return (
    <motion.div
      className={className}
      style={style}
      initial={initial}
      animate={animate}
      transition={transition}
      whileHover={whileHover}
      whileTap={whileTap}
      exit={exit}
    >
      {children}
    </motion.div>
  );
}
