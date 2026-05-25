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

- [ ] Remover o dominio principal do projeto OmniFix/Vercel quando for apontar para Base44:

```text
viatecinfosc.com.br
```

- [ ] Configurar o dominio principal no Base44:

```text
https://viatecinfosc.com.br -> https://viatecinformatica.base44.app/
```

- [ ] Configurar DNS do dominio raiz para Base44:

```text
Tipo: A
Nome: @
Valor: 216.24.57.1
```

- [ ] Definir o destino de `www` no Base44 ou redirecionar `www` para o raiz:

```text
Tipo: CNAME
Nome: www
Valor: base44.onrender.com
```

- [ ] Manter OmniFix acessivel por um endpoint separado.
- [ ] Recomendado para OmniFix:

```text
app.viatecinfosc.com.br
```

- [ ] Alternativas aceitas para OmniFix:

```text
sistema.viatecinfosc.com.br
*.vercel.app
```

- [ ] Configurar DNS do subdominio OmniFix na Vercel:

```text
Tipo: CNAME
Nome: app
Valor: cname.vercel-dns.com
```

- [ ] Remover/substituir registros antigos que apontavam o dominio raiz para a Vercel, como `A @ 76.76.21.21`, antes de publicar o Base44 no raiz.
- [ ] Aguardar propagacao DNS.
- [ ] Confirmar HTTPS ativo no Base44.
- [ ] Confirmar HTTPS ativo no subdominio/URL Vercel do OmniFix.

## 4. Supabase

- [ ] Supabase Auth criado e habilitado.
- [ ] Usuario admin criado em `Authentication > Users`.
- [ ] Registro em `perfis` criado.
- [ ] `perfis.papel` ajustado para:

```text
admin
```

- [ ] `perfis.ativo` marcado como `true`.
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

- [ ] Cadastrar dominio principal no Google Search Console para o site Base44.
- [ ] Configurar Google Meu Negocio com o dominio principal:

```text
https://viatecinfosc.com.br
```

- [ ] Usar o link operacional do OmniFix apenas para equipe interna:

```text
https://app.viatecinfosc.com.br
```

- [ ] Colocar link no Instagram.
- [ ] Colocar link no WhatsApp.
- [ ] Testar formulario/agendamento.
- [ ] Monitorar primeiras OS/leads reais.
- [ ] Revisar logs da Vercel.
- [ ] Revisar Supabase Auth e RLS apos primeiros acessos.

## 7. Validacao final local

```powershell
cd "C:\Projetos\OMNIFIX-DIGITAL"
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```
