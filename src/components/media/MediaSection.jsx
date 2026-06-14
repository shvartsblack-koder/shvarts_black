import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';

const PLATFORMS = [
  { name: 'YouTube', color: 'hover:text-red-500', url: '#' },
  { name: 'Spotify', color: 'hover:text-green-500', url: '#' },
  { name: 'Apple Music', color: 'hover:text-pink-400', url: '#' },
  { name: 'SoundCloud', color: 'hover:text-orange-400', url: '#' },
];

const GALLERY_IMAGES = [
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/33c65cca9_generated_3502c429.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/73fb3db26_generated_3a892d5d.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/167e9ec06_generated_2f7ae898.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/b60fedd62_generated_0fdf31af.png',
];

export default function MediaSection() {
  return (
    <section id="media" className="relative py-24 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">Listen & Watch</p>
            <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide gold-text">
              Media
            </h2>
            <GoldenRule className="mt-6" />
          </div>
        </SectionReveal>

        {/* Video embed placeholder */}
        <SectionReveal delay={0.1}>
          <div className="relative aspect-video max-w-4xl mx-auto mb-16 border border-primary/10 bg-[#0a0a0a] overflow-hidden group">
            <img
              src="https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/167e9ec06_generated_2f7ae898.png"
              alt="Concert hall performance"
              className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-20 h-20 rounded-full border-2 border-primary/50 bg-[#050505]/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:border-primary transition-all duration-500">
                <Play size={32} className="text-primary ml-1" fill="currentColor" />
              </button>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
              <div>
                <p className="font-display text-lg text-foreground/80">Featured Performance</p>
                <p className="text-xs text-foreground/40 font-body tracking-wider">Dreams of Belshazzar — Live</p>
              </div>
            </div>
          </div>
        </SectionReveal>

        {/* Streaming platforms */}
        <SectionReveal delay={0.2}>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-16">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-6 py-3 border border-primary/15 text-foreground/50 text-sm tracking-[0.15em] uppercase font-body ${p.color} hover:border-primary/30 transition-all duration-400`}
              >
                <ExternalLink size={14} />
                {p.name}
              </a>
            ))}
          </div>
        </SectionReveal>

        {/* Photo gallery */}
        <SectionReveal delay={0.3}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {GALLERY_IMAGES.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden group">
                <img
                  src={img}
                  alt={`Gallery image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-[#050505]/20 group-hover:bg-[#050505]/0 transition-all duration-500" />
              </div>
            ))}
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}