# Reorganizacao local do projeto - OmniFix Digital

Este documento prepara a mudanca do `omnifix-digital` para uma estrutura local mais profissional, sem executar a mudanca automaticamente.

## Objetivo

Mover o projeto de:

```text
C:\Progeto Cardapio digital\omnifix-digital
```

Para:

```text
C:\PROJETOS\OMNIFIX-DIGITAL
```

Estrutura desejada:

```text
C:\PROJETOS\
  ├── OMNIFIX-DIGITAL
  ├── GRILL-CARDAPIO
  ├── LABELCONTROL
  ├── MARCELO-AI
  ├── VIATECFLOW
```

## Por que separar os projetos

Manter varios projetos misturados dentro de uma unica pasta aumenta o risco de:

- rodar comandos no projeto errado;
- confundir `.env` de um app com outro;
- misturar `node_modules` e scripts de stacks diferentes;
- fazer commit/push de arquivos fora do escopo;
- apontar deploy para a raiz errada;
- quebrar paths em Vite, Supabase, Electron, Next.js ou automacoes.

Para React/Vite/Supabase, a boa pratica e cada app ter sua propria pasta raiz, com:

- `package.json`;
- `.env`;
- `node_modules`;
- `src`;
- `database`;
- documentacao;
- repositorio Git separado ou raiz Git bem definida.

## Antes de mover

No PowerShell:

```powershell
cd "C:\Progeto Cardapio digital\omnifix-digital"
git status
npm run lint
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

Confira:

- build passa;
- `.env` existe;
- `git status` nao mostra alteracoes inesperadas;
- o projeto atual abre normalmente.

## Criar a pasta profissional

```powershell
New-Item -ItemType Directory -Force -Path "C:\PROJETOS"
```

Opcionalmente, ja preparar as pastas futuras:

```powershell
New-Item -ItemType Directory -Force -Path "C:\PROJETOS\GRILL-CARDAPIO"
New-Item -ItemType Directory -Force -Path "C:\PROJETOS\LABELCONTROL"
New-Item -ItemType Directory -Force -Path "C:\PROJETOS\MARCELO-AI"
New-Item -ItemType Directory -Force -Path "C:\PROJETOS\VIATECFLOW"
```

## Mover o OmniFix Digital

Feche VSCode, terminais, servidores Vite e qualquer processo usando a pasta.

Depois rode:

```powershell
Move-Item -Path "C:\Progeto Cardapio digital\omnifix-digital" -Destination "C:\PROJETOS\OMNIFIX-DIGITAL"
```

## Preservar .git

Se o projeto `omnifix-digital` ja tiver uma pasta `.git` dentro dele, o comando `Move-Item` preserva essa pasta automaticamente.

Validar depois da mudanca:

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
git status
git remote -v
```

Se `git status` funcionar, o historico foi preservado.

Se aparecer erro de que nao e um repositorio Git, significa que:

- o `.git` nao estava dentro de `omnifix-digital`; ou
- o Git estava na pasta pai antiga.

Nesse caso, antes de continuar deploy, decidir se o projeto deve virar um repositorio proprio.

## Preservar node_modules

O `Move-Item` tambem preserva `node_modules`.

Isso e util quando:

- o projeto ja estava funcionando;
- as dependencias estao instaladas;
- voce quer evitar baixar tudo de novo.

Validar:

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
npm run lint
npm run dev
```

## Quando deletar node_modules

Delete e reinstale `node_modules` se acontecer:

- erro estranho de binario nativo;
- erro de `esbuild`;
- erro de path antigo;
- Vite nao inicia;
- build falha depois da mudanca;
- dependencia parece corrompida.

Comandos:

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
```

Use isso apenas se necessario. Se tudo funcionar apos mover, nao precisa apagar.

## Abrir no VSCode

```powershell
code "C:\PROJETOS\OMNIFIX-DIGITAL"
```

Se o comando `code` nao existir, abra o VSCode manualmente e use:

```text
File > Open Folder > C:\PROJETOS\OMNIFIX-DIGITAL
```

## Validar .env

Depois de mover:

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
Get-Content .env
```

Confirmar:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

O `.env` deve ficar na raiz do projeto novo:

```text
C:\PROJETOS\OMNIFIX-DIGITAL\.env
```

## Validar Vite

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
npm run dev
```

Abrir:

```text
http://localhost:5173
```

Testar:

- home;
- `/login`;
- `/status`;
- `/os` redirecionando para login sem sessao;
- footer e navbar.

## Validar build

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
$env:NODE_OPTIONS='--max-old-space-size=4096'
npm run build
```

Confirmar que `dist` foi gerado:

```powershell
Get-ChildItem dist
```

## Validar Git remoto

```powershell
cd "C:\PROJETOS\OMNIFIX-DIGITAL"
git remote -v
git branch
git status
```

Antes de deploy:

```powershell
git add .
git commit -m "Move project to professional workspace"
git push origin main
```

So faca commit depois de conferir que a mudanca de pasta nao trouxe arquivos indevidos.

## Checklist seguro de mudanca

- [ ] VSCode fechado.
- [ ] Servidor Vite parado.
- [ ] `git status` conferido antes.
- [ ] `npm run lint` passou antes.
- [ ] `npm run build` passou antes.
- [ ] Pasta `C:\PROJETOS` criada.
- [ ] Projeto movido para `C:\PROJETOS\OMNIFIX-DIGITAL`.
- [ ] `.env` preservado.
- [ ] `.git` preservado ou repositorio recriado conscientemente.
- [ ] `node_modules` preservado ou reinstalado.
- [ ] `npm run dev` funcionando.
- [ ] `npm run build` funcionando.
- [ ] `git remote -v` correto.
- [ ] VSCode aberto na nova pasta.

## Observacao importante

Este documento nao move o projeto automaticamente. A mudanca deve ser feita manualmente quando voce decidir pausar o deploy e reorganizar a maquina local.
