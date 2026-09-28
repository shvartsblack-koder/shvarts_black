# site-guard

Защита сайта при обновлении из Base44. Проверяет, что после наложения нового ZIP-архива не сломались:

1. отправка форм (модуль отправки, webhook в бандле, все лид-формы вызывают его);
2. кнопки и разделы (роуты, внутренние ссылки, заглушки `href="#"`);
3. фавиконы и Open Graph (файлы в `public/`, теги в `<head>`);
4. SEO / GEO и статьи (title, description, canonical, robots, JSON-LD, `robots.txt`, `sitemap.xml`, `llms.txt`, все URL из sitemap открываются).

## Как обновить сайт из Base44

1. Скачать ZIP из Base44.
2. Загрузить его в ветку `base44-inbox` как `base44-inbox/<app>.zip` (имя `<app>` — из `site-guard/<app>.manifest.json`).
3. Workflow **Base44 sync** сам наложит архив, соберёт, проверит и откроет PR `sync/...` с отчётом.
4. ✅ в PR — можно мержить. ❌ — чинить в ветке PR (workflow **Site guard** перепроверит каждый push).
5. После мержа `deploy.yml` ещё раз проверяет сборку перед публикацией и живой сайт после неё.

## Команды

```bash
node site-guard/guard.mjs apply --app <app> --zip export.zip   # наложить архив, защищённые файлы не трогаются
node site-guard/guard.mjs build                                # установить зависимости и собрать
node site-guard/guard.mjs verify --dist --require-webhook      # проверить исходники и сборку
node site-guard/guard.mjs live                                 # проверить боевой домен (и зеркала)
node site-guard/guard.mjs test-lead --app <app>                # отправить одну тестовую заявку
node site-guard/guard.mjs restore --ref main                   # вернуть защищённые файлы из main
node site-guard/guard.mjs snapshot                             # принять текущее состояние как новый эталон
```

## Правила

- `snapshot` — только после осознанного изменения эталона (новый OG, новая форма, новый URL) и с согласия владельца.
- `apply` при первом запуске просто накладывает архив; начиная со второго — делает трёхстороннее слияние (наши правки + изменения Base44), используя копию прошлого архива в `site-guard/upstream/`.
- Защищённые файлы (`baseline.protectedFiles`) никогда не перезаписываются архивом: `index.html`, модуль отправки форм, фавиконы, OG-картинки, `robots.txt`, `sitemap.xml`, `llms.txt`, `vite.config.js`, CI.
