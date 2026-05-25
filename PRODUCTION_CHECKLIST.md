# Checklist de producao - OmniFix Digital

## 1. Supabase production

- Criar ou selecionar o projeto Supabase definitivo.
- Executar `database/schema.sql` no SQL Editor.
- Executar `database/seed.sql` se quiser popular produtos, depoimentos e blog.
- Confirmar tabelas:
  - `perfis`
  - `ordens_servico`
  - `leads`
  - `estoque`
  - `agendamentos`
  - `blog_posts`
  - `testimonials`
  - `products`
- Confirmar Auth habilitado em `Authentication > Providers > Email`.
- Criar usuarios internos em `Authentication > Users`.
- Conferir `perfis` e ajustar `papel`:
  - `admin`
  - `tecnico`
  - `atendente`

## 2. Row Level Security

- Confirmar RLS habilitado nas tabelas operacionais.
- Confirmar leitura publica apenas em:
  - `products`
  - `testimonials`
  - `blog_posts`
- Confirmar que `ordens_servico`, `leads`, `estoque`, `agendamentos` exigem usuario autenticado.
- Testar login com usuario real antes de liberar operacao.

## 3. Variaveis de ambiente

No ambiente local e na Vercel:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Nunca usar `service_role` no frontend.

## 4. Deploy Vercel

1. Conectar o repositorio na Vercel.
2. Configurar framework como `Vite`.
3. Build command:

```bash
npm run build
```

4. Output directory:

```bash
dist
```

5. Adicionar as variaveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.
6. Fazer deploy.

## 5. Build production local

No PowerShell:

```powershell
cd "C:\Projetos\OMNIFIX-DIGITAL"
npm install
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

## 6. Validacao funcional

- Abrir `/login`.
- Entrar com usuario Supabase Auth.
- Verificar navbar com usuario e botao logout.
- Acessar `/os`.
- Criar e editar OS.
- Acessar `/leads`.
- Criar e editar lead.
- Acessar `/estoque`.
- Criar e editar item.
- Acessar `/crm` e `/calendario`.
- Sair da conta.
- Confirmar que rotas protegidas redirecionam para `/login`.

## 7. Dominio e HTTPS

- Apontar `viatecinfosc.com.br` para o projeto Base44.
- Manter OmniFix na Vercel em `app.viatecinfosc.com.br`, `sistema.viatecinfosc.com.br` ou `*.vercel.app`.
- Validar certificado HTTPS ativo no Base44.
- Validar certificado HTTPS ativo no endpoint OmniFix.
- Atualizar URLs permitidas no Supabase Auth:
  - `Authentication > URL Configuration > Site URL`
  - `Authentication > URL Configuration > Redirect URLs`

## 8. Backups

- Ativar backups no plano Supabase adequado.
- Documentar senha do banco em cofre seguro.
- Exportar schema antes de mudancas grandes.
- Testar restore em ambiente separado antes de producao.

## 9. Seguranca operacional

- Nao expor `service_role`.
- Revisar policies antes de liberar clientes reais.
- Criar usuarios individuais, sem compartilhar senha.
- Usar papeis corretos em `perfis.papel`.
- Remover registros de teste antes do uso oficial.

## 10. Go-live

- `npm run lint` passou.
- `npm run build` passou.
- RLS validado.
- Login validado.
- CRUD validado.
- Dominio e HTTPS ativos.
- Backups conferidos.
- Variaveis de ambiente configuradas na Vercel.
