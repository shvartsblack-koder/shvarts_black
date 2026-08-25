import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { ExternalLink, Quote } from 'lucide-react';

const TYPES = ['Все', 'Публикации', 'Интервью', 'Рецензии', 'Статьи', 'Радио', 'Телевидение', 'Подкасты'];

export default function Media() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const m = await base44.entities.MediaPublication.list('-date', 100);
        setItems(m || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = type === 'Все' ? items : items.filter(m => m.type === type);

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title="СМИ — ШВАРЦ ЧÖРНЫЙ" description="Публикации, интервью, рецензии, статьи, радио, телевидение, подкасты." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Пресса</p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none">СМИ</h1>

        <div className="mt-10 flex flex-wrap gap-3">
          {TYPES.map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-4 py-2 font-ui text-[11px] uppercase tracking-[0.15em] border transition-colors
                ${type === t ? 'bg-[#080808] text-[#FDFCF8] border-[#080808]' : 'border-[rgba(8,8,8,0.15)] text-[#6B6B6B] hover:border-[#080808] hover:text-[#080808]'}`}>
              {t}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-px bg-[rgba(8,8,8,0.08)]">
          {loading ? <div className="col-span-full h-40 flex items-center justify-center bg-[#FDFCF8]"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div> :
            filtered.map(m => {
              const hasPage = m.body || m.slug;
              const inner = (
                <>
                  <div className="flex items-start gap-5">
                    {m.image ? <div className="h-20 w-20 flex-shrink-0 overflow-hidden bg-[#eee]"><img src={m.image} alt="" className="h-full w-full object-cover grayscale" /></div> :
                      <div className="h-20 w-20 flex-shrink-0 bg-[#080808] flex items-center justify-center font-serif-display text-2xl text-[#C5A059]">{(m.publication || 'СМИ')[0]}</div>}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#080808]">{m.publication}</span>
                        {m.type && <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-[#8B0000]">{m.type}</span>}
                      </div>
                      <h2 className="font-serif-display text-2xl leading-tight group-hover:text-[#8B0000] transition-colors">{m.title}</h2>
                      {m.excerpt && <div className="flex gap-2 mt-2"><Quote size={14} className="text-[#A9A9A9] flex-shrink-0 mt-1" /><p className="font-serif-display italic text-[#6B6B6B] line-clamp-2">{m.excerpt}</p></div>}
                      <div className="flex items-center gap-3 mt-3">
                        {m.date && <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{new Date(m.date).toLocaleDateString('ru-RU')}</span>}
                        {m.externalURL && <span className="inline-flex items-center gap-1 font-ui text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B]">Оригинал <ExternalLink size={11} /></span>}
                      </div>
                    </div>
                  </div>
                </>
              );
              return hasPage && (m.body || m.slug) && !m.externalURL
                ? <Link key={m.id} to={`/media/${m.slug || m.id}`} className="group bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808]/[0.02] transition-colors">{inner}</Link>
                : <a key={m.id} href={m.externalURL || '#'} target="_blank" rel="noopener noreferrer" className="group bg-[#FDFCF8] p-6 md:p-8 hover:bg-[#080808]/[0.02] transition-colors block">{inner}</a>;
            })}
          {!loading && !filtered.length && <p className="col-span-full font-serif-display italic text-[#A9A9A9] bg-[#FDFCF8] py-10 px-6">Публикаций пока нет.</p>}
        </div>
      </div>
    </div>
  );
}