# ✈️ TripFi

> **Travel smarter. Pay faster. Explore freely.**

TripFi is an AI-powered travel platform that plans your entire trip through natural conversation — from destination discovery to day-by-day itineraries — with interactive maps and real-time flight and hotel data. Built for the hackathon with a vision to integrate Bitcoin Cash (BCH) payments for sub-cent booking fees.

---

## 🌍 What is TripFi?

TripFi solves the three biggest pain points in modern travel:

- **Fragmented bookings** — flights, hotels, and activities scattered across dozens of tabs
- **Slow, expensive payments** — 3%+ foreign transaction fees and multi-day settlement times
- **Generic recommendations** — one-size-fits-all suggestions that don't match your travel style

TripFi brings everything into one conversational interface, powered by AI. Just tell it where you want to go and it handles the rest.

---

## ✨ Features

### 🤖 AI Travel Assistant
- **Conversational trip planning** — Chat naturally to plan trips. "Plan a 5-day trip to Bali" just works.
- **Intent detection engine** — Automatically understands what you need: destination suggestions, flight searches, hotel searches, itinerary building, weather, or general chat.
- **Smart context memory** — Remembers your origin, dates, budget, and preferences across the conversation.

### 🗺️ Spatial Map Triggers
- **MacroMap** — When suggesting destinations, the AI automatically shows all options on a map relative to your starting point.
- **RouteMap** — After building an itinerary, a route map of Day 1 appears with all waypoints connected.
- **RadiusMap** — Ask "What's near my hotel?" and get a neighborhood map centered on your accommodation.
- **Interactive Leaflet maps** — Custom SVG markers color-coded by type (hotel, activity, airport, restaurant), auto-fit bounds, route polylines, and custom zoom controls on dark CARTO tiles.

### ✈️ Real-Time Travel Data
- **Flight search** — Live pricing via Kiwi and flight status via Aviationstack.
- **Hotel search** — Real availability and pricing for destinations worldwide.
- **Activity discovery** — Curated activities and experiences per destination.
- **Weather data** — Current conditions and forecasts for trip planning.

### 🎨 Premium Chat Experience
- **Rich component cards** — Flights, hotels, itineraries, weather, destinations, and maps render as interactive cards in the chat.
- **Quick pick chips** — AI suggests tappable destination options for instant planning.
- **Markdown rendering** — AI responses render beautifully with headings, lists, bold, and inline code.
- **Typing indicator** — Smooth loading states while the AI thinks.

### 🔐 Auth & Persistence
- **Supabase authentication** — Email/password login with protected routes.
- **Chat persistence** — All conversations and messages saved to the database.
- **Conversation sidebar** — Browse and resume past trip conversations.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4.0 |
| UI Components | shadcn/ui |
| Animations | Framer Motion |
| Icons | Lucide React, MingCute Icons |
| Maps | Leaflet + react-leaflet |
| AI (Primary) | Google Gemini 2.5 Flash |
| AI (Fallback) | Groq (Llama) |
| Auth & Database | Supabase |
| State Management | Zustand |
| Flights | Kiwi API + Aviationstack |
| Images | Unsplash + Pexels (fallback chain) |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- A Supabase project
- API keys for the services listed below

### Installation

```bash
# Clone the repository
git clone https://github.com/ashraf402/tripfi.git
cd tripfi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# AI
GOOGLE_AI_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key

# Flights
KIWI_API_KEY=your_kiwi_api_key
KIWI_ENABLED=true
AVIATIONSTACK_API_KEY=your_aviationstack_api_key

# Images
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
PEXELS_API_KEY=your_pexels_api_key
```

### Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

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

```
tripfi/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout with ThemeProvider
│   ├── page.tsx                # Landing page
│   ├── new/                    # New chat page
│   ├── chat/[id]/              # Chat conversation page
│   ├── login/ & signup/        # Auth pages
│   └── api/chat/               # Chat API route
├── components/
│   ├── chatroom/
│   │   ├── core/               # ChatRoom, ChatMessage, ChatInput, etc.
│   │   ├── map/                # MapPanel, TripMap, LeafletMap, MapPopup
│   │   ├── maps/               # MacroMap, RouteMap, RadiusMap cards
│   │   ├── flights/            # FlightSearchResults
│   │   ├── hotels/             # HotelSearchResults
│   │   ├── itinerary/          # ItineraryCard
│   │   ├── weather/            # WeatherCard
│   │   └── destinations/       # DestinationGrid
│   ├── landing/                # Landing page sections
│   └── ui/                     # shadcn/ui components
├── lib/
│   ├── ai/                     # Orchestrator, Gemini, Groq clients
│   ├── services/               # Flight, hotel, activity, image services
│   ├── store/                  # Zustand stores (conversation, map, auth)
│   ├── supabase/               # Supabase client & middleware
│   ├── types/                  # TypeScript type definitions
│   └── hooks/                  # Custom React hooks
└── public/                     # Static assets
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

## 💳 BCH Payments (Coming Soon)

BCH payment integration is actively in development. The planned flow:

1. User selects a booking and proceeds to checkout
2. TripFi generates a BCH payment address
3. User sends BCH from their wallet
4. Transaction confirmed on-chain (typically under 2 seconds)
5. Booking confirmed with a blockchain receipt
6. Sub-$0.01 transaction fees — no hidden costs

---

## 🗺️ Roadmap

- [x] Landing page with theme switching
- [x] Supabase auth (login/signup)
- [x] AI chat assistant with intent detection
- [x] Flight search (Kiwi + Aviationstack)
- [x] Hotel search
- [x] Activity search
- [x] AI trip planner with full itinerary generation
- [x] Weather integration
- [x] Interactive maps with custom markers
- [x] Spatial map triggers (MacroMap, RouteMap, RadiusMap)
- [x] Chat persistence with conversation history
- [x] Image service with Unsplash + Pexels fallback
- [ ] BCH checkout flow
- [ ] User dashboard with booking history
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

[Website](https://tripfi-app.vercel.app) · [Twitter](https://x.com/tripfiapp) · [Telegram](https://t.me/tripfiapp)