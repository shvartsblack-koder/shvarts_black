import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import GoldenRule from '../components/GoldenRule';

// Privacy policy for shvarts.black. Facts only: what the site's forms actually send
// (src/components/contact/ContactSection.jsx, src/components/scores/ScoresSection.jsx,
// src/lib/submitForm.js) and which third-party services the site actually loads.

const UPDATED = { ru: '5 октября 2026 г.', en: 'October 5, 2026' };
const EMAIL = 'hello@shvarts.black';

const CONTENT = {
  ru: {
    label: 'Документы',
    title: 'Политика конфиденциальности',
    intro: 'Порядок обработки персональных данных посетителей сайта shvarts.black и использования технических данных браузера.',
    updated: 'Дата последнего обновления',
    back: '← На главную',
    sections: [
      {
        title: '1. Общие положения',
        text: [
          'Настоящая Политика конфиденциальности определяет порядок обработки и защиты персональных данных пользователей сайта SHVARTS BLACK — https://shvarts.black (далее — «Сайт»).',
          `Сайт ведёт Shvarts Black. По всем вопросам, связанным с обработкой персональных данных, пишите на ${EMAIL}. Отправляя форму на Сайте, вы соглашаетесь с условиями данной Политики.`,
        ],
      },
      {
        title: '2. Какие данные мы получаем',
        text: ['Мы получаем только те данные, которые вы сами вводите в формы Сайта:'],
        list: [
          'Форма «Contact»: имя, адрес электронной почты, тема обращения (Commission, Collaboration, Score Request, Media Inquiry, Other) и текст сообщения.',
          'Форма запроса нот «Scores & Sheet Music»: выбранный альбом и произведение. Имя и контакты в этой форме не запрашиваются.',
          'Вместе с каждой заявкой автоматически передаются дата и время отправки и адрес страницы, с которой она отправлена.',
        ],
      },
      {
        title: '3. Цели обработки',
        text: ['Данные используются только для того, чтобы ответить на ваше обращение или запрос нот: связаться с вами по указанному адресу электронной почты, обсудить заказ, сотрудничество или публикацию в СМИ. Мы не используем их для рекламных рассылок.'],
      },
      {
        title: '4. Правовые основания',
        text: ['Обработка осуществляется на основании вашего согласия, которое вы выражаете, добровольно заполняя и отправляя форму, а также в случаях, прямо предусмотренных применимым законодательством о персональных данных.'],
      },
      {
        title: '5. Где хранятся данные',
        text: ['Заявки из форм передаются через веб-приложение Google Apps Script и сохраняются в таблице Google Sheets (сервис Google LLC), доступ к которой есть только у владельца Сайта. Серверы Google могут находиться за пределами вашей страны. Данные хранятся столько, сколько нужно для ответа на обращение, либо до отзыва вами согласия.'],
      },
      {
        title: '6. Сервисы, которые использует Сайт',
        list: [
          'Хостинг — GitHub Pages (GitHub, Inc.). Как и любой веб-сервер, он получает технические данные запроса: IP-адрес и сведения о браузере.',
          'Платформа Base44, на которой создан Сайт: при открытии страницы браузер обращается к base44.app за публичными настройками приложения, изображения и аудио загружаются с media.base44.com.',
          'Шрифты Google Fonts (fonts.googleapis.com, fonts.gstatic.com) — при их загрузке Google получает IP-адрес и сведения о браузере.',
          'Ссылки на YouTube, Spotify, Apple Music, TikTok, Facebook и публикации в СМИ ведут на внешние сайты; на них действуют их собственные политики конфиденциальности.',
        ],
      },
      {
        title: '7. Cookie и аналитика',
        text: ['Сайт не использует счётчики посещаемости (например, Яндекс Метрику или Google Analytics), рекламные и аналитические cookie. В локальном хранилище браузера (localStorage) сохраняются только технические параметры приложения Base44, необходимые для работы Сайта. Вы можете очистить их в настройках браузера.'],
      },
      {
        title: '8. Передача третьим лицам',
        text: ['Персональные данные не продаются и не передаются третьим лицам, кроме перечисленных выше сервисов, через которые технически работает Сайт, и случаев, предусмотренных законом.'],
      },
      {
        title: '9. Права пользователя',
        text: ['Вы вправе запросить сведения о своих данных, их уточнение или удаление, а также отозвать согласие на обработку, написав на адрес, указанный ниже.'],
      },
      {
        title: '10. Контакты',
        text: [`По вопросам обработки персональных данных: ${EMAIL}`],
      },
    ],
  },
  en: {
    label: 'Documents',
    title: 'Privacy Policy',
    intro: 'How personal data of visitors to shvarts.black is processed and which technical browser data the site uses.',
    updated: 'Last updated',
    back: '← Return Home',
    sections: [
      {
        title: '1. General',
        text: [
          'This Privacy Policy explains how personal data of users of the SHVARTS BLACK website — https://shvarts.black (the "Site") — is processed and protected.',
          `The Site is run by Shvarts Black. For any question about your personal data, write to ${EMAIL}. By submitting a form on the Site you agree to this Policy.`,
        ],
      },
      {
        title: '2. What data we receive',
        text: ['We only receive the data you enter in the Site forms yourself:'],
        list: [
          'Contact form: name, email address, subject (Commission, Collaboration, Score Request, Media Inquiry, Other) and your message.',
          'Scores & Sheet Music request: the selected album and composition. This form does not ask for your name or contact details.',
          'Each submission automatically includes the date and time it was sent and the address of the page it was sent from.',
        ],
      },
      {
        title: '3. Purposes',
        text: ['The data is used only to reply to your message or score request: to contact you at the email address you provided and to discuss a commission, collaboration or media inquiry. It is not used for marketing mailings.'],
      },
      {
        title: '4. Legal basis',
        text: ['Processing is based on your consent, which you give by voluntarily filling in and submitting a form, and on other grounds expressly provided by applicable data protection law.'],
      },
      {
        title: '5. Where the data is stored',
        text: ['Form submissions are sent through a Google Apps Script web app and stored in a Google Sheets spreadsheet (a Google LLC service) that only the Site owner can access. Google servers may be located outside your country. The data is kept for as long as needed to reply to you, or until you withdraw your consent.'],
      },
      {
        title: '6. Services used by the Site',
        list: [
          'Hosting — GitHub Pages (GitHub, Inc.). Like any web server, it receives technical request data: IP address and browser information.',
          'Base44, the platform the Site is built on: when a page opens, the browser requests the public app settings from base44.app; images and audio are loaded from media.base44.com.',
          'Google Fonts (fonts.googleapis.com, fonts.gstatic.com) — when fonts load, Google receives your IP address and browser information.',
          'Links to YouTube, Spotify, Apple Music, TikTok, Facebook and press publications lead to external sites governed by their own privacy policies.',
        ],
      },
      {
        title: '7. Cookies and analytics',
        text: ['The Site does not use visitor counters (such as Yandex Metrica or Google Analytics), advertising or analytics cookies. The browser\'s local storage (localStorage) only keeps technical Base44 app parameters the Site needs to work. You can clear them in your browser settings.'],
      },
      {
        title: '8. Sharing with third parties',
        text: ['Personal data is not sold or shared with third parties other than the services listed above that technically run the Site, and except where required by law.'],
      },
      {
        title: '9. Your rights',
        text: ['You may ask what data we hold about you, ask to correct or delete it, and withdraw your consent at any time by writing to the address below.'],
      },
      {
        title: '10. Contact',
        text: [`Questions about personal data: ${EMAIL}`],
      },
    ],
  },
};

export default function Privacy() {
  const [lang, setLang] = useState('ru');
  const c = CONTENT[lang];

  useEffect(() => {
    window.scrollTo(0, 0);
    const prevTitle = document.title;
    document.title = lang === 'ru' ? 'Политика конфиденциальности — Shvarts Black' : 'Privacy Policy — Shvarts Black';
    return () => { document.title = prevTitle; };
  }, [lang]);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground overflow-x-hidden">
      <header className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between h-16 md:h-20">
        <Link to="/" className="font-display text-xl md:text-2xl tracking-[0.2em] gold-text font-semibold">
          SHVARTS BLACK
        </Link>
        <div className="flex items-center gap-3 text-xs tracking-[0.2em] uppercase font-body">
          <button onClick={() => setLang('ru')} className={lang === 'ru' ? 'text-primary' : 'text-foreground/40 hover:text-primary transition-colors'}>RU</button>
          <span className="text-foreground/20">/</span>
          <button onClick={() => setLang('en')} className={lang === 'en' ? 'text-primary' : 'text-foreground/40 hover:text-primary transition-colors'}>EN</button>
        </div>
      </header>

      <main className="px-6 pt-12 md:pt-20 pb-20 md:pb-28">
        <div className="max-w-3xl mx-auto" lang={lang}>
          <div className="text-center mb-12 md:mb-16">
            <p className="text-xs tracking-[0.4em] uppercase text-primary/60 font-body mb-4">{c.label}</p>
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-wide gold-text">{c.title}</h1>
            <GoldenRule className="mt-6" />
            <p className="mt-6 text-sm text-foreground/50 font-body tracking-wide leading-relaxed">{c.intro}</p>
          </div>

          <Link to="/" className="inline-block text-xs tracking-[0.2em] uppercase text-foreground/40 hover:text-primary font-body transition-colors mb-6">
            {c.back}
          </Link>
          <p className="text-xs text-foreground/40 font-body tracking-wide mb-10">
            {c.updated}: {UPDATED[lang]}
          </p>

          <div className="space-y-10">
            {c.sections.map((s) => (
              <section key={s.title}>
                <h2 className="font-display text-xl md:text-2xl tracking-wide text-foreground/85 mb-3">{s.title}</h2>
                {(s.text || []).map((p) => (
                  <p key={p} className="text-sm text-foreground/60 font-body leading-relaxed tracking-wide mb-3">{p}</p>
                ))}
                {s.list && (
                  <ul className="space-y-2 list-disc pl-5 marker:text-primary/50">
                    {s.list.map((li) => (
                      <li key={li} className="text-sm text-foreground/60 font-body leading-relaxed tracking-wide">{li}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
