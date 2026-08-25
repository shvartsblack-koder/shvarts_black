import React, { useEffect, useState } from 'react';
import { Image } from '@/components/ui/image';

const IMAGES = [
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/8c0f26f9e_generated_image.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/cdc446b0f_generated_image.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/699d2fd55_generated_image.png',
  'https://media.base44.com/images/public/6a7cf89663ffa8e0d4ea7f6d/035f2c432_generated_image.png',
];

const OVERLAY = {
  dark: 'linear-gradient(to bottom, rgba(8,8,8,0.35), rgba(8,8,8,0.25) 50%, rgba(8,8,8,0.70))',
  light: 'radial-gradient(ellipse at center, rgba(253,252,248,0.35), rgba(253,252,248,0.72) 65%, rgba(253,252,248,0.92))',
};

export default function BackgroundSlideshow({ interval = 5200, opacity = 0.9, variant = 'dark' }) {
  const [pair, setPair] = useState({ cur: 0, prev: 0 });

  useEffect(() => {
    const t = setInterval(() => {
      setPair(p => ({ prev: p.cur, cur: (p.cur + 1) % IMAGES.length }));
    }, interval);
    return () => clearInterval(t);
  }, [interval]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <div className="absolute inset-0" style={{ opacity }}>
        <div key={`prev-${pair.prev}`} className="absolute inset-0 bg-fade-out">
          <Image src={IMAGES[pair.prev]} alt="" fittingType="fill"
            className="h-full w-full object-cover grayscale contrast-125" />
        </div>
        <div key={`cur-${pair.cur}`} className="absolute inset-0 bg-reveal-down">
          <Image src={IMAGES[pair.cur]} alt="" fittingType="fill"
            className="h-full w-full object-cover grayscale contrast-125" />
        </div>
      </div>
      <div className="absolute inset-0" style={{ background: OVERLAY[variant] }} />
    </div>
  );
}