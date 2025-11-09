# 🧪 Setup de Teste - Plano e Tenant

## Como criar um plano e tenant de teste

### Opção 1: Via Script (Recomendado)

Execute o script que cria automaticamente:

```bash
npm run create:test
```

Ou diretamente:

```bash
node scripts/create-test-plan-and-tenant.js
```

### Opção 2: Via Interface Web

1. **Criar Plano:**

   - Acesse: `http://localhost:3000/super-admin/plans`
   - Clique em "Novo Plano"
   - Preencha os dados:
     - Nome: "Starter"
     - Preço: 97
     - Período: Mensal
     - Trial: 14 dias
   - Clique em "Criar Plano"

2. **Criar Tenant:**
   - Acesse: `http://localhost:3000/super-admin/tenants/create`
   - Preencha os dados:
     - Nome: "Barbearia Teste"
     - Subdomínio: "teste"
     - Nome do Dono: "João Silva"
     - Email: "joao@teste.com"
     - Telefone: "(11) 99999-9999"
     - Plano: Selecione o plano criado
   - Clique em "Criar Tenant"

## 📋 Requisitos

Antes de executar, certifique-se de que:

1. ✅ O banco principal (`barberboss_super`) está criado
2. ✅ A variável `DATABASE_URL_SUPER` está configurada no `.env`
3. ✅ As migrations do banco principal foram executadas

## 🔧 Configuração do .env

```env
DATABASE_URL_SUPER="mysql://user:password@localhost:3306/barberboss_super"
DATABASE_BASE_URL="mysql://user:password@localhost:3306/"
```

## 📝 O que o script cria

### Plano "Starter"

- Preço: R$ 97/mês
- Trial: 14 dias
- Limites:
  - 3 barbeiros
  - 10 serviços
  - 5 opções por serviço
  - Agendamentos ilimitados
  - 1 barbearia
  - 100 MB de armazenamento

### Tenant "Barbearia Teste"

- Subdomínio: `teste.barberboss.com`
- Status: Trial
- Plano: Starter
- Dono: João Silva (joao@teste.com)

## ⚠️ Notas Importantes

- O script verifica se o plano ou tenant já existem antes de criar
- Se o tenant de teste já existir, o script apenas exibirá as informações
- O banco de dados do tenant NÃO é criado automaticamente (apenas o registro no banco principal)
- Você precisará criar o banco manualmente e executar as migrations

## 🚀 Próximos Passos Após Criar

1. Criar o banco de dados do tenant:

   ```sql
   CREATE DATABASE barberboss_teste_[timestamp] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Executar migrations no banco do tenant:

   ```bash
   DATABASE_URL="mysql://user:password@localhost:3306/barberboss_teste_[timestamp]" npx prisma migrate deploy
   ```

3. Acessar o tenant:
   - URL: `http://teste.localhost:3000`
   - (Configure o DNS local se necessário)
