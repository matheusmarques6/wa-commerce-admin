# WA Commerce Admin

Painel de administracao do WhatsApp Commerce.
Next.js 15 + Supabase + Tailwind. Deploy no Vercel.

## Setup rapido

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variaveis de ambiente

Copie `.env.example` para `.env.local`:

```bash
cp .env.example .env.local
```

Preencha com os dados do seu projeto Supabase (Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

### 3. Criar usuario admin no Supabase

No dashboard do Supabase, va em Authentication > Users > Add User:

- Email: seu email
- Password: sua senha
- Auto Confirm: ON

### 4. Rodar local

```bash
npm run dev
```

Acesse http://localhost:3000 e faca login.

## Deploy no Vercel

### 1. Subir pro GitHub

```bash
git init
git add .
git commit -m "wa-commerce-admin v1"
git remote add origin https://github.com/SEU_USER/wa-commerce-admin.git
git push -u origin main
```

### 2. Conectar no Vercel

1. Acesse vercel.com
2. Import Project > selecione o repo
3. Framework Preset: Next.js (auto-detectado)
4. Environment Variables: adicione as 3 vars do .env.local
5. Deploy

### 3. Pronto

O Vercel faz build e deploy automatico a cada push no main.

## Estrutura

```
src/
  app/
    layout.tsx          ← Root layout
    page.tsx            ← Redirect para /dashboard
    globals.css         ← Tailwind + tema escuro
    login/
      page.tsx          ← Tela de login
    (panel)/
      layout.tsx        ← Layout com sidebar (todas as telas)
      dashboard/
        page.tsx        ← KPIs + lojas + fluxos ativos
      tenants/
        page.tsx        ← Lista de lojas com configs
      agents/
        page.tsx        ← Agentes IA com briefing
      prompts/
        page.tsx        ← Recovery prompts (defaults + overrides)
      flows/
        page.tsx        ← Fluxos de recuperacao ativos
  components/
    Sidebar.tsx         ← Navegacao lateral
  lib/
    supabase-browser.ts ← Client para componentes client-side
    supabase-server.ts  ← Client para server components + admin
  middleware.ts         ← Protecao de rotas (redireciona pra login)
```

## Como funciona

- **Login**: Supabase Auth com email/senha
- **Middleware**: Toda rota exceto /login exige autenticacao
- **Dashboard**: Server component que busca dados com service_role (ve todos os tenants)
- **Sidebar**: Client component com navegacao e logout
- **Dados**: Todas as queries usam createAdminClient() (service_role, bypassa RLS)

Quando o lojista tiver acesso (futuro), trocar para createClient() com RLS filtrando por tenant.
