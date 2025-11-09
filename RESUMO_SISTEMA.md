# 📋 Sistema de Barbearia - Resumo

## 🎯 Informações Essenciais

### **Tech Stack**
- Next.js 15 + React 19
- TypeScript
- Prisma ORM + PostgreSQL
- NextAuth (autenticação)
- Tailwind CSS (tema dinâmico)
- shadcn/ui (componentes)

---

## 🔧 Correções Recentes

### **1. Agendamentos (Bookings)**
- ✅ Corrigido erro do campo `price` - agora usa `totalPrice` do booking
- ✅ Adicionados campos `totalPrice` e `paymentMethod` no schema
- ✅ Filtros: Status + Período (Hoje/Semana/Mês)
- ✅ Tema adaptado (cores semânticas)

### **2. Barbeiros**
- ✅ Corrigido erro ao criar/atualizar (pausas limpas sem campos extras)
- ✅ Horários de trabalho + pausas funcionando

### **3. Botão de Sair**
- ✅ Background vermelho (`#dc2626`)
- ✅ Texto branco (estilo inline)
- ✅ Cursor pointer
- ✅ Modal de confirmação
- **Locais:** Header dropdown + Sidebar footer

### **4. Páginas de Erro**
- ✅ `not-found.tsx` - Página 404
- ✅ `error.tsx` - Erros globais

---

## 📂 Estrutura Importante

```
src/
├── app/
│   ├── admin/              # Painel admin
│   │   ├── page.tsx        # Dashboard
│   │   ├── bookings/       # Agendamentos
│   │   ├── barbers/        # Barbeiros
│   │   ├── services/       # Serviços
│   │   └── settings/       # Configurações
│   ├── api/
│   │   └── admin/          # APIs do admin
│   ├── not-found.tsx       # 404
│   └── error.tsx           # Error page
├── _components/
│   ├── admin-header.tsx    # Header do admin
│   ├── admin-sidebar.tsx   # Sidebar do admin
│   └── ui/                 # Componentes shadcn/ui
└── _lib/
    └── prisma.ts           # Client Prisma
```

---

## 🗄️ Schema Principal

```prisma
model booking {
  id            String   @id @default(uuid())
  userId        String
  serviceId     String
  barberId      String
  dateTime      DateTime
  status        String   @default("Pendente")
  totalPrice    Decimal  @default(0) @db.Decimal(10, 2)
  paymentMethod String   @default("Dinheiro")
  rating        Int?
  comment       String?
  // relações: user, service, barber
}

model BarberWorkingHour {
  id        String  @id @default(uuid())
  barberId  String
  weekday   Int
  startTime String
  endTime   String
  pauses    Pause[]
}

model Pause {
  id            String @id @default(uuid())
  workingHourId String
  startTime     String
  endTime       String
}
```

---

## 🎨 Tema

### **Variáveis Semânticas**
```css
/* Usar sempre */
bg-background, bg-card
text-foreground, text-muted-foreground
border-border
bg-primary, text-primary-foreground
```

### **Evitar**
```css
/* NÃO usar */
bg-gray-800, dark:bg-gray-900
text-gray-100, dark:text-white
```

---

## ⚡ Comandos Úteis

```bash
# Desenvolvimento
npm run dev

# Build
npm run build

# Prisma
npx prisma generate
npx prisma migrate dev
npx prisma studio

# Linter
npm run lint
npm run lint:fix
```

---

## 🔑 Variáveis de Ambiente (.env)

```env
DATABASE_URL="postgresql://..."
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

---

## 🐛 Problemas Conhecidos & Soluções

### **Erro: `price` não existe**
- **Causa:** Campo removido do schema
- **Solução:** Usar `totalPrice` do booking

### **Erro: `workingHourId` em pausas**
- **Causa:** Campos extras enviados ao Prisma
- **Solução:** Limpar pausas antes de criar

### **Tema não funciona**
- **Causa:** Classes fixas (dark:bg-gray-...)
- **Solução:** Usar classes semânticas

---

## 📝 Observações

- Sistema unificado (1 barbearia)
- Admin precisa de role "Admin" no User
- Sessões gerenciadas por NextAuth
- Upload de imagens via FormData
- CEP lookup com ViaCEP API

---

**Última atualização:** 30/10/2025

