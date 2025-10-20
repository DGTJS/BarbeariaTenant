# Scripts da Aplicação

Este diretório contém scripts úteis para gerenciar e manter a aplicação da barbearia.

## Scripts Disponíveis

### 🎨 Scripts de Seed (Dados Iniciais)

#### `seed-colors.js`
- **Descrição**: Popula o banco de dados com as configurações de cores padrão
- **Uso**: `node scripts/seed-colors.js`
- **Função**: Cria todas as variáveis de cor necessárias para o sistema de temas

#### `seed-themes.js`
- **Descrição**: Popula o banco de dados com os temas pré-definidos
- **Uso**: `node scripts/seed-themes.js`
- **Função**: Cria os temas "Dark Elegant", "Light Modern", "Warm Dark" e "Cool Light"

#### `seed-banners.js`
- **Descrição**: Popula o banco de dados com banners padrão
- **Uso**: `node scripts/seed-banners.js`
- **Função**: Cria banners iniciais para o carrossel da página inicial

### 🔍 Scripts de Verificação

#### `verify-global-services.js`
- **Descrição**: Verifica se o sistema de serviços globais está funcionando corretamente
- **Uso**: `node scripts/verify-global-services.js`
- **Função**: 
  - Verifica se a barbearia global existe
  - Lista todos os serviços globais
  - Verifica se os serviços estão associados corretamente às categorias
  - Mostra estatísticas do sistema

## Como Usar

### Instalação de Dados Iniciais
Para configurar a aplicação pela primeira vez, execute os scripts na seguinte ordem:

```bash
# 1. Configurar cores
node scripts/seed-colors.js

# 2. Configurar temas
node scripts/seed-themes.js

# 3. Configurar banners
node scripts/seed-banners.js

# 4. Verificar serviços globais
node scripts/verify-global-services.js
```

### Verificação do Sistema
Para verificar se o sistema está funcionando corretamente:

```bash
node scripts/verify-global-services.js
```

## Estrutura dos Dados

### Cores
As cores são organizadas por categorias:
- **background**: Cores de fundo
- **card**: Cores de cards
- **booking**: Cores de agendamento
- **text**: Cores de texto
- **state**: Cores de estado (sucesso, erro, etc.)
- **input**: Cores de inputs
- **border**: Cores de bordas
- **primary**: Cores principais

### Temas
Cada tema contém:
- **name**: Nome do tema
- **description**: Descrição do tema
- **type**: Tipo (light/dark)
- **isActive**: Se está ativo
- **colors**: Objeto com todas as cores do tema

## Manutenção

### Adicionando Novas Cores
1. Edite o array `defaultColors` em `seed-colors.js`
2. Execute o script para atualizar o banco

### Adicionando Novos Temas
1. Edite o array `themes` em `seed-themes.js`
2. Execute o script para atualizar o banco

### Verificando o Sistema
Execute `verify-global-services.js` periodicamente para garantir que o sistema está funcionando corretamente.

## Notas Importantes

- ⚠️ **Cuidado**: Os scripts de seed podem sobrescrever dados existentes
- 🔄 **Backup**: Sempre faça backup antes de executar scripts de seed
- 🧪 **Teste**: Teste em ambiente de desenvolvimento antes de usar em produção
- 📝 **Logs**: Todos os scripts fornecem logs detalhados do processo
