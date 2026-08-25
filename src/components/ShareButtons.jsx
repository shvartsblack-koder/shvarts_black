import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, Send, MessageCircle } from 'lucide-react';

export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const text = title ? `${title} — Шварц Чорный` : 'Шварц Чорный';

  const enc = encodeURIComponent(shareUrl);
  const encText = encodeURIComponent(text);

  const links = [
    { label: 'Telegram', icon: Send, href: `https://t.me/share/url?url=${enc}&text=${encText}` },
    { label: 'WhatsApp', icon: MessageCircle, href: `https://wa.me/?text=${encText}%20${enc}` },
    { label: 'VK', icon: MessageCircle, href: `https://vk.com/share.php?url=${enc}&title=${encText}` },
    { label: 'X', icon: Send, href: `https://twitter.com/intent/tweet?text=${encText}&url=${enc}` },
    { label: 'Facebook', icon: MessageCircle, href: `https://www.facebook.com/sharer/sharer.php?u=${enc}` },
  ];

  const copy = async () => {
    try { await navigator.clipboard.writeText(shareUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <span className="font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B]">Поделиться</span>
      <div className="flex items-center gap-3">
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer"
             aria-label={`Поделиться в ${l.label}`}
             className="text-[#6B6B6B] hover:text-[#080808] transition-colors">
            <l.icon size={16} strokeWidth={1.5} />
          </a>
        ))}
        <button onClick={copy} aria-label="Скопировать ссылку"
          className="text-[#6B6B6B] hover:text-[#080808] transition-colors">
          {copied ? <Check size={16} strokeWidth={1.5} /> : <Copy size={16} strokeWidth={1.5} />}
        </button>
      </div>
    </div>
  );
}