import React from 'react';
import { Link } from 'react-router-dom';
import { Headphones } from 'lucide-react';

export default function PoemCard({ poem, categorySlug, index = 0 }) {
  return (
    <Link to={`/poetry/${categorySlug}/${poem.slug}`}
      className="group block py-6 border-b border-[rgba(8,8,8,0.08)] transition-all duration-500 hover:pl-4">
      <div className="flex items-baseline justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <span className="font-ui text-[10px] tracking-[0.2em] text-[#A9A9A9] tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-serif-display text-2xl md:text-3xl text-[#080808] group-hover:text-[#8B0000] transition-colors leading-tight">
              {poem.title}
            </h3>
            {poem.audioReading && (
              <Headphones size={14} strokeWidth={1.5} className="text-[#C5A059] flex-shrink-0" />
            )}
          </div>
          {poem.excerpt && (
            <p className="font-serif-display text-base text-[#6B6B6B] italic mt-2 line-clamp-2 leading-snug">
              {poem.excerpt}
            </p>
          )}
        </div>
        <div className="flex-shrink-0 text-right">
          {poem.creationYear && (
            <span className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9]">{poem.creationYear}</span>
          )}
        </div>
      </div>
    </Link>
  );
}