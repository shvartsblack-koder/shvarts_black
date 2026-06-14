import React from 'react';
import { Music, Feather, BookOpen, Sparkles } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';

const ROLES = [
  {
    icon: Music,
    title: 'Composer',
    desc: 'Orchestral drama, piano lyricism, and cinematic soundscapes that transcend the boundaries of genre.',
  },
  {
    icon: Feather,
    title: 'Poet',
    desc: 'Words woven into music — verse as melody, rhythm as language, silence as the deepest expression.',
  },
  {
    icon: BookOpen,
    title: 'Storyteller',
    desc: 'Epic narratives drawn from ancient civilizations, philosophical inquiry, and the human condition.',
  },
  {
    icon: Sparkles,
    title: 'Visionary Artist',
    desc: 'A creative force bridging classical tradition with contemporary artistic expression and innovation.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="relative py-24 md:py-36 px-6 overflow-hidden">
      {/* Subtle background texture */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent ml-[5%]" />

      <div className="relative z-10 max-w-6xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">The Artist</p>
            <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide gold-text">
              About the Composer
            </h2>
            <GoldenRule className="mt-6" />
          </div>
        </SectionReveal>

        <SectionReveal delay={0.2}>
          <p className="text-center max-w-3xl mx-auto text-foreground/70 font-body text-base md:text-lg leading-relaxed tracking-wide font-light mb-16 md:mb-20">
            SHVARTS BLACK is a composer, poet and author whose work combines classical musical thinking,
            cinematic imagination, philosophical depth and contemporary artistic expression. His music
            moves between orchestral drama, piano lyricism, jazz atmosphere, historical symbolism
            and poetic storytelling.
          </p>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {ROLES.map((role, i) => (
            <SectionReveal key={role.title} delay={0.15 * i}>
              <div className="group p-6 md:p-8 border border-primary/10 bg-[#0a0a0a]/60 backdrop-blur-sm hover:border-primary/30 transition-all duration-700 text-center">
                <div className="w-12 h-12 mx-auto mb-5 flex items-center justify-center border border-primary/20 group-hover:border-primary/50 transition-colors duration-500">
                  <role.icon size={20} className="text-primary/70 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-display text-xl md:text-2xl tracking-wider text-foreground/90 mb-3">
                  {role.title}
                </h3>
                <p className="text-sm text-foreground/50 font-body leading-relaxed font-light">
                  {role.desc}
                </p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}