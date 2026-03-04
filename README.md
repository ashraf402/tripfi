# ✈️ TripFi

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Bitcoin Cash](https://img.shields.io/badge/Payments-Bitcoin_Cash-0AC18E?logo=bitcoin-cash)

> **Travel smarter. Pay faster. Explore freely.**

TripFi is an AI-powered travel platform that plans your entire trip through natural conversation — from destination discovery to day-by-day itineraries — with interactive maps and real-time flight and hotel data. Built for the BCH-1 Hackcelerator with a vision to integrate Bitcoin Cash (BCH) payments for sub-cent booking fees.

---

## 🌍 What is TripFi?

TripFi solves the three biggest pain points in modern travel:

- **Fragmented bookings** — flights, hotels, and activities scattered across dozens of tabs
- **Slow, expensive payments** — 3%+ foreign transaction fees and multi-day settlement times
- **Generic recommendations** — one-size-fits-all suggestions that don't match your travel style

TripFi brings everything into one conversational interface, powered by AI. Just tell it where you want to go and it handles the rest.

---

## ✨ Features

- **AI travel assistant** (Groq + Gemini)
- **Real flight and hotel search** (Amadeus)
- **Interactive map with route and radius**
- **BCH payment processing** (HD wallet)
- **Testnet and mainnet support via env var**
- **Google OAuth + email/password auth**
- **Account linking** (Google + email)
- **Randomized demo prices for testnet**
- **Trip dashboard with booking history**
- **Six dynamic legal pages (JSON-driven)**
- **Input sanitization** (XSS, prompt injection)
- **Encrypted wallet mnemonic** (AES-256-GCM)
- **Testnet badges across the UI**

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 14, TypeScript, Tailwind v4, shadcn/ui, Framer Motion |
| **Backend** | Supabase (auth + database) |
| **AI** | Groq, Google Gemini |
| **Travel** | Amadeus Travel API |
| **Maps** | OpenStreetMap |
| **Payments** | Bitcoin Cash (BCH), bitcoincashjs-lib, bip39 |
| **Auth** | Supabase + Google OAuth |

---

## ⚙️ Environment Variables

Create a `.env.local` file with the following keys.

```env
# App
NEXT_PUBLIC_APP_URL=               # Your application local or production URL

# Supabase
NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Supabase public anonymous key
SUPABASE_SERVICE_ROLE_KEY=         # Supabase service role key

# AI
GROQ_API_KEY=                      # Groq API key for Llama model
GEMINI_API_KEY=                    # Google Gemini API key

# Travel
AMADEUS_CLIENT_ID=                 # Amadeus travel API public key
AMADEUS_CLIENT_SECRET=             # Amadeus travel API secret key

# BCH Payments
BCH_NETWORK=testnet                # Network mode: testnet or mainnet
BCH_ENCRYPTION_KEY=                # 32-byte hex key for encryption (from setupWallet.js)
BCH_WALLET_MNEMONIC_ENCRYPTED=     # Encrypted wallet mnemonic (from setupWallet.js)
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project
- API keys for the services listed above

### Installation

1. **Clone the repo**
   ```bash
   git clone https://github.com/ashraf402/tripfi.git
   cd tripfi
   ```

2. **npm install**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Copy `.env.local.example` to `.env.local` and fill in the values:
   ```bash
   cp .env.local.example .env.local
   ```

4. **Initialize BCH Wallet**
   Run the setup script to generate an encrypted mnemonic:
   ```bash
   node scripts/setupWallet.js
   ```

5. **Run Supabase migrations**
   Apply the database schema to your Supabase instance:
   ```bash
   npx supabase db push
   ```

6. **npm run dev**
   Start the development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💳 BCH Payment Setup

TripFi includes an integrated HD wallet for processing cryptocurrency payments securely. To set up the payment stack:

- Run `node scripts/setupWallet.js` in your terminal.
- Copy the generated `BCH_ENCRYPTION_KEY` and `BCH_WALLET_MNEMONIC_ENCRYPTED` values to your `.env.local` file.
- **For testnet:** Get testnet BCH (tBCH) from [tbch.googol.cash](https://tbch.googol.cash) to fund the generated wallet.
- **Switch to mainnet:** Set `BCH_NETWORK=mainnet` in your `.env.local` file (no code changes needed).

### Network Modes

| BCH_NETWORK | Mode       | Prices       |
|-------------|------------|--------------|
| `testnet`   | Test       | Randomized   |
| `mainnet`   | Production | Real prices  |

---

## 🧠 AI Architecture

TripFi uses a single **orchestrator** (`lib/ai/orchestrator.ts`) that:

1. **Detects intent** from user messages using Gemini (destination suggest, search flights, search hotels, plan trip, weather, general chat)
2. **Executes the right pipeline** — each intent triggers different API calls and data fetching
3. **Returns structured responses** — `{ message, component, data }` where the component is rendered as an interactive card in the chat
4. **Triggers spatial maps automatically** — based on intent, the orchestrator attaches map data so the MapPanel opens with the right markers

```
User Message → Intent Detection → Pipeline Execution → Response + Component + Map
```

**Fallback chain:** Gemini → Groq → hardcoded error messages. The AI never fails silently.

---

## 📁 Project Structure

```text
tripfi/
├── app/          # Next.js routes
├── components/   # UI components
├── content/      # Legal JSON files
├── lib/          # Services, utils, types
└── scripts/      # One-time setup scripts
```

---

## 🎨 Design

TripFi uses a dark-first design with a signature mint green accent (`#00D084`). Both light and dark themes are fully supported via `next-themes`.

Map markers use custom SVG icons from Lucide, color-coded:
- 🟢 Hotels (`#00D084`)
- 🔵 Activities (`#3B82F6`)
- 🟠 Airports (`#F97316`)
- 🟣 Restaurants (`#A855F7`)

---

## ⚖️ Legal

Six dynamic legal pages are driven by JSON files in `/content/legal/` and can be updated without any code changes.

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

[Website](https://tripfi-app.vercel.app) · [Twitter](https://x.com/tripfiapp) · [Telegram](https://t.me/tripfiapp)