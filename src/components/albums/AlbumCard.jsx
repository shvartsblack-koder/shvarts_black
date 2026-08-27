import React from 'react';
import { motion } from 'framer-motion';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlbumCard({ album, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
      className="group relative flex-shrink-0 w-[260px] md:w-auto snap-start"
    >
      {/* Cover */}
      <div className="relative aspect-square overflow-hidden mb-4">
        <img
          src={album.image}
          alt={album.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-[#050505]/30 group-hover:bg-[#050505]/10 transition-all duration-500" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-700"
          style={{ background: `radial-gradient(ellipse at 50% 100%, ${album.color}99 0%, transparent 70%)` }}
        />

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="w-14 h-14 rounded-full border border-primary/60 bg-[#050505]/60 backdrop-blur-sm flex items-center justify-center">
            <Play size={20} className="text-primary ml-0.5" fill="currentColor" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary/0 group-hover:bg-primary/40 transition-all duration-700" />
      </div>

      {/* Genre tags */}
      <div className="flex flex-wrap gap-1 mb-2">
        {album.genres.slice(0, 2).map((g) => (
          <span key={g} className="text-[10px] tracking-[0.12em] uppercase text-primary/40 font-body">{g}</span>
        ))}
      </div>

      <h3 className="font-display text-lg md:text-xl tracking-wider text-foreground/90 mb-2 group-hover:text-primary/90 transition-colors duration-500 leading-tight">
        {album.title}
      </h3>
      <p className="text-xs text-foreground/35 font-body leading-relaxed font-light mb-4 line-clamp-2">
        {album.description}
      </p>

      <div className="flex gap-2 flex-wrap">
        <button className="flex items-center gap-1.5 px-4 py-2 border border-primary/30 text-primary text-xs tracking-[0.12em] uppercase hover:bg-primary/10 transition-all duration-300">
          <Play size={10} fill="currentColor" />
          Listen
        </button>
        <Link
          to={`/album/${album.id}`}
          className="flex items-center gap-1.5 px-4 py-2 border border-foreground/10 text-foreground/40 text-xs tracking-[0.12em] uppercase hover:text-foreground/70 hover:border-foreground/20 transition-all duration-300"
        >
          View Album
          <ArrowRight size={10} />
        </Link>
      </div>
    </motion.div>
  );
}