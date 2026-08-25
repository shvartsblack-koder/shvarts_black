import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { Search as SearchIcon, X } from 'lucide-react';

export default function Search() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState({ poems: [], albums: [], tracks: [], news: [], media: [] });
  const [searching, setSearching] = useState(false);
  const inputRef = useRef(null);
  const timer = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    if (!q.trim()) { setResults({ poems: [], albums: [], tracks: [], news: [], media: [] }); return; }
    setSearching(true);
    timer.current = setTimeout(async () => {
      try {
        const [poems, albums, tracks, news, media] = await Promise.all([
          base44.entities.Poem.filter({ status: 'published' }, '-created_date', 200),
          base44.entities.MusicAlbum.list('-created_date', 100),
          base44.entities.MusicTrack.list('trackNumber', 200),
          base44.entities.NewsArticle.list('-date', 100),
          base44.entities.MediaPublication.list('-date', 100),
        ]);
        const ql = q.toLowerCase();
        const match = (s) => (s || '').toLowerCase().includes(ql);
        setResults({
          poems: (poems || []).filter(p => match(p.title) || match(p.text) || match(p.excerpt)),
          albums: (albums || []).filter(a => match(a.title) || match(a.description)),
          tracks: (tracks || []).filter(t => match(t.title) || match(t.lyrics)),
          news: (news || []).filter(n => match(n.title) || match(n.excerpt) || match(n.body)),
          media: (media || []).filter(m => match(m.title) || match(m.excerpt) || match(m.publication)),
        });
      } catch {} finally { setSearching(false); }
    }, 300);
  }, [q]);

  const total = results.poems.length + results.albums.length + results.tracks.length + results.news.length + results.media.length;

  return (
    <div className="pt-28 md:pt-32 pb-24 min-h-screen">
      <SEO title="Поиск — ШВАРЦ ЧÖРНЫЙ" description="Глобальный поиск по стихам, музыке, новостям и публикациям." />
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Поиск по архиву</p>
        <h1 className="font-serif-display text-5xl md:text-7xl leading-none mb-10">Найти</h1>

        <div className="relative border-b-2 border-[#080808] pb-3">
          <SearchIcon size={22} strokeWidth={1.5} className="absolute left-0 top-1 text-[#080808]" />
          <input ref={inputRef} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Введите слово или фразу…"
            className="w-full pl-10 pr-10 font-serif-display text-2xl md:text-3xl bg-transparent focus:outline-none placeholder:text-[#A9A9A9]" />
          {q && <button onClick={() => setQ('')} className="absolute right-0 top-1 text-[#6B6B6B] hover:text-[#080808]"><X size={20} /></button>}
        </div>

        <p className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#A9A9A9] mt-4">
          {searching ? 'Ищу…' : q.trim() ? `Найдено: ${total}` : 'Ищет по стихам, альбомам, композициям, новостям и публикациям'}
        </p>

        <div className="mt-12 space-y-12">
          {results.poems.length > 0 && (
            <section>
              <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Стихи · {results.poems.length}</h2>
              <div className="divide-y divide-[rgba(8,8,8,0.08)]">
                {results.poems.map(p => (
                  <Link key={p.id} to={`/poetry/${p.category}/${p.slug}`} className="block py-4 group">
                    <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{p.title}</h3>
                    {p.excerpt && <p className="font-serif-display italic text-[#6B6B6B] line-clamp-1">{p.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.albums.length > 0 && (
            <section>
              <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Альбомы · {results.albums.length}</h2>
              <div className="divide-y divide-[rgba(8,8,8,0.08)]">
                {results.albums.map(a => (
                  <Link key={a.id} to={`/music/album/${a.slug}`} className="block py-4 group">
                    <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{a.title}</h3>
                    {a.description && <p className="font-serif-display italic text-[#6B6B6B] line-clamp-1">{a.description}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.tracks.length > 0 && (
            <section>
              <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Композиции · {results.tracks.length}</h2>
              <div className="divide-y divide-[rgba(8,8,8,0.08)]">
                {results.tracks.map(t => (
                  <Link key={t.id} to={`/music/album/${t.album}/${t.slug}`} className="block py-4 group">
                    <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{t.title}</h3>
                    {t.lyrics && <p className="font-serif-display italic text-[#6B6B6B] line-clamp-1">{t.lyrics}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.news.length > 0 && (
            <section>
              <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Новости · {results.news.length}</h2>
              <div className="divide-y divide-[rgba(8,8,8,0.08)]">
                {results.news.map(n => (
                  <Link key={n.id} to={`/news/${n.slug}`} className="block py-4 group">
                    <h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{n.title}</h3>
                    {n.excerpt && <p className="font-serif-display italic text-[#6B6B6B] line-clamp-1">{n.excerpt}</p>}
                  </Link>
                ))}
              </div>
            </section>
          )}
          {results.media.length > 0 && (
            <section>
              <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">СМИ · {results.media.length}</h2>
              <div className="divide-y divide-[rgba(8,8,8,0.08)]">
                {results.media.map(m => (
                  m.slug && !m.externalURL
                    ? <Link key={m.id} to={`/media/${m.slug}`} className="block py-4 group"><h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{m.title}</h3><p className="font-ui text-[11px] text-[#A9A9A9]">{m.publication}</p></Link>
                    : <a key={m.id} href={m.externalURL || '#'} target="_blank" rel="noopener noreferrer" className="block py-4 group"><h3 className="font-serif-display text-2xl group-hover:text-[#8B0000] transition-colors">{m.title}</h3><p className="font-ui text-[11px] text-[#A9A9A9]">{m.publication}</p></a>
                ))}
              </div>
            </section>
          )}
          {q.trim() && !searching && total === 0 && (
            <p className="font-serif-display text-2xl italic text-[#A9A9A9] py-20 text-center">Ничего не найдено.</p>
          )}
        </div>
      </div>
    </div>
  );
}