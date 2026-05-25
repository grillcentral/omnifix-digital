# Separacao de dominios - Viatec / OmniFix

## Arquitetura final

O dominio principal da Viatec sera usado pelo site publico no Base44.
O OmniFix continua existindo como sistema operacional separado, hospedado na
Vercel, com acesso por subdominio ou pela URL `*.vercel.app`.

```text
viatecinfosc.com.br        -> Base44
www.viatecinfosc.com.br    -> Base44 ou redirect para raiz
app.viatecinfosc.com.br    -> OmniFix na Vercel
*.vercel.app               -> fallback temporario do OmniFix
localhost                  -> desenvolvimento local
```

## Base44 no dominio raiz

Destino publico:

```text
https://viatecinfosc.com.br
```

Projeto Base44:

```text
https://viatecinformatica.base44.app/
```

Configure o dominio raiz dentro do painel Base44 e siga exatamente os registros
DNS informados por ele.

## OmniFix no subdominio app

Endpoint operacional recomendado:

```text
https://app.viatecinfosc.com.br
```

O OmniFix deve permanecer no projeto Vercel atual, sem remover o fallback
`*.vercel.app`.

Nao e necessario alterar a logica React para essa troca: o frontend atual nao
tem hardcode de `viatecinfosc.com.br` em `src/`, `public/`, `vercel.json`,
`vite.config.js` ou arquivos `.env*`.

## DNS esperado

### Base44

Use os registros definidos para o Base44:

```text
Tipo: A
Nome: @
Valor: 216.24.57.1

Tipo: CNAME
Nome: www
Valor: base44.onrender.com
```

Antes de apontar o raiz para Base44, remova/substitua registros antigos que
mandavam o dominio principal para a Vercel, como:

```text
Tipo: A
Nome: @
Valor: 76.76.21.21
```

### OmniFix / Vercel

Para o subdominio operacional:

```text
Tipo: CNAME
Nome: app
Valor: cname.vercel-dns.com
```

Se escolher outro subdominio no futuro, como `sistema`, use:

```text
Tipo: CNAME
Nome: sistema
Valor: cname.vercel-dns.com
```

## Checklist Cloudflare

- [ ] Remover ou alterar o registro `A @ 76.76.21.21` quando o raiz deixar de apontar para Vercel.
- [ ] Criar/substituir `A @ -> 216.24.57.1` para o Base44.
- [ ] Criar/substituir `CNAME www -> base44.onrender.com` para o Base44.
- [ ] Criar `CNAME app -> cname.vercel-dns.com` para o OmniFix.
- [ ] Deixar os registros como `DNS only` ate validar HTTPS e login.
- [ ] Validar `https://viatecinfosc.com.br` abrindo o Base44.
- [ ] Validar `https://app.viatecinfosc.com.br` abrindo o OmniFix.
- [ ] Depois de validar, avaliar ativar proxy Cloudflare se nao houver conflito com Base44/Vercel.

## Checklist Vercel

- [ ] Manter o projeto OmniFix ativo.
- [ ] Manter env vars atuais:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`
- [ ] Remover `viatecinfosc.com.br` do projeto OmniFix antes de usar o raiz no Base44.
- [ ] Remover `www.viatecinfosc.com.br` do projeto OmniFix se o `www` tambem for para Base44.
- [ ] Adicionar `app.viatecinfosc.com.br` ao projeto OmniFix.
- [ ] Aguardar certificado HTTPS ficar ativo.
- [ ] Manter a URL `*.vercel.app` como fallback operacional.
- [ ] Validar rotas:
  - `/`
  - `/login`
  - `/os`
  - `/estoque`
  - `/leads`

## Checklist Supabase Auth

Em `Authentication > URL Configuration`, atualizar:

### Site URL

```text
https://app.viatecinfosc.com.br
```

### Redirect URLs

```text
https://app.viatecinfosc.com.br
https://app.viatecinfosc.com.br/login
https://app.viatecinfosc.com.br/*
https://SEU-PROJETO.vercel.app
https://SEU-PROJETO.vercel.app/*
http://localhost:5173
http://localhost:5173/*
```

Substitua `SEU-PROJETO` pela URL real do projeto na Vercel.

## Ordem segura de execucao

1. Adicionar `app.viatecinfosc.com.br` na Vercel.
2. Criar `CNAME app -> cname.vercel-dns.com` no DNS.
3. Aguardar HTTPS do subdominio.
4. Atualizar Supabase Auth com `app.viatecinfosc.com.br` e fallback `*.vercel.app`.
5. Testar login e rotas protegidas no subdominio.
6. Remover dominio raiz do OmniFix/Vercel.
7. Configurar dominio raiz no Base44.
8. Atualizar DNS do raiz e `www` para Base44.
9. Validar Base44 no dominio principal.
10. Manter `*.vercel.app` ativo como emergencia.
