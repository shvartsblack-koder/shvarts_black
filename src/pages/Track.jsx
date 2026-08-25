import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { useAudioPlayer } from '@/lib/audioPlayerContext';
import { Play, ChevronLeft } from 'lucide-react';

export default function Track() {
  const { albumSlug, trackSlug } = useParams();
  const { playTrack } = useAudioPlayer();
  const [track, setTrack] = useState(null);
  const [album, setAlbum] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const tr = await base44.entities.MusicTrack.filter({ slug: trackSlug, album: albumSlug });
        const t = tr?.[0];
        setTrack(t || null);
        if (t) {
          const al = await base44.entities.MusicAlbum.filter({ slug: albumSlug });
          setAlbum(al?.[0] || null);
        }
      } catch {} finally { setLoading(false); }
    })();
  }, [albumSlug, trackSlug]);

  if (loading) return <div className="pt-32 h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div>;
  if (!track) return <div className="pt-40 text-center font-serif-display text-3xl italic text-[#6B6B6B]">Композиция не найдена.</div>;

  const cover = track.cover || album?.cover;

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title={`${track.title} — ${album?.title || ''} — ШВАРЦ ЧÖРНЫЙ`} description={track.performers} image={cover}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'MusicRecording', name: track.title, byArtist: { '@type': 'MusicGroup', name: 'ШВАРЦ ЧÖРНЫЙ' }, inAlbum: { '@type': 'MusicAlbum', name: album?.title }, duration: track.duration }} />
      <div className="max-w-3xl mx-auto px-6 md:px-10">
        <Link to={`/music/album/${albumSlug}`} className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors mb-10">
          <ChevronLeft size={14} strokeWidth={1.5} /> {album?.title || 'Альбом'}
        </Link>

        {cover && <div className="aspect-square w-full max-w-md overflow-hidden bg-[#1a1a1a] mb-10"><img src={cover} alt="" className="h-full w-full object-cover grayscale" /></div>}

        <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#8B0000] mb-3">{album?.title}</p>
        <h1 className="font-serif-display text-5xl md:text-6xl leading-none">{track.title}</h1>
        {track.duration && <p className="font-ui text-[12px] tracking-[0.2em] text-[#A9A9A9] mt-4">{track.duration}</p>}

        {track.audioFile && (
          <button onClick={() => playTrack({ ...track, albumTitle: album?.title, cover }, [{ ...track, albumTitle: album?.title, cover }], 0)}
            className="mt-8 inline-flex items-center gap-3 bg-[#080808] text-[#FDFCF8] px-8 py-4 font-ui text-[12px] uppercase tracking-[0.2em] hover:bg-[#8B0000] transition-colors">
            <Play size={15} strokeWidth={1.5} /> Слушать
          </button>
        )}

        <div className="mt-10 space-y-4 font-ui text-sm text-[#2B2B2B]">
          {track.compositionAuthor && <p><span className="text-[#A9A9A9] uppercase tracking-[0.15em] text-[11px]">Музыка:</span> {track.compositionAuthor}</p>}
          {track.lyricsAuthor && <p><span className="text-[#A9A9A9] uppercase tracking-[0.15em] text-[11px]">Текст:</span> {track.lyricsAuthor}</p>}
          {track.performers && <p><span className="text-[#A9A9A9] uppercase tracking-[0.15em] text-[11px]">Исполнители:</span> {track.performers}</p>}
        </div>

        {track.lyrics && (
          <div className="mt-12 pt-8 border-t border-[rgba(8,8,8,0.1)]">
            <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-6">Текст</h2>
            <article className="font-serif-display text-xl leading-[1.7] whitespace-pre-wrap">{track.lyrics}</article>
          </div>
        )}

        {track.video && (
          <div className="mt-12 aspect-video">
            <iframe src={track.video} className="w-full h-full" allowFullScreen title={track.title} />
          </div>
        )}
      </div>
    </div>
  );
}