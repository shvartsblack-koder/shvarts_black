import React from 'react';

export default function SectionHeading({ overline, title, description, dark = false }) {
  const c = dark ? '#FDFCF8' : '#080808';
  const sub = dark ? '#A9A9A9' : '#6B6B6B';
  return (
    <div className="mb-12 md:mb-16">
      {overline && <p className="font-ui text-[11px] uppercase tracking-[0.3em] mb-4" style={{ color: sub }}>{overline}</p>}
      <h1 className="font-serif-display text-5xl md:text-7xl leading-[0.95] tracking-tight" style={{ color: c }}>{title}</h1>
      {description && <p className="font-serif-display text-lg md:text-xl italic mt-6 max-w-2xl leading-relaxed" style={{ color: sub }}>{description}</p>}
    </div>
  );
}