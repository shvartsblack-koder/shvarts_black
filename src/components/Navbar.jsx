import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search as SearchIcon } from 'lucide-react';
import SoundToggle from '@/components/SoundToggle';

const NAV = [
  { label: 'Стихи', to: '/poetry' },
  { label: 'Музыка', to: '/music' },
  { label: 'Биография', to: '/biography' },
  { label: 'Новости', to: '/news' },
  { label: 'СМИ', to: '/media' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > lastY.current && y > 200) setHidden(true);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 inset-x-0 z-50 transition-transform duration-500 ${hidden ? '-translate-y-full' : 'translate-y-0'}`}>
        <div className={`transition-colors duration-500 ${scrolled || open ? 'bg-[#FDFCF8]/95 backdrop-blur-md border-b border-[rgba(8,8,8,0.08)]' : 'bg-transparent'}`}>
          <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
            <Link to="/" className="font-serif-display text-xl md:text-2xl tracking-tight text-[#080808] leading-none"
              onClick={() => window.scrollTo({ top: 0 })}>
              ШВАРЦ ЧÖРНЫЙ
            </Link>

            <div className="hidden md:flex items-center gap-8">
              {NAV.map((n) => (
                <Link key={n.to} to={n.to}
                  className={`font-ui text-[12px] uppercase tracking-[0.18em] transition-colors ${location.pathname.startsWith(n.to) ? 'text-[#080808]' : 'text-[#6B6B6B] hover:text-[#080808]'}`}>
                  {n.label}
                </Link>
              ))}
              <button onClick={() => navigate('/search')} aria-label="Поиск"
                className="text-[#6B6B6B] hover:text-[#080808] transition-colors">
                <SearchIcon size={17} strokeWidth={1.5} />
              </button>
            </div>

            <div className="flex items-center gap-4 md:hidden">
              <button onClick={() => navigate('/search')} aria-label="Поиск" className="text-[#080808]">
                <SearchIcon size={18} strokeWidth={1.5} />
              </button>
              <button onClick={() => setOpen(!open)} aria-label="Меню" className="text-[#080808]">
                {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div className={`fixed inset-0 z-40 bg-[#080808] text-[#FDFCF8] transition-all duration-500 md:hidden ${open ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className="h-full flex flex-col justify-center px-8">
          {NAV.map((n, i) => (
            <Link key={n.to} to={n.to}
              className="font-serif-display text-5xl py-3 border-b border-[rgba(253,252,248,0.1)] transition-colors hover:text-[#C5A059]"
              style={{ transitionDelay: `${i * 40}ms` }}>
              {n.label}
            </Link>
          ))}
          <div className="mt-10">
            <SoundToggle dark />
          </div>
        </div>
      </div>
    </>
  );
}