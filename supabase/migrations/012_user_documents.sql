create table if not exists public.user_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  vehicle_id uuid references public.vehicles(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  status text not null default 'pending_review'
    check (status in ('pending_review', 'approved', 'rejected', 'expired')),
  rejection_reason text,
  expires_at date,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists user_documents_user_id_idx on public.user_documents(user_id);
create index if not exists user_documents_status_idx on public.user_documents(status);

insert into storage.buckets (id, name, public)
values
  ('user-documents', 'user-documents', false),
  ('vehicle-images', 'vehicle-images', false)
on conflict (id) do nothing;
