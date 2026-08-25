import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import ShareButtons from '@/components/ShareButtons';
import { ChevronLeft } from 'lucide-react';

export default function NewsDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const n = await base44.entities.NewsArticle.filter({ slug });
        setItem(n?.[0] || null);
      } catch {} finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="pt-32 h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div>;
  if (!item) return <div className="pt-40 text-center font-serif-display text-3xl italic text-[#6B6B6B]">Новость не найдена.</div>;

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title={`${item.title} — ШВАРЦ ЧÖРНЫЙ`} description={item.excerpt} image={item.cover} type="article"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'Article', headline: item.title, datePublished: item.date, author: { '@type': 'Person', name: 'ШВАРЦ ЧÖРНЫЙ' }, image: item.cover }} />
      <article className="max-w-3xl mx-auto px-6 md:px-10">
        <Link to="/news" className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors mb-8">
          <ChevronLeft size={14} strokeWidth={1.5} /> Все новости
        </Link>
        <div className="flex items-center gap-3 mb-4">
          {item.date && <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{new Date(item.date).toLocaleDateString('ru-RU')}</span>}
          {item.categories?.map(c => <span key={c} className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#8B0000]">{c}</span>)}
        </div>
        <h1 className="font-serif-display text-4xl md:text-6xl leading-[1.05]">{item.title}</h1>
        {item.excerpt && <p className="font-serif-display text-xl italic text-[#6B6B6B] mt-6">{item.excerpt}</p>}
        {item.cover && <div className="mt-10 aspect-[16/9] overflow-hidden bg-[#eee]"><img src={item.cover} alt="" className="h-full w-full object-cover grayscale" /></div>}
        {item.body && <div className="mt-10 font-serif-display text-xl leading-[1.7] whitespace-pre-wrap">{item.body}</div>}
        {item.video && <div className="mt-10 aspect-video"><iframe src={item.video} className="w-full h-full" allowFullScreen title={item.title} /></div>}
        {item.gallery?.length > 0 && (
          <div className="mt-10 grid grid-cols-2 gap-4">
            {item.gallery.map((g, i) => <div key={i} className="aspect-square overflow-hidden bg-[#eee]"><img src={g} alt="" className="h-full w-full object-cover grayscale" /></div>)}
          </div>
        )}
        <div className="mt-12 pt-8 border-t border-[rgba(8,8,8,0.1)]"><ShareButtons title={item.title} /></div>
      </article>
    </div>
  );
}