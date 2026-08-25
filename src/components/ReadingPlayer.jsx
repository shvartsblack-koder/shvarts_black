import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Loader2, Headphones } from 'lucide-react';
import Equalizer from '@/components/Equalizer';

function fmt(t) {
  if (!t || !isFinite(t)) return '0:00';
  const m = Math.floor(t / 60);
  const s = Math.floor(t % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function ReadingPlayer({ src, title, compact = false }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.9);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.volume = volume;
    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => setPlaying(false);
    const onWaiting = () => setLoading(true);
    const onPlaying = () => { setLoading(false); setPlaying(true); };
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    return () => { audio.pause(); audio.src = ''; };
  }, [src]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) a.play().catch(() => {});
    else a.pause();
    setPlaying(!a.paused);
  };

  const seek = (e) => {
    const a = audioRef.current;
    if (a && duration) a.currentTime = (parseFloat(e.target.value) / 100) * duration;
  };

  const setVol = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
  };

  const playBtn = (
    <button onClick={toggle} aria-label={playing ? 'Пауза' : 'Слушать авторскую читку'}
      className="h-11 w-11 rounded-full border border-[#FDFCF8]/40 flex items-center justify-center hover:bg-[#FDFCF8] hover:text-[#080808] transition-colors flex-shrink-0">
      {loading ? <Loader2 size={16} className="animate-spin" /> : playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
    </button>
  );

  if (compact) {
    if (!src) {
      return (
        <div className="inline-flex items-center gap-3 text-[#FDFCF8]/40" title="Авторская читка пока не загружена">
          <span className="h-11 w-11 rounded-full border border-[#FDFCF8]/20 flex items-center justify-center flex-shrink-0">
            <Headphones size={16} />
          </span>
          <span className="font-ui text-[9px] uppercase tracking-[0.2em]">Нет читки</span>
        </div>
      );
    }
    return (
      <div className="inline-flex items-center gap-3 text-[#FDFCF8]">
        {playBtn}
        <Equalizer active={playing} className="text-[#C5A059] h-6" />
        <span className="font-ui text-[9px] uppercase tracking-[0.2em] text-[#FDFCF8]/55">Слушать автора</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 bg-[#080808] text-[#FDFCF8] px-5 py-4 rounded-none">
      {playBtn}
      <div className="flex-1 min-w-0">
        <div className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#C5A059] mb-1">Авторская читка</div>
        <div className="font-serif-display text-base truncate">{title}</div>
      </div>
      <Equalizer active={playing} className="text-[#C5A059] mx-2 flex-shrink-0" />
      <div className="hidden sm:flex items-center gap-2 flex-1 max-w-xs">
        <span className="font-ui text-[10px] text-[#A9A9A9] tabular-nums">{fmt(progress)}</span>
        <input type="range" min={0} max={100} value={duration ? (progress / duration) * 100 : 0} onChange={seek}
          className="flex-1 h-[2px] bg-[#3a3a3a] appearance-none cursor-pointer accent-[#FDFCF8]" />
        <span className="font-ui text-[10px] text-[#A9A9A9] tabular-nums">{fmt(duration)}</span>
      </div>
      <div className="hidden md:flex items-center gap-2">
        <Volume2 size={14} className="text-[#A9A9A9]" />
        <input type="range" min={0} max={1} step={0.01} value={volume} onChange={setVol}
          className="w-16 h-[2px] bg-[#3a3a3a] appearance-none cursor-pointer accent-[#FDFCF8]" />
      </div>
    </div>
  );
}