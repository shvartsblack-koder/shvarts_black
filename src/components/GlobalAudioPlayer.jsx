import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, X, Loader2 } from 'lucide-react';
import { useAudioPlayer } from '@/lib/audioPlayerContext';

function fmt(t) {
  if (!t || !isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function GlobalAudioPlayer() {
  const { currentTrack, isPlaying, progress, duration, volume, toggle, next, prev, seek, setVolume, stop, isLoading } = useAudioPlayer();
  const [volOpen, setVolOpen] = useState(false);
  if (!currentTrack) return null;

  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50">
      <div className="bg-[#080808] text-[#FDFCF8] border-t border-[rgba(253,252,248,0.08)]">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center gap-3 md:gap-5">
          {/* Cover */}
          <div className="h-10 w-10 md:h-14 md:w-14 flex-shrink-0 bg-[#1a1a1a] overflow-hidden">
            {currentTrack.cover ? (
              <img src={currentTrack.cover} alt="" className="h-full w-full object-cover opacity-80" />
            ) : (
              <div className="h-full w-full flex items-center justify-center font-serif-display text-lg text-[#C5A059]">Ш</div>
            )}
          </div>

          <div className="hidden sm:block min-w-0 flex-shrink-0 w-36 md:w-48">
            <div className="font-serif-display text-sm md:text-base truncate leading-tight">{currentTrack.title}</div>
            <div className="font-ui text-[10px] uppercase tracking-[0.15em] text-[#A9A9A9] truncate">{currentTrack.albumTitle || currentTrack.performers || ''}</div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2 md:gap-4 mx-auto">
            <button onClick={prev} aria-label="Предыдущий" className="text-[#A9A9A9] hover:text-[#FDFCF8] transition-colors disabled:opacity-30" disabled>
              <SkipBack size={16} strokeWidth={1.5} />
            </button>
            <button onClick={toggle} aria-label={isPlaying ? 'Пауза' : 'Слушать'}
              className="h-9 w-9 md:h-10 md:w-10 rounded-full border border-[rgba(253,252,248,0.3)] flex items-center justify-center hover:bg-[#FDFCF8] hover:text-[#080808] transition-colors">
              {isLoading ? <Loader2 size={16} className="animate-spin" strokeWidth={1.5} /> :
                isPlaying ? <Pause size={16} strokeWidth={1.5} /> : <Play size={16} strokeWidth={1.5} className="ml-0.5" />}
            </button>
            <button onClick={next} aria-label="Следующий" className="text-[#A9A9A9] hover:text-[#FDFCF8] transition-colors disabled:opacity-30" disabled>
              <SkipForward size={16} strokeWidth={1.5} />
            </button>
          </div>

          {/* Timeline */}
          <div className="hidden md:flex items-center gap-3 flex-1 min-w-0 max-w-md">
            <span className="font-ui text-[10px] text-[#A9A9A9] tabular-nums">{fmt(progress)}</span>
            <div className="flex-1 group">
              <input type="range" min={0} max={duration || 0} value={progress} step={0.1}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="w-full h-[2px] bg-[#3a3a3a] appearance-none cursor-pointer accent-[#FDFCF8]" />
            </div>
            <span className="font-ui text-[10px] text-[#A9A9A9] tabular-nums">{fmt(duration)}</span>
          </div>

          {/* Volume */}
          <div className="hidden md:flex items-center gap-2 relative" onMouseEnter={() => setVolOpen(true)} onMouseLeave={() => setVolOpen(false)}>
            <Volume2 size={15} strokeWidth={1.5} className="text-[#A9A9A9]" />
            <input type="range" min={0} max={1} step={0.01} value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-20 h-[2px] bg-[#3a3a3a] appearance-none cursor-pointer accent-[#FDFCF8]" />
          </div>

          <button onClick={stop} aria-label="Закрыть плеер" className="text-[#A9A9A9] hover:text-[#FDFCF8] transition-colors ml-1">
            <X size={15} strokeWidth={1.5} />
          </button>
        </div>
        {/* mobile timeline */}
        <div className="md:hidden h-[2px] bg-[#1a1a1a]">
          <div className="h-full bg-[#FDFCF8]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}