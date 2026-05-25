# Deploy Vercel - OmniFix Digital

## 1. Conectar GitHub

1. Crie um repositorio no GitHub para o projeto.
2. Suba o codigo do `omnifix-digital`.
3. Confirme que os arquivos principais estao versionados:
   - `package.json`
   - `vite.config.js`
   - `vercel.json`
   - `src/`
   - `database/`
   - `.env.production.example`

Nao versionar `.env`.

## 2. Importar projeto na Vercel

1. Acesse `https://vercel.com`.
2. Clique em `Add New... > Project`.
3. Escolha o repositorio do `omnifix-digital`.
4. Configure:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

O `vercel.json` ja contem o fallback SPA para React Router.

## 3. Configurar variaveis de ambiente

Na Vercel, em `Project Settings > Environment Variables`, crie:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_APP_ENV=production
VITE_APP_VERSION=0.1.0
VITE_BUILD_DATE=
```

Use os valores do Supabase:

- `VITE_SUPABASE_URL`: Project URL
- `VITE_SUPABASE_ANON_KEY`: anon public key ou publishable key publica

Nunca use `service_role` no frontend.

Variaveis obrigatorias para producao:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 4. Deploy production

1. Clique em `Deploy`.
2. Aguarde a instalacao e o build.
3. Abra a URL gerada pela Vercel.
4. Valide:
   - `/`
   - `/produtos`
   - `/blog`
   - `/login`
   - `/status`
   - rota protegida `/os` redirecionando para `/login`

## 5. Dominios apos migracao do dominio principal para Base44

O dominio raiz oficial da Viatec sera usado pelo projeto Base44:

```text
https://viatecinfosc.com.br -> https://viatecinformatica.base44.app/
```

Nao remova o projeto OmniFix da Vercel. Apenas retire dele o dominio raiz e
mantenha o sistema operacional em um endpoint separado.

Opcoes recomendadas para o OmniFix:

- `https://app.viatecinfosc.com.br` - recomendado para sistema operacional.
- `https://sistema.viatecinfosc.com.br` - alternativa clara para usuarios internos.
- URL temporaria `*.vercel.app` - boa para transicao e testes.

Na Vercel, em `Project Settings > Domains`:

1. Remova `viatecinfosc.com.br` do projeto OmniFix quando for apontar o raiz para Base44.
2. Remova `www.viatecinfosc.com.br` do projeto OmniFix se ele tambem for usado pelo site Base44.
3. Adicione o subdominio operacional escolhido, preferencialmente:

```text
app.viatecinfosc.com.br
```

4. Mantenha a URL `*.vercel.app` ativa como acesso de emergencia.
5. Configure DNS conforme instrucoes da Vercel.
6. Aguarde HTTPS ficar ativo.
7. No Supabase, atualize:
   - `Authentication > URL Configuration > Site URL`
   - `Authentication > URL Configuration > Redirect URLs`

Para OmniFix em `app.viatecinfosc.com.br`, inclua:

```text
https://app.viatecinfosc.com.br
https://app.viatecinfosc.com.br/login
https://app.viatecinfosc.com.br/*
https://SEU-PROJETO.vercel.app
https://SEU-PROJETO.vercel.app/*
```

## 6. DNS

Siga sempre os valores exibidos pela Vercel e pela Base44.

### Dominio raiz para Base44

Configure `viatecinfosc.com.br` e `www.viatecinfosc.com.br` para o Base44:

```text
Tipo: A
Nome: @
Valor: 216.24.57.1

Tipo: CNAME
Nome: www
Valor: base44.onrender.com
```

### Subdominio do OmniFix na Vercel

Para manter o OmniFix em `app.viatecinfosc.com.br`, configure:

```text
Tipo: CNAME
Nome: app
Valor: cname.vercel-dns.com
```

Se escolher `sistema.viatecinfosc.com.br`:

```text
Tipo: CNAME
Nome: sistema
Valor: cname.vercel-dns.com
```

### Registros antigos da Vercel

Antes de apontar o dominio principal para a Base44, remova ou substitua os
registros antigos que levavam o dominio raiz para a Vercel:

```text
Tipo: A
Nome: @
Valor: 76.76.21.21
```

E remova ou altere o CNAME antigo do `www` caso ele apontasse para a Vercel:

```text
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

Use `www` no Base44 ou redirecione `www` para o raiz conforme a configuracao do Base44.

Se estiver usando Cloudflare, deixe o proxy desativado ate validar cada destino:

```text
Proxy status: DNS only
```

Depois que HTTPS, login e rotas estiverem funcionando, avalie ativar proxy.

## 6.1 Variaveis de ambiente relacionadas a dominio

O frontend atual nao possui dominio hardcoded em `src/` e nao depende de uma
variavel de URL publica para funcionar.

Se no futuro houver links absolutos no app, use uma variavel de ambiente em vez
de hardcode:

```text
VITE_APP_PUBLIC_URL=https://app.viatecinfosc.com.br
```

## 7. Validar build local

No PowerShell:

```powershell
cd "C:\Projetos\OMNIFIX-DIGITAL"
npm install
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

## 8. Validar build na Vercel

No painel do deploy:

- Confirmar status `Ready`.
- Abrir logs de build se falhar.
- Conferir se as env vars foram aplicadas ao ambiente `Production`.
- Fazer redeploy apos alterar env vars.

## 9. Checklist rapido

- [ ] Repositorio GitHub conectado.
- [ ] Vercel importou o projeto como Vite.
- [ ] `vercel.json` presente.
- [ ] `dist` configurado como output.
- [ ] `npm run build` passou.
- [ ] `VITE_SUPABASE_URL` configurada.
- [ ] `VITE_SUPABASE_ANON_KEY` configurada.
- [ ] Supabase Auth com URLs de producao.
- [ ] RLS aplicado.
- [ ] Dominio raiz `viatecinfosc.com.br` removido do OmniFix/Vercel antes de apontar para Base44.
- [ ] Base44 configurado para `viatecinfosc.com.br`.
- [ ] OmniFix configurado em `app.viatecinfosc.com.br`, `sistema.viatecinfosc.com.br` ou `*.vercel.app`.
- [ ] DNS propagado.
- [ ] HTTPS ativo.
- [ ] `/status` mostra Supabase conectado.
- [ ] `/login` funciona.
- [ ] Login funcionando.
- [ ] Rotas protegidas bloqueiam anon.
- [ ] `/os` protegido.
- [ ] CRUD real funcionando.
