# Checklist tecnico de ativacao Supabase - OmniFix Digital

Este guia ativa o `omnifix-digital` com persistencia real no Supabase/PostgreSQL.

## 1. Criar projeto no Supabase

1. Acesse `https://supabase.com`.
2. Entre na sua conta.
3. Clique em `New project`.
4. Escolha a organizacao.
5. Preencha:
   - `Project name`: `omnifix-digital`
   - `Database Password`: crie uma senha forte e guarde.
   - `Region`: escolha a regiao mais proxima.
6. Clique em `Create new project`.
7. Aguarde o provisionamento finalizar.

## 2. Pegar Project URL e anon public key

No painel do projeto Supabase:

1. Acesse `Project Settings`.
2. Entre em `API`.
3. Copie:
   - `Project URL`
   - `anon public`

Esses valores serao usados no `.env` local.

## 3. Criar .env local

No PowerShell, dentro da pasta do projeto:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
Copy-Item .env.example .env
notepad .env
```

Preencha:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=SUA_ANON_PUBLIC_KEY
```

Depois de alterar `.env`, reinicie o servidor Vite.

## 4. Rodar database/schema.sql no Supabase

1. No Supabase, abra `SQL Editor`.
2. Clique em `New query`.
3. No PowerShell, abra o arquivo local:

```powershell
notepad "C:\Progeto Cardapio digital\omnifix-digital\database\schema.sql"
```

4. Copie todo o conteudo.
5. Cole no `SQL Editor`.
6. Clique em `Run`.

## 5. Validar tabelas criadas

No Supabase:

1. Acesse `Table Editor`.
2. Confirme se existem:
   - `ordens_servico`
   - `leads`
   - `estoque`
   - `agendamentos`
   - `blog_posts`
   - `testimonials`
   - `products`

Tambem pode validar no `SQL Editor`:

```sql
select table_name
from information_schema.tables
where table_schema = 'public'
  and table_name in (
    'ordens_servico',
    'leads',
    'estoque',
    'agendamentos',
    'blog_posts',
    'testimonials',
    'products'
  )
order by table_name;
```

## 6. Rodar projeto local

No PowerShell:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
npm install
npm run dev
```

Abra a URL exibida pelo Vite, normalmente:

```text
http://localhost:5173
```

## 7. Testar CRUD real

Antes de testar, confirme que `.env` esta preenchido e que o servidor Vite foi reiniciado.

### Criar OS

1. Acesse `/os`.
2. Clique em `Nova OS`.
3. Preencha os campos obrigatorios:
   - cliente
   - telefone
   - tecnico responsavel
   - defeito reclamado
4. Clique em `Salvar OS`.
5. Valide no Supabase em `Table Editor > ordens_servico`.

### Editar OS

1. Acesse `/os`.
2. Clique em `Editar` em uma OS.
3. Altere situacao, prioridade ou laudo tecnico.
4. Salve.
5. Valide a alteracao em `ordens_servico`.

### Criar lead

1. Acesse `/leads`.
2. Clique em `Novo Lead`.
3. Preencha nome, telefone, email, tipo, estagio, origem, dispositivo e problema.
4. Clique em `Salvar lead`.
5. Valide em `Table Editor > leads`.

### Editar lead

1. Acesse `/leads`.
2. Clique em `Editar`.
3. Altere estagio, valor estimado ou notas.
4. Salve.
5. Valide em `leads`.

### Criar item de estoque

1. Acesse `/estoque`.
2. Clique em `Novo item`.
3. Preencha codigo, descricao, categoria, quantidades, fornecedor e localizacao.
4. Clique em `Salvar item`.
5. Valide em `Table Editor > estoque`.

### Editar item de estoque

1. Acesse `/estoque`.
2. Clique em `Editar`.
3. Altere quantidade atual, valor de venda ou status.
4. Salve.
5. Valide em `estoque`.

## 8. Problemas comuns

### Env nao carregado

Sintomas:

- Tela mostra erro de Supabase nao configurado.
- Requests nao chegam ao Supabase.

Correcoes:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
Get-Content .env
```

Confirme que as variaveis comecam com `VITE_`.

Depois reinicie:

```powershell
npm run dev
```

### RLS bloqueando insert/update

Sintomas:

- Erro ao salvar registro.
- Mensagem parecida com `new row violates row-level security policy`.

Correcoes para ambiente inicial de teste:

1. No Supabase, abra `Authentication > Policies`.
2. Confira as policies das tabelas.
3. Para teste local, desabilite RLS temporariamente ou crie policies permitindo `select`, `insert` e `update` para `anon`.

Exemplo temporario para desenvolvimento:

```sql
alter table ordens_servico disable row level security;
alter table leads disable row level security;
alter table estoque disable row level security;
alter table agendamentos disable row level security;
alter table blog_posts disable row level security;
alter table testimonials disable row level security;
alter table products disable row level security;
```

### Tabela nao existe

Sintomas:

- Erro `relation does not exist`.

Correcoes:

1. Rode novamente `database/schema.sql`.
2. Confirme se o SQL foi executado no projeto Supabase correto.
3. Valide no `Table Editor`.

### Coluna divergente

Sintomas:

- Erro informando que uma coluna nao existe.
- Insert/update falha em OS, leads ou estoque.

Correcoes:

1. Compare a tabela no Supabase com `database/schema.sql`.
2. Rode novamente o schema completo.
3. Se houver dados importantes, faca backup antes de alterar colunas.

## 9. Comandos PowerShell uteis

Entrar no projeto:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
```

Instalar dependencias:

```powershell
npm install
```

Criar `.env`:

```powershell
Copy-Item .env.example .env
notepad .env
```

Abrir schema:

```powershell
notepad database\schema.sql
```

Rodar dev:

```powershell
npm run dev
```

Validar lint:

```powershell
npm run lint
```

Validar build:

```powershell
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

## 10. Validacao final

Antes de considerar ativado:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

Checklist final:

- `.env` existe e esta preenchido.
- `database/schema.sql` foi executado no Supabase.
- Tabelas aparecem no `Table Editor`.
- `/os` cria e edita registros reais.
- `/leads` cria e edita registros reais.
- `/estoque` cria e edita registros reais.
- `npm run lint` passa.
- `npm run build` passa.
