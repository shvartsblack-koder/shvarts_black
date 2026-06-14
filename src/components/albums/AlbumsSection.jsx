import React, { useRef, useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';
import AlbumCard from './AlbumCard';
import { ALBUMS } from '../../lib/albumsData';

export default function AlbumsSection() {
  const scrollRef = useRef(null);
  const [showArrow, setShowArrow] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const check = () => {
      const isMobile = window.innerWidth < 768;
      setShowArrow(isMobile && el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
    };

    check();
    el.addEventListener('scroll', check);
    window.addEventListener('resize', check);
    return () => {
      el.removeEventListener('scroll', check);
      window.removeEventListener('resize', check);
    };
  }, []);

  return (
    <section id="albums" className="relative py-24 md:py-36 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#0a0808] to-[#050505]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="px-6">
          <SectionReveal>
            <div className="text-center mb-16 md:mb-20">
              <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">Discography</p>
              <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide gold-text">
                Albums
              </h2>
              <GoldenRule className="mt-6" />
              <p className="mt-6 text-sm text-foreground/35 font-body tracking-wider max-w-2xl mx-auto leading-relaxed">
                Symphonic Music · Contemporary Classical · Cinematic Music · Jazz · World Music · Klezmer · Middle Eastern Music · Poetic Songwriting · Experimental Orchestral Music
              </p>
            </div>
          </SectionReveal>
        </div>

        {/* Scrollable row on mobile, grid on desktop */}
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 overflow-x-auto md:overflow-visible pb-6 md:pb-0 snap-x snap-mandatory md:snap-none px-6 scroll-px-6"
          >
            {ALBUMS.map((album, i) => (
              <AlbumCard key={album.id} album={album} index={i} />
            ))}
          </div>

          {/* Scroll hint arrow — mobile only */}
          {showArrow && (
            <div className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
              <div className="w-16 h-full absolute right-0 bg-gradient-to-l from-[#050505]/80 to-transparent" />
              <div className="relative z-10 mr-2 flex flex-col items-center gap-1 animate-bounce">
                <ChevronRight size={28} className="text-primary drop-shadow-lg" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}