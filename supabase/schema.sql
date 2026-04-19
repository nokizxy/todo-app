-- FocusFlow Study Planner Supabase schema
-- Run this file in the Supabase SQL Editor before enabling cloud sync.

create table if not exists public.tasks (
  id text primary key,
  user_id text not null default 'demo-user',
  title text not null,
  course text not null default '',
  next_step text not null default '',
  effort text not null default 'quick'
    check (effort in ('quick', 'focus', 'deep')),
  due_date date,
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'done')),
  today_focus boolean not null default true,
  notified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_user_id_created_at_idx
  on public.tasks (user_id, created_at desc);

create index if not exists tasks_user_id_status_idx
  on public.tasks (user_id, status);

create table if not exists public.focus_sessions (
  id text primary key,
  user_id text not null default 'demo-user',
  task_id text,
  task_title text not null,
  minutes integer not null default 0
    check (minutes >= 0),
  session_date date not null,
  completed_at timestamptz not null default now()
);

create index if not exists focus_sessions_user_id_completed_at_idx
  on public.focus_sessions (user_id, completed_at desc);

create index if not exists focus_sessions_user_id_session_date_idx
  on public.focus_sessions (user_id, session_date);
