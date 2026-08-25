import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';

export default function Biography() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await base44.entities.BiographySection.list('sortOrder', 100);
        setSections(s || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const timeline = sections.filter(s => s.section === 'timeline' || s.year).sort((a, b) => (a.year || 0) - (b.year || 0));
  const others = sections.filter(s => s.section !== 'timeline');

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title="Биография — ШВАРЦ ЧÖРНЫЙ" description="Поэзия, музыка, проекты, хронология. Литературная визуальная биография."
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Person', name: 'ШВАРЦ ЧÖРНЫЙ', description: 'Поэт, композитор, автор песен' }} />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Лицо и голос</p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none">Биография</h1>

        {loading ? <div className="h-40 flex items-center justify-center mt-20"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div> : (
          <>
            <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-12">
              <div className="md:col-span-8 space-y-20">
                {others.map(s => (
                  <section key={s.id}>
                    <h2 className="font-serif-display text-4xl mb-6">{s.title}</h2>
                    {s.content && <div className="font-serif-display text-lg leading-[1.7] whitespace-pre-wrap text-[#2B2B2B]">{s.content}</div>}
                    {s.images?.length > 0 && (
                      <div className="mt-8 grid grid-cols-2 gap-4">
                        {s.images.map((img, i) => <div key={i} className="aspect-[4/5] overflow-hidden bg-[#eee]"><img src={img} alt="" className="h-full w-full object-cover grayscale" /></div>)}
                      </div>
                    )}
                  </section>
                ))}
                {!others.length && <p className="font-serif-display italic text-[#A9A9A9]">Разделы биографии появятся скоро.</p>}
              </div>

              {timeline.length > 0 && (
                <aside className="md:col-span-4 md:pl-8 md:border-l border-[rgba(8,8,8,0.1)]">
                  <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-8">Хронология</h2>
                  <div className="space-y-8">
                    {timeline.map((t, i) => (
                      <div key={t.id || i} className="relative pl-6 border-l border-[rgba(8,8,8,0.15)]">
                        <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[#080808]" />
                        {t.year && <p className="font-ui text-[12px] tracking-[0.15em] text-[#8B0000]">{t.year}</p>}
                        <h3 className="font-serif-display text-xl mt-1">{t.title}</h3>
                        {t.content && <p className="font-serif-display italic text-[#6B6B6B] mt-1 text-sm">{t.content}</p>}
                      </div>
                    ))}
                  </div>
                </aside>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}