# Auth e RLS - OmniFix Digital

Este guia aplica e valida a camada de autenticacao e seguranca do Supabase.

## 1. Rodar schema atualizado no Supabase

Use este fluxo quando estiver criando o banco do zero:

1. Abra o Supabase.
2. Entre no projeto `omnifix-digital`.
3. Acesse `SQL Editor`.
4. Clique em `New query`.
5. Cole o conteudo de `database/schema.sql`.
6. Clique em `Run`.

No PowerShell, para abrir o arquivo local:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
notepad database\schema.sql
```

## 2. Aplicar apenas Auth/RLS em banco existente

Use este fluxo quando as tabelas principais ja existem:

1. Abra `SQL Editor`.
2. Clique em `New query`.
3. Cole o conteudo de `database/auth_rls.sql`.
4. Clique em `Run`.

No PowerShell:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
notepad database\auth_rls.sql
```

Esse script cria apenas:

- `profiles`
- trigger de criacao automatica de profile
- `enable row level security`
- policies de leitura/escrita

Ele nao recria as tabelas principais.

## 3. Criar usuario em Authentication > Users

No Supabase:

1. Acesse `Authentication`.
2. Clique em `Users`.
3. Clique em `Add user`.
4. Informe email e senha.
5. Confirme a criacao.

Depois disso, o trigger deve criar automaticamente um registro em `profiles`.

## 4. Ajustar role em profiles

No Supabase:

1. Acesse `Table Editor`.
2. Abra a tabela `profiles`.
3. Encontre o usuario criado.
4. Ajuste `role` para uma das opcoes:
   - `admin`
   - `tecnico`
   - `atendente`
5. Confirme que `ativo` esta como `true`.

Query opcional:

```sql
update profiles
set role = 'admin', ativo = true
where id = 'UUID_DO_USUARIO';
```

## 5. Testar login

No app local:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
npm run dev
```

Abra:

```text
http://localhost:5173/login
```

Teste:

- email do usuario criado
- senha configurada no Supabase
- navbar mostrando usuario autenticado
- botao `Sair`

## 6. Testar acesso bloqueado sem login

1. Clique em `Sair`.
2. Acesse diretamente:
   - `/os`
   - `/estoque`
   - `/leads`
   - `/crm`
   - `/calendario`
3. Confirme que o app redireciona para `/login`.

## 7. Testar CRUD autenticado

Com login ativo:

### OS

1. Acesse `/os`.
2. Crie uma OS.
3. Edite a OS.
4. Confirme o registro em `ordens_servico`.

### Leads

1. Acesse `/leads`.
2. Crie um lead.
3. Edite o lead.
4. Confirme o registro em `leads`.

### Estoque

1. Acesse `/estoque`.
2. Crie um item.
3. Edite o item.
4. Confirme o registro em `estoque`.

## 8. Resolver erro de RLS

Erro comum:

```text
new row violates row-level security policy
```

Verifique:

- usuario esta logado no app
- `profiles.ativo` esta `true`
- `profiles.role` esta correto
- `database/auth_rls.sql` foi executado no projeto certo
- policies existem em `Authentication > Policies`

Para emergencia em desenvolvimento, rode:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
notepad database\disable_rls_dev.sql
```

Cole o conteudo no SQL Editor e execute. Use apenas em desenvolvimento.

## 9. Validacao local

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

## 10. Checklist final

- [ ] Usuario admin criado
- [ ] `profiles.role` ajustado para `admin`
- [ ] Login funcionando
- [ ] `/os` protegido
- [ ] `/estoque` protegido
- [ ] `/leads` protegido
- [ ] CRUD autenticado funcionando
- [ ] Logout funcionando
- [ ] `npm run lint` passando
- [ ] `npm run build` passando
