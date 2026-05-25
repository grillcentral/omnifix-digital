# OmniFix Digital - Producao

## Arquitetura

OmniFix Digital e uma aplicacao React/Vite para operacao de assistencia tecnica,
CRM, estoque, agenda e conteudo publico.

O frontend roda como SPA e usa Supabase para:

- PostgreSQL
- Auth
- Row Level Security
- API via `@supabase/supabase-js`

## Stack

- React
- Vite
- TailwindCSS
- React Router
- TanStack React Query
- Supabase
- PostgreSQL
- Lucide React
- Framer Motion
- Recharts
- Vercel

## Estrutura principal

```text
src/
  api/
  components/
  components/auth/
  components/forms/
  components/system/
  components/ui/
  context/
  hooks/
  lib/
  pages/
  routes/
database/
  schema.sql
  auth_rls.sql
  disable_rls_dev.sql
  seed.sql
```

## Deploy

O deploy recomendado usa Vercel:

- Build command: `npm run build`
- Output directory: `dist`
- SPA fallback configurado em `vercel.json`
- Dominio principal da Viatec: `https://viatecinfosc.com.br`
- Destino do dominio principal: Base44 em `https://viatecinformatica.base44.app/`
- Dominio recomendado para o OmniFix operacional: `https://app.viatecinfosc.com.br`
- Alternativas para OmniFix: `https://sistema.viatecinfosc.com.br` ou URL `*.vercel.app`

O OmniFix deve continuar hospedado na Vercel, mas separado do dominio principal
publico que sera apontado para Base44.

Documentacao detalhada:

```text
DEPLOY_VERCEL.md
```

## Variaveis de ambiente

Obrigatorias:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Opcionais:

```env
VITE_APP_ENV=production
VITE_APP_VERSION=0.1.0
VITE_BUILD_DATE=
```

## Auth

A autenticacao usa Supabase Auth com email/senha.

Arquivos principais:

- `src/context/AuthContext.jsx`
- `src/hooks/useAuth.js`
- `src/components/auth/ProtectedRoute.jsx`
- `src/pages/Login.jsx`

Rotas operacionais protegidas:

- `/os`
- `/estoque`
- `/leads`
- `/crm`
- `/calendario`

## RLS

Scripts:

- `database/schema.sql`: schema completo
- `database/auth_rls.sql`: apenas Auth/RLS
- `database/disable_rls_dev.sql`: emergencia em desenvolvimento

Politicas:

- anon pode ler tabelas publicas:
  - `products`
  - `testimonials`
  - `blog_posts`
- authenticated pode ler/escrever tabelas operacionais.

## Status do sistema

Rota:

```text
/status
```

Mostra:

- Supabase conectado
- Auth online
- usuario autenticado
- ambiente
- versao
- build date

## Validacao local

```powershell
cd "C:\Projetos\OMNIFIX-DIGITAL"
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

## Checklist producao

- Supabase production configurado.
- RLS aplicado.
- Usuarios Auth criados.
- Papeis em `perfis.papel` ajustados.
- Env vars na Vercel.
- Deploy Vercel pronto.
- Dominio principal `viatecinfosc.com.br` apontado para Base44.
- OmniFix configurado em `app.viatecinfosc.com.br`, `sistema.viatecinfosc.com.br` ou `*.vercel.app`.
- HTTPS ativo.
- `/status` validado.
- Login e logout validados.
- `/os` protegido.
- CRUD autenticado validado.
