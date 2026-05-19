create extension if not exists pgcrypto;

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  role text not null default 'atendente' check (role in ('admin', 'tecnico', 'atendente')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  category text not null,
  price numeric(12, 2) not null default 0,
  specs text,
  description text,
  image text,
  stock integer not null default 0,
  featured boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists testimonials (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  role text,
  text text not null,
  rating integer not null default 5,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id text primary key default gen_random_uuid()::text,
  title text not null,
  excerpt text,
  date date not null default current_date,
  category text,
  read_time text,
  "readTime" text,
  image text,
  content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists ordens_servico (
  id text primary key default gen_random_uuid()::text,
  numero text unique not null,
  cliente text,
  cliente_nome text not null,
  cliente_telefone text not null,
  cliente_email text,
  cliente_cpf_cnpj text,
  equipamento text,
  tecnico text,
  tecnico_responsavel text not null,
  status text,
  situacao text not null default 'diagnostico',
  prioridade text not null default 'media',
  entrada date,
  data_entrada date not null default current_date,
  previsao date,
  defeito_reclamacao text not null,
  observacoes text,
  laudo_tecnico text,
  adiantamento numeric(12, 2) not null default 0,
  desconto numeric(12, 2) not null default 0,
  valor_deslocamento numeric(12, 2) not null default 0,
  valor_outros numeric(12, 2) not null default 0,
  valor numeric(12, 2) not null default 0,
  entregue boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id text primary key default gen_random_uuid()::text,
  nome text not null,
  telefone text not null,
  email text,
  tipo text not null,
  estagio text not null default 'novo',
  dispositivo text,
  problema text,
  valor_estimado numeric(12, 2) not null default 0,
  origem text,
  canal text,
  interesse text,
  status text,
  notas text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists estoque (
  id text primary key default gen_random_uuid()::text,
  codigo text unique not null,
  item text,
  descricao text not null,
  categoria text not null,
  quantidade_atual integer not null default 0,
  quantidade_minima integer not null default 0,
  quantidade integer not null default 0,
  minimo integer not null default 0,
  valor_custo numeric(12, 2) not null default 0,
  valor_venda numeric(12, 2) not null default 0,
  fornecedor text,
  localizacao text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists agendamentos (
  id text primary key default gen_random_uuid()::text,
  cliente text not null,
  servico text not null,
  dispositivo text,
  data date not null,
  horario time,
  status text not null default 'pendente',
  tecnico text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_set_updated_at on products;
create trigger products_set_updated_at
before update on products
for each row execute function set_updated_at();

drop trigger if exists blog_posts_set_updated_at on blog_posts;
create trigger blog_posts_set_updated_at
before update on blog_posts
for each row execute function set_updated_at();

drop trigger if exists ordens_servico_set_updated_at on ordens_servico;
create trigger ordens_servico_set_updated_at
before update on ordens_servico
for each row execute function set_updated_at();

drop trigger if exists leads_set_updated_at on leads;
create trigger leads_set_updated_at
before update on leads
for each row execute function set_updated_at();

drop trigger if exists estoque_set_updated_at on estoque;
create trigger estoque_set_updated_at
before update on estoque
for each row execute function set_updated_at();

drop trigger if exists agendamentos_set_updated_at on agendamentos;
create trigger agendamentos_set_updated_at
before update on agendamentos
for each row execute function set_updated_at();

create or replace function create_profile_for_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nome, role, ativo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'atendente'),
    true
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists auth_users_create_profile on auth.users;
create trigger auth_users_create_profile
after insert on auth.users
for each row execute function create_profile_for_new_user();

alter table profiles enable row level security;
alter table ordens_servico enable row level security;
alter table leads enable row level security;
alter table estoque enable row level security;
alter table agendamentos enable row level security;
alter table products enable row level security;
alter table testimonials enable row level security;
alter table blog_posts enable row level security;

drop policy if exists "profiles authenticated read" on profiles;
create policy "profiles authenticated read"
on profiles for select
to authenticated
using (true);

drop policy if exists "profiles owner update" on profiles;
create policy "profiles owner update"
on profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "ordens authenticated read" on ordens_servico;
create policy "ordens authenticated read"
on ordens_servico for select
to authenticated
using (true);

drop policy if exists "ordens authenticated insert" on ordens_servico;
create policy "ordens authenticated insert"
on ordens_servico for insert
to authenticated
with check (true);

drop policy if exists "ordens authenticated update" on ordens_servico;
create policy "ordens authenticated update"
on ordens_servico for update
to authenticated
using (true)
with check (true);

drop policy if exists "leads authenticated read" on leads;
create policy "leads authenticated read"
on leads for select
to authenticated
using (true);

drop policy if exists "leads authenticated insert" on leads;
create policy "leads authenticated insert"
on leads for insert
to authenticated
with check (true);

drop policy if exists "leads authenticated update" on leads;
create policy "leads authenticated update"
on leads for update
to authenticated
using (true)
with check (true);

drop policy if exists "estoque authenticated read" on estoque;
create policy "estoque authenticated read"
on estoque for select
to authenticated
using (true);

drop policy if exists "estoque authenticated insert" on estoque;
create policy "estoque authenticated insert"
on estoque for insert
to authenticated
with check (true);

drop policy if exists "estoque authenticated update" on estoque;
create policy "estoque authenticated update"
on estoque for update
to authenticated
using (true)
with check (true);

drop policy if exists "agendamentos authenticated read" on agendamentos;
create policy "agendamentos authenticated read"
on agendamentos for select
to authenticated
using (true);

drop policy if exists "agendamentos authenticated insert" on agendamentos;
create policy "agendamentos authenticated insert"
on agendamentos for insert
to authenticated
with check (true);

drop policy if exists "agendamentos authenticated update" on agendamentos;
create policy "agendamentos authenticated update"
on agendamentos for update
to authenticated
using (true)
with check (true);

drop policy if exists "products public read" on products;
create policy "products public read"
on products for select
to anon, authenticated
using (true);

drop policy if exists "products authenticated write" on products;
create policy "products authenticated write"
on products for all
to authenticated
using (true)
with check (true);

drop policy if exists "testimonials public read" on testimonials;
create policy "testimonials public read"
on testimonials for select
to anon, authenticated
using (true);

drop policy if exists "testimonials authenticated write" on testimonials;
create policy "testimonials authenticated write"
on testimonials for all
to authenticated
using (true)
with check (true);

drop policy if exists "blog posts public read" on blog_posts;
create policy "blog posts public read"
on blog_posts for select
to anon, authenticated
using (true);

drop policy if exists "blog posts authenticated write" on blog_posts;
create policy "blog posts authenticated write"
on blog_posts for all
to authenticated
using (true)
with check (true);
