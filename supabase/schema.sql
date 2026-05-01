-- MetricsOS core schema
-- Run this in Supabase SQL editor, then seed your data.

create table if not exists metrics (
  id text primary key,
  label text not null,
  value double precision not null,
  unit text not null default '',
  change double precision not null default 0,
  change_type text not null check (change_type in ('up', 'down', 'neutral')),
  icon text not null default '',
  color text not null default '',
  bg_color text not null default '',
  display_order int not null default 0
);

create table if not exists chart_points (
  name text primary key,
  revenue int not null,
  users int not null,
  sessions int not null,
  conversions int not null,
  display_order int not null default 0
);

create table if not exists transactions (
  id text primary key,
  "user" text not null,
  avatar text not null default '',
  action text not null,
  amount double precision not null,
  status text not null check (status in ('completed', 'pending', 'failed')),
  time text not null,
  category text not null,
  created_at timestamptz not null default now()
);

create table if not exists traffic_sources (
  source text primary key,
  sessions int not null,
  percentage double precision not null,
  color text not null default '',
  display_order int not null default 0
);

create table if not exists system_alerts (
  id text primary key,
  severity text not null check (severity in ('critical', 'warning', 'info')),
  message text not null,
  time text not null,
  created_at timestamptz not null default now()
);

create table if not exists regions (
  country text primary key,
  users int not null,
  percentage double precision not null
);
