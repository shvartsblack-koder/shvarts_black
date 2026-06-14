import React from 'react';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';

export default function BiographySection() {
  return (
    <section id="biography" className="relative py-24 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-[#060606]" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent mr-[5%]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left — sticky portrait */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <SectionReveal>
                <div className="relative aspect-[3/4] max-w-md mx-auto lg:mx-0 overflow-hidden">
                  <img
                    src="https://media.base44.com/images/public/6a29e5cf7bcb44e60651e6a7/0593f6a6b_using-the-uploaded-reference-photo-as-th_dgyjQNLCUqaBt04tHj4g6Q_dEcD7BXlTTWzSxy0CGNRSg_cover_2k.jpg"
                    alt="Composer portrait — hands on piano keys in dramatic golden light"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]/30" />
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
                </div>
              </SectionReveal>
            </div>
          </div>

          {/* Right — narrative */}
          <div className="lg:col-span-7">
            <SectionReveal>
              <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">The Journey</p>
              <h2 className="font-display text-4xl md:text-5xl font-light tracking-wide gold-text mb-4">
                Biography
              </h2>
              <GoldenRule className="justify-start mb-10" />
            </SectionReveal>

            <div className="space-y-6 text-foreground/65 font-body text-base leading-[1.8] font-light tracking-wide">
              <SectionReveal delay={0.1}>
                <p>
                  From the earliest notes drawn from a childhood piano, music was never merely sound for
                  Shvarts Black — it was a language of the soul, a doorway into worlds both ancient and unborn.
                  Growing up immersed in the symphonic tradition, he developed an instinctive understanding of
                  orchestral architecture, the weight of silence between movements, and the transformative power
                  of a single melodic phrase.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <p>
                  His artistic vision expanded through deep engagement with poetry, philosophy, and the
                  great civilizations of antiquity. The mysteries of <span className="text-primary/80">Babylon</span>,
                  the mathematical elegance of classical form, and the raw emotional honesty of{' '}
                  <span className="text-primary/80">jazz</span> all converged into a singular creative identity —
                  one that refuses to be contained by any single tradition.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <p>
                  Today, Shvarts Black composes at the intersection of historical depth and contemporary
                  expression. His works range from sweeping orchestral compositions and intimate piano
                  cycles to jazz-infused nocturnes, <span className="text-primary/80">Klezmer</span> celebrations,
                  Middle Eastern tone poems, and vocal works steeped in poetic imagery. Each piece
                  is a chapter in an ongoing narrative — a <span className="text-primary/80">symphony</span> of
                  intellect, emotion, and artistic courage that spans continents and centuries.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.4}>
                <p>
                  Whether writing for a full orchestra or a solo instrument, his music carries the unmistakable
                  signature of a mind shaped by literature, philosophy, and an unwavering devotion to beauty
                  in its most profound and uncompromising forms.
                </p>
              </SectionReveal>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}