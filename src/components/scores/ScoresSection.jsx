import React from 'react';
import { Music2, FileText, Mic, Piano } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';

const CATEGORIES = [
  {
    icon: Piano,
    title: 'Piano Works',
    count: '140 scores',
    desc: 'Solo piano compositions ranging from lyrical nocturnes to virtuosic études.',
  },
  {
    icon: Music2,
    title: 'Orchestral Works',
    count: '112 scores',
    desc: 'Full orchestral scores, symphonic poems, and concertos for large ensemble.',
  },
  {
    icon: FileText,
    title: 'Jazz Compositions',
    count: '128 scores',
    desc: 'Lead sheets, arrangements, and fully notated jazz works for various ensembles.',
  },
  {
    icon: Mic,
    title: 'Songs & Vocal Works',
    count: '104 scores',
    desc: 'Art songs, vocal cycles, and choral works with piano or orchestral accompaniment.',
  },
];

export default function ScoresSection() {
  return (
    <section id="scores" className="relative py-24 md:py-36 px-6 overflow-hidden">
      {/* Vellum background */}
      <div className="absolute inset-0 vellum-bg" />
      {/* Subtle paper texture gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#E2DED0] via-[#D8D4C6] to-[#E2DED0] opacity-50" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-[#8B7D5E] font-body mb-4">Archive</p>
            <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide text-[#1a1a1a]">
              Scores & Sheet Music
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#8B7D5E]/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#8B7D5E]/60" />
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#8B7D5E]/50" />
            </div>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {CATEGORIES.map((cat, i) => (
            <SectionReveal key={cat.title} delay={i * 0.12}>
              <div className="group p-6 md:p-10 border border-[#1a1a1a]/10 bg-white/40 backdrop-blur-sm hover:border-[#8B7D5E]/40 hover:bg-white/60 transition-all duration-500">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-[#1a1a1a]/15 group-hover:border-[#8B7D5E]/50 transition-colors duration-500">
                      <cat.icon size={18} className="text-[#8B7D5E]" />
                    </div>
                    <div className="flex-1 min-w-0 flex items-baseline justify-between gap-2">
                      <h3 className="font-display text-lg md:text-2xl tracking-wider text-[#1a1a1a] truncate">
                        {cat.title}
                      </h3>
                      <span className="text-xs text-[#8B7D5E] tracking-widest uppercase font-body flex-shrink-0">
                        {cat.count}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-[#1a1a1a]/50 font-body leading-relaxed">
                    {cat.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1a1a1a] text-[#E2DED0] text-xs tracking-[0.15em] uppercase font-body hover:bg-[#C5A059] hover:text-[#050505] transition-all duration-500 text-center">
                      Request Score
                    </button>
                    <button className="flex-1 sm:flex-none px-4 py-2.5 border border-[#1a1a1a]/20 text-[#1a1a1a]/60 text-xs tracking-[0.15em] uppercase font-body hover:border-[#8B7D5E]/50 hover:text-[#8B7D5E] transition-all duration-500 text-center">
                      Download Preview
                    </button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}