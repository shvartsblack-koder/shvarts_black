import React, { useEffect, useState, useCallback } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import ReadingPlayer from '@/components/ReadingPlayer';
import ShareButtons from '@/components/ShareButtons';
import AtmosphereBackground from '@/components/AtmosphereBackground';
import { ChevronLeft, ChevronRight, Shuffle, ArrowLeft, Heart, BookOpen } from 'lucide-react';
import { isFavorite, toggleFavorite } from '@/lib/favorites';

export default function PoemDetail() {
  const { categorySlug, poemSlug } = useParams();
  const navigate = useNavigate();
  const [poem, setPoem] = useState(null);
  const [cat, setCat] = useState(null);
  const [siblings, setSiblings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fav, setFav] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const ps = await base44.entities.Poem.filter({ slug: poemSlug, category: categorySlug, status: 'published' });
      const p = ps?.[0];
      setPoem(p || null);
      if (p) {
        setFav(isFavorite(p.id));
        const cats = await base44.entities.PoetryCategory.filter({ slug: categorySlug });
        setCat(cats?.[0] || null);
        const all = await base44.entities.Poem.filter({ category: categorySlug, status: 'published' }, 'sortOrder', 200);
        setSiblings(all || []);
      }
    } catch {} finally { setLoading(false);
      window.scrollTo({ top: 0 });
    }
  }, [categorySlug, poemSlug]);

  useEffect(() => { load(); }, [load]);

  const idx = siblings.findIndex(s => s.slug === poemSlug);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx >= 0 && idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const goRandom = async () => {
    try {
      const all = await base44.entities.Poem.filter({ status: 'published' }, '-created_date', 200);
      if (all?.length) {
        const r = all[Math.floor(Math.random() * all.length)];
        navigate(`/poetry/${r.category}/${r.slug}`);
      }
    } catch {}
  };

  const onFav = () => setFav(toggleFavorite(poem.id));

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowLeft' && prev) navigate(`/poetry/${categorySlug}/${prev.slug}`);
      if (e.key === 'ArrowRight' && next) navigate(`/poetry/${categorySlug}/${next.slug}`);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next, navigate, categorySlug]);

  const animType = poem?.animationType || (categorySlug === 'purga' ? 'snow' : 'none');
  const overlay = poem?.overlayIntensity ?? 0.78;

  const seoTitle = poem?.SEOtitle || `${poem?.title} — ШВАРЦ ЧÖРНЫЙ`;
  const seoDesc = poem?.SEOdescription || poem?.excerpt || (poem?.text || '').split('\n').slice(0, 4).join(' ');

  return (
    <div className="relative min-h-screen">
      <SEO title={seoTitle} description={seoDesc} image={poem?.coverImage} type="article"
        jsonLd={poem ? {
          '@context': 'https://schema.org', '@type': 'CreativeWork',
          name: poem.title, author: { '@type': 'Person', name: 'ШВАРЦ ЧÖРНЫЙ' },
          dateCreated: poem.creationYear, genre: 'Poetry',
          description: seoDesc, url: window.location.href
        } : null} />

      <AtmosphereBackground type={animType} image={poem?.desktopBackground || cat?.background} mobileImage={poem?.mobileBackground} overlay={overlay} />

      <div className="relative z-10 pt-28 md:pt-32 pb-32">
        <div className="max-w-3xl mx-auto px-6 md:px-10">
          {loading ? (
            <div className="h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#FDFCF8]/30 border-t-[#FDFCF8] rounded-full animate-spin" /></div>
          ) : !poem ? (
            <div className="text-center text-[#FDFCF8] py-32">
              <p className="font-serif-display text-3xl italic">Произведение не найдено.</p>
              <Link to={`/poetry/${categorySlug}`} className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#C5A059] mt-6 inline-block">Вернуться в категорию</Link>
            </div>
          ) : (
            <>
              {/* Meta */}
              <div className="flex items-center justify-between mb-10">
                <Link to={`/poetry/${categorySlug}`} className="inline-flex items-center gap-2 font-ui text-[10px] uppercase tracking-[0.2em] text-[#FDFCF8]/70 hover:text-[#FDFCF8] transition-colors">
                  <ArrowLeft size={13} strokeWidth={1.5} /> {cat?.name || categorySlug}
                </Link>
                <div className="flex items-center gap-4">
                  <button onClick={onFav} aria-label="В избранное" className="text-[#FDFCF8]/70 hover:text-[#8B0000] transition-colors">
                    <Heart size={16} strokeWidth={1.5} fill={fav ? 'currentColor' : 'none'} className={fav ? 'text-[#8B0000]' : ''} />
                  </button>
                  <button onClick={goRandom} aria-label="Случайное стихотворение" className="text-[#FDFCF8]/70 hover:text-[#FDFCF8] transition-colors">
                    <Shuffle size={15} strokeWidth={1.5} />
                  </button>
                </div>
              </div>

              <p className="font-ui text-[10px] uppercase tracking-[0.3em] text-[#C5A059] mb-3">ШВАРЦ ЧÖРНЫЙ{poem.creationYear ? ` · ${poem.creationYear}` : ''}</p>
              <h1 className="font-serif-display text-4xl md:text-6xl text-[#FDFCF8] leading-[1.05] mb-12">{poem.title}</h1>

              {/* Poem text + reading player beside it */}
              <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-10 lg:items-start">
                <article className="font-serif-display text-[#FDFCF8] text-xl md:text-2xl leading-[1.7] whitespace-pre-wrap"
                  style={{ textShadow: '0 1px 12px rgba(0,0,0,0.6)' }}>
                  {poem.text}
                </article>
                <div className="mt-6 lg:mt-1 lg:sticky lg:top-28 lg:justify-self-end">
                  <ReadingPlayer src={poem.audioReading} title={poem.title} compact />
                </div>
              </div>

              {/* Footer of poem */}
              <div className="mt-16 pt-8 border-t border-[#FDFCF8]/15">
                <ShareButtons title={poem.title} />
              </div>

              {/* Navigation */}
              <nav className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {prev ? (
                  <Link to={`/poetry/${categorySlug}/${prev.slug}`} className="group flex items-center gap-3 p-4 border border-[#FDFCF8]/15 hover:border-[#FDFCF8]/40 transition-colors">
                    <ChevronLeft size={18} strokeWidth={1.5} className="text-[#FDFCF8]/60 group-hover:text-[#FDFCF8] transition-colors flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-ui text-[9px] uppercase tracking-[0.2em] text-[#FDFCF8]/40">Предыдущее</p>
                      <p className="font-serif-display text-base text-[#FDFCF8] truncate">{prev.title}</p>
                    </div>
                  </Link>
                ) : <div />}
                <Link to={`/poetry/${categorySlug}`} className="flex items-center justify-center gap-2 p-4 border border-[#FDFCF8]/15 hover:border-[#FDFCF8]/40 transition-colors">
                  <BookOpen size={15} strokeWidth={1.5} className="text-[#FDFCF8]/60" />
                  <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#FDFCF8]/70">Категория</span>
                </Link>
                {next ? (
                  <Link to={`/poetry/${categorySlug}/${next.slug}`} className="group flex items-center justify-end gap-3 p-4 border border-[#FDFCF8]/15 hover:border-[#FDFCF8]/40 transition-colors">
                    <div className="min-w-0 text-right">
                      <p className="font-ui text-[9px] uppercase tracking-[0.2em] text-[#FDFCF8]/40">Следующее</p>
                      <p className="font-serif-display text-base text-[#FDFCF8] truncate">{next.title}</p>
                    </div>
                    <ChevronRight size={18} strokeWidth={1.5} className="text-[#FDFCF8]/60 group-hover:text-[#FDFCF8] transition-colors flex-shrink-0" />
                  </Link>
                ) : <div />}
              </nav>
              <p className="font-ui text-[10px] text-[#FDFCF8]/30 mt-6 text-center hidden md:block">Используйте ← → для навигации</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}