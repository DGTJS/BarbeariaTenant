# 🔒 Documento de Segurança - Área Administrativa

## ⚠️ VULNERABILIDADE CRÍTICA IDENTIFICADA E CORRIGIDA

### **Problema Identificado**

Usuários comuns (role "Cliente") podiam acessar a área administrativa completa, incluindo:

- Dashboard administrativo
- Gerenciamento de agendamentos
- Configurações do sistema
- Dados sensíveis de clientes
- Todas as funcionalidades administrativas

### **Causa Raiz**

O middleware e as páginas administrativas verificavam apenas a **presença de uma sessão autenticada**, mas **NÃO verificavam o role/permissão do usuário**. Isso permitia que qualquer usuário logado (incluindo clientes comuns) acessasse todas as rotas `/admin/*`.

### **Impacto da Vulnerabilidade**

**CRÍTICO - SEVERIDADE MÁXIMA**

1. **Acesso não autorizado**: Clientes podiam visualizar e modificar dados administrativos
2. **Violação de privacidade**: Acesso a dados pessoais de outros clientes
3. **Modificação indevida**: Alteração de configurações do sistema
4. **Manipulação de agendamentos**: Cancelamento/criação de agendamentos de outros usuários
5. **Risco de conformidade**: Violação de LGPD e outras regulamentações

### **Correções Implementadas**

#### 1. **Middleware Atualizado** (`src/middleware.ts`)

- ✅ Verifica presença de token de sessão (Edge Runtime compatible)
- ✅ Redireciona usuários não autenticados para `/admin/login`
- ✅ Bloqueia acesso a rotas `/admin/*` exceto `/admin/login`
- ⚠️ **IMPORTANTE**: Verificação de role é feita no Layout Admin e APIs (não no middleware devido a limitações do Edge Runtime)

#### 2. **Função Utilitária de Verificação** (`src/_lib/admin-auth.ts`)

- ✅ Função `requireAdmin()` reutilizável
- ✅ Verifica role no banco de dados (fonte de verdade)
- ✅ Suporta variações: "admin", "Admin", "ADMIN", "administrador"
- ✅ Verifica também se o usuário é barbeiro (via tabela `barber`)
- ✅ Retorna erro 403 com mensagem clara se não autorizado

#### 3. **Layout Admin Protegido** (`src/app/admin/layout.tsx`)

- ✅ Verificação de role no servidor antes de renderizar
- ✅ Redireciona automaticamente usuários não autorizados
- ✅ Previne renderização de componentes admin para usuários comuns

#### 4. **Páginas Admin Protegidas**

Todas as páginas em `src/app/admin/*` agora têm:

- ✅ Verificação de role no servidor (Server Component)
- ✅ Fallback para client-side quando necessário
- ✅ Mensagens de erro claras

#### 5. **APIs Admin Protegidas**

Todas as APIs em `src/app/api/admin/*` agora têm:

- ✅ Verificação de role em TODAS as rotas (GET, POST, PUT, DELETE, PATCH)
- ✅ Uso consistente da função `requireAdmin()`
- ✅ Logs de segurança para auditoria
- ✅ Retorno padronizado de erros 403

### **Implementação Técnica**

#### Função de Verificação de Admin

```typescript
// src/_lib/admin-auth.ts
export async function requireAdmin(session: Session | null) {
  if (!session?.user?.id) {
    throw new Error("Não autorizado");
  }

  // Buscar role do banco (fonte de verdade)
  const dbUser = await db.user.findUnique({
    where: { id: session.user.id },
    select: {
      role: true,
      barber: { select: { id: true } },
    },
  });

  const role = (dbUser?.role || "").toLowerCase().trim();
  const isAdmin = role === "admin" || role === "administrador";
  const isBarbeiro =
    role === "barbeiro" || role === "barber" || !!dbUser?.barber;

  if (!isAdmin && !isBarbeiro) {
    throw new Error(
      "Acesso negado. Apenas administradores e barbeiros têm acesso."
    );
  }

  return { isAdmin, isBarbeiro };
}
```

#### Uso no Middleware (Edge Runtime Compatible)

```typescript
// src/middleware.ts
// NOTA: Middleware roda no Edge Runtime, que tem limitações
// Não pode usar getServerSession() ou Prisma diretamente
// A verificação de role é feita no Layout Admin e APIs

if (pathname.startsWith("/admin")) {
  // Verificar apenas token de sessão (Edge-compatible)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!sessionToken) {
    return NextResponse.redirect(
      new URL("/admin/login?error=unauthorized", request.url)
    );
  }
  // Verificação de role será feita no layout admin
}
```

#### Uso em APIs

```typescript
// src/app/api/admin/*/route.ts
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  try {
    await requireAdmin(session);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }

  // ... resto do código
}
```

### **Checklist de Segurança Implementado**

- ✅ **Autenticação**: Todos os endpoints requerem sessão válida
- ✅ **Autorização**: Verificação de role em TODAS as rotas admin
- ✅ **Fonte de Verdade**: Role sempre verificado no banco de dados
- ✅ **Case-Insensitive**: Aceita variações de "admin"
- ✅ **Barbeiros**: Barbeiros também têm acesso (via role ou tabela `barber`)
- ✅ **Logs**: Todas as tentativas de acesso são logadas
- ✅ **Erros Claro**: Mensagens de erro informativas mas seguras
- ✅ **Fallback**: Proteção tanto no servidor quanto no cliente
- ✅ **Middleware Global**: Primeira camada de proteção

### **Rotas Protegidas**

#### Páginas Admin

- ✅ `/admin` - Dashboard
- ✅ `/admin/bookings` - Agendamentos
- ✅ `/admin/barbers` - Barbeiros
- ✅ `/admin/services` - Serviços
- ✅ `/admin/settings` - Configurações
- ✅ `/admin/reports` - Relatórios
- ✅ `/admin/clients` - Clientes
- ✅ `/admin/notifications` - Notificações
- ✅ `/admin/banner` - Banners
- ✅ `/admin/colors` - Cores
- ✅ `/admin/themes` - Temas
- ✅ Todas as outras rotas `/admin/*`

#### APIs Admin

- ✅ `/api/admin/dashboard` - Estatísticas do dashboard
- ✅ `/api/admin/bookings` - Operações com agendamentos
- ✅ `/api/admin/barbers` - Operações com barbeiros
- ✅ `/api/admin/services` - Operações com serviços
- ✅ `/api/admin/site-config` - Configurações do site
- ✅ `/api/admin/reports` - Relatórios
- ✅ `/api/admin/clients` - Clientes
- ✅ `/api/admin/notifications` - Notificações
- ✅ Todas as outras APIs `/api/admin/*`

### **Garantias de Segurança**

#### ✅ **Camadas de Proteção Múltiplas**

1. **Camada 1 - Middleware (Global - Edge Runtime)**

   - Verifica presença de token de sessão (Edge-compatible)
   - Bloqueia acesso não autenticado antes de chegar às páginas
   - ⚠️ **Limitação**: Edge Runtime não suporta verificação detalhada de role

2. **Camada 2 - Layout Admin**

   - Verificação no servidor antes de renderizar
   - Previne acesso visual aos componentes

3. **Camada 3 - Páginas Individuais**

   - Cada página verifica novamente
   - Fallback para client-side protection

4. **Camada 4 - APIs**
   - Cada endpoint verifica independemente
   - Não confia apenas no middleware

#### ✅ **Fonte de Verdade no Banco de Dados**

- Role sempre verificado no banco (não confia apenas na sessão)
- Sessão pode estar desatualizada, mas banco é sempre atual

#### ✅ **Auditoria e Logs**

- Todas as tentativas de acesso são logadas
- Logs incluem: userId, role, timestamp, rota acessada
- Facilita identificação de tentativas não autorizadas

### **Recomendações para Manutenção Futura**

1. **Nunca remover verificação de role**

   - Todas as rotas admin DEVEM verificar role
   - Não assumir que middleware é suficiente

2. **Testes de Segurança**

   - Criar testes automatizados verificando acesso negado para usuários comuns
   - Testar todas as rotas admin com diferentes roles

3. **Revisão de Código**

   - Sempre revisar PRs que afetam rotas admin
   - Verificar se novas rotas incluem verificação de role

4. **Princípio do Menor Privilégio**

   - Apenas roles necessários devem ter acesso
   - Barbeiros podem ter acesso limitado comparado a admins

5. **Monitoramento**
   - Monitorar logs de tentativas de acesso não autorizadas
   - Alertar sobre padrões suspeitos

### **Código Seguro - Exemplo de Implementação**

```typescript
// ✅ CORRETO - Verifica role em todas as camadas
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  try {
    await requireAdmin(session);
  } catch (error) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 403 });
  }

  // Código seguro aqui
}

// ❌ ERRADO - Apenas verifica sessão
export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  // VULNERÁVEL - qualquer usuário logado pode acessar
}
```

### **Contato e Suporte**

Em caso de dúvidas sobre segurança ou novas vulnerabilidades:

1. **NÃO** commitar código que remove verificações de segurança
2. Documentar qualquer mudança relacionada a autenticação/autorização
3. Testar sempre com diferentes roles antes de fazer deploy
4. Revisar este documento antes de criar novas rotas admin

---

**Data da Correção**: Janeiro 2025
**Status**: ✅ VULNERABILIDADE CORRIGIDA E PROTEÇÕES IMPLEMENTADAS
**Versão do Documento**: 1.0
