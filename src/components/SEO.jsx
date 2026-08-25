import { useEffect } from 'react';

const SITE_ORIGIN = 'https://shvarts.black';
const DEFAULT_IMAGE = `${SITE_ORIGIN}/og-default.jpg`;

function absoluteUrl(url) {
  if (!url) return DEFAULT_IMAGE;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `${SITE_ORIGIN}${url.startsWith('/') ? url : `/${url}`}`;
}

function canonicalFromLocation() {
  if (typeof window === 'undefined') return `${SITE_ORIGIN}/`;
  const path = window.location.pathname || '/';
  return `${SITE_ORIGIN}${path === '/' ? '/' : path.replace(/\/$/, '')}`;
}

export default function SEO({
  title,
  description,
  image,
  jsonLd,
  type = 'website',
  noindex = false,
}) {
  useEffect(() => {
    if (title) document.title = title;

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    const ogImage = absoluteUrl(image);
    const canonicalHref = canonicalFromLocation();

    setMeta('description', description);
    setMeta('robots', noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large');

    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', canonicalHref, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:image:secure_url', ogImage, 'property');
    setMeta('og:site_name', 'ШВАРЦ ЧÖРНЫЙ', 'property');
    setMeta('og:locale', 'ru_RU', 'property');

    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);
    setMeta('twitter:card', 'summary_large_image');

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalHref;

    let ldEl = document.getElementById('jsonld-dynamic');
    if (jsonLd) {
      if (!ldEl) {
        ldEl = document.createElement('script');
        ldEl.id = 'jsonld-dynamic';
        ldEl.type = 'application/ld+json';
        document.head.appendChild(ldEl);
      }
      ldEl.textContent = JSON.stringify(jsonLd);
    } else if (ldEl) {
      ldEl.textContent = '';
    }

    return () => {
      if (ldEl) ldEl.textContent = '';
    };
  }, [title, description, image, jsonLd, type, noindex]);

  return null;
}
