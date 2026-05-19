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

## 5. Conectar dominio oficial

1. Acesse `Project Settings > Domains`.
2. Adicione o dominio raiz:

```text
viatecinfosc.com.br
```

3. Adicione o subdominio:

```text
www.viatecinfosc.com.br
```

4. Escolha o dominio canonico.
5. Recomendacao: usar o dominio raiz como principal:

```text
https://viatecinfosc.com.br
```

6. Configure o redirect de `www.viatecinfosc.com.br` para `viatecinfosc.com.br` na Vercel.
7. Configure DNS conforme instrucoes da Vercel.
8. Aguarde HTTPS ficar ativo.
9. No Supabase, atualize:
   - `Authentication > URL Configuration > Site URL`
   - `Authentication > URL Configuration > Redirect URLs`

Inclua:

```text
https://viatecinfosc.com.br
https://viatecinfosc.com.br/login
https://www.viatecinfosc.com.br
https://www.viatecinfosc.com.br/login
```

## 6. DNS

Siga sempre os valores exibidos pela Vercel em `Project Settings > Domains`.

Configuracao comum:

### Dominio raiz

Se a Vercel pedir registro `A`, configure:

```text
Tipo: A
Nome: @
Valor: 76.76.21.21
```

### Subdominio www

Configure:

```text
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

Se estiver usando Cloudflare, deixe o proxy desativado ate validar:

```text
Proxy status: DNS only
```

Depois que HTTPS, login e rotas estiverem funcionando, avalie ativar proxy.

## 7. Validar build local

No PowerShell:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
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
- [ ] Dominio raiz `viatecinfosc.com.br` adicionado.
- [ ] Subdominio `www.viatecinfosc.com.br` adicionado.
- [ ] Redirect `www` para raiz configurado.
- [ ] DNS propagado.
- [ ] HTTPS ativo.
- [ ] `/status` mostra Supabase conectado.
- [ ] `/login` funciona.
- [ ] Login funcionando.
- [ ] Rotas protegidas bloqueiam anon.
- [ ] `/os` protegido.
- [ ] CRUD real funcionando.
