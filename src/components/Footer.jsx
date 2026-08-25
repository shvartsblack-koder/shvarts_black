import React from 'react';
import { Link } from 'react-router-dom';
import SoundToggle from '@/components/SoundToggle';

export default function Footer() {
  return (
    <footer className="ink-bg mt-32">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="font-serif-display text-3xl tracking-tight">ШВАРЦ ЧÖРНЫЙ</div>
            <p className="font-ui text-[12px] tracking-[0.15em] uppercase text-[#A9A9A9] mt-3">Поэзия • Музыка • Истории</p>
          </div>
          <div>
            <ul className="space-y-2 font-ui text-sm text-[#A9A9A9]">
              {[['Поэзия','/poetry'],['Музыка','/music'],['Биография','/biography'],['Новости','/news'],['СМИ','/media'],['Избранное','/favorites']].map(([l,t])=>(
                <li key={t}><Link to={t} className="hover:text-[#FDFCF8] transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div className="space-y-4">
            <ul className="space-y-2 font-ui text-sm text-[#A9A9A9]">
              <li><a href="mailto:contact@schwartz-chorny.com" className="hover:text-[#FDFCF8] transition-colors">contact@schwartz-chorny.com</a></li>
            </ul>
            <div className="flex gap-4 font-ui text-[12px] uppercase tracking-[0.15em] text-[#A9A9A9]">
              <a href="#" className="hover:text-[#FDFCF8]">Telegram</a>
              <a href="#" className="hover:text-[#FDFCF8]">YouTube</a>
              <a href="#" className="hover:text-[#FDFCF8]">Spotify</a>
            </div>
          </div>
        </div>
        <div className="mt-14 pt-6 border-t border-[rgba(253,252,248,0.1)] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <p className="font-ui text-[11px] tracking-[0.15em] uppercase text-[#6B6B6B]">© ШВАРЦ ЧÖРНЫЙ</p>
          <SoundToggle dark />
        </div>
      </div>
    </footer>
  );
}