import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { isSoundEnabled, setSoundEnabled } from '@/lib/sound';

export default function SoundToggle({ dark = false }) {
  const [on, setOn] = useState(isSoundEnabled());
  useEffect(() => {
    const handler = () => setOn(isSoundEnabled());
    window.addEventListener('sound-changed', handler);
    return () => window.removeEventListener('sound-changed', handler);
  }, []);

  const toggle = () => setSoundEnabled(!on);

  const color = dark ? '#FDFCF8' : (on ? '#080808' : '#6B6B6B');

  return (
    <button onClick={toggle} aria-pressed={on}
      className={`flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] transition-colors ${dark ? 'text-[#FDFCF8]' : 'text-[#6B6B6B] hover:text-[#080808]'}`}>
      {on ? <Volume2 size={14} strokeWidth={1.5} style={{ color }} /> : <VolumeX size={14} strokeWidth={1.5} style={{ color }} />}
      <span>Звук интерфейса: {on ? 'Вкл' : 'Выкл'}</span>
    </button>
  );
}