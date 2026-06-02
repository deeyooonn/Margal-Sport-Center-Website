-- Margal Sports Center - Supabase Schema setup

-- 1. Table: profiles
create table public.profiles (
  id           uuid references auth.users on delete cascade primary key,
  full_name    text not null,
  phone        text,
  role         text not null default 'customer',  -- 'customer' | 'admin' | 'superadmin'
  created_at   timestamptz default now()
);

-- Auto-create profile on user sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- 2. Table: courts
create table public.courts (
  id           uuid default gen_random_uuid() primary key,
  name         text not null,               -- e.g. 'Court A'
  sport_type   text not null,               -- 'badminton' | 'basketball' | 'futsal' | 'multi'
  description  text,
  photo_url    text,                         -- Supabase Storage URL
  is_active    boolean default true,
  created_at   timestamptz default now()
);


-- 3. Table: rates
create table public.rates (
  id           uuid default gen_random_uuid() primary key,
  court_id     uuid references public.courts on delete cascade,
  label        text not null,               -- e.g. 'Peak Hours', 'Off-Peak'
  start_hour   int not null,                -- 0-23 (24hr format)
  end_hour     int not null,
  price_per_hour numeric(8,2) not null,
  applies_on   text[] default '{mon,tue,wed,thu,fri,sat,sun}',
  created_at   timestamptz default now()
);


-- 4. Table: bookings
create table public.bookings (
  id              uuid default gen_random_uuid() primary key,
  reference_no    text unique not null,      -- e.g. 'MSC-20250501-0001'
  customer_id     uuid references public.profiles(id),
  customer_name   text not null,             -- For guest bookings
  email           text not null,
  phone           text not null,
  court_id        uuid references public.courts on delete restrict,
  booking_date    date not null,
  start_time      time not null,
  end_time        time not null,
  purpose         text,                      -- 'casual play' | 'birthday' | 'league' | etc.
  total_amount    numeric(8,2) not null,
  status          text default 'pending',    -- 'pending' | 'confirmed' | 'rejected' | 'cancelled'
  admin_note      text,                      -- Optional rejection/note from admin
  created_at      timestamptz default now()
);

-- Prevent double booking: no overlapping time on same court+date
create unique index no_double_booking
  on public.bookings (court_id, booking_date, start_time, end_time)
  where status not in ('rejected', 'cancelled');


-- 5. Table: payments
create table public.payments (
  id               uuid default gen_random_uuid() primary key,
  booking_id       uuid references public.bookings on delete cascade unique,
  paymongo_id      text unique,              -- PayMongo payment intent ID
  method           text,                     -- 'gcash' | 'maya'
  amount           numeric(8,2) not null,
  status           text default 'pending',   -- 'pending' | 'paid' | 'failed' | 'refunded'
  reference_number text,                     -- PayMongo transaction ref
  paid_at          timestamptz,
  created_at       timestamptz default now()
);


-- 6. Table: blocked_slots
create table public.blocked_slots (
  id           uuid default gen_random_uuid() primary key,
  court_id     uuid references public.courts on delete cascade,
  block_date   date not null,
  start_time   time not null,
  end_time     time not null,
  reason       text,                         -- e.g. 'Maintenance', 'Private Event'
  created_by   uuid references public.profiles(id),
  created_at   timestamptz default now()
);


-- 7. Row Level Security (RLS) Policies

alter table public.profiles enable row level security;
alter table public.courts enable row level security;
alter table public.rates enable row level security;
alter table public.bookings enable row level security;
alter table public.payments enable row level security;
alter table public.blocked_slots enable row level security;

-- Profiles: Users can read/update their own profile
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Courts: Anyone can view active courts, only admins can manage
create policy "Anyone can view active courts" on public.courts for select using (is_active = true);
create policy "Admins can manage courts" on public.courts for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

-- Rates: Anyone can view rates, only admins can manage
create policy "Anyone can view rates" on public.rates for select using (true);
create policy "Admins can manage rates" on public.rates for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

-- Bookings: Anyone can insert, customers view own, admins view all, admins update all, customers update own (cancel)
create policy "Anyone can create booking" on public.bookings for insert with check (true);
create policy "Customers view own bookings, admins view all" on public.bookings for select using (
  auth.uid() = customer_id or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);
create policy "Customers update own, admins update all" on public.bookings for update using (
  auth.uid() = customer_id or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

-- Payments: Customers view own, admins view all
create policy "Customers view own payments, admins view all" on public.payments for select using (
  exists (select 1 from public.bookings where id = booking_id and customer_id = auth.uid()) 
  or exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);

-- Blocked Slots: Anyone can view, only admins can manage
create policy "Anyone can view blocked slots" on public.blocked_slots for select using (true);
create policy "Admins can manage blocked slots" on public.blocked_slots for all using (
  exists (select 1 from public.profiles where id = auth.uid() and role in ('admin', 'superadmin'))
);
