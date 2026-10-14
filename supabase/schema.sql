-- =====================================================================
--  Painel de Transição Didática (UFC Virtual) — esquema do Supabase
--
--  Como usar: Supabase > SQL Editor > New query > cole TUDO > Run.
--  Pode ser executado mais de uma vez (é idempotente).
--
--  Perfis:   admin | tecnico (suporte técnico) | conteudista (professor)
--  Equipes:  cada tecnico/conteudista pertence a UMA equipe (profiles.team_id).
--            Todos os técnicos de uma equipe veem as disciplinas e os conteudistas
--            dela, e de nenhuma outra. O admin vê tudo.
-- =====================================================================

-- ---------- Tabelas ---------------------------------------------------

create table if not exists public.teams (
  id          bigint generated always as identity primary key,
  name        text not null check (length(trim(name)) > 0),
  created_at  timestamptz not null default now()
);
create unique index if not exists teams_name_key on public.teams (lower(name));

create table if not exists public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  name        text not null check (length(trim(name)) > 0),
  username    text not null check (username ~ '^[a-z0-9._-]{3,30}$'),
  role        text not null check (role in ('admin', 'tecnico', 'conteudista')),
  team_id     bigint references public.teams (id) on delete restrict,
  created_at  timestamptz not null default now(),
  constraint profiles_team_required check (role = 'admin' or team_id is not null)
);
create unique index if not exists profiles_username_key on public.profiles (lower(username));
create index if not exists profiles_team_idx on public.profiles (team_id);

create table if not exists public.disciplines (
  id              bigint generated always as identity primary key,
  title           text not null check (length(trim(title)) > 0),
  conteudista_id  uuid not null references public.profiles (id) on delete restrict,
  team_id         bigint not null references public.teams (id) on delete restrict,
  stage           text not null default 'recebimento'
                  check (stage in ('recebimento', 'design_educacional', 'producao', 'revisao', 'implantado')),
  stage_done      jsonb not null default '{}'::jsonb,   -- {"producao": true, ...}
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists disciplines_team_idx on public.disciplines (team_id);
create index if not exists disciplines_conteudista_idx on public.disciplines (conteudista_id);

-- Tarefas do Kanban / Processo
create table if not exists public.tasks (
  id             bigint generated always as identity primary key,
  discipline_id  bigint not null references public.disciplines (id) on delete cascade,
  title          text not null check (length(trim(title)) > 0),
  description    text not null default '',
  due_date       date,
  stage          text not null check (stage in ('recebimento', 'design_educacional', 'producao', 'revisao', 'implantado')),
  done           boolean not null default false,
  created_by     uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists tasks_discipline_idx on public.tasks (discipline_id);

-- Materiais de apoio (arquivo no Storage e/ou link/nome)
create table if not exists public.materials (
  id             bigint generated always as identity primary key,
  discipline_id  bigint not null references public.disciplines (id) on delete cascade,
  name           text not null check (length(trim(name)) > 0),
  storage_path   text,          -- caminho no bucket "materiais" (null = só nome/link)
  size_bytes     bigint,
  status         text not null default 'aguandando_analise'
                 check (status in ('aguandando_analise', 'recebido', 'ajuste')),
  sender_id      uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists materials_discipline_idx on public.materials (discipline_id);

-- Pendências e Fórum
create table if not exists public.pendencies (
  id             bigint generated always as identity primary key,
  discipline_id  bigint not null references public.disciplines (id) on delete cascade,
  text           text not null check (length(trim(text)) > 0),
  type           text not null check (type in ('tecnico_para_professor', 'professor_para_tecnico')),
  status         text not null default 'aberta' check (status in ('aberta', 'resolvida')),
  author_id      uuid references public.profiles (id) on delete set null,
  created_at     timestamptz not null default now()
);
create index if not exists pendencies_discipline_idx on public.pendencies (discipline_id);

create table if not exists public.pendency_comments (
  id           bigint generated always as identity primary key,
  pendency_id  bigint not null references public.pendencies (id) on delete cascade,
  text         text not null check (length(trim(text)) > 0),
  author_id    uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index if not exists pendency_comments_pendency_idx on public.pendency_comments (pendency_id);

-- Editor Estrutural: a aula inteira (seções e componentes) fica em "lesson" (jsonb)
create table if not exists public.resources (
  id              bigint generated always as identity primary key,
  discipline_id   bigint not null references public.disciplines (id) on delete cascade,
  lesson          jsonb not null default '{}'::jsonb,
  status          text not null default 'rascunho' check (status in ('rascunho', 'enviado', 'ajuste', 'aprovado')),
  feedback        text not null default '',
  author_id       uuid references public.profiles (id) on delete set null,
  last_edited_by  uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index if not exists resources_discipline_idx on public.resources (discipline_id);

-- ---------- Funções auxiliares (rodam sem RLS para evitar recursão) ----

create or replace function public.auth_role() returns text
language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid()
$$;

create or replace function public.auth_team() returns bigint
language sql stable security definer set search_path = public as $$
  select team_id from public.profiles where id = auth.uid()
$$;

-- admin, técnico da equipe da disciplina ou conteudista responsável
create or replace function public.can_see_discipline(did bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.disciplines d
    where d.id = did and (
      public.auth_role() = 'admin'
      or (public.auth_role() = 'tecnico' and d.team_id = public.auth_team())
      or (public.auth_role() = 'conteudista' and d.conteudista_id = auth.uid())
    )
  )
$$;

-- admin ou técnico da equipe da disciplina (a "equipe técnica")
create or replace function public.is_staff_of_discipline(did bigint) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.disciplines d
    where d.id = did and (
      public.auth_role() = 'admin'
      or (public.auth_role() = 'tecnico' and d.team_id = public.auth_team())
    )
  )
$$;

-- ---------- Gatilhos ---------------------------------------------------

-- A disciplina herda a equipe do conteudista responsável.
create or replace function public.disciplines_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
declare t bigint; r text;
begin
  select team_id, role into t, r from public.profiles where id = new.conteudista_id;
  if r is distinct from 'conteudista' then
    raise exception 'O responsável pela disciplina precisa ter o perfil de conteudista.';
  end if;
  new.team_id := t;
  new.updated_at := now();
  if tg_op = 'INSERT' and new.created_by is null then new.created_by := auth.uid(); end if;
  return new;
end $$;

drop trigger if exists disciplines_before_write on public.disciplines;
create trigger disciplines_before_write
  before insert or update of conteudista_id, title, stage, stage_done on public.disciplines
  for each row execute function public.disciplines_before_write();

create or replace function public.resources_before_write() returns trigger
language plpgsql set search_path = public as $$
begin
  new.updated_at := now();
  if tg_op = 'INSERT' then
    new.author_id := coalesce(new.author_id, auth.uid());
  end if;
  new.last_edited_by := coalesce(auth.uid(), new.last_edited_by);
  return new;
end $$;

drop trigger if exists resources_before_write on public.resources;
create trigger resources_before_write
  before insert or update on public.resources
  for each row execute function public.resources_before_write();

-- ---------- Row Level Security -----------------------------------------

alter table public.teams             enable row level security;
alter table public.profiles          enable row level security;
alter table public.disciplines       enable row level security;
alter table public.tasks             enable row level security;
alter table public.materials         enable row level security;
alter table public.pendencies        enable row level security;
alter table public.pendency_comments enable row level security;
alter table public.resources         enable row level security;

-- teams
drop policy if exists teams_select on public.teams;
create policy teams_select on public.teams for select to authenticated
  using (public.auth_role() = 'admin' or id = public.auth_team());
drop policy if exists teams_write on public.teams;
create policy teams_write on public.teams for all to authenticated
  using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- profiles (membros são criados pela Edge Function "admin-users", com a chave de serviço)
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select to authenticated
  using (public.auth_role() = 'admin' or id = auth.uid() or team_id = public.auth_team());
drop policy if exists profiles_write on public.profiles;
create policy profiles_write on public.profiles for all to authenticated
  using (public.auth_role() = 'admin') with check (public.auth_role() = 'admin');

-- disciplines
drop policy if exists disciplines_select on public.disciplines;
-- (sem subconsulta na própria tabela: o INSERT ... RETURNING precisa enxergar a linha recém-criada)
create policy disciplines_select on public.disciplines for select to authenticated
  using (
    public.auth_role() = 'admin'
    or (public.auth_role() = 'tecnico' and team_id = public.auth_team())
    or (public.auth_role() = 'conteudista' and conteudista_id = auth.uid())
  );
drop policy if exists disciplines_insert on public.disciplines;
create policy disciplines_insert on public.disciplines for insert to authenticated
  with check (public.auth_role() = 'admin' or (public.auth_role() = 'tecnico' and team_id = public.auth_team()));
drop policy if exists disciplines_update on public.disciplines;
create policy disciplines_update on public.disciplines for update to authenticated
  using (public.is_staff_of_discipline(id))
  with check (public.auth_role() = 'admin' or (public.auth_role() = 'tecnico' and team_id = public.auth_team()));
drop policy if exists disciplines_delete on public.disciplines;
create policy disciplines_delete on public.disciplines for delete to authenticated
  using (public.auth_role() = 'admin');

-- tasks: todos veem; só a equipe técnica cria e altera
drop policy if exists tasks_select on public.tasks;
create policy tasks_select on public.tasks for select to authenticated
  using (public.can_see_discipline(discipline_id));
drop policy if exists tasks_write on public.tasks;
create policy tasks_write on public.tasks for all to authenticated
  using (public.is_staff_of_discipline(discipline_id))
  with check (public.is_staff_of_discipline(discipline_id));

-- materials: quem vê a disciplina envia; só a equipe técnica aprova / pede ajuste / exclui
drop policy if exists materials_select on public.materials;
create policy materials_select on public.materials for select to authenticated
  using (public.can_see_discipline(discipline_id));
drop policy if exists materials_insert on public.materials;
create policy materials_insert on public.materials for insert to authenticated
  with check (public.can_see_discipline(discipline_id) and sender_id = auth.uid());
drop policy if exists materials_update on public.materials;
create policy materials_update on public.materials for update to authenticated
  using (public.is_staff_of_discipline(discipline_id))
  with check (public.is_staff_of_discipline(discipline_id));
drop policy if exists materials_delete on public.materials;
create policy materials_delete on public.materials for delete to authenticated
  using (public.is_staff_of_discipline(discipline_id));

-- pendencies e comentários (fórum): quem vê a disciplina participa
drop policy if exists pendencies_select on public.pendencies;
create policy pendencies_select on public.pendencies for select to authenticated
  using (public.can_see_discipline(discipline_id));
drop policy if exists pendencies_insert on public.pendencies;
create policy pendencies_insert on public.pendencies for insert to authenticated
  with check (public.can_see_discipline(discipline_id) and author_id = auth.uid());
drop policy if exists pendencies_update on public.pendencies;
create policy pendencies_update on public.pendencies for update to authenticated
  using (public.can_see_discipline(discipline_id)) with check (public.can_see_discipline(discipline_id));
drop policy if exists pendencies_delete on public.pendencies;
create policy pendencies_delete on public.pendencies for delete to authenticated
  using (public.is_staff_of_discipline(discipline_id));

drop policy if exists pendency_comments_select on public.pendency_comments;
create policy pendency_comments_select on public.pendency_comments for select to authenticated
  using (exists (select 1 from public.pendencies p where p.id = pendency_id and public.can_see_discipline(p.discipline_id)));
drop policy if exists pendency_comments_insert on public.pendency_comments;
create policy pendency_comments_insert on public.pendency_comments for insert to authenticated
  with check (author_id = auth.uid()
              and exists (select 1 from public.pendencies p where p.id = pendency_id and public.can_see_discipline(p.discipline_id)));

-- resources (Editor Estrutural)
drop policy if exists resources_select on public.resources;
create policy resources_select on public.resources for select to authenticated
  using (public.can_see_discipline(discipline_id));
drop policy if exists resources_insert on public.resources;
create policy resources_insert on public.resources for insert to authenticated
  with check (public.can_see_discipline(discipline_id) and status = 'rascunho');
-- equipe técnica: edita tudo, aprova, pede ajuste
drop policy if exists resources_update_staff on public.resources;
create policy resources_update_staff on public.resources for update to authenticated
  using (public.is_staff_of_discipline(discipline_id))
  with check (public.is_staff_of_discipline(discipline_id));
-- conteudista: só o próprio recurso, enquanto for rascunho ou ajuste (e pode enviar)
drop policy if exists resources_update_author on public.resources;
create policy resources_update_author on public.resources for update to authenticated
  using (author_id = auth.uid() and status in ('rascunho', 'ajuste') and public.can_see_discipline(discipline_id))
  with check (author_id = auth.uid() and status in ('rascunho', 'enviado', 'ajuste') and public.can_see_discipline(discipline_id));
drop policy if exists resources_delete on public.resources;
create policy resources_delete on public.resources for delete to authenticated
  using (public.is_staff_of_discipline(discipline_id)
         or (author_id = auth.uid() and status = 'rascunho'));

-- ---------- Storage ----------------------------------------------------
-- materiais: privado, pasta = id da disciplina ("12/arquivo.pdf")
-- aulas-imagens: público (as imagens aparecem no site baixado)

insert into storage.buckets (id, name, public)
values ('materiais', 'materiais', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('aulas-imagens', 'aulas-imagens', true)
on conflict (id) do nothing;

drop policy if exists materiais_select on storage.objects;
create policy materiais_select on storage.objects for select to authenticated
  using (bucket_id = 'materiais' and public.can_see_discipline(((storage.foldername(name))[1])::bigint));
drop policy if exists materiais_insert on storage.objects;
create policy materiais_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'materiais' and public.can_see_discipline(((storage.foldername(name))[1])::bigint));
drop policy if exists materiais_delete on storage.objects;
create policy materiais_delete on storage.objects for delete to authenticated
  using (bucket_id = 'materiais' and public.is_staff_of_discipline(((storage.foldername(name))[1])::bigint));

drop policy if exists aulas_imagens_insert on storage.objects;
create policy aulas_imagens_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'aulas-imagens');
drop policy if exists aulas_imagens_delete on storage.objects;
create policy aulas_imagens_delete on storage.objects for delete to authenticated
  using (bucket_id = 'aulas-imagens' and owner = auth.uid());

-- ---------- Tempo real (Realtime) --------------------------------------
do $$
declare t text;
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    foreach t in array array['teams', 'profiles', 'disciplines', 'tasks', 'materials', 'pendencies', 'pendency_comments', 'resources'] loop
      begin
        execute format('alter publication supabase_realtime add table public.%I', t);
      exception when duplicate_object then null;
      end;
    end loop;
  end if;
end $$;

-- ---------- Primeiro administrador -------------------------------------
-- 1) Authentication > Users > Add user:  e-mail  administrador@painel.example.com  + senha
--    (marque "Auto Confirm User")
-- 2) Rode o bloco abaixo (ou use o arquivo supabase/seed.sql):
--
--   insert into public.profiles (id, name, username, role)
--   select id, 'Administrador', 'administrador', 'admin'
--   from auth.users where email = 'administrador@painel.example.com'
--   on conflict (id) do nothing;
