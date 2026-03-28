# KrishiPredict — Frontend

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

# 2. Run the dev server
npm run dev
# Opens automatically at http://localhost:3000
```
---

## Production Build

```bash
npm run build       # Output -> /dist
npm run preview     # Preview production build locally
```
