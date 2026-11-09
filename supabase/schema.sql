-- MINEFRAME: ejecutar en Supabase > SQL Editor.
-- 1) Crea perfil para cada usuario nuevo.
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
for each row execute procedure public.handle_new_user();

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text not null default 'Gameplay',
  description text not null default '',
  thumbnail_url text,
  video_url text,
  media_type text not null default 'image' check (media_type in ('image','video','before_after')),
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.is_mineframe_admin()
returns boolean language sql stable security definer set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and is_admin = true);
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;

drop policy if exists "Users read own profile" on public.profiles;
create policy "Users read own profile" on public.profiles for select to authenticated using (id = auth.uid() or public.is_mineframe_admin());

drop policy if exists "Public read published projects" on public.projects;
create policy "Public read published projects" on public.projects for select to anon, authenticated using (published = true or public.is_mineframe_admin());

drop policy if exists "Admin insert projects" on public.projects;
create policy "Admin insert projects" on public.projects for insert to authenticated with check (public.is_mineframe_admin());

drop policy if exists "Admin update projects" on public.projects;
create policy "Admin update projects" on public.projects for update to authenticated using (public.is_mineframe_admin()) with check (public.is_mineframe_admin());

drop policy if exists "Admin delete projects" on public.projects;
create policy "Admin delete projects" on public.projects for delete to authenticated using (public.is_mineframe_admin());

-- Bucket público para mostrar medios en el portafolio.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media', 'portfolio-media', true, 524288000,
  array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do update set public = true, file_size_limit = 524288000,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public view portfolio media" on storage.objects;
create policy "Public view portfolio media" on storage.objects for select to anon, authenticated
using (bucket_id = 'portfolio-media');

drop policy if exists "Admin upload portfolio media" on storage.objects;
create policy "Admin upload portfolio media" on storage.objects for insert to authenticated
with check (bucket_id = 'portfolio-media' and public.is_mineframe_admin());

drop policy if exists "Admin update portfolio media" on storage.objects;
create policy "Admin update portfolio media" on storage.objects for update to authenticated
using (bucket_id = 'portfolio-media' and public.is_mineframe_admin())
with check (bucket_id = 'portfolio-media' and public.is_mineframe_admin());

drop policy if exists "Admin delete portfolio media" on storage.objects;
create policy "Admin delete portfolio media" on storage.objects for delete to authenticated
using (bucket_id = 'portfolio-media' and public.is_mineframe_admin());

-- Después de crear tu usuario desde Supabase Authentication > Users,
-- copia su UUID y ejecuta:
-- update public.profiles set is_admin = true where id = 'PEGA-AQUI-TU-UUID';

-- Optional before-and-after comparison images for portfolio projects.
alter table public.projects
  add column if not exists before_image_url text,
  add column if not exists after_image_url text;