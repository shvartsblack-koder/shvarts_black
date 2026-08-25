import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import GlobalAudioPlayer from '@/components/GlobalAudioPlayer';
import FilmGrain from '@/components/FilmGrain';
import { playPageFlip } from '@/lib/sound';

export default function Layout() {
  const location = useLocation();
  useEffect(() => {
    playPageFlip();
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  return (
    <div className="paper-bg min-h-screen flex flex-col">
      <FilmGrain />
      <Navbar />
      <main className="flex-1 page-enter" key={location.pathname}>
        <Outlet />
      </main>
      <Footer />
      <GlobalAudioPlayer />
    </div>
  );
}