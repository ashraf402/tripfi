-- Drop existing tables to apply the new Phase 3 schema
drop table if exists public.trips cascade;
drop table if exists public.payment_transactions cascade;
drop table if exists public.bookings cascade;
create table public.bookings (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    conversation_id text,
    -- Trip summary
    origin text,
    destination text,
    destination_city text,
    departure_date date,
    return_date date,
    travelers int default 1,
    trip_days int,
    travel_style text,
    -- Cost
    total_usd numeric(10, 2),
    total_bch numeric(16, 8),
    bch_rate_at_booking numeric(10, 2),
    -- Full data snapshots
    flight_data jsonb,
    hotel_data jsonb,
    itinerary_data jsonb,
    -- Status
    status text default 'pending' check (
        status in (
            'pending',
            'payment_pending',
            'confirmed',
            'cancelled'
        )
    ),
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);
create table public.payment_transactions (
    id uuid default gen_random_uuid() primary key,
    booking_id uuid references public.bookings(id) on delete cascade not null,
    user_id uuid references auth.users(id) on delete cascade not null,
    -- Prompt.cash fields
    payment_id text unique,
    -- Prompt.cash invoice ID
    payment_url text,
    -- Checkout URL
    amount_bch numeric(16, 8),
    amount_usd numeric(10, 2),
    -- Status
    status text default 'pending' check (
        status in (
            'pending',
            'confirmed',
            'expired',
            'failed'
        )
    ),
    -- Testnet flag
    is_testnet boolean default true,
    confirmed_at timestamptz,
    created_at timestamptz default now()
);
create table public.trips (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    booking_id uuid references public.bookings(id) on delete cascade unique not null,
    -- Display info
    title text,
    -- "5 Days in Bali"
    destination text,
    destination_city text,
    cover_image_url text,
    -- Dates
    departure_date date,
    return_date date,
    -- Status
    status text default 'upcoming' check (
        status in (
            'upcoming',
            'active',
            'completed',
            'cancelled'
        )
    ),
    -- Travel preferences saved at booking
    travel_style text,
    travelers int default 1,
    created_at timestamptz default now()
);
-- Enable RLS on all three tables
alter table public.bookings enable row level security;
alter table public.payment_transactions enable row level security;
alter table public.trips enable row level security;
-- Users can only see their own data
create policy "Users see own bookings" on public.bookings for all using (auth.uid() = user_id);
create policy "Users see own transactions" on public.payment_transactions for all using (auth.uid() = user_id);
create policy "Users see own trips" on public.trips for all using (auth.uid() = user_id);