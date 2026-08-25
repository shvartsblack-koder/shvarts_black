import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Shuffle } from 'lucide-react';

export default function Poetry() {
  const [cats, setCats] = useState([]);
  const [hovered, setHovered] = useState(null);
  const [poems, setPoems] = useState([]);
  const [randomLoading, setRandomLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const c = await base44.entities.PoetryCategory.list('sortOrder', 50);
        setCats(c || []);
        const p = await base44.entities.Poem.filter({ status: 'published' }, '-created_date', 100);
        setPoems(p || []);
      } catch {}
    })();
  }, []);

  const peek = (slug) => {
    const inCat = poems.filter(p => p.category === slug);
    if (!inCat.length) return null;
    return inCat[Math.floor(Math.random() * inCat.length)];
  };

  const openRandom = () => {
    if (!poems.length) return;
    setRandomLoading(true);
    const r = poems[Math.floor(Math.random() * poems.length)];
    navigate(`/poetry/${r.category}/${r.slug}`);
  };

  return (
    <div className="pt-28 md:pt-32">
      <SEO title="Стихи — ШВАРЦ ЧÖРНЫЙ" description="Восемь авторских тематических категорий стихов Шварца Чорного." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Архив поэзии</p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none">Стихи</h1>
        <p className="font-serif-display text-xl italic text-[#6B6B6B] mt-6 max-w-2xl">
          Восемь кругов авторского мира. Выберите вход — или откройте книгу наугад.
        </p>
        <button onClick={openRandom} disabled={randomLoading}
          className="mt-8 inline-flex items-center gap-3 border border-[#080808] px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] hover:bg-[#080808] hover:text-[#FDFCF8] transition-colors disabled:opacity-50">
          <Shuffle size={15} strokeWidth={1.5} /> {randomLoading ? 'Открываю…' : 'Открыть наугад'}
        </button>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <ul>
              {cats.map((c, i) => {
                const pk = hovered === c.slug ? peek(c.slug) : null;
                return (
                  <li key={c.id} onMouseEnter={() => setHovered(c.slug)} onMouseLeave={() => setHovered(null)}
                    className="border-b border-[rgba(8,8,8,0.1)]">
                    <Link to={`/poetry/${c.slug}`} className="group flex items-baseline gap-6 py-8 md:py-10">
                      <span className="font-ui text-[11px] tracking-[0.2em] text-[#A9A9A9] w-8 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
                      <div className="flex-1">
                        <h2 className="font-serif-display text-4xl md:text-6xl text-[#080808] group-hover:text-[#8B0000] group-hover:italic transition-all duration-300 leading-none">{c.name}</h2>
                        {pk && (
                          <p className="font-serif-display italic text-[#6B6B6B] mt-4 max-w-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 line-clamp-2">
                            {pk.excerpt || pk.title}
                          </p>
                        )}
                      </div>
                      <span className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9] hidden md:block">
                        {poems.filter(p => p.category === c.slug).length}
                      </span>
                    </Link>
                  </li>
                );
              })}
              {!cats.length && <li className="font-serif-display italic text-[#A9A9A9] py-10">Категории появятся скоро.</li>}
            </ul>
          </div>
          <aside className="md:col-span-4 md:pl-8 md:border-l border-[rgba(8,8,8,0.08)]">
            <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#A9A9A9] mb-4">О разделе</p>
            <p className="font-serif-display text-lg italic text-[#6B6B6B] leading-relaxed">
              Стихи разделены на восемь авторских тематических категорий — от интимного «Я» до «Поэмм и пиэссов». Каждая категория — отдельная полка в архиве, со своей атмосферой и фоном.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}