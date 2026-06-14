import React, { useState } from 'react';
import { Send, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SectionReveal from '../SectionReveal';
import GoldenRule from '../GoldenRule';
import { toast } from 'sonner';

const SOCIALS = [
  { name: 'YouTube', url: 'https://www.youtube.com/channel/UCG5Xv9uA4LP1JjBbFzin-wA' },
  { name: 'Spotify', url: 'https://open.spotify.com/artist/32AY38EQm46S7I64U5dups' },
  { name: 'Apple Music', url: 'https://music.apple.com/us/artist/shvarts-black/6772389995' },
  { name: 'Instagram', url: '#' },
  { name: 'TikTok', url: '#' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61590208422142' },
];

export default function ContactSection() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSending(true);
    // Simulate send
    await new Promise((r) => setTimeout(r, 1500));
    toast.success('Message sent successfully. We will be in touch.');
    setForm({ name: '', email: '', subject: '', message: '' });
    setSending(false);
  };

  return (
    <section id="contact" className="relative py-24 md:py-36 px-6 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-[#080808] to-[#050505]" />
      <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent ml-[5%]" />
      <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/8 to-transparent mr-[5%]" />

      <div className="relative z-10 max-w-5xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-16 md:mb-20">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">Get in Touch</p>
            <h2 className="font-display text-4xl md:text-6xl font-light tracking-wide gold-text">
              Contact
            </h2>
            <GoldenRule className="mt-6" />
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-3">
            <SectionReveal delay={0.1}>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-body mb-2 block">Name *</label>
                    <Input
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="bg-[#0a0a0a] border-primary/15 text-foreground/80 focus:border-primary/40 h-12 font-body tracking-wide"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-body mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="bg-[#0a0a0a] border-primary/15 text-foreground/80 focus:border-primary/40 h-12 font-body tracking-wide"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-body mb-2 block">Subject</label>
                  <Select value={form.subject} onValueChange={(v) => setForm({ ...form, subject: v })}>
                    <SelectTrigger className="bg-[#0a0a0a] border-primary/15 text-foreground/80 h-12 font-body tracking-wide">
                      <SelectValue placeholder="Select a subject" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0a0a0a] border-primary/20">
                      <SelectItem value="commission">Commission</SelectItem>
                      <SelectItem value="collaboration">Collaboration</SelectItem>
                      <SelectItem value="scores">Score Request</SelectItem>
                      <SelectItem value="media">Media Inquiry</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-xs tracking-[0.2em] uppercase text-foreground/40 font-body mb-2 block">Message *</label>
                  <Textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className="bg-[#0a0a0a] border-primary/15 text-foreground/80 focus:border-primary/40 font-body tracking-wide resize-none"
                    placeholder="Your message..."
                  />
                </div>

                <Button
                  type="submit"
                  disabled={sending}
                  className="w-full sm:w-auto px-10 py-3 h-12 bg-primary text-primary-foreground hover:bg-primary/80 text-xs tracking-[0.2em] uppercase font-body transition-all duration-500"
                >
                  {sending ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send size={14} />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </SectionReveal>
          </div>

          {/* Info */}
          <div className="lg:col-span-2">
            <SectionReveal delay={0.2}>
              <div className="space-y-8">
                <div>
                  <h4 className="font-display text-lg tracking-wider text-foreground/80 mb-3">Email</h4>
                  <a
                    href="mailto:hello@shvarts.black"
                    className="flex items-center gap-2 text-primary/70 hover:text-primary transition-colors font-body text-sm tracking-wide"
                  >
                    <Mail size={14} />
                    hello@shvarts.black
                  </a>
                </div>

                <div>
                  <h4 className="font-display text-lg tracking-wider text-foreground/80 mb-4">Follow</h4>
                  <div className="flex flex-wrap gap-3">
                    {SOCIALS.map((s) => (
                      <a
                        key={s.name}
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-primary/15 text-foreground/40 text-xs tracking-[0.15em] uppercase font-body hover:text-primary hover:border-primary/30 transition-all duration-400"
                      >
                        {s.name}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-primary/10">
                  <p className="text-xs text-foreground/30 font-body leading-relaxed tracking-wide">
                    For commissions, collaborations, score requests, and media inquiries.
                    Response within 48 hours.
                  </p>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}