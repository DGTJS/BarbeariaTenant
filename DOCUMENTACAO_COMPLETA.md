# 📚 Documentação Completa - Sistema de Barbearia SaaS

## 📋 Índice

1. [Visão Geral](#visão-geral)
2. [Configurações Dinâmicas](#configurações-dinâmicas)
3. [Sistema de Logo e Favicon](#sistema-de-logo-e-favicon)
4. [Horários Personalizados](#horários-personalizados)
5. [SEO Dinâmico](#seo-dinâmico)
6. [Interface Melhorada](#interface-melhorada)
7. [Troubleshooting](#troubleshooting)
8. [Guia de Uso](#guia-de-uso)

---

## 🎯 Visão Geral

Sistema completo de gerenciamento para barbearias com configurações dinâmicas, logo personalizada, horários flexíveis e SEO otimizado.

### Tecnologias Utilizadas
- **Next.js 15**: Framework React
- **Prisma 6.18**: ORM para PostgreSQL
- **Sharp**: Processamento de imagens
- **Shadcn/ui**: Componentes de interface
- **TypeScript**: Tipagem estática

### Funcionalidades Principais
- ✅ Configurações dinâmicas do site
- ✅ Upload e conversão de logo/favicon
- ✅ Horários personalizados por dia
- ✅ SEO dinâmico e otimizado
- ✅ Preview de imagens em tempo real
- ✅ Interface moderna e responsiva

---

## ⚙️ Configurações Dinâmicas

### Sistema de Configurações

O sistema utiliza a tabela `SiteConfig` para armazenar todas as configurações:

```typescript
interface SiteConfig {
  // Informações da barbearia
  barbershop_name: string;
  barbershop_address: string;
  barbershop_email: string;
  barbershop_phone: string;
  barbershop_description: string;
  
  // Logo e favicon
  barbershop_logo_base64: string;
  barbershop_logo_width: number;
  barbershop_logo_height: number;
  barbershop_favicon_base64: string;
  barbershop_favicon_ico: string;
  
  // Horários de funcionamento
  working_days: number[];
  custom_schedules: DaySchedule[];
  
  // SEO
  seo_title: string;
  seo_description: string;
  seo_keywords: string;
  
  // Cores do tema
  primary_color: string;
  secondary_color: string;
  accent_color: string;
}
```

### Hook `useSiteConfig`

Hook para gerenciar configurações:

```typescript
import { useSiteConfig } from "@/_hooks/useSiteConfig";

const { config, loading, error, updateConfig, refetch } = useSiteConfig();

// Atualizar configuração
await updateConfig({ barbershop_name: "Nova Barbearia" });
```

### API de Configurações

**Endpoint**: `/api/admin/site-config`

**GET**: Retorna todas as configurações
```typescript
const response = await fetch('/api/admin/site-config');
const configs = await response.json();
```

**PUT**: Atualiza configurações
```typescript
await fetch('/api/admin/site-config', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    configs: { 
      barbershop_name: "Minha Barbearia" 
    } 
  })
});
```

### Inicializar Configurações Padrão

```bash
node scripts/init-site-config.js
```

---

## 🖼️ Sistema de Logo e Favicon

### Upload de Logo

#### Componente `EnhancedLogoUpload`

Características:
- ✅ **Preview imediato**: Visualização antes do upload
- ✅ **Análise de qualidade**: Avaliação automática da resolução
- ✅ **Avisos inteligentes**: Sugestões de melhoria
- ✅ **Dimensões reais**: Mostra tamanho da imagem

Uso:
```tsx
<EnhancedLogoUpload
  logoBase64={config.barbershop_logo_base64}
  logoWidth={config.barbershop_logo_width}
  logoHeight={config.barbershop_logo_height}
  onUpload={handleLogoUpload}
  onRemove={handleRemove}
  uploading={uploading}
/>
```

#### API de Upload

**Endpoint**: `/api/admin/logo`

```typescript
const formData = new FormData();
formData.append('logoFile', file);

const response = await fetch('/api/admin/logo', {
  method: 'POST',
  body: formData
});
```

### Conversão de Favicon

#### Qualquer Imagem para Favicon

O sistema converte automaticamente qualquer formato de imagem para favicon otimizado:

**Formatos Suportados**:
- PNG, JPEG, WebP, GIF, SVG, BMP, TIFF, ICO

**Conversão Automática**:
- Redimensionamento para 32×32 pixels
- Otimização de qualidade (90%)
- Criação de formato ICO
- Validação de qualidade

#### Função de Conversão

```typescript
import { convertToFavicon } from "@/_lib/image-converter";

const result = await convertToFavicon(imageBuffer, {
  size: 32,
  format: 'png',
  quality: 90
});
```

#### API de Favicon

**Endpoint**: `/api/admin/favicon`

```typescript
const formData = new FormData();
formData.append('faviconFile', file);

const response = await fetch('/api/admin/favicon', {
  method: 'POST',
  body: formData
});
```

### Logo Dinâmica

#### Componente `DynamicLogo`

Exibe logo configurada ou fallback:

```tsx
import DynamicLogo from "@/_components/dynamic-logo";

<DynamicLogo 
  width={80} 
  height={80} 
  alt="Logo" 
  priority={true}
/>
```

Funcionalidades:
- ✅ Carregamento automático da logo salva
- ✅ Fallback para logo padrão
- ✅ Cache bypass para atualização imediata
- ✅ Skeleton loading

### Preview de Logo

#### Componente `LogoPreview`

Visualização detalhada da logo:

```tsx
<LogoPreview
  logoBase64={config.barbershop_logo_base64}
  logoWidth={config.barbershop_logo_width}
  logoHeight={config.barbershop_logo_height}
/>
```

Recursos:
- ✅ Preview em tamanho grande (128×128)
- ✅ Análise de qualidade automática
- ✅ Ações: Ampliar, baixar
- ✅ Avisos de qualidade

#### Análise de Qualidade

| Dimensões | Qualidade | Cor |
|-----------|-----------|-----|
| 200×200+ | Excelente | Verde |
| 100-200 | Boa | Azul |
| 50-100 | Aceitável | Amarelo |
| <50 | Baixa | Vermelho |

---

## 🕒 Horários Personalizados

### Sistema de Horários por Dia

#### Componente `ImprovedScheduleSelector`

Interface moderna com abas:

**Aba Seleção**:
- Seleção de dias da semana
- Botões rápidos: Todos, Dias úteis, Nenhum
- Grid responsivo

**Aba Horários**:
- Cards colapsáveis por dia
- Configuração individual de horários
- Status aberto/fechado por dia
- Botão "Copiar" para replicar horários

#### Estrutura de Dados

```typescript
interface DaySchedule {
  id: number;           // 0-6 (Domingo-Sábado)
  name: string;         // "Segunda-feira"
  short: string;        // "Seg"
  isOpen: boolean;      // Se está aberto
  startTime: string;    // "08:00"
  endTime: string;      // "18:00"
}
```

#### Uso

```tsx
<ImprovedScheduleSelector
  selectedDays={config.working_days}
  onDaysChange={(days) => updateConfig({ working_days: days })}
  schedules={config.custom_schedules}
  onSchedulesChange={(schedules) => updateConfig({ custom_schedules: schedules })}
/>
```

#### Exemplos de Configuração

**Barbearia Tradicional**:
```json
{
  "working_days": [1, 2, 3, 4, 5, 6],
  "custom_schedules": [
    { "id": 1, "name": "Segunda-feira", "isOpen": true, "startTime": "08:00", "endTime": "18:00" },
    { "id": 2, "name": "Terça-feira", "isOpen": true, "startTime": "08:00", "endTime": "18:00" },
    { "id": 6, "name": "Sábado", "isOpen": true, "startTime": "08:00", "endTime": "14:00" }
  ]
}
```

**Horários Especiais**:
```json
{
  "working_days": [1, 2, 3, 4, 5, 6],
  "custom_schedules": [
    { "id": 1, "isOpen": true, "startTime": "09:00", "endTime": "17:00" },
    { "id": 5, "isOpen": true, "startTime": "08:00", "endTime": "20:00" },
    { "id": 6, "isOpen": true, "startTime": "08:00", "endTime": "14:00" }
  ]
}
```

### Exibição de Horários

#### Componente `WorkingHoursDisplay`

Exibe horários no frontend:

```tsx
<WorkingHoursDisplay className="mb-4" />
```

Funcionalidades:
- ✅ Lista todos os dias com horários
- ✅ Indicador visual (aberto/fechado)
- ✅ Formatação de horários
- ✅ Skeleton loading

---

## 🔍 SEO Dinâmico

### Metadata Dinâmica

#### Componente `DynamicMetadata`

Atualiza metadata em tempo real:

```tsx
<DynamicMetadata />
```

Funcionalidades:
- ✅ Atualização do título da página
- ✅ Meta descrição dinâmica
- ✅ Meta keywords
- ✅ Favicon dinâmico

#### Implementação

```typescript
useEffect(() => {
  // Atualizar título
  if (config.seo_title) {
    document.title = config.seo_title;
  }
  
  // Atualizar meta description
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute('content', config.seo_description);
  }
  
  // Atualizar favicon
  const favicon = document.querySelector('link[rel="icon"]');
  if (favicon) {
    favicon.href = config.barbershop_favicon_base64;
  }
}, [config]);
```

### Configurações de SEO

**Campos Configuráveis**:
- **seo_title**: Título da página (aparece na aba do navegador e resultados de busca)
- **seo_description**: Descrição para motores de busca (150-160 caracteres)
- **seo_keywords**: Palavras-chave separadas por vírgula

**Exemplo**:
```json
{
  "seo_title": "BarberBoss - Barbearia Premium em São Paulo",
  "seo_description": "A melhor barbearia de São Paulo. Corte masculino, barba, bigode e tratamentos especiais. Agende agora!",
  "seo_keywords": "barbearia, corte masculino, barba, são paulo, premium"
}
```

---

## 🎨 Interface Melhorada

### UX/UI Otimizada

#### Melhorias Implementadas

**1. Organização por Abas**
- Separação clara de funcionalidades
- Navegação intuitiva
- Redução de sobrecarga visual

**2. Cards Colapsáveis**
- Informações essenciais sempre visíveis
- Detalhes sob demanda
- Economia de espaço

**3. Resumos Inteligentes**
- Badges informativos
- Estatísticas em tempo real
- Status visual claro

**4. Feedback Visual**
- Loading states
- Mensagens de sucesso/erro
- Indicadores de progresso

### Componentes de UI

#### Componentes Shadcn Utilizados
- **Button**: Botões com variantes
- **Card**: Cards para organização
- **Input**: Campos de entrada
- **Label**: Labels acessíveis
- **Checkbox**: Seleção múltipla
- **Tabs**: Navegação por abas
- **Badge**: Indicadores visuais
- **Alert**: Mensagens contextuais
- **Skeleton**: Loading states

#### Componentes Customizados
- **EnhancedLogoUpload**: Upload com preview
- **LogoPreview**: Visualização de logo
- **FaviconUpload**: Upload de favicon
- **ImprovedScheduleSelector**: Seleção de horários
- **WorkingHoursDisplay**: Exibição de horários
- **DynamicLogo**: Logo dinâmica
- **DynamicMetadata**: Metadata dinâmica
- **DebugConfig**: Debug de configurações

---

## 🔧 Troubleshooting

### Problemas Comuns

#### 1. Logo Não Aparece

**Sintomas**: Logo voltou para a antiga ou não aparece

**Solução**:
```bash
# 1. Limpar cache do navegador (Ctrl+Shift+R)

# 2. Verificar configurações no debug
# Acesse /admin/settings e veja o card de debug

# 3. Testar conexão com banco
node scripts/test-db-connection.js

# 4. Verificar se logo está salva
# Acesse http://localhost:5555 (Prisma Studio)
# Verifique a tabela SiteConfig
```

**Debug**:
```tsx
// Componente de debug disponível
<DebugConfig />
```

#### 2. Erro de Conexão PostgreSQL

**Erro**: `Error in PostgreSQL connection: Error { kind: Closed }`

**Solução**:
```bash
# 1. Atualizar Prisma
npm i --save-dev prisma@latest
npm i @prisma/client@latest

# 2. Regenerar cliente
npx prisma generate

# 3. Parar processos Node.js
taskkill /f /im node.exe

# 4. Testar conexão
npx prisma db push

# 5. Reiniciar Prisma Studio
npx prisma studio
```

**Verificação**:
```bash
# Executar teste de conexão
node scripts/test-db-connection.js
```

#### 3. Preview de Imagem Não Aparece

**Problema**: Preview não carrega ao selecionar imagem

**Solução**:
1. Verificar formato da imagem (PNG, JPEG, WebP)
2. Verificar tamanho (máximo 5MB)
3. Limpar cache do navegador
4. Verificar console do navegador por erros

#### 4. Favicon Não Atualiza

**Problema**: Favicon não muda após upload

**Solução**:
1. Limpar cache do navegador completamente
2. Verificar se foi salvo no banco (Prisma Studio)
3. Forçar atualização (Ctrl+F5)
4. Verificar se componente DynamicMetadata está incluído

### Ferramentas de Debug

#### 1. Componente DebugConfig

```tsx
// Adicionar na página de configurações
<DebugConfig />
```

Mostra:
- Status da logo
- Tamanho da string base64
- Total de configurações
- Preview da logo salva

#### 2. API de Debug

```bash
# Acessar endpoint de debug
curl http://localhost:3000/api/debug/config
```

#### 3. Script de Teste de Conexão

```bash
# Testar conexão com banco
node scripts/test-db-connection.js
```

Verifica:
- Conexão com banco
- Configurações salvas
- Status da logo
- Total de registros

#### 4. Prisma Studio

```bash
# Acessar interface visual do banco
npx prisma studio
# Abrir: http://localhost:5555
```

---

## 📖 Guia de Uso

### Configuração Inicial

#### 1. Instalar Dependências

```bash
npm install
```

#### 2. Configurar Banco de Dados

```bash
# Criar arquivo .env com DATABASE_URL
DATABASE_URL="postgresql://..."

# Sincronizar schema
npx prisma db push

# Inicializar configurações
node scripts/init-site-config.js
```

#### 3. Iniciar Aplicação

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### Configurar Barbearia

#### 1. Acessar Painel Admin

```
http://localhost:3000/admin/settings
```

#### 2. Configurar Informações Básicas

**Aba Geral**:
- Nome da barbearia
- Endereço completo
- Email de contato
- Telefone
- Descrição

#### 3. Upload de Logo e Favicon

**Aba Marca**:

**Logo**:
1. Clique em "Enviar Logo"
2. Selecione imagem (PNG, JPEG, WebP)
3. Veja preview imediato
4. Verifique qualidade
5. Clique em "Salvar Configurações"

**Favicon**:
1. Clique em "Enviar Imagem"
2. Selecione qualquer imagem
3. Sistema converte automaticamente
4. Preview aparece imediatamente
5. Salve as configurações

#### 4. Configurar Horários

**Aba Horários**:

1. **Seleção de Dias**:
   - Marque os dias que funcionam
   - Use botões rápidos se necessário

2. **Horários Personalizados**:
   - Clique na aba "Horários"
   - Configure cada dia individualmente
   - Use "Copiar" para replicar horários
   - Marque "Aberto neste dia" ou deixe fechado

#### 5. Configurar SEO

**Aba SEO**:
- Título da página (50-60 caracteres)
- Descrição (150-160 caracteres)
- Palavras-chave (separadas por vírgula)

#### 6. Salvar Configurações

Clique em "Salvar Configurações" no final da página

### Verificar Configurações

#### 1. Preview no Admin

- Logo aparece no header do admin
- Nome da barbearia no título
- Todas as informações visíveis

#### 2. Frontend

```
http://localhost:3000
```

- Logo no header
- Favicon na aba do navegador
- SEO nos metadados da página
- Horários exibidos corretamente

#### 3. Prisma Studio

```bash
npx prisma studio
```

- Tabela SiteConfig
- Verificar configurações salvas
- Confirmar dados persistidos

### Manutenção

#### Backup de Configurações

```bash
# Exportar configurações
npx prisma db pull
```

#### Atualizar Sistema

```bash
# Atualizar dependências
npm update

# Atualizar Prisma
npm i --save-dev prisma@latest
npm i @prisma/client@latest

# Regenerar cliente
npx prisma generate
```

#### Monitoramento

```bash
# Testar conexão regularmente
node scripts/test-db-connection.js

# Verificar logs
npm run dev
```

---

## 📝 Resumo de Comandos

### Desenvolvimento

```bash
# Instalar
npm install

# Desenvolvimento
npm run dev

# Build
npm run build

# Produção
npm start
```

### Banco de Dados

```bash
# Sincronizar schema
npx prisma db push

# Gerar cliente
npx prisma generate

# Prisma Studio
npx prisma studio

# Teste de conexão
node scripts/test-db-connection.js
```

### Configurações

```bash
# Inicializar configurações
node scripts/init-site-config.js

# Verificar configurações
curl http://localhost:3000/api/debug/config
```

### Debug

```bash
# Limpar processos
taskkill /f /im node.exe

# Atualizar Prisma
npm i --save-dev prisma@latest
npm i @prisma/client@latest
npx prisma generate
```

---

## 🚀 Conclusão

Este sistema oferece uma solução completa para gerenciamento de barbearias com:

- ✅ **Configurações dinâmicas**: Tudo personalizável
- ✅ **Logo e favicon**: Upload e conversão automática
- ✅ **Horários flexíveis**: Configuração por dia
- ✅ **SEO otimizado**: Metadata dinâmica
- ✅ **Interface moderna**: UX/UI melhorada
- ✅ **Debug completo**: Ferramentas de diagnóstico

**Sistema 100% funcional e pronto para uso!** 🎉

