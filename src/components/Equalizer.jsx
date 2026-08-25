import React from 'react';

// Equalizer visualization for audio playback.
// `active` => bars dance; paused => bars rest low. `bars` count adjustable.
const BARS = [
  { dur: '0.7s', delay: '0s', peak: 0.9 },
  { dur: '0.9s', delay: '0.15s', peak: 1 },
  { dur: '0.6s', delay: '0.3s', peak: 0.7 },
  { dur: '1.1s', delay: '0.05s', peak: 0.85 },
  { dur: '0.8s', delay: '0.25s', peak: 0.95 },
  { dur: '0.65s', delay: '0.4s', peak: 0.6 },
  { dur: '1s', delay: '0.1s', peak: 0.8 },
];

export default function Equalizer({ active = false, className = '' }) {
  return (
    <div className={`flex items-end gap-[3px] h-7 ${className}`} aria-hidden="true">
      {BARS.map((b, i) => (
        <span
          key={i}
          className="eq-bar w-[3px] bg-current rounded-[1px]"
          style={{
            height: active ? `${b.peak * 100}%` : '18%',
            animationDuration: b.dur,
            animationDelay: b.delay,
            animationPlayState: active ? 'running' : 'paused',
          }}
        />
      ))}
    </div>
  );
}