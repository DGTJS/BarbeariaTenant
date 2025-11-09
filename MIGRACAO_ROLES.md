# 🔄 Migração de Sistema de Roles e Autenticação de Barbeiros

## 📋 Resumo das Mudanças

Este documento descreve as mudanças implementadas no sistema de roles e autenticação:

### **1. Sistema de Roles Numérico**

**Antes:**

- Roles eram strings: "Admin", "Barbeiro", "Cliente", etc.
- Verificações case-sensitive e propensas a erros
- Inconsistências entre diferentes partes do código

**Depois:**

- Roles são números (mais eficiente e seguro):
  - **1 = Admin**
  - **2 = Barbeiro**
  - **3 = Cliente** (padrão para novos usuários)

### **2. Login e Senha para Barbeiros**

**Novo:**

- Barbeiros podem ter email e senha próprios no modelo `barber`
- Login independente do usuário comum
- Senhas são hasheadas com bcrypt

**Campos Adicionados:**

- `barber.email` - Email para login do barbeiro (único)
- `barber.password` - Senha hasheada do barbeiro
- `barber.hasAdminAccess` - Se tem permissões de admin

### **3. Sistema de Permissões Granulares**

**Funcionalidade:**

- Admin pode configurar permissões de cada barbeiro
- Barbeiros podem ter:
  - Apenas permissões limitadas de barbeiro (padrão)
  - Permissões completas de admin (se `hasAdminAccess = true`)

**Interface:**

- Modal de gerenciamento de permissões na página de barbeiros
- Botão "Permissões" em cada card de barbeiro
- Apenas admins podem gerenciar permissões

## 📁 Arquivos Modificados

### **Schema e Migration**

- `prisma/schema.prisma`

  - `User.role`: `String` → `Int` (default: 3)
  - `barber.email`: Campo adicionado (único)
  - `barber.password`: Campo adicionado
  - `barber.hasAdminAccess`: Campo adicionado (default: false)

- `prisma/migrations/20250130000000_change_role_to_int_and_add_barber_login/migration.sql`
  - Converte roles existentes de string para int
  - Adiciona campos de login no modelo barber

### **Autenticação e Autorização**

- `src/_lib/admin-auth.ts`

  - Atualizado para usar roles numéricos
  - Verifica `hasAdminAccess` de barbeiros
  - Suporta retrocompatibilidade (string → number)

- `src/_server/auth-options.ts`

  - Login com email/senha para barbeiros
  - Verificação de senha com bcrypt
  - Criação de novos usuários com role 3 (Cliente)

- `src/types/next-auth.d.ts`
  - `role` agora aceita `number | string | null` (retrocompatibilidade)

### **Layouts e Páginas Admin**

- `src/app/admin/layout.tsx`

  - Verificação de role usando números

- `src/app/api/admin/dashboard/route.ts`

  - Usa `requireAdmin()` centralizado

- `src/app/api/bookings/[id]/confirm-payment/route.ts`
  - Usa `requireAdmin()` centralizado

### **APIs**

- `src/app/api/admin/barbers/route.ts`

  - Criação de barbeiros com role 2
  - Retorna `email` e `hasAdminAccess` dos barbeiros

- `src/app/api/admin/barbers/[id]/permissions/route.ts` (NOVO)
  - `GET`: Buscar permissões do barbeiro
  - `PATCH`: Atualizar email, senha e permissões
  - Apenas admins podem acessar

### **Componentes**

- `src/_components/barber-permissions-modal.tsx` (NOVO)

  - Modal para gerenciar permissões dos barbeiros
  - Campos: email, senha, hasAdminAccess

- `src/app/admin/barbers/page.tsx`
  - Botão "Permissões" em cada card de barbeiro
  - Integração com modal de permissões

### **Scripts**

- `scripts/update-roles-to-int.js` (NOVO)
  - Converte roles existentes para formato numérico
  - Executar: `npm run fix:roles`

## 🚀 Como Usar

### **1. Executar Migration**

```bash
# Gerar Prisma Client com novo schema
npx prisma generate

# Executar migration
npx prisma migrate deploy
```

### **2. Converter Roles Existentes**

```bash
# Executar script de conversão
npm run fix:roles
```

Este script:

- Converte todos os roles de string para número
- Detecta barbeiros pela tabela `barber`
- Atualiza automaticamente

### **3. Gerenciar Permissões de Barbeiros**

1. Acesse `/admin/barbers`
2. Clique no botão "Permissões" do barbeiro
3. Configure:
   - **Email**: Email para login do barbeiro
   - **Senha**: Nova senha (deixe vazio para não alterar)
   - **Permissões de Admin**: Toggle para dar acesso completo

### **4. Login de Barbeiros**

Barbeiros podem fazer login usando:

- Email do barbeiro (campo `barber.email`)
- Senha configurada pelo admin

## ⚠️ Importante

1. **Migration deve ser executada primeiro**

   - A migration converte roles automaticamente
   - Mas é recomendado executar `npm run fix:roles` após migration

2. **Novos usuários**

   - Todos os novos usuários criados terão role 3 (Cliente)
   - Barbeiros devem ser criados via `/admin/barbers` (role 2)

3. **Permissões de Admin para Barbeiros**

   - Apenas admins (role=1) podem gerenciar permissões
   - Barbeiros com `hasAdminAccess=true` têm acesso completo

4. **Retrocompatibilidade**
   - Código suporta roles em string e número durante transição
   - Após migration, todos devem ser números

## 🔒 Segurança

- ✅ Senhas são hasheadas com bcrypt (10 rounds)
- ✅ Verificação de permissões em múltiplas camadas
- ✅ Apenas admins podem gerenciar permissões
- ✅ Roles sempre verificados no banco (não confia só na sessão)
- ✅ Email único por barbeiro

## 📊 Estatísticas

Após executar `npm run fix:roles`, você verá:

- Quantos usuários foram atualizados
- Distribuição final de roles (Admin, Barbeiro, Cliente)
- Erros (se houver)

---

**Data da Migração**: Janeiro 2025
**Versão**: 1.0
