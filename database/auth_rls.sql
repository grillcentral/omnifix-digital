create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  role text not null default 'atendente' check (role in ('admin', 'tecnico', 'atendente')),
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

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
