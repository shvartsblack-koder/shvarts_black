#!/usr/bin/env node
/**
 * Base44 site guard: keeps Base44 archive updates from breaking forms, navigation,
 * favicons / Open Graph and SEO / GEO settings.
 *
 *   node site-guard/guard.mjs snapshot  [--app A]              record the current state as the baseline
 *   node site-guard/guard.mjs apply     --zip FILE [--app A]   merge a Base44 ZIP export, keeping protected files
 *   node site-guard/guard.mjs build     [--app A]              install + build with the configured env (+ spa-pages)
 *   node site-guard/guard.mjs spa-pages [--app A]              copy dist/index.html to <route>.html so GitHub Pages answers 200
 *   node site-guard/guard.mjs verify    [--app A] [--dist] [--require-webhook] [--report FILE]
 *   node site-guard/guard.mjs live      [--app A] [--url URL] [--no-mirrors] [--report FILE]
 *   node site-guard/guard.mjs test-lead [--app A] [--webhook URL]
 *   node site-guard/guard.mjs restore   --ref GIT_REF [--app A]
 *   node site-guard/guard.mjs protected [--app A]
 *
 * Every app is described by site-guard/<app>.manifest.json: `config` is edited by hand,
 * `baseline` is written by `snapshot`. No dependencies beyond Node 20, git and unzip.
 */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const GUARD_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO = path.resolve(GUARD_DIR, '..');
const MANIFEST_SUFFIX = '.manifest.json';

const SRC_EXT = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs']);
const HASHED_PUBLIC = /^(favicon[^/]*|apple-touch-icon[^/]*|icon-[^/]*\.(png|svg|ico)|og[^/]*\.(png|jpe?g|webp|svg)|site\.webmanifest|manifest\.json|robots\.txt|CNAME)$/i;
const SUPERSET_PUBLIC = ['sitemap.xml', 'llms.txt'];
const REPO_INFRA = ['vercel.json', 'scripts/build-vercel.sh'];
const LINK_RELS = new Set(['icon', 'shortcut icon', 'apple-touch-icon', 'apple-touch-icon-precomposed', 'manifest', 'canonical', 'alternate', 'mask-icon']);
const META_NAMES = new Set(['description', 'robots', 'googlebot', 'yandex', 'keywords', 'author', 'yandex-verification', 'google-site-verification', 'msvalidate.01', 'application-name', 'apple-mobile-web-app-title']);
const ARCHIVE_SKIP = [/^\.git(\/|$)/, /(^|\/)node_modules(\/|$)/, /^dist(\/|$)/, /(^|\/)\.env(\.|$)/, /^base44\/\.app\.jsonc$/, /(^|\/)\.DS_Store$/, /^__MACOSX(\/|$)/];
const REPO_SKIP = [/^site-guard(\/|$)/, /^\.github(\/|$)/, /^CNAME$/, /^vercel\.json$/, /^scripts(\/|$)/, /^base44-inbox(\/|$)/];
const AREAS = {
  forms: '1. Отправка форм',
  clicks: '2. Кнопки и разделы',
  brand: '3. Фавиконы и Open Graph',
  seo: '4. SEO / GEO и статьи',
  build: 'Сборка и деплой',
};

// ---------- helpers ----------

const posix = (p) => p.split(path.sep).join('/');
const exists = (p) => fs.existsSync(p);
const readText = (p) => fs.readFileSync(p, 'utf8');
const sha256 = (buf) => crypto.createHash('sha256').update(buf).digest('hex');
const repoPath = (...parts) => path.join(REPO, ...parts);
const joinRel = (root, rel) => (root === '.' || !root ? rel : posix(path.join(root, rel)));
const uniq = (arr) => [...new Set(arr)];

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith('--')) { args._.push(a); continue; }
    const key = a.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) args[key] = true;
    else { args[key] = next; i++; }
  }
  return args;
}

function walk(dir, base = dir, out = []) {
  if (!exists(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'dist') continue;
      walk(full, base, out);
    } else if (entry.isFile()) {
      out.push(posix(path.relative(base, full)));
    }
  }
  return out;
}

function loadManifests(appFilter) {
  const files = fs.readdirSync(GUARD_DIR).filter((f) => f.endsWith(MANIFEST_SUFFIX)).sort();
  const list = files.map((f) => {
    const file = path.join(GUARD_DIR, f);
    const data = JSON.parse(readText(file));
    if (!data.config?.app) throw new Error(`${f}: config.app is required`);
    return { file, data };
  });
  const filtered = appFilter ? list.filter((m) => m.data.config.app === appFilter) : list;
  if (!filtered.length) throw new Error(appFilter ? `No manifest for app "${appFilter}"` : 'No manifests in site-guard/');
  return filtered;
}

function cfg(m) {
  const c = m.data.config;
  return {
    root: '.',
    basePath: '/',
    seoRoot: true,
    distDir: 'dist',
    leadModule: 'src/lib/submitLead.js',
    leadFunction: 'submitLead',
    webhookEnv: 'VITE_LEADS_WEBHOOK_URL',
    webhookPattern: 'script.google.com/macros/s/',
    ignoreLinkPrefixes: ['/api'],
    extraProtected: [],
    mirrors: [],
    ...c,
  };
}

// ---------- extraction ----------

function parseAttrs(tag) {
  const attrs = {};
  for (const m of tag.matchAll(/([a-zA-Z_:.-]+)\s*=\s*("([^"]*)"|'([^']*)')/g)) {
    attrs[m[1].toLowerCase()] = m[3] ?? m[4];
  }
  return attrs;
}

function extractHead(html) {
  const head = (html.match(/<head[^>]*>([\s\S]*?)<\/head>/i) || [null, html])[1];
  const tags = {};
  const add = (k, v) => {
    let key = k;
    for (let i = 2; key in tags; i++) key = `${k}#${i}`;
    tags[key] = v;
  };
  const title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (title) add('title', title[1].trim());
  for (const m of head.matchAll(/<link\b[^>]*>/gi)) {
    const a = parseAttrs(m[0]);
    const rel = (a.rel || '').toLowerCase().trim();
    if (!LINK_RELS.has(rel)) continue;
    add(`link:${rel}|${a.sizes || ''}|${a.type || ''}|${a.hreflang || ''}|${a.media || ''}`, a.href || '');
  }
  for (const m of head.matchAll(/<meta\b[^>]*>/gi)) {
    const a = parseAttrs(m[0]);
    const name = (a.name || '').toLowerCase();
    const prop = (a.property || '').toLowerCase();
    if (prop && /^(og|article|fb):/.test(prop)) add(`meta:${prop}`, a.content || '');
    else if (name && (META_NAMES.has(name) || name.startsWith('twitter:'))) add(`meta:${name}`, a.content || '');
  }
  const jsonLd = [];
  const jsonLdErrors = [];
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try { jsonLd.push(JSON.stringify(JSON.parse(m[1]))); } catch (e) { jsonLdErrors.push(e.message); }
  }
  return { tags, jsonLd, jsonLdErrors };
}

function normValue(v, basePath) {
  if (typeof v !== 'string') return v;
  let out = v.replace(/%BASE_URL%/g, '/').trim();
  for (const b of uniq([basePath, encodeURI(basePath)])) {
    if (b !== '/' && out.startsWith(b)) out = '/' + out.slice(b.length);
  }
  return out;
}

function localHeadRefs(tags) {
  return Object.entries(tags)
    .filter(([k, v]) => k.startsWith('link:') && !k.startsWith('link:canonical') && !k.startsWith('link:alternate') && v && !/^https?:\/\//.test(v))
    .map(([, v]) => v);
}

function srcFiles(c) {
  return walk(repoPath(c.root, 'src')).filter((f) => SRC_EXT.has(path.extname(f))).map((f) => `src/${f}`);
}

function extractRoutes(c, files) {
  const routes = new Set();
  for (const f of files) {
    const text = readText(repoPath(c.root, f));
    for (const m of text.matchAll(/<Route\b[^>]*?\bpath=\{?\s*["'`]([^"'`]+)["'`]/g)) {
      const p = m[1].trim();
      if (p === '*') continue;
      routes.add(p.startsWith('/') ? p : `/${p}`);
    }
  }
  return [...routes].sort();
}

function extractLinks(c, files) {
  const links = [];
  const re = /(?:\b(?:to|href|path|link|url|navigate)\s*[:=(]\s*\{?\s*)["'`](\/[^"'`\s]*)["'`]/g;
  for (const f of files) {
    const text = readText(repoPath(c.root, f));
    for (const m of text.matchAll(re)) {
      if (/<Route\b[^>]*$/.test(text.slice(Math.max(0, m.index - 200), m.index))) continue;
      let p = m[1];
      if (p.startsWith('//')) continue;
      p = p.replace(/\$\{[^}]*\}/g, ':x');
      if (/[${}]/.test(p)) continue;
      p = p.split('#')[0].split('?')[0] || '/';
      if (/\.[a-z0-9]{2,5}$/i.test(p)) continue;
      if (c.ignoreLinkPrefixes.some((pre) => p === pre || p.startsWith(pre.endsWith('/') ? pre : `${pre}/`) || p === `${pre}/`)) continue;
      links.push({ path: p, file: f });
    }
  }
  return links;
}

function routeMatches(link, routes) {
  const ls = link.split('/').filter(Boolean);
  return routes.some((r) => {
    const rs = r.split('/').filter(Boolean);
    const star = rs.indexOf('*');
    if (star !== -1) return ls.length >= star && rs.slice(0, star).every((s, i) => s.startsWith(':') || ls[i] === ':x' || s === ls[i]);
    if (rs.length !== ls.length) return false;
    return rs.every((s, i) => s.startsWith(':') || ls[i] === ':x' || s === ls[i] || safeDecode(s) === safeDecode(ls[i]));
  });
}

function safeDecode(s) {
  try { return decodeURIComponent(s); } catch { return s; }
}

function formScan(c, files) {
  const callRe = new RegExp(`\\b${c.leadFunction}\\s*\\(`);
  const formFiles = [];
  const leadFiles = [];
  for (const f of files) {
    if (f === c.leadModule) continue;
    const text = readText(repoPath(c.root, f));
    if (/<form\b|onSubmit=/.test(text)) formFiles.push(f);
    if (callRe.test(text)) leadFiles.push(f);
  }
  return { formFiles, leadFiles };
}

function sitemapUrls(xml) {
  return [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1]).sort();
}

function textLines(text) {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

function hashedFiles(c) {
  const out = [];
  const pub = repoPath(c.root, 'public');
  if (exists(pub)) {
    for (const f of fs.readdirSync(pub)) if (HASHED_PUBLIC.test(f)) out.push(joinRel(c.root, `public/${f}`));
  }
  for (const f of ['CNAME', 'vite.config.js', c.leadModule]) out.push(joinRel(c.root, f));
  const wf = repoPath('.github', 'workflows');
  if (exists(wf)) for (const f of fs.readdirSync(wf)) if (/\.ya?ml$/.test(f)) out.push(`.github/workflows/${f}`);
  out.push(...REPO_INFRA);
  return uniq(out).filter((p) => exists(repoPath(p))).sort();
}

function protectedList(c) {
  const out = [joinRel(c.root, 'index.html'), joinRel(c.root, 'src/lib/formValidation.js')];
  const pub = repoPath(c.root, 'public');
  if (exists(pub)) {
    for (const f of fs.readdirSync(pub)) if (HASHED_PUBLIC.test(f) || SUPERSET_PUBLIC.includes(f)) out.push(joinRel(c.root, `public/${f}`));
  }
  for (const f of c.extraProtected) out.push(joinRel(c.root, f));
  out.push(...hashedFiles(c));
  return uniq(out).filter((p) => exists(repoPath(p))).sort();
}

// ---------- snapshot ----------

function cmdSnapshot(m) {
  const c = cfg(m);
  const files = srcFiles(c);
  const indexHtml = readText(repoPath(c.root, 'index.html'));
  const head = extractHead(indexHtml);
  if (head.jsonLdErrors.length) throw new Error(`${c.app}: invalid JSON-LD in index.html: ${head.jsonLdErrors.join('; ')}`);
  const routes = extractRoutes(c, files);
  const links = extractLinks(c, files);
  const broken = uniq(links.filter((l) => !routeMatches(l.path, routes)).map((l) => l.path)).sort();
  const { formFiles, leadFiles } = formScan(c, files);
  const sitemapFile = repoPath(c.root, 'public', 'sitemap.xml');
  const llmsFile = repoPath(c.root, 'public', 'llms.txt');
  const hashes = {};
  for (const p of hashedFiles(c)) hashes[p] = sha256(fs.readFileSync(repoPath(p)));

  m.data.baseline = {
    snapshotAt: new Date().toISOString(),
    gitCommit: git(['rev-parse', '--short', 'HEAD'], true),
    routes,
    knownBrokenLinks: broken,
    hashLinks: countHashLinks(c, files),
    leadFormFiles: leadFiles.sort(),
    formAllowlist: formFiles.filter((f) => !leadFiles.includes(f)).sort(),
    head: { tags: head.tags, jsonLd: head.jsonLd },
    files: hashes,
    sitemapUrls: exists(sitemapFile) ? sitemapUrls(readText(sitemapFile)) : [],
    llmsLines: exists(llmsFile) ? textLines(readText(llmsFile)) : [],
    protectedFiles: protectedList(c),
  };
  fs.writeFileSync(m.file, `${JSON.stringify(m.data, null, 2)}\n`);
  const b = m.data.baseline;
  console.log(`[${c.app}] baseline saved: ${b.routes.length} routes, ${b.leadFormFiles.length} lead forms, ${Object.keys(b.head.tags).length} head tags, ${b.sitemapUrls.length} sitemap URLs, ${b.protectedFiles.length} protected files`);
  if (broken.length) console.log(`[${c.app}] WARNING: links without a route (recorded as known): ${broken.join(', ')}`);
}

function countHashLinks(c, files) {
  let n = 0;
  for (const f of files) n += (readText(repoPath(c.root, f)).match(/href=["']#["']/g) || []).length;
  return n;
}

function git(args, soft = false) {
  try { return execFileSync('git', args, { cwd: REPO, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim(); } catch (e) {
    if (soft) return '';
    throw e;
  }
}

// ---------- verify ----------

class Results {
  constructor(app) { this.app = app; this.items = []; }
  ok(area, msg) { this.items.push({ level: 'ok', area, msg }); }
  warn(area, msg) { this.items.push({ level: 'warn', area, msg }); }
  fail(area, msg) { this.items.push({ level: 'fail', area, msg }); }
  get failed() { return this.items.some((i) => i.level === 'fail'); }
  render(title) {
    const icon = { ok: '✅', warn: '⚠️', fail: '❌' };
    const lines = [`## ${title}: ${this.app} — ${this.failed ? '❌ НЕ ПРОЙДЕНО' : '✅ ПРОЙДЕНО'}`, ''];
    for (const [area, label] of Object.entries(AREAS)) {
      const items = this.items.filter((i) => i.area === area);
      if (!items.length) continue;
      lines.push(`### ${label}`);
      for (const i of items) lines.push(`- ${icon[i.level]} ${i.msg}`);
      lines.push('');
    }
    return lines.join('\n');
  }
}

function compareHead(r, area, where, expected, actual, basePath) {
  let bad = 0;
  for (const [key, val] of Object.entries(expected)) {
    if (!(key in actual)) { r.fail(area, `${where}: пропал тег ${key} (было: ${val})`); bad++; continue; }
    if (normValue(actual[key], basePath) !== normValue(val, basePath)) {
      r.fail(area, `${where}: изменён ${key}: «${actual[key]}» вместо «${val}»`);
      bad++;
    }
  }
  return bad;
}

function splitHeadTags(tags) {
  const brand = {};
  const seo = {};
  for (const [k, v] of Object.entries(tags)) {
    if (k.startsWith('meta:og:') || k.startsWith('meta:twitter:') || k.startsWith('meta:fb:') || /^link:(icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed|manifest|mask-icon)\|/.test(k)) brand[k] = v;
    else seo[k] = v;
  }
  return { brand, seo };
}

function cmdVerify(m, args) {
  const c = cfg(m);
  const b = m.data.baseline;
  const r = new Results(c.app);
  if (!b) { r.fail('build', 'нет baseline — сначала выполните snapshot'); return r; }
  const files = srcFiles(c);

  // 1. forms
  const leadPath = repoPath(c.root, c.leadModule);
  if (!exists(leadPath)) r.fail('forms', `нет модуля отправки ${c.leadModule}`);
  else {
    const lead = readText(leadPath);
    if (!lead.includes(c.webhookEnv)) r.fail('forms', `${c.leadModule} не использует ${c.webhookEnv}`);
    if (!/\bfetch\s*\(/.test(lead)) r.fail('forms', `${c.leadModule} не отправляет запрос (нет fetch)`);
    if (!r.items.some((i) => i.area === 'forms')) r.ok('forms', `${c.leadModule} на месте и шлёт в ${c.webhookEnv}`);
  }
  const { formFiles, leadFiles } = formScan(c, files);
  for (const f of b.leadFormFiles) {
    if (!files.includes(f)) r.fail('forms', `форма удалена или переименована: ${f} (заявки с неё перестанут приходить)`);
    else if (!leadFiles.includes(f)) r.fail('forms', `${f} больше не вызывает ${c.leadFunction}() — переподключите форму к webhook`);
  }
  const unwired = formFiles.filter((f) => !leadFiles.includes(f) && !b.formAllowlist.includes(f) && !b.leadFormFiles.includes(f));
  for (const f of unwired) r.fail('forms', `новая форма ${f} не подключена к ${c.leadFunction}(). Если это не лид-форма (вход, админка, форум), подтвердите у владельца и выполните snapshot`);
  const newLead = leadFiles.filter((f) => !b.leadFormFiles.includes(f));
  if (newLead.length) r.ok('forms', `новые подключённые формы: ${newLead.join(', ')}`);
  for (const req of c.requiredPatterns || []) {
    const file = repoPath(c.root, req.file);
    if (!exists(file) || !readText(file).includes(req.text)) r.fail(req.area || 'build', `в ${req.file} пропало «${req.text}» — ${req.why}`);
  }
  if (!r.items.some((i) => i.area === 'forms' && i.level === 'fail')) r.ok('forms', `${leadFiles.length} форм вызывают ${c.leadFunction}()`);

  // 2. clicks
  const routes = extractRoutes(c, files);
  const lostRoutes = b.routes.filter((p) => !routes.includes(p));
  for (const p of lostRoutes) r.fail('clicks', `пропал роут ${p} — ссылки и страницы из sitemap станут 404`);
  const links = extractLinks(c, files);
  const brokenNow = new Map();
  for (const l of links) if (!routeMatches(l.path, routes)) brokenNow.set(l.path, [...(brokenNow.get(l.path) || []), l.file]);
  for (const [p, where] of brokenNow) {
    if (b.knownBrokenLinks.includes(p)) continue;
    r.fail('clicks', `ссылка ${p} ведёт в никуда (нет такого роута): ${uniq(where).join(', ')}`);
  }
  const stillBroken = b.knownBrokenLinks.filter((p) => brokenNow.has(p));
  if (stillBroken.length) r.warn('clicks', `известные ссылки без страницы (были и до обновления): ${stillBroken.join(', ')}`);
  const hashLinks = countHashLinks(c, files);
  if (hashLinks > b.hashLinks) r.fail('clicks', `ссылок-заглушек href="#" стало ${hashLinks} (было ${b.hashLinks})`);
  if (!r.items.some((i) => i.area === 'clicks' && i.level === 'fail')) r.ok('clicks', `${routes.length} роутов, ${links.length} внутренних ссылок проверено`);

  // 3 + 4. head, files, SEO
  const indexHtml = readText(repoPath(c.root, 'index.html'));
  const head = extractHead(indexHtml);
  const { brand, seo } = splitHeadTags(b.head.tags);
  const badBrand = compareHead(r, 'brand', 'index.html', brand, head.tags, c.basePath);
  const badSeo = compareHead(r, 'seo', 'index.html', seo, head.tags, c.basePath);
  for (const ref of localHeadRefs(head.tags)) {
    const rel = normValue(ref, c.basePath).replace(/^\//, '');
    if (!exists(repoPath(c.root, 'public', rel))) r.fail('brand', `index.html ссылается на отсутствующий файл public/${rel}`);
  }
  for (const [p, hash] of Object.entries(b.files)) {
    if (p === 'vercel.json' && process.env.VERCEL) continue; // Vercel rewrites it inside the build container
    const area = /\.github|vercel\.json|build-vercel|vite\.config|CNAME/.test(p) ? 'build' : p.endsWith(c.leadModule) ? 'forms' : /robots\.txt/.test(p) ? 'seo' : 'brand';
    if (!exists(repoPath(p))) r.fail(area, `удалён защищённый файл ${p}`);
    else if (sha256(fs.readFileSync(repoPath(p))) !== hash) r.fail(area, `изменён защищённый файл ${p} (верните: node site-guard/guard.mjs restore --ref main)`);
  }
  if (!badBrand && !r.items.some((i) => i.area === 'brand' && i.level === 'fail')) r.ok('brand', `фавиконы, OG и Twitter-теги совпадают с эталоном (${Object.keys(brand).length} тегов)`);

  if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(indexHtml)) r.fail('seo', 'в index.html появился noindex');
  for (const e of head.jsonLdErrors) r.fail('seo', `JSON-LD не парсится: ${e}`);
  for (const j of b.head.jsonLd) if (!head.jsonLd.includes(j)) r.fail('seo', `изменена или удалена разметка JSON-LD: ${j.slice(0, 120)}…`);
  const sitemapFile = repoPath(c.root, 'public', 'sitemap.xml');
  if (b.sitemapUrls.length) {
    if (!exists(sitemapFile)) r.fail('seo', 'удалён public/sitemap.xml');
    else {
      const now = sitemapUrls(readText(sitemapFile));
      for (const u of b.sitemapUrls.filter((x) => !now.includes(x))) r.fail('seo', `из sitemap пропал URL ${u} (URL удалять нельзя, только редирект)`);
      for (const u of now) {
        const p = urlToAppPath(u, c);
        if (p !== null && !routeMatches(p, routes)) r.fail('seo', `URL из sitemap ${u} не открывает страницу (нет роута ${p})`);
      }
    }
  }
  const robotsFile = repoPath(c.root, 'public', 'robots.txt');
  if (exists(robotsFile) && /^\s*Disallow:\s*\/\s*$/im.test(readText(robotsFile))) r.fail('seo', 'robots.txt закрывает весь сайт (Disallow: /)');
  const llmsFile = repoPath(c.root, 'public', 'llms.txt');
  if (b.llmsLines.length) {
    if (!exists(llmsFile)) r.fail('seo', 'удалён public/llms.txt');
    else {
      const now = new Set(textLines(readText(llmsFile)));
      const lost = b.llmsLines.filter((l) => !now.has(l));
      if (lost.length) r.fail('seo', `из llms.txt пропали строки: ${lost.slice(0, 5).join(' | ')}`);
    }
  }
  const conflicts = files.filter((f) => /^(<{7}|>{7}) /m.test(readText(repoPath(c.root, f))));
  for (const f of conflicts) r.fail('build', `неразрешённый конфликт слияния в ${f}`);
  if (!badSeo && !r.items.some((i) => i.area === 'seo' && i.level === 'fail')) {
    r.ok('seo', `title, description, canonical, robots, JSON-LD (${b.head.jsonLd.length}), sitemap (${b.sitemapUrls.length} URL), llms.txt (${b.llmsLines.length} строк) сохранены`);
  }

  if (args.dist) verifyDist(c, b, r, args);
  return r;
}

function urlToAppPath(u, c) {
  let p;
  try { p = safeDecode(new URL(u).pathname); } catch { return null; }
  const base = safeDecode(c.basePath);
  if (base !== '/') {
    if (!p.startsWith(base) && p !== base.replace(/\/$/, '')) return null;
    p = '/' + p.slice(base.length);
  }
  if (c.ignoreLinkPrefixes.some((pre) => p === pre || p.startsWith(`${pre}/`) || p.startsWith(pre.endsWith('/') ? pre : `${pre}/`))) return null;
  return p.replace(/\/$/, '') || '/';
}

function verifyDist(c, b, r, args) {
  const dist = repoPath(c.root, c.distDir);
  const distIndex = path.join(dist, 'index.html');
  if (!exists(distIndex)) { r.fail('build', `нет сборки ${c.distDir}/index.html — сначала build`); return; }
  const head = extractHead(readText(distIndex));
  const { brand, seo } = splitHeadTags(b.head.tags);
  compareHead(r, 'brand', 'dist/index.html', brand, head.tags, c.basePath);
  compareHead(r, 'seo', 'dist/index.html', seo, head.tags, c.basePath);
  for (const ref of localHeadRefs(head.tags)) {
    const rel = normValue(ref, c.basePath).replace(/^\//, '');
    if (!exists(path.join(dist, safeDecode(rel)))) r.fail('brand', `в сборке нет файла ${rel}, на который ссылается head`);
  }
  if (c.seoRoot) {
    for (const f of ['robots.txt', 'sitemap.xml', 'llms.txt']) {
      const had = f === 'robots.txt' ? Object.keys(b.files).some((p) => p.endsWith('public/robots.txt')) : f === 'sitemap.xml' ? b.sitemapUrls.length : b.llmsLines.length;
      if (had && !exists(path.join(dist, f))) r.fail('seo', `в сборке нет ${f}`);
    }
  }
  if (c.spaPages !== false) {
    const missing = spaPagePaths(c).filter((p) => !exists(path.join(dist, `${safeDecode(p).replace(/^\//, '')}.html`)));
    if (missing.length) r.fail('seo', `в сборке нет страниц для ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? '…' : ''} — на GitHub Pages они ответят 404. Выполните node site-guard/guard.mjs spa-pages после сборки`);
  }
  const leadSrc = exists(repoPath(c.root, c.leadModule)) ? readText(repoPath(c.root, c.leadModule)) : '';
  const requireWebhook = args['require-webhook'] || process.env[c.webhookEnv] || leadSrc.includes(c.webhookPattern);
  if (requireWebhook) {
    const bundles = walk(path.join(dist, 'assets')).filter((f) => f.endsWith('.js'));
    const found = bundles.some((f) => readText(path.join(dist, 'assets', f)).includes(c.webhookPattern));
    if (found) r.ok('forms', 'адрес webhook встроен в собранный бандл');
    else r.fail('forms', `в собранном бандле нет webhook (${c.webhookPattern}) — формы не будут отправляться. Проверьте ${c.webhookEnv} при сборке`);
  } else {
    r.warn('forms', `${c.webhookEnv} не задан в этой сборке — наличие webhook в бандле проверит CI`);
  }
  if (!r.items.some((i) => i.area === 'build' && i.level === 'fail')) r.ok('build', `сборка ${c.distDir}/ проверена`);
}

// ---------- live ----------

async function fetchText(url) {
  const res = await fetch(url, { redirect: 'follow', headers: { 'User-Agent': 'site-guard/1.0 (+base44 sync)' } });
  const body = await res.text();
  return { status: res.status, type: res.headers.get('content-type') || '', body, url: res.url };
}

async function cmdLive(m, args) {
  const c = cfg(m);
  const b = m.data.baseline;
  const targets = args.url ? [args.url] : [c.domain, ...(args['no-mirrors'] ? [] : c.mirrors)];
  const results = [];
  for (const origin of targets) {
    const r = new Results(`${c.app} @ ${origin}`);
    results.push(r);
    const originUrl = new URL(origin);
    const pageUrl = args.url ? origin : new URL(encodeURI(c.basePath), originUrl.origin).href;
    let page;
    try { page = await fetchText(pageUrl); } catch (e) { r.fail('build', `${pageUrl} недоступен: ${e.message}`); continue; }
    if (page.status !== 200) { r.fail('build', `${pageUrl} отвечает ${page.status}`); continue; }
    r.ok('build', `${pageUrl} отвечает 200`);

    const head = extractHead(page.body);
    const { brand, seo } = splitHeadTags(b.head.tags);
    const badBrand = compareHead(r, 'brand', 'живой head', brand, head.tags, c.basePath);
    const badSeo = compareHead(r, 'seo', 'живой head', seo, head.tags, c.basePath);
    for (const e of head.jsonLdErrors) r.fail('seo', `JSON-LD не парсится: ${e}`);

    const assetChecks = [];
    for (const [k, v] of Object.entries(head.tags)) {
      if (!v) continue;
      const isIcon = /^link:(icon|shortcut icon|apple-touch-icon|apple-touch-icon-precomposed|mask-icon)\|/.test(k);
      const isManifest = k.startsWith('link:manifest');
      const isOgImage = /^meta:(og:image|og:image:secure_url|twitter:image)(#\d+)?$/.test(k);
      if (!isIcon && !isManifest && !isOgImage) continue;
      assetChecks.push({ k, url: new URL(v, pageUrl).href, image: !isManifest });
    }
    for (const a of assetChecks) {
      try {
        const res = await fetch(a.url, { redirect: 'follow' });
        const type = res.headers.get('content-type') || '';
        await res.arrayBuffer();
        if (res.status !== 200) r.fail('brand', `${a.k}: ${a.url} отвечает ${res.status}`);
        else if (a.image && !/^image\//.test(type)) r.fail('brand', `${a.k}: ${a.url} отдаёт ${type}, а не картинку`);
        else if (!a.image && /text\/html/.test(type)) r.fail('brand', `${a.k}: ${a.url} отдаёт HTML вместо манифеста`);
      } catch (e) { r.fail('brand', `${a.k}: ${a.url} недоступен: ${e.message}`); }
    }
    if (!badBrand && !r.items.some((i) => i.area === 'brand' && i.level === 'fail')) r.ok('brand', `фавиконы и OG-картинки отдаются (${assetChecks.length} файлов), теги совпадают с эталоном`);

    if (c.seoRoot) {
      const hadRobots = Object.keys(b.files).some((p) => p.endsWith('public/robots.txt'));
      const want = [['robots.txt', hadRobots], ['sitemap.xml', b.sitemapUrls.length > 0], ['llms.txt', b.llmsLines.length > 0]];
      for (const [f, required] of want) {
        if (!required) continue;
        const res = await fetchText(new URL(`/${f}`, originUrl.origin).href);
        if (res.status !== 200) r.fail('seo', `/${f} отвечает ${res.status}`);
        else if (/text\/html/.test(res.type) || /<div id="root">/.test(res.body)) r.fail('seo', `/${f} отдаёт HTML-страницу сайта вместо файла`);
        else if (f === 'robots.txt' && /^\s*Disallow:\s*\/\s*$/im.test(res.body)) r.fail('seo', 'живой robots.txt закрывает весь сайт');
      }
    }
    const statuses = await mapLimit(b.sitemapUrls, 5, async (u) => {
      const target = new URL(u);
      const live = new URL(target.pathname + target.search, originUrl.origin).href;
      try { const res = await fetchText(live); return { u: live, ...res }; } catch (e) { return { u: live, status: 0, body: e.message }; }
    });
    const spa404 = statuses.filter((s) => s.status === 404 && /id=["']root["']/.test(s.body));
    const hard = statuses.filter((s) => s.status !== 200 && !spa404.includes(s));
    for (const s of hard) r.fail('seo', `${s.u} отвечает ${s.status}`);
    if (spa404.length) r[c.spaPages === false ? 'warn' : 'fail']('seo', `${spa404.length} URL из sitemap открываются, но отдают HTTP 404 (SPA-фолбэк GitHub Pages) — поисковики их не индексируют: ${spa404.slice(0, 5).map((s) => s.u).join(', ')}${spa404.length > 5 ? '…' : ''}`);
    if (!badSeo && !r.items.some((i) => i.area === 'seo' && i.level === 'fail')) r.ok('seo', `SEO-теги и файлы на месте, ${statuses.length - spa404.length}/${statuses.length} URL из sitemap отвечают 200`);

    const bundleSrc = [...page.body.matchAll(/<script[^>]+src=["']([^"']+\.js)["']/g)].map((x) => new URL(x[1], pageUrl).href);
    let webhookFound = false;
    for (const s of bundleSrc) {
      try { if ((await fetchText(s)).body.includes(c.webhookPattern)) { webhookFound = true; break; } } catch { /* next */ }
    }
    if (webhookFound) r.ok('forms', 'webhook для заявок есть в живом бандле');
    else r.fail('forms', `в живом бандле нет webhook (${c.webhookPattern}) — формы не отправляются`);
  }
  return results;
}

async function mapLimit(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; out[idx] = await fn(items[idx]); }
  }));
  return out;
}

// ---------- test lead ----------

async function cmdTestLead(m, args) {
  const c = cfg(m);
  const leadSrc = readText(repoPath(c.root, c.leadModule));
  const literal = leadSrc.match(/https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec/);
  const url = args.webhook || process.env[c.webhookEnv] || (literal && literal[0]);
  if (!url) throw new Error(`${c.app}: webhook не найден — передайте --webhook URL или ${c.webhookEnv}`);
  const payload = {
    name: `Smoke Test ${c.app}`,
    email: `smoke+${c.app}@example.com`,
    phone: '+79990001234',
    message: 'Проверка site-guard после обновления из Base44',
    consent: true,
    project: c.project || c.app,
    source: 'site-guard test-lead',
    page: 'site-guard',
    timestamp: new Date().toISOString(),
  };
  const res = await fetch(url, { method: 'POST', redirect: 'follow', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) });
  const text = await res.text();
  let ok = res.ok;
  try { ok = ok && JSON.parse(text).result === 'ok'; } catch { ok = ok && text.toLowerCase().includes('ok'); }
  console.log(`[${c.app}] test lead → HTTP ${res.status}: ${text.slice(0, 200)}`);
  if (!ok) throw new Error(`${c.app}: webhook не принял тестовую заявку`);
  console.log(`[${c.app}] ✅ тестовая заявка принята (project=${payload.project})`);
}

// ---------- build ----------

function cmdBuild(m) {
  const c = cfg(m);
  const commands = c.build?.commands || ['npm install --no-audit --no-fund', 'npm run build'];
  const env = { ...process.env, ...(c.build?.env || {}) };
  for (const cmd of commands) {
    console.log(`[${c.app}] $ ${cmd}`);
    const res = spawnSync('bash', ['-c', cmd], { cwd: repoPath(c.root), env, stdio: 'inherit' });
    if (res.status !== 0) throw new Error(`${c.app}: "${cmd}" завершилась с кодом ${res.status}`);
  }
  if (c.spaPages !== false) cmdSpaPages(m);
}

// GitHub Pages answers unknown SPA paths with 404.html and HTTP 404, so search engines skip them.
// A copy of index.html at <path>.html is served for /<path> with HTTP 200.
function spaPagePaths(c) {
  const paths = new Set();
  const sitemapFile = repoPath(c.root, 'public', 'sitemap.xml');
  if (exists(sitemapFile)) {
    for (const u of sitemapUrls(readText(sitemapFile))) { const p = urlToAppPath(u, c); if (p && p !== '/') paths.add(p); }
  }
  for (const r of extractRoutes(c, srcFiles(c))) if (r !== '/' && !/[:*]/.test(r)) paths.add(r.replace(/\/$/, ''));
  return [...paths].sort();
}

function cmdSpaPages(m) {
  const c = cfg(m);
  const dist = repoPath(c.root, c.distDir);
  const index = path.join(dist, 'index.html');
  if (!exists(index)) throw new Error(`${c.app}: нет ${c.distDir}/index.html — сначала сборка`);
  const html = fs.readFileSync(index);
  const paths = spaPagePaths(c);
  let created = 0;
  for (const p of paths) {
    const rel = safeDecode(p).replace(/^\//, '');
    const files = [path.join(dist, `${rel}.html`)];
    if (paths.some((o) => o.startsWith(`${p}/`))) files.push(path.join(dist, rel, 'index.html'));
    for (const file of files) {
      if (exists(file)) continue;
      fs.mkdirSync(path.dirname(file), { recursive: true });
      fs.writeFileSync(file, html);
      created++;
    }
  }
  console.log(`[${c.app}] spa-pages: создано ${created} копий index.html (HTTP 200 для внутренних страниц)`);
}

// ---------- apply archive ----------

function findArchiveRoot(dir) {
  const candidates = [dir, ...fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory() && e.name !== '__MACOSX').map((e) => path.join(dir, e.name))];
  return candidates.find((d) => exists(path.join(d, 'package.json'))) || candidates.find((d) => exists(path.join(d, 'index.html'))) || dir;
}

const isBinary = (buf) => buf.subarray(0, 8000).includes(0);

function cmdApply(m, args) {
  const c = cfg(m);
  const b = m.data.baseline;
  if (!b) throw new Error(`${c.app}: нет baseline — сначала snapshot`);
  if (!args.zip || !exists(args.zip)) throw new Error('укажите --zip путь/к/архиву.zip');
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), `b44-${c.app}-`));
  execFileSync('unzip', ['-q', '-o', path.resolve(args.zip), '-d', tmp]);
  const srcRoot = findArchiveRoot(tmp);
  // Last applied archive: text files are copied to upstream/<app>/ (merge base), all files are hashed in <app>.files.txt.
  const upDir = path.join(GUARD_DIR, 'upstream', c.app);
  const listFile = path.join(GUARD_DIR, 'upstream', `${c.app}.files.txt`);
  const prev = exists(listFile)
    ? new Map(textLines(readText(listFile)).map((l) => { const i = l.indexOf(' '); return [l.slice(i + 1), l.slice(0, i)]; }))
    : null;
  const protectedSet = new Set(b.protectedFiles);
  const leadForms = new Set(b.leadFormFiles.map((f) => joinRel(c.root, f)));
  const archiveFiles = walk(srcRoot).filter((rel) => !ARCHIVE_SKIP.some((re) => re.test(rel)) && !REPO_SKIP.some((re) => re.test(joinRel(c.root, rel))));
  const rep = { added: [], updated: [], merged: [], conflicts: [], keptOurs: [], protectedDiffs: [], leadFormsOverwritten: [], removed: [], orphaned: [] };
  const nextList = new Map();

  for (const rel of archiveFiles) {
    const repoRel = joinRel(c.root, rel);
    const oPath = repoPath(repoRel);
    const uPath = path.join(upDir, rel);
    const T = fs.readFileSync(path.join(srcRoot, rel));
    const O = exists(oPath) ? fs.readFileSync(oPath) : null;
    const baseSha = prev?.get(rel) ?? null;
    const U = baseSha && exists(uPath) ? fs.readFileSync(uPath) : null;
    const write = (buf) => { fs.mkdirSync(path.dirname(oPath), { recursive: true }); fs.writeFileSync(oPath, buf); };
    nextList.set(rel, sha256(T));

    if (protectedSet.has(repoRel)) {
      if (!O) { write(T); rep.added.push(repoRel); } else if (!O.equals(T)) rep.protectedDiffs.push(repoRel);
    } else if (!O) {
      write(T); rep.added.push(repoRel);
    } else if (O.equals(T)) {
      // identical
    } else if (baseSha) {
      if (sha256(T) === baseSha) rep.keptOurs.push(repoRel);
      else if (sha256(O) === baseSha) { write(T); rep.updated.push(repoRel); }
      else if (!U || isBinary(O) || isBinary(T)) rep.conflicts.push(`${repoRel} (изменён и у нас, и в Base44, автослияние невозможно — оставлена наша версия, новая лежит в site-guard/upstream/${c.app}/${rel})`);
      else {
        const t = (buf, n) => { const p = path.join(tmp, `.merge-${n}`); fs.writeFileSync(p, buf); return p; };
        const res = spawnSync('git', ['merge-file', '-p', '-L', 'наша версия', '-L', 'прошлый Base44', '-L', 'новый Base44', t(O, 'o'), t(U, 'u'), t(T, 't')], { encoding: 'buffer' });
        write(res.stdout);
        if (res.status === 0) rep.merged.push(repoRel); else rep.conflicts.push(repoRel);
      }
    } else {
      write(T);
      rep.updated.push(repoRel);
      if (leadForms.has(repoRel)) rep.leadFormsOverwritten.push(repoRel);
    }

    if (!isBinary(T)) { fs.mkdirSync(path.dirname(uPath), { recursive: true }); fs.writeFileSync(uPath, T); } else if (exists(uPath)) fs.rmSync(uPath);
  }

  if (prev) {
    for (const [rel, baseSha] of prev) {
      if (nextList.has(rel)) continue;
      const repoRel = joinRel(c.root, rel);
      const uPath = path.join(upDir, rel);
      if (exists(uPath)) fs.rmSync(uPath);
      if (protectedSet.has(repoRel) || !exists(repoPath(repoRel))) continue;
      if (sha256(fs.readFileSync(repoPath(repoRel))) === baseSha) { fs.rmSync(repoPath(repoRel)); rep.removed.push(repoRel); } else rep.orphaned.push(repoRel);
    }
  } else {
    const tracked = git(['ls-files', '--', joinRel(c.root, 'src'), joinRel(c.root, 'public')], true).split('\n').filter(Boolean);
    for (const repoRel of tracked) {
      const rel = c.root === '.' ? repoRel : posix(path.relative(c.root, repoRel));
      if (!nextList.has(rel) && !protectedSet.has(repoRel)) rep.orphaned.push(repoRel);
    }
  }
  fs.mkdirSync(path.dirname(listFile), { recursive: true });
  fs.writeFileSync(listFile, `${[...nextList].sort(([a], [b2]) => a.localeCompare(b2)).map(([rel, h]) => `${h} ${rel}`).join('\n')}\n`);
  fs.rmSync(tmp, { recursive: true, force: true });

  const lines = [`## Применение архива Base44: ${c.app}`, '', `Архив: ${path.basename(args.zip)}, файлов: ${archiveFiles.length}. Режим: ${prev ? 'трёхстороннее слияние' : 'первое наложение (истории архивов ещё нет)'}.`, ''];
  const section = (title, list) => { if (list.length) lines.push(`### ${title} (${list.length})`, ...list.map((f) => `- ${f}`), ''); };
  section('❌ Конфликты — разрешить вручную', rep.conflicts);
  section('❌ Лид-формы перезаписаны архивом — заново подключить отправку', rep.leadFormsOverwritten);
  section('Защищённые файлы: в архиве другая версия, оставлена наша (перенести полезное вручную)', rep.protectedDiffs);
  section('Слито автоматически (наши правки + изменения Base44)', rep.merged);
  section('Обновлено из Base44', rep.updated);
  section('Добавлено из Base44', rep.added);
  section('Оставлена наша версия (Base44 файл не менял)', rep.keptOurs);
  section('Удалено (Base44 убрал файл)', rep.removed);
  section('Нет в архиве, оставлено (проверить: наша доработка или устаревший файл)', rep.orphaned);
  const report = lines.join('\n');
  fs.mkdirSync(path.join(GUARD_DIR, 'reports'), { recursive: true });
  fs.writeFileSync(path.join(GUARD_DIR, 'reports', `apply-${c.app}.md`), `${report}\n`);
  console.log(report);
  return rep.conflicts.length === 0;
}

// ---------- restore / protected ----------

function cmdRestore(m, args) {
  const c = cfg(m);
  if (!args.ref) throw new Error('укажите --ref (например main или pre-sync-тег)');
  const files = m.data.baseline.protectedFiles.filter((p) => spawnSync('git', ['cat-file', '-e', `${args.ref}:${p}`], { cwd: REPO }).status === 0);
  if (files.length) execFileSync('git', ['checkout', args.ref, '--', ...files], { cwd: REPO, stdio: 'inherit' });
  console.log(`[${c.app}] восстановлено из ${args.ref}: ${files.length} защищённых файлов`);
}

// ---------- main ----------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cmd = args._[0];
  const manifests = cmd ? loadManifests(args.app) : [];
  const reports = [];
  let failed = false;
  switch (cmd) {
    case 'snapshot': manifests.forEach(cmdSnapshot); break;
    case 'protected': for (const m of manifests) console.log(m.data.baseline.protectedFiles.join('\n')); break;
    case 'restore': manifests.forEach((m) => cmdRestore(m, args)); break;
    case 'build': manifests.forEach(cmdBuild); break;
    case 'spa-pages': manifests.forEach(cmdSpaPages); break;
    case 'apply': {
      if (manifests.length !== 1) throw new Error('apply: укажите --app');
      failed = !cmdApply(manifests[0], args);
      break;
    }
    case 'verify':
      for (const m of manifests) { const r = cmdVerify(m, args); reports.push(r.render('Проверка')); failed ||= r.failed; }
      break;
    case 'live':
      for (const m of manifests) for (const r of await cmdLive(m, args)) { reports.push(r.render('Живая проверка')); failed ||= r.failed; }
      break;
    case 'test-lead': for (const m of manifests) await cmdTestLead(m, args); break;
    default:
      console.log(readText(fileURLToPath(import.meta.url)).split('\n').slice(1, 16).join('\n'));
      process.exit(cmd ? 1 : 0);
  }
  if (reports.length) {
    const text = reports.join('\n');
    console.log(text);
    if (args.report) fs.writeFileSync(path.resolve(args.report), `${text}\n`);
    if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`);
  }
  process.exit(failed ? 1 : 0);
}

main().catch((e) => { console.error(`❌ ${e.message}`); process.exit(1); });
