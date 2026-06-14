import React from 'react';
import Navigation from '../components/Navigation';
import HeroSection from '../components/hero/HeroSection';
import AboutSection from '../components/about/AboutSection';
import BiographySection from '../components/biography/BiographySection';
import AlbumsSection from '../components/albums/AlbumsSection';
import ScoresSection from '../components/scores/ScoresSection';
import MediaSection from '../components/media/MediaSection';
import ContactSection from '../components/contact/ContactSection';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-foreground overflow-x-hidden">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <BiographySection />
      <AlbumsSection />
      <ScoresSection />
      <MediaSection />
      <ContactSection />
      <Footer />
    </div>
  );
}