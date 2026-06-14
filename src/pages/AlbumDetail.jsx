import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Mail } from 'lucide-react';
import { ALBUMS } from '../lib/albumsData';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import GoldenRule from '../components/GoldenRule';
import AudioPlayer from '../components/albums/AudioPlayer';

export default function AlbumDetail() {
  const { albumId } = useParams();
  const album = ALBUMS.find((a) => a.id === albumId);

  if (!album) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-center">
          <p className="text-foreground/40 font-body mb-4">Album not found.</p>
          <Link to="/" className="text-primary font-body text-sm tracking-widest uppercase">← Return Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-foreground overflow-x-hidden">
      <Navigation />

      {/* Hero */}
      <section className="relative min-h-[70vh] flex items-end pb-16 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={album.gallery[0]}
            alt={album.title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/70 to-[#050505]/40" />
          <div
            className="absolute inset-0 opacity-20"
            style={{ background: `radial-gradient(ellipse at 50% 100%, ${album.color}88 0%, transparent 60%)` }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-foreground/40 hover:text-primary text-xs tracking-[0.2em] uppercase font-body transition-colors mb-10"
          >
            <ArrowLeft size={14} /> Back to Albums
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-end">
            {/* Cover */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="lg:col-span-4"
            >
              <div className="relative aspect-square max-w-xs mx-auto lg:mx-0 shadow-2xl">
                <img src={album.image} alt={album.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 border border-primary/20" />
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="lg:col-span-8"
            >
              <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-3">
                {album.year} · SHVARTS BLACK
              </p>
              <h1 className="font-display text-4xl md:text-6xl font-light tracking-wide text-foreground mb-4">
                {album.title}
              </h1>
              <div className="flex flex-wrap gap-2 mb-6">
                {album.genres.map((g) => (
                  <span key={g} className="px-3 py-1 border border-primary/20 text-primary/60 text-xs tracking-[0.15em] uppercase font-body">
                    {g}
                  </span>
                ))}
              </div>
              <GoldenRule className="justify-start mb-6" />
              <p className="text-foreground/60 font-body text-base leading-[1.8] font-light max-w-2xl mb-8">
                {album.longDescription}
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="#player"
                  className="flex items-center gap-2 px-7 py-3 bg-primary text-primary-foreground text-xs tracking-[0.2em] uppercase font-body hover:bg-primary/80 transition-all duration-400"
                  onClick={(e) => { e.preventDefault(); document.getElementById('player')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Listen
                </a>
                <button className="flex items-center gap-2 px-7 py-3 border border-primary/30 text-primary text-xs tracking-[0.2em] uppercase font-body hover:bg-primary/10 transition-all duration-400">
                  <Download size={13} /> Request Score
                </button>
                <a
                  href="#contact"
                  className="flex items-center gap-2 px-7 py-3 border border-foreground/10 text-foreground/40 text-xs tracking-[0.2em] uppercase font-body hover:text-foreground/70 hover:border-foreground/20 transition-all duration-400"
                >
                  <Mail size={13} /> Contact
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      <section id="player" className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground/80 mb-2">
              Listen
            </h2>
            <p className="text-xs text-foreground/25 font-body tracking-widest uppercase mb-8">
              {album.tracks.length} Tracks · Select a track to play
            </p>
            <AudioPlayer tracks={album.tracks} albumColor={album.color} />
          </motion.div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-2xl md:text-3xl tracking-wider text-foreground/80 mb-8">
            Gallery
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {album.gallery.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15 }}
                className={`relative overflow-hidden group ${i === 0 ? 'md:col-span-2 aspect-video' : 'aspect-square'}`}
              >
                <img
                  src={img}
                  alt={`${album.title} gallery ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[#050505]/20 group-hover:bg-[#050505]/0 transition-all duration-500" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Scores section — only for albums with scores data */}
      {album.scores && (
        <section className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <div className="vellum-bg p-5 sm:p-8 md:p-12">
              <h2 className="font-display text-2xl md:text-3xl tracking-wider text-[#1a1a1a] mb-2">
                Sheet Music & Scores
              </h2>
              <p className="text-sm text-[#1a1a1a]/50 font-body mb-8 tracking-wide">
                Available for purchase, preview, or on request for performers and institutions.
              </p>
              <div className="space-y-3">
                {album.scores.map((score, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.07 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-4 border-b border-[#1a1a1a]/10 last:border-0"
                  >
                    <div>
                      <p className="font-body text-[#1a1a1a]/80 font-medium tracking-wide">{score.title}</p>
                      <p className="text-xs text-[#8B7D5E] font-body tracking-wider mt-0.5">
                        {score.pages} pages · {score.difficulty}
                      </p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1a1a1a] text-[#E2DED0] text-xs tracking-[0.15em] uppercase font-body hover:bg-[#C5A059] hover:text-[#050505] transition-all duration-400 text-center">
                        Request Score
                      </button>
                      <button className="flex-1 sm:flex-none px-4 py-2.5 border border-[#1a1a1a]/20 text-[#1a1a1a]/50 text-xs tracking-[0.15em] uppercase font-body hover:border-[#8B7D5E]/50 hover:text-[#8B7D5E] transition-all duration-400 text-center">
                        Preview
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}