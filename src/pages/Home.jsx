import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Shuffle, ArrowRight } from 'lucide-react';
import { playPageFlip } from '@/lib/sound';
import BackgroundSlideshow from '@/components/BackgroundSlideshow';

const MANUSCRIPT_IMG = 'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/2e7ea7d15_generated_76229a94.png';

const ENTRIES = [
  { label: 'Стихи', to: '/poetry', n: 'I' },
  { label: 'Музыка', to: '/music', n: 'II' },
  { label: 'Истории', to: '/poetry/istorii-i-skazki', n: 'III' },
];

const SECONDARY = [
  { label: 'Биография', to: '/biography' },
  { label: 'Новости', to: '/news' },
  { label: 'СМИ', to: '/media' },
];

export default function Home() {
  const navigate = useNavigate();
  const [poems, setPoems] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [news, setNews] = useState([]);
  const [randomLoading, setRandomLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [ps, al, nw] = await Promise.all([
          base44.entities.Poem.filter({ status: 'published' }, '-created_date', 3),
          base44.entities.MusicAlbum.list('-created_date', 3),
          base44.entities.NewsArticle.list('-date', 3),
        ]);
        setPoems(ps || []);
        setAlbums(al || []);
        setNews(nw || []);
      } catch {}
    })();
  }, []);

  const openRandom = async () => {
    setRandomLoading(true);
    playPageFlip();
    try {
      const all = await base44.entities.Poem.filter({ status: 'published' }, '-created_date', 200);
      if (all && all.length) {
        const r = all[Math.floor(Math.random() * all.length)];
        navigate(`/poetry/${r.category}/${r.slug}`);
      }
    } catch {} finally { setRandomLoading(false); }
  };

  return (
    <>
      <SEO title="ШВАРЦ ЧÖРНЫЙ — Поэзия • Музыка • Истории"
        description="Цифровой архив поэта и композитора Шварца Чорного. Стихи, музыка, истории, биография."
        image="https://shvarts.black/og-default.jpg"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Person', name: 'ШВАРЦ ЧÖРНЫЙ',
          alternateName: ['Shvarts Black', 'Shvarts Chorny'],
          jobTitle: ['Поэт','Композитор','Писатель','Драматург'],
          url: 'https://shvarts.black/',
          image: 'https://shvarts.black/og-default.jpg' }} />

      <div className="fixed inset-0 z-0 pointer-events-none"><BackgroundSlideshow variant="light" opacity={0.5} /></div>
      <div className="relative z-10">
      {/* HERO */}
      <section className="relative h-screen min-h-[640px] flex flex-col justify-center overflow-hidden">
        <BackgroundSlideshow variant="dark" opacity={0.85} />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 md:px-10 w-full">
          <p className="font-ui text-[11px] uppercase tracking-[0.4em] text-[#FDFCF8]/60 mb-6 text-reveal">Архив • Книга • Мифология</p>
          <h1 className="font-serif-display text-[#FDFCF8] text-6xl sm:text-7xl md:text-9xl leading-[0.9] tracking-tight text-reveal" style={{ animationDelay: '0.1s' }}>
            ШВАРЦ<br />ЧÖРНЫЙ
          </h1>
          <p className="font-serif-display text-xl md:text-2xl italic text-[#FDFCF8]/80 mt-8 text-reveal" style={{ animationDelay: '0.3s' }}>
            поэт / композитор
          </p>
          <p className="font-ui text-[12px] uppercase tracking-[0.25em] text-[#FDFCF8]/50 mt-4 text-reveal" style={{ animationDelay: '0.4s' }}>
            Поэзия • Музыка • Истории
          </p>
        </div>
        <div className="absolute bottom-8 left-0 right-0 z-10 flex justify-center">
          <div className="animate-bounce font-ui text-[10px] uppercase tracking-[0.3em] text-[#FDFCF8]/40">Листай</div>
        </div>
      </section>

      {/* ENTRIES */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(8,8,8,0.08)]">
          {ENTRIES.map((e, i) => (
            <Link key={e.to} to={e.to}
              className="group bg-[#FDFCF8] p-10 md:p-14 hover:bg-[#080808] transition-colors duration-500">
              <span className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#A9A9A9] group-hover:text-[#C5A059] transition-colors">{e.n}</span>
              <h2 className="font-serif-display text-5xl md:text-6xl mt-6 text-[#080808] group-hover:text-[#FDFCF8] transition-colors leading-none">{e.label}</h2>
              <ArrowRight size={20} strokeWidth={1} className="mt-8 text-[#6B6B6B] group-hover:text-[#FDFCF8] transition-colors" />
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 mt-10">
          {SECONDARY.map((s) => (
            <Link key={s.to} to={s.to} className="font-ui text-[12px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors">
              {s.label}
            </Link>
          ))}
        </div>
      </section>

      {/* RANDOM */}
      <section className="ink-bg py-24 md:py-32">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 text-center">
          <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mb-6">Случайное произведение</p>
          <h2 className="font-serif-display text-4xl md:text-6xl text-[#FDFCF8] leading-tight max-w-3xl mx-auto">
            Позвольте книге открыть сама себя
          </h2>
          <button onClick={openRandom} disabled={randomLoading}
            className="mt-10 inline-flex items-center gap-3 border border-[#FDFCF8]/30 px-8 py-4 font-ui text-[12px] uppercase tracking-[0.2em] text-[#FDFCF8] hover:bg-[#FDFCF8] hover:text-[#080808] transition-colors disabled:opacity-50">
            <Shuffle size={16} strokeWidth={1.5} /> {randomLoading ? 'Открываю…' : 'Открыть наугад'}
          </button>
        </div>
      </section>

      {/* FEATURED */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif-display text-4xl">Недавние стихи</h2>
              <Link to="/poetry" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
            </div>
            <div className="divide-y divide-[rgba(8,8,8,0.08)]">
              {poems.map((p, i) => (
                <Link key={p.id} to={`/poetry/${p.category}/${p.slug}`} className="block py-5 group">
                  <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{p.title}</h3>
                  {p.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-1 line-clamp-1">{p.excerpt}</p>}
                </Link>
              ))}
              {!poems.length && <p className="font-serif-display italic text-[#A9A9A9] py-5">Стихи появятся скоро.</p>}
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-8">
              <h2 className="font-serif-display text-4xl">Музыка</h2>
              <Link to="/music" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
            </div>
            <div className="space-y-6">
              {albums.map((a) => (
                <Link key={a.id} to={`/music/album/${a.slug}`} className="flex gap-5 group">
                  <div className="h-20 w-20 flex-shrink-0 bg-[#1a1a1a] overflow-hidden">
                    {a.cover ? <img src={a.cover} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /> :
                      <div className="h-full w-full flex items-center justify-center font-serif-display text-2xl text-[#C5A059]">{a.title?.[0]}</div>}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-serif-display text-xl group-hover:text-[#8B0000] transition-colors">{a.title}</h3>
                    {a.year && <p className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9]">{a.year}</p>}
                    {a.description && <p className="font-serif-display italic text-sm text-[#6B6B6B] mt-1 line-clamp-2">{a.description}</p>}
                  </div>
                </Link>
              ))}
              {!albums.length && <p className="font-serif-display italic text-[#A9A9A9]">Альбомы появятся скоро.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* MANUSCRIPT QUOTE */}
      <section className="relative py-32 md:py-40 overflow-hidden">
        <img src={MANUSCRIPT_IMG} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ filter: 'grayscale(1) contrast(1.05)' }} />
        <div className="absolute inset-0 bg-[#080808]/75" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="font-serif-display text-3xl md:text-5xl italic text-[#FDFCF8] leading-snug">
            «Здесь существует отдельный художественный мир<br />со своим языком, юмором, музыкой и мифологией.»
          </p>
          <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#C5A059] mt-8">ШВАРЦ ЧÖРНЫЙ</p>
        </div>
      </section>

      {/* NEWS */}
      <section className="max-w-[1400px] mx-auto px-6 md:px-10 py-24">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="font-serif-display text-4xl">Новости</h2>
          <Link to="/news" className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808]">Все →</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {news.map((n) => (
            <Link key={n.id} to={`/news/${n.slug}`} className="group block">
              {n.cover && <div className="aspect-[4/3] overflow-hidden mb-4 bg-[#eee]"><img src={n.cover} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /></div>}
              <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{n.date && new Date(n.date).toLocaleDateString('ru-RU')}</p>
              <h3 className="font-serif-display text-xl mt-2 group-hover:text-[#8B0000] transition-colors">{n.title}</h3>
              {n.excerpt && <p className="font-serif-display italic text-[#6B6B6B] mt-1 line-clamp-2">{n.excerpt}</p>}
            </Link>
          ))}
          {!news.length && <p className="font-serif-display italic text-[#A9A9A9]">Новости появятся скоро.</p>}
        </div>
      </section>
      </div>
    </>
  );
}