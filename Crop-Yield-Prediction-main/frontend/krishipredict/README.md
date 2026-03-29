# 🌾 KrishiPredict — Frontend

AI-powered crop yield prediction for small and marginal farmers of Eastern India.

---

## Tech Stack

| Technology       | Purpose                          | Version  |
|------------------|----------------------------------|----------|
| React 18         | UI framework                     | 18.3+    |
| Vite             | Build tool + dev server          | 5.x      |
| TypeScript       | Type safety (components/ui)      | 5.x      |
| Tailwind CSS     | Utility-first styling            | 3.x      |
| React Router v6  | Client-side routing              | 6.22+    |
| Axios            | HTTP calls to Express backend    | 1.6+     |
| Recharts         | SHAP bar chart display           | 2.10+    |
| framer-motion    | Scroll expand animation          | 12+      |
| clsx + tw-merge  | shadcn-compatible class utility  | latest   |
| Web Speech API   | Voice input (Bengali/Hindi)      | Native   |

---

## Project Structure

```
krishipredict/
├── src/
│   ├── components/
│   │   ├── ui/                              <- shadcn/ui component folder
│   │   │   └── scroll-expansion-hero.tsx   <- Typed scroll hero (NEW)
│   │   ├── Navbar.jsx
│   │   ├── VoiceInput.jsx
│   │   ├── StripScanner.jsx
│   │   ├── ShapChart.jsx
│   │   └── RiskBadge.jsx
│   ├── lib/
│   │   └── utils.ts                        <- cn() shadcn utility
│   ├── pages/
│   │   ├── LandingPage.jsx                 <- Uses ScrollExpandMedia hero
│   │   ├── InputPage.jsx
│   │   ├── ResultPage.jsx
│   │   ├── MarketplacePage.jsx
│   │   ├── LoginPage.jsx
│   │   └── RegisterPage.jsx
│   ├── api/
│   │   ├── predict.js
│   │   └── marketplace.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css                           <- Tailwind directives + design tokens
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.js                          <- @ alias -> src/
├── postcss.config.js
├── .env
└── package.json
```

---

## Quick Start

```bash
# 1. Install all dependencies
npm install

# 2. Configure backend URL
cp .env.example .env
# Edit .env: VITE_EXPRESS_URL=http://localhost:5000

# 3. Run the dev server
npm run dev
# Opens automatically at http://localhost:3000
```

---

## ScrollExpandMedia — Component Docs

**File:** `src/components/ui/scroll-expansion-hero.tsx`
**Import:** `import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero'`

### Why `components/ui/`?

This is the **shadcn/ui canonical path**. Running `npx shadcn@latest init` installs
all primitives (Button, Dialog, Card…) here. Placing custom components in the same
folder gives you:

- One consistent `@/components/ui/*` import pattern everywhere
- Full shadcn CLI compatibility — it won't overwrite your custom files
- The `@` alias (in `vite.config.js`) resolves cleanly to `src/`

### Basic Usage

```tsx
import ScrollExpandMedia from '@/components/ui/scroll-expansion-hero';

function MyPage() {
  return (
    <ScrollExpandMedia
      mediaType="video"
      mediaSrc="https://example.com/hero.mp4"
      posterSrc="https://example.com/poster.jpg"
      bgImageSrc="https://example.com/bg.jpg"
      title="Krishi Predict"
      date="Eastern India"
      scrollToExpand="Scroll to Explore"
      textBlend
    >
      {/* Revealed after full expansion */}
      <MyRevealedContent />
    </ScrollExpandMedia>
  );
}
```

### Props

| Prop             | Type                 | Required | Default   | Description                                 |
|------------------|----------------------|----------|-----------|---------------------------------------------|
| `mediaType`      | `'video' \| 'image'` | No       | `'video'` | Render a video or image inside the box      |
| `mediaSrc`       | `string`             | Yes      | —         | MP4 URL, YouTube URL, or image URL          |
| `posterSrc`      | `string`             | No       | —         | Video poster before load                    |
| `bgImageSrc`     | `string`             | Yes      | —         | Full-viewport background, fades on scroll   |
| `title`          | `string`             | No       | —         | Hero title — first word left, rest right    |
| `date`           | `string`             | No       | —         | Sub-label (flies left on scroll)            |
| `scrollToExpand` | `string`             | No       | —         | Scroll hint (flies right on scroll)         |
| `textBlend`      | `boolean`            | No       | `false`   | `mix-blend-mode: difference` on title       |
| `children`       | `ReactNode`          | No       | —         | Content revealed after media fully expands  |

### Animation Breakdown

```
scrollProgress:    0 ──────────────────────────── 1
                   |                               |
  Media size:      300 × 400 px      ~1550 × 800 px
  Bg opacity:      1.0                         0.0
  Title words:     overlapping          ±150 vw apart
  Children:        hidden               fades in (0.7s)
```

1. User scrolls → `scrollProgress` steps from 0 → 1
2. Media box grows via inline `width`/`height` (smooth, no CSS transition)
3. Background fades out via `framer-motion` opacity
4. Title words translate apart left ↔ right
5. At `scrollProgress >= 1` → children fade in
6. Scroll back to top → entire sequence reverses

### Supported media sources

| Type             | Example src value                                  |
|------------------|----------------------------------------------------|
| MP4 (direct)     | `https://cdn.example.com/video.mp4`               |
| YouTube          | `https://www.youtube.com/watch?v=XXXX`            |
| YouTube (embed)  | `https://www.youtube.com/embed/XXXX`              |
| Image (any)      | `https://images.unsplash.com/photo-...`            |

---

## Routes

| Path           | Page               | Notes                                      |
|----------------|--------------------|--------------------------------------------|
| `/`            | `LandingPage`      | Scroll-expand hero + features + CTA        |
| `/predict`     | `InputPage`        | 15-field farm input form                   |
| `/result`      | `ResultPage`       | Yield card, income, SHAP chart             |
| `/marketplace` | `MarketplacePage`  | Listings, cart drawer, create listing      |
| `/login`       | `LoginPage`        | JWT auth                                   |
| `/register`    | `RegisterPage`     | Two-panel registration                     |

---

## Adding shadcn Primitives Later

The project is already structured for shadcn. To add components:

```bash
# Initialise shadcn (safe — skips existing files)
npx shadcn@latest init

# Add any primitive
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add badge
npx shadcn@latest add dialog
```

Shadcn will install into `src/components/ui/` — exactly where `scroll-expansion-hero.tsx` lives.

---

## Backend API (Express on port 5000)

```
POST  /api/predict              ML yield prediction
GET   /api/climate?state=...    NASA POWER API proxy
POST  /api/history              Save prediction to MongoDB
GET   /api/translate?text=...   Bengali/Hindi translation
POST  /api/scan-strip           Soil strip image -> FastAPI

POST  /api/auth/register
POST  /api/auth/login
GET   /api/auth/me

GET   /api/market/listings
POST  /api/market/listings
GET   /api/market/listings/:id
POST  /api/market/orders
GET   /api/market/orders/mine
PUT   /api/market/orders/:id
POST  /api/market/payment
POST  /api/market/verify-pay
```

---

## Production Build

```bash
npm run build       # Output -> /dist
npm run preview     # Preview production build locally
```
