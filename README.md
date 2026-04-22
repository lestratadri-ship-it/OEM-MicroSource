# MicroSource

Next.js (App Router) B2B marketing site for **MicroSource** — an OEM/ODM partner for tablets, office electronics, and accessories.

## Tech stack

- Next.js 14 (App Router)
- React 18 (functional components)
- Tailwind CSS 3
- Inter via `next/font/google`

## Project structure

```
.
├── app/
│   ├── globals.css       # Tailwind layers + design tokens
│   ├── layout.js         # Root layout, metadata, Header + Footer
│   └── page.js           # Homepage composition
├── components/
│   ├── Header.jsx
│   ├── Hero.jsx
│   ├── Categories.jsx
│   ├── Capabilities.jsx
│   ├── Process.jsx
│   ├── ContactCTA.jsx
│   └── Footer.jsx
├── lib/
│   └── site.js           # Copy, navigation, config
├── public/
├── tailwind.config.js
├── postcss.config.js
├── next.config.js
├── jsconfig.json
└── package.json
```

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Design notes

- Neutral monochrome palette with a dark accent (`ink-900`) for CTAs.
- Generous vertical rhythm (`py-24 / py-32`) and a 1200px container.
- Hairline separators (`border-ink-100 / border-ink-200`) in place of shadows or boxes.
- No flashy UI — typography and whitespace carry the hierarchy.
