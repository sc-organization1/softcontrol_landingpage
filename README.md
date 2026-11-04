# SoftControl website

Company website for SoftControl (Tashkent, founded 2026). React 18 + Vite 6 + Tailwind CSS 4 + Motion.

## Start

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve dist/ locally
```

## Where to change things

| What | File |
|---|---|
| Phone, email, team size, founding year | `src/config.js` → `COMPANY` |
| Services list, order, tags, which are pre-selected | `src/config.js` → `SERVICES`, `DEFAULT_SELECTED` |
| Words in the moving ticker | `src/config.js` → `TICKER` |
| All texts (Uzbek / Russian / English) | `src/i18n/uz.js`, `ru.js`, `en.js` (same keys in each) |
| Colors and fonts (light + dark) | `src/index.css` → `:root` tokens and `@theme` |
| Buttons | `src/index.css` → `btn-primary`, `btn-ghost`, `btn-brass` |
| Logo (React) | `src/components/Logo.jsx` |
| Favicons, app icons, manifest | `public/` |

Tailwind color classes come from the tokens: `bg-paper`, `bg-band`, `text-ink`, `text-brass`, `border-line`, `font-display`, etc.
Dark mode follows the visitor's system setting until they use the header toggle; their choice is then saved in the browser (`src/lib/useTheme.js`).

## Sections

`Header` → `Hero` (headline + control panel + ticker) → `Ledger` (key facts) → `About` → `Services` → `Process` → `Faq` → `Contact` → `Footer`.
The service selection is shared: switches in the hero panel, "Order this" on service cards and the chips in the contact form all update one list (`App.jsx`).

## Animations

- Background: dim shapes drift forever (`.drift` in `index.css`) and a giant faint logo opens its brackets as the page scrolls (`components/Background.jsx`).
- Hero: headline words rise in, blinking caret, control panel slides in, dial needle springs to the number of selected services. The live example in the panel turns through the selected services (`components/LivePreview.jsx`; its contents are illustrations, not client data).
- Scroll: sections fade and lift in (`components/Reveal.jsx`), numbers count up. On wide, tall enough screens the Process section stays pinned while scrolling walks through its stages (`components/Process.jsx`); elsewhere it is a normal list.
- Hover: 3D tilt, cursor spotlight, glowing edge and brass rule on service cards, sliding button fills, nav underline, logo brackets open.
- Header shrinks on scroll and shows a reading-progress line.
- Cursor: the logo mark follows the mouse and its brackets open over anything clickable (`components/Cursor.jsx`). Touch screens keep their normal behaviour and text fields keep the text cursor.
- Everything respects the visitor's "reduce motion" setting (the system cursor stays too).

## Contact form

The form posts JSON to `/api/contact` (`src/lib/sendRequest.js`). That function (`api/contact.js`) checks the request and forwards it to Telegram.

Set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env` (see `.env.example`) for `npm run dev`, and in the host's environment variables for production. The bot must be able to post in that chat; in a private chat, the person must have started the bot first.

Fields format themselves while typing (`src/lib/format.js`). The phone field holds the Uzbek number after a fixed `+998`, and the request sends it as `+998 90 123 45 67`.

Never put the bot token in frontend code or in a `VITE_` variable: anyone can read those.

## Deploy

Deploy to Vercel, which builds the site and runs `api/contact.js` as a function. On a purely static host the site loads, but the contact form fails without that function.
