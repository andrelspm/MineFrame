-- MINEFRAME 001: añade etiquetas y enlace externo a projects.
-- Solo AÑADE columnas opcionales. No modifica ni borra datos existentes ni toca RLS.
alter table public.projects
  add column if not exists tags text[] not null default '{}',
  add column if not exists external_url text;

-- Rendimiento de la consulta pública (published + orden por fecha). Índice parcial, no cambia datos.
create index if not exists projects_published_created_idx
  on public.projects (created_at desc) where published = true;
