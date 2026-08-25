import React from 'react';
import { Link } from 'react-router-dom';

const CAT_LABEL = { symphonic: 'Симфоническая', piano: 'Фортепианная', songs: 'Песни' };

export default function AlbumCard({ album, index = 0 }) {
  return (
    <Link to={`/music/album/${album.slug}`} className="group block">
      <div className="aspect-square overflow-hidden bg-[#1a1a1a] mb-4 relative">
        {album.cover ? (
          <img src={album.cover} alt={album.title} className="h-full w-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" />
        ) : (
          <div className="h-full w-full flex items-center justify-center font-serif-display text-6xl text-[#C5A059]">{album.title?.[0] || 'Ш'}</div>
        )}
      </div>
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="font-serif-display text-xl text-[#080808] group-hover:text-[#8B0000] transition-colors leading-tight">{album.title}</h3>
        {album.year && <span className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9]">{album.year}</span>}
      </div>
      {album.categories?.length > 0 && (
        <p className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] mt-1">
          {album.categories.map(c => CAT_LABEL[c] || c).join(' • ')}
        </p>
      )}
    </Link>
  );
}