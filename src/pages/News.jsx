import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';

const CATS = ['Все', 'Музыка', 'Поэзия', 'Концерты', 'Релизы', 'Публикации', 'События'];

export default function News() {
  const [items, setItems] = useState([]);
  const [cat, setCat] = useState('Все');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const n = await base44.entities.NewsArticle.list('-date', 100);
        setItems(n || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = cat === 'Все' ? items : items.filter(n => (n.categories || []).includes(cat));

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title="Новости — ШВАРЦ ЧÖРНЫЙ" description="Концерты, релизы, публикации и события." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Хроника</p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none">Новости</h1>

        <div className="mt-10 flex flex-wrap gap-3">
          {CATS.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 font-ui text-[11px] uppercase tracking-[0.15em] border transition-colors
                ${cat === c ? 'bg-[#080808] text-[#FDFCF8] border-[#080808]' : 'border-[rgba(8,8,8,0.15)] text-[#6B6B6B] hover:border-[#080808] hover:text-[#080808]'}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-10">
          {loading ? <div className="col-span-full h-40 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div> :
            filtered.map(n => (
              <Link key={n.id} to={`/news/${n.slug}`} className="group block">
                {n.cover && <div className="aspect-[4/3] overflow-hidden mb-4 bg-[#eee]"><img src={n.cover} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /></div>}
                <div className="flex items-center gap-3 mb-2">
                  {n.date && <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{new Date(n.date).toLocaleDateString('ru-RU')}</span>}
                  {n.categories?.[0] && <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#8B0000]">{n.categories[0]}</span>}
                </div>
                <h2 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors leading-tight">{n.title}</h2>
                {n.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-2 line-clamp-3">{n.excerpt}</p>}
              </Link>
            ))}
          {!loading && !filtered.length && <p className="col-span-full font-serif-display italic text-[#A9A9A9]">Новостей пока нет.</p>}
        </div>
      </div>
    </div>
  );
}