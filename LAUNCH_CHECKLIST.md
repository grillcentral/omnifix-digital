# Checklist final de lancamento publico - OmniFix Digital

## 1. GitHub

- [ ] Verificar status do Git:

```powershell
git status
```

- [ ] Revisar arquivos alterados.
- [ ] Criar commit final:

```powershell
git add .
git commit -m "Prepare omnifix-digital for public launch"
```

- [ ] Fazer push para `main`:

```powershell
git push origin main
```

## 2. Vercel

- [ ] Importar repositorio na Vercel.
- [ ] Confirmar framework como `Vite`.
- [ ] Configurar build command:

```text
npm run build
```

- [ ] Configurar output directory:

```text
dist
```

- [ ] Configurar env vars:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

- [ ] Fazer deploy production.
- [ ] Conferir status `Ready`.

## 3. Dominio

- [ ] Adicionar dominio principal na Vercel:

```text
viatecinfosc.com.br
```

- [ ] Adicionar subdominio:

```text
www.viatecinfosc.com.br
```

- [ ] Configurar `www` redirecionando para raiz:

```text
www.viatecinfosc.com.br -> viatecinfosc.com.br
```

- [ ] Configurar DNS do dominio raiz:

```text
Tipo: A
Nome: @
Valor: 76.76.21.21
```

- [ ] Configurar DNS do `www`:

```text
Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

- [ ] Aguardar propagacao DNS.
- [ ] Confirmar HTTPS ativo.

## 4. Supabase

- [ ] Supabase Auth criado e habilitado.
- [ ] Usuario admin criado em `Authentication > Users`.
- [ ] Registro em `profiles` criado.
- [ ] `profiles.role` ajustado para:

```text
admin
```

- [ ] `profiles.ativo` marcado como `true`.
- [ ] RLS ativo.
- [ ] Policies aplicadas com `database/auth_rls.sql`.
- [ ] Seed rodado com `database/seed.sql`.
- [ ] CRUD autenticado testado:
  - [ ] OS
  - [ ] Estoque
  - [ ] Leads

## 5. Testes producao

- [ ] Home carrega.
- [ ] `/produtos` carrega.
- [ ] `/blog` carrega.
- [ ] Login funciona.
- [ ] `/os` bloqueia sem login.
- [ ] `/os` funciona logado.
- [ ] `/estoque` funciona logado.
- [ ] `/leads` funciona logado.
- [ ] Logout funciona.
- [ ] `/status` mostra Supabase conectado.
- [ ] Mobile OK.
- [ ] Desktop OK.

## 6. Pos-lancamento

- [ ] Cadastrar dominio no Google Search Console.
- [ ] Configurar Google Meu Negocio com o dominio:

```text
https://viatecinfosc.com.br
```

- [ ] Colocar link no Instagram.
- [ ] Colocar link no WhatsApp.
- [ ] Testar formulario/agendamento.
- [ ] Monitorar primeiras OS/leads reais.
- [ ] Revisar logs da Vercel.
- [ ] Revisar Supabase Auth e RLS apos primeiros acessos.

## 7. Validacao final local

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```
