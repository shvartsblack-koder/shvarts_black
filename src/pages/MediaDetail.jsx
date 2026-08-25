import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import ShareButtons from '@/components/ShareButtons';
import { ChevronLeft, ExternalLink } from 'lucide-react';

export default function MediaDetail() {
  const { slug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const m = await base44.entities.MediaPublication.filter({ slug });
        setItem(m?.[0] || null);
      } catch {} finally { setLoading(false); }
    })();
  }, [slug]);

  if (loading) return <div className="pt-32 h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div>;
  if (!item) return <div className="pt-40 text-center font-serif-display text-3xl italic text-[#6B6B6B]">Публикация не найдена.</div>;

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title={`${item.title} — ${item.publication} — ШВАРЦ ЧÖРНЫЙ`} description={item.excerpt} image={item.image} type="article" />
      <article className="max-w-3xl mx-auto px-6 md:px-10">
        <Link to="/media" className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors mb-8">
          <ChevronLeft size={14} strokeWidth={1.5} /> Все публикации
        </Link>
        <div className="flex items-center gap-3 mb-4">
          <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#080808]">{item.publication}</span>
          {item.type && <span className="font-ui text-[10px] uppercase tracking-[0.15em] text-[#8B0000]">{item.type}</span>}
          {item.date && <span className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#A9A9A9]">{new Date(item.date).toLocaleDateString('ru-RU')}</span>}
        </div>
        <h1 className="font-serif-display text-4xl md:text-6xl leading-[1.05]">{item.title}</h1>
        {item.excerpt && <p className="font-serif-display text-xl italic text-[#6B6B6B] mt-6">{item.excerpt}</p>}
        {item.image && <div className="mt-10 aspect-[16/9] overflow-hidden bg-[#eee]"><img src={item.image} alt="" className="h-full w-full object-cover grayscale" /></div>}
        {item.body && <div className="mt-10 font-serif-display text-xl leading-[1.7] whitespace-pre-wrap">{item.body}</div>}
        {item.externalURL && (
          <a href={item.externalURL} target="_blank" rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-2 border border-[#080808] px-6 py-3 font-ui text-[11px] uppercase tracking-[0.2em] hover:bg-[#080808] hover:text-[#FDFCF8] transition-colors">
            Читать оригинал <ExternalLink size={13} strokeWidth={1.5} />
          </a>
        )}
        <div className="mt-12 pt-8 border-t border-[rgba(8,8,8,0.1)]"><ShareButtons title={item.title} /></div>
      </article>
    </div>
  );
}