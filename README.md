# ✈️ TripFi

> **Travel smarter. Pay faster. Explore freely.**

TripFi is a modern travel booking platform that combines AI-powered trip planning with Bitcoin Cash (BCH) payments — giving travelers a seamless, low-fee, and transparent experience from destination discovery to final booking.

---

## 🌍 What is TripFi?

TripFi solves the three biggest pain points in modern travel:

- **Fragmented bookings** — flights, hotels, and activities scattered across dozens of tabs
- **Slow, expensive payments** — 3%+ foreign transaction fees and multi-day settlement times
- **Generic recommendations** — one-size-fits-all suggestions that don't match your travel style

TripFi brings everything into one platform, powered by AI and settled on-chain with Bitcoin Cash.

---

## ✨ Features

- **Smart Trip Planning** — AI-powered itinerary builder that adapts to your budget, style, and preferences in real time
- **BCH Instant Payments** — Book anything with Bitcoin Cash. Sub-$0.01 fees, settled in under 2 seconds
- **AI Travel Assistant** — Chat with your 24/7 personal travel agent for recommendations, alerts, and rebooking
- **All-in-One Dashboard** — Every booking, receipt, and itinerary in a single workspace
- **Real-Time Price Tracking** — Get notified the moment prices drop for your saved destinations
- **Secure & Transparent** — Blockchain-backed receipts. No hidden fees. Ever.
- **Group Travel Mode** — Split costs, sync itineraries, and coordinate with your whole crew

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4.0 |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React |
| Auth & Database | Supabase |
| AI Layer | Anthropic Claude / OpenAI via Vercel AI SDK |
| Payments | BCH via BitPay / CoinGate |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase account
- An Amadeus API key (for flight/hotel data)
- A BCH payment gateway key (BitPay or CoinGate)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/tripfi.git
cd tripfi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Amadeus (Flight & Hotel Data)
AMADEUS_CLIENT_ID=your_amadeus_client_id
AMADEUS_CLIENT_SECRET=your_amadeus_client_secret

# AI
ANTHROPIC_API_KEY=your_anthropic_api_key
OPENAI_API_KEY=your_openai_api_key

# BCH Payments
BITPAY_API_KEY=your_bitpay_api_key
COINGATE_API_KEY=your_coingate_api_key
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
tripfi/
├── app/                      # Next.js App Router
│   ├── layout.tsx            # Root layout with ThemeProvider
│   ├── page.tsx              # Landing page (composed sections)
│   └── dashboard/            # Authenticated dashboard
├── components/
│   ├── landing/              # Landing page sections
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── BCHSection.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Pricing.tsx
│   │   ├── CTABanner.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                   # shadcn/ui components
├── lib/                      # Utilities and helpers
├── agents/                   # AI agent definitions
│   ├── trip-planner.ts       # Trip planning agent
│   └── deal-scout.ts         # Deal discovery agent
├── public/
│   ├── logo-dark.png
│   └── logo-light.png
└── styles/
    └── globals.css           # Tailwind v4 @theme config
```

---

## 🎨 Brand & Design

| Token | Value |
|---|---|
| Primary | `#00D084` |
| Primary Hover | `#00B36E` |
| Background (Dark) | `#0A0A0A` |
| Background (Light) | `#F8FFFE` |
| Surface | `#111111` |
| Border | `#1F1F1F` |
| Text Secondary | `#A0A0A0` |

TripFi uses a dark-first design with a signature mint green accent. Both light and dark themes are fully supported via `next-themes` with a toggle in the footer.

---

## 🤖 AI Agents

TripFi uses two AI agents built on the Vercel AI SDK:

**Trip Planner Agent**
Takes user preferences (budget, interests, dates, travel style) and generates a personalized itinerary with reasoning. Uses streaming responses for a fast, interactive feel.

**Deal Scout Agent**
Monitors available flights and hotels in real time, surfaces the best options based on the user's profile and past behavior, and sends alerts when prices drop.

---

## 💳 BCH Payment Flow

1. User selects a booking and proceeds to checkout
2. TripFi generates a BCH payment address via the payment gateway
3. User sends BCH from their wallet
4. Transaction is confirmed on-chain (typically under 2 seconds)
5. Booking is confirmed and a blockchain receipt is issued
6. Gateway settles in fiat to the supplier — suppliers never touch crypto

---

## 🗺️ Roadmap

- [x] Landing page with AI-generated design
- [x] Navbar with smart theme switching
- [x] Features bento grid
- [ ] Supabase auth and user onboarding
- [ ] Amadeus flight and hotel search integration
- [ ] AI trip planner (MVP)
- [ ] BCH checkout flow
- [ ] User dashboard
- [ ] Group travel mode
- [ ] Mobile app (React Native)

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Commit your changes
git commit -m "feat: add your feature"

# Push and open a PR
git push origin feature/your-feature-name
```

---

## 📄 License

MIT License © 2025 TripFi. See [LICENSE](./LICENSE) for details.

---

Built with ❤️ for travelers who move fast and pay smart.

[Website](https://tripfi-app.vercel.app) · [Twitter](https://x.com/tripfiapp) · [Discord](https://discord.gg/tripfi)