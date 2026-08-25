import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import SEO from '@/components/SEO';
import { useAudioPlayer } from '@/lib/audioPlayerContext';
import { Play, Pause, ChevronLeft, ExternalLink, Music2 } from 'lucide-react';

const CAT_LABEL = { symphonic: 'Симфоническая', piano: 'Фортепианная', songs: 'Песни' };

function enrichTrack(track, album) {
  if (!track) return track;
  return {
    ...track,
    albumTitle: album?.title,
    cover: track.cover || album?.cover,
  };
}

export default function Album() {
  const { albumSlug } = useParams();
  const { playTrack, currentTrack, isPlaying, toggle } = useAudioPlayer();
  const [album, setAlbum] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const al = await base44.entities.MusicAlbum.filter({ slug: albumSlug });
        setAlbum(al?.[0] || null);
        const tr = await base44.entities.MusicTrack.filter({ album: albumSlug }, 'trackNumber', 100);
        setTracks(tr || []);
      } catch {} finally { setLoading(false); }
    })();
  }, [albumSlug]);

  const playable = tracks
    .filter((t) => t.audioFile)
    .map((t) => enrichTrack(t, album));

  const playAlbum = () => {
    if (playable.length) playTrack(playable[0], playable, 0);
  };

  const playTrackFn = (track) => {
    if (!track?.audioFile) return;
    const enriched = playable.length
      ? playable
      : [enrichTrack(track, album)];
    const idx = enriched.findIndex((t) => t.id === track.id);
    if (idx >= 0) playTrack(enriched[idx], enriched, idx);
  };

  const isCurrent = (track) => currentTrack?.id === track.id;

  if (loading) return <div className="pt-32 h-64 flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#080808]/20 border-t-[#080808] rounded-full animate-spin" /></div>;
  if (!album) return <div className="pt-40 text-center font-serif-display text-3xl italic text-[#6B6B6B]">Альбом не найден.</div>;

  return (
    <div className="pt-28 md:pt-32 pb-24">
      <SEO title={`${album.title} — ШВАРЦ ЧÖРНЫЙ`} description={album.description} image={album.cover}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'MusicAlbum', name: album.title, byArtist: { '@type': 'MusicGroup', name: 'ШВАРЦ ЧÖРНЫЙ' }, datePublished: album.year, image: album.cover }} />

      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <Link to="/music" className="inline-flex items-center gap-2 font-ui text-[11px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] transition-colors mb-10">
          <ChevronLeft size={14} strokeWidth={1.5} /> Музыка
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="aspect-square overflow-hidden bg-[#1a1a1a] sticky top-28">
            {album.cover ? <img src={album.cover} alt={album.title} className="h-full w-full object-cover grayscale" /> :
              <div className="h-full w-full flex items-center justify-center font-serif-display text-8xl text-[#C5A059]">{album.title[0]}</div>}
          </div>
          <div>
            {album.categories?.length > 0 && (
              <p className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#8B0000] mb-4">{album.categories.map(c => CAT_LABEL[c] || c).join(' • ')}</p>
            )}
            <h1 className="font-serif-display text-5xl md:text-7xl leading-none">{album.title}</h1>
            {album.year && <p className="font-ui text-[12px] tracking-[0.2em] text-[#A9A9A9] mt-4">{album.year}</p>}
            {album.description && <p className="font-serif-display text-xl italic text-[#6B6B6B] mt-6 leading-relaxed">{album.description}</p>}
            {album.longDescription && <p className="font-serif-display text-base text-[#2B2B2B] mt-4 leading-relaxed whitespace-pre-wrap">{album.longDescription}</p>}

            {playable.length > 0 && (
              <button onClick={playAlbum} className="mt-8 inline-flex items-center gap-3 bg-[#080808] text-[#FDFCF8] px-8 py-4 font-ui text-[12px] uppercase tracking-[0.2em] hover:bg-[#8B0000] transition-colors">
                <Play size={15} strokeWidth={1.5} /> Слушать альбом
              </button>
            )}

            {album.streamingLinks?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-3">
                {album.streamingLinks.map((s, i) => (
                  <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 border border-[rgba(8,8,8,0.15)] px-4 py-2 font-ui text-[11px] uppercase tracking-[0.15em] hover:bg-[#080808] hover:text-[#FDFCF8] transition-colors">
                    {s.service} <ExternalLink size={12} strokeWidth={1.5} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-6">Треклист</h2>
          <div className="border-t border-[rgba(8,8,8,0.1)]">
            {tracks.map((t, i) => {
              const canPlay = Boolean(t.audioFile);
              const active = isCurrent(t);
              const playingHere = active && isPlaying;

              return (
                <div
                  key={t.id}
                  role={canPlay ? 'button' : undefined}
                  tabIndex={canPlay ? 0 : undefined}
                  onClick={() => {
                    if (!canPlay) return;
                    if (active) toggle();
                    else playTrackFn(t);
                  }}
                  onKeyDown={(e) => {
                    if (!canPlay) return;
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (active) toggle();
                      else playTrackFn(t);
                    }
                  }}
                  className={`flex items-center gap-4 py-4 border-b border-[rgba(8,8,8,0.08)] group transition-colors
                    ${canPlay ? 'cursor-pointer hover:bg-[rgba(8,8,8,0.03)]' : ''}
                    ${active ? 'bg-[rgba(8,8,8,0.04)]' : ''}`}
                >
                  <span className="font-ui text-[11px] tracking-[0.15em] text-[#A9A9A9] w-6 tabular-nums">{String(t.trackNumber || i + 1).padStart(2, '0')}</span>
                  {canPlay ? (
                    <span
                      aria-hidden="true"
                      className={`h-8 w-8 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors
                        ${playingHere ? 'bg-[#080808] text-[#FDFCF8] border-[#080808]' : 'border-[#080808] group-hover:bg-[#080808] group-hover:text-[#FDFCF8]'}`}
                    >
                      {playingHere
                        ? <Pause size={12} strokeWidth={1.5} />
                        : <Play size={12} strokeWidth={1.5} className="ml-0.5" />}
                    </span>
                  ) : (
                    <Music2 size={14} className="text-[#A9A9A9] flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/music/album/${albumSlug}/${t.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className={`font-serif-display text-xl transition-colors ${active ? 'text-[#8B0000]' : 'group-hover:text-[#8B0000]'}`}
                    >
                      {t.title}
                    </Link>
                    {t.performers && <p className="font-ui text-[11px] text-[#A9A9A9]">{t.performers}</p>}
                    {!canPlay && (
                      <p className="font-ui text-[10px] uppercase tracking-[0.15em] text-[#A9A9A9] mt-1">Аудио скоро</p>
                    )}
                  </div>
                  {t.lyrics && (
                    <Link
                      to={`/music/album/${albumSlug}/${t.slug}`}
                      onClick={(e) => e.stopPropagation()}
                      className="font-ui text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] hover:text-[#080808] hidden sm:block"
                    >
                      Текст
                    </Link>
                  )}
                  {t.duration && <span className="font-ui text-[11px] text-[#A9A9A9] tabular-nums">{t.duration}</span>}
                </div>
              );
            })}
            {!tracks.length && <p className="font-serif-display italic text-[#A9A9A9] py-6">Композиции появятся скоро.</p>}
          </div>
        </div>

        {album.credits && (
          <div className="mt-16">
            <h2 className="font-ui text-[11px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-4">Credits</h2>
            <p className="font-serif-display text-base text-[#2B2B2B] whitespace-pre-wrap leading-relaxed">{album.credits}</p>
          </div>
        )}
      </div>
    </div>
  );
}
