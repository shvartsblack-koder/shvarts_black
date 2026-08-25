import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Heart, Trash2 } from 'lucide-react';
import { getFavorites, clearFavorites } from '@/lib/favorites';

export default function Favorites() {
  const [ids, setIds] = useState([]);
  const [poems, setPoems] = useState([]);

  useEffect(() => {
    const load = async () => {
      const favIds = getFavorites();
      setIds(favIds);
      if (!favIds.length) { setPoems([]); return; }
      try {
        const all = await base44.entities.Poem.filter({ status: 'published' }, '-created_date', 200);
        setPoems(all.filter(p => favIds.includes(p.id)));
      } catch {}
    };
    load();
    const onChange = () => load();
    window.addEventListener('favorites-changed', onChange);
    return () => window.removeEventListener('favorites-changed', onChange);
  }, []);

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title="Избранное — ШВАРЦ ЧÖРНЫЙ" description="Сохранённые произведения." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Личная полка</p>
            <h1 className="font-serif-display text-6xl md:text-8xl leading-none">Избранное</h1>
          </div>
          {poems.length > 0 && (
            <button onClick={clearFavorites} className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#8B0000] transition-colors">
              <Trash2 size={14} strokeWidth={1.5} /> Очистить
            </button>
          )}
        </div>

        <div className="mt-16">
          {poems.length === 0 ? (
            <div className="text-center py-32">
              <Heart size={40} strokeWidth={1} className="mx-auto text-[#A9A9A9]" />
              <p className="font-serif-display text-2xl italic text-[#6B6B6B] mt-6">Вы пока ничего не сохранили.</p>
              <Link to="/poetry" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#8B0000] mt-6 inline-block">Перейти к стихам →</Link>
            </div>
          ) : (
            <div className="divide-y divide-[rgba(8,8,8,0.08)]">
              {poems.map((p, i) => (
                <Link key={p.id} to={`/poetry/${p.category}/${p.slug}`} className="group block py-6 hover:pl-4 transition-all duration-500">
                  <div className="flex items-baseline justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-serif-display text-2xl md:text-3xl group-hover:text-[#8B0000] transition-colors">{p.title}</h3>
                      {p.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-1 line-clamp-1">{p.excerpt}</p>}
                    </div>
                    {p.creationYear && <span className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9]">{p.creationYear}</span>}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}