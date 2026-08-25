import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import AlbumCard from '@/components/AlbumCard';

const TYPES = [
  { id: 'symphonic', label: 'Симфоническая', n: 'I' },
  { id: 'piano', label: 'Фортепианная', n: 'II' },
  { id: 'songs', label: 'Песни', n: 'III' },
];

export default function Music() {
  const [albums, setAlbums] = useState([]);
  const [active, setActive] = useState('symphonic');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const a = await base44.entities.MusicAlbum.list('sortOrder', 100);
        setAlbums(a || []);
      } catch {} finally { setLoading(false); }
    })();
  }, []);

  const filtered = albums.filter(a => (a.categories || []).includes(active));

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title="Музыка — ШВАРЦ ЧÖРНЫЙ" description="Симфоническая, фортепианная музыка и песни Шварца Чорного." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Звуковая библиотека</p>
        <h1 className="font-serif-display text-6xl md:text-8xl leading-none">Музыка</h1>

        {/* Type selector */}
        <div className="mt-12 flex flex-wrap gap-px bg-[rgba(8,8,8,0.08)]">
          {TYPES.map(t => (
            <button key={t.id} onClick={() => setActive(t.id)}
              className={`px-6 md:px-10 py-5 font-serif-display text-2xl md:text-3xl transition-colors flex-1 min-w-[200px] text-left
                ${active === t.id ? 'bg-[#080808] text-[#FDFCF8]' : 'bg-[#FDFCF8] text-[#080808] hover:bg-[#080808]/5'}`}>
              <span className={`font-ui text-[10px] uppercase tracking-[0.2em] block mb-1 ${active === t.id ? 'text-[#C5A059]' : 'text-[#A9A9A9]'}`}>{t.n}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Albums grid */}
        <div className="mt-16">
          {loading ? (
            <div className="h-40 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
              {filtered.map((a, i) => <AlbumCard key={a.id} album={a} index={i} />)}
            </div>
          )}
          {!loading && !filtered.length && <p className="font-serif-display italic text-[#A9A9A9] py-10">В этой категории пока нет альбомов.</p>}
        </div>
      </div>
    </div>
  );
}