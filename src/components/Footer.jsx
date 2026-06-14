import React from 'react';

export default function Footer() {
  return (
    <footer className="relative py-12 px-6 border-t border-primary/8">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-lg tracking-[0.2em] gold-text">
          SHVARTS BLACK
        </div>
        <p className="text-xs text-foreground/25 font-body tracking-[0.15em]">
          © {new Date().getFullYear()} Shvarts Black. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {['YouTube', 'Spotify', 'Instagram'].map((s) => (
            <a
              key={s}
              href="#"
              className="text-xs text-foreground/30 hover:text-primary transition-colors font-body tracking-wider uppercase"
            >
              {s}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}