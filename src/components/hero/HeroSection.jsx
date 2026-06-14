import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const HERO_IMAGES = [
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/33c65cca9_generated_3502c429.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/167e9ec06_generated_2f7ae898.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/5c56106b2_using-the-uploaded-reference-photo-as-th_t6MpsRX7U2aZRA2qFnpa0w_qDShSyEQS5-zF4377pMTMA.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/a40a90b8b_generated_9cf64ba0.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/b60fedd62_generated_0fdf31af.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/4e16d846f_Screenshot2026-06-14040915.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/73fb3db26_generated_3a892d5d.png',
];

const BUTTONS = [
  { label: 'Listen', href: '#media' },
  { label: 'Albums', href: '#albums' },
  { label: 'Scores', href: '#scores' },
  { label: 'Contact', href: '#contact' },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollTo = (href) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <img
            src={HERO_IMAGES[current]}
            alt="Atmospheric concert scene"
            className={`w-full h-full ${[2, 5].includes(current) ? 'object-contain object-center' : 'object-cover'}`}
          />
        </motion.div>
      </AnimatePresence>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/70 via-[#050505]/50 to-[#050505]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#050505]/60 via-transparent to-[#050505]/60" />

      {/* Smoke effects */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-smoke" />
        <div className="absolute bottom-20 right-1/3 w-64 h-64 bg-primary/3 rounded-full blur-[80px] animate-smoke" style={{ animationDelay: '3s' }} />
      </div>

      {/* Vertical gold lines */}
      <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />
      <div className="absolute right-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.3 }}
        >
          <h1 className="font-display font-light tracking-[0.3em] md:tracking-[0.5em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none mb-2">
            <span className="gold-text">SHVARTS</span>
          </h1>
          <h1 className="font-display font-bold tracking-[0.2em] md:tracking-[0.4em] text-5xl sm:text-7xl md:text-8xl lg:text-9xl leading-none text-foreground/90">
            BLACK
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 md:mt-8"
        >
          <p className="font-body text-sm md:text-base tracking-[0.3em] uppercase text-foreground/50 font-light">
            Composer · Poet · Author · Musical Visionary
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.8 }}
          className="grid grid-cols-2 md:flex justify-center gap-3 md:gap-4 mt-10 md:mt-14 w-full max-w-xs md:max-w-none mx-auto"
        >
          {BUTTONS.map((btn) => (
            <button
              key={btn.label}
              onClick={() => scrollTo(btn.href)}
              className="px-6 md:px-8 py-3 border border-primary/40 text-primary text-xs md:text-sm tracking-[0.2em] uppercase font-body hover:bg-primary/10 hover:border-primary/70 transition-all duration-500"
            >
              {btn.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase text-foreground/30 font-body">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown size={16} className="text-primary/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}