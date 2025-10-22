# Sistema SaaS de Barbearia - Documentação Completa

## Visão Geral

Este é um sistema SaaS (Software as a Service) para barbearias que permite:

1. **Você (proprietário do SaaS)** gerencia e libera planos para barbearias
2. **Barbearias** assinam planos para usar o sistema
3. **Clientes das barbearias** podem assinar planos de serviços (cortes, barbas, etc.)

## Arquitetura do Sistema

### 1. Níveis de Usuários

```
Você (Admin SaaS)
├── Gerencia planos para barbearias
├── Controla liberação de funcionalidades
└── Monitora uso do sistema

Barbearias (Clientes do SaaS)
├── Assinam planos do SaaS
├── Configuram seus serviços
├── Gerenciam barbeiros
└── Atendem clientes

Clientes das Barbearias
├── Agendam serviços
├── Assinam planos de serviços (opcional)
└── Consomem créditos de assinatura
```

### 2. Fluxo de Assinaturas

#### Para Barbearias (SaaS):
- **Plano Básico**: Sistema básico de agendamentos
- **Plano Premium**: Sistema completo + franquias
- **Plano Enterprise**: Todas as funcionalidades + suporte prioritário

#### Para Clientes das Barbearias:
- **Plano Mensal**: X cortes + Y barbas por mês
- **Plano Trimestral**: Mais serviços com desconto
- **Plano Anual**: Máximo de serviços com melhor preço

## Funcionalidades por Nível

### Admin SaaS (Você)
- ✅ Gerenciar planos para barbearias
- ✅ Controlar liberação de funcionalidades
- ✅ Monitorar uso e receita
- ✅ Configurar sistema global
- ✅ Gerenciar temas e cores
- ✅ Upload seguro de logos
- ✅ Configurações de SEO

### Barbearias (Clientes do SaaS)
- ✅ Configurar barbearia (nome, endereço, contato)
- ✅ Gerenciar barbeiros
- ✅ Criar e gerenciar serviços
- ✅ Configurar horários de funcionamento
- ✅ Gerenciar agendamentos
- ✅ Configurar planos para seus clientes
- ✅ Relatórios de vendas
- 🔄 Franquias (apenas se plano permitir)

### Clientes das Barbearias
- ✅ Agendar serviços
- ✅ Ver histórico de agendamentos
- ✅ Avaliar serviços
- ✅ Favoritar barbeiros
- 🔄 Assinar planos de serviços
- 🔄 Consumir créditos de assinatura

## Estrutura de Dados

### Planos SaaS (Para Barbearias)
```typescript
interface SaasPlan {
  id: string;
  name: string; // "Básico", "Premium", "Enterprise"
  priceMonthly: number;
  priceYearly?: number;
  features: {
    allowFranchises: boolean;
    maxBarbers: number;
    maxServices: number;
    customDomain: boolean;
    prioritySupport: boolean;
  };
  limits: {
    maxBookingsPerMonth: number;
    maxClients: number;
    storageGB: number;
  };
}
```

### Planos de Serviços (Para Clientes)
```typescript
interface ServicePlan {
  id: string;
  name: string; // "Mensal", "Trimestral", "Anual"
  priceMonthly: number;
  priceYearly?: number;
  services: {
    [serviceId: string]: number; // quantidade por ciclo
  };
  cycle: "monthly" | "quarterly" | "yearly";
  barbershopId: string; // qual barbearia oferece
}
```

### Assinaturas de Clientes
```typescript
interface ClientSubscription {
  id: string;
  userId: string;
  planId: string;
  barbershopId: string;
  startDate: Date;
  endDate: Date;
  credits: {
    [serviceId: string]: number; // créditos restantes
  };
  status: "active" | "expired" | "cancelled";
}
```

## APIs Implementadas

### Admin SaaS
- `GET/PUT /api/admin/site-config` - Configurações globais
- `POST /api/admin/logo` - Upload seguro de logo
- `GET/POST/PUT/DELETE /api/admin/plans` - Planos para barbearias
- `GET/POST/PUT/DELETE /api/admin/themes` - Temas do sistema
- `GET/POST/PUT/DELETE /api/admin/colors` - Cores personalizadas

### Barbearias
- `GET/POST/PUT/DELETE /api/admin/barbers` - Gerenciar barbeiros
- `GET/POST/PUT/DELETE /api/admin/services` - Gerenciar serviços
- `GET/POST/PUT/DELETE /api/admin/bookings` - Gerenciar agendamentos
- `GET/PUT /api/admin/settings` - Configurações da barbearia

### Clientes
- `GET/POST /api/subscriptions` - Assinaturas de serviços
- `PUT /api/subscriptions` - Consumir créditos
- `GET /api/user/bookings` - Agendamentos do cliente
- `GET/PUT /api/user/settings` - Configurações do cliente

## Configurações do Sistema

### SiteConfig Keys
```typescript
// Configurações da barbearia
"barbershop_name": string
"barbershop_address": string
"barbershop_email": string
"barbershop_phones": string
"barbershop_description": string
"barbershop_logo_base64": string
"barbershop_logo_width": number
"barbershop_logo_height": number

// SEO
"seo_title": string
"seo_description": string

// Negócio
"business_currency": string
"business_timezone": string
"business_booking_advance_days": number
"business_cancellation_policy": string
"digital_subscription_enabled": boolean
"digital_subscription_extra_fee": number
"franchises_enabled": boolean

// Cores do menu
"menu_bg_color": string
"menu_text_color": string
"menu_active_bg_color": string
"menu_active_text_color": string

// Planos
"plans_json": string // JSON array de planos
"current_plan_id": string // plano atual da barbearia
```

## Fluxo de Uso

### 1. Setup Inicial (Admin SaaS)
1. Configure planos para barbearias
2. Configure temas e cores
3. Configure sistema global

### 2. Onboarding de Barbearia
1. Barbearia escolhe plano SaaS
2. Sistema libera funcionalidades baseadas no plano
3. Barbearia configura dados básicos
4. Barbearia cria serviços e barbeiros

### 3. Operação Diária
1. Clientes agendam serviços
2. Se cliente tem assinatura, consome créditos
3. Se não tem assinatura, paga normalmente
4. Barbearia gerencia agendamentos

### 4. Gestão de Assinaturas
1. Cliente escolhe plano de serviços
2. Sistema inicializa créditos
3. A cada agendamento, consome 1 crédito
4. Sistema controla limites e renovações

## Segurança

### Upload de Logo
- Validação de tipo (PNG, JPG, WebP)
- Limite de 2MB
- Armazenamento seguro em base64
- Dimensões controladas

### Autenticação
- NextAuth.js para autenticação
- Sessões seguras
- Controle de acesso por roles

### Dados
- Criptografia de senhas
- Validação de inputs
- Sanitização de dados

## Próximos Passos

### Implementações Pendentes
1. **Autenticação Admin**: Sistema de login para admin SaaS
2. **Dashboard Analytics**: Métricas de uso e receita
3. **Sistema de Pagamentos**: Integração com gateways
4. **Notificações**: Email/SMS para agendamentos
5. **Relatórios**: Relatórios detalhados para barbearias
6. **API Externa**: Integração com outros sistemas

### Melhorias de UX
1. **Componentes shadcn**: Refatorar toda UI
2. **Responsividade**: Mobile-first design
3. **Acessibilidade**: WCAG compliance
4. **Performance**: Otimizações de carregamento

## Tecnologias Utilizadas

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL com Prisma ORM
- **Authentication**: NextAuth.js
- **Deployment**: Vercel (recomendado)

## Estrutura de Arquivos

```
src/
├── app/
│   ├── admin/           # Interface admin SaaS
│   ├── api/            # APIs do sistema
│   └── (pages)/        # Páginas públicas
├── _components/        # Componentes reutilizáveis
├── _lib/              # Utilitários e configurações
├── _providers/        # Context providers
└── _types/            # Definições TypeScript
```

## Conclusão

Este sistema oferece uma solução completa para barbearias, desde o gerenciamento básico até funcionalidades avançadas como assinaturas de clientes e franquias. A arquitetura modular permite escalabilidade e personalização conforme as necessidades de cada barbearia.


