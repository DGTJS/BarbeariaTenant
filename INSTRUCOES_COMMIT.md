# 📝 Instruções para Fazer Commit Antes do Multi-Tenant

## Opção 1: Executar Script PowerShell (Recomendado)

Execute no PowerShell:

```powershell
.\commit-before-multitenant.ps1
```

## Opção 2: Executar Manualmente

Copie e cole os comandos abaixo no terminal:

```bash
# 1. Adicionar todos os arquivos
git add -A

# 2. Remover arquivos do multi-tenant
git reset HEAD prisma/schema-super.prisma
git reset HEAD src/app/super-admin
git reset HEAD src/app/signup
git reset HEAD src/_lib/prisma-super.ts
git reset HEAD src/_lib/tenant-db.ts
git reset HEAD src/_lib/get-tenant-from-request.ts
git reset HEAD src/_lib/asaas.ts
git reset HEAD src/_lib/plan-limits.ts
git reset HEAD src/app/api/super-admin
git reset HEAD src/app/api/asaas
git reset HEAD scripts/create-tenant-database.js
git reset HEAD scripts/migrate-current-to-tenant.js
git reset HEAD scripts/check-expirations.js
git reset HEAD MULTI_TENANT_IMPLEMENTATION.md
git reset HEAD IMPLEMENTACAO_MULTI_TENANT.md
git reset HEAD RESUMO_FINAL_MULTI_TENANT.md
git reset HEAD SETUP_MULTI_TENANT.md
git reset HEAD SETUP_BANCO_SUPER.md
git reset HEAD README_MULTI_TENANT.md
git reset HEAD generated/prisma-super

# 3. Verificar status
git status

# 4. Fazer commit
git commit -m "feat: sistema completo antes da implementação multi-tenant

- Todas as funcionalidades de barbearia funcionando
- Remoção de duração e preço dos serviços (agora apenas nas opções)
- Sistema de agendamentos completo
- Painel administrativo completo
- Landing page implementada
- Sistema de temas e personalização
- Integração com Mercado Pago"
```

## ✅ O que será commitado

- Todas as mudanças do sistema de barbearia
- Remoção de duração/preço dos serviços
- Melhorias no admin
- Landing page
- Sistema de temas
- Todas as funcionalidades existentes

## ❌ O que NÃO será commitado (fica como não commitado)

- Arquivos do multi-tenant
- Schema do banco principal
- APIs do super admin
- Scripts de criação de tenant
