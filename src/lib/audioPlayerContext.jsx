import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [queue, setQueue] = useState([]);
  const [queueIndex, setQueueIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;
    const onTime = () => setProgress(audio.currentTime);
    const onDur = () => setDuration(audio.duration || 0);
    const onEnd = () => next();
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onWaiting = () => setIsLoading(true);
    const onPlaying = () => setIsLoading(false);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onDur);
    audio.addEventListener('ended', onEnd);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('playing', onPlaying);
    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onDur);
      audio.removeEventListener('ended', onEnd);
    };
    // eslint-disable-next-line
  }, []);

  const playTrack = useCallback((track, trackQueue = [], index = 0) => {
    const audio = audioRef.current;
    if (!audio || !track) return;
    if (trackQueue.length) {
      setQueue(trackQueue);
      setQueueIndex(index);
    } else {
      setQueue([track]);
      setQueueIndex(0);
    }
    setCurrentTrack(track);
    audio.src = track.audioFile || track.audioReading;
    audio.play().catch(() => {});
  }, []);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  }, [currentTrack]);

  const next = useCallback(() => {
    if (queueIndex + 1 < queue.length) {
      const ni = queueIndex + 1;
      setQueueIndex(ni);
      const t = queue[ni];
      const audio = audioRef.current;
      setCurrentTrack(t);
      audio.src = t.audioFile || t.audioReading;
      audio.play().catch(() => {});
    }
  }, [queueIndex, queue]);

  const prev = useCallback(() => {
    if (queueIndex > 0) {
      const pi = queueIndex - 1;
      setQueueIndex(pi);
      const t = queue[pi];
      const audio = audioRef.current;
      setCurrentTrack(t);
      audio.src = t.audioFile || t.audioReading;
      audio.play().catch(() => {});
    }
  }, [queueIndex, queue]);

  const seek = useCallback((time) => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = time;
  }, []);

  const setVolume = useCallback((v) => {
    setVolumeState(v);
    if (audioRef.current) audioRef.current.volume = v;
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (audio) { audio.pause(); audio.currentTime = 0; }
    setCurrentTrack(null);
    setQueue([]);
    setQueueIndex(-1);
  }, []);

  return (
    <AudioPlayerContext.Provider value={{
      currentTrack, isPlaying, progress, duration, volume,
      queue, queueIndex, isLoading,
      playTrack, toggle, next, prev, seek, setVolume, stop
    }}>
      {children}
    </AudioPlayerContext.Provider>
  );
}

export const useAudioPlayer = () => useContext(AudioPlayerContext);