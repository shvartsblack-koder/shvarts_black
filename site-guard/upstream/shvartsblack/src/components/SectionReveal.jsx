import React from 'react';
import { motion } from 'framer-motion';
import useInView from './useInView';

export default function SectionReveal({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useInView(0.1);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, filter: 'blur(8px)' }}
      animate={isVisible ? { opacity: 1, y: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}