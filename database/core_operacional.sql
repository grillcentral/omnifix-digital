-- Core operacional limpo OmniFix Digital
-- Execute este script depois de validar backup do Supabase.
-- Nao altera, renomeia ou migra tabelas legadas.
-- Tabelas legadas atuais permanecem temporariamente fora deste core.

create extension if not exists pgcrypto;

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function set_created_by()
returns trigger as $$
begin
  -- Em requisicoes autenticadas pelo Supabase, auth.uid() registra o operador.
  -- No SQL Editor ou scripts com service role, auth.uid() pode ser nulo.
  if auth.uid() is not null then
    new.created_by = auth.uid();
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function omnifix_has_role(allowed_roles text[])
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return false;
  end if;

  return exists (
    select 1
    from public.perfis
    where perfis.id = auth.uid()
      and perfis.ativo = true
      and perfis.papel = any(allowed_roles)
  );
end;
$$;

create table if not exists clientes (
  id text primary key default gen_random_uuid()::text,
  nome text not null,
  cpf_cnpj text,
  telefone text,
  celular text,
  email text,
  endereco text,
  bairro text,
  cidade_uf text,
  observacoes text,
  ativo boolean not null default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists clientes_set_updated_at on clientes;
create trigger clientes_set_updated_at
before update on clientes
for each row execute function set_updated_at();

drop trigger if exists clientes_set_created_by on clientes;
create trigger clientes_set_created_by
before insert on clientes
for each row execute function set_created_by();

create table if not exists ordens_servico (
  id text primary key default gen_random_uuid()::text,
  numero text unique,
  cliente_id text references clientes(id) on delete set null,
  cliente_nome text not null,
  cliente_telefone text,
  cliente_email text,
  cliente_cpf_cnpj text,
  cliente_endereco text,
  situacao text not null default 'orcamento' check (
    situacao in (
      'orcamento',
      'aguardando_autorizacao',
      'em_andamento',
      'aguardando_peca',
      'pronto',
      'entregue',
      'cancelada'
    )
  ),
  prioridade text not null default 'normal' check (prioridade in ('normal', 'urgente', 'alta')),
  data_entrada timestamptz not null default now(),
  data_saida timestamptz,
  data_garantia_ate date,
  tecnico_responsavel text,
  forma_pagamento text check (
    forma_pagamento in (
      'pix',
      'dinheiro',
      'cartao_credito',
      'cartao_debito',
      'boleto',
      'transferencia',
      'outro'
    )
  ),
  adiantamento numeric(12, 2) not null default 0,
  desconto numeric(12, 2) not null default 0,
  valor_deslocamento numeric(12, 2) not null default 0,
  valor_outros numeric(12, 2) not null default 0,
  veiculo_modelo_ano text,
  veiculo_marca text,
  veiculo_placa text,
  veiculo_chassis text,
  veiculo_km text,
  veiculo_patrimonio text,
  veiculo_acessorios text,
  defeito_reclamacao text,
  observacoes text,
  laudo_tecnico text,
  garantia_fabricante text,
  nf_numero text,
  nf_valor numeric(12, 2),
  os_terceiros text,
  assinatura_autorizacao text,
  assinatura_retirada text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create sequence if not exists ordem_servico_numero_seq start 1000;

-- Mantem a sequencia acima do maior numero ja existente em ordens_servico.numero.
-- Aceita formatos como OS-001234 ou qualquer numero no final do texto.
select setval(
  'ordem_servico_numero_seq',
  greatest(
    999,
    coalesce(
      (
        select max(substring(numero from '([0-9]+)$')::bigint)
        from ordens_servico
        where numero ~ '[0-9]+$'
      ),
      999
    )
  ),
  true
);

create or replace function gerar_numero_os()
returns trigger as $$
begin
  if new.numero is null or trim(new.numero) = '' then
    new.numero := 'OS-' || lpad(nextval('ordem_servico_numero_seq')::text, 6, '0');
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists ordens_servico_set_updated_at on ordens_servico;
create trigger ordens_servico_set_updated_at
before update on ordens_servico
for each row execute function set_updated_at();

drop trigger if exists ordens_servico_gerar_numero on ordens_servico;
create trigger ordens_servico_gerar_numero
before insert on ordens_servico
for each row execute function gerar_numero_os();

drop trigger if exists ordens_servico_set_created_by on ordens_servico;
create trigger ordens_servico_set_created_by
before insert on ordens_servico
for each row execute function set_created_by();

create table if not exists ordem_pecas (
  id text primary key default gen_random_uuid()::text,
  os_id text not null references ordens_servico(id) on delete restrict,
  item_codigo text,
  item_descricao text,
  peca_numero text,
  descricao text not null,
  valor_unitario numeric(12, 2) not null default 0,
  quantidade integer not null default 1 check (quantidade > 0),
  tecnico text,
  tecnico_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists ordem_pecas_set_updated_at on ordem_pecas;
create trigger ordem_pecas_set_updated_at
before update on ordem_pecas
for each row execute function set_updated_at();

drop trigger if exists ordem_pecas_set_created_by on ordem_pecas;
create trigger ordem_pecas_set_created_by
before insert on ordem_pecas
for each row execute function set_created_by();

create table if not exists ordem_servicos (
  id text primary key default gen_random_uuid()::text,
  os_id text not null references ordens_servico(id) on delete restrict,
  servico_padrao_id text,
  descricao text not null,
  tipo text not null default 'avulso' check (tipo in ('padrao', 'avulso')),
  hora_inicio time,
  hora_fim time,
  quantidade numeric(12, 2) not null default 1 check (quantidade > 0),
  valor_unitario numeric(12, 2) not null default 0,
  categoria text,
  tecnico text,
  tecnico_id uuid,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists ordem_servicos_set_updated_at on ordem_servicos;
create trigger ordem_servicos_set_updated_at
before update on ordem_servicos
for each row execute function set_updated_at();

drop trigger if exists ordem_servicos_set_created_by on ordem_servicos;
create trigger ordem_servicos_set_created_by
before insert on ordem_servicos
for each row execute function set_created_by();

create table if not exists lancamentos_caixa (
  id text primary key default gen_random_uuid()::text,
  os_id text references ordens_servico(id) on delete restrict,
  cliente_id text references clientes(id) on delete set null,
  os_numero text,
  cliente_nome text,
  forma_pagamento text not null check (
    forma_pagamento in (
      'pix',
      'dinheiro',
      'cartao_credito',
      'cartao_debito',
      'boleto',
      'transferencia',
      'outro'
    )
  ),
  valor numeric(12, 2) not null default 0 check (valor >= 0),
  data_recebimento date not null default current_date,
  observacao text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists lancamentos_caixa_set_updated_at on lancamentos_caixa;
create trigger lancamentos_caixa_set_updated_at
before update on lancamentos_caixa
for each row execute function set_updated_at();

drop trigger if exists lancamentos_caixa_set_created_by on lancamentos_caixa;
create trigger lancamentos_caixa_set_created_by
before insert on lancamentos_caixa
for each row execute function set_created_by();

create table if not exists movimentos_estoque (
  id text primary key default gen_random_uuid()::text,
  item_codigo text not null,
  item_descricao text,
  tipo text not null check (tipo in ('entrada', 'saida', 'ajuste')),
  quantidade integer not null,
  saldo_anterior integer not null default 0,
  saldo_posterior integer not null default 0,
  valor_unitario numeric(12, 2) not null default 0,
  os_id text references ordens_servico(id) on delete restrict,
  os_numero text,
  ordem_peca_id text references ordem_pecas(id) on delete set null,
  motivo text,
  fornecedor text,
  nota_fiscal text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  constraint movimentos_estoque_quantidade_por_tipo_check check (
    (tipo = 'ajuste' and quantidade >= 0)
    or (tipo in ('entrada', 'saida') and quantidade > 0)
  )
);

alter table movimentos_estoque
drop constraint if exists movimentos_estoque_quantidade_check;

alter table movimentos_estoque
drop constraint if exists movimentos_estoque_quantidade_por_tipo_check;

alter table movimentos_estoque
add constraint movimentos_estoque_quantidade_por_tipo_check check (
  (tipo = 'ajuste' and quantidade >= 0)
  or (tipo in ('entrada', 'saida') and quantidade > 0)
);

create table if not exists ordem_status_historico (
  id text primary key default gen_random_uuid()::text,
  os_id text not null references ordens_servico(id) on delete restrict,
  situacao_anterior text,
  situacao_nova text not null,
  observacao text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

drop trigger if exists movimentos_estoque_set_created_by on movimentos_estoque;
create trigger movimentos_estoque_set_created_by
before insert on movimentos_estoque
for each row execute function set_created_by();

drop trigger if exists ordem_status_historico_set_created_by on ordem_status_historico;
create trigger ordem_status_historico_set_created_by
before insert on ordem_status_historico
for each row execute function set_created_by();

create or replace function preparar_movimento_estoque()
returns trigger as $$
declare
  saldo_atual integer := 0;
begin
  -- Serializa movimentos do mesmo item para evitar dois inserts simultaneos
  -- calculando saldo a partir da mesma posicao anterior.
  perform pg_advisory_xact_lock(hashtext(new.item_codigo));

  select coalesce(saldo_posterior, 0)
  into saldo_atual
  from movimentos_estoque
  where item_codigo = new.item_codigo
  order by created_at desc, id desc
  limit 1
  for update;

  saldo_atual := coalesce(saldo_atual, 0);
  new.saldo_anterior := saldo_atual;

  if new.tipo in ('entrada', 'saida') and new.quantidade <= 0 then
    raise exception 'Movimento de entrada ou saida deve ter quantidade maior que zero';
  end if;

  if new.tipo = 'ajuste' and new.quantidade < 0 then
    raise exception 'Ajuste de estoque representa saldo final e nao pode ser negativo';
  end if;

  if new.tipo = 'saida' and saldo_atual < new.quantidade then
    raise exception 'Estoque insuficiente para saida';
  end if;

  if new.tipo = 'entrada' then
    new.saldo_posterior := saldo_atual + new.quantidade;
  elsif new.tipo = 'saida' then
    new.saldo_posterior := saldo_atual - new.quantidade;
  elsif new.tipo = 'ajuste' then
    -- Ajuste representa o saldo final do item, nao uma diferenca.
    new.saldo_posterior := new.quantidade;
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists movimentos_estoque_prepare on movimentos_estoque;
create trigger movimentos_estoque_prepare
before insert on movimentos_estoque
for each row execute function preparar_movimento_estoque();

create index if not exists clientes_nome_idx on clientes using gin (to_tsvector('portuguese', nome));
create index if not exists clientes_cpf_cnpj_idx on clientes (cpf_cnpj);
create index if not exists clientes_celular_idx on clientes (celular);
create index if not exists ordens_servico_numero_idx on ordens_servico (numero);
create index if not exists ordens_servico_cliente_id_idx on ordens_servico (cliente_id);
create index if not exists ordens_servico_situacao_idx on ordens_servico (situacao);
create index if not exists ordem_pecas_os_id_idx on ordem_pecas (os_id);
create index if not exists ordem_pecas_item_codigo_idx on ordem_pecas (item_codigo);
create index if not exists ordem_servicos_os_id_idx on ordem_servicos (os_id);
create index if not exists lancamentos_caixa_os_id_idx on lancamentos_caixa (os_id);
create index if not exists lancamentos_caixa_data_idx on lancamentos_caixa (data_recebimento desc);
create index if not exists movimentos_estoque_item_codigo_idx on movimentos_estoque (item_codigo);
create index if not exists movimentos_estoque_os_id_idx on movimentos_estoque (os_id);
create index if not exists movimentos_estoque_created_at_idx on movimentos_estoque (created_at desc);
create index if not exists ordem_status_historico_os_id_idx on ordem_status_historico (os_id);

create or replace view ordem_servico_totais
with (security_invoker = true) as
with pecas as (
  select
    os_id,
    sum(valor_unitario * quantidade) as total_pecas
  from ordem_pecas
  group by os_id
),
servicos as (
  select
    os_id,
    sum(valor_unitario * quantidade) as total_servicos
  from ordem_servicos
  group by os_id
),
recebimentos as (
  select
    os_id,
    sum(valor) as valor_recebido
  from lancamentos_caixa
  group by os_id
)
select
  os.id as os_id,
  os.numero as os_numero,
  coalesce(pecas.total_pecas, 0) as total_pecas,
  coalesce(servicos.total_servicos, 0) as total_servicos,
  coalesce(os.valor_deslocamento, 0) as valor_deslocamento,
  coalesce(os.valor_outros, 0) as valor_outros,
  coalesce(os.desconto, 0) as desconto,
  coalesce(os.adiantamento, 0) as adiantamento,
  coalesce(recebimentos.valor_recebido, 0) as valor_recebido,
  (
    coalesce(pecas.total_pecas, 0)
    + coalesce(servicos.total_servicos, 0)
    + coalesce(os.valor_deslocamento, 0)
    + coalesce(os.valor_outros, 0)
    - coalesce(os.desconto, 0)
  ) as valor_total,
  (
    coalesce(pecas.total_pecas, 0)
    + coalesce(servicos.total_servicos, 0)
    + coalesce(os.valor_deslocamento, 0)
    + coalesce(os.valor_outros, 0)
    - coalesce(os.desconto, 0)
    - coalesce(os.adiantamento, 0)
    - coalesce(recebimentos.valor_recebido, 0)
  ) as saldo_pendente
from ordens_servico os
left join pecas on pecas.os_id = os.id
left join servicos on servicos.os_id = os.id
left join recebimentos on recebimentos.os_id = os.id;

comment on view ordem_servico_totais is
  'Totais financeiros por OS. Usa security_invoker=true para respeitar RLS das tabelas base no Supabase/Postgres compativel.';

alter table clientes enable row level security;
alter table ordens_servico enable row level security;
alter table ordem_pecas enable row level security;
alter table ordem_servicos enable row level security;
alter table lancamentos_caixa enable row level security;
alter table movimentos_estoque enable row level security;
alter table ordem_status_historico enable row level security;

drop policy if exists "clientes read by team" on clientes;
create policy "clientes read by team"
on clientes for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "clientes insert by admin atendente" on clientes;
create policy "clientes insert by admin atendente"
on clientes for insert
to authenticated
with check (omnifix_has_role(array['admin', 'atendente']));

drop policy if exists "clientes update by admin atendente" on clientes;
create policy "clientes update by admin atendente"
on clientes for update
to authenticated
using (omnifix_has_role(array['admin', 'atendente']))
with check (omnifix_has_role(array['admin', 'atendente']));

drop policy if exists "ordens read by team" on ordens_servico;
create policy "ordens read by team"
on ordens_servico for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "ordens insert by team" on ordens_servico;
create policy "ordens insert by team"
on ordens_servico for insert
to authenticated
with check (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "ordens update by admin tecnico" on ordens_servico;
create policy "ordens update by admin tecnico"
on ordens_servico for update
to authenticated
using (omnifix_has_role(array['admin', 'tecnico']))
with check (omnifix_has_role(array['admin', 'tecnico']));

drop policy if exists "ordem pecas read by team" on ordem_pecas;
create policy "ordem pecas read by team"
on ordem_pecas for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "ordem pecas insert by admin tecnico" on ordem_pecas;
create policy "ordem pecas insert by admin tecnico"
on ordem_pecas for insert
to authenticated
with check (omnifix_has_role(array['admin', 'tecnico']));

drop policy if exists "ordem pecas update by admin tecnico" on ordem_pecas;
create policy "ordem pecas update by admin tecnico"
on ordem_pecas for update
to authenticated
using (omnifix_has_role(array['admin', 'tecnico']))
with check (omnifix_has_role(array['admin', 'tecnico']));

drop policy if exists "ordem servicos read by team" on ordem_servicos;
create policy "ordem servicos read by team"
on ordem_servicos for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "ordem servicos insert by admin tecnico" on ordem_servicos;
create policy "ordem servicos insert by admin tecnico"
on ordem_servicos for insert
to authenticated
with check (omnifix_has_role(array['admin', 'tecnico']));

drop policy if exists "ordem servicos update by admin tecnico" on ordem_servicos;
create policy "ordem servicos update by admin tecnico"
on ordem_servicos for update
to authenticated
using (omnifix_has_role(array['admin', 'tecnico']))
with check (omnifix_has_role(array['admin', 'tecnico']));

drop policy if exists "lancamentos caixa read by admin" on lancamentos_caixa;
create policy "lancamentos caixa read by admin"
on lancamentos_caixa for select
to authenticated
using (omnifix_has_role(array['admin']));

drop policy if exists "lancamentos caixa insert by admin" on lancamentos_caixa;
create policy "lancamentos caixa insert by admin"
on lancamentos_caixa for insert
to authenticated
with check (omnifix_has_role(array['admin']));

drop policy if exists "lancamentos caixa update by admin" on lancamentos_caixa;
create policy "lancamentos caixa update by admin"
on lancamentos_caixa for update
to authenticated
using (omnifix_has_role(array['admin']))
with check (omnifix_has_role(array['admin']));

drop policy if exists "movimentos estoque read by team" on movimentos_estoque;
create policy "movimentos estoque read by team"
on movimentos_estoque for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "movimentos estoque insert by admin tecnico" on movimentos_estoque;
create policy "movimentos estoque insert by admin tecnico"
on movimentos_estoque for insert
to authenticated
with check (omnifix_has_role(array['admin', 'tecnico']));

-- Historico de estoque imutavel: sem policies de UPDATE ou DELETE por padrao.
-- Ajuste de estoque representa saldo final, incluindo saldo zero.

drop policy if exists "ordem historico read by team" on ordem_status_historico;
create policy "ordem historico read by team"
on ordem_status_historico for select
to authenticated
using (omnifix_has_role(array['admin', 'tecnico', 'atendente']));

drop policy if exists "ordem historico insert by team" on ordem_status_historico;
create policy "ordem historico insert by team"
on ordem_status_historico for insert
to authenticated
with check (omnifix_has_role(array['admin', 'tecnico', 'atendente']));
