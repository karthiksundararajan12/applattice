create table if not exists public.contact_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  phone text,
  business_type text,
  service text not null,
  message text,
  created_at timestamptz not null default now()
);

alter table public.contact_inquiries enable row level security;

create policy "Allow anonymous inserts"
  on public.contact_inquiries for insert to anon with check (true);

create policy "Service role full access"
  on public.contact_inquiries for all to service_role using (true) with check (true);
