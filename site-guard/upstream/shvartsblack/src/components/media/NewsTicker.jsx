import React from 'react';

const OUTLETS = [
  // Marketers Media report — direct links
  { name: 'AP News', url: 'https://apnews.com/press-release/marketersmedia/press-release-0b7978fe189fccb182e915e3f6e37b38' },
  { name: 'Barchart', url: 'https://www.barchart.com/story/news/2412532/shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'StreetInsider', url: 'https://www.streetinsider.com/The+Financial+Capital/Shvarts+Black+Releases+Dreams+of+Belshazzar%2C+a+Classical+Album+Inspired+by+the+Lost+World+of+Babylon/26631464.html' },
  { name: 'Boston Herald', url: 'https://markets.financialcontent.com/bostonherald/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Star Tribune', url: 'https://markets.financialcontent.com/startribune/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Milwaukee Journal Sentinel', url: 'https://markets.financialcontent.com/jsonline/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'The San Diego Union-Tribune', url: 'https://markets.financialcontent.com/sandiego/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'The Sacramento Bee', url: 'https://studio-5.financialcontent.com/mi.sacbee/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'International Business Times', url: 'https://markets.financialcontent.com/ibtimes/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Press-Telegram', url: 'https://markets.financialcontent.com/presstelegram/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'WRAL', url: 'https://markets.financialcontent.com/wral/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'The Bakersfield Californian', url: 'https://bakersfield.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'WKOW', url: 'https://wkow.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'KVOA', url: 'https://kvoa.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'WBNG', url: 'https://wbng.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'WQOW', url: 'https://wqow.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Rockford Register Star', url: 'https://markets.financialcontent.com/gatehouse.rrstar/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'The Sun Chronicle', url: 'https://thesunchronicle.marketminute.com/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Minyanville', url: 'http://finance.minyanville.com/minyanville/news/article/marketersmedia-2026-6-11-shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon' },
  { name: 'Times of San Diego', url: 'https://pr.timesofsandiego.com/article/Shvarts-Black-Releases-Dreams-of-Belshazzar-a-Classical-Album-Inspired-by-the-Lost-World-of-Babylon/6a2a2ffeb4083d00021e9390' },
  { name: 'Washington City Paper', url: 'https://pr.washingtoncitypaper.com/article/Shvarts-Black-Releases-Dreams-of-Belshazzar-a-Classical-Album-Inspired-by-the-Lost-World-of-Babylon/6a2a2ffeb4083d00021e9390' },
  { name: 'The Salisbury Post', url: 'https://smb.salisburypost.com/article/Shvarts-Black-Releases-Dreams-of-Belshazzar-a-Classical-Album-Inspired-by-the-Lost-World-of-Babylon/6a2a2ffeb4083d00021e9390' },
  { name: 'The Winchester Sun', url: 'https://smb.winchestersun.com/article/Shvarts-Black-Releases-Dreams-of-Belshazzar-a-Classical-Album-Inspired-by-the-Lost-World-of-Babylon/6a2a2ffeb4083d00021e9390' },
  { name: 'MarketersMEDIA Newsroom', url: 'https://news.marketersmedia.com/shvarts-black-releases-dreams-of-belshazzar-a-classical-album-inspired-by-the-lost-world-of-babylon/89194639' },
  // EIN Presswire report — major outlets
  { name: 'Google News', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Bloomberg Terminal', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'USA TODAY Network', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'MuckRack', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Crunchbase', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Music Industry Today', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'International Music Online', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Musical Earth Today', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Emirates Cultural Journal', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'UAE Daily Journal', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'The Persian Gulf Newswire', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'Fox News', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
  { name: 'HuffPost', url: 'https://www.einpresswire.com/article/921466461/shvarts-black-presents-dreams-of-belshazzar-a-classical-album-rooted-in-ancient-babylon' },
];

// Duplicate for seamless loop
const DOUBLED = [...OUTLETS, ...OUTLETS];

export default function NewsTicker() {
  return (
    <div className="relative overflow-hidden py-4 mb-12 border-y border-primary/10">
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-[#080808] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-[#080808] to-transparent z-10 pointer-events-none" />

      <div className="flex gap-0 ticker-track">
        {DOUBLED.map((outlet, i) => (
          <a
            key={i}
            href={outlet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 px-6 text-xs tracking-[0.2em] uppercase font-body text-foreground/35 hover:text-primary transition-colors duration-300 whitespace-nowrap border-r border-primary/10 last:border-r-0"
          >
            {outlet.name}
          </a>
        ))}
      </div>

      <style>{`
        .ticker-track {
          animation: ticker-scroll 60s linear infinite;
          width: max-content;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}