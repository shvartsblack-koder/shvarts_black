import React, { useMemo } from 'react';

// Atmospheric animated backgrounds: snow, ink, smoke, none.
// Respects prefers-reduced-motion via CSS.
export default function AtmosphereBackground({ type = 'none', image, overlay = 0.5, mobileImage }) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const bg = isMobile && mobileImage ? mobileImage : image;

  const flakes = useMemo(() => {
    if (type !== 'snow') return [];
    return Array.from({ length: 40 }, (_, i) => ({
      left: Math.random() * 100,
      delay: Math.random() * 10,
      dur: 8 + Math.random() * 12,
      size: 1 + Math.random() * 3,
      op: 0.3 + Math.random() * 0.5,
    }));
  }, [type]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {bg && (
        <img src={bg} alt="" className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: 'grayscale(1) contrast(1.05)', animation: type === 'ink' ? 'inkDrift 18s ease-in-out infinite' : undefined }} />
      )}
      <div className="absolute inset-0" style={{ background: `rgba(8,8,8,${overlay})` }} />
      {type === 'snow' && (
        <div className="absolute inset-0">
          {flakes.map((f, i) => (
            <span key={i} className="absolute rounded-full bg-white"
              style={{
                left: `${f.left}%`, top: '-5%',
                width: f.size, height: f.size, opacity: f.op,
                animation: `snowfall ${f.dur}s linear ${f.delay}s infinite`,
              }} />
          ))}
        </div>
      )}
      {type === 'smoke' && (
        <div className="absolute inset-0 opacity-40"
          style={{ background: 'radial-gradient(circle at 30% 80%, rgba(253,252,248,0.15), transparent 50%), radial-gradient(circle at 70% 20%, rgba(253,252,248,0.1), transparent 50%)', animation: 'inkDrift 12s ease-in-out infinite' }} />
      )}
    </div>
  );
}