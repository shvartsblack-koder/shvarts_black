import React from 'react';
import { Play, ExternalLink } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';
import NewsTicker from './NewsTicker';

const PLATFORMS = [
  { name: 'YouTube', color: 'hover:text-red-500', url: 'https://www.youtube.com/channel/UCG5Xv9uA4LP1JjBbFzin-wA' },
  { name: 'Spotify', color: 'hover:text-green-500', url: 'https://open.spotify.com/artist/32AY38EQm46S7I64U5dups' },
  { name: 'Apple Music', color: 'hover:text-pink-400', url: 'https://music.apple.com/us/artist/shvarts-black/6772389995' },
  { name: 'SoundCloud', color: 'hover:text-orange-400', url: 'https://soundcloud.com/shvarts-black' },
];



const GALLERY_IMAGES = [
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/33c65cca9_generated_3502c429.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/73fb3db26_generated_3a892d5d.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/167e9ec06_generated_2f7ae898.png',
  'https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/b60fedd62_generated_0fdf31af.png',
];

export default function MediaSection() {
  return (
    <section id="media" className="relative py-16 md:py-24 lg:py-32 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">Read, Listen & Watch</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide gold-text">
              Media
            </h2>
            <GoldenRule className="mt-6" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <p className="text-xs tracking-[0.2em] uppercase text-foreground/30 font-body mb-6 text-center">
            As featured in 300+ media outlets worldwide
          </p>
        </SectionReveal>
        <NewsTicker />

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
          <div className="grid grid-cols-2 md:flex md:flex-wrap justify-center gap-2 md:gap-4 mb-12">
            {PLATFORMS.map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center justify-center gap-2 px-3 py-2.5 md:px-5 md:py-3 border border-primary/15 text-foreground/50 text-[11px] md:text-sm tracking-[0.12em] md:tracking-[0.15em] uppercase font-body ${p.color} hover:border-primary/30 transition-all duration-400`}
              >
                <ExternalLink size={12} className="md:hidden" />
                <ExternalLink size={14} className="hidden md:block" />
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