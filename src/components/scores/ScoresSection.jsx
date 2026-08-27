import React, { useState, useMemo } from 'react';
import { Download, Mail } from 'lucide-react';
import SectionReveal from '../SectionReveal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALBUMS } from '../../lib/albumsData';
import { submitForm } from '../../lib/submitForm';
import { toast } from 'sonner';

export default function ScoresSection() {
  const [albumId, setAlbumId] = useState('');
  const [composition, setComposition] = useState('');
  const [sending, setSending] = useState(false);

  const selectedAlbum = useMemo(() => ALBUMS.find((a) => a.id === albumId), [albumId]);

  const compositions = useMemo(() => {
    if (!selectedAlbum) return [];
    if (selectedAlbum.scores && selectedAlbum.scores.length) {
      return selectedAlbum.scores.map((s) => s.title);
    }
    return selectedAlbum.tracks.map((t) => t.title);
  }, [selectedAlbum]);

  const validate = () => {
    if (!albumId || !composition) {
      toast.error('Please select an album and a composition.');
      return false;
    }
    return true;
  };

  const handleRequest = async () => {
    if (!validate() || sending) return;
    setSending(true);
    try {
      await submitForm({
        type: 'score_request',
        subject: 'Score Request',
        album: selectedAlbum?.title || albumId,
        composition,
        message: `Score request: ${selectedAlbum?.title || albumId} — ${composition}`,
      });
      toast.success(`Score request sent for "${composition}".`);
    } catch (err) {
      console.error(err);
      toast.error('Could not send request. Please try again or email hello@shvarts.black.');
    } finally {
      setSending(false);
    }
  };

  const handlePreview = async () => {
    if (!validate() || sending) return;
    setSending(true);
    try {
      await submitForm({
        type: 'score_preview',
        subject: 'Score Preview',
        album: selectedAlbum?.title || albumId,
        composition,
        message: `Preview request: ${selectedAlbum?.title || albumId} — ${composition}`,
      });
      toast.success(`Preview request recorded for "${composition}". We will follow up shortly.`);
    } catch (err) {
      console.error(err);
      toast.error('Could not send request. Please try again or email hello@shvarts.black.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section id="scores" className="relative py-16 md:py-24 lg:py-32 px-6 overflow-hidden">
      {/* Vellum background */}
      <div className="absolute inset-0 vellum-bg" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#E2DED0] via-[#D8D4C6] to-[#E2DED0] opacity-50" />

      <div className="relative z-10 max-w-3xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-10 md:mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-[#8B7D5E] font-body mb-4">Archive</p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-[#1a1a1a]">
              Scores & Sheet Music
            </h2>
            <div className="flex items-center justify-center gap-4 mt-6">
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-[#8B7D5E]/50" />
              <div className="w-1.5 h-1.5 rotate-45 bg-[#8B7D5E]/60" />
              <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-[#8B7D5E]/50" />
            </div>
            <p className="mt-6 text-sm text-[#1a1a1a]/50 font-body tracking-wide max-w-xl mx-auto leading-relaxed">
              Select an album and a specific composition to request the full score or download a preview.
            </p>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="p-6 md:p-10 border border-[#1a1a1a]/10 bg-white/40 backdrop-blur-sm">
            <div className="space-y-5">
              {/* Album select */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8B7D5E] font-body mb-2 block">Album</label>
                <Select
                  value={albumId}
                  onValueChange={(v) => {
                    setAlbumId(v);
                    setComposition('');
                  }}
                >
                  <SelectTrigger className="h-14 bg-white/70 border-[#1a1a1a]/20 text-[#1a1a1a] font-body text-base tracking-wide">
                    <SelectValue placeholder="Select an album" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F5F2E8] border-[#1a1a1a]/20 text-[#1a1a1a] max-h-72">
                    {ALBUMS.map((a) => (
                      <SelectItem
                        key={a.id}
                        value={a.id}
                        className="text-base py-3 text-[#1a1a1a] cursor-pointer focus:bg-[#3d2a2a] focus:text-[#F5F2E8] data-[highlighted]:bg-[#3d2a2a] data-[highlighted]:text-[#F5F2E8]"
                      >
                        {a.title} — {a.year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Composition list — always visible & scrollable */}
              <div>
                <label className="text-xs tracking-[0.2em] uppercase text-[#8B7D5E] font-body mb-2 block">
                  Composition
                </label>
                {selectedAlbum ? (
                  <div className="max-h-64 overflow-y-auto border border-[#1a1a1a]/15 bg-white/70 divide-y divide-[#1a1a1a]/10 scores-composition-scroll">
                    {compositions.map((c, i) => {
                      const active = c === composition;
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setComposition(c)}
                          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left font-body text-sm tracking-wide transition-colors duration-200 ${
                            active
                              ? 'bg-[#1a1a1a] text-[#E2DED0]'
                              : 'text-[#1a1a1a]/75 hover:bg-[#8B7D5E]/15'
                          }`}
                        >
                          <span
                            className={`flex-shrink-0 w-6 h-6 flex items-center justify-center text-[11px] font-medium border ${
                              active
                                ? 'border-[#C5A059] text-[#C5A059]'
                                : 'border-[#1a1a1a]/20 text-[#8B7D5E]'
                            }`}
                          >
                            {i + 1}
                          </span>
                          <span className="leading-snug">{c}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="h-14 flex items-center px-4 border border-dashed border-[#1a1a1a]/20 bg-white/40 text-[#1a1a1a]/40 font-body text-sm tracking-wide">
                    Select an album first
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRequest}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-[#1a1a1a] text-[#E2DED0] text-xs tracking-[0.15em] uppercase font-body hover:bg-[#C5A059] hover:text-[#050505] transition-all duration-500 disabled:opacity-50"
                >
                  <Mail size={13} /> {sending ? 'Sending...' : 'Request Score'}
                </button>
                <button
                  type="button"
                  onClick={handlePreview}
                  disabled={sending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-[#1a1a1a]/20 text-[#1a1a1a]/60 text-xs tracking-[0.15em] uppercase font-body hover:border-[#8B7D5E]/50 hover:text-[#8B7D5E] transition-all duration-500 disabled:opacity-50"
                >
                  <Download size={13} /> Download Preview
                </button>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}