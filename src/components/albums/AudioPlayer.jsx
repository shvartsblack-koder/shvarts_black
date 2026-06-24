import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Shuffle, Repeat } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function formatTime(sec) {
  if (!isFinite(sec) || isNaN(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Parse "m:ss" duration string to seconds for display purposes
function parseDuration(str) {
  if (!str) return 0;
  const parts = str.split(':');
  return parseInt(parts[0]) * 60 + parseInt(parts[1]);
}

export default function AudioPlayer({ tracks, albumColor }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  const track = tracks[currentIndex];
  // Use parsed duration as fallback when no audio src loaded
  const displayDuration = duration || parseDuration(track?.duration);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = muted ? 0 : volume;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    // reset when track changes
    setCurrentTime(0);
    setDuration(0);
    const audio = audioRef.current;
    if (!audio) return;
    audio.load();
    if (isPlaying) audio.play().catch(() => {});
  }, [currentIndex]);

  const onTimeUpdate = useCallback(() => {
    const audio = audioRef.current;
    if (audio) setCurrentTime(audio.currentTime);
  }, []);

  const onLoadedMetadata = useCallback(() => {
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) setDuration(audio.duration);
  }, []);

  const onEnded = useCallback(() => {
    if (repeat) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }
    if (shuffle) {
      let next = currentIndex;
      while (next === currentIndex && tracks.length > 1) {
        next = Math.floor(Math.random() * tracks.length);
      }
      setCurrentIndex(next);
    } else {
      const next = (currentIndex + 1) % tracks.length;
      setCurrentIndex(next);
    }
  }, [currentIndex, tracks.length, shuffle, repeat]);

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    const audio = audioRef.current;
    if (audio && isFinite(audio.duration)) {
      audio.currentTime = ratio * audio.duration;
      setCurrentTime(audio.currentTime);
    }
  };

  const prev = () => {
    if (currentTime > 3 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % tracks.length);
  };

  const progress = displayDuration > 0 ? currentTime / displayDuration : 0;

  return (
    <div className="w-full">
      {/* Audio element — uses real URL if available, otherwise demo mode */}
      <audio
        ref={audioRef}
        src={track?.audioUrl || undefined}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />

      {/* Now playing bar */}
      <div
        className="relative rounded-sm overflow-hidden"
        style={{ background: `linear-gradient(135deg, #0a0a0a 0%, ${albumColor}33 100%)` }}
      >
        {/* Waveform visualizer (decorative) */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none overflow-hidden">
          {Array.from({ length: 80 }).map((_, i) => (
            <div
              key={i}
              className="w-0.5 mx-px flex-shrink-0 rounded-full"
              style={{
                height: `${30 + Math.sin(i * 0.4) * 20 + Math.sin(i * 0.9) * 15}%`,
                background: '#C5A059',
                opacity: isPlaying ? (0.4 + Math.random() * 0.6) : 0.4,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 p-6 md:p-8">
          {/* Track info */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border transition-all duration-300 ${isPlaying ? 'border-primary/60 bg-primary/10' : 'border-primary/20 bg-transparent'}`}
            >
              {isPlaying ? (
                <div className="flex gap-0.5 items-end h-4">
                  {[1, 2, 3].map((b) => (
                    <motion.div
                      key={b}
                      className="w-0.5 bg-primary rounded-full"
                      animate={{ height: ['30%', '100%', '50%', '80%', '30%'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15, ease: 'easeInOut' }}
                      style={{ minHeight: '4px' }}
                    />
                  ))}
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.p
                  key={track.number}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="font-body text-foreground/90 tracking-wide truncate"
                >
                  {track.title}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-foreground/30 font-body tracking-widest uppercase mt-0.5">
                Track {track.number} of {tracks.length}
              </p>
            </div>
            <span className="text-xs text-foreground/25 font-body tabular-nums flex-shrink-0">
              {formatTime(currentTime)} / {track.duration}
            </span>
          </div>

          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="relative h-1 bg-foreground/8 rounded-full cursor-pointer mb-6 group"
          >
            <div
              className="absolute left-0 top-0 h-full bg-primary rounded-full transition-all duration-100"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary border-2 border-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShuffle(!shuffle)}
                className={`p-2 rounded-sm transition-colors ${shuffle ? 'text-primary' : 'text-foreground/25 hover:text-foreground/60'}`}
                title="Shuffle"
              >
                <Shuffle size={14} />
              </button>
              <button
                onClick={() => setRepeat(!repeat)}
                className={`p-2 rounded-sm transition-colors ${repeat ? 'text-primary' : 'text-foreground/25 hover:text-foreground/60'}`}
                title="Repeat"
              >
                <Repeat size={14} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={prev}
                className="p-2 text-foreground/50 hover:text-foreground/90 transition-colors"
              >
                <SkipBack size={18} />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/80 transition-all duration-300 shadow-lg shadow-primary/20"
              >
                {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-0.5" />}
              </button>
              <button
                onClick={next}
                className="p-2 text-foreground/50 hover:text-foreground/90 transition-colors"
              >
                <SkipForward size={18} />
              </button>
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMuted(!muted)}
                className="p-2 text-foreground/30 hover:text-foreground/70 transition-colors"
              >
                {muted || volume === 0 ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(parseFloat(e.target.value)); setMuted(false); }}
                className="w-16 md:w-24 accent-primary cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Track list */}
      <div className="mt-4 space-y-px">
        {tracks.map((t, i) => (
          <button
            key={t.number}
            onClick={() => {
              if (currentIndex === i) {
                setIsPlaying(!isPlaying);
              } else {
                setCurrentIndex(i);
                setIsPlaying(true);
              }
            }}
            className={`w-full group flex items-center gap-4 px-4 py-3.5 text-left transition-all duration-200 ${
              currentIndex === i
                ? 'bg-primary/8 border-l-2 border-primary'
                : 'border-l-2 border-transparent hover:bg-white/3 hover:border-l-primary/30'
            }`}
          >
            <div className="w-5 flex-shrink-0 flex items-center justify-center">
              {currentIndex === i && isPlaying ? (
                <div className="flex gap-0.5 items-end h-3">
                  {[1, 2, 3].map((b) => (
                    <motion.div
                      key={b}
                      className="w-0.5 bg-primary rounded-full"
                      animate={{ height: ['30%', '100%', '50%', '80%', '30%'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                      style={{ minHeight: '2px' }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  <span className={`text-xs font-body tabular-nums group-hover:hidden ${currentIndex === i ? 'text-primary' : 'text-foreground/25'}`}>
                    {t.number}
                  </span>
                  <Play size={10} className={`hidden group-hover:block ${currentIndex === i ? 'text-primary' : 'text-primary/60'}`} fill="currentColor" />
                </>
              )}
            </div>
            <span className={`flex-1 font-body text-sm tracking-wide transition-colors ${
              currentIndex === i ? 'text-foreground/90' : 'text-foreground/55 group-hover:text-foreground/80'
            }`}>
              {t.title}
            </span>
            <span className={`text-xs font-body tabular-nums ${currentIndex === i ? 'text-primary/60' : 'text-foreground/20'}`}>
              {t.duration}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}